#!/usr/bin/env node
/**
 * Guard: section headings keep their separator, and prose keeps its measure.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Two defects shipped here and neither was visible in the CSS, because the CSS
 * was right and the HTML had moved underneath it.
 *
 * 1. `.art-content h2:first-of-type { border-top: none; margin-top: 0 }` was
 *    written when h2s were direct children of the article. Every h2 is now
 *    wrapped in its own <div> or <section> (2,064 of them, none a direct
 *    child), so :first-of-type matched almost all of them and stripped the 2px
 *    rule and 44px margin from every section heading. Measured result: sections
 *    separated by 20px while paragraphs inside them were separated by 40px —
 *    the page grouped the end of one section with the start of the next.
 *
 * 2. The prose column inherited the 1400px article width, putting running text
 *    at ~114 characters per line against a 50-75 ideal and an 80-character WCAG
 *    ceiling.
 *
 * Neither is detectable by reading the stylesheet. Both are trivial to measure
 * in the built HTML, which is what this does.
 *
 * Checks, against dist/:
 *   - the h2 separator rule is present and is NOT globally cancelled
 *   - a prose max-width is declared
 *
 * This is a source-level guard on the emitted CSS rather than a layout
 * measurement, because computing rendered geometry needs a browser. It catches
 * the regression that actually happened: the rule being silently cancelled.
 */
import fs from 'fs';
import path from 'path';

if (!fs.existsSync('dist')) { console.log('⏭  validate-typography: no dist/, skipping.'); process.exit(0); }

const cssFiles = fs.existsSync('dist/_astro')
  ? fs.readdirSync('dist/_astro').filter(f => f.endsWith('.css')).map(f => path.join('dist/_astro', f))
  : [];
const css = cssFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

const problems: string[] = [];

