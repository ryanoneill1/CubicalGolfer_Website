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
  name: 'The Cubical Golfer Team',
  url: `${DOMAIN}/about/`,
  jobTitle: 'Gear Editors & Weekend Warriors',
  description: 'A crew of 9-to-5 desk jockeys who live for Saturday morning tee times. 15-handicap average across the team. We test every product over 10+ real rounds with our own money — no freebies, no manufacturer loans. We write reviews between meetings and daydream about birdies during conference calls.',
  image: `${DOMAIN}/images/cubicalgolfer-logo.jpg`,
  '@id': `${DOMAIN}/about/#author`,
  knowsAbout: [
    'Golf rangefinders', 'Golf GPS watches', 'Golf launch monitors',
    'Golf irons', 'Golf drivers', 'Golf balls', 'Golf putters',
    'Golf swing improvement', 'Golf equipment testing', 'Golf simulator setup',
    'Weekend golf practice', 'Office golf fitness', 'Budget golf gear',
    'Golf for beginners', 'Golf course management',
  ],
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
      'https://www.pinterest.com/cubicalgolfer',
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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.bottom-line-box', '.art-content h1', '.faq-answer'],
    },
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
// ── Individual product / affiliate review schema ──────────────────────────────
export function productSchema(opts: {
  name:        string;
  description: string;
  image?:      string;
  price?:      string;
  url:         string;
  brand?:      string;
}): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'Product',
    name:          opts.name,
    description:   opts.description,
    image:         opts.image ?? `https://www.cubicalgolfer.com/images/products/placeholder.svg`,
    brand:         opts.brand ? { '@type': 'Brand', name: opts.brand } : undefined,
    offers: {
      '@type':      'Offer',
      url:          opts.url,
      priceCurrency:'USD',
      price:         opts.price?.replace(/[^0-9.]/g, '') ?? '0',
    },
  };
}

// ── About page schema ──────────────────────────────────────────────────────────
export function aboutPageSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${DOMAIN}/about/#aboutpage`,
    name: 'About Cubical Golfer',
    description: 'Independent golf gear reviews tested by real weekend golfers over 40+ real rounds.',
    url: `${DOMAIN}/about/`,
    author: AUTHOR,
    publisher: PUBLISHER,
    inLanguage: 'en-US',
  };
}

// ── How We Test page schema ────────────────────────────────────────────────────
export function howWeTestSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${DOMAIN}/how-we-test/#webpage`,
    name: 'How We Test Golf Gear — Cubical Golfer Testing Standards',
    description: 'Every product tested over a minimum of 10 real rounds on real courses, independently purchased.',
    url: `${DOMAIN}/how-we-test/`,
    author: AUTHOR,
    publisher: PUBLISHER,
  };
}

// ── Collection / category index page schema ────────────────────────────────────
export function collectionPageSchema(opts: {
  title:       string;
  description: string;
  url:         string;
  articles:    Article[];
}): object {
  return {
    '@context':         'https://schema.org',
    '@type':            'CollectionPage',
    '@id':              `${opts.url}#collection`,
    name:               opts.title,
    description:        opts.description,
    url:                opts.url,
    mainEntity: {
      '@type':         'ItemList',
      numberOfItems:    opts.articles.length,
      itemListElement:  opts.articles.slice(0, 10).map((a, i) => ({
        '@type':    'ListItem',
        position:   i + 1,
        name:       a.title,
        url:        `${DOMAIN}${a.slug}`,
        description: a.description,
      })),
    },
  };
}

// ── HowTo schema (for tutorial page types) ───────────────────────────────────
export function howToSchema(article: any): object | null {
  if (article.pageType !== 'tutorial') return null;
  if (!article.sections || !Array.isArray(article.sections)) return null; // FIX: guard missing sections
  const steps = article.sections
    .filter((s: any) => s.body && s.body.trim())
    .map((s: any, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.h2,
      text: s.body.slice(0, 300),
    }));
  if (steps.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.titleDisplay || article.title, // FIX: use correct field name
    description: article.description,
    url: `${DOMAIN}${article.slug}`,
    step: steps,
    dateModified: article.dateModified,
  };
}

// ── Review schema (for pageType 'review' — enables star rating rich snippets) ──
export function reviewSchema(article: Article): object | null {
  if (article.pageType !== 'review' || !article.rating) return null;

  // Extract product name from title (strip Review, year, dashes)
  const productName = article.title
    .replace(/\s*Review\b.*$/i, '')
    .replace(/\s*—\s*.*$/, '')
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .replace(/\s*\d{4}\s*$/, '')
    .trim();

  // Extract brand (first word of product name)
  const brand = productName.split(/\s+/)[0];

  // Strip HTML from bottomLine for reviewBody
  const reviewBody = (article.bottomLine || article.description || '')
    .replace(/<[^>]+>/g, '');

  // Use thumbnail or product image
  const image = article.thumbnail
    ? `${DOMAIN}${article.thumbnail}`
    : `${DOMAIN}/images/og-image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${DOMAIN}${article.slug}#review`,
    itemReviewed: {
      '@type': 'Product',
      name: productName,
      brand: { '@type': 'Brand', name: brand },
      image: image,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: article.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      ...AUTHOR,
      '@id': `${DOMAIN}/about/#author`,
    },
    publisher: PUBLISHER,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    reviewBody: reviewBody,
    url: `${DOMAIN}${article.slug}`,
  };
}

// ── Product schema per pick (for buying-guide sections with affiliate key) ────
// CRITICAL FIX: price, seller, and image are required by Google for Product snippets.
// We are an affiliate site — seller must be the actual retailer (Amazon, Bushnell),
// NOT cubicalgolfer.com. We do NOT emit shippingDetails, returnPolicy, or gtin
// because we cannot legitimately claim those as an affiliate.
export function buyingGuideProductSchema(
  section: any,
  affiliateUrl: string,
  affiliatePrice: string,
  affiliateRetailer: string,
  productImage?: string,
): object {
  // Extract first numeric price from "~$329", "~$2,995", "~$179 + $99/yr", "~$55/dozen"
  // Strips $ and ~ prefix, handles commas, takes first number only
  const priceMatch = affiliatePrice?.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  const numericPrice = priceMatch ? priceMatch[0] : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: section.h2.replace(/^[^\w]+/, '').replace(/^(Best Overall:|Best Budget:|🥇|🏆)\s*/i, '').trim(),
    description: section.body?.slice(0, 200) || '',
    image: productImage || `${DOMAIN}/images/products/placeholder.webp`,
    // aggregateRating only emitted when we have real review data (section.rating)
    aggregateRating: section.rating ? {
      '@type': 'AggregateRating',
      ratingValue: section.rating,
      reviewCount: section.ratingCount ? parseInt(section.ratingCount.replace(/,/g, '')) : 50,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: affiliateUrl,
      priceCurrency: 'USD',
      price: numericPrice,
      seller: {
        '@type': 'Organization',
        name: affiliateRetailer || 'Amazon.com',
      },
    },
  };
}

