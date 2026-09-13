/**
 * validate-reader-facing-notes.ts — pre-build guard
 *
 * Added Sprint R2j. `priceNote` is NOT an internal field. It renders on the live
 * page behind a 💡 next to the buy button, so every word in it is customer copy.
 *
 * Nine of them had been written as QA notes to ourselves and were live, including:
 *
 *   "ASIN B096B5JR5D went dead (Amazon Page Not Found) while still linked from
 *    26 articles and the gear quiz; repointed to B095QX1FSR…"
 *   "Was carried here at $906 and had never been verified — a $213 understatement."
 *   "The earlier DISCONTINUED note was wrong…"
 *   "…SiteStripe flags the listing as high-priced…"
 *
 * A reader deciding whether to spend $1,119 does not need to be told our own
 * record-keeping was wrong; it reads as an admission that the site's numbers are
 * unreliable, on the exact element meant to build confidence in them.
 *
 * The facts are still worth writing down — they just belong in the sprint report
 * and in git history, not on the page. Keep the note about the PRODUCT (price,
 * stock, what the link points at, when to expect a discount) and leave our
 * process out of it.
 */
import { AFFILIATE } from '../src/data/affiliate-links';

// Phrases that only make sense to someone maintaining the site.
const INTERNAL = [
  /\bASINs?\b/i,
  /kept as a search link/i,
  /is unconfirmed/i,
  /went dead/i,
  /page not found/i,
  /had never been verified/i,
  /never been verified/i,
  /understatement/i,
  /overstatement/i,
  /sitestripe/i,
  /no buy box/i,
  /see all buying options/i,
  /the search link this replaced/i,
  /this replaced/i,
  /(?:note|figure|entry|check) (?:here )?was wrong/i,
  /which was wrong/i,
  /blocks automated/i,
  /listed here at/i,
  /carried here at/i,
  /repointed/i,
  /still linked from/i,
  /needs re-?checking/i,
  /\bregistry\b/i,
  /validator/i,
  /sprint \d+/i,
];

const violations: string[] = [];

for (const [key, entry] of Object.entries(AFFILIATE as Record<string, any>)) {
  const note = entry?.priceNote;
  if (typeof note !== 'string' || !note.trim()) continue;
  const hit = INTERNAL.find((re) => re.test(note));
  if (hit) {
    const m = note.match(hit)!;
    violations.push(`${key}: "…${note.slice(Math.max(0, m.index! - 40), m.index! + m[0].length + 40)}…"`);
  }
}

if (violations.length) {
  console.error(`\n❌ ${violations.length} priceNote(s) contain internal language and are live on the site:`);
  for (const v of violations) console.error('   ' + v);
  console.error(
    '\npriceNote renders next to the buy button. Write it for someone deciding\n' +
      'whether to spend the money: price, stock, what the link points at, when it\n' +
      'usually discounts. Our own verification history belongs in the sprint report.\n',
  );
  process.exit(1);
}

const withNotes = Object.values(AFFILIATE as Record<string, any>).filter(
  (e: any) => typeof e?.priceNote === 'string' && e.priceNote.trim(),
).length;
console.log(`✅ Reader-facing notes: all ${withNotes} priceNote(s) are written for customers, not maintainers.`);
