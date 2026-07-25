# Title & meta rewrites — 16 underperforming pages (CTR)

Rewrites the `title` and `description` for 16 pages holding 84,977 impressions but
only 1,199 clicks (1.41% CTR). Full before/after table with character counts and
per-page rationale: `docs/title-meta-changes.md`.

## Approach

- **Titles** lead with the exact head term a searcher types, stay **under 60
  characters**, and add a verifiable differentiator (count, price ceiling, year).
  No unsupported testing claims — the old "Tested against TrackMan" and "Tested
  Over 40+ Rounds" framings were replaced with things the body supports ("4 Under
  $700", "9 Balls by Swing Speed", "8 Models Compared"). Formats are varied, not
  one template.
- **Descriptions** are **140–158 characters**, answer the query in the first
  clause, cite a concrete detail (a price, a product, a number), and end with a
  reason to click rather than a generic CTA.

## Compression chart (Task 4)

`/golf-ball-compression-chart/` ranked 6.9 for "golf ball compression chart 2026"
but 23.4 for the un-suffixed query. Its title **and H1** now carry **both**
variants ("Golf Ball Compression Chart" + "2026"), and the description surfaces
the **free PDF** — the "golf ball compression chart pdf" query converts at 19.85%.

## Files changed — note on scope

The task named `src/data/articles.ts` as the only code output, but two of the 16
slugs render from **standalone `.astro` pages** whose own `title`/`description`
(and, for the chart, `<h1>`) override the articles.ts entry — so the SEO-visible
fix has to live there:

- `src/data/articles.ts` — 15 titles + 15 descriptions (the compression-chart
  articles.ts entry title/description were also aligned for internal-listing
  consistency).
- `src/pages/golf-club-distance-chart/index.astro` — title + description.
- `src/pages/golf-ball-compression-chart/index.astro` — title + description + H1
  (Task 4).

Nothing else was touched. Diff of the two page files: `astro-pages.patch`.

## Verification

- `src/data/articles.ts` parses (184 articles); only `title`/`description` lines
  changed there (plus the two standalone pages above).
- `npm run validate` passes — including `validate-promise-delivery`, which caught
  an early "9 Ranked" title whose promised count the comparison table did not
  back; it was reworded to the verifiable "9 Balls by Swing Speed".
- `npm run build` builds 265 pages; rendered `<title>`, `<meta description>`, and
  `<h1>` confirmed in the built HTML for the standalone pages.
- Every title < 60 chars; every description 140–158 chars (counts in the doc).

`scripts/rewrite-meta.ts` is the (idempotent, delimiter-aware) rewrite engine,
included for reproducibility.
