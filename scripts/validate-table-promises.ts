/**
 * validate-table-promises.ts — pre-build guard
 *
 * Added Aug 2026, Sprint 5.
 *
 * BADGED ORPHAN ROWS. A comparison-table row can carry a rank badge — "STRONG
 *    PICK", "BEST VALUE" — for a product the article has no section for and never
 *    mentions in prose. The reader sees a ranked recommendation the page never
 *    justifies. Five of these were live.
 *
 *    Note what this does NOT flag. An unbadged table row without a section is
 *    normal and useful: /golf-ball-compression-chart/ is a 34-ball reference table
 *    with 3 sections, and a review's "alternatives" table lists products it does not
 *    write up. An earlier count of "118 orphan rows across 51 pages" treated all of
 *    those as defects; on inspection 109 were legitimate content and deleting them
 *    would have gutted the site's most useful tables. Only a claim needs backing.
 *
 * Title counts are deliberately NOT checked here — validate-promise-delivery.ts
 * already owns that, and two checks disagreeing about what counts as "a pick"
 * would be worse than one.
 */
import { ARTICLES } from '../src/data/articles';

const badged: string[] = [];

for (const article of ARTICLES as any[]) {
  const rows = article.comparisonTable?.rows ?? [];
  const sectionKeys = new Set(
    (article.sections ?? []).filter((s: any) => s.affiliateKey).map((s: any) => s.affiliateKey),
  );

  // ---- 1. badged rows with no section and no prose mention ----
  const ranking = article.pageType === 'buying-guide' || article.pageType === 'listicle';
  if (ranking && sectionKeys.size) {
    const prose = JSON.stringify({
      intro: article.intro, bottomLine: article.bottomLine,
      sections: (article.sections ?? []).map((s: any) => [s.h2, s.body]),
    }).toLowerCase();
    for (const row of rows) {
      if (!row.affiliateKey || sectionKeys.has(row.affiliateKey)) continue;
      if (!row.badge && !row.winner) continue;                 // unbadged = reference row, fine
      const first = String(row.name ?? '').split(/\s+/)[0].toLowerCase();
      if (!first) continue;
      const mentions = prose.split(first).length - 1;
      if (mentions <= 1) {                                      // 1 = the row itself
        badged.push(`${article.slug} → "${row.name}" [${row.badge ?? 'winner'}] is ranked but never discussed`);
      }
    }
  }

}

if (badged.length) {
  console.error(`\n❌ ${badged.length} comparison-table row(s) carry a rank the page never earns:`);
  for (const b of badged) console.error('   ' + b);
  console.error('\nEither write the section, or drop the badge and leave it as a reference row.\n');
  process.exit(1);
}


console.log('✅ Table promises: every ranked row is backed by a section or by the article text.');
