// src/data/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central TypeScript data model for the entire CubicalGolfer SEO engine.
// Every programmatic page type derives from these interfaces.
// Adding a new article = add one object to the relevant JSON array.
// ─────────────────────────────────────────────────────────────────────────────

export type Category =
  | 'gear-reviews'
  | 'golf-tech'
  | 'golf-accessories'
  | 'improve-game'
  | 'golf-lifestyle';

export type PageType =
  | 'buying-guide'
  | 'comparison'
  | 'tutorial'
  | 'listicle'
  | 'lifestyle'
  | 'review'
  | 'local';

export interface FAQItem {
  q: string;
  a: string;
}

export interface ComparisonRow {
  name:     string;
  bestFor:  string;
  price:    string;
  feature1: string;
  feature2: string;
  winner:   boolean;
}

export interface ComparisonTable {
  headers: string[];
  rows:    ComparisonRow[];
}

export interface Section {
  h2:     string;
  badge?: string;
  body:   string;
  price?: string;
  items?: Array<{ name: string; desc: string; affiliateKey?: string }>;
  rating?: number;       // 1-5 stars
  ratingCount?: string;  // e.g. "2,847" Amazon reviews
}

export interface RelatedLink {
  slug:  string;
  label: string;
}

// ── Core article type (powers /best/, /how-to/, /gear/, /fix/ routes) ────────
export interface Article {
  id:           string;      // unique ID, also used for internal linking graph
  slug:         string;      // URL path, e.g. "/best-golf-rangefinders-2026/"
  category:     Category;
  pageType:     PageType;
  tag:          string;      // visible badge: "BUYING GUIDE" | "TUTORIAL" etc.
  emoji:        string;
  thumb:        'green' | 'brown' | 'navy' | 'purple' | 'teal' | 'olive';
  words:        string;
  datePublished: string;     // ISO: "2026-01-15"
  dateModified:  string;     // ISO: "2026-03-24"
  title:        string;      // <title> tag (≤60 chars)
  titleDisplay: string;      // visible H1 (can be longer)
  description:  string;      // meta description (150–160 chars)
  excerpt:      string;      // card excerpt
  intro:        string;
  toc:          string[];
  sections:     Section[];
  comparisonTable?: ComparisonTable;
  faq?:         FAQItem[];
  related:      RelatedLink[];
  // Programmatic linking — auto-injected by linking.ts
  internalLinks?: RelatedLink[];
}

// ── Product type (powers /compare/ and affiliate link sections) ──────────────
export interface Product {
  id:        string;
  name:      string;
  brand:     string;
  category:  string;        // "rangefinder" | "gps-watch" | "driver" etc.
  price:     string;
  priceNum:  number;        // for sorting
  image?:    string;
  affiliate: string;        // affiliate link URL
  rating:    number;        // 1–10
  bestFor:   string;
  pros:      string[];
  cons:      string[];
  specs:     Record<string, string>;
}

// ── Comparison type (powers /compare/[a]-vs-[b]/ routes) ────────────────────
export interface Comparison {
  slug:        string;     // "bushnell-tour-v6-vs-precision-pro-nx9"
  title:       string;
  description: string;
  productA:    string;     // Product.id
  productB:    string;     // Product.id
  winner:      string;     // Product.id of recommended pick
  winnerReason: string;
  intro:       string;
  verdict:     string;
  faq:         FAQItem[];
  datePublished: string;
  dateModified:  string;
}

// ── Local page type (powers /courses/[city]/ — programmatic local SEO) ───────
export interface GolfCity {
  slug:          string;   // "chicago-il"
  city:          string;   // "Chicago"
  state:         string;   // "IL"
  stateFullName: string;   // "Illinois"
  population:    number;
  courses: Array<{
    name:     string;
    type:     'public' | 'semi-private' | 'resort';
    price:    string;
    holes:    number;
    rating?:  string;
    notes:    string;
  }>;
  intro:         string;
  nearbyAirport: string;
  bestSeason:    string;
  dateModified:  string;
}

// ── SEO page metadata (computed by seo.ts from Article or other types) ───────
export interface PageMeta {
  title:       string;
  description: string;
  canonical:   string;
  ogImage:     string;
  ogType:      'website' | 'article';
  robots:      string;
  datePublished?: string;
  dateModified?:  string;
  breadcrumbs: Array<{ label: string; href: string }>;
}

// ── Affiliate link type ────────────────────────────────────────────────────────
export interface AffiliateLink {
  label:    string;   // "Buy at Amazon", "See Price at Golf Galaxy"
  url:      string;   // Full affiliate URL with tracking tag
  price?:   string;   // "~$329"
  retailer: string;   // "Amazon", "Golf Galaxy", "Garmin"
  imgSrc?:  string;   // Product image URL
  imgAlt?:  string;   // Alt text for product image
}
