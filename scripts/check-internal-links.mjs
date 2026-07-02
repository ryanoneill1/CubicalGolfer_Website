/**
 * check-internal-links.mjs
 * After build: extracts every internal href from dist/ HTML files,
 * verifies each resolves to an actual file. Exits nonzero if broken.
 *
 * Usage: node scripts/check-internal-links.mjs
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const DIST = 'dist';

// Collect all files/dirs in dist
const pages = new Set();
function walk(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) {
      pages.add('/' + relative(DIST, p).replace(/\\/g, '/') + '/');
      walk(p);
    } else {
      pages.add('/' + relative(DIST, p).replace(/\\/g, '/'));
    }
  }
}
walk(DIST);

// Check internal hrefs
const broken = new Map();
const hrefRe = /href="(\/[^"#?]*?)"/g;

function checkFile(file, pagePath) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    let target = m[1];
    // For paths without extensions, check both with and without trailing slash
    if (!target.includes('.')) {
      const withSlash = target.endsWith('/') ? target : target + '/';
      const asIndex = withSlash + 'index.html';
      if (pages.has(withSlash) || pages.has(asIndex) || pages.has(target)) continue;
    } else {
      if (pages.has(target)) continue;
    }
    const key = `${pagePath} → ${target}`;
    broken.set(key, (broken.get(key) || 0) + 1);
  }
}

function walkCheck(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walkCheck(p);
    else if (f.name === 'index.html') {
      const rel = '/' + relative(DIST, dir).replace(/\\/g, '/') + '/';
      checkFile(p, rel);
    }
  }
}
walkCheck(DIST);

if (broken.size > 0) {
  console.error(`\n❌ ${broken.size} broken internal link(s):\n`);
  for (const [link, count] of broken) {
    console.error(`  ${link}` + (count > 1 ? ` (×${count})` : ''));
  }
  process.exit(1);
} else {
  console.log(`✅ 0 broken internal links (${pages.size} paths checked)`);
}
