#!/usr/bin/env node
/**
 * Guard: a product section's price field and its own prose must agree.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * validate-same-page-prices.ts catches a SECTION disagreeing with a TABLE ROW.
 * It cannot see a section disagreeing with itself — the price field says one
 * thing and the paragraph underneath it says another. Sprint 166 cleared 21
 * section-vs-row contradictions and this check, written to verify that work,
 * immediately found a larger pile of the same disease one level down:
 *
 *   /best-golf-gps-watches/   Garmin Approach S62   field $499  prose $249
 *   /best-golf-shoes/         FootJoy Tour Alpha    field $130  prose $200
 *   /best-beginner-golf-set-under-500/  Callaway Strata  field $481  prose $249
 *   /best-golf-alignment-sticks/  alignment sticks  field  $12  prose  $25
 *
 * Six of them were mine: I corrected the field in Sprint 166 and left the
 * paragraph. That is exactly the failure mode this guard exists to make
 * impossible, so it is ratcheted and starts at the measured backlog rather
 * than at zero.
 *
 * ── What counts as a contradiction ─────────────────────────────────────────
 * Only forms where the figure is unambiguously the product's OWN price:
 * "At $130", "for $130", "is a $130", "price: $130". A comparison is not a
 * contradiction — "twice the Flex XP", "$100 less than the Hoofer", "under
 * $300" all legitimately name a figure that is not this product's price, so
 * any match with comparative language in its immediate context is skipped.
 *
 * Per-period and multi-pack price fields ("~$12 each / 3 for $35", "~$25/dz")
 * are skipped entirely: the prose correctly quotes whichever unit it is
 * discussing, and comparing a unit price with a pack price is meaningless.
 *
 * Ceiling 36: the backlog measured on 10 October 2026. It only goes down.
 * Lower it as pages are reconciled; never raise it.
 */
import { ARTICLES } from '../src/data/articles';

const CEILING = 36;

const PERIOD = /\/\s*(yr|mo|month|year)|per\s+(year|month)|\/dz|\/dozen|\/grip|each|\bfor\s+\d/i;
const headPrice = (s: string) => {
  const m = s.match(/\$\s*([\d,]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

// Forms that state this product's own price.
const OWN = [
  /\bAt\s+\$([\d,]+)\b/g,
  /\bfor\s+\$([\d,]+)\b/g,
  /\bis\s+a\s+\$([\d,]+)\b/g,
  /\bprice:\s*\$([\d,]+)\b/g,
];

// Comparative language near the figure means it is about another product, a
// threshold or a saving — not this one's price.
const COMPARATIVE = /-\$|\bless\b|\bmore\b|\btwice\b|\bthan\b|\bunder\b|\bover\b|\bup to\b|\bhalf\b|\btimes\b|\bsavings?\b|\bfrom\b/i;

const problems: string[] = [];
let checked = 0;

for (const a of ARTICLES as any[]) {
  for (const s of a.sections ?? []) {
    if (!s.affiliateKey || !s.price) continue;
    const raw = String(s.price);
    if (PERIOD.test(raw)) continue;
    const field = headPrice(raw);
    if (field == null) continue;
    checked++;

    const body = String(s.body ?? '');
    const clashes = new Set<number>();
    for (const re of OWN) {
      for (const m of body.matchAll(re)) {
        const ctx = body.slice(Math.max(0, m.index! - 60), m.index! + m[0].length + 30);
        if (COMPARATIVE.test(ctx)) continue;
        const v = parseFloat(m[1].replace(/,/g, ''));
        if (v !== field) clashes.add(v);
      }
    }
    if (clashes.size) {
      problems.push(
        `   ${a.slug} [${s.affiliateKey}]\n      field ${raw}  vs  prose ${[...clashes].map(v => '$' + v).join(', ')}`
      );
    }
  }
}

if (problems.length > CEILING) {
  console.error(
    `\n❌ ${problems.length} product section(s) quote a price their own prose contradicts (ceiling ${CEILING}).`
  );
  console.error(
    `The price field and the paragraph beneath it are read together, in one glance.\n` +
    `Correcting one and leaving the other is how this backlog was built.\n`
  );
  problems.forEach(p => console.error(p));
  process.exit(1);
}

console.log(
  `✅ Section vs own prose: ${problems.length} price contradiction(s) across ${checked} ` +
  `priced section(s), within ceiling ${CEILING}.`
);
