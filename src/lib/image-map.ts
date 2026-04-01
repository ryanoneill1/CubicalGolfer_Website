/**
 * src/lib/image-map.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized product image routing.
 *
 * IMAGE FORMAT: WebP  (400 × 400 px, 85% quality)
 * IMAGE PATH:   /public/images/products/{product-id}.webp
 *
 * HOW TO ADD REAL PHOTOS:
 *   1. Download product photo (any format)
 *   2. Resize to 400×400, export as WebP 85%
 *   3. Name it exactly: {product-id}.webp  (e.g. titleist-pro-v1.webp)
 *   4. Upload to /public/images/products/ in GitHub
 *   5. Done — the site uses it automatically, no code changes needed
 *
 * FALLBACK CHAIN (in ProductCard.astro):
 *   WebP photo  →  emoji (if image fails to load)
 *
 * ALL 57 PRODUCT IDs:
 * ─────────────────────────────────────────────────────────────────────────────
 * RANGEFINDERS:  bushnell-tour-v6-shift, precision-pro-nx9-hd,
 *                blue-tees-series-3-max, garmin-approach-z82,
 *                bushnell-pro-xe, bushnell-ion-elite
 *
 * GPS WATCHES:   garmin-approach-s62, garmin-approach-s42, shot-scope-v5
 *
 * DRIVERS:       callaway-paradym-ai-smoke-max, taylormade-qi35-max,
 *                cobra-aerojet-max, ping-g430-max-driver
 *
 * IRONS:         callaway-paradym-ai-smoke-max-irons, titleist-t300,
 *                titleist-t100, ping-g430-irons, wilson-d9-irons,
 *                wilson-profile-sgi, callaway-strata, taylormade-rbz-lite
 *
 * GOLF BALLS:    titleist-pro-v1, titleist-pro-v1x, taylormade-tp5,
 *                callaway-chrome-tour-2026, srixon-soft-feel,
 *                callaway-supersoft, vice-pro
 *
 * PUTTERS:       odyssey-white-hot-og, scotty-cameron-phantom,
 *                cleveland-hb-soft-milled, taylormade-spider-tour
 *
 * BAGS:          sun-mountain-25-plus, titleist-players-4,
 *                callaway-fairway-14, callaway-chev-dry
 *
 * GLOVES:        footjoy-weathersof-glove, titleist-players-flex,
 *                callaway-dawn-patrol, footjoy-raingrip
 *
 * SHOES:         footjoy-flex-xp, ecco-biom-c4, skechers-go-golf,
 *                footjoy-tour-alpha
 *
 * TECH:          arccos-caddie-sensors, rapsodo-mlm2pro, blast-motion-sensor,
 *                swing-caddie-sc4-pro, skytrak-plus
 *
 * ACCESSORIES:   alignment-sticks, groove-cleaning-brush, magnetic-ball-markers,
 *                frogger-amphibian-towel, putting-mirror, impact-tape,
 *                eyeline-putting-cup, gustbuster-umbrella
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Returns the WebP image path for a product.
 * Replace the .webp file in /public/images/products/ to update the image.
 */
export function getProductImage(productId: string): string {
  return `/images/products/${productId}.webp`;
}

/**
 * All 57 product IDs — for reference and validation.
 */
export const ALL_PRODUCT_IDS: readonly string[] = [
  // Rangefinders
  'bushnell-tour-v6-shift', 'precision-pro-nx9-hd', 'blue-tees-series-3-max',
  'garmin-approach-z82', 'bushnell-pro-xe', 'bushnell-ion-elite',
  // GPS Watches
  'garmin-approach-s62', 'garmin-approach-s42', 'shot-scope-v5',
  // Drivers
  'callaway-paradym-ai-smoke-max', 'taylormade-qi35-max', 'cobra-aerojet-max', 'ping-g430-max-driver',
  // Irons
  'callaway-paradym-ai-smoke-max-irons', 'titleist-t300', 'titleist-t100',
  'ping-g430-irons', 'wilson-d9-irons', 'wilson-profile-sgi', 'callaway-strata', 'taylormade-rbz-lite',
  // Golf Balls
  'titleist-pro-v1', 'titleist-pro-v1x', 'taylormade-tp5', 'callaway-chrome-tour-2026',
  'srixon-soft-feel', 'callaway-supersoft', 'vice-pro',
  // Putters
  'odyssey-white-hot-og', 'scotty-cameron-phantom', 'cleveland-hb-soft-milled', 'taylormade-spider-tour',
  // Bags
  'sun-mountain-25-plus', 'titleist-players-4', 'callaway-fairway-14', 'callaway-chev-dry',
  // Gloves
  'footjoy-weathersof-glove', 'titleist-players-flex', 'callaway-dawn-patrol', 'footjoy-raingrip',
  // Shoes
  'footjoy-flex-xp', 'ecco-biom-c4', 'skechers-go-golf', 'footjoy-tour-alpha',
  // Tech
  'arccos-caddie-sensors', 'rapsodo-mlm2pro', 'blast-motion-sensor', 'swing-caddie-sc4-pro', 'skytrak-plus',
  // Accessories
  'alignment-sticks', 'groove-cleaning-brush', 'magnetic-ball-markers', 'frogger-amphibian-towel',
  'putting-mirror', 'impact-tape', 'eyeline-putting-cup', 'gustbuster-umbrella',
];
