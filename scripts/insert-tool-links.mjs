#!/usr/bin/env node
/**
 * scripts/insert-tool-links.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Raises inbound internal links to the site's under-linked interactive tools.
 *
 * Why: the golf-ball-compression-chart has 23 inbound links and produces 27% of
 * all site traffic. The simulator tools sit on the highest-AOV category on the
 * site ($500-$5,000 products) with 1-5 inbound links each.
 *
 * Rules enforced:
 *   • a tool is only linked from an article whose own topic matches it
 *   • never more than MAX_PER_ARTICLE tool links added to one article
 *   • never inserted into an article that already links that tool
 *   • anchor text varies (no sitewide identical anchor)
 *   • inserted into a substantive section body, never a heading or metadata
 *   • no apostrophes in inserted copy, so single-quoted TS strings stay valid
 *
 * Idempotent: an article already containing the tool URL is skipped.
 */
import fs from 'fs';

const F = 'src/data/articles.ts';
const MAX_PER_ARTICLE = 2;
const MIN_BODY = 300;

const TOOLS = {
  'launch-monitor-room-checker': {
    target: 23,
    match: /launch monitor|simulator|ceiling|garage|basement|apartment|hitting net|impact screen/i,
    exclude: /golf ball|putter|glove|shoe|apparel|bag|cart/i,
    anchors: [
      'Before you buy, check the ceiling height and depth of your space with our <a href="/launch-monitor-room-checker/">room checker</a> — some monitors need more clearance than a standard garage has.',
      'Not sure your space works? The <a href="/launch-monitor-room-checker/">launch monitor room checker</a> tells you which units fit your ceiling height and room depth.',
      'Measure first. Our <a href="/launch-monitor-room-checker/">room size checker</a> shows which monitors physically fit before you spend anything.',
      'Ceiling height decides more of this than price does — run your dimensions through the <a href="/launch-monitor-room-checker/">room checker</a> first.',
      'If you are working with a low ceiling or a short garage, the <a href="/launch-monitor-room-checker/">room checker</a> will rule out the units that will not fit.',
    ],
  },
  'golf-simulator-cost-calculator': {
    target: 23,
    match: /simulator|launch monitor|hitting bay|indoor golf|home setup/i,
    exclude: /golf ball|putter|glove|shoe|apparel/i,
    anchors: [
      'To price out a full build at your budget, use the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a> — it returns a complete parts list with running totals.',
      'Want the whole bill of materials? The <a href="/golf-simulator-cost-calculator/">golf simulator cost calculator</a> builds a costed parts list at three budget tiers.',
      'The monitor is rarely the whole cost. Our <a href="/golf-simulator-cost-calculator/">cost calculator</a> adds up the mat, net, screen, projector and software too.',
      'Budget first, then shop. The <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a> shows what a complete setup runs at each tier.',
      'See the full build cost for your budget in the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a>.',
    ],
  },
  'golf-simulator-projector-distance-calculator': {
    target: 12,
    match: /projector|impact screen|enclosure|simulator|throw distance/i,
    exclude: /golf ball|putter|glove/i,
    anchors: [
      'Throw distance is the part people get wrong — the <a href="/golf-simulator-projector-distance-calculator/">projector distance calculator</a> tells you where the unit has to sit for your screen size.',
      'Work out mounting distance before you buy with the <a href="/golf-simulator-projector-distance-calculator/">projector distance calculator</a>.',
      'Screen size and throw distance are linked. Our <a href="/golf-simulator-projector-distance-calculator/">projector distance calculator</a> does the maths for your room.',
    ],
  },
  'golf-equipment-budget-planner': {
    target: 12,
    match: /under \$|budget|beginner set|complete set|affordable|value/i,
    exclude: /simulator|launch monitor/i,
    anchors: [
      'Spreading a fixed budget across a full bag is its own problem — the <a href="/golf-equipment-budget-planner/">equipment budget planner</a> shows where the money is best spent.',
      'If you are kitting out from scratch, the <a href="/golf-equipment-budget-planner/">golf equipment budget planner</a> allocates your budget across clubs, bag and accessories.',
      'Not sure how to split the money? Try the <a href="/golf-equipment-budget-planner/">equipment budget planner</a>.',
    ],
  },
  'golf-ball-finder': {
    target: 10,
    match: /golf ball|compression|ball for/i,
    exclude: /simulator|rangefinder|watch|putter|bag/i,
    anchors: [
      'For a shortlist matched to your swing speed and feel preference, run the <a href="/golf-ball-finder/">golf ball finder</a>.',
      'Not sure which model suits you? The <a href="/golf-ball-finder/">ball finder</a> narrows it down by swing speed, spin and budget.',
      'Match a ball to your game with the <a href="/golf-ball-finder/">golf ball finder</a>.',
    ],
  },
  'golf-swing-speed-chart': {
    target: 10,
    match: /swing speed|shaft flex|driver loft|senior|slow swing/i,
    exclude: /simulator|bag|shoe|glove/i,
    anchors: [
      'If you do not know your number, the <a href="/golf-swing-speed-chart/">swing speed chart</a> shows typical speeds by age and handicap and what flex each implies.',
      'Compare yourself against typical speeds in the <a href="/golf-swing-speed-chart/">golf swing speed chart</a>.',
      'Speed drives most of these choices — see the <a href="/golf-swing-speed-chart/">swing speed chart</a> for the ranges.',
    ],
  },
};

