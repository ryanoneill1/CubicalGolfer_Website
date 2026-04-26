#!/usr/bin/env node
// scripts/generate-search-index.ts
// Builds a JSON search index at build time for client-side site search.

import { ARTICLES } from '../src/data/articles.ts';
import { COMPARISONS } from '../src/data/comparisons.ts';
import { CITIES } from '../src/data/cities.ts';
import fs from 'fs';

const index: any[] = [];

// Articles
for (const a of ARTICLES as any[]) {
  index.push({
    slug: a.slug,
    title: a.titleDisplay ?? a.title,
    excerpt: a.excerpt ?? a.description ?? '',
    tag: a.tag ?? a.pageType ?? '',
    category: a.category ?? '',
  });
}

// Comparisons
for (const c of COMPARISONS as any[]) {
  index.push({
    slug: `/compare/${c.slug}/`,
    title: c.title,
    excerpt: c.description ?? '',
    tag: 'COMPARISON',
    category: 'compare',
  });
}

// City pages
for (const city of CITIES as any[]) {
  index.push({
    slug: `/courses/${city.slug}/`,
    title: city.name ? `Best Golf Courses in ${city.name}` : city.slug,
    excerpt: city.intro ?? '',
    tag: 'LOCAL',
    category: 'courses',
  });
}

fs.mkdirSync('public/api', { recursive: true });
fs.writeFileSync('public/api/search-index.json', JSON.stringify(index));
console.log(`✅ Search index: ${index.length} entries written to public/api/search-index.json`);
