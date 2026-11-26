#!/usr/bin/env node
/**
 * validate-product-density.ts — is this guide actually comparing anything?
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Every product check in this repo asks about a FIGURE (is the price right?) or
 * a SECTION (can the reader buy from it?). None asks the prior question: does
 * the page put enough products in front of a reader to be the guide its title
 * promises? A "best golf umbrellas" page with two umbrellas has not compared
 * umbrellas; it has named two.
 *
 * That gap was invisible for a different reason than usual. The number existed
 * — "55 of 106 buying guides under 5 products", from the Sprint 153 audit —
 * but only in a task note. Nothing in the build measured it, so it was quoted
 * from memory for weeks and could have drifted in either direction unnoticed.
 * A number worth repeating is worth enforcing.
 *
 * ── Why the threshold is per shape, not one floor ──────────────────────────
 * "Under 5" flagged two kinds of page that were correct as they stood:
 *
 *   A THREE-WAY COMPARISON. /rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/
 *   carries three products because it compares three things. A fourth would
 *   contradict its own title. So a "-vs-" slug is judged against the number of
 *   products it NAMES, not against a flat floor.
 *
 *   AN INFORMATIONAL LISTICLE. /golf-course-etiquette/ has no products and
 *   should have none. Pages whose job is to explain rather than to rank are
 *   excluded by name, with a reason, the same way validate-section-products
 *   excludes page classes.
 *
 * And the floor itself is 3 rather than 5. Between three and four products a
 * narrow category is genuinely served — /best-golf-towel/ does not need five
 * towels — and a floor that forces a fifth product onto a page is how an
 * affiliate site starts padding. Two is different: two candidates is not a
 * comparison.
 *
 * ── What counts as a product ───────────────────────────────────────────────
 * Any affiliate key the page puts in front of a reader: a selling section, an
 * \`items\` entry, a \`recommendedGear\` entry, or a comparison-table row.
 * Counted once per page, so a product named three times is still one product.
 */
import { ARTICLES } from '../src/data/articles';

/** Pages whose job is to explain, not to rank. Each needs a reason. */
const NOT_A_PRODUCT_GUIDE: Record<string, string> = {
  '/golf-course-etiquette/':            'Etiquette advice. There is nothing to buy and a product block would cheapen it.',
  '/how-far-average-golfer-hit-7-iron/': 'A distance reference. The reader wants their own number, not a purchase.',
  '/golf-for-beginners/':               'An orientation page that routes to the gear guides rather than selling directly.',
};

/** Floor for a guide that promises a category winner. Three is a comparison; two is not. */
const MIN_PRODUCTS = 3;

/**
 * Ratchet, measured 26 November 2026 with the rule above. Only ever edit
 * downward. 13 pages carry two products where they promise a ranking; the
 * worklist is in the Sprint 285 report, ordered by quarterly clicks.
 */
const CEILING = 13;

type Row = { slug: string; have: number; need: number; why: string };
const short: Row[] = [];
let judged = 0, skipped = 0;

function productKeys(a: any): Set<string> {
  const keys = new Set<string>();
  for (const s of a.sections ?? []) {
    if (s.affiliateKey) keys.add(s.affiliateKey);
    for (const i of s.items ?? []) if (i.affiliateKey) keys.add(i.affiliateKey);
    for (const g of s.recommendedGear ?? []) if (g.key) keys.add(g.key);
  }
  for (const r of a.comparisonTable?.rows ?? []) if (r.affiliateKey) keys.add(r.affiliateKey);
  return keys;
}

for (const a of ARTICLES as any[]) {
  if (!['buying-guide', 'listicle'].includes(a.pageType)) continue;
  const slug = String(a.slug);
  if (NOT_A_PRODUCT_GUIDE[slug]) { skipped++; continue; }

  const have = productKeys(a).size;

  // RULE A — a "-vs-" slug is judged on the chain it names.
  const chain = (slug.match(/-vs-/g) || []).length;
  if (chain) {
    judged++;
    const need = chain + 1;
    if (have < need) short.push({ slug, have, need, why: `a ${need}-way comparison` });
    continue;
  }

  // RULE B — a guide promising a ranking needs enough to rank.
  judged++;
  if (have < MIN_PRODUCTS) short.push({ slug, have, need: MIN_PRODUCTS, why: 'a ranked guide' });
}

if (short.length > CEILING) {
  console.error(`\n❌ Product density: ${short.length} guide(s) carry fewer products than they promise (ceiling ${CEILING}).\n`);
  short.sort((x, y) => x.have - y.have)
       .forEach(r => console.error(`   ${r.slug} — ${r.have} product(s), needs ${r.need} for ${r.why}`));
  console.error(
    '\n   Two candidates is not a comparison. Add a product that genuinely belongs,\n' +
    '   with a verified price — never a fourth name to clear a threshold. If the\n' +
    "   page is not a product guide at all, add it to NOT_A_PRODUCT_GUIDE with a\n" +
    '   reason.\n',
  );
  process.exit(1);
}
console.log(`✅ Product density: ${judged} guide(s) judged, ${short.length} below their own promise (ceiling ${CEILING}); ${skipped} not product guides, excluded with a reason.`);
