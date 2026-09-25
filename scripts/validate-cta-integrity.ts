#!/usr/bin/env node
/**
 * validate-cta-integrity.ts
 *
 * ── The failure this catches ───────────────────────────────────────────────
 * A page's Quick Answer box does two things a few pixels apart: the bottomLine
 * text names the top pick and its price, and the CTA button sells whatever
 * `quickAnswerProduct` points at. Nothing has ever checked that those are the
 * same product.
 *
 * They frequently are not. `/how-to-get-your-kid-into-golf/` tells the reader
 * "Our top pick: the Callaway XJ Junior Set (~$350)" and the button underneath
 * sells a Callaway Strata at **~$699**. `/best-launch-monitors-no-subscription/`
 * names the Shot Scope LM1 at ~$199 and sells a FlightScope Mevo Gen2 at
 * **~$1,299** — on a page that takes ~190 clicks a quarter.
 *
 * CORRECTION (25 Sep 2026): the paragraph above overstated the harm, and the
 * rendered page disproves it. The CTA button reads "Our #1 Pick: ~$1,299 at
 * Amazon — Check Today's Price", i.e. it prints the price of the product it
 * actually sells. The reader is NOT quoted one price and shown another. What
 * remains is a smaller, real problem: the sentence above the button can name
 * picks and prices without ever naming the thing the button sells, which is
 * confusing and buries the pick. That is what this script now checks —
 * `validate-quick-answer.ts` checks the CTA against the page's *sections*, not
 * against the sentence directly above the button.
 *
 * ── How it decides ─────────────────────────────────────────────────────────
 * It only looks at the diagnostic shape: a product name immediately followed by
 * a parenthesised price, e.g. `<strong>Callaway XJ Junior Set</strong> (~$350)`.
 * That phrasing is the site saying "this named thing, at this price, is the
 * pick" — so the button below it should sell that thing.
 *
 * Two deliberate suppressions, both measured against real hits:
 *   • generic nouns ("Putter", "Driver") — these resolve to arbitrary keys and
 *     produced pure noise.
 *   • two keys sharing a brand+model stem (`callaway-paradym-ai-smoke-max` vs
 *     `…-max-irons`) — a driver page naming the family is not a mismatch.
 *
 * Hand-measured on the 12 hits at the time of writing: 11 genuine, 1 borderline
 * (two SKLZ keys for near-identical mats at the same price). ~92% precision.
 *
 * ── Why a ceiling rather than a hard zero ──────────────────────────────────
 * Fixing a hit means changing which product a CTA sells, and link changes are
 * Ryan's call, not this script's. So the ceiling starts at the current count and
 * follows the house ratchet: it only ever goes down. The build cannot get worse,
 * and each approved fix tightens it.
 */
import { ARTICLES } from '../src/data/articles';
import { AFFILIATE } from '../src/data/affiliate-links';
import { PRODUCT_DISPLAY } from '../src/data/product-names';

/** Ratchet. Only ever edit this downward, after a real fix. */
/* 25 Sep 2026: 12 -> 2. Ten of the twelve were fixed or were this script's own
   false positives (three price shapes it could not read). The two that remain
   need a link changed, which is Ryan's call. 25 Sep: 2 -> 1, Qi35 Max given a
   section on /driver-loft-guide/ and named in its bottomLine. */
const CEILING = 1;
/** A gap this large means the reader is quoted a materially different price. */
const SEVERE_RATIO = 2.0;

const byName = Object.entries(PRODUCT_DISPLAY)
  .map(([k, n]) => ({ k, n: String(n) }))
  .sort((a, b) => b.n.length - a.n.length); // longest first: "Pro V1x" before "Pro V1"

/** Strip a variant suffix so driver/irons of the same model compare equal. */
const stem = (k: string) =>
  k.replace(/-(irons|driver|hybrid|wedge|putter|max|lite|senior|bag|set|pro|plus)$/, '');

const GENERIC = /^(putter|driver|irons|wedge|golf|set|balls?|shoes?|bag|glove)$/i;

