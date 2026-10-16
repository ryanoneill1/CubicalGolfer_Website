#!/usr/bin/env node
/**
 * validate-testing-claims.ts — guards the site's single most important claim.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * /how-we-test/ says every product is bought with our own money and played
 * over real rounds. That sentence is the whole reason a reader trusts this
 * site over a brochure rewrite, so it has to be true on every page that says
 * it — and absent from every page that cannot say it.
 *
 * Sprint 171 added the first page built from other people's testing (the
 * Square Golf Omni, measured by Breaking Eighty, Golf Monthly and National
 * Club Golfer rather than by us). Writing it exposed that the article template
 * asserted first-hand testing in SIX separate places, none of them
 * conditional: the header badge, three different trust blocks, the freshness
 * banner, the affiliate disclosure and the Quick Pick disclosure. A page could
 * disclose "we have not had this in our hands" in its body while the furniture
 * around it claimed the opposite. A reader who noticed would be right to stop
 * believing any of it.
 *
 * ── Rule 1: no page may both assert and deny first-hand testing ───────────
 * Checked on rendered HTML, because that is what a reader sees and because the
 * claims come from the template rather than from the article data.
 *
 * ── Rule 3: a disclosure in testingNotes must set the flag ────────────────
 * Catches the author who writes an honest note and forgets `tested: false`,
 * leaving the template to claim the opposite. That had already happened on
 * /best-golf-gps-speakers-2026/ before this check existed.
 *
 * Retailer label/URL agreement is NOT checked here — verify-retailer-labels.ts
 * owns that invariant, and was extended in the same sprint to match "on" and
 * "from" as well as "at", which is how 31 mislabelled CTAs had slipped past it.
 *
 * Ceiling is 0 and only ever goes down.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ARTICLES } from '../src/data/articles';

const DIST = join(process.cwd(), 'dist');
const ASSERT_CEILING = 0;

/** Phrases that assert WE bought and played the product. */
const ASSERTS = [
  'Independently tested',
  'Every product purchased',
  'Both products purchased',
  'Independently purchased ·',
  'Launch monitor verified',
  'independently purchased and tested',
  'independently purchased and used',
  'tested on actual courses',
];

/**
 * Rule 1 is driven by DATA, not by prose.
 *
 * The first draft matched disclosure phrases in the rendered HTML. That was
 * wrong twice over. It fired on /best-golf-gps-speakers-2026/ ("This is not a
 * speaker and we are not going to pretend otherwise") and on
 * /how-to-choose-putter-length/ (a PING build page, "not one specific model")
 * — neither of which says anything about who tested what. Narrowing the
 * phrase list then silently lost the case that matters most: an author writing
 * an honest testingNotes and forgetting `tested: false`, leaving the template
 * furniture to claim the opposite.
 *
 * So: `article.tested === false` is the authoritative signal, and Rule 3 below
 * catches the author who disclosed in the note but did not set the flag.
 */

/**
 * A note may legitimately do BOTH: say what we played and label the rest as
 * research picks. /best-irons-under-500/ is the real example — "The three iron
 * sets above were bought and played … the complete sets further down … are
 * labelled research picks, because we have not played those." Setting
 * `tested: false` there would delete claims that are true. So a note carrying
 * a first-hand claim as well as a disclosure is a partial page, and its own
 * copy marks the exceptions; Rule 3 leaves it alone.
 */
const FIRST_HAND: RegExp[] = [
  /\bbought and played\b/i,
  /\bindependently purchased\b/i,
  /\bbought with our own\b/i,
  /\bwe bought\b/i,
];

/** Phrases in testingNotes that disclose the page is not our own testing. */
const DISCLOSURES: RegExp[] = [
  /\bare not ours\b/i,
  /\bnot our own testing\b/i,
  /we have not (had|tested|played|used)\b/i,
  /\bcredited to the outlet\b/i,
  /\bthird-party testing\b/i,
];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.log('validate-testing-claims: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

/** slug -> article, so Rule 1 reads the data rather than guessing from prose. */
const BY_PAGE = new Map<string, any>((ARTICLES as any[]).map(a => [a.slug, a]));

const contradictions: Array<{ page: string; asserts: string[]; denies: string[] }> = [];
const undeclared: Array<{ page: string; note: string }> = [];
let pages = 0;
let sourcedPages = 0;

for (const file of walk(DIST)) {
  pages++;
  const html = readFileSync(file, 'utf8')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const page = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '');

  const article: any = BY_PAGE.get(page);
  if (article?.tested === false) {
    sourcedPages++;
    const asserts = ASSERTS.filter(a => html.includes(a));
    if (asserts.length) contradictions.push({ page, asserts, denies: ['tested: false'] });
  }
  if (article && article.tested !== false && typeof article.testingNotes === 'string'
      && DISCLOSURES.some(r => r.test(article.testingNotes))
      && !FIRST_HAND.some(r => r.test(article.testingNotes))) {
    undeclared.push({ page, note: article.testingNotes.slice(0, 110) });
  }
}

let failed = false;

if (contradictions.length > ASSERT_CEILING) {
  failed = true;
  console.error(`\n❌ ${contradictions.length} page(s) both assert and deny first-hand testing ` +
    `(ceiling ${ASSERT_CEILING}):\n`);
  for (const c of contradictions) {
    console.error(`   ${c.page}`);
    console.error(`      denies:  ${c.denies.join(' | ')}`);
    console.error(`      asserts: ${c.asserts.join(' | ')}`);
  }
  console.error('\n   Set `tested: false` on the article and make the asserting block conditional.\n');
}

if (undeclared.length > ASSERT_CEILING) {
  failed = true;
  console.error(`\n\u274c ${undeclared.length} page(s) disclose third-party testing in testingNotes ` +
    `but do not set \`tested: false\` (ceiling ${ASSERT_CEILING}):\n`);
  for (const u of undeclared) console.error(`   ${u.page}\n      note: "${u.note}…"`);
  console.error('\n   Add `tested: false` so the header badge and trust blocks stop claiming our own testing.\n');
}

if (failed) process.exit(1);

console.log(`✅ Testing claims: ${pages} rendered page(s) — ${sourcedPages} built from third-party ` +
  `testing, none also claiming our own, none undeclared (ceiling ${ASSERT_CEILING}).`);
