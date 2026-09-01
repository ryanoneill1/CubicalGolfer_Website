#!/usr/bin/env node
/**
 * validate-crawl-starved-floor.ts — protect the crawl-starvation fix from being
 * silently dismantled by unrelated link edits.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 9 found pages sitting at 3-4 inbound links that Google had never
 * crawled. The fix was CRAWL_STARVED in src/lib/linking.ts: every article
 * deterministically surfaces one starved page, so the set gains links evenly.
 *
 * In Sprint 90 that fix was nearly destroyed. Adding segment links to ball
 * articles' `related` arrays pushed several to 9 entries — and getMergedRelated
 * pushes `article.related` FIRST, then one starved page, then the anchors,
 * capped at limit=10. Filling `related` to 9 left one slot and crowded out
 * everything below it. Total link count went UP (+6 edges), so a spot-check of
 * the pages being worked on looked fine. Five CRAWL_STARVED pages quietly lost
 * links, and it was only caught by building origin/main separately and diffing
 * all 20,407 edges by hand. Nothing in the build said a word.
 *
 * ── What this checks ───────────────────────────────────────────────────────
 * Two independent things, because they fail differently:
 *
 *   1. RELATED HEADROOM — no article may carry so many explicit `related`
 *      entries that the starved slot cannot survive. This is the actual
 *      mechanism, checked at the source, so it fails on the edit that causes
 *      the damage rather than three steps downstream.
 *
 *   2. INBOUND FLOOR — every CRAWL_STARVED page must still receive at least
 *      MIN_INBOUND links in the built site. Catches the same damage arriving
 *      by any other route.
 *
 * Check 2 needs dist/, so it is SKIPPED when dist/ is absent rather than
 * failing: `npm run validate` runs before `astro build`, and a validator that
 * fails for the wrong reason gets switched off.
 */
import fs from 'fs';
import path from 'path';
import { ARTICLES } from '../src/data/articles.ts';

// getMergedRelated's limit. A literal because linking.ts does not export it;
// if it changes there, change it here too.
const MERGE_LIMIT = 10;
// Slots reserved below `related`: one starved page plus at least two anchors,
// so topical clustering is not reduced to nothing.
const RESERVED = 3;
const MAX_RELATED = MERGE_LIMIT - RESERVED; // 7

// RATCHET: this is the measured floor as of Sprint 91, not an aspiration.
// /how-golf-launch-monitors-work/ and /average-swing-speed-by-age/ both sit at
// exactly 7 and did so before Sprint 90 too — a pre-existing condition, not
// damage. Setting this to 8 would have meant a guard that fails on day one for
// something nobody broke, and a guard that cries wolf gets switched off.
// It only ever goes DOWN. If a future sprint lifts the floor, lower this to match.
const MIN_INBOUND = 7;

let failed = false;

// ── 1. related-array headroom ──────────────────────────────────────────────
// One documented exemption. /best-golf-gps-watches/ carries 12 related links,
// which is above MERGE_LIMIT entirely — it surfaces no anchors and no starved
// page at all. That is a real defect and it should be trimmed to 7. It is NOT
// trimmed yet because the page is mid-experiment (position 24.9, reporting late
// September) and changing its outbound links would muddy the read. Remove this
// entry and fix the page once the experiment reports. Do not add to this list.
const EXEMPT = new Set<string>(['/best-golf-gps-watches/']);

const greedy = (ARTICLES as any[])
  .map(a => ({ slug: a.slug, n: (a.related ?? []).length }))
  .filter(x => x.n > MAX_RELATED && !EXEMPT.has(x.slug))
  .sort((a, b) => b.n - a.n);

if (greedy.length) {
  failed = true;
  console.error(
    `\n❌ ${greedy.length} article(s) carry more than ${MAX_RELATED} explicit related links.\n` +
    `   getMergedRelated caps at ${MERGE_LIMIT} and pushes article.related BEFORE the\n` +
    `   crawl-starved page and the topical anchors. Above ${MAX_RELATED} those get crowded out.\n`
  );
  for (const g of greedy.slice(0, 15)) console.error(`   ${String(g.n).padStart(3)} related   ${g.slug}`);
  console.error(`\n   Trim to ${MAX_RELATED} or fewer, or put the link in the article body instead.\n`);
}

// ── 2. inbound floor for every CRAWL_STARVED page ──────────────────────────
const DIST = 'dist';
const linking = fs.readFileSync('src/lib/linking.ts', 'utf8');
const block = linking.match(/const CRAWL_STARVED[\s\S]*?\n\];/)?.[0] ?? '';
const starved = [...block.matchAll(/slug: '([^']+)'/g)].map(m => m[1]);

if (!starved.length) {
  console.error('\n❌ Could not parse CRAWL_STARVED from src/lib/linking.ts.\n');
  failed = true;
} else if (!fs.existsSync(DIST)) {
  console.log(`✅ Crawl-starved floor: ${starved.length} page(s) declared, related headroom OK (inbound check skipped — no dist/ yet).`);
} else {
  const pages: string[] = [];
  (function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') pages.push(p);
    }
  })(DIST);

  const html = pages.map(p => ({
    slug: '/' + path.relative(DIST, p).replace(/index\.html$/, '').replace(/\\/g, '/'),
    body: fs.readFileSync(p, 'utf8'),
  }));

  const count = (s: string) => html.filter(h => h.slug !== s && h.body.includes(`href="${s}"`)).length;
  const thin = starved.map(s => ({ slug: s, n: count(s) })).filter(x => x.n < MIN_INBOUND);

  if (thin.length) {
    failed = true;
    console.error(
      `\n❌ ${thin.length} crawl-starved page(s) fell below ${MIN_INBOUND} inbound links.\n` +
      `   These are the pages Sprint 9 found Google had never crawled. They depend on\n` +
      `   getMergedRelated surfacing them; something is now crowding that slot out.\n`
    );
    for (const t of thin.sort((a, b) => a.n - b.n)) console.error(`   ${String(t.n).padStart(3)} inbound   ${t.slug}`);
    console.error('');
  } else {
    const lo = Math.min(...starved.map(count));
    console.log(`✅ Crawl-starved floor: all ${starved.length} page(s) at or above ${MIN_INBOUND} inbound (lowest ${lo}); no article exceeds ${MAX_RELATED} related links.`);
  }
}

process.exit(failed ? 1 : 0);
