#!/usr/bin/env node
// scripts/rewrite-meta.ts
// Rewrites title + description (and, for the compression chart, the H1) for the
// 16 underperforming pages. Edits are spliced into the raw source by exact,
// delimiter-aware matching of the current field value, so nothing else changes.
import * as fs from 'fs';
import { ARTICLES } from '../src/data/articles';

const ART = 'src/data/articles.ts';
const CLUB = 'src/pages/golf-club-distance-chart/index.astro';
const COMP = 'src/pages/golf-ball-compression-chart/index.astro';
const A = ARTICLES as any[];

// Task 4 — the compression chart is rendered by a STANDALONE page whose own
// title/description/H1 override the articles.ts entry, so the SEO-visible fix
// lives here. Title + H1 cover both "golf ball compression chart" and the
// "…2026" variant; the description surfaces the PDF (the "…pdf" query converts
// at 19.85%).
const COMP_TITLE_NEW = 'Golf Ball Compression Chart 2026 — 34 Balls + PDF';
const COMP_DESC_NEW = 'Compression ratings for 34 golf balls — Pro V1, Supersoft, Noodle — matched to your swing speed. Grab the free printable PDF chart to take to the shop.';
const COMP_H1_OLD = 'Golf Ball Compression Chart — Find the Right Ball for Your Swing Speed';
const COMP_H1_NEW = 'Golf Ball Compression Chart 2026 — Match Any Ball to Your Swing Speed';

// slug -> { title, desc, h1? }.  h1 only for the compression chart (Task 4).
const REWRITES: Record<string, { title: string; desc: string; h1?: string }> = {
  '/golf-ball-compression-chart/': {
    title: 'Golf Ball Compression Chart 2026 — 34 Balls + PDF',
    desc: 'Compression ratings for 34 golf balls — Pro V1, Supersoft, Noodle — matched to your swing speed. Grab the free printable PDF chart to take to the shop.',
  },
  '/average-golf-handicap/': {
    title: 'Average Golf Handicap by Age & Gender — USGA Data',
    desc: 'The average golf handicap is 14.2 for men and 27.5 for women. See the full breakdown by age from your 20s to 70+, from USGA data — where do you land?',
  },
  '/best-budget-putters-under-150/': {
    title: 'Best Putters Under $150 — 4 Ranked, $40 to $129',
    desc: 'The best putter under $150 is the $129 Cleveland Huntington Beach Soft. Four models ranked from the $40 Pinemeadow up — tour-level feel with no $300 markup.',
  },
  '/best-golf-bags-walking-2026/': {
    title: 'Best Golf Bags for Walking 2026 — 3 Stand Bags',
    desc: 'The best walking golf bag is the 2.8-lb Sun Mountain 2.5+ at $230. Ping Hoofer Lite and Titleist Players 4 compared on weight, straps, and storage.',
  },
  '/best-golf-drivers-forgiveness/': {
    title: 'Most Forgiving Drivers 2026 — 8 Models Compared',
    desc: 'The most forgiving driver for 2026 is the Callaway Paradym Ai Smoke Max. Eight high-MOI heads compared for mishits — Ping G430 Max, Qi35 Max, Cobra Aerojet.',
  },
  '/best-golf-putters-2026/': {
    title: 'Best Golf Putters 2026 — 12 Blades & Mallets',
    desc: 'The best putter for 2026 is the Odyssey White Hot OG. Twelve blades, mallets, and mid-mallets ranked by feel and forgiveness — matched to your putting stroke.',
  },
  '/best-budget-launch-monitor/': {
    title: 'Best Budget Launch Monitor 2026 — 4 Under $700',
    desc: 'The best budget launch monitor is the $599 Garmin Approach R10. Four picks under $700 — Rapsodo MLM2PRO, FlightScope Mevo — ranked on real-world accuracy.',
  },
  '/golf-club-distance-chart/': {
    title: 'Golf Club Distance Chart — Carry by Swing Speed',
    desc: 'Golf club distance chart for all 13 clubs, driver through wedge, across swing speeds of 75–115 mph. Enter your speed for a carry-distance table built for you.',
  },
  '/best-golf-balls-2026/': {
    title: 'Best Golf Balls 2026 — 9 Balls by Swing Speed',
    desc: 'The best golf ball for 2026 depends on speed: Pro V1 above 90 mph, Supersoft below. Nine balls from $25 to $58 ranked by handicap and speed — find yours.',
  },
  '/best-launch-monitors-no-subscription/': {
    title: 'Best Launch Monitors, No Subscription — 4 Compared',
    desc: 'Four launch monitors with zero monthly fees, from the $199 Shot Scope LM1 to the $1,299 Mevo Gen2. Full data you own — no subscription, no locked features.',
  },
  '/best-golf-drivers-under-200/': {
    title: 'Best Drivers Under $200 — 3 That Beat the Price',
    desc: 'The best driver under $200 is the $179 Callaway Big Bertha B21 for slicers. Three sub-$200 heads — SIM Max, Cleveland Launcher XL — that still deliver.',
  },
  '/best-electric-golf-push-cart/': {
    title: 'Best Electric Golf Push Cart 2026 — Volt to Remote',
    desc: 'The best-value electric golf push cart is the $899 Bag Boy Volt; the MGI Zip Navigator adds remote control at $1,699. Compared on battery, hills, and range.',
  },
  '/best-golf-push-carts-2026/': {
    title: 'Best Golf Push Carts 2026 — 4 From $152 to $289',
    desc: 'The best-value golf push cart is the 13.6-lb KVV 3-Wheel at $152; the Bag Boy Nitron wins features at $229. Four carts compared on weight and folding.',
  },
  '/best-golf-irons-2026/': {
    title: 'Best Golf Irons 2026 — 8 Sets by Handicap',
    desc: 'The best irons for 2026 by handicap: Ping G430 and Titleist T300 for forgiveness, Cobra Aerojet for value. Eight sets from $599 to $1,199 compared.',
  },
  '/best-irons-under-500/': {
    title: 'Best Irons Under $500 — 3 Complete Sets (2026)',
    desc: 'The best iron set under $500 is the Cleveland Launcher XL2, often $499 on sale. Three forgiving sets — plus prev-gen Ping and Callaway deals under $500.',
  },
  '/best-golf-launch-monitors-2026/': {
    title: 'Best Golf Launch Monitors 2026 — 6, $499 to $2,995',
    desc: 'The best launch monitor for 2026 is the $749 Rapsodo MLM2PRO. Six units from the $499 SC4 Pro to the $2,995 SkyTrak+ ranked on accuracy and spin data.',
  },
};

