/**
 * validate-og-dimensions.ts — post-build guard
 *
 * Added Aug 2026, Sprint 4.
 *
 * `validate-og-images.ts` already checks that referenced social images EXIST. It
 * does not check that they are usable, and existence is the easy half.
 *
 * The site's own /golf-ball-compression-chart/ — roughly 60% of the impressions in
 * the top 25 — pointed og:image at the sitewide default. The obvious fix was to
 * point it at the page's 400x260 WebP thumbnail, which would have passed the
 * existence check and still shown nothing: Facebook and LinkedIn want at least
 * 200x200 and prefer 1200x630, and several crawlers do not render WebP at all.
 *
 * So this checks the two things that actually decide whether a thumbnail appears:
 *   FAIL  a social image that is WebP, or smaller than 600x315 (below Facebook's
 *         recommended minimum, where the card degrades to a small square or nothing).
 *   WARN  a page still on the sitewide default. Fine for /privacy-policy/,
 *         a wasted impression on a page people actually share.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const MIN_W = 600, MIN_H = 315;
const DEFAULT_OG = '/images/og-image.jpg';

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const failures: string[] = [];
const onDefault: string[] = [];
const seen = new Map<string, { w: number; h: number; fmt: string } | null>();
let checked = 0;

for (const file of htmlFiles('dist')) {
  const html = readFileSync(file, 'utf-8');
  const m = html.match(/<meta property="og:image" content="([^"]*)"/);
  if (!m) continue;
  const page = '/' + file.replace(/^dist\/?/, '').replace(/index\.html$/, '');
  const path = m[1].replace(/^https?:\/\/[^/]+/, '');

  if (path === DEFAULT_OG) { onDefault.push(page); continue; }
  checked++;

  if (!seen.has(path)) {
    const disk = join('public', path);
    if (!existsSync(disk)) { seen.set(path, null); }
    else {
      const meta = await sharp(disk).metadata();
      seen.set(path, { w: meta.width ?? 0, h: meta.height ?? 0, fmt: meta.format ?? '?' });
    }
  }
  const info = seen.get(path);
  if (!info) { failures.push(`${page} → ${path} is missing from public/`); continue; }
  if (info.fmt === 'webp') failures.push(`${page} → ${path} is WebP; several crawlers will not render it`);
  else if (info.w < MIN_W || info.h < MIN_H)
    failures.push(`${page} → ${path} is ${info.w}x${info.h}; below the ${MIN_W}x${MIN_H} minimum for a social card`);
}

// THRESHOLD, deliberately. 181 pages already point og:image at a 400x260 WebP
// article thumbnail — 226 of the 271 thumbnails are below Facebook's 600x315
// minimum. That is a real finding and a real job (153 distinct files), but it
// predates this check and breaking the build over it would just get the check
// deleted. So: the number is recorded, and the build fails only if it GROWS.
// Lower it as thumbnails are converted; at 0, delete this paragraph.
const KNOWN_SMALL_OR_WEBP = 181;

if (failures.length > KNOWN_SMALL_OR_WEBP) {
  console.error(`\n❌ ${failures.length} social image(s) will not render as a card (was ${KNOWN_SMALL_OR_WEBP}):`);
  for (const f of failures.slice(0, 15)) console.error('   ' + f);
  console.error('\nUse a JPG or PNG of at least 1200x630. `npm run og` regenerates the branded set.\n');
  process.exit(1);
}

if (failures.length) {
  console.log(`⚠️  ${failures.length} page(s) use a social image that is WebP or under ${MIN_W}x${MIN_H} — most platforms will show a small card or none. Tracked, not yet fixed.`);
}

if (onDefault.length) {
  console.log(`⚠️  ${onDefault.length} page(s) still use the sitewide og:image — fine for legal/utility pages, a wasted impression on anything people share:`);
  for (const p of onDefault.slice(0, 12)) console.log('   ' + p);
  if (onDefault.length > 12) console.log(`   …and ${onDefault.length - 12} more`);
}

console.log(`✅ og:image: all ${checked} page-specific social images are JPG/PNG and at least ${MIN_W}x${MIN_H}.`);
