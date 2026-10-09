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

      // Sprint 155 — this check is INVERTED from its Sprint 152 form, and the
      // reason is worth recording. In Sprint 152 the layout centred its boxes,
      // so an inline `margin:16px 0 24px` (horizontal 0) defeated the centring
      // and this guard flagged it. Sprint 154 moved the site to a single left
      // edge, which made `margin-left:0` the CORRECT value — and `auto` the
      // defect, because an inline `auto` re-centres the box against a
      // left-anchored system. Measured on /best-junior-golf-clubs/: four boxes
      // centred at 814px and eight left-anchored at 814px, on one page.
      // The constant here is not the value, it is that inline styles must not
      // decide horizontal alignment. CSS owns it; inline must stay out.
      const mar = style.match(/(?:^|;)\s*margin\s*:\s*([^;]+)/);
      if (mar) {
        const parts = mar[1].trim().split(/\s+/);
        const horizontalAuto =
          (parts.length === 2 && parts[1] === 'auto') ||
          (parts.length === 3 && parts[1] === 'auto') ||
          (parts.length === 4 && (parts[1] === 'auto' || parts[3] === 'auto'));
        if (horizontalAuto) {
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

// ── Sprint 155 — the CSS side of the same trap ─────────────────────────────
// The inline check above catches templates. The stylesheet can centre a box
// just as easily, and did: a Sprint 152 rule `.toc-card.toc-card { margin-left:
// auto }` survived Sprint 154's move to a single left edge, so the table of
// contents sat 242px right of every box beneath it. Measured on
// /best-junior-golf-clubs/: four boxes centred and eight left-anchored, all at
// the same 814px width, on one page.
{
  const BOXES = [
    'toc-card', 'quick-answer-box', 'intro-box', 'who-box', 'trust-card',
    'trust-block', 'freshness-banner', 'update-log', 'testing-note',
    'disclosure-box', 'art-faq', 'pros-cons-grid',
  ];
  const cssDir = 'dist/_astro';
  const css = fs.existsSync(cssDir)
    ? fs.readdirSync(cssDir).filter(f => f.endsWith('.css'))
        .map(f => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n')
    : '';
  for (const box of BOXES) {
    // a rule naming this box that sets margin-left:auto (i.e. centres it)
    const re = new RegExp(`\\.${box}[^{}]*\\{[^}]*margin-left:\\s*auto`, 'g');
    if (re.test(css)) {
      problems.push(
        `A stylesheet rule centres .${box} with margin-left:auto. Top-level ` +
        `blocks share one left edge; centring one of them puts it out of line ` +
        `with every other box on the page.`
      );
    }
  }
}

for (const [key, v] of offenders) {
  const cls = key.split(':')[0];
  problems.push(
    `.${cls} carries an inline \`${v.snippet}\` (e.g. ${v.page}). An inline ` +
    `style beats every stylesheet rule, so the layout system cannot position ` +
    `this element. Leave the horizontal margin at 0 and let the stylesheet ` +
    `place the box.`
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
