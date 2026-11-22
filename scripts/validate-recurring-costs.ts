#!/usr/bin/env node
/**
 * validate-recurring-costs.ts — the renewal price has one home.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 248a (10 Nov 2026) corrected the Arccos renewal from $99/yr to
 * $199.99/yr "and fixed the cascade". On 22 November three $99 figures were
 * still live, and one of them sat SIXTY CHARACTERS from a $199.99 in the same
 * comparison-table row:
 *
 *     cons: ['$199.99/year membership required after year one, …'],
 *     price: '~$249 + $99/yr'
 *
 * The registry's own priceNote carried the stale $99 too, plus a three-year
 * total derived from it ($447.99, where $649.97 is correct). Nothing checked
 * any of it, because every price guard we had looks at the PURCHASE price. A
 * subscription is the second number a reader has to care about and it had no
 * owner at all.
 *
 * ── The rule ───────────────────────────────────────────────────────────────
 * A product with a genuine recurring fee declares it once, in `recurring`.
 * Anywhere that product is named and a per-year or per-month figure follows,
 * the figure must be one the product actually charges.
 *
 * `recurring` is prose, not a number, because the real world is not one
 * number: Golfshot sells Pro at $79.99/year AND Champions at $99.99/year, and
 * both are correct. Every amount appearing in the field is allowed; anything
 * else is a fault.
 *
 * ── What it deliberately does not flag ─────────────────────────────────────
 * The window stops at the next product name, at the end of the sentence and at
 * the end of the string literal — all three lessons the ball-figure guard
 * learned the hard way, the last one in Sprint 266 after a "fix" that silently
 * dropped 25 real checks. A qualifier before the figure ("saves $199.99/year",
 * "versus $99/year") means the number is a comparison, not this product's
 * charge.
 */
import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import fs from 'fs';
import path from 'path';

/** Ratchet. Only ever edit downward. */
/**
 * Ratchet. Opens at 2, both on registry entries that have never had a dated
 * price check: The Grint's table cell says $8/mo against a registry price
 * field of $9.99/mo, and 18Birdies says $10/mo against $11.99/mo. Neither side
 * is sourced, so correcting either would be a guess — the same rule used all
 * week. Two live app-store checks close it to 0.
 *
 * Only ever edit downward.
 */
const CEILING = 0;

const A = AFFILIATE as Record<string, any>;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const amounts = (s: string) =>
  new Set((String(s).match(/\$\s*([0-9][0-9,]*(?:\.[0-9]{2})?)/g) ?? [])
    .map(x => x.replace(/[$,\s]/g, '')));

/** Products that declare a recurring fee, and the display names they go by. */
type Watched = { key: string; names: string[]; allowed: Set<string>; declared: string };
const watched: Watched[] = [];
for (const key of Object.keys(A)) {
  const rec = A[key].recurring;
  if (!rec) continue;
  const names = new Set<string>();
  if (A[key].imgAlt) names.add(String(A[key].imgAlt).replace(/\s+(golf\s+)?(balls?|set|sensors?)$/i, '').trim());
  for (const a of ARTICLES as any[])
    for (const r of (a.comparisonTable?.rows ?? []))
      if (r?.affiliateKey === key && r?.name) names.add(String(r.name).trim());
  const usable = [...names].filter(n => n.length >= 8);
  if (!usable.length) {
    console.error(`\n❌ '${key}' declares a recurring cost but has no usable display name to find it by.`);
    console.error(`   Give it an imgAlt or a comparison-table row, or this guard cannot check it.\n`);
    process.exit(1);
  }
  watched.push({ key, names: usable.sort((a, b) => b.length - a.length), allowed: amounts(rec), declared: String(rec) });
}

/** Every display name on the site, so a window can stop at the next product. */
const allNames: string[] = [];
for (const a of ARTICLES as any[])
  for (const r of (a.comparisonTable?.rows ?? []))
    if (r?.name && String(r.name).length >= 8) allNames.push(String(r.name).trim());
for (const w of watched) allNames.push(...w.names);
const anyName = new RegExp([...new Set(allNames)].sort((a, b) => b.length - a.length).map(esc).join('|'), 'g');

function sources(): Array<{ file: string; text: string }> {
  const out = [
    { file: 'src/data/articles.ts', text: fs.readFileSync('src/data/articles.ts', 'utf8') },
    { file: 'src/data/comparisons.ts', text: fs.readFileSync('src/data/comparisons.ts', 'utf8') },
    { file: 'src/data/affiliate-links.ts', text: fs.readFileSync('src/data/affiliate-links.ts', 'utf8') },
  ];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      if (e.name.endsWith('.astro')) out.push({ file: full, text: fs.readFileSync(full, 'utf8') });
    }
  };
  walk('src/pages');
  return out;
}

/** A figure introduced by one of these is a comparison, not this product's fee. */
const LEAD_QUALIFIER =
  /\b(?:saves?|saving|versus|vs\.?|compared to|instead of|rather than|beats?|than|unlike|no|without|avoids?|free of)\s+(?:about\s+|roughly\s+|around\s+)?~?\$?$/i;

type Fault = { file: string; key: string; name: string; said: string; declared: string; quote: string };
const faults: Fault[] = [];
let checked = 0;

