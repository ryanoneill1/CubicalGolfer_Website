#!/usr/bin/env node
/**
 * validate-asin-url-agreement.ts — the `asin` field must name the ASIN the
 * `url` actually points at.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * An Amazon record can carry the same product identity twice:
 *
 *     asin: 'B0BR2YF8T6',
 *     url:  'https://www.amazon.com/dp/B0DPN6VNK1?...tag=cubicalgolfer-20',
 *
 * Only the `url` is clickable. The `asin` field is metadata — it feeds
 * tooling and nothing a reader ever touches. So when the two disagree,
 * nothing breaks and nothing complains, and the stale one sits there
 * indefinitely.
 *
 * On 7 November 2026 that cost real time. A live sweep of every Amazon
 * product checked the `asin` field for titleist-pro-v1, found B0BR2YF8T6
 * "Currently unavailable", and reported the Pro V1 link as dead — on the
 * compression chart, the single biggest page on the site. It was not dead.
 * The `url` pointed at B0DPN6VNK1, which was in stock at $57.99 and shipped
 * by Amazon. The alarm was entirely an artefact of reading the wrong field.
 *
 * Two records were in that state (titleist-pro-v1, wilson-profile-sgi) out of
 * 41 carrying both fields. Both have since been reconciled. This check is
 * what stops the next one being discovered the same expensive way.
 *
 * ── The check ──────────────────────────────────────────────────────────────
 * For every record that has BOTH an `asin` field and an amazon.com `/dp/<ASIN>`
 * url: the two ASINs must be identical.
 *
 * ── Why it is narrow on purpose ────────────────────────────────────────────
 * It does NOT require an `asin` field to exist. 125 of the 166 Amazon product
 * links carry none, the url alone is sufficient, and demanding the field
 * everywhere would be 125 edits of pure bookkeeping for no reader benefit.
 *
 * It does NOT check that either ASIN is live. Availability is a live-web fact
 * that changes without a commit; a build-time check cannot know it and would
 * fail the build for reasons outside the repo. Liveness stays a periodic
 * manual sweep.
 *
 * It does NOT touch search-link records (`/s?k=...`), which have no ASIN to
 * agree with by design.
 */

import { AFFILIATE } from '../src/data/affiliate-links.ts';

type Row = { key: string; asin: string; urlAsin: string };

const mismatched: Row[] = [];
let bothPresent = 0;
let urlOnly = 0;
let asinOnly = 0;

for (const [key, rec] of Object.entries(AFFILIATE as Record<string, any>)) {
  const url = typeof rec?.url === 'string' ? rec.url : '';
  if (!/amazon\.com/.test(url)) continue;

  const urlAsin = (url.match(/\/dp\/([A-Z0-9]{10})/) ?? [])[1];
  const asin = typeof rec?.asin === 'string' ? rec.asin : undefined;

  if (!urlAsin && !asin) continue;          // search link — nothing to compare
  if (urlAsin && !asin) { urlOnly++; continue; }
  if (!urlAsin && asin) { asinOnly++; continue; }

  bothPresent++;
  if (asin !== urlAsin) mismatched.push({ key, asin: asin!, urlAsin: urlAsin! });
}

if (mismatched.length) {
  console.error(`\n❌ ASIN/URL disagreement: ${mismatched.length} record(s) name one ASIN and link another.\n`);
  for (const m of mismatched) {
    console.error(`   ${m.key}`);
    console.error(`      asin field : ${m.asin}`);
    console.error(`      url points : ${m.urlAsin}   <- this is what readers click`);
  }
  console.error(
    '\n   Only the url is clickable, so a stale asin field breaks nothing a reader\n' +
    '   sees — which is exactly why it survives. It does mislead any check or\n' +
    '   sweep that trusts the field: a dead asin against a live url reads as a\n' +
    '   dead link on a page that is in fact fine. Set the field to the ASIN in\n' +
    '   the url, or drop the field and let the url be the single source.\n'
  );
  process.exit(1);
}

console.log(
  `✅ ASIN/URL agreement: ${bothPresent} record(s) carry both fields and all agree ` +
  `(${urlOnly} url-only, ${asinOnly} asin-only — neither is a defect).`
);
