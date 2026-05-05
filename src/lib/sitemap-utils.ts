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
