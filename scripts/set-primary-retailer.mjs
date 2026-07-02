/**
 * set-primary-retailer.mjs
 * Tags affiliate entries with primaryRetailer: 'direct' when:
 *   (a) the entry has a non-Amazon primary URL OR a golfGalaxyUrl (partner link), AND
 *   (b) the price field parses to >= $200
 *
 * Run: node scripts/set-primary-retailer.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/data/affiliate-links.ts';
let content = readFileSync(FILE, 'utf8');

// Parse all entries: find each key block
const entryRegex = /^\s+'([a-z0-9-]+)':\s*\{/gm;
const tagged = [];
const skipped = [];

let match;
while ((match = entryRegex.exec(content)) !== null) {
  const key = match[1];
  const startIdx = match.index;
  
  // Find the closing "},\n" for this entry
  let depth = 0;
  let endIdx = startIdx;
  for (let i = content.indexOf('{', startIdx); i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
  }
  
  const block = content.substring(startIdx, endIdx);
  
  // Skip if already tagged
  if (block.includes('primaryRetailer')) continue;
  
  // Check price >= $200
  const priceMatch = block.match(/price:\s*'[~]?\$?([\d,]+)/);
  if (!priceMatch) continue;
  const priceNum = parseInt(priceMatch[1].replace(',', ''), 10);
  if (priceNum < 200) { skipped.push(`${key} ($${priceNum} < $200)`); continue; }
  
  // Check for non-Amazon URL or golfGalaxyUrl
  const urlMatch = block.match(/url:\s*'([^']+)'/);
  const hasGGUrl = block.includes('golfGalaxyUrl');
  const primaryUrl = urlMatch ? urlMatch[1] : '';
  const isAmazonPrimary = primaryUrl.includes('amazon.com');
  const isDirectPrimary = !isAmazonPrimary && primaryUrl.length > 0;
  
  if (!isDirectPrimary && !hasGGUrl) {
    skipped.push(`${key} ($${priceNum}, Amazon-only)`);
    continue;
  }
  
  // Tag it: insert primaryRetailer: 'direct' after the price line
  const priceLineMatch = block.match(/price:\s*'[^']*',/);
  if (priceLineMatch) {
    const insertPoint = content.indexOf(priceLineMatch[0], startIdx) + priceLineMatch[0].length;
    content = content.substring(0, insertPoint) +
      "\n    primaryRetailer: 'direct'," +
      content.substring(insertPoint);
    tagged.push(`${key} ($${priceNum})`);
    // Reset regex since content changed
    entryRegex.lastIndex = insertPoint + 30;
  }
}

writeFileSync(FILE, content);

console.log(`\n✅ Tagged ${tagged.length} entries with primaryRetailer: 'direct':\n`);
tagged.forEach(t => console.log(`  ✓ ${t}`));
console.log(`\nSkipped ${skipped.length} entries (under $200 or Amazon-only)`);
