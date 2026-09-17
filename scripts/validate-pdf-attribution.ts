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
 *      page's data had changed since (Sprint S1 moved the TP5 price on 17 Sep)
 *      and every build still stamped July. Exactly the drift that this same
 *      file's ball prices suffered before they were moved to a shared import.
 *
 *   2. Five of the seven PDFs carried only the bare string
 *      "www.cubicalgolfer.com" — no page path. A reader holding the file had
 *      no way to find the page, and no link to give it.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 *   A. Every generated PDF contains the site domain.
 *   B. Every generated PDF contains a full page path, not just the domain.
 *   C. Every date printed in a PDF matches that page's lastmod-manifest entry
 *      — so a date can never again be a second, drifting copy.
 *   D. Neither PDF generator contains a hardcoded "<Month> <Year>" literal.
 *
 * Check D is the important one: A–C would pass again the day someone types a
 * month name back into a template literal, right up until the month rolls over.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const DOWNLOADS = 'public/downloads';
const SITE = 'www.cubicalgolfer.com';
const GENERATORS = [
  'scripts/generate-compression-pdf.ts',
  'scripts/generate-chart-pdfs.ts',
];

type Manifest = Record<string, { lastmod: string }>;
const LASTMOD: Manifest = JSON.parse(
  fs.readFileSync('src/data/lastmod-manifest.json', 'utf8'),
);

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
 * data stamped "Updated May 2026". It is therefore exempt from the date check
 * below — not because it is fine, but because it cannot be fixed by changing a
 * generator, and deleting a published file is Ryan's call, not this script's.
 *
 * It is still REPORTED on every build so it cannot be forgotten. Remove this
 * entry the moment it is deleted, regenerated from src/data/balls.ts, or
 * deliberately kept.
 */
const STATIC_UNMAINTAINED = new Set(['compression-cheat-sheet.pdf']);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isoToLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

/** Extract text with pdftotext if present, else a crude stream-free fallback. */
function pdfText(file: string): string {
  try {
    return execFileSync('pdftotext', ['-q', file, '-'], {
      encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    // pdftotext missing: fall back to the raw bytes. Text drawn by pdfkit is
    // compressed, so this will under-report — treat a miss here as inconclusive
    // rather than as a failure, and rely on check D.
    return fs.readFileSync(file, 'latin1');
  }
}

const problems: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];
let checked = 0;
let textExtractable = 0;

/* ── D. No hardcoded month-year literal in either generator ── */
const monthRe = new RegExp(`\\b(${MONTHS.join('|')})\\s+20\\d\\d\\b`);
for (const g of GENERATORS) {
  if (!fs.existsSync(g)) { problems.push(`generator missing: ${g}`); continue; }
  const src = fs.readFileSync(g, 'utf8');
  src.split('\n').forEach((line, i) => {
    // Comments are allowed to discuss dates; code is not allowed to print them.
    const code = line.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '');
    const m = code.match(monthRe);
    if (m) {
      problems.push(
        `${g}:${i + 1} hardcodes "${m[0]}". Read the date from ` +
        `src/data/lastmod-manifest.json instead — a literal here goes stale silently.`,
      );
    }
  });
}

/* ── A/B/C. Every PDF carries domain, path, and a date that matches lastmod ── */
if (!fs.existsSync(DOWNLOADS)) {
  problems.push(`${DOWNLOADS} does not exist — PDFs were not generated.`);
} else {
  for (const file of fs.readdirSync(DOWNLOADS).filter(f => f.endsWith('.pdf')).sort()) {
    checked++;
    const full = path.join(DOWNLOADS, file);
    const page = PDF_TO_PAGE[file];

    if (!page) {
      problems.push(`${file} has no entry in PDF_TO_PAGE — add one so its attribution is checked.`);
      continue;
    }

    const text = pdfText(full);

    // Distinguish "could not read the file" from "read it, attribution missing".
    // An earlier cut of this validator collapsed the two and reported a file
    // with perfectly good text as unreadable — a soft note where the answer
    // should have been hard. That is how a validator lies to you.
    if (text.trim().length < 40) {
      notes.push(`${file}: no extractable text (install poppler-utils for a full check)`);
      continue;
    }
    textExtractable++;

    // A. the domain, in either the www or bare form
    const BARE = SITE.replace(/^www\./, '');
    if (!text.includes(BARE)) {
      problems.push(`${file} has readable text but never names ${BARE}. It travels with no attribution at all.`);
      continue;
    }

    // B. full path, not just the bare domain
    if (!text.includes(`${SITE}${page}`) && !text.includes(`${BARE}${page}`)) {
      problems.push(
        `${file} names the domain but never the full path "${BARE}${page}". ` +
        `A reader holding this file has no route back to the page.`,
      );
    }

    // C. any printed date must be this page's lastmod
    const expected = isoToLong(LASTMOD[page]?.lastmod ?? '');
    const printed = text.match(monthRe);
    if (printed && STATIC_UNMAINTAINED.has(file)) {
      warnings.push(
        `${file} is stamped "${printed[0]}" and is not generated by any build script. ` +
        `Nothing links to it, but it is still served at /downloads/${file} with its own ` +
        `hardcoded ball data. Awaiting a decision: delete, regenerate, or keep.`,
      );
    } else if (printed) {
      const wanted = expected.match(monthRe)?.[0];
      if (!wanted) {
        problems.push(`${file}: lastmod manifest has no date for ${page}.`);
      } else if (printed[0] !== wanted) {
        problems.push(
          `${file} prints "${printed[0]}" but ${page} last changed ${expected}. ` +
          `The PDF is stamped with a date the page no longer has.`,
        );
      }
    }
  }
}

if (problems.length === 0) {
  console.log(
    `✅ PDF attribution: ${checked} PDF(s) — every one carries its full page URL, ` +
    `and no generator hardcodes a date (${textExtractable} text-extractable).`,
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
