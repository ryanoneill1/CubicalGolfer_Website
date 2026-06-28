/**
 * skip-if.ts — Generates contextual "Skip this if" buyer guidance
 * for product sections based on affiliate key and page context.
 *
 * Rendered in the article template after each product section body.
 * Returns empty string if the product body already contains "Skip this if".
 */

export function getSkipIf(affiliateKey: string, articleSlug: string, bodyText?: string): string {
  // Don't duplicate if body already has a skip line
  if (bodyText?.includes('Skip this if')) return '';

  const k = affiliateKey.toLowerCase();
  const s = articleSlug.toLowerCase();

  // ── Rangefinders ──
  if (k.includes('bushnell-tour-v6') || k.includes('bushnell-pro-x'))
    return 'you play fewer than 10 rounds a year — a budget rangefinder gives 90% of the performance at half the price';
  if (k.includes('precision-pro') || k.includes('blue-tees'))
    return 'you play tournaments regularly — the slope lock is less refined than the Bushnell';
  if (k.includes('garmin') && k.includes('z82'))
    return 'you just want yardage — the GPS overlay adds cost you may not use';
  if (k.includes('callaway-300'))
    return 'you want a rangefinder that lasts 5+ years — budget models trade longevity for price';

  // ── GPS Watches ──
  if (k.includes('garmin') && (k.includes('s62') || k.includes('s70')))
    return 'you only need yardages — the Garmin S42 does that for $150 less';
  if (k.includes('garmin') && k.includes('s42'))
    return 'you want shot tracking or smart notifications — the S42 skips those to hit its price';
  if (k.includes('shot-scope') && k.includes('v5'))
    return 'you want a watch that looks good off the course — the V5 is clearly a golf-only device';
  if (k.includes('bushnell-ion'))
    return 'you want automatic shot tracking — the Ion gives yardages but does not track your shots';
  if (k.includes('apple-watch') || k.includes('apple'))
    return 'battery life matters — the Apple Watch barely survives 18 holes with GPS active';

  // ── Launch Monitors ──
  if (k.includes('garmin-r10') || k.includes('garmin-approach-r10'))
    return 'spin accuracy is critical — the R10 calculates spin rather than measuring it directly';
  if (k.includes('garmin-r50') || k.includes('garmin-approach-r50'))
    return 'you only hit the range occasionally — the R50 is built for serious practice and sim setups';
  if (k.includes('rapsodo') || k.includes('mlm2'))
    return 'you want plug-and-play sim — Rapsodo requires your phone as the display, which struggles in sunlight';
  if (k.includes('skytrak'))
    return 'you primarily practice outdoors — SkyTrak is optimized for indoor use and struggles in bright sunlight';
  if (k.includes('bushnell-launch-pro') || k.includes('gc3'))
    return 'budget matters — a $600 Garmin R10 gives a weekend golfer 90% of the useful data';
  if (k.includes('mevo') || k.includes('flightscope'))
    return 'you want the smallest device — the Mevo requires more setup space behind the ball than competitors';
  if (k.includes('swing-caddie') || k.includes('sc4'))
    return 'you want simulator compatibility — the SC4 Pro has limited sim software support';
  if (k.includes('square-golf'))
    return 'you need proven long-term reliability — Square Golf is newer to market with less track record';
  if (k.includes('shot-scope') && k.includes('lm'))
    return 'you want sim compatibility — the LM1 is built for range data, not sim play';

  // ── Drivers ──
  if (k.includes('paradym') || k.includes('ai-smoke'))
    return 'you already hit it straight — this driver is built for forgiveness, not workability';
  if (k.includes('qi35'))
    return 'you have a steep swing — the Qi35 launches high and steep swingers may balloon the ball in wind';
  if (k.includes('cobra-aerojet'))
    return 'you need maximum adjustability — the Aerojet has fewer hosel settings than Callaway or TaylorMade';
  if (k.includes('ping-g430') && s.includes('driver'))
    return 'you want maximum distance — the G430 Max prioritizes straight over far';
  if (k.includes('cleveland-launcher'))
    return 'you swing above 100 mph — the lightweight design is optimized for moderate speeds';

  // ── Irons ──
  if (k.includes('titleist-t100'))
    return 'you shoot over 90 regularly — players irons punish mishits and make the game harder for mid-handicaps';
  if (k.includes('wilson-d9') || k.includes('wilson-staff'))
    return 'looks matter as much as performance — budget irons are thicker at address than mid-range options';
  if (k.includes('iron') || s.includes('iron'))
    return 'you are a single-digit handicap — game-improvement irons limit shot shaping';

  // ── Putters ──
  if (k.includes('scotty-cameron') || k.includes('phantom'))
    return 'you three-putt from distance more than you miss short putts — a mallet with alignment helps more';
  if (k.includes('odyssey'))
    return 'you prefer a firmer feel at impact — the White Hot insert is deliberately soft';
  if (k.includes('cleveland') && (k.includes('hb') || k.includes('huntington')))
    return 'you can stretch to $200 — the Odyssey White Hot OG is a meaningful upgrade in feel';
  if (k.includes('lab-golf'))
    return 'you have a strong arc stroke — Directed Force works best with straight-back strokes';
  if (k.includes('wilson') && s.includes('putter'))
    return 'you play 30+ rounds a year — the finish wears faster than mid-range putters';
  if (k.includes('putter') || s.includes('putter'))
    return 'you have not been fitted for putter length — wrong length costs more putts than wrong head';

  // ── Golf Balls ──
  if (k.includes('pro-v1'))
    return 'your swing speed is under 90 mph — you will not compress the ball enough to benefit from its design';
  if (k.includes('chrome-soft') || k.includes('chrome-tour'))
    return 'you lose more than 3 balls per round — play a $15/dozen ball until your ball striking is consistent';
  if (k.includes('tp5'))
    return 'your swing speed is under 95 mph — the 5-piece construction needs speed to compress all five layers';
  if (k.includes('kirkland'))
    return 'you need consistent stock availability — Kirkland balls sell out frequently and restocks are unpredictable';
  if (k.includes('supersoft') || k.includes('soft-feel') || k.includes('noodle') || k.includes('trufeel'))
    return 'you want greenside spin control — low-compression balls trade short-game spin for distance';
  if (k.includes('vice'))
    return 'you want to buy locally — Vice sells direct only with 5-10 day shipping';
  if (k.includes('velocity') || k.includes('distance'))
    return 'you play firm, fast greens — distance balls run out on approach and are hard to stop';
  if (s.includes('ball') || s.includes('compression'))
    return 'your swing speed does not match the compression — a mismatched ball costs distance regardless of brand';

  // ── Simulators / Screens / Projectors ──
  if (s.includes('simulator') || k.includes('projector') || k.includes('screen') || k.includes('enclosure'))
    return 'your ceiling is under 9 feet — you cannot swing a driver safely, limiting the setup to irons only';

  // ── Gloves ──
  if (k.includes('rain') && k.includes('glove'))
    return 'you rarely play in rain — rain gloves feel bulky in dry conditions';
  if (k.includes('glove'))
    return 'you prefer playing without a glove — some golfers get better feel bare-handed on short shots';

  // ── Shoes ──
  if (k.includes('shoe') || s.includes('shoe'))
    return 'you ride a cart every round — walking-focused features only matter if you walk 18 regularly';

  // ── Bags ──
  if (k.includes('bag') || s.includes('bag'))
    return 'you ride a cart most rounds — bag weight and strap quality matter less when riding';

  // ── Wedges ──
  if (k.includes('wedge') || k.includes('rtx') || k.includes('jaws'))
    return 'your current wedge grooves are still sharp — worn grooves cost more spin than any upgrade adds';

  // ── Training Aids ──
  if (k.includes('alignment') || k.includes('putting-mirror') || k.includes('impact-tape') || k.includes('orange-whip') || s.includes('training'))
    return 'you do not practice between rounds — training aids only work with repetition';

  // ── Arccos / Shot Trackers ──
  if (k.includes('arccos'))
    return 'you play fewer than 15 rounds a year — the AI caddie needs data volume for useful recommendations';

  // ── Apparel ──
  if (s.includes('rain') || k.includes('rain-suit') || k.includes('rain-jacket'))
    return 'you cancel rounds when it rains — rain gear sits unused if you only play fair weather';
  if (s.includes('shirt') || s.includes('pant') || s.includes('apparel') || s.includes('sunglasses'))
    return 'fit is your top priority — golf apparel varies widely between brands, try before buying';

  // ── Complete Sets ──
  if (k.includes('strata') || k.includes('profile-sgi') || s.includes('beginner'))
    return 'you are sure golf is a long-term hobby — upgrade to individual clubs after your first season';

  // ── Push Carts ──
  if (k.includes('cart') || s.includes('push-cart'))
    return 'you ride a cart most rounds — a push cart only pays off if you walk 10+ rounds per year';

  // ── Gifts ──
  if (s.includes('gift'))
    return "you do not know the recipient's handicap or preferences — a pro shop gift card is safer";

  // ── Hybrids ──
  if (k.includes('hybrid') || s.includes('hybrid'))
    return 'you hit your long irons consistently — hybrids solve a problem you may not have';

  // ── Accessories ──
  if (k.includes('umbrella'))
    return 'you play in a consistently dry climate — a windproof umbrella is essential in rain-prone areas only';
  if (k.includes('towel'))
    return 'any microfiber towel works for you — premium golf towels add clips and magnets, not better cleaning';

  // ── Generic fallback ──
  return 'you are happy with your current setup and not solving a specific problem — upgrading for its own sake rarely improves scores';
}
