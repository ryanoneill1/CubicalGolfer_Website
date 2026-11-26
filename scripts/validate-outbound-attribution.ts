#!/usr/bin/env node
/**
 * validate-outbound-attribution.ts — does each buy button say where it goes?
 *
 * ── Why this reads dist/ and not src/ ──────────────────────────────────────
 * The bug this exists to stop lived inside a COMPONENT. RecommendedGearGrid
 * classified a retailer from the hostname, and every Golf Galaxy link in this
 * repo is a CJ redirect whose hostname is www.tkqlhce.com or a sibling. So it
 * resolved to 'other' and rendered the words "Check Price at Retailer" on 17
 * live buttons across seven pages, while 38 sponsored links reported the wrong
 * shop to the click dashboard.
 *
 * Every source-level check passed throughout, because the source was one
 * expression in one file and the damage was in the output. Same lesson as the
 * standalone-page blind spot in Sprint 269: check what ships.
 *
 * ── The two things it refuses ──────────────────────────────────────────────
 *   1. A sponsored anchor whose data-outbound disagrees with its own href,
 *      judged on the DESTINATION — a CJ wrapper is decoded first, so a product
 *      name in a query string cannot outvote the real shop.
 *   2. A visible button label containing the word "Retailer". A buy button
 *      that will not name the shop is the one element on an affiliate page
 *      that has to be plain.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { retailerOf } from '../src/lib/retailer';

const problems: string[] = [];
let anchors = 0, files = 0;

function pages(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const SPONSORED = /<a\b[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g;
const SAYS_RETAILER = /Check Price at Retailer|Also at Retailer/;

for (const f of pages('dist')) {
  const html = readFileSync(f, 'utf8');
  files++;
  const slug = f.replace(/^dist[\\/]/, '').replace(/[\\/]index\.html$/, '') || '/';

  for (const m of html.matchAll(SPONSORED)) {
    const tag = m[0];
    const href = (tag.match(/href="([^"]+)"/) || [])[1];
    const tagged = (tag.match(/data-outbound="([^"]+)"/) || [])[1];
    if (!href || !tagged) continue;
    anchors++;
    const actual = retailerOf(href);
    if (actual !== 'other' && tagged !== actual) {
      const name = (tag.match(/data-aff-name="([^"]+)"/) || [])[1] || '(unnamed)';
      problems.push('   ' + slug + ' — "' + name + '" is tagged ' + tagged + ' but the link goes to ' + actual);
    }
  }

  if (SAYS_RETAILER.test(html)) {
    problems.push('   ' + slug + ' — a buy button reads "Retailer" instead of naming the shop');
  }
}

if (problems.length) {
  console.error('\n\u274c Outbound attribution: ' + problems.length + ' problem(s) across ' + files + ' built page(s).\n');
  [...new Set(problems)].slice(0, 25).forEach(p => console.error(p));
  console.error(
    '\n   Use retailerOf() from src/lib/retailer.ts. It decodes the CJ wrapper and\n' +
    '   judges the destination, so a product name in a query string cannot outvote\n' +
    '   the real shop. Never type a retailer into an attribute by hand.\n',
  );
  process.exit(1);
}
console.log('\u2705 Outbound attribution: ' + anchors + ' sponsored anchor(s) across ' + files + ' built page(s) all name the shop they reach.');
