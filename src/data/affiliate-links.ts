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
    heroVerdictLine: 'Our #1 pick after 40+ rounds — nothing locks the pin faster at any price.',
    heroWhoFor: 'Weekend golfers who want one rangefinder that does everything and lasts 5+ years.',
    url: 'https://bushnell.pxf.io/DWWLOa',
    golfGalaxyUrl: 'https://www.amazon.com/s?k=Bushnell+Tour+V6+Shift+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Bushnell',
    price: '~$329',
    label: 'Check Price at Bushnell →',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Precision*+Pro*+NX9*&ghref=2301%3A1333883',
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
    golfGalaxyUrl: 'https://www.amazon.com/s?k=Bushnell+Pro+XE+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Bushnell',
    price: '~$499',
    label: 'Check Price at Bushnell →',
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
    heroVerdictLine: 'The smartest watch we tested — Virtual Caddie suggestions actually helped our scores.',
    heroWhoFor: 'Golfers who want yardages, shot tracking, and smart club suggestions on their wrist.',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Shot*+Scope*+V5*&ghref=2301%3A1333883',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Bushnell*+Ion*+Elite*&ghref=2301%3A1333883',
    retailer: 'Bushnell',
    price: '~$149',
    label: 'Check Price at Bushnell →',
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
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Paradym%2520AI%2520Smoke%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Qi35%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCobra%2520Aerojet%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G430%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$449',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-max-driver.webp',
    imgAlt: 'Ping G430 Max Golf Driver',
  },

  // Cleveland Launcher XL2 Driver — budget forgiving driver
  'cleveland-launcher-xl2': {
    url: 'https://www.amazon.com/s?k=Cleveland+Launcher+XL2+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$349',
    label: 'See Current Price',
    imgSrc: '/images/products/cleveland-launcher-xl2.webp',
    imgAlt: 'Cleveland Launcher XL2 Golf Driver',
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────

  // Titleist Pro V1 (2025 gen, 25th anniversary) — ASIN B0BR2YF8T6 ✅ verified
  'titleist-pro-v1': {
    heroVerdictLine: 'Still the gold standard — the ball every other brand is trying to beat in 2026.',
    heroWhoFor: 'Golfers with 95+ mph swing speed who want tour-level spin and consistency.',
    asin: 'B0BR2YF8T6',
    url: 'https://www.amazon.com/dp/B0BR2YF8T6/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Pro%2520V1%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Chrome%2520Tour%25202026%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520TP5%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-tp5.webp',
    imgAlt: 'TaylorMade TP5 Golf Balls',
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/dp/B0CYDVBYQY/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Soft%2520Feel%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/s?k=Vice+Pro+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$33/dozen',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro.webp',
    imgAlt: 'Vice Pro Golf Balls',
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/dp/B0F2FSR89S/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Supersoft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Paradym%2520AI%2520Smoke%2520Max%2520Irons%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520T300%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520T100%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t100.webp',
    imgAlt: 'Titleist T100 Golf Irons',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G430+irons+set&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fping-g430-irons-22pngmg430gph4pwlirn%2F22pngmg430gph4pwlirn%3FenteredSearchTerm%3DPing%2520G430%2520Irons',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-irons.webp',
    imgAlt: 'Ping G430 Golf Irons',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DWilson%2520D9%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DWilson%2520Profile%2520SGI%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B07Q3B6FXR/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Strata%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0BN9Z6V3L/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.golfgalaxy.com/search/SearchDisplay?cjdata=MXxOfDB8WXww&searchTerm=taylormade%20rbz%20speedlite&storeId=10701&catalogId=10051&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&fromPage=Search&searchSource=Q&pageView=&beginIndex=0&DSGsearchType=Keyword&selectedStore=1521&camp=AFF:mediapartner:TEXT_link::7938781:Cubical%20Golfer&cjevent=2616ecc1480c11f183a200680a82b820',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DFootJoy%2520WeatherSof%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0BBGQ4KLT/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16/pair',
    label: 'See Current Price',
    imgSrc: '/images/products/footjoy-raingrip.webp',
    imgAlt: 'FootJoy RainGrip Golf Gloves 2-Pack',
  },

  // ── TECH / LAUNCH MONITORS / ANALYZERS ───────────────────────────────────

  // Arccos Caddie Smart Sensors (3rd Gen) — ASIN B0B5TW3HNG ✅ verified
  'arccos-caddie-sensors': {
    heroVerdictLine: 'The only gear upgrade that gets smarter the more you play — AI caddie is legit.',
    heroWhoFor: 'Data-driven golfers who want to know exactly where they lose strokes each round.',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Rapsodo*+MLM2PRO*&ghref=2301%3A1333883',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Voice*+Caddie*+SC4*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/swing-caddie-sc4-pro.webp',
    imgAlt: 'Voice Caddie Swing Caddie SC4 PRO Launch Monitor',
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=SkyTrak+plus+golf+launch+monitor+simulator&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=SkyTrak%2B*&ghref=2301%3A1333883',
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
    url: 'https://www.amazon.com/dp/B003FXMHX0/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/dp/B002UY0E7E/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/frogger-amphibian-towel.webp',
    imgAlt: 'Frogger Amphibian Golf Towel',
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/dp/B00N1MY7PE/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/putting-mirror.webp',
    imgAlt: 'Golf Putting Mirror Training Aid',
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/dp/B0040CNVYY/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/dp/B007S6EELQ/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/dp/B09BTCRLZH/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dodyssey%2520white%2520hot%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0CX4QKFRD/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DScotty%2520Cameron%2520Phantom%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$399', label: 'See Current Price',
    imgSrc: '/images/products/scotty-cameron-phantom.webp',
    imgAlt: 'Scotty Cameron Phantom X Putter',
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/dp/B0CRW9B66C/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCleveland%2520HB%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0CX4N55PH/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Spider%2520Tour%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$349', label: 'See Current Price',
    imgSrc: '/images/products/taylormade-spider-tour.webp',
    imgAlt: 'TaylorMade Spider Tour Putter',
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.amazon.com/dp/B0CSP7QLGR/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSun%2520Mountain%25202.5%2520%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Players%25204%2520StaDry%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Fairway%252014%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0BR2YZBK8/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Pro%2520V1x%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0CMLKNHCG/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DFootJoy%2520Flex%2520XP%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$120', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-flex-xp.webp',
    imgAlt: 'FootJoy Flex XP Golf Shoes',
  
    benefits: [
      'Waterproof protection with breathable mesh upper',
      'Lightweight cushioning ideal for 18-hole walks',
      'Versatile spikeless sole works on and off the course',
    ],
  },
  'skechers-go-golf': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Pro+5+golf+shoes&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSkechers%2520Go%2520Golf%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$85', label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Pro 5 Golf Shoes',
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=FootJoy+Tour+Alpha+golf+shoes&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Ffootjoy-mens-2022-tour-alpha-golf-shoesprevious-season-style-21fjymtrlph22whtbgsh%2F21fjymtrlph22whtbgsh%3FenteredSearchTerm%3DFootJoy%2520Tour%2520Alpha',
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
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Voice*+Caddie*+SC4*&ghref=2301%3A1333883',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Q-Star%2520Tour%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Chrome%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Tour%2520Speed%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Tour%2520Response%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DBridgestone%2520e12%2520Contact%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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

  // ── New: apartment simulator, launch monitors, rain gear, desk exercises ──
  'spornia-spg-net': {
    url: 'https://www.amazon.com/dp/B07Y7SS11K/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$189',
    label: 'See Current Price',
    imgSrc: '/images/products/spornia-spg-net.webp',
    imgAlt: 'Spornia SPG-7 Golf Practice Net',
    benefits: [
      'Auto-return system — no chasing balls in your apartment',
      'Sets up in 2 minutes, folds flat behind a couch',
      'Steel frame handles full driver swings at 120+ mph',
    ],
  },
  'fiberbuilt-studio-mat': {
    url: 'https://www.amazon.com/s?k=Fiberbuilt+golf+hitting+mat+studio&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'See Current Price',
    imgSrc: '/images/products/fiberbuilt-studio-mat.webp',
    imgAlt: 'Fiberbuilt Golf Studio Hitting Mat',
    benefits: [
      'Fiberglass grass mimics real fairway feel and lie',
      'Joint-friendly — reduces wrist and elbow fatigue vs rubber mats',
      'Compact 2×3 ft footprint fits any apartment corner',
    ],
  },
  'benq-short-throw-projector': {
    url: 'https://www.amazon.com/s?k=BenQ+short+throw+golf+simulator+projector&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$1,799',
    label: 'See Current Price',
    imgSrc: '/images/products/benq-tk850-projector.webp',
    imgAlt: 'BenQ Short-Throw Golf Simulator Projector',
    benefits: [
      'Short throw — projects 100-inch image from 4 feet away',
      'Full HD 1080p for crisp course graphics',
      'Low input lag for real-time ball flight display',
    ],
  },
  'diy-impact-screen-enclosure': {
    url: 'https://www.amazon.com/s?k=golf+simulator+impact+screen+enclosure+DIY&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'See Current Price',
    imgSrc: '/images/products/diy-impact-screen-enclosure.webp',
    imgAlt: 'DIY Golf Simulator Impact Screen Enclosure',
    benefits: [
      'Impact screen rated for 250+ mph ball speeds',
      'PVC frame assembles without tools in 30 minutes',
      'Fits ceilings as low as 8 feet for apartment use',
    ],
  },
  'garmin-approach-r50': {
    url: 'https://www.amazon.com/s?k=Garmin+Approach+R50+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-r50.webp',
    imgAlt: 'Garmin Approach R50 launch monitor',
    benefits: [
      'Dual radar for improved indoor accuracy over R10',
      'Free Garmin Golf app — no subscription required',
      'E6 Connect and Home Tee Hero simulator compatible',
    ],
  },
  'square-golf-launch-monitor': {
    url: 'https://www.amazon.com/s?k=Square+Golf+launch+monitor&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/square-golf-launch-monitor.webp',
    imgAlt: 'Square Golf Launch Monitor',
    benefits: [
      'Camera-based tracking optimized for indoor use',
      'No subscription — free app with full feature set',
      'Compact enough for any apartment setup',
    ],
  },
  'zero-restriction-rain-suit': {
    url: 'https://www.amazon.com/s?k=Zero+Restriction+golf+rain+suit+jacket&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'See Current Price',
    imgSrc: '/images/products/zero-restriction-rain-suit.webp',
    imgAlt: 'Zero Restriction Golf Rain Suit',
    benefits: [
      'Tour-proven waterproof protection in driving rain',
      'Stretch fabric allows full swing without restriction',
      'Lightweight enough to keep in your bag year-round',
    ],
  },
  'resistance-bands-golf': {
    url: 'https://www.amazon.com/dp/B01AVDVHTI/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Current Price',
    imgSrc: '/images/products/resistance-bands-golf.webp',
    imgAlt: 'Golf Training Resistance Bands',
    benefits: [
      'Builds rotational power for faster swing speed',
      'Portable — fits in a desk drawer for office use',
      'Progressive resistance levels for all fitness levels',
    ],
  },

  // ── New: gift guides + junior golf ────────────────────────────────────────
  'callaway-xj-junior-set': {
    url: 'https://www.amazon.com/s?k=Callaway+XJ+junior+golf+club+set&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520XJ%2520Junior%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$250',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-xj-junior-set.webp',
    imgAlt: 'Callaway XJ junior golf club set',
    benefits: [
      'Height-based sizing — 3 levels from ages 4-12',
      'Lightweight graphite shafts for easy swings',
      'Includes driver, irons, putter, and stand bag',
    ],
  },
  'us-kids-tour-series': {
    url: 'https://www.amazon.com/s?k=US+Kids+Golf+Tour+Series+junior+set&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DUS%2520Kids%2520Tour%2520Series%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$350',
    label: 'See Current Price',
    imgSrc: '/images/products/us-kids-tour-series.webp',
    imgAlt: 'US Kids Tour Series Junior Golf Set',
    benefits: [
      'Frequency-matched and spined shafts for consistency',
      'Available in 10+ height-based sizes',
      'Steel and graphite options for serious juniors',
    ],
  },
  'taylormade-team-tm-junior': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Team+TM+junior+golf+set&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.golfgalaxy.com/search/SearchDisplay?cjdata=MXxOfDB8WXww&searchTerm=TaylorMade%20Team%20TM%20Junior&storeId=10701&catalogId=10051&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&fromPage=Search&searchSource=Q&pageView=&beginIndex=0&DSGsearchType=Keyword&selectedStore=1521&camp=AFF:mediapartner:TEXT_link::7938781:Cubical%20Golfer&cjevent=757cd6a9481811f1800600840a82b839',
    retailer: 'Amazon',
    price: '~$200',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-team-tm-junior.webp',
    imgAlt: 'TaylorMade Team TM Junior Golf Set',
    benefits: [
      'Tour-inspired design kids love',
      'Forgiving clubs engineered for young swing speeds',
      'Dual-strap stand bag included',
    ],
  },
  'personalized-golf-balls': {
    url: 'https://www.amazon.com/s?k=personalized+golf+balls+custom&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$30',
    label: 'See Current Price',
    imgSrc: '/images/products/personalized-golf-balls.webp',
    imgAlt: 'Personalized Golf Balls',
    benefits: [
      'Custom text, initials, or graphics on each ball',
      'Available in premium (Pro V1) and budget options',
      'Ships in 3-5 business days',
    ],
  },
  'golf-towel-personalized': {
    url: 'https://www.amazon.com/s?k=personalized+golf+towel+embroidered&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$15',
    label: 'See Current Price',
    imgSrc: '/images/products/frogger-amphibian-towel.webp',
    imgAlt: 'Personalized Golf Towel',
    benefits: [
      'Custom embroidered name or initials',
      'Microfiber waffle-weave for club cleaning',
      'Carabiner clip attaches to any bag',
    ],
  },
  'women-golf-glove': {
    url: 'https://www.amazon.com/s?k=womens+golf+glove+leather&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/women-golf-glove.webp',
    imgAlt: 'Women Golf Glove',
    benefits: [
      'Cabretta leather for soft feel and grip',
      'Women-specific sizing and fit',
      'Breathable back panel for hot rounds',
    ],
  },
  // ── New: 7 buying guide articles (putting, LH, slice aids, nets, shoes, slow swing, speed trainers) ──
  'putt-a-bout-putting-green': {
    url: 'https://www.amazon.com/dp/B0002GOV9S/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$45',
    label: 'See Current Price',
    imgSrc: '/images/products/putt-a-bout-putting-green.webp',
    imgAlt: 'Putt-A-Bout Par 1 Indoor Putting Green',
    benefits: ['9-foot roll with ball return for repetitive practice', 'Non-skid rubber backing on any floor', 'Folds flat for storage under a desk'],
  },
  'sklz-accelerator-putting-mat': {
    url: 'https://www.amazon.com/dp/B002AOLRHC/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40',
    label: 'See Current Price',
    imgSrc: '/images/products/sklz-accelerator-putting-mat.webp',
    imgAlt: 'SKLZ Accelerator Pro Putting Mat with Ball Return',
    benefits: ['Ball return chute — no bending to retrieve', 'Alignment guides printed on surface', 'Compact 7-foot length fits most offices'],
  },
  'birdieball-putting-green': {
    url: 'https://www.amazon.com/s?k=BirdieBall+putting+green&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/birdieball-putting-green.webp',
    imgAlt: 'BirdieBall putting green',
    benefits: ['True-roll surface mimics real green speeds', 'Adjustable break with foam wedges', 'Available in sizes from 4x12 to 4x18 ft'],
  },
  'wellputt-mat': {
    url: 'https://www.amazon.com/s?k=Wellputt+putting+mat&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wellputt-mat.webp',
    imgAlt: 'Wellputt Premium Putting Mat',
    benefits: ['Tour-spec stimp speed surface', 'Printed training zones for distance control', 'Used by PGA Tour players'],
  },
  'lag-shot-7-iron': {
    url: 'https://www.amazon.com/dp/B07Z7LXHRT/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$119',
    label: 'See Current Price',
    imgSrc: '/images/products/lag-shot-7-iron.webp',
    imgAlt: 'Lag Shot 7-Iron Swing Trainer',
    benefits: ['Whippy shaft forces proper swing sequence', 'Eliminates casting and over-the-top move', 'Hit real balls — not just an air drill'],
  },
  'eyeline-speed-trap': {
    url: 'https://www.amazon.com/dp/B079FMMWGL/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40',
    label: 'See Current Price',
    imgSrc: '/images/products/eyeline-speed-trap.webp',
    imgAlt: 'EyeLine Golf Speed Trap 2.0',
    benefits: ['Physical gate prevents over-the-top swing path', 'Instant feedback on every swing', 'Used by PGA instructors worldwide'],
  },
  'superspeed-golf-set': {
    url: 'https://www.amazon.com/dp/B07PQSHFYN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$199',
    label: 'See Current Price',
    imgSrc: '/images/products/superspeed-golf-set.webp',
    imgAlt: 'SuperSpeed Golf Training System',
    benefits: ['3-club overspeed system proven to add 5-8% swing speed', 'Protocol takes 15 minutes 3x per week', 'Used by 700+ Tour pros'],
  },
  'the-stack-system': {
    url: 'https://www.amazon.com/s?k=The+Stack+swing+speed+trainer&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/the-stack-system.webp',
    imgAlt: 'The Stack Swing Speed Training System',
    benefits: ['AI-powered app adjusts weight for each session', 'Interchangeable weight system for progressive overload', 'Tracks speed gains over time'],
  },
  'rypstick-trainer': {
    url: 'https://www.amazon.com/s?k=Rypstick+swing+speed+trainer&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$180',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-swing-trainer.webp',
    imgAlt: 'Rypstick Swing Speed Trainer',
    benefits: ['Adjustable weight from 325g to 420g', 'Click-in weight system — no screwing', 'Compact enough for travel'],
  },
  'callaway-reva-driver': {
    url: 'https://www.amazon.com/s?k=Callaway+Reva+driver+womens&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Reva%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-reva-driver.webp',
    imgAlt: 'Callaway Reva driver',
    benefits: ['Ultralight design for sub-85 mph swing speeds', 'High launch with low spin for maximum carry', 'Available in left-hand'],
  },
  'ping-g-le3-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G+Le3+irons&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G%2520Le3%2520Irons%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$699',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g-le3-irons.webp',
    imgAlt: 'Ping G Le3 irons',
    benefits: ['Lightweight graphite shafts optimized for moderate speeds', 'Wide sole prevents fat shots', 'Available in women and senior flex'],
  },
  'skechers-go-golf-elite-5': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Elite+5&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fskechers-mens-go-golf-elite-vortex-golf-shoes-25skemgglfltvrtxcgsh%2F25skemgglfltvrtxcgsh%3FenteredSearchTerm%3DSkechers%2520Go%2520Golf%2520Elite%25205',
    retailer: 'Amazon',
    price: '~$110',
    label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Elite 5 Spikeless Shoes',
    benefits: ['Ultra Go cushioning for 18 holes of walking', 'H2GO waterproof shield', 'Arch Fit insole for all-day comfort'],
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ECCO+Biom+C4+golf+shoes&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DECCO%2520Biom%2520C4%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$200',
    label: 'See Current Price',
    imgSrc: '/images/products/ecco-biom-c4.webp',
    imgAlt: 'ECCO Biom C4 Spikeless Golf Shoes',
    benefits: ['GORE-TEX waterproof for any weather', 'BIOM Natural Motion for walking comfort', 'Premium leather lasts 3+ seasons'],
  },
  'nike-air-max-90-golf': {
    url: 'https://www.amazon.com/s?k=Nike+Air+Max+90+Golf&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DNike%2520Air%2520Max%252090%2520G%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$150',
    label: 'See Current Price',
    imgSrc: '/images/products/nike-air-max-90-golf.webp',
    imgAlt: 'Nike Air Max 90 G Spikeless Golf Shoes',
    benefits: ['Air Max cushioning — legendary comfort', 'Integrated traction pattern for wet and dry', 'Course-to-street versatility'],
  },
  // ── New: Cubicle-to-Course Playbook products ──────────────────────────
  'grip-trainer-steering-wheel': {
    url: 'https://www.amazon.com/s?k=golf+grip+trainer+pressure&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$15',
    label: 'See Current Price',
    imgSrc: '/images/products/golf-pride-grip-aid.webp',
    imgAlt: 'Golf Grip Pressure Trainer',
    benefits: [
      'Builds proper grip pressure muscle memory',
      'Small enough for a car cupholder or desk drawer',
      'Use at red lights, on calls, between meetings',
    ],
  },
  'theraband-flexbar': {
    url: 'https://www.amazon.com/s?k=TheraBand+FlexBar+golf+forearm&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/theraband-flexbar.webp',
    imgAlt: 'TheraFlex FlexBar hand exerciser',
    benefits: [
      'Prevents golfer elbow (medial epicondylitis)',
      'Warms up wrists and forearms in 2 minutes',
      'Fits in a golf bag side pocket or desk drawer',
    ],
  },
  // ── New: Putters for shaky hands / older golfers ──────────────────────
  'lab-golf-df3': {
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DLAB%2520Golf%2520DF3%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Golf Galaxy',
    price: '~$449',
    label: 'Check Price at Golf Galaxy →',
    imgSrc: '/images/products/lab-golf-df3.webp',
    imgAlt: 'L.A.B. Golf DF3 Zero-Torque Putter',
    benefits: [
      'Lie Angle Balance eliminates face rotation through the stroke',
      'Played by Rickie Fowler and J.J. Spaun (no formal endorsement)',
      'The putter that started the zero-torque movement',
    ],
  },
  'lab-golf-df3i': {
    url: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DLAB%2520Golf%2520DF3i%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Golf Galaxy',
    price: '~$469',
    label: 'Check Price at Golf Galaxy →',
    imgSrc: '/images/products/lab-golf-df3i.webp',
    imgAlt: 'LAB Golf DF3i putter',
    benefits: [
      'Stainless-steel insert for firmer feel vs standard DF3',
      'Same zero-torque face stability as the DF3',
      'Preferred by golfers who want a crisper impact sound',
    ],
  },
  'lab-golf-mezz1-max': {
    url: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DLAB%2520Golf%2520Mezz.1%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Golf Galaxy',
    price: '~$449',
    label: 'Check Price at Golf Galaxy →',
    imgSrc: '/images/products/lab-golf-mezz1-max.webp',
    imgAlt: 'LAB Golf Mezz.1 Max putter',
    benefits: [
      'Fang-style mallet — 20% larger head than MEZZ.1 for max stability',
      'Most popular zero-torque putter on Tour',
      'Played by Adam Scott, Will Zalatoris, Lucas Glover, Hyo Joo Kim',
    ],
  },
  'lab-golf-oz1': {
    url: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DLAB%2520Golf%2520OZ1%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Golf Galaxy',
    price: '~$449',
    label: 'Check Price at Golf Galaxy →',
    imgSrc: '/images/products/lab-golf-oz1.webp',
    imgAlt: 'LAB Golf OZ1 putter',
    benefits: [
      'Developed with Adam Scott — most conventional-looking LAB putter',
      'Choice of forward shaft lean or vertical shaft setup',
      'Zero-torque without the unconventional appearance',
    ],
  },
  'taylormade-spider-5k-zt': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+5K+ZT+zero+torque+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Spider%25205K%2520ZT%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-spider-5k-zt.webp',
    imgAlt: 'TaylorMade Spider 5K ZT putter',
    benefits: [
      'TaylorMade\'s first zero-torque putter — lighter than LAB models',
      'Familiar Spider shape with proven MOI stability',
      'Available through standard retail — easier to try before buying',
    ],
  },
  'pxg-allan-putter': {
    url: 'https://www.amazon.com/s?k=PXG+Allan+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$349',
    label: 'See Current Price',
    imgSrc: '/images/products/pxg-allan-putter.webp',
    imgAlt: 'PXG Allan putter',
    benefits: [
      'Smaller head than most zero-torque putters — less intimidating',
      'S-Hosel design for toe flow without torque',
      'Strong alternative for golfers who dislike center-shaft setups',
    ],
  },
  'odyssey-jailbird-zt': {
    url: 'https://www.amazon.com/s?k=Odyssey+Square+2+Square+Jailbird+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Tri-Beam%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$329',
    label: 'See Current Price',
    imgSrc: '/images/products/odyssey-jailbird-zt.webp',
    imgAlt: 'Odyssey Jailbird ZT putter',
    benefits: [
      'Most traditional-looking zero-torque putter available',
      'White Hot insert — the feel most golfers already know',
      '$329 — most affordable major-brand zero-torque option',
    ],
  },
  'lazrus-zero-torque': {
    url: 'https://www.amazon.com/s?k=Lazrus+zero+torque+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$207',
    label: 'See Current Price',
    imgSrc: '/images/products/lazrus-zero-torque.webp',
    imgAlt: 'Lazrus Zero Torque putter',
    benefits: [
      'USA-made zero-torque putter at $207 assembled ($127 head only)',
      'Budget entry into zero-torque putting',
      'Caveat: not customizable like LAB models',
    ],
  },
  'odyssey-tri-beam-arm-lock': {
    url: 'https://www.amazon.com/s?k=Odyssey+Tri+Beam+arm+lock+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Tri-Beam%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$329',
    label: 'See Current Price',
    imgSrc: '/images/products/odyssey-tri-beam-arm-lock.webp',
    imgAlt: 'Odyssey Tri-Beam arm lock putter',
    benefits: [
      'Arm-lock setup eliminates wrist breakdown completely',
      'Best for serious tremor or persistent yips',
      'Longer shaft locks against lead forearm for total stability',
    ],
  },
  'superstroke-traxion-grip': {
    url: 'https://www.amazon.com/s?k=SuperStroke+Traxion+putter+grip+3.0&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Current Price',
    imgSrc: '/images/products/superstroke-traxion-grip.webp',
    imgAlt: 'SuperStroke Traxion Tour putter grip',
    benefits: [
      'Oversized grip reduces wrist and hand action in the stroke',
      'No-taper profile keeps grip pressure even in both hands',
      '$25 + install — cheapest upgrade for shaky putting',
    ],
  },
  // ── New: Wedge cluster products ───────────────────────────────────────
  'vokey-sm10-52': {
    url: 'https://www.amazon.com/s?k=Titleist+Vokey+SM10+52+degree+wedge&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DVokey%2520SM10%252052%C2%B0%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$179',
    label: 'See Current Price',
    imgSrc: '/images/products/vokey-sm10.webp',
    imgAlt: 'Titleist Vokey SM10 52-Degree Wedge',
    benefits: [
      'Tour-proven design — most played wedge on Tour',
      'Spin Milled grooves for maximum spin on every shot',
      'Multiple grind options for any turf condition',
    ],
  },
  'cleveland-rtx6-52': {
    url: 'https://www.amazon.com/s?k=Cleveland+RTX+6+Zipcore+52+degree+wedge&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fcleveland-rtx-6-zipcore-wedge-22clemrtx6blckstnwdg%2F22clemrtx6blckstnwdg%3FenteredSearchTerm%3DCleveland%2520RTX-6%252052%C2%B0',
    retailer: 'Amazon',
    price: '~$169',
    label: 'See Current Price',
    imgSrc: '/images/products/cleveland-rtx6-52.webp',
    imgAlt: 'Cleveland RTX-6 52 degree wedge',
    benefits: [
      'ZipCore technology moves CG closer to face for better feel',
      'UltiZip grooves for spin on full and partial shots',
      '$169 — $10 cheaper than Vokey with comparable performance',
    ],
  },
  'callaway-jaws-raw-52': {
    url: 'https://www.amazon.com/s?k=Callaway+JAWS+RAW+52+degree+wedge&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Jaws%2520Raw%252052%C2%B0%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$169',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-jaws-raw-52.webp',
    imgAlt: 'Callaway Jaws Raw 52 degree wedge',
    benefits: [
      'Raw face rusts over time — increases spin as it ages',
      'Aggressive JAWS grooves for maximum short-game control',
      'Multiple sole grinds for versatility around greens',
    ],
  },
  'mizuno-t24-52': {
    url: 'https://www.amazon.com/s?k=Mizuno+T24+52+degree+wedge&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$180',
    label: 'See Current Price',
    imgSrc: '/images/products/mizuno-t24-52.webp',
    imgAlt: 'Mizuno T24 52 degree wedge',
    benefits: [
      'Grain Flow Forged — Mizuno\'s legendary feel',
      'HydroFlow Micro Grooves for wet-condition spin',
      'Clean, minimal aesthetic preferred by better players',
    ],
  },
  'maxfli-milled-52': {
    url: 'https://www.amazon.com/s?k=Maxfli+Milled+wedge+52+degree&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$80',
    label: 'See Current Price',
    imgSrc: '/images/products/maxfli-milled-52.webp',
    imgAlt: 'Maxfli Milled 52 degree wedge',
    benefits: [
      '$80 — less than half the price of Vokey/Cleveland',
      'CNC-milled face for consistent spin',
      'Best value wedge for weekend golfers on a budget',
    ],
  },
  // ── New: Golf grips for Page 7 ────────────────────────────────────────
  'golf-pride-mcc-plus4': {
    url: 'https://www.amazon.com/dp/B07BDPC5TN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$13/grip',
    label: 'See Current Price',
    imgSrc: '/images/products/golf-pride-mcc-plus4.webp',
    imgAlt: 'Golf Pride MCC Plus4 Golf Grip',
    benefits: [
      'Cord upper for traction + rubber lower for comfort',
      'Plus4 technology reduces grip pressure in lower hand',
      'Most popular all-purpose grip on Tour',
    ],
  },
  'golf-pride-tour-velvet-cord': {
    url: 'https://www.amazon.com/s?k=Golf+Pride+Tour+Velvet+Cord+grip&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$10/grip',
    label: 'See Current Price',
    imgSrc: '/images/products/golf-pride-tour-velvet-cord.webp',
    imgAlt: 'Golf Pride Tour Velvet Cord grip',
    benefits: [
      'Full-cord construction for maximum wet-weather traction',
      'Firmer feel preferred by better players',
      '$10/grip — best value cord grip available',
    ],
  },
  'lamkin-crossline-cord': {
    url: 'https://www.amazon.com/dp/B002M3XPKG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8/grip',
    label: 'See Current Price',
    imgSrc: '/images/products/lamkin-crossline-cord.webp',
    imgAlt: 'Lamkin Crossline Cord Golf Grip',
    benefits: [
      '$8/grip — cheapest quality cord grip available',
      'Classic crossline surface pattern for secure hold',
      'Best option for golfers with sweaty hands on a budget',
    ],
  },
  'winn-dri-tac': {
    url: 'https://www.amazon.com/dp/B001D5LFYQ/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8/grip',
    label: 'See Current Price',
    imgSrc: '/images/products/winn-dri-tac.webp',
    imgAlt: 'Winn Dri-Tac golf grip',
    benefits: [
      'Softest grip feel available — ideal for arthritis or joint pain',
      'Polymer material absorbs vibration on mis-hits',
      '$8/grip — affordable comfort upgrade',
    ],
  },
  'superstroke-s-tech': {
    url: 'https://www.amazon.com/s?k=SuperStroke+S-Tech+golf+grip&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$13/grip',
    label: 'See Current Price',
    imgSrc: '/images/products/superstroke-s-tech.webp',
    imgAlt: 'SuperStroke S-Tech putter grip',
    benefits: [
      'Oversized profile reduces hand tension and wrist action',
      'Cross-traction surface for wet and dry grip',
      'Best for golfers who want to quiet their hands through impact',
    ],
  },

  // ── Products added to fix placeholder images (replace URLs with ASINs) ─────
  'callaway-big-bertha': {
    url: 'https://www.amazon.com/s?k=Callaway+Big+Bertha+driver+2024&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Big%2520Bertha%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-big-bertha.webp',
    imgAlt: 'Callaway Big Bertha driver',
  },
  'cleveland-huntington-beach': {
    url: 'https://www.amazon.com/s?k=Cleveland+Huntington+Beach+Soft+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCleveland%2520Huntington%2520Beach%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$129',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cleveland-huntington-beach.webp',
    imgAlt: 'Cleveland Huntington Beach Soft putter',
  },
  'cobra-air-x': {
    url: 'https://www.amazon.com/s?k=Cobra+Air-X+driver+2024&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fcobra-air-x-12-piece-complete-set-23cbrmrx2stl12pcmset%2F23cbrmrx2stl12pcmset',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cobra-air-x.webp',
    imgAlt: 'Cobra Air-X driver',
  },
  'evnroll-er2': {
    url: 'https://www.amazon.com/s?k=Evnroll+ER2+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DEvnroll%2520ER2%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/evnroll-er2.webp',
    imgAlt: 'Evnroll ER2 blade putter',
  },
  'net-return-pro': {
    url: 'https://www.amazon.com/s?k=Net+Return+Pro+Series+golf+net&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$350',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/net-return-pro.webp',
    imgAlt: 'Net Return Pro Series golf practice net',
  },
  'odyssey-stroke-lab': {
    url: 'https://www.amazon.com/s?k=Odyssey+Stroke+Lab+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Stroke%2520Lab%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$199',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-stroke-lab.webp',
    imgAlt: 'Odyssey Stroke Lab putter',
  },
  'odyssey-tri-hot-5k': {
    url: 'https://www.amazon.com/s?k=Odyssey+Tri-Hot+5K+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Tri-Hot%25205K%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-tri-hot-5k.webp',
    imgAlt: 'Odyssey Tri-Hot 5K putter',
  },
  'odyssey-two-ball-eleven': {
    url: 'https://www.amazon.com/s?k=Odyssey+2-Ball+Eleven+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dodyssey%2520two%2520ball%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-two-ball-eleven.webp',
    imgAlt: 'Odyssey Two Ball Eleven putter',
  },
  'orange-whip-trainer': {
    url: 'https://www.amazon.com/dp/B009G1BWCE/?tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Orange*+Whip*+Trainer*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$109',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/orange-whip-trainer.webp',
    imgAlt: 'Orange Whip golf swing trainer',
  },
  'ping-g430-sft': {
    url: 'https://www.amazon.com/s?k=Ping+G430+SFT+driver&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G430%2520SFT%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/ping-g430-sft.webp',
    imgAlt: 'Ping G430 SFT draw-biased driver',
  },
  'ping-sigma-2': {
    url: 'https://www.amazon.com/s?k=Ping+Sigma+2+Anser+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/ping-sigma-2.webp',
    imgAlt: 'Ping Sigma 2 Anser blade putter',
  },
  'rukket-haack-net': {
    url: 'https://www.amazon.com/s?k=Rukket+HAACK+10x7+golf+net&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$130',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/rukket-haack-net.webp',
    imgAlt: 'Rukket HAACK 10x7 golf practice net',
  },
  'scotty-cameron-phantom-x': {
    url: 'https://www.amazon.com/s?k=Scotty+Cameron+Phantom+X+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DScotty%2520Cameron%2520Phantom%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/scotty-cameron-phantom-x.webp',
    imgAlt: 'Scotty Cameron Phantom X mallet putter',
  },
  'taylormade-spider-gt': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+GT+putter&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Spider%2520GT%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-spider-gt.webp',
    imgAlt: 'TaylorMade Spider GT mallet putter',
  },
  'taylormade-stealth-2-hd': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Stealth+2+HD+driver&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Stealth%25202%2520HD%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-stealth-2-hd.webp',
    imgAlt: 'TaylorMade Stealth 2 HD driver',
  },
  'tour-striker-smart-ball': {
    url: 'https://www.amazon.com/dp/B07JQ5XWCM/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$29',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/tour-striker-smart-ball.webp',
    imgAlt: 'Tour Striker Smart Ball training aid',
  },
  // ── Apps & Software ─────────────────────────────────────────────────────────
  'the-grint': {
    url: 'https://www.amazon.com/s?k=golf+GPS+app+accessory&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'Free / $9.99/mo Premium',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/the-grint.webp',
    imgAlt: 'The Grint golf GPS and handicap tracking app',
  },
  '18birdies': {
    url: 'https://www.amazon.com/s?k=golf+GPS+rangefinder+accessory&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'Free / $11.99/mo Premium',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/18birdies.webp',
    imgAlt: '18Birdies golf GPS and rangefinder app',
  },
  'golfshot': {
    url: 'https://www.amazon.com/s?k=golf+GPS+watch+accessories&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'Free / $39.99/yr Pro',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/golfshot.webp',
    imgAlt: 'Golfshot golf GPS app',
  },
  'swing-ai': {
    url: 'https://www.amazon.com/s?k=golf+swing+analyzer+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'Free / Premium',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/swing-ai.webp',
    imgAlt: 'AI golf swing analysis app',
  },

  // ── Golf Balls (compression chart) ──────────────────────────────────────────
  'taylormade-noodle': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Noodle+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-noodle.webp',
    imgAlt: 'TaylorMade Noodle golf balls',
  },
  'wilson-duo-soft-plus': {
    url: 'https://www.amazon.com/s?k=Wilson+DUO+Soft%2B+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$23/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-duo-soft-plus.webp',
    imgAlt: 'Wilson DUO Soft+ golf balls',
  },
  'titleist-trufeel': {
    url: 'https://www.amazon.com/s?k=Titleist+TruFeel+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-trufeel.webp',
    imgAlt: 'Titleist TruFeel golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520TruFeel%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'taylormade-soft-response': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Soft+Response+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-soft-response.webp',
    imgAlt: 'TaylorMade Soft Response golf balls',
  },
  'vice-drive': {
    url: 'https://www.amazon.com/s?k=Vice+Drive+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$17/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-drive.webp',
    imgAlt: 'Vice Drive golf balls',
  },
  'vice-pro-soft': {
    url: 'https://www.amazon.com/s?k=Vice+Pro+Soft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$33/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro-soft.webp',
    imgAlt: 'Vice Pro Soft golf balls',
  },
  'titleist-tour-soft': {
    url: 'https://www.amazon.com/s?k=Titleist+Tour+Soft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-tour-soft.webp',
    imgAlt: 'Titleist Tour Soft golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Tour%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'titleist-velocity': {
    url: 'https://www.amazon.com/s?k=Titleist+Velocity+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$30/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-velocity.webp',
    imgAlt: 'Titleist Velocity golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Velocity%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'callaway-warbird': {
    url: 'https://www.amazon.com/s?k=Callaway+Warbird+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-warbird.webp',
    imgAlt: 'Callaway Warbird golf balls',
  },
  'bridgestone-tour-b-rx': {
    url: 'https://www.amazon.com/s?k=Bridgestone+Tour+B+RX+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-rx.webp',
    imgAlt: 'Bridgestone Tour B RX golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DBridgestone%2520Tour%2520B%2520RX%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'kirkland-signature': {
    url: 'https://www.amazon.com/s?k=Kirkland+Signature+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$28/2dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/kirkland-signature.webp',
    imgAlt: 'Kirkland Signature golf balls',
  },
  'titleist-avx': {
    url: 'https://www.amazon.com/s?k=Titleist+AVX+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-avx.webp',
    imgAlt: 'Titleist AVX golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520AVX%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'wilson-staff-model': {
    url: 'https://www.amazon.com/s?k=Wilson+Staff+Model+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-staff-model.webp',
    imgAlt: 'Wilson Staff Model golf balls',
  },
  'srixon-z-star': {
    url: 'https://www.amazon.com/s?k=Srixon+Z-Star+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$42/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/srixon-z-star.webp',
    imgAlt: 'Srixon Z-Star golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Z-Star%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'bridgestone-tour-b-xs': {
    url: 'https://www.amazon.com/s?k=Bridgestone+Tour+B+XS+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-xs.webp',
    imgAlt: 'Bridgestone Tour B XS golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DBridgestone%2520Tour%2520B%2520XS%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'vice-pro-plus': {
    url: 'https://www.amazon.com/s?k=Vice+Pro+Plus+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$33/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro-plus.webp',
    imgAlt: 'Vice Pro Plus golf balls',
  },
  'taylormade-tp5x': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5x+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-tp5x.webp',
    imgAlt: 'TaylorMade TP5x golf balls',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520TP5x%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'bridgestone-tour-b-x': {
    url: 'https://www.amazon.com/s?k=Bridgestone+Tour+B+X+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-x.webp',
    imgAlt: 'Bridgestone Tour B X golf balls',
  },
  'srixon-z-star-xv': {
    url: 'https://www.amazon.com/s?k=Srixon+Z-Star+XV+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$42/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/srixon-z-star-xv.webp',
    imgAlt: 'Srixon Z-Star XV golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Z-Star%2520XV%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'maxfli-tour-x': {
    url: 'https://www.amazon.com/s?k=Maxfli+Tour+X+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/maxfli-tour-x.webp',
    imgAlt: 'Maxfli Tour X golf balls',
  },
  'wilson-chaos': {
    url: 'https://www.amazon.com/s?k=Wilson+Chaos+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-chaos.webp',
    imgAlt: 'Wilson Chaos golf balls',
  },
  'pinnacle-rush': {
    url: 'https://www.amazon.com/s?k=Pinnacle+Rush+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/pinnacle-rush.webp',
    imgAlt: 'Pinnacle Rush golf balls',
  },

  // ── Budget Putters ──────────────────────────────────────────────────────────
  'odyssey-dfx': {
    url: 'https://www.amazon.com/s?k=Odyssey+DFX+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$129',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-dfx.webp',
    imgAlt: 'Odyssey DFX mallet putter',
  },
  'pinemeadow-pgx': {
    url: 'https://www.amazon.com/s?k=Pinemeadow+PGX+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/pinemeadow-pgx.webp',
    imgAlt: 'Pinemeadow PGX mallet putter',
  },
  'wilson-staff-infinite': {
    url: 'https://www.amazon.com/s?k=Wilson+Staff+Infinite+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-staff-infinite.webp',
    imgAlt: 'Wilson Staff Infinite blade putter',
  },

  'flightscope-mevo-plus': {
    url: 'https://www.amazon.com/s?k=Flightscope+Mevo+Plus&tag=cubicalgolfer-20',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Flightscope*+Mevo%2B*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$2,499',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/flightscope-mevo-plus.webp',
    imgAlt: 'Flightscope Mevo+ launch monitor',
  },

  'garmin-approach-s12': {
    url: 'https://www.amazon.com/s?k=Garmin+Approach+S12+golf+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/garmin-approach-s12.webp',
    imgAlt: 'Garmin Approach S12 GPS golf watch',
  },

  'sklz-accelerator-pro': {
    url: 'https://www.amazon.com/s?k=SKLZ+Accelerator+Pro+putting+mat&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$40',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/sklz-accelerator-pro.webp',
    imgAlt: 'SKLZ Accelerator Pro putting mat',
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
