# CORRECTED bundle — replaces everything I sent before

**I broke your build. This fixes it.** Upload these 6 files; they overwrite the bad ones.

## What I got wrong

My orphan-detection script parsed `articles.ts` with a regex anchored to
`^    slug: '...'`. But your articles use **two** formats:

```
    id: 'rangefinders',
    slug: '/best-golf-rangefinders-2026/',     <- my regex matched this

    id: 'golf-hats', slug: '/best-golf-hats/', <- and silently missed this
```

**15 live articles use the second form.** I read them as dead URLs, rewrote their
slugs to redirect targets, and left their thumbnails behind — which is exactly what
`validate-thumbnails.ts` caught:

```
Thumbnail/slug mismatch: /golf-apparel/ → golf-hats-thumb.webp
```

Four separate articles ended up with `slug: '/golf-apparel/'`. Your validator did its
job and stopped a bad deploy. That guard is the reason this cost you one failed build
instead of four silently broken pages.

## The real numbers, verified against a build

I stopped parsing and ran `astro build`, then diffed Search Console against `dist/`:

| | I claimed | Actually |
|---|---|---|
| Orphaned URLs | 20 (3,696 impressions) | **6 (1,443 impressions)** |
| Broken internal links | 77 | **0** |
| Article edits needed for links | 33 | **none** |

Every internal href in `articles.ts` already resolved. All 77 of my "fixes" were damage.

## What's in this bundle

Rebuilt from your last good commit `4377a03`, with only two real changes:

**`_redirects`** — 6 genuine 301s, and the `# /old-404-url-N/` placeholder block removed:

```
/best-golf-irons-high-handicapper/  /best-golf-irons-2026/  301
/best-game-improvement-irons-2026/  /best-golf-irons-2026/  301
/most-forgiving-irons/              /best-golf-irons-2026/  301
/rapsodo-vs-garmin-r10/             /compare/garmin-r10-vs-rapsodo-mlm2pro/  301
/golf-mental-game-tips/             /improve-your-golf-game/  301
/golf-club-fitting-guide/           /iron-fitting-guide-beginners/  301
```

The first three are from your own iron consolidation, which deleted the pages without
adding redirects.

**`src/data/articles.ts`** — Step 2 claims work only. **Zero slug changes, zero
thumbnail changes** — verified: 1,170 slug occurrences before and after, identical sets.

- 26 Trackman-as-baseline claims rewritten to match `how-we-test.astro`
- 16 "over 40+/30+ rounds" claims de-precisioned
- product-lifespan advice ("regrip every 40-60 rounds") untouched

**`about.astro` / `how-we-test.astro`** — unchanged from Step 2 (loan contradiction,
concurrency note). These were never the problem.

**`scripts/fix-orphaned-urls.mjs`** — rewritten. Now only writes `_redirects`, never
touches `articles.ts`, and documents the two-slug-format trap.

## Verified — full `npm run build` on this exact tree

```
✓ check-duplicates
✅ Affiliate key validation passed for 181 articles (437 sections checked)
✅ Thumbnails match their pages AND all referenced product images are real photos
✅ All 181 articles pass promise/delivery check
✓ All product picks have prices
✅ Contrast checks passed
✅ Retailer integrity: 262 entries
✓ validate-product-cards: all 37 compare pages
✓ check-affiliate-links: all 262 entries
✅ Search index: 226 entries
✅ PDF generated (34 balls)
✅ Compare thumbnails: 37/37

[build] 262 page(s) built
```

The one warning — `⚠️ Affiliate URL check: 210 search URL(s) remain` — is expected and
non-fatal. That's the P1 Amazon work.

## Note

`/golf-tips-for-beginners/` and `/best-golf-bags-walking-2026/` appeared as orphans in
an intermediate check of mine. They are **live** — that pass was still parsing rather
than reading the build. Ignore any earlier list; this one is diffed against `dist/`.
