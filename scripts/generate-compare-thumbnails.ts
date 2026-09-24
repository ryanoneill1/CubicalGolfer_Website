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

/**
 * Resolve a product's illustration, or null when there isn't one yet.
 * A brand-new product reaches the registry before anyone has photographed it,
 * and returning null here (rather than bailing on the whole card) is what lets
 * its comparison page ship on day one. The plate falls back to the product name
 * in text; the next build after a photo lands swaps the picture in with no edit.
 */
function imagePathFor(entry: any): string | null {
  if (!entry?.imgSrc) return null;
  const p = path.join(PRODUCTS_DIR, entry.imgSrc);
  return fs.existsSync(p) ? p : null;
}

/** Word-wrap a product name onto the plate when it stands in for a photo. */
function wrapName(key: string, maxChars = 14): string[] {
  const words = productName(key).split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4);
}

function placeholderPlate(key: string, plateX: number): string {
  const lines = wrapName(key);
  const size = 26;
  const startY = PLATE_Y + PLATE / 2 - ((lines.length - 1) * size * 1.25) / 2 + 9;
  return lines.map((ln, i) => `
    <text x="${plateX + PLATE / 2}" y="${startY + i * size * 1.25}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="${size}"
          fill="${GREEN}">${esc(ln)}</text>`).join('');
}

async function makeThumb(slug: string, keyA: string, keyB: string): Promise<boolean> {
  const a: any = (AFFILIATE as any)[keyA];
  const b: any = (AFFILIATE as any)[keyB];
  if (!a || !b) return false;
  const imgAPath = imagePathFor(a);
  const imgBPath = imagePathFor(b);

  const fit = { width: PLATE - IMG_PAD * 2, height: PLATE - IMG_PAD * 2, fit: 'inside' as const };
  const [imgA, imgB] = await Promise.all([
    imgAPath ? sharp(imgAPath).resize(fit).toBuffer() : Promise.resolve(null),
    imgBPath ? sharp(imgBPath).resize(fit).toBuffer() : Promise.resolve(null),
  ]);
  const [mA, mB] = await Promise.all([
    imgA ? sharp(imgA).metadata() : Promise.resolve({ width: 0, height: 0 } as any),
    imgB ? sharp(imgB).metadata() : Promise.resolve({ width: 0, height: 0 } as any),
  ]);

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
    ${imgA ? '' : placeholderPlate(keyA, PLATE_AX)}
    ${imgB ? '' : placeholderPlate(keyB, PLATE_BX)}
    ${imgA ? `<text x="${PLATE_AX + PLATE / 2}" y="${PLATE_Y + PLATE + 42}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#ffffff">${esc(shortName(keyA))}</text>` : ''}
    ${imgB ? `<text x="${PLATE_BX + PLATE / 2}" y="${PLATE_Y + PLATE + 42}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#ffffff">${esc(shortName(keyB))}</text>` : ''}
  </svg>`;

  await sharp(Buffer.from(svg))
    .composite([
      ...(imgA ? [{ input: imgA, left: Math.round(PLATE_AX + (PLATE - (mA.width ?? 0)) / 2), top: Math.round(PLATE_Y + (PLATE - (mA.height ?? 0)) / 2) }] : []),
      ...(imgB ? [{ input: imgB, left: Math.round(PLATE_BX + (PLATE - (mB.width ?? 0)) / 2), top: Math.round(PLATE_Y + (PLATE - (mB.height ?? 0)) / 2) }] : []),
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
  if (skipped.length) console.log('  skipped (product key not in registry):', skipped.join(', '));
  const textOnly = (COMPARISONS as any[]).filter(c => {
    const a: any = (AFFILIATE as any)[c.productA], b: any = (AFFILIATE as any)[c.productB];
    return (a && b) && (!imagePathFor(a) || !imagePathFor(b));
  }).map(c => c.slug);
  if (textOnly.length) {
    console.log(`  ⚠️  ${textOnly.length} card(s) drawn with a text plate — product photo still needed:`);
    for (const s of textOnly) console.log('       ', s);
  }
  // Fail the build only if nothing generated — partial success is acceptable
  // because the template keeps an emoji fallback for missing files.
  if (ok === 0) process.exit(1);
}

main();
