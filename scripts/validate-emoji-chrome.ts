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
const CEILING = 479;

if (!existsSync(DIST)) {
  console.log('validate-emoji-chrome: no dist/ yet — skipped (runs after astro build).');
  process.exit(0);
}

const EMOJI = /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]\u{FE0F}|[\u{2190}-\u{21FF}]\u{FE0F}/gu;

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
