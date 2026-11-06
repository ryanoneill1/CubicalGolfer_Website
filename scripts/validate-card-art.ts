#!/usr/bin/env node
/**
 * validate-card-art.ts — every article card must actually show something.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Hub cards render art like this (src/pages/index.astro, [...slug].astro):
 *
 *     <div class={`art-thumb ${a.thumbnail ? '' : a.thumb}`}>
 *       <span class="art-badge">{a.tag}</span>
 *       {a.thumbnail ? <img src={a.thumbnail} …/> : <span>{a.emoji}</span>}
 *     </div>
 *
 * So an article with no `thumbnail` falls back to its `emoji`, and an article
 * with neither renders a flat `thumb` colour block containing an EMPTY span.
 * Not a broken image — a blank rectangle, which no file-existence check can
 * catch because there is no file reference to check.
 *
 * /black-friday-golf-launch-monitor-deals/ shipped in that state and sat there
 * for four days. It was spotted by eye on the live site, not by the build. It
 * was the only one of 193 articles affected, and validate-thumbnails.ts could
 * not have found it: that script opens with `if (!a[field]) continue`, so an
 * article declaring no thumbnail at all is skipped rather than flagged.
 *
 * Worse, the art already existed. generate-article-thumbnails.ts had written
 * `black-friday-golf-launch-monitor-deals-thumb.webp` at its conventional path
 * on an earlier build. The generator creates the file; nothing writes the
 * reference back into articles.ts. So the image sat in public/, correct and
 * unused, while the card rendered blank.
 *
 * ── The two checks ─────────────────────────────────────────────────────────
 * 1. BLANK CARD — an article with neither `thumbnail` nor `emoji`. The defect
 *    above, stated directly.
 *
 * 2. ORPHANED ART — generated art exists at the conventional
 *    `<flattened-slug>-thumb.webp` path but the article declares no
 *    `thumbnail`. That is the generator-wrote-it-but-nobody-linked-it gap, and
 *    it is what makes check 1 cheap to fix rather than needing new art.
 *
 * ── Why it is narrow on purpose ────────────────────────────────────────────
 * A broader "no literal values" style check was tried on the ball counts in
 * Sprint 224 and produced four false positives out of ten hits, so it was
 * reverted. Both checks here are existence tests on explicit fields and one
 * deterministic path. There is nothing to misread, so no way to cry wolf.
 *
 * Deliberately NOT checked: whether `thumb` (the colour class) is set. An
 * article with a real `thumbnail` never uses it, and one with an `emoji`
 * renders legibly without it.
 */

import { ARTICLES } from '../src/data/articles.ts';
import fs from 'fs';
import path from 'path';

const THUMB_DIR = path.join(process.cwd(), 'public', 'images', 'thumbnails');

const blank: string[] = [];
const orphaned: string[] = [];

for (const article of ARTICLES as any[]) {
  const a = article;

  // 1. Nothing to render.
  if (!a.thumbnail && !a.emoji) {
    blank.push(`${a.slug} — declares neither thumbnail nor emoji; its card renders an empty ${a.thumb ?? 'untinted'} block.`);
  }

  // 2. Art exists at the conventional path but is not referenced.
  if (!a.thumbnail) {
    const flat = String(a.slug).replace(/^\/|\/$/g, '').replace(/\//g, '-');
    const file = `${flat}-thumb.webp`;
    if (fs.existsSync(path.join(THUMB_DIR, file))) {
      orphaned.push(`${a.slug} — /images/thumbnails/${file} exists but the record has no thumbnail field. Add it.`);
    }
  }
}

if (blank.length || orphaned.length) {
  console.error(`\n❌ Card art: ${blank.length} blank card(s), ${orphaned.length} orphaned image(s).\n`);
  blank.forEach(m => console.error('   BLANK    ' + m));
  orphaned.forEach(m => console.error('   ORPHANED ' + m));
  console.error(
    '\n   A card with no thumbnail and no emoji is a blank rectangle on every hub\n' +
    '   that lists it. Where the generated art already exists, the fix is one line.\n'
  );
  process.exit(1);
}

console.log(`✅ Card art: all ${(ARTICLES as any[]).length} articles render a thumbnail or an emoji; no generated art is left unreferenced.`);
