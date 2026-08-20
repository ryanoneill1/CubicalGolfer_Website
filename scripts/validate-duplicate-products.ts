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
const PENDING_MERGE = new Set<string>([]); // no known unresolved NAME duplicates

// Image+price pairs awaiting an owner decision. Remove each line once resolved.
// TODO(ryan): cleveland-launcher-xl (~$199, driver) vs cleveland-launcher-xl-senior
//   (~$799, complete set) — genuinely different products sharing one photo.
//   Needs its own image, or the senior set needs a different one.
const PENDING_IMAGE_PAIR = new Set<string>([
  'cleveland-launcher-xl|cleveland-launcher-xl-senior',
]);

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
// so a shared image alone is only a warning. BUT a shared image with a large price
// gap is a different animal: that is one product entered twice, not two variants.
// This is what let flightscope-mevo (~$549) and flightscope-mevo-gen2 (~$1,299)
// ship pointing at the same photo — caught by an external audit, not by this check.
const shared: string[] = [];
const num = (p?: string) => { const m = p?.match(/\$\s*([\d,]+)/); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
for (const [, keys] of bySize) {
  if (keys.length < 2) continue;
  const prices = keys.map(k => num((AFFILIATE as any)[k].price)).filter((v): v is number => v !== null);
  const lo = Math.min(...prices), hi = Math.max(...prices);
  const sig = [...keys].sort().join('|');
  if (prices.length > 1 && lo > 0 && hi / lo >= 2 && !PENDING_IMAGE_PAIR.has(sig)) {
    problems.push(`same image shared by ${keys.join(', ')} with a ${(hi / lo).toFixed(1)}x price gap ($${lo} vs $${hi}) — one product entered twice?`);
  } else {
    shared.push(keys.join(', '));
  }
}

// MODEL-CODE COLLISION. 'voice-caddie-sc4-pro' ($599, search URL) and
// 'swing-caddie-sc4-pro' ($499, real PDP) were the same launch monitor under two
// keys. Neither the name check nor the shared-image check caught it: the imgAlt
// strings differ ("Voice Caddie SC4 Pro" vs "Voice Caddie Swing Caddie SC4 PRO")
// and each had its own photo. What they share is the model code. So: if two keys
// carry the same alphanumeric model token AND the same brand, they are the same
// product until proven otherwise, and two different prices is a contradiction.
const MODEL = /\b([A-Z]{1,4}\d{1,3}[A-Z+]{0,4}|\d{2,3}[A-Z]{1,3})\b/;
const modelDupes: string[] = [];
const byModel = new Map<string, string[]>();
for (const [key, v] of entries as [string, any][]) {
  const alt: string = v.imgAlt || '';
  const m = alt.toUpperCase().match(MODEL);
  if (!m) continue;
  const brand = alt.trim().split(/\s+/)[0].toLowerCase();
  const sig = `${brand}|${m[1]}`;
  if (!byModel.has(sig)) byModel.set(sig, []);
  byModel.get(sig)!.push(key);
}
for (const [sig, keys] of byModel) {
  if (keys.length < 2) continue;
  const priced = keys.map(k => [k, num((AFFILIATE as any)[k].price)] as const)
                     .filter((x): x is readonly [string, number] => x[1] !== null);
  const vals = new Set(priced.map(x => x[1]));
  if (vals.size > 1) {
    // WARNING, not a failure. A driver, an irons set and a hybrid legitimately share
    // brand and model code (Ping G430), so this cannot distinguish a real variant from
    // a real duplicate on its own. It is a short list for a human to glance at — which
    // is how the SC4 PRO and Launcher XL2 duplicates were actually spotted.
    modelDupes.push(`brand + model "${sig.split('|')[1]}" under ${keys.length} keys at different prices: ` +
      priced.map(([k, v]) => `${k} ($${v})`).join(', '));
  }
}

// ── Same product, SAME price, two keys ──────────────────────────────
// Sprint 34: 'mevo-gen2' and 'flightscope-mevo-gen2' were both ~$1,299 and
// both live, splitting one product across two buy links over 8 pages. Every
// check above passed, because they all hinge on the prices DIFFERING — the
// heuristic below this one even treats "one key extends another" as evidence
// of a legitimate variant. That is true only when the price moves with it.
// If one key contains another AND the price is identical, it is not a variant.
// It is the same product entered twice.
{
  const keys = entries.map(([k]) => k);
  for (const a of keys) for (const b of keys) {
    // PRECISION. "contains" alone is far too loose: pro-v1 / pro-v1x and
    // phantom / phantom-x are genuinely different products that happen to cost
    // the same. Those differ by a model SUFFIX. A duplicate differs only by a
    // brand PREFIX — 'mevo-gen2' vs 'flightscope-mevo-gen2' — so require that
    // b is exactly "<something>-<a>".
    if (a === b || !b.endsWith('-' + a)) continue;
    const pa = String((AFFILIATE as any)[a].price ?? '');
    const pb = String((AFFILIATE as any)[b].price ?? '');
    if (!pa || pa !== pb) continue;
    problems.push(`"${a}" and "${b}" are the same product at the same price (${pa}) — one key contains the other. Merge them.`);
  }
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
if (modelDupes.length) {
  console.log(`⚠️  ${modelDupes.length} brand+model group(s) priced differently — variant or duplicate? Glance, don't assume:`);
  for (const m of modelDupes) console.log('   ' + m);
}
if (shared.length) {
  console.log(`⚠️  ${shared.length} key pair(s) share a product image — fine for variants, worth a glance:`);
  for (const g of shared) console.log('   ' + g);
}
console.log(`✅ Duplicate products: ${entries.length} registry entries, no product appears twice at two prices.`);
