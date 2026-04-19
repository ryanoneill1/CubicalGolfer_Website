// src/data/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central TypeScript data model for CubicalGolfer.com
// Version 2.0 — April 2026 — Full consistency system
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
  name:        string;
  bestFor:     string;
  price:       string;
  feature1:    string;
  feature2:    string;
  winner:      boolean;
  affiliateKey?: string;
}

export interface ComparisonTable {
  headers: string[];
  rows:    ComparisonRow[];
}

export interface Section {
  h2:           string;
  badge?:       string;
  body:         string;
  price?:       string;
  pros?:        string[];   // 3–5 bullet points on strengths
  cons?:        string[];   // 2–3 bullet points on weaknesses
  items?:       Array<{ name: string; desc: string; affiliateKey?: string }>;
  rating?:      number;     // 1–5 stars
  ratingCount?: string;     // e.g. "2,847" Amazon reviews
  affiliateKey?: string;    // Direct affiliate key override for this section
}

export interface RelatedLink {
  slug:  string;
  label: string;
}

// ── Core article type ─────────────────────────────────────────────────────────
export interface Article {
  id:            string;      // unique ID
  slug:          string;      // URL path e.g. "/best-golf-rangefinders-2026/"
  category:      Category;
  pageType:      PageType;
  tag:           string;      // "BUYING GUIDE" | "TUTORIAL" | "COMPARISON" etc.
  emoji:         string;
  thumb:         'green' | 'brown' | 'navy' | 'purple' | 'teal' | 'olive';
  words:         string;
  datePublished: string;      // ISO: "2026-01-15"
  dateModified:  string;      // ISO: "2026-03-24"
  title:         string;      // <title> tag (≤60 chars)
  titleDisplay:  string;      // H1 (can be longer)
  description:   string;      // meta description (150–160 chars)
  excerpt:       string;      // card excerpt
  // ── Content fields ──────────────────────────────────────────────────────────
  bottomLine?:   string;      // 2–3 sentence verdict (required for buying-guide)
  intro:         string;      // opening paragraph
  toc:           string[];    // table of contents items
  sections:      Section[];
  comparisonTable?: ComparisonTable;
  whoFor?:       string[];    // "Who should buy" bullets (required for buying-guide)
  whoSkip?:      string[];    // "Who should skip" bullets (required for buying-guide)
  testingNotes?: string;      // Testing methodology summary
  updateLog?:    Array<{ date: string; note: string }>;  // Visible changelog
  sources?:      Array<{ label: string; url: string }>;  // External citation links
  faq?:          FAQItem[];
  related:       RelatedLink[];
  // ── Auto-injected by linking.ts ─────────────────────────────────────────────
  internalLinks?: RelatedLink[];
}

// ── Product type ──────────────────────────────────────────────────────────────
export interface Product {
  id:        string;
  name:      string;
  brand:     string;
  category:  string;
  price:     string;
  priceNum:  number;
  image?:    string;
  affiliate: string;
  rating:    number;
  bestFor:   string;
  pros:      string[];
  cons:      string[];
  specs:     Record<string, string>;
}

// ── Comparison type ───────────────────────────────────────────────────────────
export interface Comparison {
  slug:          string;
  title:         string;
  description:   string;
  productA:      string;
  productB:      string;
  winner:        string;
  winnerReason:  string;
  intro:         string;
  verdict:       string;
  faq:           FAQItem[];
  datePublished: string;
  dateModified:  string;
}

// ── Local page type ───────────────────────────────────────────────────────────
export interface GolfCity {
  slug:          string;
  city:          string;
  state:         string;
  stateFullName: string;
  population:    number;
  courses: Array<{
    name:    string;
    type:    'public' | 'semi-private' | 'resort';
    price:   string;
    holes:   number;
    rating?: string;
    notes:   string;
  }>;
  intro:         string;
  nearbyAirport: string;
  bestSeason:    string;
  dateModified:  string;
}

// ── SEO page metadata ─────────────────────────────────────────────────────────
export interface PageMeta {
  title:         string;
  description:   string;
  canonical:     string;
  ogImage:       string;
  ogType:        'website' | 'article';
  robots:        string;
  datePublished?: string;
  dateModified?:  string;
  breadcrumbs:   Array<{ label: string; href: string }>;
}

// ── Affiliate link type ───────────────────────────────────────────────────────
export interface AffiliateLink {
  label:    string;
  url:      string;
  price?:   string;
  retailer: string;
  imgSrc?:  string;
  imgAlt?:  string;
  benefits?: string[];
}
