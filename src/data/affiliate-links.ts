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
    asin: 'B0C4PN57LJ',
    url: 'https://www.amazon.com/dp/B0C4PN57LJ/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$329',
    label: 'Check Price on Amazon',
  },

  // Precision Pro NX9 HD (slope switch model) — ASIN B0DP3GL8RN ✅ verified
  'precision-pro-nx9-hd': {
    asin: 'B0DP3GL8RN',
    url: 'https://www.amazon.com/dp/B0DP3GL8RN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price on Amazon',
  },

  // Blue Tees Series 3 Max — search (ASIN varies by colour variant)
  'blue-tees-series-3-max': {
    url: 'https://www.amazon.com/s?k=Blue+Tees+Golf+Series+3+Max+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // Garmin Approach Z82 — ASIN B085T56B2X ✅ verified (official Garmin listing)
  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // Bushnell Pro XE — search (multiple bundle variants)
  'bushnell-pro-xe': {
    url: 'https://www.amazon.com/s?k=Bushnell+Pro+XE+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────

  // Garmin Approach S62 Black — ASIN B083BJSYZ9 ✅ verified (official retail unit)
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price on Amazon',
  },

  // Garmin Approach S42 — search (multiple colourway variants)
  'garmin-approach-s42': {
    url: 'https://www.amazon.com/s?k=Garmin+Approach+S42+golf+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },

  // Shot Scope V5 — ASIN B0CYT7RJ54 ✅ verified
  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },

  // Bushnell Ion Elite — search (colourway/strap variants)
  'bushnell-ion-elite': {
    url: 'https://www.amazon.com/s?k=Bushnell+Ion+Elite+GPS+golf+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max (2024) — search (shaft/loft variants)
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // TaylorMade Qi35 Max (2025) — search (shaft/loft variants)
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Check Price on Amazon',
  },

  // Cobra Aerojet Max — search (shaft/loft variants)
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/s?k=Cobra+Aerojet+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price on Amazon',
  },

  // Ping G430 Max Driver — search (shaft/loft variants)
  'ping-g430-max-driver': {
    url: 'https://www.amazon.com/s?k=Ping+G430+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Check Price on Amazon',
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────

  // Titleist Pro V1 (2025 gen, 25th anniversary) — ASIN B0BR2YF8T6 ✅ verified
  'titleist-pro-v1': {
    asin: 'B0BR2YF8T6',
    url: 'https://www.amazon.com/dp/B0BR2YF8T6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'Check Price on Amazon',
  },

  // Callaway Chrome Tour 2026 — search (very new Jan 2026, single ASIN not yet stable)
  'callaway-chrome-tour-2026': {
    url: 'https://www.amazon.com/s?k=Callaway+Chrome+Tour+2026+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$58/dozen',
    label: 'Check Price on Amazon',
  },

  // TaylorMade TP5 2024 — search (colour/generation variants)
  'taylormade-tp5': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5+golf+balls+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'Check Price on Amazon',
  },

  // Srixon Soft Feel — search (dozen size variants)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=Srixon+Soft+Feel+golf+balls+dozen&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'Check Price on Amazon',
  },

  // Vice Pro — sold direct-to-consumer; not on Amazon as brand-sold
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Check Price at Vice Golf',
  },

  // Callaway Supersoft (mentioned in FAQ of balls page)
  'callaway-supersoft': {
    url: 'https://www.amazon.com/s?k=Callaway+Supersoft+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25/dozen',
    label: 'Check Price on Amazon',
  },

  // ── IRONS ────────────────────────────────────────────────────────────────

  // Callaway Paradym AI Smoke Max Irons (2024) — search (shaft/set config)
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+irons+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'Check Price on Amazon',
  },

  // Titleist T300 Irons — search (shaft variants)
  'titleist-t300': {
    url: 'https://www.amazon.com/s?k=Titleist+T300+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Check Price on Amazon',
  },

  // Titleist T100 Irons — search (shaft variants)
  'titleist-t100': {
    url: 'https://www.amazon.com/s?k=Titleist+T100+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$1,099',
    label: 'Check Price on Amazon',
  },

  // Ping G430 Irons — search (shaft variants)
  'ping-g430-irons': {
    url: 'https://www.amazon.com/s?k=Ping+G430+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Check Price on Amazon',
  },

  // Wilson D9 Irons — search (shaft variants)
  'wilson-d9-irons': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'Check Price on Amazon',
  },

  // ── BEGINNER SETS ─────────────────────────────────────────────────────────

  // Wilson Profile SGI Men's Complete Set — ASIN B09X2FJ9XX ✅ verified
  'wilson-profile-sgi': {
    asin: 'B09X2FJ9XX',
    url: 'https://www.amazon.com/dp/B09X2FJ9XX/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price on Amazon',
  },

  // Callaway Strata Complete Set — search (varies by piece count / gender)
  'callaway-strata': {
    url: 'https://www.amazon.com/s?k=Callaway+Strata+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },

  // TaylorMade RBZ Speed Lite — search (current model name varies by year)
  'taylormade-rbz-lite': {
    url: 'https://www.amazon.com/s?k=TaylorMade+RBZ+Speed+Lite+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // ── GLOVES ───────────────────────────────────────────────────────────────

  // FootJoy WeatherSof — ASIN B072LZV5Z6 ✅ verified (sold by FJ directly)
  'footjoy-weathersof-glove': {
    asin: 'B072LZV5Z6',
    url: 'https://www.amazon.com/dp/B072LZV5Z6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Check Price on Amazon',
  },

  // Titleist Players Flex — search (size/hand variants prevent single ASIN)
  // FIXED: Previously this incorrectly pointed to FootJoy WeatherSof (B072LZV5Z6).
  'titleist-players-flex': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+Flex+golf+glove+mens&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$22',
    label: 'Check Price on Amazon',
  },

  // Callaway Dawn Patrol Glove — search (size variants)
  'callaway-dawn-patrol': {
    url: 'https://www.amazon.com/s?k=Callaway+Dawn+Patrol+golf+glove&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'Check Price on Amazon',
  },

  // FootJoy RainGrip (mentioned in accessories-50 page)
  'footjoy-raingrip': {
    url: 'https://www.amazon.com/s?k=FootJoy+RainGrip+golf+gloves&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$16/pair',
    label: 'Check Price on Amazon',
  },

  // ── TECH / LAUNCH MONITORS / ANALYZERS ───────────────────────────────────

  // Arccos Caddie Smart Sensors (3rd Gen) — ASIN B0B5TW3HNG ✅ verified
  'arccos-caddie-sensors': {
    asin: 'B0B5TW3HNG',
    url: 'https://www.amazon.com/dp/B0B5TW3HNG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179 + $99/yr',
    label: 'Check Price on Amazon',
  },

  // Rapsodo MLM2PRO — ASIN B0BTPZMCSF ✅ verified
  // FIXED: Was incorrectly mapped to arccos-caddie-sensors (B0B5TW3HNG).
  'rapsodo-mlm2pro': {
    asin: 'B0BTPZMCSF',
    url: 'https://www.amazon.com/dp/B0BTPZMCSF/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$699',
    label: 'Check Price on Amazon',
  },

  // Blast Motion Golf Swing & Stroke Analyzer — ASIN B00UNFHKUK ✅ verified
  'blast-motion-sensor': {
    asin: 'B00UNFHKUK',
    url: 'https://www.amazon.com/dp/B00UNFHKUK/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$99',
    label: 'Check Price on Amazon',
  },

  // Swing Caddie SC4 PRO (2024/2025 model) — ASIN B0DK24YKBD ✅ verified
  // NOTE: The article previously said "SC4" but the current product is the SC4 PRO.
  //       Body text and article data have been updated to reflect this.
  'swing-caddie-sc4-pro': {
    asin: 'B0DK24YKBD',
    url: 'https://www.amazon.com/dp/B0DK24YKBD/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // SkyTrak+ Launch Monitor — search (primarily sold direct / specialty retail)
  'skytrak-plus': {
    url: 'https://www.amazon.com/s?k=SkyTrak+plus+golf+launch+monitor+simulator&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$2,995',
    label: 'Check Price on Amazon',
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────

  // Alignment sticks 2-pack
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks+2+pack+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
  },

  // Groove cleaning brush
  'groove-cleaning-brush': {
    url: 'https://www.amazon.com/s?k=golf+groove+cleaning+brush&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
  },

  // Magnetic hat clip ball markers
  'magnetic-ball-markers': {
    url: 'https://www.amazon.com/s?k=magnetic+golf+hat+clip+ball+marker+3+pack&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$8',
    label: 'See Options on Amazon',
  },

  // Frogger Amphibian Golf Towel
  'frogger-amphibian-towel': {
    url: 'https://www.amazon.com/s?k=Frogger+Amphibian+golf+towel&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Check Price on Amazon',
  },

  // Putting mirror
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
  },

  // Impact tape / face stickers
  'impact-tape': {
    url: 'https://www.amazon.com/s?k=golf+impact+face+tape+stickers&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
  },

  // Eyeline Golf Edge Putting Cup
  'eyeline-putting-cup': {
    url: 'https://www.amazon.com/s?k=Eyeline+Golf+Edge+putting+cup&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$35',
    label: 'Check Price on Amazon',
  },

  // Gustbuster Pro Series umbrella
  'gustbuster-umbrella': {
    url: 'https://www.amazon.com/s?k=Gustbuster+Pro+Series+golf+umbrella&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$45',
    label: 'Check Price on Amazon',
  },
  // ── PUTTERS ───────────────────────────────────────────────────────────────
  'odyssey-white-hot-og': {
    url: 'https://www.amazon.com/s?k=Odyssey+White+Hot+OG+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$199', label: 'Check Price on Amazon',
  },
  'scotty-cameron-phantom': {
    url: 'https://www.amazon.com/s?k=Scotty+Cameron+Phantom+X+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$399', label: 'Check Price on Amazon',
  },
  'cleveland-hb-soft-milled': {
    url: 'https://www.amazon.com/s?k=Cleveland+HB+Soft+Milled+putter&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'Check Price on Amazon',
  },
  'taylormade-spider-tour': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Spider+Tour+putter+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$349', label: 'Check Price on Amazon',
  },

  // ── GOLF BAGS ─────────────────────────────────────────────────────────────
  'sun-mountain-25-plus': {
    url: 'https://www.amazon.com/s?k=Sun+Mountain+2.5+Plus+carry+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$249', label: 'Check Price on Amazon',
  },
  'titleist-players-4': {
    url: 'https://www.amazon.com/s?k=Titleist+Players+4+StaDry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$279', label: 'Check Price on Amazon',
  },
  'callaway-fairway-14': {
    url: 'https://www.amazon.com/s?k=Callaway+Fairway+14+cart+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$179', label: 'Check Price on Amazon',
  },
  'callaway-chev-dry': {
    url: 'https://www.amazon.com/s?k=Callaway+Chev+Dry+stand+bag&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$129', label: 'Check Price on Amazon',
  },

  // ── GOLF BALLS (additional) ───────────────────────────────────────────────
  'titleist-pro-v1x': {
    url: 'https://www.amazon.com/s?k=Titleist+Pro+V1x+golf+balls+2025&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$55/dozen', label: 'Check Price on Amazon',
  },

  // ── GOLF SHOES ────────────────────────────────────────────────────────────
  'footjoy-flex-xp': {
    url: 'https://www.amazon.com/s?k=FootJoy+Flex+XP+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$120', label: 'Check Price on Amazon',
  },
  'ecco-biom-c4': {
    url: 'https://www.amazon.com/s?k=ECCO+Biom+C4+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$220', label: 'Check Price on Amazon',
  },
  'skechers-go-golf': {
    url: 'https://www.amazon.com/s?k=Skechers+Go+Golf+Pro+5+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$85', label: 'Check Price on Amazon',
  },
  'footjoy-tour-alpha': {
    url: 'https://www.amazon.com/s?k=FootJoy+Tour+Alpha+golf+shoes&tag=cubicalgolfer-20',
    retailer: 'Amazon', price: '~$200', label: 'Check Price on Amazon',
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
    label: 'Check Price on Amazon',
  };
}
