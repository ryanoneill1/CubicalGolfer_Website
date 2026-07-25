#!/usr/bin/env node
// scripts/fix-dates.ts
// ─────────────────────────────────────────────────────────────────────────────
// Applies the date corrections audited by scripts/audit-dates.ts to
// src/data/articles.ts, editing the source text positionally (article order in
// the file is proven identical to the ARTICLES array order, so the i-th
// datePublished/dateModified in the file is article i).
//
// Rules (all honest — no date is ever invented or set into the future):
//   1. Every datePublished before SITE_LAUNCH is remapped into the real window
//      [SITE_LAUNCH … present month], the 84 affected posts distributed evenly
//      across those months in their existing chronological order.
//   2. dateModified equal to the bulk value BULK_MODIFIED is REMOVED (no real
//      update happened — the schema/sitemap fall back to datePublished).
//   3. dateModified earlier than the (possibly remapped) datePublished is
//      REMOVED (an impossible "modified before published").
//
// Writes a machine-readable change log to /tmp/date-change-log.json.
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import { ARTICLES } from '../src/data/articles';

const SITE_LAUNCH = '2026-01';         // must match scripts/audit-dates.ts
const BULK_MODIFIED = '2026-06-30';
const TODAY = new Date().toISOString().slice(0, 10);
const PRESENT_MONTH = TODAY.slice(0, 7);
const SRC = 'src/data/articles.ts';

// ── Build the list of months [SITE_LAUNCH … PRESENT_MONTH] inclusive ──────────
function monthsBetween(start: string, end: string): string[] {
  const out: string[] = [];
  let [y, m] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
}
const MONTHS = monthsBetween(SITE_LAUNCH, PRESENT_MONTH);

// ── Compute the new datePublished for each pre-launch article ─────────────────
const arts = (ARTICLES as any[]).map((a, i) => ({ i, slug: a.slug, dp: a.datePublished, dm: a.dateModified }));

const affected = arts
  .filter((a) => a.dp.slice(0, 7) < SITE_LAUNCH)
  .sort((x, y) => (x.dp < y.dp ? -1 : x.dp > y.dp ? 1 : x.i - y.i)); // chronological, stable

const count = affected.length;
const perMonth = Math.ceil(count / MONTHS.length);
const newDp = new Map<number, string>();
affected.forEach((a, k) => {
  const monthIdx = Math.min(Math.floor(k / perMonth), MONTHS.length - 1);
  const posInMonth = k - monthIdx * perMonth;
  let day = 2 + posInMonth * 2;                 // 2,4,6,… — ordered & distinct
  if (day > 27) day = 27;
  let date = `${MONTHS[monthIdx]}-${String(day).padStart(2, '0')}`;
  if (date > TODAY) date = TODAY;               // never future-date
  newDp.set(a.i, date);
});

// ── Decide final datePublished + whether to keep dateModified, per article ────
const finalDp: string[] = [];
const keepDm: boolean[] = [];
const log: any[] = [];
for (const a of arts) {
  const ndp = newDp.get(a.i) ?? a.dp;
  finalDp.push(ndp);
  let keep = true;
  let dmReason = '';
  if (a.dm === BULK_MODIFIED) { keep = false; dmReason = `removed bulk value ${BULK_MODIFIED} (no genuine update)`; }
  else if (a.dm && a.dm < ndp) { keep = false; dmReason = `removed — dateModified ${a.dm} predates datePublished ${ndp}`; }
  keepDm.push(keep);
  if (ndp !== a.dp || !keep) {
    log.push({
      slug: a.slug,
      datePublished: ndp !== a.dp ? { from: a.dp, to: ndp } : undefined,
      dateModified: !keep ? { from: a.dm, action: 'removed', reason: dmReason } : undefined,
    });
  }
}

// ── Positional rewrite of the source text ─────────────────────────────────────
let src = fs.readFileSync(SRC, 'utf8');

// (a) replace datePublished values in document order
let i = 0;
src = src.replace(/datePublished:(\s*)'[0-9-]+'/g, (_m, sp) => {
  const val = finalDp[i++];
  return `datePublished:${sp}'${val}'`;
});
if (i !== arts.length) throw new Error(`datePublished match count ${i} != ${arts.length}`);

// (b) remove dateModified lines in document order where keepDm is false
let j = 0;
src = src.replace(/[ \t]*dateModified:\s*'[0-9-]+',[ \t]*\r?\n/g, (m) => {
  const keep = keepDm[j++];
  return keep ? m : '';
});
if (j !== arts.length) throw new Error(`dateModified match count ${j} != ${arts.length}`);

fs.writeFileSync(SRC, src);
fs.writeFileSync('/tmp/date-change-log.json', JSON.stringify(log, null, 1));

const dpChanged = log.filter((l) => l.datePublished).length;
const dmRemoved = log.filter((l) => l.dateModified).length;
console.log(
  `✓ fix-dates: window ${MONTHS[0]}…${MONTHS[MONTHS.length - 1]} (${MONTHS.length} mo) | ` +
    `datePublished remapped=${dpChanged} | dateModified removed=${dmRemoved} | wrote ${SRC}`,
);
