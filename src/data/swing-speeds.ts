// Single source of truth for the swing-speed chart.
// Extracted in Sprint 102 so the downloadable PDF renders the same numbers as
// the page. See src/data/balls.ts for why a second hardcoded copy is a bug.
//
// Speeds are mph by club and skill level, from Trackman averages plus our own
// launch-monitor sessions.
export const SWING_SPEEDS = [
  { club: 'Driver', tour: 114, scratch: 104, mid: 93, high: 83, senior: 75 },
  { club: '3-Wood', tour: 107, scratch: 97, mid: 87, high: 78, senior: 70 },
  { club: '5-Wood', tour: 103, scratch: 93, mid: 83, high: 75, senior: 67 },
  { club: '4-Hybrid', tour: 100, scratch: 90, mid: 80, high: 72, senior: 65 },
  { club: '5-Iron', tour: 98, scratch: 88, mid: 78, high: 70, senior: 63 },
  { club: '6-Iron', tour: 94, scratch: 85, mid: 75, high: 68, senior: 61 },
  { club: '7-Iron', tour: 90, scratch: 82, mid: 72, high: 65, senior: 58 },
  { club: '8-Iron', tour: 87, scratch: 79, mid: 69, high: 62, senior: 56 },
  { club: '9-Iron', tour: 83, scratch: 75, mid: 65, high: 58, senior: 53 },
  { club: 'PW', tour: 79, scratch: 72, mid: 62, high: 55, senior: 50 },
  { club: 'SW', tour: 74, scratch: 68, mid: 58, high: 52, senior: 47 },
];
