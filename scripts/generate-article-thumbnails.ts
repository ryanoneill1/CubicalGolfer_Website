/**
 * generate-article-thumbnails.ts — build-time card art for article thumbnails
 *
 * Added Aug 2026. Every article carries a `thumbnail`, and hub cards fall back to
 * a bare emoji when it is missing — which looked broken next to the real cards.
 * This generates the missing ones in the same house style as the compare
 * thumbnails: brand-green card, gold eyebrow, serif title, and the article's own
 * lead product photographed on a white plate.
 *
 * Idempotent: only writes a file that does not already exist, so hand-made
 * thumbnails are never overwritten.
 *
 * Manual run: npx tsx scripts/generate-article-thumbnails.ts
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'thumbnails');
const PUBLIC = path.join(process.cwd(), 'public');
const GREEN = '#1E3A28', GOLD = '#C9A227';
// Cream plate, not white: many product shots are white-on-white (golf balls,
// gloves) and vanished against a pure white background.
const W = 800, H = 520;
const PLATE = 250, PLATE_X = W - PLATE - 60, PLATE_Y = (H - PLATE) / 2 + 10, IMG_PAD = 22;

/**
 * Reference pages (wind / temperature / green speed) have no product to
 * photograph, so build() returned 'nokey' and the hub fell back to a bare emoji.
 *
 * They do not need a stock photo — they need the answer the page gives. Each
 * entry below is a headline figure lifted from that page's own first data table,
 * laid out in the same house style as the hand-made cards: short title top-left,
 * subtitle under it, one plate on the right.
 *
 * A first attempt plotted the full series as a line chart. It was dropped: every
 * one of these series is arithmetic, so all three cards rendered as the same 45°
 * diagonal and said nothing. A single number is honest, legible at 400x260, and
 * actually differs between pages.
 *
 * If the source table changes, change the figure here too.
 */
type ChartArt = { title: string; sub: string; stat: string; unit: string; caption: string };

const CHART_ART: Record<string, ChartArt> = {
  '/golf-green-speed-chart/': {
    title: 'Green Speed Chart', sub: 'What Stimp Does to Your Putt',
    // 20 ft putt rolls 16 ft at stimp 8 and 26 ft at stimp 13
    stat: '10', unit: 'ft', caption: 'SPREAD ON A 20 FT PUTT',
  },
  '/golf-distance-temperature-chart/': {
    title: 'Distance by Temperature', sub: 'What Cold Air Costs You',
    // driver carries 241 at 30°F, 253 at 90°F
    stat: '12', unit: 'yds', caption: 'DRIVER, 30°F TO 90°F',
  },
  '/golf-wind-adjustment-chart/': {
    title: 'Golf Wind Chart', sub: 'What to Add and Subtract',
    // 7-iron into a 25 mph headwind needs 175 to carry 150
    stat: '+25', unit: 'yds', caption: '7-IRON, 25 MPH HEADWIND',
  },
};

/** The stat plate: one figure, its unit, and what it measures. */
function statPlate(c: { stat: string; unit: string; caption: string }): string {
  const w = PLATE;
  return `
    <text x="${w / 2}" y="108" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
          font-size="64" font-weight="bold" fill="${GREEN}">${esc(c.stat)}</text>
    <text x="${w / 2}" y="140" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="20" fill="${GREEN}" opacity="0.75">${esc(c.unit)}</text>
    <line x1="52" y1="163" x2="${w - 52}" y2="163" stroke="${GOLD}" stroke-width="2"/>
    ${wrap(c.caption, 22).slice(0, 2).map((l, i) => `<text x="${w / 2}" y="${188 + i * 18}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"
          fill="#6A645A">${esc(l)}</text>`).join('')}`;
}

