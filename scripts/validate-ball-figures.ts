#!/usr/bin/env node
/**
 * validate-ball-figures.ts — ball figures typed into a page, not read from balls.ts.
 *
 * ── The gap this closes ────────────────────────────────────────────────────
 * validate-chart-vs-registry.ts checks the `balls` ARRAY against the affiliate
 * registry. validate-brand-copy.ts checks the per-brand write-ups. Neither
 * looks at figures typed by hand into the page's own JSX, and on 17 November
 * 2026 that is where three wrong numbers were sitting — in the "Our Top Pick
 * for Each Swing Speed" block on /golf-ball-compression-chart/, the page
 * carrying ~28% of the site's impressions:
 *
 *     Callaway Supersoft    card said 38    balls.ts measured 44
 *     Titleist Pro V1       card said 87    balls.ts measured 93
 *     Titleist Tour Soft    card said 65    balls.ts measured 88   <- 23 points
 *
 * The Tour Soft card is the one a reader at 85-100 mph is steered to. It also
 * described an ionomer ball as having "urethane-like feel", and the Supersoft
 * card claimed "under $25/dozen" against a registry price of $27.
 *
 * The page's own Sprint 169 comment predicted exactly this — "a figure typed
 * beside a product name drifts the moment balls.ts moves" — and `pill()` was
 * built to stop it. That one block never got converted, so the prediction came
 * true in the only place still exposed to it.
 *
 * ── What this checks, across every page under src/pages ────────────────────
 *   A  An object literal carrying both a ball's `name:` and a literal
 *      `compression:` — the picks-block shape. The number must equal balls.ts.
 *   B  A ball name followed within 140 chars by "$N a dozen | per dozen |
 *      /dozen | /dz". The dollar figure must equal the balls.ts price.
 *   C  A ball name followed within 140 chars by "at N compression" or
 *      "compression of N". The number must equal balls.ts.
 *   D  A ball flagged `discontinued: true` in balls.ts named inside a `faq`
 *      answer. ballUrl() deliberately strips the buy button from those rows,
 *      so an FAQ that recommends one sends the reader to a dead end. This is
 *      what the "cheapest Titleist urethane" answer did with the Tour Speed
 *      while ball-brands.ts, in the same repo, already resolved that question
 *      to the AVX.
 *
 * Ceiling 0. Every one of these is derivable from balls.ts, so there is no
 * legitimate reason to type one — the fix is always to read the record.
 */
import fs from 'fs';
import path from 'path';
import { balls as BALLS } from '../src/data/balls.ts';

/**
 * Ratchet, raised ONCE on 22 Nov 2026 when this guard was extended to read
 * articles.ts and comparisons.ts (coverage 23 figures -> 169).
 *
 * The 10 on the books are NOT all real. At least three are false positives
 * from the window logic: the prose says "Srixon Soft Feel ($25/dozen) and
 * Callaway Supersoft ($27/dozen)" — correct copy — and the Soft Feel's window
 * reaches past the next ball name to claim the Supersoft's $27. The window is
 * supposed to stop at the next ball name and in this shape it does not.
 *
 * Correct prose was NOT edited to make this number go down. Fix the window
 * first, re-measure, then lower this. Only ever edit downward.
 */
/**
 * Ratchet. 22 Nov 2026: 10 -> 2 after two guard bugs were fixed (a qualifier
 * before the price, and a window crossing an array boundary) and four stale
 * figures corrected.
 *
 * The 2 remaining are both the SAME product: TaylorMade Noodle comparison-table
 * rows at $20 against balls.ts's $19. Its registry entry has no dated price
 * check, so there is no trustworthy side to align to — fixing either would be
 * a guess. One live price check closes this to 0.
 *
 * Only ever edit downward.
 */
const CEILING = 2;

