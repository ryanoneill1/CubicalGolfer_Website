/**
 * validate-prices.ts
 * Ensures every product pick with an affiliateKey has a parseable price
 * in either the section/row data or the affiliate-links entry.
 * Run as part of `npm run validate` to catch missing prices before deploy.
 */
import { ARTICLES } from '../src/data/articles';
import { getAffiliateLink } from '../src/data/affiliate-links';

const PRICE_REGEX = /\d+(?:\.\d+)?/; // Must contain at least one number

let errors = 0;

for (const a of (ARTICLES as any[])) {
  // Check sections
  for (const s of a.sections || []) {
    if (!s.affiliateKey) continue;
    const aff = getAffiliateLink(s.affiliateKey);
    const price = s.price || (aff as any)?.price || '';
    const hasNumeric = PRICE_REGEX.test(price.replace(/,/g, ''));
    if (!hasNumeric) {
      console.log(`MISSING PRICE in ${a.slug}`);
      console.log(`  Section: ${s.h2}`);
      console.log(`  Key: ${s.affiliateKey}`);
      console.log(`  Price found: "${price}"`);
      console.log();
      errors++;
    }
  }

  // Check comparisonTable rows
  if (a.comparisonTable?.rows) {
    for (const r of a.comparisonTable.rows) {
      if (!r.affiliateKey) continue;
      const aff = getAffiliateLink(r.affiliateKey);
      const price = r.price || (aff as any)?.price || '';
      const hasNumeric = PRICE_REGEX.test(price.replace(/,/g, ''));
      if (!hasNumeric) {
        console.log(`MISSING PRICE in ${a.slug}`);
        console.log(`  Row: ${r.name || r.affiliateKey}`);
        console.log(`  Key: ${r.affiliateKey}`);
        console.log(`  Price found: "${price}"`);
        console.log();
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.log(`\n❌ ${errors} product(s) missing parseable price. Fix in articles.ts or affiliate-links.ts.`);
  process.exit(1);
} else {
  console.log(`✓ All product picks have prices.`);
}
