#!/usr/bin/env node
// scripts/validate-thumbnails.ts — v2
// (1) Every article thumbnail AND ogImage file must exist on disk.
// (2) SEMANTIC GUARD: the thumbnail filename must share at least one
//     meaningful token with the article slug, so a card can never show
//     art for a different page (the "forgiving-drivers thumb on the
//     GPS-watches card" class of bug). Legit generic pairings go in
//     the ALLOWLIST below with a reason.

import { ARTICLES } from '../src/data/articles.ts';
import fs from 'fs';
import path from 'path';

const STOP = new Set(['best','golf','2026','the','for','a','and','of','to','vs','with','guide','thumb','how','what','why','is','on','in','your','you','do','i','review']);
const toks = (s: string) => s.toLowerCase().replace(/\.(webp|png|jpg)$/,'').split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t));

// slug → thumbnail filename pairs that are intentionally generic.
const ALLOWLIST: Record<string,string> = {
  '/how-golf-launch-monitors-work/': 'launch-monitors-thumb.webp', // topic page sharing the category art
};

let errors = 0;
for (const article of ARTICLES) {
  const a = article as any;
  for (const field of ['thumbnail'] as const) {
    if (!a[field]) continue;
    const filePath = path.join(process.cwd(), 'public', a[field]);
    if (!fs.existsSync(filePath)) { console.error(`Missing ${field}: ${a[field]} (${a.slug})`); errors++; }
  }
  if (a.ogImage && a.ogImage.includes('/images/')) {
    const rel = a.ogImage.replace(/^https?:\/\/[^/]+/, '');
    if (!fs.existsSync(path.join(process.cwd(), 'public', rel))) { console.error(`Missing ogImage: ${rel} (${a.slug})`); errors++; }
  }
  if (a.thumbnail) {
    const file = a.thumbnail.split('/').pop()!;
    if (ALLOWLIST[a.slug] === file) continue;
    if (file.startsWith('compare-')) continue; // generator-owned
    const st = new Set(toks(a.slug));
    const overlap = toks(file).filter(t => st.has(t) || [...st].some(s2 => s2.includes(t) || t.includes(s2)));
    if (overlap.length === 0) {
      console.error(`Thumbnail/slug mismatch: ${a.slug} → ${file} (art belongs to a different page; fix the reference or allowlist with a reason)`);
      errors++;
    }
  }
}
// ── PRODUCT IMAGE QUALITY GATE ─────────────────────────────────────────
// Ground truth from a manual visual audit (2026-07-08): these files are flat
// gray-silhouette stand-ins, NOT product photos. Referencing one is only
// allowed while its key sits in AWAITING_PHOTO — delete both entries as real
// shots arrive. New silhouettes must be added here by hand; automatic
// size/color heuristics misfire on dark products and tinted art.
import { AFFILIATE } from '../src/data/affiliate-links.ts';
const SILHOUETTE_FILES = new Set<string>([
  // The generic "Image Coming Soon" card. It is a real file, so the existence
  // check above passes — which is how nine products shipped with it visible on
  // /best-irons-under-500/ and eight other pages. Listing it here means every
  // use must be declared in AWAITING_PHOTO and stays counted until a real shot
  // replaces it.
  'placeholder.webp',
  // Verified 2026-07-08 by template-color analysis (the navy/green "product
  // name card" template scores ~50% template-pixel share; real photos ≤1.4%).
  // Earlier visual classification wrongly flagged 22 real white-background
  // photos (balls, apparel) as art — corrected. Only these are true cards:
  'taylormade-sim2-max.webp',          // repointed → taylormade-sim-max.webp
  'cleveland-launcher-xl2-driver.webp',// repointed → cleveland-launcher-xl2.webp
  'titleist-gt2-driver.webp',          // repointed → Titleist-GT2-driver.webp
  'club-car-onward.webp',              // superseded by club-car-onward-cart.webp (the real photo)
  'ezgo-freedom-rxv.webp',             // unused; E-Z-GO-Freedom-RXV.webp was a Club Car, now club-car-onward-cart.webp
  'cobra-ds-adapt-max-k.webp',         // still in use — awaiting a real photo
]);
const AWAITING_PHOTO = new Set<string>([
  // ── Hand-made silhouette cards, pre-existing ────────────────────────────
  'club-car-onward',
  'cobra-ds-adapt-max-k',
]);
for (const [key, v] of Object.entries(AFFILIATE as any)) {
  const img = (v as any).imgSrc as string | undefined;
  if (!img) continue;
  const full = path.join(process.cwd(), 'public', img);
  if (!fs.existsSync(full)) { console.error(`Missing product image: ${img} (key: ${key})`); errors++; continue; }
  const file = img.split('/').pop()!;
  if (SILHOUETTE_FILES.has(file) && !AWAITING_PHOTO.has(key)) {
    console.error(`Silhouette art in use: ${file} (key: ${key}) — point at a real photo, or add the key to AWAITING_PHOTO`);
    errors++;
  }
}

// ── COMPARISON THUMBNAILS: strict own-file rule ────────────────────────
// A comparison's thumbnail must be its own generated compare-{slug}.webp —
// hand-set legacy paths caused wrong-matchup art on listing cards.
import { COMPARISONS } from '../src/data/comparisons.ts';
for (const c of COMPARISONS as any[]) {
  if (!c.thumbnail) continue;
  const want = `/images/thumbnails/compare-${c.slug}.webp`;
  if (c.thumbnail !== want) {
    console.error(`Comparison thumbnail off-slug: ${c.slug} → ${c.thumbnail} (must be ${want})`);
    errors++;
  } else if (!fs.existsSync(path.join(process.cwd(), 'public', want))) {
    console.error(`Generated compare thumb missing: ${want} — run the generator or check product images for ${c.slug}`);
    errors++;
  }
}

if (errors > 0) { console.error(`\n❌ ${errors} image problem(s).`); process.exit(1); }
console.log(`✅ Thumbnails match their pages AND all referenced product images are real photos (${AWAITING_PHOTO.size} awaiting owner shots).`);
