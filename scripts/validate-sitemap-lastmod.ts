#!/usr/bin/env node
/**
 * validate-sitemap-lastmod.ts — Sprint 45
 *
 * Google uses <lastmod> to decide what to recrawl. A date that is staler than
 * the content it describes tells Google not to bother.
 *
 * /golf-ball-compression-chart/ carried a hardcoded lastmod of 2026-05-22 in
 * sitemap-core while its ARTICLES record said 2026-07-23. That page is the
 * single biggest asset on the site — its section anchors alone account for
 * roughly 12% of all site impressions — and Google was being told it had not
 * changed in two months.
 *
 * The category hubs already derive their dates from the freshest article in the
 * category. The bug was one entry that hardcoded a date next to a record that
 * owned one. This fails the build if that ever happens again.
 *
 * Scope note: only entries whose slug matches an ARTICLES or COMPARISONS record
 * are checked. Pages with no record (/about/, /how-we-test/) legitimately carry
 * a hand-set date and are skipped rather than guessed at.
 */
import fs from 'node:fs';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const recs = new Map<string, string>();
for (const a of ARTICLES as any[]) {
  const d = a.dateModified ?? a.datePublished;
  if (d) recs.set(String(a.slug), String(d));
}
for (const c of COMPARISONS as any[]) {
  const d = c.dateModified ?? c.datePublished;
  if (d) recs.set('/compare/' + String(c.slug).replace(/^\//, '').replace(/\/$/, '') + '/', String(d));
}

const bad: string[] = [];
let checked = 0;
for (const f of fs.readdirSync('src/pages').filter(n => n.startsWith('sitemap') && n.endsWith('.ts'))) {
  const src = fs.readFileSync(`src/pages/${f}`, 'utf8');
  for (const m of src.matchAll(/loc:\s*'([^']+)'[^}]*?lastmod:\s*'([0-9-]{10})'/g)) {
    const [, loc, lm] = m;
    const real = recs.get(loc);
    if (!real) continue;           // no record owns this page — hand-set date is fine
    checked++;
    if (real !== lm) bad.push(`  ${f}  ${loc}\n      sitemap says ${lm}, the record says ${real}`);
  }
}

console.log(`validate-sitemap-lastmod: ${checked} hardcoded lastmod(s) that a record owns — ${bad.length} stale`);
if (bad.length) {
  console.error('\nFAIL: a sitemap lastmod is staler than the content it describes.');
  console.error('Derive it from the record instead of hardcoding it:\n');
  bad.forEach(b => console.error(b));
  process.exit(1);
}
