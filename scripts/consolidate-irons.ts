#!/usr/bin/env node
// scripts/consolidate-irons.ts
// Consolidates 3 overlapping iron articles into /best-golf-irons-2026/ (survivor):
//   • carries the 3 orphaned affiliate keys in as new, coherent product sections
//   • merges the genuinely-unique buying advice + FAQs
//   • deletes the 3 retired article objects
//   • repoints every internal link to a retired slug at the survivor
//   • sets survivor dateModified to today (datePublished preserved)
import * as fs from 'fs';

const SRC = 'src/data/articles.ts';
const SURVIVOR = '/best-golf-irons-2026/';
const RETIRED = ['/best-game-improvement-irons-2026/', '/most-forgiving-irons/', '/best-golf-irons-high-handicapper/'];
const TODAY = '2026-07-25';
let src = fs.readFileSync(SRC, 'utf8');

// ── quote/escape-aware matching-brace finder ─────────────────────────────────
function matchBrace(s: string, openIdx: number): number {
  let depth = 0, i = openIdx, q: string | null = null;
  while (i < s.length) {
    const c = s[i];
    if (q) { if (c === '\\') { i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; i++; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
    i++;
  }
  throw new Error('unbalanced braces');
}
// the article-DEF `{` for a slug. Related-array entries are `{ slug: '/x/',
// label: ... }` — the def slug is the one NOT immediately followed by `, label:`.
function articleOpen(s: string, slug: string): number {
  const needle = `slug: '${slug}'`;
  let from = 0;
  for (;;) {
    const idx = s.indexOf(needle, from);
    if (idx < 0) throw new Error(`slug not found: ${slug}`);
    const after = s.slice(idx + needle.length, idx + needle.length + 12);
    if (!/^,\s*label:/.test(after)) return s.lastIndexOf('{', idx); // article def
    from = idx + 1;
  }
}

// ── new content (curly apostrophes avoid single-quote escaping) ───────────────
const NEW_SECTIONS =
`      { h2: 'Best for Beginners: Cleveland Launcher XL Halo', body: 'The Launcher XL Halo is built for the golfer with less than two years in the game who needs maximum help on every swing. The oversized head and extremely wide sole make it almost impossible to dig into turf, and the high launch gets the ball airborne even on thin strikes that would produce worm-burners with a standard iron. Distance stays remarkably consistent across the face — toe and heel misses fly within about 8 yards of center strikes. At roughly $600 for a set it is strong value for a first real bag. The trade-off: as your ball-striking sharpens you will eventually want more feedback than the Halo provides.', badge: 'BEST FOR BEGINNERS', rating: 4.4, affiliateKey: 'cleveland-launcher-xl-halo-irons' },
      { h2: 'Best for a Slice: TaylorMade Stealth HD Irons', body: 'The Stealth HD delivers about 85% of the Ping G430’s forgiveness at roughly 60% of the price. Its cap-back design creates a large sweet spot with good ball-speed retention on off-center hits, and the HD model adds draw bias — genuinely helpful for the many recreational golfers who fight a fade or slice with their irons. Turf interaction is solid from the fairway and first cut, though the sole is narrower than the Ping or Cleveland, so deep rough demands a cleaner strike. At roughly $550-600 for a steel set, it is the strongest value in forgiving, slice-fighting irons.', badge: 'BEST FOR A SLICE', rating: 4.5, affiliateKey: 'taylormade-stealth-hd-irons' },
      { h2: 'Best Players-Distance: Srixon ZX5 Mk II', body: 'For the lower-mid handicapper (roughly 10-15) who wants forgiveness without giving up feel, the ZX5 Mk II is the pick. Srixon’s MainFrame face adds ball speed on mishits while the cavity still delivers the feedback better ball-strikers crave. It flies a touch lower and spins a touch more than a pure game-improvement iron, which means more control into greens for players who find the center more often than not. At roughly $1,000-1,100 for a set it is not cheap, but it is the natural next iron for a mid-handicapper outgrowing super-forgiving heads.', badge: 'PLAYERS DISTANCE', rating: 4.5, affiliateKey: 'srixon-zx5-mk-ii' },
      { h2: 'What Makes an Iron Forgiving?', body: '<p>Three design features do most of the work:</p><ul><li><strong>Perimeter weighting</strong> — mass pushed to the edges of the head raises the moment of inertia (MOI), so the club twists less on off-center hits and holds ball speed and direction.</li><li><strong>A wide sole</strong> — a 20mm-plus sole bounces off the turf instead of digging, so fat shots still get through impact.</li><li><strong>Offset and a low center of gravity</strong> — extra offset gives the face a beat longer to square up (less slice), and a low CG launches the ball higher with less effort.</li></ul><p>The more of these an iron has, the more forgiving it plays — and the more your mishits still find the green.</p>' },
      { h2: 'Do Forgiving Irons Cost You Distance?', body: '<p>No — for most golfers it is the opposite. On center strikes, game-improvement and players irons carry within a yard or two of each other. The gap opens on mishits, which are more than half the shots a recreational golfer hits: a forgiving iron holds ball speed on toe and heel strikes where a blade bleeds 10-15 yards. Averaged across a round, the forgiving iron produces more <em>consistent</em> distance, not less. What you give up is shot-shaping control — deliberately working the ball or flighting it down — which matters to single-digit players, not to the golfer this guide is written for.</p>' },
      { h2: 'When to Get Fitted', body: '<p>Get fitted when you are committing to a set you will play for three or more years. A fitting dials in shaft flex, club length, lie angle, and grip size for your swing — changes that can add 5-10 yards and noticeably tighten dispersion. Brand-new beginners can start with a standard off-the-rack set; book the fitting once your swing settles and you know the game is sticking.</p>' },
      { h2: 'How Many Irons Should a High Handicapper Carry?', body: '<p>Carry six: 6-iron through pitching wedge, plus a gap wedge. Replace the 5-iron and anything longer with a 5-hybrid — most higher-handicap golfers cannot launch a long iron consistently, and a hybrid is far easier to hit off the deck. That frees up bag spots for the scoring clubs you actually use. Check your gapping after the switch with our <a href="/golf-club-distance-chart/">club distance chart</a>.</p>' },
`;

const NEW_FAQS =
`      { q: 'Are game-improvement irons worth it?', a: 'For anyone above a 10 handicap, yes. They turn mishits into playable shots and add 5-10 yards of consistency versus older or bladed irons. The forgiveness difference shows up where it counts — on the half of your shots that miss the center of the face.' },
      { q: 'How much should I spend on irons?', a: 'Current-generation game-improvement sets run about $699-899. Previous-gen models often drop to $500-600 and perform nearly as well — see our best irons under $500 guide. You do not need to spend over $1,000 until you are consistently breaking the mid-80s.' },
      { q: 'When should I upgrade from game-improvement irons?', a: 'When your handicap drops below 10 and you start wanting workability — the ability to shape shots and flight them down. Until then, game-improvement irons help far more than they hinder; switching to players irons too early just costs you greens.' },
      { q: 'Should I get steel or graphite shafts?', a: 'Graphite suits most recreational golfers: it is lighter, which adds a little swing speed and launch height, and it is easier on the joints. Steel gives more consistent feedback and is preferred by faster, more repeatable ball-strikers. In between, a lightweight steel shaft splits the difference.' },
      { q: 'What loft should a high handicapper use?', a: 'Favor the stronger, modern lofts built into game-improvement irons — a 30-33° 7-iron paired with a low center of gravity launches higher and carries farther than the weaker lofts on older sets. Chase height and carry, not the number stamped on the sole.' },
`;

// ── 1. transform the survivor object in place ────────────────────────────────
let so = articleOpen(src, SURVIVOR);
let sc = matchBrace(src, so);
let surv = src.slice(so, sc + 1);

// 1a. insert new product + advice sections before the "What Shaft Flex" section
const shaftIdx = surv.indexOf("h2: 'What Shaft Flex Do You Need?'");
if (shaftIdx < 0) throw new Error('shaft-flex section not found');
const shaftBrace = surv.lastIndexOf('{', shaftIdx);
surv = surv.slice(0, shaftBrace) + NEW_SECTIONS + '      ' + surv.slice(shaftBrace);

// 1b. insert new FAQs before the first existing FAQ
const faqIdx = surv.indexOf("q: 'What are the most forgiving golf irons in 2026?'");
if (faqIdx < 0) throw new Error('first faq not found');
const faqBrace = surv.lastIndexOf('{', faqIdx);
surv = surv.slice(0, faqBrace) + NEW_FAQS + '      ' + surv.slice(faqBrace);

// 1c. strip anchors that point at retired slugs (keep the inner text).
// Quote-agnostic: matches href="…", href='…', and the escaped \" / \' forms
// that appear inside double/single-quoted body strings.
for (const r of RETIRED) {
  surv = surv.replace(new RegExp(`<a [^>]*${r}[^>]*>([^<]*)</a>`, 'g'), '$1');
}
// 1d. remove retired related entries
for (const r of RETIRED) {
  surv = surv.replace(new RegExp(`\\s*\\{ slug: '${r}',[^}]*\\},`, 'g'), '');
}
// 1e. dateModified -> today (first dateModified in the survivor object)
surv = surv.replace(/dateModified:\s*'[0-9-]+'/, `dateModified: '${TODAY}'`);

src = src.slice(0, so) + surv + src.slice(sc + 1);

// ── 2. delete the 3 retired article objects ──────────────────────────────────
for (const r of RETIRED) {
  const o = articleOpen(src, r);
  const c = matchBrace(src, o);
  let end = c + 1;
  while (end < src.length && /\s/.test(src[end])) end++;
  if (src[end] === ',') end++; // consume trailing comma
  src = src.slice(0, o) + src.slice(end);
}

// ── 3. repoint every remaining retired reference at the survivor ──────────────
// 3a. related[] entries: repoint the slug AND relabel to the survivor's title
for (const r of RETIRED) {
  src = src.replace(new RegExp(`\\{ slug: '${r}', label: '[^']*' \\}`, 'g'),
    `{ slug: '${SURVIVOR}', label: 'Best Golf Irons 2026' }`);
}
// 3b. everything else (body hrefs, escaped or not) — swap the whole path.
// Each retired slug is a unique path, not a prefix of any surviving slug.
for (const r of RETIRED) {
  src = src.split(r).join(SURVIVOR);
}

// ── 4. dedupe survivor entries inside each related array (repoint can dup) ────
src = src.replace(/related: \[([\s\S]*?)\]/g, (m, inner) => {
  const seen = new Set<string>();
  const deduped = inner.replace(/\s*\{ slug: '([^']+)',[^}]*\},?/g, (entry: string, slug: string) => {
    if (seen.has(slug)) return '';
    seen.add(slug);
    return entry;
  });
  return `related: [${deduped}]`;
});

fs.writeFileSync(SRC, src);

// report
const remaining = RETIRED.map((r) => ({ r, n: src.split(r).length - 1 }));
console.log('✓ consolidation applied');
for (const x of remaining) console.log(`  remaining refs to ${x.r}: ${x.n}`);
