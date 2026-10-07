// src/lib/sitemap-utils.ts
// Shared helper for segmented sitemaps.

const DOMAIN = 'https://www.cubicalgolfer.com';

export type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urlBlocks = entries.map(({ loc, lastmod, changefreq, priority }) =>
    `  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  ).join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlBlocks + '\n' +
    `</urlset>\n`
  );
}

/**
 * URLs that redirect at the edge and must therefore NOT be advertised for
 * indexing. Added Sprint 68.
 *
 * Google Search Console failed a "Page with redirect" validation because four
 * URLs were listed in this sitemap while Cloudflare redirected them away — the
 * site asserting "index this" and "this is not the page you want" about the same
 * URL. Two of those four were genuine consolidations that should stay redirected;
 * they are the two below, and the fix is to stop advertising them.
 *
 * (The other two, /best-putters-yips/ and /golf-desk-accessories-office/, both
 * outranked their redirect targets, so those Cloudflare rules are being removed
 * instead and the pages stay in the sitemap.)
 *
 * Anything added here must also have a rule in public/_redirects, so the repo
 * records why the URL is excluded. scripts/validate-redirects.ts fails the build
 * if a redirect source ever reappears in a sitemap.
 */
export const REDIRECTED_AWAY = new Set<string>([
  // → /best-golf-putters-2026/  (position 42.4 vs the target's 23.9)
  '/best-blade-putters-2026/',
  // → /compare/callaway-paradym-vs-taylormade-qi35/ — the same head-to-head at a
  //   stronger URL (294 clicks vs 88). Keeping both would split the query.
  '/compare/taylormade-qi35-vs-callaway-ai-smoke/',
  // → /best-golf-drivers-forgiveness/ (Sprint 73). Same intent, same four products,
  //   both stranded on page 2-3 at 24.8 and 14.3. The record stays in articles.ts,
  //   so removing these two lines reverses the consolidation.
  '/best-driver-for-high-handicapper/',
  // → /best-golf-gps-watches/ (Sprint 74). 248 impressions at position 36.8,
  //   three products all present on the parent page.
  '/best-gps-golf-watch-high-handicappers/',
  // ── Sprint 140 ──────────────────────────────────────────────────────────
  // Three Cloudflare *dashboard* redirect rules, live but undocumented, send
  // these to longer standalone articles. They stayed in the sitemap, so GSC
  // reported "Page with redirect" and they could never be indexed. The targets
  // are 20-45% longer, carry the canonical, and are already indexed.
  // Records remain in comparisons.ts, so removing these lines reverses it.
  '/compare/skytrak-plus-vs-mevo-plus/',          // → /skytrak-vs-mevo-plus/
  '/compare/square-golf-vs-garmin-r10/',          // → /garmin-r10-vs-square-golf/
  '/compare/garmin-r50-vs-rapsodo-mlm2pro/',      // → /rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/
  // ── Sprint 141 — launch-monitor / simulator consolidation ───────────────
  // Six pages at position 18.7-32.2 earning 5 clicks between them, every
  // product already on the hub. Records remain in articles.ts; removing these
  // lines and the matching _redirects rules reverses it.
  '/best-budget-launch-monitor/',                // pos 31.2, 2 clicks/90d — 6 of its 7 products already on the hub
  '/best-golf-simulators/',                      // pos 32.2, 1 click — all 3 products already on the hub
  '/best-golf-simulator-under-5000/',            // pos 23.0, 0 clicks — all 3 products already on the hub
  '/best-golf-simulator-for-beginners/',         // pos 22.2, 1 click — all 3 products already on the hub
  '/best-golf-simulator-small-spaces/',          // pos 24.1, 1 click — both products already on the hub
  '/best-golf-simulator-under-1000/',            // pos 18.7, 0 clicks — monitors on the hub; net and mat live on their own pages
]);

/**
 * Where a redirected-away URL actually lands.
 *
 * REDIRECTED_AWAY keeps these out of the sitemap, but the link generators
 * (brand pages, /compare/ index, related-comparison blocks, breadcrumbs) build
 * `/compare/${slug}/` straight from the record and so kept emitting internal
 * links into a 301. Sprint 140 found 23 built pages doing exactly that.
 *
 * compareHref() is the single place that knows the difference. Any site that
 * renders a link to a comparison should use it rather than interpolating.
 */
export const REDIRECT_TARGETS: Record<string, string> = {
  '/compare/skytrak-plus-vs-mevo-plus/':   '/skytrak-vs-mevo-plus/',
  '/compare/square-golf-vs-garmin-r10/':   '/garmin-r10-vs-square-golf/',
  '/compare/garmin-r50-vs-rapsodo-mlm2pro/': '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/',
  '/compare/taylormade-qi35-vs-callaway-ai-smoke/': '/compare/callaway-paradym-vs-taylormade-qi35/',
};

export function compareHref(slug: string): string {
  const path = `/compare/${slug}/`;
  return REDIRECT_TARGETS[path] ?? path;
}

/**
 * lastmod from src/data/lastmod-manifest.json — a per-page date backed by a hash
 * of that page's own content, so it only moves when the page genuinely changes.
 *
 * Added Sprint 71. Before this, 100 pages (39% of the sitemap) all claimed to
 * have changed on 2026-07-21, because dateModified was bulk-stamped. Google only
 * honours lastmod from sites that keep it accurate; an unreliable one is ignored
 * and it falls back to refreshing broadly — which is what your Crawl Stats showed:
 * 86.9% refresh against 13.1% discovery, while 23 URLs sat un-fetched for three
 * months.
 *
 * Falls back to the record's own date if a page is somehow missing from the
 * manifest, so a stale manifest degrades to the old behaviour rather than
 * emitting a wrong date. scripts/update-lastmod.ts --check fails the build if the
 * manifest drifts, so that fallback should never be reached in practice.
 */
import manifest from '../data/lastmod-manifest.json';

export function lastmodFor(slug: string, fallback?: string): string {
  const e = (manifest as Record<string, { lastmod: string }>)[slug];
  return e?.lastmod ?? fallback ?? '2026-04-14';
}
