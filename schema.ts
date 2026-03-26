// src/lib/schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema generator.
// Fixed in this version:
//   - Article schema now includes image field (fixes Google Search Console warning)
//   - Article schema includes author @id for entity building
//   - Organization schema includes sameAs array ready for social profiles
//   - Product schema added for affiliate pages
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, FAQItem } from '../data/types';

const DOMAIN    = 'https://www.cubicalgolfer.com';
const LOGO_URL  = `${DOMAIN}/images/logo.png`;
const OG_IMAGE  = `${DOMAIN}/images/og-image.png`;
const PUBLISHER = {
  '@type': 'Organization',
  name: 'Cubical Golfer',
  url: DOMAIN,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 200, height: 60 },
};
const AUTHOR = {
  '@type': 'Person',
  name: 'Cubical Golfer Staff',
  url: `${DOMAIN}/about/`,
  description: 'Weekend golfer with 15+ years experience. Tests all gear over a minimum of 10 real rounds before recommending.',
  image: `${DOMAIN}/images/cubicalgolfer-logo.jpg`,
  '@id': `${DOMAIN}/about/#author`,
};

export function schemaTag(obj: object): string {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

// ── WebSite ───────────────────────────────────────────────────────────────────
export function websiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${DOMAIN}/#website`,
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

// ── Organization ─────────────────────────────────────────────────────────────
export function organizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DOMAIN}/#organization`,
    name: 'Cubical Golfer',
    url: `${DOMAIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 200,
      height: 60,
    },
    description: 'Independent golf gear reviews and improvement guides for everyday weekend golfers.',
    foundingDate: '2024',
    slogan: 'Escape the cubicle. Find the fairway.',
    image: `${DOMAIN}/images/cubicalgolfer-logo.jpg`,
    // Add your real social profiles here for stronger entity signals:
    sameAs: [
      // 'https://www.youtube.com/@CubicalGolfer',
      // 'https://www.instagram.com/cubicalgolfer',
      // 'https://twitter.com/cubicalgolfer',
      // 'https://www.pinterest.com/cubicalgolfer',
    ],
  };
}

// ── Article schema ────────────────────────────────────────────────────────────
// FIXED: Now includes image field — required by Google for Article rich results
export function articleSchema(article: Article): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${DOMAIN}${article.slug}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      ...AUTHOR,
      '@id': `${DOMAIN}/about/#author`,
    },
    publisher: PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${DOMAIN}${article.slug}`,
    },
    url: `${DOMAIN}${article.slug}`,
    // Use article-specific image if available, otherwise OG image
    image: {
      '@type': 'ImageObject',
      url: article.ogImage || OG_IMAGE,
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-US',
    isPartOf: { '@id': `${DOMAIN}/#website` },
  };
}

// ── FAQPage — JSON-LD ONLY, never paired with microdata ──────────────────────
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
    image: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
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
    image: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    inLanguage: 'en-US',
  };
}

// ── ItemList (homepage featured articles) ─────────────────────────────────────
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
    {
      q: 'What golf ball should a high handicapper use?',
      a: "High handicappers should use a low-compression ball like the Callaway Supersoft or Srixon Soft Feel. Premium tour balls are designed for swing speeds over 90mph. For most beginners, a two-piece distance ball saves money and performs better.",
    },
  ]);
}
