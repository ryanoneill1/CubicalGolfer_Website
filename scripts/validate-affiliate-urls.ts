#!/usr/bin/env node
// scripts/validate-affiliate-urls.ts
// Warns on Amazon search URLs (should be direct ASIN links).
// Errors on missing URLs.

import { AFFILIATE } from '../src/data/affiliate-links.ts';

let warnings = 0;
let errors = 0;

for (const [key, entry] of Object.entries(AFFILIATE) as [string, any][]) {
  if (!entry.url) {
    console.error(`ERROR: Missing url for ${key}`);
    errors++;
    continue;
  }
  if (entry.url.includes('amazon.com/s?')) {
    console.warn(`WARN: ${key} uses Amazon search URL — convert to ASIN.`);
    warnings++;
  }
}

if (errors > 0) {
  console.error(`\n❌ ${errors} affiliate URL error(s).`);
  process.exit(1);
}

if (warnings > 0) {
  console.log(`⚠️  Affiliate URL check: ${warnings} search URL(s) remain — convert to direct ASINs for better conversion.`);
} else {
  console.log(`✅ All affiliate URLs are direct links — no search URLs remain.`);
}
