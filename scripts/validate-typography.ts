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

// Sprint 148 — the measure is now guaranteed by the WIDTH OF THE COLUMN, not by
// a ch cap inside a wide one. Capping text inside a 1400px container left 758px
// of empty page beside every paragraph. This asserts the column itself is
// constrained; 700px renders 73 characters at the current body size.
//
// The previous version of this check looked for any `max-width: <n>ch` anywhere
// in the bundle, which passed on unrelated 76ch/68ch rules after the prose cap
// had been removed — a false pass. Matching the container is unambiguous.
const colMatch = css.match(/\.art-content[^{]*\{[^}]*max-width:\s*(\d+)px/);
const colWidth = colMatch ? parseInt(colMatch[1], 10) : null;
if (colWidth === null) {
  problems.push('No px max-width on .art-content — the text column is unconstrained (measured 114 characters per line before this was added).');
} else if (colWidth > 820) {
  problems.push(`.art-content is ${colWidth}px wide. Above ~820px the line length passes the 80-character WCAG ceiling; 700px renders 73.`);
}

// ── table alignment ────────────────────────────────────────────────────────
// A column must align as a unit: every cell in it, plus its header, the same
// way. Mixed alignment inside one column is the defect right-alignment exists
// to prevent — it stops the digits lining up by place value, which is the whole
// point. Checks the built HTML rather than the CSS, because alignment is decided
// per table at build time (src/lib/table-align.ts).
{
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
      const p = path.join(d, e.name);
      return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
    });
  const ragged: string[] = [];
  let tables = 0;
  for (const file of walk('dist')) {
    const html = fs.readFileSync(file, 'utf-8');
    if (!html.includes('class="cmp-table"')) continue;
    const slug = '/' + path.relative('dist', path.dirname(file)).split(path.sep).join('/') + '/';
    for (const tbl of html.match(/<table class="cmp-table"[\s\S]*?<\/table>/g) || []) {
      tables++;
      const headAttrs = [...tbl.matchAll(/<th\b([^>]*)>/g)].map(m => m[1]);
      const bodyRows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].slice(1);
      const colNumeric: (boolean | null)[] = headAttrs.map(a => a.includes('cmp-num'));
      for (const match of bodyRows) {
        const row = match[1];
        const cells = [...row.matchAll(/<td\b([^>]*)>/g)].map(m => m[1]);
        cells.forEach((a, i) => {
          const isNum = a.includes('cmp-num');
          // column 0 is the product name, last is the Buy button — both always left
          if (i === 0 || i >= colNumeric.length - 1) return;
          if (colNumeric[i] !== undefined && colNumeric[i] !== isNum) {
            ragged.push(`${slug} column ${i}: header ${colNumeric[i] ? 'right' : 'left'}, a cell ${isNum ? 'right' : 'left'}`);
          }
        });
      }
    }
  }
  const uniq = [...new Set(ragged)];
  if (uniq.length) {
    problems.push(
      `${uniq.length} table column(s) align inconsistently between header and cells:\n` +
      uniq.slice(0, 8).map(r => '       ' + r).join('\n')
    );
  } else {
    console.log(`\u2705 Table alignment: ${tables} comparison table(s) — every column aligns as a unit.`);
  }
}

if (problems.length) {
  console.error(`\n❌ validate-typography: ${problems.length} problem(s).`);
  problems.forEach(p => console.error('   - ' + p));
  console.error('\n   These control whether readers can tell where one section ends and the next begins.');
  process.exit(1);
}
console.log(`✅ Typography: section separator intact and not globally cancelled; prose measure capped.`);
