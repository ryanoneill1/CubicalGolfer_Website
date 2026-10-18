#!/usr/bin/env node
/**
 * validate-table-scroll.ts — POST-BUILD guard on wide-table behaviour.
 *
 * Sprint 143 set `.art-content table { display:block }` below 760px to stop
 * wide tables pushing the page sideways — a real fix for the 58% of clicks
 * that are mobile. The cost: `display:block` drops a table out of the
 * accessibility tree, so rows, columns and header association stop being
 * announced. 114 tables on 55 pages, 9 of them on the compression chart.
 *
 * Sprint 177 wraps tables in `.tbl-scroll` at runtime and hands `display:table`
 * back, adds edge fades, a visible hint, `tabindex="0"` and an aria-label.
 * Verified on live markup at a forced 360px: display stayed `table`, hidden
 * columns stayed reachable, and the wrapper became keyboard-focusable.
 *
 * The mechanism is runtime, so this asserts the parts are SHIPPED — and above
 * all that the no-JS fallback is still there. Delete that believing the
 * wrapper replaces it and readers without JavaScript get page overflow back.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.log('validate-table-scroll: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const css = readdirSync(join(DIST, '_astro'))
  .filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join(DIST, '_astro', f), 'utf8'))
  .join('\n')
  .replace(/\s+/g, '');

const problems: string[] = [];

if (!/\.tbl-scroll>table\{[^}]*display:table/.test(css)) {
  problems.push('.tbl-scroll > table does not restore display:table — wrapped tables stay semantically broken.');
}
if (!/\.art-contenttable\{[^}]*display:block/.test(css)) {
  problems.push('The Sprint 143 no-JS fallback (.art-content table { display:block }) is gone — ' +
    'readers without JavaScript lose the overflow fix.');
}
// The minifier rewrites ::after to the legacy single-colon :after, so accept both.
if (!/\.tbl-scroll\.is-scrollable::?after/.test(css)) {
  problems.push('No scroll-edge affordance found for .tbl-scroll.is-scrollable.');
}
if (!/\.tbl-hint\{/.test(css)) {
  problems.push('.tbl-hint styling is missing — the visible scroll hint will be unstyled.');
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'index.html') out.push(p);
  }
  return out;
}
const pages = walk(DIST);
const withoutScript = pages.filter(f => !readFileSync(f, 'utf8').includes("'tbl-scroll'"));
if (withoutScript.length) {
  problems.push(`${withoutScript.length} page(s) do not ship the table wrapper script, e.g. ` +
    withoutScript.slice(0, 3).map(f => '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '')).join(', '));
}

if (problems.length) {
  console.error(`\n❌ Table scrolling: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`   ${p}`);
  console.error('');
  process.exit(1);
}

console.log(`✅ Table scrolling: wrapper restores display:table, edge fade + hint styled, ` +
  `no-JS fallback intact, script on all ${pages.length} page(s).`);
