#!/usr/bin/env node
/**
 * validate-same-page-prices.ts — one product, one price, per page.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * The Wilson D9 carried FIVE different prices across the site: $399, $499,
 * $599, $699 and $999. Every existing price validator compares a row against
 * the registry, so a page whose own section and own table row disagree with
 * each other slips through — the registry might match one of them.
 *
 * A reader seeing "$230" in the write-up and "$265" in the table on the same
 * page has caught the site contradicting itself in a single screen. That is
 * never correct, which is what makes this check tight enough to gate a build.
 *
 * ── Why it is scoped to a single page ──────────────────────────────────────
 * A first attempt compared every mention of a product site-wide. It fired on
 * 18 products and most were right as written: an iron set legitimately shows
 * a shaft price on /shaft-flex-guide/, a fitting cost on the fitting guide,
 * and its own price on the irons page. Free-tier apps show $0 and a monthly
 * fee. Simulator packages show a build budget, not the launch monitor.
 * Flagging those would have made the check noise, and a checker that cries
 * wolf gets switched off.
 *
 * Same-page contradiction has no such excuse.
 */
import { ARTICLES } from '../src/data/articles';

// Forms that are not "the price of this product" and must not be compared.
const PERIOD    = /\/\s*(yr|mo|month|year)|per\s+(year|month)|\/dz|\/dozen|\/grip/i;
const FREE      = /free/i;
const RANGE     = /\$[\d,]+\s*[-–]\s*\$?[\d,]+/;   // "$3,500-4,500" — a build budget
const PLUS      = /\+\s*\$/;                        // "$2,995 + $199/yr"
const PACK      = /pack|each|\bfor\s+\d/i;          // "~$18 each, ~$32 for 2-pack"
const THRESHOLD = /[<>]\s*\$|under\s*\$|over\s*\$/i; // "<$130" is a claim, not a price

function priceOf(raw: unknown): number | null {
  const s = String(raw ?? '');
  if (!s) return null;
  if (PERIOD.test(s) || FREE.test(s) || RANGE.test(s) || PACK.test(s) || THRESHOLD.test(s)) return null;
  const head = PLUS.test(s) ? s.split(/\+\s*\$/)[0] : s;
  const m = head.match(/\$\s*([\d,]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
}

const THRESHOLD_COUNT = 27;   // ratchet: only ever goes down

const problems: string[] = [];
for (const a of ARTICLES as any[]) {
  const seen = new Map<string, Array<{ v: number; raw: string; where: string }>>();
  const add = (k: string, raw: unknown, where: string) => {
    const v = priceOf(raw); if (v == null) return;
    if (!seen.has(k)) seen.set(k, []);
    seen.get(k)!.push({ v, raw: String(raw), where });
  };
  for (const s of a.sections ?? []) if (s.affiliateKey) add(s.affiliateKey, s.price, 'section');
  for (const r of a.comparisonTable?.rows ?? []) if (r.affiliateKey) add(r.affiliateKey, r.price, 'table row');

  for (const [key, hits] of seen) {
    if (new Set(hits.map(h => h.v)).size < 2) continue;
    problems.push(`   ${a.slug} [${key}]\n      ` +
      hits.map(h => `${h.raw} (${h.where})`).join('  vs  '));
  }
}

if (problems.length > THRESHOLD_COUNT) {
  console.error(`\n❌ ${problems.length} page(s) show one product at two different prices (ceiling ${THRESHOLD_COUNT}).`);
  console.error(`A section and a table row on the same page must agree. Pick the verified price and use it in both.\n`);
  problems.forEach(p => console.error(p));
  process.exit(1);
}
console.log(`✅ Same-page prices: ${problems.length} self-contradiction(s) within ceiling ${THRESHOLD_COUNT}.`);
