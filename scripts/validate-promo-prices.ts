#!/usr/bin/env node
/**
 * validate-promo-prices.ts — a registry `price` must be the product's regular
 * price, never a sale price.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * On 7 November 2026 a sweep re-priced 39 products from live Amazon listings.
 * Amazon shows a struck-through "typical price" when the current figure is a
 * promotion. That field was read for some products and not others, and seven
 * promotions went into the registry as though they were the standing price:
 *
 *     callaway-strata           $374.99   typical $499.00
 *     swing-caddie-sc4-pro      $499.99   typical $599.97
 *     voice-caddie-sc200plus    $179.99   typical $229.99
 *     superspeed-golf-set       $125.98   typical $139.99
 *     mgi-zip-navigator         $1,521    typical $1,695.00
 *     alphard-cybercart-push+   $169.90   promo ended within 3 days
 *     footjoy-tour-alpha        $113.06   promo ended within 3 days
 *
 * Two had already snapped back three days later, and both then UNDERSTATED
 * what Amazon charges — the direction that costs clicks, because a reader lands
 * on a higher price than the page promised.
 *
 * The worst one was not the number. The SC4 Pro had been retired from an
 * "under $500" page when it rose to $599; the $499.99 promo reading was used to
 * restore it as the pick, so a page's editorial verdict came to rest on a sale
 * that can end without notice.
 *
 * Sprint 225 and 229 both got this right by keeping the regular price in the
 * registry and putting the promotion in the note and on the deal pages. This
 * check makes that convention enforceable instead of remembered.
 *
 * ── How it works ───────────────────────────────────────────────────────────
 * `PROMO_WATCH` records, per key, the regular price observed on the live
 * listing alongside the promotional figure seen at the same time. The check
 * fails when a registry `price` has drifted back down onto a figure recorded as
 * a promotion.
 *
 * It is a watch-list rather than a live lookup on purpose: the build must not
 * depend on the network, and "what is the regular price" is a judgement made
 * when a human reads the listing, not something a build step can infer.
 *
 * ── Keeping it current ─────────────────────────────────────────────────────
 * When a recheck shows a promotion has become the standing price — it held for
 * weeks, or the strike-through is gone — update the entry's `regular` and say
 * so in the comment. When a product stops being promoted at all, delete its
 * entry. An empty watch list is a perfectly good state for this file.
 *
 * What it deliberately does NOT do: fail because a price is low. A product can
 * be genuinely cheap. It fails only when the registry figure matches a number
 * already written down as "this one is a sale".
 */

import { readFileSync } from 'node:fs';
import { AFFILIATE } from '../src/data/affiliate-links.ts';
import { PROMO_WATCH } from '../src/data/promo-watch.ts';

// The watch list now lives in src/data/promo-watch.ts because validate-prose-prices
// needs the same data (page copy may quote a live deal price from 15 Nov 2026).


/**
 * Keys where the registry is knowingly set to the promotional figure.
 * Each needs a dated reason, because each is a page that goes wrong quietly
 * when the sale ends.
 */
const ACCEPTED = new Set<string>([
  'swing-caddie-sc4-pro',   // 10 Nov 2026 — explicit decision; recheck on the Black Friday cadence
  'garmin-approach-z30',    // carried since September; behaves as the standing price
  // 15 Nov 2026 — the $209.99 has held on the live listing since 7 September, ten
  // weeks, sold by Shot Scope itself. Amazon still badges it a "Limited time deal"
  // and shows a $249.99 strike, but a deal that outlasts a quarter is the price.
  // Same test applied to the SC4 Pro in Sprint 236, which went the other way
  // because a second retailer still listed the regular figure.
  // Recheck after Black Friday: if it rises to $249.99 the registry moves with it,
  // and the five pages in this key's `quotedOn` need re-sweeping.
  'shot-scope-v5',
  // 16 Nov 2026 — Amazon has the SkyTrak+ at $995 new, badged a 30-day low against
  // a $1,195 typical price, in stock and sold by SkyTrak Golf. The registry has
  // carried $995 since Sprint 238 and 47 figures across 27 pages derive from it,
  // so this is ACCEPTED rather than repriced: moving it is its own sprint.
  // Two things make it lower-risk than it looks. The unit is badged previous
  // generation, with the SkyTrak ST MAX now the current model at $1,695 — so the
  // $995 is a clearance direction of travel, not a sale that snaps back. And
  // PlayBetter, which listed $1,195, has sold out entirely.
  // Recheck at the Black Friday sweep. If $995 ends, the pages to fix are every
  // one quoting a SkyTrak+ build total.
  'skytrak-plus',
]);

