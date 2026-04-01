/**
 * src/lib/image-map.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized image management for all product and article images.
 *
 * ARCHITECTURE:
 *   Product images  → /public/images/products/{id}.svg  (branded SVG illustrations)
 *   Article thumbs  → color + emoji system (CSS art-thumb classes)
 *   Real photos     → /public/images/products/{id}.webp (when available)
 *
 * TO ADD REAL PRODUCT PHOTOS:
 *   1. Place WebP image at /public/images/products/{product-id}.webp
 *   2. Add the product-id to PRODUCTS_WITH_PHOTOS below
 *   3. The getProductImage() function automatically prefers WebP over SVG
 *
 * AMAZON IMAGE POLICY:
 *   Amazon's ToS prohibits hotlinking product images from their CDN.
 *   All product images must be self-hosted. Download originals and convert to WebP.
 *   Recommended: 400×400px WebP at 85% quality (~20-40KB per image).
 *
 * ARTICLE THUMBNAIL SYSTEM:
 *   Art-thumbs are colored divs (CSS classes) with an emoji overlay.
 *   This is intentional — emoji are accessible (aria-hidden), zero-byte, and consistent.
 *   The thumb color is defined per-article in articles.ts (thumb: 'green' | 'brown' | etc.)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Product IDs that have real WebP photos available in /public/images/products/ */
export const PRODUCTS_WITH_PHOTOS: ReadonlySet<string> = new Set([
  // Add product IDs here as real photos become available, e.g.:
  // 'bushnell-tour-v6-shift',
  // 'titleist-pro-v1',
]);

/**
 * Returns the best available image source for a product.
 * Prefers WebP photos over SVG illustrations when available.
 */
export function getProductImage(productId: string): {
  src: string;
  isPhoto: boolean;
  format: 'webp' | 'svg';
} {
  if (PRODUCTS_WITH_PHOTOS.has(productId)) {
    return {
      src: `/images/products/${productId}.webp`,
      isPhoto: true,
      format: 'webp',
    };
  }
  return {
    src: `/images/products/${productId}.svg`,
    isPhoto: false,
    format: 'svg',
  };
}

/**
 * Category-to-hero-image mapping for category index pages.
 * Currently uses CSS gradient backgrounds.
 * Replace values with real image paths when photography is available.
 */
export const CATEGORY_IMAGES: Record<string, { bg: string; alt: string }> = {
  'gear-reviews':         { bg: 'var(--green)',       alt: 'Golf gear on a course' },
  'golf-tech':            { bg: 'var(--navy-badge)',   alt: 'Golf technology devices' },
  'golf-accessories':     { bg: 'var(--brown-badge)',  alt: 'Golf accessories' },
  'improve-game':         { bg: 'var(--purple-badge)', alt: 'Golfer practising' },
  'golf-lifestyle':       { bg: 'var(--teal-badge)',   alt: 'Golf lifestyle' },
};

/**
 * Article emoji semantic mapping.
 * Documents the intended meaning of each emoji used in art-thumb cards.
 * These are aria-hidden decorative elements — changing these is purely aesthetic.
 */
export const ARTICLE_EMOJI_MEANINGS: Record<string, string> = {
  '🏌️': 'Golfer — general golf content',
  '⛳':  'Golf hole — general golf / balls / course',
  '🎯':  'Target — improvement / scoring / technique',
  '🎒':  'Bag — bags / accessories / gear',
  '⌚':  'Watch — GPS watches / wearables',
  '🧤':  'Glove — golf gloves',
  '📊':  'Chart — stats / handicap / data',
  '📡':  'Radar — launch monitors / tech',
  '📱':  'Phone — apps / mobile / software',
  '🤖':  'Robot — AI tools',
  '💰':  'Money — budget / value guides',
  '🌿':  'Plant — lifestyle / wellness',
  '💪':  'Muscle — fitness',
  '🎁':  'Gift — gift guides',
  '👟':  'Shoe — golf shoes',
  '📏':  'Ruler — training aids / measurement',
  '🏗️':  'Construction — build guides / simulators',
  '✋':  'Hand — grip training',
  '🥅':  'Net — indoor nets / practice',
  '📖':  'Book — how-to guides',
};

/**
 * Generates an accessible img element string for a product.
 * For use when rendering product images outside of ProductCard component.
 */
export function productImgAttrs(productId: string, productName: string, size = 400): {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: 'lazy' | 'eager';
} {
  const { src } = getProductImage(productId);
  return {
    src,
    alt: `${productName} product image`,
    width: size,
    height: size,
    loading: 'lazy',
  };
}
