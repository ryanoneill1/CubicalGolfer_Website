// src/pages/sitemap.xml.ts
// Generates /sitemap.xml dynamically at build time from data files.
// Uses real per-page dateModified — never today's date.

import type { APIRoute } from 'astro';
import { ARTICLES }    from '../data/articles';
import { COMPARISONS } from '../data/comparisons';
import { CITIES }      from '../data/cities';

export const GET: APIRoute = async () => {
  const DOMAIN = 'https://www.cubicalgolfer.com';
  const FALLBACK_LASTMOD = '2026-04-14';

  const priorityByType: Record<string, string> = {
    'buying-guide': '0.8',
    'comparison':   '0.8',
    'tutorial':     '0.7',
    'listicle':     '0.6',
    'lifestyle':    '0.5',
    'review':       '0.7',
    'local':        '0.7',
  };
  const freqByType: Record<string, string> = {
    'buying-guide': 'weekly',
    'comparison':   'weekly',
    'tutorial':     'monthly',
    'listicle':     'monthly',
    'lifestyle':    'monthly',
    'review':       'monthly',
    'local':        'monthly',
  };

  type Entry = { loc: string; freq: string; pri: string; lastmod: string };

  const entries: Entry[] = [
    // Static + category hub pages
    { loc: '/',                         freq: 'weekly',  pri: '1.0', lastmod: FALLBACK_LASTMOD },
    { loc: '/best-golf-gear-2026/',     freq: 'weekly',  pri: '0.95', lastmod: FALLBACK_LASTMOD },
    { loc: '/about/',                   freq: 'monthly', pri: '0.7', lastmod: FALLBACK_LASTMOD },
    { loc: '/how-we-test/',             freq: 'monthly', pri: '0.7', lastmod: FALLBACK_LASTMOD },
    { loc: '/gear-reviews/',            freq: 'weekly',  pri: '0.9', lastmod: FALLBACK_LASTMOD },
    { loc: '/golf-tech/',               freq: 'weekly',  pri: '0.9', lastmod: FALLBACK_LASTMOD },
    { loc: '/golf-accessories/',        freq: 'weekly',  pri: '0.9', lastmod: FALLBACK_LASTMOD },
    { loc: '/golf-lifestyle/',          freq: 'weekly',  pri: '0.8', lastmod: FALLBACK_LASTMOD },
    { loc: '/improve-your-golf-game/',  freq: 'weekly',  pri: '0.9', lastmod: FALLBACK_LASTMOD },
    { loc: '/office-hacks/',            freq: 'weekly',  pri: '0.9', lastmod: FALLBACK_LASTMOD },
    { loc: '/gear-quiz/',               freq: 'monthly', pri: '0.8', lastmod: FALLBACK_LASTMOD },
    { loc: '/compare/',                 freq: 'weekly',  pri: '0.8', lastmod: FALLBACK_LASTMOD },
    { loc: '/courses/',                 freq: 'monthly', pri: '0.8', lastmod: FALLBACK_LASTMOD },
    { loc: '/privacy-policy/',          freq: 'yearly',  pri: '0.3', lastmod: FALLBACK_LASTMOD },
    { loc: '/terms/',                   freq: 'yearly',  pri: '0.3', lastmod: FALLBACK_LASTMOD },
    { loc: '/contact/',                 freq: 'yearly',  pri: '0.5', lastmod: FALLBACK_LASTMOD },
    { loc: '/affiliate-disclosure/',    freq: 'yearly',  pri: '0.4', lastmod: FALLBACK_LASTMOD },
    { loc: '/cookie-policy/',           freq: 'yearly',  pri: '0.3', lastmod: FALLBACK_LASTMOD },

    // Articles — priority, frequency, and lastmod from real data
    ...ARTICLES.map(a => ({
      loc:     a.slug,
      freq:    freqByType[a.pageType]    ?? 'monthly',
      pri:     priorityByType[a.pageType] ?? '0.6',
      lastmod: a.dateModified ?? a.datePublished ?? FALLBACK_LASTMOD,
    })),

    // Comparison pages
    ...COMPARISONS.map(c => ({
      loc:     `/compare/${c.slug}/`,
      freq:    'weekly',
      pri:     '0.8',
      lastmod: c.dateModified ?? FALLBACK_LASTMOD,
    })),

    // City / local pages
    ...CITIES.map(c => ({
      loc:     `/courses/${c.slug}/`,
      freq:    'monthly',
      pri:     '0.7',
      lastmod: FALLBACK_LASTMOD,
    })),
  ];

  const urlBlocks = entries.map(({ loc, freq, pri, lastmod }) =>
    `  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
  ).join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlBlocks + '\n' +
    `</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
