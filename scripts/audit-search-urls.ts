#!/usr/bin/env node
// audit-search-urls.ts — which Amazon search links are worth converting?
//
// A /s?k= link drops the buyer on a results page and makes them pick. A /dp/
// link drops them on the product with a Buy button. The second converts better,
// so the instinct is to convert all of them.
//
// That instinct is wrong for about a third of the registry, and finding out why
// cost most of a sprint. Two traps:
//
//   VARIANT-BOUND PRODUCTS. The test is NOT the product type — it is whether
//   Amazon has a PARENT listing that carries the variants behind a selector.
//
//     Shoes, gloves and apparel usually DO. Landing on the FootJoy WeatherSof
//     parent shows size and hand pickers, so converting is a clear win.
//
//     Wedges usually do NOT. Each loft is its own listing, so there is no ASIN
//     for "Cleveland RTX 6 52 degree" that is also right for a 58. Pointing a
//     52-degree recommendation at the 58-degree ASIN is WORSE than a search —
//     the reader lands on the wrong club.
//
//   So this bucket means "check for a parent listing first", not "never touch".
//
//   Sprint 34 widened it again. Putters, drivers, hybrids and grips are also
//   fitting choices — hand, loft, shaft, length, standard-vs-midsize — and the
//   "Odyssey White Hot OG" is a LINE (One, Double Wide, #5 SB, #7 ...), not a
//   product. My first pass called all of those convertible, which overstated
//   the queue. Better to have an honest smaller number than a list that wastes
//   a verification pass.
//
//   SUPERSEDED PRODUCTS. Blue Tees "Series 3 Max" now returns only a
//   REFURBISHED listing; the live product is the "Series 3 Max+", with
//   different magnification. Converting the URL would quietly swap the product
//   under copy describing the old one — the same defect class as the
//   discontinued projectors. Those need a product decision, not a link fix.
//
// So this ranks by real revenue exposure and separates the cases, turning
// "183 search URLs" into a queue someone can actually work through.

import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

/** Sold per loft / size / hand. Convert ONLY if a parent listing exists —
 *  see the header. Shoes and gloves usually have one; wedges usually do not. */
const VARIANT_BOUND = /(-\d{2}$|wedge|glove|shoe|spikeless|boot|sandal|polo|shirt|trouser|pant|short|jacket|rain|belt|hat|cap|shaft|flex|-irons$|-lh$|-rh$|putter|driver|hybrid|-wood$|grip|blade|mallet|-og$)/i;

const money = (s: any) => { const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*)/); return m ? Number(m[1].replace(/,/g, '')) : 0; };
const isSearch = (u: string) => /\/s\?/.test(u);

const pages = new Map<string, Set<string>>();
const ctas = new Map<string, number>();
const note = (k: any, slug: string) => { if (!k) return; if (!pages.has(k)) pages.set(k, new Set()); pages.get(k)!.add(slug); };

for (const a of [...(ARTICLES as any), ...(COMPARISONS as any)]) {
  const slug = String(a.slug);
  if (a.quickAnswerProduct) { ctas.set(a.quickAnswerProduct, (ctas.get(a.quickAnswerProduct) ?? 0) + 1); note(a.quickAnswerProduct, slug); }
  for (const s of (a.sections ?? [])) note(s.affiliateKey, slug);
  for (const r of (a.comparisonTable?.rows ?? [])) note(r.affiliateKey, slug);
  for (const p of (a.products ?? [])) note(p.key ?? p.affiliateKey, slug);
}

type Row = { key: string; np: number; cta: number; price: number; score: number };
const convertible: Row[] = [], variant: Row[] = [], orphan: string[] = [];

for (const [key, v] of Object.entries(AFFILIATE as any)) {
  if (!isSearch(String((v as any).url))) continue;
  const np = pages.get(key)?.size ?? 0;
  if (np === 0) { orphan.push(key); continue; }
  const cta = ctas.get(key) ?? 0, price = money((v as any).price);
  const row = { key, np, cta, price, score: np * (1 + cta * 3) * Math.log10(price + 10) };
  (VARIANT_BOUND.test(key) ? variant : convertible).push(row);
}
const bySc = (a: Row, b: Row) => b.score - a.score;
convertible.sort(bySc); variant.sort(bySc);

const show = (label: string, rows: Row[], n: number) => {
  console.log(`\n${label} — ${rows.length}`);
  console.log('  key                                pages  CTA   price');
  for (const r of rows.slice(0, n))
    console.log('  ' + r.key.padEnd(34) + String(r.np).padStart(5) + String(r.cta).padStart(5) + ('  $' + r.price.toLocaleString()).padStart(9));
  if (rows.length > n) console.log(`  ... and ${rows.length - n} more`);
};

const total = convertible.length + variant.length + orphan.length;
console.log(`Amazon search URLs still in the registry: ${total}`);
console.log(`  worth converting          ${convertible.length}`);
console.log(`  variant-bound (check first) ${variant.length}`);
console.log(`  unreferenced (dead)       ${orphan.length}`);

show('WORTH CONVERTING, by revenue exposure', convertible, 20);
show('VARIANT-BOUND - convert only if a parent listing carries the variants', variant, 8);
if (orphan.length) {
  console.log(`\nUNREFERENCED - in the registry but on no page - ${orphan.length}`);
  console.log('  ' + orphan.slice(0, 12).join(', ') + (orphan.length > 12 ? ' ...' : ''));
}
const top = convertible.slice(0, 20);
console.log(`\nConverting the top 20 covers ${top.reduce((s,r)=>s+r.np,0)} page placements and ${top.reduce((s,r)=>s+r.cta,0)} Quick Answer CTAs.`);