type Ball = { name: string; compression: number; price: number; discontinued?: boolean };
const byName = new Map<string, Ball>();
for (const b of BALLS as any[]) byName.set(b.name, b);
// Longest names first so "Titleist Pro V1x" is tested before "Titleist Pro V1".
const names = [...byName.keys()].sort((a, b) => b.length - a.length);
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function pages(): Array<{ file: string; text: string }> {
  const out: Array<{ file: string; text: string }> = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      if (!e.name.endsWith('.astro')) continue;
      // Strip comments first. The page documents its OWN past drift in prose
      // comments — the Sprint 169 note quotes 'Vice Pro at "$33/dz, 80
      // compression"' verbatim — and scanning those reports the historical
      // figure as a live error. Whitespace-preserving replacement keeps the
      // remaining offsets honest.
      const raw = fs.readFileSync(full, 'utf8');
      const blank = (m: string) => m.replace(/[^\n]/g, ' ');
      const text = raw
        .replace(/\/\*[\s\S]*?\*\//g, blank)
        .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, blank)
        .replace(/^[ \t]*\/\/.*$/gm, blank);
      out.push({ file: full, text });
    }
  };
  walk('src/pages');
  // Sprint 265: articles.ts and comparisons.ts are prose too, and this guard
  // never read them — 196 article records and every comparison unchecked.
  // Extending it takes coverage from 23 figures to 169.
  for (const f of ['src/data/articles.ts', 'src/data/comparisons.ts'])
    out.push({ file: f, text: fs.readFileSync(f, 'utf8') });
  return out;
}

type Fault = { file: string; rule: string; ball: string; said: string; real: string };
const faults: Fault[] = [];
let checked = 0;

