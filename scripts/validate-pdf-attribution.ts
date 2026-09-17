#!/usr/bin/env node
/**
 * validate-pdf-attribution.ts
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * The downloadable PDFs are the one asset on this site that travels without us.
 * `/downloads/golf-green-speed-chart.pdf` shows up in Google's AI-features
 * report on its own, separately from the page it came from, and
 * `golf ball compression chart 2026 pdf` is the best-converting query the site
 * has (29.4% CTR). A PDF that leaves home with no route back is a citation we
 * never collect.
 *
 * Two failures had actually happened by September 2026:
 *
 *   1. The compression PDF footer read "Updated July 2026" — hardcoded. The
 *      page's data had changed since and every build still stamped July. The
 *      same drift this file's ball prices suffered before Sprint 94 moved them
 *      to a shared import.
 *
 *   2. Five of seven PDFs carried only "www.cubicalgolfer.com" with no page
 *      path, so a reader holding the file had no way back and no link to give.
 *
 * ── Why it checks the GENERATORS, not the PDFs ─────────────────────────────
 * The first cut of this validator shelled out to `pdftotext` and, when that was
 * missing, fell back to reading the PDF's raw bytes. On Cloudflare's builder
 * poppler-utils is not installed, the fallback read compressed streams, found
 * no domain string in them, and failed the deploy on all seven files — every
 * one of which was in fact correct. It had been written and tested on a machine
 * where poppler had been installed by hand, so it passed locally and only broke
 * in production.
 *
 * The lesson is baked into the design now: THE HARD GATE IS SOURCE-LEVEL and
 * runs identically everywhere. Reading the PDFs is a bonus that only happens
 * when a real text extractor is present and demonstrably working — and it can
 * never fail the build on its own absence.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const DOWNLOADS = 'public/downloads';
const SITE = 'www.cubicalgolfer.com';

type Manifest = Record<string, { lastmod: string }>;
const LASTMOD: Manifest = JSON.parse(
  fs.readFileSync('src/data/lastmod-manifest.json', 'utf8'),
);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const monthRe = new RegExp(`\\b(${MONTHS.join('|')})\\s+20\\d\\d\\b`);

/**
 * Each generator, and the shape its footer must have. `mustReference` are
 * substrings that have to appear in the file: the manifest import proves the
 * date is derived rather than typed, and the path token proves the footer
 * carries a page path rather than a bare domain.
 */
const GENERATORS = [
  {
    file: 'scripts/generate-compression-pdf.ts',
    mustReference: [
      { token: 'lastmod-manifest.json', why: 'the Updated date must be read from the manifest, not typed' },
      { token: '${SITE_URL}${PAGE_PATH}', why: 'the footer must carry the full page path, not just the domain' },
    ],
  },
  {
    file: 'scripts/generate-chart-pdfs.ts',
    mustReference: [
      { token: 'lastmod-manifest.json', why: 'the Updated date must be read from the manifest, not typed' },
      { token: '${SITE}${spec.slug}', why: 'the footer must carry the full page path, not just the domain' },
    ],
  },
];

/** Which page each PDF belongs to. A PDF with no mapping is reported, not skipped. */
const PDF_TO_PAGE: Record<string, string> = {
  'golf-ball-compression-chart-2026.pdf': '/golf-ball-compression-chart/',
  'compression-cheat-sheet.pdf': '/golf-ball-compression-chart/',
  'golf-wind-adjustment-chart.pdf': '/golf-wind-adjustment-chart/',
  'golf-distance-temperature-chart.pdf': '/golf-distance-temperature-chart/',
  'golf-green-speed-chart.pdf': '/golf-green-speed-chart/',
  'golf-club-distance-chart.pdf': '/golf-club-distance-chart/',
  'golf-swing-speed-chart.pdf': '/golf-swing-speed-chart/',
};

/**
 * compression-cheat-sheet.pdf is a STATIC file: no script in this repo builds
 * it, nothing on the site links to it, and it carries its own hardcoded ball
 * data stamped "Updated May 2026". It is exempt from the date check — not
 * because it is fine, but because no generator change can fix it and deleting
 * a published file is Ryan's call, not this script's.
 *
 * It is still REPORTED on every build so it cannot be forgotten. Remove this
 * entry the moment it is deleted, regenerated from src/data/balls.ts, or
 * deliberately kept.
 */
const STATIC_UNMAINTAINED = new Set(['compression-cheat-sheet.pdf']);

const problems: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];

function isoToLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

/* ════════════════════════════════════════════════════════════════════════════
   PART 1 — SOURCE CHECKS. Mandatory. Identical on every machine.
   ════════════════════════════════════════════════════════════════════════════ */
