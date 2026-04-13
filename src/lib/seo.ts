// src/lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised meta-tag and breadcrumb generator for every page type.
// Consumed by [...slug].astro, compare/[slug].astro, and static pages.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, PageMeta } from '../data/types';

const DOMAIN           = 'https://www.cubicalgolfer.com';

// ── Google Search Console verification tag ─────────────────────────────────
// Add your GSC verification code here (found in GSC → Settings → Ownership → HTML tag).
// The BaseLayout renders this as: <meta name="google-site-verification" content={VERIFICATION_TAG} />
export const VERIFICATION_TAG = '';   // ← paste your GSC code here if needed
const OG_IMG  = `${DOMAIN}/images/og-image.jpg`;
const SITE    = 'Cubical Golfer';

// ── Home ─────────────────────────────────────────────────────────────────────
export function homeMeta(): PageMeta {
  return {
    title:       'Cubical Golfer — Gear Reviews & Tips for Weekend Golfers',
    description: 'Honest golf gear reviews, buying guides, and improvement tips for weekend golfers. No fluff — just what actually works on the course.',
    canonical:   `${DOMAIN}/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [{ label: 'Home', href: '/' }],
  };
}

// ── Article (buying-guide, tutorial, listicle, comparison, lifestyle) ─────────
export function articleMeta(article: Article): PageMeta {
  const canonical = `${DOMAIN}${article.slug}`;
  return {
    title:         article.title,
    description:   article.description,
    canonical,
    ogImage:       OG_IMG,
    ogType:        'article',
    robots:        'index, follow',
    datePublished: article.datePublished,
    dateModified:  article.dateModified,
    breadcrumbs: [
      { label: 'Home',                 href: '/' },
      { label: categoryLabel(article.category), href: `/${categorySlug(article.category)}/` },
      { label: article.titleDisplay,   href: article.slug },
    ],
  };
}

// ── Comparison page ───────────────────────────────────────────────────────────
export function comparisonMeta(c: Comparison): PageMeta {
  const canonical = `${DOMAIN}/compare/${c.slug}/`;
  return {
    title:         `${c.title} | ${SITE}`,
    description:   c.description,
    canonical,
    ogImage:       OG_IMG,
    ogType:        'article',
    robots:        'index, follow',
    datePublished: c.datePublished,
    dateModified:  c.dateModified,
    breadcrumbs: [
      { label: 'Home',        href: '/' },
      { label: 'Comparisons', href: '/compare/' },
      { label: c.title,       href: `/compare/${c.slug}/` },
    ],
  };
}

// ── About / static pages ──────────────────────────────────────────────────────
export function staticMeta(opts: {
  title:       string;
  description: string;
  slug:        string;
  breadcrumb?: string;
}): PageMeta {
  return {
    title:       `${opts.title} | ${SITE}`,
    description: opts.description,
    canonical:   `${DOMAIN}${opts.slug}`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: opts.breadcrumb ?? opts.title, href: opts.slug },
    ],
  };
}

// ── City / golf courses page ─────────────────────────────────────────────────
export function cityMeta(city: GolfCity): PageMeta {
  const title       = `Best Golf Courses in ${city.city}, ${city.state} (2026 Guide)`;
  const description = `The best public, semi-private, and resort golf courses in ${city.city}, ${city.state}. Reviewed and ranked for weekend golfers in 2026.`;
  const canonical   = `${DOMAIN}/courses/${city.slug}/`;
  return {
    title,
    description,
    canonical,
    ogImage:      OG_IMG,
    ogType:       'article',
    robots:       'index, follow',
    dateModified: city.dateModified,
    breadcrumbs: [
      { label: 'Home',                       href: '/' },
      { label: 'Golf Courses by City',        href: '/courses/' },
      { label: `${city.city}, ${city.state}`, href: `/courses/${city.slug}/` },
    ],
  };
}

// ── Courses index page ────────────────────────────────────────────────────────
export function coursesMeta(): PageMeta {
  return {
    title:       'Best Golf Courses by City — Weekend Golfer Picks 2026',
    description: 'The best public and semi-private golf courses in major US cities, reviewed and ranked for weekend golfers.',
    canonical:   `${DOMAIN}/courses/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [
      { label: 'Home',                href: '/' },
      { label: 'Golf Courses by City', href: '/courses/' },
    ],
  };
}


// ── Category index pages ──────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { label: string; slug: string; description: string }> = {
  'gear-reviews':     { label: 'Golf Gear Reviews', slug: 'gear-reviews',          description: 'Independent golf gear reviews and buying guides for weekend golfers — rangefinders, GPS watches, irons, drivers, and more. Tested over 40+ real rounds.' },
  'golf-tech':        { label: 'Golf Tech',          slug: 'golf-tech',             description: 'Golf apps, swing analyzers, launch monitors, and AI training tools reviewed for weekend golfers in 2026.' },
  'golf-accessories': { label: 'Golf Accessories',   slug: 'golf-accessories',      description: 'The best affordable golf accessories for weekend golfers — gloves, bags, training aids, and everything else under $50.' },
  'improve-game':     { label: 'Improve Your Game',  slug: 'improve-your-golf-game',description: 'Practical tips and guides to help weekend golfers break 90, fix their slice, and lower their handicap faster.' },
  'golf-lifestyle':   { label: 'Golf Lifestyle',     slug: 'golf-lifestyle',        description: 'Golf fitness, gift guides, course recommendations, and everything else for the office golfer who plays on weekends.' },
};

export function categoryMeta(category: string): PageMeta {
  const cfg = CATEGORY_CONFIG[category] ?? {
    label: category,
    slug:  category,
    description: `Golf guides and reviews in the ${category} category from Cubical Golfer.`,
  };
  return {
    title:       `${cfg.label} — Weekend Golfer Picks 2026 | ${SITE}`,
    description: cfg.description,
    canonical:   `${DOMAIN}/${cfg.slug}/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [
      { label: 'Home',    href: '/' },
      { label: cfg.label, href: `/${cfg.slug}/` },
    ],
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    'gear-reviews':    'Gear Reviews',
    'golf-tech':       'Golf Tech',
    'golf-accessories':'Golf Accessories',
    'improve-game':    'Improve Your Game',
    'golf-lifestyle':  'Golf Lifestyle',
  };
  return map[cat] ?? cat;
}

function categorySlug(cat: string): string {
  const map: Record<string, string> = {
    'gear-reviews':    'gear-reviews',
    'golf-tech':       'golf-tech',
    'golf-accessories':'golf-accessories',
    'improve-game':    'improve-your-golf-game',
    'golf-lifestyle':  'golf-lifestyle',
  };
  return map[cat] ?? cat;
}
