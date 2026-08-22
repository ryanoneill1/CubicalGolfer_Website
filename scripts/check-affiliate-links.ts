#!/usr/bin/env node
// scripts/check-affiliate-links.ts
// ─────────────────────────────────────────────────────────────────────────────
// Build-time guard: a product link can never ship untracked and unpaid.
//
// Fails the build if any AFFILIATE entry:
//   1. has no `program` field, or
//   2. references an unknown program, or
//   3. uses a non-Amazon program whose `trackingParam` is still empty in
//      src/data/affiliate-programs.ts (i.e. the account isn't wired up yet).
//
// Amazon is exempt from the tracking check because the tag lives inline in each
// Amazon `url`. For every other program, tracking is centralized in PROGRAMS,
// so an empty trackingParam means links would route to the retailer earning $0.
//
// Wired into `npm run validate`.
// ─────────────────────────────────────────────────────────────────────────────

import { AFFILIATE } from '../src/data/affiliate-links';
import { PROGRAMS, type ProgramKey } from '../src/data/affiliate-programs';

const problems: string[] = [];

for (const [key, aff] of Object.entries(AFFILIATE) as [string, any][]) {
  const program: ProgramKey | undefined = aff.program;

  if (!program) {
    problems.push(`${key}: missing 'program' field — populate it from the entry's URL host.`);
    continue;
  }
  if (!(program in PROGRAMS)) {
    problems.push(`${key}: unknown program '${program}' — add it to PROGRAMS in src/data/affiliate-programs.ts.`);
    continue;
  }
  // 'direct' is unmonetised on purpose (see PROGRAMS.direct). Amazon carries its
  // tag inline in the url rather than in trackingParam. Everything else with an
  // empty trackingParam is an account that is not wired up yet, and must block.
  if (program !== 'amazon' && program !== 'direct' && PROGRAMS[program].trackingParam.trim() === '') {
    problems.push(
      `${key}: program '${program}' has no trackingParam yet — this link would ship untracked and unpaid. ` +
      `Paste the affiliate ID into PROGRAMS.${program}.trackingParam in src/data/affiliate-programs.ts once the account is approved.`,
    );
  }
}

if (problems.length > 0) {
  console.error(`\n❌ check-affiliate-links: ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ check-affiliate-links: all ${Object.keys(AFFILIATE).length} entries have a program with active tracking (or are Amazon).`,
);
