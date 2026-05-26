#!/usr/bin/env node
// scripts/audit-indexing.ts
// ─────────────────────────────────────────────────────────────────────────────
// Reports indexing health across the site. Reads the canonical URL list from
// articles.ts, comparisons.ts, and src/pages/, cross-references against a GSC
// "not indexed" export, and produces a priority-ranked CSV for manual
// "Request Indexing" submissions.
//
// Usage:  npx tsx scripts/audit-indexing.ts
// Input:  scripts/data/not-indexed.csv  (optional — GSC export, cols: URL,Last crawled)
// Output: scripts/output/indexing-priority.csv
//         stdout summary report
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const SITE = 'https://www.cubicalgolfer.com';
const A = ARTICLES as any[];
const C = COMPARISONS as any[];

// ── 1. Build the canonical URL list ─────────────────────────────────────────

interface PageInfo {
  url: string;
  slug: string;
  source: 'articles' | 'comparisons' | 'standalone';
  category: string;
  wordCount: number;
  dateModified: string;
  hasAffiliate: boolean;
  inboundLinks: number;
  outboundLinks: number;
  priority: number;
}

const allPages: Map<string, PageInfo> = new Map();

// Articles
for (const a of A) {
  const slug = a.slug.replace(/^\/|\/$/g, '');
  const sections = a.sections || [];
  const faq = a.faq || [];

  // Word count: sum body text from sections + FAQ answers
  let wc = 0;
  for (const s of sections) {
    const body = typeof s.body === 'string' ? s.body : '';
    wc += body.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  }
  for (const f of faq) {
    wc += (f.a || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  }
  // Add bottomLine, excerpt
  if (a.bottomLine) wc += a.bottomLine.split(/\s+/).length;
  if (a.excerpt) wc += a.excerpt.split(/\s+/).length;

  allPages.set(`/${slug}/`, {
    url: `${SITE}/${slug}/`,
    slug: `/${slug}/`,
    source: 'articles',
    category: a.category || 'unknown',
    wordCount: wc,
    dateModified: a.dateModified || a.datePublished || '2026-01-01',
    hasAffiliate: sections.some((s: any) => s.affiliateKey),
    inboundLinks: 0,
    outboundLinks: 0,
    priority: 0,
  });
}

// Comparisons
for (const c of C) {
  const slug = `compare/${c.slug}`;
  const sections = c.sections || [];
  const faq = c.faq || [];

  let wc = 0;
  for (const s of sections) {
    const body = typeof s.body === 'string' ? s.body : '';
    wc += body.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  }
  for (const f of faq) wc += (f.a || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  if (c.intro) wc += c.intro.replace(/<[^>]+>/g, '').split(/\s+/).length;
  if (c.weekendGolfer) wc += c.weekendGolfer.replace(/<[^>]+>/g, '').split(/\s+/).length;
  if (c.winnerReason) wc += c.winnerReason.replace(/<[^>]+>/g, '').split(/\s+/).length;

  allPages.set(`/${slug}/`, {
    url: `${SITE}/${slug}/`,
    slug: `/${slug}/`,
    source: 'comparisons',
    category: 'comparison',
    wordCount: wc,
    dateModified: c.dateModified || '2026-01-01',
    hasAffiliate: true,
    inboundLinks: 0,
    outboundLinks: 0,
    priority: 0,
  });
}

// Standalone pages (walk src/pages/ for .astro files with their own routes)
const standalonePages = [
  { slug: '/', category: 'homepage' },
  { slug: '/golf-ball-compression-chart/', category: 'improve-game' },
  { slug: '/golf-club-distance-chart/', category: 'improve-game' },
  { slug: '/golf-simulator-cost-calculator/', category: 'golf-tech' },
  { slug: '/golf-equipment-budget-planner/', category: 'gear-reviews' },
  { slug: '/golf-handicap-calculator/', category: 'tools' },
  { slug: '/golf-swing-speed-chart/', category: 'tools' },
  { slug: '/gear-reviews/', category: 'hub' },
  { slug: '/golf-tech/', category: 'hub' },
  { slug: '/improve-your-golf-game/', category: 'hub' },
  { slug: '/compare/', category: 'hub' },
  { slug: '/tools/', category: 'hub' },
  { slug: '/about/', category: 'meta' },
  { slug: '/how-we-test/', category: 'meta' },
  { slug: '/gear-quiz/', category: 'meta' },
];

for (const sp of standalonePages) {
  if (!allPages.has(sp.slug)) {
    allPages.set(sp.slug, {
      url: `${SITE}${sp.slug}`,
      slug: sp.slug,
      source: 'standalone',
      category: sp.category,
      wordCount: 0, // can't easily count without building
      dateModified: '2026-05-25',
      hasAffiliate: false,
      inboundLinks: 0,
      outboundLinks: 0,
      priority: 0,
    });
  }
}

console.log(`📊 Total pages in site: ${allPages.size}`);

// ── 2. Count internal links (IN and OUT) ────────────────────────────────────

// Read all .ts and .astro source files for link scanning
const sourceFiles: { path: string; content: string }[] = [];

function walkDir(dir: string, ext: string[]) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
      walkDir(fullPath, ext);
    } else if (entry.isFile() && ext.some(e => entry.name.endsWith(e))) {
      try {
        sourceFiles.push({ path: fullPath, content: fs.readFileSync(fullPath, 'utf8') });
      } catch {}
    }
  }
}

