# Product images on non-buying-guide pages — fix

## Why `/how-i-dropped-5-strokes-arccos-mlm2pro/` had no images

That page is `pageType: 'tutorial'`. In `src/pages/[...slug].astro`, the product
image block was gated behind `isBuyingGuide` (which is only true for
`buying-guide`, `comparison`, and `review` pages):

```
{isBuyingGuide && productId && (() => { …render product image… })()}
```

So a tutorial (or listicle) that discusses a product via an affiliate key never
rendered the product image, and these sections also had no editorial
`sectionImage` — so the page showed no pictures at all, even though it discusses
the Arccos Caddie and Rapsodo MLM2PRO (both of which have real images in
`public/images/products/`).

## The fix (one line, root cause)

```diff
- {isBuyingGuide && productId && (() => {
+ {(isBuyingGuide || !section.sectionImage) && productId && (() => {
```

Now **any section that discusses a product shows the product image, on every page
type.** The `|| !section.sectionImage` guard means: on non-buying-guide pages we
skip the auto product image only when the section already carries its own
editorial `sectionImage`, so a section never renders two images. Buying-guide
behavior is unchanged.

## Improve-section audit (all pages verified in the rebuilt `dist/`)

9 tutorial pages (15 product sections) were missing images; all now render.
28 product sections across the improve section were checked — **all show a picture,
none doubled.**

See `IMPROVE-AUDIT.md` for the per-page before/after table.

## Verification

- `npm run build` succeeds (265 pages).
- `/how-i-dropped-5-strokes-arccos-mlm2pro/` now renders the Arccos and MLM2PRO
  product images.
- The one improve page with both an affiliate key and its own `sectionImage`
  (`/golf-practice-drills-at-home/`) shows a single image — no doubling.
- Only `src/pages/[...slug].astro` changed (`slug-template.patch` is the diff).

Note: this is a site-wide template fix — it also restores product images on
product-discussion sections in other categories' tutorials/listicles, which is the
same intended behavior.