for (const { file, text } of sources()) {
  for (const w of watched) {
    for (const name of w.names) {
      for (const h of text.matchAll(new RegExp(esc(name), 'g'))) {
        const from = h.index! + name.length;
        // a longer product name starting here is a different product
        if (/^[A-Za-z0-9]/.test(text.slice(from, from + 1))) continue;

        let stop = Math.min(from + 160, text.length);
        anyName.lastIndex = from;
        let o: RegExpExecArray | null;
        while ((o = anyName.exec(text))) {
          if (o.index >= from && o[0] !== name) { stop = Math.min(stop, o.index); break; }
          if (o.index > from + 160) break;
        }
        const dot = text.indexOf('. ', from);
        if (dot >= 0) stop = Math.min(stop, dot);
        // structural ends only — never a field separator, which is how the
        // ball-figure guard lost 25 real checks in Sprint 266.
        for (const edge of ['],', '];', '},', '};', '\n']) {
          const e = text.indexOf(edge, from);
          if (e >= 0) stop = Math.min(stop, e);
        }
        const win = text.slice(from, stop);

        const m = win.match(/\$\s*([0-9][0-9,]*(?:\.[0-9]{2})?)\s*(?:\/\s*(?:yr|year|mo|month)|\s*(?:a|per)\s+(?:year|month)|\s*annually)/i);
        if (!m) continue;
        if (LEAD_QUALIFIER.test(win.slice(0, m.index))) continue;

        checked++;
        const said = m[1].replace(/,/g, '');
        // A renewal written as $200 when it is $199.99, or $199/yr in a narrow
        // table cell, is rounding for readability and not a wrong number.
        // Anything further out is a different figure and a reader would act on
        // it: $8/mo against $9.99/mo is a fifth of the price.
        const near = [...w.allowed].some(a => Math.abs(Number(a) - Number(said)) <= 1);
        if (w.allowed.has(said) || near) continue;
        faults.push({
          file, key: w.key, name, said: '$' + m[1], declared: w.declared,
          quote: text.slice(Math.max(0, h.index! - 30), stop).replace(/\s+/g, ' ').slice(0, 150),
        });
      }
    }
  }
}

/* ── Structural pass: comparison-table rows ──────────────────────────────
 * The text window above walks forward from the product NAME and stops at the
 * first structural edge. In a comparison row the name is followed by `pros`
 * and `cons` ARRAYS, so the window closes before it ever reaches `price` —
 * which is exactly where the Arccos "~$249 + $99/yr" fault lived. The guard
 * built to catch that fault could not see it, and a planted $129/yr passed.
 *
 * A row is structured data, so read the fields instead of scanning near them.
 */
const byKey = new Map(watched.map(w => [w.key, w]));

/** Every structure that pairs a product key with a price-ish field. */
function pricedNodes(a: any): Array<{ where: string; key?: string; fields: Record<string, any> }> {
  const out: Array<{ where: string; key?: string; fields: Record<string, any> }> = [];
  for (const r of (a.comparisonTable?.rows ?? []))
    out.push({ where: 'table row', key: r?.affiliateKey, fields: r ?? {} });
  // SECTIONS carry a price too. The Arccos "~$249 + $99/yr" fault lived on a
  // section — `{ h2, pros, cons, price, affiliateKey }` — and my first
  // structural pass only read comparison rows, so it still could not see the
  // one fault this whole guard exists for. Two wrong guesses about where the
  // data lives, in the same sprint.
  for (const sec of (a.sections ?? [])) {
    out.push({ where: 'section', key: sec?.affiliateKey, fields: sec ?? {} });
    for (const it of (sec?.items ?? []))
      out.push({ where: 'section item', key: it?.affiliateKey, fields: it ?? {} });
  }
  return out;
}

for (const a of ARTICLES as any[]) {
  for (const r of pricedNodes(a).map(p => ({ ...p.fields, affiliateKey: p.key, __where: p.where }))) {
    const w = r?.affiliateKey && byKey.get(r.affiliateKey);
    if (!w) continue;
    for (const field of ['price', 'feature1', 'feature2', 'desc', 'name'] as const) {
      const v = r[field];
      if (!v) continue;
      const m = String(v).match(/\$\s*([0-9][0-9,]*(?:\.[0-9]{2})?)\s*(?:\/\s*(?:yr|year|mo|month)|\s*(?:a|per)\s+(?:year|month))/i);
      if (!m) continue;
      checked++;
      const said = m[1].replace(/,/g, '');
      if (w.allowed.has(said)) continue;
      if ([...w.allowed].some(x => Math.abs(Number(x) - Number(said)) <= 1)) continue;
      // The text pass may already have reported this same row. Two passes
      // finding one fault is one fault, and double-counting would inflate the
      // ratchet into meaninglessness.
      if (faults.some(f => f.key === w.key && f.said === '$' + m[1])) continue;
      faults.push({
        file: `src/data/articles.ts (${a.slug} ${(r as any).__where} .${field})`,
        key: w.key, name: String(r.name ?? w.key), said: '$' + m[1], declared: w.declared,
        quote: `${field}: '${String(v)}'`,
      });
    }
  }
}

if (faults.length > CEILING) {
  console.error(`\n❌ ${faults.length} recurring-cost claim(s) disagree with the product's declared fee (ceiling ${CEILING}):\n`);
  for (const f of faults.slice(0, 25)) {
    console.error(`   ${f.file}`);
    console.error(`      ${f.name} — page says ${f.said}, '${f.key}' declares: ${f.declared}`);
    console.error(`      …${f.quote}…\n`);
  }
  console.error(`   The renewal price lives in the registry's \`recurring\` field. Change it`);
  console.error(`   there and the pages follow — do not retype it alongside the product.\n`);
  process.exit(1);
}

console.log(`✅ Recurring costs: ${checked} claim(s) across ${watched.length} subscription product(s) match their declared fee (ceiling ${CEILING}).`);
