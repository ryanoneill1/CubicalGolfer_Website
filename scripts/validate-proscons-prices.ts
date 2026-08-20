#!/usr/bin/env node
// validate-proscons-prices.ts — prices in pros/cons bullets vs the registry.
//
// WHY. Sprint 28 swapped the Optoma GT1090HDR for the GT2000HDR. I updated the
// registry price, the prose and the `pros` array — and missed `cons`, which
// went out saying "$1,099 — $300 more than BenQ" two paragraphs under a body
// saying $1,199 and $400. Pros/cons are a THIRD home for prices, after the
// `price` field and the prose, and nothing was guarding them.
//
// PRECISION FIRST. A naive "any price in the bullet that differs" check flags
// 43 bullets and about half are wrong:
//
//     "$5/dozen cheaper than Pro V1"          <- a difference, not a price
//     "~$1.17 per ball — best maths in golf"  <- per-unit, registry is /dozen
//     "$99/year subscription on top of the $249 hardware"  <- both correct
//     "$250+ — premium price for a stand bag" <- deliberately approximate
//
// A checker at 50% precision gets switched off, which is worse than no checker
// (Sprints 14, 17, 23 all learned this the hard way). So the rule here is
// narrow and grammatical:
//
//   A bullet asserts the product's price only when the price is the FIRST
//   thing in the bullet AND is not immediately qualified.
//
// "Immediately" is the load-bearing word. In "$1,199 — $400 more than the
// BenQ" the phrase "more than" attaches to $400, not to $1,199, so scanning
// the whole bullet for comparatives would wrongly excuse the very bug this
// exists to catch. We therefore inspect only the gap between the leading price
// and the next price or dash.

import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const THRESHOLD = 18; // set from the real backlog below

const money = (s: string) => Number(s.replace(/[$,]/g, ''));
const regPrice = (s: any) => {
  const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m ? money(m[1]) : 0;
};

/** Qualifiers that, immediately after the price, mean it is not the headline price. */
const QUALIFIER = /^\s*(?:\+|\/|per\b|each\b|a\s+(?:ball|month|year)\b|ea\b)|^\s*(?:-|–)?\s*(?:dozen|pack|pk|pair)\b|\b(?:cheaper|less|more|under|over|off|save[sd]?|savings?|discount|subscription|upgrade|extra|additional|refurb\w*|used|renewed|open box|street|msrp|was)\b/i;

type Hit = { slug: string; key: string; field: string; said: number; reg: number; text: string };
const hits: Hit[] = [];

function check(obj: any, slug: string, key: string | undefined) {
  const k = key ?? obj?.affiliateKey;
  if (!k) return;
  const reg = regPrice((AFFILIATE as any)[k]?.price);
  if (!reg) return;

  for (const field of ['pros', 'cons'] as const) {
    for (const raw of (obj?.[field] ?? [])) {
      const b = String(raw);
      // The price must LEAD the bullet.
      const m = b.match(/^\s*~?\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
      if (!m) continue;
      const said = money(m[1]);
      if (!said) continue;

      // Look only at the gap before the next price or dash — a comparative
      // after an em dash belongs to the NEXT figure, not this one.
      const rest = b.slice(m[0].length);
      const gap = rest.split(/\$|—|–\s|\s-\s/)[0].slice(0, 26);
      if (QUALIFIER.test(gap)) continue;
      // A range ("$5,000-6,500 total investment") is a build estimate, not a
      // product price. No spaces around the dash, so the split above misses it.
      if (/^\s*[-–—]\s*\$?\s*[0-9]/.test(rest)) continue;
      // "$500 for two" prices a QUANTITY, not the product. Deliberately narrow:
      // "$400 for 12 clubs + bag" describes what is in the box and still claims
      // the product's price, so it stays in scope.
      if (/^\s*for\s+(two|three|both|a\s+pair|the\s+pair)\b/i.test(rest)) continue;

      // Registry prices quoted per dozen only compare to per-dozen bullets.
      const regIsDozen = /\/\s*(dozen|dz)/i.test(String((AFFILIATE as any)[k]?.price));
      if (regIsDozen && !/\/\s*(dozen|dz)/i.test(b)) continue;

      // Within 3% is rounding, not a conflict.
      if (Math.abs(said - reg) / reg < 0.03) continue;

      hits.push({ slug, key: k, field, said, reg, text: b.slice(0, 78) });
    }
  }
}

for (const a of [...(ARTICLES as any), ...(COMPARISONS as any)]) {
  const slug = String(a.slug);
  check(a, slug, a.quickAnswerProduct);
  for (const s of (a.sections ?? [])) check(s, slug, s.affiliateKey);
  for (const r of (a.comparisonTable?.rows ?? [])) check(r, slug, r.affiliateKey);
  for (const p of (a.products ?? [])) check(p, slug, p.key ?? p.affiliateKey);
}

if (hits.length > THRESHOLD) {
  console.error(`\n❌ ${hits.length} pros/cons bullet(s) lead with a price that contradicts the registry (ceiling ${THRESHOLD}):\n`);
  for (const h of hits) {
    console.error(`   ${h.slug}  [${h.key}] ${h.field}`);
    console.error(`      says $${h.said.toLocaleString()}, registry $${h.reg.toLocaleString()}  —  "${h.text}"`);
  }
  console.error(`\nThe bullet sits beside a buy button showing the registry price. Fix whichever is wrong.`);
  process.exit(1);
}

console.log(`✅ Pros/cons prices: ${hits.length} conflict(s) within ceiling ${THRESHOLD}.`);
if (hits.length) for (const h of hits) console.log(`   ${h.slug} [${h.key}] $${h.said} vs $${h.reg}`);
