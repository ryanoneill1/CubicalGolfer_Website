#!/usr/bin/env node
/**
 * validate-named-price-claims.ts — when prose puts a figure right next to a
 * product's name, that figure has to be the product's price. On every page,
 * not just the one that sells it.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 230 re-priced 39 products: the registry, 122 section `price` fields,
 * and every figure the existing checks flagged. Three days later a sweep found
 * 94 stale price mentions still live across 35 pages.
 *
 * All 94 sat outside the existing checks' field of view:
 *
 *   validate-prose-prices         a product vs the page that LINKS it
 *   validate-section-body-prices  a section's `price` vs its OWN body
 *   validate-proscons-prices      a pros/cons bullet vs the registry
 *
 * Each asks "is this product's own page right?". None asks "does some other
 * page quote an old price for it?" — so a gift list on a rangefinder
 * comparison page reading "alignment sticks ($12)" passed every gate while the
 * product's page, its button and its table all said $14.99. The dedicated page
 * was the worst case: title "The $15 Game Changer", button $14.99, body still
 * "a $12 pair" three times over.
 *
 * ── The hard part, and why two earlier attempts failed ─────────────────────
 * The obvious implementation — flag any currency figure near a product name —
 * does not work. Measured on this repo it produced 494 hits; switching to
 * "nearest product name wins" only brought it to 428. Reading them, the great
 * majority were legitimate sentences:
 *
 *     "Best Launch Monitor Around $500"        a heading
 *     "it regularly goes on sale under $500"   a claim about sales
 *     "From $200 range tools to $5,000 sims"   a range
 *     "spend the $200 savings on a mat"        a saving
 *     "a groove brush ($8), a glove ($18)"     a list of OTHER products
 *
 * That is the same wall two earlier body-copy checks hit — see the history
 * note in validate-stated-counts.ts — and that a Sprint 224 attempt hit again.
 * A check that reports 428 things of which 30 are real gets switched off, and
 * a switched-off check is worse than none because it trains everyone to ignore
 * a red build.
 *
 * ── What works: only price-ASSERTING grammar ────────────────────────────────
 * This version matches just the shapes where English is actually stating the
 * product's price:
 *
 *     Name ($X)        Name at $X        Name costs $X
 *     Name — $X        Name is $X        Name runs $X        Name for $X
 *
 * Budget framings ("under $200"), sums ("Total: $64"), savings and
 * neighbouring products in a list do not match these shapes at all. Measured:
 * 357 assertions found, 42 disagreed with the registry, and hand-reading them
 * put precision near 90%.
 *
 * ── Still a ratchet ────────────────────────────────────────────────────────
 * Prose is not a data field, so a hard zero would be brittle. This counts and
 * fails only when the count RISES. Lower the ceiling whenever you clear
 * mentions; never raise it without writing down why.
 *
 * ── Deliberately not flagged ───────────────────────────────────────────────
 *  - ranges: "$12-15", "$400 to $600", and the upper end of either
 *  - per-period figures where the registry is per-period too (/dz, /yr, /mo)
 *  - historical language — "verified", "down from", "previously", "dropped to"
 *    are all supposed to name an old figure
 *  - comparison titles that name two prices ("R50 vs MLM2PRO — $4,999 vs $699")
 *  - gap phrasing ("$445 Apart", "$50 cheaper", "$180 more than")
 *  - anything inside a `price:` data field — the three checks above own those
 *  - products whose own registry price is a bundle, range or per-period figure,
 *    because there is no single number to compare against
 */

import { AFFILIATE } from '../src/data/affiliate-links.ts';
import { PRODUCT_DISPLAY } from '../src/data/product-names.ts';
import fs from 'fs';

const CEILING = Number(process.env.NAMED_PRICE_CLAIM_CEILING ?? '0');
const TOLERANCE = 0.08;   // prose rounds: "about $500" for $499 is fine
const MIN_ABS = 4;        // and never flag a gap under $4

const FILES = ['src/data/articles.ts', 'src/data/comparisons.ts'];

const HISTORICAL =
  /verified|regular price|down from|up from|in august|in september|previously|briefly listed|typical price|recorded|since ended|dropped to|updated pricing|was \$|used to/i;

// gap/difference phrasing — the figure is a delta, not a price
const DELTA = /\bapart\b|\bcheaper\b|\bmore than\b|\bless than\b|\bdifference\b|\bsavings?\b|\bgap\b/i;

const num = (v: string): number | null => {
  const q = v.replace(/[^\d.]/g, '');
  if (!q) return null;
  const n = parseFloat(q);
  return Number.isFinite(n) ? n : null;
};

/** a registry price we can compare one number against */
const plainPrice = (p: unknown): number | null => {
  if (typeof p !== 'string') return null;
  if (!/^~?\$[\d,]+(?:\.\d{2})?$/.test(p.trim())) return null;
  return num(p);
};

/** drop the generic category tail so "Garmin Approach S62 Golf Watch" matches "Garmin Approach S62" */
const core = (d: string) =>
  d.replace(
    /\b(Golf|Launch Monitor|Rangefinder|GPS Speaker|Smartwatch|Watch|Complete Set|Driver|Putter|Irons?|Balls?|Glove|Shoes?|Bag|Net|Mat|Projector|Push Cart|Cart|Sensors?|Trainer|Sunglasses|Hat|Polo|Pants?|Jacket|Towel|Stand Bag|Cart Bag)\b/gi,
    ' ',
  ).replace(/\s+/g, ' ').trim();

