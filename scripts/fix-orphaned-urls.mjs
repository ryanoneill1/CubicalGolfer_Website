#!/usr/bin/env node
/**
 * scripts/fix-orphaned-urls.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Adds 301s for URLs Google has indexed that the site no longer builds.
 *
 * The orphan list was derived by diffing the Search Console page export against
 * `dist/` AFTER a real `astro build` — not by parsing articles.ts. Parsing is
 * unreliable here because articles use two slug formats:
 *     id: 'x',\n    slug: '/y/'        and        id: 'x', slug: '/y/'
 * A regex anchored to the first form silently misses ~15 live articles.
 *
 * This script only writes _redirects. It does NOT touch articles.ts — every
 * internal href in articles.ts resolves against the built output.
 */
import fs from 'fs';
const REDIRECTS = '_redirects';

// orphan -> live target. Verified: each key absent from dist/, each value present.
const MAP = {
  '/best-golf-irons-high-handicapper/':               '/best-golf-irons-2026/',
  '/best-game-improvement-irons-2026/':               '/best-golf-irons-2026/',
  '/most-forgiving-irons/':                           '/best-golf-irons-2026/',
  '/rapsodo-vs-garmin-r10/':                          '/compare/garmin-r10-vs-rapsodo-mlm2pro/',
  '/golf-mental-game-tips/':                          '/improve-your-golf-game/',
  '/golf-club-fitting-guide/':                        '/iron-fitting-guide-beginners/',
};

const before = fs.readFileSync(REDIRECTS, 'utf8');
const existing = new Set(
  before.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).map(l => l.trim().split(/\s+/)[0]),
);
const added = Object.entries(MAP).filter(([o]) => !existing.has(o)).map(([o, t]) => `${o}  ${t}  301`);

let out = before.replace(
  /# ─+\n# Search Console "Not found \(404\)"[\s\S]*?# \/old-404-url-5\/  \/best-golf-irons-2026\/  301\n?/,
  '',
).trimEnd();
if (added.length) {
  out += '\n\n# ─────────────────────────────────────────────────────────────────────────────\n'
       + '# Orphaned URLs — indexed by Google, no longer produced by the build.\n'
       + '# Verified against dist/ after a real astro build.\n'
       + added.join('\n') + '\n';
}
fs.writeFileSync(REDIRECTS, out);

console.log('── ORPHAN REDIRECTS ─────────────────────────────────────────────────');
console.log(`301s added: ${added.length}`);
for (const a of added) console.log('   ' + a);
console.log(`placeholder old-404-url block removed: ${before.includes('old-404-url') && !out.includes('old-404-url')}`);
