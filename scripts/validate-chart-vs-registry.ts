#!/usr/bin/env node
/**
 * validate-chart-vs-registry.ts — the compression chart keeps its OWN ball table.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * /golf-ball-compression-chart/ is 35% of this site's clicks. It does not read
 * prices from the registry for display — it has a `const balls = [...]` array
 * with its own `price:` column, and only calls the registry for the buy URL.
 *
 * That meant every price validator on the site — table-vs-registry, prose-prices,
 * same-page-prices, pros-cons-prices — was blind to the single most-read price
 * table on the site. On 2026-09-01 **20 of its 34 rows disagreed with the
 * registry**: Titleist Velocity showed $30 against a live $25, Vice Pro showed
 * $33 against $39, Wilson Chaos showed $28 against a real ~$12 a dozen.
 *
 * None of it was caught by anything, because nothing was looking.
 *
 * ── What this checks ───────────────────────────────────────────────────────
 * Every row's `affKey` resolves, and its integer `price` equals the registry
 * price rounded to the nearest dollar. Rounding is allowed because the chart
 * column is deliberately whole-dollar for readability; a $46.49 registry entry
 * may display as 46. Anything further apart is drift and fails.
 *
 * Rows flagged `discontinued: true` are skipped — they keep their compression
 * data and lose the buy button, so the price is historical reference.
 */
import fs from 'fs';
import { AFFILIATE } from '../src/data/affiliate-links.ts';

// The ball data used to live inline in the .astro page. It now lives in
// src/data/balls.ts, because the PDF generator kept a fourth hardcoded copy and
// drifted from the corrected prices. Reading the shared module means this guard
// checks whatever the page and the PDF actually render.
const SRC = 'src/data/balls.ts';
const src = fs.readFileSync(SRC, 'utf8');
const block = src.match(/export const balls = \[([\s\S]*?)\n\];/);

if (!block) {
  console.error('\n❌ Could not find the exported `balls` array in ' + SRC + '.\n');
  process.exit(1);
}

const num = (s: unknown): number | null => {
  const m = String(s).match(/([\d,]+(?:\.\d\d)?)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

const rows = [...block[1].matchAll(/\{[^{}]*\}/g)].map(m => m[0]);
const bad: string[] = [];
const missing: string[] = [];
let checked = 0, skipped = 0;

for (const r of rows) {
  const key = (r.match(/affKey: '([^']+)'/) ?? [])[1];
  const name = (r.match(/name: '([^']+)'/) ?? [])[1] ?? '?';
  if (!key) continue;

  if (/discontinued: true/.test(r)) { skipped++; continue; }

  const entry = (AFFILIATE as any)[key];
  if (!entry) { missing.push(`   ${name} → affKey '${key}' is not in the registry`); continue; }

  const chart = num((r.match(/price: (\d+)/) ?? [])[1]);
  const reg = num(entry.price);
  if (chart === null || reg === null) continue;

  checked++;
  const want = Math.round(reg);
  if (chart !== want) {
    bad.push(`   ${name.padEnd(26)} chart $${chart}  vs registry ${entry.price} (expected $${want})`);
  }
}

if (missing.length) {
  console.error(`\n❌ ${missing.length} chart row(s) reference a key that does not exist:\n`);
  console.error(missing.join('\n') + '\n');
}

if (bad.length) {
  console.error(
    `\n❌ ${bad.length} compression-chart price(s) disagree with the registry.\n` +
    `   This page is the site's largest by clicks and it keeps its own ball table,\n` +
    `   so no other price validator can see it. Sync the chart column to the registry.\n`
  );
  console.error(bad.join('\n') + '\n');
}

if (bad.length || missing.length) process.exit(1);

console.log(
  `✅ Compression chart: all ${checked} priced row(s) match the registry` +
  (skipped ? ` (${skipped} discontinued row(s) skipped).` : '.')
);
