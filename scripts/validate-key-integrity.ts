/**
 * validate-key-integrity.ts — pre-build guard
 *
 * Added Aug 2026. Two failure modes that shipped to production because nothing
 * checked for them:
 *
 * 1. DANGLING KEYS. validate-affiliate-keys.ts only inspected `sections`. Keys
 *    referenced from comparisonTable rows, recommendedGear, or quickAnswerProduct
 *    were never validated, so a typo silently resolved to nothing — no price, no
 *    buy button, no `offers` in schema. Nine of these were live, including
 *    'garmin-r50' (registry key is 'garmin-approach-r50') and 'trackman-range'
 *    (TrackMan Range is software; only the hardware is sellable).
 *
 * 2. GENERATION MISMATCH. A heading naming one model generation while the link
 *    targets another. This class recurred three times — Bushnell V6/V7,
 *    TaylorMade SIM/SIM2, Ping G430/G440 — each time losing reader trust rather
 *    than just a click.
 */
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import { AFFILIATE } from '../src/data/affiliate-links';

const KEYS = new Set(Object.keys(AFFILIATE as any));
const dangling: string[] = [];
const genMismatch: string[] = [];

const note = (slug: string, where: string, key: string) => {
  if (key && !KEYS.has(key)) dangling.push(`${slug} · ${where} → '${key}'`);
};

for (const a of ARTICLES as any[]) {
  note(a.slug, 'quickAnswerProduct', a.quickAnswerProduct);
  for (const s of a.sections ?? []) {
    note(a.slug, `section "${(s.h2 ?? '').slice(0, 40)}"`, s.affiliateKey);
    for (const g of s.recommendedGear ?? []) note(a.slug, `recommendedGear "${g.role ?? ''}"`, g.key);
    for (const it of s.items ?? []) note(a.slug, 'section item', it.affiliateKey);
  }
  for (const r of a.comparisonTable?.rows ?? []) note(a.slug, `table row "${r.name ?? ''}"`, r.affiliateKey);

  // Generation check: a model number in the heading must not contradict the one
  // in the product it links to. Only fires when BOTH carry a model designator.
  const modelOf = (t: string) => (t.match(/\b([A-Z]{1,4}\d{1,4}[A-Z]*|\d{1,2}[A-Z]\d?)\b/g) ?? [])
    .filter(m => !/^\d{4}$/.test(m));
  for (const s of a.sections ?? []) {
    if (!s.affiliateKey || !KEYS.has(s.affiliateKey)) continue;
    const prod = (AFFILIATE as any)[s.affiliateKey];
    const target = `${prod.imgAlt ?? ''} ${s.affiliateKey.replace(/-/g, ' ')}`;
    const hm = modelOf(s.h2 ?? ''), tm = modelOf(target.toUpperCase());
    if (!hm.length || !tm.length) continue;
    const shared = hm.some(h => tm.some(t => t.toUpperCase() === h.toUpperCase()));
    if (!shared) genMismatch.push(`${a.slug} · "${(s.h2 ?? '').slice(0, 46)}" names ${hm.join('/')} but links ${s.affiliateKey}`);
  }
}
for (const c of COMPARISONS as any[]) {
  note('/compare/' + c.slug, 'productA', (c as any).productA);
  note('/compare/' + c.slug, 'productB', (c as any).productB);
}

if (dangling.length) {
  console.error(`\n❌ ${dangling.length} affiliate key reference(s) point at a product that does not exist:`);
  for (const d of dangling) console.error('   ' + d);
  console.error('\nA dangling key renders no price and no buy button, and drops `offers` from schema.\n');
  process.exit(1);
}
if (genMismatch.length) {
  console.log(`⚠️  ${genMismatch.length} possible generation mismatch(es) — verify each:`);
  for (const g of genMismatch.slice(0, 12)) console.log('   ' + g);
}
console.log(`✅ Key integrity: every affiliate key reference resolves (${KEYS.size} products).`);
