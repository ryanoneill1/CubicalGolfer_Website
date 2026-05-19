// src/pages/sitemap.xml.ts
// Sitemap INDEX — lastmod per child = most recent content date in that segment.
// FIXED: was using new Date() (always today). Now reads actual data dates.

import type { APIRoute } from 'astro';
import { ARTICLES } from '../data/articles';
import { COMPARISONS } from '../data/comparisons';

function maxDate(dates: string[]): string {
  return dates.filter(Boolean).sort().pop() || '2026-04-14';
}

export const GET: APIRoute = async () => {
  const DOMAIN = 'https://www.cubicalgolfer.com';

  const articleDates = (ARTICLES as any[]).map(a => a.dateModified ?? a.datePublished);
  const compDates = (COMPARISONS as any[]).map(c => c.dateModified ?? c.datePublished);

  const latestArticle = maxDate(articleDates);
  const latestComp = maxDate(compDates);
  const latestCore = maxDate([...articleDates, ...compDates]);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-core.xml</loc>\n    <lastmod>${latestCore}</lastmod>\n  </sitemap>\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-articles.xml</loc>\n    <lastmod>${latestArticle}</lastmod>\n  </sitemap>\n` +
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-comparisons.xml</loc>\n    <lastmod>${latestComp}</lastmod>\n  </sitemap>\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
