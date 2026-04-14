---
// src/pages/sitemap.xml.ts
// Generates /sitemap.xml at build time from live article/comparison/city data.
// This REPLACES public/sitemap.xml — the source of truth is now the data files.
import type { APIRoute } from 'astro';
import { ARTICLES }     from '../data/articles';
import { COMPARISONS }  from '../data/comparisons';
import { CITIES }       from '../data/cities';

export const GET: APIRoute = () => {
  const DOMAIN = 'https://www.cubicalgolfer.com';
  const TODAY  = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // ── All URLs with their metadata ─────────────────────────────────────────
  const entries: Array<{ loc: string; freq: string; priority: string }> = [

    // Static / category pages
    { loc: '/',                        freq: 'weekly',  priority: '1.0' },
    { loc: '/about/',                  freq: 'monthly', priority: '0.7' },
    { loc: '/how-we-test/',            freq: 'monthly', priority: '0.7' },
    { loc: '/gear-reviews/',           freq: 'weekly',  priority: '0.9' },
    { loc: '/golf-tech/',              freq: 'weekly',  priority: '0.9' },
    { loc: '/golf-accessories/',       freq: 'weekly',  priority: '0.9' },
    { loc: '/golf-lifestyle/',         freq: 'weekly',  priority: '0.8' },
    { loc: '/improve-your-golf-game/', freq: 'weekly',  priority: '0.9' },
    { loc: '/compare/',                freq: 'weekly',  priority: '0.8' },
    { loc: '/courses/',                freq: 'monthly', priority: '0.8' },

    // Articles — generated from articles.ts
    ...ARTICLES.map(a => ({
      loc:      a.slug,
      freq:     'monthly',
      priority: '0.8',
    })),

    // Comparisons — generated from comparisons.ts
    ...COMPARISONS.map(c => ({
      loc:      `/compare/${c.slug}/`,
      freq:     'monthly',
      priority: '0.8',
    })),

    // City course pages — generated from cities.ts
    ...CITIES.map(city => ({
      loc:      `/courses/${city.slug}/`,
      freq:     'monthly',
      priority: '0.7',
    })),
  ];

  // ── Build valid XML ───────────────────────────────────────────────────────
  const urlBlocks = entries.map(({ loc, freq, priority }) =>
    `  <url>\n` +
    `    <loc>${DOMAIN}${loc}</loc>\n` +
    `    <lastmod>${TODAY}</lastmod>\n` +
    `    <changefreq>${freq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`
  ).join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlBlocks + '\n' +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
