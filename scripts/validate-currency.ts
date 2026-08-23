#!/usr/bin/env node
/**
 * validate-currency.ts — a page that promises the current year must not lead
 * with a product the registry itself knows has been replaced.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * /best-golf-gps-watches/ carried 11,227 impressions at position 24.9, and its
 * table winner was the Garmin Approach S62 — a 2020 watch — while the newer S70
 * sat near the bottom of the same page. /best-golf-drivers-under-400/, titled
 * "Tested for 2026", led with the TaylorMade SIM Max, a 2020 head, and had no
 * current-generation driver anywhere on it.
 *
 * Every existing validator checks internal consistency: does the table price
 * match the registry, does the alt text name the right product, does the CTA
 * sell something the page recommends. Nothing checked whether the recommendation
 * is still the current thing to buy. That gap also produced the E-Z-GO Freedom
 * RXV (retired), the discontinued Optoma projectors, and the Bag Boy Volt at a
 * price two generations old.
 *
 * ── What it can and cannot know ────────────────────────────────────────────
 * It cannot know release dates — nothing in the repo records them, and guessing
 * them would be exactly the kind of assumption that keeps going wrong here.
 *
 * What it CAN do is notice when the registry already contains a newer
 * generation of the same family. If both `garmin-approach-s62` and
 * `garmin-approach-s70` exist, the site itself knows the S70 came later; a
 * year-titled page leading with the S62 is asserting something the registry
 * contradicts.
 *
 * ── Why it does not simply flag every older model ──────────────────────────
 * The first version of this check fired on eleven pages and most were correct
 * as written:
 *
 *   /best-golf-gps-watch-under-200/  leads with the S12 → "newer: S70"
 *   /best-budget-launch-monitor/     leads with the R10 → "newer: R50"
 *
 * Both are right. A price-capped page MUST lead with a product inside its cap,
 * and the newer model costs three times the ceiling. Flagging those would have
 * made the check noise, and a checker that cries wolf gets switched off — so a
 * successor only counts if it is within 40% of the incumbent's price, i.e. a
 * plausible like-for-like replacement rather than an upsell.
 */

import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const PRICE_BAND = 1.4;   // a successor must be a like-for-like replacement
const ALLOWED = new Set<string>([
  // Deliberate: this page's whole angle is previous-generation value, and it
  // says so in the heading. The current pick leads; the old head is the
  // runner-up and is labelled as such.
  '/best-golf-drivers-under-400/|taylormade-sim2-max',
]);

const num = (p?: string): number | null => {
  const m = p?.match(/\$\s*([\d,]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

/** stem + trailing model number, e.g. garmin-approach-s62 → {garmin-approach-s, 62} */
function family(key: string) {
  const m = key.match(/^(.*?[a-z-]*?)(\d+)([a-z-]*)$/);
  return m ? { stem: m[1], num: parseInt(m[2], 10), tail: m[3] } : null;
}

const keys = Object.keys(AFFILIATE);
const successors = new Map<string, string[]>();
{
  const groups = new Map<string, Array<{ key: string; num: number }>>();
  for (const k of keys) {
    const f = family(k);
    if (!f) continue;
    if (!groups.has(f.stem)) groups.set(f.stem, []);
    groups.get(f.stem)!.push({ key: k, num: f.num });
  }
  for (const [, g] of groups) {
    if (g.length < 2) continue;
    const max = Math.max(...g.map(x => x.num));
    for (const x of g) {
      if (x.num >= max) continue;
      const mine = num((AFFILIATE as any)[x.key]?.price);
      const newer = g.filter(y => y.num === max).filter(y => {
        const p = num((AFFILIATE as any)[y.key]?.price);
        // like-for-like only: an upsell to triple the price is not a replacement
        return mine != null && p != null && p <= mine * PRICE_BAND;
      });
      if (newer.length) successors.set(x.key, newer.map(y => y.key));
    }
  }
}

const problems: string[] = [];
for (const a of ARTICLES as any[]) {
  if (!/20\d\d/.test(String(a.title ?? ''))) continue;
  const rows = a.comparisonTable?.rows ?? [];
  const lead = rows.find((r: any) => r.winner) ?? rows[0];
  const key = lead?.affiliateKey ?? a.quickAnswerProduct;
  if (!key || !successors.has(key)) continue;
  if (ALLOWED.has(`${a.slug}|${key}`)) continue;
  problems.push(
    `   ${a.slug}\n      leads with ${key} (${(AFFILIATE as any)[key]?.price}) — ` +
    `the registry already has ${successors.get(key)!.join(', ')} at a comparable price`);
}

if (problems.length) {
  console.error(`\n❌ ${problems.length} year-titled page(s) lead with a superseded product.`);
  console.error('A page promising the current year should not recommend a model the registry');
  console.error('itself knows has a like-for-like successor. Promote the newer one, or add the');
  console.error('page to ALLOWED with the reason if leading with the older model is deliberate.\n');
  problems.forEach(p => console.error(p));
  process.exit(1);
}
console.log(`✅ Currency: no year-titled page leads with a superseded product ` +
            `(${successors.size} product(s) have a like-for-like successor).`);
