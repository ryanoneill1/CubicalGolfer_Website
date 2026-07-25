# Internal-link equity — CubicalGolfer

Gives the site's highest-value tools the same internal-link equity as its
best-performing page (the golf-ball compression chart, 669 clicks/3mo).

## The problem

The compression chart proves the pattern — tools rank and convert here — yet the
highest-AOV simulator tools ($500–$5,000 category) sat almost unlinked:
`launch-monitor-room-checker` had 5 inbound internal links, `golf-simulator-cost-calculator`
had 2, and `golf-simulator-projector-distance-calculator` / `golf-equipment-budget-planner`
had 0.

## What changed (only `src/data/articles.ts`)

Contextual, in-body links were inserted into the articles whose own subject makes
each tool useful, plus a matching entry in each article's `related[]` block. Both
forms render as real `<a>` links and pass equity. Anchor text is varied per
insertion; never more than 2 tool links were inserted per article; no tool was
linked from an irrelevant article.

| Tool | Before | After |
|---|---:|---:|
| launch-monitor-room-checker (priority) | 5 | **23** |
| golf-simulator-cost-calculator (priority) | 2 | **24** |
| golf-simulator-projector-distance-calculator | 0 | **6** |
| golf-equipment-budget-planner | 0 | **10** |
| golf-ball-finder | 3 | **9** |
| golf-swing-speed-chart | 3 | **9** |
| golf-ball-compression-chart (benchmark) | 22 | 22 |

32 contextual body links + 36 `related[]` entries across ~30 articles. The two
priority simulator tools now match the compression chart's equity. Full per-link
record in `insertion-log.json`; per-target counts and orphan list in
`docs/internal-links.md`.

## Relevance mapping used

- **room-checker** → launch-monitor / simulator articles where physical space
  matters (garage, apartment, ceiling, room dimensions).
- **cost-calculator** → simulator build / budget / cost articles.
- **projector-distance-calculator** → projector / impact-screen / throw-distance
  articles.
- **budget-planner** → "best X under $Y" / beginner-set articles.
- **ball-finder** → golf-ball articles.
- **swing-speed-chart** → swing-speed / shaft-flex / driver-loft articles.

## Verification

- `src/data/articles.ts` parses (184 articles).
- Every inserted link resolves against the real 264-page build list — **no 404s**.
- All 9 tools remain in `src/pages/sitemap-core.xml.ts` (unchanged).
- Anchor text varied per tool (10 distinct anchors for room-checker, etc.).
- Each insertion capped at ≤2 tool links/article. (Two pre-existing articles —
  `/vice-golf-balls/`, `/how-many-clubs-in-a-golf-bag/` — already carried 3 tool
  links before this work and were left untouched.)
- `npm run validate` passes; `npm run build` builds 265 pages; inserted links
  confirmed rendering in the built HTML.

## Scripts

- `scripts/audit-internal-links.ts` → `docs/internal-links.md`. Counts every
  internal link in articles.ts by target (both `href="/…"` in bodies and
  `slug` refs in `related[]`/`relatedComparisons[]`), lists orphan pages. Run it
  against the delivered file to confirm the after-state.
- `scripts/insert-tool-links.ts` — the insertion engine (curated, varied-anchor
  list; delimiter-aware source splicing). Included for reproducibility.

Files mirror the repo layout — drop `src/data/articles.ts` in over the same path.
