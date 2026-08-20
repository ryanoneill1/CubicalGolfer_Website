#!/usr/bin/env node
/**
 * validate-search-queries.ts — Sprint 46
 *
 * A search URL is a fallback, not a defect. Sending a reader to the WRONG
 * product's search results is a defect, and nothing caught it.
 *
 * 'vice-pro-soft' searched Amazon for "vice-pro-plus" — a different, pricier
 * ball — on /golf-ball-compression-chart/, the site's biggest page at 58,022
 * impressions. validate-search-urls counts how many search URLs exist; it never
 * asked whether each one searches for the right thing.
 *
 * THE RULE, kept deliberately loose to stay high-precision: the query must
 * share at least one meaningful word with the product key. That permits every
 * legitimate elaboration —
 *     titleist-t300  -> "titleist t300 irons"           (adds a category)
 *     superstroke-s-tech -> "SuperStroke S-Tech golf grip"
 * — while catching a query that names a DIFFERENT product, which is the only
 * failure that actually costs a sale.
 *
 * It will not catch a query for a plausible-but-wrong sibling that shares a
 * word (e.g. searching "Pro V1" for a "Pro V1x" key). That needs a human, and
 * pretending otherwise would give false confidence.
 *
 * ALLOWED lists the entries where the mismatch is intentional.
 */
import { AFFILIATE } from '../src/data/affiliate-links';

// Words too generic to count as a match.
const STOP = new Set(['golf','the','and','for','set','pack','one','dozen','balls','ball','2026','2025']);

// Intentional mismatches, each with a reason.
const ALLOWED: Record<string, string> = {
  'the-grint':   'Phone app, not an Amazon product. Dormant entry — used on no page.',
  '18birdies':   'Phone app, not an Amazon product. Dormant entry — used on no page.',
  'golfshot':    'Phone app, not an Amazon product. Dormant entry — used on no page.',
  'swing-ai':    'Phone app, not an Amazon product. Dormant entry — used on no page.',
};

const L: any = AFFILIATE;
const bad: string[] = [];
let checked = 0;

for (const key of Object.keys(L)) {
  const url = String(L[key].url ?? '');
  if (!/\/s\?/.test(url)) continue;           // product URLs are not our business
  const m = url.match(/[?&]k=([^&]*)/);
  if (!m) continue;
  checked++;
  if (key in ALLOWED) continue;

  const query = decodeURIComponent(m[1]).replace(/\+/g, ' ').toLowerCase();
  const qWords = new Set(query.split(/[\s-]+/).filter(w => w.length > 2 && !STOP.has(w)));
  const kWords = key.toLowerCase().split('-').filter(w => w.length > 2 && !STOP.has(w));

  // EVERY meaningful key word must appear, not merely one. The loose "shares a
  // word" version of this rule passed 'vice-pro-soft' searching for
  // "vice-pro-plus" — they share "vice" and "pro" — which is the exact bug this
  // file exists to catch. A guard that misses its own motivating case is worse
  // than none, because it advertises coverage it does not have.
  //
  // De-hyphenation handles brands the key splits but the query doesn't:
  // 'super-stroke-s-tech' vs "superstroke s-tech" is correct, not a defect.
  const joined = query.replace(/[\s-]/g, '');
  const missing = kWords.filter(w => !qWords.has(w) && !joined.includes(w));

  if (kWords.length && missing.length) {
    bad.push(`  ${key}\n      searches for "${decodeURIComponent(m[1]).replace(/\+/g, ' ')}" — missing: ${missing.join(', ')}`);
  }
}

console.log(`validate-search-queries: ${checked} search URLs — ${bad.length} searching for the wrong product (${Object.keys(ALLOWED).length} allowed)`);
if (bad.length) {
  console.error('\nFAIL: a buy button sends readers to a different product than the one it names.\n');
  bad.forEach(b => console.error(b));
  process.exit(1);
}

// Every search URL must still carry the affiliate tag — a link that earns
// nothing is the quietest failure of all.
const untagged = Object.keys(L).filter(k => {
  const u = String(L[k].url ?? '');
  return /amazon\.com/.test(u) && !u.includes('tag=cubicalgolfer-20');
});
if (untagged.length) {
  console.error(`\nFAIL: ${untagged.length} Amazon link(s) missing tag=cubicalgolfer-20:`);
  untagged.forEach(k => console.error(`  ${k}`));
  process.exit(1);
}
console.log(`validate-search-queries: all Amazon links carry tag=cubicalgolfer-20`);
