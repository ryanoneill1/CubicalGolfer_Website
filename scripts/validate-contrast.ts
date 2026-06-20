#!/usr/bin/env node
/**
 * validate-contrast.ts — Gold-on-light guard
 * 
 * Scans src/ for color:var(--gold) or #C8A84B used as TEXT color
 * and flags any instance that appears to be on a light background.
 * 
 * Usage: npx tsx scripts/validate-contrast.ts
 * 
 * Rule: var(--gold) is only AA-compliant on dark surfaces (green/green-card).
 *       On white/cream/cream-dark, use var(--gold-text) instead.
 *       Border-color and background-color uses of --gold are fine.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = 'src';
const GOLD_PATTERN = /color:\s*var\(--gold\)|color:\s*#C8A84B|color:#C8A84B/g;
const DARK_CONTEXTS = [
  'footer', 'green', 'dark', 'hero', 'email-strip', 'quick-answer',
  'home-picks', 'result-num', 'privacy', 'exit-intent', 'sticky', '.sb',
  'trust-', 'cat-hero', 'overlay', 'backdrop',
];

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(astro|css|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let warnings = 0;
for (const file of walk(SRC)) {
  const content = fs.readFileSync(file, 'utf-8');
  let m: RegExpExecArray | null;
  GOLD_PATTERN.lastIndex = 0;
  while ((m = GOLD_PATTERN.exec(content)) !== null) {
    // Skip border-color / background-color / outline
    const lineStart = content.lastIndexOf('\n', m.index) + 1;
    const lineEnd = content.indexOf('\n', m.index);
    const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (/border|background|outline|shadow/.test(line)) continue;

    // Check if context suggests dark background
    const ctx = content.slice(Math.max(0, m.index - 200), m.index + 200).toLowerCase();
    const isDark = DARK_CONTEXTS.some(d => ctx.includes(d));
    if (!isDark) {
      const lineNum = content.slice(0, m.index).split('\n').length;
      console.warn(`⚠️  ${file}:${lineNum} — var(--gold) as text color, possibly on light bg`);
      console.warn(`   Use var(--gold-text) on white/cream surfaces for AA compliance`);
      warnings++;
    }
  }
}

if (warnings > 0) {
  console.log(`\n⚠️  ${warnings} potential gold-on-light text color(s). Review and fix.`);
} else {
  console.log('✅ No var(--gold) text on light surfaces detected.');
}
