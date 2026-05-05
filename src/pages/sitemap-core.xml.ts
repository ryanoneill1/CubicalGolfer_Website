// src/pages/sitemap-core.xml.ts
// Homepage, category hubs, about, how-we-test, gear quiz, cornerstone page.

import type { APIRoute } from 'astro';
import { buildSitemapXml } from '../lib/sitemap-utils';

const FALLBACK = '2026-04-14';

export const GET: APIRoute = async () => {
  const entries = [
    { loc: '/',                         changefreq: 'weekly',  priority: '1.0', lastmod: FALLBACK },
    { loc: '/best-golf-gear-2026/',     changefreq: 'weekly',  priority: '0.95', lastmod: FALLBACK },
    { loc: '/about/',                   changefreq: 'monthly', priority: '0.7', lastmod: FALLBACK },
    { loc: '/how-we-test/',             changefreq: 'monthly', priority: '0.7', lastmod: FALLBACK },
    { loc: '/gear-reviews/',            changefreq: 'weekly',  priority: '0.9', lastmod: FALLBACK },
    { loc: '/golf-tech/',               changefreq: 'weekly',  priority: '0.9', lastmod: FALLBACK },
    { loc: '/golf-accessories/',        changefreq: 'weekly',  priority: '0.9', lastmod: FALLBACK },
    { loc: '/golf-lifestyle/',          changefreq: 'weekly',  priority: '0.8', lastmod: FALLBACK },
    { loc: '/improve-your-golf-game/',  changefreq: 'weekly',  priority: '0.9', lastmod: FALLBACK },
    { loc: '/office-hacks/',            changefreq: 'weekly',  priority: '0.9', lastmod: FALLBACK },
    { loc: '/gear-quiz/',               changefreq: 'monthly', priority: '0.8', lastmod: FALLBACK },
    { loc: '/compare/',                 changefreq: 'weekly',  priority: '0.8', lastmod: FALLBACK },
  ];

  return new Response(buildSitemapXml(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
