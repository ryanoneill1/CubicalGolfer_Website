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
// CHANGELOG (April 2026):
//   - All images now use .webp
//   - Added missing keys for compare pages (callaway-paradym, taylormade-qi35)
// ─────────────────────────────────────────────────────────────────────────────

export const AFFILIATE: Record<string, {
  url: string;
  retailer: string;
  price: string;
  label: string;
  asin?: string;
  imgSrc: string;
  imgAlt: string;
  benefits?: string[];
}> = {

  // ── RANGEFINDERS ─────────────────────────────────────────────────────────
  'bushnell-tour-v6-shift': {
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$329',
    label: 'Check Price at Bushnell',
    imgSrc: '/images/products/bushnell-tour-v6-shift.webp',
    imgAlt: 'Bushnell Tour V6 Shift Golf Rangefinder',
    benefits: ['PinSeeker JOLT locks onto flag in <0.3 seconds', 'Slope Switch — legal toggle', '±1 yard accuracy to 1,300 yards'],
  },

  'precision-pro-nx9-hd': {
    asin: 'B0DP3GL8RN',
    url: 'https://www.amazon.com/dp/B0DP3GL8RN/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'See Current Price',
    imgSrc: '/images/products/precision-pro-nx9-hd.webp',
    imgAlt: 'Precision Pro NX9 HD Golf Rangefinder',
    benefits: ['Adaptive slope technology', '1-year battery life', 'Lifetime warranty'],
  },

  'blue-tees-series-3-max': {
    url: 'https://www.amazon.com/s?k=Blue+Tees+Golf+Series+3+Max+rangefinder&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'See Current Price',
    imgSrc: '/images/products/blue-tees-series-3-max.webp',
    imgAlt: 'Blue Tees Series 3 Max Golf Rangefinder',
  },

  'garmin-approach-z82': {
    asin: 'B085T56B2X',
    url: 'https://www.amazon.com/dp/B085T56B2X/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-z82.webp',
    imgAlt: 'Garmin Approach Z82 GPS Laser Rangefinder',
    benefits: ['GPS + laser in one device', 'Live green view', 'Slope-adjusted yardages'],
  },

  'bushnell-pro-xe': {
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$499',
    label: 'Check Price at Bushnell',
    imgSrc: '/images/products/bushnell-pro-xe.webp',
    imgAlt: 'Bushnell Pro XE Golf Rangefinder',
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────
  'garmin-approach-s62': {
    asin: 'B083BJSYZ9',
    url: 'https://www.amazon.com/dp/B083BJSYZ9/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-s62.webp',
    imgAlt: 'Garmin Approach S62 GPS Golf Watch',
    benefits: ['42,000 course database', 'Full-colour touchscreen', 'Automatic shot tracking'],
  },

  'garmin-approach-s42': {
    url: 'https://www.amazon.com/s?k=Garmin+Approach+S42+golf+watch&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
    imgSrc: '/images/products/garmin-approach-s42.webp',
    imgAlt: 'Garmin Approach S42 GPS Golf Watch',
  },

  'shot-scope-v5': {
    asin: 'B0CYT7RJ54',
    url: 'https://www.amazon.com/dp/B0CYT7RJ54/?tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'See Current Price',
    imgSrc: '/images/products/shot-scope-v5.webp',
    imgAlt: 'Shot Scope V5 GPS Golf Watch',
    benefits: ['Automatic shot tracking', 'Performance analytics', '40,000+ courses'],
  },

  'bushnell-ion-elite': {
    url: 'https://bushnell.pxf.io/DWWLOa',
    retailer: 'Bushnell',
    price: '~$149',
    label: 'Check Price at Bushnell',
    imgSrc: '/images/products/bushnell-ion-elite.webp',
    imgAlt: 'Bushnell Ion Elite GPS Golf Watch',
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver+2024&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Driver',
  },

  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-qi35-max.webp',
    imgAlt: 'TaylorMade Qi35 Max Driver',
  },

  // ── Added for the crashing compare page (callaway-paradym-vs-taylormade-qi35) ──
  'callaway-paradym': {
    url: 'https://www.amazon.com/s?k=Callaway+Paradym+AI+Smoke+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'See Current Price',
    imgSrc: '/images/products/callaway-paradym-ai-smoke-max.webp',
    imgAlt: 'Callaway Paradym AI Smoke Max Driver',
  },

  'taylormade-qi35': {
    url: 'https://www.amazon.com/s?k=TaylorMade+Qi35+Max+driver&tag=cubicalgolfer-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'See Current Price',
    imgSrc: '/images/products/taylormade-qi35-max.webp',
    imgAlt: 'TaylorMade Qi35 Max Driver',
  },

  // (rest of your existing entries stay exactly the same — just change .svg to .webp in every imgSrc line)
};

export function getAffiliateLink(id: string) {
  return AFFILIATE[id] ?? null;
}
