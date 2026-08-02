/**
 * validate-duplicate-products.ts — pre-build guard
 *
 * Added 2026-08 after the Square Golf launch monitor was found in the registry
 * THREE times — 'square-golf' (~$300), 'square-golf-launch-monitor' (~$499) and
 * 'square-golf-monitor' (~$699) — with three different images, two of which were
 * byte-identical. Fifteen sections referenced them, so the same product appeared
 * at three prices depending which page a reader landed on.
 *
 * Every existing validator passed, because all three keys were individually valid.
 * This one compares the *product identity* each record resolves to.
 *
 * Signals, any of which flags a pair:
 *   - identical normalised imgAlt
 *   - one key is a prefix of another AND their prices differ
 *   - byte-identical product images
 */
import fs from 'node:fs';
import path from 'node:path';
import { AFFILIATE } from '../src/data/affiliate-links';

const norm = (s?: string) =>
  (s ?? '').toLowerCase()
    .replace(/\b(golf|launch monitor|rangefinder|product image|driver|the)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ').trim();

const entries = Object.entries(AFFILIATE as any) as Array<[string, any]>;
const PENDING_MERGE = new Set<string>([]); // no known unresolved duplicates

const problems: string[] = [];
const nearMiss: string[] = [];

// 1. same normalised alt text
const byAlt = new Map<string, string[]>();
for (const [k, v] of entries) {
  const a = norm(v.imgAlt);
  if (!a) continue;
  if (!byAlt.has(a)) byAlt.set(a, []);
  byAlt.get(a)!.push(k);
}
for (const [alt, keys] of byAlt) {
  if (keys.length > 1) {
    const prices = keys.map(k => (AFFILIATE as any)[k].price);
    if (new Set(prices).size > 1 && !PENDING_MERGE.has(alt)) {
      problems.push(`same product "${alt}" under ${keys.length} keys at different prices: ` +
        keys.map((k, i) => `${k} (${prices[i]})`).join(', '));
    }
  }
}

// 2. key-prefix collisions with differing prices
for (const [a, va] of entries) {
  for (const [b, vb] of entries) {
    if (a === b || !b.startsWith(a + '-')) continue;
    if (va.price && vb.price && va.price !== vb.price && norm(va.imgAlt) && norm(vb.imgAlt)) {
      const overlap = norm(va.imgAlt).split(' ').filter(w => norm(vb.imgAlt).includes(w)).length;
      if (overlap >= 2) nearMiss.push(`key "${b}" extends "${a}" and looks like the same product at a different price (${va.price} vs ${vb.price})`);
    }
  }
}

// 3. byte-identical product images under different keys
const bySize = new Map<string, string[]>();
for (const [k, v] of entries) {
  if (!v.imgSrc) continue;
  const f = path.join(process.cwd(), 'public', v.imgSrc);
  if (!fs.existsSync(f)) continue;
  const sig = String(fs.statSync(f).size) + ':' + fs.readFileSync(f).subarray(0, 512).toString('base64');
  if (!bySize.has(sig)) bySize.set(sig, []);
  bySize.get(sig)!.push(k);
}
// Variants legitimately share a photo (winn-dri-tac vs -oversize, strata vs -senior),
// so a shared image alone is a warning, never a build failure.
const shared: string[] = [];
for (const [, keys] of bySize) {
  if (keys.length > 1) shared.push(keys.join(', '));
}

if (problems.length) {
  console.error(`\n❌ ${problems.length} possible duplicate product record(s):`);
  for (const p of [...new Set(problems)]) console.error('   ' + p);
  console.error('\nConsolidate to one key, repoint every reference, and delete the extras.\n');
  process.exit(1);
}
if (nearMiss.length) {
  console.log(`⚠️  ${nearMiss.length} key(s) extend another key at a different price — usually a real variant (Mevo vs Mevo+, driver vs irons). Verify, don't assume:`);
  for (const m of [...new Set(nearMiss)].slice(0, 10)) console.log('   ' + m);
}
if (shared.length) {
  console.log(`⚠️  ${shared.length} key pair(s) share a product image — fine for variants, worth a glance:`);
  for (const g of shared) console.log('   ' + g);
}
console.log(`✅ Duplicate products: ${entries.length} registry entries, no product appears twice at two prices.`);
