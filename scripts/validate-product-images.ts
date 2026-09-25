#!/usr/bin/env node
/**
 * validate-product-images.ts
 *
 * ── The gap this closes ────────────────────────────────────────────────────
 * validate-live-keys.ts already checks that every imgSrc a product DECLARES
 * points at a file that exists. Nothing checked whether a product declares one
 * at all.
 *
 * So a product could be added, placed on a page, shipped to production, and
 * render a card with a blank space where the photo goes — with every validator
 * passing. That is exactly what happened on /best-golf-push-carts-2026/: eight
 * product sections, six images. Ryan found it on the live site, which is the
 * wrong place for it to be found.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 * For every article section that sells a product (has an affiliateKey), the
 * registry entry behind it must have an imgSrc AND that file must exist.
 * Grouped by page, so the output names the pages a reader sees a gap on.
 *
 * ── Ceiling ────────────────────────────────────────────────────────────────
 * Photos come from Ryan; a missing one is "waiting on an image", not a code
 * bug. So this follows the house ratchet — it only ever goes down, and the
 * count cannot grow without someone deciding it should.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Ratchet. Only ever edit this downward, as photos arrive. */
/* 25 Sep 2026: 8 -> 1. Ryan supplied seven photos. The one left is
   flightscope-mevo, which is blocked on a price rather than an image. */
const CEILING = 1;
const PUBLIC = join(process.cwd(), 'public');

interface Gap { slug: string; key: string; reason: string }
const gaps: Gap[] = [];
const missing = new Set<string>();
let checked = 0;

function* keysIn(node: any): Generator<string> {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const v of node) yield* keysIn(v); return; }
  if (typeof node.affiliateKey === 'string') yield node.affiliateKey;
  for (const v of Object.values(node)) yield* keysIn(v);
}

for (const article of ARTICLES as any[]) {
  const seen = new Set<string>();
  for (const key of keysIn(article.sections ?? [])) {
    if (seen.has(key)) continue;
    seen.add(key);
    checked++;
    const entry: any = (AFFILIATE as any)[key];
    if (!entry) continue;                        // validate-key-integrity owns this
    if (!entry.imgSrc) {
      gaps.push({ slug: article.slug, key, reason: 'no imgSrc declared' });
      missing.add(key);
    } else if (!existsSync(join(PUBLIC, entry.imgSrc))) {
      gaps.push({ slug: article.slug, key, reason: `imgSrc file missing (${entry.imgSrc})` });
      missing.add(key);
    }
  }
}

const byPage = new Map<string, Gap[]>();
for (const g of gaps) {
  if (!byPage.has(g.slug)) byPage.set(g.slug, []);
  byPage.get(g.slug)!.push(g);
}

if (missing.size > CEILING) {
  console.error(`\n❌ Product images: ${missing.size} product(s) render without a photo ` +
    `(ceiling ${CEILING}, which only goes down).\n`);
  for (const [slug, list] of [...byPage].sort()) {
    console.error(`   ${slug}`);
    for (const g of list) console.error(`      ${g.key} — ${g.reason}`);
  }
  console.error('\n   Supply the photo, or pull the section until there is one.\n');
  process.exit(1);
}

console.log(`✅ Product images: ${checked} product section(s) across ${(ARTICLES as any[]).length} pages — ` +
  `${missing.size} awaiting a photo (ceiling ${CEILING}).`);
for (const [slug, list] of [...byPage].sort()) {
  console.log(`   ${slug}`);
  for (const g of list) console.log(`      ${g.key} — ${g.reason}`);
}
