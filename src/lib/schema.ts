// REC/FTC: never emit offers pointing at Amazon SEARCH urls — a search page is
// not the product; Google treats that as structured-data misrepresentation.
// When only a search url exists, the Product keeps name/image/review, no offers.
const isSearchUrl = (u?: string) => !!u && (/amazon\.[a-z.]+\/s([/?]|%3F)/i.test(u) || u.includes('s?k='));

// src/lib/schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema generator.
// Fixed in this version:
//   - Article schema now includes image field (fixes Google Search Console warning)
//   - Article schema includes author @id for entity building
//   - Organization schema includes sameAs array ready for social profiles
//   - Product schema added for affiliate pages
//
// RATINGS & AGGREGATE-RATING POLICY (buyingGuideProductSchema):
//   Every `reviewRating.ratingValue` on this site is a FIRST-PARTY EDITORIAL SCORE.
//   Scores are derived from the site's own ranking badges — "Best Overall" /
//   "Editor's Pick" → 4.8, "Best Premium"/"Best Splurge" → 4.7, "Best Value"/
//   "Best Mid-Range" → 4.5, "Best Budget"/"Budget Runner-Up" → 4.3, "Best for
//   <use case>" → 4.4 — which are genuine editorial positions, not invented
//   numbers. A section with no such editorial badge carries no rating (and
//   `testedStatus:'research'` sections are intentionally left unrated).
//   `aggregateRating` is deliberately OMITTED: the only review-count data
//   available is Amazon's, which is not first-party, and pairing our editorial
//   ratingValue with a third-party reviewCount would misattribute the count and
//   risk a Google manual action. A single honest first-party Review with a
//   reviewRating is the policy-compliant way for an affiliate site to earn star
//   snippets. DO NOT add aggregateRating. (See scripts/audit-ratings.ts /
//   docs/rating-coverage.md for current coverage.)
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, FAQItem } from '../data/types';
import { AFFILIATE } from '../data/affiliate-links';

import { AUTHOR_SCHEMA as AUTHOR } from '../data/author';

const DOMAIN    = 'https://www.cubicalgolfer.com';
const LOGO_URL  = `${DOMAIN}/images/cubicalgolfer-logo.webp`;
const OG_IMAGE  = `${DOMAIN}/images/og-image.jpg`;
const PUBLISHER = {
  '@type': 'Organization',
  name: 'Cubical Golfer',
  url: DOMAIN,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 400, height: 400 },
};
// AUTHOR imported from src/data/author.ts — single source of truth

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
    // SearchAction removed — the site uses client-side search (SiteSearch.astro
    // reading /api/search-index.json), not a /?s= server endpoint. The old
    // SearchAction pointed to /?s={search_term_string} which just loaded the
    // homepage, and robots.txt blocked it. If a /search/ page is ever built,
    // re-add SearchAction with the correct target.
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
      width: 400,
      height: 400,
    },
    description: 'Independent golf gear reviews and improvement guides for everyday weekend golfers.',
    foundingDate: '2026',
    slogan: 'Escape the cubicle. Find the fairway.',
    image: `${DOMAIN}/images/cubicalgolfer-logo.webp`,
    // Social profiles — add URLs as accounts are created (Part B).
    // Each real URL strengthens Google's entity understanding of Cubical Golfer.
    sameAs: [
      'https://www.pinterest.com/cubicalgolfer',
      'https://x.com/CubicalGolfer',
      // 'https://www.linkedin.com/company/cubicalgolfer',  // TODO: create
      // 'https://www.youtube.com/@cubicalgolfer',           // TODO: create
    ],
  };
}

