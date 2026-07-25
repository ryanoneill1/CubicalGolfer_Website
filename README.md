# Iron consolidation — CubicalGolfer

Resolves keyword cannibalization across four overlapping iron articles by merging
three into a single canonical page. Full analysis and rationale:
`docs/iron-consolidation-plan.md`.

## Survivor: `/best-golf-irons-2026/`

Chosen on the data (default confirmed): 26 inbound internal links vs 5–8 for the
others, 2,551 words vs 431–882, 8 products + 7 FAQs already the widest coverage,
and the oldest URL (published 2025-03-22) with the strongest ranking history.

## What changed

- **`src/data/articles.ts`**
  - Merged genuinely-unique content into the survivor: **3 product picks** whose
    affiliate keys existed only on a retired page (`cleveland-launcher-xl-halo-irons`,
    `taylormade-stealth-hd-irons`, `srixon-zx5-mk-ii`), **4 unique advice sections**,
    and **5 unique FAQs** (7 → 12). Near-duplicate paragraphs were not carried.
  - Removed the 3 retired article objects.
  - Repointed every internal link that pointed at a retired slug to the survivor
    (related entries repointed + relabeled; body links repointed; the survivor's
    own links to the merged pages converted to plain text). **Zero remaining
    references** to any retired slug.
  - Survivor `datePublished` preserved (2025-03-22); `dateModified` → 2026-07-25.
- **`_redirects`** — three 301s appended in the existing format:
  ```
  /best-game-improvement-irons-2026/  /best-golf-irons-2026/  301
  /most-forgiving-irons/              /best-golf-irons-2026/  301
  /best-golf-irons-high-handicapper/  /best-golf-irons-2026/  301
  ```

## Verification

- `articles.ts` parses — 181 articles (was 184).
- No affiliate key lost — `validate-affiliate-keys` passes (437 sections); all 11
  survivor products (incl. the 3 carried keys) emit Product schema in the build.
- Zero remaining references to any retired slug; no duplicate `related` entries.
- `npm run validate` passes (incl. promise-delivery); `npm run build` builds 262
  pages; `sitemap-articles.xml` no longer emits the retired URLs.

## Task 6 — reported, not fixed

Two title-overlap pairs flagged for operator review:
`/best-rain-gear-midwest-golfers/` ↔ `/best-golf-rain-gear-2026/` (genuine overlap
candidate) and `/best-golf-rangefinders-2026/` ↔ `/best-golf-irons-2026/` (false
positive — shared title template, unrelated intent). Details in the plan doc.

`scripts/consolidate-irons.ts` is the consolidation engine (quote/brace-aware
source surgery), included for reproducibility.
