#!/usr/bin/env node
/**
 * Guard: no page may show a "last updated" date older than its own sitemap entry.
 *
 * Before Sprint 142, 187 of 249 records did exactly that — 34 of them by more
 * than 90 days, the worst by 180 — while printing "prices and picks reviewed
 * regularly" right beside the stale stamp. Two systems both claimed to know
 * when a page changed (a hand-held `dateModified` and a content-hash lastmod)
 * and nobody reconciled them, so the claim read as false on pages that had in
 * fact been checked.
 *
 * src/lib/freshness.ts now resolves the later of the two at render time, which
 * is self-correcting. This checks the BUILT HTML rather than the source,
 * because the bug was never in the data — it was in which of the two numbers
 * each template happened to print.
 *
 * Ceiling is 0. Runs post-build.
 */
import fs from 'fs';
import path from 'path';

/**
 * Legal pages are a deliberate exception, and the exception runs the other way.
 * A privacy policy's "last updated" must say when the POLICY changed, not when
 * a shared footer component did. Their lastmod moves because the page hash
 * moves; bumping the visible date with it would tell readers the terms changed
 * when they did not. Here the sitemap is the wrong one, not the page.
 */
const LEGAL_EXEMPT = new Set(['/privacy-policy/', '/terms/', '/affiliate-disclosure/']);

const manifest = JSON.parse(fs.readFileSync('src/data/lastmod-manifest.json', 'utf-8'));
const lastmodOf = (slug: string): string | undefined => {
  const e = (manifest as any)[slug];
  return typeof e === 'string' ? e : e?.lastmod;
};

const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name === 'index.html' ? [p] : [];
  });

if (!fs.existsSync('dist')) { console.log('⏭  validate-date-agreement: no dist/, skipping.'); process.exit(0); }

const offenders: string[] = [];
let checked = 0;

for (const file of walk('dist')) {
  const slug = '/' + path.relative('dist', path.dirname(file)).split(path.sep).join('/') + '/';
  const normalised = slug === '//' ? '/' : slug;
  if (LEGAL_EXEMPT.has(normalised)) continue;
  const lastmod = lastmodOf(normalised);
  if (!lastmod) continue;

  const html = fs.readFileSync(file, 'utf-8');
  const dates = [
    ...[...html.matchAll(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/g)].map(m => m[1]),
    ...[...html.matchAll(/article:modified_time"\s+content="(\d{4}-\d{2}-\d{2})/g)].map(m => m[1]),
    ...[...html.matchAll(/(?:Updated|Last updated)[:\s]*<?\/?[a-z]*>?\s*(\d{4}-\d{2}-\d{2})/g)].map(m => m[1]),
  ];
  if (!dates.length) continue;
  checked++;

  const stale = [...new Set(dates.filter(d => d < lastmod))];
  if (stale.length) offenders.push(`${normalised} — sitemap says ${lastmod}, page shows ${stale.join(', ')}`);
}

if (offenders.length) {
  console.error(`\n❌ ${offenders.length} page(s) show a date older than their sitemap entry (ceiling 0):`);
  offenders.slice(0, 25).forEach(o => console.error('   ' + o));
  if (offenders.length > 25) console.error(`   ...and ${offenders.length - 25} more`);
  console.error('   Resolve the date through effectiveDateModified() in src/lib/freshness.ts');
  console.error('   rather than printing a hand-held dateModified.');
  process.exit(1);
}
console.log(`✅ Date agreement: ${checked} page(s) — none shows a date older than its sitemap entry (ceiling 0).`);
