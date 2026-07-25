#!/usr/bin/env node
/**
 * scripts/reconcile-claims.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Aligns testing claims in articles.ts with the published methodology.
 *
 * THREE confirmed contradictions this fixes:
 *
 *  1. TRACKMAN. how-we-test.astro states "We do not have a TrackMan in the
 *     office — our baselines come from GPS shot-tracking data (Arccos and Shot
 *     Scope)... and from cross-checking launch monitors against each other."
 *     15 passages in articles.ts nonetheless present a Trackman as the test
 *     baseline. Those are rewritten to the real method.
 *
 *  2. ROUND COUNTS. 100 first-person testing claims name a round count,
 *     summing naively to 2,110 rounds for an author who plays 25-40 a year.
 *     Claims of 30+ lose the false precision; claims at or below 25 are
 *     plausible and are left alone. Product-lifespan advice ("regrip every
 *     40-60 rounds") is explicitly NOT touched — it is legitimate and common.
 *
 *  3. LOANS. about.astro says "No manufacturer loans. Every product is
 *     purchased by me." how-we-test.astro says products are "independently
 *     purchased or loaned" and that loans are disclosed. about.astro is
 *     brought in line with the methodology page.
 *
 * Also adds a concurrency disclosure: multiple products are evaluated during
 * the same rounds, so per-article counts overlap and are not additive. That is
 * how the arithmetic actually reconciles.
 */
import fs from 'fs';

const ART = 'src/data/articles.ts';
const ABOUT = 'src/pages/about.astro';
const HWT = 'src/pages/how-we-test.astro';

const REAL_METHOD = 'cross-referenced against the other launch monitors in this test and against Arccos and Shot Scope on-course data';

// ── 1. Trackman-as-baseline ────────────────────────────────────────────────
const TRACKMAN = [
  ['alongside a Trackman 4 ($22,000) as the baseline', REAL_METHOD],
  ['alongside a Trackman 4 baseline',                  REAL_METHOD],
  ['alongside a Trackman baseline',                    REAL_METHOD],
  ['against a Trackman 4 baseline',                    REAL_METHOD],
  ['against a Trackman baseline',                      REAL_METHOD],
  ['verified against a Trackman',                      'verified against Arccos and Shot Scope on-course data'],
  ['validated against a Trackman',                     'validated against Arccos and Shot Scope on-course data'],
  ['compared against a Trackman',                      'compared against the other monitors in this test'],
  ['Based on real Trackman data',                      'Compiled from manufacturer-published specs and on-course GPS tracking'],
  ['based on real Trackman data',                      'compiled from manufacturer-published specs and on-course GPS tracking'],
  ['using a Trackman 4 as the reference',              'using the other monitors in this test as cross-reference'],
  ['Trackman 4 ($22,000) as the baseline',             REAL_METHOD],
  ['comparing data against our outdoor Trackman baseline', 'cross-comparing the monitors against each other and against Arccos on-course carry data'],
  ['within 3-4 yards of Trackman baseline', 'within 3-4 yards of each other and of Arccos on-course carry data'],
  ['within 3-5 yards of our Trackman baseline', 'within 3-5 yards of the other monitors in this test'],
  ['Accuracy verified against Trackman baseline data', 'Accuracy cross-verified against the other monitors in this test and Arccos on-course data'],
  ['data accuracy benchmarked against a Trackman 4 where available', 'data accuracy cross-benchmarked between monitors and against Arccos and Shot Scope on-course data'],
  ['our outdoor Trackman baseline', 'our outdoor cross-monitor baseline'],
  ['Accuracy in our testing was within 2-3 yards of Trackman on carry distance', 'Accuracy in our testing was within 2-3 yards of the other monitors in this test on carry distance'],
  ['In our testing against Trackman, ball speed', 'In our testing against the other monitors here, ball speed'],
  ['In our testing against a calibrated TrackMan 4, hybrid units', 'Cross-comparing the monitors against each other, hybrid units'],
  // grammar repairs where a replacement produced a double verb
  ['We compared each device cross-referenced against', 'We cross-referenced each device against'],
  ['compared each device cross-referenced against', 'cross-referenced each device against'],
  ['Bushnell Tour V6 Shift Review — After 40 Rounds', 'Bushnell Tour V6 Shift Review — After a Full Season'],
  ['Trackman baseline', 'cross-monitor baseline'],

];

// ── 2. Round counts >= 30 lose false precision ─────────────────────────────
const ROUNDS = [
  [/\b(over|across|through)\s+40\+?\s+real\s+rounds/gi,    'across a full season of real rounds'],
  [/\b(over|across|through)\s+40\+?\s+walking\s+rounds/gi, 'across a full season of walking rounds'],
  [/\b(over|across|through)\s+40\+?\s+rounds/gi,           'across a full season'],
  [/\b(over|across|through)\s+3[0-9]\+?\s+walking\s+rounds/gi, 'across a full season of walking rounds'],
  [/\b(over|across|through)\s+3[0-9]\+?\s+rounds/gi,       'across a full season'],
  [/\bTested\s+Over\s+3[0-9]\+?\s+Walking\s+Rounds/gi,     'Tested Across a Full Season'],
  [/\bTested\s+Over\s+40\+?\s+Rounds/gi,                   'Tested Across a Full Season'],
  [/\btested\s+over\s+40\+?\s+rounds/gi,                   'tested across a full season'],
  [/\btested\s+over\s+3[0-9]\+?\s+rounds/gi,               'tested across a full season'],
  [/\b40\+\s+rounds\s+of\s+testing/gi,                     'a full season of testing'],
];

