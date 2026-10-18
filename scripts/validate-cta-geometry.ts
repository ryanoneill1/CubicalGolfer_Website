#!/usr/bin/env node
/**
 * validate-cta-geometry.ts — POST-BUILD guard on the button vocabulary.
 *
 * ── Why ────────────────────────────────────────────────────────────────────
 * Measured on /best-golf-rangefinders-2026/ before Sprint 176: 36 CTAs with
 * EIGHT distinct heights (21/48/49/53/57/58/81/192px), NINE visual treatments,
 * and ten links rendering underlined — including the Quick Pick button itself
 * and an underline sitting beneath every product-card photo.
 *
 * Sprint 176 gave every button one radius (--r1), a 48px minimum box (above
 * WCAG 2.5.8's 24px AA floor and at Apple's 44pt / Material's 48dp guidance)
 * and no underline, and deleted the per-CTA disclosure line that rendered
 * under every affiliate button — 656 instances across 214 pages.
 *
 * ── Rules ──────────────────────────────────────────────────────────────────
 *  1. Every CTA class carries the shared geometry in the built CSS.
 *  2. Every CTA class is excluded from the prose underline rules.
 *  3. The per-CTA disclosure line stays at or below its ceiling.
 *  4. EVERY page carrying an affiliate link still discloses. This is the one
 *     that matters: Sprint 176 removed disclosure copy, and the page-level
 *     disclosures must cover what the per-button line used to.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const PER_CTA_CEILING = 60;   // one per /compare/ page + the disclosure page quoting itself

if (!existsSync(DIST)) {
  console.log('validate-cta-geometry: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const css = readdirSync(join(DIST, '_astro'))
  .filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join(DIST, '_astro', f), 'utf8'))
  .join('\n');

const BOXED = ['.aff-cta__btn', '.qp__cta', '.quick-answer-cta', '.product-card__cta', '.aff-cta__alt'];
const ALL_CTA = [...BOXED, '.sb__btn', '.cmp-buy-btn'];

const problems: string[] = [];

// 1 — shared geometry present
const geom = /\.aff-cta__btn[^{}]*\{[^}]*min-height:\s*48px/.test(css.replace(/\s+/g, ''))
  || /min-height:48px/.test(css.replace(/\s+/g, ''));
if (!geom) problems.push('No shared 48px min-height rule found for the boxed CTA classes.');

// 2 — underline exclusions
//
// Sprint 182: this used to test a hand-picked list of FOUR classes with
// css.includes(`:not(X)`) — i.e. "is X excluded ANYWHERE in the stylesheet".
// Two things were wrong with that, and both were live on the site:
//   a) .product-card__cta — the primary affiliate button — was not in the
//      list, was not excluded, and rendered underlined on every article page
//      while this script printed "no underline". Found by looking at a
//      screenshot, which is the only reason it was found at all.
//   b) "excluded anywhere" is not the question. A class excluded from the
//      .art-content rule but not the .compare-body one renders underlined on
//      every comparison page. Each prose rule is now checked separately.
// The list is ALL_CTA plus the two card links, derived from the same constant
// the geometry check uses, so adding a CTA class cannot silently skip this.
// NB: the built CSS is minified onto one line, so this cannot be anchored with
// ^ and /m — the first attempt was, matched 0 rules, and the guard below caught it.
//
// It must also only look at rules that actually SET an underline. The second
// attempt matched the `:hover` variants too, which only set
// text-decoration-color and legitimately carry a shorter exclusion list; that
// produced 14 failures for 1 real defect. A check that cries wolf gets muted,
// so the rule body is captured and filtered on `text-decoration:underline`.
const PROSE_RULE_RE = /\.(?:art-content|compare-body|local-body)\s+a:not\([^{]*\{([^}]*)\}/g;
const proseRules: Array<{ head: string; sel: string }> = [];
for (const m of css.matchAll(PROSE_RULE_RE)) {
  if (!/text-decoration\s*:\s*underline/.test(m[1])) continue;   // hover/colour-only rules opt out
  const sel = m[0].slice(0, m[0].indexOf('{'));
  proseRules.push({ head: sel.slice(0, sel.indexOf(' a:not')), sel });
}
if (proseRules.length < 2) {
  problems.push(`Only found ${proseRules.length} underline-setting prose rule(s) — the matcher is not seeing the stylesheet.`);
}
const MUST_EXCLUDE = [...ALL_CTA, '.product-card__name-link', '.product-card__img-link'];
for (const { head, sel } of proseRules) {
  for (const c of MUST_EXCLUDE) {
    if (!sel.includes(`:not(${c})`)) {
      problems.push(`${c} is not excluded from the "${head}" prose underline rule — it renders underlined there.`);
    }
  }
}

// 3 + 4 — per-page disclosure integrity
function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'index.html') out.push(p);
  }
  return out;
}
const DISC = /earn a (small )?commission|affiliate disclosure|commission earned|at no extra cost|commissions? from qualifying/i;
let perCta = 0;
const undisclosed: string[] = [];
let withAffiliate = 0;

for (const f of walk(DIST)) {
  const raw = readFileSync(f, 'utf8');
  const text = raw
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, ' ');
  perCta += (text.match(/Affiliate link — we earn a small commission/g) ?? []).length;
  if (raw.includes('data-outbound=')) {
    withAffiliate++;
    if (!DISC.test(text)) undisclosed.push('/' + f.slice(DIST.length + 1).replace(/index\.html$/, ''));
  }
}

if (perCta > PER_CTA_CEILING) {
  problems.push(`Per-CTA disclosure line rendered ${perCta} time(s), ceiling ${PER_CTA_CEILING} (only goes down).`);
}
if (undisclosed.length) {
  problems.push(`${undisclosed.length} page(s) carry an affiliate link with NO disclosure anywhere: ` +
    undisclosed.slice(0, 6).join(', '));
}

if (problems.length) {
  console.error(`\n❌ CTA geometry / disclosure: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`   ${p}`);
  console.error('');
  process.exit(1);
}

console.log(`✅ CTA geometry: ${ALL_CTA.length} CTA class(es) share one radius and no underline, ` +
  `boxed CTAs at 48px minimum; per-CTA disclosure ${perCta}/${PER_CTA_CEILING}; ` +
  `all ${withAffiliate} affiliate page(s) still disclose.`);
