/**
 * src/lib/brand-map.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Explicit brand resolution for Product schema.
 *
 * WHY THIS EXISTS (Round-2 audit finding B7)
 * `brand` was derived by taking the first whitespace token of the product name
 * and title-casing it. On 403 of 492 Product nodes that produced either a
 * truncated multi-word brand ("Scotty" for Scotty Cameron, "Golf" for Golf
 * Pride), destroyed intentional casing ("Sklz", "Eyeline", "Kvv"), or invented a
 * brand for a generic accessory that has none ("Alignment", "Putting",
 * "Magnetic"). Google can reject rich results over a nonsense brand, and it was
 * happening on exactly the pages that monetise.
 *
 * RULES
 *   1. Longest known brand prefix wins  ("Golf Pride MCC Plus4" → Golf Pride).
 *   2. Casing comes from this table, never from title-casing.
 *   3. A generic product with no manufacturer returns undefined, and the caller
 *      MUST omit the brand property rather than emit a junk value.
 *
 * ADDING A BRAND: append to KNOWN_BRANDS using the manufacturer's own casing.
 */

// Manufacturer names in their official casing. Order does not matter — the
// resolver always prefers the longest match.
export const KNOWN_BRANDS: string[] = [
  'Bushnell', 'Precision Pro', 'Blue Tees', 'Nikon', 'Garmin', 'Shot Scope',
  'Callaway', 'TaylorMade', 'Titleist', 'Ping', 'Cobra', 'Cleveland', 'Srixon',
  'Mizuno', 'Wilson', 'Odyssey', 'Scotty Cameron', 'L.A.B. Golf', 'LAB Golf',
  'Evnroll', 'Pinemeadow', 'PXG', 'Bridgestone', 'Vice', 'Maxfli', 'Kirkland Signature',
  'Rapsodo', 'SkyTrak', 'FlightScope', 'Foresight', 'Swing Caddie', 'Voice Caddie',
  'Ernest Sports', 'Square Golf', 'Arccos', 'Blast Motion', 'Zepp', 'Full Swing',
  'FootJoy', 'Nike', 'adidas', 'Puma', 'Under Armour', 'ECCO', 'Skechers',
  'New Balance', 'Galvin Green', 'Zero Restriction', 'Oakley', 'Maui Jim', 'Tifosi',
  'Golf Pride', 'Lamkin', 'SuperStroke', 'Winn',
  'Sun Mountain', 'Ogio', 'OGIO', 'Bag Boy', 'Clicgear', 'CaddyTek', 'KVV', 'MGI',
  'SKLZ', 'EyeLine', 'Eyeline Golf', 'BirdieBall', 'Orange Whip', 'Lag Shot',
  'Tour Striker', 'TheraBand', 'Rypstick', 'The Stack', 'PuttOut', 'Wellputt',
  'Fiberbuilt', 'Rukket', 'Spornia', 'Net Return', 'Carl\'s Place', 'HomeCourse',
  'Country Club Elite', 'BenQ', 'Optoma', 'US Kids Golf', 'Frogger', 'GustBuster',
  'Club Car', 'E-Z-GO', 'EZGO', 'The Grint', '18Birdies', 'Golfshot',
];

// Products with no manufacturer brand. The caller omits `brand` for these
// rather than inventing one from the first word.
const GENERIC = [
  'alignment stick', 'putting mirror', 'putting mat', 'impact tape',
  'magnetic ball marker', 'magnetic hat clip', 'ball marker',
  'personalized golf ball', 'groove cleaning brush', 'microfiber',
  'golf towel', 'golf umbrella', 'foam practice ball', 'mini chipping net',
  'golf themed mug', 'golf stress ball', 'golf mouse pad', 'desktop putting',
  'resistance band', 'grip trainer', 'office putting', 'acoustic foam',
  'golf book', 'golf glove', 'screen protector', 'hitting net', 'hitting mat',
  'putting green', 'practice ball', 'golf gps',
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Resolve a manufacturer brand from a product display name or affiliate key.
 * Returns undefined when the product is generic — callers MUST then omit `brand`.
 */
export function brandFor(nameOrKey?: string): string | undefined {
  if (!nameOrKey) return undefined;
  const readable = nameOrKey.includes('-') && !nameOrKey.includes(' ')
    ? nameOrKey.replace(/-/g, ' ')
    : nameOrKey;
  const n = norm(readable);
  if (!n) return undefined;

  // Longest known brand that the name starts with, or contains as a whole phrase.
  const hit = KNOWN_BRANDS
    .filter(b => { const nb = norm(b); return n === nb || n.startsWith(nb + ' ') || n.includes(' ' + nb + ' '); })
    .sort((a, b) => norm(b).length - norm(a).length)[0];
  if (hit) return hit;

  // Generic accessory — no brand is better than a wrong brand.
  if (GENERIC.some(g => n.includes(g))) return undefined;

  // Unknown single-word name: only treat it as a brand if it looks like a
  // proper noun in the source (i.e. not a plain lowercase generic word).
  const first = readable.trim().split(/\s+/)[0];
  if (first && /^[A-Z0-9]/.test(first) && first.length > 2 && readable.trim().split(/\s+/).length > 1) {
    return undefined; // unknown multi-word product — omit rather than truncate
  }
  return undefined;
}
