/**
 * generate-compression-pdf.mjs
 * Builds public/downloads/golf-ball-compression-chart-2026.pdf at build time.
 * Uses the same ball data defined in the compression-chart page.
 *
 * Run: node scripts/generate-compression-pdf.mjs
 */

import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'fs';
import { dirname } from 'path';

/* ── Ball data (mirrors src/pages/golf-ball-compression-chart/index.astro) ── */
const balls = [
  { name: 'TaylorMade Noodle',      compression: 34,  cover: 'Ionomer',  price: 20, fit: 'Under 75 mph' },
  { name: 'Callaway Supersoft',      compression: 38,  cover: 'Ionomer',  price: 25, fit: 'Under 80 mph' },
  { name: 'Wilson DUO Soft+',        compression: 40,  cover: 'Ionomer',  price: 22, fit: 'Under 80 mph' },
  { name: 'Titleist TruFeel',        compression: 45,  cover: 'Ionomer',  price: 25, fit: '65–85 mph' },
  { name: 'TaylorMade Soft Response',compression: 50,  cover: 'Ionomer',  price: 25, fit: '70–85 mph' },
  { name: 'Bridgestone e12 Contact', compression: 50,  cover: 'Ionomer',  price: 28, fit: '70–90 mph' },
  { name: 'Vice Drive',              compression: 55,  cover: 'Ionomer',  price: 17, fit: '70–90 mph' },
  { name: 'Srixon Soft Feel',        compression: 60,  cover: 'Ionomer',  price: 27, fit: '75–95 mph' },
  { name: 'Vice Pro Soft',           compression: 65,  cover: 'Urethane', price: 28, fit: '80–95 mph' },
  { name: 'Titleist Tour Soft',      compression: 65,  cover: 'Ionomer',  price: 35, fit: '80–95 mph' },
  { name: 'Titleist Velocity',       compression: 65,  cover: 'Ionomer',  price: 30, fit: '85–110 mph' },
  { name: 'Callaway Warbird',        compression: 68,  cover: 'Ionomer',  price: 22, fit: '80–100 mph' },
  { name: 'Bridgestone Tour B RX',   compression: 68,  cover: 'Urethane', price: 45, fit: '85–100 mph' },
  { name: 'Wilson Chaos',            compression: 70,  cover: 'Ionomer',  price: 28, fit: '85–100 mph' },
  { name: 'Pinnacle Rush',           compression: 72,  cover: 'Ionomer',  price: 22, fit: '85–105 mph' },
  { name: 'Srixon Q-Star Tour',      compression: 72,  cover: 'Urethane', price: 35, fit: '85–100 mph' },
  { name: 'Callaway Chrome Soft',    compression: 75,  cover: 'Urethane', price: 40, fit: '88–105 mph' },
  { name: 'Kirkland Signature',      compression: 75,  cover: 'Urethane', price: 28, fit: '85–100 mph' },
  { name: 'Titleist AVX',            compression: 77,  cover: 'Urethane', price: 50, fit: '90–110 mph' },
  { name: 'TaylorMade Tour Response',compression: 77,  cover: 'Urethane', price: 35, fit: '88–105 mph' },
  { name: 'Titleist Tour Speed',     compression: 78,  cover: 'Urethane', price: 36, fit: '90–105 mph' },
  { name: 'Vice Pro',                compression: 80,  cover: 'Urethane', price: 33, fit: '90–110 mph' },
  { name: 'TaylorMade TP5',          compression: 85,  cover: 'Urethane', price: 50, fit: '95–115 mph' },
  { name: 'Titleist Pro V1',         compression: 87,  cover: 'Urethane', price: 55, fit: '90–115 mph' },
  { name: 'Wilson Staff Model',      compression: 87,  cover: 'Urethane', price: 35, fit: '95–115 mph' },
  { name: 'Srixon Z-Star',           compression: 88,  cover: 'Urethane', price: 40, fit: '90–115 mph' },
  { name: 'Callaway Chrome Tour',    compression: 90,  cover: 'Urethane', price: 58, fit: '95–120 mph' },
  { name: 'Bridgestone Tour B XS',   compression: 90,  cover: 'Urethane', price: 48, fit: '95–115 mph' },
  { name: 'Vice Pro Plus',           compression: 90,  cover: 'Urethane', price: 35, fit: '100–120 mph' },
  { name: 'Titleist Pro V1x',        compression: 97,  cover: 'Urethane', price: 55, fit: '100–130 mph' },
  { name: 'TaylorMade TP5x',         compression: 97,  cover: 'Urethane', price: 50, fit: '100–130 mph' },
  { name: 'Bridgestone Tour B X',    compression: 100, cover: 'Urethane', price: 48, fit: '100–130 mph' },
  { name: 'Maxfli Tour X',           compression: 100, cover: 'Urethane', price: 35, fit: '105–130 mph' },
  { name: 'Srixon Z-Star XV',        compression: 102, cover: 'Urethane', price: 40, fit: '105–130 mph' },
];

