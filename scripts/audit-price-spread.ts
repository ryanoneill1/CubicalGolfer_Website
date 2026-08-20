#!/usr/bin/env node
// audit-price-spread.ts — how many DIFFERENT prices does each product carry?
//
// The prose checker surfaces one conflict at a time: "this sentence says $399,
// the registry says $599." Chasing them one by one suggested a bigger pattern,
// so this counts every distinct price attributed to each product across the
// whole site — data records, comparison rows, and .astro pages.
//
// The Wilson D9 turned out to appear at $399, $499 and $699 on a single page,
// with the registry saying $599 and MSRP at $649. That is not one error to fix.
// It is a product with no canonical price.
//
// Uses the same grammar-based attribution as validate-prose-prices.ts, so a
// number merely NEAR a name is not counted.

import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import fs from 'fs';
import path from 'path';

const money = (s: string) => Number(s.replace(/[$,]/g, ''));
const regPrice = (s: any) => {
  const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m ? money(m[1]) : 0;
};

const NOT_A_PRICE = /\b(less|more|off|cheaper|extra|save[sd]?|saving|difference|than|vs\.?|versus|under|over|below|above|from|starting|up to|per|each|\/yr|\/mo|year|month|total|combined|package|bundle|setup|worth|apart)\b/i;
const QUALIFIED = /\b(used|refurb\w*|open box|prev(?:ious)?[- ]gen\w*|closeout|renewed|\d+\s*-?\s*(pack|pk|dozen|pairs?)|bundle|package|kit|set of)\b/i;

const all: any[] = [...(ARTICLES as any), ...(COMPARISONS as any)];

function astroSources() {
  const out: Array<{ slug: string; text: string }> = [];
  const walk = (dir: string, base = '') => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full, `${base}/${e.name}`); continue; }
      if (!e.name.endsWith('.astro') || base.includes('[') || e.name.includes('[')) continue;
      out.push({ slug: `${base}/`, text: fs.readFileSync(full, 'utf8') });
    }
  };
  walk('src/pages');
  return out;
}

const sources = [
  ...all.map(a => ({ slug: String(a.slug), text: JSON.stringify(a) })),
  ...astroSources(),
];

// Unambiguous display names only.
const names: Array<{ key: string; name: string; reg: number }> = [];
{
  const keysByName = new Map<string, Set<string>>();
  const nameByKey = new Map<string, string>();
  for (const a of all)
    for (const r of (a.comparisonTable?.rows ?? [])) {
      if (!r?.affiliateKey || !r?.name) continue;
      const nm = String(r.name).trim();
      if (nm.length < 8) continue;
      if (!keysByName.has(nm)) keysByName.set(nm, new Set());
      keysByName.get(nm)!.add(r.affiliateKey);
      if (!nameByKey.has(r.affiliateKey)) nameByKey.set(r.affiliateKey, nm);
    }
  for (const [key, name] of nameByKey) {
    if ((keysByName.get(name)?.size ?? 0) > 1) continue;
    const reg = regPrice((AFFILIATE as any)[key]?.price);
    if (reg) names.push({ key, name, reg });
  }
}

/** key -> price -> pages that say it */
const spread = new Map<string, Map<number, Set<string>>>();

for (const src of sources) {
  const text = src.text.replace(/<[^>]+>/g, ' ').replace(/\\n/g, ' ');
  for (const raw of text.split(/(?<=[.!?])\s+|","|\},\{/)) {
    const sentence = raw.replace(/\s+/g, ' ').trim();
    if (sentence.length < 12 || !sentence.includes('$')) continue;

    for (const { key, name } of names) {
      const at = sentence.indexOf(name);
      if (at === -1) continue;
      const after = sentence.slice(at + name.length, at + name.length + 22);
      const m = after.match(/^[\s]*(?:\(|—|-|:)?\s*(?:is|costs?|retails? for|sells? for|at|for)?\s*~?\$\s*([0-9][0-9,]*)/);
      if (!m) continue;
      const said = money(m[1]);
      if (!said) continue;
      const gap = after.slice(0, after.indexOf(m[1]));
      if (NOT_A_PRICE.test(gap) || gap.includes(',')) continue;
      if (QUALIFIED.test(sentence.slice(Math.max(0, at - 40), at + name.length + 40))) continue;
      const trailing = sentence.slice(at + name.length + after.indexOf(m[1]) + m[1].length, at + name.length + 40);
      if (NOT_A_PRICE.test(trailing.slice(0, 16))) continue;
      if (/^\s*[-–—]\s*\$?\s*[0-9]/.test(trailing) || /^\s*(for|of|with|toward)\b/i.test(trailing)) continue;

      if (!spread.has(key)) spread.set(key, new Map());
      const byPrice = spread.get(key)!;
      if (!byPrice.has(said)) byPrice.set(said, new Set());
      byPrice.get(said)!.add(src.slug);
      break;
    }
  }
}

// Fold in the registry price as one more voice.
for (const { key, reg } of names) {
  if (!spread.has(key)) continue;
  const byPrice = spread.get(key)!;
  if (!byPrice.has(reg)) byPrice.set(reg, new Set());
  byPrice.get(reg)!.add('(registry)');
}

const rows = [...spread.entries()]
  .map(([key, byPrice]) => ({ key, prices: [...byPrice.keys()].sort((a, b) => a - b), byPrice }))
  .filter(r => r.prices.length > 1)
  .sort((a, b) => b.prices.length - a.prices.length || (b.prices.at(-1)! / b.prices[0]) - (a.prices.at(-1)! / a.prices[0]));

console.log(`Products carrying more than one price across the site: ${rows.length}\n`);
for (const r of rows.slice(0, 20)) {
  const spreadX = (r.prices.at(-1)! / r.prices[0]).toFixed(1);
  console.log(`${r.key.padEnd(32)} ${r.prices.length} prices, ${spreadX}x spread: $${r.prices.join(', $')}`);
  for (const p of r.prices) {
    const where = [...r.byPrice.get(p)!].slice(0, 3).join(', ');
    console.log(`      $${String(p).padEnd(6)} ${where}`);
  }
  console.log();
}
