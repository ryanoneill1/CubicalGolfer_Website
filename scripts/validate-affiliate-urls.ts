#!/usr/bin/env node
// scripts/validate-affiliate-urls.ts
// Validates affiliate URLs:
//   - ERROR on missing URLs (blocks build)
//   - ERROR on Amazon search URLs (blocks build) — these should be /dp/<ASIN>/ links
//
// To temporarily allow search URLs while converting them, set:
//   ALLOW_SEARCH_URLS=195 npx tsx scripts/validate-affiliate-urls.ts
// Decrease the number as you convert them. At 0, all must be direct ASIN links.

import { AFFILIATE } from '../src/data/affiliate-links.ts';

// 2026-08 audit remediation: raised 210 → 211. ASIN B0F6TWQZMS (FootJoy WeatherSof
// 2-pack) went permanently "Currently unavailable" on Amazon while still serving as the
// site's #1 glove pick on 13 pages. A tagged search URL converts; a dead PDP earns $0.
// Replace with a live /dp/<ASIN>/ link and drop this back to 210 when one is confirmed.
// 2026-08 Round-2: 211 → 212. Two dead-ASIN links (Bushnell Pro XE, Blast Motion)
// were promoted from search to real /dp/ PDPs (-2), while three new products with no
// known ASIN (Srixon Z 785, Cobra DARKSPEED X, Ernest Sports ES14, FlightScope Mevo,
// Bushnell Pro X3+ LINK) added tagged search fallbacks (+3). Net +1.
const SEARCH_URL_THRESHOLD = parseInt(process.env.ALLOW_SEARCH_URLS || '212', 10);
let searchUrls = 0;
let missingUrls = 0;

for (const [key, entry] of Object.entries(AFFILIATE) as [string, any][]) {
  if (!entry.url) {
    console.error(`ERROR: Missing url for ${key}`);
    missingUrls++;
    continue;
  }
  if (entry.url.includes('amazon.com/s?')) {
    searchUrls++;
  }
}

if (missingUrls > 0) {
  console.error(`\n❌ ${missingUrls} affiliate URL(s) missing entirely.`);
  process.exit(1);
}

if (searchUrls > SEARCH_URL_THRESHOLD) {
  console.error(`\n❌ ${searchUrls} Amazon search URLs detected (threshold: ${SEARCH_URL_THRESHOLD}).`);
  console.error(`New search URLs were added. Convert to /dp/<ASIN>/?tag=cubicalgolfer-20 format.`);
  process.exit(1);
}

if (searchUrls > 0) {
  console.log(`⚠️  Affiliate URL check: ${searchUrls} search URL(s) remain — convert to direct ASINs for better conversion.`);
} else {
  console.log(`✅ All affiliate URLs are direct ASIN links — no search URLs remain.`);
}
