#!/usr/bin/env node
// scripts/validate-prose-prices.ts
//
// Prose is the last unguarded price surface. The Bushnell Launch Pro sat at the
// wrong price in 78 rendered places because nothing compared what the sentences
// say against what the buy button sells.
//
// I built this three times with proximity matching and it produced a pile of
// false positives every time — "a putting mirror ($40), alignment sticks ($12),
// and a towel ($18)" matches mirror->$12 if you allow any gap. A number NEAR a
// product name is not a claim ABOUT that product.
//
// So this is deliberately built for precision over recall. It only fires when a
// price is ATTRIBUTED to a product by grammar, not by distance:
//
//     Product ($199)          Product costs $199        Product at $199
//     Product is $199         Product retails for $199  the $199 Product
//
// and only when the gap between the two contains no comma, no other product
// name, and no words that change the meaning of the number.
//
// Expect it to miss things. A check that misses is fixable; a check that cries
// wolf gets switched off.

import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import fs from 'fs';
import path from 'path';

/**
 * Ratchet. Only ever goes down.
 *
 * The 10 on the books are all genuine conflicts, but each needs a live price
 * check before it can be fixed — and which side is wrong is NOT obvious. The
 * Bushnell Launch Pro taught that: 78 pages said $2,499 against a registry
 * saying $2,999, and the pages were right. Assuming the registry wins would
 * have made 78 correct statements wrong.
 */
const THRESHOLD = 10;

const money = (s: string) => Number(s.replace(/[$,]/g, ''));

/** First price token only: '~$249 + $99/yr' is a $249 product. */
const regPrice = (s: any) => {
  const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m ? money(m[1]) : 0;
};

/**
 * Words that mean the following number is NOT the product's price:
 * a difference, a saving, a subscription, a bundle, a per-unit rate.
 */
const NOT_A_PRICE = /\b(less|more|off|cheaper|extra|save[sd]?|saving|difference|than|vs\.?|versus|under|over|below|above|from|starting|up to|per|each|\/yr|\/mo|year|month|total|combined|package|bundle|setup|worth|apart)\b/i;

/** Qualifiers that legitimately change the price: used, refurb, prev-gen, multi-pack. */
const QUALIFIED = /\b(used|refurb\w*|open box|prev(?:ious)?[- ]gen\w*|closeout|renewed|\d+\s*-?\s*(pack|pk|dozen|pairs?)|bundle|package|kit|set of)\b/i;

const all: any[] = [...(ARTICLES as any), ...(COMPARISONS as any)];

/**
 * .astro pages are prose too, and Sprint 23 missed them: eight wrong Bushnell
 * Launch Pro prices were sitting in four hand-written page files, invisible to
 * a check that only read the data records. Same blind spot Sprint 3 found for
 * affiliate links.
 */
function astroSources(): Array<{ slug: string; text: string }> {
  const out: Array<{ slug: string; text: string }> = [];
  const walk = (dir: string, base = '') => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full, `${base}/${e.name}`); continue; }
      if (!e.name.endsWith('.astro')) continue;
      if (base.includes('[') || e.name.includes('[')) continue;   // dynamic routes render data records
      const slug = e.name === 'index.astro' ? `${base || ''}/` : `${base}/${e.name.replace(/\.astro$/, '')}/`;
      out.push({ slug, text: fs.readFileSync(full, 'utf8') });
    }
  };
  walk('src/pages');
  return out;
}

const sources: Array<{ slug: string; text: string }> = [
  ...all.map(a => ({ slug: String(a.slug), text: JSON.stringify(a) })),
  ...astroSources(),
];

/** Display names harvested from table rows, longest first so "Pro V1x" beats "Pro V1". */
const names: Array<{ key: string; name: string; reg: number }> = [];
{
  // A display name is only usable if it identifies ONE product. "Ping G430" is
  // used for the hybrid ($270) AND the irons ($999); "Paradym Ai Smoke Max" for
  // the driver AND the irons. Those names cannot tell us which price a sentence
  // means, so they are dropped rather than guessed at — that ambiguity was the
  // entire false-positive population on the first run.
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
  let ambiguous = 0;
  for (const [key, name] of nameByKey) {
    if ((keysByName.get(name)?.size ?? 0) > 1) { ambiguous++; continue; }
    const reg = regPrice((AFFILIATE as any)[key]?.price);
    if (reg) names.push({ key, name, reg });
  }
  if (process.env.PROSE_PRICE_DEBUG) console.log(`  (${ambiguous} ambiguous name(s) skipped)`);
  names.sort((a, b) => b.name.length - a.name.length);
}
const ALL_NAMES = names.map(n => n.name);

