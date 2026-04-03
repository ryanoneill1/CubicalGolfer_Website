#!/usr/bin/env node
/**
 * fix-cons.js
 * Run after build: fixes single-character <li> items that result from 
 * iterating over a string instead of an array in the page generator.
 * Collapses sequences of <li>X</li> (single char) into <li>Full string</li>
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST = './dist';
let totalFixed = 0;

function fixSingleCharLis(html) {
  // Find sequences of 3+ consecutive single-character <li> elements and collapse them
  return html.replace(
    /(<li[^>]*>[^<]{1}<\/li>\s*){3,}/g,
    (match) => {
      const chars = [...match.matchAll(/<li[^>]*>([^<]{1})<\/li>/g)].map(m => m[1]);
      const word = chars.join('').trim();
      return `<li>${word}</li>`;
    }
  );
}

function walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtml(full);
    } else if (entry.endsWith('.html')) {
      const original = readFileSync(full, 'utf8');
      const fixed = fixSingleCharLis(original);
      if (fixed !== original) {
        writeFileSync(full, fixed, 'utf8');
        totalFixed++;
        console.log(`[fix-cons] Fixed: ${entry}`);
      }
    }
  }
}

walkHtml(DIST);
if (totalFixed > 0) {
  console.log(`[fix-cons] Fixed single-char cons in ${totalFixed} files`);
} else {
  console.log('[fix-cons] No broken cons found - all clean');
}
