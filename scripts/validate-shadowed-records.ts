#!/usr/bin/env node
// validate-shadowed-records.ts — which article records don't render?
//
// Astro resolves an explicit route over the [...slug] catch-all. So when a slug
// has BOTH a hand-built page and an ARTICLES record, the page wins and the
// record's sections, prose and FAQs never reach a reader.
//
// That is not automatically a bug. /golf-ball-compression-chart/ does exactly
// this on purpose: the .astro page holds the interactive finder and the tables,
// while the record supplies title, excerpt and the metadata behind 40
// related-card lookups elsewhere on the site. The two are in sync.
//
// It IS a trap. Sprint 37 was spent editing that record's prose and adding a
// filter to the article template, and neither could ever have rendered — the
// record looked authoritative because it was 3,200 words long and had the right
// slug. Nothing failed; the change was simply invisible.
//
// So: known-intentional pairs are listed here, and any NEW one fails the build
// with an explanation. If you add a hand-built page for a slug that already has
// a record, you have to say so here — which is the moment to decide whether the
// record should be trimmed to metadata only.

import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import fs from 'fs';
import path from 'path';

/** Slug -> why the pair exists. */
const INTENTIONAL: Record<string, string> = {
  '/golf-ball-compression-chart/':
    'Hand-built page owns the interactive ball finder and tables; the record supplies metadata for related cards.',
};

const routes = new Set<string>();
(function walk(dir: string, base = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full, `${base}/${e.name}`); continue; }
    if (!e.name.endsWith('.astro') || e.name.includes('[')) continue;
    routes.add(e.name === 'index.astro' ? `${base}/` : `${base}/${e.name.replace('.astro', '')}/`);
  }
})('src/pages');

const shadowed = [...(ARTICLES as any), ...(COMPARISONS as any)]
  .filter((a: any) => routes.has(String(a.slug)))
  .map((a: any) => ({ slug: String(a.slug), words: a.words ?? '?' }));

const unexpected = shadowed.filter(s => !(s.slug in INTENTIONAL));

// ── Records that shadow OTHER RECORDS ────────────────────────────────────────
// The check above only compares records against hand-built .astro routes. It
// missed the other way a slug can be claimed twice: the SAME slug declared in
// both articles.ts and comparisons.ts. Astro builds one page; the loser's prose
// is dead weight that still looks authoritative in the editor.
//
// Found in Sprint 45: /compare/titleist-pro-v1-vs-callaway-chrome-soft/ exists
// in both files under different titles and different dateModified values. The
// comparisons record renders; the 8,069-char articles record does not, and had
// been edited on 2026-07-21 with no way for that edit to reach a reader. Same
// trap as Sprint 37, through a different door.
const norm = (s: string) => '/' + String(s).replace(/^\//, '').replace(/\/$/, '') + '/';
const artSlugs = new Map<string, any>();
for (const a of ARTICLES as any[]) artSlugs.set(norm(a.slug), a);

const DUPLICATE_RECORDS: Record<string, string> = {
  '/compare/titleist-pro-v1-vs-callaway-chrome-soft/':
    'Known duplicate. The comparisons.ts record is the one that renders; the articles.ts record is dead and awaiting a merge-or-delete decision.',
};

const dupes: string[] = [];
for (const c of COMPARISONS as any[]) {
  const slug = norm('/compare/' + String(c.slug).replace(/^\//, ''));
  if (artSlugs.has(slug) && !(slug in DUPLICATE_RECORDS)) {
    dupes.push(`  ${slug}\n      articles.ts:    "${String(artSlugs.get(slug).title).slice(0, 60)}"\n      comparisons.ts: "${String(c.title).slice(0, 60)}"  <-- this one renders`);
  }
}
if (dupes.length) {
  console.error(`\nFAIL: ${dupes.length} slug(s) declared in BOTH articles.ts and comparisons.ts.`);
  console.error('Only one can render. Decide which owns the URL before shipping:\n');
  dupes.forEach(d => console.error(d));
  process.exit(1);
}
console.log(`validate-shadowed-records: also checked ${(COMPARISONS as any[]).length} comparison slugs against articles.ts — ${Object.keys(DUPLICATE_RECORDS).length} known duplicate, 0 new`);

if (unexpected.length) {
  console.error(`\n❌ ${unexpected.length} article record(s) are shadowed by a hand-built .astro page and will never render:\n`);
  for (const s of unexpected) console.error(`   ${s.slug}  (${s.words} words of content that no reader sees)`);
  console.error(`\nAstro serves the explicit route, so edits to the record are invisible — they do not`);
  console.error(`error, they just do nothing. Either delete the record, trim it to metadata only, or`);
  console.error(`add it to INTENTIONAL in this file with a note saying which half owns what.\n`);
  process.exit(1);
}

console.log(`✅ Shadowed records: ${shadowed.length} known pair(s), all documented — edit the .astro page, not the record.`);
