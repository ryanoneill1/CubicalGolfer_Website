#!/usr/bin/env node
/**
 * scripts/fix-malformed-headings.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Two sections on /arccos-caddie-review/ had a full body paragraph sitting in
 * the `h2` field with no `body` at all (897 and 1,012 characters). Effects:
 *   • the page rendered two paragraph-length <h2> headings
 *   • buyingGuideProductSchema used the h2 as a Product `name`, producing a
 *     1,012-character product name in the JSON-LD
 *
 * Fix: give each a real heading and move the prose into `body`.
 * Idempotent — re-running is a no-op.
 */
import fs from 'fs';
const F = 'src/data/articles.ts';
let s = fs.readFileSync(F, 'utf8');

const FIXES = [
  { startsWith: 'We tracked 864 shots across 6 rounds.', h2: 'Tracking Accuracy Across 864 Shots' },
  { startsWith: 'At $99/year after the initial $179 sensor purchase', h2: 'What Arccos Costs Compared to Lessons' },
];

let fixed = 0;
for (const f of FIXES) {
  // match a section object whose h2 begins with the known prose
  const re = new RegExp(`\\{\\s*h2:\\s*'(${f.startsWith.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[^'\\\\]|\\\\.)*)'`, 'm');
  const m = s.match(re);
  if (!m) continue;
  const prose = m[1];
  s = s.replace(m[0], `{ h2: '${f.h2}', body: '${prose}'`);
  fixed++;
}

fs.writeFileSync(F, s);

const long = (fs.readFileSync(F, 'utf8').match(/h2:\s*'(?:[^'\\]|\\.){200,}'/g) || []).length;
console.log(`sections repaired: ${fixed}`);
console.log(`h2 fields still over 200 chars: ${long} (expect 0)`);
if (long !== 0) process.exit(1);
