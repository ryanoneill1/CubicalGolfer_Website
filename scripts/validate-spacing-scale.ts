#!/usr/bin/env node
/**
 * Guard: spacing stays on the 4pt grid.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * A --sp-1…--sp-7 scale (8/16/24/32/48/64/96) has existed in :root for a long
 * time and was referenced EXACTLY ZERO times. Meanwhile 347 margin/padding
 * declarations carried literal pixel values, and 32% of them sat off the 4pt
 * grid: 14px used 32 times, 10px 25 times, 22px 12 times, 18px 11 times.
 *
 * Individually invisible. Collectively it is the difference between a page
 * that feels engineered and one that feels assembled — the same class of
 * defect as the colour sprawl: nobody consciously notices, they just don't
 * trust it.
 *
 * Values below 4px are deliberately exempt. Those are hairlines and optical
 * nudges (1px borders inside a margin shorthand, a 2px baseline correction)
 * where the grid is not the right tool.
 *
 * RATCHET: off-grid values may only go DOWN. Sprint 158 snapped 108 values and
 * the ceiling is 0 — the 1-3px hairlines are EXEMPTED above rather than
 * counted, so a ceiling of 13 (my first cut) could never bite. A guard that
 * cannot fail is worse than no guard: it reports a green tick for a condition
 * it is not testing.
 */
import fs from 'node:fs';
import path from 'node:path';

const CEILING = 0;

/* ── Sprint 182 — the blind spot ───────────────────────────────────────────
 * Until now this read ONLY src/styles/global.css. Every component and page
 * <style> block was invisible to it, and 73 off-grid values were living there
 * — 14px x23, 10px x21, 18px x10 — across StickyBar, ProductCard, ProductCTA,
 * CGScore, EmailCapture and twelve more, while this script printed a green
 * tick. That is precisely the failure the header above warns about: a guard
 * that cannot fail for a condition it is not testing.
 *
 * One trap worth recording. A first pass at counting these returned 266, not
 * 73. src/pages/golf-ball-compression-chart/index.astro contains the literal
 * text "<style>" inside an HTML comment, which opened a bogus block that ran
 * to the real </style> 240 lines later and swallowed every inline style in
 * between. Comments are stripped before the blocks are found, below. A number
 * 3.6x too big would have been "fixed" by snapping values that were fine.
 */
function astroFiles(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const q = path.join(dir, e.name);
    if (e.isDirectory()) astroFiles(q, out);
    else if (e.name.endsWith('.astro')) out.push(q);
  }
  return out;
}

/* .ts is included for inline styles because src/data/articles.ts carries
 * article-body HTML with style attributes in it. */
function astroOrTs(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const q = path.join(dir, e.name);
    if (e.isDirectory()) astroOrTs(q, out);
    else if (e.name.endsWith('.astro') || e.name.endsWith('.ts')) out.push(q);
  }
  return out;
}

/* Sprint 183: CSS comments are stripped before scanning. A comment in this
 * repo routinely documents the very values a sprint changed — e.g.
 * "padding:3px 10px -> 3px 12px" — and without this the scanner reads the
 * BEFORE value as a live declaration and fails on prose. That is a false
 * alarm, and a check that cries wolf gets muted, so it is fixed here rather
 * than by forbidding anyone to write a number in a comment. */
const stripCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, ' ');

const sources: Array<{ label: string; css: string }> = [
  { label: 'src/styles/global.css', css: stripCssComments(fs.readFileSync('src/styles/global.css', 'utf8')) },
];
for (const f of astroFiles('src')) {
  const raw = fs.readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ' ')        // HTML comments first - see note above
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');  // and JSX comments
  for (const blk of raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    sources.push({ label: f, css: stripCssComments(blk[1]) });
  }
}

/* ── Sprint 184 — the inline blind spot ───────────────────────────────────
 * Sprint 182 taught this script to read component and page <style> blocks and
 * found 73 off-grid values. Inline style="" attributes were still invisible,
 * and that is where the bulk of them live: 402, across 49 files —
 * 14px x127, 10px x96, 6px x82, 18px x55. Five and a half times the number
 * the last sprint fixed, in the one place no stylesheet rule can reach.
 *
 * These get their OWN ceiling rather than being folded into the CSS count,
 * for two reasons. They cannot be fixed by editing a rule — each one is a
 * separate edit in markup — and lumping them in would mean a single ceiling
 * that can never reach 0, which is the same as having no ceiling at all.
 * So: CSS stays at 0 and must stay there; inline ratchets down as F9 drains
 * files, and each conversion sprint is measured on it.
 */