/* ── Layout constants ── */
const OUT = 'public/downloads/golf-ball-compression-chart-2026.pdf';
const MARGIN   = 50;
const COL_W    = [180, 80, 72, 72, 110]; // name, comp, cover, $/dz, swing speed
const HEADERS  = ['Golf Ball', 'Comp.', 'Cover', '$/Dz', 'Best Swing Speed'];
const ROW_H    = 18;
const GREEN    = '#1E3A28';
const GOLD     = '#C8A84B';
const CREAM    = '#FAF8F2';
const SITE_URL = 'www.cubicalgolfer.com';

mkdirSync(dirname(OUT), { recursive: true });

const doc = new PDFDocument({
  size: 'letter',
  margins: { top: 50, bottom: 60, left: MARGIN, right: MARGIN },
  info: {
    Title: 'Golf Ball Compression Chart 2026',
    Author: 'CubicalGolfer.com',
    Subject: '34 golf balls ranked by compression rating',
    Creator: 'CubicalGolfer.com',
  },
});
const stream = createWriteStream(OUT);
doc.pipe(stream);

/* ── Helper: draw one row of the table ── */
function drawRow(y, cells, opts = {}) {
  const { header = false, stripe = false } = opts;
  let x = MARGIN;

  if (header) {
    doc.save()
       .rect(MARGIN, y - 2, COL_W.reduce((a, b) => a + b, 0), ROW_H + 2)
       .fill(GREEN);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF');
  } else if (stripe) {
    doc.save()
       .rect(MARGIN, y - 2, COL_W.reduce((a, b) => a + b, 0), ROW_H)
       .fill(CREAM)
       .restore();
    doc.font('Helvetica').fontSize(8.5).fillColor('#333333');
  } else {
    doc.font('Helvetica').fontSize(8.5).fillColor('#333333');
  }

  cells.forEach((text, i) => {
    doc.text(String(text), x + 4, y, { width: COL_W[i] - 8, lineBreak: false });
    x += COL_W[i];
  });

  if (header) doc.restore();
}

/* ── Page footer ── */
function footer(pageNum, pageTotal) {
  doc.save()
     .font('Helvetica').fontSize(7).fillColor('#999999')
     .text(
       `${SITE_URL}  |  Page ${pageNum} of ${pageTotal}  |  Updated July 2026  |  Do not include affiliate links when sharing this PDF.`,
       MARGIN, doc.page.height - 40,
       { width: doc.page.width - MARGIN * 2, align: 'center' }
     )
     .restore();
}

/* ── Page 1: Header + table ── */
// Title bar
doc.save()
   .rect(0, 0, doc.page.width, 80)
   .fill(GREEN);
doc.font('Helvetica-Bold').fontSize(20).fillColor('#FFFFFF')
   .text('CubicalGolfer.com', MARGIN, 18);
doc.font('Helvetica').fontSize(12).fillColor(GOLD)
   .text('2026 Golf Ball Compression Chart', MARGIN, 44);
doc.restore();

// Intro text
doc.moveDown(2);
doc.y = 100;
doc.font('Helvetica').fontSize(9).fillColor('#333333')
   .text(
     'Match your driver swing speed to the right compression: under 85 mph use 30–65, 85–100 mph use 65–90, over 100 mph use 90+. ' +
     'Full reviews and buying links at ' + SITE_URL + '/golf-ball-compression-chart/',
     MARGIN, 100,
     { width: doc.page.width - MARGIN * 2 }
   );

// Table
let tableY = 135;
drawRow(tableY, HEADERS, { header: true });
tableY += ROW_H + 2;

const totalPages = 1; // single page fits 34 rows
balls.forEach((b, i) => {
  drawRow(tableY, [b.name, b.compression, b.cover, `$${b.price}`, b.fit], { stripe: i % 2 === 0 });
  tableY += ROW_H;
});

// Quick-reference box below table
tableY += 14;
doc.save()
   .roundedRect(MARGIN, tableY, doc.page.width - MARGIN * 2, 60, 6)
   .fill(CREAM);
doc.font('Helvetica-Bold').fontSize(9).fillColor(GREEN)
   .text('Quick Reference', MARGIN + 12, tableY + 8);
doc.font('Helvetica').fontSize(8).fillColor('#333333')
   .text('Under 85 mph  →  Compression 30–65 (Supersoft, Soft Feel, TruFeel)', MARGIN + 12, tableY + 22)
   .text('85–100 mph    →  Compression 65–90 (Chrome Soft, Q-Star Tour, Pro V1)', MARGIN + 12, tableY + 34)
   .text('Over 100 mph  →  Compression 90–102 (Pro V1x, TP5x, Z-Star XV)', MARGIN + 12, tableY + 46);
doc.restore();

footer(1, 1);

/* ── Finalize ── */
doc.end();
stream.on('finish', () => {
  console.log(`✅ PDF generated: ${OUT} (${balls.length} balls)`);
});
