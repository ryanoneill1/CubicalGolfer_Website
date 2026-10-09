#!/usr/bin/env node
/**
 * Guard: a column header must describe what the column actually contains.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * The article template fills comparison tables from three generic data slots —
 * `feature1`, `feature2` and `bestFor` — poured POSITIONALLY into whatever
 * headers it does not recognise by name. So when a page declares a header the
 * data has no value for, every column after it silently shifts.
 *
 * Shipped live on two pages before this guard existed:
 *
 *   /best-golf-bags-2026/        "Type" held 2.8 lbs, "Weight" held "Walkers"
 *   /best-golf-shoes-for-walking/  "Weight" held "Yes" and "GORE-TEX"
 *
 * Nothing caught it. validate-table-promises checks the PROSE against the
 * columns; validate-table-vs-registry checks PRICES. Neither asks the obvious
 * question: does the column headed "Weight" contain weights?
 *
 * The check is deliberately narrow. It only fires on headers whose meaning
 * carries a unit — weight, price, loft — where a wrong value is unmistakable.
 * Headers containing "range" or "band" are exempt, because "35–55" under
 * "Compression Range" is correct and an earlier draft of this flagged it.
 */
import fs from 'node:fs';
import path from 'node:path';

const UNITS: Record<string, { pattern: RegExp; wants: string }> = {
  weight: { pattern: /\b(lb|lbs|oz|g|kg|grams?|pounds?)\b|\bheavy\b|\blight\b/i, wants: 'a weight' },
  price:  { pattern: /[$£€]|\bfree\b|\bincluded\b/i,                            wants: 'a price'  },
  loft:   { pattern: /°|\bdeg\b|\bdegrees?\b/i,                                 wants: 'a loft'   },
};

const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });

const problems: string[] = [];
let tables = 0;

for (const file of walk('dist')) {
  const html = fs.readFileSync(file, 'utf8');
  for (const t of html.match(/<table[^>]*class="[^"]*cmp-table[^"]*"[^>]*>[\s\S]*?<\/table>/g) ?? []) {
    tables++;
    const heads = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].slice(1);
    if (!heads.length || !rows.length) continue;

    const cols = new Map<number, string[]>();
    for (const r of rows) {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      cells.forEach((c, i) => { if (i < heads.length) (cols.get(i) ?? cols.set(i, []).get(i)!).push(c); });
    }

    for (const [i, head] of heads.entries()) {
      const hl = head.toLowerCase();
      if (/range|band/.test(hl)) continue;             // "Compression Range" holds "35–55"
      const unit = Object.keys(UNITS).find(k => hl.includes(k));
      if (!unit) continue;
      const vals = (cols.get(i) ?? []).filter(v => v && v !== '—');
      if (vals.length < 2) continue;
      const hits = vals.filter(v => UNITS[unit].pattern.test(v)).length;
      if (hits / vals.length < 0.5) {
        problems.push(
          `${file.replace('dist/', '/').replace('/index.html', '/')} — column "${head}" ` +
          `should hold ${UNITS[unit].wants}, but holds ${JSON.stringify(vals.slice(0, 2))}. ` +
          `The headers likely declare a column the row data has no value for, which ` +
          `shifts every column after it.`
        );
      }
    }
  }
}

if (problems.length) {
  console.error(`\n❌ Table headers: ${problems.length} column(s) do not match their contents.`);
  for (const p of problems) console.error(`   - ${p}`);
  console.error(
    `\n   A table that mislabels its own columns is worse than no table: the reader\n` +
    `   cannot tell which numbers to trust, on a site whose whole claim is that the\n` +
    `   numbers are checked.\n`
  );
  process.exit(1);
}

console.log(`✅ Table headers: ${tables} comparison table(s) — every unit-bearing column matches its header.`);
