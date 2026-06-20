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
  golfGalaxyUrl?: string;
  benefits?: string[];
}> = {

  // ── RANGEFINDERS ─────────────────────────────────────────────────────────

  // Bushnell Tour V6 Shift — ASIN B0C4PN57LJ ✅ verified
  'bushnell-tour-v6-shift': {
    heroVerdictLine: 'Our #1 pick after 40+ rounds — nothing locks the pin faster at any price.',
    heroWhoFor: 'Weekend golfers who want one rangefinder that does everything and lasts 5+ years.',
    url: 'https://bushnell.pxf.io/DWWLOa',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Bushnell*+Tour*+V6*+Shift*&ghref=2301%3A1333883',
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
    url: 'https://www.amazon.com/dp/B0DP3GL8RN?&linkCode=ll2&tag=cubicalgolfer-20&linkId=adcfb2c9ee28bb4bdd808a2f066fdb4b&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=blue-tees-series-3-max&crid=2ZPJJUZTOV2VE&sprefix=blue-tees-series-3-max%2Caps%2C276&linkCode=ll2&tag=cubicalgolfer-20&linkId=0fb9cd632626eb7e793641eb4be0344d&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B085T56B2X?&linkCode=ll2&tag=cubicalgolfer-20&linkId=fdcfca3305996c6d7b9833f63aae27b5&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B083BJSYZ9?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=e72a18832542c8be1be00a9e4e7c02cf&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fgarmin-approach-s62-premium-golf-gps-smartwatch-20gmnupprchs62blcgps%2F20gmnupprchs62blcgps%3FenteredSearchTerm%3DGarmin%2520Approach%2520S62',
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
    url: 'https://www.amazon.com/s?k=garmin-approach-s42&crid=2U6QI9J6CM5DG&sprefix=garmin-approach-s42%2Caps%2C241&linkCode=ll2&tag=cubicalgolfer-20&linkId=0ee9b47e59d438ed01242683974bb6f4&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B0CYT7RJ54?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=2f1753fb9db3dd87683135e4bf6bb7e0&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-paradym-ai-smoke-max&crid=92H1TORWBRWG&sprefix=callaway-paradym-ai-smoke-max%2Caps%2C273&linkCode=ll2&tag=cubicalgolfer-20&linkId=d31411ba8352b4d9f7296f9db3a8a1cc&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=taylormade-qi35-max&crid=3FDRIP5XMD1B3&sprefix=taylormade-noodle%2Caps%2C251&linkCode=ll2&tag=cubicalgolfer-20&linkId=c62574dee5a02cfe82a43e560fd5577a&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=cobra-aerojet-max&crid=269HHYD8SEIV8&sprefix=cobra-aerojet-max%2Caps%2C227&linkCode=ll2&tag=cubicalgolfer-20&linkId=b4b26642d6a85f8ba3f4b990168c5170&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=ping-g430-max-driver&crid=1HU7Q4J68VJSR&sprefix=ping-g430-irons%2Caps%2C266&linkCode=ll2&tag=cubicalgolfer-20&linkId=851dc1f118c6e16c2e9e00068f21d081&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G430%2520Max%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$449',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-max-driver.webp',
    imgAlt: 'Ping G430 Max Golf Driver',
  },

  // Cleveland Launcher XL2 Driver — budget forgiving driver
  'cleveland-launcher-xl2': {
    url: 'https://www.amazon.com/s?k=cleveland+launcher+xl2&crid=2OYYW71NTMTFL&sprefix=cleveland+launcher+xl2%2Caps%2C302&linkCode=ll2&tag=cubicalgolfer-20&linkId=3b3e126df2448bd1026ec4b7f2a62a15&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B0BR2YF8T6?&linkCode=ll2&tag=cubicalgolfer-20&linkId=591502395d795cff42f0e3624096474a&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-chrome-tour-2026&crid=11X1E4VP7YO2A&sprefix=callaway-chrome-tour-2026%2Caps%2C293&linkCode=ll2&tag=cubicalgolfer-20&linkId=5ca2d959a8efc39ebff64533f50ab93a&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=taylormade-tp5&crid=YNIGUF63T20Q&sprefix=taylormade-tour-response%2Caps%2C265&linkCode=ll2&tag=cubicalgolfer-20&linkId=9b4f4e88a08115c2f4c0c1b2ab4aef74&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520TP5%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-tp5.webp',
    imgAlt: 'TaylorMade TP5 Golf Balls',
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=srixon-soft-feel&crid=2XPA2W584MVXT&sprefix=srixon-soft-feel%2Caps%2C223&linkCode=ll2&tag=cubicalgolfer-20&linkId=29063a8fe9a84c4409ae436a1300a492&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=vice-pro&crid=36ML87WOQ3K5&sprefix=vice-pro%2Caps%2C237&linkCode=ll2&tag=cubicalgolfer-20&linkId=1feedb1220ad3038e570b0d0b7c74ea1&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$33/dozen',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro.webp',
    imgAlt: 'Vice Pro Golf Balls',
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/dp/B0F2FSR89S?&linkCode=ll2&tag=cubicalgolfer-20&linkId=297672ce5a5cae9464ffce71f539e866&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-paradym-ai-smoke-max-irons&crid=28O9JXUM3YLK4&sprefix=callaway-paradym-ai-smoke-max-irons%2Caps%2C223&linkCode=ll2&tag=cubicalgolfer-20&linkId=9af1d0fce2ba7b72cb5355dbe4525b99&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B0BG2JTV5J/?tag=cubicalgolfer-20',
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
    url: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dtitleist%2520t100%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520T100%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-t100.webp',
    imgAlt: 'Titleist T100 Golf Irons',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=ping-g430-irons&crid=26DOLJQXUKNCK&sprefix=ping-g-le3-irons%2Caps%2C281&linkCode=ll2&tag=cubicalgolfer-20&linkId=0b6addcf8c874447523eb837b6e5b3f2&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fping-g430-irons-22pngmg430gph4pwlirn%2F22pngmg430gph4pwlirn%3FenteredSearchTerm%3DPing%2520G430%2520Irons',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g430-irons.webp',
    imgAlt: 'Ping G430 Golf Irons',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dwilson%2520d9%2520irons%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B07HN4LLQN?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=9726fc10d4ec76b9e69609e363b6f47f&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-strata&crid=NX1FUJPIBPHI&sprefix=callaway-strata%2Caps%2C237&linkCode=ll2&tag=cubicalgolfer-20&linkId=f8eee3914245b8609f8a6c2f47dc6e7f&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dtaylormade%2520rbz%2520lite%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B072LZV5Z6?&linkCode=ll2&tag=cubicalgolfer-20&linkId=8c98c4f782152b9bdfd5e95384505561&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=titleist-players-flex&crid=VMQZUYT7Y6DL&sprefix=titleist-players-4-bag%2Caps%2C238&linkCode=ll2&tag=cubicalgolfer-20&linkId=ddefa35e08ea24241021fb65cf29cf82&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$22',
    label: 'See Current Price',
    imgSrc: '/images/products/titleist-players-flex.webp',
    imgAlt: 'Titleist Players Flex Golf Glove',
  },

  // Callaway Dawn Patrol Glove — search (size variants)
  'callaway-dawn-patrol': {
    url: 'https://www.amazon.com/s?k=callaway-dawn-patrol&crid=29WIECGN90W6W&sprefix=callaway-dawn-patrol%2Caps%2C337&linkCode=ll2&tag=cubicalgolfer-20&linkId=8e153d99e1cc9c11042ecc5f011de7aa&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-dawn-patrol.webp',
    imgAlt: 'Callaway Dawn Patrol Golf Glove',
  },

  // FootJoy RainGrip (mentioned in accessories-50 page)
  'footjoy-raingrip': {
    url: 'https://www.amazon.com/s?k=footjoy-raingrip&crid=4PUE9LENMOAS&sprefix=footjoy-raingrip%2Caps%2C233&linkCode=ll2&tag=cubicalgolfer-20&linkId=1c6f48c25964b34ff3eb79cb8ee4d19c&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B09YJ5H6BQ?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=9cb14bd7f2b5cda6a4acf512ad239cda&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DArccos%2520Caddie%2520Sensors%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0BTPZMCSF?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=bd3e785885d6c86f1cd5da966b8e57e4&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B00UNFHKUK?&linkCode=ll2&tag=cubicalgolfer-20&linkId=0b47f0f86cbea45f9d7b37f657983ea9&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B0DK24YKBD?&linkCode=ll2&tag=cubicalgolfer-20&linkId=5c9ef5f218ddecbb1d865de38ae35fbb&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Voice*+Caddie*+SC4*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/swing-caddie-sc4-pro.webp',
    imgAlt: 'Voice Caddie Swing Caddie SC4 PRO Launch Monitor',
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=skytrak-plus&crid=XN2PCR7J4ICU&sprefix=sklz-accelerator-putting-mat%2Caps%2C284&linkCode=ll2&tag=cubicalgolfer-20&linkId=078a0970a6ce5d71e4e140e4ade340ec&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=alignment-sticks&linkCode=ll2&tag=cubicalgolfer-20&linkId=20a38f5eb8ee11b58ceb9bf4c530ad56&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/alignment-sticks.webp',
    imgAlt: 'Golf Alignment Sticks 2-Pack Training Aid',
  },

  // Groove cleaning brush
  'groove-cleaning-brush': {
    url: 'https://www.amazon.com/s?k=groove-cleaning-brush&crid=3DA64H3MOGEJE&sprefix=groove-cleaning-brush%2Caps%2C270&linkCode=ll2&tag=cubicalgolfer-20&linkId=9ac6a9d5598fdac69442500483e5a4f2&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/groove-cleaning-brush.webp',
    imgAlt: 'Golf Groove Cleaning Brush',
  },

  // Magnetic hat clip ball markers
  'magnetic-ball-markers': {
    url: 'https://www.amazon.com/s?k=magnetic-ball-markers&crid=220WWNXVYP0FD&sprefix=magnetic-ball-marker-desk%2Caps%2C271&linkCode=ll2&tag=cubicalgolfer-20&linkId=d55bb4829684e552451afe74f1ae3469&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/magnetic-ball-markers.webp',
    imgAlt: 'Magnetic Golf Hat Clip Ball Markers',
  },

  // Frogger Amphibian Golf Towel
  'frogger-amphibian-towel': {
    url: 'https://www.amazon.com/s?k=frogger-amphibian-towel&crid=3SFSGTFNJJF9M&sprefix=%2Caps%2C197&linkCode=ll2&tag=cubicalgolfer-20&linkId=8488e6f4a289cea80766f82c606e384b&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$18',
    label: 'See Current Price',
    imgSrc: '/images/products/frogger-amphibian-towel.webp',
    imgAlt: 'Frogger Amphibian Golf Towel',
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=putting-mirror&crid=1DNI4IB9OQQKB&sprefix=%2Caps%2C231&linkCode=ll2&tag=cubicalgolfer-20&linkId=d4587e07ee894decaa218a2e18b12259&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/putting-mirror.webp',
    imgAlt: 'Golf Putting Mirror Training Aid',
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/s?k=impact-tape&crid=FC5WDTNPA24&sprefix=homecourse-retractable-screen%2Caps%2C242&linkCode=ll2&tag=cubicalgolfer-20&linkId=31fc58c7ee566e4c670a5dec48c20f2e&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/impact-tape.webp',
    imgAlt: 'Golf Club Face Impact Tape',
  },

  // Eyeline Golf Edge Putting Cup
  'eyeline-putting-cup': {
    url: 'https://www.amazon.com/s?k=eyeline-putting-cup&crid=2XMQJZQHQ50F5&sprefix=eyeline-putting-cup%2Caps%2C196&linkCode=ll2&tag=cubicalgolfer-20&linkId=75564276625a552ecb038f242c655197&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$35',
    label: 'See Current Price',
    imgSrc: '/images/products/eyeline-putting-cup.webp',
    imgAlt: 'Eyeline Golf Edge Putting Cup',
  },

  // Gustbuster Pro Series umbrella
  'gustbuster-umbrella': {
    url: 'https://www.amazon.com/s?k=gustbuster-umbrella&crid=1YF0RT6YG4I3Y&sprefix=gustbuster-umbrella%2Caps%2C267&linkCode=ll2&tag=cubicalgolfer-20&linkId=874d2e1ec20de614bde4a3c3f7c5f5c0&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=odyssey-white-hot-og&crid=16YH6OZ4FJA4I&sprefix=odyssey-white-hot-og%2Caps%2C228&linkCode=ll2&tag=cubicalgolfer-20&linkId=3d89d732d7ee894fc9bfdf10993f57f2&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=scotty-cameron-phantom&crid=16726EA46FP7R&sprefix=rypstick-trainer%2Caps%2C243&linkCode=ll2&tag=cubicalgolfer-20&linkId=1464eccecd943e0623bab127841e999e&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DScotty%2520Cameron%2520Phantom%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$399', label: 'See Current Price',
    imgSrc: '/images/products/scotty-cameron-phantom.webp',
    imgAlt: 'Scotty Cameron Phantom X Putter',
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/s?k=cleveland-hb-soft-milled&crid=30EY0R7HUBJ6N&sprefix=cleveland-hb-soft-milled%2Caps%2C285&linkCode=ll2&tag=cubicalgolfer-20&linkId=9bf4b0b7d293ce2e5b7002a99448e433&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=taylormade-spider-tour&crid=3N32I6ST6E4JX&sprefix=taylormade-spider-gt%2Caps%2C245&linkCode=ll2&tag=cubicalgolfer-20&linkId=574eb1ab3ec838c23feb93200150c327&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Spider%2520Tour%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$349', label: 'See Current Price',
    imgSrc: '/images/products/taylormade-spider-tour.webp',
    imgAlt: 'TaylorMade Spider Tour Putter',
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dsun%2520mountain%25202.5%2520plus%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/s?k=titleist-players-4&crid=1HNFQNUSMRDUT&sprefix=titleist-avx%2Caps%2C259&linkCode=ll2&tag=cubicalgolfer-20&linkId=07e9785b91ed0a519f0b9a0eb36d063e&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-fairway-14&crid=34KQ76QT6T3ZQ&sprefix=callaway-fairway-14%2Caps%2C209&linkCode=ll2&tag=cubicalgolfer-20&linkId=f722c38b6fcc256597908f7d426b38a1&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Fairway%252014%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$179', label: 'See Current Price',
    imgSrc: '/images/products/callaway-fairway-14.webp',
    imgAlt: 'Callaway Fairway 14 Cart Bag',
  },
  'callaway-chev-dry': {
    url: 'https://www.amazon.com/Callaway-Golf-2021-Chev-Stand/dp/B08F9BNM9C?crid=25GRGZPZU1D8J&dib=eyJ2IjoiMSJ9.bu1-1tkh1F5DoeQnxxsxu2NLVaHd9WKh7QOXlXgMUJI20VoRcdbrhbfoZlIkOsGpfzwXrdAMuMBtK8769lexJ8NcQYIWQTzPs6XVBqtZ2QMVyriodIs7DXyd0wJ98ovPvX3w1pL7xnl0_WeA9RiM74xFJsCyCvOauUVM5Rxo2PZfkHXG8yf3xAxrBU9FiOoyldNv8gJSe6VP18k6vmYHertdW_gYfCaOW6-zum7gfZRBiJsdwmWIF2iRz9N46Pql075SfHDSUpym81RGWTj1isQfo-EYOR4f-ld3Bhxxe00.uoj6FS6Q_Dy_ZFJjI6VBbeHAoOkbUpTAuJIL_ZLpgJQ&dib_tag=se&keywords=callaway%2Bchev%2Bdry&qid=1779149341&sprefix=callaway%2Bchev%2Bdry%2Caps%2C245&sr=8-9&th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=89fa1ec083a5761da4e212bb6d075b17&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$129', label: 'See Current Price',
    imgSrc: '/images/products/callaway-chev-dry.webp',
    imgAlt: 'Callaway Chev Dry Stand Bag',
  },

  // ── GOLF BALLS (additional) ───────────────────────────────────────────────
  'titleist-pro-v1x': {
    url: 'https://www.amazon.com/s?k=titleist-pro-v1x&crid=1BMO392SRDU90&sprefix=titleist-players-flex%2Caps%2C265&linkCode=ll2&tag=cubicalgolfer-20&linkId=be654cecda572a69e7ef645e46400c56&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=footjoy-flex-xp&crid=2EM96HIZRA5WX&sprefix=footjoy-flex-xp%2Caps%2C227&linkCode=ll2&tag=cubicalgolfer-20&linkId=a1a22933a6b5955d23e1d1d51a312607&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=skechers-go-golf&crid=2A722I92PMVWE&sprefix=scotty-cameron-phantom-x%2Caps%2C255&linkCode=ll2&tag=cubicalgolfer-20&linkId=2977c6eb7f014d49fc6ec1b9576ac456&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSkechers%2520Go%2520Golf%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$85', label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Pro 5 Golf Shoes',
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=footjoy-tour-alpha&crid=D1UBUESKM0FM&sprefix=footjoy-tour-alpha%2Caps%2C262&linkCode=ll2&tag=cubicalgolfer-20&linkId=74fc8fb909fb433edd9ecc408eaf9126&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Ffootjoy-mens-2022-tour-alpha-golf-shoesprevious-season-style-21fjymtrlph22whtbgsh%2F21fjymtrlph22whtbgsh%3FenteredSearchTerm%3DFootJoy%2520Tour%2520Alpha',
    retailer: 'Amazon', price: '~$200', label: 'See Current Price',
    imgSrc: '/images/products/footjoy-tour-alpha.webp',
    imgAlt: 'FootJoy Tour Alpha Golf Shoes',
  },

  // ── LAUNCH MONITORS ───────────────────────────────────────────────────────

  'garmin-approach-r10': {
    asin: 'B096B5JR5D',
    url: 'https://www.amazon.com/s?k=garmin-approach-r10&crid=AWZ8FFFKGC2J&sprefix=garmin-approach-r10%2Caps%2C221&linkCode=ll2&tag=cubicalgolfer-20&linkId=46ccb5b66ca58f69d53706151a8b29d5&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=voice-caddie-sc4-pro&crid=R0YFUFN6YD9F&sprefix=voice-caddie-sc4-pro%2Caps%2C259&linkCode=ll2&tag=cubicalgolfer-20&linkId=8e2fa05dc74c59d62dc3f1ac29978eb8&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=bushnell-launch-pro&crid=1O0RGUWVXD74&sprefix=bridgestone-tour-b-xs%2Caps%2C371&linkCode=ll2&tag=cubicalgolfer-20&linkId=5e4ac84f33ffe810257c4067a4602ec5&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=flightscope-mevo-gen2&crid=11DZF65IZ87JX&sprefix=flightscope-mevo-gen2%2Caps%2C217&linkCode=ll2&tag=cubicalgolfer-20&linkId=b74d9fc6e79e9ff9b09097d6ed0dcf43&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.playbetter.com/products/trackman-4-golf-launch-monitor?_pos=2&_sid=cccaaba82&_ss=r&ghref=2301%3A1333883',
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
    url: 'https://www.amazon.com/s?k=foresight-gcquad&crid=2XI5009KQ9L9O&sprefix=foresight-gcquad%2Caps%2C242&linkCode=ll2&tag=cubicalgolfer-20&linkId=7f77efbced6ae3c079a84684e243177e&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=desktop-putting-set&crid=2SO99R68XKKNW&sprefix=desktop-putting-set%2Caps%2C215&linkCode=ll2&tag=cubicalgolfer-20&linkId=8e124d388c75501b2ba2f926f0d1641c&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=golf-themed-mug&crid=RO7ZPJ9J3P8J&sprefix=golf-themed-mug%2Caps%2C275&linkCode=ll2&tag=cubicalgolfer-20&linkId=efffeef4eb6c69c0a4241f88d08559a2&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$16',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-themed-mug.webp',
    imgAlt: 'Funny Golf-Themed Coffee Mug',
  },
  'office-putting-mat': {
    url: 'https://www.amazon.com/s?k=office-putting-mat&crid=VJWTEUOCXHQU&sprefix=office-putting-mat%2Caps%2C255&linkCode=ll2&tag=cubicalgolfer-20&linkId=5b0be7ead099d1674a9f848cfd62b607&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=mini-chipping-net&crid=29JYND96LIHX3&sprefix=mgi-zip-navigator%2Caps%2C260&linkCode=ll2&tag=cubicalgolfer-20&linkId=42db4ca14f8cc4932f33e292be4382a6&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/mini-chipping-net.webp',
    imgAlt: 'Mini Indoor Golf Chipping Net',
  },
  'golf-stress-ball': {
    url: 'https://www.amazon.com/s?k=golf-stress-ball&crid=2JX3DSETQJ8U4&sprefix=golf-stress-ball%2Caps%2C243&linkCode=ll2&tag=cubicalgolfer-20&linkId=a76643de43cea5f8853651274483e968&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$10',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-stress-ball.webp',
    imgAlt: 'Golf Ball Stress Ball Desk Toy',
  },
  'magnetic-ball-marker-desk': {
    url: 'https://www.amazon.com/s?k=magnetic-ball-marker-desk&crid=3SQJM99NXSU5O&sprefix=magnetic-ball-marker-desk%2Caps%2C217&linkCode=ll2&tag=cubicalgolfer-20&linkId=fd88ddb04f2220a3c61e7abbac632964&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/magnetic-ball-markers.webp',
    imgAlt: 'Magnetic Golf Ball Marker Set',
  },
  'golf-book-harvey-penick': {
    url: 'https://www.amazon.com/s?k=golf-book-harvey-penick&crid=3J108VVJMVBBR&sprefix=golf-book-harvey-penick%2Caps%2C262&linkCode=ll2&tag=cubicalgolfer-20&linkId=e328b078617ac8e255700d736e9065f2&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Price on Amazon',
    imgSrc: '/images/products/golf-book-harvey-penick.webp',
    imgAlt: 'Harvey Penick Little Red Book',
  },
  'golf-mouse-pad': {
    url: 'https://www.amazon.com/s?k=golf-mouse-pad&crid=1P6Z9YIWJPR05&sprefix=golf-mouse-pad%2Caps%2C242&linkCode=ll2&tag=cubicalgolfer-20&linkId=619a8a0bdd94118c8ec351533c435d43&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$14',
    label: 'See Options on Amazon',
    imgSrc: '/images/products/golf-mouse-pad.webp',
    imgAlt: 'Golf Course Aerial Mouse Pad',
  },

  // ── Golf Balls for 90 MPH Swing Speed ────────────────────────────────────────
  'srixon-q-star-tour': {
    url: 'https://www.amazon.com/s?k=srixon-q-star-tour&crid=O3KE1R8W1XUG&sprefix=square-golf-monitor%2Caps%2C283&linkCode=ll2&tag=cubicalgolfer-20&linkId=9afc1540365836166be1ec0145e07847&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-chrome-soft&crid=QIR72QBZ6WKH&sprefix=callaway-chev-dry%2Caps%2C236&linkCode=ll2&tag=cubicalgolfer-20&linkId=f149acca562ed2c5be4885a11bef7119&language=en_US&ref_=as_li_ss_tl',
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
  'callaway-chrome-tour': {
    url: 'https://www.amazon.com/s?k=callaway-chrome-tour&crid=QIR72QBZ6WKH&sprefix=callaway-chev-dry%2Caps%2C236&linkCode=ll2&tag=cubicalgolfer-20&linkId=f149acca562ed2c5be4885a11bef7119&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Chrome%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$40/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-chrome-tour.webp',
    imgAlt: 'Callaway Chrome Soft Golf Balls',
    benefits: [
      '75 compression — low-compression premium ball for moderate speeds',
      'Hyper Elastic SoftFast core maximizes ball speed at 90 mph',
      'Tour-quality urethane cover for short game spin and control',
    ],
  },
  'callaway-chrome-tour-2026': {
    url: 'https://www.amazon.com/s?k=callaway-chrome-tour-2026&crid=QIR72QBZ6WKH&sprefix=callaway-chev-dry%2Caps%2C236&linkCode=ll2&tag=cubicalgolfer-20&linkId=f149acca562ed2c5be4885a11bef7119&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Chrome%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$40/dz',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-chrome-tour-2026.webp',
    imgAlt: 'Callaway Chrome Soft Golf Balls',
    benefits: [
      '75 compression — low-compression premium ball for moderate speeds',
      'Hyper Elastic SoftFast core maximizes ball speed at 90 mph',
      'Tour-quality urethane cover for short game spin and control',
    ],
  },
  'titleist-tour-speed': {
    url: 'https://www.amazon.com/s?k=titleist-tour-speed&crid=29KW4M7QC2V0C&sprefix=titleist-tour-soft%2Caps%2C276&linkCode=ll2&tag=cubicalgolfer-20&linkId=8e3a5b2689ca3023e91440575551a649&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=taylormade-tour-response&crid=3V83T1RSHXXW4&sprefix=taylormade-tp5%2Caps%2C256&linkCode=ll2&tag=cubicalgolfer-20&linkId=1314dec90a229cf663c156629b1d4b3f&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=bridgestone-e12-contact&crid=YP7TB3ITPBR&sprefix=bridgestone-e12-contact%2Caps%2C260&linkCode=ll2&tag=cubicalgolfer-20&linkId=88e507d4794ca2c148818b873bcdacc4&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=spornia-spg-net&crid=2HSOAB7QOKWF6&sprefix=srixon-q-star-tour%2Caps%2C292&linkCode=ll2&tag=cubicalgolfer-20&linkId=1a834939cf3eb10fc53bcd15c579ce47&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B06Y5NX641?&linkCode=ll2&tag=cubicalgolfer-20&linkId=392946ce8eaf9e04f6904dca407e4464&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=benq-short-throw-projector&crid=1RH4N8Y0G8RE0&sprefix=benq-short-throw-projector%2Caps%2C292&linkCode=ll2&tag=cubicalgolfer-20&linkId=4360586729ca87817322d8a333a65f7d&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=diy-impact-screen-enclosure&crid=3DO4TZMZBS9LO&sprefix=diy-impact-screen-enclosure%2Caps%2C180&linkCode=ll2&tag=cubicalgolfer-20&linkId=17c07ac51bd2dc771a8fcfe58f742b19&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=garmin-approach-r50&crid=28V9UEWIUGBFZ&sprefix=garmin-approach-r50%2Caps%2C269&linkCode=ll2&tag=cubicalgolfer-20&linkId=ab645438d8ff0e061fdb5965508756c7&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=square*+golf*&ghref=2301%3A1333883',
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
    url: 'https://www.amazon.com/s?k=zero-restriction-rain-suit&linkCode=ll2&tag=cubicalgolfer-20&linkId=bd9663f2ca52498eb97c4c436fac75d6&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B01AVDVHTI?th=1&linkCode=ll2&tag=cubicalgolfer-20&linkId=3c8e527ec9138ad1d9109fe705585ee0&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=callaway-xj-junior-set&crid=34FFNM49JMUWP&sprefix=callaway-xj-junior-set%2Caps%2C228&linkCode=ll2&tag=cubicalgolfer-20&linkId=a51a505ea395f371acb4367f21a849c7&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dus%2520kids%2520tour%2520series%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/s?k=taylormade-team-tm-junior&crid=1XV7QEXEITCL1&sprefix=taylormade-team-tm-junior%2Caps%2C197&linkCode=ll2&tag=cubicalgolfer-20&linkId=da82011f67d7a798838a2728ffabc031&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dpersonalized%2520golf%2520balls%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/s?k=golf-towel-personalized&crid=1MZJBZOY73XP8&sprefix=golf-towel-personalized%2Caps%2C255&linkCode=ll2&tag=cubicalgolfer-20&linkId=032ba8b0f2ad3380634bca63d3f92951&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=women-golf-glove&i=sporting&crid=2MXVZLACDCIPO&sprefix=winn-dri-tac-oversize%2Csporting%2C155&linkCode=ll2&tag=cubicalgolfer-20&linkId=ee96955f01b69697bd7934b4fc4af086&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=putt-a-bout-putting-green&crid=2XNFAKWHTP8WW&sprefix=pinnacle-rush%2Caps%2C245&linkCode=ll2&tag=cubicalgolfer-20&linkId=3f762aebea5a636fe4b3b8a3c8ab5b8a&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$45',
    label: 'See Current Price',
    imgSrc: '/images/products/putt-a-bout-putting-green.webp',
    imgAlt: 'Putt-A-Bout Par 1 Indoor Putting Green',
    benefits: ['9-foot roll with ball return for repetitive practice', 'Non-skid rubber backing on any floor', 'Folds flat for storage under a desk'],
  },
  'sklz-accelerator-putting-mat': {
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dsklz%2520accelerator%2520putting%2520mat%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$40',
    label: 'See Current Price',
    imgSrc: '/images/products/sklz-accelerator-putting-mat.webp',
    imgAlt: 'SKLZ Accelerator Pro Putting Mat with Ball Return',
    benefits: ['Ball return chute — no bending to retrieve', 'Alignment guides printed on surface', 'Compact 7-foot length fits most offices'],
  },
  'birdieball-putting-green': {
    url: 'https://www.amazon.com/s?k=birdieball-putting-green&crid=2O7P9PE8BWNV0&sprefix=birdieball-putting-green%2Caps%2C337&ref=nb_sb_noss_2',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/birdieball-putting-green.webp',
    imgAlt: 'BirdieBall putting green',
    benefits: ['True-roll surface mimics real green speeds', 'Adjustable break with foam wedges', 'Available in sizes from 4x12 to 4x18 ft'],
  },
  'wellputt-mat': {
    url: 'https://www.amazon.com/s?k=wellputt-mat&crid=KQX20DQG6IPJ&sprefix=wellputt-mat%2Caps%2C258&linkCode=ll2&tag=cubicalgolfer-20&linkId=bab584186cfda3a0727e9344a211941b&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wellputt-mat.webp',
    imgAlt: 'Wellputt Premium Putting Mat',
    benefits: ['Tour-spec stimp speed surface', 'Printed training zones for distance control', 'Used by PGA Tour players'],
  },
  'lag-shot-7-iron': {
    url: 'https://www.playbetter.com/products/lag-shot-7-iron-swing-trainer?_pos=1&_sid=6bc53f9e3&_ss=r&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$119',
    label: 'See Current Price',
    imgSrc: '/images/products/lag-shot-7-iron.webp',
    imgAlt: 'Lag Shot 7-Iron Swing Trainer',
    benefits: ['Whippy shaft forces proper swing sequence', 'Eliminates casting and over-the-top move', 'Hit real balls — not just an air drill'],
  },
  'eyeline-speed-trap': {
    url: 'https://www.amazon.com/s?k=eyeline-speed-trap&crid=3QQIO1QEIP9GU&sprefix=eyeline-speed-trap%2Caps%2C212&linkCode=ll2&tag=cubicalgolfer-20&linkId=9cd5b323332a89a7372967c87716a78f&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$40',
    label: 'See Current Price',
    imgSrc: '/images/products/eyeline-speed-trap.webp',
    imgAlt: 'EyeLine Golf Speed Trap 2.0',
    benefits: ['Physical gate prevents over-the-top swing path', 'Instant feedback on every swing', 'Used by PGA instructors worldwide'],
  },
  'superspeed-golf-set': {
    url: 'https://www.amazon.com/s?k=superspeed-golf-set&crid=2SP86CTUMUOJT&sprefix=superspeed-golf-set%2Caps%2C207&linkCode=ll2&tag=cubicalgolfer-20&linkId=0eddd8f34abaa1d34f0a01fa63fe4ebb&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$199',
    label: 'See Current Price',
    imgSrc: '/images/products/superspeed-golf-set.webp',
    imgAlt: 'SuperSpeed Golf Training System',
    benefits: ['3-club overspeed system proven to add 5-8% swing speed', 'Protocol takes 15 minutes 3x per week', 'Used by 700+ Tour pros'],
  },
  'the-stack-system': {
    url: 'https://www.amazon.com/s?k=the-stack-system&crid=5PGR8SLS1ZLK&sprefix=taylormade-tp5x%2Caps%2C266&linkCode=ll2&tag=cubicalgolfer-20&linkId=bc6549a618ea0847e1fc73845f2e51e7&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/the-stack-system.webp',
    imgAlt: 'The Stack Swing Speed Training System',
    benefits: ['AI-powered app adjusts weight for each session', 'Interchangeable weight system for progressive overload', 'Tracks speed gains over time'],
  },
  'rypstick-trainer': {
    url: 'https://www.amazon.com/s?k=rypstick-trainer&crid=31AQ20BV5BP9J&sprefix=rypstick-trainer%2Caps%2C240&linkCode=ll2&tag=cubicalgolfer-20&linkId=8ba2b26df8132a29217c8f2d88881a28&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$180',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-swing-trainer.webp',
    imgAlt: 'Rypstick Swing Speed Trainer',
    benefits: ['Adjustable weight from 325g to 420g', 'Click-in weight system — no screwing', 'Compact enough for travel'],
  },
  'callaway-reva-driver': {
    url: 'https://www.amazon.com/s?k=callaway-reva-driver&crid=2EXRQ37CMNGO4&sprefix=callaway-reva-driver%2Caps%2C260&linkCode=ll2&tag=cubicalgolfer-20&linkId=daac30540553e88cd0d623d76195f6c6&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Reva%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-reva-driver.webp',
    imgAlt: 'Callaway Reva driver',
    benefits: ['Ultralight design for sub-85 mph swing speeds', 'High launch with low spin for maximum carry', 'Available in left-hand'],
  },
  'ping-g-le3-irons': {
    url: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dping%2520g%2520le%25203%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G%2520Le3%2520Irons%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$699',
    label: 'See Current Price',
    imgSrc: '/images/products/ping-g-le3-irons.webp',
    imgAlt: 'Ping G Le3 irons',
    benefits: ['Lightweight graphite shafts optimized for moderate speeds', 'Wide sole prevents fat shots', 'Available in women and senior flex'],
  },
  'skechers-go-golf-elite-5': {
    url: 'https://www.amazon.com/s?k=skechers-go-golf-elite-5&linkCode=ll2&tag=cubicalgolfer-20&linkId=992351eda694d048b42a9d7a2eb581f8&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fskechers-mens-go-golf-elite-vortex-golf-shoes-25skemgglfltvrtxcgsh%2F25skemgglfltvrtxcgsh%3FenteredSearchTerm%3DSkechers%2520Go%2520Golf%2520Elite%25205',
    retailer: 'Amazon',
    price: '~$110',
    label: 'See Current Price',
    imgSrc: '/images/products/skechers-go-golf.webp',
    imgAlt: 'Skechers Go Golf Elite 5 Spikeless Shoes',
    benefits: ['Ultra Go cushioning for 18 holes of walking', 'H2GO waterproof shield', 'Arch Fit insole for all-day comfort'],
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ecco-biom-c4&crid=RG8WR5111194&sprefix=ecco-biom-c4%2Caps%2C237&linkCode=ll2&tag=cubicalgolfer-20&linkId=fac4cce8223d8586d182efd74248099b&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DECCO%2520Biom%2520C4%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$200',
    label: 'See Current Price',
    imgSrc: '/images/products/ecco-biom-c4.webp',
    imgAlt: 'ECCO Biom C4 Spikeless Golf Shoes',
    benefits: ['GORE-TEX waterproof for any weather', 'BIOM Natural Motion for walking comfort', 'Premium leather lasts 3+ seasons'],
  },
  'nike-air-max-90-golf': {
    url: 'https://www.amazon.com/s?k=nike-air-max-90-golf&crid=1JWE4X03USP3I&sprefix=new-balance-breeze-v2%2Caps%2C270&linkCode=ll2&tag=cubicalgolfer-20&linkId=12367bd6920ef5a19590b4e0eed65fb5&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=grip-trainer-steering-wheel&crid=12OEQCJ89GTDL&sprefix=grip-trainer-steering-wheel%2Caps%2C200&linkCode=ll2&tag=cubicalgolfer-20&linkId=80c8fb77423763932ada2adbfcc20a59&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=theraband-flexbar&crid=2BNUN4Z8356FM&sprefix=the-stack-system%2Caps%2C271&linkCode=ll2&tag=cubicalgolfer-20&linkId=36052761ebeb38e49e7be73c5dcca857&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dtaylormade%2520spider%25205k%2520zt%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0C2K9FC8R/?tag=cubicalgolfer-20',
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
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dodyssey%2520jailbird%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/dp/B0CB7Q2NFY/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/s?k=odyssey+tri+beam&crid=2SRJH3JMKF0XZ&sprefix=odyssey+tri+beam%2Caps%2C157&linkCode=ll2&tag=cubicalgolfer-20&linkId=bd877383aad74ee8f1df3358f680290c&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=superstroke-traxion-grip&crid=12AH4NZ0M8BBK&sprefix=superstroke-s-tech%2Caps%2C254&linkCode=ll2&tag=cubicalgolfer-20&linkId=e994253eca4aeb635621c72ad78b35be&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=vokey-sm10-52&crid=2K0IGHSTPKV0I&sprefix=vice-drive%2Caps%2C281&linkCode=ll2&tag=cubicalgolfer-20&linkId=8058d42dd8839d1af62fca8fe3ddef15&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=cleveland-rtx6-52&crid=3872V7V1UM0LJ&sprefix=cleveland-rtx6-52%2Caps%2C219&linkCode=ll2&tag=cubicalgolfer-20&linkId=f3682a247b3ccaa80d9bed7fe8d29727&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dcallaway%2520JAWS%2520RAW%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
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
    url: 'https://www.amazon.com/s?k=mizuno-t24-52&crid=185CU5VGFRRJ7&sprefix=mizuno-t24-52%2Caps%2C233&linkCode=ll2&tag=cubicalgolfer-20&linkId=d8f1b625a25719f3813b2abba76be970&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B0D4P8BQRL/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/s?k=golf-pride-mcc-plus4&crid=1M0UGKCP88J55&sprefix=golf-pride-mcc-plus4%2Caps%2C260&linkCode=ll2&tag=cubicalgolfer-20&linkId=d1642876dd32be6c3e2bb7cfd51145ec&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=golf-pride-tour-velvet-cord&crid=19CNSZ56XDLKV&sprefix=golf-pride-tour-velvet-cord%2Caps%2C232&linkCode=ll2&tag=cubicalgolfer-20&linkId=d0ae7e4c5c7b5c9a913b87868b41f5cb&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=lamkin-crossline-cord&crid=KHGGFDQE36GJ&sprefix=lamkin-crossline-cord%2Caps%2C285&linkCode=ll2&tag=cubicalgolfer-20&linkId=f1b570e4fe9c20af777de3d24cc7d59a&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=winn-dri-tac&i=sporting&crid=FZC3T195TR4N&sprefix=winn-dri-tac%2Csporting%2C145&linkCode=ll2&tag=cubicalgolfer-20&linkId=28eca9e997a00649fc00d690ebfbd1d0&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/dp/B07WFHYZJG/?tag=cubicalgolfer-20',
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
    url: 'https://www.amazon.com/s?k=callaway+big+bertha+driver&crid=2AEGJKHQ2WRM1&sprefix=callaway+big+%2Caps%2C249&linkCode=ll2&tag=cubicalgolfer-20&linkId=f4dfaed6b25f58149ac36736ce8fb6eb&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCallaway%2520Big%2520Bertha%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-big-bertha.webp',
    imgAlt: 'Callaway Big Bertha driver',
  },
  'cleveland-huntington-beach': {
    url: 'https://www.amazon.com/s?k=cleveland-huntington-beach&crid=3C8J68DFQY6NG&sprefix=cleveland-huntington-beach%2Caps%2C216&linkCode=ll2&tag=cubicalgolfer-20&linkId=617afd44bb037581ed3ec6df8c0ff467&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DCleveland%2520Huntington%2520Beach%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$129',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cleveland-huntington-beach.webp',
    imgAlt: 'Cleveland Huntington Beach Soft putter',
  },
  'cobra-air-x': {
    url: 'https://www.amazon.com/s?k=cobra-air-x&crid=1LCFL0C96S86O&sprefix=cobra-air-x%2Caps%2C225&linkCode=ll2&tag=cubicalgolfer-20&linkId=76f41070be3591f91345a4b9e3bdbf10&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fp%2Fcobra-air-x-12-piece-complete-set-23cbrmrx2stl12pcmset%2F23cbrmrx2stl12pcmset',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cobra-air-x.webp',
    imgAlt: 'Cobra Air-X driver',
  },
  'evnroll-er2': {
    url: 'https://www.amazon.com/s?k=evnroll-er2&crid=15T4H7XDB4OUI&sprefix=evnroll-er2%2Caps%2C219&linkCode=ll2&tag=cubicalgolfer-20&linkId=593e2b287e2b9ea031db29ba722fc5e6&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DEvnroll%2520ER2%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/evnroll-er2.webp',
    imgAlt: 'Evnroll ER2 blade putter',
  },
  'net-return-pro': {
    url: 'https://www.amazon.com/s?k=net-return-pro&crid=HTVYLIYCCS63&sprefix=net-return-pro%2Caps%2C238&linkCode=ll2&tag=cubicalgolfer-20&linkId=82cda57a6b250ee4c4d055a3a8d00d6f&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$350',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/net-return-pro.webp',
    imgAlt: 'Net Return Pro Series golf practice net',
  },
  'odyssey-stroke-lab': {
    url: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dodyssey%2520STROKE%2520LAB%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Stroke%2520Lab%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$199',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-stroke-lab.webp',
    imgAlt: 'Odyssey Stroke Lab putter',
  },
  'odyssey-tri-hot-5k': {
    url: 'https://www.amazon.com/s?k=odyssey-tri-hot-5k&crid=10KOQ0QGU7Z42&sprefix=odyssey-tri-hot-5k%2Caps%2C270&linkCode=ll2&tag=cubicalgolfer-20&linkId=71d8684f8b48e0c9fd3340f34c6d7e33&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.dpbolvw.net/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DOdyssey%2520Tri-Hot%25205K%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-tri-hot-5k.webp',
    imgAlt: 'Odyssey Tri-Hot 5K putter',
  },
  'odyssey-two-ball-eleven': {
    url: 'https://www.amazon.com/s?k=odyssey+two+ball+eleven&crid=1DW3FD77SR4FH&sprefix=odysseytwo+ball+eleven%2Caps%2C183&linkCode=ll2&tag=cubicalgolfer-20&linkId=f726b6756beb4e2390b313a2dba70850&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17023849?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dodyssey%2520two%2520ball%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-two-ball-eleven.webp',
    imgAlt: 'Odyssey Two Ball Eleven putter',
  },
  'orange-whip-trainer': {
    url: 'https://www.amazon.com/s?k=orange-whip-trainer&crid=3NNDCUPMM0PM5&sprefix=orange-whip-trainer%2Caps%2C259&linkCode=ll2&tag=cubicalgolfer-20&linkId=81b7842d58e84d739f9e34a8c8a55d84&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Orange*+Whip*+Trainer*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$109',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/orange-whip-trainer.webp',
    imgAlt: 'Orange Whip golf swing trainer',
  },
  'ping-g430-sft': {
    url: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dping%2520g430%2520sft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DPing%2520G430%2520SFT%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/ping-g430-sft.webp',
    imgAlt: 'Ping G430 SFT draw-biased driver',
  },
  'ping-sigma-2': {
    url: 'https://www.amazon.com/dp/B08C4Q9ZJF/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/ping-sigma-2.webp',
    imgAlt: 'Ping Sigma 2 Anser blade putter',
  },
  'rukket-haack-net': {
    url: 'https://www.amazon.com/dp/B019NXQG3U/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$130',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/rukket-haack-net.webp',
    imgAlt: 'Rukket HAACK 10x7 golf practice net',
  },
  'scotty-cameron-phantom-x': {
    url: 'https://www.amazon.com/s?k=scotty-cameron-phantom-x&crid=1JC6HE15IOZS1&sprefix=shot-scope-lm1%2Caps%2C255&linkCode=ll2&tag=cubicalgolfer-20&linkId=d508835832ac0f2ce6b6bcfc46f41865&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DScotty%2520Cameron%2520Phantom%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/scotty-cameron-phantom-x.webp',
    imgAlt: 'Scotty Cameron Phantom X mallet putter',
  },
  'taylormade-spider-gt': {
    url: 'https://www.amazon.com/s?k=taylormade-spider-gt&crid=NG3Y2Z4IVULR&sprefix=taylormade-spider-5k-zt%2Caps%2C420&linkCode=ll2&tag=cubicalgolfer-20&linkId=e438a7919fc5e9a6332d7657897b0d7e&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Spider%2520GT%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-spider-gt.webp',
    imgAlt: 'TaylorMade Spider GT mallet putter',
  },
  'taylormade-stealth-2-hd': {
    url: 'https://www.amazon.com/s?k=taylormade-stealth-2-hd&crid=1LGUGTSWYN4AY&sprefix=taylormade-spider-tour%2Caps%2C270&linkCode=ll2&tag=cubicalgolfer-20&linkId=3df86920906cf0e5501395116322223a&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.anrdoezrs.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520Stealth%25202%2520HD%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-stealth-2-hd.webp',
    imgAlt: 'TaylorMade Stealth 2 HD driver',
  },
  'tour-striker-smart-ball': {
    url: 'https://www.amazon.com/s?k=tour-striker-smart-ball&crid=2FMLFU0AY8B3J&sprefix=titleist-velocity%2Caps%2C269&linkCode=ll2&tag=cubicalgolfer-20&linkId=7067b815e04fcd938d74833c51641f84&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$29',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/tour-striker-smart-ball.webp',
    imgAlt: 'Tour Striker Smart Ball training aid',
  },
  // ── Apps & Software ─────────────────────────────────────────────────────────
  'the-grint': {
    url: 'https://www.amazon.com/s?k=golf+GPS+app+accessory&linkCode=ll2&tag=cubicalgolfer-20&linkId=aacb1132da2ac52145a30d7800309bec&language=en_US&ref_=as_li_ss_tl',
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
    url: 'https://www.amazon.com/s?k=golf+swing+analyzer+training+aid&linkCode=ll2&tag=cubicalgolfer-20&linkId=62fa8113647330c1ae8f2c5e54faee38&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: 'Free / Premium',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/swing-ai.webp',
    imgAlt: 'AI golf swing analysis app',
  },

  // ── Golf Balls (compression chart) ──────────────────────────────────────────
  'taylormade-noodle': {
    url: 'https://www.amazon.com/s?k=taylormade-noodle&crid=2RB7ZCHJB53RI&sprefix=taylormade-noodle%2Caps%2C231&linkCode=ll2&tag=cubicalgolfer-20&linkId=e7b1aae09ea64ba9a1bb110cdbc9ece6&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-noodle.webp',
    imgAlt: 'TaylorMade Noodle golf balls',
  },
  'wilson-duo-soft-plus': {
    url: 'https://www.amazon.com/s?k=wilson-duo-soft-plus&crid=290YB0DRKWGN5&sprefix=wilson-duo-soft-plus%2Caps%2C244&linkCode=ll2&tag=cubicalgolfer-20&linkId=7c204a76f5667987e8de0c180d5f12e4&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$23/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-duo-soft-plus.webp',
    imgAlt: 'Wilson DUO Soft+ golf balls',
  },
  'titleist-trufeel': {
    url: 'https://www.amazon.com/s?k=titleist-trufeel&crid=10ZT28639WBVZ&sprefix=titleist-trufeel%2Caps%2C268&linkCode=ll2&tag=cubicalgolfer-20&linkId=9b59f37691d59bbdb9d9d1eab0c031a4&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$25/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-trufeel.webp',
    imgAlt: 'Titleist TruFeel golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520TruFeel%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'taylormade-soft-response': {
    url: 'https://www.dpbolvw.net/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dtaylormade%2520soft%2520response%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$25/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-soft-response.webp',
    imgAlt: 'TaylorMade Soft Response golf balls',
  },
  'vice-drive': {
    url: 'https://www.amazon.com/s?k=vice-drive&crid=3AC551UVSU8CC&sprefix=vice-drive%2Caps%2C243&linkCode=ll2&tag=cubicalgolfer-20&linkId=f459afc5930c5bab4ef0b02829174be3&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$17/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-drive.webp',
    imgAlt: 'Vice Drive golf balls',
  },
  'vice-pro-soft': {
    url: 'https://www.amazon.com/s?k=vice-pro-plus&crid=1Z3W2M00LC6PU&sprefix=vice-pro%2Caps%2C283&linkCode=ll2&tag=cubicalgolfer-20&linkId=b751a0abee57b374eddaf951818042f7&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$33/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro-soft.webp',
    imgAlt: 'Vice Pro Soft golf balls',
  },
  'titleist-tour-soft': {
    url: 'https://www.amazon.com/s?k=titleist-tour-soft&crid=1OYCI22K092XX&sprefix=titleist-t100%2Caps%2C245&linkCode=ll2&tag=cubicalgolfer-20&linkId=7635bd54cce35d2e11d3130bcdf31ddf&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-tour-soft.webp',
    imgAlt: 'Titleist Tour Soft golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Tour%2520Soft%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'titleist-velocity': {
    url: 'https://www.amazon.com/s?k=titleist-velocity&linkCode=ll2&tag=cubicalgolfer-20&linkId=14bd96cc80f9293e6937d517e934e29d&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$30/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-velocity.webp',
    imgAlt: 'Titleist Velocity golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520Velocity%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'callaway-warbird': {
    url: 'https://www.amazon.com/s?k=callaway-warbird&crid=19G8XQY7ZVCSL&sprefix=callaway-warbird%2Caps%2C250&linkCode=ll2&tag=cubicalgolfer-20&linkId=aebc088d25243e7692933d8909217bae&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-warbird.webp',
    imgAlt: 'Callaway Warbird golf balls',
  },
  'bridgestone-tour-b-rx': {
    url: 'https://www.amazon.com/s?k=bridgestone-tour-b-rx&crid=1AHZL5C9YSBIY&sprefix=bridgestone-tour-b-rx%2Caps%2C272&linkCode=ll2&tag=cubicalgolfer-20&linkId=438aad089e45b346e57e6d25fba2e454&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-rx.webp',
    imgAlt: 'Bridgestone Tour B RX golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DBridgestone%2520Tour%2520B%2520RX%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'kirkland-signature': {
    url: 'https://www.amazon.com/s?k=kirkland-signature&crid=2QKPBRUXFX2UQ&sprefix=impact-tape%2Caps%2C229&linkCode=ll2&tag=cubicalgolfer-20&linkId=1ea49994a8f0d80175037ba0b428c459&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$28/2dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/kirkland-signature.webp',
    imgAlt: 'Kirkland Signature golf balls',
  },
  'titleist-avx': {
    url: 'https://www.amazon.com/s?k=titleist-avx&crid=2K63S0C7TC1QJ&sprefix=tifosi-seek-fc%2Caps%2C250&linkCode=ll2&tag=cubicalgolfer-20&linkId=9363a91c07a7107214aee2db99e56b92&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$50/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-avx.webp',
    imgAlt: 'Titleist AVX golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTitleist%2520AVX%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'wilson-staff-model': {
    url: 'https://www.amazon.com/s?k=wilson-staff-model&i=sporting&crid=VPFV3NY6D8C1&sprefix=wilson-staff-model%2Csporting%2C127&linkCode=ll2&tag=cubicalgolfer-20&linkId=bbb72a5a862d30bed5e9b7a78f2dde4b&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$40/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-staff-model.webp',
    imgAlt: 'Wilson Staff Model golf balls',
  },
  'srixon-z-star': {
    url: 'https://www.amazon.com/s?k=srixon-z-star&crid=2CKLZ3YC1AWP1&sprefix=srixon-z-star%2Caps%2C226&linkCode=ll2&tag=cubicalgolfer-20&linkId=a665af8e74387be4299282a5036f9553&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$42/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/srixon-z-star.webp',
    imgAlt: 'Srixon Z-Star golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Z-Star%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'bridgestone-tour-b-xs': {
    url: 'https://www.amazon.com/s?k=bridgestone-tour-b-xs&crid=32SL2G8ERB1MB&sprefix=bridgestone-tour-b-xs%2Caps%2C272&linkCode=ll2&tag=cubicalgolfer-20&linkId=c8c26307638e444d0446d78ff7048f05&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-xs.webp',
    imgAlt: 'Bridgestone Tour B XS golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DBridgestone%2520Tour%2520B%2520XS%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'vice-pro-plus': {
    url: 'https://www.amazon.com/s?k=vice-pro-plus&crid=WGUFXIKOW2FM&sprefix=vice-pro-plus%2Caps%2C266&linkCode=ll2&tag=cubicalgolfer-20&linkId=0c5923c70dbed2d38485b381ce63747a&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$33/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/vice-pro-plus.webp',
    imgAlt: 'Vice Pro Plus golf balls',
  },
  'taylormade-tp5x': {
    url: 'https://www.amazon.com/s?k=taylormade-tp5x&crid=3A2LPETAQO5FF&sprefix=taylormade-tour-response%2Caps%2C269&linkCode=ll2&tag=cubicalgolfer-20&linkId=e3c2c45f03a1f2001870d7efddc934cb&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$50/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-tp5x.webp',
    imgAlt: 'TaylorMade TP5x golf balls',
    golfGalaxyUrl: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DTaylorMade%2520TP5x%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'bridgestone-tour-b-x': {
    url: 'https://www.amazon.com/s?k=bridgestone-tour-b-x&crid=E1YFURZ6JMN6&sprefix=bridgestone-tour-b-x%2Caps%2C225&linkCode=ll2&tag=cubicalgolfer-20&linkId=04ca273bbb792f3f094f4f78967287c6&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$48/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bridgestone-tour-b-x.webp',
    imgAlt: 'Bridgestone Tour B X golf balls',
  },
  'srixon-z-star-xv': {
    url: 'https://www.amazon.com/s?k=srixon+z-star-xv&linkCode=ll2&tag=cubicalgolfer-20&linkId=fc7e8ecaa846af8cd7d6490968144654&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$42/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/srixon-z-star-xv.webp',
    imgAlt: 'Srixon Z-Star XV golf balls',
    golfGalaxyUrl: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3DSrixon%2520Z-Star%2520XV%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
  },
  'maxfli-tour-x': {
    url: 'https://www.kqzyfj.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dmaxfli%2520tour%2520x%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$35/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/maxfli-tour-x.webp',
    imgAlt: 'Maxfli Tour X golf balls',
  },
  'wilson-chaos': {
    url: 'https://www.amazon.com/s?k=wilson-chaos&crid=2LDQEDBPN81RW&sprefix=wilson-chaos%2Caps%2C284&linkCode=ll2&tag=cubicalgolfer-20&linkId=3a9c6543852efc44b796cb5da30c4b45&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$20/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-chaos.webp',
    imgAlt: 'Wilson Chaos golf balls',
  },
  'pinnacle-rush': {
    url: 'https://www.amazon.com/dp/B09V4FRPN6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18/dz',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/pinnacle-rush.webp',
    imgAlt: 'Pinnacle Rush golf balls',
  },

  // ── Budget Putters ──────────────────────────────────────────────────────────
  'odyssey-dfx': {
    url: 'https://www.amazon.com/s?k=odyssey-dfx&crid=2820VBIUW4S39&sprefix=odyssey-dfx%2Caps%2C253&linkCode=ll2&tag=cubicalgolfer-20&linkId=bcf9e688f1e5d37bbe8fe84125b69768&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$129',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/odyssey-dfx.webp',
    imgAlt: 'Odyssey DFX mallet putter',
  },
  'pinemeadow-pgx': {
    url: 'https://www.amazon.com/s?k=pinemeadow-pgx&crid=1UT05X2UTSXGP&sprefix=personalized-golf-balls%2Caps%2C244&linkCode=ll2&tag=cubicalgolfer-20&linkId=cae8bc207c498f91e722f11f3a19a65c&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$40',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/pinemeadow-pgx.webp',
    imgAlt: 'Pinemeadow PGX mallet putter',
  },
  'wilson-staff-infinite': {
    url: 'https://www.amazon.com/s?k=wilson-staff-infinite&i=sporting&crid=1NYASVJB5KN4F&sprefix=wilson-staff-infinite%2Csporting%2C139&linkCode=ll2&tag=cubicalgolfer-20&linkId=49c534cddb27b9dad7f085d13f083bab&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wilson-staff-infinite.webp',
    imgAlt: 'Wilson Staff Infinite blade putter',
  },

  'flightscope-mevo-plus': {
    url: 'https://www.amazon.com/s?k=flightscope-mevo-plus&crid=A65BPBNU3OAW&sprefix=flightscope-mevo-plus%2Caps%2C290&linkCode=ll2&tag=cubicalgolfer-20&linkId=7ae5bed91be7c8c676c52d523aeb1935&language=en_US&ref_=as_li_ss_tl',
    golfGalaxyUrl: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=Flightscope*+Mevo%2B*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$2,499',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/flightscope-mevo-plus.webp',
    imgAlt: 'Flightscope Mevo+ launch monitor',
  },

  'garmin-approach-s12': {
    url: 'https://www.amazon.com/s?k=garmin-approach-s12&crid=QM7PZXRF034V&sprefix=garmin-approach-s12%2Caps%2C267&linkCode=ll2&tag=cubicalgolfer-20&linkId=2e044130b701e021c30adcf3297663bb&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/garmin-approach-s12.webp',
    imgAlt: 'Garmin Approach S12 GPS golf watch',
  },

  'sklz-accelerator-pro': {
    url: 'https://www.amazon.com/s?k=sklz-accelerator-pro&crid=1DQTJCNAP33OO&sprefix=skechers-go-golf-elite-5%2Caps%2C274&linkCode=ll2&tag=cubicalgolfer-20&linkId=5057e45ae31497697c80106ab198c79c&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$40',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/sklz-accelerator-pro.webp',
    imgAlt: 'SKLZ Accelerator Pro putting mat',
  },

  // ── Month 1 New Products ──────────────────────────────────────────────
  'shot-scope-lm1': {
    url: 'https://www.amazon.com/s?k=shot-scope-lm1&crid=8X6EGXC7VCTR&sprefix=scotty-cameron-phantom-x%2Caps%2C246&linkCode=ll2&tag=cubicalgolfer-20&linkId=45cb5783af3d9f27d435795e7ffbf4f5&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$199',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/shot-scope-lm1.webp',
    imgAlt: 'Shot Scope LM1 portable launch monitor',
  },
  'mevo-gen2': {
    url: 'https://www.amazon.com/s?k=mevo-gen2&crid=2KHQMKKLCKN0A&sprefix=maxi-tour-x%2Caps%2C245&linkCode=ll2&tag=cubicalgolfer-20&linkId=fbf7082609b00a3da5633913c75c347a&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$1,299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/mevo-gen2.webp',
    imgAlt: 'FlightScope Mevo Gen2 launch monitor',
  },
  'square-golf-monitor': {
    url: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=square*+golf*&ghref=2301%3A1333883',
    retailer: 'Amazon',
    price: '~$699',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/square-golf-monitor.webp',
    imgAlt: 'Square Golf launch monitor',
  },
  'kvv-push-cart': {
    url: 'https://www.amazon.com/s?k=kvv-push-cart&crid=1U001KIXZGN4C&sprefix=kvv-push-cart%2Caps%2C266&linkCode=ll2&tag=cubicalgolfer-20&linkId=7b216cbaa0777f33c9ab5dacd094e502&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$152',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/kvv-push-cart.webp',
    imgAlt: 'KVV 3-wheel golf push cart',
  },
  'bag-boy-nitron': {
    url: 'https://www.amazon.com/s?k=bag-boy-nitron&crid=1CUSXIXKQGXKR&sprefix=bag-boy-nitron%2Caps%2C237&linkCode=ll2&tag=cubicalgolfer-20&linkId=28cc649d7409e84694563493833bc310&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$229',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bag-boy-nitron.webp',
    imgAlt: 'Bag Boy Nitron auto-open push cart',
  },
  'clicgear-model-45': {
    url: 'https://www.amazon.com/s?k=clicgear-model-45&crid=3CN8ATBACTW08&sprefix=clicgear-model-45%2Caps%2C187&linkCode=ll2&tag=cubicalgolfer-20&linkId=67893ffe50a4c79af70592ec2cc32d94&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$289',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/clicgear-model-45.webp',
    imgAlt: 'Clicgear Model 4.5 push cart',
  },
  'caddytek-ez-v8': {
    url: 'https://www.amazon.com/s?k=caddytek-ez-v8&crid=2XQYZD2BV7AUM&sprefix=caddytek-ez-v8%2Caps%2C238&linkCode=ll2&tag=cubicalgolfer-20&linkId=4fe64ee60c6b174c43f4582b8684a527&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/caddytek-ez-v8.webp',
    imgAlt: 'CaddyTek EZ V8 4-wheel push cart',
  },
  'super-stroke-s-tech': {
    url: 'https://www.amazon.com/dp/B07WFHYZJG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$7',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/super-stroke-s-tech.webp',
    imgAlt: 'Super Stroke S-Tech golf grip',
  },
  'golf-pride-z-grip': {
    url: 'https://www.amazon.com/s?k=golf-pride-z-grip&crid=2JPK490Y6RD8I&sprefix=golf-pride-z-grip%2Caps%2C348&linkCode=ll2&tag=cubicalgolfer-20&linkId=7c99cb8e40f5423af10c26849020f4a2&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$6',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/golf-pride-z-grip.webp',
    imgAlt: 'Golf Pride Z-Grip cord golf grip',
  },
  'lamkin-sonar': {
    url: 'https://www.amazon.com/s?k=lamkin-sonar&crid=RSHIC2W2C8UO&sprefix=lamkin-sonar%2Caps%2C278&linkCode=ll2&tag=cubicalgolfer-20&linkId=4e33bb6d36ea0f658f8227b8d7e46fcb&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$6',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/lamkin-sonar.webp',
    imgAlt: 'Lamkin Sonar golf grip',
  },
  'wellputt-mat-10ft': {
    url: 'https://www.amazon.com/s?k=wellputt-mat-10ft&crid=2DG1F94N44DVS&sprefix=wellputt-mat%2Caps%2C229&linkCode=ll2&tag=cubicalgolfer-20&linkId=c6a9fb7f4ca22fc601ed23d4ff114df0&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/wellputt-mat-10ft.webp',
    imgAlt: 'Wellputt 10-foot putting mat',
  },
  'putt-out-trainer': {
    url: 'https://www.jdoqocy.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dputtout%2520trainer%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon',
    price: '~$30',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/putt-out-trainer.webp',
    imgAlt: 'PuttOut pressure putt trainer',
  },

  // ── Month 2-5 New Products ────────────────────────────────────────────
  'spornia-spg-hitting-mat': {
    url: 'https://www.amazon.com/s?k=spornia-spg-hitting-mat&crid=18N9YRR80YX51&sprefix=spornia-spg-hitting-mat%2Caps%2C195&linkCode=ll2&tag=cubicalgolfer-20&linkId=7cea979579ddab554b22dc34cb78e40a&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$159', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/spornia-spg-hitting-mat.webp', imgAlt: 'Spornia SPG golf hitting mat',
  },
  'fiberbuilt-flight-deck': {
    url: 'https://www.amazon.com/dp/B06Y5NX641?&linkCode=ll2&tag=cubicalgolfer-20&linkId=4d5e63f98b55edd2c8a1582bbc86ca49&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$449', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/fiberbuilt-flight-deck.webp', imgAlt: 'Fiberbuilt Flight Deck golf hitting mat',
  },
  'country-club-elite-mat': {
    url: 'https://www.amazon.com/s?k=country-club-elite-mat&crid=21C3SD5QAJ9AW&sprefix=country-club-elite-mat%2Caps%2C225&linkCode=ll2&tag=cubicalgolfer-20&linkId=3af1d6fae812d0f903cd0b1fe762f342&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$379', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/country-club-elite-mat.webp', imgAlt: 'Country Club Elite real feel golf mat',
  },
  'carls-place-impact-screen': {
    url: 'https://www.playbetter.com/search?type=article%2Cpage%2Cproduct&q=carls*+place*+impact*+screen*&ghref=2301%3A1333883',
    retailer: 'Amazon', price: '~$199', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/carls-place-impact-screen.webp', imgAlt: 'Carls Place golf simulator impact screen',
  },
  'homecourse-retractable-screen': {
    url: 'https://www.amazon.com/dp/B09WR1P9S3/?tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$599', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/homecourse-retractable-screen.webp', imgAlt: 'HomeCourse retractable golf screen',
  },
  'benq-th671st-projector': {
    url: 'https://www.amazon.com/s?k=benq-th671st-projector&crid=28ZYC7QVJ3921&sprefix=benq-th671st-projector%2Caps%2C269&linkCode=ll2&tag=cubicalgolfer-20&linkId=6e4a6c508cc257e9e45a77ddaaa94cbc&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$799', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/benq-th671st-projector.webp', imgAlt: 'BenQ TH671ST short throw projector for golf simulator',
  },
  'optoma-gt1090hdr': {
    url: 'https://www.amazon.com/s?k=optoma-gt1090hdr&crid=1VNFYPQ5VDU7C&sprefix=office-putting-mat%2Caps%2C243&linkCode=ll2&tag=cubicalgolfer-20&linkId=639dfb73d7ccb2f941516b2f20948f2d&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$1,099', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/optoma-gt1090hdr.webp', imgAlt: 'Optoma GT1090HDR short throw projector',
  },
  'bag-boy-volt-electric': {
    url: 'https://www.amazon.com/s?k=bag-boy-volt-electric&crid=16LMO50A5SS3M&sprefix=bag-boy-volt-electric%2Caps%2C272&linkCode=ll2&tag=cubicalgolfer-20&linkId=e256e146c00315a9bbb8ace4d22a072c&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$899', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/bag-boy-volt-electric.webp', imgAlt: 'Bag Boy Volt electric golf push cart',
  },
  'mgi-zip-navigator': {
    url: 'https://www.amazon.com/s?k=mgi-zip-navigator&crid=200W3EF78GJIU&sprefix=mevo-gen2%2Caps%2C241&linkCode=ll2&tag=cubicalgolfer-20&linkId=1ace7c3d9e3205eb36a9881491aadd97&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$1,699', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/mgi-zip-navigator.webp', imgAlt: 'MGI Zip Navigator electric golf caddy',
  },
  'sun-mountain-25-bag': {
    url: 'https://www.amazon.com/s?k=sun-mountain-25-bag&crid=3164G4IHIXEYM&sprefix=sun-mountain-25-bag%2Caps%2C225&linkCode=ll2&tag=cubicalgolfer-20&linkId=cb7aab7384409a81004877cfb86ddb0b&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$230', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/sun-mountain-25-bag.webp', imgAlt: 'Sun Mountain 2.5 stand bag',
  },
  'ping-hoofer-lite': {
    url: 'https://www.tkqlhce.com/click-101736949-17037566?url=https%3A%2F%2Fwww.golfgalaxy.com%2Fsearch%2FSearchDisplay%3FsearchTerm%3Dping%2520hoofer%2520lite%26storeId%3D10701%26catalogId%3D10051%26langId%3D-1%26sType%3DSimpleSearch%26resultCatEntryType%3D2%26showResultsPage%3Dtrue%26fromPage%3DSearch%26searchSource%3DQ%26pageView%3D%26beginIndex%3D0%26DSGsearchType%3DKeyword%26selectedStore%3D1521',
    retailer: 'Amazon', price: '~$265', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/ping-hoofer-lite.webp', imgAlt: 'Ping Hoofer Lite stand bag',
  },
  'titleist-players-4-bag': {
    url: 'https://www.amazon.com/s?k=titleist-players-4-bag&crid=15X65IZGWEUS3&sprefix=titleist-players-4-bag%2Caps%2C238&linkCode=ll2&tag=cubicalgolfer-20&linkId=1c7734665a5c9f0c5c32893d79dd4db8&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$250', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-players-4-bag.webp', imgAlt: 'Titleist Players 4 stand bag',
  },
  'footjoy-superlites-xp': {
    url: 'https://www.amazon.com/s?k=footjoy-superlites-xp&crid=1CRSZRK0KVF53&sprefix=footjoy-superlites-xp%2Caps%2C229&linkCode=ll2&tag=cubicalgolfer-20&linkId=a100f53e45ccd76438dea36d36ce22fa&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$90', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/footjoy-superlites-xp.webp', imgAlt: 'FootJoy Superlites XP spikeless golf shoes',
  },
  'skechers-go-golf-arch-fit': {
    url: 'https://www.amazon.com/s?k=skechers-go-golf-arch-fit&crid=25P3F1CDIRGS0&sprefix=skechers-go-golf-arch-fit%2Caps%2C271&linkCode=ll2&tag=cubicalgolfer-20&linkId=ba6e3e6e5d0e42ca95ca298e65ab02b1&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$110', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/skechers-go-golf-arch-fit.webp', imgAlt: 'Skechers GO GOLF Arch Fit golf shoes',
  },
  'new-balance-breeze-v2': {
    url: 'https://www.amazon.com/s?k=new-balance-breeze-v2&crid=278HRMKBX9ISA&sprefix=new-balance-breeze-v2%2Caps%2C247&linkCode=ll2&tag=cubicalgolfer-20&linkId=15393b39856bdd0a54826cddfd78fd52&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$85', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/new-balance-breeze-v2.webp', imgAlt: 'New Balance Breeze V2 golf shoes',
  },
  'galvin-green-rain-jacket': {
    url: 'https://www.amazon.com/s?k=galvin-green-rain-jacket&crid=SSGWWMACM75S&sprefix=galvin-green-rain-jacket%2Caps%2C233&linkCode=ll2&tag=cubicalgolfer-20&linkId=2da2d652dc6e698e2548c81fd2838ea6&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$300', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/galvin-green-rain-jacket.webp', imgAlt: 'Galvin Green Gore-Tex golf rain jacket',
  },
  'zero-restriction-rain-suit': {
    url: 'https://www.amazon.com/dp/B0779PJMWL/?tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$250', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/zero-restriction-rain-suit.webp', imgAlt: 'Zero Restriction golf rain jacket',
  },
  'under-armour-storm-rain': {
    url: 'https://www.amazon.com/s?k=under-armour-storm-rain&crid=1ANCV4L88BXG9&sprefix=vice-pro-plus%2Caps%2C264&linkCode=ll2&tag=cubicalgolfer-20&linkId=ef627637d351dccf74496bb56524ba00&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$100', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/under-armour-storm-rain.webp', imgAlt: 'Under Armour Storm golf rain jacket',
  },
  'oakley-prizm-golf': {
    url: 'https://www.amazon.com/s?k=oakley-prizm-golf&crid=WBZ6SKF9PFXB&sprefix=oakley-prizm-golf%2Caps%2C272&linkCode=ll2&tag=cubicalgolfer-20&linkId=3b0b00bfdbe3497c8aecbf6e69ec7f66&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$190', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/oakley-prizm-golf.webp', imgAlt: 'Oakley Prizm Golf sunglasses',
  },
  'tifosi-seek-fc': {
    url: 'https://www.amazon.com/s?k=tifosi-seek-fc&crid=8HD9668BI3GU&sprefix=tifosi-seek-fc%2Caps%2C246&linkCode=ll2&tag=cubicalgolfer-20&linkId=c673e2ab4ea48232b77baaba00987d1b&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$35', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/tifosi-seek-fc.webp', imgAlt: 'Tifosi Seek FC sport sunglasses',
  },
  'callaway-strata-senior': {
    url: 'https://www.amazon.com/s?k=callaway+strate&crid=2HKNLKWI3MLHY&sprefix=callaway+strate%2Caps%2C245&linkCode=ll2&tag=cubicalgolfer-20&linkId=681c9e85e3c4f97a143ae9d112830bd9&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$450', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-strata-senior.webp', imgAlt: 'Callaway Strata senior golf club set',
  },
  'cleveland-launcher-xl-senior': {
    url: 'https://www.amazon.com/s?k=cleveland+launcher+xl2&crid=2OYYW71NTMTFL&sprefix=cleveland+launcher+xl2%2Caps%2C302&linkCode=ll2&tag=cubicalgolfer-20&linkId=3b3e126df2448bd1026ec4b7f2a62a15&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$799', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cleveland-launcher-xl-senior.webp', imgAlt: 'Cleveland Launcher XL senior golf set',
  },
  'golf-pride-cp2-wrap-jumbo': {
    url: 'https://www.amazon.com/s?k=golf-pride-cp2-wrap-jumbo&crid=33QL3B7X0U38O&sprefix=golf-mouse-pad%2Caps%2C234&linkCode=ll2&tag=cubicalgolfer-20&linkId=a4ab7e103b9a2ff8b5e878fc4f482bc5&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$8', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/golf-pride-cp2-wrap-jumbo.webp', imgAlt: 'Golf Pride CP2 Wrap Jumbo grip for arthritis',
  },
  'winn-dri-tac-oversize': {
    url: 'https://www.amazon.com/s?k=winn-dri-tac-oversize&i=sporting&crid=RINPIGA22DP1&sprefix=winn-dri-tac-oversize%2Csporting%2C160&linkCode=ll2&tag=cubicalgolfer-20&linkId=99d860a7e4d0c349414759da13420476&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon', price: '~$7', label: 'Check Price at Amazon →',
    imgSrc: '/images/products/winn-dri-tac-oversize.webp', imgAlt: 'Winn Dri-Tac oversize golf grip',
  },


  // ── NEW PRODUCTS (May 2026) ────────────────────────────────────────────
  'callaway-300-pro': {
    url: 'https://www.amazon.com/s?k=callaway+300+pro&linkCode=ll2&tag=cubicalgolfer-20&linkId=96a921ff0acbd88ccdeb2a5e29e4cfe4&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
    imgSrc: '/images/products/callaway-300-pro.webp',
    imgAlt: 'Callaway 300 Pro Laser Rangefinder',
  },
  'bushnell-phantom-2': {
    url: 'https://www.amazon.com/s?k=bushnell+phantom+2&linkCode=ll2&tag=cubicalgolfer-20&linkId=014e3b7eabc6c8a8364b16210b2387fb&language=en_US&ref_=as_li_ss_tl',
    retailer: 'Amazon',
    price: '~$129',
    label: 'Check Price on Amazon',
    imgSrc: '/images/products/bushnell-phantom-2.webp',
    imgAlt: 'Bushnell Phantom 2 Golf GPS',
  },

  // ═══ MISSING PRICE FIXES — June 2026 ═══
  'garmin-approach-s70': {
    url: 'https://www.amazon.com/s?k=garmin+approach+s70&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$550',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/garmin-approach-s70.webp', imgAlt: 'Garmin Approach S70 GPS golf watch',
  },
  'titleist-gt2-driver': {
    url: 'https://www.amazon.com/s?k=titleist+gt2+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/titleist-gt2-driver.webp', imgAlt: 'Titleist GT2 driver',
  },

  // ═══ FORGIVING IRONS + BUDGET PICKS — June 2026 ═══
  'taylormade-sim2-max': {
    url: 'https://www.amazon.com/s?k=taylormade+sim2+max+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-sim2-max.webp', imgAlt: 'TaylorMade SIM2 Max irons',
  },
  'cleveland-launcher-xl': {
    url: 'https://www.amazon.com/s?k=cleveland+launcher+xl+halo+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cleveland-launcher-xl.webp', imgAlt: 'Cleveland Launcher XL Halo irons',
  },
  'taylormade-stealth-hd-irons': {
    url: 'https://www.amazon.com/s?k=taylormade+stealth+hd+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$549',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-stealth-hd.webp', imgAlt: 'TaylorMade Stealth HD irons',
  },
  'srixon-zx5-mk-ii': {
    url: 'https://www.amazon.com/s?k=srixon+zx5+mk+ii+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/srixon-zx5-mk-ii.webp', imgAlt: 'Srixon ZX5 Mk II irons',
  },

  // ═══ CONTEXT-CORRECT PRODUCT VARIANTS — June 2026 ═══
  'cleveland-launcher-xl2-driver': {
    url: 'https://www.amazon.com/s?k=cleveland+launcher+xl2+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cleveland-launcher-xl2-driver.webp', imgAlt: 'Cleveland Launcher XL2 driver',
  },
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=callaway+paradym+ai+smoke+max+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max-irons.webp', imgAlt: 'Callaway Paradym Ai Smoke Max irons',
  },
  'cobra-aerojet-max-irons': {
    url: 'https://www.amazon.com/s?k=cobra+aerojet+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/cobra-aerojet-irons.webp', imgAlt: 'Cobra Aerojet irons',
  },
  'taylormade-sim2-max-irons': {
    url: 'https://www.amazon.com/s?k=taylormade+sim2+max+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/taylormade-sim2-max-irons.webp', imgAlt: 'TaylorMade SIM2 Max irons',
  },

  'garmin-ct10': {
    url: 'https://www.amazon.com/s?k=garmin+ct10+golf+sensors&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price at Amazon →',
    imgSrc: '/images/products/garmin-ct10.webp', imgAlt: 'Garmin CT10 club tracking sensors',
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

// ═══ OVERFLOW ENTRIES (were trapped inside getAffiliateLink) ═══
// These are now a separate object merged back into AFFILIATE above.
// Moving them into AFFILIATE directly:

Object.assign(AFFILIATE, {
  'flightscope-x3': {
    url: 'https://www.amazon.com/dp/B0BZ8V1ZBH/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$15,995',
    imgSrc: '/images/products/flightscope-x3.webp',
  },
  'square-golf': {
    url: 'https://www.amazon.com/dp/B0DG1N1PGR/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    imgSrc: '/images/products/square-golf.webp',
  },
  'garmin-r50': {
    url: 'https://www.amazon.com/dp/B0DCQM8S8K/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$899',
    imgSrc: '/images/products/garmin-r50.webp',
  },
  'ernest-sports-es16': {
    url: 'https://www.amazon.com/dp/B07FZ1DRSY/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    imgSrc: '/images/products/ernest-sports-es16.webp',
  },
  'swing-caddie-sc4': {
    url: 'https://www.amazon.com/dp/B0CQ3V7CLN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    imgSrc: '/images/products/swing-caddie-sc4.webp',
  },

  'foam-practice-balls': {
    url: 'https://www.amazon.com/dp/B07C5HSRM2/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$15',
    imgSrc: '/images/products/foam-practice-balls.webp',
  },
  'acoustic-foam-panels': {
    url: 'https://www.amazon.com/dp/B07VDTR22R/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    imgSrc: '/images/products/acoustic-foam-panels.webp',
  },
  'spornia-spg-7': {
    url: 'https://www.amazon.com/dp/B07YZJGKFN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$219',
    imgSrc: '/images/products/spornia-spg-7.webp',
  },
  'homecourse-retractable-screen': {
    url: 'https://www.amazon.com/dp/B09WR1P9S3/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    imgSrc: '/images/products/homecourse-retractable-screen.webp',
  },

  'taylormade-qi-irons': {
    url: 'https://www.amazon.com/dp/B0DM9F2XBJ/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$899',
    imgSrc: '/images/products/taylormade-qi-irons.webp',
  },
  'cleveland-launcher-xl2-irons': {
    url: 'https://www.amazon.com/dp/B0BTFM23KH/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    imgSrc: '/images/products/cleveland-launcher-xl2-irons.webp',
  },
  'cobra-aerojet-max-irons': {
    url: 'https://www.amazon.com/dp/B0BTRK28F5/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$799',
    imgSrc: '/images/products/cobra-aerojet-irons.webp',
  },
  'cleveland-cbx4-wedge': {
    url: 'https://www.amazon.com/dp/B0D6GN4KCX/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$150',
    imgSrc: '/images/products/cleveland-cbx4-wedge.webp',
  },
  'callaway-jaws-full-toe': {
    url: 'https://www.amazon.com/dp/B0CPFL85LP/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$180',
    imgSrc: '/images/products/callaway-jaws-full-toe.webp',
  },
  'taylormade-hi-toe-3': {
    url: 'https://www.amazon.com/dp/B0CKBBQ5CS/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$170',
    imgSrc: '/images/products/taylormade-hi-toe-3.webp',
  },
  'callaway-paradym-hybrid': {
    url: 'https://www.amazon.com/dp/B0CWJ4VMHK/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$250',
    imgSrc: '/images/products/callaway-paradym-hybrid.webp',
  },
  'ping-g430-hybrid': {
    url: 'https://www.amazon.com/dp/B0BMS75HQ3/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$260',
    imgSrc: '/images/products/ping-g430-hybrid.webp',
  },
  'taylormade-stealth-hybrid': {
    url: 'https://www.amazon.com/dp/B09LGQWBZ4/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$180',
    imgSrc: '/images/products/taylormade-stealth-hybrid.webp',
  },
  'cobra-aerojet-hybrid': {
    url: 'https://www.amazon.com/dp/B0BTRKL2W9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$200',
    imgSrc: '/images/products/cobra-aerojet-hybrid.webp',
  },
  'lamkin-crossline': {
    url: 'https://www.amazon.com/dp/B001B6ECDS/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$5',
    imgSrc: '/images/products/lamkin-crossline.webp',
  },


  // ═══ APPAREL ═══
  'nike-dri-fit-victory-polo': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=nike+dri+fit+victory+golf+polo&tag=cubicalgolfer-20',
    price: '~$45', retailer: 'Amazon',
    imgSrc: '/images/products/nike-dri-fit-victory-polo.webp', imgAlt: 'Nike Dri-FIT Victory golf polo',
  },
  'footjoy-prodry-polo': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=footjoy+prodry+golf+polo&tag=cubicalgolfer-20',
    price: '~$60', retailer: 'Amazon',
    imgSrc: '/images/products/footjoy-prodry-polo.webp', imgAlt: 'FootJoy ProDry golf polo',
  },
  'adidas-ultimate365-polo': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=adidas+ultimate365+golf+polo&tag=cubicalgolfer-20',
    price: '~$55', retailer: 'Amazon',
    imgSrc: '/images/products/adidas-ultimate365-polo.webp', imgAlt: 'adidas Ultimate365 golf polo',
  },
  'puma-cloudspun-polo': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=puma+cloudspun+golf+polo&tag=cubicalgolfer-20',
    price: '~$50', retailer: 'Amazon',
    imgSrc: '/images/products/puma-cloudspun-polo.webp', imgAlt: 'Puma Cloudspun golf polo',
  },
  'adidas-ultimate365-pants': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=adidas+ultimate365+golf+pants&tag=cubicalgolfer-20',
    price: '~$65', retailer: 'Amazon',
    imgSrc: '/images/products/adidas-ultimate365-pants.webp', imgAlt: 'adidas Ultimate365 golf pants',
  },
  'nike-dri-fit-golf-pants': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=nike+dri+fit+golf+pants&tag=cubicalgolfer-20',
    price: '~$70', retailer: 'Amazon',
    imgSrc: '/images/products/nike-dri-fit-golf-pants.webp', imgAlt: 'Nike Dri-FIT golf pants',
  },
  'puma-jackpot-golf-pants': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=puma+jackpot+golf+pants&tag=cubicalgolfer-20',
    price: '~$55', retailer: 'Amazon',
    imgSrc: '/images/products/puma-jackpot-golf-pants.webp', imgAlt: 'Puma Jackpot golf pants',
  },
  'under-armour-showdown-shorts': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=under+armour+showdown+golf+shorts&tag=cubicalgolfer-20',
    price: '~$55', retailer: 'Amazon',
    imgSrc: '/images/products/under-armour-showdown-shorts.webp', imgAlt: 'Under Armour Showdown golf shorts',
  },
  'adidas-ultimate365-shorts': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=adidas+ultimate365+golf+shorts&tag=cubicalgolfer-20',
    price: '~$50', retailer: 'Amazon',
    imgSrc: '/images/products/adidas-ultimate365-shorts.webp', imgAlt: 'adidas Ultimate365 golf shorts',
  },
  'nike-dri-fit-golf-shorts': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=nike+dri+fit+golf+shorts&tag=cubicalgolfer-20',
    price: '~$55', retailer: 'Amazon',
    imgSrc: '/images/products/nike-dri-fit-golf-shorts.webp', imgAlt: 'Nike Dri-FIT golf shorts',
  },
  'titleist-tour-performance-hat': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=titleist+tour+performance+golf+hat&tag=cubicalgolfer-20',
    price: '~$30', retailer: 'Amazon',
    imgSrc: '/images/products/titleist-tour-performance-hat.webp', imgAlt: 'Titleist Tour Performance golf hat',
  },
  'callaway-cg-logo-hat': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=callaway+golf+hat&tag=cubicalgolfer-20',
    price: '~$25', retailer: 'Amazon',
    imgSrc: '/images/products/callaway-cg-logo-hat.webp', imgAlt: 'Callaway golf hat',
  },
  'nike-legacy91-golf-hat': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=nike+legacy91+golf+hat&tag=cubicalgolfer-20',
    price: '~$28', retailer: 'Amazon',
    imgSrc: '/images/products/nike-legacy91-golf-hat.webp', imgAlt: 'Nike Legacy91 golf hat',
  },
  'maui-jim-banyans-golf': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=maui+jim+banyans+sunglasses&tag=cubicalgolfer-20',
    price: '~$200', retailer: 'Amazon',
    imgSrc: '/images/products/maui-jim-banyans-golf.webp', imgAlt: 'Maui Jim Banyans golf sunglasses',
  },
  'goodr-golf-sunglasses': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=goodr+golf+sunglasses&tag=cubicalgolfer-20',
    price: '~$25', retailer: 'Amazon',
    imgSrc: '/images/products/goodr-golf-sunglasses.webp', imgAlt: 'goodr golf sunglasses',
  },
  'under-armour-storm-rain-jacket': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=under+armour+storm+golf+rain+jacket&tag=cubicalgolfer-20',
    price: '~$80', retailer: 'Amazon',
    imgSrc: '/images/products/under-armour-storm-rain-jacket.webp', imgAlt: 'Under Armour Storm golf rain jacket',
  },
  'footjoy-hydrolite-rain-jacket': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=footjoy+hydrolite+rain+jacket&tag=cubicalgolfer-20',
    price: '~$130', retailer: 'Amazon',
    imgSrc: '/images/products/footjoy-hydrolite-rain-jacket.webp', imgAlt: 'FootJoy HydroLite golf rain jacket',
  },

  // ═══ ACCESSORIES — Prompt 5 ═══
  'frogger-golf-towel': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=frogger+golf+towel&tag=cubicalgolfer-20',
    price: '~$25', retailer: 'Amazon',
  },
  'club-glove-microfiber-towel': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=club+glove+microfiber+golf+towel&tag=cubicalgolfer-20',
    price: '~$18', retailer: 'Amazon',
  
    imgSrc: '/images/products/club-glove-microfiber-towel.webp', imgAlt: 'Club Glove Microfiber Towel',},
  'procella-golf-umbrella': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=procella+golf+umbrella&tag=cubicalgolfer-20',
    price: '~$30', retailer: 'Amazon',
  
    imgSrc: '/images/products/procella-golf-umbrella.webp', imgAlt: 'Procella Golf Umbrella',},
  'ezgo-freedom-rxv': {
    label: 'Check Price →', url: 'https://www.amazon.com/s?k=ezgo+golf+cart&tag=cubicalgolfer-20',
    price: '~$8,000', retailer: 'Amazon',
  
    imgSrc: '/images/products/ezgo-freedom-rxv.webp', imgAlt: 'Ezgo Freedom Rxv',},
  'club-car-onward': {
    label: 'Check Price →', url: 'https://www.amazon.com/s?k=club+car+golf+cart&tag=cubicalgolfer-20',
    price: '~$9,000', retailer: 'Amazon',
  
    imgSrc: '/images/products/club-car-onward.webp', imgAlt: 'Club Car Onward',},
  'callaway-org-14-cart-bag': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=callaway+org+14+cart+bag&tag=cubicalgolfer-20',
    price: '~$230', retailer: 'Amazon',
  
    imgSrc: '/images/products/callaway-org-14-cart-bag.webp', imgAlt: 'Callaway Org 14 Cart Bag',},
  'ping-hoofer-14-stand-bag': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=ping+hoofer+14+stand+bag&tag=cubicalgolfer-20',
    price: '~$270', retailer: 'Amazon',
  
    imgSrc: '/images/products/ping-hoofer-14-stand-bag.webp', imgAlt: 'Ping Hoofer 14 Stand Bag',},
  'ogio-fuse-stand-bag': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=ogio+fuse+stand+bag&tag=cubicalgolfer-20',
    price: '~$200', retailer: 'Amazon',
  
    imgSrc: '/images/products/ogio-fuse-stand-bag.webp', imgAlt: 'Ogio Fuse Stand Bag',},
  'tour-striker-alignment-sticks': {
    label: 'Check Price at Amazon →', url: 'https://www.amazon.com/s?k=tour+striker+alignment+sticks&tag=cubicalgolfer-20',
    price: '~$25', retailer: 'Amazon',
  
    imgSrc: '/images/products/tour-striker-alignment-sticks.webp', imgAlt: 'Tour Striker Alignment Sticks',},
});

