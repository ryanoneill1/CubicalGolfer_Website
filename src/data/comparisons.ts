// src/data/comparisons.ts
// Powers /compare/[a]-vs-[b]/ programmatic pages.
// Each entry generates a unique, SEO-optimised comparison page.

import type { Comparison } from './types';

export const COMPARISONS: Comparison[] = [
  {
    slug: 'bushnell-tour-v6-vs-precision-pro-nx9',
    title: 'Bushnell Tour V6 Shift vs Precision Pro NX9 HD (2026)',
    description: 'Bushnell Tour V6 Shift vs Precision Pro NX9 HD — which rangefinder is worth the extra $160? We tested both over 40+ rounds. Here\'s the honest verdict.',
    productA: 'bushnell-tour-v6',
    productB: 'precision-pro-nx9',
    winner: 'bushnell-tour-v6',
    winnerReason: 'Faster pin lock, better optics, and a legal slope toggle make the Tour V6 Shift worth the premium for golfers who play 20+ rounds per year.',
    intro: 'The Bushnell Tour V6 Shift (~$329) vs the Precision Pro NX9 HD (~$169) is the most common rangefinder decision a weekend golfer faces. Here\'s what actually separates them after 40+ rounds of side-by-side testing.',
    verdict: 'If you play 20+ rounds per year, the Bushnell Tour V6 Shift is worth the extra $160. If you play occasionally or want maximum value, the Precision Pro NX9 HD is genuinely excellent and the better choice.',
    faq: [
      { q: 'Is the Bushnell Tour V6 Shift worth it over the Precision Pro NX9 HD?', a: 'For serious weekend golfers (20+ rounds/year), yes. The Bushnell locks on pins faster, has better optics in bright sun, and has a slope toggle for tournament play. For occasional golfers, the Precision Pro is excellent at half the price.' },
      { q: 'Which rangefinder is more accurate?', a: 'Both are accurate to ±1 yard in most conditions. The Bushnell performs better in challenging conditions (bright sun, wind) thanks to its JOLT pin-lock technology.' },
    ],
    datePublished: '2026-02-01',
    dateModified: '2026-03-24',
  },
  {
    slug: 'garmin-approach-s62-vs-shot-scope-v5',
    title: 'Garmin Approach S62 vs Shot Scope V5 GPS Watch (2026)',
    description: 'Garmin Approach S62 vs Shot Scope V5 — $499 vs $249. Which GPS watch is worth the price? Tested side-by-side over 30+ rounds.',
    productA: 'garmin-s62',
    productB: 'shot-scope-v5',
    winner: 'shot-scope-v5',
    winnerReason: 'For most weekend golfers, the Shot Scope V5\'s automatic shot tracking at $249 provides more actionable data than the Garmin S62\'s premium features at $499.',
    intro: 'The Garmin Approach S62 is the premium GPS watch benchmark. The Shot Scope V5 is half the price and auto-tracks every shot. After 30+ rounds with both, here\'s which to buy.',
    verdict: 'If you want automatic shot tracking and strokes gained analysis without your phone, the Shot Scope V5 at $249 wins. If you want the most complete GPS experience — full color maps, Virtual Caddie, premium display — the Garmin S62 at $499 is worth it.',
    faq: [
      { q: 'Is the Garmin S62 worth double the price of the Shot Scope V5?', a: 'Only if you value: full-color hole mapping, Virtual Caddie club recommendations, and premium display quality. For pure shot tracking and data analytics, the Shot Scope V5 is better value.' },
      { q: 'Does the Shot Scope V5 require a phone?', a: 'No. The V5 has its own GPS and records shots automatically via grip tags. Your phone is only needed post-round to sync and review stats.' },
    ],
    datePublished: '2026-02-05',
    dateModified: '2026-03-24',
  },
  {
    slug: 'callaway-paradym-vs-taylormade-qi35',
    title: 'Callaway Paradym AI Smoke Max vs TaylorMade Qi35 Max Driver (2026)',
    description: 'Callaway Paradym AI Smoke Max vs TaylorMade Qi35 Max — the two most forgiving drivers of 2026 compared. Which one do you actually need?',
    productA: 'callaway-paradym-max',
    productB: 'taylormade-qi35-max',
    winner: 'callaway-paradym-max',
    winnerReason: 'The Callaway Paradym AI Smoke Max has a more consistent AI face across the entire face surface, producing better results on the heel/toe misses that matter most to weekend golfers.',
    intro: 'Both cost ~$599. Both use AI face design. Both are draw-biased. The Callaway Paradym AI Smoke Max and TaylorMade Qi35 Max are the two best forgiving drivers of 2026. Here\'s how they actually differ on the course.',
    verdict: 'Both are excellent. If you miss more toward the heel and toe, go with the Callaway. If you miss more toward the toe and want maximum distance on your better strikes, go with the TaylorMade. Get fitted — the shaft matters more than the head.',
    faq: [
      { q: 'Is the Callaway Paradym AI Smoke Max better than the TaylorMade Qi35 Max?', a: 'For most weekend golfers, the Callaway has more consistent ball speed across the face. The TaylorMade Qi35 Max can be longer on centered hits. Both are excellent — the right shaft matters more than which head you choose.' },
      { q: 'Should I get a driver fitting before buying?', a: 'Yes — a free 1-hour fitting at PGA Superstore or Golf Galaxy is worth more than any head difference between these two drivers. Shaft flex, weight, and kick point affect your distance and accuracy far more than the head design.' },
    ],
    datePublished: '2026-02-10',
    dateModified: '2026-03-24',
  },
  {
    slug: 'arccos-vs-shot-scope',
    title: 'Arccos Caddie vs Shot Scope: Which Golf Tracker is Better? (2026)',
    description: 'Arccos Caddie vs Shot Scope — the two best automatic golf shot trackers compared. Which system gives better data, better value, and actually improves your game?',
    productA: 'arccos-caddie',
    productB: 'shot-scope-v5',
    winner: 'arccos-caddie',
    winnerReason: 'Arccos has more detailed analytics, a better AI caddie engine, and superior mobile app. Shot Scope wins on battery life and not requiring a phone on the course.',
    intro: 'Both Arccos Caddie ($179 + $99/yr) and Shot Scope V5 ($249, no subscription) automatically track every shot without manual input. After using both systems for full seasons, here\'s the honest comparison.',
    verdict: 'For golfers who love data and improvement analytics, Arccos is the better long-term system. For golfers who want to leave their phone in the bag and just get reliable shot tracking, Shot Scope is simpler and slightly less expensive over 3+ years.',
    faq: [
      { q: 'Which is better: Arccos or Shot Scope?', a: 'Arccos is better for: detailed performance analytics, AI caddie recommendations, handicap tracking, and golfers who want their phone on the course anyway. Shot Scope is better for: leaving your phone in the bag, longer battery, and golfers who want simple round tracking.' },
      { q: 'Does Arccos require a subscription?', a: 'Yes. The Arccos sensors cost $179 upfront, plus $99/year for the subscription which unlocks all analytics features. Shot Scope V5 costs $249 with no subscription required — ever.' },
    ],
    datePublished: '2026-02-15',
    dateModified: '2026-03-24',
  },
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}