for (const { file, text } of pages()) {
  // ── A. object literals holding a ball name and a typed compression ──────
  for (const m of text.matchAll(/\{[^{}]*?name:\s*'([^']+)'[^{}]*?\}/g)) {
    const b = byName.get(m[1]);
    if (!b) continue;
    const c = m[0].match(/compression:\s*'?(\d+)'?/);
    if (!c) continue;
    checked++;
    if (+c[1] !== b.compression)
      faults.push({ file, rule: 'A typed compression in an object literal', ball: b.name, said: c[1], real: String(b.compression) });
  }

  // ── B/C. a ball name with a figure close behind it in prose ─────────────
  //
  // The window STOPS at the next ball name. Without that stop a regex happily
  // leaps a second product and blames the first for its price: an early run of
  // this check reported "Vice Pro: page says $19" from a sentence whose $19
  // belonged to the Vice Drive two clauses later. A figure only counts against
  // a ball if no other ball's name sits between them.
  const anyName = new RegExp(names.map(esc).join('|'), 'g');
  for (const n of names) {
    const b = byName.get(n)!;
    const hit = new RegExp(esc(n), 'g');
    for (const h of text.matchAll(hit)) {
      const from = h.index! + n.length;
      // "Titleist Pro V1" is a substring of "Titleist Pro V1x". Without a
      // boundary check the Pro V1 claims the Pro V1x's price, which is how an
      // early run of this check reported Pro V1 at $55 from a Pro V1x row.
      if (/^[A-Za-z0-9]/.test(text.slice(from, from + 1))) continue;
      // A name that is the PREFIX of a longer product not in balls.ts would
      // otherwise steal that product's figures: "Srixon Z-Star XV at 102" was
      // reported against the Z-Star's 85 because the XV is not a chart row.
      // If what follows is another capitalised or all-caps product word, this
      // is a different ball and none of our business.
      if (/^ (?:[A-Z][a-z]+|[A-Z]{1,3}\d*|\d+)\b/.test(text.slice(from, from + 12))
          && !/^ (?:at|is|was|costs?|has|sits|measures?|and|or|in|on|for|vs|a|the|to)\b/i.test(text.slice(from, from + 12))) continue;
      // where does the next DIFFERENT ball name start?
      anyName.lastIndex = from;
      let stop = Math.min(from + 140, text.length);
      let o: RegExpExecArray | null;
      while ((o = anyName.exec(text))) {
        if (o[0] === n && o.index === h.index) continue;
        if (o.index >= from) { stop = Math.min(stop, o.index); break; }
      }
      // and never run past the end of the sentence
      const dot = text.indexOf('.', from);
      if (dot >= 0) stop = Math.min(stop, dot);
      // nor out of the string literal it started in: these records are single
      // lines, so a window that crosses "', '" has left the sentence entirely
      // and is reading an unrelated field.
      // ONLY structural ends — the close of an array or object, or a newline.
      // NOT a plain field separator: a comparison-table row legitimately runs
      // name: '...' , affiliateKey: '...', price: '~$38/dz', and that price IS
      // a claim about that ball. Cutting at "', " killed 25 real checks and
      // silently dropped the Noodle $20-vs-$19 fault out of the count.
      for (const edge of ['],', '];', '},', '};', '\n']) {
        const e = text.indexOf(edge, from);
        if (e >= 0) stop = Math.min(stop, e);
      }
      const win = text.slice(from, stop);

      // Three shapes that look like a price and are not one:
      //   a RANGE  "$22-$50 a dozen"  — a street spread, both ends legitimate
      //   a DELTA  "$19 a dozen cheaper" — a saving, not a price
      //   a FLOOR  "from $45 a dozen"    — deliberately open-ended
      const pm = win.match(/(\$\d+(?:\.\d+)?\s*[-–]\s*)?\$(\d+)(?:\.\d+)?\s*(?:a dozen|per dozen|\/dozen|\/dz)(\s*(?:cheaper|less|more|dearer|below|above|under|over|apart|difference|gap))?/);
      const isRange = !!(pm && pm[1]);
      const isDelta = !!(pm && pm[3]);
      const isFloor = !!(pm && /\b(?:from|starts? at|as little as|up to)\s*\$?$/.test(win.slice(0, pm.index)));
      // A qualifier BEFORE the figure is as disqualifying as one after it.
      // "the extra $10 a dozen", "without paying $50 per dozen" and
      // "whether $40 a dozen beats..." are a delta, a threshold and a
      // rhetorical comparison — none is the ball's price. The original check
      // only looked forward, which is how all three were reported as faults.
      const LEAD_NOT_A_PRICE = /\b(?:extra|additional|more|less|another|without (?:paying|spending)|whether|versus|vs\.?|compared to|beats?|than|over|under|save[sd]?|saving)\s+(?:about\s+|roughly\s+|around\s+)?~?\$?$/i;
      const isLeadQualified = !!(pm && LEAD_NOT_A_PRICE.test(win.slice(0, pm.index)));
      if (pm && !isRange && !isDelta && !isFloor && !isLeadQualified) {
        checked++;
        if (+pm[2] !== b.price)
          faults.push({ file, rule: 'B price per dozen in prose', ball: n, said: '$' + pm[2], real: '$' + b.price });
      }
      const cm = win.match(/at (\d+) compression|compression of (\d+)/);
      if (cm) {
        const said = cm[1] || cm[2];
        checked++;
        if (+said !== b.compression)
          faults.push({ file, rule: 'C compression in prose', ball: n, said, real: String(b.compression) });
      }
    }
  }

  // ── D. a discontinued ball recommended inside an FAQ answer ─────────────
  const faqBlock = text.match(/const faqs?\s*(?::[^=]*)?=\s*\[[\s\S]*?\n\];/);
  if (faqBlock) {
    for (const n of names) {
      const b = byName.get(n)!;
      if (!b.discontinued) continue;
      if (faqBlock[0].includes(n)) {
        checked++;
        faults.push({ file, rule: 'D discontinued ball named in an FAQ answer', ball: n, said: 'recommended', real: 'discontinued in balls.ts — ballUrl() gives it no button' });
      }
    }
  }
}

if (faults.length > CEILING) {
  console.log(`\n❌ Ball figures typed into pages: ${faults.length} disagree with balls.ts (ceiling ${CEILING}).\n`);
  for (const f of faults)
    console.log(`   ${f.file}\n      [${f.rule}] ${f.ball}: page says ${f.said}, balls.ts says ${f.real}`);
  console.log(`\n   balls.ts is the single source of truth. Read the record instead of typing`);
  console.log(`   the figure — the page already has a ball() helper and a pill() renderer.\n`);
  process.exit(1);
}

console.log(`✅ Ball figures: ${checked} figure(s) across ${pages().length} page(s), ${faults.length} disagreeing with balls.ts, no discontinued ball recommended in an FAQ (ceiling ${CEILING}).`);
