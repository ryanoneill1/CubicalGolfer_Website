// src/pages/sitemap-core.xml.ts
// Homepage, category hubs, about, how-we-test, gear quiz, cornerstone pages.
// FIXED: hub pages now derive lastmod from the freshest article in their category
//        instead of a shared hardcoded fallback.

import type { APIRoute } from 'astro';
import { ARTICLES } from '../data/articles';
import { buildSitemapXml } from '../lib/sitemap-utils';

function freshestInCategory(cat: string): string {
  const dates = (ARTICLES as any[])
    .filter(a => a.category === cat)
    .map(a => a.dateModified ?? a.datePublished)
    .filter(Boolean)
    .sort();
  return dates.pop() || '2026-04-14';
}

function freshestOverall(): string {
  const dates = (ARTICLES as any[])
    .map(a => a.dateModified ?? a.datePublished)
    .filter(Boolean)
    .sort();
  return dates.pop() || '2026-04-14';
}

export const GET: APIRoute = async () => {
  const entries = [
    { loc: '/',                         changefreq: 'weekly',  priority: '1.0',  lastmod: freshestOverall() },
    { loc: '/best-golf-gear-2026/',     changefreq: 'weekly',  priority: '0.95', lastmod: freshestOverall() },
    { loc: '/about/',                   changefreq: 'monthly', priority: '0.7',  lastmod: '2026-03-15' },
    { loc: '/how-we-test/',             changefreq: 'monthly', priority: '0.7',  lastmod: '2026-03-15' },
    { loc: '/gear-reviews/',            changefreq: 'weekly',  priority: '0.9',  lastmod: freshestInCategory('gear-reviews') },
    { loc: '/golf-tech/',               changefreq: 'weekly',  priority: '0.9',  lastmod: freshestInCategory('golf-tech') },
    { loc: '/golf-accessories/',        changefreq: 'weekly',  priority: '0.9',  lastmod: freshestInCategory('golf-accessories') },
    { loc: '/golf-apparel/',           changefreq: 'weekly',  priority: '0.8',  lastmod: freshestInCategory('golf-accessories') },
    { loc: '/golf-lifestyle/',          changefreq: 'weekly',  priority: '0.8',  lastmod: freshestInCategory('golf-lifestyle') },
    { loc: '/improve-your-golf-game/',  changefreq: 'weekly',  priority: '0.9',  lastmod: freshestInCategory('improve-game') },
    // /office-hacks/ removed from sitemap — noindexed (off-topic for golf gear authority)
    { loc: '/gear-quiz/',               changefreq: 'monthly', priority: '0.8',  lastmod: '2026-04-14' },
    { loc: '/compare/',                 changefreq: 'weekly',  priority: '0.8',  lastmod: freshestOverall() },
    { loc: '/golf-simulator-complete-guide/', changefreq: 'weekly',  priority: '0.95', lastmod: freshestInCategory('golf-tech') },
    { loc: '/launch-monitor-buying-guide/',   changefreq: 'weekly',  priority: '0.95', lastmod: freshestInCategory('golf-tech') },
    { loc: '/golf-ball-complete-guide/',       changefreq: 'weekly',  priority: '0.95', lastmod: freshestInCategory('gear-reviews') },
    { loc: '/tools/',                          changefreq: 'monthly', priority: '0.8',  lastmod: '2026-05-17' },
    { loc: '/golf-simulator-cost-calculator/', changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-17' },
    { loc: '/golf-club-distance-chart/',       changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-17' },
    { loc: '/golf-equipment-budget-planner/',  changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-17' },
    { loc: '/golf-handicap-calculator/',  changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-22' },
    { loc: '/golf-swing-speed-chart/',       changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-22' },
    { loc: '/golf-ball-compression-chart/',  changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-22' },
    { loc: '/club-distance-calculator/',     changefreq: 'monthly', priority: '0.85', lastmod: '2026-05-22' },
    { loc: '/golf-ball-finder/',             changefreq: 'monthly', priority: '0.80', lastmod: '2026-05-22' },
    { loc: '/launch-monitor-room-checker/',  changefreq: 'monthly', priority: '0.80', lastmod: '2026-05-22' },
    { loc: '/golf-simulator-projector-distance-calculator/', changefreq: 'monthly', priority: '0.80', lastmod: '2026-05-22' },
  ];

  return new Response(buildSitemapXml(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