walkDir('src', ['.ts', '.astro']);

// For each page, count how many source files reference its slug
const slugList = Array.from(allPages.keys());

for (const [slug, page] of allPages) {
  // Inbound: how many OTHER source files contain a link to this slug
  const cleanSlug = slug.replace(/\/$/, '').replace(/^\//, '');
  let inbound = 0;
  for (const sf of sourceFiles) {
    // Don't count self-references
    if (sf.path.includes(cleanSlug.replace(/\//g, '/'))) continue;
    // Check for href="<slug>" or slug: '<slug>' patterns
    if (sf.content.includes(`href="/${cleanSlug}/"`) ||
        sf.content.includes(`href="/${cleanSlug}"`) ||
        sf.content.includes(`slug: '/${cleanSlug}/'`) ||
        sf.content.includes(`'/${cleanSlug}/'`)) {
      inbound++;
    }
  }
  page.inboundLinks = inbound;

  // Outbound: for articles/comparisons, count href="/..." in body content
  if (page.source === 'articles') {
    const art = A.find(a => a.slug === slug);
    if (art) {
      const allBody = (art.sections || []).map((s: any) => s.body || '').join(' ');
      const escapedMatches = allBody.match(/href=\\\"\/[^"\\]+\\\"/g) || [];
      const unescapedMatches = allBody.match(/href="\/[^"]+"/g) || [];
      const singleQuoteMatches = allBody.match(/href='\/[^']+'/g) || [];
      page.outboundLinks = escapedMatches.length + unescapedMatches.length + singleQuoteMatches.length;
    }
  } else if (page.source === 'comparisons') {
    const comp = C.find(c => `/compare/${c.slug}/` === slug);
    if (comp) {
      const allBody = (comp.sections || []).map((s: any) => s.body || '').join(' ') + (comp.intro || '') + (comp.weekendGolfer || '');
      const escapedMatches = allBody.match(/href=\\\"\/[^"\\]+\\\"/g) || [];
      const unescapedMatches = allBody.match(/href="\/[^"]+"/g) || [];
      const singleQuoteMatches = allBody.match(/href='\/[^']+'/g) || [];
      page.outboundLinks = escapedMatches.length + unescapedMatches.length + singleQuoteMatches.length;
    }
  }
}

// ── 3. Read not-indexed CSV (if exists) ─────────────────────────────────────

const NOT_INDEXED_PATH = 'scripts/data/not-indexed.csv';
let notIndexedSlugs: Set<string> = new Set();

if (fs.existsSync(NOT_INDEXED_PATH)) {
  const csv = fs.readFileSync(NOT_INDEXED_PATH, 'utf8');
  for (const line of csv.split('\n').slice(1)) { // skip header
    if (!line.trim()) continue;
    const url = line.split(',')[0].trim().replace(/"/g, '');
    const slug = url.replace(SITE, '').replace(/\/$/, '/');
    if (slug && slug !== '/') notIndexedSlugs.add(slug);
  }
  console.log(`📋 Not-indexed URLs from GSC: ${notIndexedSlugs.size}`);
} else {
  // No CSV — treat ALL non-hub, non-meta pages as potentially not-indexed
  // and generate the full audit anyway
  console.log(`⚠️  No ${NOT_INDEXED_PATH} found — auditing all pages`);
  for (const [slug, page] of allPages) {
    if (page.category !== 'hub' && page.category !== 'meta' && page.category !== 'homepage') {
      notIndexedSlugs.add(slug);
    }
  }
}

// ── 4. Calculate priority scores ────────────────────────────────────────────

for (const [slug, page] of allPages) {
  let score = 0;

  // Word count: 0-3 points (higher = better)
  if (page.wordCount >= 2000) score += 3;
  else if (page.wordCount >= 1200) score += 2;
  else if (page.wordCount >= 500) score += 1;

  // Inbound links: 0-3 points
  if (page.inboundLinks >= 5) score += 3;
  else if (page.inboundLinks >= 3) score += 2;
  else if (page.inboundLinks >= 1) score += 1;

  // Recency: 0-2 points
  const mod = new Date(page.dateModified);
  const now = new Date('2026-05-25');
  const daysSince = (now.getTime() - mod.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 7) score += 2;
  else if (daysSince <= 30) score += 1;

  // Has affiliate content: +1 (commercial intent = higher priority for revenue)
  if (page.hasAffiliate) score += 1;

  // Outbound links: +1 if has any (signals well-connected page)
  if (page.outboundLinks >= 2) score += 1;

  page.priority = Math.min(10, score);
}

// ── 5. Generate output CSV ──────────────────────────────────────────────────

const csvRows: string[] = ['URL,Slug,Source,Category,Words,Inbound Links,Outbound Links,Date Modified,Has Affiliate,Priority Score'];

const notIndexedPages = Array.from(notIndexedSlugs)
  .map(slug => allPages.get(slug))
  .filter(Boolean)
  .sort((a, b) => b!.priority - a!.priority) as PageInfo[];

for (const page of notIndexedPages) {
  csvRows.push([
    page.url,
    page.slug,
    page.source,
    page.category,
    page.wordCount,
    page.inboundLinks,
    page.outboundLinks,
    page.dateModified,
    page.hasAffiliate ? 'yes' : 'no',
    page.priority,
  ].join(','));
}

fs.mkdirSync('scripts/output', { recursive: true });
fs.writeFileSync('scripts/output/indexing-priority.csv', csvRows.join('\n'));
console.log(`\n✅ Wrote scripts/output/indexing-priority.csv (${notIndexedPages.length} rows)`);

// ── 6. Summary report ───────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(70));
console.log('  INDEXING HEALTH AUDIT REPORT');
console.log('═'.repeat(70));

// Count by category
const catCounts: Record<string, number> = {};
for (const p of notIndexedPages) {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
}
console.log('\n📂 Not-indexed pages by category:');
for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${cat.padEnd(20)} ${count}`);
}

// Average word count: not-indexed vs all
const niAvgWords = notIndexedPages.length
  ? Math.round(notIndexedPages.reduce((s, p) => s + p.wordCount, 0) / notIndexedPages.length)
  : 0;
const allAvgWords = Math.round(
  Array.from(allPages.values())
    .filter(p => p.wordCount > 0)
    .reduce((s, p) => s + p.wordCount, 0) /
  Array.from(allPages.values()).filter(p => p.wordCount > 0).length
);
console.log(`\n📊 Average word count:`);
console.log(`   Not-indexed pages:  ${niAvgWords} words`);
console.log(`   All pages:          ${allAvgWords} words`);

// Orphan pages (zero inbound links)
const orphans = notIndexedPages.filter(p => p.inboundLinks === 0);
if (orphans.length > 0) {
  console.log(`\n🔗 Orphan pages (0 inbound internal links): ${orphans.length}`);
  for (const o of orphans.slice(0, 15)) {
    console.log(`   ${o.slug} (${o.wordCount}w)`);
  }
  if (orphans.length > 15) console.log(`   ... and ${orphans.length - 15} more`);
} else {
  console.log(`\n🔗 No orphan pages — all pages have at least 1 inbound link ✅`);
}

// Top 10 priority pages for GSC submission
console.log(`\n🎯 TOP 10 PAGES TO REQUEST INDEXING:`);
console.log('   (Submit these via GSC URL Inspection → Request Indexing)');
for (const p of notIndexedPages.slice(0, 10)) {
  console.log(`   [${p.priority}/10] ${p.slug} — ${p.wordCount}w, ${p.inboundLinks} inbound, ${p.category}`);
}

// Pages with thin content that need expansion
const thinPages = notIndexedPages.filter(p => p.wordCount > 0 && p.wordCount < 800);
if (thinPages.length > 0) {
  console.log(`\n⚠️  Thin pages (under 800 words): ${thinPages.length}`);
  for (const t of thinPages.slice(0, 10)) {
    console.log(`   ${t.slug} — ${t.wordCount}w`);
  }
}

console.log('\n' + '═'.repeat(70));
console.log(`  Total site pages: ${allPages.size}`);
console.log(`  Not-indexed:      ${notIndexedPages.length}`);
console.log(`  Orphans:          ${orphans.length}`);
console.log(`  Thin (<800w):     ${thinPages.length}`);
console.log('═'.repeat(70));
