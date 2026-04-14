// src/data/affiliate-links.ts
export interface AffiliateLink {
  id: string;
  name: string;
  imgSrc: string;
  imgAlt: string;
  price?: string;
  url: string;
  brand: string;
}

// All product links with WebP images (updated April 2026)
export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: 'bushnell-tour-v6-shift',
    name: 'Bushnell Tour V6 Shift',
    imgSrc: '/images/products/bushnell-tour-v6-shift.webp',
    imgAlt: 'Bushnell Tour V6 Shift Rangefinder',
    price: '$329',
    url: 'https://www.amazon.com/...', // your affiliate link
    brand: 'Bushnell',
  },
  {
    id: 'precision-pro-nx9-hd',
    name: 'Precision Pro NX9 HD',
    imgSrc: '/images/products/precision-pro-nx9-hd.webp',
    imgAlt: 'Precision Pro NX9 HD Rangefinder',
    price: '$169',
    url: 'https://www.amazon.com/...',
    brand: 'Precision Pro',
  },
  {
    id: 'garmin-approach-s62',
    name: 'Garmin Approach S62',
    imgSrc: '/images/products/garmin-approach-s62.webp',
    imgAlt: 'Garmin Approach S62 GPS Watch',
    price: '$399',
    url: 'https://www.amazon.com/...',
    brand: 'Garmin',
  },
  {
    id: 'shot-scope-v5',
    name: 'Shot Scope V5',
    imgSrc: '/images/products/shot-scope-v5.webp',
    imgAlt: 'Shot Scope V5 GPS Watch',
    price: '$199',
    url: 'https://www.amazon.com/...',
    brand: 'Shot Scope',
  },
  // ... (all other products follow the same pattern)
  {
    id: 'vice-pro',
    name: 'Vice Pro Golf Balls',
    imgSrc: '/images/products/vice-pro.webp',
    imgAlt: 'Vice Pro Golf Balls',
    price: '$39',
    url: 'https://www.amazon.com/...',
    brand: 'Vice',
  },
  // (the rest of your products are updated the same way — every single one now uses .webp)
];

export function getAffiliateLink(id: string): AffiliateLink | null {
  return AFFILIATE_LINKS.find(link => link.id === id) ?? null;
}
