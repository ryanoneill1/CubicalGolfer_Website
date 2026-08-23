#!/usr/bin/env node
/**
 * validate-registry-consistency.ts — Sprint 54
 *
 * Catches registry entries that contradict THEMSELVES. No external lookup is
 * needed: if an entry's own fields disagree, one of them is wrong whatever the
 * retailer says today.
 *
 * RULE 1 — imgAlt must name the product the KEY names.
 *   ping-g430-sft carried alt "Ping G440 SFT Driver" across 3 pages and 11,030
 *   impressions. G430 and G440 are different generations. Nothing caught it,
 *   because every other check inspects links and prices, never alt text.
 *
 * RULE 2 — a benefit must not assert a price its own price field contradicts.
 *   ping-g430-sft was priced $619 while claiming "under $300". That sentence is
 *   the Cobra DS-Adapt MAX-K's, which really is $299 — it had been copied onto
 *   a Ping costing more than twice as much.
 *
 * RULE 3 — the same check, for a benefit that OPENS with a bare price.
 *   Rule 2 only fires when a preposition precedes the figure (under/below/at/
 *   for/just $N). That pattern was written around the one example to hand, and
 *   it cannot see the commonest shape of all: "$999 — cheapest premium iron set
 *   in our test" on an entry priced $599. Four entries were drifting in exactly
 *   that form, undetected, including one carrying three different prices across
 *   the site. Units are compared only when they match, so "$8/grip" is measured
 *   against "~$12/grip" but never against "~$40/dz".
 *
 * PRECISION, measured rather than assumed:
 *
 *   a) Keys cannot carry punctuation, so "skytrak-plus" vs "SkyTrak+" and
 *      "lab-golf-df3" vs "L.A.B. Golf DF3" are spelling differences, not wrong
 *      products. Normalising +, . and foot/ft cut false positives from 9 to 2.
 *
 *   b) COMPARATIVE price language is not a self-claim. odyssey-dfx says
 *      "forgiveness usually reserved for $300+ putters" on a $129 putter — that
 *      is the selling point, not a contradiction. Comparatives are skipped.
 */
import { AFFILIATE } from '../src/data/affiliate-links';

const L: any = AFFILIATE;

const STOP = new Set(['golf','the','and','for','set','pack','one','dozen','balls','ball',
  'shoes','bag','irons','driver','putter','grip','mat','2026','2025','launch','monitor',
  'complete','piece','premium','white','used']);

/** Entries where the key is legitimately more specific than the caption, plus
 *  two genuinely unresolved cases that must NOT be guessed at. */
const ALT_ALLOWED: Record<string, string> = {
  // Wilson dropped the "Plus" suffix: the ball sold today is simply the Duo
  // Soft (verified on B0DQ9R1YQF, 2026-08-22). The alt names the product a
  // reader will actually see on Amazon; the key is a stale slug, and renaming
  // keys is a separate job. Truthful alt beats a matching slug.
  'wilson-duo-soft-plus': 'Wilson renamed Duo Soft Plus -> Duo Soft',
  'magnetic-ball-marker-desk': 'Key adds desk context the photo caption does not need.',
  'grip-trainer-steering-wheel': 'Key describes the shape; the alt uses the product name.',
  'taylormade-sim2-max': 'UNRESOLVED: key says sim2, alt says "SIM Max", links to /dp/B08QSKHMQG. Needs live verification before either side changes.',
  'callaway-chrome-tour': 'UNRESOLVED: unused stub with Chrome Soft alt and price but a Chrome Tour search. Redundant against callaway-chrome-soft and callaway-chrome-tour-2026.',
};

const norm = (s: string) => s.toLowerCase()
  .replace(/\+/g, 'plus').replace(/\./g, '')
  .replace(/(\d+)[\s-]?(foot|feet|ft)/g, '$1ft')
  .replace(/[\s-]/g, '');

const altBad: string[] = [];
const priceBad: string[] = [];
let altChecked = 0;

