/**
 * generate-og-images.ts — build 1200x630 social cards for standalone pages.
 *
 * Added Aug 2026, Sprint 4.
 *
 * 42 pages shipped `og:image` pointing at the sitewide default, including
 * /golf-ball-compression-chart/ — roughly 60% of the impressions in the top 25.
 * Wherever that page was shared or surfaced with a thumbnail, it looked like
 * nothing in particular.
 *
 * These cards are generated from assets already in the repo: brand colours from
 * global.css and real product photography from public/images/products. Nothing is
 * invented and nothing is fetched.
 *
 * Type is DejaVu Serif — the only serif installed, and already what
 * generate-compare-thumbnails.ts renders, so these match the site's existing
 * generated art rather than introducing a second look. (DM Sans ships as woff2
 * only; librsvg needs a system font.)
 *
 * Idempotent: rewrites the same bytes for the same inputs. Safe to run every build.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const W = 1200, H = 630;
const GREEN = '#1E3A28', GREEN_MID = '#264D33', GOLD = '#C8A84B', CREAM = '#F4F1EA';
const OUT = 'public/images/og';
const SERIF = "DejaVu Serif, Georgia, 'Times New Roman', serif";

type Card = {
  file: string;          // written to public/images/og/<file>.jpg
  eyebrow: string;
  title: string[];       // one entry per line
  subtitle: string;
  products?: string[];   // product image basenames from public/images/products
};

const CARDS: Card[] = [
  { file: 'golf-ball-compression-chart', eyebrow: 'FREE PRINTABLE CHART',
    title: ['Golf Ball', 'Compression Chart'],
    subtitle: '34 balls matched to your swing speed',
    products: ['titleist-pro-v1','callaway-supersoft','srixon-soft-feel','taylormade-noodle','kirkland-signature'] },
  { file: 'golf-club-distance-chart', eyebrow: 'INTERACTIVE TOOL',
    title: ['Golf Club', 'Distance Chart'],
    subtitle: 'Enter your swing speed, see every club' },
  { file: 'golf-swing-speed-chart', eyebrow: 'REFERENCE CHART',
    title: ['Golf Swing', 'Speed Chart'],
    subtitle: 'Driver through wedge, by skill level' },
  { file: 'golf-handicap-calculator', eyebrow: 'FREE CALCULATOR',
    title: ['Golf Handicap', 'Calculator'],
    subtitle: 'Your index in about thirty seconds' },
  { file: 'club-distance-calculator', eyebrow: 'FREE CALCULATOR',
    title: ['Club Distance', 'Calculator'],
    subtitle: 'Build your personal distance chart' },
  { file: 'golf-ball-finder', eyebrow: 'FIND YOUR BALL',
    title: ['Golf Ball', 'Finder'],
    subtitle: 'Match a ball to your swing and budget',
    products: ['titleist-pro-v1','callaway-chrome-soft','srixon-q-star-tour','bridgestone-tour-b-rx'] },
  { file: 'launch-monitor-room-checker', eyebrow: 'WILL IT FIT?',
    title: ['Launch Monitor', 'Room Checker'],
    subtitle: 'Check your ceiling and depth before you buy' },
  { file: 'golf-simulator-cost-calculator', eyebrow: 'BUILD A BUDGET',
    title: ['Golf Simulator', 'Cost Calculator'],
    subtitle: 'Every component, priced honestly' },
  { file: 'golf-equipment-budget-planner', eyebrow: 'PLAN YOUR SPEND',
    title: ['Golf Equipment', 'Budget Planner'],
    subtitle: 'Where each dollar actually helps' },
  { file: 'gear-quiz', eyebrow: 'TWO MINUTE QUIZ',
    title: ['Which Golf Gear', 'Do You Need?'],
    subtitle: 'Answers based on your game, not the marketing' },
];

const esc = (t: string) => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

async function build(card: Card) {
  const art = (card.products ?? []).filter(p => existsSync(`public/images/products/${p}.webp`));
  // Text keeps the left column; product photography sits in its own right-hand
  // cluster so the two can never collide as titles change length.
  const COL = art.length ? 600 : W - 144;
  // SVG text neither wraps nor clips, so a long title will happily run under the
  // product cluster. Size the type to the column instead of hoping it fits.
  // 0.60em is a measured average advance for DejaVu Serif Bold.
  const longest = Math.max(...card.title.map(t => t.length));
  const TITLE = Math.max(40, Math.min(art.length ? 62 : 70, Math.floor((COL - 72) / (longest * 0.60))));
  const SUB = Math.max(22, Math.min(28, Math.floor((COL - 72) / (card.subtitle.length * 0.46))));

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${GREEN_MID}"/>
        <stop offset="100%" stop-color="${GREEN}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="${W}" height="10" fill="${GOLD}"/>
    <text x="72" y="150" font-family="${SERIF}" font-size="25" font-weight="bold"
          letter-spacing="4" fill="${GOLD}">${esc(card.eyebrow)}</text>
    ${card.title.map((line, i) =>
      `<text x="72" y="${250 + i * Math.round(TITLE * 1.16)}" font-family="${SERIF}" font-size="${TITLE}" font-weight="bold"
             fill="${CREAM}">${esc(line)}</text>`).join('\n    ')}
    <text x="72" y="${250 + (card.title.length - 1) * Math.round(TITLE * 1.16) + 74}" font-family="${SERIF}" font-size="${SUB}"
          fill="rgba(244,241,234,.78)">${esc(card.subtitle)}</text>
    <rect x="72" y="${H - 96}" width="72" height="5" fill="${GOLD}"/>
    <text x="72" y="${H - 50}" font-family="${SERIF}" font-size="29" font-weight="bold"
          fill="${GOLD}">CubicalGolfer.com</text>
  </svg>`;

  let img = sharp(Buffer.from(svg)).resize(W, H);

  if (art.length) {
    // Product shots are photographed on white. Masked to a circle they read as
    // objects on the green; left square they read as a mistake.
    const D = 150, GAP = 26, PER_ROW = 3;
    const mask = Buffer.from(
      `<svg width="${D}" height="${D}"><circle cx="${D/2}" cy="${D/2}" r="${D/2}" fill="#fff"/></svg>`);
    const rows = Math.ceil(art.length / PER_ROW);
    const blockH = rows * D + (rows - 1) * GAP;
    const top0 = Math.round((H - blockH) / 2) + 4;

    const plates = await Promise.all(art.map(async (p, i) => {
      const row = Math.floor(i / PER_ROW), col = i % PER_ROW;
      const inRow = Math.min(PER_ROW, art.length - row * PER_ROW);
      const rowW = inRow * D + (inRow - 1) * GAP;
      const left = Math.round(W - 72 - rowW + col * (D + GAP));
      const circle = await sharp(`public/images/products/${p}.webp`).flatten({ background: '#ffffff' })
        .resize(D, D, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .composite([{ input: mask, blend: 'dest-in' }])
        .png().toBuffer();
      return { input: circle, left, top: top0 + row * (D + GAP) };
    }));
    img = sharp(await img.png().toBuffer()).composite(plates);
  }

  mkdirSync(OUT, { recursive: true });
  await img.jpeg({ quality: 86, progressive: true }).toFile(join(OUT, `${card.file}.jpg`));
  return art.length;
}

const made: string[] = [];
for (const c of CARDS) {
  const n = await build(c);
  made.push(`${c.file}.jpg${n ? `  (+${n} product photos)` : ''}`);
}
console.log(`✅ og images: generated ${made.length} social cards at ${W}x${H}`);
for (const m of made) console.log('   ' + m);

/* ─────────────────────────────────────────────────────────────────────────────
 * ARTICLE CARDS
 *
 * 183 articles shipped og:image pointing at their 400x260 WebP article thumbnail.
 * That is below Facebook's 600x315 minimum and WebP is unreliable on LinkedIn, so
 * those pages have effectively been sharing with no image at all.
 *
 * These reuse the same layout as the tool cards above, with the article's own
 * product photography where it has any — so a driver guide shows drivers rather
 * than a generic template.
 * ──────────────────────────────────────────────────────────────────────────── */
