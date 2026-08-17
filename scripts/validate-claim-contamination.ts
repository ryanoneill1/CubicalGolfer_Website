/**
 * Product claims sit next to a buy button, so they read as tested statements.
 * Two ways they go wrong, both found in the registry and both fixed in Sprint 17:
 *
 *  1. TRADEMARK CONTAMINATION. A benefit block copied from one product to its
 *     rivals keeps the original brand's technology names. The registry claimed
 *     "Prizm Golf lens" (Oakley) on a Maui Jim and a Tifosi, "Dri-FIT fabric"
 *     (Nike) on an adidas and a FootJoy, and "Twist Face", "Inertia Generator"
 *     and "Premium TaylorMade construction" on a Callaway Big Bertha.
 *
 *  2. DUPLICATED SUPERLATIVES AND MEASUREMENTS. Three push carts each claimed
 *     to be "13.6 lbs — lightest cart tested", folding to identical dimensions.
 *     At most one can be true.
 *
 * Shared FACTUAL specs are fine — three bags really can all have a 14-way top.
 * The test is whether the claim is exclusive, not whether it is repeated.
 */
import { AFFILIATE } from '../src/data/affiliate-links';

/** Brand technologies. A claim naming one may only appear on that brand. */
const TRADEMARKS: Array<{ term: RegExp; brand: string }> = [
  { term: /\bPrizm\b/i,             brand: 'oakley' },
  { term: /\bDri-?FIT\b/i,          brand: 'nike' },
  { term: /\bTwist Face\b/i,        brand: 'taylormade' },
  { term: /\bInertia Generator\b/i, brand: 'taylormade' },
  { term: /\bSpeed ?Injected\b/i,   brand: 'callaway' },
  { term: /\bSoftFast\b/i,          brand: 'callaway' },
  { term: /\bAEROREADY\b/i,         brand: 'adidas' },
  { term: /\bHydroLite\b/i,         brand: 'footjoy' },
  { term: /\bTruFeel\b/i,           brand: 'titleist' },
];

/** Naming a rival brand in your own product's benefits is almost always a copy-paste. */
const BRANDS = ['oakley', 'nike', 'taylormade', 'callaway', 'adidas', 'footjoy',
  'titleist', 'ping', 'srixon', 'bridgestone', 'cobra', 'cleveland', 'wilson', 'mizuno'];

/** Superlatives: at most one product can hold each. */
const EXCLUSIVE = /\b(lightest|best|most|fastest|longest|quietest|softest|#1|number one)\b/i;

/**
 * A measurement with a unit is product-specific — two carts cannot both weigh
 * 13.6 lbs. A bare number is not: three bags really can all have a 14-way top,
 * and "$28/dozen" may genuinely match across two balls.
 */
const MEASURED = /\d+(\.\d+)?\s*(lbs?|oz|kg|g|inches|in\b|ft\b|feet|mph|rpm|yards?|yds?|degrees?|ms\b|lumens|compression)/i;

const entries = Object.entries(AFFILIATE as any) as Array<[string, any]>;
const tmErrors: string[] = [];
const dupErrors: string[] = [];

// 1. Trademarks on the wrong brand.
for (const [key, v] of entries) {
  for (const line of (v.benefits ?? [])) {
    const text = String(line);
    for (const { term, brand } of TRADEMARKS) {
      if (term.test(text) && !key.startsWith(brand)) {
        tmErrors.push(`${key} claims "${text.match(term)![0]}" — that is ${brand}'s`);
      }
    }
    // An explicit price or performance comparison may name a rival — that is
    // honest reviewing. "$80 — less than half the price of Vokey/Cleveland" is
    // fine; a Callaway inheriting TaylorMade's tech names is not.
    const isComparison = /\b(than|vs\.?|versus|compared|price of|cheaper|instead of)\b/i.test(text);
    for (const b of BRANDS) {
      if (key.startsWith(b) || isComparison) continue;
      if (new RegExp(`\\b${b}\\b`, 'i').test(text)) {
        tmErrors.push(`${key} names rival brand "${b}": "${text.slice(0, 60)}"`);
      }
    }
  }
}

// 2. Exclusive claims duplicated across products.
const byLine = new Map<string, string[]>();
for (const [key, v] of entries) {
  for (const line of (v.benefits ?? [])) {
    const s = String(line).trim();
    if (!byLine.has(s)) byLine.set(s, []);
    byLine.get(s)!.push(key);
  }
}
for (const [line, keys] of byLine) {
  if (keys.length < 2) continue;
  // Shared factual specs are fine. Only superlatives and measurements are exclusive.
  if (!EXCLUSIVE.test(line) && !MEASURED.test(line)) continue;
  dupErrors.push(`${keys.length}x "${line.slice(0, 70)}" → ${keys.join(', ')}`);
}

if (tmErrors.length) {
  console.error(`\n❌ ${tmErrors.length} product claim(s) reference another brand's technology:`);
  for (const e of tmErrors) console.error(`   ${e}`);
  console.error('\nA benefit block was copied between rival products. Rewrite or clear it.\n');
  process.exit(1);
}

if (dupErrors.length) {
  console.error(`\n❌ ${dupErrors.length} exclusive or measured claim(s) appear on more than one product:`);
  for (const e of dupErrors) console.error(`   ${e}`);
  console.error('\nOnly one product can be the lightest, or weigh 13.6 lbs. Keep it on that one.\n');
  process.exit(1);
}

console.log(`✅ Product claims: no trademark appears on a rival product, no exclusive claim is duplicated.`);
