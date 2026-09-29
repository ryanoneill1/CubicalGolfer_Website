#!/usr/bin/env node
/**
 * validate-placeholder-images.ts — fails the build if a page renders an image
 * that is a "replace me" placeholder rather than a real picture.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Ryan found /best-golf-rangefinders-2026/ showing a flat green card reading
 * "Rangefinder Testing on Course — Placeholder, replace with real photo".
 * On a commercial page. In production. For however long it had been there.
 *
 * An audit then found TWELVE of these generated cards in public/images/
 * products/, FIVE of them live across three pages (the practice-drills page
 * was showing three at once).
 *
 * Nothing caught it, because every existing image check asks "does the file
 * exist?" and the file existed. The file was the problem.
 *
 * ── How it detects one ─────────────────────────────────────────────────────
 * These cards are a flat brand-green field with a couple of lines of text. A
 * photograph is never flat. Downscale the image and measure what share of it
 * is a single colour bucket:
 *
 *     placeholder cards   84-88% one colour
 *     real photography     8-19% one colour
 *
 * The 70% threshold sits in the middle of a gap so wide that no tuning is
 * needed. It is deliberately checked against DARK dominant colours only, so
 * legitimate product cut-outs on white backgrounds do not trip it.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 * Only images a READER can actually see — anything referenced by a
 * sectionImage, or by an imgSrc on a product that is placed on a page.
 * An unreferenced placeholder sitting in public/ is dead weight, not a bug,
 * and this does not fail the build over it (it lists them as a note).
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';
import sharp from 'sharp';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');
const FLAT_THRESHOLD = 0.70;

async function flatness(abs: string): Promise<number> {
  const { data, info } = await sharp(abs)
    .resize(160, 100, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const counts = new Map<string, number>();
  let domN = 0, domR = 0, domG = 0, domB = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] >> 3, g = data[i + 1] >> 3, b = data[i + 2] >> 3;
    const k = `${r},${g},${b}`;
    const n = (counts.get(k) ?? 0) + 1;
    counts.set(k, n);
    if (n > domN) { domN = n; domR = r; domG = g; domB = b; }
  }
  const total = data.length / info.channels;
  // The cards are a flat DARK GREEN field. Requiring green-dominance (not just
  // "dark") is what keeps real product photography shot on black or white
  // seamless out of this — those come back grey/neutral, never green-biased.
  const darkGreen = domR + domG + domB <= 30 && domG > domR && domG > domB;
  return darkGreen ? domN / total : 0;
}

/** Every image path a reader can actually see. */
function renderedImages(): Map<string, string> {
  const out = new Map<string, string>();   // path -> where it shows up
  const walk = (node: any, slug: string) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(n => walk(n, slug)); return; }
    if (typeof node.sectionImage === 'string') out.set(node.sectionImage, slug);
    if (typeof node.affiliateKey === 'string') {
      const img = (AFFILIATE as any)[node.affiliateKey]?.imgSrc;
      if (img) out.set(img, slug);
    }
    Object.values(node).forEach(v => walk(v, slug));
  };
  for (const a of ARTICLES as any[]) walk(a, a.slug ?? '(unknown)');
  return out;
}

const bad: string[] = [];
let checked = 0;

for (const [path, slug] of renderedImages()) {
  const abs = join(PUBLIC, path.replace(/^\//, ''));
  if (!existsSync(abs)) continue;          // validate-live-keys owns missing files
  checked++;
  const f = await flatness(abs);
  if (f >= FLAT_THRESHOLD) {
    bad.push(`${slug} renders ${path} — ${(f * 100).toFixed(0)}% flat fill. That is a placeholder card, not a photo.`);
  }
}

// Advisory only: placeholders sitting unused in public/.
const orphans: string[] = [];
const dir = join(PUBLIC, 'images', 'products');
if (existsSync(dir)) {
  const rendered = new Set(renderedImages().keys());
  for (const f of readdirSync(dir)) {
    if (!/\.(webp|png|jpe?g)$/i.test(f)) continue;
    const p = `/images/products/${f}`;
    if (rendered.has(p)) continue;
    try { if (await flatness(join(dir, f)) >= FLAT_THRESHOLD) orphans.push(p); } catch { /* ignore */ }
  }
}

if (bad.length) {
  console.error(`\n❌ Placeholder images: ${bad.length} page(s) are showing a "replace with real photo" card.\n`);
  bad.forEach(m => console.error('   ' + m));
  console.error('\n   Either supply a real photo or remove the sectionImage. Do not ship the card.\n');
  process.exit(1);
}

console.log(`✅ Placeholder images: ${checked} rendered image(s) checked, none is a placeholder card.` +
  (orphans.length ? ` (${orphans.length} unused placeholder file(s) in public/ — safe to delete.)` : ''));
if (orphans.length) orphans.forEach(o => console.log(`   unused: ${o}`));
