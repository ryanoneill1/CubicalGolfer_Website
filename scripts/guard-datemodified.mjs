/**
 * guard-datemodified.mjs
 *
 * Prevents dishonest dateModified bumps by tracking content hashes.
 *
 * HOW IT WORKS:
 * 1. Computes a SHA-256 hash of each article's content body (intro + section
 *    bodies + FAQ answers — the fields that constitute "real content").
 * 2. Stores hashes in scripts/data/content-hashes.json.
 * 3. On each run, compares current content hashes to stored ones.
 * 4. If an article's dateModified changed BUT its content hash did NOT,
 *    that's a cosmetic date bump — the script warns and exits nonzero.
 *
 * USAGE:
 *   node --loader tsx scripts/guard-datemodified.mjs       # check mode (CI)
 *   node --loader tsx scripts/guard-datemodified.mjs --save # update hashes after real edits
 *
 * Wire into CI or pre-commit:
 *   "prebuild": "node --loader tsx scripts/guard-datemodified.mjs"
 *
 * NOTE: This script does NOT retroactively change existing dates.
 * Google has already crawled them; rolling back silently creates a
 * second inconsistency. Going forward, it simply enforces honesty.
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// Dynamic import for tsx compatibility
const { ARTICLES } = await import('../src/data/articles.ts');

const HASH_FILE = 'scripts/data/content-hashes.json';
const saveMode = process.argv.includes('--save');

/** Hash the "real content" of an article — fields a reader sees. */
function contentHash(article) {
  const parts = [];

  // Intro
  parts.push(article.intro || '');

  // Section bodies
  for (const s of article.sections || []) {
    parts.push(s.h2 || '');
    parts.push(s.body || '');
  }

  // FAQ answers
  for (const f of article.faq || []) {
    parts.push(f.q || '');
    parts.push(f.a || '');
  }

  // Bottom line
  parts.push(article.bottomLine || '');

  const raw = parts.join('|||');
  return createHash('sha256').update(raw).digest('hex').substring(0, 16);
}

// Load previous hashes (if they exist)
let prevHashes = {};
if (existsSync(HASH_FILE)) {
  try {
    prevHashes = JSON.parse(readFileSync(HASH_FILE, 'utf8'));
  } catch { /* first run */ }
}

// Compute current hashes
const currentHashes = {};
const violations = [];

for (const article of ARTICLES) {
  const hash = contentHash(article);
  currentHashes[article.slug] = {
    hash,
    dateModified: article.dateModified,
  };

  // Check for dishonest bumps: dateModified changed but content didn't
  const prev = prevHashes[article.slug];
  if (prev && prev.hash === hash && prev.dateModified !== article.dateModified) {
    violations.push({
      slug: article.slug,
      oldDate: prev.dateModified,
      newDate: article.dateModified,
      hash,
    });
  }
}

// Report
if (violations.length > 0 && !saveMode) {
  console.error('\n❌ dateModified bumped WITHOUT content changes:\n');
  for (const v of violations) {
    console.error(`  ${v.slug}`);
    console.error(`    date: ${v.oldDate} → ${v.newDate}  (content hash unchanged: ${v.hash})`);
  }
  console.error(`\n${violations.length} violation(s). Either:`);
  console.error('  1. Make a real content change to justify the new date, or');
  console.error('  2. Revert dateModified to the previous value, or');
  console.error('  3. Run with --save to accept the new baseline after a justified bulk edit.\n');
  process.exit(1);
}

// Save mode or first run: write current hashes
if (saveMode || !existsSync(HASH_FILE) || Object.keys(prevHashes).length === 0) {
  writeFileSync(HASH_FILE, JSON.stringify(currentHashes, null, 2));
  console.log(`✅ Saved content hashes for ${Object.keys(currentHashes).length} articles to ${HASH_FILE}`);
} else {
  // Check mode passed
  const newArticles = Object.keys(currentHashes).filter(s => !prevHashes[s]);
  const changedContent = Object.keys(currentHashes).filter(s =>
    prevHashes[s] && prevHashes[s].hash !== currentHashes[s].hash
  );

  console.log(`✅ dateModified guard passed (${Object.keys(currentHashes).length} articles checked)`);
  if (newArticles.length) console.log(`   ${newArticles.length} new article(s) — run with --save to baseline them`);
  if (changedContent.length) console.log(`   ${changedContent.length} article(s) with real content changes`);
}
