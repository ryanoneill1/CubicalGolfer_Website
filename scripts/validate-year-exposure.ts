/**
 * validate-year-exposure.ts — makes the January cliff visible before it arrives.
 *
 * THE MEASUREMENT (Search Console, 90 days to 2026-09-05)
 *   queries containing 2026 :  796 clicks · 13.8K impr · 5.8% CTR · position 12.2
 *   queries containing 2025 :    1 click  ·  587 impr · 0.2% CTR · position 37.0
 *   site total              : 5,840 clicks · 379K impr · 1.5% CTR · position 15.7
 *
 * Dated queries are 13.6% of clicks at nearly 4x the site CTR. The 2025 row is the
 * control: this site has never had a "2025" title, and across 159 such queries it sits
 * at position 37 and earned one click in 90 days. Carrying the year in the title is
 * worth roughly 25 positions on a dated query.
 *
 * So the exposure is real but bounded — this is not "93% of the site", which is what a
 * page-level count of dated TITLES would wrongly suggest. It is ~13.6% of clicks,
 * concentrated in the compression chart (590 of the 796).
 *
 * WHY THIS WARNS AND NEVER FAILS
 * A stale year does not break the site; it slowly stops earning. Failing the build
 * would block deploys on a day when nothing is actually broken, so this prints a
 * countdown from December and a loud notice once the calendar has moved past the site
 * year. Fix it with:  npx tsx scripts/roll-year.ts --apply
 */

import { readFileSync, globSync } from 'node:fs';

const ROLL_FIELDS = ['title', 'titleDisplay', 'description', 'label', 'guideLabel', 'h2', 'h3', 'heading'];
const PROSE_FIELDS = ['body', 'a', 'q', 'bottomLine'];
const TARGETS = ['src/data/articles.ts', ...globSync('src/pages/**/*.astro')];
const ISO_NEAR = /\d{4}-\d{2}-\d{2}/;

function tally(fields: string[]) {
  const years = new Map<number, number>();
  const re = new RegExp(`(${fields.join('|')}):\\s*(['"\`])((?:\\\\.|(?!\\2)[^\\\\])*)\\2`, 'g');
  for (const file of TARGETS) {
    let src = '';
    try { src = readFileSync(file, 'utf8'); } catch { continue; }
    for (const m of src.matchAll(re)) {
      const v = m[3];
      for (const y of v.matchAll(/\b(20[2-9]\d)\b/g)) {
        const ctx = v.slice(Math.max(0, y.index! - 12), y.index! + 12);
        if (ISO_NEAR.test(ctx)) continue;
        const n = Number(y[1]);
        years.set(n, (years.get(n) ?? 0) + 1);
      }
    }
  }
  return years;
}

const rollable = tally(ROLL_FIELDS);
const prose = tally(PROSE_FIELDS);

if (rollable.size === 0) {
  console.log('✅ Year exposure: no dated titles or descriptions.');
  process.exit(0);
}

// The site year is whichever year dominates the navigational fields.
const [siteYear, siteCount] = [...rollable].sort((a, b) => b[1] - a[1])[0];
const now = new Date();
const calendarYear = now.getFullYear();
const proseCount = prose.get(siteYear) ?? 0;

console.log(`   Year exposure: site year ${siteYear} — ${siteCount} title/description/label string(s), ${proseCount} in prose.`);

if (calendarYear > siteYear) {
  const q = [...rollable].filter(([y]) => y !== siteYear).map(([y, n]) => `${y}×${n}`).join(', ');
  console.log('');
  console.log('⚠️  ─────────────────────────────────────────────────────────────────────');
  console.log(`⚠️   It is ${calendarYear}. ${siteCount} reader-facing strings still say ${siteYear}.`);
  console.log('⚠️');
  console.log(`⚠️   Dated queries were 13.6% of clicks at 5.8% CTR. Last year's dated`);
  console.log(`⚠️   term earned 1 click in 90 days at position 37 — that is where these`);
  console.log(`⚠️   pages are heading while the title says ${siteYear}.`);
  console.log('⚠️');
  console.log('⚠️   Roll them:   npx tsx scripts/roll-year.ts            (dry run first)');
  console.log('⚠️                npx tsx scripts/roll-year.ts --apply');
  console.log('⚠️                npm run lastmod && npm run validate && npm run build');
  console.log('⚠️');
  console.log(`⚠️   Then hand-review the ${proseCount} prose mentions the tool deliberately`);
  console.log('⚠️   leaves alone — those make claims that may no longer be true.');
  if (q) console.log(`⚠️   (other years present: ${q})`);
  console.log('⚠️  ─────────────────────────────────────────────────────────────────────');
  console.log('');
} else if (now.getMonth() === 11) {
  console.log(`   📅 December: the ${siteYear} → ${siteYear + 1} roll is due. Check Search Console for`);
  console.log(`      "${siteYear + 1}" query volume, then run scripts/roll-year.ts.`);
}

/**
 * Year-bearing ASSET PATHS. These are the trap.
 *
 * /downloads/golf-ball-compression-chart-2026.pdf is referenced in 6 places including
 * the schema.org contentUrl, and "golf ball compression chart 2026 pdf" earns 53 clicks
 * at 27.2% CTR. roll-year.ts deliberately does NOT rename it, because renaming a URL
 * needs a redirect decision that only a human should make. So the failure mode is a
 * page headed "Download 2027 Chart" linking a file called 2026 — which this catches.
 */
const assetYears = new Map<number, Set<string>>();
// Only first-party DOWNLOADABLE assets. Excluded on purpose:
//   - external citations (the USGA distance report legitimately says 2024)
//   - og images and thumbnails, which are derived from slugs, never rank on their own,
//     and are regenerated by the build — renaming them is not a decision anyone makes
const ASSET_RE = /["'`(]((?:https:\/\/www\.cubicalgolfer\.com)?(?:public)?\/[^"'`)\s]*?\b(20[2-9]\d)\b[^"'`)\s]*\.(?:pdf|csv|xlsx|zip))/g;
for (const file of [...TARGETS, ...globSync('scripts/**/*.ts')]) {
  let src = '';
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  for (const m of src.matchAll(ASSET_RE)) {
    if (/\/images\//.test(m[1])) continue;
    const y = Number(m[2]);
    if (!assetYears.has(y)) assetYears.set(y, new Set());
    assetYears.get(y)!.add(m[1]);
  }
}

const staleAssets = [...assetYears].filter(([y]) => y !== siteYear);
if (staleAssets.length) {
  console.log('');
  console.log(`⚠️  Asset paths disagree with the site year (${siteYear}):`);
  for (const [y, paths] of staleAssets) {
    for (const path of paths) console.log(`      ${y}  ${path}`);
  }
  console.log('   Decide per asset: keep the old filename and let the title carry the year,');
  console.log('   or rename AND add a redirect. Do not rename without one.');
}

// Deliberately exit 0. A stale year costs traffic; it does not break the build.
process.exit(0);
