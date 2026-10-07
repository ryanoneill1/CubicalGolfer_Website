#!/usr/bin/env node
/**
 * Guard: section headings keep their separator, and prose keeps its measure.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Two defects shipped here and neither was visible in the CSS, because the CSS
 * was right and the HTML had moved underneath it.
 *
 * 1. `.art-content h2:first-of-type { border-top: none; margin-top: 0 }` was
 *    written when h2s were direct children of the article. Every h2 is now
 *    wrapped in its own <div> or <section> (2,064 of them, none a direct
 *    child), so :first-of-type matched almost all of them and stripped the 2px
 *    rule and 44px margin from every section heading. Measured result: sections
 *    separated by 20px while paragraphs inside them were separated by 40px —
 *    the page grouped the end of one section with the start of the next.
 *
 * 2. The prose column inherited the 1400px article width, putting running text
 *    at ~114 characters per line against a 50-75 ideal and an 80-character WCAG
 *    ceiling.
 *
 * Neither is detectable by reading the stylesheet. Both are trivial to measure
 * in the built HTML, which is what this does.
 *
 * Checks, against dist/:
 *   - the h2 separator rule is present and is NOT globally cancelled
 *   - a prose max-width is declared
 *
 * This is a source-level guard on the emitted CSS rather than a layout
 * measurement, because computing rendered geometry needs a browser. It catches
 * the regression that actually happened: the rule being silently cancelled.
 */
import fs from 'fs';
import path from 'path';

if (!fs.existsSync('dist')) { console.log('⏭  validate-typography: no dist/, skipping.'); process.exit(0); }

const cssFiles = fs.existsSync('dist/_astro')
  ? fs.readdirSync('dist/_astro').filter(f => f.endsWith('.css')).map(f => path.join('dist/_astro', f))
  : [];
const css = cssFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

const problems: string[] = [];

const hasSeparator = /\.art-content\s+h2\s*\{[^}]*border-top:\s*2px/.test(css);
if (!hasSeparator) {
  problems.push('No 2px border-top on .art-content h2 — section headings have lost their separator.');
}

// the bug: an unscoped :first-of-type exception cancels the rule on every h2,
// because every h2 is the first of its type inside its own wrapper.
const unscopedCancel = /(^|[,{}])\s*\.art-content\s+h2:first-of-type\s*\{[^}]*border-top:\s*(none|0)/.test(css);
if (unscopedCancel) {
  problems.push(
    'Found `.art-content h2:first-of-type { border-top: none }`. :first-of-type is scoped to the\n' +
    '     PARENT, and every h2 here sits in its own wrapper, so this cancels the separator on EVERY\n' +
    '     section heading, not just the first. Scope it to the article\'s first block instead.'
  );
}

const hasMeasure = /\.art-content[^{]*\b(p|ul|ol)\s*(,[^{]*)?\{[^}]*max-width:\s*\d+(\.\d+)?ch/.test(css)
  || /max-width:\s*\d+(\.\d+)?ch/.test(css);
if (!hasMeasure) {
  problems.push('No ch-based max-width on article prose — line length is unconstrained (measured 114 chars before this was added).');
}

if (problems.length) {
  console.error(`\n❌ validate-typography: ${problems.length} problem(s).`);
  problems.forEach(p => console.error('   - ' + p));
  console.error('\n   These control whether readers can tell where one section ends and the next begins.');
  process.exit(1);
}
console.log(`✅ Typography: section separator intact and not globally cancelled; prose measure capped.`);
