# Claims remediation — CubicalGolfer

Brings the site's article and template claims into line with its own published
testing methodology (`src/pages/how-we-test.astro`: *"We do not have a TrackMan
in the office — our baselines come from GPS shot-tracking data (Arccos and Shot
Scope) … and from cross-checking launch monitors against each other."*).

## The problem that was fixed

1. **TrackMan contradiction.** `articles.ts` and several templates claimed gear
   was *"tested against a Trackman 4 baseline"* / *"within X of Trackman"* — a
   $22k device the site's own methodology page says it does not own. This is a
   Google helpful-content risk and FTC "Guides Concerning Use of Endorsements
   and Testimonials" (Rule on Consumer Reviews) exposure.
2. **Arithmetically impossible round counts.** The author plays 25–40 rounds a
   year, yet per-product claims ("10+ rounds per product", "each tested over 10+
   rounds") repeated across hundreds of products implied thousands of rounds.

## What changed

| Surface | Change | Count |
|---|---|---|
| `src/data/articles.ts` | Trackman testing-claims rewritten to on-course GPS / cross-referencing | 40 |
| `src/data/articles.ts` | Inflated author round counts → non-numeric honest phrasing | 184 |
| 13 `.astro` templates | Per-product round counts + Trackman baseline claims fixed | 23 |

Full line-by-line log: **`docs/claims-remediation.md`**.
Before-state occurrence audit: **`docs/claims-audit.md`** (from `scripts/audit-claims.ts`).

## Rules followed

- Never replaced one unverifiable claim with a different unverifiable claim.
- Chose the weaker, honest phrasing when in doubt.
- **No article deleted; no slug, title, `titleDisplay`, or affiliate key changed**
  (verified: all four sets identical to the original — see the doc).
- All HTML markup inside body strings preserved.
- `articles.ts` processed programmatically and re-verified as valid TypeScript.

## Two things left for your review

1. **Article titles were NOT changed** (per the "do not change titles"
   constraint), so a handful still read e.g. *"…Tested Over 40+ Rounds"* or
   *"6 Units vs Trackman Data"*. These are flagged at the bottom of
   `docs/claims-remediation.md` — you may want to soften them by hand for full
   consistency.
2. The **cumulative "40+ rounds of hands-on testing"** figure on the About page
   was **kept** as the one honest sitewide anchor; every per-product/per-category
   count was softened so nothing re-aggregates past a season's play.

## Deploy

Files mirror the repo layout — drop them in over the same paths, or apply the
patch:

```bash
git apply claims-remediation.patch     # source-only diff (src/**)
npm run validate                        # promise/price/contrast/affiliate guards
npm run build                           # 265 pages
```

Verified locally: `npm run validate` passes (184 articles, affiliate integrity,
contrast, product cards) and `npm run build` produces 265 pages with 0 residual
first-person Trackman testing claims and 0 inflated author round counts in body
copy (the only remaining "5+ rounds" string is reader advice on the distance
chart, intentionally kept).
