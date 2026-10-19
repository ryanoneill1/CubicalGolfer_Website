/**
 * validate-inline-styles.ts — Sprint 181 (F9)
 *
 * WHY THIS EXISTS
 * The design audit found 26 border-radius values, 17 shadows and 6 body-copy
 * definitions in a codebase that has design tokens for all three. Every one of
 * those got in the same way: an inline style="". Inline styles beat every class,
 * are invisible to the ~50 validators that run on this build, and cannot be
 * changed in one place. Sprint 180 was the proof — the homepage sections
 * rendered touching because a zero bottom padding was sitting in an inline
 * style where nothing could see it, and Ryan found it before any check did.
 *
 * So this is a RATCHET, not a ban. Inline styles may only ever go down.
 * Lower CEILING whenever a sprint drains some. Never raise it: if you need a
 * repeated style, it belongs in global.css where the next person can find it.
 *
 * WHAT IT DOES NOT COUNT
 * Dynamic styles written as style={...} (template literals bound to data, e.g.
 * a computed bar width). Those are not hardcoded values and cannot be a class.
 * Only literal style="..." attributes are counted.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CEILING = 1225;   // Sprint 184: 1239 → 1227 (how-we-test section/h2; counts now exclude comments)

const files: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(astro|ts)$/.test(e.name)) files.push(p);
  }
})('src');

/* Sprint 184: comments are stripped before counting. Sprints routinely quote
 * the inline styles they just removed, in the comment explaining why — e.g.
 * how-we-test.astro documents the three variants it deliberately left alone.
 * Counting those makes a sprint that removed 12 attributes report 10, and
 * worse, a sprint could "reduce" the number by deleting documentation. The
 * metric has to measure the markup, not the prose about it. */
const stripComments = (src: string) =>
  src.replace(/<!--[\s\S]*?-->/g, ' ')          // HTML comments
     .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')    // JSX comments
     .replace(/\/\*[\s\S]*?\*\//g, ' ')         // CSS + JS block comments
     .replace(/^\s*\/\/.*$/gm, ' ');            // JS line comments

const counts: Array<[string, number]> = [];
let total = 0;
for (const f of files) {
  const n = (stripComments(readFileSync(f, 'utf8')).match(/style="/g) ?? []).length;
  if (n) { counts.push([f, n]); total += n; }
}
counts.sort((a, b) => b[1] - a[1]);

console.log('');
if (total > CEILING) {
  console.log(`❌ Inline styles: ${total} literal style="" attribute(s) — ceiling is ${CEILING}.`);
  console.log('');
  console.log('   This number is a ratchet. It went UP, which means a style was added');
  console.log('   somewhere a validator cannot see it. Put it in global.css instead.');
  console.log('   Worst files:');
  counts.slice(0, 8).forEach(([f, n]) => console.log(`     ${String(n).padStart(4)}  ${f}`));
  console.log('');
  process.exit(1);
}
console.log(`✅ Inline styles: ${total} literal style="" attribute(s) across ${counts.length} file(s) (ceiling ${CEILING}).`);
if (total < CEILING) {
  console.log(`   ${CEILING - total} below the ceiling — lower CEILING to ${total} in this file to lock the gain in.`);
}
console.log('   Remaining worst files:');
counts.slice(0, 5).forEach(([f, n]) => console.log(`     ${String(n).padStart(4)}  ${f}`));
