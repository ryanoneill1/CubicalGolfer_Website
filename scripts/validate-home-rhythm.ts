/**
 * validate-home-rhythm.ts — Sprint 180
 *
 * WHY THIS EXISTS
 * Ryan reported "NOT SURE WHERE TO START?" and "⭐ FEATURED PICK" rendering
 * smooshed together. They were: the intent section declared
 * `padding:32px clamp(1.5rem,5vw,4rem) 0` — a zero BOTTOM — and the featured
 * block was a bare <div> with `margin:0 0 28px` — a zero TOP. Gap: 0px.
 * Both values were inline, so none of ~50 validators could see them.
 *
 * WHY IT READS dist/ AND NOT THE .astro SOURCE
 * The first version of this file parsed src/pages/index.astro and keyed
 * top-level sections off their indentation. It passed — while skipping all six
 * pairs it looked at, and while never even seeing .home-featured, which lives
 * inside an IIFE at six spaces of indent. A validator that reports "all clear"
 * on the exact bug it was written for is worse than no validator. So this reads
 * the built HTML: real document order, real classes, no guessing.
 *
 * WHAT IT CHECKS
 * For every adjacent pair of depth-0 <section> elements on the built homepage:
 *     previous padding-bottom + next padding-top >= MIN_GAP
 *
 * THE CARVE-OUT
 * Two sections with DIFFERENT backgrounds may touch — that is a colour-block
 * boundary (cream → green → cream-dark), a deliberate device here. The rule
 * only bites when adjacent sections share a background, which is exactly when
 * a reader sees one undifferentiated run of content.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const MIN_GAP = 32;
const CEILING = 0;

const html = readFileSync('dist/index.html', 'utf8');

// every stylesheet the page actually loads
const cssFiles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1]);
let css = '';
for (const href of cssFiles) {
  try { css += readFileSync(join('dist', href.replace(/^\//, '')), 'utf8') + '\n'; } catch {}
}
if (!css) { console.log('❌ Homepage rhythm: no stylesheet found in dist/index.html.'); process.exit(1); }

/** last-wins lookup of a property for a selector (handles grouped + minified CSS) */
function declFor(sel: string, prop: string): string | null {
  const esc = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re  = new RegExp(`(?:^|[}{,])\\s*${esc}\\s*(?:,[^{}]*)?\\{([^}]*)\\}`, 'g');
  let m: RegExpExecArray | null, found: string | null = null;
  while ((m = re.exec(css))) {
    const pre = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, 'g');
    let d: RegExpExecArray | null;
    while ((d = pre.exec(m[1]))) found = d[1].trim();
  }
  return found;
}

/** [top, bottom] in px from a padding shorthand; null where the value is not px */
function tb(sh: string | null): [number | null, number | null] {
  if (!sh) return [null, null];
  const toks: string[] = []; let depth = 0, cur = '';
  for (const ch of sh) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (cur) { toks.push(cur); cur = ''; } } else cur += ch;
  }
  if (cur) toks.push(cur);
  const px = (t?: string) => {
    if (t === undefined) return null;
    if (t === '0') return 0;
    const m = /^(-?[\d.]+)px$/.exec(t);
    return m ? parseFloat(m[1]) : null;
  };
  if (toks.length >= 3) return [px(toks[0]), px(toks[2])];
  return [px(toks[0]), px(toks[0])];
}

// ── depth-0 <section> elements, in document order ──────────────────────────
type Sec = { label: string; top: number | null; bot: number | null; bg: string | null; src: string };
const secs: Sec[] = [];
const tagRe = /<(\/?)section\b([^>]*)>/g;
let depth = 0, t: RegExpExecArray | null;
while ((t = tagRe.exec(html))) {
  if (t[1] === '/') { depth--; continue; }
  if (depth++ !== 0) continue;                       // nested — not a page section
  const attrs = t[2];
  const cls   = (/class="([^"]*)"/.exec(attrs)?.[1] ?? '').split(/\s+/).filter(Boolean);
  const style = /style="([^"]*)"/.exec(attrs)?.[1] ?? '';

  let top: number | null = null, bot: number | null = null, bg: string | null = null, src = '';
  for (const c of cls) {
    const p = declFor('.' + c, 'padding');
    if (p) { const [a, b] = tb(p); if (a !== null) { top = a; src = `.${c}`; } if (b !== null) bot = b; }
    const g = declFor('.' + c, 'background');
    if (g) bg = g;
  }
  const ip = /(?:^|;)\s*padding\s*:\s*([^;]+)/.exec(style)?.[1] ?? null;   // inline wins
  if (ip) { const [a, b] = tb(ip); if (a !== null) top = a; if (b !== null) bot = b; src = 'inline style'; }
  const ig = /(?:^|;)\s*background[^:]*:\s*([^;]+)/.exec(style)?.[1];
  if (ig) bg = ig.trim();

  secs.push({ label: cls.length ? '.' + cls[0] : '<section style="…">', top, bot, bg, src: src || '(none)' });
}

const fails: string[] = [];
const allowed: string[] = [];
let checked = 0;
for (let i = 0; i < secs.length - 1; i++) {
  const a = secs[i], b = secs[i + 1];
  if ((a.bg ?? '') !== (b.bg ?? '')) { allowed.push(`${a.label} → ${b.label} (colour-block boundary)`); continue; }
  if (a.bot === null || b.top === null) {
    fails.push(`${a.label} → ${b.label}: vertical padding is not a px value, so the gap cannot be verified (${a.label} bottom from ${a.src}, ${b.label} top from ${b.src})`);
    continue;
  }
  checked++;
  const gap = a.bot + b.top;
  if (gap < MIN_GAP) fails.push(`${a.label} (padding-bottom ${a.bot}px) → ${b.label} (padding-top ${b.top}px) = ${gap}px, want >= ${MIN_GAP}px`);
}

console.log('');
if (secs.length < 5) {
  console.log(`❌ Homepage rhythm: only found ${secs.length} top-level section(s) — the parser is not seeing the page.`);
  process.exit(1);
}
if (checked === 0) {
  console.log('❌ Homepage rhythm: 0 pairs actually verified — this check is blind, fix it rather than trusting it.');
  process.exit(1);
}
if (fails.length > CEILING) {
  console.log(`❌ Homepage rhythm: ${fails.length} adjacent section pair(s) failed (ceiling ${CEILING}).`);
  fails.forEach(f => console.log('   - ' + f));
  console.log('');
  console.log('   Two blocks with no gap between them read as one block. Set the gap in');
  console.log('   global.css, not an inline style — inline is how the last one hid.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Homepage rhythm: ${secs.length} top-level section(s), ${checked} same-background pair(s) verified at >= ${MIN_GAP}px.`);
allowed.forEach(s => console.log(`   allowed: ${s}`));
