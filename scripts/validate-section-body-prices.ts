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

const CEILING = 0;

const PERIOD = /\/\s*(yr|mo|month|year)|per\s+(year|month)|\/dz|\/dozen|\/grip|each|\bfor\s+\d/i;

// "from ~$772" is a starting price for a part-set or a configurable product.
// The prose correctly quotes the full-set figure ($1,199 on the Callaway Ai
// Smoke irons), so comparing the two is meaningless.
const FROM = /^\s*from\b/i;

// A difference of a dollar or two is cents, not a contradiction: "$139.98"
// against a "~$140" field is the same price written two ways.
const ROUNDING = 2;

// Figures that are real but are not this product's regular price.
const NOT_ITS_PRICE = /on sale|bought .{0,25}for|\bretail\b|secondary market|\bused\b|\bdozen\b[^.]{0,30}for|\$[\d,]+\+/i;
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

// Every distinctive word used in a registry key, as a lower-case token. Brand
// and category words are too common to identify a product, so they are out.
const GENERIC = new Set([
  'golf', 'the', 'and', 'pro', 'max', 'tour', 'plus', 'mini', 'set', 'sets',
  'ball', 'balls', 'club', 'clubs', 'bag', 'glove', 'hat', 'mat', 'green',
  'shoes', 'pants', 'shorts', 'towel', 'cart', 'driver', 'drivers', 'irons',
  'putter', 'putters', 'watch', 'speed', 'soft', 'lite', 'elite', 'sgi',
]);
const FOREIGN_TOKENS = [...new Set(
  (ARTICLES as any[])
    .flatMap(a => [...(a.sections ?? []), ...(a.comparisonTable?.rows ?? [])])
    .map((x: any) => x.affiliateKey)
    .filter(Boolean)
    .flatMap((k: string) => String(k).split('-'))
    .filter((t: string) => t.length >= 3 && !GENERIC.has(t))
)];

const problems: string[] = [];
let checked = 0;

for (const a of ARTICLES as any[]) {
  for (const s of a.sections ?? []) {
    if (!s.affiliateKey || !s.price) continue;
    const raw = String(s.price);
    if (PERIOD.test(raw)) continue;
    if (FROM.test(raw)) continue;
    const field = headPrice(raw);
    if (field == null) continue;
    checked++;

    // Tokens that belong to some OTHER product in the registry and not to this
    // one. "the Wilson Dynapower delivers comparable forgiveness for $599.98"
    // and "the Garmin S42 does 80% of this for $299" both price a different
    // product; flagging them made the check noisy on correct copy, and a
    // checker that cries wolf gets switched off.
    //
    // Matching on the full row name was not enough: the row says "Garmin
    // Approach S42" and the prose says "Garmin S42", so the names never met.
    // A single distinctive token the two products do not share is the signal.
    const mine = new Set(String(s.affiliateKey).split('-'));
    const foreign = FOREIGN_TOKENS.filter(t => !mine.has(t));

    const body = String(s.body ?? '');
    const clashes = new Set<number>();
    for (const re of OWN) {
      for (const m of body.matchAll(re)) {
        const ctx = body.slice(Math.max(0, m.index! - 80), m.index! + m[0].length + 30);
        if (COMPARATIVE.test(ctx)) continue;
        if (NOT_ITS_PRICE.test(ctx)) continue;
        // "... for $N" directly after another product's name is that product's price.
        if (/\bfor\s+\$/.test(m[0]) && foreign.some(t => ctx.toLowerCase().includes(t))) continue;
        const v = parseFloat(m[1].replace(/,/g, ''));
        if (Math.abs(v - field) > ROUNDING) clashes.add(v);
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
