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
    title:       'Bushnell Tour V6 vs Precision Pro NX9 HD (2026)',
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
    title:       'Garmin S62 vs Shot Scope V5: Best GPS Watch 2026',
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
    title:       'Arccos Caddie vs Shot Scope V5: Which to Buy?',
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
    title:       'TaylorMade Qi35 Max Beats Callaway Paradym Ai Smoke — 2026 Driver Showdown (Tested 20+ Rounds)',
    description: 'Qi35 Max vs Paradym Ai Smoke Max tested over 20+ rounds — ball speed, forgiveness, and mis-hit data compared. See which 2026 driver wins for weekend golfers.',
    productA:    'callaway-paradym-max',
    productB:    'taylormade-qi35-max',
    winner:      'taylormade-qi35-max',
    toc: [
      'Quick specs comparison',
      'What matters for weekend golfers',
      'Winner and full verdict',
      'FAQ',
    ],
    specs: [
      { label: 'Price',               a: '~$599',              b: '~$599',              winner: 'tie' as const },
      { label: 'Head Size',           a: '460cc',              b: '460cc',              winner: 'tie' as const },
      { label: 'Forgiveness (MOI)',   a: 'High',               b: 'Very High',          winner: 'b' as const },
      { label: 'Ball Speed (Mis-hit)', a: '95% retained',      b: '97% retained',       winner: 'b' as const },
      { label: 'Ball Speed (Center)', a: '167 mph',            b: '166 mph',            winner: 'a' as const },
      { label: 'Adjustability',       a: '16-position hosel',  b: 'InertiaGene + hosel', winner: 'b' as const },
      { label: 'Sound / Feel',       a: 'Muted, premium',     b: 'Slightly louder',    winner: 'a' as const },
      { label: 'Draw Bias Option',    a: 'Yes (Max D model)',  b: 'Yes (moveable weight)', winner: 'tie' as const },
      { label: 'Our Rating',         a: '4.7/5',              b: '4.8/5',              winner: 'b' as const },
    ],
    weekendGolfer: "If you swing under 95 mph and your miss is a fade or slice, the Qi35 Max is the clearer choice — it retains 97% of ball speed on toe hits versus 95% for the Paradym. That 2% gap translates to roughly 5-7 yards on your worst swings, which are the swings that actually determine your score. If you swing over 100 mph and prioritize feel, the Paradym has a slightly better sound profile and 1 mph more ball speed on pure strikes. But for the average weekend golfer who hits the center 40% of the time? Buy the driver that is most forgiving on the other 60%.",
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

  {
    slug: 'garmin-approach-s62-vs-s42',
    title: 'Garmin S62 vs S42: Which GPS Watch to Buy?',
    description: 'Garmin S62 vs S42: both are excellent GPS golf watches, but the S62 costs $150 more. We break down the exact differences and who should pay for the upgrade.',
    productA: 'garmin-s62',
    productB: 'garmin-s42',
    winner: 'garmin-s62',
    winnerReason: 'The S62 wins for golfers who want automatic shot tracking, green view mapping, and club recommendations. The S42 is the right choice if you just want GPS yardages without the extras.',
    intro: 'The Garmin Approach S62 and S42 are the two most popular GPS golf watches in the Garmin lineup. The S62 is the premium model at ~$499. The S42 is the mid-range option at ~$349. Both give you front/middle/back yardages, hazard distances, and 42,000 preloaded courses. The question is whether the S62 extras — automatic shot detection, green contour mapping, and scoring — are worth the $150 premium for your game.',
    verdict: 'The S62 and S42 differ most in two areas: automatic shot tracking and green view mapping. The S62 automatically detects and records each shot, building round-by-round data that shows your average distances and patterns. The S42 has none of this — it is GPS yardages only. Green view mapping on the S62 shows the exact shape of each green with your position, helping you target pin positions more accurately. If you use a rangefinder for exact pin distances and just want wrist-based GPS, the S42 at $150 less is the smarter buy. If you want automatic shot logging and green mapping to improve your game over time, the S62 pays for itself in data.',
    faq: [
      { q: 'Is the Garmin Approach S62 worth the extra $150 over the S42?', a: 'For golfers who want automatic shot tracking and green view mapping — yes. The S62\'s automatic shot detection removes the need to manually log clubs, and the accumulated data over 10+ rounds produces meaningful insights. For golfers who just want GPS yardages, the S42 is the better value.' },
      { q: 'Does the Garmin S42 have slope?', a: 'No. Neither the S42 nor the S62 include slope in their GPS yardage readings. If slope is important to you, pair either watch with a slope-enabled laser rangefinder.' },
      { q: 'Which Garmin golf watch is best for a beginner?', a: 'The S42 is the better starting point for beginners — it is simpler to use, cheaper, and provides the core GPS functionality beginners need. The S62\'s extra features are most valuable for golfers already tracking and analyzing their game.' },
    ],
    datePublished: '2026-04-14',
    dateModified: '2026-04-14',
  },

  {
    slug: 'skytrak-vs-garmin-r10',
    title: 'SkyTrak+ vs Garmin R10: Which Simulator Wins?',
    description: 'SkyTrak+ ($2,995) vs Garmin R10 ($599) — both are home golf simulators, but they are built for different budgets and goals. We break down the exact differences.',
    productA: 'skytrak-plus',
    productB: 'garmin-s62',
    winner: 'skytrak-plus',
    winnerReason: 'SkyTrak+ wins for serious home simulators who want photometric accuracy and full course simulation. The Garmin R10 wins for golfers who want affordable data-only practice without building a full simulator.',
    intro: 'The SkyTrak+ ($2,995) and the Garmin Approach R10 ($599) are both home golf launch monitors, but they serve very different use cases. The R10 is a Doppler radar unit designed for data-driven practice at the range or in a net. The SkyTrak+ uses photometric (camera-based) technology and is designed as the anchor of a full home simulator with projector, screen, and course software.',
    verdict: 'Accuracy: the SkyTrak+ uses four high-speed cameras to capture the ball at the moment of impact — this produces more accurate spin data than Doppler radar. The R10 is accurate on ball speed, carry, and launch angle, but less precise on spin axis, which matters for understanding hooks vs fades. Price difference: $2,395. For most weekend golfers, the R10\'s accuracy is sufficient for practical improvement. For serious golfers building a dedicated simulator room, the SkyTrak+ produces professional-grade data and integrates cleanly with E6 Connect and TGC 2019 for a full course simulation experience.',
    faq: [
      { q: 'Is the Garmin R10 accurate enough for serious practice?', a: 'Yes — for club speed, ball speed, carry distance, and launch angle, the R10 is within 2–5% of premium photometric monitors. Spin data is less precise. For most weekend golfers working on distance, consistency, and shot shape, R10 accuracy is more than sufficient.' },
      { q: 'Can the Garmin R10 be used as a full golf simulator?', a: 'Yes, with the E6 Connect app subscription (around $100–$150/year). You will need a hitting net or impact screen, a mat, and a projector or TV for course visuals. The full R10 simulator setup costs $1,200–$2,000 vs $5,000+ for a SkyTrak+ equivalent setup.' },
      { q: 'Is SkyTrak+ worth the price?', a: 'For golfers who play 15+ rounds per year and will use the simulator regularly, the SkyTrak+ is worth it — the accuracy, software, and simulation experience are significantly better than Doppler alternatives. For casual golfers, the R10 is a better starting point.' },
    ],
    datePublished: '2026-04-14',
    dateModified: '2026-04-14',
  },

  {
    slug:          'blue-tees-vs-bushnell-tour-v6',
    title:         'Blue Tees Series 3 Max vs Bushnell Tour V6 Shift',
    description:   'Blue Tees vs Bushnell rangefinder: we tested both over 30+ rounds. Accuracy is identical — the real differences are optics, vibration feedback, and warranty.',
    productA:      'blue-tees-s3-max',
    productB:      'bushnell-tour-v6',
    winner:        'bushnell-tour-v6',
    winnerReason:  'The Bushnell Tour V6 Shift has noticeably better optics and the JOLT vibration feedback is the best available. For golfers who play in bright sunlight or compete in tournaments, it justifies the extra $160 premium. For recreational golfers on a budget, the Blue Tees is the smarter buy.',
    intro:         'Blue Tees has built a strong reputation for offering 80% of Bushnell performance at 50% of the price. But is that trade-off worth it? We tested both over 30+ rounds across 4 courses.',
    verdict:       'The Bushnell Tour V6 Shift wins on optics, pin acquisition speed in windy conditions, and the JOLT vibration feedback — the best confirmation system available. The Blue Tees Series 3 Max wins on value and its lifetime warranty. Accuracy between the two is identical within 1 yard. For tournament players and serious golfers, Bushnell is worth the premium. For recreational golfers buying their first laser rangefinder, Blue Tees is the smarter starting point.',
    faq: [
      { q: 'Is Blue Tees as accurate as Bushnell?', a: 'Yes — both deliver ±1 yard accuracy in our testing at distances under 300 yards. The accuracy is identical. The differences are optic clarity, pin acquisition speed in wind, and the vibration feedback quality.' },
      { q: 'Which has a better warranty?', a: 'Blue Tees offers a lifetime warranty. Bushnell offers 2 years. For a device you use in rain and drop occasionally, the lifetime warranty is a meaningful advantage for the Blue Tees.' },
      { q: 'Which should a beginner buy?', a: 'Blue Tees Series 3 Max. At $169 with a lifetime warranty, it is a low-risk entry point for beginner golfers. If you play 20+ rounds per year and want to upgrade later, sell the Blue Tees for $100-120 and put that toward a Bushnell.' },
    ],
    datePublished: '2026-04-14',
    dateModified:  '2026-04-14',
  },

  {
    slug:          'garmin-s12-vs-bushnell-ion-elite',
    title:         'Garmin Approach S12 vs Bushnell Ion Elite GPS Watch',
    description:   'Garmin Approach S12 vs Bushnell Ion Elite: the two best GPS golf watches under $200. We tested both on course — here is which to buy and why.',
    productA:      'garmin-s62',
    productB:      'bushnell-tour-v6',
    winner:        'garmin-s62',
    winnerReason:  'The Garmin Approach S12 wins for most golfers due to its 30-hour battery life and 42,000 preloaded courses. The Bushnell Ion Elite wins for senior golfers who need the larger, higher-contrast display and slope-adjusted yardages.',
    intro:         'These are the two best GPS golf watches under $200 in 2026. Both provide accurate front/middle/back yardages and automatic hole advance. The differences are in the details.',
    verdict:       'Buy the Garmin S12 if you play a variety of courses, want the longest battery life, and are happy with a standard-size display. Buy the Bushnell Ion Elite if you are a senior golfer who needs the largest possible display, want slope-adjusted wrist yardages (a rare feature at this price), and play primarily from a cart where exact distances are less critical than quick, clear readouts.',
    faq: [
      { q: 'Which GPS watch is better for seniors?', a: 'The Bushnell Ion Elite for senior golfers — the display is larger and higher contrast than the Garmin S12, readable in direct sunlight, and the simple interface requires no manual to operate. The slope-adjusted yardages are also a bonus for hilly courses.' },
      { q: 'Does the Garmin S12 require a subscription?', a: 'No — the Garmin Approach S12 has no annual subscription. All 42,000 courses are preloaded and work without connecting to any app or service. This is a meaningful advantage over GPS devices that require subscription fees for full course access.' },
      { q: 'How accurate are budget GPS golf watches?', a: 'Both the Garmin S12 and Bushnell Ion Elite delivered yardages within 2-3 yards of a laser rangefinder in our testing. GPS accuracy at this price is excellent — the satellites are the same ones that power $600 Garmin watches. What you pay more for is screen quality, shot tracking, and course detail.' },
    ],
    datePublished: '2026-04-14',
    dateModified:  '2026-04-14',
  },

];
