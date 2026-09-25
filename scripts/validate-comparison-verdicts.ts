/**
 * validate-comparison-verdicts.ts
 *
 * A comparison page exists to resolve a decision. That is also how it loses the
 * click: Google renders roughly 160 characters of the passage it judges most
 * relevant, and on a "X vs Y" query that passage is the winner verdict. A short
 * verdict is therefore displayed in full, and the searcher has their answer
 * without ever arriving.
 *
 * This is not a theory about the SERP — it was observed. On `garmin s62 vs s70`
 * the live snippet was this field, word for word, while the page sat at #2 with
 * 25 clicks from 1,470 impressions (1.7%).
 *
 * Measured, 28 days to 23 Sep 2026:
 *     verdict displayed in full   Kirkland vs Pro V1    4/626    0.6%
 *                                 S62 vs S70           25/1470   1.7%
 *                                 Pro V1 vs Chrome     36/1895   1.9%
 *     verdict truncated           Paradym vs Qi35      70/1295   5.4%
 * Four points with position not held constant, so: suggestive, not settled.
 *
 * The invariant: a verdict must be long enough that Google has to cut it off.
 * That is not an instruction to pad. The rewrite that satisfies it puts the AXIS
 * of the decision first — what actually separates the two products — and resolves
 * it afterwards, so the snippet informs the reader without deciding for them.
 *
 * Deliberately NOT checked: whether the verdict is good. No validator can judge
 * that. This only catches the shape that gives the answer away for free.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist/compare';
// Google's displayed snippet runs to roughly 160 chars; anything under this is
// at risk of being shown whole. The margin is deliberate.
const MIN_CHARS = 236;
const CEILING = 0;

if (!existsSync(DIST)) {
  console.log('validate-comparison-verdicts: no dist/compare — run after astro build.');
  process.exit(0);
}

const short: Array<[string, number]> = [];
let checked = 0;

for (const slug of readdirSync(DIST, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
  const f = join(DIST, slug, 'index.html');
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const at = html.indexOf('🏆 Winner:');
  if (at < 0) continue;
  const after = html.slice(at, at + 4000).split('</p>')[1] ?? '';
  const verdict = after.split('</p>')[0]
    .replace(/<[^>]+>/g, '')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
  if (!verdict) continue;
  checked++;
  if (verdict.length < MIN_CHARS) short.push([slug, verdict.length]);
}

if (short.length > CEILING) {
  console.error(`\n❌ ${short.length} comparison verdict(s) short enough to display whole in a SERP snippet:`);
  for (const [s, n] of short) console.error(`   /compare/${s}/ — ${n} chars (need ${MIN_CHARS}+)`);
  console.error('   Lead with what separates the two products; resolve the decision after');
  console.error('   the ~160-character mark so the snippet informs without deciding.');
  process.exit(1);
}
console.log(`✅ Comparison verdicts: ${checked} checked — none short enough to be shown in full by Google.`);
