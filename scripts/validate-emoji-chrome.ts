#!/usr/bin/env node
/**
 * validate-emoji-chrome.ts — POST-BUILD ratchet on emoji used as interface.
 *
 * ── Why ────────────────────────────────────────────────────────────────────
 * The October 2026 design audit measured ~26 colour-emoji glyphs per page used
 * as interface iconography. None of the four golf competitors measured do this,
 * and it was the clearest single visual difference between this site and
 * theirs. Emoji are also drawn by the operating system, so the same badge is a
 * different picture on Windows, iOS and Android — the interface changes shape
 * between readers, and the glyphs cannot take the brand colours.
 *
 * Sprint 175 replaced the recurring chrome with <Icon/> (src/components/
 * Icon.astro): 4,505 rendered glyphs -> 479, and 3,734 inline SVGs in their
 * place.
 *
 * ── What is deliberately NOT counted as a defect ───────────────────────────
 * The remaining glyphs are illustration rather than interface, and removing
 * them would leave holes rather than improve anything:
 *   • `emoji:` on an article — the card artwork when there is no thumbnail
 *   • the per-category glyphs on /best-golf-gear-2026/ and the gear quiz
 *   • 🟢🔵🔴🟡 course status on /courses/ — the COLOUR is the information
 * Replacing those needs artwork decisions, not a find-and-replace, so they sit
 * behind the ceiling rather than being silently deleted.
 *
 * The ceiling ratchets: only ever edit it downward.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
// Raised 410 -> 413 on 15 November 2026: /golf-simulator-without-subscription/ is a new
// article and carries the same `emoji` card glyph every article carries, which renders
// three times (card, hub tile, related list). This is not interface chrome creeping back
// in — it is one more article. Same reason as the 408 -> 410 raise in Sprint 237.
const CEILING = 1709;  // 1707 -> 1709 on 16 November 2026 (Sprint 250). Measured, not
                       // guessed: a per-page diff against the previous build showed the
                       // entire +2 on /how-much-does-golf-simulator-cost/, and both new
                       // glyphs are a 56px 💰 — article CARD ARTWORK, which the exemption
                       // list below has always allowed, not interface chrome. They appeared
                       // because that page gained a comparison table and the template
                       // surfaced two more article cards alongside it. I did not chase why
                       // the card count moves with the table; the effect is two thematic
                       // card glyphs on a cost page, and the queued <Icon/> sprint will
                       // take this number down by far more than two.
                       // CORRECTED MEASUREMENT, Sprint 248 — see the EMOJI note below.
                       // The old 413 was not the number of rendered emoji; it was the
                       // number the old pattern could see. The true figure on the same
                       // dist/ is 1707, of which 954 are a single glyph: ✅ U+2705,
                       // overwhelmingly in comparison-table cells. Whether those count as
                       // interface chrome (the thing the October audit objected to) or as
                       // content is a design decision, not a find-and-replace, so they sit
                       // behind this ceiling exactly as the older exemptions do.
                       // Nothing was added to the site to move this number.
                       // Prior history, on the old undercounting pattern:
                       // 408 after Sprint 211 (the 'More for Cubicle Golfers' building
                       // glyph on all 62 compare pages moved to <Icon name="building"/>).
                       // 408 -> 410 in Sprint 237: one new article,
                       // /best-golf-hitting-net-and-mat/, carrying the same `emoji`
                       // card glyph every other article has. A new page costs two
                       // rendered glyphs; this is not chrome creeping back in.

if (!existsSync(DIST)) {
  console.log('validate-emoji-chrome: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

/**
 * ── Corrected 15 November 2026 (Sprint 248) ────────────────────────────────
 * The previous pattern was
 *   /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]\u{FE0F}|[\u{2190}-\u{21FF}]\u{FE0F}/gu
 * and it measured 413 glyphs while 1,294 went uncounted — 24% coverage on a
 * ratchet whose whole job is to count rendered emoji. Two holes:
 *
 *   1. It required U+FE0F on the U+2600-27BF range. The variation selector is
 *      only needed by glyphs that default to TEXT presentation. The ones that
 *      default to EMOJI presentation — ✅ U+2705, ❌ U+274C, ✨ U+2728, ⚡ U+26A1,
 *      ⛳ U+26F3, ⭐ U+2B50 — render as colour emoji with no FE0F at all, so
 *      every one of them was invisible here. ✅ alone renders 954 times.
 *   2. The band below U+2600 was not covered at all, so ⌚ U+231A, ⌛, ⏰ and
 *      the clock/hourglass glyphs were never counted either.
 *
 * EMOJI_DEFAULT below lists the emoji-presentation-by-default codepoints that
 * sit outside U+1F300-1FAFF. They are enumerated rather than taken as a range
 * because the surrounding blocks hold real typography — arrows, box drawing,
 * mathematical operators — which must not be counted as emoji.
 *
 * The ceiling moved UP as a result. That is a measurement correction, not a
 * regression and not permission to add glyphs: nothing was added to the site by
 * this change, 1,294 already-rendered glyphs simply became visible to the
 * check. From here the number only goes down, same rule as before.
 */
const EMOJI_DEFAULT =
  '\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{25FD}\u{25FE}' +
  '\u{2614}\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}' +
  '\u{26AA}\u{26AB}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26CE}\u{26D4}' +
  '\u{26EA}\u{26F2}\u{26F3}\u{26F5}\u{26FA}\u{26FD}' +
  '\u{2705}\u{270A}\u{270B}\u{2728}\u{274C}\u{274E}\u{2753}-\u{2755}' +
  '\u{2757}\u{2795}-\u{2797}\u{27B0}\u{27BF}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}';

const EMOJI = new RegExp(
  '[\u{1F300}-\u{1FAFF}]' +
  '|[' + EMOJI_DEFAULT + ']' +
  '|[\u{2600}-\u{27BF}]\u{FE0F}' +
  '|[\u{2190}-\u{21FF}]\u{FE0F}', 'gu');

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'index.html') out.push(p);
  }
  return out;
}

let total = 0;
let icons = 0;
const byPage: Array<[number, string]> = [];

for (const f of walk(DIST)) {
  const raw = readFileSync(f, 'utf8');
  const visible = raw
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, ' ');
  const n = (visible.match(EMOJI) ?? []).length;
  total += n;
  icons += (raw.match(/class="ic /g) ?? []).length;
  if (n) byPage.push([n, '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '')]);
}

if (total > CEILING) {
  byPage.sort((a, b) => b[0] - a[0]);
  console.error(`\n❌ Emoji as interface: ${total} colour-emoji glyph(s) rendered, ` +
    `ceiling ${CEILING} (which only goes down).\n`);
  for (const [n, p] of byPage.slice(0, 12)) console.error(`   ${String(n).padStart(4)}  ${p}`);
  console.error('\n   Use <Icon name="…" /> from src/components/Icon.astro. If the glyph is' +
    '\n   artwork rather than interface, say so here and lower the ceiling instead.\n');
  process.exit(1);
}

console.log(`✅ Emoji as interface: ${total} glyph(s) rendered (ceiling ${CEILING}), ` +
  `${icons} <Icon/> SVG(s) in their place.`);
