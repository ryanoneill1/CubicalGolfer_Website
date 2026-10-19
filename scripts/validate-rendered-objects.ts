/**
 * validate-rendered-objects.ts — Sprint 188
 *
 * WHAT WENT WRONG
 * "[object Object]" was rendering as visible body text on 147 pages — half the
 * site — twice on each. It had been live since Sprint 178.
 *
 * The cause is a JSX trap this project has now hit three times:
 *
 *     {isCommercial && (
 *       {/* a comment *\/}
 *     )}
 *
 * Sprint 178 deleted the markup inside the conditional and left the comment.
 * A lone JSX comment inside parentheses is an empty OBJECT, so the expression
 * evaluates to {} and Astro prints it. The build is green; ~50 validators are
 * green; the page says "[object Object]" to every reader and to Google.
 *
 * Nothing caught it because every check looked at structure, prices, links or
 * CSS. None of them read the page as a READER sees it. This one does.
 *
 * WHAT IT CHECKS, on the built HTML
 *   - "[object Object]"   an object rendered as text
 *   - "undefined" / "NaN" / "[object Promise]" as standalone visible words
 * All inside the body, with scripts, styles and JSON-LD stripped first, since
 * those legitimately contain such strings.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('dist')) {
  console.log('validate-rendered-objects: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const CEILING = 0;

const pages: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const q = join(d, e.name);
    if (e.isDirectory()) walk(q);
    else if (e.name === 'index.html') pages.push(q);
  }
})('dist');

const PATTERNS: Array<[string, RegExp]> = [
  ['[object Object]',  /\[object Object\]/g],
  ['[object Promise]', /\[object Promise\]/g],
  ['bare "undefined"', /(?:^|[\s>])undefined(?=[\s<.,!?]|$)/g],
  ['bare "NaN"',       /(?:^|[\s>])NaN(?=[\s<.,!?]|$)/g],
];

const hits = new Map<string, Map<string, number>>();
let total = 0;
for (const f of pages) {
  const visible = readFileSync(f, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ');
  for (const [label, re] of PATTERNS) {
    const n = (visible.match(re) ?? []).length;
    if (!n) continue;
    total += n;
    if (!hits.has(label)) hits.set(label, new Map());
    hits.get(label)!.set(f.replace('dist/', '').replace('/index.html', ''), n);
  }
}

console.log('');
if (total > CEILING) {
  console.log(`❌ Rendered objects: ${total} placeholder value(s) visible as body text (ceiling ${CEILING}).`);
  for (const [label, pageMap] of hits) {
    console.log(`   ${label} — on ${pageMap.size} page(s):`);
    [...pageMap].slice(0, 5).forEach(([p, n]) => console.log(`     ${n}x  /${p}/`));
  }
  console.log('');
  console.log('   A conditional wrapping ONLY a JSX comment — {cond && ( {/* … *\/} )} —');
  console.log('   evaluates to an empty object and Astro prints it. Put the comment');
  console.log('   outside the braces, or delete the conditional with it.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Rendered objects: no [object Object], undefined or NaN in the body text of ${pages.length} page(s).`);