for (const gen of GENERATORS) {
  if (!fs.existsSync(gen.file)) {
    problems.push(`generator missing: ${gen.file}`);
    continue;
  }
  const src = fs.readFileSync(gen.file, 'utf8');

  // (a) no hardcoded month-year anywhere in executable code
  src.split('\n').forEach((line, i) => {
    // Comments may discuss dates; code may not print them.
    const code = line.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '');
    const m = code.match(monthRe);
    if (m) {
      problems.push(
        `${gen.file}:${i + 1} hardcodes "${m[0]}". Read the date from ` +
        `src/data/lastmod-manifest.json instead — a literal here goes stale silently.`,
      );
    }
  });

  // (b) the footer is built from the manifest and includes a page path
  for (const { token, why } of gen.mustReference) {
    if (!src.includes(token)) {
      problems.push(`${gen.file} no longer contains \`${token}\` — ${why}.`);
    }
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   PART 2 — PDF TEXT CHECKS. Best-effort. Never fail on the extractor's absence.
   ════════════════════════════════════════════════════════════════════════════ */

/** Returns extracted text, or null when no working extractor is available. */
function extract(file: string): string | null {
  try {
    const out = execFileSync('pdftotext', ['-q', file, '-'], {
      encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'],
    });
    // A working extractor returns prose. Anything without a run of letters is
    // not text — treat it as "no extractor" rather than as a finding. Reading
    // raw PDF bytes is what broke the deploy; there is no byte fallback now.
    return /[A-Za-z]{4,}\s+[A-Za-z]{4,}/.test(out) ? out : null;
  } catch {
    return null;
  }
}

let pdfCount = 0;
let textChecked = 0;

if (!fs.existsSync(DOWNLOADS)) {
  problems.push(`${DOWNLOADS} does not exist — PDFs were not generated.`);
} else {
  const files = fs.readdirSync(DOWNLOADS).filter(f => f.endsWith('.pdf')).sort();

  // Probe once. If nothing on this machine can read a PDF, skip Part 2 wholesale.
  const probe = files.length ? extract(path.join(DOWNLOADS, files[0])) : null;
  const canExtract = probe !== null;
  if (!canExtract && files.length) {
    notes.push(
      'no PDF text extractor on this machine (install poppler-utils for the ' +
      'extra checks) — the source checks above are the gate and they all ran',
    );
  }

  for (const file of files) {
    pdfCount++;
    const page = PDF_TO_PAGE[file];
    if (!page) {
      problems.push(`${file} has no entry in PDF_TO_PAGE — add one so its attribution is checked.`);
      continue;
    }
    if (!canExtract) continue;

    const text = extract(path.join(DOWNLOADS, file));
    if (text === null) {
      notes.push(`${file}: no extractable text`);
      continue;
    }
    textChecked++;

    const BARE = SITE.replace(/^www\./, '');
    if (!text.includes(BARE)) {
      problems.push(`${file} has readable text but never names ${BARE}. It travels with no attribution at all.`);
      continue;
    }
    if (!text.includes(`${SITE}${page}`) && !text.includes(`${BARE}${page}`)) {
      problems.push(
        `${file} names the domain but never the full path "${BARE}${page}". ` +
        `A reader holding this file has no route back to the page.`,
      );
    }

    const printed = text.match(monthRe);
    if (printed && STATIC_UNMAINTAINED.has(file)) {
      warnings.push(
        `${file} is stamped "${printed[0]}" and is not generated by any build script. ` +
        `Nothing links to it, but it is still served at /downloads/${file} with its own ` +
        `hardcoded ball data. Awaiting a decision: delete, regenerate, or keep.`,
      );
    } else if (printed) {
      const wanted = isoToLong(LASTMOD[page]?.lastmod ?? '').match(monthRe)?.[0];
      if (!wanted) {
        problems.push(`${file}: lastmod manifest has no date for ${page}.`);
      } else if (printed[0] !== wanted) {
        problems.push(
          `${file} prints "${printed[0]}" but ${page} last changed ${isoToLong(LASTMOD[page].lastmod)}. ` +
          `The PDF is stamped with a date the page no longer has.`,
        );
      }
    }
  }
}

/* ── Report ── */
if (problems.length === 0) {
  console.log(
    `✅ PDF attribution: ${GENERATORS.length} generator(s) derive their date from the ` +
    `lastmod manifest and carry a full page path; ${pdfCount} PDF(s) present` +
    (textChecked ? `, ${textChecked} verified by text` : ''),
  );
  for (const w of warnings) console.log(`   ⚠️  ${w}`);
  for (const n of notes) console.log(`   note: ${n}`);
  process.exit(0);
}

console.error(`\n❌ PDF attribution: ${problems.length} problem(s).\n`);
for (const p of problems) console.error(`   ${p}`);
for (const w of warnings) console.error(`   ⚠️  ${w}`);
for (const n of notes) console.error(`   note: ${n}`);
console.error('');
process.exit(1);
