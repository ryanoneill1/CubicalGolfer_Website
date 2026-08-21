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
