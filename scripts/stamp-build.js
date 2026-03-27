#!/usr/bin/env node
/**
 * scripts/stamp-build.js
 *
 * CRITICAL DEPLOYMENT FIX
 * Cloudflare Worker Assets skips uploading files if SHA-256 hash matches.
 * This injects a UNIQUE random token into every HTML file post-build,
 * guaranteeing a different hash every time so Cloudflare always uploads fresh.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

const timestamp = Date.now().toString(36);
const random = randomBytes(8).toString('hex');
const BUILD_TOKEN = `${timestamp}-${random}`;
const DIST = './dist';
let stamped = 0;

function walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtml(full);
    } else if (entry.endsWith('.html')) {
      let html = readFileSync(full, 'utf8');
      // Remove any previous stamp to avoid accumulation
      html = html.replace(/<meta name="build-id"[^>]*>/g, '');
      // Inject fresh unique stamp
      html = html.replace('</head>', `<meta name="build-id" content="${BUILD_TOKEN}"></head>`);
      writeFileSync(full, html, 'utf8');
      stamped++;
    }
  }
}

walkHtml(DIST);
console.log(`[stamp-build] Stamped ${stamped} HTML files | token: ${BUILD_TOKEN}`);
