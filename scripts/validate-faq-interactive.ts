/**
 * validate-faq-interactive.ts — Sprint 190
 *
 * Ryan: "the F&Q are not clickable like the other pages."
 * He was right, and it was six pages, not one: 32 FAQ items rendered as a
 * static <div class="faq-item"><h3><p> while 1,064 elsewhere rendered as
 * <details class="faq-item"><summary>, which collapses and expands.
 *
 * The six were the hand-built guide pages — golf-ball-complete-guide,
 * golf-simulator-complete-guide, launch-monitor-buying-guide,
 * golf-club-distance-chart, golf-simulator-cost-calculator and
 * golf-equipment-budget-planner. They do not use [...slug].astro, so they
 * drifted from it and nothing compared them against it.
 *
 * An FAQ that looks like every other FAQ on the site but does not respond to
 * a click reads as broken, and these pages also carry FAQPage schema, which
 * promises an answer the reader can actually reach.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('dist')) {
  console.log('validate-faq-interactive: no dist/ yet — skipped (runs after astro build).');
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

let interactive = 0;
const offenders = new Map<string, number>();
for (const f of pages) {
  const h = readFileSync(f, 'utf8');
  interactive += (h.match(/<details[^>]*class="[^"]*faq-item/g) ?? []).length;
  const stat = (h.match(/<div[^>]*class="[^"]*faq-item/g) ?? []).length;
  if (stat) offenders.set(f.replace('dist/', '').replace('/index.html', ''), stat);
}

console.log('');
if (offenders.size) {
  const total = [...offenders.values()].reduce((a, b) => a + b, 0);
  console.log(`❌ FAQ interactivity: ${total} FAQ item(s) on ${offenders.size} page(s) are static <div>s, not <details>.`);
  [...offenders].sort((a, b) => b[1] - a[1]).forEach(([p, n]) => console.log(`   ${String(n).padStart(3)}  /${p}/`));
  console.log('');
  console.log('   Every other FAQ on the site collapses and expands. Use');
  console.log('   <details class="faq-item"><summary>question</summary><p>answer</p></details>');
  console.log('');
  process.exit(1);
}
console.log(`✅ FAQ interactivity: all ${interactive} FAQ item(s) across ${pages.length} page(s) are <details> — every one opens.`);