const num = (s: unknown): number | null => {
  const m = String(s ?? '').match(/([\d,]+(?:\.\d+)?)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

interface Hit {
  slug: string; named: string; namedKey: string; namedPrice: string;
  ctaKey: string; ctaPrice: string; ratio: number | null;
}

const hits: Hit[] = [];
let inspected = 0;

for (const article of ARTICLES as any[]) {
  const ctaKey = article.quickAnswerProduct;
  if (!ctaKey || !article.bottomLine) continue;

  const bl = String(article.bottomLine);

  // A price may carry cents ($59.97) and may be followed by qualifying words
  // ($490 list, regularly on sale). Both shapes were invisible to the original
  // pattern, which demanded a bare "($490)" and a closing bracket — so on
  // /best-golf-rain-gear-2026/ and /best-launch-monitors-under-500/ it skipped
  // the correct first pick and reported the SECOND one as a mismatch. Two false
  // positives out of twelve, both traced 25 Sep 2026.
  // Third shape, and the one that hid a real error: the price written INSIDE
  // the tag, "<strong>Callaway Strata (from ~$455)</strong>". That page's
  // registry price is $481. Nothing checked it for as long as the pattern
  // insisted the price follow the closing tag.
  const PRICED = new RegExp(
    [
      // <strong>Name</strong> (~$123.45 ...)
      '<strong>([^<(]{4,60})<\\/strong>\\s*\\(~?\\$[\\d,]+(?:\\.\\d\\d)?\\b',
      // <strong>Name (from ~$123.45)</strong>
      '<strong>([^<(]{4,60}?)\\s*\\((?:from\\s*)?~?\\$[\\d,]+(?:\\.\\d\\d)?\\b[^<]*<\\/strong>',
      // bare Name (~$123.45 ...)
      "([A-Z][A-Za-z0-9 .+\\-']{4,50}?)\\s*\\(~?\\$[\\d,]+(?:\\.\\d\\d)?\\b",
    ].join('|'),
    'g',
  );

  // A bottomLine often names more than one pick with a price ("the X ($199) is
  // the best value... the Y ($1,299) is the best overall"), and the button
  // legitimately sells either one — its own label prints the product's real
  // price, so the reader is never quoted one figure and shown another. The
  // question worth asking is therefore not "is the FIRST named pick the one the
  // button sells" but "is the button's product named, with a price, anywhere in
  // the sentence above it". Only if it is named nowhere is the reader left
  // guessing.
  const namedPicks: string[] = [];
  for (const mm of bl.matchAll(PRICED)) {
    const n = (mm[1] ?? mm[2] ?? mm[3] ?? '').trim();
    if (n && !GENERIC.test(n)) namedPicks.push(n);
  }
  if (!namedPicks.length) continue;
  inspected++;

  const resolve = (n: string) =>
    byName.filter(
      x =>
        n.toLowerCase().includes(x.n.toLowerCase()) ||
        x.n.toLowerCase().includes(n.toLowerCase()),
    );

  // Does ANY named-with-price pick resolve to what the button sells?
  const sellsANamedPick = namedPicks.some(n =>
    resolve(n).some(c => c.k === ctaKey || stem(c.k) === stem(ctaKey)),
  );
  if (sellsANamedPick) continue;

  const named = namedPicks[0];
  const cand = resolve(named);
  if (!cand.length) continue;                              // name we cannot resolve — not a finding

  const namedEntry: any = (AFFILIATE as any)[cand[0].k];
  const ctaEntry: any = (AFFILIATE as any)[ctaKey];
  const p1 = num(namedEntry?.price);
  const p2 = num(ctaEntry?.price);
  const ratio = p1 && p2 ? (p1 > p2 ? p1 / p2 : p2 / p1) : null;

  hits.push({
    slug: article.slug,
    named,
    namedKey: cand[0].k,
    namedPrice: namedEntry?.price ?? '—',
    ctaKey,
    ctaPrice: ctaEntry?.price ?? '—',
    ratio,
  });
}

hits.sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0));
const severe = hits.filter(h => (h.ratio ?? 0) >= SEVERE_RATIO);

if (hits.length > CEILING) {
  console.error(
    `\n❌ CTA integrity: ${hits.length} page(s) name one product and sell another ` +
    `(ceiling ${CEILING}, which only goes down).\n`,
  );
  for (const h of hits) {
    console.error(`   ${h.slug}`);
    console.error(`      text names: ${h.named} [${h.namedKey}] ${h.namedPrice}`);
    console.error(`      button sells: ${h.ctaKey} ${h.ctaPrice}` +
      (h.ratio ? `   — ${h.ratio.toFixed(1)}x apart` : ''));
  }
  console.error('\n   The reader is quoted one price and clicks a different one.\n');
  process.exit(1);
}

console.log(
  `✅ CTA integrity: ${hits.length} page(s) name a pick the button does not sell ` +
  `(ceiling ${CEILING}) — ${inspected} named picks inspected.`,
);
if (severe.length) {
  console.log(`   ⚠️  ${severe.length} of them quote a price ${SEVERE_RATIO}x+ from what the button sells:`);
  for (const h of severe) {
    console.log(`      ${h.ratio!.toFixed(1)}x  ${h.slug} — says ${h.named} ${h.namedPrice}, sells ${h.ctaKey} ${h.ctaPrice}`);
  }
}
process.exit(0);
