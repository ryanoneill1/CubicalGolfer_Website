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

/* ── Ball data ─────────────────────────────────────────────────────────────
 * Imported, never copied. This file used to carry its own hardcoded array and
 * it drifted: after Sprint 94 corrected 17 prices against live listings, this
 * PDF — the site's highest-CTR asset at 25.54% — was still serving Wilson Chaos
 * at $28 (really about $12), Titleist Velocity at $30 (really $25) and Vice Pro
 * at $33 (really $39). Readers downloaded a file that contradicted the page it
 * came from. Import from one place so that cannot happen again.
 * ------------------------------------------------------------------------- */
import { balls as SHARED } from '../src/data/balls.ts';

const balls = SHARED
  .slice()
  .sort((a, b) => a.compression - b.compression)
  .map(b => ({
    name: b.name,
    compression: b.compression,
    cover: b.cover,
    price: b.price,
    // the page shows a range; the PDF has always shown a single "fit" string
    fit: b.minMph === 0 ? `Under ${b.maxMph} mph` : `${b.minMph}\u2013${b.maxMph} mph`,
  }));

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
  bufferPages: true, // required: footers are drawn per-page after layout
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
  // Writing below the bottom margin makes pdfkit auto-append pages;
  // zero it for this page while the footer is drawn.
  doc.page.margins.bottom = 0;
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

const PAGE_BOTTOM = doc.page.height - 60; // stay above bottom margin
balls.forEach((b, i) => {
  if (tableY + ROW_H > PAGE_BOTTOM) {
    doc.addPage();
    tableY = 60;
    drawRow(tableY, HEADERS, { header: true });
    tableY += ROW_H + 2;
  }
  drawRow(tableY, [b.name, b.compression, b.cover, `$${b.price}`, b.fit], { stripe: i % 2 === 0 });
  tableY += ROW_H;
});

// Quick-reference box below table
tableY += 14;
if (tableY + 60 > PAGE_BOTTOM) { doc.addPage(); tableY = 60; }
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

// Footers on every page with real page numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  footer(i + 1, range.count);
}

/* ── Finalize ── */
doc.end();
stream.on('finish', () => {
  console.log(`✅ PDF generated: ${OUT} (${balls.length} balls)`);
});
