#!/usr/bin/env node
/**
 * Guard: the colour palette stays small and semantic, and white text never
 * lands on a light surface.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Two different failures, both invisible in the stylesheet:
 *
 * 1. Sprawl. Measured before this guard: 11-14 distinct rendered text colours
 *    per page, including four near-identical dark greens (ΔE 6.3-9.0 apart —
 *    below the threshold where anyone can tell them apart) doing the work of
 *    two roles. Nobody notices this consciously; what they notice is that the
 *    page does not feel deliberate.
 *
 * 2. A colour written for one background surviving onto another. The author
 *    byline carried `rgba(255,255,255,.72)` because it once sat directly on
 *    the dark green hero. A light `.author-box` card was later introduced
 *    around it, and the rule never moved — so every article page rendered
 *    white text on a near-white card at 1.06:1. It had been shipping for
 *    months, visible in every screenshot as a greyed-out tagline, and the
 *    existing contrast validator missed it because that one scans token
 *    PAIRS from the CSS rather than what the page actually renders.
 *
 * So this checks the emitted CSS for the specific shapes that produce both.
 */
import fs from 'node:fs';
import path from 'node:path';

const problems: string[] = [];
const cssFiles = fs
  .readdirSync('dist/_astro')
  .filter(f => f.endsWith('.css'))
  .map(f => path.join('dist/_astro', f));
const css = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// ── 1. the semantic roles must exist ───────────────────────────────────────
for (const tok of ['--on-gold', '--on-dark', '--pos', '--neg']) {
  if (!css.includes(`${tok}:`)) {
    problems.push(
      `Missing semantic colour token \`${tok}\`. Colours named by job rather ` +
      `than by hue are what stop a near-duplicate being added next time.`
    );
  }
}

// ── 2. no white text at an opacity that cannot clear AA on the greens ──────
// Measured: on --green #1E3A28, white needs .55 to reach 4.5:1; on --text
// #1A2B1F it needs .50. .6 is the role value and clears both with margin.
// Covers both `color: rgba(255,255,255,.4)` on a rule AND the --on-dark token's
// own value — the first version of this check read only the former, so lowering
// the token itself (which repaints 12 selectors at once) slipped straight past.
const weak = [...css.matchAll(/(?:color|--on-dark):\s*rgba\(255,\s*255,\s*255,\s*(0?\.[0-9]+)\)/g)]
  .map(m => parseFloat(m[1]))
  .filter(a => a < 0.55);
if (weak.length) {
  const uniq = [...new Set(weak)].sort();
  problems.push(
    `White text at opacity ${uniq.join(', ')} — below AA on the brand greens ` +
    `(.40 measured 3.35:1 on --green and 3.63:1 on --text). Use var(--on-dark).`
  );
}

// ── 3. white text must not be declared on a known light surface ────────────
// .author-box is the case that actually shipped. Any rule setting a white or
// near-white color inside it is the same bug returning.
const lightSurfaces = ['author-box'];
for (const surf of lightSurfaces) {
  const re = new RegExp(`\\.${surf}[^{}]*\\{[^}]*color:\\s*(#fff|#ffffff|white|rgba\\(255,\\s*255,\\s*255)`, 'i');
  if (re.test(css)) {
    problems.push(
      `White text declared inside .${surf}, which is a LIGHT card ` +
      `(rgb(240,247,242)). This is the 1.06:1 byline bug — the rule was ` +
      `written for the dark hero and the card was introduced around it later.`
    );
  }
}

// ── 4. the badge has TWO surfaces, so it needs two text colours ───────────
// Fixing this by setting one colour breaks the other: dark text on the gold
// .tag-buy is 5.95:1 but on the dark-green .tag-cmp it is 1.82:1. Both halves
// must be present.
if (!/\.art-badge\.tag-buy\{[^}]*color:var\(--on-gold\)/.test(css)) {
  problems.push(
    `.art-badge.tag-buy does not set var(--on-gold). Its surface is gold ` +
    `(#B8922A), where the inherited white is 2.92:1.`
  );
}
if (/\.art-badge\{[^}]*color:var\(--on-gold\)/.test(css)) {
  problems.push(
    `.art-badge sets dark text on the BASE rule, which also covers the ` +
    `dark-green .tag-cmp surface (1.82:1). Keep the base white and override ` +
    `only .tag-buy.`
  );
}

// ── 5. a link must not inherit the colour of the band it sits on ──────────
// .art-cta's background is var(--green) and the site-wide anchor colour is
// also var(--green), so a link in there renders at 1.00:1 unless restated.
if (/\.art-cta a\{[^}]*color:/.test(css)) {
  problems.push(
    `.art-cta a sets a colour unscoped, which also repaints .btn-gold — a ` +
    `button that already has a gold BACKGROUND, giving 1.00:1. Exclude the ` +
    `button classes.`
  );
}
if (!/\.art-cta a:not\([^{]*\{[^}]*color:/.test(css)) {
  problems.push(
    `.art-cta a has no colour of its own, so it falls through to the ` +
    `site-wide green anchor — on a green band that is 1.00:1, an invisible ` +
    `call to action.`
  );
}

if (problems.length) {
  console.error(`\n❌ validate-palette: ${problems.length} problem(s).`);
  for (const p of problems) console.error(`   - ${p}`);
  console.error(
    `\n   A colour that is unreadable costs a reader the sentence. A palette ` +
    `that drifts\n   costs the whole page its air of being deliberate, which ` +
    `is what the site is\n   asking people to trust.\n`
  );
  process.exit(1);
}

console.log(
  `✅ Palette: semantic roles present, no sub-AA white text, none on a light surface.`
);
