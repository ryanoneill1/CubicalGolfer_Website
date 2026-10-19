/**
 * validate-page-rhythm.ts — Sprint 190
 *
 * WHY THIS EXISTS, AND WHY THE OLD CHECK MISSED IT
 * Ryan reported the Previous/Next cards sitting flush against the top edge of
 * the related-guides band at the bottom of articles. They were, on 190 pages.
 *
 * validate-home-rhythm existed and was green the whole time, because it looked
 * at <section> elements ON THE HOMEPAGE ONLY. The Previous/Next block is a
 * <nav> on article pages. It was never in scope. A check narrower than the
 * thing it is named after is how 190 pages ship a defect nobody sees.
 *
 * THE RULE
 * A top-level block that has NO background of its own, and no bottom spacing,
 * sitting directly before a block that DOES have a background: its content
 * ends exactly where the next colour begins. Padding inside the next band does
 * not help — the boundary is already at the previous block's last line.
 *
 * FOUR THINGS IT MUST GET RIGHT, each learned by getting it wrong first:
 *   1. @media nesting. A regex rule-splitter desynchronises after the first
 *      @media block and then resolves almost nothing; it reported null for
 *      .exit-intent, .freshness-banner and four others, which silently became
 *      "zero spacing" and produced false alarms. The walker is brace-depth
 *      aware.
 *   2. Inlined page CSS. Astro inlines small <style> blocks into the HTML
 *      head, so the stylesheet files alone do not contain every rule.
 *   3. Inline style attributes. .articles-section carries its background
 *      inline; reading only class rules called it backgroundless and flagged
 *      a correct page.
 *   4. The NEXT block's own top margin. The cream-dark card on course pages
 *      has margin-top:40px inline — a real gap — and ignoring it produced two
 *      more false alarms.
 * First pass: 9 cases. After all four fixes: 3 real ones.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('dist')) {
  console.log('validate-page-rhythm: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

/** brace-depth-aware rule walker; handles @media / @supports nesting */
function walkRules(css: string, cb: (sel: string, body: string) => void) {
  let i = 0, buf = '';
  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const head = buf.trim(); buf = '';
      if (head.startsWith('@')) { i++; continue; }
      let d = 1, j = i + 1;
      for (; j < css.length; j++) { if (css[j] === '{') d++; else if (css[j] === '}') { d--; if (d === 0) break; } }
      cb(head, css.slice(i + 1, j));
      i = j + 1; continue;
    } else if (ch === '}') { buf = ''; }
    else buf += ch;
    i++;
  }
}

const stripNot = (sel: string): string => {
  let out = '', i = 0;
  while (i < sel.length) {
    const at = sel.indexOf(':not(', i);
    if (at < 0) { out += sel.slice(i); break; }
    out += sel.slice(i, at);
    let d = 0, j = at + 4;
    for (; j < sel.length; j++) { if (sel[j] === '(') d++; else if (sel[j] === ')') { d--; if (d === 0) { j++; break; } } }
    out += ' '; i = j;
  }
  return out;
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const px = (t?: string | null) => {
  if (t == null) return null;
  if (t.trim() === '0') return 0;
  const m = /^(-?[\d.]+)px$/.exec(t.trim());
  return m ? parseFloat(m[1]) : null;
};
const bottomOf = (sh: string | null): number | null => {
  if (!sh) return null;
  const t: string[] = []; let d = 0, c = '';
  for (const ch of sh) {
    if (ch === '(') d++; if (ch === ')') d--;
    if (/\s/.test(ch) && d === 0) { if (c) { t.push(c); c = ''; } } else c += ch;
  }
  if (c) t.push(c);
  return t.length >= 3 ? px(t[2]) : px(t[0]);
};

const sheet = readdirSync('dist/_astro').filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join('dist/_astro', f), 'utf8')).join('\n');

const pages: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const q = join(d, e.name);
    if (e.isDirectory()) walk(q);
    else if (e.name === 'index.html') pages.push(q);
  }
})('dist');