/**
 * Two records can collapse to the same or overlapping name once the generic
 * tail is stripped: "Callaway Big Bertha B21 Iron Set" -> "Callaway Big Bertha
 * B21", which also matches a sentence about the Big Bertha B21 DRIVER. A first
 * cut of this check mispriced that sentence at the irons' $799. So a name only
 * claims a position when no LONGER product name matches there too.
 */
const ALL_NAMES: { key: string; name: string }[] = [];
for (const [k, r] of Object.entries(AFFILIATE as Record<string, any>)) {
  if (plainPrice(r?.price) === null) continue;
  const d = PRODUCT_DISPLAY[k];
  if (!d) continue;
  const n = core(d);
  if (n.length >= 5) ALL_NAMES.push({ key: k, name: n });
}
ALL_NAMES.sort((a, b) => b.name.length - a.name.length);
const claimedBy = (src: string, at: number): string | null => {
  for (const { key, name } of ALL_NAMES) {
    const seg = src.slice(at, at + name.length);
    if (seg.toLowerCase() === name.toLowerCase()) return key;
  }
  return null;
};

type Hit = { page: string; key: string; said: string; registry: string; ctx: string };
const hits: Hit[] = [];
let assertions = 0;

for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');

  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map(m => ({ i: m.index!, slug: m[1] }));
  const pageAt = (i: number) => {
    let last = file;
    for (const s of slugs) { if (s.i < i) last = s.slug; else break; }
    return last;
  };

  for (const [key, rec] of Object.entries(AFFILIATE as Record<string, any>)) {
    const reg = plainPrice(rec?.price);
    if (reg === null) continue;
    const display = PRODUCT_DISPLAY[key];
    if (!display) continue;
    const name = core(display);
    if (name.length < 5) continue;

    const N = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const MONEY = '~?\\\\?\\$([\\d,]+(?:\\.\\d{2})?)';
    const TAIL = '(?:</strong>|</a>)?';
    const patterns = [
      new RegExp(N + TAIL + '\\s*\\(' + MONEY + '\\)', 'gi'),
      new RegExp(N + TAIL + '\\s+(?:at|costs?|for|is|runs)\\s+(?:about\\s+|around\\s+|just\\s+)?' + MONEY, 'gi'),
      new RegExp(N + TAIL + '\\s*[—–-]\\s*' + MONEY, 'gi'),
    ];

    for (const re of patterns) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const v = num(m[1]);
        if (v === null) continue;
        const at = m.index;
        const win = src.slice(Math.max(0, at - 60), at + m[0].length + 60);

        if (HISTORICAL.test(win)) continue;
        if (DELTA.test(win)) continue;
        // a comparison title naming two prices
        if (/\bvs\b/i.test(win) && (win.match(/\$[\d,]/g) ?? []).length >= 2) continue;
        const tail = src.slice(at + m[0].length, at + m[0].length + 10);
        if (/^\s*(?:to|[–—-])\s*\$?\d/.test(tail)) continue;             // range
        if (/^\s*\/\s*(?:dz|dozen|yr|year|mo|month)/i.test(tail)) continue;
        if (/price:\s*'[^']*$/.test(src.slice(Math.max(0, at - 90), at))) continue;

        // longest-name-wins: another, more specific product may own this mention
        if (claimedBy(src, at) !== key) continue;

        assertions++;
        const gap = Math.abs(v - reg);
        if (gap < MIN_ABS) continue;
        if (gap / reg <= TOLERANCE) continue;

        hits.push({
          page: pageAt(at), key, said: '$' + m[1],
          registry: String(rec.price), ctx: win.replace(/\s+/g, ' ').trim(),
        });
      }
    }
  }
}

const seen = new Set<string>();
const unique = hits.filter(h => {
  const k = h.key + '|' + h.said + '|' + h.ctx.slice(0, 50);
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

if (unique.length > CEILING) {
  console.error(
    `\n❌ Named price claims: ${unique.length} place(s) put a figure beside a product name ` +
    `that its registry price contradicts (ceiling ${CEILING}).\n`,
  );
  const byKey: Record<string, Hit[]> = {};
  unique.forEach(h => { (byKey[h.key] ||= []).push(h); });
  for (const [key, rows] of Object.entries(byKey).sort((a, b) => b[1].length - a[1].length)) {
    console.error(`   ${key} — registry ${rows[0].registry}  (${rows.length})`);
    for (const r of rows.slice(0, 3)) {
      console.error(`      says ${r.said} on ${r.page}`);
      console.error(`         …${r.ctx.slice(0, 110)}`);
    }
  }
  console.error(
    '\n   These read as the product\'s price because the figure sits right against\n' +
    '   its name. They are on pages that MENTION the product rather than sell it,\n' +
    '   which is why the per-page price checks never see them — and how 94 stale\n' +
    '   figures survived a sprint that corrected the registry and every field.\n' +
    '   Fix the figure, or reword so it does not read as that product\'s price.\n',
  );
  process.exit(1);
}

console.log(
  `✅ Named price claims: ${assertions} price assertion(s) inspected across every page; ` +
  `${unique.length} disagree with the registry (ceiling ${CEILING}).`,
);
