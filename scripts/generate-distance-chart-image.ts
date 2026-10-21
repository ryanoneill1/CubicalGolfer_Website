#!/usr/bin/env node
/**
 * generate-distance-chart-image.ts — the picture Google can put in the image
 * pack for "golf club distance chart", built from club-distances.ts so it can
 * never disagree with the table on the page.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Read live on 19-20 Oct 2026, the SERP for "golf club distance chart" opens
 * with an IMAGE PACK above every organic result. The three images came from
 * Club Up Golf, Instagram and Golf Sidekick. We were absent, because our chart
 * is an HTML table and Google had no picture to pull off the page. Below it an
 * AI Overview prints a full distance table, so the text answer is already
 * given away — the picture is one of the few slots left to win.
 *
 * This is Sprint 135 applied a second time. That sprint did exactly this for
 * /golf-ball-compression-chart/ and the result, checked on 20 Oct 2026, is
 * Google Images positions 1 AND 2, both ours, marked "Licensable", above
 * MyGolfSpy, Agape Golf and Cedarwood Golf — the three sites that held the
 * pack before. The recipe is copied here deliberately rather than reinvented.
 *
 * ── What the slot needs ────────────────────────────────────────────────────
 *   · alt text is the #1 ranking factor, and must be specific
 *   · filename is a direct signal
 *   · the carousel prefers 16:9, minimum 1200px wide
 *   · under 100KB
 *   · caption and nearby headings teach Google what it shows
 *
 * ── Two images, because one cannot be both ─────────────────────────────────
 * 13 clubs x 5 speed bands is a readable table, but at 16:9 the rows fall to
 * ~33px and the type with them. A carousel thumbnail is tiny; type that cannot
 * be read at thumbnail size earns the click and then loses it to a bounce. So:
 *
 *   SUMMARY  1200x675, 16:9, <100KB — 8 clubs people actually search for,
 *            across all five speed bands, at 25px. The carousel candidate.
 *   FULL     1200 wide, tall — all 13 clubs, carry and total, for the person
 *            who opens the image.
 *
 * Both derive from CLUBS and TIERS. The Sprint 131 lesson: a hand-made copy of
 * the data drifts, and the hand-written compression embed shipped TruFeel at 45
 * for months after the table said 70. Generated art cannot do that.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { CLUBS, TIERS } from '../src/data/club-distances.ts';

const OUT = path.join(process.cwd(), 'public', 'images', 'charts');
const GREEN = '#1E3A28', GREEN_CARD = '#2A5038', GOLD = '#C8A84B';
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The page's own model: driver carry = mph * 2.44 - 6, every other club a ratio of it. */
const driverCarry = (mph: number) => Math.round(mph * 2.44 - 6);
const carryFor = (mph: number, ratio: number) => Math.round(driverCarry(mph) * ratio);

/* The eight clubs that carry the searches — driver and 7-iron above all — kept
 * in bag order. The full image below has all 13; this one has to stay legible
 * at carousel size, and 13 rows in 435px of canvas does not. */
const HERO_CLUBS = ['Driver', '3-Wood', '4-Hybrid', '5-Iron', '7-Iron', '9-Iron', 'PW', 'SW (56°)'];
const heroRows = HERO_CLUBS.map(name => {
  const found = CLUBS.find(c => c[0] === name);
  if (!found) {
    // Fail loudly rather than silently drawing a shorter chart. A renamed club
    // in club-distances.ts must break the build, not quietly vanish from the
    // picture that represents the page.
    console.error(`\n❌ generate-distance-chart-image: "${name}" is not in CLUBS.`);
    console.error('   club-distances.ts was renamed or reordered. Update HERO_CLUBS.\n');
    process.exit(1);
  }
  return found as [string, number, number, string];
});

