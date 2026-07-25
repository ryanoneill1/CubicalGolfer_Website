# Broken internal links — dist crawl & 404 reconciliation

## Method

The freshly-built `dist/` (265 pages) was crawled exhaustively and every internal
reference was cross-referenced against the real served page list (every directory
with an `index.html` → its trailing-slash URL, plus every static file), and
against the 92 active `_redirects` source paths. Checked reference types:

- every `href="/…"` and `src="/…"` in all 267 built HTML files
- `<link rel="canonical">`, `<meta property="og:url">`
- JSON-LD `"url"` / `"@id"` values
- every `<loc>` in all `sitemap*.xml`
- URLs in the served indexes `api/search-index.json`, `llms.txt`,
  `llms-full.txt`, `internal-links.json`
- **`_redirects` destinations** (a 301 to a missing target is itself a 404)

Resolution honored `trailingSlash: 'always'` (exact-match, plus redirect coverage).

## Result — the current build is clean

| Check | Broken references found |
|---|---:|
| Internal `href`/`src` → missing page | **0** |
| `<loc>` in sitemaps → missing page | **0** |
| canonical / og:url / JSON-LD → missing page | **0** (only the 404 page's self-reference, which is intentional) |
| `_redirects` destination → missing page | **0** |
| search-index / llms.txt / internal-links.json → missing page | **0** |

**No internal link on the site points at a non-existent page**, and there are no
redirect chains or redirects to dead targets. There is nothing in the codebase to
fix or to add a 301 for on the basis of a broken *internal* link.

## The 5 Search Console "Not found (404)" URLs

Because the crawl above is clean, the 5 URLs Search Console reports as 404 are
**not referenced anywhere in the current build**. That means they are historical
or external:

- old URLs that were indexed before the current `_redirects` existed and were
  removed/renamed without a redirect, or
- external backlinks or crawler-guessed URLs that never corresponded to a page.

A `dist/` crawl cannot surface these — nothing internal links to them — so the
exact five cannot be derived from the repo. They must be read from the Search
Console report itself.

### How to close them out (2 minutes)

1. In Search Console → **Indexing → Pages → "Not found (404)"**, click the row and
   **Export** the 5 URLs.
2. For each, decide the best current equivalent (the closest live guide/tool) or,
   if there is no equivalent, leave it to 404 intentionally.
3. Add a 301 to `_redirects` (same format as the rest of the file). A ready
   template block has been appended to `_redirects`, commented out — fill in the
   five real source URLs and their targets, then uncomment.

No redirects were invented here: guessing at unknown source URLs risks creating
redirects that shadow real pages, so the five are left for the operator to paste
from the authoritative Search Console export.
