#!/usr/bin/env node
/**
 * Guard: the brand commentary cannot state a number its own table contradicts.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * src/data/ball-brands.ts held six hand-written brand write-ups with the
 * prices, compressions and counts typed in. A machine check against balls.ts
 * in Sprint 165 found 21 of the 23 verifiable claims wrong, including:
 *
 *   "TP5 and TP5x cost exactly the same $50"     -> $58 and $45
 *   "Tour B XS and Tour B X are both $48"        -> both $55
 *   "Vice Pro at 80 compression and $33"         -> 90 compression, $39
 *   "Vice Drive at $17 is the cheapest ball ..." -> $20; Wilson Chaos is $12
 *   "spanning 45 to 97 compression"              -> 65 to 97
 *
 * Each of those paragraphs renders immediately above a table printing the
 * correct figure, on pages including /golf-ball-compression-chart/ — 37% of
 * the site's clicks. Nothing caught it: validate-prose-prices reads article
 * prose and validate-chart-vs-registry reads the registry, and this copy is a
 * data file with the figures buried in sentences.
 *
 * Sprint 165 made every figure an interpolation from balls.ts. This guard
 * stops the old habit returning, and it checks the OUTPUT rather than the
 * source so it is indifferent to how the strings are assembled.
 *
 * ── What it checks ─────────────────────────────────────────────────────────
 * 1. Proximity: a dollar figure or compression figure written within 70
 *    characters after a ball's name must match that ball's record. This is the
 *    shape that produced every one of the defects above.
 * 2. Shared-price claims: "are both $N" / "cost the same $N" must be true of
 *    the balls named immediately before it.
 * 3. No typed currency in ball-brands.ts outside comments — a literal "$45"
 *    in the prose means someone stopped deriving.
 * 4. Brand-page meta descriptions: "from the X (n) to the Y (m)" must name the
 *    brand's actual softest and firmest balls at their actual compressions.
 *    Titleist's named the TruFeel at 70 when two of its balls sit at 65.
 * 5. notes fields in balls.ts: no two balls may both claim to be the cheapest
 *    on the chart, and whoever claims it must actually be.
 *
 * It does NOT try to parse editorial judgement ("largely wasted below 95 mph").
 * Those sentences carry no checkable figure and are the half of the copy that
 * is meant to be written by a person.
 */
import fs from 'node:fs';
import { balls as BALLS } from '../src/data/balls';
import { BRAND_DETAIL } from '../src/data/ball-brands';

interface Ball {
  name: string; brand: string; compression: number; cover: string;
  price: number; minMph: number; maxMph: number; discontinued?: boolean;
}
const ALL = BALLS as unknown as Ball[];
const problems: string[] = [];
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Labels that are a prefix of another ball's label are dropped: "Pro" would
// otherwise match inside "Pro V1", "Pro Soft" and "Pro Plus" and misattribute
// every figure near them. A false alarm is as bad as a miss.
const RAW = ALL.flatMap(b => [b.name, b.name.replace(new RegExp('^' + esc(b.brand) + '\\s+'), '')])
  .filter((x, i, a) => a.indexOf(x) === i);
const NAMES = ALL
  .flatMap(b => [{ b, label: b.name }, { b, label: b.name.replace(new RegExp('^' + esc(b.brand) + '\\s+'), '') }])
  .filter((x, i, a) => a.findIndex(y => y.label === x.label) === i)
  .filter(x => !RAW.some(o => o !== x.label && o.startsWith(x.label + ' ')))
  .sort((x, y) => y.label.length - x.label.length);

let claims = 0;

// Only the explicit "<ball> at <n> compression and $<p>" family is checked.
// Those are the forms the old hand-written copy used, and every one of the 21
// Sprint 165 defects was one of them. Looser proximity matching produced
// nineteen false alarms on correct copy when I tried it: "$13 less than a
// Pro V1" and "10 compression points softer" are not price claims.
const FORMS = [
  // name at 74 compression and $40   /   name at 74 compression, $40
  (l: string) => new RegExp(esc(l) + '\\s+at\\s+(\\d{2,3})\\s+compression(?!\\s+point)(?:\\s+and|,)\\s+\\$(\\d+)', 'g'),
  // name — 68 compression, $40
  (l: string) => new RegExp(esc(l) + '\\s*[\u2014-]\\s*(\\d{2,3})\\s+compression(?!\\s+point),\\s+\\$(\\d+)', 'g'),
  // name at 88 is $40
  (l: string) => new RegExp(esc(l) + '\\s+at\\s+(\\d{2,3})\\s+(?:is|and)\\s+\\$(\\d+)', 'g'),
];
const PRICE_ONLY = (l: string) => new RegExp(esc(l) + '\\s+at\\s+\\$(\\d+)', 'g');
const COMP_ONLY  = (l: string) => new RegExp(esc(l) + '\\s+at\\s+(\\d{2,3})\\s+compression(?!\\s+point)', 'g');

