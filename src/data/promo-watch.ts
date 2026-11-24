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
  // Dates note, 20 November 2026: the sweep on the 20th re-read EVERY entry in
  // this file. Only the entries whose figures moved had their `seen` date
  // bumped at the time, which left five saying they were last read on the
  // 13th-16th when they had in fact been confirmed unchanged on the 20th —
  // garmin-approach-s12, garmin-approach-z30, swing-caddie-sc4-pro,
  // skytrak-plus and shot-scope-v5. Corrected here. A `seen` date means
  // "read on this day", not "changed on this day".

  // Retired in the 20 November 2026 sweep, because their promotions ended and
  // no copy quotes a deal for them any more — which is what this file says to
  // do rather than leaving an entry with promo == regular:
  //
  //   superspeed-golf-set   125.98 on 10 Nov, back to 139.99 on 20 Nov
  //   garmin-approach-s62   399.90 on 15 Nov from a third-party seller
  //                         (Top Sports), gone on 20 Nov, back to 459.90
  //   garmin-approach-s42   249.99 on 15 Nov from a reseller, gone on 20 Nov
  //
  // Each product's registry priceNote now carries that history, which is the
  // version a reader actually sees next to the buy button.

  'callaway-strata':             { regular: 493.00, promo: 339.99, seen: '2026-11-24',
                                   note: 'Deepened: 374.99 on 10 Nov, 339.99 on 20 Nov — now badged "Lowest price in 30 days", -32%. The biggest consumer-level cut in this sweep.' },
  'voice-caddie-sc200plus':      { regular: 223.99, promo: 167.99, seen: '2026-11-24',
                                   note: 'Explicit "Black Friday Deal" badge on 20 Nov at 167.99, -25%. Deepened from 179.99 on 10 Nov. Amazon\'s own typical price also drifted down, 229.99 to 223.99, so the regular here moves with it.' },
  'mgi-zip-navigator':           { regular: 1654.16, promo: 1341.00, seen: '2026-11-24',
                                   note: 'Explicit "Black Friday Deal" plus a "365-day low price" flag on 20 Nov: 1,341.00, -19%. Deepened hard from 1,527.47 on 14 Nov. The listed typical keeps sliding too — 1,695.00 on 10 Nov, 1,693.59 on 14 Nov, 1,654.16 on 20 Nov — which is why the REGISTRY still carries 1,695 and is now above Amazon\'s own typical. Worth a decision on whether 1,695 is still the right regular.' },
  'precision-pro-nx9-hd':        { regular: 199.98, promo: 161.49, seen: '2026-11-24',
                                   note: 'Left at the regular price throughout; never drifted. Re-read 20 Nov: still 161.49, -19%, no Black Friday badge \u2014 it has now held for ten days.' },

  // Added 13 November 2026 from the Black Friday recheck. Each was read on the
  // live listing with its discount badge, two weeks before Black Friday.
  'garmin-approach-s12':         { regular: 199.99, promo: 149.98, seen: '2026-11-24',
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
  'garmin-approach-z30':         { regular: 449.99, promo: 399.99, seen: '2026-11-24',
                                   note: 'Typical read 489.99 on 7 Nov, 449.99 on 10 Nov, promo 399.99 on 13 Nov — this listing moves. Registry has carried 449.99 since September; treat as standing unless it rises.' },

  // ── Added in the 20 November 2026 Black Friday sweep ──────────────────────
  // Read from PlayBetter's own /products/<handle>.js, not from the marketing
  // email that prompted the check. Three of these are products whose PRIMARY
  // link is elsewhere; they are listed because our copy now quotes the deal.
  'foresight-gcquad':            { regular: 15999.00, promo: 9999.00, seen: '2026-11-24',
                                   note: 'Black Friday: $6,000 off, the largest dollar discount in the catalogue, plus a year of Foresight+ Silver. Registry stays at 15999 — that is the compare-at on the live listing.',
                                   quotedOn: ['/how-much-does-golf-simulator-cost/'] },
  'bushnell-launch-pro':         { regular: 2999.99, promo: 2495.00, seen: '2026-11-24',
                                   note: 'The promo SHRANK. It was 1995.00 on 7 November (a 1,000 saving); on 20 November PlayBetter lists 2495.00, a 505 saving. Five pieces of copy claimed the deeper figure and were corrected in this sweep. Watch this one: it has moved twice in a fortnight in both directions.',
                                   quotedOn: ['/best-golf-simulators/', '/bushnell-launch-pro-vs-skytrak-plus/'] },
  // uneekor-eye-xo2 is deliberately NOT listed here. Adding it in the 20 Nov
  // sweep made validate-promo-prices fail, correctly: it would have asserted
  // 12700 as the regular price, and 7999 is the only figure we have ever seen
  // charged (16 and 20 November). 12700 is a list price PlayBetter appears to
  // discount permanently, which is a compare-at, not a promotion.
  'garmin-approach-s44':         { regular: 299.99, promo: 249.99, seen: '2026-11-24',
                                   note: '24 Nov: AMAZON HAS MATCHED at 249.99 — Black Friday Deal, -17% against a 299.99 list, in stock. Registry moved onto 249.99 (Ryan, 24 Nov); key is in ACCEPTED. On 20 Nov this was PlayBetter-only with the primary left at 299.99. Silver/Black out of stock at PlayBetter, Silver/Twilight in.' },
  'shot-scope-g6':               { regular: 179.99, promo: 149.98, seen: '2026-11-24',
                                   note: '24 Nov: GOLF GALAXY HAS MATCHED at 149.98, down from 179.99 on its own listing. Registry moved onto 149.98 (Ryan, 24 Nov); key is in ACCEPTED. On 20 Nov this was PlayBetter-only.' },
  'bushnell-wingman-2':          { regular: 169.99, promo: 99.99, seen: '2026-11-24',
                                   note: '24 Nov: AMAZON HAS MATCHED at 99.99 — Black Friday Deal, badged a 90-day low against a 169.99 list, in stock. Registry moved onto 99.99 (Ryan, 24 Nov) and the key is in validate-promo-prices ACCEPTED. On 20 Nov this was PlayBetter-only. 41% off is the deepest cut in the sweep; revert the registry and the 3 prose figures together if it ends.' },

  'rapsodo-mlm2pro':             { regular: 699.99, promo: 399.99, seen: '2026-11-24',
                                   note: 'RE-READ 24 Nov: PlayBetter has flipped the default. Original 699.99, current 399.99, and the variant selector now opens on 3 Callaway Chrome RPT balls ($150 OFF) rather than the 12-ball pack. 399.99 is therefore the headline deal, not a sub-variant, so it is the promo figure here and Sprint 274 moved the four prose figures with it. The earlier note below warned that making 399.99 the promo broke the drift exclusion for pages quoting 549.99 — that was true while 549.99 was the headline and both now move together. HISTORY, 20 Nov: the price depends on the ball bundle — 549.99 with 12 Callaway Chrome Tour RPT balls, 399.99 with 3, both in stock against a 699.99 compare-at. The promo figure here stays 549.99 — that is the headline deal PlayBetter markets and the figure our copy quotes. The 399.99 three-ball variant is recorded in the registry priceNote instead; making it the promo figure here broke the drift exclusion for every page quoting 549.99. Earlier, 16 Nov: PlayBetter had the NEW unit at 549.99 with 12 of 12 variants in stock, against their own 754.99 compare-at. That corroborates 549.99 as the live promo and 599 as the regular, so the registry stays at 599. An earlier note here said PlayBetter only carried a certified pre-owned listing near this figure; that is no longer true.' },
  'flightscope-mevo-gen2':       { regular: 1299.00, promo: 1149.00, seen: '2026-11-24',
                                   note: 'Held the same 150 discount from 5 to 20 November — four readings over fifteen days, including the Black Friday sweep. PlayBetter shows 1149.00 with 8 of 8 variants in stock. Registry stays at 1299 because that is still the regular price everywhere it is listed.' },
  'swing-caddie-sc4-pro':        { regular: 599.97, promo: 599.99, seen: '2026-11-24',
                                   note: 'PROMO ENDED, re-read 24 Nov 2026: PlayBetter now shows a flat 599.99 with no original price and no sale. NOTE CORRECTED: the old text here claimed a "Back Under $500" section on /best-budget-launch-monitor-apartment/ depended on this promo. It does not and did not — that page reads "Best display: Swing Caddie SC4 Pro" and already quotes 599.99, and /best-launch-monitors-under-500/ already explains the 499.99 was a promotion. Sprint 236 handled it; this note was simply stale and misled the 24 Nov sweep for a while. The registry is at 599.99, which is now also the regular, so nothing is quoting a dead deal. RESOLVED 14 Nov 2026: Sprint 233 flagged that three readings with no strike-through suggested $499.99 had become standing. PlayBetter lists the same unit at $599.99 on 14 Nov, so $599.97 is still the regular price and this entry stays as it is.' },

  /**
   * Added 16 November 2026. The registry carries 995 for this unit, which is
   * the PROMO figure, not the regular — Amazon badges it as a 30-day low with
   * a 1,195.00 typical price, and PlayBetter listed 1,195 before selling out.
   * ACCEPTED rather than repriced: Sprint 238 set 995 deliberately and 47
   * figures across 27 pages derive from it, so moving it is its own sprint.
   * This entry exists so the exposure is recorded instead of invisible — if
   * the 995 ends, these are the pages that go wrong.
   */
  'skytrak-plus':                { regular: 1095.00, promo: 795.00, seen: '2026-11-24',
                                   note: 'Amazon: 995.00 new, -17%, flagged 30-day low against a 1,195.00 typical price, in stock and sold by SkyTrak Golf, badged previous generation. PlayBetter is sold out and points buyers to the SkyTrak ST MAX at 1,695. Registry deliberately holds the 995.' },

  // Added 15 November 2026. The GPS family went on deal between the 14 Nov sweep
  // and this one, which is why these are here a week before the next full sweep.
  // Each was read on its live Amazon listing on 15 November.
  // Added 24 November 2026. The chart price was ~$35 and stale; Amazon reads
  // $27.49 as a Black Friday figure against a $38.97 typical. Ryan's decision
  // that day was to quote the live price, the same call made for the Wingman 2,
  // the Approach S44 and the Shot Scope G6 in the Black Friday re-sweep. The
  // regular is recorded here so the pages quoting $27 can be found when it ends.
  'vice-pro-soft':               { regular: 38.97, promo: 27.49, seen: '2026-11-24',
                                   note: 'Amazon: $27.49 a dozen, in stock, against a $38.97 price it has otherwise held. The compression chart, the ball guide and the soft-ball comparisons all quote this figure.',
                                   quotedOn: ['/golf-ball-compression-chart/'] },

  'shot-scope-v5':               { regular: 249.99, promo: 209.99, seen: '2026-11-24',
                                   note: 'Sold by Shot Scope, in stock, -16% "Limited time deal". The $209.99 has now held since 7 September, so it behaves like the standing price even though Amazon still badges it as a deal. Registry carries ~$210 for that reason.',
                                   quotedOn: ['/best-golf-gps-watches/', '/arccos-caddie-review/',
                                              '/arccos-vs-garmin-shot-tracking/', '/garmin-approach-s62-review/',
                                              '/how-to-sneak-in-more-golf-rounds/'] },
};
