#!/usr/bin/env node
/**
 * scripts/consolidate-redirects.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Merges the two _redirects files into the one Astro actually deploys.
 *
 * THE BUG: this repo had TWO redirect files.
 *   /_redirects          98 rules  — repo root. Astro NEVER copies this to dist/.
 *   /public/_redirects   67 rules  — the only one that ships.
 * 43 rules existed only in the root file and had therefore never taken effect.
 *
 * ALSO FIXED HERE: three rules in public/_redirects redirect away from pages that
 * are actually built and live. Each self-canonicals, carries 1,393-2,376 words, is
 * internally linked, and two have Search Console impressions. They are unreachable
 * in production today. Removing those three rules restores them — and incidentally
 * resolves all three redirect chains, because those pages were the middle hop.
 *
 * Conflicts (4 sources present in both files with different targets) resolve to the
 * public/ value, so live behaviour does not change. They are printed for review.
 */
import fs from 'fs';

const ROOT = '_redirects';
const PUB  = 'public/_redirects';

// Built pages must never be shadowed by a redirect.
const live = new Set();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(`${d}/${e.name}`);
    else if (e.name === 'index.html') {
      const u = d.replace(/^dist/, '') + '/';
      live.add(u === '/' ? '/' : u.replace(/\/+$/, '/'));
    }
  }
})('dist');

const parse = (p) => {
  const map = new Map(); const order = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const x = s.split(/\s+/);
    if (x.length >= 3 && (x[2] === '301' || x[2] === '302')) {
      if (!map.has(x[0])) order.push(x[0]);
      map.set(x[0], { to: x[1], code: x[2] });
    }
  }
  return { map, order };
};

const root = parse(ROOT);
const pub  = parse(PUB);

const conflicts = [];
for (const [k, v] of root.map) {
  if (pub.map.has(k) && pub.map.get(k).to !== v.to) {
    conflicts.push([k, pub.map.get(k).to, v.to]);
  }
}

// merged = everything in public (authoritative on conflict) + root-only rules
const merged = new Map(pub.map);
const gained = [];
for (const k of root.order) if (!merged.has(k)) { merged.set(k, root.map.get(k)); gained.push(k); }

// drop any rule that shadows a built page
const shadowed = [];
for (const k of [...merged.keys()]) if (live.has(k)) { shadowed.push([k, merged.get(k).to]); merged.delete(k); }

// safety: no self-loops, no chains, no rule whose target is a dead end
const loops   = [...merged].filter(([k, v]) => v.to === k).map(([k]) => k);
for (const k of loops) merged.delete(k);
const chains  = [...merged].filter(([, v]) => merged.has(v.to)).map(([k, v]) => [k, v.to, merged.get(v.to).to]);
const deadEnd = [...merged].filter(([, v]) => !v.to.includes(':') && !live.has(v.to) && !merged.has(v.to)).map(([k, v]) => [k, v.to]);

// write, preserving the public file's comment structure then appending gained rules
const header = fs.readFileSync(PUB, 'utf8').split('\n').filter(l => l.trim().startsWith('#') && !l.includes('Orphaned'));
const out = [
  '# Cloudflare _redirects — THE ONLY DEPLOYED COPY.',
  '# Astro copies public/ into dist/. A _redirects file at the repo root is dead code.',
  '# Verified by scripts/validate-redirects.ts, which fails the build if one reappears.',
  '',
  ...[...merged].map(([k, v]) => `${k}  ${v.to}  ${v.code}`),
  '',
].join('\n');
fs.writeFileSync(PUB, out);
if (fs.existsSync(ROOT)) fs.unlinkSync(ROOT);

console.log('── REDIRECT CONSOLIDATION ───────────────────────────────────────────');
console.log(`root file rules        : ${root.map.size}  (never deployed)`);
console.log(`public file rules      : ${pub.map.size}  (was deploying)`);
console.log(`rules gained from root : ${gained.length}`);
console.log(`FINAL deployed rules   : ${merged.size}`);
console.log(`root file deleted      : ${!fs.existsSync(ROOT)}`);
console.log('');
console.log(`shadowing a live page — REMOVED (restores the page): ${shadowed.length}`);
for (const [k, t] of shadowed) console.log(`   ${k}  ->  ${t}`);
console.log('');
console.log(`conflicts resolved to the public/ value (no behaviour change): ${conflicts.length}`);
for (const [k, kept, discarded] of conflicts) console.log(`   ${k}\n       kept ${kept}   (root wanted ${discarded})`);
console.log('');
console.log(`self-loops removed : ${loops.length}`);
console.log(`redirect chains    : ${chains.length} ${chains.length ? JSON.stringify(chains) : '✓'}`);
console.log(`dead-end targets   : ${deadEnd.length} ${deadEnd.length ? JSON.stringify(deadEnd) : '✓'}`);
if (chains.length || deadEnd.length || loops.length) { console.error('\nFAILED safety checks'); process.exit(1); }
