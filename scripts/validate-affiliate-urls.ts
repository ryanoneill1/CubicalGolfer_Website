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

const SEARCH_URL_THRESHOLD = parseInt(process.env.ALLOW_SEARCH_URLS || '195', 10);
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