type Hit = { slug: string; key: string; name: string; reg: number; said: number; quote: string };
const hits: Hit[] = [];

for (const a of sources) {
  // Work sentence by sentence so a claim can never reach across a full stop.
  const text = a.text.replace(/<[^>]+>/g, ' ').replace(/\\n/g, ' ');
  const sentences = text.split(/(?<=[.!?])\s+|","|\},\{/);

  for (const raw of sentences) {
    const sentence = raw.replace(/\s+/g, ' ').trim();
    if (sentence.length < 12 || !sentence.includes('$')) continue;

    for (const { key, name, reg } of names) {
      const at = sentence.indexOf(name);
      if (at === -1) continue;

      // Look only at the short window immediately after the name.
      const after = sentence.slice(at + name.length, at + name.length + 22);

      // Pattern A: name followed closely by a price.
      const mA = after.match(/^[\s]*(?:\(|—|-|:)?\s*(?:is|costs?|retails? for|sells? for|at|for)?\s*~?\$\s*([0-9][0-9,]*)/);
      // A "$199 Product" form was tried and removed. In a build list —
      // "Impact screen: $199 Fiberbuilt mat: $449" — the price BEFORE a product
      // name belongs to the previous line item, and that produced every
      // remaining false positive. Only a price that FOLLOWS the name counts.
      const m = mA;
      if (!m) continue;

      const said = money(m[1]);
      if (!said) continue;

      // The connective must not change the meaning of the number.
      const gap = after.slice(0, after.indexOf(m[1]));
      if (NOT_A_PRICE.test(gap)) continue;
      // Nor may the words right after it.
      const trailing = sentence.slice(at + name.length + after.indexOf(m[1]) + m[1].length, at + name.length + 40);
      if (NOT_A_PRICE.test(trailing.slice(0, 16))) continue;
      // Qualified pricing is honest.
      if (QUALIFIED.test(sentence.slice(Math.max(0, at - 40), at + name.length + 40))) continue;
      // A comma in the gap means we are inside a list.
      if (gap.includes(',')) continue;
      // Another product name between the two means the price may be its.
      if (ALL_NAMES.some(n => n !== name && gap.includes(n))) continue;

      // A range is a category span, not one product's price:
      //   "Garmin R10, Mevo+, Swing Caddie SC4 $200-$2,000"
      //   "Apple Watch + Golfshot: $399-$799 (watch)"
      if (/^\s*[-–—]\s*\$?\s*[0-9]/.test(trailing)) continue;
      // A price that explains what it buys is not the unit price:
      //   "Bushnell Launch Pro ($600 for FSX Pro + optional subscription)"
      if (/^\s*(for|of|with|toward)\b/i.test(trailing)) continue;

      // Ignore trivial drift; we are hunting wrong numbers, not rounding.
      if (Math.max(said / reg, reg / said) < 1.2) continue;

      hits.push({ slug: a.slug, key, name, reg, said, quote: sentence.slice(Math.max(0, at - 45), at + name.length + 45) });
      break; // one claim per sentence per product
    }
  }
}

if (hits.length > THRESHOLD) {
  console.error(`\n❌ ${hits.length} prose price claim(s) contradict the product they link to (ceiling ${THRESHOLD}):\n`);
  for (const h of hits.slice(0, 30)) {
    console.error(`   ${h.slug}`);
    console.error(`      "${h.name}" says $${h.said.toLocaleString()}, registry says $${h.reg.toLocaleString()}`);
    console.error(`      …${h.quote}…\n`);
  }
  if (hits.length > 30) console.error(`   …and ${hits.length - 30} more\n`);
  process.exit(1);
}

if (hits.length) {
  // Under the ceiling, but still worth seeing. A silent pass hides the backlog.
  console.log(`✅ Prose prices: ${hits.length} known conflict(s) within ceiling ${THRESHOLD}:`);
  for (const h of hits) {
    console.log(`   ${h.slug} — "${h.name}" says $${h.said.toLocaleString()}, registry says $${h.reg.toLocaleString()}`);
  }
} else {
  console.log(`✅ Prose prices: no sentence attributes a price to a product that contradicts the registry.`);
}