for (const key of Object.keys(L)) {
  const e = L[key];

  const alt = String(e.imgAlt ?? '');
  if (alt && !(key in ALT_ALLOWED)) {
    altChecked++;
    const a = norm(alt);
    const kw = key.toLowerCase().split('-').filter(w => w.length > 2 && !STOP.has(w));
    const missing = kw.filter(w => !a.includes(norm(w)));
    if (kw.length && missing.length) {
      altBad.push(`  ${key}\n      imgAlt "${alt}" does not name: ${missing.join(', ')}`);
    }
  }

  const pm = String(e.price ?? '').match(/\$\s*([0-9][0-9,]*)/);
  if (!pm) continue;
  const price = parseInt(pm[1].replace(/,/g, ''));
  for (const b of (e.benefits ?? [])) {
    const text = String(b);
    for (const m of text.matchAll(/\b(under|below|at|for|just)\s+\$\s*([0-9][0-9,]*)/gi)) {
      const before = text.slice(Math.max(0, m.index! - 34), m.index!).toLowerCase();
      if (/reserved|usually|than|versus|\bvs\b|compared|rival|competitor|other/.test(before)) continue;
      const claimed = parseInt(m[2].replace(/,/g, ''));
      const word = m[1].toLowerCase();
      const contradicts = (word === 'under' || word === 'below')
        ? price > claimed
        : Math.abs(price - claimed) / price > 0.12;
      if (contradicts) {
        priceBad.push(`  ${key}  (price ${e.price})\n      benefit claims "${m[0]}": "${text.slice(0, 70)}"`);
      }
    }

    // RULE 3 — benefit opens with a bare price, e.g. "$999 — cheapest ...".
    const lead = text.match(/^\s*\$\s*([0-9][0-9,]*(?:\.[0-9]{2})?)\s*(\/[a-z]+)?/i);
    if (lead) {
      const unitOf = (t: string) => (t.match(/\/(dz|dozen|mo|month|yr|year|grip|club|set|pair)/i)?.[1] ?? '').toLowerCase();
      const pUnit = unitOf(String(e.price ?? ''));
      const bUnit = (lead[2] ?? '').replace('/', '').toLowerCase();
      if (pUnit === bUnit) {
        const claimed = parseFloat(lead[1].replace(/,/g, ''));
        if (claimed > 0 && Math.abs(price - claimed) / price > 0.12) {
          priceBad.push(`  ${key}  (price ${e.price})\n      benefit opens "$${lead[1]}": "${text.slice(0, 70)}"`);
        }
      }
    }
  }
}

console.log(`validate-registry-consistency: ${altChecked} alts checked (${Object.keys(ALT_ALLOWED).length} allowed) — ` +
  `${altBad.length} naming the wrong product, ${priceBad.length} benefit/price self-contradictions`);

if (altBad.length || priceBad.length) {
  if (altBad.length) {
    console.error(`\nFAIL: ${altBad.length} imgAlt(s) name a different product than their key.`);
    altBad.forEach(b => console.error(b));
  }
  if (priceBad.length) {
    console.error(`\nFAIL: ${priceBad.length} benefit(s) assert a price the entry's own price contradicts.`);
    console.error('A benefit need not state a price. Remove the figure rather than guessing at it.\n');
    priceBad.forEach(b => console.error(b));
  }
  process.exit(1);
}

// ── priceNote must not name a rival brand ──────────────────────────────────
// Sprint 69. A malformed entry terminator (`      },` instead of `  },`) left in
// by an earlier bulk edit made every later boundary search overshoot, and the
// E-Z-GO's price note was written into the CLUB CAR entry — where it shipped,
// telling readers of a $10,099 Club Car to visit an E-Z-GO dealer. priceNote
// renders on the page under the price, so this is customer-facing copy, not
// internal bookkeeping.
//
// The check is deliberately narrow: it only fires when a note names a brand that
// appears nowhere in the entry's own key or imgAlt. Sub-brands are aliased so a
// Scotty Cameron note may name Titleist without crying wolf — a checker with a
// false positive rate gets switched off.
const BRAND_ALIAS: Record<string, string> = {
  'scotty cameron': 'titleist', 'odyssey': 'callaway', 'ezgo': 'e-z-go',
};
const BRANDS = ['E-Z-GO','Club Car','Odyssey','Scotty Cameron','TaylorMade','Callaway',
  'Bag Boy','MGI','KVV','Alphard','Oakley','Cleveland','Titleist','Ping','Cobra','Garmin',
  'Bushnell','Optoma','Wilson','FootJoy','Srixon','Mizuno','Clicgear','CaddyTek'];
const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
const noteBad: string[] = [];
for (const [key, v] of Object.entries(AFFILIATE) as [string, any][]) {
  const note = v.priceNote || ''; if (!note) continue;
  const own = flat(key + ' ' + (v.imgAlt || ''));
  const ownAliases = Object.entries(BRAND_ALIAS)
    .filter(([sub]) => own.includes(flat(sub))).map(([, parent]) => flat(parent));
  for (const b of BRANDS) {
    if (!note.includes(b)) continue;
    const fb = flat(b);
    if (own.includes(fb) || ownAliases.includes(fb)) continue;
    noteBad.push(`   ${key}: priceNote names "${b}" but the product is not — "${note.slice(0, 70)}..."`);
  }
}
if (noteBad.length) {
  console.error(`\nFAIL: ${noteBad.length} priceNote(s) name a brand the product is not.`);
  console.error('priceNote renders on the page. A note about another product is wrong copy, not a typo.\n');
  noteBad.forEach(b => console.error(b));
  process.exit(1);
}
console.log(`validate-registry-consistency: priceNotes name no rival brands.`);
