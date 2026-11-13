#!/usr/bin/env node
/**
 * validate-internal-arithmetic.ts — a page must be able to do its own sums.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Every price validator so far compares a number against the registry. None of
 * them look at whether the numbers *on one page* add up. That gap has a shape:
 * when a base price moves, the figures derived from it do not move with it, and
 * nothing notices because each figure still looks plausible on its own.
 *
 * Sprint 107 found nine of these by hand. Three I had created myself, hours
 * earlier, in that same sprint — I updated a purchase price and left the total
 * sitting in the next cell. Real examples that were live on the site:
 *
 *   "$249 + $99 = $278"                        (should be $348)
 *   R10 with sub, 5-year total $1,094          (should be $985)
 *   SkyTrak+ build listing $1,195 of parts,
 *   stated total $4,802                        (stale by $1,800 — the old
 *                                               $2,995 SkyTrak+ price)
 *
 * A wrong sum is worse than a wrong price. A reader who adds the column up and
 * gets a different answer has caught the site being careless, which is the one
 * thing an affiliate site cannot afford to look.
 *
 * ── Why four narrow rules and not a general parser ─────────────────────────
 * The corpus is prose, so anything clever produces noise. Each rule fires only
 * where the page has *stated* both the parts and the whole, which makes the
 * check verifiable rather than inferred. Everything ambiguous is skipped:
 * ranges ("$3,500-4,500"), and any row whose cells do not parse cleanly.
 */
import { ARTICLES } from '../src/data/articles';
import { COMPARISONS } from '../src/data/comparisons';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const money = (s: unknown) => parseFloat(String(s).replace(/[$,\s]/g, ''));
const isRange = (s: string) => /[\d,]\s*(?:-|–|—|to)\s*\$?\s*[\d,]/.test(s);
const strip = (s: string) => s.replace(/<[^>]+>/g, '').trim();

const problems: string[] = [];
const seen = new Set<string>();
const report = (slug: string, detail: string) => {
  const k = slug + '|' + detail;
  if (!seen.has(k)) { seen.add(k); problems.push(`   ${slug}\n      ${detail}`); }
};

const all: any[] = [...(ARTICLES as any), ...(COMPARISONS as any)];

/**
 * Sprint 104 swept a dead ASIN out of articles.ts and comparisons.ts and left
 * thirteen stale prices in .astro pages, because the sweep only knew about the
 * data files. Sprint 107 found them by hand. This validator is not repeating
 * that: the same rules run over the page sources as raw text.
 */
function astroSources(dir: string, out: Array<{ slug: string; body: string }> = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) astroSources(full, out);
    else if (name.endsWith('.astro')) out.push({ slug: full.replace('src/pages/', ''), body: readFileSync(full, 'utf8') });
  }
  return out;
}
for (const f of astroSources('src/pages')) all.push({ slug: f.slug, sections: [{ body: f.body }] });

