#!/usr/bin/env node
// scripts/validate-thumbnails.ts — v2
// (1) Every article thumbnail AND ogImage file must exist on disk.
// (2) SEMANTIC GUARD: the thumbnail filename must share at least one
//     meaningful token with the article slug, so a card can never show
//     art for a different page (the "forgiving-drivers thumb on the
//     GPS-watches card" class of bug). Legit generic pairings go in
//     the ALLOWLIST below with a reason.

import { ARTICLES } from '../src/data/articles.ts';
import fs from 'fs';
import path from 'path';

const STOP = new Set(['best','golf','2026','the','for','a','and','of','to','vs','with','guide','thumb','how','what','why','is','on','in','your','you','do','i','review']);
const toks = (s: string) => s.toLowerCase().replace(/\.(webp|png|jpg)$/,'').split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t));

// slug → thumbnail filename pairs that are intentionally generic.
const ALLOWLIST: Record<string,string> = {
  '/how-golf-launch-monitors-work/': 'launch-monitors-thumb.webp', // topic page sharing the category art
};

let errors = 0;
for (const article of ARTICLES) {
  const a = article as any;
  for (const field of ['thumbnail'] as const) {
    if (!a[field]) continue;
    const filePath = path.join(process.cwd(), 'public', a[field]);
    if (!fs.existsSync(filePath)) { console.error(`Missing ${field}: ${a[field]} (${a.slug})`); errors++; }
  }
  if (a.ogImage && a.ogImage.includes('/images/')) {
    const rel = a.ogImage.replace(/^https?:\/\/[^/]+/, '');
    if (!fs.existsSync(path.join(process.cwd(), 'public', rel))) { console.error(`Missing ogImage: ${rel} (${a.slug})`); errors++; }
  }
  if (a.thumbnail) {
    const file = a.thumbnail.split('/').pop()!;
    if (ALLOWLIST[a.slug] === file) continue;
    if (file.startsWith('compare-')) continue; // generator-owned
    const st = new Set(toks(a.slug));
    const overlap = toks(file).filter(t => st.has(t) || [...st].some(s2 => s2.includes(t) || t.includes(s2)));
    if (overlap.length === 0) {
      console.error(`Thumbnail/slug mismatch: ${a.slug} → ${file} (art belongs to a different page; fix the reference or allowlist with a reason)`);
      errors++;
    }
  }
}
if (errors > 0) { console.error(`\n❌ ${errors} thumbnail problem(s).`); process.exit(1); }
console.log(`✅ All ${ARTICLES.length} article thumbnails exist AND match their pages.`);
