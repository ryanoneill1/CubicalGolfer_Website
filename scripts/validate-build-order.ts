/**
 * validate-build-order.ts — Sprint 187
 *
 * WHY THIS EXISTS
 * I have now put a dist/-reading validator into the PRE-build chain twice.
 * The first time (validate-home-rhythm, Sprint 180) the local build caught it
 * immediately. The second time (validate-box-width, Sprint 186) it did NOT:
 * my working copy had a dist/ left over from an earlier run, so the script
 * found what it needed and reported green. Cloudflare checks out clean, has no
 * dist/ at that point, and the deploy died with:
 *
 *     Error: ENOENT: no such file or directory, scandir 'dist'
 *
 * A green local build is not evidence when the thing being tested is whether
 * a file EXISTS yet. This check reads the order instead of relying on the
 * state of my machine.
 *
 * WHAT IT CHECKS
 * Every script named in the `build` chain before `astro build` — including
 * everything the `validate` sub-chain expands to — must not read dist/ unless
 * it guards with existsSync and exits 0. That guard is what makes a
 * misplacement harmless rather than a failed deploy.
 */
import { readFileSync, existsSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const expand = (chain: string): string[] =>
  chain.split('&&').flatMap(step => {
    const s = step.trim();
    const m = /^npm run ([a-z0-9:-]+)$/.exec(s);
    return m && pkg.scripts[m[1]] ? expand(pkg.scripts[m[1]]) : [s];
  });

const steps = expand(pkg.scripts.build);
const buildAt = steps.findIndex(s => /(^|\s)astro build(\s|$)/.test(s));
if (buildAt < 0) {
  console.log('❌ Build order: no `astro build` step found in the build chain.');
  process.exit(1);
}

/* Getting this regex right took three attempts, so the reasoning is here.
 *  1. Matching any 'dist' string literal flagged check-duplicates and
 *     validate-stated-counts, which name 'dist' only to SKIP it while walking
 *     src/. Flagging correct code teaches people to ignore the check.
 *  2. Matching only `readdirSync('dist'` and friends then MISSED the real
 *     case: validate-box-width passes it to a walker — `})('dist');` — so the
 *     literal never sits next to an fs call name.
 *  3. What actually distinguishes them is the character before the quote.
 *     A read passes 'dist' as a CALL ARGUMENT: `('dist'`. A skip COMPARES it
 *     or lists it: `=== 'dist'`, `, 'dist'`. A path prefix — 'dist/...' —
 *     is always a read. */
const READS_DIST = /\(\s*['"`]dist['"`]|['"`]dist\//;
const GUARDED    = /existsSync\(\s*['"]dist['"]\s*\)/;

const offenders: string[] = [];
for (let i = 0; i < buildAt; i++) {
  const m = /scripts\/([a-z0-9-]+)\.ts/.exec(steps[i]);
  if (!m) continue;
  /* Skip itself. This file necessarily CONTAINS the pattern it searches for —
   * the regex literal and the comments above both spell out `('dist'` — so on
   * the first clean run it flagged itself and failed the build. A checker that
   * cannot survive reading its own source is not finished. */
  if (m[1] === 'validate-build-order') continue;
  const f = `scripts/${m[1]}.ts`;
  if (!existsSync(f)) continue;
  const src = readFileSync(f, 'utf8');
  if (READS_DIST.test(src) && !GUARDED.test(src)) offenders.push(m[1]);
}

console.log('');
if (offenders.length) {
  console.log(`❌ Build order: ${offenders.length} script(s) read dist/ but run BEFORE \`astro build\`, with no existsSync guard:`);
  offenders.forEach(o => console.log(`   - scripts/${o}.ts`));
  console.log('');
  console.log('   On a clean checkout dist/ does not exist yet and the build dies with');
  console.log('   ENOENT. Move it after `astro build` in package.json, and add an');
  console.log('   existsSync(\'dist\') guard so a future misplacement degrades to a skip.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Build order: ${buildAt} pre-build step(s) checked — none reads dist/ unguarded.`);