for (const a of all) {
  const slug = a.slug ?? a.id ?? '?';

  const bodies: string[] = [];
  for (const s of a.sections ?? []) bodies.push(String(s.body ?? s.content ?? ''));
  for (const f of a.faqs ?? a.faq ?? []) bodies.push(String(f.answer ?? ''));
  for (const k of ['quickAnswer', 'verdict', 'bottomLine', 'intro']) bodies.push(String(a[k] ?? ''));

  for (const body of bodies) {
    if (!body) continue;

    // ── Rule A: "$a + $b = $c" ───────────────────────────────────────────
    // A short label may sit between a figure and the operator — "$175 sensors
    // + $99/year = $472" is the same claim as "$175 + $99 = $472", and the
    // tighter original missed it on /arccos-caddie-review/ for months. The gap
    // may not contain $, = or a digit, so it cannot swallow another term.
    const UNIT = String.raw`(?:\/\s*(?:yr|year|mo|month|dz|dozen))?`;
    const GAP = String.raw`(?:\s*[A-Za-z][A-Za-z\s-]{0,14})?\s*`;
    const ruleA = new RegExp(
      String.raw`\$\s*([\d,]+(?:\.\d+)?)` + UNIT + GAP + String.raw`(?:\+|plus)\s*\$?\s*([\d,]+(?:\.\d+)?)` +
      UNIT + GAP + String.raw`=\s*\$?\s*([\d,]+(?:\.\d+)?)`, 'gi');
    for (const m of body.matchAll(ruleA)) {
      const [x, y, z] = [m[1], m[2], m[3]].map(money);
      if (![x, y, z].every(isFinite)) continue;
      if (Math.abs(x + y - z) > 0.5)
        report(slug, `"${m[0]}" — ${x} + ${y} is ${x + y}, the page says ${z}`);
    }

    // ── Rule B: "$a + N x $b" (a purchase plus N years of a subscription) ─
    for (const m of body.matchAll(/\$\s*([\d,]+)\s*\+\s*(\d+)\s*(?:x|×|\*)\s*\$\s*([\d,]+)/gi)) {
      const base = money(m[1]), n = Number(m[2]), per = money(m[3]);
      if (![base, per].every(isFinite)) continue;
      // the stated whole is the nearest $ figure in the 40 chars before the "("
      const before = body.slice(Math.max(0, m.index! - 40), m.index!);
      const prior = [...before.matchAll(/\$\s*([\d,]+)/g)].pop();
      if (!prior) continue;
      const stated = money(prior[1]);
      if (!isFinite(stated)) continue;
      if (Math.abs(base + n * per - stated) > 0.5)
        report(slug, `"${m[0].trim()}" — ${base} + ${n}x${per} is ${base + n * per}, the page states ${stated}`);
    }

    // ── Rule C: a purchase / annual-sub / N-year-total table ─────────────
    for (const tm of body.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/g)) {
      const tbl = tm[1];
      const heads = [...tbl.matchAll(/<th[^>]*>(.*?)<\/th>/g)].map(m => strip(m[1]));
      const pIx = heads.findIndex(h => /purchase|^price$|hardware/i.test(h));
      const sIx = heads.findIndex(h => /annual|per year|\/\s*yr|sub/i.test(h));
      // A subscription column is either annual ("Annual Sub") or already summed
      // over the period ("3-Year Sub"). Reading the second kind as the first
      // multiplies it again and turns every row into a false positive — which
      // is exactly what the first version of this rule did on the buying guide.
      const subYears = sIx >= 0 ? Number((heads[sIx].match(/(\d+)\s*-?\s*year/i) || [])[1] || 0) : 0;
      const yrs = heads
        .map((h, i) => ({ i, y: (h.match(/(\d+)\s*-?\s*year/i) || [])[1] }))
        .filter(c => c.y && c.i !== sIx && /total/i.test(heads[c.i]));
      if (pIx < 0 || sIx < 0 || !yrs.length) continue;

      for (const rm of tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
        const cells = [...rm[1].matchAll(/<td[^>]*>(.*?)<\/td>/g)].map(m => strip(m[1]));
        if (cells.length < heads.length) continue;
        if (isRange(cells[pIx]) || isRange(cells[sIx])) continue;
        const p = money(cells[pIx]), sub = money(cells[sIx]);
        if (![p, sub].every(isFinite)) continue;

        for (const c of yrs) {
          const cell = cells[c.i];
          if (isRange(cell)) continue;
          const shown = money(cell);
          if (!isFinite(shown)) continue;
          // pre-summed sub column counts once; an annual one counts N times
          const expect = p + sub * (subYears ? 1 : Number(c.y));
          if (Math.abs(shown - expect) > 0.5)
            report(slug, `table row "${cells[0]}" — ${c.y}-year total shows $${shown.toLocaleString()}, but $${p.toLocaleString()} + ${subYears ? '' : c.y + 'x'}$${sub.toLocaleString()} is $${expect.toLocaleString()}`);
        }
      }
    }

    // ── Rule D: a <li> parts list followed by a stated total ─────────────
    // Per-period parts are counted by some pages and not others, so a page is
    // credited if its stated total matches the sum EITHER with or without them.
    const items = [...body.matchAll(/<li>([^<]*?)[—–-]\s*\$([\d,]+)([^<]*)<\/li>/g)]
      .map(m => ({ price: money(m[2]), period: /\/\s*(yr|year|mo|month)/i.test(m[3] + m[1]) }));
    const tm2 = body.match(/Total:?\s*(?:is\s*|roughly\s*|about\s*)?\$([\d,]+)/i);
    if (items.length >= 3 && tm2) {
      const stated = money(tm2[1]);
      const withAll = items.reduce((s, i) => s + i.price, 0);
      const noPeriod = items.filter(i => !i.period).reduce((s, i) => s + i.price, 0);
      if (isFinite(stated) && Math.abs(withAll - stated) > 0.5 && Math.abs(noPeriod - stated) > 0.5)
        report(slug, `parts list sums to $${noPeriod.toLocaleString()} (or $${withAll.toLocaleString()} counting per-period items), but the page states a total of $${stated.toLocaleString()}`);
    }

    // ── Rule E: an inline prose parts list followed by a stated total ────
    // The shape Rules A-D all miss. A build written as prose — "monitor
    // ($490), net ($350), mat ($99), mount ($25). Total: $964." — has no "=",
    // no "N x", no <table> and no <li>, so nothing looked at it. Six live
    // totals were wrong behind that gap on 13 Nov 2026, four of them because a
    // component price moved and the total stayed where it was:
    //
    //   /how-to-build-garage-golf-simulator/   stated $873, parts summed $764
    //   /apartment-golf-simulator-setup/       stated $1,313, parts summed $1,263
    //   /best-golf-simulator-under-5000/       stated $2,644, parts summed $2,694
    //   /best-golf-simulator-under-5000/       stated $4,257, parts summed $4,721
    //
    // Ranges are skipped, as everywhere else here: a part written "$100 to
    // $200" has no single value to add.
    {
      const totRe = /(?:Total:?\s*(is\s*|roughly\s*|about\s*|around\s*)?|equals\s+|comes to\s+)(~\s*)?\$([\d,]+(?:\.\d{2})?)/i;
      const tot = body.match(totRe);
      // Only the span that actually holds the parts matters. Checking the whole
      // body for a range was too blunt: "I practice 3-4 times per week", sitting
      // two sentences after the total, switched the rule off entirely — which is
      // how the first draft of this rule missed two of the six defects it was
      // written for. A range BETWEEN the parts and the total is still fatal,
      // because "$100 to $200" has no single value to add.
      if (tot && tot.index !== undefined) {
        const span = body.slice(0, tot.index);
        // A part can be priced per dozen or per year inside the same list
        // ("Ball: Srixon Q-Star Tour ($40/dz)"). Pages differ on whether such
        // an item belongs in the total, so — as in Rule D — the page is
        // credited if its stated figure matches either reading.
        const parts = [...span.matchAll(/\(\$([\d,]+(?:\.\d{2})?)(\/\s*(?:dz|dozen|mo|month|yr|year))?\)/g)];
        if (parts.length >= 3) {
          const first = parts[0].index ?? 0;
          if (!isRange(span.slice(first))) {
            const vals = parts.map(m => money(m[1]));
            const unitOnly = parts.filter(m => !m[2]).map(m => money(m[1]));
            const stated = money(tot[3]);
            const sum = vals.reduce((a, b) => a + b, 0);
            const sumNoPer = unitOnly.reduce((a, b) => a + b, 0);
            // "roughly $1,240" for a $1,239 build is honest writing, not a
            // broken sum. A hedged total is compared at the nearest $10; an
            // exact one is held to the cent.
            const hedged = Boolean((tot[1] && !/^is\s*$/i.test(tot[1])) || tot[2]);
            const r10 = (v: number) => Math.round(v / 10) * 10;
            const gap = (v: number) => hedged ? Math.abs(r10(v) - r10(stated)) : Math.abs(v - stated);
            const off = Math.min(gap(sum), gap(sumNoPer));
            if (isFinite(stated) && off > 0.5)
              report(slug, `inline parts (${vals.map(v => '$' + v.toLocaleString()).join(' + ')}) sum to $${sum.toLocaleString()}, but the page states a total of $${stated.toLocaleString()}`);
          }
        }
      }
    }
  }
}

const CEILING = 0;   // ratchet: only ever goes down

if (problems.length > CEILING) {
  console.error(`\n❌ ${problems.length} page(s) state a total that does not match their own components (ceiling ${CEILING}).`);
  console.error(`When a base price moves, the figures derived from it have to move too.\n`);
  problems.forEach(p => console.error(p));
  process.exit(1);
}
console.log(`✅ Internal arithmetic: every stated total matches its stated parts (${problems.length} within ceiling ${CEILING}).`);
