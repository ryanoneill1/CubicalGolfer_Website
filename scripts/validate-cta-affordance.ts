#!/usr/bin/env node
/**
 * Guard: a page that carries affiliate links must offer at least one of them
 * as a button, not only as text.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * The Search Console audit (9 Oct 2026) found the site's biggest page —
 * /golf-ball-compression-chart/, 37% of all clicks — monetising through 66
 * low-salience "Check price →" text links and exactly one real button, while
 * a page with 5% of its traffic carried thirty. Sprint 160 fixed that page and
 * Sprint 164 fixed the five standalone brand charts, which were the same
 * defect in a shared component.
 *
 * Nothing stopped either from happening, and nothing stopped it recurring. A
 * new table, or a copy of an old one, inherits the text-link pattern silently.
 *
 * ── What it asserts, and what it deliberately does not ─────────────────────
 * It asserts the INVARIANT — "the reader is offered something that looks
 * clickable" — not a class name. Buttons on this site are built two ways: the
 * shared .cmp-buy-btn / .aff-cta__btn classes, and inline styles on the tool
 * pages (/golf-ball-finder/, /launch-monitor-room-checker/,
 * /club-distance-calculator/). Both are real buttons to a reader, so both
 * count. An earlier class-only count of this same thing reported eleven broken
 * pages when only five were broken; the six false positives were all
 * inline-styled buttons. Measuring the rendered affordance, not the source
 * convention, is the whole point.
 *
 * It does NOT assert a button-to-link ratio. The compression chart's 36-row
 * table is correct at 36 buttons; a prose review that mentions a product
 * mid-sentence is correct with one button at the end. A ratio would be a
 * number to argue with rather than an invariant.
 *
 * Ceiling 1: /gear-quiz/ builds its result card in client-side JavaScript, so
 * the static HTML has a sponsored href in a <script> and no rendered button.
 * The button exists for the reader; it does not exist for a file reader.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const CEILING = 1;
const KNOWN = new Set(['/gear-quiz/']);

function pages(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) pages(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const bare: string[] = [];
let withLinks = 0;
let buttons = 0;

for (const file of pages(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  // Article body only — header/footer chrome carries no product links, but
  // scoping keeps the check honest if that ever changes.
  const body = html.includes('<main')
    ? html.split('<main')[1].split('</main>')[0]
    : html;

  const anchors = (body.match(/<a\b[^>]{0,900}?>/gs) || [])
    .filter(a => a.includes('sponsored'));
  if (!anchors.length) continue;
  withLinks++;

  const asButton = anchors.filter(a =>
    /class="[^"]*(btn|cta)/.test(a) ||
    (/background\s*:/.test(a) && /padding\s*:/.test(a))
  );
  buttons += asButton.length;

  if (!asButton.length) {
    const url = '/' + path.relative(DIST, file).replace(/index\.html$/, '');
    bare.push(url);
  }
}

const unexpected = bare.filter(u => !KNOWN.has(u));

if (unexpected.length || bare.length > CEILING) {
  console.error(
    `\n❌ ${bare.length} page(s) carry affiliate links with no button (ceiling ${CEILING}):`
  );
  for (const u of bare) console.error(`   ${u}${KNOWN.has(u) ? '  (known)' : ''}`);
  console.error(
    `\n   A text link in a table converts worse than a button and this was the\n` +
    `   single largest monetisation defect the 9 Oct audit found. Give the page\n` +
    `   at least one real button — .cmp-buy-btn in a table Buy column, or\n` +
    `   .aff-cta__btn in prose.\n`
  );
  process.exit(1);
}

console.log(
  `✅ CTA affordance: ${withLinks} page(s) with affiliate links, ` +
  `${buttons} rendered button(s); ${bare.length} without a button (ceiling ${CEILING}).`
);
