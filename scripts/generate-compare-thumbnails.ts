// scripts/generate-compare-thumbnails.ts
// ─────────────────────────────────────────────────────────────────────────────
// Build-time generator for /images/thumbnails/compare-{slug}.webp
//
// Every comparison card on /compare/ previously fell back to a ⚖️ emoji on an
// empty banner because COMPARISONS entries have no thumbnail. This script
// composites each matchup's two product illustrations (already in
// /images/products/) onto a brand-green card with a gold VS badge — matching
// the style of the existing article VS thumbnails.
//
// Runs in the build chain before `astro build` (see package.json).
// Manual run: npx tsx scripts/generate-compare-thumbnails.ts
// ─────────────────────────────────────────────────────────────────────────────

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { COMPARISONS } from '../src/data/comparisons';
import { AFFILIATE } from '../src/data/affiliate-links';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'thumbnails');
const PRODUCTS_DIR = path.join(process.cwd(), 'public');

// Brand tokens — match the site design system
const GREEN = '#1E3A28';
const GOLD = '#C9A227';

const W = 800, H = 520;          // card canvas (matches 400x260 render @2x)
const PLATE = 260;                // white plate size for each product
const PLATE_Y = (H - PLATE) / 2 - 20;
const PLATE_AX = 70, PLATE_BX = W - 70 - PLATE;
const IMG_PAD = 24;               // padding inside plates

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Trim a product name to fit under a plate. */
import { productName } from '../src/data/product-names';
function shortName(key: string): string {
  const name = productName(key);
  return name.length > 24 ? name.slice(0, 23).trimEnd() + '…' : name;
}

async function makeThumb(slug: string, keyA: string, keyB: string): Promise<boolean> {
  const a: any = (AFFILIATE as any)[keyA];
  const b: any = (AFFILIATE as any)[keyB];
  if (!a?.imgSrc || !b?.imgSrc) return false;
  const imgAPath = path.join(PRODUCTS_DIR, a.imgSrc);
  const imgBPath = path.join(PRODUCTS_DIR, b.imgSrc);
  if (!fs.existsSync(imgAPath) || !fs.existsSync(imgBPath)) return false;

  const fit = { width: PLATE - IMG_PAD * 2, height: PLATE - IMG_PAD * 2, fit: 'inside' as const };
  const [imgA, imgB] = await Promise.all([
    sharp(imgAPath).resize(fit).toBuffer(),
    sharp(imgBPath).resize(fit).toBuffer(),
  ]);
  const [mA, mB] = await Promise.all([sharp(imgA).metadata(), sharp(imgB).metadata()]);

  // Background + plates + VS badge + names, all as one SVG layer
  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="${PLATE_AX}" y="${PLATE_Y}" width="${PLATE}" height="${PLATE}" rx="14" fill="#ffffff"/>
    <rect x="${PLATE_BX}" y="${PLATE_Y}" width="${PLATE}" height="${PLATE}" rx="14" fill="#ffffff"/>
    <circle cx="${W / 2}" cy="${PLATE_Y + PLATE / 2}" r="42" fill="${GOLD}"/>
    <text x="${W / 2}" y="${PLATE_Y + PLATE / 2 + 10}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="bold"
          fill="${GREEN}">VS</text>
    <text x="${PLATE_AX + PLATE / 2}" y="${PLATE_Y + PLATE + 42}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#ffffff">${esc(shortName(keyA))}</text>
    <text x="${PLATE_BX + PLATE / 2}" y="${PLATE_Y + PLATE + 42}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#ffffff">${esc(shortName(keyB))}</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .composite([
      { input: imgA, left: Math.round(PLATE_AX + (PLATE - (mA.width ?? 0)) / 2), top: Math.round(PLATE_Y + (PLATE - (mA.height ?? 0)) / 2) },
      { input: imgB, left: Math.round(PLATE_BX + (PLATE - (mB.width ?? 0)) / 2), top: Math.round(PLATE_Y + (PLATE - (mB.height ?? 0)) / 2) },
    ])
    .webp({ quality: 78 })
    .toFile(path.join(OUT_DIR, `compare-${slug}.webp`));
  return true;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0; const skipped: string[] = [];
  for (const c of COMPARISONS as any[]) {
    const done = await makeThumb(c.slug, c.productA, c.productB).catch((e) => {
      console.error(`  ✗ ${c.slug}: ${e.message}`); return false;
    });
    if (done) ok++; else skipped.push(c.slug);
  }
  console.log(`✅ Compare thumbnails generated: ${ok}/${(COMPARISONS as any[]).length}`);
  if (skipped.length) console.log('  skipped (missing product image):', skipped.join(', '));
  // Fail the build only if nothing generated — partial success is acceptable
  // because the template keeps an emoji fallback for missing files.
  if (ok === 0) process.exit(1);
}

main();
