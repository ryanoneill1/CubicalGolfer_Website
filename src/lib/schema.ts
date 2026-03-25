// src/lib/schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema generator.
// Rules:
//   - ONE schema approach per page: JSON-LD only (no microdata anywhere)
//   - No duplicate @type per page
//   - Every schema is validated against Google's requirements
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, FAQItem } from '../data/types';

const DOMAIN    = 'https://www.cubicalgolfer.com';
const LOGO_URL  = `${DOMAIN}/images/logo.png`;
const PUBLISHER = {
  '@type': 'Organization',
  name: 'Cubical Golfer',
  url: DOMAIN,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
};
const AUTHOR = {
  '@type': 'Person',
  name: 'Cubical Golfer Staff',
  url: `${DOMAIN}/about/`,
};

// ── Serialise any schema object to a script tag ────────────────────────────────
export function schemaTag(obj: object): string {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

// ── WebSite (homepage only) ───────────────────────────────────────────────────
export function websiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cubical Golfer',
    url: `${DOMAIN}/`,
    description: 'Independent golf gear reviews and improvement guides for everyday weekend golfers.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/?s={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── Organization (homepage only) ─────────────────────────────────────────────
export function organizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cubical Golfer',
    url: `${DOMAIN}/`,
    logo: LOGO_URL,
    description: 'Independent golf gear reviews and improvement guides for everyday weekend golfers.',
    foundingDate: '2024',
    slogan: 'Escape the cubicle. Find the fairway.',
    sameAs: [],
  };
}

// ── Article schema (article pages only) ──────────────────────────────────────
export function articleSchema(article: Article): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${DOMAIN}${article.slug}`,
    },
    url: `${DOMAIN}${article.slug}`,
    inLanguage: 'en-US',
  };
}

// ── FAQPage schema — JSON-LD ONLY, never paired with microdata ────────────────
export function faqSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────
export function breadcrumbSchema(
  items: Array<{ label: string; href: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${DOMAIN}${item.href}`,
    })),
  };
}

// ── Comparison page schema ────────────────────────────────────────────────────
export function comparisonSchema(c: Comparison): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.description,
    datePublished: c.datePublished,
    dateModified: c.dateModified,
    author: AUTHOR,
    publisher: PUBLISHER,
    url: `${DOMAIN}/compare/${c.slug}/`,
    inLanguage: 'en-US',
  };
}

// ── Local page schema ─────────────────────────────────────────────────────────
export function cityPageSchema(city: GolfCity): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Golf Courses in ${city.city}, ${city.state} (2026 Guide)`,
    description: `The best public & semi-private golf courses in ${city.city}, ${city.stateFullName} in 2026.`,
    dateModified: city.dateModified,
    author: AUTHOR,
    publisher: PUBLISHER,
    url: `${DOMAIN}/courses/${city.slug}/`,
    inLanguage: 'en-US',
  };
}

// ── ItemList schema (homepage featured articles) ──────────────────────────────
export function featuredArticlesSchema(articles: Article[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Golf Guides 2026 — Cubical Golfer',
    url: `${DOMAIN}/`,
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.titleDisplay,
      url: `${DOMAIN}${a.slug}`,
    })),
  };
}

// ── Home FAQPage ──────────────────────────────────────────────────────────────
export function homeFaqSchema(): object {
  return faqSchema([
    {
      q: 'What is the best golf rangefinder for a weekend golfer in 2026?',
      a: "The Bushnell Tour V6 Shift (~$329) is the best overall golf rangefinder for most weekend golfers. We tested 11 models over 40+ real rounds. For budget golfers, the Precision Pro NX9 HD (~$169) delivers excellent performance at roughly half the price with a lifetime warranty.",
    },
    {
      q: 'How do I fix my golf slice permanently?',
      a: "A golf slice is caused by an open clubface relative to the swing path at impact. The fastest fix: strengthen your grip by rotating both hands clockwise until you see 2.5 knuckles on your lead hand. This alone reduces most slices by 50%.",
    },
    {
      q: 'How can a weekend golfer break 90?',
      a: "Breaking 90 means 17 over par — roughly bogey golf. The fastest path: eliminate blow-up holes (triples and worse), improve your short game (60% of shots happen inside 100 yards), and always aim at the center of greens rather than tucked pins.",
    },
  ]);
}