const CATEGORY_LABEL: Record<string, string> = {
  'gear-reviews': 'GEAR REVIEWS',
  'improve-game': 'IMPROVE YOUR GAME',
  'golf-tech': 'GOLF TECH',
  'golf-accessories': 'ACCESSORIES',
  'golf-lifestyle': 'GOLF LIFESTYLE',
  'indoor-golf': 'INDOOR GOLF',
};

// Greedy wrap on an estimated advance width — SVG text does not wrap on its own,
// and an unwrapped title runs straight off the card or under the artwork.
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (!line) { line = w; continue; }
    if ((line + ' ' + w).length <= maxChars) line += ' ' + w;
    else { lines.push(line); line = w; if (lines.length === maxLines - 1) break; }
  }
  const rest = words.slice(lines.join(' ').split(/\s+/).filter(Boolean).length).join(' ');
  if (lines.length < maxLines && (line || rest)) lines.push(rest || line);
  return lines.slice(0, maxLines);
}

const { ARTICLES } = await import('../src/data/articles.ts');
const { AFFILIATE } = await import('../src/data/affiliate-links.ts');

// Card art must not be mistaken for product photography on a social card.
const CARD_ART = new Set(['taylormade-sim2-max.webp','cleveland-launcher-xl2-driver.webp',
  'titleist-gt2-driver.webp','club-car-onward.webp','ezgo-freedom-rxv.webp','cobra-ds-adapt-max-k.webp']);

