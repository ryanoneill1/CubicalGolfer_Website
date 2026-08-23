#!/usr/bin/env node
/**
 * update-lastmod.ts — give every page a `lastmod` that is actually true.
 *
 *     npm run lastmod          # update the manifest after changing content
 *     npm run lastmod -- --check   # report drift without writing (used by the validator)
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Google Search Console showed 23 URLs as "Discovered – currently not indexed"
 * with `last crawled 1969-12-31` — epoch zero, meaning never fetched at all, for
 * three months. Two obvious explanations were tested and both failed:
 *
 *   · Weak internal linking? No. Those pages have a MEDIAN of 14 inbound body
 *     links against the site median of 8. /brands/callaway/ has 46 and has never
 *     been crawled.
 *   · Thin content? No. The never-crawled /compare/ pages run a median 1,914
 *     body words against 1,123 for the ones that ARE indexed. They are longer.
 *
 * The Crawl Stats export gave the real answer:
 *
 *     Refresh    86.9%   (re-fetching pages Google already has)
 *     Discovery  13.1%   (fetching URLs it has never seen)
 *
 * 48 requests/day x 56% HTML x 13% discovery = roughly 3.5 new-URL fetches a day,
 * while 301s and 404s alone burn 5.3/day. Google spends more crawl on redirects
 * and errors than on finding new pages.
 *
 * And the one signal that could tell it what to skip was lying:
 *
 *     2026-07-21   100 pages   38.9% of the sitemap, all claiming one change date
 *
 * A bulk-stamped lastmod is worse than none. Google trusts lastmod only where a
 * site proves it accurate; an unreliable one gets ignored, and it falls back to
 * refreshing broadly — which is exactly the 86.9% above.
 *
 * ── How this works ─────────────────────────────────────────────────────────
 * Each page's lastmod is stored in src/data/lastmod-manifest.json alongside a
 * hash of that page's OWN content. Re-run this script and:
 *
 *   hash unchanged  →  lastmod stays put, however many times you build
 *   hash changed    →  lastmod becomes today
 *   new page        →  lastmod becomes today
 *
 * The hash deliberately covers only the page's own source — its record in
 * articles.ts / comparisons.ts / cities.ts, or its .astro file. It does NOT
 * cover the layout, nav or footer. That is the whole point: a footer edit must
 * not restamp 250 pages, because restamping 250 pages is the behaviour we are
 * trying to stop.
 *
 * `dateModified` on each record still drives the visible "last updated" line and
 * the JSON-LD. This governs the sitemap only. Where a record has a real
 * dateModified and no content change since, that date is preserved — the first
 * run seeds from it, so switching to this system changes nothing on day one and
 * only starts telling the truth from the next edit onward.
 */

import fs from 'fs';
import crypto from 'crypto';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import { CITIES } from '../src/data/cities';
import { BRANDS } from '../src/data/brands';

const MANIFEST = 'src/data/lastmod-manifest.json';
const CHECK = process.argv.includes('--check');
const TODAY = new Date().toISOString().slice(0, 10);
// Undated pages inherit the site's long-standing fallback rather than today.
// Understating freshness costs nothing; overstating it is what makes Google
// stop trusting lastmod, which is the problem this script exists to fix.
const UNDATED_FALLBACK = '2026-04-14';

type Entry = { hash: string; lastmod: string };
type Manifest = Record<string, Entry>;

const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

/** Hash a record's content, ignoring the date fields themselves. */
function recordHash(rec: any): string {
  const { dateModified, datePublished, ...content } = rec ?? {};
  return sha(JSON.stringify(content));
}

