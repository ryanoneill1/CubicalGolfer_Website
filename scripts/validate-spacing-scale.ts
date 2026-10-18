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

const sources: Array<{ label: string; css: string }> = [
  { label: 'src/styles/global.css', css: fs.readFileSync('src/styles/global.css', 'utf8') },
];
for (const f of astroFiles('src')) {
  const raw = fs.readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ' ')        // HTML comments first - see note above
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');  // and JSX comments
  for (const blk of raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    sources.push({ label: f, css: blk[1] });
  }
}

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

console.log(
  `✅ Spacing scale: every margin/padding ≥4px is on the 4pt grid ` +
  `(1-3px hairlines exempt) across ${sources.length} stylesheet(s) — ` +
  `global.css plus ${sources.length - 1} component/page <style> block(s).`
);
