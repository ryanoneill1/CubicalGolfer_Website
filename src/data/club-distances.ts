// Single source of truth for the club-distance chart.
//
// Extracted from golf-club-distance-chart/index.astro in Sprint 102 so the
// downloadable PDF can be generated from the same numbers the page renders.
// This is the balls.ts lesson applied again: when the PDF generator kept its
// own hardcoded copy of the ball data it silently served prices two sprints
// out of date on the site's highest-CTR asset. One copy, many consumers.
//
// CLUBS: [name, carry ratio vs driver, typical roll (yds), family]
// TIERS: driver swing speeds (mph) the reference table is built across.
export const CLUBS: [string, number, number, string][] = [
  ['Driver',1.00,20,'wood'],['3-Wood',0.86,14,'wood'],['5-Wood',0.80,12,'wood'],
  ['4-Hybrid',0.76,8,'hybrid'],['5-Iron',0.72,6,'iron'],['6-Iron',0.68,5,'iron'],
  ['7-Iron',0.64,4,'iron'],['8-Iron',0.59,3,'iron'],['9-Iron',0.54,3,'iron'],
  ['PW',0.49,2,'wedge'],['GW (50\u00b0)',0.44,2,'wedge'],['SW (56\u00b0)',0.36,1,'wedge'],['LW (60\u00b0)',0.30,1,'wedge'],
];

export const TIERS = [75, 85, 95, 105, 115];

// ── Hybrids ────────────────────────────────────────────────────────────────
// Sprint 227. The main CLUBS table is a representative 13-club BAG, and it
// carries exactly one hybrid (the 4-Hybrid) because nobody plays four hybrids
// and a full iron set. That is correct for a bag chart and wrong for search:
// Search Console shows five hybrid-distance queries on this page earning ~165
// impressions and one click at positions 4.8-8.4, including "ping g430 hybrid
// distance chart" at position 4.8 — on a page that sells the Ping G430 Hybrid.
// We rank, and the one hybrid row does not look like an answer.
//
// These live separately rather than in CLUBS on purpose. Adding three rows
// there would make the bag unrealistic and would break the "13 clubs" claim
// in the title, meta description, Dataset schema, quick answer, PDF blurb,
// the chart-image generator and rewrite-meta.ts.
//
// ── Where the ratios come from ─────────────────────────────────────────────
// The same scale as CLUBS: a fraction of driver carry. Published hybrid
// distances disagree wildly — for a 4-hybrid alone the sources run from 156
// to 194 yards — because they mix carry with total and span every skill
// level. Rather than import that mess, these are anchored to the 4-Hybrid
// already in CLUBS at 0.76 and stepped by 0.04 per club number, which is the
// step the irons already use (5i 0.72, 6i 0.68, 7i 0.64) and matches the ~3°
// loft gap between hybrid numbers.
//
// The consequence is deliberate: a 5-hybrid shows the SAME carry as a 5-iron.
// That is the honest answer. A hybrid replacing an iron buys launch height and
// a softer landing, not yards, and claiming otherwise would be the marketing
// figure rather than the measured one — the same trap the compression work
// found in manufacturer-published ball data.
//
// Roll is a yard or two above the equivalent iron: hybrids spin less, so they
// run out further once they land.
//
// [name, carry ratio vs driver, typical roll (yds), the iron it replaces]
export const HYBRIDS: [string, number, number, string][] = [
  ['3-Hybrid', 0.80, 10, '3-iron'],
  ['4-Hybrid', 0.76,  8, '4-iron'],
  ['5-Hybrid', 0.72,  7, '5-iron'],
  ['6-Hybrid', 0.68,  6, '6-iron'],
];