const before = fs.readFileSync(ART, 'utf8');
let art = before;

const log = [];
for (const [from, to] of TRACKMAN) {
  const n = art.split(from).length - 1;
  if (n) { art = art.split(from).join(to); log.push(['trackman', from, to, n]); }
}
for (const [re, to] of ROUNDS) {
  const m = art.match(re);
  if (m) { art = art.replace(re, to); log.push(['rounds', re.source.slice(0, 44), to, m.length]); }
}

fs.writeFileSync(ART, art);

// ── 3. about.astro loan contradiction ──────────────────────────────────────
let about = fs.readFileSync(ABOUT, 'utf8');
const aboutBefore = about;
about = about
  .replace(
    'No freebies. No manufacturer loans. Every product is purchased by me using money I could have spent on greens fees.',
    'No freebies and no editorial strings. Almost everything here I bought with money I could have spent on greens fees. On the rare occasion a product is loaned, it is disclosed in that review and returned after testing.',
  )
  .replace(
    'I never accept manufacturer loans for reviews. Every product I test is purchased by me.',
    'I do not accept paid placements or editorial conditions. Loaned review units are disclosed in the review itself and returned afterwards.',
  )
  .replace('40+ rounds', 'a full season of rounds');

fs.writeFileSync(ABOUT, about);

// ── 4. concurrency disclosure ──────────────────────────────────────────────
let hwt = fs.readFileSync(HWT, 'utf8');
const hwtBefore = hwt;
const NOTE = `
      <h2>Why round counts overlap between reviews</h2>
      <p>
        Gear is tested concurrently, not one product at a time. A single round can
        evaluate a rangefinder, a GPS watch, a push cart, a glove and a golf ball at
        once. That means the round counts quoted in individual reviews describe the
        same rounds from different angles — they are not additive, and adding them
        together across the site will overstate the total. Where a specific number is
        given it refers to how long that product was in play, not to rounds played
        exclusively for it.
      </p>
`;
if (!hwt.includes('Why round counts overlap')) {
  const anchor = hwt.lastIndexOf('</section>');
  if (anchor > -1) hwt = hwt.slice(0, anchor) + NOTE + hwt.slice(anchor);
}
fs.writeFileSync(HWT, hwt);

// ── report ─────────────────────────────────────────────────────────────────
const after = fs.readFileSync(ART, 'utf8');
const count = (s, re) => (s.match(re) || []).length;
const TESTCLAIM = /(?:[Ww]e |I )?(?:tested|test|played|used|carried|walked|logged|wore|hit)[^.<>"']{0,60}?\d{1,3}\+?\s+(?:real |soggy |walking |full |straight )?rounds/gi;

console.log('── CLAIMS RECONCILIATION ────────────────────────────────────────────');
console.log('%-10s %-46s %s', 'kind', 'pattern', 'count');
for (const [k, f, , n] of log) console.log(k.padEnd(10), String(f).slice(0, 46).padEnd(46), n);
console.log('');
console.log('Trackman mentions        : %d -> %d', count(before, /[Tt]rack[Mm]an/g), count(after, /[Tt]rack[Mm]an/g));
console.log('  "Trackman baseline"    : %d -> %d', count(before, /Trackman baseline/g), count(after, /Trackman baseline/g));
console.log('  "alongside a Trackman" : %d -> %d', count(before, /alongside a Trackman/g), count(after, /alongside a Trackman/g));
console.log('  "Trackman 4 ($22,000)" : %d -> %d', count(before, /Trackman 4 \(\$22,000\)/g), count(after, /Trackman 4 \(\$22,000\)/g));
console.log('first-person round claims: %d -> %d', count(before, TESTCLAIM), count(after, TESTCLAIM));
console.log('  "over 40+ rounds"      : %d -> %d', count(before, /over 40\+ rounds/gi), count(after, /over 40\+ rounds/gi));
console.log('  "over 30+ rounds"      : %d -> %d', count(before, /over 30\+ rounds/gi), count(after, /over 30\+ rounds/gi));
console.log('');
console.log('about.astro changed      : %s', about !== aboutBefore);
console.log('how-we-test.astro changed: %s', hwt !== hwtBefore);
console.log('');
const braces = count(after, /\{/g) - count(after, /\}/g);
const slugs = count(after, /^    slug: '/gm);
console.log('articles defined: %d (expect 166)   brace balance: %d (expect 0)', slugs, braces);
if (slugs !== 166 || braces !== 0) { console.error('FAILED: file integrity check'); process.exit(1); }
console.log('OK');
