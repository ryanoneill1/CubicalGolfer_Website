# CubicalGolfer

Source for [cubicalgolfer.com](https://www.cubicalgolfer.com) — independent golf gear reviews, comparisons, and buying guides for weekend golfers.

## Stack

- Astro static site generator
- Cloudflare Workers hosting
- Amazon Associates + Golf Galaxy (CJ) affiliate integration
- Schema.org structured data (Article, Product, Review, FAQ, Person)

## Content

- 125 in-depth gear guides and tutorials
- 12 head-to-head product comparisons
- 168 affiliate products with dual-retailer buttons
- 34-ball golf ball compression chart

## Development

```bash
npm install
npm run build    # builds to dist/
npx wrangler deploy  # deploys to Cloudflare
```
