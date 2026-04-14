#!/usr/bin/env node
/**
 * scripts/stamp-build.js
 * Injects a unique <meta name="build-id"> into every HTML file after the Astro build.
 * This forces Cloudflare Worker Assets to detect changed content and upload fresh files.
 * Run automatically as part of: npm run build
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const BUILD_ID = Date.now().toString(36);
const DIST = './dist';
let stamped = 0;

function walkHtml(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkHtml(full);
    } else if (entry.endsWith('.html')) {
      let html = readFileSync(full, 'utf8');
      if (!html.includes('build-id')) {
        html = html.replace('</head>', `<meta name="build-id" content="${BUILD_ID}"></head>`);
        writeFileSync(full, html, 'utf8');
        stamped++;
      }
    }
  }
}

walkHtml(DIST);
console.log(`[stamp-build] Stamped ${stamped} HTML files with build-id: ${BUILD_ID}`);
