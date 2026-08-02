/**
 * validate-og-images.ts — pre-build guard
 *
 * Added 2026-08 after a site audit found 46 pages pointing og:image (and the
 * mirrored twitter:image) at assets that 404: the whole /images/og/ directory
 * was missing, and three pages asked for og-image.png when only og-image.jpg
 * exists. Every social share of those pages rendered with no preview image.
 *
 * This asserts that every OG image URL the site can emit resolves to a real
 * file in public/. It is cheap and it makes that class of defect un-shippable.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const SRC = path.join(ROOT, 'src');

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|astro)$/.test(e.name)) out.push(p);
  }
  return out;
};

const refs = new Map<string, string[]>();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/https:\/\/www\.cubicalgolfer\.com(\/images\/[^\s'"`)]+)/g)) {
    const asset = m[1];
    if (!refs.has(asset)) refs.set(asset, []);
    refs.get(asset)!.push(path.relative(ROOT, file));
  }
}

const missing: Array<[string, string[]]> = [];
for (const [asset, files] of refs) {
  if (!fs.existsSync(path.join(PUBLIC, asset))) missing.push([asset, [...new Set(files)]]);
}

if (missing.length) {
  console.error(`\n❌ ${missing.length} referenced image asset(s) do not exist in public/:`);
  for (const [asset, files] of missing) console.error(`   ${asset}\n     ← ${files.join(', ')}`);
  console.error('\nCreate the asset, or repoint the reference at one that exists.\n');
  process.exit(1);
}
console.log(`✅ OG/social images: all ${refs.size} referenced assets exist in public/.`);
