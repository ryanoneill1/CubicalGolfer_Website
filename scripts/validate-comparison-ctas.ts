/**
 * validate-comparison-ctas.ts
 *
 * Every /compare/ page is about TWO products. For a long time only one of them
 * — the declared winner — had a real buy button; the runner-up was 13px of grey
 * text, untracked, under the line "Still an excellent driver." That line shipped
 * on all 41 comparison pages, including the ones comparing golf balls, putters,
 * GPS watches and launch monitors.
 *
 * Two invariants, both checked against the BUILT HTML rather than the source,
 * because the source is where the mistake looked fine:
 *
 *   1. Each /compare/ page renders a tracked CTA for BOTH products. A reader who
 *      finishes the page preferring the runner-up must have somewhere to click;
 *      "vs" searchers have not decided yet, which is why they are searching.
 *   2. No product-category noun appears in the page's shared template copy. The
 *      template is rendered for every category, so a noun hardcoded there is
 *      wrong on most pages by construction.
 *
 * Tracked means carrying data-aff-name, so BaseLayout's click handler can
 * attribute the click. An untracked CTA earns money we cannot measure, which is
 * how the runner-up went years without anyone noticing it was not working.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist/compare';
// Nouns that name a product category. Legitimate in per-comparison prose from
// comparisons.ts; never legitimate in the template's own shared sentences.
const CATEGORY_NOUNS = /Still an excellent (driver|iron|putter|wedge|ball|watch|rangefinder|launch monitor|hybrid)/i;

const CEILING = 0;

if (!existsSync(DIST)) {
  console.log('validate-comparison-ctas: no dist/compare — run after astro build.');
  process.exit(0);
}

const dirs = readdirSync(DIST, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

const missingRunnerUp: string[] = [];
const hardcodedNoun: string[] = [];

for (const slug of dirs) {
  const f = join(DIST, slug, 'index.html');
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');

  if (CATEGORY_NOUNS.test(html)) hardcodedNoun.push(slug);

  const tracked = new Set(
    [...html.matchAll(/data-aff-name="([^"]+)"/g)].map(m => m[1].trim()),
  );
  const hasRunnerUp = /data-cta-location="runner-up"/.test(html);
  if (!hasRunnerUp || tracked.size < 2) missingRunnerUp.push(slug);
}

const total = missingRunnerUp.length + hardcodedNoun.length;

if (hardcodedNoun.length) {
  console.error(`\n❌ ${hardcodedNoun.length} comparison page(s) carry a hardcoded product-category noun:`);
  for (const s of hardcodedNoun) console.error(`   /compare/${s}/`);
  console.error('   That sentence lives in the shared template, so it is wrong on every');
  console.error('   page whose products are not that category. Use neutral copy.');
}
if (missingRunnerUp.length) {
  console.error(`\n❌ ${missingRunnerUp.length} comparison page(s) do not offer a tracked runner-up CTA:`);
  for (const s of missingRunnerUp) console.error(`   /compare/${s}/`);
  console.error('   A comparison sells two products. Both need a way to buy, and both');
  console.error('   need data-aff-name so the click can be attributed.');
}

if (total > CEILING) process.exit(1);
console.log(`✅ Comparison CTAs: ${dirs.length} page(s) — all carry a tracked winner and runner-up CTA, no hardcoded category nouns.`);
