// src/lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central SEO metadata system.
// Every page type gets consistent, optimised metadata from one place.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, PageMeta } from '../data/types';

const DOMAIN  = 'https://www.cubicalgolfer.com';
const OG_IMG  = `${DOMAIN}/images/og-image.png`;
const ROBOTS  = 'index,follow,max-snippet:-1,max-image-preview:large';

// ── Title helpers ─────────────────────────────────────────────────────────────

/** Ensure title is ≤60 chars */
function truncateTitle(t: string, max = 60): string {
  if (t.length <= max) return t;
  return t.substring(0, max - 3) + '...';
}

/** Ensure description is 150–160 chars */
function clampDesc(d: string): string {
  if (d.length <= 160) return d;
  return d.substring(0, 157) + '...';
}

// ── Page meta generators ──────────────────────────────────────────────────────

export function articleMeta(article: Article): PageMeta {
  const canonical = `${DOMAIN}${article.slug}`;
  return {
    title:         truncateTitle(article.title),
    description:   clampDesc(article.description),
    canonical,
    ogImage:       OG_IMG,
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
  const title = truncateTitle(`Best Golf Courses in ${city.city}, ${city.state} (2026 Guide)`);
  const description = clampDesc(
    `The best public & semi-private golf courses in ${city.city}, ${city.stateFullName} in 2026. Prices, ratings, and which courses are worth your time.`
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
  const descs: Record<string, string> = {
    'gear-reviews':    'Tested golf gear reviews for weekend golfers — rangefinders, GPS watches, drivers, irons & bags. Every pick tested over 40+ real rounds.',
    'golf-tech':       'Best golf apps, swing analyzers, launch monitors & AI tools for weekend golfers in 2026. Ranked by how much they improve your game.',
    'golf-accessories':'Best golf accessories ranked by weekend golfers — gloves, towels, training aids & more. Every pick tested, under $200 total.',
    'improve-game':    'Golf improvement guides for weekend golfers — how to break 90, fix your slice, build a short game, and choose the right beginner setup.',
    'golf-lifestyle':  'Golf travel, fitness & lifestyle content for office golfers balancing work, family and a Saturday tee time.',
  };
  return {
    title:         truncateTitle(`${label} — Golf Guides & Reviews 2026`),
    description:   clampDesc(descs[catId] || `${count} golf guides and reviews in ${label}.`),
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
    title:       'Cubical Golfer – Golf Gear Reviews & Tips 2026',
    description: 'Honest golf gear reviews, buying guides, and swing tips for weekend golfers. Tested rangefinders, GPS watches, drivers & more over 40+ real rounds.',
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
