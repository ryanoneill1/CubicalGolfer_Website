/**
 * validate-quick-answer.ts — pre-build guard
 *
 * Added Aug 2026, Sprint 1.
 *
 * `quickAnswerProduct` is the most consequential field on a buying guide. It drives
 * THREE separate buy buttons — the Quick Answer CTA ("Our #1 Pick: …"), the
 * above-the-fold ProductCTA, and the sticky mobile bar — and nothing checked that it
 * had anything to do with the page it sat on.
 *
 * Eighteen pages were wrong. Five sold a product that appeared nowhere else on the
 * page: /best-junior-golf-clubs/ offered parents a $699 adult complete set, and
 * /best-golf-clubs-20-handicap/ sold $899 irons on a page recommending a $399 driver.
 * Thirteen more sold something other than the page's declared winner —
 * /best-golf-gps-watches/ sold the $249 S42 under a heading recommending the $499 S62.
 *
 * The invariant: the Quick Answer button renders DIRECTLY BENEATH the bottomLine
 * text, so it must sell something that text — or the page — actually recommends.
 *
 *   FAIL  the product appears nowhere on the page AND is not named in bottomLine.
 *         There is no reading of the page on which that button is correct.
 *   WARN  the product is on the page but is not the declared winner. Sometimes
 *         deliberate (a tutorial pointing at a supporting product), so it is a
 *         review list rather than a build failure.
 *
 * Review pages are exempt: there `quickAnswerProduct` IS the subject of the page,
 * and it also feeds the product -> review-page map in [...slug].astro.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

const failures: string[] = [];
const warnings: string[] = [];
let checked = 0;

for (const article of ARTICLES as any[]) {
  const key: string | undefined = article.quickAnswerProduct;
  if (!key) continue;
  if (article.pageType === 'review') continue;

  const entry = (AFFILIATE as any)[key];
  if (!entry) {
    failures.push(`${article.slug} -> quickAnswerProduct '${key}' is not in the registry`);
    continue;
  }

  const sections = (article.sections ?? []).filter((s: any) => s.affiliateKey);
  const rows = article.comparisonTable?.rows ?? [];
  if (!sections.length && !rows.length) continue;
  checked++;

  const onPage =
    sections.some((s: any) => s.affiliateKey === key) ||
    rows.some((r: any) => r.affiliateKey === key);

  // Token-subset match, not a contiguous string: the registry stores
  // "FootJoy WeatherSof Golf Glove" while the sentence reads "a FootJoy WeatherSof
  // glove ($18)". Brand + model is what identifies the product.
  const bottom = norm(String(article.bottomLine ?? '').replace(/<[^>]+>/g, ''));
  const label = String(entry.imgAlt ?? key.replace(/-/g, ' '));
  const idTokens = label.split(/\s+/).filter(Boolean).slice(0, 2).map(norm).filter(t => t.length > 2);
  const namedInBottomLine = idTokens.length > 0 && idTokens.every(t => bottom.includes(t));

  if (!onPage && !namedInBottomLine) {
    failures.push(
      `${article.slug}\n      CTA sells ${key} (${entry.price}) — appears nowhere on the page ` +
      `and is not named in the Quick Answer text.`
    );
    continue;
  }

  // Named in the text but with no section of its own — the reader is sold something
  // the page never actually reviews. Not a false button, but a content gap.
  if (!onPage && namedInBottomLine) {
    warnings.push(`${article.slug} — CTA sells ${key} (${entry.price}), named in the Quick Answer text but it has no section on the page`);
  }

  const winner =
    rows.find((r: any) => r.winner === true)?.affiliateKey ??
    sections.find((s: any) => /🥇|Best Overall|BEST PICK/i.test(String(s.h2 ?? '') + String(s.badge ?? '')))?.affiliateKey;

  if (winner && winner !== key) {
    const w = (AFFILIATE as any)[winner];
    warnings.push(`${article.slug} — CTA sells ${key} (${entry.price}); page's #1 is ${winner} (${w?.price ?? '?'})`);
  }
}

if (failures.length) {
  console.error(`\n❌ ${failures.length} Quick Answer button(s) sell a product the page never mentions:`);
  for (const f of failures) console.error('   ' + f);
  console.error(
    '\nThe Quick Answer CTA renders directly under the bottomLine text and also drives\n' +
    'the above-the-fold CTA and the sticky mobile bar. Point it at a product the page\n' +
    'actually recommends.\n'
  );
  process.exit(1);
}

if (warnings.length) {
  console.log(`⚠️  ${warnings.length} Quick Answer CTA(s) are not the page's declared #1 — sometimes deliberate, worth a look:`);
  for (const w of warnings) console.log('   ' + w);
}

console.log(`✅ Quick Answer: all ${checked} product pages sell something they actually recommend.`);
