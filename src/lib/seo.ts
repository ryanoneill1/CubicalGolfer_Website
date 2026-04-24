// src/lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised meta-tag and breadcrumb generator for every page type.
// Consumed by [...slug].astro, compare/[slug].astro, and static pages.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, PageMeta } from '../data/types';
import { ARTICLES } from '../data/articles';

const DOMAIN           = 'https://www.cubicalgolfer.com';

// ── Google Search Console verification tag ─────────────────────────────────
// Add your GSC verification code here (found in GSC → Settings → Ownership → HTML tag).
// The BaseLayout renders this as: <meta name="google-site-verification" content={VERIFICATION_TAG} />
export const VERIFICATION_TAG = '';   // ← paste your GSC code here if needed
const OG_IMG  = `${DOMAIN}/images/og-image.jpg`;
const SITE    = 'Cubical Golfer';
const MAX_TITLE = 60;

function smartTitle(title: string): string {
  const withSite = `${title} | ${SITE}`;
  return withSite.length <= MAX_TITLE ? withSite : title;
}

// ── Home ─────────────────────────────────────────────────────────────────────
export function homeMeta(): PageMeta {
  return {
    title:       `${ARTICLES.length}+ Golf Gear Reviews for Weekend Golfers — Cubical Golfer`,
    description: 'Rangefinders, drivers, irons, GPS watches, and golf balls tested over 40+ real rounds by a 12-hdcp weekend golfer. No freebies — honest picks only.',
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
    title:         smartTitle(c.title),
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
    title:       smartTitle(opts.title),
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
  'gear-reviews':     { label: 'Golf Gear Reviews', slug: 'gear-reviews',          description: 'Rangefinders, drivers, irons, and GPS watches tested by a weekend golfer who shoots 84 one day and 97 the next. No lab coats — just real rounds.' },
  'golf-tech':        { label: 'Golf Tech',          slug: 'golf-tech',             description: 'Launch monitors, swing analyzers, and golf apps reviewed by a 9-to-5 golfer. We are not scientists — we just want to know what actually helps.' },
  'golf-accessories': { label: 'Golf Accessories',   slug: 'golf-accessories',      description: 'Gloves, bags, training aids, and gifts under $50 for the golfer who spends all week at a desk and all weekend chasing birdies.' },
  'improve-game':     { label: 'Improve Your Game',  slug: 'improve-your-golf-game',description: 'Break 90, fix your slice, and stop 3-putting. Tips for weekend warriors who fix one thing on Saturday and find a new problem on Sunday.' },
  'golf-lifestyle':   { label: 'Golf Lifestyle',     slug: 'golf-lifestyle',        description: 'Fitness, travel, and time hacks for golfers with day jobs who wish every weekend was a golf weekend. We get it — we are the same.' },
};

export function categoryMeta(category: string): PageMeta {
  const cfg = CATEGORY_CONFIG[category] ?? {
    label: category,
    slug:  category,
    description: `Golf guides and reviews in the ${category} category from Cubical Golfer.`,
  };
  return {
    title:       smartTitle(`${cfg.label} — Weekend Golfer Picks 2026`),
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

// ── How We Test page ──────────────────────────────────────────────────────────
export function howWeTestMeta(): PageMeta {
  return {
    title:       smartTitle('How We Test Golf Gear — Our Testing Standards'),
    description: 'Every product we recommend is independently purchased and tested over a minimum of 10 real rounds. Here is how we evaluate golf gear.',
    canonical:   `${DOMAIN}/how-we-test/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [
      { label: 'Home',        href: '/' },
      { label: 'How We Test', href: '/how-we-test/' },
    ],
  };
}

// ── About page meta ────────────────────────────────────────────────────────────
export function aboutMeta(): PageMeta {
  return {
    title:       smartTitle('About Cubical Golfer — Editorial Policy & Testing'),
    description: 'Who we are, how we test golf gear, and why we started Cubical Golfer. Independent reviews by real weekend golfers.',
    canonical:   `${DOMAIN}/about/`,
    ogImage:     OG_IMG,
    ogType:      'website',
    robots:      'index, follow',
    breadcrumbs: [
      { label: 'Home',  href: '/' },
      { label: 'About', href: '/about/' },
    ],
  };
}
