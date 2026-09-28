// src/data/bag-checklist.ts
// ─────────────────────────────────────────────────────────────────────────────
// The golf bag checklist — 25 items, four tiers, straight off
// /25-golf-accessories-every-golfer-should-own/.
//
// Why this exists
// ───────────────
// That page was "Crawled - currently not indexed": Google fetched it and chose
// not to index. It sits beside /best-golf-accessories-under-50/, /best-golf-
// gear-under-100/, /best-golf-training-aids/ and /best-golf-gifts-for-him/ with
// 33-36% shared vocabulary, and all five are the same thing — a prose list of
// products. Google kept the others.
//
// But this page is not really a "best of" list. It is a COMPLETENESS list: the
// 25 things a bag should contain, tiered by priority. None of the four siblings
// is a checklist, and a checklist is the one format a reader wants on paper,
// standing over an open bag in the garage. That is also the format an AI
// Overview cannot deliver — the same reason the compression chart PDF is the
// site's highest-CTR query at 30.7%.
//
// Every item and price band below is the page's own, lifted from its four
// section bodies. Nothing new is claimed; the data is just freed from prose so
// the page can render a checklist and the build can print one.
// ─────────────────────────────────────────────────────────────────────────────

export interface BagItem {
  item:  string;
  price: string;
  tier:  Tier;
}

export type Tier = 'Essential' | 'Under $50' | 'Worth paying for' | 'Frequent players';

/** Tier order as the page presents them — priority, not alphabetical. */
export const TIERS: Tier[] = ['Essential', 'Under $50', 'Worth paying for', 'Frequent players'];

export const BAG_CHECKLIST: BagItem[] = [
  // The 8 Essentials Every Bag Needs
  { item: 'Golf glove',                      price: '$12–20',        tier: 'Essential' },
  { item: 'Golf balls you trust',            price: '$25–55/dozen',  tier: 'Essential' },
  { item: 'Wooden tees',                     price: '$6–10/pack',    tier: 'Essential' },
  { item: 'Divot tool with ball marker',     price: '$8–12',         tier: 'Essential' },
  { item: 'Microfiber golf towel',           price: '$10–18',        tier: 'Essential' },
  { item: 'A ball marker you can see',       price: '$3–8',          tier: 'Essential' },
  { item: 'Sun protection',                  price: '$15–25',        tier: 'Essential' },
  { item: 'Compact golf umbrella',           price: '$20–35',        tier: 'Essential' },

  // The Next 9 Quality-of-Life Upgrades Under $50
  { item: 'Club groove brush',               price: '$8–12',         tier: 'Under $50' },
  { item: 'Alignment sticks',                price: '$12–15',        tier: 'Under $50' },
  { item: 'Grip enhancer spray or powder',   price: '$8–12',         tier: 'Under $50' },
  { item: 'Golf-specific sunglasses',        price: '$25–40',        tier: 'Under $50' },
  { item: 'Pocket hand warmers',             price: '$8–15/season',  tier: 'Under $50' },
  { item: 'Pencil with a clip',              price: '$3–5',          tier: 'Under $50' },
  { item: 'Telescoping ball retriever',      price: '$15–25',        tier: 'Under $50' },
  { item: 'Rangefinder or GPS app',          price: 'free–$40/yr',   tier: 'Under $50' },
  { item: 'Sharpie for ball marking',        price: '$2',            tier: 'Under $50' },

  // The 5 Worth Paying Real Money For
  { item: 'Stand bag or carry bag',          price: '$120–250',      tier: 'Worth paying for' },
  { item: 'Rangefinder',                     price: '$169–329',      tier: 'Worth paying for' },
  { item: 'Putting mirror',                  price: '$12–25',        tier: 'Worth paying for' },
  { item: 'Waterproof rain jacket',          price: '$60–150',       tier: 'Worth paying for' },
  { item: 'GPS watch',                       price: '$149–449',      tier: 'Worth paying for' },

  // The 3 Nice-to-Haves for Frequent Players
  { item: 'Portable launch monitor',         price: '$499–699',      tier: 'Frequent players' },
  { item: 'Shot tracking sensors',           price: '$179–249/yr',   tier: 'Frequent players' },
  { item: 'Portable Bluetooth speaker',      price: '$25–50',        tier: 'Frequent players' },
];

/** Counts per tier — the page's title claims 25, so the build should prove it. */
export const TIER_COUNTS = TIERS.map(t => ({
  tier:  t,
  count: BAG_CHECKLIST.filter(i => i.tier === t).length,
}));
