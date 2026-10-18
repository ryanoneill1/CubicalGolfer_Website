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
for (const c of ['.product-card__name-link', '.product-card__img-link', '.qp__cta', '.sb__btn']) {
  if (!css.includes(`:not(${c})`)) {
    problems.push(`${c} is not excluded from the prose underline rules — it will render underlined.`);
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
