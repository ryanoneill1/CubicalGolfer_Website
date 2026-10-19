/**
 * validate-deep-links.ts — Sprint 185
 *
 * WHAT IT GUARDS
 * A buy button that lands the reader on a SEARCH RESULTS page instead of the
 * product. The reader has already done the hard part — they clicked. Then they
 * arrive somewhere that asks them to find the thing themselves.
 *
 * Measured when this was written: 91 of 356 products (26%) had a search page as
 * their primary link, 159 of 179 second links were search pages, and 61
 * products sent BOTH links to a search.
 *
 * THE DETECTOR, AND WHY IT DECODES FIRST
 * The first version of this check missed most of them. Affiliate links are
 * wrapped in network redirects (CJ: anrdoezrs.net/click-…?url=<encoded>), so a
 * Golf Galaxy search URL arrives as "%2Fsearch%2FSearchDisplay%3FsearchTerm%3D".
 * Matching on "searchTerm=" or "/search" finds nothing. It reported 62
 * products as free to fix when the true answer was 2. URLs are decoded up to
 * three times before matching.
 *
 * NOT EVERY SEARCH LINK IS A DEFECT
 * A putter sold by hand and length, a glove by size, a shoe by width — the
 * reader has to choose a variant anyway, so a search landing is honest and
 * converts fine. Several priceNotes say exactly this. This check therefore
 * RATCHETS the total rather than demanding zero: the number may fall, never
 * rise, so no new search-link product gets added without someone deciding it
 * is one of the legitimate ones.
 */
import { AFFILIATE } from '../src/data/affiliate-links';

const CEILING = 91;          // measured Sprint 185 — lower it, never raise it
const BOTH_CEILING = 61;     // products where BOTH links go to a search

const decodeDeep = (u: string): string => {
  let s = u;
  for (let i = 0; i < 3; i++) {
    try { const d = decodeURIComponent(s); if (d === s) break; s = d; } catch { break; }
  }
  return s;
};

const isSearch = (u: string): boolean => {
  const d = decodeDeep(u);
  return /[?&](k|q|searchTerm|keyword|Ntt)=/i.test(d)
      || /\/s\?/.test(d)
      || /\/search/i.test(d)
      || /SearchDisplay/i.test(d);
};

let primarySearch = 0, bothSearch = 0, live = 0;
const offenders: string[] = [];
for (const [key, v] of Object.entries(AFFILIATE as Record<string, any>)) {
  const url = v.url || '';
  if (!url) continue;
  live++;
  const ps = isSearch(url);
  if (ps) { primarySearch++; offenders.push(key); }
  const sec = v.golfGalaxyUrl || '';
  if (ps && sec && isSearch(sec)) bothSearch++;
}

console.log('');
const problems: string[] = [];
if (primarySearch > CEILING) problems.push(`${primarySearch} product(s) have a SEARCH page as the primary buy link — ceiling ${CEILING}.`);
if (bothSearch > BOTH_CEILING) problems.push(`${bothSearch} product(s) send BOTH links to a search page — ceiling ${BOTH_CEILING}.`);

if (problems.length) {
  console.log('❌ Deep links:');
  problems.forEach(p => console.log('   - ' + p));
  console.log('');
  console.log('   A search landing spends a click the site worked hard for. If this');
  console.log('   product genuinely has variants the reader must choose between, say so');
  console.log('   in its priceNote and raise the ceiling deliberately — do not raise it');
  console.log('   just to make the build pass.');
  console.log('');
  process.exit(1);
}
console.log(`✅ Deep links: ${primarySearch}/${live} product(s) link to a search page (ceiling ${CEILING}); ${bothSearch} send both links there (ceiling ${BOTH_CEILING}).`);
if (primarySearch < CEILING) console.log(`   ${CEILING - primarySearch} below the ceiling — lower CEILING to ${primarySearch}.`);
