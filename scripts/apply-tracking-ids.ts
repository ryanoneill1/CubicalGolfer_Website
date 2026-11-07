#!/usr/bin/env node
/**
 * apply-tracking-ids.ts — post-build, stamps each Amazon link with the
 * tracking ID of the PAGE it sits on.
 *
 * ── Why this is a post-build rewrite and not a component change ───────────
 * The tag `cubicalgolfer-20` is hardcoded 263 times inside affiliate-links.ts
 * and rendered from 25+ components and bespoke pages. Two consequences:
 *
 *   1. A registry entry is shared across pages. `garmin-approach-r10` appears
 *      on the launch-monitor roundups AND on /shaft-flex-guide/. Editing the
 *      263 URLs would tag the PRODUCT, which tells us what we already know
 *      from the Associates product report.
 *   2. Threading a slug through every component is 25+ edit sites, and the
 *      failure mode of missing one is silent — that link keeps the default
 *      tag and quietly never appears in the split.
 *
 * Operating on the built HTML removes both problems. The file's own path IS
 * the page group, which is exactly the question being asked ("which PAGES
 * send clicks that convert"), and no render site can be missed because this
 * sees the final output rather than the code that produced it.
 *
 * ── Safe by construction ──────────────────────────────────────────────────
 * The rewrite only ever replaces `tag=cubicalgolfer-20` with another ID from
 * the same account. A page that somehow is not classified falls to `misc`,
 * and a link this script never touches keeps the default tag — so the worst
 * case is an unattributed commission, never a lost one.
 *
 * Fails the build if an amazon.com link carries no tag at all, which would be
 * a real lost commission.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const DEFAULT_TAG = 'cubicalgolfer-20';

/** Tracking IDs created in Associates on 1 November 2026. */
const TAG: Record<string, string> = {
  lm:   'cubicalgolfer-lm-20',
  gps:  'cubicalgolfer-gps-20',
  ball: 'cubicalgolfer-ball-20',
  club: 'cubicalgolfer-club-20',
  wear: 'cubicalgolfer-wear-20',
  gift: 'cubicalgolfer-gift-20',
  tool: 'cubicalgolfer-tool-20',
  misc: 'cubicalgolfer-misc-20',
};

/**
 * Order matters and is deliberate.
 *
 * `gift` is tested FIRST so every deal-intent page reports together, including
 * /black-friday-golf-launch-monitor-deals/. That page could defensibly sit in
 * `lm`, but the question Q4 has to answer is "did the seasonal bet earn
 * anything", and splitting the deal pages across groups makes that unreadable.
 *
 * `tool` is deliberately narrow — calculators, planners and hub pages only.
 * Charts and finders fall through to their subject, so the compression chart
 * reports as a ball page, which is what it is.
 */
/**
 * ── Sprint 228: the model names had gone stale ────────────────────────────
 * These rules name specific products, and the product line-up moved on while
 * the rules did not. `club` listed the TaylorMade Qi10 but not the Qi35 or
 * Qi4d that replaced it; `gps` listed the Garmin Approach S series but not the
 * Z rangefinders; `lm` listed the Garmin R10 but not the Approach R50.
 *
 * The cost was not a broken link — every link was still tagged. The cost was
 * that 66 pages carrying 286 Amazon links fell through to `misc`, including
 * five driver and wedge comparisons, a Garmin launch-monitor review and a
 * rangefinder comparison. `misc` was the second-largest bucket, which would
 * have made the whole point of the split — "which CATEGORY earns" — impossible
 * to read once the data arrived.
 *
 * Fixed four days after the tags went live, so the reporting window starts
 * clean rather than needing the clock restarted.
 *
 * Deliberately still falling through to `misc`: alignment sticks, indoor
 * putting greens and the general accessory round-ups. `tool` is documented
 * below as calculators and hubs only, so a physical training aid does not
 * belong there, and inventing a group for three pages would be worse than
 * leaving them in the bucket that exists for exactly this.
 */
