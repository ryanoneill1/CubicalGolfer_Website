/**
 * validate-astro-affiliate-links.ts — pre-build guard
 *
 * Added Aug 2026, Sprint 3.
 *
 * Every affiliate validator on this site reads `affiliate-links.ts`. Standalone
 * `.astro` pages can hardcode an affiliate href straight into the markup, and when
 * they do, NONE of those validators can see it — not the dead-destination checks,
 * not the price checks, not the retailer-label check.
 *
 * Sixteen such links existed across five pages, thirteen of them Golf Galaxy keyword
 * searches. One sent readers of /golf-club-distance-chart/ and /golf-swing-speed-chart/
 * to a Golf Galaxy search for "Kirkland Signature" — a Costco house brand Golf Galaxy
 * does not carry, returning 48 unrelated products. It had been live for months and
 * nothing could flag it.
 *
 * The rule: an affiliate URL appearing in an .astro page must be a URL that also
 * exists in the registry. Then every registry validator applies to it transitively,
 * and a link can only be as wrong as its registry entry.
 *
 * Links inside a client-side <script> must be string literals (an Astro expression
 * cannot be evaluated inside a JS string), so those are allowed to be literal — but
 * they still have to match a registry URL exactly.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AFFILIATE } from '../src/data/affiliate-links.ts';

const AFFILIATE_HOST =
  /https?:\/\/[^"']*(?:amazon\.com|golfgalaxy\.com|dpbolvw\.net|anrdoezrs\.net|tkqlhce\.com|jdoqocy\.com|kqzyfj\.com|playbetter\.com|pxf\.io)[^"']*/g;

// Every URL the registry knows about, in either slot.
const known = new Set<string>();
for (const entry of Object.values(AFFILIATE as any) as any[]) {
  if (entry?.url) known.add(entry.url);
  if (entry?.golfGalaxyUrl) known.add(entry.golfGalaxyUrl);
  if (entry?.playBetterUrl) known.add(entry.playBetterUrl);
}

function astroFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...astroFiles(p));
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}

const orphans: string[] = [];
let total = 0;

for (const file of astroFiles('src/pages')) {
  const src = readFileSync(file, 'utf-8');
  for (const m of src.matchAll(AFFILIATE_HOST)) {
    const url = m[0].replace(/[)'";,]+$/, '');
    // Ignore non-affiliate references (plain product pages with no tracking).
    const isAffiliate =
      /tag=cubicalgolfer-20/.test(url) ||
      /click-\d+-\d+/.test(url) ||
      /pxf\.io/.test(url) ||
      /ghref=/.test(url);
    if (!isAffiliate) continue;
    total++;
    if (!known.has(url)) {
      orphans.push(`${file.replace('src/pages/', '')}\n      ${url.slice(0, 118)}`);
    }
  }
}

if (orphans.length) {
  console.error(`\n❌ ${orphans.length} affiliate link(s) hardcoded in .astro pages do not match any registry URL:`);
  for (const o of orphans) console.error('   ' + o);
  console.error(
    '\nHardcoded affiliate links are invisible to every other validator on this site.\n' +
    "Use getAffiliateLink('<key>').url in markup, or — inside a client-side <script>,\n" +
    'where expressions cannot be evaluated — paste the exact URL the registry holds.\n'
  );
  process.exit(1);
}

console.log(`✅ .astro affiliate links: all ${total} resolve to a registry URL (nothing is hidden from the other checks).`);
