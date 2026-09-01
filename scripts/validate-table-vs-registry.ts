/**
 * A comparison-table row declares `affiliateKey`. The button beside that row
 * links to that product. So the row's `price` must equal the registry price —
 * otherwise the page prints one number and sells another.
 *
 * This is how the SkyTrak+ bug survived: the registry said $1,495, the prose on
 * the same pages said $2,995, and nothing compared the two.
 *
 * FOUR THINGS THIS DELIBERATELY DOES NOT FLAG. The first cut of this check fired
 * on all of them, and a check that cries wolf is a check that gets ignored:
 *
 *  1. DIMENSION TABLES. Some tables reuse the product-row shape for something
 *     that is not a product list. On /shaft-flex-guide/ the first column is
 *     "Flex" and the rows are flex categories; on /iron-fitting-guide-beginners/
 *     it is "Variable" and the price is the fitting cost. The row carries an
 *     affiliateKey so it can link somewhere, but its price is not that product's.
 *
 *  2. MULTI-PACKS. "His Exact Balls (2 dozen)" at $110 against a $55 dozen, or
 *     "~$32/2pk" against a $16 glove, is correct arithmetic.
 *
 *  3. BILLING PERIODS. "Free/$99yr" against a registry price of $11.99/month is
 *     the same product billed differently, not a wrong number.
 *
 *  4. USED AND PREVIOUS-GENERATION pricing, which the row states on its face.
 *
 *  5. PRICE RANGES. "~$500-$1,000" is a legitimate way to price a category. The
 *     right question is whether the registry price falls inside the range, not
 *     whether it equals the lower bound.
 */
import { AFFILIATE } from '../src/data/affiliate-links';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const THRESHOLD = 68;
const SEVERE_CEILING = 4;

const money = (s: string) => Number(s.replace(/,/g, ''));

/** First price token only: '~$249 + $99/yr' is a $249 product, not $24,999. */
const num = (s: any) => {
  const m = String(s ?? '').match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  return m ? money(m[1]) : 0;
};

/** "~$500-$1,000" -> [500, 1000]. A single price returns [n, n]. */
const range = (s: any): [number, number] => {
  const all = [...String(s ?? '').matchAll(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/g)].map(m => money(m[1]));
  if (!all.length) return [0, 0];
  const hasDash = /\$\s*[0-9][0-9,.]*\s*(?:-|–|—|to)\s*\$?\s*[0-9]/.test(String(s));
  return hasDash ? [Math.min(...all), Math.max(...all)] : [all[0], all[0]];
};

const DIMENSION_HEADERS = new Set([
  'feature', 'factor', 'variable', 'metric', 'flex', 'speed range',
  'setup', 'setup tier', 'package', 'period', 'scenario', 'condition', 'tier',
]);

/** A quantity in the name or the price: "(2 dozen)", "6-pack", "$32/2pk". */
const MULTIPACK = /\b\d+\s*-?\s*(pack|pk|dozen|pairs?|sets?)\b|\(\s*\d+\s|(^|\s)(set|kit)(\s|$)/i;

/** Billed per period rather than once. */
const PERIOD = /\d\s*\/?\s*(yr|mo|year|month)\b|\/(yr|mo)|free\s*\//i;

/** Prices a build rather than a unit. */
const BUNDLE = /setup|package|bundle|\+/i;

/**
 * Secondary-market or previous-generation pricing. A closeout SIM Max at $129
 * against a current SIM2 Max at $349 is honest, not a mismatch — the row says
 * so on its face.
 */
const SECONDHAND = /\b(used|refurb\w*|open box|prev(?:ious)?[- ]gen\w*|closeout|last year)\b/i;

const all: any[] = [...(ARTICLES as any), ...(COMPARISONS as any)];
const drift: string[] = [];
const severe: string[] = [];
const excluded = { dimension: 0, multipack: 0, period: 0, inRange: 0, secondhand: 0 };

for (const a of all) {
  const table = a.comparisonTable;
  if (!table?.rows?.length) continue;

  const firstHeader = String(table.headers?.[0] ?? '').trim().toLowerCase();
  if (DIMENSION_HEADERS.has(firstHeader)) {
    excluded.dimension += table.rows.filter((r: any) => r?.affiliateKey && r?.price).length;
    continue;
  }

  for (const r of table.rows) {
    if (!r?.affiliateKey || !r?.price) continue;
    const reg = num((AFFILIATE as any)[r.affiliateKey]?.price);
    const row = num(r.price);
    if (!reg || !row || row === reg) continue;

    const name = String(r.name ?? '');
    const priceStr = String(r.price);
    const line = `${a.slug} → "${name}" [${r.affiliateKey}] row ${priceStr} vs registry $${reg.toLocaleString()}`;
    drift.push(line);

    if (MULTIPACK.test(name) || MULTIPACK.test(priceStr)) { excluded.multipack++; continue; }
    if (PERIOD.test(priceStr)) { excluded.period++; continue; }
    if (SECONDHAND.test(name) || SECONDHAND.test(priceStr)) { excluded.secondhand++; continue; }
    if (BUNDLE.test(name) || BUNDLE.test(priceStr)) continue;

    // A stated range is honest if the registry price sits inside it.
    const [lo, hi] = range(priceStr);
    if (hi > lo && reg >= lo && reg <= hi) { excluded.inRange++; continue; }

    if (Math.max(row / reg, reg / row) >= 2) severe.push(line);
  }
}

if (severe.length > SEVERE_CEILING) {
  console.error(`\n❌ ${severe.length} table row(s) quote a unit price 2x+ away from the product they link to (ceiling ${SEVERE_CEILING}):`);
  for (const s of severe) console.error(`   ${s}`);
  console.error('\nEither the registry price is stale or the row is mis-keyed. This is the SkyTrak+ shape — fix before shipping.\n');
  process.exit(1);
}

if (severe.length) {
  console.log(`⚠️  ${severe.length} unit-price mismatch(es) 2x+ from the linked product (ceiling ${SEVERE_CEILING}):`);
  for (const s of severe) console.log(`   ${s}`);
}

console.log(
  `✅ Table/registry prices: ${drift.length} drift rows (ceiling ${THRESHOLD}). Correctly excluded: ` +
  `${excluded.dimension} dimension, ${excluded.multipack} multi-pack, ${excluded.period} per-period, ` +
  `${excluded.secondhand} used/prev-gen, ${excluded.inRange} in-range.`
);

if (drift.length > THRESHOLD) {
  console.error(`\n❌ Drift rose to ${drift.length} (ceiling ${THRESHOLD}). This number may only go down.\n`);
  process.exit(1);
}
