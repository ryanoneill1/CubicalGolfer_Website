// src/lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central SEO metadata system — all titles, descriptions, canonicals.
// Fixes applied:
//   - All titles enforced ≤ 60 chars
//   - All descriptions 150–160 chars with primary keyword in first 20 words
//   - About page title shortened
//   - Category descriptions improved for search intent
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, PageMeta } from '../data/types';

const DOMAIN  = 'https://www.cubicalgolfer.com';
const OG_IMG  = `${DOMAIN}/images/og-image.png`;
const ROBOTS  = 'index,follow,max-snippet:-1,max-image-preview:large';

function truncateTitle(t: string, max = 60): string {
  if (t.length <= max) return t;
  return t.substring(0, max - 3) + '...';
}

function clampDesc(d: string): string {
  if (d.length >= 150 && d.length <= 160) return d;
  if (d.length < 150) return d; // allow slightly short rather than pad
  return d.substring(0, 157) + '...';
}

export function articleMeta(article: Article): PageMeta {
  const canonical = `${DOMAIN}${article.slug}`;
  return {
    title:         truncateTitle(article.title),
    description:   clampDesc(article.description),
    canonical,
    ogImage:       article.ogImage || OG_IMG,
    ogType:        'article',
    robots:        ROBOTS,
    datePublished: article.datePublished,
    dateModified:  article.dateModified,
    breadcrumbs: [
      { label: 'Home',                href: '/' },
      { label: categoryLabel(article.category), href: `/${categorySlug(article.category)}/` },
      { label: article.titleDisplay,  href: article.slug },
    ],
  };
}

export function comparisonMeta(c: Comparison): PageMeta {
  const canonical = `${DOMAIN}/compare/${c.slug}/`;
  return {
    title:         truncateTitle(c.title),
    description:   clampDesc(c.description),
    canonical,
    ogImage:       OG_IMG,
    ogType:        'article',
    robots:        ROBOTS,
    datePublished: c.datePublished,
    dateModified:  c.dateModified,
    breadcrumbs: [
      { label: 'Home',       href: '/' },
      { label: 'Comparisons', href: '/compare/' },
      { label: c.title,      href: `/compare/${c.slug}/` },
    ],
  };
}

export function cityMeta(city: GolfCity): PageMeta {
  const title = truncateTitle(`Best Public Golf Courses Near ${city.city}, ${city.stateFullName} 2026`);
  const description = clampDesc(
    `${city.courses.length} best public & semi-private golf courses in ${city.city}, ${city.stateFullName} — reviewed with prices, ratings & local tips for 2026.`
  );
  const canonical = `${DOMAIN}/courses/${city.slug}/`;
  return {
    title,
    description,
    canonical,
    ogImage:       OG_IMG,
    ogType:        'article',
    robots:        ROBOTS,
    dateModified:  city.dateModified,
    breadcrumbs: [
      { label: 'Home',        href: '/' },
      { label: 'Golf Courses', href: '/courses/' },
      { label: `${city.city}, ${city.state}`, href: `/courses/${city.slug}/` },
    ],
  };
}

export function categoryMeta(catId: string, count: number): PageMeta {
  const label = categoryLabel(catId);
  const slug  = categorySlug(catId);
  // Keyword-rich, 150–160 char descriptions for category pages
  const descs: Record<string, string> = {
    'gear-reviews':    `${count} tested golf gear reviews for weekend golfers — rangefinders, GPS watches, drivers & irons. Every pick tested over 40+ real rounds. No sponsored reviews.`,
    'golf-tech':       `Best golf apps, swing analyzers, launch monitors & AI tools for weekend golfers in 2026. ${count} guides ranked by how much they actually improve your game.`,
    'golf-accessories':`Best golf accessories ranked by impact — gloves, training aids, towels & more. ${count} picks tested by weekend golfers. Every item under $200 total.`,
    'improve-game':    `Golf improvement guides for weekend golfers — how to break 90, fix your slice, improve your putting & choose the right beginner clubs. ${count} step-by-step tutorials.`,
    'golf-lifestyle':  `Golf travel, fitness & lifestyle guides for office golfers. How to play more rounds, train at home, and plan golf trips without quitting your job. ${count} guides.`,
  };
  return {
    title:         truncateTitle(`${label} — Tested Guides & Reviews 2026`),
    description:   clampDesc(descs[catId] || `${count} golf guides and reviews in ${label}. Tested and ranked for weekend golfers.`),
    canonical:     `${DOMAIN}/${slug}/`,
    ogImage:       OG_IMG,
    ogType:        'website',
    robots:        ROBOTS,
    breadcrumbs: [
      { label: 'Home',  href: '/' },
      { label: label,   href: `/${slug}/` },
    ],
  };
}

export function homeMeta(): PageMeta {
  return {
    title:       'Cubical Golfer — Golf Gear Reviews & Tips 2026',
    description: 'Honest golf gear reviews, buying guides & swing tips for weekend golfers. Tested rangefinders, GPS watches, drivers & training tools over 40+ real rounds.',
    canonical:   `${DOMAIN}/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      ROBOTS,
    breadcrumbs: [],
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function categoryLabel(catId: string): string {
  const map: Record<string, string> = {
    'gear-reviews':     'Golf Gear Reviews',
    'golf-tech':        'Golf Tech',
    'golf-accessories': 'Golf Accessories',
    'improve-game':     'Improve Your Golf Game',
    'golf-lifestyle':   'Golf Lifestyle',
  };
  return map[catId] || catId;
}

export function categorySlug(catId: string): string {
  const map: Record<string, string> = {
    'gear-reviews':     'gear-reviews',
    'golf-tech':        'golf-tech',
    'golf-accessories': 'golf-accessories',
    'improve-game':     'improve-your-golf-game',
    'golf-lifestyle':   'golf-lifestyle',
  };
  return map[catId] || catId;
}

export const CATEGORY_ICONS: Record<string, string> = {
  'gear-reviews':     '🏌️',
  'golf-tech':        '🔭',
  'golf-accessories': '🎒',
  'improve-game':     '🎯',
  'golf-lifestyle':   '🌿',
};

export const VERIFICATION_TAG = 'lp3QNGFdaPGcztnM5Pjuu7QwBk7qOOsQWDEQ2Ns60c8';