// Sprint 152 — the separator must exist EXACTLY ONCE, on the full-width
// section wrapper. Previously this asserted it was on the h2. That was right
// while headings spanned the shell, and became wrong the moment Sprint 151
// narrowed and centred them: the heading's border shrank to the reading
// measure while .art-section's stayed full width, so the page drew two rules
// of different widths above every section. The defect was not a missing
// border — it was a second one. So check for one, and only one.
const sepOnSection = /\.art-section\s*\{[^}]*border-top:\s*2px/.test(css);
// `.art-content h2` may sit in a selector list with the bespoke containers,
// so match the rule block it belongs to rather than requiring it to stand alone.
const sepOnHeading = /\.art-content\s+h2\s*[,{][^{}]*\{[^}]*border-top:\s*2px/.test(css);
if (!sepOnSection) {
  problems.push(
    'No 2px border-top on .art-section — sections have lost their separator. ' +
    'It belongs on the section wrapper, which spans the full shell, not on the ' +
    'heading, which is capped at the reading measure.'
  );
}
// Sprint 156 — BOTH must carry it now, because not every page wraps its
// headings in .art-section: the compression chart has 15 h2s and one wrapper,
// so moving the separator to the wrapper alone silently stripped it from 14 of
// them, and from every heading on the brand chart pages and /tools/. The
// heading draws the line; the wrapper cancels it where it draws its own. What
// has to hold is ONE line per boundary — never none, never two.
if (!sepOnHeading) {
  problems.push(
    'No 2px border-top on .art-content h2. Pages that do not wrap headings in ' +
    '.art-section (the compression chart, the brand charts, /tools/) then have ' +
    'no section separator at all — measured 14 of 15 headings bare on ' +
    '/golf-ball-compression-chart/.'
  );
}
if (!/\.art-content\s+\.art-section\s+h2[^{]*\{[^}]*border-top:\s*none/.test(css)) {
  problems.push(
    'The .art-section wrapper does not cancel the heading separator, so pages ' +
    'using the wrapper draw TWO lines per boundary.'
  );
}

// the bug: an unscoped :first-of-type exception cancels the rule on every h2,
// because every h2 is the first of its type inside its own wrapper.
const unscopedCancel = /(^|[,{}])\s*\.art-content\s+h2:first-of-type\s*\{[^}]*border-top:\s*(none|0)/.test(css);
if (unscopedCancel) {
  problems.push(
    'Found `.art-content h2:first-of-type { border-top: none }`. :first-of-type is scoped to the\n' +
    '     PARENT, and every h2 here sits in its own wrapper, so this cancels the separator on EVERY\n' +
    '     section heading, not just the first. Scope it to the article\'s first block instead.'
  );
}

// Sprint 150 — the column is FLUID, so checking a single px value no longer
// describes it. What has to hold is the thing the px value was only ever a
// proxy for: the rendered line length, at both ends of the fluid range.
//
// Two prior versions of this check both gave false passes:
//   - v1 looked for any `max-width: <n>ch` in the bundle and matched unrelated
//     76ch/68ch rules after the prose cap had been deleted.
//   - v2 (Sprint 148) matched `max-width: <n>px` on .art-content and reported
//     700px as "73 characters". It was 81. box-sizing is border-box globally,
//     so ~51px of padding a side sat inside the 700px and the real text box was
//     598px — the validator was measuring the border box and calling it text.
//
// So this version reads the two custom properties that define the ramp and
// computes the character count itself, at the minimum AND the maximum, using
// the measured glyph ratio for DM Sans. Both ends must land in the band.
const AVG_CHAR_EM = 0.47;  // AVERAGE rendered character width in DM Sans,
                           // measured in-browser at 1024/1280/1512/1920px.
                           // Deliberately NOT the `ch` unit (0.684em, the
                           // width of "0"): ch under-reports real line length
                           // by ~30%, which produced a false pass reporting
                           // 55 characters for a column that rendered 80.
const MIN_CHARS = 50;      // below this the eye re-sweeps too often
const MAX_CHARS = 78;      // ratchet: WCAG 1.4.8 caps at 80, we ship 75

const clampEnds = (name: string): [number, number] | null => {
  // --name: clamp(<min>px, <a>px + <b>vw, <max>px)
  const m = css.match(
    new RegExp('--' + name + ':\\s*clamp\\(\\s*([\\d.]+)px[^,]*,[^,]*,\\s*([\\d.]+)px\\s*\\)')
  );
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : null;
};

const w = clampEnds('prose-w');
const f = clampEnds('prose-size');

if (!w || !f) {
  problems.push(
    'Could not find fluid --prose-w and --prose-size clamp() pairs. The text ' +
    'column must be defined as a clamp() of px bounds so its line length is ' +
    'checkable at both ends (measured 114 characters per line before any cap ' +
    'existed, and 81 under the fixed 700px that replaced it).'
  );
} else {
  // The narrow end of the column pairs with the small end of the type, and the
  // wide end with the large end, because both clamps share one viewport range.
  const ends: [string, number, number][] = [
    ['narrow', w[0], f[0]],
    ['wide',   w[1], f[1]],
  ];
  for (const [label, width, size] of ends) {
    const chars = Math.round(width / (AVG_CHAR_EM * size));
    if (chars < MIN_CHARS || chars > MAX_CHARS) {
      problems.push(
        `At the ${label} end of the fluid range the prose column is ${width}px ` +
        `at ${size}px type, which renders ~${chars} characters per line ` +
        `(outside the ${MIN_CHARS}-${MAX_CHARS} band).`
      );
    }
  }
  // The two clamps must actually track each other, or the character count
  // drifts across the range even though both ends pass.
  const narrowCh = w[0] / (AVG_CHAR_EM * f[0]);
  const wideCh   = w[1] / (AVG_CHAR_EM * f[1]);
  if (Math.abs(narrowCh - wideCh) > 3) {
    problems.push(
      `--prose-w and --prose-size are not in lockstep: ${narrowCh.toFixed(1)}ch ` +
      `at the narrow end vs ${wideCh.toFixed(1)}ch at the wide end. The column ` +
      `and the type must scale together or the measure drifts mid-range.`
    );
  }
  /* ── Sprint 189 — the measure no longer caps body copy ───────────────────
   * Ryan chose full-width body copy on 18 Oct 2026, after being shown the
   * rendered comparison and this table:
   *      375px  37ch -> 37ch   (phones identical; the cap never applied)
   *     1024px  70ch -> 101ch
   *     1440px  70ch -> 127ch  (WCAG 1.4.8 guidance is 80)
   * So the checks that USED to live here — "prose must carry --prose-w" and
   * "that rule must exclude box descendants" — are gone on purpose. They were
   * correct for the old design and would now fail the build every time.
   *
   * Deleting them outright would leave line length completely unguarded, and
   * the next person who widens --content-w would make it worse with nothing
   * to say so. So the guard is RE-POINTED rather than removed: line length is
   * now a function of the CONTAINER, and it may not get worse than what was
   * actually agreed. */
  const contentW = /--content-w:\s*(\d+)px/.exec(css);
  if (!contentW) {
    problems.push(
      'No --content-w px value found. Body copy now spans the container, so ' +
      'the container width IS the line length — it has to stay a bounded px ' +
      'value or text runs edge-to-edge on a wide monitor.'
    );
  } else {
    const CW = parseInt(contentW[1], 10);
    const shell = CW - 96;                    // minus --page-px a side

    /* The worst case is NOT the smallest font against the widest column.
     * A first cut did exactly that — 18px against 1304px — and reported 154
     * characters for a layout that renders 137, which would have sent me
     * narrowing a container that was fine. The two clamps share one viewport
     * ramp: the column stops growing at --content-w, and at THAT viewport the
     * type is already partway up its own ramp. So the font must be evaluated
     * at the viewport where the column maxes out. */
    const ramp = /--prose-size:\s*clamp\(\s*[\d.]+px\s*,\s*([\d.]+)px\s*\+\s*([\d.]+)vw\s*,\s*([\d.]+)px/.exec(css);
    let worst: number | null = null;
    if (ramp) {
      const base = parseFloat(ramp[1]), vw = parseFloat(ramp[2]) / 100, max = parseFloat(ramp[3]);
      const sizeAtMax = Math.min(Math.max(base + vw * CW, f[0]), max);
      worst = Math.round(shell / (AVG_CHAR_EM * sizeAtMax));
    }
    const AGREED_MAX = 140;   // ratchet. Measured 137 at the agreed 1400px
                              // container. Lower it freely; raising it means
                              // making reading worse than what was agreed, so
                              // it needs the same conversation again.
    if (worst !== null && worst > AGREED_MAX) {
      problems.push(
        `Body copy would render ~${worst} characters per line at the widest ` +
        `(container ${CW}px). That is past the ${AGREED_MAX} agreed when ` +
        `full-width was chosen. Narrow --content-w or raise --prose-size.`
      );
    }
  }

  /* The container itself must stay bounded. Checked on the BARE .art-content
   * rule only — a first cut matched any selector containing ".art-content",
   * which includes the descendant rules just set to 100%, and fired on a
   * stylesheet that was correct. */
  const bare = /(?:^|[}\n])\s*\.art-content\s*\{([^}]*)\}/.exec(css);
  if (!bare || !/max-width:\s*var\(--content-w\)/.test(bare[1])) {
    problems.push(
      '.art-content is not bounded by --content-w. Full width means the full ' +
      'CONTAINER, not edge-to-edge on a 2560px monitor.'
    );
  }
}

// ── heading hierarchy ──────────────────────────────────────────────────────
// Sprint 157 — headings must stay LARGER than the body, at every width.
// This failed silently for seven sprints: Sprint 150 made body prose fluid
// (18→24px) and left the headings at their fixed sizes, so at a 1411px window
// body rendered 20.4px against an h3 of 19px — the heading was smaller than
// the paragraph beneath it, and h2 at 26px was only 1.08× the body at wide
// viewports. Nothing caught it because every rule was individually valid.
//
// Expressing the headings as multiples of --prose-size is what makes the
// hierarchy structural rather than coincidental. This asserts that shape,
// rather than specific pixel values that would need editing every time the
// body size moves.
{
  const mult = (name: string): number | null => {
    const m = css.match(
      new RegExp('--' + name + ':\\s*calc\\(\\s*var\\(--prose-size\\)\\s*\\*\\s*([\\d.]+)')
    );
    return m ? parseFloat(m[1]) : null;
  };
  const h3 = mult('h3-size');
  const h2 = mult('h2-size');
  if (h3 === null || h2 === null) {
    problems.push(
      'Heading sizes are not derived from --prose-size. Fixed heading sizes ' +
      'invert the hierarchy whenever the fluid body size changes — measured ' +
      'h3 at 19px against body at 20.4px before this was fixed.'
    );
  } else {
    if (h3 <= 1.1) {
      problems.push(`--h3-size is ${h3}x the body size; below ~1.1x it does not read as a heading.`);
    }
    if (h2 <= h3) {
      problems.push(`--h2-size (${h2}x) is not larger than --h3-size (${h3}x) — the two levels are indistinguishable.`);
    }
  }
  // a fixed px font-size on the prose headings reintroduces the drift
  for (const h of ['h2', 'h3']) {
    const re = new RegExp(`\\.art-content ${h}[^{]*\\{[^}]*font-size:\\s*(\\d+)px`);
    const m = css.match(re);
    if (m) {
      problems.push(
        `.art-content ${h} sets a fixed font-size of ${m[1]}px. It must use ` +
        `var(--${h}-size) so it tracks the fluid body size.`
      );
    }
  }
}

// ── table alignment ────────────────────────────────────────────────────────
// A column must align as a unit: every cell in it, plus its header, the same
// way. Mixed alignment inside one column is the defect right-alignment exists
// to prevent — it stops the digits lining up by place value, which is the whole
// point. Checks the built HTML rather than the CSS, because alignment is decided
// per table at build time (src/lib/table-align.ts).
{
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
      const p = path.join(d, e.name);
      return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
    });
  const ragged: string[] = [];
  let tables = 0;
  for (const file of walk('dist')) {
    const html = fs.readFileSync(file, 'utf-8');
    if (!html.includes('class="cmp-table"')) continue;
    const slug = '/' + path.relative('dist', path.dirname(file)).split(path.sep).join('/') + '/';
    for (const tbl of html.match(/<table class="cmp-table"[\s\S]*?<\/table>/g) || []) {
      tables++;
      const headAttrs = [...tbl.matchAll(/<th\b([^>]*)>/g)].map(m => m[1]);
      const bodyRows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].slice(1);
      const colNumeric: (boolean | null)[] = headAttrs.map(a => a.includes('cmp-num'));
      for (const match of bodyRows) {
        const row = match[1];
        const cells = [...row.matchAll(/<td\b([^>]*)>/g)].map(m => m[1]);
        cells.forEach((a, i) => {
          const isNum = a.includes('cmp-num');
          // column 0 is the product name, last is the Buy button — both always left
          if (i === 0 || i >= colNumeric.length - 1) return;
          if (colNumeric[i] !== undefined && colNumeric[i] !== isNum) {
            ragged.push(`${slug} column ${i}: header ${colNumeric[i] ? 'right' : 'left'}, a cell ${isNum ? 'right' : 'left'}`);
          }
        });
      }
    }
  }
  const uniq = [...new Set(ragged)];
  if (uniq.length) {
    problems.push(
      `${uniq.length} table column(s) align inconsistently between header and cells:\n` +
      uniq.slice(0, 8).map(r => '       ' + r).join('\n')
    );
  } else {
    console.log(`\u2705 Table alignment: ${tables} comparison table(s) — every column aligns as a unit.`);
  }
}

if (problems.length) {
  console.error(`\n❌ validate-typography: ${problems.length} problem(s).`);
  problems.forEach(p => console.error('   - ' + p));
  console.error('\n   These control whether readers can tell where one section ends and the next begins.');
  process.exit(1);
}
console.log(`✅ Typography: section separator intact and not globally cancelled; body copy spans the container, bounded by --content-w.`);
