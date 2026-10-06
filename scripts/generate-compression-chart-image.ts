#!/usr/bin/env node
/**
 * generate-compression-chart-image.ts — the picture Google can put in the
 * image pack, built from balls.ts so it can never disagree with the table.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * On 5 Oct 2026 the SERP for "golf ball compression chart 2026" — our single
 * biggest query, 37% of all site traffic — opened with an IMAGE PACK sitting
 * above every organic result. The three images came from Agape Golf, MyGolfSpy
 * and Cedarwood Golf. We were absent, because our chart is an HTML table and
 * Google had no picture to pull from the page.
 *
 * ── What the research said the slot needs ──────────────────────────────────
 *   · alt text is the #1 ranking factor, and must be specific
 *   · filename is a direct signal (Google Lens, since 2023)
 *   · the carousel prefers 16:9, minimum 1200px wide
 *   · under 100KB — mobile-first, instant load
 *   · caption and nearby headings teach Google what it shows
 *   · page authority first: we sit at position ~6, so we qualify
 *
 * ── The conflict, and the two-image answer ─────────────────────────────────
 * A readable 35-row table is portrait. The carousel wants 16:9. Trying to serve
 * both with one file gives you a 16:9 image of unreadable 8px type, which is
 * worse than nothing — people click it, can't read it, and bounce.
 *
 * So: two files.
 *   SUMMARY  1200x675, 16:9, <100KB — four compression bands with named balls,
 *            readable at thumbnail size. This is the carousel candidate.
 *   FULL     1200 wide, tall — every ball, for people who open the image.
 *
 * Both come from balls.ts. The Sprint 131 lesson: a hand-made copy of the data
 * drifts. The embed shipped TruFeel at 45 for months after we corrected it to
 * 70 because it was hand-written. Generated art cannot do that.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { balls } from '../src/data/balls.ts';

const OUT = path.join(process.cwd(), 'public', 'images', 'charts');
const GREEN = '#1E3A28', GREEN_CARD = '#2A5038', GOLD = '#C8A84B', CREAM = '#F5F3EE';
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS  = "Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Discontinued balls keep their row in the TABLE (reference data people still
// want) but must not appear in the hero image — a picture built to win a click
// should not lead with a ball you cannot buy.
const sorted = [...(balls as any[])]
  .filter(b => !b.discontinued)
  .sort((a, b) => a.compression - b.compression);
const ROSTER = (balls as any[]).length;

/**
 * Helvetica at a given size, measured crudely but conservatively. The first
 * render collided "TaylorMade Soft Response" into its own compression number
 * because I truncated by character count, and character count is not width.
 */
const widthOf = (t: string, px: number) => t.length * px * 0.52;
function fit(name: string, px: number, maxPx: number): string {
  if (widthOf(name, px) <= maxPx) return name;
  let t = name;
  while (t.length > 4 && widthOf(t + '\u2026', px) > maxPx) t = t.slice(0, -1);
  return t.trimEnd() + '\u2026';
}

/** The bands the page already teaches, so image and copy agree. */
const BANDS = [
  { label: 'ULTRA-SOFT', range: '34–50',  mph: 'Under 85 mph',  lo: 0,  hi: 50 },
  { label: 'SOFT-MID',   range: '55–74',  mph: '85–100 mph',    lo: 51, hi: 74 },
  { label: 'MID-FIRM',   range: '75–87',  mph: '90–110 mph',    lo: 75, hi: 87 },
  { label: 'FIRM-HIGH',  range: '88–102', mph: '100+ mph',      lo: 88, hi: 999 },
];

