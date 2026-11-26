#!/usr/bin/env node
/**
 * validate-section-products.ts — sections a reader can read but not buy from.
 *
 * ── The gap this closes ────────────────────────────────────────────────────
 * Every product check we had was PAGE-level. `validate-cta-affordance` asks
 * "does this page offer at least one button?", and the Sprint 253 density
 * audit counted products per page. Both are blind to the same thing: a page
 * that sells hard in two sections and then runs nine sections of prose with
 * nothing to click.
 *
 * Ryan found it by reading /best-golf-gifts-for-him/ on 20 November 2026. That
 * page had THIRTEEN products — healthy by every measure we had — sitting in
 * 5 of its 14 sections. Nine sections, including "Gifts by Budget", "Gifts by
 * Golfer Personality" and "The Safe-Bet Matrix", carried no buy path at all.
 * Nothing flagged it because nothing was counting at this level.
 *
 * ── What counts as a buy path ──────────────────────────────────────────────
 *   section.affiliateKey                 a full selling section (needs a photo)
 *   section.items[].affiliateKey         a product list    (needs NO photo)
 *   section.recommendedGear[].key        a "buy next" block (needs NO photo)
 *
 * `items` is the one to reach for. It needs no photography, so it is not
 * blocked behind validate-product-images, and it renders real tracked links.
 *
 * ── Sections that SHOULD have nothing ──────────────────────────────────────
 * Plenty of sections are correctly productless: "What to Avoid", "How We
 * Test", advice, methodology. Those set `noProduct` to a short REASON string.
 * The value is the reason rather than `true` on purpose — a sentence someone
 * had to write is harder to apply thoughtlessly than a box to tick, and the
 * next person can tell a considered decision from a silenced validator.
 *
 * ── Ceilings, per pageType ─────────────────────────────────────────────────
 * The right answer differs by page:
 *
 *   buying-guide / listicle   a dry section is usually a miss. The page's job
 *                             is to put buyable things in front of a reader.
 *   review                    the reviewed unit sits in a Quick Answer CTA and
 *                             a comparison table; body sections are analysis.
 *   tutorial                  dry is CORRECT. Stuffing a how-to with buy
 *                             buttons is what Google's helpful-content
 *                             guidance punishes, and the Sprint 253 audit set
 *                             the tutorial floor at 1 product with an explicit
 *                             "do not raise this".
 *
 * So each type gets its own ratchet, measured on 20 November 2026. They only
 * ever go down. Nothing here forces editorial work in one commit; it stops the
 * number growing and lets it fall as pages are worked.
 */
import { ARTICLES } from '../src/data/articles';
import fs from 'fs';
import path from 'path';

/** Ratchets. Measured 20 Nov 2026. Only ever edit downward. */
const CEILING: Record<string, number> = {
  'buying-guide': 212,   // 247 -> 212 (Sprint 277: 21 sections gained items, 14 declared productless)
  'tutorial':     267,
  'review':       109,
  'comparison':    57,
  'listicle':      35,   // 55 -> 46 (gift page) -> 38 (/average-golf-handicap/)
  'lifestyle':      7,
  'local':          0,
};

type Row = { slug: string; type: string; h2: string };
const dry: Row[] = [];
const declared: Row[] = [];
let sections = 0;

for (const a of ARTICLES as any[]) {
  const type = String(a.pageType ?? 'unknown');
  for (const s of a.sections ?? []) {
    sections++;
    const buyable =
      !!s.affiliateKey ||
      (s.items ?? []).some((i: any) => i?.affiliateKey) ||
      (s.recommendedGear ?? []).some((g: any) => g?.key);
    if (buyable) continue;
    const row = { slug: String(a.slug), type, h2: String(s.h2 ?? '(untitled)') };
    if (typeof s.noProduct === 'string' && s.noProduct.trim().length >= 20) { declared.push(row); continue; }
    if (s.noProduct) {
      console.error(`\n❌ ${row.slug} → "${row.h2}" sets noProduct without a real reason.`);
      console.error(`   Write one sentence saying why this section sells nothing. A bare`);
      console.error(`   truthy value is how a guard gets switched off by accident.\n`);
      process.exit(1);
    }
    dry.push(row);
  }
}

const byType: Record<string, Row[]> = {};
for (const r of dry) (byType[r.type] ||= []).push(r);

