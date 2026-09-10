/**
 * validate-robots-directives.ts — every indexable page gets the same snippet rules.
 *
 * WHY
 * "index, follow" alone lets Google truncate the snippet and show a small image
 * thumbnail, or none. `max-image-preview:large` permits the large thumbnail that
 * dominates a mobile result; `max-snippet:-1` removes the length cap. Both are
 * Google-documented and act on click-through rate, not ranking.
 *
 * Before 2026-09-10 this site had them on 8 hub pages and NOT on the other 257 —
 * including /golf-ball-compression-chart/, which carries 39% of all clicks. The
 * cause was 33 separate hardcoded `robots:` strings across seo.ts and .astro
 * pages. This guard exists so that cannot happen again: use ROBOTS_INDEX from
 * src/lib/seo.ts rather than writing the string.
 *
 * A page may legitimately be noindex (thin, legal, or local pages). Those are
 * allowed and counted, not failed — the ratchet is on the count, so adding a new
 * noindex page is a deliberate act that has to be acknowledged here.
 */
import fs from 'node:fs';
import path from 'node:path';

const RICH = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
/** Ratchet: pages deliberately kept out of the index. May only go DOWN. */
const NOINDEX_ALLOWED = 11;

const pages: string[] = [];
(function walk(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
})('dist');

const wrong: string[] = [];
let noindex = 0, rich = 0, missing = 0;

for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(/<meta name="robots" content="([^"]*)"/);
  const url = p.replace(/^dist/, '').replace(/\/index\.html$/, '/') || '/';
  if (!m) { missing++; wrong.push(`${url}  — no robots meta at all`); continue; }
  const v = m[1].trim();
  if (v.startsWith('noindex')) { noindex++; continue; }
  if (v === RICH) { rich++; continue; }
  wrong.push(`${url}  — "${v}"`);
}

if (wrong.length) {
  console.log(`\n❌ ${wrong.length} indexable page(s) do not carry the standard robots directives:`);
  for (const w of wrong.slice(0, 12)) console.log('   ' + w);
  if (wrong.length > 12) console.log(`   … ${wrong.length - 12} more`);
  console.log(`\n   Expected: "${RICH}"`);
  console.log('   Use ROBOTS_INDEX from src/lib/seo.ts instead of a literal string.');
  process.exit(1);
}

if (noindex > NOINDEX_ALLOWED) {
  console.log(`\n❌ ${noindex} noindex page(s), ceiling ${NOINDEX_ALLOWED}. This number may only go down.`);
  console.log('   A new noindex page hides it from search — confirm that is intended, then raise the ceiling deliberately.');
  process.exit(1);
}

console.log(`✅ Robots directives: ${rich} indexable page(s) carry max-snippet/max-image-preview; ${noindex} noindex (ceiling ${NOINDEX_ALLOWED}).`);
