#!/usr/bin/env node
/**
 * sweep-priority.ts — what to hand-check next, and why.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * check-live-listings.ts is the automated version of this job and it cannot do
 * it: Amazon blocks datacentre IPs, so the weekly CI run verifies roughly 9% of
 * the catalogue (128 of 140 "could not check" on 2026-08-31). A dead Garmin R10
 * ASIN sat on 26 articles and the gear quiz inside that unchecked 91%.
 *
 * What DOES work is a real browser on a real connection. Nine of the fourteen
 * high-value products checked that way in Sprints 97-105 were wrong — a 404 buy
 * button, a net priced at less than half, a launch monitor $1,800 over. But that
 * checking was ad hoc, so the same products got re-checked while others went
 * untouched for months.
 *
 * This ranks the queue instead of guessing at it:
 *
 *     score = commission earned per sale  x  pages  x  staleness multiplier
 *
 * Commission rather than sticker price, because the queue exists to protect
 * revenue. Ranking on price alone floated two golf carts to positions 4 and 6 —
 * $10,099 and $9,274 items that link to a manufacturer dealer locator and pay
 * 0%. Nothing is at risk there. A $2,499 Bushnell at 5% is $125 a sale; a $12
 * glove at 3% is 36 cents. Pages because an error on 26 pages is 26 errors.
 * Staleness because a product confirmed last week is not where the next error
 * is hiding.
 *
 * Not part of `npm run validate` — it reports, it does not gate.
 *   npm run sweep
 */
import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import fs from 'fs';

const TODAY = new Date();
const days = (iso?: string) =>
  iso ? Math.round((TODAY.getTime() - new Date(iso).getTime()) / 86_400_000) : null;

/** Never verified is worse than verified long ago — it is a complete unknown. */
function staleness(d: number | null): number {
  if (d === null) return 3.0;
  if (d <= 14) return 0.15;
  if (d <= 30) return 0.5;
  if (d <= 60) return 1.0;
  if (d <= 120) return 1.8;
  return 2.5;
}

const pages: Record<string, Set<string>> = {};
for (const a of ARTICLES as any[]) {
  const body = JSON.stringify(a);
  for (const m of body.matchAll(/"affiliateKey":"([a-z0-9-]+)"/g))
    (pages[m[1]] ??= new Set()).add(String(a.slug));
}

const money = (s?: string) => {
  const m = String(s ?? '').match(/\$?([\d,]+(?:\.\d+)?)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
};

const rows = Object.entries(AFFILIATE as any)
  .map(([key, e]: any) => {
    const d = days(e.verifiedOn);
    const price = money(e.price);
    const np = (pages[key]?.size ?? 0);
    const pct = Number(e.commissionPct ?? 3);
    const program = String(e.program ?? '');
    const perSale = price * pct / 100;
    return { key, price, np, d, pct, perSale, program, retailer: e.retailer ?? '?',
             score: Math.round(perSale * Math.max(np, 1) * staleness(d)) };
  })
  // program 'direct' means the link goes to the maker's own site — a dealer
  // locator for the golf carts, a download page for the free apps. Those carry a
  // default commissionPct of 3 that they do not actually earn, which floated two
  // carts into positions 4 and 6 on sticker price alone. Nothing is at risk there.
  .filter(r => r.price >= 40 && r.pct > 0 && r.program !== 'direct')
  .sort((a, b) => b.score - a.score);

const fmtAge = (d: number | null) => (d === null ? 'never' : d + 'd ago');
const lines = [
  '# Sweep priority — ' + TODAY.toISOString().slice(0, 10), '',
  'What to hand-check next. score = commission per sale x pages x staleness.',
  'CI verifies ~9% of listings because Amazon blocks datacentre IPs; this is the queue for the browser.', '',
  '| # | Product | Price | $/sale | Pages | Last verified | Retailer | Score |',
  '|---|---|---:|---:|---:|---|---|---:|',
  ...rows.slice(0, 40).map((r, i) =>
    `| ${i + 1} | \`${r.key}\` | $${r.price} | $${r.perSale.toFixed(0)} | ${r.np} | ${fmtAge(r.d)} | ${r.retailer} | ${r.score} |`),
  '',
  `${rows.filter(r => r.d === null).length} of ${rows.length} products over $40 have never been verified.`,
];
fs.mkdirSync('scripts/output', { recursive: true });
fs.writeFileSync('scripts/output/sweep-priority.md', lines.join('\n') + '\n');

console.log('Top 12 to check next:\n');
console.log('  score  $/sale   price  pages  last verified  key');
for (const r of rows.slice(0, 12))
  console.log('  ' + String(r.score).padStart(6) + String('$' + r.perSale.toFixed(0)).padStart(8) +
              String('$' + r.price).padStart(8) + String(r.np).padStart(7) + '  ' +
              fmtAge(r.d).padStart(12) + '  ' + r.key);
console.log('\n' + rows.filter(r => r.d === null).length + ' of ' + rows.length +
            ' products over $40 have never been verified.');
console.log('Report: scripts/output/sweep-priority.md');
