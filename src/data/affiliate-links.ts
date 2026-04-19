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
  imgSrc?: string;
  imgAlt?: string;
  benefits?: string[];
}> = {

  // ── RANGEFINDERS ─────────────────────────────────────────────────────────

  // Bushnell Tour V6 Shift — ASIN B0C4PN57LJ ✅ verified
  'bushnell-tour-v6-shift': {
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$329',
    label: 'Check Price at Bushnell',
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
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/blue-tees-series-3-max.webp',
    imgAlt: 'Blue Tees Series 3 Max Golf Rangefinder',
  
    benefits: [
      'Lifetime warranty — replaced free if it ever fails',
      'Slope toggle for tournament-legal play',
      '±1 yard accuracy matches $300+ rangefinders',
    ],
  },

  // Garmin Approach Z82 — ASIN B085T56B2X ✅ verified (official Garmin listing)
  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
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
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$499',
    label: 'Check Price at Bushnell',
    imgSrc: '/images/products/bushnell-pro-xe.webp',
    imgAlt: 'Bushnell Pro XE Golf Rangefinder',
  
    benefits: [
      'Slope + Elements compensates for wind & altitude',
      'BITE magnetic mount for cart bar convenience',
      'Dual Display — red or black optics for any light',
    ],
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────

  // Garmin Approach S62 Black — ASIN B083BJSYZ9 ✅ verified (official retail unit)
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-s42.webp',
    imgAlt: 'Garmin Approach S42 GPS Golf Watch',
    benefits: [
      '42,000+ courses preloaded',
      'Touchscreen with 3.5cm display',
      'AutoShot tracking for accurate stats',
    ],
  },

  // Shot Scope V5 — ASIN B0CYT7RJ54 ✅ verified
  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
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
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$149',
    label: 'Check Price at Bushnell',
    imgSrc: '/images/products/bushnell-ion-elite.webp',
    imgAlt: 'Bushnell Ion Elite GPS Golf Watch',
  
    benefits: [
      'Largest GPS watch display — readable in direct sunlight',
      'Slope-adjusted yardages built in at this price point',
      'Auto hole advance with 36,000+ courses preloaded',
    ],
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max (2024) — search (shaft/loft variants)
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Driver',
    benefits: [
      'AI-designed face optimized for consistent ball speed',
      'Jailbreak + Batwing tech for stability on mishits',
      'Adjustable hosel for draw/fade tuning',
    ],
  },

  // TaylorMade Qi35 Max (2025) — search (shaft/loft variants)
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-qi35-max.webp',
    imgAlt: 'TaylorMade Qi35 Max Driver',
    benefits: [
      'Largest sweet spot in the TaylorMade lineup',
      'Qi10 Infinity Carbon Crown for low spin',
      'Speed Pocket flexes on low-face strikes for distance',
    ],
  },

  // Cobra Aerojet Max — search (shaft/loft variants)
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/s?k=Cobra+Aerojet+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/cobra-aerojet-max.webp',
    imgAlt: 'Cobra Aerojet Max Golf Driver',
    benefits: [
      'PWR Bridge weighting for maximum forgiveness',
      'AI-designed face for ball speed across the face',
      'Best value premium driver at ~$100 less than rivals',
    ],
  },

  // Ping G430 Max Driver — search (shaft/loft variants)
  'ping-g430-max-driver': {
    url: 'https://www.amazon.com/s?k=Ping+G430+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-max-driver.webp',
    imgAlt: 'Ping G430 Max Golf Driver',
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────

  // Titleist Pro V1 (2025 gen, 25th anniversary) — ASIN B0BR2YF8T6 ✅ verified
  'titleist-pro-v1': {
    asin: 'B0BR2YF8T6',
    url: 'https://www.amazon.com/dp/B0BR2YF8T6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-chrome-tour-2026.webp',
    imgAlt: 'Callaway Chrome Tour 2026 Golf Balls',
  
    benefits: [
      'Seamless Tour Aero design for stable ball flight',
      'Graphene-infused Dual SoftFast core for speed',
      'Tour-level spin with softer feel than Pro V1',
    ],
  },

  // TaylorMade TP5 2024 — search (colour/generation variants)
  'taylormade-tp5': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5+golf+balls+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-tp5.webp',
    imgAlt: 'TaylorMade TP5 Golf Balls',
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=Srixon+Soft+Feel+golf+balls+dozen&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/srixon-soft-feel.webp',
    imgAlt: 'Srixon Soft Feel Golf Balls',
  
    benefits: [
      'Low compression (60) — ideal for swing speeds under 90mph',
      'Soft Thin Cover for greenside control at half the price',
      'Best value 2-piece ball for recreational golfers',
    ],
  },

  // Vice Pro — sold direct-to-consumer; not on Amazon as brand-sold
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Check Price at Vice Golf',
    imgSrc: '/images/products/vice-pro.webp',
    imgAlt: 'Vice Pro Golf Balls',
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/s?k=Callaway+Supersoft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-supersoft.webp',
    imgAlt: 'Callaway Supersoft Golf Balls',
    benefits: [
      'Ultra-low compression — ideal below 85 mph swing',
      'Softest feel in the Callaway lineup',
      'Reduced spin for straighter flights',
    ],
  },

  // ── IRONS ────────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max Irons (2024) — search (shaft/set config)
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+irons+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max-irons.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Irons',
  
    benefits: [
      'AI-designed Flash Face for distance on every club',
      'Tungsten weighting for high launch and forgiveness',
      'Urethane microspheres dampen vibration on mishits',
    ],
  },

  // Titleist T300 Irons — search (shaft variants)
  'titleist-t300': {
    url: 'https://www.amazon.com/s?k=Titleist+T300+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t300.webp',
    imgAlt: 'Titleist T300 Golf Irons',
  
    benefits: [
      'Max Impact 2.0 tech for distance without sacrificing feel',
      'Denser tungsten weighting for a higher launch angle',
      'Clean blade-like appearance with game-improvement tech',
    ],
  },

  // Titleist T100 Irons — search (shaft variants)
  'titleist-t100': {
    url: 'https://www.amazon.com/s?k=Titleist+T100+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t100.webp',
    imgAlt: 'Titleist T100 Golf Irons',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G430+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-irons.webp',
    imgAlt: 'Ping G430 Golf Irons',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/wilson-profile-sgi.webp',
    imgAlt: 'Wilson Profile SGI Complete Golf Set',
  
    benefits: [
      'Complete 13-piece set with bag — everything you need',
      'Oversized irons designed for maximum forgiveness',
      'Best-selling beginner set for weekend golfers',
    ],
  },

  // Callaway Strata Complete Set — search (varies by piece count / gender)
  'callaway-strata': {
    url: 'https://www.amazon.com/s?k=Callaway+Strata+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-strata.webp',
    imgAlt: 'Callaway Strata Complete Golf Set',
  
    benefits: [
      '12-piece complete set with stand bag included',
      'Forgiving driver and fairway wood for high launch',
      'Trusted Callaway engineering at a starter price',
    ],
  },

  // TaylorMade RBZ Speed Lite — search (current model name varies by year)
  'taylormade-rbz-lite': {
    url: 'https://www.amazon.com/s?k=TaylorMade+RBZ+Speed+Lite+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-rbz-lite.webp',
    imgAlt: 'TaylorMade RBZ Speed Lite Golf Set',
  },

  // ── GLOVES ───────────────────────────────────────────────────────────────

  // FootJoy WeatherSof — ASIN B072LZV5Z6 ✅ verified (sold by FJ directly)
  'footjoy-weathersof-glove': {
    asin: 'B072LZV5Z6',
    url: 'https://www.amazon.com/dp/B072LZV5Z6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-players-flex.webp',
    imgAlt: 'Titleist Players Flex Golf Glove',
  },

  // Callaway Dawn Patrol Glove — search (size variants)
  'callaway-dawn-patrol': {
    url: 'https://www.amazon.com/s?k=Callaway+Dawn+Patrol+golf+glove&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-dawn-patrol.webp',
    imgAlt: 'Callaway Dawn Patrol Golf Glove',
  },

  // FootJoy RainGrip (mentioned in accessories-50 page)
  'footjoy-raingrip': {
    url: 'https://www.amazon.com/s?k=FootJoy+RainGrip+golf+gloves&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16/pair',
    label: 'See Current Price',
    imgSrc: '/images/products/footjoy-raingrip.webp',
    imgAlt: 'FootJoy RainGrip Golf Gloves 2-Pack',
  },

  // ── TECH / LAUNCH MONITORS / ANALYZERS ───────────────────────────────────

  // Arccos Caddie Smart Sensors (3rd Gen) — ASIN B0B5TW3HNG ✅ verified
  'arccos-caddie-sensors': {
    asin: 'B0B5TW3HNG',
    url: 'https://www.amazon.com/dp/B0B5TW3HNG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179 + $99/yr',
    label: 'See Current Price',
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
    label: 'See Current Price',
    imgSrc: '/images/products/rapsodo-mlm2pro.webp',
    imgAlt: 'Rapsodo MLM2PRO Golf Launch Monitor',
  
    benefits: [
      'Doppler radar + camera for indoor/outdoor use',
      'Shot tracer video replay on every swing',
      'E6 Connect compatible for course simulation',
    ],
  },

  // Blast Motion Golf Swing & Stroke Analyzer — ASIN B00UNFHKUK ✅ verified
  'blast-motion-sensor': {
    asin: 'B00UNFHKUK',
    url: 'https://www.amazon.com/dp/B00UNFHKUK/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'See Current Price',
    imgSrc: '/images/products/blast-motion-sensor.webp',
    imgAlt: 'Blast Motion Golf Swing Sensor',
  },

  // Swing Caddie SC4 PRO (2024/2025 model) — ASIN B0DK24YKBD ✅ verified
  // NOTE: The article previously said "SC4" but the current product is the SC4 PRO.
  //       Body text and article data have been updated to reflect this.
  'swing-caddie-sc4-pro': {
    asin: 'B0DK24YKBD',
    url: 'https://www.amazon.com/dp/B0DK24YKBD/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/swing-caddie-sc4-pro.webp',
    imgAlt: 'Voice Caddie Swing Caddie SC4 PRO Launch Monitor',
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=SkyTrak+plus+golf+launch+monitor+simulator&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,995',
    label: 'See Current Price',
    imgSrc: '/images/products/skytrak-plus.webp',
    imgAlt: 'SkyTrak+ Home Golf Simulator Launch Monitor',
  
    benefits: [
      '4 high-speed cameras for photometric spin accuracy',
      'Integrates with E6 Connect and TGC 2019 simulators',
      'Professional-grade data: ball speed, spin axis, launch',
    ],
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────

  // Alignment sticks 2-pack
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks+2+pack+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/alignment-sticks.webp',
    imgAlt: 'Golf Alignment Sticks 2-Pack Training Aid',
  },

  // Groove cleaning brush
  'groove-cleaning-brush': {
    url: 'https://www.amazon.com/s?k=golf+groove+cleaning+brush&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/groove-cleaning-brush.webp',
    imgAlt: 'Golf Groove Cleaning Brush',
  },

  // Magnetic hat clip ball markers
  'magnetic-ball-markers': {
    url: 'https://www.amazon.com/s?k=magnetic+golf+hat+clip+ball+marker+3+pack&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/magnetic-ball-markers.webp',
    imgAlt: 'Magnetic Golf Hat Clip Ball Markers',
  },

  // Frogger Amphibian Golf Towel
  'frogger-amphibian-towel': {
    url: 'https://www.amazon.com/s?k=Frogger+Amphibian+golf+towel&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/frogger-amphibian-towel.webp',
    imgAlt: 'Frogger Amphibian Golf Towel',
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/putting-mirror.webp',
    imgAlt: 'Golf Putting Mirror Training Aid',
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/s?k=golf+impact+face+tape+stickers&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/impact-tape.webp',
    imgAlt: 'Golf Club Face Impact Tape',
  },

  // Eyeline Golf Edge Putting Cup
  'eyeline-putting-cup': {
    url: 'https://www.amazon.com/s?k=Eyeline+Golf+Edge+putting+cup&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35',
    label: 'See Current Price',
    imgSrc: '/images/products/eyeline-putting-cup.webp',
    imgAlt: 'Eyeline Golf Edge Putting Cup',
  },

  // Gustbuster Pro Series umbrella
  'gustbuster-umbrella': {
    url: 'https://www.amazon.com/s?k=Gustbuster+Pro+Series+golf+umbrella&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$45',
    label: 'See Current Price',
    imgSrc: '/images/products/gustbuster-umbrella.webp',
    imgAlt: 'GustBuster Golf Umbrella',
    benefits: [
      'Patented vent system handles 55+ mph winds',
      '62-inch arc — covers you and your bag',
      'Auto-open push-button handle',
    ],
  },
  // ── PUTTERS ───────────────────────────────────────────────────────────────
  'odyssey-white-hot-og': {
    url: 'https://www.amazon.com/s?k=Odyssey+White+Hot+OG+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$199', label: 'See Current Price',
    imgSrc: '/images/products/odyssey-white-hot-og.webp',
    imgAlt: 'Odyssey White Hot OG Putter',
  
    benefits: [
      'White Hot insert — legendary soft feel at impact',
      'Toe-hang balance suits slight arc putting strokes',
      'Stroke Lab shaft for consistent tempo',
    ],
  },
  'scotty-cameron-phantom': {
    url: 'https://www.amazon.com/s?k=Scotty+Cameron+Phantom+X+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$399', label: 'See Current Price',
    imgSrc: '/images/products/scotty-cameron-phantom.webp',
    imgAlt: 'Scotty Cameron Phantom X Putter',
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/s?k=Cleveland+HB+Soft+Milled+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'See Current Price',
    imgSrc: '/images/products/cleveland-hb-soft-milled.webp',
    imgAlt: 'Cleveland HB Soft Milled Putter',
  
    benefits: [
      'Milled face for consistent roll from any lie',
      'High-MOI mallet resists twisting on mishits',
      'Best value premium putter under $150',
    ],
  },
  'taylormade-spider-tour': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+Tour+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$349', label: 'See Current Price',
    imgSrc: '/images/products/taylormade-spider-tour.webp',
    imgAlt: 'TaylorMade Spider Tour Putter',
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.amazon.com/s?k=Sun+Mountain+2.5+Plus+carry+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$249', label: 'See Current Price',
    imgSrc: '/images/products/sun-mountain-25-plus.webp',
    imgAlt: 'Sun Mountain 2.5+ Carry Golf Bag',
  
    benefits: [
      '14-way top keeps every club organized and accessible',
      'Under 5 lbs — lightest full-featured carry bag',
      'Integrated stand with anti-slip legs',
    ],
  },
  'titleist-players-4': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+4+StaDry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$279', label: 'See Current Price',
    imgSrc: '/images/products/titleist-players-4.webp',
    imgAlt: 'Titleist Players 4 StaDry Golf Bag',
  
    benefits: [
      '4-way top with full-length dividers for club protection',
      'Lightweight at 3.5 lbs with comfortable dual straps',
      'Premium materials built to last 5+ seasons',
    ],
  },
  'callaway-fairway-14': {
    url: 'https://www.amazon.com/s?k=Callaway+Fairway+14+cart+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$179', label: 'See Current Price',
    imgSrc: '/images/products/callaway-fairway-14.webp',
    imgAlt: 'Callaway Fairway 14 Cart Bag',
  },
  'callaway-chev-dry': {
    url: 'https://www.amazon.com/s?k=Callaway+Chev+Dry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'See Current Price',
    imgSrc: '/images/products/callaway-chev-dry.webp',
    imgAlt: 'Callaway Chev Dry Stand Bag',
  },

  // ── GOLF BALLS (additional) ───────────────────────────────────────────────
  'titleist-pro-v1x': {
    url: 'https://www.amazon.com/s?k=Titleist+Pro+V1x+golf+balls+2025&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$55/dozen', label: 'See Current Price',
    imgSrc: '/images/products/titleist-pro-v1x.webp',
    imgAlt: 'Titleist Pro V1x Golf Balls 2025',
  
    benefits: [
      'Higher flight and more spin than the standard Pro V1',
      'Firmer feel preferred by faster swing speed players',
      'Optimized for swing speeds above 100mph',
    ],
  },

  // ── GOLF SHOES ────────────────────────────────────────────────────────────
  'footjoy-flex-xp': {
    url: 'https://www.amazon.com/s?k=FootJoy+Flex+XP+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$120', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-flex-xp.webp',
    imgAlt: 'FootJoy Flex XP Golf Shoes',
  
    benefits: [
      'Waterproof protection with breathable mesh upper',
      'Lightweight cushioning ideal for 18-hole walks',
      'Versatile spikeless sole works on and off the course',
    ],
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ECCO+Biom+C4+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$220', label: 'See Current Price',
    imgSrc: '/images/products/ecco-biom-c4.webp',
    imgAlt: 'ECCO Biom C4 Golf Shoes',
  },
  'skechers-go-golf': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Pro+5+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$85', label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Pro 5 Golf Shoes',
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=FootJoy+Tour+Alpha+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$200', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-tour-alpha.webp',
    imgAlt: 'FootJoy Tour Alpha Golf Shoes',
  },

  // ── LAUNCH MONITORS ───────────────────────────────────────────────────────

  'garmin-approach-r10': {
    asin: 'B096B5JR5D',
    url: 'https://www.amazon.com/dp/B096B5JR5D/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-r10.webp',
    imgAlt: 'Garmin Approach R10 Portable Golf Launch Monitor',
    benefits: [
      'Tracks 14+ data metrics including spin and launch angle',
      'Works indoors and outdoors — waterproof and pocket-sized',
      'Free E6 Connect sim play with Bandon Dunes included',
    ],
  },

  'voice-caddie-sc4-pro': {
    url: 'https://www.amazon.com/s?k=Voice+Caddie+SC4+Pro+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/voice-caddie-sc4-pro.webp',
    imgAlt: 'Voice Caddie SC4 Pro Golf Launch Monitor',
    benefits: [
      'Built-in color screen — no phone needed on the range',
      'E6 Connect compatible for home simulator play',
      'No subscription — all features included at purchase',
    ],
  },

  'bushnell-launch-pro': {
    url: 'https://www.amazon.com/s?k=Bushnell+Launch+Pro+Circle+B+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,499',
    label: 'See Current Price',
    imgSrc: '/images/products/bushnell-launch-pro.webp',
    imgAlt: 'Bushnell Launch Pro Circle B Launch Monitor',
    benefits: [
      'Same hardware as Foresight GC3 at 65% less cost',
      'Three-camera photometric system for tour-level accuracy',
      'Works with FSX Play, E6 Connect, and GSPro simulators',
    ],
  },

  'flightscope-mevo-gen2': {
    url: 'https://www.amazon.com/s?k=FlightScope+Mevo+Gen+2+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,199',
    label: 'See Current Price',
    imgSrc: '/images/products/flightscope-mevo-gen2.webp',
    imgAlt: 'FlightScope Mevo Gen 2 Launch Monitor',
    benefits: [
      '3D Doppler radar for indoor and outdoor accuracy',
      'Full club data: path, face angle, attack angle',
      'Built-in camera for swing video with data overlay',
    ],
  },

  'trackman-4': {
    url: 'https://www.amazon.com/s?k=Trackman+4+golf+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$21,995',
    label: 'See Current Price',
    imgSrc: '/images/products/trackman-4.webp',
    imgAlt: 'Trackman 4 Golf Launch Monitor',
    benefits: [
      'Dual-radar OERT tracks full ball flight from impact to landing',
      '40+ data parameters — the most comprehensive on the market',
      'Used by 90%+ of PGA Tour coaches and club fitters',
    ],
  },

  'foresight-gcquad': {
    url: 'https://www.amazon.com/s?k=Foresight+GCQuad+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$14,500',
    label: 'See Current Price',
    imgSrc: '/images/products/foresight-gcquad.webp',
    imgAlt: 'Foresight Sports GCQuad Launch Monitor',
    benefits: [
      'Four high-speed cameras measure impact directly — not estimated',
      'More consistent spin data than radar units on mishits',
      'Works with FSX Play, E6 Connect, GSPro and TGC 2019',
    ],
  },

  // ── Golf Desk Accessories ────────────────────────────────────────────────────
  'desktop-putting-set': {
    url: 'https://www.amazon.com/s?k=desktop+golf+putting+set+office&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/desktop-putting-set.webp',
    imgAlt: 'Desktop Golf Putting Set for Office',
    benefits: [
      'Compact putting green fits on any desk or office floor',
      'Includes mini putter, balls, and return cup',
      'Perfect for 2-minute putting breaks between meetings',
    ],
  },
  'golf-themed-mug': {
    url: 'https://www.amazon.com/s?k=golf+themed+coffee+mug+funny&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-themed-mug.webp',
    imgAlt: 'Funny Golf-Themed Coffee Mug',
  },
  'office-putting-mat': {
    url: 'https://www.amazon.com/s?k=office+putting+mat+indoor+golf&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$30',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/office-putting-mat.webp',
    imgAlt: 'Indoor Office Putting Mat',
    benefits: [
      'Rolls up and fits under your desk when the boss walks by',
      'True-roll surface simulates 10-foot stimp greens',
      'Available in 8-foot and 10-foot lengths',
    ],
  },
  'mini-chipping-net': {
    url: 'https://www.amazon.com/s?k=mini+indoor+golf+chipping+net&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/mini-chipping-net.webp',
    imgAlt: 'Mini Indoor Golf Chipping Net',
  },
  'golf-stress-ball': {
    url: 'https://www.amazon.com/s?k=golf+ball+stress+ball+desk+toy&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$10',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-stress-ball.webp',
    imgAlt: 'Golf Ball Stress Ball Desk Toy',
  },
  'magnetic-ball-marker-desk': {
    url: 'https://www.amazon.com/s?k=magnetic+golf+ball+marker+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/magnetic-ball-markers.webp',
    imgAlt: 'Magnetic Golf Ball Marker Set',
  },
  'golf-book-harvey-penick': {
    url: 'https://www.amazon.com/dp/0684867133/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Price on Amazon',
    imgSrc: '/images/products/golf-book-harvey-penick.webp',
    imgAlt: 'Harvey Penick Little Red Book',
  },
  'golf-mouse-pad': {
    url: 'https://www.amazon.com/s?k=golf+course+mouse+pad+desk&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$14',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-mouse-pad.webp',
    imgAlt: 'Golf Course Aerial Mouse Pad',
  },

  // ── Golf Balls for 90 MPH Swing Speed ────────────────────────────────────────
  'srixon-q-star-tour': {
    url: 'https://www.amazon.com/dp/B09TQXQRMH/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/srixon-q-star-tour.webp',
    imgAlt: 'Srixon Q-Star Tour Golf Balls',
    benefits: [
      '72 compression — perfectly matched to 85-95 mph swing speeds',
      'Urethane cover delivers tour-level greenside spin',
      'FastLayer core transitions from soft center to firm edge for distance',
    ],
  },
  'callaway-chrome-soft': {
    url: 'https://www.amazon.com/dp/B0BPMCSNQF/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-chrome-soft.webp',
    imgAlt: 'Callaway Chrome Soft Golf Balls',
    benefits: [
      '75 compression — low-compression premium ball for moderate speeds',
      'Hyper Elastic SoftFast core maximizes ball speed at 90 mph',
      'Tour-quality urethane cover for short game spin and control',
    ],
  },
  'titleist-tour-speed': {
    url: 'https://www.amazon.com/dp/B0CM4DP9WL/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$36/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-tour-speed.webp',
    imgAlt: 'Titleist Tour Speed Golf Balls',
    benefits: [
      '80 compression — bridges the gap between distance and tour performance',
      'Reformulated core designed for 85-100 mph swing speeds',
      'Ionomer cover is durable and affordable while still providing spin',
    ],
  },
  'taylormade-tour-response': {
    url: 'https://www.amazon.com/dp/B0BFMKM3MG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-tour-response.webp',
    imgAlt: 'TaylorMade Tour Response Golf Balls',
    benefits: [
      '70 compression — softest premium ball in this class',
      '100% cast urethane cover for Pro V1-level greenside control',
      'Tour Flight dimple pattern optimized for mid-speed launch',
    ],
  },
  'bridgestone-e12-contact': {
    url: 'https://www.amazon.com/dp/B09HYNRQJQ/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$28/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/bridgestone-e12-contact.webp',
    imgAlt: 'Bridgestone e12 Contact Golf Balls',
    benefits: [
      '78 compression — mid-range core tuned for moderate swing speeds',
      'Contact Force dimple extends contact time for straighter flight',
      'Best value premium ball under $30 per dozen',
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
    label: 'See Current Price',
  };
}
