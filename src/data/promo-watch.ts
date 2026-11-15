/**
 * promo-watch.ts — the live-promotion watch list, shared by the validators.
 *
 * ── Why this is its own module ─────────────────────────────────────────────
 * It used to be a `const` inside validate-promo-prices.ts. Two validators now
 * need it, for opposite reasons:
 *
 *   validate-promo-prices  — a registry `price` must be the REGULAR price, so
 *                            it fails when the registry drifts down onto a
 *                            figure recorded here as a promotion.
 *
 *   validate-prose-prices  — from 15 November 2026 page copy may quote the LIVE
 *                            DEAL price (Ryan's decision), so a prose figure is
 *                            accepted when it matches either the registry price
 *                            or the promo recorded here.
 *
 * Those two rules only stay consistent if both read the same list, which is why
 * it lives here rather than in either script.
 *
 * ── The trade-off this list is carrying ────────────────────────────────────
 * Quoting live deal prices in evergreen copy is accurate today and wrong the
 * moment a sale ends. That is the SkyTrak+ failure mode: 76 stale figures, found
 * by hand. This list is the mitigation — every product whose copy quotes a deal
 * is recorded here with the regular price beside it, so the next sweep can find
 * them mechanically instead of by grep archaeology.
 *
 * **When a promotion ends, the fix is not to delete the entry.** Set `promo`
 * to the new figure (or remove the entry only once copy no longer quotes a
 * deal for it) and re-sweep the pages listed in `quotedOn`.
 *
 * ── Keeping it current ─────────────────────────────────────────────────────
 * When a recheck shows a promotion has become the standing price — it held for
 * weeks, or the strike-through is gone — update `regular` and say so in `note`.
 * When a product stops being promoted at all and no copy quotes a deal for it,
 * delete its entry. An empty watch list is a perfectly good state for this file.
 */

export type Watch = {
  regular: number;      // the struck-through "typical price" on the live listing
  promo: number;        // the sale figure seen at the same time
  seen: string;         // when it was read
  note?: string;
  /**
   * Pages whose copy quotes the PROMO figure rather than the regular one.
   * Populated from 15 November 2026 onward. These are the pages that go wrong
   * when the sale ends, so they are the sweep list — not a decoration.
   */
  quotedOn?: string[];
};

/**
 * Observed on live Amazon listings. Dates are when the listing was read.
 *
 * The SC4 Pro entry is intentionally present and intentionally failing-adjacent:
 * its registry price is the promo figure by an explicit decision (Ryan, 10 Nov),
 * so it is listed with `promo` equal to the registry value and is excluded from
 * the failure by the ACCEPTED set in validate-promo-prices rather than by being
 * omitted — the exposure should stay visible rather than disappear from the file.
 */
export const PROMO_WATCH: Record<string, Watch> = {
  'callaway-strata':             { regular: 499.00, promo: 374.99, seen: '2026-11-10' },
  'voice-caddie-sc200plus':      { regular: 229.99, promo: 179.99, seen: '2026-11-10' },
  'superspeed-golf-set':         { regular: 139.99, promo: 125.98, seen: '2026-11-10' },
  'mgi-zip-navigator':           { regular: 1693.59, promo: 1527.47, seen: '2026-11-14',
                                   note: 'Listed typical price read 1,695.00 on 10 Nov and 1,693.59 on 14 Nov.' },
  'precision-pro-nx9-hd':        { regular: 199.98, promo: 161.49, seen: '2026-11-10',
                                   note: 'Left at the regular price throughout; never drifted.' },

  // Added 13 November 2026 from the Black Friday recheck. Each was read on the
  // live listing with its discount badge, two weeks before Black Friday.
  'garmin-approach-s12':         { regular: 199.99, promo: 149.99, seen: '2026-11-15',
                                   note: 'Re-read 15 Nov: still $149.99, -25%, flagged "lowest price in 30 days". Unchanged since 13 Nov.',
                                   quotedOn: ['/black-friday-golf-deals/', '/best-golf-gps-watch-under-300/',
                                              '/25-golf-accessories-every-golfer-should-own/',
                                              '/best-gps-golf-watch-high-handicappers/',
                                              '/best-golf-gps-watch-under-200/'] },

  /**
   * MERGED 15 November 2026. This key was present TWICE — a duplicate in a
   * `Record`, so the 10 Nov observation (regular 489.99) was silently
   * overwritten by the 13 Nov one and never checked against anything. Both
   * readings are kept in the note because the point of the pair was that this
   * listing moves. The duplicate-key guard in validate-promo-prices now makes
   * that class of mistake fail the build instead of vanishing.
   */
  'garmin-approach-z30':         { regular: 449.99, promo: 399.99, seen: '2026-11-13',
                                   note: 'Typical read 489.99 on 7 Nov, 449.99 on 10 Nov, promo 399.99 on 13 Nov — this listing moves. Registry has carried 449.99 since September; treat as standing unless it rises.' },

  'rapsodo-mlm2pro':             { regular: 599.00, promo: 549.98, seen: '2026-11-13',
                                   note: 'New unit at Amazon, sold by Rapsodo. Not the certified pre-owned listing PlayBetter carries near the same figure.' },
  'flightscope-mevo-gen2':       { regular: 1299.00, promo: 1149.00, seen: '2026-11-13',
                                   note: 'Held the same 150 discount from 5 to 13 November.' },
  'swing-caddie-sc4-pro':        { regular: 599.97, promo: 499.99, seen: '2026-11-10',
                                   note: 'ACCEPTED: registry deliberately holds the promo figure (decision 10 Nov 2026). The "Back Under $500" section on /best-budget-launch-monitor-apartment/ depends on it. RESOLVED 14 Nov 2026: Sprint 233 flagged that three readings with no strike-through suggested $499.99 had become standing. PlayBetter lists the same unit at $599.99 on 14 Nov, so $599.97 is still the regular price and this entry stays as it is.' },

  // Added 15 November 2026. The GPS family went on deal between the 14 Nov sweep
  // and this one, which is why these are here a week before the next full sweep.
  // Each was read on its live Amazon listing on 15 November.
  'shot-scope-v5':               { regular: 249.99, promo: 209.99, seen: '2026-11-15',
                                   note: 'Sold by Shot Scope, in stock, -16% "Limited time deal". The $209.99 has now held since 7 September, so it behaves like the standing price even though Amazon still badges it as a deal. Registry carries ~$210 for that reason.',
                                   quotedOn: ['/best-golf-gps-watches/', '/arccos-caddie-review/',
                                              '/arccos-vs-garmin-shot-tracking/', '/garmin-approach-s62-review/',
                                              '/how-to-sneak-in-more-golf-rounds/'] },
  'garmin-approach-s62':         { regular: 459.90, promo: 399.90, seen: '2026-11-15',
                                   note: 'Explicit "Black Friday Deal" badge: $60 off a $459.90 strike, 16 left, sold by a third party (Top Sports). The registry keeps 459.90 as the regular. This is the one to re-read first after Black Friday.',
                                   quotedOn: ['/garmin-approach-s62-review/', '/arccos-caddie-review/',
                                              '/best-gps-golf-watch-high-handicappers/'] },
  'garmin-approach-s42':         { regular: 299.99, promo: 249.99, seen: '2026-11-15',
                                   note: 'List $299.99 with a "Limited time deal"; buy box is a third-party reseller (AMZDistributor), so the $249.99 is a reseller figure rather than Garmin or Amazon. Quoted on the gift pages, which are read for weeks — recheck before Christmas.',
                                   quotedOn: ['/best-christmas-golf-gifts/', '/best-golf-gifts-for-couples/'] },
};
