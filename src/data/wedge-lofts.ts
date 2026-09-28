// src/data/wedge-lofts.ts
// ─────────────────────────────────────────────────────────────────────────────
// PW loft by iron set, and the wedge ladder the 4-degree rule produces from it.
//
// Why this exists
// ───────────────
// /how-to-buy-wedges-4-degree-rule/ was "Crawled - currently not indexed" in
// Search Console: Google fetched it and declined to index. It shares 44% of its
// vocabulary with /approach-wedge-vs-gap-wedge-do-you-need-it/, /wedge-bounce-
// guide/ and /best-wedges-for-beginners/, and like them it was pure prose. Four
// near-identical pages, so Google kept the other three.
//
// The page already carried the one thing the siblings do not: named iron sets
// with their PW lofts, and a rule for turning a PW loft into a full wedge setup.
// That is a lookup table trapped in paragraphs. Moving it into data makes it a
// reference asset — the format this site actually ranks with, and the one an AI
// Overview cannot summarise away because the reader wants the printable.
//
// Every loft below is the page's own figure. The ladder is computed, not typed:
// LOFTS are the source, `ladder()` applies the rule. Nothing is asserted here
// that the article did not already claim.
// ─────────────────────────────────────────────────────────────────────────────

export interface IronSet {
  set:   string;
  pw:    number;          // pitching-wedge loft in degrees
  build: 'strong' | 'traditional';
}

/** PW lofts as listed on /how-to-buy-wedges-4-degree-rule/, Step 1. */
export const IRON_SETS: IronSet[] = [
  { set: 'Cleveland Launcher XL2',      pw: 41, build: 'strong' },
  { set: 'Cobra Darkspeed',             pw: 42, build: 'strong' },
  { set: 'TaylorMade P790',             pw: 43, build: 'strong' },
  { set: 'Ping G430',                   pw: 43, build: 'strong' },
  { set: 'Titleist T350',               pw: 43, build: 'strong' },
  { set: 'Callaway Paradym Ai Smoke',   pw: 43, build: 'strong' },
  { set: 'Ping i530',                   pw: 45, build: 'traditional' },
  { set: 'Mizuno JPX 925 Forged',       pw: 46, build: 'traditional' },
  { set: 'Titleist T100',               pw: 46, build: 'traditional' },
  { set: 'Callaway Apex Pro',           pw: 46, build: 'traditional' },
  { set: 'TaylorMade P7MC',             pw: 47, build: 'traditional' },
];

/** Highest loft worth carrying. Past this you are into specialty territory. */
const MAX_LOFT = 60;

/**
 * The 4-degree rule, applied. From the PW, step up in 4° increments until the
 * next wedge would pass MAX_LOFT. Returns the wedges ABOVE the PW.
 */
export function ladder(pw: number, gap = 4): number[] {
  const out: number[] = [];
  for (let l = pw + gap; l <= MAX_LOFT; l += gap) out.push(l);
  return out;
}

/** One table row: the set, its PW, the wedges to add, and how many that is. */
export function setupFor(s: IronSet) {
  const wedges = ladder(s.pw);
  return {
    set:     s.set,
    pw:      `${s.pw}°`,
    wedges:  wedges.map(l => `${l}°`).join(' · '),
    count:   String(wedges.length),
    build:   s.build === 'strong' ? 'Strong-lofted' : 'Traditional',
  };
}

export const WEDGE_SETUPS = IRON_SETS.map(setupFor);
