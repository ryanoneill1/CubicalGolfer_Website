# Upload these 6 files. Nothing else.

Regenerated 2026-07-25 against your **current GitHub HEAD** (commit 4377a03), so
nothing you've pushed gets overwritten.

```
_redirects
src/data/articles.ts
src/pages/about.astro
src/pages/how-we-test.astro
scripts/fix-orphaned-urls.mjs      <- optional, provenance only
scripts/reconcile-claims.mjs       <- optional, provenance only
```

## The 8 deletions are already done

I re-checked GitHub. `articles.ts`, `affiliate-links.ts`, `schema.ts`, `lib/schema.ts`,
`data/*` and `courses/src/data/*` are all gone from the repo already, and
`check-duplicates.ts` passes against HEAD. **Nothing to delete. Just upload the 6.**

## What's in them

`src/data/articles.ts` — cumulative, both steps:
- 33 internal links repointed off dead URLs
- 7 "Trackman baseline" claims rewritten, plus "Trackman 4 ($22,000)"
- 16 "over 40+/30+ rounds" claims de-precisioned
- 166 articles, unchanged count

`_redirects` — 20 new 301s recovering 3,696 orphaned impressions; placeholder
`# /old-404-url-N/` block removed.

`src/pages/about.astro` — loan contradiction resolved against how-we-test.astro.

`src/pages/how-we-test.astro` — new "Why round counts overlap" section.

## Verified against HEAD after the change

```
✓ check-duplicates: no duplicate articles.ts / affiliate-links.ts / schema.ts outside canonical paths.
✅ Affiliate key validation passed for 181 articles (437 sections checked).
✓ check-affiliate-links: all 262 entries have a program with active tracking (or are Amazon).

articles defined: 166      brace balance: 0
internal hrefs: 135        unresolved: 0
first-person Trackman claims: 0
```

One warning will appear in the Action log and is expected:

```
⚠️  Affiliate URL check: 210 search URL(s) remain — convert to direct ASINs
```

That's the P1 Amazon work you're still on. It's a warning, not a failure.

## After the push

Your workflow builds and deploys automatically on push to `main`. Watch the Actions tab
for green, then:

- Load `/most-forgiving-irons/` — should 301 to `/best-golf-irons-2026/`
- Load `/best-golf-sunglasses/` — should 301 to `/golf-apparel/`
- Request indexing on `/best-golf-irons-2026/` and `/golf-apparel/`