// ── Article schema ────────────────────────────────────────────────────────────
// FIXED: Now includes image field — required by Google for Article rich results
export function articleSchema(article: Article | any): object {
  // Standalone pages (guides, calculators) call this with { headline, url } rather
  // than the full Article record. Without this normalisation `article.slug` is
  // undefined and every @id/url in the emitted JSON-LD becomes
  // "https://www.cubicalgolfer.comundefined". Accept both shapes.
  const rawPath = article.slug ?? article.url ?? '/';
  const path = String(rawPath).replace(/^https?:\/\/[^/]+/, '');
  const headline = article.title ?? article.headline ?? '';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${DOMAIN}${path}#article`,
    headline,
    description: article.description,
    datePublished: article.datePublished,
    // Fall back to datePublished when an article has no genuine update, so the
    // Article schema always carries a valid, non-inverted dateModified.
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      ...AUTHOR,
      '@id': `${DOMAIN}/about/#author`,
    },
    publisher: PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${DOMAIN}${path}`,
    },
    url: `${DOMAIN}${path}`,
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
): object | null {
  // Google requires at least two items for breadcrumb rich results. Emitting a
  // one-item trail (the homepage) is invalid markup, so suppress it entirely.
  if (!items || items.length < 2) return null;
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

// ── Product schema for comparison pages (×2 per page) ────────────────────────
export interface ComparisonProduct {
  name: string;
  brand: string;
  description: string;
  image?: string;
  url: string;
  price: string;
  retailer: string;
  rating?: number;
}

export function comparisonProductsSchema(products: ComparisonProduct[], reviewDate?: string): object[] {
  return products.map(p => {
    const priceMatch = (p.price ?? '').match(/\$?([\d,]+(?:\.\d{2})?)/);
    const numericPrice = priceMatch ? priceMatch[1].replace(/,/g, '') : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.description,
      image: p.image ? `${DOMAIN}${p.image}` : OG_IMAGE,
      brand: { '@type': 'Brand', name: p.brand },
      ...(isSearchUrl(p.url) ? {} : { offers: {
        '@type': 'Offer',
        url: p.url,
        priceCurrency: 'USD',
        ...(numericPrice ? { price: numericPrice } : {}),
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: p.retailer },
      } }),
      // aggregateRating removed — ratingCount is Amazon data, not first-party
      ...(p.rating ? {
        review: {
          '@type': 'Review',
          author: AUTHOR,
          datePublished: reviewDate,
          reviewBody: (p.description || '').slice(0, 300),
          reviewRating: {
            '@type': 'Rating',
            ratingValue: p.rating,
            bestRating: 5,
            worstRating: 1,
          },
        },
      } : {}),
    };
  });
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
      a: "The Bushnell Tour V7 Shift (~$399) is the best overall golf rangefinder for most weekend golfers. We tested 5 leading models over 20+ real rounds each. For budget golfers, the Precision Pro NX9 (~$219) delivers excellent performance at roughly half the price with a lifetime warranty.",
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
    image:         opts.image ?? `https://www.cubicalgolfer.com/images/og-image.jpg`,
    brand:         opts.brand ? { '@type': 'Brand', name: opts.brand } : undefined,
    ...(isSearchUrl(opts.url) ? {} : { offers: {
      '@type':      'Offer',
      url:          opts.url,
      priceCurrency:'USD',
      price:         opts.price?.replace(/[^0-9.]/g, '') ?? '0',
    } }),
  };
}

// ── About page schema ──────────────────────────────────────────────────────────
export function aboutPageSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${DOMAIN}/about/#aboutpage`,
    name: 'About Cubical Golfer',
    description: 'Independent golf gear reviews tested by real weekend golfers over 20+ real rounds each.',
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
    description: 'Every product tested over a minimum of 20 real rounds on real courses, independently purchased.',
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

// ── Dataset schema (data/reference pages whose payload is a table of values) ──
export function datasetSchema(opts: { name: string; description: string; url: string; dateModified?: string; keywords?: string[] }): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: `${DOMAIN}${opts.url}`,
    creator: { '@type': 'Person', name: 'Ryan O.', url: `${DOMAIN}/about/` },
    license: `${DOMAIN}/terms/`,
    dateModified: opts.dateModified,
    keywords: opts.keywords,
  };
}

