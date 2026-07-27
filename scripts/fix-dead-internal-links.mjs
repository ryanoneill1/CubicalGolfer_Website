#!/usr/bin/env node
/**
 * scripts/fix-dead-internal-links.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Repoints internal links that resolve to a redirect rather than a built page.
 *
 * The big one: src/layouts/BaseLayout.astro has a footer link to
 * /best-game-improvement-irons-2026/, a page removed during the iron
 * consolidation. Because it lives in the global layout it renders on all 261
 * pages, so every page on the site carried a dead link.
 *
 * A link to a redirect is not fatal — it 301s — but it wastes a hop and crawl
 * budget on every page. These now point straight at the destination.
 *
 * Purely a URL substitution. No content is added, removed, or reworded.
 */
import fs from 'fs';

const MAP = {
  '/best-game-improvement-irons-2026/':                  '/best-golf-irons-2026/',
  '/most-forgiving-irons/':                              '/best-golf-irons-2026/',
  '/best-golf-irons-high-handicapper/':                  '/best-golf-irons-2026/',
  '/compare/callaway-supersoft-vs-srixon-soft-feel/':    '/golf-ball-compression-chart/',
  '/compare/srixon-q-star-tour-vs-callaway-chrome-soft/':'/compare/titleist-pro-v1-vs-callaway-chrome-soft/',
  '/compare/vice-pro-vs-titleist-pro-v1/':               '/compare/pro-v1-vs-tp5/',
};

const FILES = [
  'src/layouts/BaseLayout.astro',
  'src/data/articles.ts',
  'src/data/comparisons.ts',
  'src/lib/linking.ts',
  'src/pages/golf-ball-finder/index.astro',
  'src/pages/golf-ball-complete-guide/index.astro',
];

const before = {}, after = {};
for (const [k] of Object.entries(MAP)) before[k] = 0;

for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  for (const [from, to] of Object.entries(MAP)) {
    const n = s.split(from).length - 1;
    if (n) { before[from] += n; s = s.split(from).join(to); }
  }
  if (s !== orig) {
    // never let a substitution change the byte count in a way that suggests content loss
    fs.writeFileSync(f, s);
    console.log(`  patched ${f}`);
  }
}

for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const s = fs.readFileSync(f, 'utf8');
  for (const [from] of Object.entries(MAP)) after[from] = (after[from] || 0) + (s.split(from).length - 1);
}

console.log('\n── DEAD INTERNAL LINK REPOINTING ────────────────────────────────────');
console.log('%-54s %7s %6s', 'url', 'before', 'after');
let bad = 0;
for (const [from, to] of Object.entries(MAP)) {
  console.log(from.padEnd(54), String(before[from]).padStart(7), String(after[from] || 0).padStart(6), '->', to);
  if ((after[from] || 0) !== 0) bad++;
}
console.log(`\nsource references remaining: ${Object.values(after).reduce((a, b) => a + b, 0)} (expect 0)`);
if (bad) { console.error('FAILED: dead references remain'); process.exit(1); }
