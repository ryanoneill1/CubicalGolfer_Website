#!/usr/bin/env node
// scripts/check-duplicates.ts
// ─────────────────────────────────────────────────────────────────────────────
// CI guard against the "edit the wrong copy" hazard.
//
// The build consumes exactly one copy of each of these data/lib files:
//   articles.ts        → src/data/articles.ts
//   affiliate-links.ts → src/data/affiliate-links.ts
//   schema.ts          → src/lib/schema.ts
//
// Stale duplicates have previously existed at the repo root and under /data/,
// /lib/ and /courses/src/data/. A change made to one of those never ships,
// which is a silent, expensive failure. This script walks the repo (skipping
// node_modules, dist and other build output) and FAILS the build if any file
// with one of those names exists anywhere other than its canonical path.
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';

const CANONICAL: Record<string, string> = {
  'articles.ts': 'src/data/articles.ts',
  'affiliate-links.ts': 'src/data/affiliate-links.ts',
  'schema.ts': 'src/lib/schema.ts',
};

// Directories that never contain source we own.
const SKIP = new Set(['node_modules', 'dist', '.git', '.astro', '.cache', '.wrangler']);

const root = process.cwd();
const violations: { file: string; canonical: string }[] = [];

function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (entry.name in CANONICAL) {
      const rel = path.relative(root, path.join(dir, entry.name)).split(path.sep).join('/');
      if (rel !== CANONICAL[entry.name]) {
        violations.push({ file: rel, canonical: CANONICAL[entry.name] });
      }
    }
  }
}

walk(root);

if (violations.length > 0) {
  console.error('✗ check-duplicates: found stale/duplicate data files outside their canonical path.\n');
  for (const v of violations) {
    console.error(`  ✗ ${v.file}`);
    console.error(`      the only allowed copy is ${v.canonical} — delete this duplicate.`);
  }
  console.error(
    '\nThese duplicates are a silent-failure hazard: an edit to the wrong copy never ships.\n' +
      'Delete the file(s) above (nothing in the build imports them) and re-run.',
  );
  process.exit(1);
}

// Also confirm every canonical file actually exists.
const missing = Object.values(CANONICAL).filter((p) => !fs.existsSync(path.join(root, p)));
if (missing.length > 0) {
  console.error('✗ check-duplicates: canonical file(s) missing: ' + missing.join(', '));
  process.exit(1);
}

console.log('✓ check-duplicates: no duplicate articles.ts / affiliate-links.ts / schema.ts outside canonical paths.');
