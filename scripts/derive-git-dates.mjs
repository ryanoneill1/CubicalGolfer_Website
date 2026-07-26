#!/usr/bin/env node
/**
 * scripts/derive-git-dates.mjs
 * Regenerates git-dates.json — the evidence behind every article date.
 *   first[slug] = date the article's block first appeared in git history
 *   last[slug]  = date its block last changed, excluding remediation commits
 * Run this before scripts/fix-article-dates.mjs after adding new articles.
 */
import { execSync } from 'child_process';
import fs from 'fs';

const CUTOFF = '2026-07-25'; // commits from here are cleanup, not editorial work
const log = execSync('git log --reverse --format=%H|%ad --date=short -- src/data/articles.ts')
  .toString().trim().split('\n');

const first = {}, last = {};
let prev = {};
for (const entry of log) {
  const [h, d] = entry.split('|');
  let txt = '';
  try { txt = execSync(`git show ${h}:src/data/articles.ts`, { maxBuffer: 64 * 1024 * 1024 }).toString(); }
  catch { continue; }
  if (!txt) continue;
  const lines = txt.split('\n');
  const starts = [];
  lines.forEach((l, i) => { if (l === '  {') starts.push(i); });
  starts.push(lines.length);
  const cur = {};
  for (let i = 0; i < starts.length - 1; i++) {
    const blk = lines.slice(starts[i], starts[i + 1]).join('\n');
    const m = blk.match(/slug:\s*'(\/[^']+)'/);
    if (!m) continue;
    cur[m[1]] = blk.length + ':' + blk.slice(0, 400);
    if (!(m[1] in first)) first[m[1]] = d;
  }
  if (d < CUTOFF) for (const [s, v] of Object.entries(cur)) if (prev[s] !== v) last[s] = d;
  prev = cur;
}
fs.writeFileSync('git-dates.json', JSON.stringify({ first, last }, null, 2));
console.log(`git-dates.json: ${Object.keys(first).length} first-seen, ${Object.keys(last).length} last-changed`);
