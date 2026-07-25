#!/usr/bin/env node
// Guard: a section heading is a heading, not a paragraph.
// A body paragraph in `h2` renders as a giant heading AND leaks into the
// Product schema `name` field. Both happened on /arccos-caddie-review/.
import { ARTICLES } from '../src/data/articles.ts';

const MAX_H2 = 120;
let errors = 0;

for (const article of ARTICLES as any[]) {
  for (const section of article.sections ?? []) {
    const h2 = section.h2 ?? '';
    if (h2.length > MAX_H2) {
      console.error(
        `Heading too long (${h2.length} chars, max ${MAX_H2}): ${article.slug}\n` +
        `    "${h2.slice(0, 90)}..."\n` +
        `    A heading this long is body text in the wrong field. Move it to 'body'.`,
      );
      errors++;
    }
    if (!h2.trim()) {
      console.error(`Empty h2 in section of ${article.slug}`);
      errors++;
    }
  }
}

if (errors > 0) { console.error(`\n❌ ${errors} malformed heading(s).`); process.exit(1); }
console.log('✅ All section headings are headings, not paragraphs.');
