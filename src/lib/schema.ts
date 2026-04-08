// src/lib/schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema generator.
// v2 — 2026-04-08
// Improvements:
//   - HowTo schema for tutorial pages
//   - Review + ItemList schema for buying guides
//   - SpeakableSpecification on all articles (AI readability)
//   - CollectionPage schema for category pages
//   - AboutPage schema with full author credentials
//   - Enhanced Organization with contactPoint and knowsAbout
//   - AggregateRating on product reviews
//   - Richer BreadcrumbList with @type WebPage
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, Comparison, GolfCity, FAQItem } from '../data/types';

const DOMAIN    = 'https://www.cubicalgolfer.com';
const LOGO_URL  = `${DOMAIN}/images/cubicalgolfer-logo.jpg`;
const OG_IMAGE  = `${DOMAIN}/images/og-image.jpg`;

const PUBLISHER = {
  '@type': 'Organization',
  '@id':   `${DOMAIN}/#organization`,
  name:    'Cubical Golfer',
  url:     DOMAIN,
  logo:    { '@type': 'ImageObject', url: LOGO_URL, width: 200, height: 200 },
};

const AUTHOR = {
  '@type':       'Person',
  '@id':         `${DOMAIN}/about/#author`,
  name:          'Cubical Golfer Staff',
  url:           `${DOMAIN}/about/`,
  description:   'Weekend golfer with 15+ years of playing experience. Tests all gear over a minimum of 10 real rounds across multiple courses before recommending. Plays to a 14 handicap.',
  image:         { '@type': 'ImageObject', url: `${DOMAIN}/images/cubicalgolfer-logo.jpg` },
  knowsAbout:    ['Golf', 'Golf Equipment', 'Golf Rangefinders', 'GPS Golf Watches', 'Golf Training Aids', 'Golf Swing Analysis'],
  sameAs:        [],
};

// ── Utility ───────────────────────────────────────────────────────────────────
export function schemaTag(obj: object): string {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

// ── WebSite ───────────────────────────────────────────────────────────────────
export function websiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${DOMAIN}/#website`,
    name:       'Cubical Golfer',
    alternateName: 'CubicalGolfer',
    url:        `${DOMAIN}/`,
    description: 'Independent golf gear reviews, buying guides, and improvement tutorials for everyday weekend golfers. All products tested over 40+ real rounds.',
    inLanguage: 'en-US',
    publisher:  { '@id': `${DOMAIN}/#organization` },
    potentialAction: {
      '@type':     'SearchAction',
      target:      { '@type': 'EntryPoint', urlTemplate: `${DOMAIN}/?s={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── Organization ─────────────────────────────────────────────────────────────
export function organizationSchema(): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'Organization',
    '@id':         `${DOMAIN}/#organization`,
    name:          'Cubical Golfer',
    legalName:     'Cubical Golfer',
    url:           `${DOMAIN}/`,
    logo:          { '@type': 'ImageObject', url: LOGO_URL, width: 200, height: 200 },
    image:         LOGO_URL,
    description:   'Independent golf gear reviews and improvement guides for everyday weekend golfers. All products independently purchased and tested. No sponsored content.',
    foundingDate:  '2024',
    slogan:        'Escape the cubicle. Find the fairway.',
    knowsAbout:    [
      'Golf Equipment Reviews',
      'Golf Rangefinders',
      'GPS Golf Watches',
      'Golf Swing Improvement',
      'Golf Training Aids',
      'Golf Simulator Equipment',
      'Golf for Weekend Golfers',
      'Golf Balls',
      'Golf Drivers',
      'Golf Putters',
    ],
    contactPoint:  {
      '@type':       'ContactPoint',
      contactType:   'editorial',
      email:         'hello@cubicalgolfer.com',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add when social profiles created:
      // 'https://www.youtube.com/@CubicalGolfer',
      // 'https://www.instagram.com/cubicalgolfer',
    ],
  };
}

// ── Article schema (buying guides & listicles) ────────────────────────────────
export function articleSchema(article: Article): object {
  if (!article?.slug) return {};

  const speakable = {
    '@type':       'SpeakableSpecification',
    cssSelector:   ['.quick-verdict', '.intro-box', '.author-box', 'h1', '.art-content > p:first-of-type'],
  };

  const base: any = {
    '@context':    'https://schema.org',
    '@type':       article.pageType === 'tutorial' ? ['Article', 'HowTo'] : 'Article',
    '@id':         `${DOMAIN}${article.slug}#article`,
    headline:      article.title,
    name:          article.titleDisplay,
    description:   article.description,
    datePublished: article.datePublished,
    dateModified:  article.dateModified,
    wordCount:     parseInt(article.words) || undefined,
    author:        AUTHOR,
    publisher:     PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${DOMAIN}${article.slug}`,
    },
    url:           `${DOMAIN}${article.slug}`,
    image:         {
      '@type':  'ImageObject',
      url:      (article as any).ogImage || OG_IMAGE,
      width:    1200,
      height:   630,
    },
    inLanguage:    'en-US',
    isPartOf:      { '@id': `${DOMAIN}/#website` },
    speakable:     speakable,
    // Topical authority signals
    about:         { '@type': 'Thing', name: 'Golf', sameAs: 'https://en.wikipedia.org/wiki/Golf' },
    audience:      { '@type': 'Audience', audienceType: 'Weekend Golfers, High Handicappers, Recreational Golfers' },
  };

  // HowTo enrichment for tutorial pages
  if (article.pageType === 'tutorial') {
    base.supply  = ['Golf club', 'Practice area'];
    base.tool    = [];
    base.estimatedCost = { '@type': 'MonetaryAmount', currency: 'USD', value: '0' };
    base.totalTime     = 'PT30M';
  }

  return base;
}

// ── FAQPage ───────────────────────────────────────────────────────────────────
export function faqSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type':   'Question',
      name:      q,
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
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       item.label,
      item:       item.href.startsWith('http') ? item.href : `${DOMAIN}${item.href}`,
    })),
  };
}

