#!/usr/bin/env node
/**
 * Guard: redirects must be deployable, and no internal link may be dead.
 *
 * Two bugs this prevents, both of which shipped unnoticed:
 *   1. A _redirects file at the repo root. Astro only copies public/ into dist/,
 *      so a root file is dead code — 43 rules sat there never taking effect.
 *   2. An internal link to a page that no longer exists. A footer link in
 *      BaseLayout.astro pointed at a deleted page, putting a dead link on all
 *      261 pages at once.
 *
 * Runs post-build so it can check the real built output, not the source.
 */
import fs from 'fs';
import path from 'path';

let errors = 0;

// ── 1. stray root _redirects ───────────────────────────────────────────────
// Astro only copies public/ into dist/, so a root _redirects never deploys.
// The DANGER is a rule that exists only there — it silently never takes effect.
// A root file whose rules all also live in public/ is merely dead weight, so it
// warns rather than failing. That distinction matters: a file upload cannot
// delete a file, so a repo legitimately passes through the "uploaded the new
// public/_redirects but haven't deleted the root one yet" state.
const parseRules = (p: string): Map<string, string> => {
  const m = new Map<string, string>();
  if (!fs.existsSync(p)) return m;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const x = s.split(/\s+/);
    if (x.length >= 3 && (x[2] === '301' || x[2] === '302')) m.set(x[0], x[1]);
  }
  return m;
};

if (fs.existsSync('_redirects')) {
  const rootRules = parseRules('_redirects');
  const pubRules = parseRules('public/_redirects');
  const orphaned = [...rootRules.keys()].filter(k => !pubRules.has(k));
  if (orphaned.length > 0) {
    console.error(`✗ ${orphaned.length} redirect rule(s) exist ONLY in the root _redirects file.`);
    console.error('  Astro never copies that file into dist/, so these rules never take effect.');
    console.error('  Merge them into public/_redirects, then delete the root file.');
    for (const o of orphaned.slice(0, 10)) console.error(`      ${o}`);
    errors++;
  } else {
    console.warn('⚠️  A _redirects file exists at the repo root. Every rule in it also exists in');
    console.warn('    public/_redirects, so nothing is lost — but it is dead code. Delete it.');
  }
}

// ── 2. public/_redirects must survive into dist/ ────────────────────────────
const pubPath = 'public/_redirects';
const distPath = 'dist/_redirects';
if (!fs.existsSync(pubPath)) {
  console.error('✗ public/_redirects is missing.'); errors++;
} else if (!fs.existsSync(distPath)) {
  console.error('✗ dist/_redirects is missing — redirects are not being deployed.'); errors++;
} else {
  const count = (p: string) =>
    fs.readFileSync(p, 'utf8').split('\n').filter(l => /^\/\S+\s+\S+\s+30[12]\s*$/.test(l.trim())).length;
  if (count(pubPath) !== count(distPath)) {
    console.error(`✗ rule count mismatch: public/_redirects ${count(pubPath)} vs dist/_redirects ${count(distPath)}`);
    errors++;
  }
}

// ── 3. build the live page set and the redirect map from BUILT output ───────
const live = new Set<string>();
(function walk(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(d, e.name));
    else if (e.name === 'index.html') {
      const rel = path.relative('dist', d).split(path.sep).join('/');
      live.add(rel === '' ? '/' : `/${rel}/`);
    }
  }
})('dist');

const redirects = new Map<string, string>();
if (fs.existsSync(distPath)) {
  for (const line of fs.readFileSync(distPath, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const x = s.split(/\s+/);
    if (x.length >= 3 && (x[2] === '301' || x[2] === '302')) redirects.set(x[0], x[1]);
  }
}

// ── 4. a redirect must never shadow a live page ────────────────────────────
for (const [from] of redirects) {
  if (live.has(from)) {
    console.error(`✗ ${from} is a built page but is also redirected away — the page is unreachable.`);
    errors++;
  }
}

// ── 5. no redirect chains, loops, or dead-end targets ──────────────────────
for (const [from, to] of redirects) {
  if (to === from) { console.error(`✗ self-redirect: ${from}`); errors++; }
  else if (redirects.has(to)) { console.error(`✗ redirect chain: ${from} -> ${to} -> ${redirects.get(to)}`); errors++; }
  else if (!to.includes(':') && !to.startsWith('http') && !live.has(to)) {
    console.error(`✗ redirect target does not exist: ${from} -> ${to}`); errors++;
  }
}

// ── 6. no internal link may be dead ────────────────────────────────────────
const dead = new Map<string, number>();
(function scan(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) scan(path.join(d, e.name));
    else if (e.name === 'index.html') {
      const html = fs.readFileSync(path.join(d, e.name), 'utf8');
      for (const m of new Set(html.match(/href="\/[a-z0-9\-/]*\/"/g) ?? [])) {
        const u = m.slice(6, -1);
        if (!live.has(u) && !redirects.has(u)) dead.set(u, (dead.get(u) ?? 0) + 1);
      }
    }
  }
})('dist');
for (const [u, n] of dead) {
  console.error(`✗ dead internal link (404, no redirect): ${u} — linked from ${n} page(s)`);
  errors++;
}

if (errors > 0) { console.error(`\n❌ validate-redirects: ${errors} problem(s).`); process.exit(1); }
console.log(`✅ Redirects: ${redirects.size} rules deployed, ${live.size} pages live, 0 dead internal links, 0 chains.`);
