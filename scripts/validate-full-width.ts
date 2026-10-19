/**
 * validate-full-width.ts — Sprint 189
 *
 * THE DECISION THIS PROTECTS
 * Ryan chose full-width body copy on 18 Oct 2026, after seeing all three
 * options rendered in a live resizable demo and this table:
 *      375px   37 -> 37 chars/line   phones IDENTICAL (the 722px cap never
 *      430px   43 -> 43              applied on a screen narrower than it)
 *     1024px   70 -> 101
 *     1440px   70 -> 127             WCAG 1.4.8 guidance is 80
 * Eleven capping rules in global.css plus one in AffiliateCTA.astro were set
 * to 100%. This check stops them creeping back, because every one of them was
 * added deliberately by an earlier sprint and the comments arguing for them
 * are still in the file.
 *
 * WHY IT SCANS COMPONENTS TOO
 * The first pass edited only global.css and left .aff-cta — the affiliate CTA
 * box, the exact element Ryan reported — still capped, because its rule lives
 * in AffiliateCTA.astro's own <style> block. Scanning one stylesheet is how
 * that was missed. This reads the BUILT css, which contains all of it.
 *
 * DELIBERATELY STILL CAPPED (not failures):
 *   .btn-gold            a button; 1300px wide is not a button
 *   .product-img-wrap    a product photo; stretching it blows the image up
 *   .email-strip__inner  the capture strip has its own deliberate width
 *   .footer-brand/-disc  footer chrome, outside the article
 *   .privacy-notice__inner  the one-time banner
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('dist')) {
  console.log('validate-full-width: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const ALLOWED = new Set([
  'btn-gold', 'product-img-wrap', 'email-strip__inner',
  'footer-brand', 'footer-disc', 'privacy-notice__inner',
]);

const css = readdirSync('dist/_astro').filter(f => f.endsWith('.css'))
  .map(f => readFileSync(join('dist/_astro', f), 'utf8')).join('\n').replace(/\s+/g, ' ');

const pages: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const q = join(d, e.name);
    if (e.isDirectory()) walk(q);
    else if (e.name === 'index.html') pages.push(q);
  }
})('dist');

// every class that appears inside an article / comparison body
const used = new Set<string>();
for (const f of pages) {
  const h = readFileSync(f, 'utf8');
  for (const wrap of ['art-content', 'compare-body', 'local-body']) {
    const i = h.indexOf(`class="${wrap}`);
    if (i < 0) continue;
    const end = h.indexOf('</article>', i);
    const region = h.slice(i, end > 0 ? end : i + 200000);
    for (const m of region.matchAll(/class="([^"]*)"/g))
      m[1].split(/\s+/).filter(Boolean).forEach(c => used.add(c));
  }
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Remove :not(...) before deciding whether a rule TARGETS a class.
 * Two failed attempts, both recorded because each produced a confident green:
 *  1. No stripping at all: .aff-cta read as 100% because it appears inside the
 *     :not(:is(...)) exclusion on the prose rule, whose body DOES say 100%.
 *     The class is excluded there, not targeted.
 *  2. Stripping with /:not\([^()]*\)/ — which cannot match `:not(:is(.a,.b))`,
 *     because the nested parens break [^()]*. The real selector in this
 *     stylesheet is exactly that shape, so the fix changed nothing and a
 *     deliberate probe still passed.
 * Parens are balanced by hand below, which handles any nesting depth. */
const stripNot = (sel: string): string => {
  let out = '', i = 0;
  while (i < sel.length) {
    const at = sel.indexOf(':not(', i);
    if (at < 0) { out += sel.slice(i); break; }
    out += sel.slice(i, at);
    let depth = 0, j = at + 4;                 // sits on the '('
    for (; j < sel.length; j++) {
      if (sel[j] === '(') depth++;
      else if (sel[j] === ')') { depth--; if (depth === 0) { j++; break; } }
    }
    out += ' ';
    i = j;
  }
  return out;
};

/** last-wins max-width for a class, ignoring rules that merely exclude it */
const capOf = (c: string): string | null => {
  const re = /(?:^|\})\s*([^{}]+)\{([^}]*)\}/g;
  const want = new RegExp(`\\.${esc(c)}(?![a-zA-Z0-9_-])`);
  let m: RegExpExecArray | null, last: string | null = null;
  while ((m = re.exec(css))) {
    if (!want.test(stripNot(m[1]))) continue;
    const d = /(?:^|;)\s*max-width\s*:\s*([^;]+)/.exec(m[2]);
    if (d) last = d[1].trim();
  }
  return last;
};

const offenders: Array<[string, string]> = [];
for (const c of used) {
  if (ALLOWED.has(c)) continue;
  const v = capOf(c);
  if (v && v !== '100%' && v !== 'none' && !/var\(--content-w\)/.test(v)) offenders.push([c, v]);
}

console.log('');
if (offenders.length) {
  console.log(`❌ Full width: ${offenders.length} element(s) in the article body are capped below full width.`);
  offenders.sort().forEach(([c, v]) => console.log(`   .${c.padEnd(28)} ${v}`));
  console.log('');
  console.log('   Ryan chose full-width body copy deliberately. If one of these genuinely');
  console.log('   should stay narrow (a button, an image), add it to ALLOWED in this file');
  console.log('   with the reason. Do not re-cap body copy without asking him.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Full width: every article-body element spans the container across ${pages.length} page(s); ${ALLOWED.size} deliberate exceptions (buttons, images, footer chrome).`);
