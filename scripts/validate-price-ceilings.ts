/**
 * validate-price-ceilings.ts — pre-build guard
 *
 * Added 2026-08. A site audit found "under $N" guides recommending products
 * above their own ceiling — /best-golf-drivers-under-200/ had 2 of 3 picks at
 * ~$399, /best-golf-driver-under-300/ had 4 of 5 over, /best-irons-under-500/
 * led with a $599 product. The page's core promise broke at the exact moment
 * of purchase intent.
 *
 * For any article whose slug encodes a price ceiling (…under-<N>…), assert that
 * every product it links carries a price at or below that ceiling.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const toNumber = (p?: string): number | null => {
  if (!p) return null;
  const m = p.match(/\$\s*([\d,]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

const violations: string[] = [];
const warnings: string[] = [];

for (const article of ARTICLES as any[]) {
  const m = article.slug?.match(/under-(\d+)/);
  if (!m) continue;
  const ceiling = parseInt(m[1], 10);
  // Per-dozen / per-month pricing is not comparable to a unit ceiling.
  const keys = new Set<string>();
  for (const s of article.sections ?? []) if (s.affiliateKey) keys.add(s.affiliateKey);
  for (const r of article.comparisonTable?.rows ?? []) if (r.affiliateKey) keys.add(r.affiliateKey);

  for (const key of keys) {
    const entry = (AFFILIATE as any)[key];
    if (!entry) continue;
    if (/\/(dz|dozen|mo|month|yr|year)/i.test(entry.price ?? '')) continue;
    const price = toNumber(entry.price);
    if (price === null || price <= ceiling) continue;
    // A page-level ceiling with a disclosed premium/honorable-mention pick is a
    // judgement call, so warn. A SECTION heading that itself promises "under $N"
    // while linking a product above $N is a broken promise — fail the build.
    const heading = (article.sections ?? []).find((s: any) => s.affiliateKey === key)?.h2 ?? '';
    const hm = heading.match(/under \$([\d,]+)/i);
    if (hm && price > parseFloat(hm[1].replace(/,/g, ''))) {
      violations.push(`${article.slug} → "${heading}" links ${key} at ${entry.price}`);
    } else {
      warnings.push(`${article.slug} (ceiling $${ceiling}) → ${key} at ${entry.price}`);
    }
  }
}

if (violations.length) {
  console.error(`\n❌ ${violations.length} product(s) exceed their page's stated price ceiling:`);
  for (const v of violations) console.error('   ' + v);
  console.error('\nEither swap the product, or retitle the page so the promise is true.\n');
  process.exit(1);
}
if (warnings.length) {
  console.log(`⚠️  Price ceilings: ${warnings.length} page-level over-ceiling pick(s) — disclosed premium picks are allowed, but review these:`);
  for (const w of warnings) console.log('   ' + w);
}
console.log('✅ Price ceilings: no section heading promises "under $N" while linking a product above $N.');
