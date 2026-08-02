// src/data/brands.ts — Brand hub data (Batch 6, review-2 item #41)
// Intros and FAQs are authored; every claim traces to this site's own reviews,
// comparisons, and testing data. Counts are computed at build time — never hardcode them.

export interface BrandFaq { q: string; a: string; }
export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  intro: string[];        // paragraphs
  bagNote?: string;       // honest first-person note when the brand is in our own bag
  faq: BrandFaq[];
}

export const BRANDS: Brand[] = [
  {
    slug: 'garmin',
    name: 'Garmin',
    tagline: 'GPS watches and launch monitors built around one ecosystem',
    intro: [
      `Garmin came to golf from aviation and marine GPS, and it shows: the company's golf gear is built around measurement first and marketing second. In our testing, that translates to two product lines that matter — the Approach watches, which put full-color course maps and a genuinely useful Virtual Caddie on your wrist, and the Approach launch monitors, which brought respectable radar accuracy down to prices weekend golfers can justify.`,
      `The R10 is the reason most golfers meet the brand: in our accuracy testing it posted the best outdoor numbers in the budget class, and its core data needs no subscription — increasingly rare in this category. Its known weakness, calculated rather than measured spin, is exactly what the camera-based R50 was built to fix. The S62 watch earned one of our higher ratings for a simple reason: after ten rounds of learning your game, its club suggestions started beating our gut.`,
      `The honest catch with Garmin is the ecosystem itself. Everything works beautifully together — watch, launch monitor, phone app, shot history — which is wonderful right up until you want to leave. Buy your first Garmin product knowing the second one gets much more likely.`,
    ],
    faq: [
      { q: 'Do Garmin launch monitors require a subscription?',
        a: 'The R10\'s core data — ball speed, carry, club speed, launch — works with no subscription, which is a genuine advantage in this category. Garmin\'s optional membership adds simulation features like Home Tee Hero, but you can practice and gap your clubs forever on the free tier. The R50 follows the same pattern at a much higher price point.' },
      { q: 'Should I buy the R10 or save for the R50?',
        a: 'If you practice mostly outdoors and want honest carry numbers, the R10 remains the smart entry point — that\'s where its accuracy holds up best. The R50 exists for one main reason: it measures spin directly instead of calculating it, which matters enormously indoors and for serious simulator use. If you don\'t know whether you need measured spin, you don\'t need it yet.' },
    ],
  },
  {
    slug: 'bushnell',
    name: 'Bushnell',
    tagline: 'The rangefinder benchmark, plus Foresight-powered launch data',
    intro: [
      `Ask on any tee box what rangefinder the low-handicapper is holding and the answer is usually Bushnell. The brand earned that position the boring way — decades of optics that lock onto flags fast and read true — and our testing backs the reputation: the Tour V7 Shift locked pins in under 0.3 seconds, the fastest we've measured, with accuracy inside a yard across a full season of rounds.`,
      `The interesting move is the Launch Pro, which is Foresight's GC3 camera technology in Bushnell packaging. In our accuracy test it landed within ±1.2 yards of reference numbers — professional-grade photometric data at roughly half the price of a GCQuad, with the honest asterisks that it needs an annual subscription for full features and a capable PC to shine as a simulator.`,
      `Bushnell's premium is real: you can get 90-95% of the rangefinder experience for half the price elsewhere, and we say so plainly in our comparisons. What you're paying for is the last half-second of lock speed, the cleanest slope toggle in golf, and glass that doesn't hunt. Whether that's worth it depends entirely on how much the wait annoys you.`,
    ],
    bagNote: `The Tour V7 Shift is the rangefinder in our own bag — it survived our full What's In The Bag testing season and never gave the number back.`,
    faq: [
      { q: 'Is the Tour V7 Shift really worth double the Precision Pro NX9?',
        a: 'Depends what the extra $160 buys you. In our head-to-head, the NX9 landed within 1-2 yards of the Bushnell on accuracy — the real gaps are lock speed (0.3s vs 0.5-0.8s), build quality, and Bushnell\'s slope toggle. The NX9 counters with a lifetime warranty we actually tested. If you range while walking and hate waiting, buy the Bushnell; if you want 90% of the experience at half the price, the NX9 is the value play.' },
      { q: 'Does the Bushnell Launch Pro need a subscription?',
        a: 'Yes — that\'s its biggest honest drawback. The hardware is Foresight GC3 camera tech and the accuracy is professional-grade, but full features require an annual plan on top of a roughly $2,000 entry price. Budget for both, or look at our no-subscription launch monitor guide if ongoing fees are a dealbreaker.' },
    ],
  },
  {
    slug: 'callaway',
    name: 'Callaway',
    tagline: 'AI-designed faces that forgive the swings we actually make',
    intro: [
      `Callaway's pitch for the last several years has been simple: let machine learning design the clubface, then build drivers for the contact patterns real golfers produce — which is to say, not the center. Our testing suggests the pitch is legitimate. The Paradym Ai Smoke Max lost only about 5% of ball speed on toe strikes where competitors gave up 10-12%, and it left our test as the most forgiving driver we've hit.`,
      `That forgiveness-first identity runs through the whole catalog we've priced and tested — from the Paradym fairway woods to the ball lineup — and it makes Callaway the default recommendation for the golfer whose misses wander. The equally honest flip side: Max-style heads trade workability for that forgiveness, and better players who shape shots on purpose usually end up in the lower-spin versions or elsewhere.`,
      `Value is the quiet strength. At $499 against $599 flagship rivals, the Ai Smoke Max repeatedly won our "just tell me what to buy" conversations — enough performance that the price gap becomes the deciding argument.`,
    ],
    bagNote: `Our own 3-wood is a Callaway Paradym — it earned the spot in testing and hasn't surrendered it.`,
    faq: [
      { q: 'Is the Paradym Ai Smoke Max forgiving enough for a high handicap?',
        a: 'It\'s the most forgiving driver we\'ve tested, full stop. The number that matters: roughly 5% ball speed lost on toe strikes versus the 10-12% typical of the category. For a golfer who misses all over the face, that\'s the difference between a playable drive and a punch-out. Pair it with enough loft and it\'s our default high-handicap recommendation.' },
      { q: 'Who should skip Callaway drivers?',
        a: 'Two groups. Shot-shapers who want to work the ball both ways will find Max-style heads stubborn — that\'s the price of the forgiveness. And fast, low-spin players already fitted into LS-type heads won\'t gain much from the standard models. For everyone in the middle, the forgiveness math is hard to argue with.' },
    ],
  },
  {
    slug: 'taylormade',
    name: 'TaylorMade',
    tagline: 'Distance-first engineering, and the biggest sweet spot they\'ve made',
    intro: [
      `TaylorMade has spent two decades selling speed, and the Qi35 generation is the first time the headline is stability instead. The Qi35 Max carries the largest sweet spot the company has ever put in a driver, and in our testing it posted the best off-center ball speed retention we measured this year — which matters far more to a weekend golfer's scorecard than another half-mph of theoretical ball speed.`,
      `Our coverage of the brand runs from that driver through the Stealth-era irons to the TP5x at the premium end of the ball wall, and a consistent pattern emerges: TaylorMade gear rewards commitment. The engineering is real, the pricing is flagship, and the value question is usually whether you'll gain enough over last year's model — or a rival $100 cheaper — to justify it. In the Qi35's case, our review says exactly where that line sits.`,
      `For inconsistent strikers, slice-fighters, and anyone whose misses scatter across the face, this is one of the two brands we point to first. For golfers who already find the center, the marginal gains shrink fast — and we say that in the review too.`,
    ],
    bagNote: `The Qi35 Max is the driver in our own bag, and the Stealth HD irons fill the middle of it — both bought, tested, and kept.`,
    faq: [
      { q: 'Is the Qi35 worth $599 over the $499 Callaway Ai Smoke Max?',
        a: 'That $100 gap is the whole decision. Our testing puts them in the same forgiveness tier — the Qi35 Max wins on sweet-spot size and toe-strike speed retention, the Callaway wins on price. If you\'re paying full retail and the budget is real, the Callaway is the value answer. If you\'re a TaylorMade-ecosystem player or find the Qi35 on sale, it\'s the best driver the brand has made.' },
      { q: 'Who should skip the Qi35?',
        a: 'Straight from our review: shot-shapers who want workability over forgiveness, budget-first buyers who\'d be equally served $100 cheaper, and low-handicap players already fitted into low-spin heads. The Max design exists to rescue imperfect contact — if your contact is already good, buy the fitting, not the head.' },
    ],
  },
  {
    slug: 'titleist',
    name: 'Titleist',
    tagline: 'The benchmark ball, and the standard everything else is measured against',
    intro: [
      `Every golf ball review on this site eventually measures against one reference point, and it's the Pro V1. Our testing gave it the highest rating we've awarded a ball — unmatched greenside spin and feel, and the tightest shot-to-shot consistency we've measured — which is precisely why it's the ball the rest of the wall gets compared to, including by us.`,
      `The catalog we've priced and tested runs deeper than the flagship: Velocity, TruFeel, Tour Soft, and AVX each target a different swing speed and feel preference, and the honest guidance is that most golfers are better matched to one of those than to the Pro V1 itself. The flagship needs 90+ mph to fully unlock, and at $55 a dozen it punishes anyone who donates three balls a round to the trees.`,
      `That's the Titleist paradox our reviews keep landing on: the best ball in golf is also the most over-bought. When it fits your speed and your budget, nothing else feels like it. When it doesn't, our compression chart and the value alternatives we've tested will save you real money per month without costing you shots.`,
    ],
    faq: [
      { q: 'Is the Pro V1 worth it at slower swing speeds?',
        a: 'Usually not — and that\'s from our own review of it. The Pro V1 needs roughly 90+ mph of driver speed to fully activate; below that, softer and lower-compression balls deliver comparable distance with better feel at a fraction of the price. Check your speed against our compression chart before spending $55 a dozen.' },
      { q: 'What\'s the best cheaper alternative to the Pro V1?',
        a: 'Our testing points to the Kirkland Signature as the value benchmark: a 3-piece urethane ball at $28 a dozen that delivered 85-90% of Pro V1 performance, with genuinely close greenside spin. The compromises — firmer feel, batch availability, slightly faster scuffing — are real but small. For mid-handicappers who lose balls, the math is unbeatable.' },
    ],
  },
];