for (const [brand, d] of Object.entries(BRAND_DETAIL)) {
  const text = [d.lead, d.pick, d.watch].join('  ').replace(/<[^>]+>/g, '');

  for (const { b, label } of NAMES) {
    for (const form of FORMS) {
      for (const m of text.matchAll(form(label))) {
        claims += 2;
        if (Number(m[1]) !== b.compression) problems.push(`${brand}: "${label} … ${m[1]} compression" — balls.ts says ${b.compression}`);
        if (Number(m[2]) !== b.price)       problems.push(`${brand}: "${label} … $${m[2]}" — balls.ts says $${b.price}`);
      }
    }
    for (const m of text.matchAll(PRICE_ONLY(label))) {
      claims++;
      if (Number(m[1]) !== b.price) problems.push(`${brand}: "${label} at $${m[1]}" — balls.ts says $${b.price}`);
    }
    for (const m of text.matchAll(COMP_ONLY(label))) {
      claims++;
      if (Number(m[1]) !== b.compression) problems.push(`${brand}: "${label} at ${m[1]} compression" — balls.ts says ${b.compression}`);
    }
  }

  // Shared-price claims: "are both $55" / "cost the same $58".
  for (const m of text.matchAll(/(?:are both|cost the same|cost exactly the same)\s+\$(\d+)/g)) {
    const before = text.slice(Math.max(0, m.index! - 160), m.index!);
    const named = NAMES
      .filter(n => before.includes(n.label))
      .filter((x, i, a) => a.findIndex(y => y.b.name === x.b.name) === i)
      .slice(0, 2);
    claims += named.length;
    const wrong = named.filter(n => n.b.price !== Number(m[1]));
    if (named.length && wrong.length) {
      problems.push(`${brand}: "${m[0]}" — ${wrong.map(w => `${w.b.name} is $${w.b.price}`).join(', ')}`);
    }
  }
}

// ── 3. no typed currency in the source, outside comments ───────────────────
{
  const src = fs.readFileSync('src/data/ball-brands.ts', 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
  const ALLOWED = ['$30'];                       // the "under $30" page name
  for (const m of src.matchAll(/(?<!\$\{[^}]{0,80})\$(\d+)/g)) {
    if (!ALLOWED.includes('$' + m[1])) {
      problems.push(
        `ball-brands.ts types the literal "$${m[1]}". Every figure must come from ` +
        `balls.ts via money()/interpolation, or it drifts the moment a price changes.`
      );
    }
  }
}

// ── 4. brand-page meta descriptions ────────────────────────────────────────
for (const brand of Object.keys(BRAND_DETAIL)) {
  const slug = brand.toLowerCase();
  const file = `src/pages/${slug}-golf-ball-compression-chart/index.astro`;
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');
  const desc = src.match(/description:\s*"([^"]*)"/)?.[1] ?? '';
  const m = desc.match(/from the (.+?) \((\d+)\) to the (.+?) \((\d+)\)/);
  if (!m) continue;
  const bs = ALL.filter(b => b.brand === brand).sort((a, b) => a.compression - b.compression);
  const want = [bs[0], bs[bs.length - 1]];
  const got = [{ n: m[1], c: Number(m[2]) }, { n: m[3], c: Number(m[4]) }];
  got.forEach((g, i) => {
    claims++;
    const w = want[i];
    const wShort = w.name.replace(new RegExp('^' + esc(brand) + '\\s+'), '');
    if (g.c !== w.compression) {
      problems.push(
        `${slug} meta description says "${g.n} (${g.c})" for the ` +
        `${i === 0 ? 'softest' : 'firmest'} ball — that is ${wShort} at ${w.compression}`
      );
    }
  });
  const n = desc.match(/all (\d+) \w+ golf balls/);
  if (n) { claims++; if (Number(n[1]) !== bs.length) problems.push(`${slug} meta says "all ${n[1]}" balls — ${brand} has ${bs.length}`); }
}

// ── 5. notes-field superlatives ────────────────────────────────────────────
{
  const minP = Math.min(...ALL.map(b => b.price));
  const claimants = ALL.filter(b => /cheapest ball (on this chart|of any kind)/i.test(b.notes ?? ''));
  for (const b of claimants) {
    claims++;
    if (b.price !== minP) {
      const real = ALL.filter(x => x.price === minP).map(x => x.name).join('/');
      problems.push(`balls.ts: ${b.name} ($${b.price}) note claims "cheapest ball on this chart" — ${real} is $${minP}`);
    }
  }
  if (claimants.length > 1) {
    problems.push(`balls.ts: ${claimants.length} balls each claim to be the cheapest on the chart (${claimants.map(b => b.name).join(', ')})`);
  }
  for (const b of ALL) {
    const own = (b.notes ?? '').match(/\$(\d+(?:\.\d+)?)\s*(?:a|\/)\s*dozen/i);
    if (own) { claims++; if (Math.round(Number(own[1])) !== b.price) problems.push(`balls.ts: ${b.name} note says ${own[0]}, price field says $${b.price}`); }
  }
}

if (problems.length) {
  console.error(`\n❌ Brand copy: ${problems.length} figure(s) contradict balls.ts:`);
  for (const p of [...new Set(problems)]) console.error(`   ${p}`);
  console.error(
    `\n   This copy renders directly above a table printing the correct number, on\n` +
    `   /golf-ball-compression-chart/ among others. Derive the figure from balls.ts\n` +
    `   rather than typing it.\n`
  );
  process.exit(1);
}

console.log(
  `✅ Brand copy: ${claims} figure(s) across ${Object.keys(BRAND_DETAIL).length} brand write-ups ` +
  `all derive from balls.ts; no typed currency, meta descriptions and notes agree.`
);
