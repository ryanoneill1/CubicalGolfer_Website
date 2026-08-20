#!/usr/bin/env node
// validate-live-keys.ts — catch affiliate keys that no longer exist.
//
// WHY THIS EXISTS. Sprint 28 renamed `optoma-gt1090hdr` to `optoma-gt2000hdr`.
// One caller was missed, in a hardcoded .astro page:
//
//     const optoma = getAffiliateLink('optoma-gt1090hdr');
//
// Nothing failed. `getAffiliateLink` does not throw on an unknown key — it
// falls back to an Amazon *search* URL built from the key text. So the live
// cost calculator displayed "Optoma GT2000HDR — $1,199" above a button that
// searched Amazon for a projector discontinued in 2022.
//
// validate-affiliate-keys.ts reported "every affiliate key reference resolves"
// and was telling the truth: with a fallback, every string resolves. That is
// the hole. A graceful fallback turns a loud failure into a silent one, and
// silent failures on a buy button cost money rather than breaking a build.
//
// This checks the opposite property: every key PASSED to getAffiliateLink, and
// every key named in data, must be a real entry in AFFILIATE — no fallbacks.
//
// Scans .astro/.ts callers as text because the whole point is to catch the
// references that never get type-checked against the registry.

import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import fs from 'fs';
import path from 'path';

const known = new Set(Object.keys(AFFILIATE as any));
type Hit = { where: string; key: string };
const dead: Hit[] = [];

/** Every getAffiliateLink('...') / getAffiliate("...") call site in source. */
function scanCallers(dir: string) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { scanCallers(full); continue; }
    if (!/\.(astro|ts|tsx|js|mjs)$/.test(e.name)) continue;
    if (full.includes('affiliate-links.ts')) continue; // the registry itself
    const src = fs.readFileSync(full, 'utf8');
    for (const m of src.matchAll(/getAffiliate(?:Link)?\(\s*['"`]([^'"`]+)['"`]/g)) {
      if (!known.has(m[1])) dead.push({ where: full.replace(/^.*?src\//, 'src/'), key: m[1] });
    }
  }
}
scanCallers('src');

/** Every key named in the content data. */
for (const a of [...(ARTICLES as any), ...(COMPARISONS as any)]) {
  const slug = String(a.slug);
  const check = (k: any, what: string) => {
    if (k && !known.has(k)) dead.push({ where: `${slug} (${what})`, key: k });
  };
  check(a.quickAnswerProduct, 'quickAnswerProduct');
  for (const s of (a.sections ?? [])) check(s.affiliateKey, 'section');
  for (const r of (a.comparisonTable?.rows ?? [])) check(r.affiliateKey, 'table row');
  for (const p of (a.products ?? [])) check(p.key ?? p.affiliateKey, 'product');
}

/** product-names.ts entries keyed to a product that no longer exists.
 *  Harmless at runtime, but this is exactly how the Sprint 28 rename went
 *  quiet: the label map still matched the OLD key, so nothing errored and
 *  nothing looked up. Orphans here are drift waiting to mislead. */
const orphanNames: string[] = [];
try {
  const pn = fs.readFileSync('src/data/product-names.ts', 'utf8');
  for (const m of pn.matchAll(/^\s*'([a-z0-9-]+)':\s*"/gm))
    if (!known.has(m[1])) orphanNames.push(m[1]);
} catch { /* file optional */ }

/** Product images referenced by the registry must exist on disk. */
const missingImg: string[] = [];
for (const [key, v] of Object.entries(AFFILIATE as any)) {
  const src = (v as any).imgSrc;
  if (!src) continue;
  if (!fs.existsSync(path.join('public', src.replace(/^\//, '')))) missingImg.push(`${key} -> ${src}`);
}

if (dead.length === 0 && missingImg.length === 0 && orphanNames.length === 0) {
  console.log(`✅ Live keys: every affiliate key resolves to a real registry entry (${known.size} products), no fallbacks, all product images present.`);
  process.exit(0);
}

if (dead.length) {
  console.error(`\n❌ ${dead.length} affiliate key reference(s) point at a key that does not exist.`);
  console.error(`   getAffiliateLink() does NOT throw on these — it silently returns an Amazon`);
  console.error(`   search URL built from the key text, so the buy button quietly sells nothing.\n`);
  for (const d of dead) console.error(`   ${d.where}\n      key: "${d.key}"`);
}
if (missingImg.length) {
  console.error(`\n❌ ${missingImg.length} registry entr(ies) reference a product image that is not on disk:`);
  for (const m of missingImg) console.error(`   ${m}`);
}
if (orphanNames.length) {
  console.error(`\n\u274c ${orphanNames.length} product-names.ts entr(ies) key off a product that no longer exists:`);
  for (const o of orphanNames) console.error(`   '${o}'`);
  console.error(`   Rename or remove — a stale label map is how a rename goes silent.`);
}
process.exit(1);
