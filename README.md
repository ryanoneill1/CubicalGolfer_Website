# CubicalGolfer

Source for [cubicalgolfer.com](https://www.cubicalgolfer.com) — independent golf gear reviews, comparisons, and buying guides for weekend golfers.

## Stack

- Astro static site generator (output: static, trailingSlash: always)
- Cloudflare Workers hosting (deployed via GitHub Actions on push to main)
- Amazon Associates + Golf Galaxy (CJ) affiliate integration
- Schema.org structured data (Article, Product, Review, FAQ, Person)

## Deploy

**Auto-deploy on push to `main`** via GitHub Actions (`.github/workflows/deploy.yml`).
The workflow runs `npm ci` → `npm run build` → `wrangler deploy` → purge cache → IndexNow ping.

Requires three GitHub repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID`.
See `GITHUB_ACTIONS_SETUP.md` for one-time setup instructions.

> **⚠️ When pushing via the GitHub web UI:** never upload `dist/`, `node_modules/`, or any built HTML files. Only push changes to `src/`, `public/`, `scripts/`, and root config files.

## Content

- 160+ in-depth gear guides and tutorials
- 28 head-to-head product comparisons
- 168 affiliate products with dual-retailer buttons
- 34-ball golf ball compression chart with PDF download
- 3 interactive tools (ball finder, room checker, distance calculator)

## Canonical file locations — edit only these

The site's data and schema live in **exactly one place each**. The build (and
everything under `scripts/`) imports only these paths:

| What | Canonical path — the ONLY copy to edit |
|---|---|
| Article content & metadata | `src/data/articles.ts` |
| Affiliate product registry | `src/data/affiliate-links.ts` |
| Structured-data / schema helpers | `src/lib/schema.ts` |
| Comparison content | `src/data/comparisons.ts` |
| City / course data | `src/data/cities.ts` |

Do **not** create copies of `articles.ts`, `affiliate-links.ts`, or `schema.ts`
anywhere else (repo root, `/data/`, `/lib/`, `/courses/…`). Stale duplicates used
to exist there; an edit to the wrong copy **silently never ships**. A CI guard —
`scripts/check-duplicates.ts`, run in `.github/workflows/deploy.yml` and in
`npm run validate` — now fails the build if any of those three filenames reappears
outside its canonical path. See `docs/file-inventory.md` for the full audit.

> The `/courses/` directory is a dead v2.0.0 snapshot with its own `package.json`;
> it is never built or deployed. Don't edit content there expecting it to ship.

## Development

```bash
npm install
npm run build    # builds to dist/
npx wrangler deploy  # deploys to Cloudflare
```
