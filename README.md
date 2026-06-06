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

## Development

```bash
npm install
npm run build    # builds to dist/
npx wrangler deploy  # deploys to Cloudflare
```
