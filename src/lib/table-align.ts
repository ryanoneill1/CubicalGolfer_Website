/**
 * table-align.ts — decide column alignment for the article comparison tables.
 *
 * ── Why alignment is decided per COLUMN, never per cell ─────────────────────
 * Right-aligning numerals lets a reader compare magnitude by scanning down a
 * column: the digits line up by place value, so 34, 60 and 102 stack by units,
 * tens and hundreds. That only works if the whole column moves together. Of the
 * site's columns, 5 are almost entirely numeric and 29 almost entirely text, but
 * 13 are mixed — "Price" is 79% numeric because some cells read "Free" or
 * "From $899". Aligning those cell by cell would leave the column ragged, which
 * is worse than leaving everything left-aligned.
 *
 * So: a column is numeric if most of its cells are, and then EVERY cell in it
 * right-aligns, including the "Free" and the "Lifetime".
 *
 * ── Why this reads the rendered cells, not the data fields ──────────────────
 * The header-to-field mapping is not consistent across tables — auditing found a
 * "Forgiveness" column holding price values. Deciding from the strings actually
 * being rendered sidesteps that entirely.
 *
 * Deliberately NOT applied to /compare/ specs tables: those are transposed
 * (rows are specs, columns are the two products), so a column mixes prices,
 * weights and yes/no answers and has no shared magnitude to align.
 */

/**
 * A cell counts as numeric when a figure both STARTS it and DOMINATES it.
 *
 * "Leads with a digit" alone is not enough. It accepted "4-way stretch",
 * "12 pieces + bag" and "12 metrics", which pushed three text columns over the
 * threshold and right-aligned them. Requiring the numeric characters to be at
 * least 40% of the non-space content keeps the real measures and rejects the
 * phrases:
 *
 *   ~$399          100%  numeric
 *   4.6/5 ★         83%  numeric
 *   200,000+       100%  numeric
 *   0–75 mph        43%  numeric
 *   12 metrics      20%  text
 *   4-way stretch    8%  text
 *   12 pieces + bag 25%  text
 */
const NUMERIC_DENSITY = 0.4;

export const isNumericCell = (v: unknown): boolean => {
  if (typeof v !== 'string') return false;
  const t = v.trim();
  if (!/^[~<>$\s]*\d/.test(t)) return false;
  const solid = t.replace(/\s/g, '');
  if (!solid) return false;
  const figures = (solid.match(/[\d.,$~<>+%\/–\-]/g) || []).length;
  return figures / solid.length >= NUMERIC_DENSITY;
};

/** Share of non-empty cells in a column that must be numeric before it right-aligns. */
export const NUMERIC_COLUMN_THRESHOLD = 0.6;

/**
 * @param matrix rows of already-rendered cell strings, one array per row
 * @returns one boolean per column: true = right-align
 */
export function numericColumns(matrix: string[][]): boolean[] {
  if (!matrix.length) return [];
  const width = Math.max(...matrix.map(r => r.length));
  const out: boolean[] = [];
  for (let c = 0; c < width; c++) {
    const vals = matrix
      .map(r => r[c])
      .filter(v => typeof v === 'string' && v.trim() && v.trim() !== '—');
    if (vals.length < 2) { out.push(false); continue; }
    out.push(vals.filter(isNumericCell).length / vals.length >= NUMERIC_COLUMN_THRESHOLD);
  }
  return out;
}