const INLINE_CEILING = 395;   // Sprint 184: baseline 402, how-we-test h2s snapped 14px→16px

const inlineSeen = new Map<number, number>();
const inlineByFile = new Map<string, number>();
for (const f of astroOrTs('src')) {
  const raw = fs.readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
  for (const attr of raw.matchAll(/style="([^"]*)"/g)) {
    for (const d of attr[1].matchAll(/(?:^|;)\s*(?:margin|padding)(?:-top|-bottom|-left|-right)?\s*:\s*([^;]+)/g)) {
      if (/var\(|calc\(|clamp\(/.test(d[1])) continue;
      for (const px of d[1].match(/-?\d+(?:\.\d+)?px/g) ?? []) {
        const v = parseFloat(px);
        if (Math.abs(v) < 4) continue;
        if (v % 4 !== 0) {
          inlineSeen.set(v, (inlineSeen.get(v) ?? 0) + 1);
          inlineByFile.set(f, (inlineByFile.get(f) ?? 0) + 1);
        }
      }
    }
  }
}
const inlineTotal = [...inlineSeen.values()].reduce((a, b) => a + b, 0);

const offenders: { value: number; count: number }[] = [];
const seen = new Map<number, number>();
const byFile = new Map<string, number>();

const declRe = /(?:^|[;{\s])(?:margin|padding)(?:-top|-bottom|-left|-right)?\s*:\s*([^;}]+)/g;
for (const src of sources) {
  let m: RegExpExecArray | null;
  declRe.lastIndex = 0;
  while ((m = declRe.exec(src.css)) !== null) {
    const body = m[1];
    if (/var\(|calc\(|clamp\(/.test(body)) continue;   // computed values opt out
    for (const px of body.match(/-?\d+(?:\.\d+)?px/g) ?? []) {
      const v = parseFloat(px);
      if (Math.abs(v) < 4) continue;                    // hairlines are exempt
      if (v % 4 !== 0) {
        seen.set(v, (seen.get(v) ?? 0) + 1);
        byFile.set(src.label, (byFile.get(src.label) ?? 0) + 1);
      }
    }
  }
}
for (const [value, count] of seen) offenders.push({ value, count });

const total = offenders.reduce((n, o) => n + o.count, 0);

if (total > CEILING) {
  console.error(`\n❌ Spacing scale: ${total} value(s) off the 4pt grid (ceiling ${CEILING}).`);
  for (const o of offenders.sort((a, b) => b.count - a.count).slice(0, 12)) {
    const near = Math.round(Math.abs(o.value) / 4) * 4 * Math.sign(o.value);
    console.error(`   - ${o.value}px used ${o.count}× — nearest grid step is ${near}px`);
  }
  console.error(
    `\n   Spacing is how a reader tells one group from another. A value that is ` +
    `off\n   the grid is not wrong on its own — it is wrong because nothing else ` +
    `shares\n   it, so it reads as an accident rather than a rhythm.\n`
  );
  process.exit(1);
}

if (inlineTotal > INLINE_CEILING) {
  console.error(`\n❌ Spacing scale (inline): ${inlineTotal} off-grid value(s) in style="" attributes — ceiling ${INLINE_CEILING}.`);
  for (const [value, count] of [...inlineSeen].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    const near = Math.round(Math.abs(value) / 4) * 4 * Math.sign(value);
    console.error(`   - ${value}px used ${count}× — nearest grid step is ${near}px`);
  }
  console.error('   Worst files:');
  for (const [f, n] of [...inlineByFile].sort((a, b) => b[1] - a[1]).slice(0, 6)) {
    console.error(`     ${String(n).padStart(3)}  ${f}`);
  }
  console.error('\n   This is a ratchet and it went UP. An inline style cannot be fixed by');
  console.error('   editing a rule — convert the markup to a class instead.\n');
  process.exit(1);
}

console.log(
  `✅ Spacing scale: every margin/padding ≥4px is on the 4pt grid ` +
  `(1-3px hairlines exempt) across ${sources.length} stylesheet(s) — ` +
  `global.css plus ${sources.length - 1} component/page <style> block(s).`
);
console.log(
  `   Inline style="" attributes: ${inlineTotal} off-grid value(s) ` +
  `(ceiling ${INLINE_CEILING})` +
  (inlineTotal < INLINE_CEILING ? ` — ${INLINE_CEILING - inlineTotal} below; lower INLINE_CEILING to ${inlineTotal}.` : '.')
);