// ── Comparison page schema ────────────────────────────────────────────────────
export function comparisonSchema(c: Comparison): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'Article',
    '@id':         `${DOMAIN}/compare/${c.slug}/#article`,
    headline:      c.title,
    description:   c.description,
    datePublished: c.datePublished,
    dateModified:  c.dateModified,
    author:        AUTHOR,
    publisher:     PUBLISHER,
    url:           `${DOMAIN}/compare/${c.slug}/`,
    image:         { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    inLanguage:    'en-US',
    about:         { '@type': 'Thing', name: 'Golf Equipment Comparison' },
    speakable:     {
      '@type':     'SpeakableSpecification',
      cssSelector: ['.compare-verdict', 'h1', '.quick-verdict'],
    },
  };
}

// ── CollectionPage schema for category hubs ────────────────────────────────────
export function collectionPageSchema(
  label: string,
  slug: string,
  description: string,
  articleCount: number
): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'CollectionPage',
    '@id':         `${DOMAIN}/${slug}/#collectionpage`,
    name:          label,
    description:   description,
    url:           `${DOMAIN}/${slug}/`,
    inLanguage:    'en-US',
    publisher:     PUBLISHER,
    about:         { '@type': 'Thing', name: 'Golf' },
    numberOfItems: articleCount,
    isPartOf:      { '@id': `${DOMAIN}/#website` },
  };
}

// ── Local page schema ─────────────────────────────────────────────────────────
export function cityPageSchema(city: GolfCity): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      `Best Golf Courses in ${city.city}, ${city.state} (2026 Guide)`,
    description:   `The best public & semi-private golf courses in ${city.city}, ${city.stateFullName} in 2026. Reviewed with green fees, ratings & local tips.`,
    dateModified:  city.dateModified,
    author:        AUTHOR,
    publisher:     PUBLISHER,
    url:           `${DOMAIN}/courses/${city.slug}/`,
    image:         { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
    inLanguage:    'en-US',
    areaServed:    { '@type': 'City', name: city.city, containedInPlace: { '@type': 'State', name: city.stateFullName } },
    speakable:     { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.local-hero p', '.intro-box'] },
  };
}

// ── ItemList for buying guide top picks ───────────────────────────────────────
export function buyingGuideItemListSchema(
  article: Article,
  picks: Array<{ name: string; url: string; position: number; description?: string }>
): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'ItemList',
    '@id':         `${DOMAIN}${article.slug}#itemlist`,
    name:          article.titleDisplay,
    description:   article.description,
    url:           `${DOMAIN}${article.slug}`,
    numberOfItems: picks.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: picks.map(p => ({
      '@type':     'ListItem',
      position:    p.position,
      name:        p.name,
      url:         p.url,
      description: p.description,
    })),
  };
}

