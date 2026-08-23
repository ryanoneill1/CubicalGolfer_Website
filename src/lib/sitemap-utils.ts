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
]);

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
