/**
 * report-price-drift.ts — REPORT ONLY, never fails the build, never edits.
 *
 * Added 2026-08. The audit's root cause F: prices are written into prose as
 * free text, so a product's registry price and the number a reader sees in a
 * sentence drift apart. Auto-rewriting prose by proximity is unsafe — it
 * silently repriced neighbouring products in testing — so this only reports.
 *
 * Run: npx tsx scripts/report-price-drift.ts
 * Output: docs/price-drift.md — a review list, ordered by blast radius.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const num = (p?: string) => { const m = p?.match(/\$\s*([\d,]+)/); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
const PRODUCTS = Object.entries(AFFILIATE as any)
  .map(([key, v]: any) => ({ key, name: (v.imgAlt || key.replace(/-/g, ' ')), price: v.price, n: num(v.price) }))
  .filter(p => p.n !== null && !/\/(dz|dozen|mo|month|yr|year)/i.test(p.price));

type Hit = { key: string; registry: string; found: string; page: string; quote: string };
const hits: Hit[] = [];

for (const a of ARTICLES as any[]) {
  const text = JSON.stringify({ intro: a.intro, bottomLine: a.bottomLine, sections: a.sections, faq: a.faq });
  for (const p of PRODUCTS) {
    // Only look at products this page actually references by affiliate key.
    const referenced = (a.sections ?? []).some((s: any) => s.affiliateKey === p.key)
      || (a.comparisonTable?.rows ?? []).some((r: any) => r.affiliateKey === p.key);
    if (!referenced) continue;
    const short = p.name.replace(/ (Golf )?(Rangefinder|Launch Monitor|Driver|Sensors?|GPS).*$/i, '').trim();
    if (short.length < 6) continue;
    const rx = new RegExp(`${short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^.$]{0,90}?\\$([\\d,]+)`, 'gi');
    for (const m of text.matchAll(rx)) {
      const found = parseFloat(m[1].replace(/,/g, ''));
      if (found !== p.n && found > 20) {
        hits.push({ key: p.key, registry: p.price, found: `$${m[1]}`, page: a.slug,
                    quote: m[0].replace(/\\n/g, ' ').slice(0, 130) });
      }
    }
  }
}

const byKey = new Map<string, Hit[]>();
for (const h of hits) { if (!byKey.has(h.key)) byKey.set(h.key, []); byKey.get(h.key)!.push(h); }
const sorted = [...byKey.entries()].sort((a, b) => b[1].length - a[1].length);

let md = `# Prose price drift — review list\n\nGenerated ${new Date().toISOString().slice(0, 10)}. `;
md += `Each entry is a sentence whose dollar figure differs from that product's registry price in \`src/data/affiliate-links.ts\`.\n\n`;
md += `This is a **report, not a fix**. Prose sits next to other products' prices, so automated rewriting is unsafe — edit these by hand.\n\n`;
md += `**${hits.length} mentions across ${byKey.size} products.**\n\n`;
for (const [key, list] of sorted) {
  md += `## \`${key}\` — registry says ${list[0].registry} · ${list.length} prose mention(s) disagree\n\n`;
  for (const h of list.slice(0, 12)) md += `- **${h.found}** on \`${h.page}\` — …${h.quote}…\n`;
  if (list.length > 12) md += `- …and ${list.length - 12} more\n`;
  md += `\n`;
}
fs.mkdirSync(path.join(process.cwd(), 'docs'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'docs', 'price-drift.md'), md);
console.log(`📄 Price drift report: ${hits.length} prose mentions across ${byKey.size} products → docs/price-drift.md`);
