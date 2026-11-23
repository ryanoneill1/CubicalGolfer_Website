#!/usr/bin/env node
/**
 * validate-stated-counts.ts — every "N balls" claim must equal the real roster.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Sprint 131 added the Maxfli Tour S, taking the compression chart from 34 balls
 * to 35. I swept the prose for "34 balls" / "all 34" and shipped.
 *
 * Six claims survived, because they were capitalised or worded differently:
 *
 *     title:        "Golf Ball Compression Chart 2026 — 34 Balls + PDF"
 *     description:  "Compression ratings for 34 golf balls ..."
 *     ItemList:     "34 golf balls ranked by compression rating ..."
 *     Dataset:      "34 golf balls ranked by compression rating ..."
 *     related link: "Full Compression Chart — 34 Balls"
 *     article body: "compression ratings for 34 golf balls in 2026"
 *
 * The first one is the headline Google shows on our highest-traffic query. It
 * sat there advertising a stale number for a week, and it was found by eye on a
 * search results page, not by the build.
 *
 * ── The trap this has to avoid ─────────────────────────────────────────────
 * The same page legitimately says "from lowest (34) to highest (102)" — that 34
 * is the TaylorMade Noodle's compression VALUE, not a count. A naive
 * find-and-replace corrupts it. So this matches only a number immediately
 * followed by a ball-count noun, never a bare number.
 *
 * ── Why it is narrow on purpose ────────────────────────────────────────────
 * Two earlier versions of this file were wrong, and both failed the same way.
 *
 *   v1  matched any "<N> balls" on a line mentioning balls.
 *       61 hits, 61 false positives: "lost 10 balls a round", "a 200-ball
 *       bucket", "15 golf balls per pack".
 *   v2  required "compression chart" on the same line.
 *       2 hits, both still false: a two-dozen box "of 24 balls" in a priceNote
 *       that happened to mention the chart later in the sentence, and "the 5
 *       balls on this page" on a different page entirely.
 *
 * A checker that cries wolf gets switched off, which is worse than no checker.
 * So v3 stops reading prose altogether. The roster count is only ever a CLAIM
 * when it appears in a DECLARATION — a title, a meta description, a schema
 * description, a link label, or an article intro. Body copy can say "I lost 10
 * balls" all day and that is not a claim about the chart.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 * Lines that assign title / description / label / intro AND mention
 * compression: every "<N> ball(s)" in them must equal balls.length.
 */
import { balls } from '../src/data/balls.ts';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const EXPECTED = (balls as unknown[]).length;
const ROOT = process.cwd();

/** "35 balls", "35 Balls", "35 golf balls" — never a bare number. */
const CLAIM = /\b(\d{1,3})\s+(?:golf\s+)?[Bb]alls?\b/g;

/** A declaration surface — where a number IS a claim, not a story. */
const DECLARATION = /^\s*(?:\w+\s*:\s*)?(title|description|label|intro|name)\s*:/i;
/** ...and it has to be about compression, not some other chart. */
const ABOUT_COMPRESSION = /compression/i;

const files: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|ts)$/.test(p)) files.push(p);
  }
})(join(ROOT, 'src'));

const bad: string[] = [];
let claims = 0;

for (const f of files) {
  if (f.endsWith('validate-stated-counts.ts')) continue;
  const text = readFileSync(f, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (!DECLARATION.test(line) || !ABOUT_COMPRESSION.test(line)) return;
    for (const m of line.matchAll(CLAIM)) {
      claims++;
      const n = Number(m[1]);
      if (n !== EXPECTED) {
        bad.push(`${relative(ROOT, f)}:${i + 1} says "${m[0]}" — the roster has ${EXPECTED}.`);
      }
    }
  });
}

if (bad.length) {
  console.error(`\n❌ Stated ball counts: ${bad.length} claim(s) disagree with balls.ts (${EXPECTED} balls).\n`);
  bad.forEach(m => console.error('   ' + m));
  console.error('\n   Titles and schema descriptions count too — the title is what Google prints.\n');
  process.exit(1);
}

/* ── Brand chart titles ────────────────────────────────────────────────────
 * Sprint 273: /bridgestone-golf-ball-compression-chart/ shipped "All 4" while
 * balls.ts held five Bridgestone balls. The CLAIM regex above could not see it
 * because it requires the word "balls" after the number and the title says
 * "All 4". These pages render every ball of their brand including retired ones
 * (BrandCompressionChart does not filter `discontinued`), so the number each
 * title must match is that brand's full roster.
 */
const BRAND_DIR = /^(.+)-golf-ball-compression-chart$/;
const TITLE_ALL = /title: "([^"]*?)\\u2014 All (\d+)"/;
const TITLE_ALL_EM = /title: "([^"]*?)— All (\d+)"/;
const brandBad: string[] = [];
let brandChecked = 0;

for (const dir of readdirSync(join(ROOT, 'src', 'pages'))) {
  const m = dir.match(BRAND_DIR);
  if (!m) continue;
  const file = join(ROOT, 'src', 'pages', dir, 'index.astro');
  let src: string;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  const hit = src.match(TITLE_ALL) ?? src.match(TITLE_ALL_EM);
  if (!hit) continue;

  const slug = m[1];
  const brand = (balls as Array<Record<string, any>>)
    .map(b => String(b.brand))
    .find(b => b.toLowerCase().replace(/[^a-z]/g, '') === slug.replace(/[^a-z]/g, ''));
  if (!brand) continue;

  brandChecked++;
  const roster = (balls as Array<Record<string, any>>).filter(b => b.brand === brand).length;
  const says = Number(hit[2]);
  if (says !== roster) {
    brandBad.push(`src/pages/${dir}/index.astro title says "All ${says}" — balls.ts has ${roster} ${brand} ball(s).`);
  }
}

if (brandBad.length) {
  console.error(`\n❌ Brand chart counts: ${brandBad.length} title(s) disagree with balls.ts.\n`);
  brandBad.forEach(m => console.error('   ' + m));
  console.error('\n   These titles are what Google prints. Add the ball, update the title.\n');
  process.exit(1);
}

console.log(`✅ Stated ball counts: ${claims} claim(s) checked, all agree with balls.ts (${EXPECTED}).`);
console.log(`✅ Brand chart counts: ${brandChecked} brand title(s) match their roster.`);
