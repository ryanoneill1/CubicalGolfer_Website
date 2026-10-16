/**
 * validate-click-tracking.ts — pre-build guard
 *
 * Added Sprint R2k, after the first look at real Plausible property data.
 *
 * Affiliate clicks are tracked by ONE delegated handler in BaseLayout.astro,
 * keyed off `data-outbound`. AffiliateCTA.astro ALSO carried its own inline
 * onclick firing the same 'Affiliate Click' event, so every CTA click sent two
 * events with different values:
 *
 *     inline  → { product: 'Cleveland CBX4',              retailer: 'Amazon' }
 *     global  → { product: 'Best Overall: Cleveland CBX4', retailer: 'amazon' }
 *
 * In the dashboard that showed up as `amazon` (78 events) and `Amazon` (5) as
 * separate retailers, and as a long tail of near-duplicate product names —
 * 'Best Overall: Cleveland CBX4' and 'Best Overall: Cleveland CBX4 at Amazon'
 * being the same button counted twice. Click totals were inflated and no
 * product could be ranked reliably.
 *
 * Two rules, both cheap to check:
 *   1. Only BaseLayout.astro may emit 'Affiliate Click'.
 *   2. Any element carrying `data-outbound` must also carry `data-aff-name`,
 *      so the product name is the canonical one set at render time rather than
 *      scraped from whatever text happens to sit near the link.
 *
 * Rule 3 added Sprint 173. Rule 2 only checked that the attribute EXISTS; the
 * value was still wrong. AffiliateCTA and the sticky bar were handed
 * `section.h2`, so 692 of 2,304 tracked clicks across 133 pages logged as
 * 'Our Verdict', 'Accuracy Comparison' or 'What the Tester Measured'. The root
 * cause is a selling section whose affiliateKey has no PRODUCT_DISPLAY entry,
 * because that is exactly when the renderer falls back to the heading. So:
 *
 *   3. Every affiliateKey used by an article section must have a canonical
 *      display name — fixing the cause rather than the symptom.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { ARTICLES } from '../src/data/articles';
import { PRODUCT_DISPLAY } from '../src/data/product-names';

const files: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
})('src');

const violations: string[] = [];
let taggedLinks = 0;

// ── Rule 3 — every selling section resolves to a real product name ────────
const NAME_CEILING = 0;
const unnamed: Array<{ slug: string; key: string; h2: string }> = [];
let sellingSections = 0;
for (const article of ARTICLES as any[]) {
  for (const section of article.sections ?? []) {
    if (!section?.affiliateKey) continue;
    sellingSections++;
    if (!PRODUCT_DISPLAY[section.affiliateKey]) {
      unnamed.push({ slug: article.slug, key: section.affiliateKey, h2: section.h2 ?? '' });
    }
  }
}

for (const f of files) {
  const src = readFileSync(f, 'utf8');

  if (/plausible\s*\(\s*['"]Affiliate Click['"]/.test(src) && !f.endsWith('BaseLayout.astro')) {
    violations.push(
      `${f} emits 'Affiliate Click' directly. Only BaseLayout.astro may — a second ` +
        `emitter double-counts every click and splits retailer casing.`,
    );
  }

  // Every outbound link needs the canonical product name alongside it.
  const tagRe = /<a\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(src))) {
    const tag = m[0];
    if (!/data-outbound[=\s]/.test(tag)) continue;
    taggedLinks++;
    if (!/data-aff-name[=\s]/.test(tag)) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(
        `${f}:${line} has data-outbound but no data-aff-name — its product name ` +
          `will be scraped from nearby text and will not match other links to the same product.`,
      );
    }
  }
}

if (violations.length) {
  console.error(`\n❌ ${violations.length} click-tracking problem(s):`);
  for (const v of violations) console.error('   ' + v);
  console.error(
    '\nOne event per click, canonical values. Set data-aff-name on the link and let\n' +
      'the BaseLayout handler do the emitting.\n',
  );
  process.exit(1);
}

if (unnamed.length > NAME_CEILING) {
  console.error(`\n❌ ${unnamed.length} selling section(s) have no canonical product name ` +
    `(ceiling ${NAME_CEILING}); their clicks get attributed to the section heading:\n`);
  for (const u of unnamed.slice(0, 25)) {
    console.error(`   ${u.slug}\n      ${u.key} → would log as "${u.h2}"`);
  }
  console.error('\n   Add the product to PRODUCT_DISPLAY in src/data/product-names.ts.\n');
  process.exit(1);
}

console.log(
  `✅ Click tracking: one 'Affiliate Click' emitter, ${taggedLinks} outbound link(s) carry a canonical ` +
  `product name, ${sellingSections} selling section(s) all resolve to a named product (ceiling ${NAME_CEILING}).`,
);