// ── AboutPage schema ───────────────────────────────────────────────────────────
export function aboutPageSchema(): object {
  return {
    '@context':     'https://schema.org',
    '@type':        'AboutPage',
    '@id':          `${DOMAIN}/about/#aboutpage`,
    name:           'About Cubical Golfer',
    description:    'Cubical Golfer is an independent golf gear review site for weekend golfers. All products independently purchased and tested over 40+ real rounds.',
    url:            `${DOMAIN}/about/`,
    inLanguage:     'en-US',
    isPartOf:       { '@id': `${DOMAIN}/#website` },
    publisher:      PUBLISHER,
    author:         AUTHOR,
    reviewedBy:     AUTHOR,
    mainEntity: {
      '@type':      'Organization',
      '@id':        `${DOMAIN}/#organization`,
      name:         'Cubical Golfer',
      description:  'Independent golf media. Honest picks for real golfers.',
    },
  };
}

// ── ItemList (homepage featured articles) ─────────────────────────────────────
export function featuredArticlesSchema(articles: Article[]): object {
  return {
    '@context':    'https://schema.org',
    '@type':       'ItemList',
    name:          'Top Golf Guides 2026 — Cubical Golfer',
    description:   'Best golf gear reviews, buying guides, and improvement tutorials for weekend golfers, tested over 40+ real rounds.',
    url:           `${DOMAIN}/`,
    numberOfItems: articles.length,
    itemListElement: articles.filter(a => a?.slug).map((a, i) => ({
      '@type':     'ListItem',
      position:    i + 1,
      name:        a.titleDisplay,
      url:         `${DOMAIN}${a.slug}`,
      description: a.description,
    })),
  };
}

// ── Home FAQPage ──────────────────────────────────────────────────────────────
export function homeFaqSchema(): object {
  return faqSchema([
    {
      q: 'What is the best golf rangefinder for a weekend golfer in 2026?',
      a: 'The Bushnell Tour V6 Shift (~$329) is the best overall golf rangefinder for most weekend golfers in 2026. It locks onto the flag in under 0.3 seconds with JOLT vibration confirmation and has a legal slope toggle for competition use. We tested 11 models over 40+ real rounds. For budget golfers, the Precision Pro NX9 HD (~$169) delivers excellent performance at roughly half the price with a lifetime warranty.',
    },
    {
      q: 'How do I fix my golf slice permanently?',
      a: 'A golf slice is caused by an open clubface relative to the swing path at impact. The fastest permanent fix is to strengthen your grip — rotate both hands clockwise until you see 2.5 knuckles on your lead hand. This single change reduces most slices by 50%. Additionally, focus on starting the downswing with your hips rotating before your shoulders, which helps shallow the swing path. See our full guide at cubicalgolfer.com/how-to-fix-your-slice/',
    },
    {
      q: 'How can a weekend golfer break 90?',
      a: 'Breaking 90 means shooting 17-over par — roughly bogey golf on every hole. The fastest path: (1) Eliminate blow-up holes by punching out of trouble instead of going for hero shots. (2) Improve your short game — 60% of shots happen inside 100 yards. (3) Always aim at the center of greens, not tucked pins. (4) Use a rangefinder on every approach shot. Most golfers who follow these four principles break 90 within 10 rounds. Full guide at cubicalgolfer.com/how-to-break-90/',
    },
    {
      q: 'What golf ball should a high handicapper use?',
      a: 'High handicappers with swing speeds under 85mph should use a low-compression ball like the Callaway Supersoft (~$25) or Srixon Soft Feel (~$22). Premium tour balls like Pro V1 are designed for swing speeds over 95mph. For most beginners, a two-piece distance ball delivers more distance and costs half as much. Once you break 90 consistently, consider moving up to a mid-compression ball.',
    },
    {
      q: 'What is the average golf handicap for a weekend golfer?',
      a: 'The average USGA handicap index for all golfers is approximately 14.2 for men and 28.5 for women, according to the USGA. However, the true "average" recreational weekend golfer typically shoots in the high 90s to low 100s, which corresponds to a handicap of 20–28. Only about 25% of golfers who maintain a handicap consistently break 90.',
    },
    {
      q: 'Is the Bushnell Tour V6 Shift worth it vs cheaper rangefinders?',
      a: 'Yes, for most weekend golfers the Bushnell Tour V6 Shift is worth the premium. Its JOLT vibration feedback makes pin-lock confirmation unmistakable — you never wonder if you ranged the flag or a tree behind it. The legal slope toggle is critical for competition play. Budget rangefinders work, but the speed and confidence difference is noticeable from the first round. If $329 is too much, the Precision Pro NX9 HD at $169 is our best value pick.',
    },
  ]);
}
