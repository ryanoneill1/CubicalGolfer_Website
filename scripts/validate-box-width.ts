/**
 * validate-box-width.ts — Sprint 186
 *
 * THE BUG IT GUARDS
 * Ryan reported the "Cubicle Golfer Tip" box as the right width but with its
 * text stopping well short of the edge. It was, and 57 boxes across 55 pages
 * had the same defect. The cause is a gap between the two width rules in
 * global.css:
 *
 *   Rule A caps p/ul/ol inside anything NOT on an exclusion list.
 *   Rule B caps the BOX itself for every listed note class.
 *
 * A <div> with inline styles and NO class is on neither list. So the paragraph
 * was capped at --prose-w (722px at a 1440px window) while the box ran the
 * full shell (1304px): 582px of empty colour inside a coloured box.
 *
 * Neither rule is wrong on its own. The defect only exists for elements that
 * fall between them, which is why no existing check saw it — and why the fix
 * is a class (.art-note) that appears on BOTH lists, not a tweak to either.
 *
 * WHAT IT CHECKS, ON THE BUILT PAGES
 * A styled <div> that directly contains a <p>, carries a background or a
 * left border, and has no class at all. That is the exact shape that lands in
 * the gap.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CEILING = 0;

/* This reads dist/, so it belongs AFTER `astro build`. It was wired into the
 * pre-build `validate` chain by mistake and took the Cloudflare build down
 * with ENOENT on a clean checkout — my own machine had a stale dist/ from an
 * earlier run, so it passed locally. The guard below means a misplacement can
 * never again fail a deploy; validate-build-order.ts catches the misplacement
 * itself. */
if (!existsSync('dist')) {
  console.log('validate-box-width: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const pages: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const q = join(d, e.name);
    if (e.isDirectory()) walk(q);
    else if (e.name === 'index.html') pages.push(q);
  }
})('dist');

let total = 0;
const byPage = new Map<string, number>();
for (const f of pages) {
  const h = readFileSync(f, 'utf8');
  const i = h.indexOf('class="art-content');
  const j = h.indexOf('class="compare-body');
  const start = i >= 0 ? i : j;
  if (start < 0) continue;
  for (const m of h.slice(start).matchAll(/<div style="([^"]*)"[^>]*>\s*<p\b/g)) {
    if (!/background|border-left|border:/.test(m[1])) continue;   // only box-like divs
    total++;
    const k = f.replace('dist/', '').replace('/index.html', '');
    byPage.set(k, (byPage.get(k) ?? 0) + 1);
  }
}

console.log('');
if (total > CEILING) {
  console.log(`❌ Box width: ${total} styled note box(es) with no class — the box runs the shell while its text is capped at the measure (ceiling ${CEILING}).`);
  for (const [k, n] of [...byPage].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`   ${String(n).padStart(3)}  /${k}/`);
  }
  console.log('');
  console.log('   Give it class="art-note" (or .art-note--tip). That class is on both');
  console.log('   width lists in global.css, so the box and its text agree.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Box width: every styled note box carries a class, so box and text share one width (${pages.length} pages checked).`);