let src = fs.readFileSync(F, 'utf8');
const lines = src.split('\n');
const starts = [];
lines.forEach((l, i) => { if (l === '  {') starts.push(i); });
starts.push(lines.length);

// index articles
const arts = [];
for (let i = 0; i < starts.length - 1; i++) {
  const blk = lines.slice(starts[i], starts[i + 1]).join('\n');
  const s = blk.match(/slug:\s*'(\/[^']+)'/);
  const t = blk.match(/\n    title:\s*'((?:[^'\\]|\\.)*)'/);
  if (s) arts.push({ slug: s[1], title: t ? t[1] : '', blk, added: 0 });
}

const before = {};
const inserted = [];
for (const tool of Object.keys(TOOLS)) before[tool] = (src.match(new RegExp(`/${tool}/`, 'g')) || []).length;

for (const [tool, cfg] of Object.entries(TOOLS)) {
  const url = `/${tool}/`;
  let count = before[tool];
  let ai = 0;
  const pool = arts.filter(a => {
    const hay = (a.slug + ' ' + a.title).replace(/-/g, ' ');
    return cfg.match.test(hay) && !cfg.exclude.test(hay) && !a.blk.includes(url) && a.added < MAX_PER_ARTICLE;
  });
  for (const a of pool) {
    if (count >= cfg.target) break;
    // find a substantive section body inside this article's CURRENT text in src
    const idx = src.indexOf(`slug: '${a.slug}'`);
    if (idx < 0) continue;
    const region = src.slice(idx, idx + 60000);
    const bodyRe = /body:\s*'((?:[^'\\]|\\.){300,}?)'/;
    const bm = region.match(bodyRe);
    if (!bm) continue;
    if (bm[1].includes(url)) continue;
    const anchor = cfg.anchors[ai % cfg.anchors.length]; ai++;
    const newBody = bm[1] + '\\n\\n' + anchor;
    const absStart = idx + bm.index;
    src = src.slice(0, absStart) + `body: '${newBody}'` + src.slice(absStart + bm[0].length);
    a.added++; a.blk += url; count++;
    inserted.push([tool, a.slug, anchor.slice(0, 60)]);
  }
}

fs.writeFileSync(F, src);

const after = {};
for (const tool of Object.keys(TOOLS)) after[tool] = (src.match(new RegExp(`/${tool}/`, 'g')) || []).length;

console.log('── TOOL LINK INSERTION ──────────────────────────────────────────────');
console.log('%-46s %7s %7s %7s', 'tool', 'before', 'after', 'target');
for (const t of Object.keys(TOOLS)) {
  console.log(t.padEnd(46), String(before[t]).padStart(7), String(after[t]).padStart(7), String(TOOLS[t].target).padStart(7));
}
console.log(`\ninsertions: ${inserted.length}`);
const perArticle = {};
for (const [, slug] of inserted) perArticle[slug] = (perArticle[slug] || 0) + 1;
const over = Object.entries(perArticle).filter(([, n]) => n > MAX_PER_ARTICLE);
console.log(`articles touched: ${Object.keys(perArticle).length}   any over ${MAX_PER_ARTICLE} links: ${over.length ? JSON.stringify(over) : 'none'}`);
const braces = (src.match(/\{/g) || []).length - (src.match(/\}/g) || []).length;
const slugs = (src.match(/\n    slug: '/g) || []).length;
console.log(`\nbrace balance: ${braces} (expect 0)   slug count: ${slugs} (expect 166)`);
if (braces !== 0 || over.length) process.exit(1);
