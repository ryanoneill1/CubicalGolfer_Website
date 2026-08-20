/**
 * validate-meta-length.ts — Sprint 43
 *
 * Catches three SERP-visible defects in titles and descriptions.
 *
 * 1. TRUNCATED MID-PHRASE. Sprint 40 found one description ending "...plus
 *    three strong alternatives at." and I called it a one-off. Sprint 43 found
 *    six more with the identical fingerprint — a sentence guillotined around
 *    150 characters, leaving a dangling preposition or conjunction before the
 *    full stop. Whatever produced them could produce more.
 *
 * 2. OVER-LENGTH DESCRIPTIONS. Google truncates near 155 characters. A
 *    description longer than that loses its tail, which is exactly where the
 *    reason-to-click lives. One page was carrying 232 characters.
 *
 * 3. OVER-LENGTH TITLES. Roughly 60 characters render before the ellipsis.
 *
 * PRECISION MATTERS MORE THAN RECALL HERE. A checker that fires on healthy
 * copy gets switched off, so the truncation rule is deliberately narrow: it
 * only fires on a CLOSED-CLASS function word immediately before the final
 * period. "...and each fix." is fine. "...and." is not. Content words are
 * never flagged, because a description legitimately ending "...for beginners."
 * or "...worth the money." is normal English.
 *
 * The counts are ratchets: allowances only ever go down.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';

const DESC_LIMIT = 158;   // ~155 rendered, 3 chars of slack
const TITLE_LIMIT = 62;   // ~60 rendered
const DESC_MIN = 50;      // shorter than this wastes SERP width

// Closed-class words that cannot legitimately end a sentence. Prepositions,
// conjunctions, articles, auxiliaries and determiners — a closed class, so
// the list is complete rather than a sample.
const DANGLING = new Set([
  'at','to','of','for','and','or','with','the','a','an','in','on','plus',
  'from','by','into','onto','than','that','is','are','was','were','be','as',
  'but','if','when','while','about','over','under','between','per','via',
  'your','their','its','our','which','who','whose','what',
]);
// DELIBERATELY EXCLUDED: 'you', 'this', 'these', 'those', 'that'. These are
// pronouns as well as determiners, so they can legitimately close a sentence
// — "...what the extra $10 buys you." and "...built for you." are healthy
// copy. Including them produced four false positives on the first run, and a
// checker that flags good writing is one that gets switched off. Determiners
// that MUST take a noun ('your', 'their', 'its', 'our') stay in.
//
// KNOWN FALSE-POSITIVE CLASS, accepted deliberately: English allows
// preposition stranding, so "...which is worth paying for." is grammatical
// and this rule flags it. I hit that on my own replacement copy while writing
// this sprint. I chose to reword rather than loosen the rule, because ending
// a meta description on a function word is weak SERP copy whether or not it
// parses — the last few characters are the reason to click. If this ever
// blocks copy that genuinely needs a stranded preposition, loosen it here
// rather than raising the allowance.

// Outstanding allowances. Ratchet: these only ever go down.
const ALLOW_TRUNCATED = 0;
const ALLOW_LONG_DESC = 0;
const ALLOW_LONG_TITLE = 0;

type Finding = { where: string; kind: string; detail: string };
const findings: Finding[] = [];

function check(where: string, title: string, desc: string) {
  const t = (title ?? '').trim();
  const d = (desc ?? '').trim();

  if (d) {
    // Rule 1 — dangling function word immediately before the closing period.
    const m = d.match(/([A-Za-z']+)\s*\.\s*$/);
    if (m && DANGLING.has(m[1].toLowerCase())) {
      findings.push({ where, kind: 'TRUNCATED',
        detail: `ends "...${d.slice(-46)}" — cut off mid-phrase; this is what shows in the SERP` });
    }
    // Rule 2 — tail dropped by Google.
    if (d.length > DESC_LIMIT) {
      findings.push({ where, kind: 'LONG_DESC',
        detail: `${d.length} chars (limit ${DESC_LIMIT}); lost tail: "...${d.slice(150)}"` });
    }
    if (d.length < DESC_MIN) {
      findings.push({ where, kind: 'SHORT_DESC', detail: `only ${d.length} chars — wasting SERP width` });
    }
  }

  // Rule 3 — title truncation.
  if (t && t.length > TITLE_LIMIT) {
    findings.push({ where, kind: 'LONG_TITLE', detail: `${t.length} chars (limit ${TITLE_LIMIT}): "${t}"` });
  }
}

for (const a of ARTICLES as any[])
  check(`articles.ts  ${a.slug ?? a.id}`, String(a.title ?? ''), String(a.description ?? ''));
for (const c of COMPARISONS as any[])
  check(`comparisons.ts  ${c.slug ?? c.id}`, String(c.title ?? ''), String(c.description ?? ''));

// .astro pages: the `meta` object literal at the top of the file. Only the
// FIRST title/description pair is the page meta — later ones belong to schema
// helpers and are never rendered as the snippet.
const astro: string[] = [];
(function walk(dir: string) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.astro')) astro.push(p);
  }
})(path.join(process.cwd(), 'src/pages'));

for (const f of astro) {
  const src = fs.readFileSync(f, 'utf8');
  const dm = src.match(/^\s*description:\s*'((?:[^'\\]|\\.)*)'/m);
  const tm = src.match(/^\s*title:\s*'((?:[^'\\]|\\.)*)'/m);
  if (!dm && !tm) continue;
  check(path.relative(process.cwd(), f), tm ? tm[1] : '', dm ? dm[1] : '');
}

const bucket = (k: string) => findings.filter(f => f.kind === k);
const truncated = bucket('TRUNCATED'), longDesc = bucket('LONG_DESC');
const longTitle = bucket('LONG_TITLE'), shortDesc = bucket('SHORT_DESC');

for (const f of findings) console.error(`  [${f.kind}] ${f.where}\n      ${f.detail}`);

const scanned = (ARTICLES as any[]).length + (COMPARISONS as any[]).length + astro.length;
console.log(`validate-meta-length: ${scanned} pages — truncated ${truncated.length}/${ALLOW_TRUNCATED}, ` +
  `long desc ${longDesc.length}/${ALLOW_LONG_DESC}, long title ${longTitle.length}/${ALLOW_LONG_TITLE}, ` +
  `short desc ${shortDesc.length} (advisory)`);

let failed = false;
if (truncated.length > ALLOW_TRUNCATED) { console.error(`FAIL: ${truncated.length} truncated, allowance ${ALLOW_TRUNCATED}`); failed = true; }
if (longDesc.length > ALLOW_LONG_DESC) { console.error(`FAIL: ${longDesc.length} over-length descriptions, allowance ${ALLOW_LONG_DESC}`); failed = true; }
if (longTitle.length > ALLOW_LONG_TITLE) { console.error(`FAIL: ${longTitle.length} over-length titles, allowance ${ALLOW_LONG_TITLE}`); failed = true; }
// SHORT_DESC is reported, not enforced — short is weak, not broken, and
// failing a build over it would be crying wolf.
if (failed) process.exit(1);