// ── WebApplication schema (interactive tools/calculators) ────────────────────
export function webApplicationSchema(opts: { name: string; description: string; url: string }): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: `${DOMAIN}${opts.url}`,
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Any',
    ...(isSearchUrl(undefined) ? {} : { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }),
    provider: { '@type': 'Organization', name: 'Cubical Golfer', url: DOMAIN },
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
    dateModified: article.dateModified ?? article.datePublished,
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
    : `${DOMAIN}/images/og-image.jpg`;

  // Look up affiliate data for offers
  const affKey = (article as any).quickAnswerProduct || '';
  const aff = (AFFILIATE as any)[affKey];
  const priceRaw = aff?.price || '';
  // Extract first numeric price (handles "~$179 + $99/yr", "~$55/dozen", etc.)
  const priceMatch = priceRaw.match(/\$?([\d,]+(?:\.\d{2})?)/);
  const priceNum = priceMatch ? priceMatch[1].replace(/,/g, '') : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${DOMAIN}${article.slug}#review`,
    itemReviewed: {
      '@type': 'Product',
      name: productName,
      description: reviewBody.slice(0, 200),
      brand: { '@type': 'Brand', name: brand },
      image: image,
      ...(aff ? {
        ...(isSearchUrl(aff.url) ? {} : { offers: {
          '@type': 'Offer',
          url: aff.url,
          priceCurrency: 'USD',
          price: priceNum,
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: aff.retailer || 'Amazon' },
        } }),
      } : {}),
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
    dateModified: article.dateModified ?? article.datePublished,
    reviewBody: reviewBody,
    url: `${DOMAIN}${article.slug}`,
  };
}

// ── Product schema per pick (for buying-guide sections with affiliate key) ────
// CRITICAL FIX: price, seller, and image are required by Google for Product snippets.
// We are an affiliate site — seller must be the actual retailer (Amazon, Bushnell),
// NOT cubicalgolfer.com. We do NOT emit shippingDetails, returnPolicy, or gtin
// because we cannot legitimately claim those as an affiliate.
// ── ItemList for roundup/buying-guide pages (ranked product list) ─────────────
// Google uses ItemList to show "Best X" carousels in search results.
// Each item references the Product schema already on the page.
export function roundupItemListSchema(
  article: { slug: string; title: string },
  products: { name: string; position: number; affiliateKey?: string }[],
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: article.title,
    url: `${DOMAIN}${article.slug}`,
    numberOfItems: products.length,
    itemListElement: products.map(p => ({
      '@type': 'ListItem',
      position: p.position,
      name: p.name,
      url: `${DOMAIN}${article.slug}`,
    })),
  };
}

