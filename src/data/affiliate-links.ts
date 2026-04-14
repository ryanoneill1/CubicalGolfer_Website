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
    imgSrc: '/images/products/bushnell-tour-v6-shift.svg',
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
    imgSrc: '/images/products/precision-pro-nx9-hd.svg',
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
    imgSrc: '/images/products/blue-tees-series-3-max.svg',
    imgAlt: 'Blue Tees Series 3 Max Golf Rangefinder',
  },

  // Garmin Approach Z82 — ASIN B085T56B2X ✅ verified (official Garmin listing)
  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-z82.svg',
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
    imgSrc: '/images/products/bushnell-pro-xe.svg',
    imgAlt: 'Bushnell Pro XE Golf Rangefinder',
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────

  // Garmin Approach S62 Black — ASIN B083BJSYZ9 ✅ verified (official retail unit)
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-s62.svg',
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
  },

  // Shot Scope V5 — ASIN B0CYT7RJ54 ✅ verified
  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
    imgSrc: '/images/products/shot-scope-v5.svg',
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
    imgSrc: '/images/products/bushnell-ion-elite.svg',
    imgAlt: 'Bushnell Ion Elite GPS Golf Watch',
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max (2024) — search (shaft/loft variants)
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.svg',
    imgAlt: 'Callaway Paradym AI Smoke Max Driver',
  },

  // TaylorMade Qi35 Max (2025) — search (shaft/loft variants)
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-qi35-max.svg',
    imgAlt: 'TaylorMade Qi35 Max Driver',
  },

  // Cobra Aerojet Max — search (shaft/loft variants)
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/s?k=Cobra+Aerojet+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/cobra-aerojet-max.svg',
    imgAlt: 'Cobra Aerojet Max Golf Driver',
  },

  // Ping G430 Max Driver — search (shaft/loft variants)
  'ping-g430-max-driver': {
    url: 'https://www.amazon.com/s?k=Ping+G430+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-max-driver.svg',
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
    imgSrc: '/images/products/titleist-pro-v1.svg',
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
    imgSrc: '/images/products/callaway-chrome-tour-2026.svg',
    imgAlt: 'Callaway Chrome Tour 2026 Golf Balls',
  },

  // TaylorMade TP5 2024 — search (colour/generation variants)
  'taylormade-tp5': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5+golf+balls+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-tp5.svg',
    imgAlt: 'TaylorMade TP5 Golf Balls',
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=Srixon+Soft+Feel+golf+balls+dozen&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/srixon-soft-feel.svg',
    imgAlt: 'Srixon Soft Feel Golf Balls',
  },

  // Vice Pro — sold direct-to-consumer; not on Amazon as brand-sold
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Check Price at Vice Golf',
    imgSrc: '/images/products/vice-pro.svg',
    imgAlt: 'Vice Pro Golf Balls',
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/s?k=Callaway+Supersoft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dozen',
    label: 'See Current Price',
  },

  // ── IRONS ────────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max Irons (2024) — search (shaft/set config)
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+irons+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max-irons.svg',
    imgAlt: 'Callaway Paradym AI Smoke Max Irons',
  },

  // Titleist T300 Irons — search (shaft variants)
  'titleist-t300': {
    url: 'https://www.amazon.com/s?k=Titleist+T300+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t300.svg',
    imgAlt: 'Titleist T300 Golf Irons',
  },

  // Titleist T100 Irons — search (shaft variants)
  'titleist-t100': {
    url: 'https://www.amazon.com/s?k=Titleist+T100+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t100.svg',
    imgAlt: 'Titleist T100 Golf Irons',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G430+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-irons.svg',
    imgAlt: 'Ping G430 Golf Irons',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/wilson-d9-irons.svg',
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
    imgSrc: '/images/products/wilson-profile-sgi.svg',
    imgAlt: 'Wilson Profile SGI Complete Golf Set',
  },

  // Callaway Strata Complete Set — search (varies by piece count / gender)
  'callaway-strata': {
    url: 'https://www.amazon.com/s?k=Callaway+Strata+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-strata.svg',
    imgAlt: 'Callaway Strata Complete Golf Set',
  },

  // TaylorMade RBZ Speed Lite — search (current model name varies by year)
  'taylormade-rbz-lite': {
    url: 'https://www.amazon.com/s?k=TaylorMade+RBZ+Speed+Lite+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-rbz-lite.svg',
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
    imgSrc: '/images/products/footjoy-weathersof-glove.svg',
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
    imgSrc: '/images/products/titleist-players-flex.svg',
    imgAlt: 'Titleist Players Flex Golf Glove',
  },

  // Callaway Dawn Patrol Glove — search (size variants)
  'callaway-dawn-patrol': {
    url: 'https://www.amazon.com/s?k=Callaway+Dawn+Patrol+golf+glove&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-dawn-patrol.svg',
    imgAlt: 'Callaway Dawn Patrol Golf Glove',
  },

  // FootJoy RainGrip (mentioned in accessories-50 page)
  'footjoy-raingrip': {
    url: 'https://www.amazon.com/s?k=FootJoy+RainGrip+golf+gloves&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16/pair',
    label: 'See Current Price',
    imgSrc: '/images/products/footjoy-raingrip.svg',
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
    imgSrc: '/images/products/arccos-caddie-sensors.svg',
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
    imgSrc: '/images/products/rapsodo-mlm2pro.svg',
    imgAlt: 'Rapsodo MLM2PRO Golf Launch Monitor',
  },

  // Blast Motion Golf Swing & Stroke Analyzer — ASIN B00UNFHKUK ✅ verified
  'blast-motion-sensor': {
    asin: 'B00UNFHKUK',
    url: 'https://www.amazon.com/dp/B00UNFHKUK/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'See Current Price',
    imgSrc: '/images/products/blast-motion-sensor.svg',
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
    imgSrc: '/images/products/swing-caddie-sc4-pro.svg',
    imgAlt: 'Voice Caddie Swing Caddie SC4 PRO Launch Monitor',
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=SkyTrak+plus+golf+launch+monitor+simulator&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,995',
    label: 'See Current Price',
    imgSrc: '/images/products/skytrak-plus.svg',
    imgAlt: 'SkyTrak+ Home Golf Simulator Launch Monitor',
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────

  // Alignment sticks 2-pack
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks+2+pack+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/alignment-sticks.svg',
    imgAlt: 'Golf Alignment Sticks 2-Pack Training Aid',
  },

  // Groove cleaning brush
  'groove-cleaning-brush': {
    url: 'https://www.amazon.com/s?k=golf+groove+cleaning+brush&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/groove-cleaning-brush.svg',
    imgAlt: 'Golf Groove Cleaning Brush',
  },

  // Magnetic hat clip ball markers
  'magnetic-ball-markers': {
    url: 'https://www.amazon.com/s?k=magnetic+golf+hat+clip+ball+marker+3+pack&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/magnetic-ball-markers.svg',
    imgAlt: 'Magnetic Golf Hat Clip Ball Markers',
  },

  // Frogger Amphibian Golf Towel
  'frogger-amphibian-towel': {
    url: 'https://www.amazon.com/s?k=Frogger+Amphibian+golf+towel&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/frogger-amphibian-towel.svg',
    imgAlt: 'Frogger Amphibian Golf Towel',
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/putting-mirror.svg',
    imgAlt: 'Golf Putting Mirror Training Aid',
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/s?k=golf+impact+face+tape+stickers&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/impact-tape.svg',
    imgAlt: 'Golf Club Face Impact Tape',
  },

  // Eyeline Golf Edge Putting Cup
  'eyeline-putting-cup': {
    url: 'https://www.amazon.com/s?k=Eyeline+Golf+Edge+putting+cup&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35',
    label: 'See Current Price',
    imgSrc: '/images/products/eyeline-putting-cup.svg',
    imgAlt: 'Eyeline Golf Edge Putting Cup',
  },

  // Gustbuster Pro Series umbrella
  'gustbuster-umbrella': {
    url: 'https://www.amazon.com/s?k=Gustbuster+Pro+Series+golf+umbrella&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$45',
    label: 'See Current Price',
  },
  // ── PUTTERS ───────────────────────────────────────────────────────────────
  'odyssey-white-hot-og': {
    url: 'https://www.amazon.com/s?k=Odyssey+White+Hot+OG+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$199', label: 'See Current Price',
    imgSrc: '/images/products/odyssey-white-hot-og.svg',
    imgAlt: 'Odyssey White Hot OG Putter',
  },
  'scotty-cameron-phantom': {
    url: 'https://www.amazon.com/s?k=Scotty+Cameron+Phantom+X+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$399', label: 'See Current Price',
    imgSrc: '/images/products/scotty-cameron-phantom.svg',
    imgAlt: 'Scotty Cameron Phantom X Putter',
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/s?k=Cleveland+HB+Soft+Milled+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'See Current Price',
    imgSrc: '/images/products/cleveland-hb-soft-milled.svg',
    imgAlt: 'Cleveland HB Soft Milled Putter',
  },
  'taylormade-spider-tour': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+Tour+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$349', label: 'See Current Price',
    imgSrc: '/images/products/taylormade-spider-tour.svg',
    imgAlt: 'TaylorMade Spider Tour Putter',
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.amazon.com/s?k=Sun+Mountain+2.5+Plus+carry+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$249', label: 'See Current Price',
    imgSrc: '/images/products/sun-mountain-25-plus.svg',
    imgAlt: 'Sun Mountain 2.5+ Carry Golf Bag',
  },
  'titleist-players-4': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+4+StaDry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$279', label: 'See Current Price',
    imgSrc: '/images/products/titleist-players-4.svg',
    imgAlt: 'Titleist Players 4 StaDry Golf Bag',
  },
  'callaway-fairway-14': {
    url: 'https://www.amazon.com/s?k=Callaway+Fairway+14+cart+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$179', label: 'See Current Price',
    imgSrc: '/images/products/callaway-fairway-14.svg',
    imgAlt: 'Callaway Fairway 14 Cart Bag',
  },
  'callaway-chev-dry': {
    url: 'https://www.amazon.com/s?k=Callaway+Chev+Dry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'See Current Price',
    imgSrc: '/images/products/callaway-chev-dry.svg',
    imgAlt: 'Callaway Chev Dry Stand Bag',
  },

  // ── GOLF BALLS (additional) ───────────────────────────────────────────────
  'titleist-pro-v1x': {
    url: 'https://www.amazon.com/s?k=Titleist+Pro+V1x+golf+balls+2025&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$55/dozen', label: 'See Current Price',
    imgSrc: '/images/products/titleist-pro-v1x.svg',
    imgAlt: 'Titleist Pro V1x Golf Balls 2025',
  },

  // ── GOLF SHOES ────────────────────────────────────────────────────────────
  'footjoy-flex-xp': {
    url: 'https://www.amazon.com/s?k=FootJoy+Flex+XP+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$120', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-flex-xp.svg',
    imgAlt: 'FootJoy Flex XP Golf Shoes',
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ECCO+Biom+C4+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$220', label: 'See Current Price',
    imgSrc: '/images/products/ecco-biom-c4.svg',
    imgAlt: 'ECCO Biom C4 Golf Shoes',
  },
  'skechers-go-golf': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Pro+5+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$85', label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.svg',
    imgAlt: 'Skechers Go Golf Pro 5 Golf Shoes',
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=FootJoy+Tour+Alpha+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$200', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-tour-alpha.svg',
    imgAlt: 'FootJoy Tour Alpha Golf Shoes',
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
