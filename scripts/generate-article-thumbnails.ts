/**
 * generate-article-thumbnails.ts — build-time card art for article thumbnails
 *
 * Added Aug 2026. Every article carries a `thumbnail`, and hub cards fall back to
 * a bare emoji when it is missing — which looked broken next to the real cards.
 * This generates the missing ones in the same house style as the compare
 * thumbnails: brand-green card, gold eyebrow, serif title, and the article's own
 * lead product photographed on a white plate.
 *
 * Idempotent: only writes a file that does not already exist, so hand-made
 * thumbnails are never overwritten.
 *
 * Manual run: npx tsx scripts/generate-article-thumbnails.ts
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'thumbnails');
const PUBLIC = path.join(process.cwd(), 'public');
const GREEN = '#1E3A28', GOLD = '#C9A227';
// Cream plate, not white: many product shots are white-on-white (golf balls,
// gloves) and vanished against a pure white background.
const W = 800, H = 520;
const PLATE = 250, PLATE_X = W - PLATE - 60, PLATE_Y = (H - PLATE) / 2 + 10, IMG_PAD = 22;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Wrap a title into at most 3 lines that fit the left column. */
function wrap(title: string, max = 17): string[] {
  const words = title.split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

async function build(a: any): Promise<'made' | 'skip' | 'nokey'> {
  // Only articles that declare no thumbnail. Anything with a `thumbnail` field
  // already has art (often under a different filename), and generating a second
  // file would just litter public/ with images nothing references.
  if (a.thumbnail) return 'skip';
  // Flatten nested slugs (/compare/x/ → compare-x) so no sub-directory is needed.
  const slug = a.slug.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const out = path.join(OUT_DIR, `${slug}-thumb.webp`);
  if (fs.existsSync(out)) return 'skip';

  // Lead product = the article's own quick-answer pick, else its first keyed section.
  const key = a.quickAnswerProduct
    || (a.sections ?? []).find((s: any) => s.affiliateKey)?.affiliateKey
    || (a.comparisonTable?.rows ?? []).find((r: any) => r.affiliateKey)?.affiliateKey;
  const prod: any = key ? (AFFILIATE as any)[key] : null;
  if (!prod?.imgSrc) return 'nokey';
  const imgPath = path.join(PUBLIC, prod.imgSrc);
  if (!fs.existsSync(imgPath)) return 'nokey';

  const img = await sharp(imgPath)
    .resize({ width: PLATE - IMG_PAD * 2, height: PLATE - IMG_PAD * 2, fit: 'inside' })
    .toBuffer();
  const meta = await sharp(img).metadata();

  const lines = wrap(a.titleDisplay || a.title);
  const startY = H / 2 - (lines.length - 1) * 26 - 6;
  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="52" y="46" width="176" height="30" rx="4" fill="${GOLD}" opacity="0.92"/>
    <text x="140" y="67" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="15" font-weight="bold" letter-spacing="2" fill="${GREEN}">CUBICAL GOLFER</text>
    ${lines.map((l, i) => `<text x="52" y="${startY + i * 52}" font-family="Georgia, 'Times New Roman', serif"
          font-size="44" font-weight="bold" fill="#ffffff">${esc(l)}</text>`).join('')}
    <text x="52" y="${H - 44}" font-family="Helvetica, Arial, sans-serif" font-size="19"
          fill="${GOLD}">cubicalgolfer.com</text>
    <rect x="${PLATE_X}" y="${PLATE_Y}" width="${PLATE}" height="${PLATE}" rx="14" fill="#F2F1EC" stroke="#D8D5CC" stroke-width="2"/>
  </svg>`;

  // Two passes on purpose: sharp applies resize BEFORE composite in a single
  // pipeline, which would shrink the canvas to 400px and drop the product image
  // placed at x=512. Composite at full 2x size, then downsample separately.
  const card = await sharp(Buffer.from(svg))
    .composite([{ input: img,
      left: Math.round(PLATE_X + (PLATE - (meta.width ?? 0)) / 2),
      top: Math.round(PLATE_Y + (PLATE - (meta.height ?? 0)) / 2) }])
    .png()
    .toBuffer();
  await sharp(card).resize(400, 260).webp({ quality: 82 }).toFile(out);
  return 'made';
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let made = 0, skipped = 0; const nokey: string[] = [];
for (const a of ARTICLES as any[]) {
  const r = await build(a);
  if (r === 'made') { made++; console.log(`   ✎ ${a.slug.replace(/^\/|\/$/g, '')}-thumb.webp`); }
  else if (r === 'skip') skipped++;
  else nokey.push(a.slug);
}
if (nokey.length) {
  console.log(`⚠️  ${nokey.length} article(s) have no product image to build from:`);
  for (const s of nokey.slice(0, 8)) console.log('     ' + s);
}
console.log(`✅ Article thumbnails: ${made} generated, ${skipped} already existed.`);
