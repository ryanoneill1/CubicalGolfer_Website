#!/usr/bin/env node
/**
 * Guard: commission rates and cookie windows live in PROGRAMS, nowhere else.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * affiliate-links.ts carried a hand-typed `commissionPct` and `cookieDays`
 * beside all 354 products, and its own header said they "mirror that
 * program's economics". 75 of them did not:
 *
 *   srixon-z-785 and 5 other Golf Galaxy products   claimed 5%   program pays 8%
 *   wilson-d9-irons (an Amazon link)                claimed 8%   Amazon pays 3%
 *   ezgo-rxv-2, club-car-onward (program 'direct')  claimed 3%   they earn 0%
 *   66 entries                                      wrong cookie window
 *
 * This was not cosmetic. scripts/sweep-priority.ts ranks which product pages
 * to re-verify by `commissionPct × price`, so the wrong rates were quietly
 * mis-ordering that queue — the six Golf Galaxy products were being ranked at
 * five-eighths of their real worth, and two dealer links that earn nothing
 * were being ranked as if they paid 3%.
 *
 * Sprint 168 made both fields derived: affiliate-links.ts stamps every entry
 * from PROGRAMS[entry.program] after the literal. This guard asserts that
 * nobody types them back in, and that the stamping actually happened.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 * 1. No `commissionPct:` or `cookieDays:` literal appears inside the AFFILIATE
 *    object literal. The interface declaration and the PROGRAMS-derived
 *    assignments are the only permitted mentions.
 * 2. Every entry's effective rate and cookie window equal its program's.
 * 3. Every entry names a program that exists in PROGRAMS.
 * 4. An entry on an unmonetised program ('direct') must read 0% — a dealer
 *    locator that reports a commission is the specific error above.
 */
import fs from 'node:fs';
import { PROGRAMS } from '../src/data/affiliate-programs';
import { AFFILIATE } from '../src/data/affiliate-links';

const problems: string[] = [];
const SRC = 'src/data/affiliate-links.ts';
const src = fs.readFileSync(SRC, 'utf8');

// ── 1. nothing typed inside the data literal ───────────────────────────────
{
  const start = src.indexOf('export const AFFILIATE');
  const end = src.indexOf('// ── Program economics, derived');
  const body = end > start ? src.slice(start, end) : src.slice(start);
  // The interface block sits at the top of the literal; cut it at the first entry.
  const firstEntry = body.search(/\n\s*'[a-z0-9-]+':\s*\{/);
  const data = firstEntry > 0 ? body.slice(firstEntry) : body;
  for (const field of ['commissionPct', 'cookieDays']) {
    const hits = [...data.matchAll(new RegExp(`${field}:\\s*[\\d.]+`, 'g'))];
    if (hits.length) {
      problems.push(
        `${hits.length} entr(y/ies) type \`${field}\` directly. It is derived from ` +
        `PROGRAMS — delete the line. 75 hand-typed values had drifted before Sprint 168.`
      );
    }
  }
}

// ── 2-4. the derived values must match, and 'direct' must earn nothing ─────
let checked = 0;
for (const [key, entry] of Object.entries(AFFILIATE as Record<string, any>)) {
  const name = entry.program ?? 'amazon';
  const p = (PROGRAMS as any)[name];
  if (!p) {
    problems.push(`${key} names program '${name}', which is not in PROGRAMS.`);
    continue;
  }
  checked++;
  if (entry.commissionPct !== p.commissionPct) {
    problems.push(`${key}: ${entry.commissionPct}% but program '${name}' pays ${p.commissionPct}%`);
  }
  if (entry.cookieDays !== p.cookieDays) {
    problems.push(`${key}: ${entry.cookieDays}d cookie but program '${name}' is ${p.cookieDays}d`);
  }
  if (name === 'direct' && entry.commissionPct !== 0) {
    problems.push(`${key} is on the unmonetised 'direct' program yet reports ${entry.commissionPct}%`);
  }
}

if (problems.length) {
  console.error(`\n❌ Program economics: ${problems.length} problem(s).`);
  for (const p of problems) console.error(`   ${p}`);
  console.error(
    `\n   Rates and cookie windows belong in src/data/affiliate-programs.ts only.\n` +
    `   sweep-priority.ts ranks re-verification work by commissionPct, so a wrong\n` +
    `   rate here reorders what gets checked.\n`
  );
  process.exit(1);
}

const live = Object.entries(PROGRAMS as any).filter(([, p]: any) => p.trackingParam).length;
console.log(
  `✅ Program economics: ${checked} product(s) derive their rate and cookie window ` +
  `from PROGRAMS (${live} live program(s)); nothing typed per entry.`
);
