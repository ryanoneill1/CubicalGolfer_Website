// src/pages/sitemap.xml.ts
// Generates /sitemap.xml dynamically at build time from data files.
// Updated April 2026 — priority weights by page type.

import { ARTICLES }    from '../data/articles';
import { COMPARISONS } from '../data/comparisons';
import { CITIES }      from '../data/cities';

export async function GET() {
  const DOMAIN = 'https://www.cubicalgolfer.com';

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

  const entries = [
    // Static + category hub pages
    { loc: '/',                         freq: 'weekly',  pri: '1.0' },
    { loc: '/about/',                   freq: 'monthly', pri: '0.7' },
    { loc: '/how-we-test/',             freq: 'monthly', pri: '0.7' },
    { loc: '/gear-reviews/',            freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-tech/',               freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-accessories/',        freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-lifestyle/',          freq: 'weekly',  pri: '0.8' },
    { loc: '/improve-your-golf-game/',  freq: 'weekly',  pri: '0.9' },
    { loc: '/office-hacks/',             freq: 'weekly',  pri: '0.9' },
    { loc: '/compare/',                 freq: 'weekly',  pri: '0.8' },
    { loc: '/courses/',                 freq: 'monthly', pri: '0.8' },

    // Standalone HTML pages (no Astro route — served from public/)
    { loc: '/best-budget-launch-monitor.html',         freq: 'monthly', pri: '0.6' },
    { loc: '/best-golf-swing-analyzer-iphone.html',    freq: 'monthly', pri: '0.6' },
    { loc: '/best-golf-training-aids-home-practice.html', freq: 'monthly', pri: '0.6' },

    // Articles — priority and frequency by page type
    ...ARTICLES.map(a => ({
      loc:  a.slug,
      freq: freqByType[a.pageType]    ?? 'monthly',
      pri:  priorityByType[a.pageType] ?? '0.6',
    })),

    // Comparison pages
    ...COMPARISONS.map(c => ({
      loc:  `/compare/${c.slug}/`,
      freq: 'weekly',
      pri:  '0.8',
    })),

    // City / local pages
    ...CITIES.map(c => ({
      loc:  `/courses/${c.slug}/`,
      freq: 'monthly',
      pri:  '0.7',
    })),
  ];

  const today = new Date().toISOString().split('T')[0];

  const urlBlocks = entries.map(({ loc, freq, pri }) =>
    `  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
  ).join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlBlocks + '\n' +
    `</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