export function buyingGuideProductSchema(
  section: any,
  affiliateUrl: string,
  affiliatePrice: string,
  affiliateRetailer: string,
  productImage?: string,
  affiliateKey?: string,
  reviewDate?: string,
): object {
  // Extract first numeric price from "~$329", "~$2,995", "~$179 + $99/yr", "~$55/dozen"
  // Strips $ and ~ prefix, handles commas, takes first number only
  const priceMatch = affiliatePrice?.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  const numericPrice = priceMatch ? priceMatch[0] : '';

  // Derive product name: prefer the section heading if it's actually a product name,
  // otherwise humanize the affiliate key (e.g. 'bushnell-tour-v7-shift' → 'Bushnell Tour V7 Shift')
  const NON_PRODUCT_HEADINGS = /^(where to buy|quick verdict|the verdict|our pick|buy|pricing|value|cost|what to look for|how we|keep reading|faq)/i;

  // Editorial framing that precedes the actual product name. Previously a
  // hardcoded list, which left 71 of 479 Product blocks named things like
  // "Best Irons: Ping G Le3" and "Best for Analytics: Shot Scope V5 ($249)".
  // A leading "<anything up to 45 chars>:" is framing, not part of the name.
  const BADGE_PREFIX = /^(best|top|our|editor.s|budget|premium|value|runner.up|honorable[ -]mention|most|cheapest|splurge|upgrade|alternative)[^:]{0,45}:\s*/i;

  // A heading with no product in it — "Best Putters for High Handicappers",
  // "Best Matching Accessories". Plural category words with no brand token.
  const CATEGORY_ONLY = /^(best|top)\b[^:]*\b(putters|irons|drivers|wedges|balls|bags|carts|shoes|gloves|watches|monitors|nets|mats|screens|projectors|picks|setup|accessories|options|golfers|handicappers|seniors|beginners|women|men|kids)\b/i;

  let productName = section.h2
    .replace(/^[^\w]+/, '')      // leading emoji / punctuation
    .replace(BADGE_PREFIX, '')
    .replace(/\s*\(\$[\d,]+(?:[^)]*)\)\s*$/, '')  // trailing "($249)" / "($179 + $99/yr)"
    .replace(/\s*[—–-]\s*\$[\d,]+.*$/, '')          // trailing "— $249"
    .trim();

  // Fall back to the affiliate key whenever the heading did not resolve to a
  // product. The affiliate key IS the product being linked, so it is always
  // the more accurate name.
  const humanizedKey = affiliateKey
    ? affiliateKey.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : '';
  // Token-correspondence check. Word lists are brittle — "Best for 8-Foot
  // Ceilings" and "Our Testing Setup" both carry an affiliateKey but name no
  // product. If the cleaned heading shares no meaningful token with the
  // affiliate key, the heading is editorial framing and the key is the product.
  const STOP = new Set(['best','top','our','the','for','and','with','golf','2026','pick','picks','review']);
  const tokens = (t: string) =>
    new Set(t.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w)));
  const nameTok = tokens(productName);
  const keyTok = affiliateKey ? tokens(affiliateKey) : new Set<string>();
  const shares = [...keyTok].some(k => [...nameTok].some(n => n === k || n.includes(k) || k.includes(n)));

  if (affiliateKey && (NON_PRODUCT_HEADINGS.test(productName) || CATEGORY_ONLY.test(productName) || productName.length < 3 || !shares)) {
    productName = humanizedKey;
  }

  // Belt and braces: no price should survive into a product name. If one does
  // (e.g. "What About the Rapsodo MLM2PRO ($599)?"), the heading is editorial
  // prose, so use the affiliate key instead.
  productName = productName.replace(/\s*[([]\$[\d,][^)\]]*[)\]]/g, '').replace(/\s{2,}/g, ' ').trim();
  if (/\$[\d,]/.test(productName) && humanizedKey) productName = humanizedKey;
  productName = productName.replace(/[?:—–-]\s*$/, '').trim();

  // Derive brand from affiliate key (first word, or first two for compound brands)
  const COMPOUND_BRANDS = ['shot-scope','blue-tees','lab-golf','square-golf','full-swing','rain-or','precision-pro','vice-golf','tour-edge','top-flite','ping-g','cobra-aerojet','cleveland-launcher'];
  let brandName = '';
  if (affiliateKey) {
    const compound = COMPOUND_BRANDS.find(b => affiliateKey.startsWith(b));
    if (compound) {
      brandName = compound.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    } else {
      brandName = (affiliateKey.split('-')[0] || '').replace(/\b\w/g, (c: string) => c.toUpperCase());
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    // Plain text only — schema.org description must not contain markup.
    // reviewBody below already strips tags; this field previously did not,
    // leaving 80 Product blocks with raw "<p>..." in the description.
    description: (section.body || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200),
    image: productImage || `${DOMAIN}/images/og-image.jpg`,
    ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
    // ── Single first-party editorial review only ──
    // aggregateRating removed: the ratingCount values are Amazon review
    // counts, not reviews collected on this site. Combining our editorial
    // score (ratingValue) with Amazon's reviewCount misattributes the
    // count and risks a Google manual action. A single honest Review with
    // reviewRating is the policy-compliant way for affiliate sites to
    // earn star snippets.
    ...(section.rating ? {
      review: {
        '@type': 'Review',
        author: AUTHOR,
        datePublished: reviewDate,
        reviewBody: (section.body?.slice(0, 300) || '').replace(/<[^>]*>/g, '').trim(),
        reviewRating: {
          '@type': 'Rating',
          ratingValue: section.rating,
          bestRating: 5,
          worstRating: 1,
        },
      },
    } : {}),
    ...(isSearchUrl(affiliateUrl) ? {} : { offers: {
      '@type': 'Offer',
      url: affiliateUrl,
      priceCurrency: 'USD',
      ...(numericPrice ? { price: numericPrice } : {}),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: affiliateRetailer || 'Amazon.com',
      },
    } }),
  };
}

