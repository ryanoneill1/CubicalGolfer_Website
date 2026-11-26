/**
 * retailer.ts — which shop is on the other end of this link?
 *
 * ── Why this is a module and not a ternary ─────────────────────────────────
 * Five files each carried their own version of this question and they
 * disagreed. The two ways they got it wrong, both found in Sprint 286:
 *
 *   HOSTNAME ONLY. Every Golf Galaxy link here is a CJ redirect, so the
 *   hostname is www.tkqlhce.com or one of four siblings — 234 links in the
 *   registry — and contains no retailer name. RecommendedGearGrid read the
 *   hostname, got 'other', and printed the word "Retailer" on 17 live buy
 *   buttons across seven pages.
 *
 *   SUBSTRING ORDER. AffiliateCTA searched the whole URL and tested
 *   'bushnell' before 'golfgalaxy'. A Golf Galaxy CJ link to a Bushnell
 *   product has "bushnell" in its searchTerm, so it was recorded as a
 *   Bushnell click while actually going to Golf Galaxy.
 *
 * A tracking link is a WRAPPER around a destination. Reading the wrapper was
 * always going to be wrong, which is why this decodes the url= parameter and
 * classifies what is genuinely on the other end.
 *
 * Keep this as a module. Sprint 283 learned that an arrow function inside a
 * tag attribute defeats validate-click-tracking, whose tag pattern stops at
 * the first '>'.
 */

/** CJ affiliate-network hosts. They wrap a real destination in ?url=. */
const CJ_HOSTS = /^(www\.)?(tkqlhce|anrdoezrs|jdoqocy|kqzyfj|dpbolvw)\.(com|net)$/i;

export type Retailer = 'amazon' | 'golfgalaxy' | 'playbetter' | 'bushnell' | 'other';

/** The URL a click actually lands on, unwrapping one layer of CJ redirect. */
export function destinationOf(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (CJ_HOSTS.test(u.hostname)) {
      const inner = u.searchParams.get('url');
      if (inner) return inner;            // searchParams already decodes it
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * The retailer a click reaches. Judged on the DESTINATION's hostname, so a
 * product name inside a query string can never outvote the real shop.
 */
export function retailerOf(url: string | null | undefined): Retailer {
  const dest = destinationOf(url);
  if (!dest) return 'other';
  let host: string;
  try { host = new URL(dest).hostname.toLowerCase(); } catch { host = dest.toLowerCase(); }
  if (host.includes('amazon.')) return 'amazon';
  if (host.includes('golfgalaxy') || host.includes('dickssportinggoods')) return 'golfgalaxy';
  if (host.includes('playbetter')) return 'playbetter';
  if (host.includes('bushnell')) return 'bushnell';
  return 'other';
}

/** Display name for a buy button. Never returns the word "Retailer". */
export function retailerName(url: string | null | undefined): string {
  switch (retailerOf(url)) {
    case 'amazon':     return 'Amazon';
    case 'golfgalaxy': return 'Golf Galaxy';
    case 'playbetter': return 'PlayBetter';
    case 'bushnell':   return 'Bushnell';
    default:           return 'the retailer';
  }
}
