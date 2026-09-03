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
