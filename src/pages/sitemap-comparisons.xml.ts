// src/pages/sitemap-comparisons.xml.ts
// All 12 head-to-head comparison pages.

import type { APIRoute } from 'astro';
import { COMPARISONS } from '../data/comparisons';
import { buildSitemapXml, REDIRECTED_AWAY } from '../lib/sitemap-utils';

const FALLBACK = '2026-04-14';

export const GET: APIRoute = async () => {
  const entries = COMPARISONS
    .filter(c => !REDIRECTED_AWAY.has(`/compare/${c.slug}/`))
    .map(c => ({
    loc:        `/compare/${c.slug}/`,
    lastmod:    c.dateModified ?? FALLBACK,
    changefreq: 'weekly',
    priority:   '0.8',
  }));

  return new Response(buildSitemapXml(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