/** Every page that appears in a sitemap, with a hash of its own source. */
function currentPages(): Record<string, { hash: string; seed?: string }> {
  const out: Record<string, { hash: string; seed?: string }> = {};

  for (const a of ARTICLES as any[]) {
    out[a.slug] = { hash: recordHash(a), seed: a.dateModified ?? a.datePublished };
  }
  for (const c of COMPARISONS as any[]) {
    out[`/compare/${c.slug}/`] = { hash: recordHash(c), seed: c.dateModified };
  }
  for (const c of CITIES as any[]) {
    out[`/courses/${c.slug}/`] = { hash: recordHash(c), seed: c.dateModified };
  }
  for (const b of BRANDS as any[]) {
    out[`/brands/${b.slug}/`] = { hash: recordHash(b), seed: b.dateModified };
  }

  // Bespoke pages: hash the .astro source. A page with no record of its own is
  // its own source of truth.
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
      d.isDirectory() ? walk(`${dir}/${d.name}`) : [`${dir}/${d.name}`]);
  for (const f of walk('src/pages')) {
    if (!f.endsWith('.astro')) continue;
    if (f.includes('[')) continue;                       // dynamic routes are covered above
    const slug = f.endsWith('/index.astro')
      ? (f.replace(/^src\/pages/, '').replace(/index\.astro$/, '') || '/')
      : f.replace(/^src\/pages/, '').replace(/\.astro$/, '') + '/';
    const fileHash = sha(fs.readFileSync(f, 'utf-8'));
    // A page can have BOTH a record and its own .astro file — the compression
    // chart is one, and it is the biggest page on the site at 60k impressions.
    // Hashing only the record made every edit to its .astro invisible: the file
    // changed, the manifest reported "0 changed", and the sitemap would have kept
    // telling Google a rewritten page was untouched. Combine both sources so a
    // change to either one counts.
    out[slug] = out[slug]
      ? { hash: sha(out[slug].hash + fileHash), seed: out[slug].seed }
      : { hash: fileHash };
  }
  return out;
}

function main() {
  const pages = currentPages();
  const manifest: Manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'))
    : {};

  const bootstrap = Object.keys(manifest).length === 0;
  const added: string[] = [], changed: string[] = [], removed: string[] = [];

  for (const [slug, { hash, seed }] of Object.entries(pages)) {
    const prev = manifest[slug];
    if (!prev) {
      // First ever run: seed from the record's own dateModified so nothing moves
      // today. A genuinely new page has no seed and correctly gets today.
      manifest[slug] = { hash, lastmod: seed ?? (bootstrap ? UNDATED_FALLBACK : TODAY) };
      added.push(slug);
    } else if (prev.hash !== hash) {
      manifest[slug] = { hash, lastmod: TODAY };
      changed.push(slug);
    }
  }
  for (const slug of Object.keys(manifest)) {
    if (!pages[slug]) { removed.push(slug); delete manifest[slug]; }
  }

  if (CHECK) {
    const drift = changed.length + added.filter(s => !bootstrap).length;
    if (drift) {
      console.error(`\n❌ lastmod manifest is stale — ${drift} page(s) changed since it was last written.`);
      [...changed, ...added].slice(0, 12).forEach(s => console.error('   ' + s));
      console.error('\n   Run `npm run lastmod` and ship the updated manifest.');
      console.error('   Shipping without it tells Google these pages did not change, which is how');
      console.error('   lastmod stops being trusted in the first place.\n');
      process.exit(1);
    }
    console.log(`✅ lastmod: manifest matches all ${Object.keys(pages).length} pages.`);
    return;
  }

  const sorted: Manifest = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');

  const dates = new Map<string, number>();
  for (const v of Object.values(sorted)) dates.set(v.lastmod, (dates.get(v.lastmod) ?? 0) + 1);
  const top = [...dates.entries()].sort((a, b) => b[1] - a[1])[0];

  console.log(bootstrap
    ? `lastmod: seeded ${added.length} pages from their existing dateModified.`
    : `lastmod: ${changed.length} changed, ${added.length} new, ${removed.length} removed.`);
  if (changed.length) changed.slice(0, 10).forEach(s => console.log('   changed  ' + s));
  console.log(`   ${Object.keys(sorted).length} pages across ${dates.size} distinct dates ` +
              `(largest cluster: ${top[1]} on ${top[0]}, ${(top[1] / Object.keys(sorted).length * 100).toFixed(0)}%)`);
}

main();
