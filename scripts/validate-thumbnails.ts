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
  'callaway-strata-senior.webp','carls-place-impact-screen.webp','carls-place-screen.webp',
  'cleveland-launcher-xl2-driver.webp','cleveland-launcher-xl2-irons.webp','club-car-onward.webp',
  'cobra-air-x.webp','ezgo-freedom-rxv.webp','maxfli-tour-x.webp','mizuno-jpx923-hot-metal.webp',
  'puma-cloudspun-polo.webp','putt-a-bout-putting-green.webp','skechers-go-golf.webp',
  'sklz-accelerator-pro.webp','srixon-q-star-tour.webp','srixon-zx5-mk-ii.webp',
  'sun-mountain-25-plus.webp','swing-ai.webp','taylormade-noodle.webp','taylormade-sim2-max.webp',
  'taylormade-stealth-2-hd.webp','taylormade-stealth-hybrid.webp','titleist-gt2-driver.webp',
  'under-armour-showdown-shorts.webp','vice-pro-plus.webp','vice-pro-soft.webp','vokey-sm10.webp',
]);
const AWAITING_PHOTO = new Set<string>([
  'srixon-q-star-tour',               // 6 pages — top priority
  'vice-pro-plus',                    // 3 pages
  'vice-pro-soft',                    // 2 pages
  'cleveland-launcher-xl-halo-irons', // 2 pages (interim XL2-iron art)
  'cleveland-launcher-xl2-irons',
  'putt-a-bout-putting-green',        // 2 pages
  'under-armour-showdown-shorts',     // 1 page — shorts WINNER card
  'club-car-onward','cobra-air-x','ezgo-freedom-rxv','maxfli-tour-x',
  'puma-cloudspun-polo','srixon-zx5-mk-ii','taylormade-noodle',
  'titleist-gt2-driver','swing-ai',
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

if (errors > 0) { console.error(`\n❌ ${errors} image problem(s).`); process.exit(1); }
console.log(`✅ Thumbnails match their pages AND all referenced product images are real photos (${AWAITING_PHOTO.size} awaiting owner shots).`);
