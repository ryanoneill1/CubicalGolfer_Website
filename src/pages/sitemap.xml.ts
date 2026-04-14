// src/pages/sitemap.xml.ts
// Generates /sitemap.xml dynamically at build time from data files.
// Replaces the static public/sitemap.xml permanently.

import { ARTICLES }    from '../data/articles';
import { COMPARISONS } from '../data/comparisons';
import { CITIES }      from '../data/cities';

export async function GET() {
  const DOMAIN = 'https://www.cubicalgolfer.com';
  const TODAY  = new Date().toISOString().split('T')[0];

  const entries = [
    // Static + category pages
    { loc: '/',                        freq: 'weekly',  pri: '1.0' },
    { loc: '/about/',                  freq: 'monthly', pri: '0.7' },
    { loc: '/how-we-test/',            freq: 'monthly', pri: '0.7' },
    { loc: '/gear-reviews/',           freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-tech/',              freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-accessories/',       freq: 'weekly',  pri: '0.9' },
    { loc: '/golf-lifestyle/',         freq: 'weekly',  pri: '0.8' },
    { loc: '/improve-your-golf-game/', freq: 'weekly',  pri: '0.9' },
    { loc: '/compare/',                freq: 'weekly',  pri: '0.8' },
    { loc: '/courses/',                freq: 'monthly', pri: '0.8' },

    ...ARTICLES.map(a => ({ loc: a.slug,              freq: 'monthly', pri: '0.8' })),
    ...COMPARISONS.map(c => ({ loc: `/compare/${c.slug}/`, freq: 'monthly', pri: '0.8' })),
    ...CITIES.map(c => ({ loc: `/courses/${c.slug}/`, freq: 'monthly', pri: '0.7' })),
  ];

  const urlBlocks = entries.map(({ loc, freq, pri }) =>
    `  <url>\n    <loc>${'https://www.cubicalgolfer.com'}${loc}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
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
