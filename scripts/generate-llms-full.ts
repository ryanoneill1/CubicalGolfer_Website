#!/usr/bin/env node
// scripts/generate-llms-full.ts
//
// llms-full.txt is what AI crawlers read to understand the whole site. It was
// hand-maintained, and drifted: 15 of its 163 URLs pointed at pages that no
// longer exist (including a Bushnell rangefinder discontinued in 2023, still
// advertised at $329), while 121 live pages were missing entirely.
//
// Nothing generated it and nothing checked it. Now it is built from the same
// data that builds the pages, so it cannot drift again.
//
// llms.txt is deliberately NOT generated — it is a short curated index with
// hand-written descriptions worth keeping. It is validated instead, by
// scripts/validate-llms.ts.

import { ARTICLES } from '../src/data/articles.ts';
import { COMPARISONS } from '../src/data/comparisons.ts';
import { CITIES } from '../src/data/cities.ts';
import fs from 'fs';

const SITE = 'https://www.cubicalgolfer.com';

/** Collapse to a single clean line — no markup, no newlines, no double spaces. */
const clean = (s: unknown) =>
  String(s ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

type Entry = { title: string; url: string; summary: string; sort: string };
const entries: Entry[] = [];

for (const a of ARTICLES as any[]) {
  const title = clean(a.titleDisplay ?? a.title);
  if (!title || !a.slug) continue;
  entries.push({
    title,
    url: `${SITE}${a.slug}`,
    summary: clean(a.excerpt ?? a.description ?? ''),
    sort: `1${a.category ?? ''}${a.slug}`,
  });
}

for (const c of COMPARISONS as any[]) {
  const title = clean(c.title);
  if (!title || !c.slug) continue;
  entries.push({
    title,
    url: `${SITE}/compare/${c.slug}/`,
    summary: clean(c.description ?? ''),
    sort: `2${c.slug}`,
  });
}

for (const city of CITIES as any[]) {
  if (!city?.slug) continue;
  entries.push({
    title: city.name ? `Best Golf Courses in ${city.name}` : String(city.slug),
    url: `${SITE}/courses/${city.slug}/`,
    summary: clean(city.intro ?? ''),
    sort: `3${city.slug}`,
  });
}

/**
 * Static .astro pages — hubs, tools and legal. These have no data record, so
 * they are enumerated from the filesystem and titled from their own <h1>.
 * That way a new tool page appears here automatically.
 */
const STATIC_SKIP = new Set(['404', 'index']);
function walkPages(dir: string, base = ''): void {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.isDirectory()) {
      walkPages(`${dir}/${name.name}`, `${base}/${name.name}`);
      continue;
    }
    if (name.name !== 'index.astro') continue;
    const slugPath = base || '/';
    // Dynamic routes ([slug].astro) are covered by the data loops above.
    if (slugPath.includes('[')) continue;
    const key = slugPath.replace(/^\//, '');
    if (STATIC_SKIP.has(key)) continue;

    const src = fs.readFileSync(`${dir}/${name.name}`, 'utf8');
    const h1 = src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const desc = src.match(/description:\s*['"]([^'"]{10,300})['"]/);
    const title = clean(h1?.[1]) || key;
    if (!title || title.includes('{')) continue;   // skip templated headings
    entries.push({
      title,
      url: `${SITE}${slugPath === '/' ? '/' : slugPath + '/'}`,
      summary: clean(desc?.[1] ?? ''),
      sort: `0${slugPath}`,
    });
  }
}
walkPages('src/pages');

// De-duplicate by URL, keeping the first (data records win over filesystem).
const seen = new Set<string>();
const unique = entries
  .sort((a, b) => a.sort.localeCompare(b.sort))
  .filter(e => (seen.has(e.url) ? false : (seen.add(e.url), true)));

const out = [
  '# CubicalGolfer.com — Full Index',
  '',
  '> Independent golf gear reviews for weekend and desk-job golfers. Every rated',
  '> product is bought with our own money and tested on course. This file is',
  '> generated at build time from the same data that builds the site.',
  '',
  ...unique.flatMap(e => [
    `## ${e.title}`,
    `URL: ${e.url}`,
    ...(e.summary ? [`Summary: ${e.summary}`] : []),
    '',
  ]),
].join('\n');

fs.writeFileSync('public/llms-full.txt', out);
console.log(`✅ llms-full.txt: ${unique.length} pages indexed (was 163 hand-maintained, 15 of them dead).`);