// delimiter-aware value replacement inside a source string
const baseEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
const encoders: Record<string, (s: string) => string> = {
  single: (s) => baseEsc(s).replace(/'/g, "\\'"),
  double: (s) => baseEsc(s).replace(/"/g, '\\"'),
  backtick: (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'),
};
const delimStyle: Record<string, string> = { "'": 'single', '"': 'double', '`': 'backtick' };

function replaceField(src: string, field: string, oldVal: string, newVal: string): string {
  // Try each encoding of `field: <delim>oldVal<delim>`; the actual delimiter is
  // read from the char before the value so the new value is escaped to match.
  for (const style of ['single', 'double', 'backtick']) {
    const enc = encoders[style](oldVal);
    for (const d of ["'", '"', '`']) {
      const needle = `${field}: ${d}${enc}${d}`;
      if (src.split(needle).length - 1 === 1) {
        const st = delimStyle[d];
        const repl = `${field}: ${d}${encoders[st](newVal)}${d}`;
        return src.replace(needle, repl);
      }
    }
  }
  throw new Error(`could not uniquely locate ${field} = ${JSON.stringify(oldVal).slice(0, 60)}`);
}

let src = fs.readFileSync(ART, 'utf8');
let club = fs.readFileSync(CLUB, 'utf8');
const rows: any[] = [];

for (const [slug, rw] of Object.entries(REWRITES)) {
  if (slug === '/golf-club-distance-chart/') {
    // standalone page: meta.title / meta.description
    const m = club.match(/title:\s*(['"`])(.*?)\1/);
    const dm = club.match(/description:\s*(['"`])(.*?)\1/);
    const oldT = m![2], oldD = dm![2];
    club = replaceField(club, 'title', oldT, rw.title);
    club = replaceField(club, 'description', oldD, rw.desc);
    rows.push({ slug, file: 'golf-club-distance-chart/index.astro', oldT, newT: rw.title, oldD, newD: rw.desc });
    continue;
  }
  const a = A.find((x) => x.slug === slug);
  if (!a) throw new Error(`no article ${slug}`);
  const oldT = a.title, oldD = a.description;
  src = replaceField(src, 'title', oldT, rw.title);
  src = replaceField(src, 'description', oldD, rw.desc);
  const row: any = { slug, file: 'articles.ts', oldT, newT: rw.title, oldD, newD: rw.desc };
  if (rw.h1) { src = replaceField(src, 'titleDisplay', a.titleDisplay, rw.h1); row.oldH1 = a.titleDisplay; row.newH1 = rw.h1; }
  rows.push(row);
}

// ── Task 4: standalone compression-chart page (title, PDF description, H1) ──
let comp = fs.readFileSync(COMP, 'utf8');
const cT = comp.match(/title:\s*(['"`])(.*?)\1/);
const cD = comp.match(/description:\s*(['"`])(.*?)\1/);
const compOldT = cT![2], compOldD = cD![2];
comp = replaceField(comp, 'title', compOldT, COMP_TITLE_NEW);
comp = replaceField(comp, 'description', compOldD, COMP_DESC_NEW);
if (comp.split(`<h1>${COMP_H1_OLD}</h1>`).length - 1 !== 1) throw new Error('compression H1 not found uniquely');
comp = comp.replace(`<h1>${COMP_H1_OLD}</h1>`, `<h1>${COMP_H1_NEW}</h1>`);
fs.writeFileSync(COMP, comp);
rows.push({ slug: '/golf-ball-compression-chart/ (rendered page)', file: 'golf-ball-compression-chart/index.astro', oldT: compOldT, newT: COMP_TITLE_NEW, oldD: compOldD, newD: COMP_DESC_NEW, oldH1: COMP_H1_OLD, newH1: COMP_H1_NEW });

fs.writeFileSync(ART, src);
fs.writeFileSync(CLUB, club);
fs.writeFileSync('/tmp/meta-rows.json', JSON.stringify(rows, null, 1));

// report + range checks
let bad = 0;
for (const r of rows) {
  const tl = r.newT.length, dl = r.newD.length;
  const tf = tl < 60 ? 'ok' : 'LONG';
  const df = dl >= 140 && dl <= 158 ? 'ok' : 'RANGE';
  if (tf !== 'ok' || df !== 'ok') bad++;
  console.log(`${tf === 'ok' && df === 'ok' ? ' ' : '!'} T${tl}/${tf} D${dl}/${df}  ${r.slug}`);
}
console.log(bad ? `\n${bad} field(s) OUT OF RANGE` : '\nAll titles <60 and descriptions 140–158.');
