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

import { AFFILIATE } from '../src/data/affiliate-links.ts';

type Watch = {
  regular: number;   // the struck-through "typical price" on the live listing
  promo: number;     // the sale figure seen at the same time
  seen: string;      // when it was read
  note?: string;
};

/**
 * Observed on live Amazon listings, 7 and 10 November 2026.
 * The SC4 Pro entry is intentionally present and intentionally failing-adjacent:
 * its registry price is the promo figure by an explicit decision (Ryan, 10 Nov),
 * so it is listed with `promo` equal to the registry value and is excluded from
 * the failure by the ACCEPTED set below rather than by being omitted — the
 * exposure should stay visible rather than disappear from the file.
 */
const PROMO_WATCH: Record<string, Watch> = {
  'callaway-strata':             { regular: 499.00, promo: 374.99, seen: '2026-11-10' },
  'voice-caddie-sc200plus':      { regular: 229.99, promo: 179.99, seen: '2026-11-10' },
  'superspeed-golf-set':         { regular: 139.99, promo: 125.98, seen: '2026-11-10' },
  'mgi-zip-navigator':           { regular: 1695.00, promo: 1527.47, seen: '2026-11-10' },
  'precision-pro-nx9-hd':        { regular: 199.98, promo: 161.49, seen: '2026-11-10',
                                   note: 'Left at the regular price throughout; never drifted.' },
  'garmin-approach-z30':         { regular: 489.99, promo: 449.99, seen: '2026-11-10',
                                   note: 'Registry has carried 449.99 since September — treat as standing unless it rises.' },
  // Added 13 November 2026 from the Black Friday recheck. Each was read on the live
  // listing with its discount badge, two weeks before Black Friday.
  'garmin-approach-s12':          { regular: 199.99, promo: 149.99, seen: '2026-11-13',
                                   note: '25% off and featured on the Black Friday hub as a live deal.' },
  'garmin-approach-z30':          { regular: 449.99, promo: 399.99, seen: '2026-11-13',
                                   note: 'Showed a 489.99 typical on 7 Nov, then 449.99, now 399.99 — this listing moves.' },
  'rapsodo-mlm2pro':              { regular: 599.00, promo: 549.98, seen: '2026-11-13',
                                   note: 'New unit at Amazon, sold by Rapsodo. Not the certified pre-owned listing PlayBetter carries near the same figure.' },
  'flightscope-mevo-gen2':        { regular: 1299.00, promo: 1149.00, seen: '2026-11-13',
                                   note: 'Held the same 150 discount from 5 to 13 November.' },
  'swing-caddie-sc4-pro':        { regular: 599.97, promo: 499.99, seen: '2026-11-10',
                                   note: 'ACCEPTED: registry deliberately holds the promo figure (decision 10 Nov 2026). The "Back Under $500" section on /best-budget-launch-monitor-apartment/ depends on it.' },
};

/**
 * Keys where the registry is knowingly set to the promotional figure.
 * Each needs a dated reason, because each is a page that goes wrong quietly
 * when the sale ends.
 */
const ACCEPTED = new Set<string>([
  'swing-caddie-sc4-pro',   // 10 Nov 2026 — explicit decision; recheck on the Black Friday cadence
  'garmin-approach-z30',    // carried since September; behaves as the standing price
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
    '   scripts/validate-promo-prices.ts and write down why.\n',
  );
  process.exit(1);
}

console.log(
  `✅ Promo prices: ${watched} watched product(s) hold their regular price` +
  (accepted.length ? `; ${accepted.length} accepted exception(s): ${accepted.join(' | ')}` : '') + '.',
);
