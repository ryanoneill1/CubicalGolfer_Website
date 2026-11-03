// src/pages/sitemap-ball-compression.xml.ts
// One entry per ball on the compression chart — Sprint 218.
//
// These pages are generated from balls.ts by
// src/pages/golf-ball-compression/[ball].astro, so this sitemap is generated
// from the same array. Add a ball to balls.ts and its page, its chart row and
// its sitemap entry all appear together; there is no list here to forget.
import type { APIRoute } from 'astro';
import { balls } from '../data/balls';
import { ARTICLES } from '../data/articles';
import { buildSitemapXml, lastmodFor } from '../lib/sitemap-utils';

const FALLBACK = '2026-11-03';

// The ball pages restate figures owned by the compression chart, so they are
// only as fresh as it is. Taking its date keeps them honest rather than
// claiming a recrawl-worthy update the content has not had.
function chartDate(): string {
  const rec = (ARTICLES as any[]).find(a => String(a.slug) === '/golf-ball-compression-chart/');
  return rec?.dateModified ?? rec?.datePublished ?? FALLBACK;
}

export const GET: APIRoute = async () => {
  const base = chartDate();
  const entries = (balls as any[])
    .filter(b => !b.discontinued)
    .map(b => ({
      loc:        `/golf-ball-compression/${b.affKey}/`,
      lastmod:    lastmodFor(`/golf-ball-compression/${b.affKey}/`, base),
      changefreq: 'monthly',
      priority:   '0.6',
    }));

  return new Response(buildSitemapXml(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