let articleCards = 0, withArt = 0;
for (const a of ARTICLES as any[]) {
  const slugName = String(a.slug).replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const heading = String(a.titleDisplay || a.title || '').replace(/\s*[—–-]\s*\d{4}.*$/, '').trim();
  if (!heading) continue;

  const keys: string[] = [
    ...(a.sections ?? []).map((x: any) => x.affiliateKey),
    ...((a.comparisonTable?.rows ?? []).map((x: any) => x.affiliateKey)),
  ].filter(Boolean);
  const imgs: string[] = [];
  for (const k of keys) {
    const src = (AFFILIATE as any)[k]?.imgSrc as string | undefined;
    if (!src) continue;
    const file = src.split('/').pop()!;
    if (CARD_ART.has(file)) continue;
    const disk = 'public' + src;
    if (!existsSync(disk) || imgs.includes(disk)) continue;
    imgs.push(disk);
    if (imgs.length === 4) break;
  }

  const hasArt = imgs.length >= 2;   // one lone photo looks accidental
  const col = hasArt ? 600 : W - 144;
  const size = Math.max(40, Math.min(hasArt ? 58 : 66, Math.floor((col - 72) / (Math.max(...wrap(heading, hasArt ? 22 : 30, 3).map(l => l.length)) * 0.60))));
  const lines = wrap(heading, hasArt ? 22 : 30, 3);
  const eyebrow = CATEGORY_LABEL[a.category] ?? 'CUBICAL GOLFER';
  const top = Math.round((H - lines.length * size * 1.16) / 2) + size;

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GREEN_MID}"/><stop offset="100%" stop-color="${GREEN}"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="${W}" height="10" fill="${GOLD}"/>
    <text x="72" y="${top - 72}" font-family="${SERIF}" font-size="24" font-weight="bold"
          letter-spacing="4" fill="${GOLD}">${esc(eyebrow)}</text>
    ${lines.map((l, i) => `<text x="72" y="${top + i * Math.round(size * 1.16)}" font-family="${SERIF}"
          font-size="${size}" font-weight="bold" fill="${CREAM}">${esc(l)}</text>`).join('\n    ')}
    <rect x="72" y="${H - 96}" width="72" height="5" fill="${GOLD}"/>
    <text x="72" y="${H - 50}" font-family="${SERIF}" font-size="28" font-weight="bold"
          fill="${GOLD}">CubicalGolfer.com</text>
  </svg>`;

  let img = sharp(Buffer.from(svg)).resize(W, H);
  if (hasArt) {
    const D = 150, GAP = 26, PER_ROW = 2;
    const maskBuf = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D/2}" cy="${D/2}" r="${D/2}" fill="#fff"/></svg>`);
    const rows = Math.ceil(imgs.length / PER_ROW);
    const top0 = Math.round((H - (rows * D + (rows - 1) * GAP)) / 2);
    const plates = await Promise.all(imgs.map(async (src, i) => {
      const r = Math.floor(i / PER_ROW), c = i % PER_ROW;
      const inRow = Math.min(PER_ROW, imgs.length - r * PER_ROW);
      const rowW = inRow * D + (inRow - 1) * GAP;
      return {
        input: await sharp(src).flatten({ background: '#ffffff' })
          .resize(D, D, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
          .composite([{ input: maskBuf, blend: 'dest-in' }]).png().toBuffer(),
        left: Math.round(W - 72 - rowW + c * (D + GAP)),
        top: top0 + r * (D + GAP),
      };
    }));
    img = sharp(await img.png().toBuffer()).composite(plates);
    withArt++;
  }
  await img.jpeg({ quality: 82, progressive: true }).toFile(join(OUT, `${slugName}.jpg`));
  articleCards++;
}
console.log(`✅ og images: generated ${articleCards} article cards (${withArt} with product photography)`);