// ── 16:9 summary, built for the carousel ───────────────────────────────────
function summarySvg(): string {
  const W = 1200, H = 675;
  const yTop = 196, footer = 56;
  const xName = 56;
  // Five speed columns, spread evenly rather than bunched to the right. The
  // first render left ~260px of dead canvas on the right of the last column.
  const colX = TIERS.map((_, i) => 420 + i * 166);

  /* The rule under the column headers is the TOP of the row block, not a line
   * drawn at an arbitrary offset. The first render computed row positions from
   * yTop independently of where the rule sat, and the rule ended up slicing
   * straight through the Driver row and its stripe. Deriving both from
   * rowsTop makes that impossible. */
  const ruleY = yTop + 72;
  const rowsTop = ruleY + 12;
  const rowH = Math.floor((H - footer - rowsTop) / heroRows.length);

  const header = TIERS.map((t, i) =>
    `<text x="${colX[i]}" y="${yTop + 34}" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="700" fill="${GOLD}">${t}</text>
     <text x="${colX[i]}" y="${yTop + 58}" text-anchor="middle" font-family="${SANS}" font-size="15" letter-spacing="1" fill="#9FB6A6">MPH</text>`
  ).join('');

  const rows = heroRows.map(([name, ratio], r) => {
    const top = rowsTop + r * rowH;
    const base = top + Math.round(rowH * 0.68);
    const stripe = r % 2 === 0
      ? `<rect x="28" y="${top}" width="${W - 56}" height="${rowH}" rx="6" fill="rgba(255,255,255,0.05)"/>` : '';
    const cells = TIERS.map((t, i) =>
      `<text x="${colX[i]}" y="${base}" text-anchor="middle" font-family="${SANS}" font-size="25" font-weight="700" fill="#FFFFFF">${carryFor(t, ratio)}</text>`
    ).join('');
    return `${stripe}
      <text x="${xName}" y="${base}" font-family="${SANS}" font-size="25" fill="#CFE0D4">${esc(name)}</text>
      ${cells}`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="0" y="0" width="${W}" height="8" fill="${GOLD}"/>
    <text x="${xName}" y="78" font-family="${SANS}" font-size="17" letter-spacing="3" font-weight="700" fill="${GOLD}">GOLF CLUB DISTANCE CHART 2026</text>
    <text x="${xName}" y="132" font-family="${SERIF}" font-size="46" font-weight="700" fill="#FFFFFF">Carry distance by driver swing speed</text>
    <text x="${xName}" y="168" font-family="${SANS}" font-size="20" fill="#CFE0D4">Yards of carry · all ${CLUBS.length} clubs in the full chart · free printable PDF</text>
    <line x1="28" y1="${ruleY}" x2="${W - 28}" y2="${ruleY}" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
    ${header}
    ${rows}
    <text x="${xName}" y="${H - 24}" font-family="${SANS}" font-size="19" font-weight="700" fill="${GOLD}">CubicalGolfer.com</text>
    <text x="${W - xName}" y="${H - 24}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#9FB6A6">Enter your own speed for a personal chart</text>
  </svg>`;
}

// ── Tall full chart, every club, carry and total ───────────────────────────
function fullSvg(): string {
  /* headH was 206 and the subtitle at y=166 ran straight into the column
   * header row. The five speed columns also started at 410 with 168 spacing,
   * which put the 115 MPH column and its numbers on top of the ROLL column on
   * the right. Both only showed up by rendering the file and looking at it. */
  const W = 1200, rowH = 46, headH = 240, padB = 72;
  const H = headH + CLUBS.length * rowH + padB;
  const xName = 48;
  const colX = TIERS.map((_, i) => 380 + i * 155);

  const header = TIERS.map((t, i) =>
    `<text x="${colX[i]}" y="${headH - 30}" text-anchor="middle" font-family="${SANS}" font-size="20" font-weight="700" fill="${GOLD}">${t} MPH</text>`
  ).join('');

  const rows = CLUBS.map(([name, ratio, roll], i) => {
    const y = headH + i * rowH;
    const stripe = i % 2 === 0 ? 'rgba(255,255,255,0.045)' : 'transparent';
    const cells = TIERS.map((t, k) =>
      `<text x="${colX[k]}" y="${y + 31}" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" fill="#FFFFFF">${carryFor(t, ratio)}</text>`
    ).join('');
    return `
      <rect x="28" y="${y}" width="${W - 56}" height="${rowH}" fill="${stripe}"/>
      <text x="${xName}" y="${y + 31}" font-family="${SANS}" font-size="22" fill="#CFE0D4">${esc(name)}</text>
      ${cells}
      <text x="${W - xName}" y="${y + 31}" text-anchor="end" font-family="${SANS}" font-size="20" fill="#9FB6A6">+${roll}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="0" y="0" width="${W}" height="8" fill="${GOLD}"/>
    <text x="${xName}" y="74" font-family="${SANS}" font-size="17" letter-spacing="3" font-weight="700" fill="${GOLD}">GOLF CLUB DISTANCE CHART 2026</text>
    <text x="${xName}" y="126" font-family="${SERIF}" font-size="44" font-weight="700" fill="#FFFFFF">All ${CLUBS.length} clubs, driver through lob wedge</text>
    <text x="${xName}" y="166" font-family="${SANS}" font-size="19" fill="#CFE0D4">Carry in yards at each driver swing speed · typical roll shown on the right</text>
    <text x="${xName}" y="${headH - 30}" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">CLUB</text>
    ${header}
    <text x="${W - xName}" y="${headH - 30}" text-anchor="end" font-family="${SANS}" font-size="15" letter-spacing="2" font-weight="700" fill="${GOLD}">ROLL (YD)</text>
    ${rows}
    <text x="${xName}" y="${H - 26}" font-family="${SANS}" font-size="19" font-weight="700" fill="${GOLD}">CubicalGolfer.com</text>
    <text x="${W - xName}" y="${H - 26}" text-anchor="end" font-family="${SANS}" font-size="17" fill="#9FB6A6">Interactive chart + free printable PDF</text>
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
  console.log(`   ${file}  ${meta.width}x${meta.height}  ${(out.length / 1024).toFixed(1)}KB  q${q}`);
  return out.length;
}

console.log('Club distance chart images:');
const sumBytes = await writeUnder(summarySvg(), 'golf-club-distance-chart-2026.webp', 100);
await writeUnder(fullSvg(), 'golf-club-distance-chart-2026-full.webp', null);

if (sumBytes > 100 * 1024) {
  console.error('\n❌ The 16:9 summary is over 100KB even at q40. The carousel wants it smaller.\n');
  process.exit(1);
}
console.log(`✅ Built from club-distances.ts (${CLUBS.length} clubs x ${TIERS.length} speeds) — cannot drift from the table.`);
