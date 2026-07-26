#!/usr/bin/env node
/**
 * scripts/fix-article-dates.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces claimed article dates with dates derived from this repository's own
 * git history, so every date on the site is evidence-backed.
 *
 * WHY
 *   • 101 articles claimed a datePublished BEFORE the repo's first commit
 *     (2026-03-14); 83 claimed 2025, up to 14 months before the site existed.
 *   • 147 shared the identical dateModified '2026-06-30'. Git shows that day
 *     had only small commits (37 and 27 changed lines) — a bulk stamp, not
 *     147 real updates.
 *
 * METHOD
 *   datePublished := date the article's block first appeared in git history
 *   dateModified  := date its block last genuinely changed, excluding the
 *                    2026-07-25+ remediation commits, and only when later than
 *                    datePublished. Otherwise dropped — schema.ts and
 *                    sitemap-articles.xml.ts both already fall back.
 *
 * Operates line-by-line, anchoring each date field to its nearest preceding
 * `slug:` line. Brace-based block splitting proved unreliable because articles
 * use two layouts (`id:` on its own line, or `id: 'x', slug: '/y/'` combined).
 *
 * Idempotent. Never writes a future date.
 */
import fs from 'fs';

const F = 'src/data/articles.ts';
const TODAY = '2026-07-26';
const { first, last } = JSON.parse(fs.readFileSync('git-dates.json', 'utf8'));

const lines = fs.readFileSync(F, 'utf8').split('\n');

// map every line index -> the article slug that owns it
const owner = new Array(lines.length).fill(null);
let cur = null;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s{2,4}(?:id:\s*'[^']*',\s*)?slug:\s*'(\/[^']+)'/);
  if (m) cur = m[1];
  owner[i] = cur;
}

const changes = [];
const drop = new Set();

for (let i = 0; i < lines.length; i++) {
  const pm = lines[i].match(/^(\s{4})datePublished:\s*'(\d{4}-\d{2}-\d{2})'(,?)$/);
  if (!pm) continue;
  const slug = owner[i];
  const fp = first[slug];
  if (!slug || !fp || fp > TODAY) continue;

  const oldPub = pm[2];
  if (oldPub !== fp) {
    lines[i] = `${pm[1]}datePublished: '${fp}'${pm[3]}`;
  }

  // dateModified normally sits on the next line; search a small window
  let mi = -1;
  for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
    if (/^\s{4}dateModified:\s*'\d{4}-\d{2}-\d{2}'/.test(lines[j])) { mi = j; break; }
  }
  const lp = last[slug];
  const newMod = (lp && lp > fp && lp <= TODAY) ? lp : null;
  let oldMod = null;
  if (mi >= 0) {
    oldMod = lines[mi].match(/'(\d{4}-\d{2}-\d{2})'/)[1];
    if (newMod) {
      const mm = lines[mi].match(/^(\s{4})dateModified:\s*'\d{4}-\d{2}-\d{2}'(,?)$/);
      if (mm) lines[mi] = `${mm[1]}dateModified: '${newMod}'${mm[2]}`;
    } else {
      drop.add(mi);
    }
  }
  if (oldPub !== fp || oldMod !== newMod) {
    changes.push({ slug, oldPub, newPub: fp, oldMod, newMod: newMod ?? '(removed)' });
  }
}

const outLines = lines.filter((_, i) => !drop.has(i));
const out = outLines.join('\n');
fs.writeFileSync(F, out);

// ── report ────────────────────────────────────────────────────────────────
const pub = [...out.matchAll(/^\s{4}datePublished:\s*'(\d{4}-\d{2}-\d{2})'/gm)].map(m => m[1]);
const mod = [...out.matchAll(/^\s{4}dateModified:\s*'(\d{4}-\d{2}-\d{2})'/gm)].map(m => m[1]);
const byMonth = a => a.reduce((o, d) => (o[d.slice(0, 7)] = (o[d.slice(0, 7)] || 0) + 1, o), {});
const LAUNCH = '2026-03-14';

console.log('── ARTICLE DATE CORRECTION ──────────────────────────────────────────');
console.log(`articles changed: ${changes.length}   dateModified fields dropped: ${drop.size}`);
console.log('');
console.log('datePublished');
console.log(`  before first commit (${LAUNCH}) : 101 -> ${pub.filter(d => d < LAUNCH).length}`);
console.log(`  dated 2025                        : 83 -> ${pub.filter(d => d < '2026').length}`);
console.log(`  future dates                      : ${pub.filter(d => d > TODAY).length}`);
console.log('  by month:', JSON.stringify(byMonth(pub)));
console.log('');
console.log('dateModified');
console.log(`  total fields    : 158 -> ${mod.length}`);
console.log(`  bulk 2026-06-30 : 147 -> ${mod.filter(d => d === '2026-06-30').length}`);
console.log(`  distinct dates  : ${new Set(mod).size}`);
console.log(`  earlier than its datePublished : ${changes.filter(c => c.newMod !== '(removed)' && c.newMod < c.newPub).length}`);
console.log('');
console.log('sample:');
for (const c of changes.slice(0, 6)) {
  console.log(`  ${c.slug.padEnd(36).slice(0, 36)} pub ${c.oldPub} -> ${c.newPub}   mod ${c.oldMod} -> ${c.newMod}`);
}
const braces = (out.match(/\{/g) || []).length - (out.match(/\}/g) || []).length;
console.log('');
console.log(`brace balance: ${braces}   datePublished fields: ${pub.length} (expect 166)`);
if (braces !== 0 || pub.filter(d => d < LAUNCH).length || pub.filter(d => d > TODAY).length) process.exit(1);
