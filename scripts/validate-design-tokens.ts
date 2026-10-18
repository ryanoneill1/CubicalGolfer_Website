#!/usr/bin/env node
/**
 * validate-design-tokens.ts — POST-BUILD guard on the visual vocabulary.
 *
 * ── Why ────────────────────────────────────────────────────────────────────
 * The October 2026 design audit measured the built site against four golf
 * competitors. Typography and reading measure came out ahead of the category
 * (60-68 characters per line, best of the five sites measured; two typefaces
 * against Plugged In Golf's nine). The box system did not:
 *
 *     distinct border-radius values   26   (competitors 2-5, premium 1-3)
 *     distinct box-shadow values      17   (competitors 1-2, premium 1)
 *     body-copy definitions            6   (should be 1)
 *
 * Thirteen corner radii and seven shadows on one page are not a style
 * preference — they are measurable visual complexity, which is what Tuch et
 * al. (2012) found readers penalise within 50ms of seeing a page.
 *
 * Sprint 174 collapsed radius onto --r1/--r2/--r3, shadow onto --s1/--s2, and
 * pointed every body-copy context at --prose-size/--prose-lh. This guard keeps
 * all three from drifting back.
 *
 * ── Ceilings ratchet ───────────────────────────────────────────────────────
 * Only ever edit these downward. 50% (circles/avatars) and 999px (pills) are
 * legitimate shape primitives and are excluded from the radius count.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ASTRO = join(process.cwd(), 'dist', '_astro');
const RADIUS_CEILING = 9;
const SHADOW_CEILING = 2;

if (!existsSync(ASTRO)) {
  console.log('validate-design-tokens: no dist/_astro yet — skipped (runs after astro build).');
  process.exit(0);
}

const css = readdirSync(ASTRO)
  .filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join(ASTRO, f), 'utf8'))
  .join('\n');

const SHAPE_PRIMITIVE = /^(0|50%|100%|999px|9999px)$/;

const radii = new Set<string>();
for (const m of css.matchAll(/border-radius:\s*([^;}"']+)/g)) {
  const v = m[1].trim();
  if (SHAPE_PRIMITIVE.test(v)) continue;
  radii.add(v);
}
const shadows = new Set<string>();
for (const m of css.matchAll(/box-shadow:\s*([^;}"']+)/g)) {
  const v = m[1].trim();
  if (v === 'none') continue;
  shadows.add(v);
}

/** Every body-copy context must resolve to the shared token, not a literal. */
const BODY_CONTEXTS = [
  '.art-content p', '.intro-box p', '.quick-answer-box p', '.section-body',
];
const literalBody: string[] = [];
for (const ctx of BODY_CONTEXTS) {
  const re = new RegExp(`[^{}]*${ctx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{}]*\\{([^}]*)\\}`, 'g');
  for (const m of css.matchAll(re)) {
    const decl = m[1];
    const fs = /font-size:\s*([^;]+)/.exec(decl)?.[1]?.trim();
    if (fs && !fs.includes('var(--prose-size)')) {
      literalBody.push(`${ctx} → font-size: ${fs}`);
    }
  }
}

let failed = false;
const report = (label: string, got: number, ceiling: number, list: Set<string>) => {
  if (got > ceiling) {
    failed = true;
    console.error(`\n❌ ${label}: ${got} distinct value(s), ceiling ${ceiling} (which only goes down).`);
    for (const v of [...list].slice(0, 20)) console.error(`     ${v}`);
    console.error(`   Map it onto a token. Radius: --r1 6px / --r2 10px / --r3 16px. Shadow: --s1 / --s2.\n`);
  }
};
report('border-radius vocabulary', radii.size, RADIUS_CEILING, radii);
report('box-shadow vocabulary',    shadows.size, SHADOW_CEILING, shadows);

if (literalBody.length) {
  failed = true;
  console.error(`\n❌ ${literalBody.length} body-copy rule(s) set a literal font-size instead of var(--prose-size):`);
  for (const l of literalBody) console.error(`     ${l}`);
  console.error('   Body copy has one definition. Use var(--prose-size) / var(--prose-lh).\n');
}

if (failed) process.exit(1);
console.log(`✅ Design tokens: ${radii.size} radius value(s) (ceiling ${RADIUS_CEILING}), ` +
  `${shadows.size} shadow value(s) (ceiling ${SHADOW_CEILING}), ` +
  `all ${BODY_CONTEXTS.length} body-copy contexts on var(--prose-size).`);
