#!/usr/bin/env node
/**
 * validate-compression-sources.ts — protects the one thing that makes
 * /golf-ball-compression-chart/ different from every rival on its SERP.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 123 found the chart had slipped from position 3 to 5 on
 * "golf ball compression chart 2026", and that the AI Overview on that query
 * cites six other sites and not this one. The audit in 124a then found the
 * real problem was never depth — it was that NO chart on that SERP, ours
 * included, said where its numbers came from. Manufacturer rigs and
 * independent gauges disagree by 20+ points on the same ball and both are
 * honest; a chart that does not say which scale it used is not checkable.
 *
 * So each ball now carries a `source`. That claim is only worth anything if
 * it stays true, and there are exactly two ways it rots:
 *
 *   1. A ball is credited to a manufacturer that publishes no figure at all.
 *      Titleist publishes nothing for any ball in its line. Costco publishes
 *      nothing for the Kirkland. Crediting them would be a fabricated
 *      citation — worse than no Source column, because it looks verified.
 *
 *   2. Sourcing quietly goes backwards as balls are added or edited.
 *
 * ── What this checks ───────────────────────────────────────────────────────
 * - No NEVER_PUBLISHES brand is credited with a "(published)" source.
 * - Every source string is from the known vocabulary, so a typo cannot
 *   invent an authority that was never consulted.
 * - The sourced-row count never drops below the ratchet floor.
 */
import { balls } from '../src/data/balls.ts';

// Brands that publish no compression figure for any ball. Verified 2026-09-29:
// Titleist states none across the line (Pro V1, Pro V1x, AVX, Tour Soft,
// Velocity, TruFeel); Costco states none for the Kirkland Signature.
const NEVER_PUBLISHES = new Set(['Titleist', 'Kirkland']);

// Sources actually consulted. Adding one means you looked it up.
const KNOWN = new Set([
  'Callaway (published)', 'TaylorMade (published)', 'Srixon (published)',
  'Bridgestone (published)', 'Wilson (published)', 'Vice Golf (published)',
  'Maxfli (published)',
  'MyGolfSpy 2026 (measured)', 'MyGolfSpy Ball Lab (measured)',
]);

// RATCHET: measured floor. Only goes UP.
// 124a: 17. 131: 19 — Q-Star Tour sourced to Srixon's published 74, and the
// new Maxfli Tour S sourced to Maxfli's published 85 (spec sheet on the
// DICK'S/Golf Galaxy product page for Web ID 24MAXUMXFLTRSWHTDGBL; Maxfli is
// their house brand, so that page is the manufacturer spec).
const MIN_SOURCED = 19;

const rows = balls as Array<Record<string, any>>;
const bad: string[] = [];

for (const b of rows) {
  const src = b.source;
  if (!src) continue;
  if (!KNOWN.has(src)) {
    bad.push(`${b.name}: unknown source ${JSON.stringify(src)} — add it to KNOWN only after actually checking that source.`);
  }
  if (NEVER_PUBLISHES.has(b.brand) && /\(published\)/.test(src)) {
    bad.push(`${b.name}: credited to "${src}", but ${b.brand} publishes no compression figure for any ball. Use an independent measurement instead.`);
  }
}

const sourced = rows.filter(b => b.source).length;

if (bad.length) {
  console.error(`\n❌ Compression sources: ${bad.length} problem(s).\n`);
  bad.forEach(m => console.error('   ' + m));
  console.error('\n   The Source column is this page\'s differentiator. A wrong citation is worse than none.\n');
  process.exit(1);
}

if (sourced < MIN_SOURCED) {
  console.error(
    `\n❌ Compression sources: only ${sourced} of ${rows.length} balls carry a source; the floor is ${MIN_SOURCED}.\n` +
    `   Sourcing is a ratchet — it does not go backwards. Either source the ball you added,\n` +
    `   or lower MIN_SOURCED deliberately and say why.\n`
  );
  process.exit(1);
}

console.log(`✅ Compression sources: ${sourced}/${rows.length} balls sourced (floor ${MIN_SOURCED}); no brand credited with a figure it does not publish.`);
