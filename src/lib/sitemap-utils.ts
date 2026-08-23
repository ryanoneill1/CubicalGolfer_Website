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
]);