let failed = false;
for (const [type, rows] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
  const cap = CEILING[type];
  if (cap === undefined) {
    console.error(`\n❌ pageType "${type}" has no ceiling. Add one to CEILING, measured.\n`);
    failed = true;
    continue;
  }
  if (rows.length > cap) {
    failed = true;
    console.error(`\n❌ ${type}: ${rows.length} section(s) with no buy path and no stated reason (ceiling ${cap}).`);
    const worst: Record<string, number> = {};
    for (const r of rows) worst[r.slug] = (worst[r.slug] ?? 0) + 1;
    Object.entries(worst).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .forEach(([slug, n]) => console.error(`   ${String(n).padStart(2)}  ${slug}`));
  }
}

if (failed) {
  console.error(`\n   Add products with \`items: [{ name, desc, rating, affiliateKey }]\` —`);
  console.error(`   it needs no photograph. If the section should sell nothing, say why`);
  console.error(`   in \`noProduct\` and this check will leave it alone.\n`);
  process.exit(1);
}

/* ══════════ STANDALONE .astro PAGES ══════════
 * This guard imported ARTICLES and nothing else, so every hand-written page
 * under src/pages was invisible to it — including /golf-ball-compression-chart/,
 * which is 29% of all site clicks and was selling in 4 of its 15 sections when
 * Sprint 268 found it by hand. Fixing a page a guard cannot see is temporary.
 *
 * These pages have no `pageType` and no `noProduct` field, so they get one
 * flat ratchet rather than per-type ones. It is a blunt number on purpose: its
 * only job is to stop the count going UP while the editorial work happens.
 */
const ASTRO_DRY_CEILING = 191;   // measured 22 Nov 2026, after Sprints 268-269
{
  const SELLS = /getAffiliateLink\(|AFFILIATE\[|<ProductCard|<AffiliateButton|buyRow\(|ballUrl\(|amzn\.to|class="buy-row"|class="ball-buy-row"/;
  let astroSections = 0, astroSelling = 0;
  const worst: Record<string, number> = {};
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (!e.name.includes('[')) walk(full); continue; }
      if (!e.name.endsWith('.astro') || e.name.includes('[')) continue;
      const text = fs.readFileSync(full, 'utf8');
      const parts = text.split(/<h2\b/);
      if (parts.length < 2) continue;
      const secs = parts.slice(1);
      astroSections += secs.length;
      const selling = secs.filter(x => SELLS.test(x)).length;
      astroSelling += selling;
      if (secs.length - selling > 0) worst[full] = secs.length - selling;
    }
  };
  walk('src/pages');
  const astroDry = astroSections - astroSelling;
  if (astroDry > ASTRO_DRY_CEILING) {
    console.error(`\n❌ standalone .astro pages: ${astroDry} h2 section(s) with no buy path (ceiling ${ASTRO_DRY_CEILING}).`);
    Object.entries(worst).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .forEach(([f, c]) => console.error(`   ${String(c).padStart(2)}  ${f}`));
    console.error(`\n   These are hand-written pages, so there is no \`items\` array to fill —`);
    console.error(`   add a buy row with getAffiliateLink(), the way the compression chart`);
    console.error(`   and the distance chart do. Never type a price into one.\n`);
    process.exit(1);
  }
  console.log(`✅ Standalone pages: ${astroSections} h2 section(s) across hand-written pages — ${astroDry} without a buy path (ceiling ${ASTRO_DRY_CEILING}).`);
  if (astroDry < ASTRO_DRY_CEILING) console.log(`   ${ASTRO_DRY_CEILING - astroDry} below the ceiling — lower ASTRO_DRY_CEILING to ${astroDry}.`);
}

const parts = Object.entries(byType).sort((a, b) => b[1].length - a[1].length)
  .map(([t, r]) => `${t} ${r.length}/${CEILING[t]}`).join(', ');
console.log(
  `✅ Section buy paths: ${sections} section(s) — ${dry.length} without one (${parts}); ` +
  `${declared.length} declared productless with a reason.`
);
for (const [t, r] of Object.entries(byType)) {
  if (r.length < (CEILING[t] ?? 0)) console.log(`   ${t} is ${CEILING[t] - r.length} below its ceiling — lower it to ${r.length}.`);
}
