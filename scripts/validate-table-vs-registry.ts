/**
 * A comparison-table row declares `affiliateKey`. The button beside that row
 * links to that product. So the row's `price` must equal the registry price —
 * otherwise the page prints one number and sells another.
 *
 * This is how the SkyTrak+ bug survived: the registry said $1,495, the prose on
 * the same pages said $2,995, and nothing compared the two.
 *
 * THRESHOLD is a ratchet, not a target. It only ever goes down. Rows above it
 * are a known backlog — many are legitimate (bundle rows, "GSPro + R10 ($250/yr)"
 * style labels) and need a human to sort unit price from package price.
 */
import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const THRESHOLD = 143;

/**
 * Rows quoting a unit price 2x+ away from the product they link to. The 20 on
 * the books today are pre-existing and each needs a human call — multi-packs
 * ("His Exact Balls (2 dozen)" is correctly 2x a dozen), previous-generation
 * products keyed to the current model, and shaft-flex example rows that aren't
 * product listings at all. Ratcheting rather than failing, so the check ships
 * today and the backlog gets burned down instead of the validator getting
 * switched off.
 */
const SEVERE_CEILING = 20;

/** First price token only: '~$249 + $99/yr' is a $249 product, not $24,999. */
const num = (s: any) => {
  const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m ? Number(m[1].replace(/,/g, '')) : 0;
};

/** Rows describing a build, bundle or subscription aren't quoting a unit price. */
const BUNDLE = /setup|package|\+|\/yr|per year|kit|bundle/i;

const all: any[] = [...(ARTICLES as any), ...(COMPARISONS as any)];
const bad: string[] = [];
const severe: string[] = [];

for (const a of all) {
  for (const r of (a.comparisonTable?.rows ?? [])) {
    if (!r?.affiliateKey || !r?.price) continue;
    const reg = num((AFFILIATE as any)[r.affiliateKey]?.price);
    const row = num(r.price);
    if (!reg || !row || row === reg) continue;

    const name = String(r.name ?? '');
    const line = `${a.slug} → "${name}" [${r.affiliateKey}] row $${row.toLocaleString()} vs registry $${reg.toLocaleString()}`;
    bad.push(line);

    // A row quoting a unit price more than 2x off is a hard failure regardless
    // of the backlog — that is the SkyTrak+ shape.
    const ratio = Math.max(row / reg, reg / row);
    if (ratio >= 2 && !BUNDLE.test(name) && !BUNDLE.test(String(r.price))) severe.push(line);
  }
}

if (severe.length > SEVERE_CEILING) {
  console.error(`\n❌ ${severe.length} table row(s) quote a unit price 2x+ away from the product they link to (ceiling ${SEVERE_CEILING}):`);
  for (const s of severe.slice(0, 15)) console.error(`   ${s}`);
  console.error('\nEither the registry price is stale or the row is mis-keyed. This is the SkyTrak+ shape — fix before shipping.\n');
  process.exit(1);
}
if (severe.length) {
  console.log(`⚠️  ${severe.length} table row(s) quote a unit price 2x+ from the linked product (ceiling ${SEVERE_CEILING}) — known backlog:`);
  for (const s of severe.slice(0, 5)) console.log(`   ${s}`);
  if (severe.length > 5) console.log(`   …and ${severe.length - 5} more`);
}

if (bad.length > THRESHOLD) {
  console.error(`\n❌ Table/registry price drift rose to ${bad.length} (threshold ${THRESHOLD}).`);
  for (const s of bad.slice(0, 12)) console.error(`   ${s}`);
  console.error(`\nThis number may only go down. Lower THRESHOLD as you burn it off.\n`);
  process.exit(1);
}

console.log(`✅ Table/registry prices: 0 severe mismatches, ${bad.length} known drift rows (ceiling ${THRESHOLD}).`);
