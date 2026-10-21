#!/usr/bin/env node
/**
 * generate-handicap-chart-image.ts — the picture for the image block on
 * "average golf handicap by age", built by READING the table that is already
 * on the page so the two can never disagree.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Read live on 20 Oct 2026, the SERP for "average golf handicap by age" opens
 * with an AI Overview that states "14.2 for men and 27.5 for women" — the exact
 * figures in our own meta description — and credits Scoring Zone, who also
 * holds rank 1 with a title nearly identical to ours. The text answer is gone.
 *
 * There IS an image block on that SERP, lower down the page, currently holding
 * MyGolfSpy's "STUDY: Overall Golfer Performance By Age" and one other chart.
 * It sits below the AI Overview rather than above everything, so this is a
 * smaller prize than the distance chart's pack — worth taking, worth being
 * honest that it is second-order.
 *
 * ── Where the numbers come from ────────────────────────────────────────────
 * Unlike the compression and distance charts, the handicap-by-age figures have
 * no data module — they live in an HTML table inside the article's section
 * body. Copying them into this file would be exactly the drift Sprint 131 was
 * written about, so instead this parses that table out of the record.
 *
 * If the parse fails or returns anything other than six age bands, the build
 * STOPS. That is deliberate: a silent fallback would draw a chart that no
 * longer matches the page, which is the failure mode the whole generated-art
 * approach exists to prevent. Rewording the table is allowed; rewording it
 * without noticing the image depends on it is not.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from '../src/data/articles.ts';

const OUT = path.join(process.cwd(), 'public', 'images', 'charts');
const GREEN = '#1E3A28', GREEN_CARD = '#2A5038', GOLD = '#C8A84B';
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const die = (msg: string) => {
  console.error(`\n❌ generate-handicap-chart-image: ${msg}`);
  console.error('   The age-band table in the /average-golf-handicap/ record is the');
  console.error('   source for this image. Fix the table or this parser — do not let');
  console.error('   the picture and the page drift apart.\n');
  process.exit(1);
};

const article = (ARTICLES as any[]).find(a => a.slug === '/average-golf-handicap/');
if (!article) die('no article with slug /average-golf-handicap/');

const section = (article.sections ?? []).find((s: any) =>
  typeof s.body === 'string' && s.body.includes("<table class='cmp-table'>") && s.body.includes('Age Group'));
if (!section) die('could not find the age-group table section');

const tbody = section.body.match(/<tbody>([\s\S]*?)<\/tbody>/);
if (!tbody) die('the age-group section has no <tbody>');

type Band = { age: string; men: string; women: string };
const bands: Band[] = [...tbody[1].matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
  .map(m => ({ age: m[1].trim(), men: m[2].trim(), women: m[3].trim() }));

if (bands.length !== 6) die(`expected 6 age bands, parsed ${bands.length}`);
for (const b of bands) {
  if (!/^[\d.]+$/.test(b.men) || !/^[\d.]+$/.test(b.women)) {
    die(`band "${b.age}" has non-numeric values (men="${b.men}", women="${b.women}")`);
  }
}

// ── 16:9, built for the image block ────────────────────────────────────────
function chartSvg(): string {
  const W = 1200, H = 675;
  const xAge = 70, xMen = 620, xWomen = 940;
  const headY = 250, footer = 58;
  const rowH = Math.floor((H - footer - headY) / bands.length);

  const rows = bands.map((b, i) => {
    const top = headY + i * rowH;
    const base = top + Math.round(rowH * 0.70);
    const stripe = i % 2 === 0
      ? `<rect x="36" y="${top}" width="${W - 72}" height="${rowH}" rx="8" fill="rgba(255,255,255,0.05)"/>` : '';
    return `${stripe}
      <text x="${xAge}" y="${base}" font-family="${SANS}" font-size="30" fill="#FFFFFF">${esc(b.age)}</text>
      <text x="${xMen}" y="${base}" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="700" fill="${GOLD}">${esc(b.men)}</text>
      <text x="${xWomen}" y="${base}" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="700" fill="#FFFFFF">${esc(b.women)}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="0" y="0" width="${W}" height="8" fill="${GOLD}"/>
    <text x="${xAge}" y="78" font-family="${SANS}" font-size="17" letter-spacing="3" font-weight="700" fill="${GOLD}">AVERAGE GOLF HANDICAP BY AGE · 2026</text>
    <text x="${xAge}" y="134" font-family="${SERIF}" font-size="46" font-weight="700" fill="#FFFFFF">Where your index sits by age group</text>
    <text x="${xAge}" y="174" font-family="${SANS}" font-size="20" fill="#CFE0D4">USGA handicap index · ${bands.length} age bands, men and women</text>
    <line x1="36" y1="${headY - 46}" x2="${W - 36}" y2="${headY - 46}" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
    <text x="${xAge}" y="${headY - 14}" font-family="${SANS}" font-size="16" letter-spacing="2" font-weight="700" fill="${GOLD}">AGE GROUP</text>
    <text x="${xMen}" y="${headY - 14}" text-anchor="middle" font-family="${SANS}" font-size="16" letter-spacing="2" font-weight="700" fill="${GOLD}">MEN</text>
    <text x="${xWomen}" y="${headY - 14}" text-anchor="middle" font-family="${SANS}" font-size="16" letter-spacing="2" font-weight="700" fill="${GOLD}">WOMEN</text>
    ${rows}
    <text x="${xAge}" y="${H - 24}" font-family="${SANS}" font-size="19" font-weight="700" fill="${GOLD}">CubicalGolfer.com</text>
    <text x="${W - xAge}" y="${H - 24}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#9FB6A6">Free calculator · see where you rank</text>
  </svg>`;
}

fs.mkdirSync(OUT, { recursive: true });

async function writeUnder(svg: string, file: string, limitKB: number) {
  const buf = Buffer.from(svg);
  let q = 88, out: Buffer = await sharp(buf).webp({ quality: q }).toBuffer();
  while (out.length > limitKB * 1024 && q > 40) {
    q -= 8;
    out = await sharp(buf).webp({ quality: q }).toBuffer();
  }
  fs.writeFileSync(path.join(OUT, file), out);
  const meta = await sharp(out).metadata();
  console.log(`   ${file}  ${meta.width}x${meta.height}  ${(out.length / 1024).toFixed(1)}KB  q${q}`);
  return out.length;
}

console.log('Handicap-by-age chart image:');
const bytes = await writeUnder(chartSvg(), 'average-golf-handicap-by-age-2026.webp', 100);
if (bytes > 100 * 1024) {
  console.error('\n❌ The chart is over 100KB even at q40.\n');
  process.exit(1);
}
console.log(`✅ Parsed ${bands.length} age bands from the page's own table — cannot drift from it.`);
