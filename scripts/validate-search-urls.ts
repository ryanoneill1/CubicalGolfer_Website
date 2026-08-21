#!/usr/bin/env node
// validate-search-urls.ts — a ratchet on Amazon search links.
//
// A /s?k= affiliate link drops the buyer on a results page instead of a Buy
// button. Some of these are legitimate (see audit-search-urls.ts: a wedge sold
// per loft has no single right ASIN), so the goal is not zero. The goal is that
// the number never goes UP — a new product should not be added with a lazy
// search link when a product page exists.
//
// Run `npx tsx scripts/audit-search-urls.ts` for the ranked work queue.

import { AFFILIATE } from '../src/data/affiliate-links';

const THRESHOLD = 151;

const search = Object.entries(AFFILIATE as any)
  .filter(([, v]) => /\/s\?/.test(String((v as any).url)))
  .map(([k]) => k);

if (search.length > THRESHOLD) {
  console.error(`\n❌ ${search.length} affiliate links point at Amazon search results (ceiling ${THRESHOLD}).`);
  console.error(`   A search link makes the buyer find the product themselves. If this went up,`);
  console.error(`   a new entry was added with a search URL — check for a /dp/ listing first.`);
  console.error(`   Run: npx tsx scripts/audit-search-urls.ts\n`);
  process.exit(1);
}
console.log(`✅ Search URLs: ${search.length} of ${Object.keys(AFFILIATE as any).length} products (ceiling ${THRESHOLD}, only goes down).`);