/**
 * Sixteen articles carry a hand-made `thumbnail` from before the product-plate
 * treatment existed. Those cards render as a green panel with an *empty* plate —
 * a title and a blank rectangle — because build() returns 'skip' the moment an
 * article declares `thumbnail`, so they were never rebuilt with art.
 *
 * Each entry re-points one of them at art chosen for that page's topic while
 * keeping its existing filename, so every `thumbnail` reference in articles.ts
 * keeps resolving and no path anywhere changes.
 *
 *   key    the product to photograph. Chosen deliberately, NOT the quick-answer
 *          default: /office-to-golf-course-playbook/ should show a putting mat,
 *          not the shoes its CTA happens to sell.
 *   chart  the stat plate instead, for the two pages that have no product at
 *          all. Both figures are the page's own, from its bottomLine.
 *   title  a short form, only where the real title overflows three lines and
 *          would be cut mid-sentence (or leads with an emoji, which does not
 *          render in an SVG <text> run).
 */
const FLAT_CARDS: Record<string, { file: string; key?: string; title?: string; chart?: ChartArt }> = {
  '/black-friday-golf-deals/':           { file: 'black-friday-deals-thumb.webp',     key: 'garmin-approach-r10' },
  '/prime-day-golf-deals/':              { file: 'prime-day-deals-thumb.webp',        key: 'garmin-approach-s12' },
  '/best-electric-golf-cart/':           { file: 'electric-golf-cart-thumb.webp',     key: 'ezgo-rxv-2' },
  '/best-golf-courses-weekend-drive/':   { file: 'courses-thumb.webp',                key: 'bushnell-tour-v7-shift' },
  '/golf-course-etiquette/':             { file: 'golf-etiquette-thumb.webp',         key: 'blue-tees-series-3-max' },
  '/golf-for-beginners/':                { file: 'golf-for-beginners-hub-thumb.webp', key: 'callaway-strata-ultimate-16', title: 'Golf for Beginners' },
  '/golf-tips-for-beginners/':           { file: 'tips-beginners-thumb.webp',         key: 'callaway-strata' },
  '/average-golf-handicap/':             { file: 'handicap-thumb.webp',               key: 'arccos-caddie-sensors', title: 'Average Golf Handicap' },
  '/how-far-average-golfer-hit-7-iron/': { file: 'how-far-7-iron-thumb.webp',         key: 'arccos-caddie-sensors' },
  '/why-do-i-hit-irons-fat/':            { file: 'hit-irons-fat-thumb.webp',          key: 'fiberbuilt-studio-mat', title: 'Why You Hit Irons Fat' },
  '/how-to-chip-in-golf/':               { file: 'how-to-chip-thumb.webp',            key: 'cleveland-rtx6-52', title: 'How to Chip in Golf' },
  '/how-to-stop-topping-the-ball/':      { file: 'stop-topping-thumb.webp',           key: 'alignment-sticks' },
  '/how-to-sneak-in-more-golf-rounds/':  { file: 'sneak-rounds-thumb.webp',           key: 'bag-boy-nitron' },
  '/office-to-golf-course-playbook/':    { file: 'office-golf-playbook-thumb.webp',   key: 'sklz-accelerator-putting-mat', title: 'Cubicle-to-Course Playbook' },
  // No product on either page. Figures taken from each page's own bottomLine:
  // "The USGA and R&A limit you to 14 clubs" / "your best 8 of your last 20 scores".
  '/how-many-clubs-in-a-golf-bag/': { file: 'clubs-in-bag-thumb.webp',
    chart: { title: 'How Many Clubs?', sub: 'The 14-Club Rule', stat: '14', unit: 'max', caption: 'CLUBS ALLOWED IN YOUR BAG' } },
  '/golf-handicap-explained/': { file: 'handicap-explained-thumb.webp',
    chart: { title: 'Handicap Explained', sub: 'How the Number Works', stat: '8', unit: 'of 20', caption: 'SCORES THAT SET YOUR INDEX' } },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Wrap a title into at most 3 lines that fit the left column. */
function wrap(title: string, max = 17): string[] {
  const words = title.split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

async function build(a: any): Promise<'made' | 'skip' | 'nokey'> {
  // Only articles that declare no thumbnail. Anything with a `thumbnail` field
  // already has art (often under a different filename), and generating a second
  // file would just litter public/ with images nothing references.
  const fix = FLAT_CARDS[a.slug];
  if (!fix && a.thumbnail) return 'skip';
  // Flatten nested slugs (/compare/x/ → compare-x) so no sub-directory is needed.
  const slug = a.slug.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const out = path.join(OUT_DIR, fix?.file ?? `${slug}-thumb.webp`);
  if (fs.existsSync(out)) return 'skip';

  // Lead product = an explicit FLAT_CARDS choice, else the article's own
  // quick-answer pick, else its first keyed section.
  const key = fix
    ? fix.key
    : (a.quickAnswerProduct
      || (a.sections ?? []).find((s: any) => s.affiliateKey)?.affiliateKey
      || (a.comparisonTable?.rows ?? []).find((r: any) => r.affiliateKey)?.affiliateKey);
  const prod: any = key ? (AFFILIATE as any)[key] : null;
  const chart = fix?.chart ?? CHART_ART[a.slug];
  if (!prod?.imgSrc && !chart) return 'nokey';

  let img: Buffer | null = null, meta: any = null;
  if (!chart) {
    const imgPath = path.join(PUBLIC, prod.imgSrc);
    if (!fs.existsSync(imgPath)) return 'nokey';
    img = await sharp(imgPath)
      .resize({ width: PLATE - IMG_PAD * 2, height: PLATE - IMG_PAD * 2, fit: 'inside' })
      .toBuffer();
    meta = await sharp(img).metadata();
  }

  // Chart pages use the hand-made card layout: short title top-left, subtitle
  // under it. Product cards keep the original vertically-centred treatment so
  // the 186 already generated stay reproducible.
  const lines = chart ? wrap(chart.title, 20) : wrap(fix?.title || a.titleDisplay || a.title);
  const startY = chart ? 150 : H / 2 - (lines.length - 1) * 26 - 6;
  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${GREEN}"/>
    <rect x="52" y="46" width="176" height="30" rx="4" fill="${GOLD}" opacity="0.92"/>
    <text x="140" y="67" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="15" font-weight="bold" letter-spacing="2" fill="${GREEN}">CUBICAL GOLFER</text>
    ${lines.map((l, i) => `<text x="52" y="${startY + i * 52}" font-family="Georgia, 'Times New Roman', serif"
          font-size="44" font-weight="bold" fill="#ffffff">${esc(l)}</text>`).join('')}
    <text x="52" y="${H - 44}" font-family="Helvetica, Arial, sans-serif" font-size="19"
          fill="${GOLD}">cubicalgolfer.com</text>
    ${chart ? `<text x="52" y="${startY + lines.length * 52 - 8}" font-family="Helvetica, Arial, sans-serif"
          font-size="21" fill="#ffffff" opacity="0.72">${esc(chart.sub)}</text>` : ''}
    <rect x="${PLATE_X}" y="${PLATE_Y}" width="${PLATE}" height="${PLATE}" rx="14" fill="#F2F1EC" stroke="#D8D5CC" stroke-width="2"/>
    ${chart ? `<g transform="translate(${PLATE_X},${PLATE_Y})">${statPlate(chart)}</g>` : ''}
  </svg>`;

  // Two passes on purpose: sharp applies resize BEFORE composite in a single
  // pipeline, which would shrink the canvas to 400px and drop the product image
  // placed at x=512. Composite at full 2x size, then downsample separately.
  const base = sharp(Buffer.from(svg));
  const card = await (img
    ? base.composite([{ input: img,
        left: Math.round(PLATE_X + (PLATE - (meta.width ?? 0)) / 2),
        top: Math.round(PLATE_Y + (PLATE - (meta.height ?? 0)) / 2) }])
    : base).png().toBuffer();
  await sharp(card).resize(400, 260).webp({ quality: 82 }).toFile(out);
  return 'made';
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let made = 0, skipped = 0; const nokey: string[] = [];
for (const a of ARTICLES as any[]) {
  const r = await build(a);
  if (r === 'made') { made++; console.log(`   ✎ ${a.slug.replace(/^\/|\/$/g, '')}-thumb.webp`); }
  else if (r === 'skip') skipped++;
  else nokey.push(a.slug);
}
if (nokey.length) {
  console.log(`⚠️  ${nokey.length} article(s) have no product image to build from:`);
  for (const s of nokey.slice(0, 8)) console.log('     ' + s);
}
console.log(`✅ Article thumbnails: ${made} generated, ${skipped} already existed.`);
