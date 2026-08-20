#!/usr/bin/env node
// validate-internal-links.ts — post-build check for internal 404s.
//
// Runs against dist/, after astro build, because it is the only way to know
// what actually exists. Source-level checks cannot see this: a `related` entry
// pointing at a slug nobody ever wrote is valid TypeScript, renders a normal
// anchor, and fails silently for the reader who clicks it.
//
// The full-system audit found five, all in `related` lists in articles.ts —
// including /office-hacks/, which had been noindexed and pulled from the
// sitemap while a live page went on linking to it. Nothing else caught them
// across 37 sprints.

import fs from 'fs';
import path from 'path';

const pages = new Set<string>();
const assets = new Set<string>();
const files: string[] = [];

(function walk(dir: string, base = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full, `${base}/${e.name}`); continue; }
    assets.add(`${base}/${e.name}`);
    if (e.name === 'index.html') pages.add(`${base}/`);
    else if (e.name.endsWith('.html')) pages.add(`${base}/${e.name}`);
    if (e.name.endsWith('.html')) files.push(full);
  }
})('dist');

const SKIP = /\.(xml|txt|pdf|jpg|jpeg|png|webp|svg|ico|json|css|js|webmanifest|mjs)$/;
const broken = new Map<string, Set<string>>();

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const from = f.replace(/^dist/, '').replace(/index\.html$/, '');
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const u = m[1];
    if (u === '/' || pages.has(u) || assets.has(u) || pages.has(u + '/') || SKIP.test(u)) continue;
    if (!broken.has(u)) broken.set(u, new Set());
    broken.get(u)!.add(from);
  }
}

if (broken.size) {
  console.error(`\n❌ ${broken.size} internal link target(s) do not exist — readers clicking these get a 404:\n`);
  for (const [u, froms] of broken)
    console.error(`   ${u}\n      linked from: ${[...froms].slice(0, 3).join(', ')}${froms.size > 3 ? ` (+${froms.size - 3} more)` : ''}`);
  console.error(`\nFix the target slug in src/data (usually a 'related' entry), or create the page.\n`);
  process.exit(1);
}
console.log(`✅ Internal links: all ${files.length} pages checked, no broken targets.`);