const num = (v: unknown): number | null => {
  if (typeof v !== 'string') return null;
  const q = v.replace(/[^\d.]/g, '');
  if (!q) return null;
  const n = parseFloat(q);
  return Number.isFinite(n) ? n : null;
};

const problems: string[] = [];
const accepted: string[] = [];
let watched = 0;

/**
 * Duplicate-key guard. PROMO_WATCH is a `Record`, so a key written twice is not
 * an error — the later entry silently replaces the earlier one and the earlier
 * observation is never checked against anything. That happened to
 * garmin-approach-z30, which carried two contradictory records from 10 and 13
 * November until 15 November. A Record cannot be inspected for this after the
 * fact, so the check reads the source text.
 */
{
  const src = readFileSync(new URL('../src/data/promo-watch.ts', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('export const PROMO_WATCH'));
  const keys = [...body.matchAll(/^\s{2}'([a-z0-9-]+)':/gm)].map(m => m[1]);
  const dupes = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
  if (dupes.length) {
    console.error(`\n\u274c PROMO_WATCH has duplicate key(s): ${dupes.join(', ')}`);
    console.error('   A Record keeps only the last one, so the earlier observation is silently dropped.');
    console.error('   Merge them into a single entry and record both readings in its note.\n');
    process.exit(1);
  }
}

for (const [key, w] of Object.entries(PROMO_WATCH)) {
  const rec = (AFFILIATE as Record<string, any>)[key];
  if (!rec) {
    problems.push(`${key} — on the promo watch list but no longer in the registry. Remove the watch entry.`);
    continue;
  }
  const price = num(rec.price);
  if (price === null) continue;   // bundle or per-period price; nothing to compare
  watched++;

  const onPromo = Math.abs(price - w.promo) < 0.51;
  if (!onPromo) continue;

  if (ACCEPTED.has(key)) {
    accepted.push(`${key} at $${price} (regular $${w.regular})${w.note ? ' — ' + w.note : ''}`);
    continue;
  }
  problems.push(
    `${key}\n` +
    `      registry price : $${price}  <- this is the sale figure\n` +
    `      regular price  : $${w.regular}  (struck-through on the listing, read ${w.seen})` +
    (w.note ? `\n      note           : ${w.note}` : ''),
  );
}

if (problems.length) {
  console.error(`\n❌ Promo prices: ${problems.length} registry price(s) are a sale figure, not the regular price.\n`);
  problems.forEach(p => console.error('   ' + p + '\n'));
  console.error(
    '   The registry holds regular prices; promotions belong in priceNote and on\n' +
    '   the deal pages. A sale baked in as the standing price understates the cost\n' +
    '   the moment it ends, which is the direction that loses the click — and it can\n' +
    '   leave a page\'s editorial verdict resting on a discount.\n' +
    '   If a promotion has genuinely become the standing price, update `regular` in\n' +
    '   src/data/promo-watch.ts and write down why.\n',
  );
  process.exit(1);
}

console.log(
  `✅ Promo prices: ${watched} watched product(s) hold their regular price` +
  (accepted.length ? `; ${accepted.length} accepted exception(s): ${accepted.join(' | ')}` : '') + '.',
);
