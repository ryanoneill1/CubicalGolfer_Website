#!/usr/bin/env node
/**
 * validate-contrast.ts — v2
 * Guard 1 (original): var(--gold) as TEXT on light surfaces → use --gold-text.
 * Guard 2 (new): any single CSS declaration block or inline style= that sets
 *   BOTH a background and a color must meet ~WCAG 3:1 contrast. This catches
 *   the whole "dark box with dark text" class before it ships.
 * Guard 3 (new): the contrast-bulletproofing block in global.css must exist.
 */
import * as fs from 'fs';
import * as path from 'path';

const SRC = 'src';
function walk(dir: string): string[] {
  const files: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.name === 'node_modules') continue;
    if (e.isDirectory()) files.push(...walk(full));
    else if (/\.(astro|css)$/.test(e.name)) files.push(full);
  }
  return files;
}

// ── resolve palette ──
const rootCss = fs.readFileSync('src/styles/global.css', 'utf-8');
const VARS: Record<string, string> = {};
for (const m of rootCss.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))/g)) VARS[m[1]] = m[2];

function hexToRgb(c: string): [number, number, number] | null {
  c = c.trim();
  const v = c.match(/^var\(--([a-z-]+)/); if (v) c = VARS[v[1]] ?? '';
  const r = c.match(/^rgba?\(\s*(\d+)[, ]+(\d+)[, ]+(\d+)/); if (r) return [+r[1], +r[2], +r[3]];
  let h = c.match(/^#([0-9a-fA-F]{6})/)?.[1];
  if (!h) { const s3 = c.match(/^#([0-9a-fA-F]{3})\b/)?.[1]; if (s3) h = [...s3].map(x => x + x).join(''); }
  if (!h) return null;
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function lum([r,g,b]: [number,number,number]) {
  const f = (v: number) => { v/=255; return v <= .03928 ? v/12.92 : ((v+.055)/1.055)**2.4; };
  return .2126*f(r)+.7152*f(g)+.0722*f(b);
}
function alphaBelow(c: string, t: number): boolean {
  const m = c.match(/rgba\([^)]*,\s*(0?\.\d+|\d+\.?\d*)\s*\)/);
  return !!m && parseFloat(m[1]) < t;
}
function contrast(a: string, b: string): number | null {
  // semi-transparent backgrounds are tints over the parent surface —
  // their effective color is the parent's, so skip direct comparison
  if (alphaBelow(a, 0.5)) return null;
  const A = hexToRgb(a), B = hexToRgb(b);
  if (!A || !B) return null;
  const [l1,l2] = [lum(A), lum(B)].sort((x,y)=>y-x);
  return (l1+.05)/(l2+.05);
}

let warnings = 0;
const flag = (file: string, what: string, bg: string, fg: string, ratio: number) => {
  console.error(`⚠️  ${file}: ${what} — bg ${bg} vs text ${fg} = ${ratio.toFixed(2)}:1 (<3:1)`);
  warnings++;
};

for (const file of walk(SRC)) {
  const content = fs.readFileSync(file, 'utf-8');

  // Guard 1 — gold text on light contexts (original rule, kept)
  for (const m of content.matchAll(/color:\s*(var\(--gold\)|#C8A84B)/g)) {
    const lineStart = content.lastIndexOf('\n', m.index!) + 1;
    const line = content.slice(lineStart, content.indexOf('\n', m.index!));
    if (/border|background|outline|shadow/.test(line)) continue;
    const ctx = content.slice(Math.max(0, m.index! - 500), m.index! + 200).toLowerCase();
    const darkCtx = ['footer','green','dark','hero','home-picks','sticky','overlay','trust-','quick-answer','exit-intent','.sb','cat-hero','result-num','email-strip','privacy','backdrop'].some(d => ctx.includes(d)) || ctx.includes('rgba(255,255,255') || ctx.includes('color:#fff') || ctx.includes('color: #fff');
    if (!darkCtx) { console.error(`⚠️  ${file}: var(--gold) used as text outside a dark context — use var(--gold-text)`); warnings++; }
  }

  // Guard 2a — CSS declaration blocks with both background and color
  for (const m of content.matchAll(/\{([^{}]*)\}/g)) {
    const block = m[1];
    const bg = block.match(/background(?:-color)?:\s*([^;]+);/)?.[1];
    const fg = block.match(/(?:^|[^-])color:\s*([^;]+);/)?.[1];
    if (!bg || !fg || /gradient|url\(|transparent|inherit|currentColor/.test(bg + fg)) continue;
    const r = contrast(bg, fg);
    if (r !== null && r < 3) flag(file, 'CSS block', bg.trim().slice(0,28), fg.trim().slice(0,28), r);
  }

  // Guard 2b — inline style="" attributes with both
  for (const m of content.matchAll(/style="([^"]*)"/g)) {
    const s = m[1];
    const bg = s.match(/background(?:-color)?:\s*([^;"]+)/)?.[1];
    const fg = s.match(/(?:^|;)\s*color:\s*([^;"]+)/)?.[1];
    if (!bg || !fg || /gradient|url\(|transparent|inherit/.test(bg + fg)) continue;
    const r = contrast(bg, fg);
    if (r !== null && r < 3) flag(file, 'inline style', bg.trim().slice(0,28), fg.trim().slice(0,28), r);
  }
}

// Guard 3 — bulletproof block must survive
if (!rootCss.includes('CONTRAST BULLETPROOFING')) {
  console.error('⚠️  global.css: the CONTRAST BULLETPROOFING block was removed — restore it.');
  warnings++;
}

if (warnings > 0) { console.error(`\n❌ ${warnings} contrast problem(s).`); process.exit(1); }
console.log('✅ Contrast checks passed (gold-on-light + dark-on-dark pair scan + bulletproof block present).');
