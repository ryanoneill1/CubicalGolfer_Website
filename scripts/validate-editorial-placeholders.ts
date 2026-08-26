#!/usr/bin/env node
/**
 * validate-editorial-placeholders.ts — internal notes must never reach a reader.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 83 shipped a testingNotes block containing "[RYAN — add your specifics
 * here: how many rounds, which courses…]". It rendered on /best-irons-under-500/
 * in production. It was written as a note to the owner and it went out as body
 * copy, because nothing checks for that.
 *
 * It is the same defect as the priceNotes that were exposing internal QA notes
 * as customer-facing copy — a field meant for one audience read by another. The
 * difference is that priceNote leaks were caught by hand, one sprint at a time.
 *
 * ── Scope ──────────────────────────────────────────────────────────────────
 * Every string field that renders: article body, intro, testingNotes, bottomLine,
 * excerpt, section bodies, pros/cons, FAQ answers, and every registry priceNote
 * and benefit. Anything a reader can see.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';

// Markers that are unambiguously a note-to-self, not prose a reader should see.
const MARKERS: Array<[RegExp, string]> = [
  [/\bTODO\b/i,                 'TODO'],
  [/\bTKTK\b/i,                 'TKTK'],
  [/\bFIXME\b/i,                'FIXME'],
  [/\bXXX\b/,                   'XXX'],
  [/\[\s*RYAN\b/i,              '[RYAN'],
  [/\bplaceholder\b/i,          'placeholder'],
  [/\bLOREM IPSUM\b/i,          'lorem ipsum'],
  [/\bfill (?:this )?in\b/i,    'fill in'],
  // Dropped: /needs? a number/ fired on "if you just need a number" — legitimate
  // prose about wanting a yardage. A checker that cries wolf gets switched off.
  [/\bADD (?:MORE|SPECIFICS|DETAIL)\b/i, 'ADD MORE/SPECIFICS'],
];

const problems: string[] = [];
const check = (where: string, text: unknown) => {
  const s = String(text ?? '');
  if (!s) return;
  for (const [re, label] of MARKERS) {
    const m = s.match(re);
    if (!m) continue;
    const at = s.indexOf(m[0]);
    problems.push(`   ${where}\n      "${label}" — …${s.slice(Math.max(0, at - 50), at + 90)}…`);
    break;
  }
};

for (const a of ARTICLES as any[]) {
  const w = a.slug;
  for (const f of ['intro','testingNotes','bottomLine','excerpt','description','titleDisplay'] as const) check(`${w} · ${f}`, a[f]);
  for (const s of a.sections ?? []) {
    check(`${w} · section "${String(s.h2).slice(0, 40)}"`, s.body);
    for (const p of s.pros ?? []) check(`${w} · pro`, p);
    for (const c of s.cons ?? []) check(`${w} · con`, c);
  }
  for (const q of a.faq ?? []) check(`${w} · faq`, q.a);
}
for (const [k, v] of Object.entries(AFFILIATE as any)) {
  check(`registry ${k} · priceNote`, (v as any).priceNote);
  for (const b of (v as any).benefits ?? []) check(`registry ${k} · benefit`, b);
}

if (problems.length) {
  console.error(`\n❌ ${problems.length} editorial placeholder(s) would render to readers.`);
  console.error(`These are notes to yourself sitting in copy a reader sees. Finish them or delete them.\n`);
  problems.forEach(p => console.error(p));
  process.exit(1);
}
console.log(`✅ Editorial placeholders: none in reader-facing copy.`);
