// src/pages/sitemap.xml.ts
// Sitemap INDEX — points to segmented sitemaps for GSC diagnostic visibility.

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const DOMAIN = 'https://www.cubicalgolfer.com';
  const now = new Date().toISOString().split('T')[0];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-core.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-articles.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-comparisons.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
