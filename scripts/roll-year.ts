/**
 * roll-year.ts — the annual year roll, as one reviewable command.
 *
 * WHY THIS EXISTS
 * ---------------
 * 13.6% of site clicks (796 of 5,840 over 90 days to 2026-09-05) come from queries
 * that contain the year. Those queries convert at 5.8% CTR against a 1.5% site
 * average, so they are disproportionately valuable.
 *
 * The evidence that the roll matters is the PREVIOUS year. This site has never had a
 * "2025" title, and for the 159 queries containing 2025 it sits at average position
 * 37 and earned exactly 1 click in 90 days. Having the year in the title is worth
 * roughly 25 positions on a dated query. Miss the roll and that 13.6% does not decay
 * gracefully — it goes to whoever did roll.
 *
 * There are 192 title/description strings and ~120 prose strings holding the year, and
 * no YEAR constant anywhere in the codebase. Doing that by hand in January, under time
 * pressure, on exactly the strings Google ranks, is how sites break themselves.
 *
 * WHAT IT WILL NOT DO
 * -------------------
 * It will not touch a year that belongs to a PRODUCT. "Callaway Chrome Tour 2026" does
 * not become "Chrome Tour 2027" because the calendar moved, and "Titleist Pro V1 (2025
 * model)" is a fact about which model was tested. Those go to REVIEW and are left
 * alone. ISO dates (datePublished, dateModified, verifiedOn) are skipped outright.
 *
 * WHEN TO RUN IT
 * --------------
 * Not before December. As of 2026-09-05 the site had 3 total impressions on "2027"
 * queries, so rolling early trades live 2026 demand for demand that does not exist yet.
 * Re-check `query=~2027` in Search Console and roll when it starts moving.
 *
 * USAGE
 *   npx tsx scripts/roll-year.ts                   # dry run, prints the report
 *   npx tsx scripts/roll-year.ts --apply           # writes the SAFE bucket only
 *   npx tsx scripts/roll-year.ts --from 2026 --to 2027 --apply
 *
 * After --apply: `npm run validate && npm run build`, then read the diff. The REVIEW
 * bucket is deliberately your job.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

function argOf(flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const FROM = Number(argOf('--from') ?? 2026);
const TO = Number(argOf('--to') ?? FROM + 1);

/** Files that can carry a site-year in reader-facing copy. */
const TARGETS = ['src/data/articles.ts', ...globSync('src/pages/**/*.astro')];

/**
 * Two classes of field, and the distinction is the whole point of this tool.
 *
 * ROLL_FIELDS are navigational: a title, a nav label, a meta description. The year in
 * them is a publication label, so bumping it is mechanical and safe.
 *
 * PROSE_FIELDS make CLAIMS. "the one most weekend golfers should buy in 2026" becomes a
 * statement about 2027 hardware that nobody has tested; "the viral rangefinder of
 * 2025-2026" becomes "2025-2027", which is not a thing. These are never rolled
 * automatically — they are listed so a human can decide whether the claim still holds.
 */
const ROLL_FIELDS = ['title', 'titleDisplay', 'description', 'label', 'guideLabel', 'h2', 'h3', 'heading'];
const PROSE_FIELDS = ['body', 'a', 'q', 'bottomLine'];
const FIELD = String.raw`(${[...ROLL_FIELDS, ...PROSE_FIELDS].join('|')})`;

/** A year inside an ISO date is a fact, not a label. Never roll it. */
const ISO_NEAR = /\d{4}-\d{2}-\d{2}/;

/**
 * Brands whose product names embed a model year. A model year FOLLOWS its brand
 * ("Chrome Tour 2026", "Pro V1 (2025 model)"), so only the text BEFORE the year is
 * evidence. Checking after the year would misfire on "Best golf irons for 2026 —
 * Ping G430 ...", where the site year legitimately precedes a brand list.
 */
const BRANDS = [
  'Callaway', 'Titleist', 'TaylorMade', 'Srixon', 'Bridgestone', 'Ping', 'PING',
  'Cobra', 'Cleveland', 'Mizuno', 'Wilson', 'Garmin', 'Bushnell', 'Rapsodo',
  'SkyTrak', 'FlightScope', 'Foresight', 'TrackMan', 'Shot Scope', 'Arccos',
  'Odyssey', 'Scotty Cameron', 'L\\.A\\.B\\.', 'Maxfli', 'Vice', 'Kirkland',
  'Pinnacle', 'Precision Pro', 'Blue Tees', 'Voice Caddie', 'Swing Caddie',
  'Ernest Sports', 'Optoma', 'BenQ', 'Spornia', 'GoSports', 'Fiberbuilt',
  'Net Return', 'MGI', 'Sun Mountain', 'Oakley', 'FootJoy', 'Ecco', 'Skechers',
  'Chrome Tour', 'Chrome Soft', 'Pro V1', 'Qi35', 'Stealth', 'Paradym', 'Supersoft',
];
const BRAND_RE = new RegExp(`(${BRANDS.join('|')})`, 'i');

/** Words that mark a MODEL year rather than a publication year. */
const MODEL_WORDS = /\b(model|release[ds]?|generation|gen|version|lineup|launch(?:ed|es)?)\b/i;

/**
 * STRONG: the year sits in a slot that can only be a publication label — directly after
 * "in/for/of", or at the end of a title, or followed by the punctuation that separates a
 * title from its subtitle. These beat the brand check, because "Bushnell vs Garmin
 * rangefinder compared in 2026" is a site year no matter which brands precede it.
 */
const STRONG_PATTERNS: RegExp[] = [
  /\b(?:in|for|of|through|update[ds]? for)\s+YEAR\b/i,
  /\bYEAR\s*$/,                       // "Best Golf GPS Watches 2026"
  /\bYEAR\s*[—–:,|)]/,                // "2026 — 8 Picks" · "2026)" · "2026, tested"
  /\(\s*YEAR\b/,                      // "(2026 Picks)"
];

