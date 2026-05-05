// src/pages/sitemap-articles.xml.ts
// All 125 article pages with real per-page dateModified.

import type { APIRoute } from 'astro';
import { ARTICLES } from '../data/articles';
import { buildSitemapXml } from '../lib/sitemap-utils';

const FALLBACK = '2026-04-14';

const priorityByType: Record<string, string> = {
  'buying-guide': '0.8', 'comparison': '0.8', 'tutorial': '0.7',
  'listicle': '0.6', 'lifestyle': '0.5', 'review': '0.7',
};
const freqByType: Record<string, string> = {
  'buying-guide': 'weekly', 'comparison': 'weekly', 'tutorial': 'monthly',
  'listicle': 'monthly', 'lifestyle': 'monthly', 'review': 'monthly',
};

export const GET: APIRoute = async () => {
  const entries = ARTICLES.map(a => ({
    loc:        a.slug,
    lastmod:    a.dateModified ?? a.datePublished ?? FALLBACK,
    changefreq: freqByType[a.pageType] ?? 'monthly',
    priority:   priorityByType[a.pageType] ?? '0.6',
  }));

  return new Response(buildSitemapXml(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
