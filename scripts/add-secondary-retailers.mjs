#!/usr/bin/env node
/**
 * scripts/add-secondary-retailers.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Adds a SECOND retailer link (`golfGalaxyUrl`) to affiliate entries that only
 * have an Amazon link.
 *
 * NOTHING EXISTING IS MODIFIED. No `url` value is touched, no entry is removed,
 * no entry that already has a `golfGalaxyUrl` is changed. This is purely
 * additive — it inserts one new field on entries that lack it.
 *
 * The rendering already exists: ProductCard.astro, AffiliateCTA.astro and
 * RecommendedGearGrid.astro all read `golfGalaxyUrl` and render a second
 * "Check Price at <retailer>" button beside the Amazon one.
 *
 * WHY: Amazon pays 3% on golf with a 24-hour cookie. Golf Galaxy pays 8%.
 * A second button costs nothing, changes no existing link, and lets the buyer
 * choose — you get paid either way.
 *
 * Retailer choice:
 *   PlayBetter   → golf tech (launch monitors, rangefinders, GPS, simulators)
 *   Golf Galaxy  → clubs, balls, bags, carts, apparel, training aids
 *   skipped      → items neither retailer stocks (projectors, generic electronics)
 *
 * Idempotent: entries that already have a golfGalaxyUrl are skipped.
 */
import fs from 'fs';

const F = 'src/data/affiliate-links.ts';
const NAMES = 'src/data/product-names.ts';

const GG_CJ = 'https://www.jdoqocy.com/click-101736949-17037566?url=';
const GG_INNER = (q) =>
  'https://www.golfgalaxy.com/search/SearchDisplay?searchTerm=' + encodeURIComponent(q).replace(/'/g, '%27') +
  '&storeId=10701&catalogId=10051&langId=-1&sType=SimpleSearch&resultCatEntryType=2' +
  '&showResultsPage=true&fromPage=Search&searchSource=Q&pageView=&beginIndex=0' +
  '&DSGsearchType=Keyword&selectedStore=1521';
// encodeURIComponent leaves ' unescaped, which would terminate the single-quoted
// TypeScript string this URL is written into. Percent-encode it explicitly.
const enc = (v) => encodeURIComponent(v).replace(/'/g, '%27');
const golfGalaxy = (q) => GG_CJ + enc(GG_INNER(q));
const playBetter = (q) =>
  'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=' +
  q.trim().split(/\s+/).map(w => encodeURIComponent(w).replace(/'/g, '%27') + '*').join('+') +
  '&ghref=2301%3A1333883';

// display names for search queries
const namesSrc = fs.readFileSync(NAMES, 'utf8');
const DISPLAY = {};
for (const m of namesSrc.matchAll(/'([a-z0-9\-]+)':\s*"([^"]+)"/g)) DISPLAY[m[1]] = m[2];

const TECH = /(launch-monitor|rangefinder|gps|watch|skytrak|mevo|rapsodo|garmin|bushnell|shot-scope|square-golf|arccos|swing-caddie|blue-tees|precision-pro|foresight|gcquad|trackman|blast-motion|approach|voice-caddie|nikon|leupold|monitor)/i;
const SKIP = /(projector|benq|optoma|epson|screen|enclosure|laptop|pc|computer|hdmi|cable)/i;
const GG   = /(driver|iron|putter|wedge|hybrid|fairway|ball|bag|cart|glove|shoe|shirt|polo|short|pant|hat|jacket|rain|towel|tee|grip|trainer|mat|net|club|set|umbrella|sunglass|marker|divot|alignment)/i;

let src = fs.readFileSync(F, 'utf8');
const before = (src.match(/golfGalaxyUrl:/g) || []).length;

const added = [];
const skipped = [];

// operate entry-by-entry on the top-level AFFILIATE map
src = src.replace(/(\n  '([a-z0-9\-]+)':\s*\{)([\s\S]*?)(\n  \},)/g, (whole, head, key, body, tail) => {
  if (/golfGalaxyUrl:/.test(body)) return whole;                 // already has one — untouched
  const um = body.match(/url:\s*'([^']+)'/);
  if (!um || !um[1].includes('amazon.com')) return whole;        // only add beside Amazon
  const name = DISPLAY[key] || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const hay = key + ' ' + name;
  if (SKIP.test(hay)) { skipped.push([key, 'neither retailer stocks it']); return whole; }
  // Golf Galaxy is a general golf retailer and stocks essentially the whole
  // category, so it is the default for anything that is not golf tech and is
  // not on the SKIP list. Only genuinely non-golf items are skipped.
  let url, retailer;
  if (TECH.test(hay)) { url = playBetter(name); retailer = 'PlayBetter'; }
  else                { url = golfGalaxy(name); retailer = 'Golf Galaxy'; }
  if (url.includes("'")) { skipped.push([key, 'url contained an unescaped quote']); return whole; }
  added.push([key, retailer, name]);
  // insert the new field immediately after the existing url line, preserving indentation
  const newBody = body.replace(/(\n(\s+)url:\s*'[^']+',)/, `$1\n$2golfGalaxyUrl: '${url}',`);
  return head + newBody + tail;
});

fs.writeFileSync(F, src);

const after = (src.match(/golfGalaxyUrl:/g) || []).length;
const urls = (src.match(/\n\s+url:\s*'/g) || []).length;
const byRet = added.reduce((o, [, r]) => (o[r] = (o[r] || 0) + 1, o), {});

console.log('── SECONDARY RETAILER LINKS ─────────────────────────────────────────');
console.log(`golfGalaxyUrl fields : ${before} -> ${after}   (+${added.length})`);
console.log(`by retailer          : ${JSON.stringify(byRet)}`);
console.log(`skipped              : ${skipped.length}`);
for (const [k, why] of skipped.slice(0, 8)) console.log(`   ${k.padEnd(34)} ${why}`);
console.log('');
console.log('sample additions:');
for (const [k, r, n] of added.slice(0, 6)) console.log(`   ${k.padEnd(32)} -> ${r.padEnd(12)} "${n}"`);
console.log('');
console.log(`primary url: fields : ${urls} (must equal 238 — unchanged)`);
if (urls !== 238) { console.error('FAILED: primary url count changed'); process.exit(1); }
