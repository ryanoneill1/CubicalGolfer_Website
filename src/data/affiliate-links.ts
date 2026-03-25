// src/data/affiliate-links.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central affiliate link registry.
// Replace the URLs below with your actual Amazon Associates / partner links.
// Format: https://www.amazon.com/dp/[ASIN]?tag=YOUR_ASSOCIATE_TAG
//
// HOW TO GET YOUR LINKS:
//   1. Join Amazon Associates: https://affiliate-program.amazon.com
//   2. Search for each product on Amazon
//   3. Use the "Get Link" button in your Associates toolbar
//   4. Replace each placeholder URL below with your actual tagged link
//
// Other affiliate programs to join:
//   - Golf Galaxy: https://www.golfgalaxy.com/affiliates
//   - Global Golf: https://www.globalgolf.com/affiliate-program
//   - PGA Superstore: via ShareASale
// ─────────────────────────────────────────────────────────────────────────────

export const AFFILIATE: Record<string, { url: string; retailer: string; price: string; label: string }> = {
  // ── RANGEFINDERS ─────────────────────────────────────────────────────────
  'bushnell-tour-v6-shift': {
    url: 'https://www.amazon.com/dp/B0BPH5SN3S?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$329',
    label: 'Check Price on Amazon',
  },
  'precision-pro-nx9-hd': {
    url: 'https://www.amazon.com/dp/B0BG56WMFR?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$169',
    label: 'Check Price on Amazon',
  },
  'garmin-approach-z82': {
    url: 'https://www.amazon.com/dp/B08BY43VKK?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },
  'bushnell-pro-xe': {
    url: 'https://www.amazon.com/dp/B07G1X9NNY?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },
  'blue-tees-series-3-max': {
    url: 'https://www.amazon.com/dp/B09NXTTKRB?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // ── GPS WATCHES ──────────────────────────────────────────────────────────
  'garmin-approach-s62': {
    url: 'https://www.amazon.com/dp/B083NJ9G9L?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$399',
    label: 'Check Price on Amazon',
  },
  'shot-scope-v5': {
    url: 'https://www.amazon.com/dp/B0CM3QWPK5?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },
  'bushnell-ion-elite': {
    url: 'https://www.amazon.com/dp/B0B58D3VFR?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$149',
    label: 'Check Price on Amazon',
  },

  // ── DRIVERS ──────────────────────────────────────────────────────────────
  'callaway-paradym-ai-smoke-max': {
    url: 'https://www.amazon.com/dp/B0CPRPXSK4?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$499',
    label: 'Check Price on Amazon',
  },
  'taylormade-qi35-max': {
    url: 'https://www.amazon.com/dp/B0DHYQ5SHM?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$599',
    label: 'Check Price on Amazon',
  },
  'cobra-aerojet-max': {
    url: 'https://www.amazon.com/dp/B0BS9N85BM?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$349',
    label: 'Check Price on Amazon',
  },
  'ping-g430-max': {
    url: 'https://www.amazon.com/dp/B0BX6QZ1YW?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$449',
    label: 'Check Price on Amazon',
  },

  // ── GOLF BALLS ───────────────────────────────────────────────────────────
  'titleist-pro-v1': {
    url: 'https://www.amazon.com/dp/B0CQQ7L7BY?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'Check Price on Amazon',
  },
  'callaway-chrome-tour-2026': {
    url: 'https://www.amazon.com/dp/B0DNCCLKG5?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$58/dozen',
    label: 'Check Price on Amazon',
  },
  'taylormade-tp5': {
    url: 'https://www.amazon.com/dp/B0CX2VH5GB?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$50/dozen',
    label: 'Check Price on Amazon',
  },
  'srixon-soft-feel': {
    url: 'https://www.amazon.com/dp/B0CX2V7XNT?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$27/dozen',
    label: 'Check Price on Amazon',
  },
  'vice-pro': {
    url: 'https://www.vicegolf.com/collections/golf-balls/products/vice-pro',
    retailer: 'Vice Golf',
    price: '~$33/dozen',
    label: 'Check Price at Vice Golf',
  },
  'bridgestone-tour-bx': {
    url: 'https://www.amazon.com/dp/B0DH7T5W7V?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$55/dozen',
    label: 'Check Price on Amazon',
  },

  // ── IRONS ────────────────────────────────────────────────────────────────
  'callaway-paradym-ai-smoke-max-irons': {
    url: 'https://www.amazon.com/dp/B0CQXKVZKB?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: 'from ~$899',
    label: 'Check Price on Amazon',
  },
  'titleist-t300': {
    url: 'https://www.amazon.com/dp/B0CQXL5TP7?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: 'from ~$999',
    label: 'Check Price on Amazon',
  },
  'wilson-d9': {
    url: 'https://www.amazon.com/dp/B09BVB2DFL?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: 'from ~$599',
    label: 'Check Price on Amazon',
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────
  'footjoy-weathersof-glove': {
    url: 'https://www.amazon.com/dp/B07CW2DCVP?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$18',
    label: 'Check Price on Amazon',
  },
  'arccos-caddie-sensors': {
    url: 'https://www.amazon.com/dp/B07PL1G5NN?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$179',
    label: 'Check Price on Amazon',
  },
  'alignment-sticks': {
    url: 'https://www.amazon.com/s?k=golf+alignment+sticks&tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$12',
    label: 'See Options on Amazon',
  },
  'putting-mirror': {
    url: 'https://www.amazon.com/s?k=golf+putting+mirror&tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$25',
    label: 'See Options on Amazon',
  },

  // ── BEGINNER SETS ─────────────────────────────────────────────────────────
  'wilson-profile-sgi': {
    url: 'https://www.amazon.com/dp/B0BV8YH2XP?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$299',
    label: 'Check Price on Amazon',
  },
  'callaway-strata': {
    url: 'https://www.amazon.com/dp/B00L5WJAQY?tag=YOURTAG-20',
    retailer: 'Amazon',
    price: '~$249',
    label: 'Check Price on Amazon',
  },
};

// Helper to get affiliate link or return placeholder
export function getAffiliateLink(productId: string) {
  return AFFILIATE[productId] || {
    url: `https://www.amazon.com/s?k=${productId.replace(/-/g, '+')}&tag=YOURTAG-20`,
    retailer: 'Amazon',
    price: 'Check price',
    label: 'Check Price on Amazon',
  };
}
