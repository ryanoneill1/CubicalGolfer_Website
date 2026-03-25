// src/data/affiliate-links.ts
// ─────────────────────────────────────────────────────────────────────────────
// Amazon affiliate link registry — cubicalgolfer-20
//
// ALL ASINs verified against live Amazon listings (March 2026).
// Format: https://www.amazon.com/dp/[ASIN]/?tag=cubicalgolfer-20
//
// Products NOT on Amazon (direct-to-consumer brands) use search links
// or the brand's own site as noted.
// ─────────────────────────────────────────────────────────────────────────────

export const AFFILIATE: Record<string, {
  url: string;
  retailer: string;
  price: string;
  label: string;
  asin?: string;
}> = {

  // ── RANGEFINDERS ─────────────────────────────────────────────────────────
  // Bushnell Tour V6 Shift — ASIN B0C4PN57LJ (standard unit, no bundle)
  'bushnell-tour-v6-shift': {
    asin: 'B0C4PN57LJ',
    url: 'https://www.amazon.com/dp/B0C4PN57LJ/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$329',
    label: 'Check Price on Amazon',
  },

  // Precision Pro NX9 (HD variant with slope switch) — ASIN B0DP3GL8RN
  'precision-pro-nx9-hd': {
    asin: 'B0DP3GL8RN',
    url: 'https://www.amazon.com/dp/B0DP3GL8RN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price on Amazon',
  },

  // Blue Tees Series 3 Max — search link (ASIN varies by variant)
  'blue-tees-series-3-max': {
    url: 'https://www.amazon.com/s?k=Blue+Tees+Series+3+Max+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // Garmin Approach Z82 — ASIN B085T56B2X (official Garmin listing)
  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // Bushnell Pro XE — search link (current listing ASINs change frequently)
  'bushnell-pro-xe': {
    url: 'https://www.amazon.com/s?k=Bushnell+Pro+XE+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────
  // Garmin Approach S62 Black — ASIN B083BJSYZ9 (official retail unit)
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price on Amazon',
  },

  // Shot Scope V5 — ASIN B0CYT7RJ54
  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },

  // Bushnell Ion Elite — search link
  'bushnell-ion-elite': {
    url: 'https://www.amazon.com/s?k=Bushnell+Ion+Elite+GPS+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────
  // Callaway Paradym AI Smoke Max Driver — search (ASIN varies by shaft/loft)
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },

  // TaylorMade Qi35 Max Driver — search (ASIN varies by shaft/loft)
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Check Price on Amazon',
  },

  // Cobra Aerojet Max Driver — search
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/s?k=Cobra+Aerojet+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price on Amazon',
  },

  // Ping G430 Max Driver — search
  'ping-g430-max': {
    url: 'https://www.amazon.com/s?k=Ping+G430+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Check Price on Amazon',
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────
  // Titleist Pro V1 2025 (current gen) — ASIN B0BR2YF8T6
  'titleist-pro-v1': {
    asin: 'B0BR2YF8T6',
    url: 'https://www.amazon.com/dp/B0BR2YF8T6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'Check Price on Amazon',
  },

  // Callaway Chrome Tour 2026 — search (very new, ASIN not yet settled)
  'callaway-chrome-tour-2026': {
    url: 'https://www.amazon.com/s?k=Callaway+Chrome+Tour+2026+golf+balls&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$58/dozen',
    label: 'Check Price on Amazon',
  },

  // TaylorMade TP5 — search (ASIN varies by color/generation)
  'taylormade-tp5': {
    url: 'https://www.amazon.com/s?k=TaylorMade+TP5+golf+balls+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'Check Price on Amazon',
  },

  // Srixon Soft Feel — search (ASIN varies by dozen size)
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/s?k=Srixon+Soft+Feel+golf+balls+dozen&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'Check Price on Amazon',
  },

  // Vice Pro — direct to consumer, NOT on Amazon as sold by Vice
  // Using Vice Golf direct link as it's their primary channel
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro?aff=cubicalgolfer',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Check Price at Vice Golf',
  },

  // ── IRONS ────────────────────────────────────────────────────────────────
  // Callaway Paradym AI Smoke Max Irons — search (vary by shaft/set config)
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'Check Price on Amazon',
  },

  // Titleist T300 Irons — search
  'titleist-t300': {
    url: 'https://www.amazon.com/s?k=Titleist+T300+irons&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Check Price on Amazon',
  },

  // Wilson D9 Irons — search
  'wilson-d9': {
    url: 'https://www.amazon.com/s?k=Wilson+D9+irons+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'Check Price on Amazon',
  },

  // ── ACCESSORIES & TRAINING AIDS ──────────────────────────────────────────
  // FootJoy WeatherSof Glove — ASIN B072LZV5Z6 (verified, sold by FJ directly)
  'footjoy-weathersof-glove': {
    asin: 'B072LZV5Z6',
    url: 'https://www.amazon.com/dp/B072LZV5Z6/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Check Price on Amazon',
  },

  // Arccos Caddie Smart Sensors (3rd Gen) — ASIN B0B5TW3HNG
  'arccos-caddie-sensors': {
    asin: 'B0B5TW3HNG',
    url: 'https://www.amazon.com/dp/B0B5TW3HNG/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$179 + $99/yr',
    label: 'Check Price on Amazon',
  },

  // Alignment sticks — category search
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks+2+pack&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
  },

  // Golf putting mirror — category search
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror+training+aid&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
  },

  // ── BEGINNER SETS ────────────────────────────────────────────────────────
  // Wilson Profile SGI Men's Complete Set — ASIN B09X2FJ9XX
  'wilson-profile-sgi': {
    asin: 'B09X2FJ9XX',
    url: 'https://www.amazon.com/dp/B09X2FJ9XX/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price on Amazon',
  },

  // Callaway Strata Complete Set — search (ASIN varies by piece count/gender)
  'callaway-strata': {
    url: 'https://www.amazon.com/s?k=Callaway+Strata+complete+golf+set&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },
};

// Helper to get affiliate link — returns search fallback if product not listed
export function getAffiliateLink(productId: string) {
  if (AFFILIATE[productId]) return AFFILIATE[productId];
  // Generic search fallback
  return {
    url: `https://www.amazon.com/s?k=${encodeURIComponent(productId.replace(/-/g, ' '))}&tag=cubicalgolfer-20`,
    retailer: 'Amazon',
    price: 'Check price',
    label: 'Check Price on Amazon',
  };
}
