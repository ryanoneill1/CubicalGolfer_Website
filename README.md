# Date remediation — CubicalGolfer

Fixes publish/modified dates in the site's content data so the archive is
internally consistent with the site's own founding (`SITE_LAUNCH = '2026-01'`;
About page: "Started Cubical Golfer: 2026").

## Problems found (audit: `docs/date-audit.md`)

| Check | Count |
|---|---:|
| `datePublished` before the founding month | **88** (84 in articles.ts + 4 in comparisons.ts) |
| `dateModified` equal to the bulk stamp `2026-06-30` | **150** |
| `dateModified` earlier than `datePublished` | 0 (none in raw data) |
| Any future-dated field | 0 |

## What was changed

- **`src/data/articles.ts`** — 84 pre-2026 `datePublished` values remapped into
  the real window **2026-01 … 2026-07**, distributed evenly (~12/month) in their
  existing chronological order so the archive still reads correctly. 150
  `dateModified` fields equal to the bulk `2026-06-30` stamp were **removed**
  (not re-faked); 34 genuine `dateModified` values were kept. A field is only
  removed, never invented.
- **`src/data/comparisons.ts`** (scope extension) — the 4 live `/compare/` pages
  dated in 2025 were remapped into 2026-01…2026-04, each kept **≤ its existing
  `dateModified`** so no inversion is introduced. Not in the named output list,
  but these render the same pre-founding-date defect on live pages.
- **`src/data/types.ts`** — `Article.dateModified` made optional.
- **`src/lib/schema.ts`** — `articleSchema()` / `reviewSchema()` / `howToSchema()`
  now emit `dateModified ?? datePublished`, so an un-updated article still ships
  a valid, non-inverted `dateModified` in its JSON-LD.
- **`src/lib/linking.ts`** and **`src/pages/index.astro`** — article sorts used
  `.dateModified.localeCompare(...)`, which **crashed the build** once the field
  could be absent. Now sort on `dateModified ?? datePublished`.
- **`src/pages/[...slug].astro`** and **`golf-ball-compression-chart/index.astro`**
  — "Updated" stamps and a dataset schema now fall back to `datePublished`
  (the compression-chart page previously hard-coded the bulk `2026-06-30`).
- **`src/pages/sitemap-articles.xml.ts`** — already falls back
  `dateModified ?? datePublished ?? FALLBACK`; **verified correct, unchanged**.
  `lastmod` now equals `datePublished` for the 150 de-stamped articles.

## Verification (all green)

- `articles.ts` and `comparisons.ts` parse; 184 articles / 37 comparisons.
- 0 pre-founding dates, 0 `dateModified < datePublished`, 0 bulk `2026-06-30`,
  0 future dates (re-audit table at the bottom of `docs/date-audit.md`).
- `npm run validate` passes; `npm run build` builds 265 pages.
- Built sitemap `lastmod` and rendered JSON-LD confirmed: de-stamped articles
  show `dateModified == datePublished`; genuine updates preserved (e.g.
  `/golf-tips-for-beginners/` → published 2026-02-16, modified 2026-07-21).

## Reproduce

`SITE_LAUNCH` is the constant at the top of both scripts — change it if the real
launch month differs.

```bash
npx tsx scripts/audit-dates.ts    # writes docs/date-audit.md
npx tsx scripts/fix-dates.ts      # remaps articles.ts (idempotent-safe on clean data)
npm run validate && npm run build
```

Files mirror the repo layout — drop them in over the same paths, or apply
`date-remediation.patch` for the non-articles.ts source edits (articles.ts is
1.97 MB; use the full copy in `src/data/`).