// ── 16:9 summary, built for the carousel ───────────────────────────────────
function summarySvg(): string {
  const W = 1200, H = 675;
  const colW = 276, gap = 16, x0 = 28, yTop = 196;
  const NAME_PX = 19, NUM_W = 44, PAD = 16;
  const nameMax = colW - PAD * 2 - NUM_W - 10;
  // Fill the canvas: a carousel thumbnail is tiny, so empty space is wasted
  // signal. Six rows at 56px takes the cards to y=624 under a 647 footer.
  const ROWS = 6, rowGap = 56, cardH = 96 + ROWS * rowGap - 16;
  const cols = BANDS.map((b, i) => {
    const inBand = sorted.filter(s => s.compression >= b.lo && s.compression <= b.hi);
    // Pick evenly across the band so the column reads as a range, not a corner.
    const pick: any[] = [];
    const step = Math.max(1, Math.floor(inBand.length / ROWS));
    for (let k = 0; k < inBand.length && pick.length < ROWS; k += step) pick.push(inBand[k]);
    const x = x0 + i * (colW + gap);
    const rows = pick.map((p, r) => `
      <text x="${x + PAD}" y="${yTop + 104 + r * rowGap}" font-family="${SANS}" font-size="${NAME_PX}" fill="#FFFFFF">${esc(fit(p.name, NAME_PX, nameMax))}</text>
      <text x="${x + colW - PAD}" y="${yTop + 104 + r * rowGap}" text-anchor="end" font-family="${SANS}" font-size="${NAME_PX}" font-weight="700" fill="${GOLD}">${p.compression}</text>`).join('');
    return `
      <rect x="${x}" y="${yTop}" width="${colW}" height="${cardH}" rx="12" fill="${GREEN_CARD}"/>
      <text x="${x + 18}" y="${yTop + 34}" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">${b.label}</text>
      <text x="${x + 18}" y="${yTop + 68}" font-family="${SERIF}" font-size="30" font-weight="700" fill="#FFFFFF">${b.range}</text>
      <text x="${x + colW - 18}" y="${yTop + 68}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#CFE0D4">${b.mph}</text>
      ${rows}`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="0" y="0" width="${W}" height="8" fill="${GOLD}"/>
    <text x="${x0}" y="78" font-family="${SANS}" font-size="17" letter-spacing="3" font-weight="700" fill="${GOLD}">GOLF BALL COMPRESSION CHART 2026</text>
    <text x="${x0}" y="132" font-family="${SERIF}" font-size="46" font-weight="700" fill="#FFFFFF">Match your swing speed to the right ball</text>
    <text x="${x0}" y="168" font-family="${SANS}" font-size="20" fill="#CFE0D4">All ${ROSTER} balls we track, grouped by compression · every figure sourced</text>
    ${cols}
    <text x="${x0}" y="${H - 28}" font-family="${SANS}" font-size="19" font-weight="700" fill="${GOLD}">CubicalGolfer.com</text>
    <text x="${W - x0}" y="${H - 28}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#9FB6A6">Full sortable chart + free printable PDF</text>
  </svg>`;
}

// ── Tall full chart, every ball ─────────────────────────────────────────────
function fullSvg(): string {
  const W = 1200, rowH = 44, headH = 188, padB = 70;
  const H = headH + sorted.length * rowH + padB;
  const rows = sorted.map((b, i) => {
    const y = headH + i * rowH;
    const band = i % 2 === 0 ? 'rgba(255,255,255,0.045)' : 'transparent';
    return `
      <rect x="28" y="${y}" width="${W - 56}" height="${rowH}" fill="${band}"/>
      <text x="48"  y="${y + 29}" font-family="${SANS}" font-size="21" fill="#FFFFFF">${esc(b.name)}</text>
      <text x="700" y="${y + 29}" text-anchor="end" font-family="${SANS}" font-size="21" font-weight="700" fill="${GOLD}">${b.compression}</text>
      <text x="880" y="${y + 29}" text-anchor="end" font-family="${SANS}" font-size="19" fill="#CFE0D4">${esc(b.cover)}</text>
      <text x="1000" y="${y + 29}" text-anchor="end" font-family="${SANS}" font-size="19" fill="#CFE0D4">~$${b.price}</text>
      <text x="${W - 48}" y="${y + 29}" text-anchor="end" font-family="${SANS}" font-size="19" fill="#CFE0D4">${b.minMph}-${b.maxMph} mph</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="0" y="0" width="${W}" height="8" fill="${GOLD}"/>
    <text x="28" y="74" font-family="${SANS}" font-size="17" letter-spacing="3" font-weight="700" fill="${GOLD}">GOLF BALL COMPRESSION CHART 2026</text>
    <text x="28" y="126" font-family="${SERIF}" font-size="44" font-weight="700" fill="#FFFFFF">All ${ROSTER} balls, softest to firmest</text>
    <text x="48"  y="170" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">GOLF BALL</text>
    <text x="700" y="170" text-anchor="end" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">COMPRESSION</text>
    <text x="880" y="170" text-anchor="end" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">COVER</text>
    <text x="1000" y="170" text-anchor="end" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">PRICE/DZ</text>
    <text x="${W - 48}" y="170" text-anchor="end" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">BEST FOR</text>
    ${rows}
    <text x="28" y="${H - 26}" font-family="${SANS}" font-size="19" font-weight="700" fill="${GOLD}">CubicalGolfer.com</text>
    <text x="${W - 28}" y="${H - 26}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#9FB6A6">Every figure sourced · free printable PDF</text>
  </svg>`;
}

fs.mkdirSync(OUT, { recursive: true });

/** The carousel wants <100KB. Step quality down until it fits rather than hope. */
async function writeUnder(svg: string, file: string, limitKB: number | null) {
  const buf = Buffer.from(svg);
  let q = 88, out: Buffer = await sharp(buf).webp({ quality: q }).toBuffer();
  if (limitKB) {
    while (out.length > limitKB * 1024 && q > 40) {
      q -= 8;
      out = await sharp(buf).webp({ quality: q }).toBuffer();
    }
  }
  fs.writeFileSync(path.join(OUT, file), out);
  const meta = await sharp(out).metadata();
  const kb = (out.length / 1024).toFixed(1);
  const warn = limitKB && out.length > limitKB * 1024 ? `  ⚠️ OVER ${limitKB}KB` : '';
  console.log(`   ${file}  ${meta.width}x${meta.height}  ${kb}KB  q${q}${warn}`);
  return out.length;
}

console.log('Compression chart images:');
const sumBytes = await writeUnder(summarySvg(), 'golf-ball-compression-chart-2026.webp', 100);
await writeUnder(fullSvg(), 'golf-ball-compression-chart-2026-full.webp', null);

if (sumBytes > 100 * 1024) {
  console.error('\n❌ The 16:9 summary is over 100KB even at q40. The carousel wants it smaller.\n');
  process.exit(1);
}
console.log(`✅ Built from balls.ts (${ROSTER} balls) — cannot drift from the table.`);
