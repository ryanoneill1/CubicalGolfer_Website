// src/data/affiliate-links.ts
// ─────────────────────────────────────────────────────────────────────────────
// Amazon affiliate link registry — tag: cubicalgolfer-20
//
// ALL ASINs verified against live Amazon listings (March 2026).
// Link format: https://www.amazon.com/dp/[ASIN]/?tag=cubicalgolfer-20
//
// Products sold direct-to-consumer or with size/shaft variants
// use Amazon search links that still carry the affiliate tag.
//
// CHANGELOG (March 2026):
//   - FIXED: Rapsodo MLM2PRO now has correct ASIN B0BTPZMCSF
//             (was wrongly mapped to Arccos B0B5TW3HNG)
//   - FIXED: Titleist Players Flex now has its own search link
//             (was wrongly mapped to FootJoy WeatherSof B072LZV5Z6)
//   - ADDED: Blast Motion Golf Sensor (ASIN B00UNFHKUK)
//   - ADDED: Swing Caddie SC4 PRO — current 2024/2025 model
//             (ASIN B0DK24YKBD — replaces old SC4 reference)
//   - ADDED: SkyTrak+ simulator (search link — direct-sale primary)
//   - ADDED: All table-only products that lacked any link
//   - UPDATED: All 2026 product names corrected (Chrome Tour 2026, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const AFFILIATE: Record<string, {
  url: string;
  retailer: string;
  price: string;
  label: string;
  asin?: string;
}> = {

  // ── RANGEFINDERS ─────────────────────────────────────────────────────────

  // Bushnell Tour V6 Shift — ASIN B0C4PN57LJ ✅ verified
  'bushnell-tour-v6-shift': {
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$329',
    label: 'Buy at Bushnell',
    imgSrc: '/images/products/bushnell-tour-v6-shift.webp',
    imgAlt: 'Bushnell Tour V6 Shift Golf Rangefinder',
    benefits: [
        'PinSeeker JOLT locks onto flag in <0.3 seconds',
        'Slope Switch — legal toggle for tournament play',
        '±1 yard accuracy to 1,300 yards',
      ],
  },

  // Precision Pro NX9 HD (slope switch model) — ASIN B0DP3GL8RN ✅ verified
  'precision-pro-nx9-hd': {
    asin: 'B0DP3GL8RN',
    url: 'https://www.amazon.com/dp/B0DP3GL8RN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Buy Now',
    imgSrc: '/images/products/precision-pro-nx9-hd.webp',
    imgAlt: 'Precision Pro NX9 HD Golf Rangefinder',
    benefits: [
        'Adaptive slope technology adjusts for incline',
        '1-year battery life — forget it\'s in your bag',
        'Backed by a lifetime warranty',
      ],
  },

  // Blue Tees Series 3 Max — search (ASIN varies by colour variant)
  'blue-tees-series-3-max': {
    url: 'https://www.amazon.com/s?k=Blue+Tees+Golf+Series+3+Max+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Buy Now',
    imgSrc: '/images/products/blue-tees-series-3-max.webp',
    imgAlt: 'Blue Tees Series 3 Max Golf Rangefinder',
    benefits: [
        'Dual-display shows slope + actual distance simultaneously',
        '1,000-yard range — longest in its price category',
        'Magnetic charging — no more CR2 battery hassle',
      ]
  },

  // Garmin Approach Z82 — ASIN B085T56B2X ✅ verified (official Garmin listing)
  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Buy Now',
    imgSrc: '/images/products/garmin-approach-z82.webp',
    imgAlt: 'Garmin Approach Z82 GPS Laser Rangefinder',
    benefits: [
        'GPS + laser in one device',
        'Live green view with hazard distances',
        'Slope-adjusted yardages from 42,000 courses',
      ],
  },

  // Bushnell Pro XE — search (multiple bundle variants)
  'bushnell-pro-xe': {
    url: 'https://www.amazon.com/s?k=Bushnell+Pro+XE+golf+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Buy at Bushnell',
    imgSrc: '/images/products/bushnell-pro-xe.webp',
    imgAlt: 'Bushnell Pro XE Golf Rangefinder',
    benefits: [
        'Elements compensation: altitude + temperature + slope',
        'Magnetic cart mount — hands-free accessibility',
        'BITE magnetic technology holds to cart frame securely',
      ]
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────

  // Garmin Approach S62 Black — ASIN B083BJSYZ9 ✅ verified (official retail unit)
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Buy Now',
    imgSrc: '/images/products/garmin-approach-s62.webp',
    imgAlt: 'Garmin Approach S62 GPS Golf Watch',
    benefits: [
        '42,000 course database preloaded',
        'Full-colour touchscreen with green view',
        'Automatic shot tracking & club suggestions',
      ],
  },

  // Garmin Approach S42 — search (multiple colourway variants)
  'garmin-approach-s42': {
    url: 'https://www.amazon.com/s?k=Garmin+Approach+S42+golf+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Buy Now',
    benefits: [
        '42,000 preloaded courses worldwide',
        'Score tracking and stat collection built in',
        'Touchscreen — pinch/zoom on green map view',
      ]
  },

  // Shot Scope V5 — ASIN B0CYT7RJ54 ✅ verified
  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Buy Now',
    imgSrc: '/images/products/shot-scope-v5.webp',
    imgAlt: 'Shot Scope V5 GPS Golf Watch',
    benefits: [
        'Automatic shot tracking — no button presses',
        'Performance analytics for every club',
        '40,000+ courses, 14-hour battery',
      ],
  },

  // Bushnell Ion Elite — search (colourway/strap variants)
  'bushnell-ion-elite': {
    url: 'https://www.amazon.com/s?k=Bushnell+iON+Elite+GPS+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Buy at Bushnell',
    imgSrc: '/images/products/bushnell-ion-elite.webp',
    imgAlt: 'Bushnell Ion Elite GPS Golf Watch',
    benefits: [
        'Auto-course recognition — no manual selection needed',
        'Green View with moveable pin for precise front/back',
        '14-hour battery life covers 2 full rounds',
      ]
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max (2024) — search (shaft/loft variants)
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Driver',
    benefits: [
        'AI-designed face — maximises ball speed across the face',
        'Jailbreak AI Speed Frame stiffens body for faster face',
        'Largest sweet spot in the Paradym family — most forgiving',
      ]
  },

  // TaylorMade Qi35 Max (2025) — search (shaft/loft variants)
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Buy Now',
    imgSrc: '/images/products/taylormade-qi35-max.webp',
    imgAlt: 'TaylorMade Qi35 Max Driver',
    benefits: [
        '60X Carbon Twist Face for fast ball speed',
        'Inertia Generator lowers spin for more distance',
        'Lightweight titanium construction — 460cc head',
      ],
  },

  // Cobra Aerojet Max — search (shaft/loft variants)
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/s?k=Cobra+Aerojet+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Buy Now',
    imgSrc: '/images/products/cobra-aerojet-max.webp',
    imgAlt: 'Cobra Aerojet Max Golf Driver',
    benefits: [
        'H.O.T. Face Technology for consistent distance',
        'Extreme draw bias reduces slices',
        'PWR-COR Technology for fast face speeds',
      ],
  },

  // Ping G430 Max Driver — search (shaft/loft variants)
  'ping-g430-max-driver': {
    url: 'https://www.amazon.com/s?k=Ping+G430+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Buy Now',
    imgSrc: '/images/products/ping-g430-max-driver.webp',
    imgAlt: 'Ping G430 Max Golf Driver',
    benefits: [
        'Moveable weight: draw or neutral trajectory adjustment',
        'High-MOI design — most forgiving Ping driver ever made',
        'Carbonfly Wrap face — lighter crown = lower CG',
      ]
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────

  // Titleist Pro V1 (2025 gen, 25th anniversary) — ASIN B0BR2YF8T6 ✅ verified
  'titleist-pro-v1': {
    asin: 'B0BR2YF8T6',
    url: 'https://www.amazon.com/dp/B0BR2YF8T6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'Buy Now',
    imgSrc: '/images/products/titleist-pro-v1.webp',
    imgAlt: 'Titleist Pro V1 Golf Balls 2025',
    benefits: [
        'Soft feel with exceptional greenside spin',
        'Consistent distance across all shot types',
        'The #1 ball on the PGA Tour',
      ],
  },

  // Callaway Chrome Tour 2026 — search (very new Jan 2026, single ASIN not yet stable)
  'callaway-chrome-tour-2026': {
    url: 'https://www.amazon.com/s?k=Callaway+Chrome+Tour+2026+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$58/dozen',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-chrome-tour-2026.webp',
    imgAlt: 'Callaway Chrome Tour 2026 Golf Balls',
    benefits: [
        'Tour Fast Mantle — faster ball speed off driver',
        'Tighter spin variance on off-center hits',
        '2026 tour-validated: already earning wins on PGA Tour',
      ]
  },

  // TaylorMade TP5 2024 — search (colour/generation variants)
  'taylormade-tp5': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5+golf+balls+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'Buy Now',
    imgSrc: '/images/products/taylormade-tp5.webp',
    imgAlt: 'TaylorMade TP5 Golf Balls',
    benefits: [
        '5-layer construction — tour performance every club',
        'Tri-Fast Core maximises iron and wedge spin',
        'Preferred by Rory McIlroy and Tommy Fleetwood',
      ]
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=Srixon+Soft+Feel+golf+balls+dozen&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'Buy Now',
    imgSrc: '/images/products/srixon-soft-feel.webp',
    imgAlt: 'Srixon Soft Feel Golf Balls',
    benefits: [
        'Low-compression — benefits slower swing speeds most',
        'Soft ionomer cover for better feel around greens',
        'Under $28/dozen — best value two-piece available',
      ]
  },

  // Vice Pro — sold direct-to-consumer; not on Amazon as brand-sold
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Buy at Vice Golf',
    imgSrc: '/images/products/vice-pro.webp',
    imgAlt: 'Vice Pro Golf Balls',
    benefits: [
        'Direct-to-consumer pricing: tour ball at half the cost',
        'Urethane cover matches Pro V1 greenside spin',
        'Cast urethane — same process used on $55+ tour balls',
      ]
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/s?k=Callaway+Supersoft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dozen',
    label: 'Buy Now',
  },

  // ── IRONS ────────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max Irons (2024) — search (shaft/set config)
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+irons+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max-irons.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Irons',
    benefits: [
        'AI-designed Flash Face Cup — consistent across the set',
        '360 Face Cup flexes at impact for more ball speed',
        'Tungsten sole weighting — deep CG for easy launch',
      ]
  },

  // Titleist T300 Irons — search (shaft variants)
  'titleist-t300': {
    url: 'https://www.amazon.com/s?k=Titleist+T300+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Buy Now',
    imgSrc: '/images/products/titleist-t300.webp',
    imgAlt: 'Titleist T300 Golf Irons',
    benefits: [
        'Maximum forgiveness in Titleist T-series lineup',
        'Max Impact Technology — speed pocket boosts ball speed',
        'Tour-validated look at address — not chunky like SGIs',
      ]
  },

  // Titleist T100 Irons — search (shaft variants)
  'titleist-t100': {
    url: 'https://www.amazon.com/s?k=Titleist+T100+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'Buy Now',
    imgSrc: '/images/products/titleist-t100.webp',
    imgAlt: 'Titleist T100 Golf Irons',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G430+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Buy Now',
    imgSrc: '/images/products/ping-g430-irons.webp',
    imgAlt: 'Ping G430 Golf Irons',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'Buy Now',
    imgSrc: '/images/products/wilson-d9-irons.webp',
    imgAlt: 'Wilson D9 Golf Irons',
  },

  // ── BEGINNER SETS ─────────────────────────────────────────────────────────

  // Wilson Profile SGI Men's Complete Set — ASIN B09X2FJ9XX ✅ verified
  'wilson-profile-sgi': {
    asin: 'B09X2FJ9XX',
    url: 'https://www.amazon.com/dp/B09X2FJ9XX/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Buy Now',
    imgSrc: '/images/products/wilson-profile-sgi.webp',
    imgAlt: 'Wilson Profile SGI Complete Golf Set',
    benefits: [
        'Ultra game-improvement — designed for complete beginners',
        'Full 13-club set + bag included — no add-ons needed',
        'Undercut cavity irons launch high even on toe strikes',
      ]
  },

  // Callaway Strata Complete Set — search (varies by piece count / gender)
  'callaway-strata': {
    url: 'https://www.amazon.com/s?k=Callaway+Strata+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-strata.webp',
    imgAlt: 'Callaway Strata Complete Golf Set',
    benefits: [
        'Best-selling beginner set worldwide — 16-piece complete',
        'Driver, 3-wood, hybrids, irons, wedge, putter + bag',
        'Lightweight graphite shafts — easier to generate clubhead speed',
      ]
  },

  // TaylorMade RBZ Speed Lite — search (current model name varies by year)
  'taylormade-rbz-lite': {
    url: 'https://www.amazon.com/s?k=TaylorMade+RBZ+Speed+Lite+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Buy Now',
    imgSrc: '/images/products/taylormade-rbz-lite.webp',
    imgAlt: 'TaylorMade RBZ Speed Lite Golf Set',
    benefits: [
        'RocketBallZ technology for easy driver launch',
        'Hybrid replaces difficult 3 and 4-irons',
        'Best step-up set from beginner to intermediate',
      ]
  },

  // ── GLOVES ───────────────────────────────────────────────────────────────

  // FootJoy WeatherSof — ASIN B072LZV5Z6 ✅ verified (sold by FJ directly)
  'footjoy-weathersof-glove': {
    asin: 'B072LZV5Z6',
    url: 'https://www.amazon.com/dp/B072LZV5Z6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Buy Now',
    imgSrc: '/images/products/footjoy-weathersof-glove.webp',
    imgAlt: 'FootJoy WeatherSof Golf Glove',
    benefits: [
        '#1 selling golf glove in the world',
        'SofTrex material grips in heat and light moisture',
        'FlexZone knuckles for full range of motion',
      ],
  },

  // Titleist Players Flex — search (size/hand variants prevent single ASIN)
  // FIXED: Previously this incorrectly pointed to FootJoy WeatherSof (B072LZV5Z6).
  'titleist-players-flex': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+Flex+golf+glove+mens&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$22',
    label: 'Buy Now',
    imgSrc: '/images/products/titleist-players-flex.webp',
    imgAlt: 'Titleist Players Flex Golf Glove',
    benefits: [
        'Pure Cabretta leather — tour-level feel',
        'Perforated design — most breathable leather glove',
        'Moulds to your hand after 3-4 rounds',
      ],
  },

  // Callaway Dawn Patrol Glove — search (size variants)
  'callaway-dawn-patrol': {
    url: 'https://www.amazon.com/s?k=Callaway+Dawn+Patrol+golf+glove&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-dawn-patrol.webp',
    imgAlt: 'Callaway Dawn Patrol Golf Glove',
    benefits: [
        '#1 synthetic glove on tour by volume sold',
        'Opti-Fit tab — adjustable wrist closure for perfect fit',
        'Machine washable — extends life significantly',
      ]
  },

  // FootJoy RainGrip (mentioned in accessories-50 page)
  'footjoy-raingrip': {
    url: 'https://www.amazon.com/s?k=FootJoy+RainGrip+golf+gloves&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16/pair',
    label: 'Buy Now',
    imgSrc: '/images/products/footjoy-raingrip.webp',
    imgAlt: 'FootJoy RainGrip Golf Gloves 2-Pack',
    benefits: [
        'Grips better wet than most gloves grip dry',
        'FiberSof microfibre palm construction',
        'Essential for rain or humid conditions',
      ],
  },

  // ── TECH / LAUNCH MONITORS / ANALYZERS ───────────────────────────────────

  // Arccos Caddie Smart Sensors (3rd Gen) — ASIN B0B5TW3HNG ✅ verified
  'arccos-caddie-sensors': {
    asin: 'B0B5TW3HNG',
    url: 'https://www.amazon.com/dp/B0B5TW3HNG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179 + $99/yr',
    label: 'Buy Now',
    imgSrc: '/images/products/arccos-caddie-sensors.webp',
    imgAlt: 'Arccos Caddie Smart Sensors 3rd Gen',
    benefits: [
        'AI caddie suggests clubs based on your stats',
        'Automatic tracking — no phone in pocket needed',
        'Works with any irons or wedges',
      ],
  },

  // Rapsodo MLM2PRO — ASIN B0BTPZMCSF ✅ verified
  // FIXED: Was incorrectly mapped to arccos-caddie-sensors (B0B5TW3HNG).
  'rapsodo-mlm2pro': {
    asin: 'B0BTPZMCSF',
    url: 'https://www.amazon.com/dp/B0BTPZMCSF/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    label: 'Buy Now',
    imgSrc: '/images/products/rapsodo-mlm2pro.webp',
    imgAlt: 'Rapsodo MLM2PRO Golf Launch Monitor',
    benefits: [
        'Real launch monitor data: ball speed, spin, launch angle',
        'Works outdoors on the range — no radar mat required',
        'Connects to Rapsodo app with video overlay for each shot',
      ]
  },

  // Blast Motion Golf Swing & Stroke Analyzer — ASIN B00UNFHKUK ✅ verified
  'blast-motion-sensor': {
    asin: 'B00UNFHKUK',
    url: 'https://www.amazon.com/dp/B00UNFHKUK/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Buy Now',
    imgSrc: '/images/products/blast-motion-sensor.webp',
    imgAlt: 'Blast Motion Golf Swing Sensor',
    benefits: [
        'Attaches to grip — tracks tempo, backswing, impact speed',
        'Putter specific metrics: rotation, tempo, impact ratio',
        'Used by 200+ college and professional programs',
      ]
  },

  // Swing Caddie SC4 PRO (2024/2025 model) — ASIN B0DK24YKBD ✅ verified
  // NOTE: The article previously said "SC4" but the current product is the SC4 PRO.
  //       Body text and article data have been updated to reflect this.
  'swing-caddie-sc4-pro': {
    asin: 'B0DK24YKBD',
    url: 'https://www.amazon.com/dp/B0DK24YKBD/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Buy Now',
    imgSrc: '/images/products/swing-caddie-sc4-pro.webp',
    imgAlt: 'Voice Caddie Swing Caddie SC4 PRO Launch Monitor',
    benefits: [
        'Doppler radar — same technology as $2,000+ units',
        'Carries, roll, and total distance for every club',
        'Voice output: hands-free data after each shot',
      ]
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=SkyTrak+plus+golf+launch+monitor+simulator&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,995',
    label: 'Buy Now',
    imgSrc: '/images/products/skytrak-plus.webp',
    imgAlt: 'SkyTrak+ Home Golf Simulator Launch Monitor',
    benefits: [
        'Photometric camera captures ball flight at impact',
        'Access to 10 top simulator courses via subscription',
        'Works indoor or outdoor — no special mat required',
      ]
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────

  // Alignment sticks 2-pack
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks+2+pack+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'Buy Now',
    imgSrc: '/images/products/alignment-sticks.webp',
    imgAlt: 'Golf Alignment Sticks 2-Pack Training Aid',
    benefits: [
        'Improves aim, path, ball position & hip turn',
        'Used by every tour player and instructor',
        '20+ drills — most useful training aid in golf',
      ],
  },

  // Groove cleaning brush
  'groove-cleaning-brush': {
    url: 'https://www.amazon.com/s?k=golf+groove+cleaning+brush&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'Buy Now',
    imgSrc: '/images/products/groove-cleaning-brush.webp',
    imgAlt: 'Golf Groove Cleaning Brush',
    benefits: [
        'Keeps grooves clean for maximum spin and ball control',
        'Dual brush: brass wire + nylon for face and groove',
        'Retractable zip-line clip attaches to any bag',
      ]
  },

  // Magnetic hat clip ball markers
  'magnetic-ball-markers': {
    url: 'https://www.amazon.com/s?k=magnetic+golf+hat+clip+ball+marker+3+pack&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'Buy Now',
    imgSrc: '/images/products/magnetic-ball-markers.webp',
    imgAlt: 'Magnetic Golf Hat Clip Ball Markers',
    benefits: [
        'Hat clip built in — no pocket digging on the green',
        '3-pack includes multiple colours for playing partners',
        'Strong N52 magnet — won\'t slip off visor in wind',
      ]
  },

  // Frogger Amphibian Golf Towel
  'frogger-amphibian-towel': {
    url: 'https://www.amazon.com/s?k=Frogger+Amphibian+golf+towel&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Buy Now',
    imgSrc: '/images/products/frogger-amphibian-towel.webp',
    imgAlt: 'Frogger Amphibian Golf Towel',
    benefits: [
        'Dual-surface: waffle side scrubs, microfibre side dries',
        'Magnetic clip — stays attached even on fast cart rides',
        'Stays wet on cleaning side throughout all 18 holes',
      ]
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'Buy Now',
    imgSrc: '/images/products/putting-mirror.webp',
    imgAlt: 'Golf Putting Mirror Training Aid',
    benefits: [
        'Shows eye position, face angle & stroke path',
        '20 min/week eliminates most 3-putts',
        'As effective as a $300 alignment lesson',
      ],
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/s?k=golf+impact+face+tape+stickers&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'Buy Now',
    imgSrc: '/images/products/impact-tape.webp',
    imgAlt: 'Golf Club Face Impact Tape',
    benefits: [
        'Shows exactly where on the face you strike',
        'Works on driver, irons, wedges & putter',
        'One pack lasts months of practice sessions',
      ],
  },

  // Eyeline Golf Edge Putting Cup
  'eyeline-putting-cup': {
    url: 'https://www.amazon.com/s?k=Eyeline+Golf+Edge+putting+cup&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35',
    label: 'Buy Now',
    imgSrc: '/images/products/eyeline-putting-cup.webp',
    imgAlt: 'Eyeline Golf Edge Putting Cup',
    benefits: [
        'Tension-based gate forces center-face contact',
        'Adjustable hole size — get harder as you improve',
        'Folds flat — practice on any carpet or indoor surface',
      ]
  },

  // Gustbuster Pro Series umbrella
  'gustbuster-umbrella': {
    url: 'https://www.amazon.com/s?k=Gustbuster+Pro+Series+golf+umbrella&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$45',
    label: 'Buy Now',
  },
  // ── PUTTERS ───────────────────────────────────────────────────────────────
  'odyssey-white-hot-og': {
    url: 'https://www.amazon.com/s?k=Odyssey+White+Hot+OG+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$199', label: 'Buy Now',
    imgSrc: '/images/products/odyssey-white-hot-og.webp',
    imgAlt: 'Odyssey White Hot OG Putter',
    benefits: [
        'White Hot insert — soft, consistent, clear feedback',
        '2-ball alignment system: easiest aiming aid on market',
        'Best-selling putter family in golf for 20+ years',
      ]
  },
  'scotty-cameron-phantom': {
    url: 'https://www.amazon.com/s?k=Scotty+Cameron+Phantom+X+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$399', label: 'Buy Now',
    imgSrc: '/images/products/scotty-cameron-phantom.webp',
    imgAlt: 'Scotty Cameron Phantom X Putter',
    benefits: [
        'Stainless/aluminium multi-material — pure, firm feel',
        'Deep milled face for consistent roll on every putt',
        'Used by multiple major champions on PGA Tour',
      ]
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/s?k=Cleveland+HB+Soft+Milled+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'Buy Now',
    imgSrc: '/images/products/cleveland-hb-soft-milled.webp',
    imgAlt: 'Cleveland HB Soft Milled Putter',
    benefits: [
        'Milled face creates consistent roll at under $130',
        'Smart Sole geometry — cleaner contact from fringe',
        'HydraZip finish resists corrosion and maintains grip',
      ]
  },
  'taylormade-spider-tour': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+Tour+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$349', label: 'Buy Now',
    imgSrc: '/images/products/taylormade-spider-tour.webp',
    imgAlt: 'TaylorMade Spider Tour Putter',
    benefits: [
        'Pure Roll insert — high-friction face promotes topspin',
        'True Path alignment — full-length sight line for aim',
        'Heavy single-bend shaft — maximum stability at impact',
      ]
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.amazon.com/s?k=Sun+Mountain+2.5+Plus+carry+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$249', label: 'Buy Now',
    imgSrc: '/images/products/sun-mountain-25-plus.webp',
    imgAlt: 'Sun Mountain 2.5+ Carry Golf Bag',
    benefits: [
        '4-point dual strap — weight evenly distributed over both shoulders',
        'Insulated cooler pocket — keeps drinks cold for 18 holes',
        'Integrated stand built for all terrain — stays stable on any slope',
      ]
  },
  'titleist-players-4': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+4+StaDry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$279', label: 'Buy Now',
    imgSrc: '/images/products/titleist-players-4.webp',
    imgAlt: 'Titleist Players 4 StaDry Golf Bag',
    benefits: [
        'Ultra-lightweight — under 4 lbs with clubs',
        'Dual-strap system balances load across both shoulders',
        '14-way top with full-length dividers — no club tangling',
      ]
  },
  'callaway-fairway-14': {
    url: 'https://www.amazon.com/s?k=Callaway+Fairway+14+cart+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$179', label: 'Buy Now',
    imgSrc: '/images/products/callaway-fairway-14.webp',
    imgAlt: 'Callaway Fairway 14 Cart Bag',
    benefits: [
        '14-way top with full-length club dividers',
        'External putter well — dedicated access for flat stick',
        'Fits most push carts — trolley pass-through at base',
      ]
  },
  'callaway-chev-dry': {
    url: 'https://www.amazon.com/s?k=Callaway+Chev+Dry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'Buy Now',
    imgSrc: '/images/products/callaway-chev-dry.webp',
    imgAlt: 'Callaway Chev Dry Stand Bag',
    benefits: [
        'Waterproof bag — fully sealed from heavy rain',
        'Lightweight at 5.2 lbs — easy to carry or put on cart',
        'Universal cart strap pass-through fits all major brands',
      ]
  },

  // ── GOLF BALLS (additional) ───────────────────────────────────────────────
  'titleist-pro-v1x': {
    url: 'https://www.amazon.com/s?k=Titleist+Pro+V1x+golf+balls+2025&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$55/dozen', label: 'Buy Now',
    imgSrc: '/images/products/titleist-pro-v1x.webp',
    imgAlt: 'Titleist Pro V1x Golf Balls 2025',
    benefits: [
        'Higher compression than Pro V1 — benefits 105mph+ swing speeds',
        'Steeper descent angle on irons — holds greens better',
        '18-dimple pattern — penetrating flight in wind',
      ]
  },

  // ── GOLF SHOES ────────────────────────────────────────────────────────────
  'footjoy-flex-xp': {
    url: 'https://www.amazon.com/s?k=FootJoy+Flex+XP+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$120', label: 'Buy Now',
    imgSrc: '/images/products/footjoy-flex-xp.webp',
    imgAlt: 'FootJoy Flex XP Golf Shoes',
    benefits: [
        'Waterproof guarantee — full round in any weather',
        'Boa BOA® fit system — dial in exact tightness',
        'Turf-gripping traction outsole — soft spikes integrated',
      ]
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ECCO+Biom+C4+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$220', label: 'Buy Now',
    imgSrc: '/images/products/ecco-biom-c4.webp',
    imgAlt: 'ECCO Biom C4 Golf Shoes',
    benefits: [
        'ECCO FLUIDFORM™ sole — cushioning without extra weight',
        'Yak leather upper — premium water resistance built in',
        'GORE-TEX lining — waterproof and breathable in any condition',
      ]
  },
  'skechers-go-golf': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Pro+5+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$85', label: 'Buy Now',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Pro 5 Golf Shoes',
    benefits: [
        'H2GO Shield — weather-resistant without full waterproofing cost',
        'Arch Fit insole — podiatrist designed for 18-hole comfort',
        'Spikeless — works on course and off: no shoe change required',
      ]
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=FootJoy+Tour+Alpha+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$200', label: 'Buy Now',
    imgSrc: '/images/products/footjoy-tour-alpha.webp',
    imgAlt: 'FootJoy Tour Alpha Golf Shoes',
  },


  // ── BUDGET DRIVERS (best-golf-drivers-under-200 article) ────────────────

  'taylormade-sim-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+SIM+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$129-149',
    label: 'Buy Now',
    imgSrc: '/images/products/taylormade-sim-max.webp',
    imgAlt: 'TaylorMade SIM Max Golf Driver',
    benefits: [
      'Speed Injected Twist Face for faster ball speed',
      '460cc head with draw-biased weighting',
      '2021 tour tech at 2026 budget pricing',
    ],
  },

  'callaway-big-bertha-b21': {
    url: 'https://www.amazon.com/s?k=Callaway+Big+Bertha+B21+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169-199',
    label: 'Buy Now',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.webp',
    imgAlt: 'Callaway Big Bertha B21 Golf Driver',
    benefits: [
      'Offset hosel fights slices for high-handicappers',
      'Flash Face SS21 for maximum ball speed',
      'Draw-bias weighting keeps shots in the fairway',
    ],
  },

  'cleveland-launcher-xl': {
    url: 'https://www.amazon.com/s?k=Cleveland+Launcher+XL+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149-179',
    label: 'Buy Now',
    imgSrc: '/images/products/cobra-aerojet-max.webp',
    imgAlt: 'Cleveland Launcher XL Golf Driver',
    benefits: [
      'Rebound Frame for fast, flexible face',
      'HiBore Crown lowers CG for high launch',
      'Most forgiving Cleveland driver at this price',
    ],
  },

};

// ── Helper ────────────────────────────────────────────────────────────────────
// Returns the affiliate entry, or a search fallback that still carries the tag.
export function getAffiliateLink(productId: string) {
  if (AFFILIATE[productId]) return AFFILIATE[productId];
  return {
    url: `https://www.amazon.com/s?k=${encodeURIComponent(productId.replace(/-/g, ' '))}&tag=cubicalgolfer-20`,
    retailer: 'Amazon',
    price: 'Check price',
    label: 'Buy Now',
  };
}
