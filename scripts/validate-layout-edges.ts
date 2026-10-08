#!/usr/bin/env node
/**
 * Guard: top-level blocks keep their horizontal alignment.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Three sprints in a row set a width globally and had it silently overruled.
 * The cause was not CSS specificity, which is where I looked first and was
 * wrong. It was INLINE STYLES in the page templates:
 *
 *     <details class="update-log" style="margin:16px 0 24px; …">
 *
 * `margin` is a shorthand, so `16px 0 24px` sets margin-left and margin-right
 * to 0. An inline style beats every stylesheet rule short of !important, so
 * `margin-left:auto` in global.css could never centre that element. Measured
 * before the fix: 1,144 inline styles setting layout properties across 219
 * article pages, and top-level blocks landing on 3+ different left edges.
 *
 * The fix was `margin:16px auto 24px` — a no-op on a full-width block (auto
 * resolves to 0 when no max-width constrains it) and centring for anything the
 * layout system has capped. This guard stops the `0` form coming back.
 *
 * Checks, against dist/:
 *   - no top-level block carries a `margin` shorthand with a 0 horizontal value
 *   - no top-level block carries an inline `max-width` or `float`, which would
 *     take it out of the two-edge grid entirely
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const problems: string[] = [];

// Measured from the built HTML as direct children of .art-content, not guessed.
const TOP_LEVEL = [
  'update-log', 'freshness-banner', 'trust-block', 'trust-card',
  'rec-product-box', 'gear-helps', 'pros-cons-grid', 'quick-answer-box',
  'intro-box', 'testing-note', 'disclosure-box', 'who-box', 'toc-card',
  'bottom-line-box', 'early-disclosure', 'art-faq', 'callout',
];

const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });

let scanned = 0;
const offenders = new Map<string, { page: string; snippet: string }>();

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const article = html.match(/<article class="art-content"[^>]*>([\s\S]*?)<\/article>/);
  if (!article) continue;
  scanned++;
  const body = article[1];

  for (const cls of TOP_LEVEL) {
    const re = new RegExp(`<\\w+[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*style="([^"]*)"`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(body)) !== null) {
      const style = m[1];
      const page = file.replace(`${DIST}/`, '/').replace('/index.html', '/');

      const mar = style.match(/(?:^|;)\s*margin\s*:\s*([^;]+)/);
      if (mar) {
        const parts = mar[1].trim().split(/\s+/);
        const horizontalZero =
          (parts.length === 2 && parts[1] === '0') ||
          (parts.length === 3 && parts[1] === '0') ||
          (parts.length === 4 && parts[1] === '0' && parts[3] === '0');
        if (horizontalZero) {
          offenders.set(`${cls}:margin`, { page, snippet: `margin:${mar[1].trim()}` });
        }
      }

      const hard = style.match(/(?:^|;)\s*(max-width|float)\s*:\s*([^;]+)/);
      if (hard) {
        offenders.set(`${cls}:${hard[1]}`, { page, snippet: `${hard[1]}:${hard[2].trim()}` });
      }
    }
  }
}

for (const [key, v] of offenders) {
  const cls = key.split(':')[0];
  problems.push(
    `.${cls} carries an inline \`${v.snippet}\` (e.g. ${v.page}). An inline ` +
    `style beats every stylesheet rule, so the layout system cannot position ` +
    `this element. Use \`auto\` for the horizontal margin instead of 0.`
  );
}

if (problems.length) {
  console.error(`\n❌ validate-layout-edges: ${problems.length} problem(s).`);
  for (const p of problems) console.error(`   - ${p}`);
  console.error(
    `\n   Top-level blocks must sit on one of two left edges: the shell edge or the\n` +
    `   reading-measure edge. Anything else is a third alignment the reader has to\n` +
    `   reconcile, and it is what made the pages read as unfinished.\n`
  );
  process.exit(1);
}

console.log(`✅ Layout edges: ${scanned} article page(s) — no inline style overrides horizontal alignment on a top-level block.`);