const bad = new Map<string, Set<string>>();
for (const f of pages) {
  const h = readFileSync(f, 'utf8');
  const inline = [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const rules: Array<{ sel: string; body: string }> = [];
  walkRules(sheet + '\n' + inline, (sel, body) => rules.push({ sel, body }));
  const decl = (cls: string, prop: string): string | null => {
    const want = new RegExp(`\\.${esc(cls)}(?![a-zA-Z0-9_-])`);
    let last: string | null = null;
    for (const r of rules) {
      if (!want.test(stripNot(r.sel))) continue;
      const d = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`).exec(r.body);
      if (d) last = d[1].trim();
    }
    return last;
  };

  const body = h.slice(h.indexOf('<body'));
  const blocks: Array<{ cls: string[]; style: string }> = [];
  let depth = 0, m: RegExpExecArray | null;
  const re = /<(\/?)(section|nav|aside|div|footer|header)\b([^>]*)>/g;
  while ((m = re.exec(body))) {
    if (m[1] === '/') { depth--; continue; }
    if (depth === 0) {
      blocks.push({
        cls: (/class="([^"]*)"/.exec(m[3])?.[1] ?? '').split(/\s+/).filter(Boolean),
        style: /style="([^"]*)"/.exec(m[3])?.[1] ?? '',
      });
    }
    if (!/\/>$/.test(m[0])) depth++;
  }

  for (let i = 0; i < blocks.length - 1; i++) {
    const A = blocks[i], B = blocks[i + 1];
    if (!A.cls.length || !B.cls.length) continue;
    const a = A.cls[0], b = B.cls[0];
    const pos = decl(a, 'position');
    if (pos === 'fixed' || pos === 'absolute' || pos === 'sticky') continue;
    if (decl(a, 'display') === 'none') continue;

    const inPad = /(?:^|;)\s*padding\s*:\s*([^;]+)/.exec(A.style)?.[1] ?? null;
    const inMar = /(?:^|;)\s*margin\s*:\s*([^;]+)/.exec(A.style)?.[1] ?? null;
    const aBottom = (px(decl(a, 'padding-bottom')) ?? bottomOf(inPad ?? decl(a, 'padding')) ?? 0)
                  + (px(decl(a, 'margin-bottom'))  ?? bottomOf(inMar ?? decl(a, 'margin'))  ?? 0);
    if (aBottom !== 0) continue;

    const bTopInline = /(?:^|;)\s*margin-top\s*:\s*(\d+)px/.exec(B.style)?.[1];
    if (bTopInline && parseInt(bTopInline, 10) >= 32) continue;

    const aBg = /(?:^|;)\s*background[^:]*:\s*([^;]+)/.exec(A.style)?.[1] ?? decl(a, 'background');
    const bBg = /(?:^|;)\s*background[^:]*:\s*([^;]+)/.exec(B.style)?.[1] ?? decl(b, 'background');
    if (aBg) continue;              // A owns a band: a colour boundary is the design
    if (!bBg || bBg === aBg) continue;

    const k = `.${a}  ->  .${b}  (${bBg})`;
    if (!bad.has(k)) bad.set(k, new Set());
    bad.get(k)!.add(f.replace('dist/', '').replace('/index.html', ''));
  }
}

console.log('');
if (bad.size) {
  const total = new Set<string>();
  for (const v of bad.values()) for (const p of v) total.add(p);
  console.log(`❌ Page rhythm: ${bad.size} block pair(s) on ${total.size} page(s) end flush against a coloured band.`);
  [...bad].sort((x, y) => y[1].size - x[1].size).forEach(([k, v]) =>
    console.log(`   ${String(v.size).padStart(4)} pages   ${k}\n              e.g. /${[...v][0]}/`));
  console.log('');
  console.log('   The first block has no background of its own and no bottom spacing, so');
  console.log('   its last line sits exactly where the next colour starts. Give it a');
  console.log('   padding-bottom or margin-bottom.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Page rhythm: no block ends flush against a coloured band across ${pages.length} page(s).`);