/** WEAK: plausible but worth the brand check first. */
const WEAK_PATTERNS: RegExp[] = [
  /\bBest\b[^.]{0,60}\bYEAR\b/i,
  /\bYEAR\s+(?:Guide|Data|Update|Edition|Picks|Rankings?|Review)\b/i,
  /\b(?:updated|revised|current)\s+(?:for\s+)?YEAR\b/i,
];

/** A year range ("2025-2026", "2025/2026") is a span, not a label. Never roll it. */
const RANGE_BEFORE = /\d{4}\s*[-–\/]\s*$/;
const RANGE_AFTER = /^\s*[-–\/]\s*\d{4}/;

function build(p: RegExp): RegExp {
  return new RegExp(p.source.replace(/YEAR/g, String(FROM)), p.flags);
}

type Hit = {
  file: string; field: string; snippet: string;
  bucket: 'SAFE' | 'REVIEW'; reason: string;
};

function classify(value: string, at: number, field: string): { bucket: 'SAFE' | 'REVIEW'; reason: string } {
  if (PROSE_FIELDS.includes(field)) {
    return { bucket: 'REVIEW', reason: `prose (${field}) — the claim may not hold in ${TO}` };
  }

  const before = value.slice(Math.max(0, at - 45), at);
  const after = value.slice(at + 4, at + 25);
  const window = before + String(FROM) + after;

  if (RANGE_BEFORE.test(before) || RANGE_AFTER.test(after)) {
    return { bucket: 'REVIEW', reason: 'part of a year range' };
  }

  for (const p of STRONG_PATTERNS) {
    if (build(p).test(window)) return { bucket: 'SAFE', reason: p.source.replace(/YEAR/g, 'YYYY') };
  }

  const brand = before.match(BRAND_RE);
  if (brand) return { bucket: 'REVIEW', reason: `"${brand[1]}" precedes it — reads as a model year` };

  const modelWord = window.match(MODEL_WORDS);
  if (modelWord) return { bucket: 'REVIEW', reason: `"${modelWord[1]}" nearby — reads as a model year` };

  for (const p of WEAK_PATTERNS) {
    if (build(p).test(window)) return { bucket: 'SAFE', reason: p.source.replace(/YEAR/g, 'YYYY') };
  }
  return { bucket: 'REVIEW', reason: 'no recognised site-year phrasing' };
}

const hits: Hit[] = [];
const rewritten = new Map<string, string>();
const yearRe = new RegExp(`\\b${FROM}\\b`, 'g');

for (const file of TARGETS) {
  let src: string;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }

  const fieldRe = new RegExp(`${FIELD}:\\s*(['"\`])((?:\\\\.|(?!\\2)[^\\\\])*)\\2`, 'g');
  const edits: Array<{ start: number; end: number; text: string }> = [];

  for (const m of src.matchAll(fieldRe)) {
    const field = m[1], value = m[3];
    if (!value.includes(String(FROM))) continue;

    let changed = false;
    const next = value.replace(yearRe, (mm, off: number) => {
      const ctx = value.slice(Math.max(0, off - 12), off + 12);
      if (ISO_NEAR.test(ctx)) return mm;                        // a real date — leave it

      const { bucket, reason } = classify(value, off, field);
      hits.push({
        file, field,
        snippet: value.length > 92 ? value.slice(0, 92) + '…' : value,
        bucket, reason,
      });
      if (bucket === 'SAFE') { changed = true; return String(TO); }
      return mm;
    });

    if (changed) {
      // Offset-based edit, applied end-first: a global string replace would hit every
      // identical title on the page, which is the defect class this repo keeps finding.
      const vStart = m.index! + m[0].lastIndexOf(value);
      edits.push({ start: vStart, end: vStart + value.length, text: next });
    }
  }

  if (edits.length) {
    let out = src;
    for (const e of edits.sort((a, b) => b.start - a.start)) {
      out = out.slice(0, e.start) + e.text + out.slice(e.end);
    }
    rewritten.set(file, out);
  }
}

const safe = hits.filter(h => h.bucket === 'SAFE');
const review = hits.filter(h => h.bucket === 'REVIEW');

console.log(`\nYear roll  ${FROM} → ${TO}${APPLY ? '   *** APPLYING ***' : '   (dry run)'}`);
console.log('─'.repeat(76));
console.log(`  SAFE    ${String(safe.length).padStart(4)}   rolled automatically`);
console.log(`  REVIEW  ${String(review.length).padStart(4)}   left alone — your call`);
console.log(`  files   ${String(rewritten.size).padStart(4)}\n`);

const byFile = new Map<string, number>();
for (const h of safe) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);
if (byFile.size) {
  console.log('SAFE by file');
  for (const [f, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${String(n).padStart(4)}  ${f}`);
  }
}

console.log('\nREVIEW — a sample; these keep their year unless you say otherwise');
const seen = new Set<string>();
for (const h of review) {
  const k = h.snippet.slice(0, 55);
  if (seen.has(k)) continue;
  seen.add(k);
  if (seen.size > 20) { console.log(`   … ${review.length - 20} more`); break; }
  console.log(`   [${h.field}] ${h.snippet}`);
  console.log(`        ↳ ${h.reason}`);
}

if (APPLY) {
  for (const [f, content] of rewritten) writeFileSync(f, content, 'utf8');
  console.log(`\n✅ Wrote ${rewritten.size} file(s). Now:  npm run validate && npm run build`);
  console.log('   Then read the diff. Nothing in REVIEW was touched.');
} else {
  console.log('\nDry run. Re-run with --apply to write the SAFE bucket.');
}
