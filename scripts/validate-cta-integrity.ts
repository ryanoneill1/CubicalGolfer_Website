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
 * That is the worst kind of defect this site can have: the reader is quoted one
 * price, clicks, and lands on something several times dearer. It costs the sale
 * and it costs trust, and no existing validator sees it —
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
const CEILING = 12;
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
  const m =
    bl.match(/<strong>([^<]{4,60})<\/strong>\s*\(~?\$[\d,]+\)/) ||
    bl.match(/([A-Z][A-Za-z0-9 .+\-']{4,50}?)\s*\(~?\$[\d,]+\)/);
  if (!m) continue;

  const named = m[1].trim();
  if (GENERIC.test(named)) continue;
  inspected++;

  const cand = byName.filter(
    x =>
      named.toLowerCase().includes(x.n.toLowerCase()) ||
      x.n.toLowerCase().includes(named.toLowerCase()),
  );
  if (!cand.length) continue;                              // name we cannot resolve — not a finding
  if (cand.some(c => c.k === ctaKey)) continue;            // the button sells what the text names
  if (cand.some(c => stem(c.k) === stem(ctaKey))) continue; // same model, different variant

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
