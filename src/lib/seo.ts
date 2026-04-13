// src/lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised meta-tag and breadcrumb generator for every page type.
// Consumed by [...slug].astro, compare/[slug].astro, and static pages.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, PageMeta } from '../data/types';

const DOMAIN  = 'https://www.cubicalgolfer.com';
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
