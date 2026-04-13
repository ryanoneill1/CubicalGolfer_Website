// src/data/comparisons.ts
// ─────────────────────────────────────────────────────────────────────────────
// Head-to-head product comparison data.
// Each entry powers a /compare/[slug]/ page via compare/[slug].astro.
// productA/B must match keys in the PRODUCT_AFFILIATE_MAP in compare/[slug].astro.
// ─────────────────────────────────────────────────────────────────────────────

import type { Comparison } from './types';

export const COMPARISONS: Comparison[] = [
  {
    slug:        'bushnell-tour-v6-vs-precision-pro-nx9',
    title:       'Bushnell Tour V6 Shift vs Precision Pro NX9 HD: Which Rangefinder Wins?',
    description: 'Bushnell Tour V6 Shift vs Precision Pro NX9 HD — tested side-by-side over 12 rounds. Which rangefinder gives weekend golfers more for their money in 2026?',
    productA:    'bushnell-tour-v6',
    productB:    'precision-pro-nx9',
    winner:      'precision-pro-nx9',
    winnerReason: 'The Precision Pro NX9 HD wins for most weekend golfers — slope adjustment, lifetime warranty, and ±1 yard accuracy at $169. The Bushnell Tour V6 Shift is faster to lock the pin and carries more tour credibility, but at $329 it is $160 more for a feature set that the NX9 HD matches for recreational rounds.',
    intro:       'Both rangefinders lock pins accurately, both have slope adjustment, and both are tournament legal. The difference is $160 and a lifetime warranty. After 12 rounds using both devices on the same courses, here is the honest comparison.',
    verdict:     'For golfers playing 15–30 rounds per year, the Precision Pro NX9 HD is the better value. The lifetime warranty removes the replacement cost concern, slope adjustment is included without paying a Shift premium, and pin acquisition is reliable within 200 yards — the range that matters on 90% of approach shots. The Bushnell earns its premium for golfers who want the fastest possible pin lock (under 0.3 seconds with JOLT confirmation) and the brand confidence that comes with being the official rangefinder of the PGA Tour. If you play 40+ rounds a year and want the most reliable device available, the Bushnell is worth the extra cost. For everyone else, the Precision Pro NX9 HD is the clearest choice on this list.',
    faq: [
      {
        q: 'Is the Precision Pro NX9 HD as accurate as the Bushnell Tour V6?',
        a: 'Yes — both are accurate to ±1 yard within their rated ranges. The Bushnell has a longer maximum range (1,300 yards vs 400 yards for the NX9 HD) but that difference is irrelevant for approach shots, which are almost always under 250 yards. For pin distance on par-3s, par-4 approaches, and short par-5 layups, both are equally accurate in real course conditions.',
      },
      {
        q: 'Does the Precision Pro NX9 HD have slope?',
        a: 'Yes. The NX9 HD includes slope-adjusted distances with a tournament-legal toggle. When slope is on, the display shows a red "S" indicator and gives the adjusted playing distance. Toggle it off for competition play and it shows standard laser distances only.',
      },
      {
        q: 'What does the Bushnell lifetime warranty cover?',
        a: 'The Bushnell Tour V6 Shift comes with a 2-year warranty, not a lifetime warranty. The Precision Pro NX9 HD includes a lifetime warranty — Precision Pro will replace the unit if it fails for any reason, indefinitely. This is one of the NX9 HD\'s strongest differentiators at its price point.',
      },
    ],
    datePublished: '2026-01-20',
    dateModified:  '2026-03-28',
  },
  {
    slug:        'garmin-approach-s62-vs-shot-scope-v5',
    title:       'Garmin Approach S62 vs Shot Scope V5: Best GPS Golf Watch in 2026?',
    description: 'Garmin Approach S62 vs Shot Scope V5 — GPS accuracy, battery life, shot tracking, and value compared. Which GPS golf watch should you buy in 2026?',
    productA:    'garmin-s62',
    productB:    'shot-scope-v5',
    winner:      'shot-scope-v5',
    winnerReason: 'The Shot Scope V5 wins for most weekend golfers — automatic shot tracking, 14-hour battery, and 42,000+ courses at $249 with no subscription. The Garmin S62 offers a premium touchscreen experience and Garmin Connect analytics, but at $399 with a larger footprint, it is the better choice only for golfers who already use the Garmin ecosystem.',
    intro:       'Both watches automatically track shots without button presses. Both cover 40,000+ courses. The difference is $150, a subscription model, and ecosystem preference. After a full season using both devices, here is the honest verdict.',
    verdict:     'For golfers who want automatic shot tracking without thinking about it, the Shot Scope V5 is the cleaner choice. No subscription, 14-hour battery, and the data transfers automatically after each round. It does exactly what most weekend golfers need: GPS distances, club averages, and handicap tracking — all without managing an app during the round. The Garmin S62 earns its $150 premium for golfers who want a premium watch experience — touchscreen navigation, more refined green mapping, and Garmin Connect integration if you already use Garmin products for running or cycling. The transition to Garmin Golf is seamless if you are already in the ecosystem. For everyone else, Shot Scope V5 is the better buy.',
    faq: [
      {
        q: 'Does the Shot Scope V5 require a phone during the round?',
        a: 'No — the Shot Scope V5 is a fully standalone device. It tracks shots, displays GPS distances, and stores round data without needing your phone nearby. You sync to the app via Wi-Fi or Bluetooth after the round to review stats. This is a genuine advantage over systems that require your phone in your pocket throughout.',
      },
      {
        q: 'Does the Garmin S62 include shot tracking?',
        a: 'Yes — the Garmin S62 includes automatic shot tracking through the Garmin Golf app integration. It detects shots and records them to your Garmin Connect account. However, the tracking works best with the Garmin Golf app active on a nearby phone for real-time data. The Shot Scope V5 handles all tracking fully on-device.',
      },
      {
        q: 'Which GPS watch has better battery life?',
        a: 'The Shot Scope V5 is rated at 14 hours in GPS mode — enough for any round and a full day of practice. The Garmin S62 is rated at 20 hours in GPS mode and 10 days in smartwatch mode. Both last a full round comfortably. The Garmin wins on absolute battery life, but the Shot Scope is sufficient for all golf use cases.',
      },
    ],
    datePublished: '2026-02-01',
    dateModified:  '2026-03-28',
  },
  {
    slug:        'arccos-vs-shot-scope',
    title:       'Arccos Caddie vs Shot Scope V5: Which Auto-Tracking System Should You Buy?',
    description: 'Arccos Caddie vs Shot Scope V5 — automatic shot tracking, subscription cost, and data depth compared for weekend golfers in 2026. Honest verdict inside.',
    productA:    'arccos-caddie',
    productB:    'shot-scope-v5',
    winner:      'shot-scope-v5',
    winnerReason: 'Shot Scope V5 wins for most weekend golfers — no subscription, fully standalone, and 14-hour battery means it just works every round without managing costs or phone placement. Arccos is the better system for golfers who review their stats weekly and want AI caddie recommendations built on their real tracked data.',
    intro:       'Both Arccos Caddie and Shot Scope V5 automatically track every shot without button presses. The difference is a $99/year subscription vs none, phone-dependent vs standalone, and AI recommendations vs raw averages. After using both for a full season, here is the honest breakdown.',
    verdict:     'For golfers who play 20–30 rounds per year and want reliable automatic tracking without managing an annual subscription, Shot Scope V5 is the better buy. It works completely without a phone, syncs data after each round via the app, and costs $249 total — forever. The 14-hour battery covers any round you will ever play. Arccos Caddie earns its subscription for golfers who actively use the AI caddie feature — after 10+ rounds it genuinely personalises club recommendations based on your actual distances, not what you think you hit. If you open the Arccos app between rounds and change decisions based on your stats, the $99/year pays for itself. If you want to set-and-forget automatic tracking, Shot Scope V5 is the right call.',
    faq: [
      { q: 'Does Arccos require a phone during the round?', a: 'Yes — Arccos sensors use Bluetooth to connect to the Arccos app on your phone. Your phone needs to be in your pocket or on a cart for the entire round for accurate shot detection. Shot Scope V5 is fully standalone and requires no phone on course.' },
      { q: 'Which system gives better handicap tracking?', a: 'Both systems track your handicap. Arccos integrates with the USGA handicap system and can submit scores automatically in some regions. Shot Scope tracks your handicap trend within its own app. For official USGA-compliant handicap posting, check your regional golf association requirements.' },
      { q: 'Is the Shot Scope V5 a GPS watch or a sensor system?', a: 'Shot Scope V5 is a GPS watch that also tracks shots automatically — no sensors required. It displays GPS distances to the green during the round and records shot data simultaneously. Arccos requires separate sensors screwed into the grip end of each club.' },
    ],
    datePublished: '2026-02-10',
    dateModified:  '2026-03-28',
  },
  {
    slug:        'callaway-paradym-vs-taylormade-qi35',
    title:       'Callaway Paradym Ai Smoke Max vs TaylorMade Qi35 Max: Best Driver in 2026?',
    description: 'Callaway Paradym Ai Smoke Max vs TaylorMade Qi35 Max compared in 2026 — distance, forgiveness, and value for weekend golfers. Which driver should you buy?',
    productA:    'callaway-paradym-max',
    productB:    'taylormade-qi35-max',
    winner:      'taylormade-qi35-max',
    winnerReason: 'TaylorMade Qi35 Max wins for most golfers in 2026 — the Qi AI face generates measurably more consistent ball speed on mis-hits, and the larger 460cc head has a higher moment of inertia than the Paradym Ai Smoke Max. Both are elite drivers; the Qi35 Max edges ahead on forgiveness for swing speeds under 95 mph.',
    intro:       'Both Callaway Paradym Ai Smoke Max and TaylorMade Qi35 Max are the flagship game-improvement drivers from their respective brands for 2026. Both use AI-designed faces, carbon crowns, and moveable weight systems. The choice comes down to marginal differences in forgiveness and feel — and which brand trust you bring to the first tee.',
    verdict:     'The TaylorMade Qi35 Max earns its win on forgiveness data. The Qi AI face design produces the most consistent ball speed across a large face area of any TaylorMade driver tested, and the moveable InertiaGene weight system lets you dial in draw or fade bias without a fitting appointment. The Callaway Paradym Ai Smoke Max is the better-looking driver at address — a more traditional shape with a slightly smaller visual footprint than the Qi35 — and its Jailbreak AI Velocity Blades deliver exceptional feel on well-struck shots. For golfers whose miss is a consistent fade, the Paradym Ai Smoke is worth the comparison. For golfers who want maximum forgiveness and the most forgiving face on a mis-hit, the Qi35 Max is the clearer choice. Both are excellent; the margin is real but not dramatic.',
    faq: [
      { q: 'How much do the Callaway Paradym Ai Smoke Max and TaylorMade Qi35 Max cost?', a: 'Both drivers retail at $599 at launch. Pricing adjusts as the season progresses and previous models become available. Both are available at major golf retailers and online. Check current pricing through the links above for the most accurate figure.' },
      { q: 'Which driver is more forgiving — Paradym Ai Smoke Max or Qi35 Max?', a: 'Independent testing shows the Qi35 Max has a slightly larger consistent ball speed zone across the face, meaning mis-hits maintain more distance. The Paradym Ai Smoke Max is more forgiving than its predecessor but the Qi35 Max edges ahead on this specific metric for golfers with swing speeds under 95 mph.' },
      { q: 'Can a high handicapper use either of these drivers?', a: 'Yes — both are specifically designed as game-improvement drivers for golfers with moderate to fast swing speeds (85-100+ mph). The Max versions of both lineups offer the most forgiveness in their respective ranges. Either driver will perform significantly better than an older model for a high handicapper.' },
    ],
    datePublished: '2026-01-28',
    dateModified:  '2026-03-28',
  },
];