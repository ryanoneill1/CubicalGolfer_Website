/**
 * validate-bottomline-product.ts — pre-build guard
 *
 * Added Sprint 60.
 *
 * `validate-quick-answer.ts` guards the `quickAnswerProduct` FIELD. It cannot see
 * a product named only in `bottomLine` PROSE — and that is where the damage was.
 * A bulk edit had appended "Our top pick: the <strong>X</strong> (~$N)." to 54
 * bottomLines, and on 8 pages X had nothing to do with the page:
 *
 *   /best-golf-drivers-forgiveness/  "Our top pick: the Ping G430 Irons"  — TWICE,
 *       on a DRIVERS page carrying 8,542 impressions.
 *   /best-golf-apps/                 "Our top pick: the Rapsodo MLM2PRO (~$699)"
 *       — a launch monitor closing a guide to FREE phone apps.
 *   /best-golf-irons-2026/           "Our top pick: the Putting Mirror (~$40)"
 *
 * The verdict box is the last thing a reader sees before the buy button, so a
 * product named there must be one the page actually recommends.
 *
 * RULE: every "Our top pick: the <strong>NAME</strong>" in a bottomLine must
 * resolve to a product the page carries — in a section, a table row, or as the
 * quickAnswerProduct. Matching is on the registry imgAlt, first two words, both
 * directions, so a rename does not trip it.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const head = (x: string) => norm(x).split(' ').slice(0, 2).join(' ');

// Topical picks that are deliberately not carried as a product on the page.
const ALLOWED = new Set<string>([
  '/how-to-fit-yourself-for-driver/|Callaway Ai Smoke Max Driver',
  '/driver-vs-3-wood-off-tee/|Callaway Ai Smoke Max Driver',
  '/how-to-get-your-kid-into-golf/|Callaway XJ Junior Set',
  '/why-do-i-hit-irons-fat/|Fiberbuilt Studio Mat',
  '/quiet-golf-simulator-setup/|Fiberbuilt Studio Mat',
  '/how-to-buy-wedges-4-degree-rule/|Maxfli Tour Milled Wedge',
  '/how-to-lower-golf-handicap/|Putting Mirror',
]);

const bad: string[] = [];
let checked = 0;

for (const article of ARTICLES as any[]) {
  const bl = String(article.bottomLine ?? '');
  const names = [...bl.matchAll(/Our top pick: the <strong>([^<]+)<\/strong>/g)].map(m => m[1].trim());
  if (!names.length) continue;

  const onPage = new Set<string>(
    [...JSON.stringify({ s: article.sections, c: article.comparisonTable })
      .matchAll(/"affiliateKey":"([^"]+)"/g)].map(m => m[1]),
  );
  if (article.quickAnswerProduct) onPage.add(article.quickAnswerProduct);
  const alts = [...onPage].map(k => norm(String((AFFILIATE as any)[k]?.imgAlt ?? k)));

  for (const name of names) {
    checked++;
    if (ALLOWED.has(`${article.slug}|${name}`)) continue;
    // Head-of-name matching alone is too loose: "Ping G430 Irons" shares its
    // first two words with "Ping G430 SFT Driver", so the first version of this
    // check passed the exact bug it was written for. A category noun in the name
    // must therefore be present in the matched product too.
    const CATEGORY = /\b(irons?|drivers?|putters?|wedges?|hybrids?|balls?|grips?|bags?|shoes?|gloves?|watch|rangefinder|monitor|mat|towel|cart|polo|pants|shorts|jacket)\b/;
    const nameCat = norm(name).match(CATEGORY)?.[1] ?? '';
    const ok = alts.some(a => {
      const shares = a.includes(head(name)) || norm(name).includes(head(a));
      if (!shares) return false;
      if (!nameCat) return true;
      const aCat = a.match(CATEGORY)?.[1] ?? '';
      // singular/plural tolerated, a different category is not
      return aCat !== '' && (aCat.replace(/s$/, '') === nameCat.replace(/s$/, ''));
    });
    if (!ok) bad.push(`  ${article.slug}\n      verdict names "${name}" — the page carries no such product`);
  }

  // the same bulk edit appended the sentence twice on three pages
  if (names.length > 1 && new Set(names.map(norm)).size < names.length) {
    bad.push(`  ${article.slug}\n      the same "Our top pick" sentence appears more than once`);
  }
}

console.log(`validate-bottomline-product: ${checked} verdict pick(s) checked (${ALLOWED.size} allowed)`);

if (bad.length) {
  console.error(`\nFAIL: ${bad.length} verdict box(es) recommend a product the page does not carry.`);
  console.error('The verdict is the last thing read before the buy button. Name something the page sells,');
  console.error('or delete the sentence — the surrounding bottomLine already states a verdict.\n');
  bad.forEach(b => console.error(b));
  process.exit(1);
}
