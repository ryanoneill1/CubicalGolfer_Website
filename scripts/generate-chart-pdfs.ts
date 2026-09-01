#!/usr/bin/env node
/**
 * generate-chart-pdfs.ts — downloadable PDFs for the reference charts.
 *
 * ── Why ────────────────────────────────────────────────────────────────────
 * The two highest-CTR queries on this site are the compression chart (18–24%)
 * and its downloadable PDF (25.54% at position 3.34). Every other informational
 * query we rank for is being absorbed by an AI Overview — Google answers in the
 * SERP and the click never happens. A PDF is the one asset an AI Overview cannot
 * summarise away: the reader has to come here for the file.
 *
 * So the wind, temperature and green-speed charts get the same treatment.
 *
 * ── How ────────────────────────────────────────────────────────────────────
 * It reads the LIVE article data and extracts the HTML tables already on each
 * page. Nothing is retyped. The compression PDF used to keep its own hardcoded
 * copy and drifted badly from the page it came from — that is the mistake this
 * design exists to avoid.
 */
import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'fs';
import { ARTICLES } from '../src/data/articles.ts';

const GREEN = '#1E3A28';
const GOLD  = '#C8A84B';
const CREAM = '#FAF8F2';
const SITE  = 'www.cubicalgolfer.com';
const MARGIN = 45;

interface Spec { slug: string; out: string; title: string; subject: string; }

const CHARTS: Spec[] = [
  { slug: '/golf-wind-adjustment-chart/',      out: 'golf-wind-adjustment-chart.pdf',
    title: 'Golf Wind Adjustment Chart',       subject: 'How far to add, subtract and aim off in wind' },
  { slug: '/golf-distance-temperature-chart/', out: 'golf-distance-temperature-chart.pdf',
    title: 'Golf Distance by Temperature Chart', subject: 'How air temperature changes carry distance' },
  { slug: '/golf-green-speed-chart/',          out: 'golf-green-speed-chart.pdf',
    title: 'Golf Green Speed Chart',           subject: 'Stimpmeter readings and what they mean' },
];

/** Pull <table> blocks out of an article's section bodies, as rows of cells. */
function tablesFrom(article: any): Array<{ heading: string; rows: string[][] }> {
  const out: Array<{ heading: string; rows: string[][] }> = [];
  for (const s of article.sections ?? []) {
    const body = String(s.body ?? '');
    for (const tbl of body.match(/<table[\s\S]*?<\/table>/g) ?? []) {
      const rows: string[][] = [];
      for (const tr of tbl.match(/<tr[\s\S]*?<\/tr>/g) ?? []) {
        const cells = [...(tr.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g) ?? [])]
          .map(c => c.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
                     .replace(/\s+/g, ' ').trim());
        if (cells.length) rows.push(cells);
      }
      if (rows.length > 1) out.push({ heading: String(s.h2 ?? '').replace(/<[^>]+>/g, '').trim(), rows });
    }
  }
  return out;
}

let built = 0;
mkdirSync('public/downloads', { recursive: true });

for (const spec of CHARTS) {
  const article = (ARTICLES as any[]).find(a => a.slug === spec.slug);
  if (!article) { console.error(`  skipped ${spec.slug} — no such article`); continue; }

  const tables = tablesFrom(article);
  if (!tables.length) { console.error(`  skipped ${spec.slug} — no tables found in its sections`); continue; }

  const doc = new PDFDocument({
    size: 'letter', bufferPages: true,
    margins: { top: 50, bottom: 60, left: MARGIN, right: MARGIN },
    info: { Title: `${spec.title} 2026`, Author: 'CubicalGolfer.com', Subject: spec.subject, Creator: 'CubicalGolfer.com' },
  });
  doc.pipe(createWriteStream(`public/downloads/${spec.out}`));

  // masthead
  doc.rect(0, 0, doc.page.width, 76).fill(GREEN);
  doc.font('Helvetica-Bold').fontSize(20).fillColor('#FFFFFF').text(spec.title, MARGIN, 24);
  doc.font('Helvetica').fontSize(9).fillColor(GOLD).text(spec.subject, MARGIN, 50);
  doc.y = 96;

  for (const { heading, rows } of tables) {
    if (doc.y > doc.page.height - 150) doc.addPage();
    if (heading) {
      doc.font('Helvetica-Bold').fontSize(12).fillColor(GREEN).text(heading, MARGIN, doc.y);
      doc.moveDown(0.35);
    }
    const cols = Math.max(...rows.map(r => r.length));
    const usable = doc.page.width - MARGIN * 2;
    const w = usable / cols;

    rows.forEach((cells, ri) => {
      if (doc.y > doc.page.height - 90) doc.addPage();
      const y = doc.y;
      if (ri === 0) {
        doc.save().rect(MARGIN, y - 2, usable, 17).fill(GREEN);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
      } else {
        if (ri % 2 === 0) doc.save().rect(MARGIN, y - 2, usable, 16).fill(CREAM).restore();
        doc.font('Helvetica').fontSize(8.5).fillColor('#333333');
      }
      cells.forEach((c, i) => doc.text(c, MARGIN + i * w + 4, y, { width: w - 8, lineBreak: false }));
      if (ri === 0) doc.restore();
      doc.y = y + (ri === 0 ? 17 : 16);
    });
    doc.moveDown(1.1);
  }

  // footers
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(8).fillColor('#777777')
       .text(`${SITE}  ·  ${spec.title}  ·  page ${i + 1} of ${range.count}`,
             MARGIN, doc.page.height - 40, { width: doc.page.width - MARGIN * 2, align: 'center' });
  }

  doc.end();
  const rowCount = tables.reduce((n, t) => n + t.rows.length - 1, 0);
  console.log(`✅ ${spec.out} — ${tables.length} table(s), ${rowCount} rows`);
  built++;
}

if (!built) { console.error('\n❌ No chart PDFs were produced.\n'); process.exit(1); }
