/**
 * author.ts — Single source of truth for author E-E-A-T claims.
 *
 * EVERY author bio, byline, schema reference, and testing claim across the
 * site must source from this file. If Ryan's handicap, home course, or
 * testing volume changes, update ONLY this file and every page inherits it.
 *
 * FTC / Google E-E-A-T rationale: Google's quality raters check author
 * consistency across a site. Contradictory claims (e.g. "10 index" in
 * schema vs "10 handicap" in the byline) undermine trust signals.
 * The FTC's Endorsement Guides require that testing claims be truthful
 * and substantiable. One canonical profile eliminates drift.
 */

const DOMAIN = 'https://www.cubicalgolfer.com';

// ──────────────────────────────────────────────────────────
// UPDATE THESE VALUES — they propagate to schema, bylines,
// trust cards, freshness banners, and the homepage hero.
// ──────────────────────────────────────────────────────────
export const AUTHOR_PROFILE = {
  name:           'Ryan O.',
  alternateName:  'Cubical Golfer',
  handicap:       10,
  handicapLabel:  '10-handicap',
  homeCourse:     'Harborside Golf Course',
  city:           'Chicago, IL',
  roundsPerYear:  '25–40',
  playingSince:   2010,
  testingMin:     20,           // minimum rounds per product review
  testingRounds:  '20+',        // CANONICAL per-product rounds claim — used everywhere

  // ────────────────────────────────────────────────────────
  // WHAT'S IN THE BAG — fill these with YOUR real clubs and
  // the /how-we-test/ bag section appears automatically.
  // Leave a field '' to omit that line. Do not invent gear.
  // Format examples (delete the examples, keep your reality):
  //   driver:  'TaylorMade Qi35 Max 10.5° — Fujikura Ventus TR Blue 6-S'
  //   woods:   'Callaway Paradym 3W · Ping G430 4H'
  //   irons:   'TaylorMade Stealth HD 5–PW'
  //   wedges:  'Cleveland RTX 6 52°/56°'
  //   putter:  'Odyssey White Hot OG #7'
  //   ball:    'Srixon Q-Star Tour'
  //   rangefinder: 'Bushnell Tour V7 Shift'
  // ────────────────────────────────────────────────────────
  witb: {
    asOf:        '2026',
    driver:      'TaylorMade Qi35 Max 10.5° — Fujikura Ventus TR Blue 6-S',
    woods:       'Callaway Paradym 3W · Ping G430 4H',
    irons:       'TaylorMade Stealth HD 5–PW',
    wedges:      'Cleveland RTX 6 52°/56°',
    putter:      'Odyssey White Hot OG #7',
    ball:        'Srixon Q-Star Tour',
    rangefinder: 'Bushnell Tour V7 Shift',
  },
  testingLabel:   '20+ real rounds per product',
  siteTestTotal:  '20+',        // deprecated alias — kept equal to testingRounds to prevent drift
  gearPolicy:     'No freebies, no manufacturer loans.',
  bio:            'Playing since 2010. Tests every piece of gear on his own dime across 25–40 rounds a year at Harborside Golf Course in Chicago, IL. No freebies, no manufacturer loans.',
  jobTitle:       '10-Handicap Weekend Golfer & Gear Editor',
  photoPath:      '/images/ryan-author-photo.webp',
  aboutUrl:       `${DOMAIN}/about/`,
} as const;

// Schema.org Person object — used in Article, Review, and Product schema
export const AUTHOR_SCHEMA = {
  '@type':         'Person' as const,
  '@id':           `${DOMAIN}/about/#author`,
  'name':          AUTHOR_PROFILE.name,
  'alternateName': AUTHOR_PROFILE.alternateName,
  'url':           AUTHOR_PROFILE.aboutUrl,
  'jobTitle':      AUTHOR_PROFILE.jobTitle,
  'description':   `Got serious about golf in 2012. ${AUTHOR_PROFILE.handicapLabel} who plays ${AUTHOR_PROFILE.roundsPerYear} rounds a year out of ${AUTHOR_PROFILE.homeCourse} in ${AUTHOR_PROFILE.city}. ${AUTHOR_PROFILE.gearPolicy}`,
  'image':         `${DOMAIN}${AUTHOR_PROFILE.photoPath}`,
  'sameAs': [
    'https://x.com/CubicalGolfer',
  ],
  'worksFor': {
    '@type': 'Organization',
    'name':  'Cubical Golfer',
    'url':   DOMAIN,
  },
  'knowsAbout': [
    'Golf rangefinders', 'Golf GPS watches', 'Golf launch monitors',
    'Golf irons', 'Golf drivers', 'Golf balls', 'Golf putters',
    'Golf swing improvement', 'Golf equipment testing', 'Golf simulator setup',
    'Weekend golf practice', 'Office golf fitness', 'Budget golf gear',
    'Golf for beginners', 'Golf course management',
  ],
};

// Byline object — used in article pages
export const AUTHOR_BYLINE = {
  name:    AUTHOR_PROFILE.name,
  tagline: `${AUTHOR_PROFILE.handicapLabel} weekend golfer, ${AUTHOR_PROFILE.city}`,
  bio:     AUTHOR_PROFILE.bio,
  avatar:  AUTHOR_PROFILE.photoPath,
};
