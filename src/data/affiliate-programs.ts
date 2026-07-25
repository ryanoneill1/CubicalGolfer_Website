// src/data/affiliate-programs.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central registry of the affiliate programs CubicalGolfer routes product links
// to. Every entry in affiliate-links.ts references one of these via its
// `program` field. This is the single place to manage rates, cookie windows, and
// — most importantly — the tracking IDs that make a link actually PAY.
//
// LIVE vs PENDING:
//   • `trackingParam` non-empty  → the account is approved and links are tracked.
//   • `trackingParam === ''`     → NOT yet approved. The build-time guard in
//     scripts/check-affiliate-links.ts throws if any product is assigned to such
//     a program, so a link can never ship untracked and unpaid.
//
// After an application is approved, paste the real ID into `trackingParam` for
// that program (and confirm commissionPct / cookieDays). See docs/affiliate-programs.md.
// ─────────────────────────────────────────────────────────────────────────────

export type ProgramKey =
  | 'amazon'
  | 'carlsplace'
  | 'shopindoorgolf'
  | 'golfgalaxy'
  | '2ndswing'
  | 'bushnell'
  | 'playbetter'
  | 'vice';

export interface AffiliateProgram {
  name: string;          // Display name shown on buttons, e.g. "Carl's Place"
  commissionPct: number; // Headline commission rate (%)
  cookieDays: number;    // Attribution / cookie window in days
  baseUrl: string;       // Retailer base URL used by buildUrl()
  trackingParam: string; // Affiliate ID appended by buildUrl(). '' = not yet approved (guard blocks use)
  signupUrl: string;     // Where to apply for / manage the program
  network: string;       // Affiliate network the program runs on
}

export const PROGRAMS: Record<ProgramKey, AffiliateProgram> = {
  // ── LIVE — accounts approved, tracking active ──────────────────────────────
  amazon: {
    name: 'Amazon',
    commissionPct: 3,
    cookieDays: 1, // 24-hour cookie
    baseUrl: 'https://www.amazon.com',
    trackingParam: 'cubicalgolfer-20', // Amazon Associates tag (live)
    signupUrl: 'https://affiliate-program.amazon.com/',
    network: 'Amazon Associates',
  },
  golfgalaxy: {
    name: 'Golf Galaxy',
    commissionPct: 8,
    cookieDays: 14,
    baseUrl: 'https://www.golfgalaxy.com',
    trackingParam: '101736949', // CJ publisher/PID (live — already used by 21 entries)
    signupUrl: 'https://www.cj.com/',
    network: 'CJ Affiliate',
  },
  playbetter: {
    name: 'PlayBetter',
    commissionPct: 5, // TODO verify current rate with PlayBetter
    cookieDays: 30, // TODO verify window
    baseUrl: 'https://www.playbetter.com',
    trackingParam: '2301:1333883', // live ghref value used in existing links
    signupUrl: 'https://www.playbetter.com/pages/affiliate-program',
    network: 'PlayBetter (direct / Impact)',
  },
  bushnell: {
    name: 'Bushnell',
    commissionPct: 5, // TODO verify current rate with Bushnell/Impact
    cookieDays: 30, // TODO verify window
    baseUrl: 'https://www.bushnellgolf.com',
    // Bushnell runs on Impact with PRE-GENERATED bushnell.pxf.io shortlinks that
    // are stored per-product in each entry's `url`. There is no appendable param,
    // so buildUrl() falls back to baseUrl for Bushnell. This value is a non-empty
    // sentinel meaning "approved & live" so the guard passes for existing entries.
    trackingParam: 'bushnell.pxf.io',
    signupUrl: 'https://bushnellgolf.com/pages/affiliate-program',
    network: 'Impact',
  },

  // ── PENDING — paste trackingParam after approval; guard blocks use until then ─
  carlsplace: {
    name: "Carl's Place",
    commissionPct: 15, // up to 15%
    cookieDays: 30,
    baseUrl: 'https://www.carlofet.com', // Carl's Place storefront (impact screens, enclosures, DIY sim kits)
    trackingParam: '', // TODO: paste AvantLink affiliate ID here after approval (AvantLink merchant #29797)
    signupUrl: 'https://classic.avantlink.com/apply.php?merchant_id=29797',
    network: 'AvantLink (merchant 29797)',
  },
  shopindoorgolf: {
    name: 'Shop Indoor Golf',
    commissionPct: 7.5,
    cookieDays: 30, // published $2,300 AOV
    baseUrl: 'https://www.shopindoorgolf.com', // launch monitors, complete simulator packages
    trackingParam: '', // TODO: paste CJ publisher/PID here after approval
    signupUrl: 'https://www.cj.com/',
    network: 'CJ Affiliate',
  },
  '2ndswing': {
    name: '2nd Swing',
    commissionPct: 15, // 15% on new releases, 5% otherwise — headline is 15
    cookieDays: 30, // TODO verify Awin window
    baseUrl: 'https://www.2ndswing.com',
    trackingParam: '', // TODO: paste Awin affiliate ID (awinaffid) here after approval
    signupUrl: 'https://www.awin.com/',
    network: 'Awin',
  },
  vice: {
    name: 'Vice Golf',
    commissionPct: 0, // TODO set rate after approval
    cookieDays: 0, // TODO set window after approval
    baseUrl: 'https://www.vicegolf.com',
    trackingParam: '', // TODO: paste affiliate ID here after approval
    signupUrl: 'https://www.vicegolf.com/',
    network: 'TODO — confirm network on signup',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Build a tracked outbound URL for a program + product path.
//
// This covers the common per-network conventions. Programs whose `trackingParam`
// is still '' return an UNTRACKED url (baseUrl + path); the build-time guard in
// scripts/check-affiliate-links.ts prevents any product from shipping on such a
// program, so an untracked URL can never actually reach production.
//
// Bushnell (Impact) uses pre-generated shortlinks stored directly in each entry's
// `url`, so buildUrl() is not the mechanism there — it falls back to baseUrl.
// ─────────────────────────────────────────────────────────────────────────────
export function buildUrl(program: ProgramKey, productPath: string): string {
  const p = PROGRAMS[program];
  const path = productPath.startsWith('/') ? productPath : `/${productPath}`;
  const target = `${p.baseUrl}${path}`;

  // Not set up yet → return the plain retailer URL (guard blocks entries anyway).
  if (program !== 'amazon' && p.trackingParam.trim() === '') return target;

  switch (program) {
    case 'amazon':
      // productPath is typically /dp/<ASIN>
      return `${p.baseUrl}${path}${path.includes('?') ? '&' : '?'}tag=${p.trackingParam}`;
    case 'playbetter':
      return `${p.baseUrl}${path}${path.includes('?') ? '&' : '?'}ghref=${encodeURIComponent(p.trackingParam)}`;
    case 'golfgalaxy':
    case 'shopindoorgolf':
      // CJ deep link: https://www.tkqlhce.com/click-<PID>-<AD>?url=<encoded target>
      return `https://www.tkqlhce.com/click-${p.trackingParam}?url=${encodeURIComponent(target)}`;
    case 'carlsplace':
      // AvantLink deep link (merchant 29797); pw = publisher/affiliate id
      return `https://www.avantlink.com/click.php?tt=cl&mi=29797&pw=${p.trackingParam}&url=${encodeURIComponent(target)}`;
    case '2ndswing':
      // Awin deep link
      return `https://www.awin1.com/cread.php?awinaffid=${p.trackingParam}&ued=${encodeURIComponent(target)}`;
    case 'bushnell':
    case 'vice':
    default:
      // Impact / other: links are pre-generated per product and stored on the entry.
      return target;
  }
}