const RULES: Array<[string, RegExp]> = [
  ['gift', /(gift|black-friday|prime-day|christmas|stocking|holiday)/],
  ['lm',   /(launch-monitor|simulator|skytrak|mevo|rapsodo|mlm2pro|gc3|gcquad|trackman|uneekor|swing-caddie|flightscope|foresight|square-golf|launch-pro|rainmaker|garmin-r10|r10|approach-r\d|swing-analyzer|projector|hitting-(mat|net)|net-return|spornia|fiberbuilt|studio-mat|country-club-elite|impact-screen)/],
  ['gps',  /(rangefinder|gps|watch|ion-elite|ion-edge|approach-s|approach-z|phantom|nx9|tour-v|wingman|shot-scope|voice-caddie|golfbuddy|slope|arccos|golf-apps)/],
  ['ball', /(ball|compression|pro-v1|chrome-soft|chrome-tour|supersoft|soft-feel|q-star|tour-response|noodle|kirkland|vice|avx|velocity|e12|tour-b)/],
  ['club', /(driver|iron|wedge|putter|hybrid|shaft|loft|3-wood|fairway|grip|club-distance|strata|callaway-ai|qi10|qi35|qi4d|aerojet|vokey|jaws|lab-golf|mezz|launcher-xl|sm11|rtx|g430|gt2|darkspeed|stealth|paradym|golf-set|golf-clubs|junior-golf|left-handed)/],
  ['wear', /(shoe|glove|pant|short|shirt|polo|rain|sunglass|bag|apparel|lifestyle|hat|cap|belt|sock|outerwear|jacket|towel|umbrella|push-cart|electric-golf-cart|golf-cart)/],
  ['tool', /(calculator|planner|checker|budget|cost|\/tools\/|golf-tech|gear-reviews|best-golf-gear|room-|brands)/],
];

export function groupForPath(p: string): string {
  for (const [g, re] of RULES) if (re.test(p)) return g;
  return 'misc';
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('apply-tracking-ids: dist/ not found — run after astro build.');
  process.exit(1);
}

const files = walk(DIST);
const perGroup: Record<string, { pages: number; links: number }> = {};
const samples: Record<string, string> = {};
let rewritten = 0;
let untagged: string[] = [];

for (const file of files) {
  // dist/best-golf-balls-2026/index.html -> /best-golf-balls-2026/
  const sitePath =
    '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const group = groupForPath(sitePath);
  const tag = TAG[group];

  const before = fs.readFileSync(file, 'utf8');
  let n = 0;
  const after = before.replace(
    new RegExp(`([?&]tag=)${DEFAULT_TAG}\\b`, 'g'),
    (_m, p1) => { n++; return p1 + tag; },
  );

  perGroup[group] = perGroup[group] ?? { pages: 0, links: 0 };
  perGroup[group].pages++;
  perGroup[group].links += n;

  if (n > 0) {
    fs.writeFileSync(file, after);
    rewritten += n;
    if (!samples[group]) {
      const m = after.match(/https:\/\/www\.amazon\.com[^"']{0,120}/);
      if (m) samples[group] = `${sitePath}  ${m[0].slice(0, 110)}`;
    }
  }

  // A tagless Amazon link is a lost commission — that is a build failure.
  // Only links that can actually earn count: a product (/dp/, /gp/) or a
  // search (/s?). The bare https://www.amazon.com in <link rel="preconnect">
  // and in the FTC disclosure is not a monetised link and must not be flagged.
  for (const m of after.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]*amazon\.com\/(?:dp|gp)\/[^"]*|https?:\/\/[^"]*amazon\.com\/s\?[^"]*)"/g)) {
    if (!/[?&]tag=/.test(m[1])) untagged.push(`${sitePath} -> ${m[1].slice(0, 100)}`);
  }
}

console.log(`\n✅ Tracking IDs: ${rewritten} Amazon link(s) stamped across ${files.length} page(s).`);
console.log('   group  pages  links  tracking ID');
for (const g of Object.keys(TAG)) {
  const t = perGroup[g] ?? { pages: 0, links: 0 };
  console.log(
    `   ${g.padEnd(6)}${String(t.pages).padStart(5)}${String(t.links).padStart(7)}  ${TAG[g]}`,
  );
}
if (process.env.SHOW_SAMPLES) {
  console.log('\n   one live link per group:');
  for (const [g, s] of Object.entries(samples)) console.log(`   ${g.padEnd(6)} ${s}`);
}

if (untagged.length) {
  console.error(`\n❌ ${untagged.length} Amazon link(s) carry no tag at all — lost commission:`);
  for (const u of untagged.slice(0, 15)) console.error(`   ${u}`);
  process.exit(1);
}

const leftover = files.reduce(
  (acc, f) => acc + (fs.readFileSync(f, 'utf8').match(new RegExp(`tag=${DEFAULT_TAG}\\b`, 'g'))?.length ?? 0),
  0,
);
console.log(
  leftover
    ? `⚠️  ${leftover} link(s) still carry the default tag — they still earn, just unattributed.`
    : '✅ No link left on the default tag.',
);
