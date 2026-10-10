#!/usr/bin/env node
/**
 * Guard: the simulator cost calculator cannot state a total it did not compute.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Every one of the three tiers hard-coded its own total inside the notes
 * prose, and every one had drifted from the sum of its own parts:
 *
 *   basic    parts summed to   $725   notes claimed  ~$888
 *   mid      parts summed to $2,556   notes claimed  ~$2,396
 *   premium  parts summed to $5,046   notes claimed  ~$4,896
 *
 * The reader saw one figure in the table and a different one in the paragraph
 * directly beneath it, on a page whose entire job is telling people what a
 * build costs. Nothing caught it: validate-internal-arithmetic reads article
 * prose, and this total is assembled by client-side JavaScript.
 *
 * The fix was to replace the literal with a {TOTAL} placeholder the renderer
 * fills from the same sum it puts in the table. This guard asserts that shape
 * holds — a literal dollar total in the notes means someone has reintroduced a
 * number that can drift.
 */
import fs from 'node:fs';

const SRC = 'src/pages/golf-simulator-cost-calculator/index.astro';
const problems: string[] = [];
const s = fs.readFileSync(SRC, 'utf8');

// 1. notes must use the placeholder, never a literal total
const literals = [...s.matchAll(/<strong>Total:\s*~?\$[\d,]+/g)];
if (literals.length) {
  problems.push(
    `${literals.length} tier note(s) hard-code a dollar total. Use {TOTAL} — the ` +
    `renderer substitutes the same sum it shows in the table, so the two cannot ` +
    `disagree. Found: ${literals.map(m => m[0].replace('<strong>', '')).join(', ')}`
  );
}

// 2. the placeholder must exist for every tier, and be substituted
const tiers = [...s.matchAll(/\n  (basic|mid|premium): \{/g)].map(m => m[1]);
// Count placeholders in the tier DATA only. The renderer's own
// .replace('{TOTAL}', …) call contains the token too, and counting it made
// this guard fail on a correct file — a false alarm is as bad as a miss.
const tiersBlock = (s.match(/const tiers = \{[\s\S]*?\n\};/) || [''])[0];
const placeholders = [...tiersBlock.matchAll(/\{TOTAL\}/g)].length;
if (placeholders !== tiers.length) {
  problems.push(
    `${tiers.length} tier(s) defined but ${placeholders} {TOTAL} placeholder(s). ` +
    `Every tier's notes must carry one.`
  );
}
if (!/data\.notes\.replace\('\{TOTAL\}'/.test(s)) {
  problems.push(
    `The renderer does not substitute {TOTAL}, so the placeholder would ship ` +
    `to the reader as literal text.`
  );
}

// 3. and the arithmetic itself: each tier's parts must sum to something
for (const tier of tiers) {
  const block = s.match(new RegExp(`\\n  ${tier}: \\{([\\s\\S]*?)\\n  \\},`));
  if (!block) continue;
  const prices = [...block[1].matchAll(/price:\s*(\d+)/g)].map(m => +m[1]);
  if (!prices.length) problems.push(`Tier "${tier}" has no priced parts.`);
}

if (problems.length) {
  console.error(`\n❌ Calculator totals: ${problems.length} problem(s).`);
  for (const p of problems) console.error(`   - ${p}`);
  console.error(
    `\n   A cost calculator that disagrees with itself is worse than no ` +
    `calculator:\n   the one number the reader came for is the one they cannot ` +
    `trust.\n`
  );
  process.exit(1);
}

console.log(
  `✅ Calculator totals: ${tiers.length} tier(s) — every stated total is computed, not hard-coded.`
);
