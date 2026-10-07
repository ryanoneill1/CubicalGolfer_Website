#!/usr/bin/env node
/**
 * Guard: no page may use the same HTML id twice.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * /golf-ball-compression-chart/ used `id="compression-table"` on BOTH the <h2>
 * heading and the <table> beneath it. A stylesheet rule written for the table —
 *
 *     @media (max-width: 900px) { #compression-table { min-width: 780px } }
 *
 * — also matched the heading. The table lives inside an overflow-x wrapper and
 * scrolls happily at 780px; the heading does not, so it forced the whole
 * document to 780px on a 375px phone. Measured: 426px of horizontal overflow,
 * i.e. the page was more than twice as wide as the screen, on the page that is
 * 21% of this site's search traffic, for the 58% of visitors on mobile.
 *
 * A duplicate id is invalid HTML, but nothing here was looking, and the symptom
 * showed up nowhere near the cause. This check is three lines of regex and
 * would have caught it the day it shipped.
 *
 * Runs post-build against the real output. Ceiling 0.
 */
import fs from 'fs';
import path from 'path';

const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });

if (!fs.existsSync('dist')) { console.log('⏭  validate-duplicate-ids: no dist/, skipping.'); process.exit(0); }

const offenders: string[] = [];
let checked = 0;

for (const file of walk('dist')) {
  const html = fs.readFileSync(file, 'utf-8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  if (!ids.length) continue;
  checked++;
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) { if (seen.has(id)) dupes.add(id); seen.add(id); }
  if (dupes.size) {
    const slug = '/' + path.relative('dist', path.dirname(file)).split(path.sep).join('/') + '/';
    offenders.push(`${slug} — ${[...dupes].join(', ')}`);
  }
}

if (offenders.length) {
  console.error(`\n❌ ${offenders.length} page(s) reuse an HTML id (ceiling 0):`);
  offenders.slice(0, 25).forEach(o => console.error('   ' + o));
  if (offenders.length > 25) console.error(`   ...and ${offenders.length - 25} more`);
  console.error('   A duplicate id makes every #id CSS rule and querySelector ambiguous.');
  console.error('   Rename one, or scope the selector (e.g. table#foo rather than #foo).');
  process.exit(1);
}
console.log(`✅ Duplicate ids: ${checked} page(s) checked, every id unique within its page (ceiling 0).`);
