#!/usr/bin/env node
// scripts/validate-product-cards.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fails the build if any /compare/[slug]/ page would ship a broken product card.
//
// Every comparison page must render TWO complete, monetized product cards. This
// gate asserts, for productA and productB of every comparison, that:
//   1. the key resolves to a real AFFILIATE registry entry (no silent card drop
//      via the getAffiliateLink search-fallback),
//   2. the card image file actually exists on disk (no broken <img>),
//   3. the buy link is a recognized affiliate/monetized URL (a "tagged link"),
//   4. the key has a proper display name in PRODUCT_DISPLAY — so the template
//      never leaks a lowercase hyphen-stripped key as the product name,
// and that the declared winner is one of the two products on the page.
//
// This mirrors the exact resolution logic in src/pages/compare/[slug].astro.
// Run as part of `npm run validate` to catch monetization defects before deploy.
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';
import { COMPARISONS } from '../src/data/comparisons';
import { AFFILIATE } from '../src/data/affiliate-links';
import { PRODUCT_DISPLAY, productName } from '../src/data/product-names';
import { getProductImage } from '../src/lib/image-map';

const PUBLIC_DIR = 'public';

// A URL counts as an affiliate/monetized ("tagged") link if it carries the
// Amazon Associates tag or belongs to one of the partner affiliate networks.
const AFFILIATE_URL_SIGNALS: Array<RegExp> = [
  /[?&]tag=cubicalgolfer-20\b/, // Amazon Associates
  /\bpxf\.io\//,                 // Impact (Bushnell, etc.)
  /\banrdoezrs\.net\//,          // CJ Affiliate
  /\bkqzyfj\.com\//,             // CJ Affiliate
  /\bdpbolvw\.net\//,            // CJ Affiliate
  /\bjdoqocy\.com\//,            // CJ Affiliate
  /\btkqlhce\.com\//,            // CJ Affiliate
  /\bemjcd\.com\//,              // CJ Affiliate
  /\bplaybetter\.com\//,         // PlayBetter partner
  /\bsjv\.io\//,                 // Sovrn/Impact
  /\bprf\.hn\//,                 // Partnerize
];

function isTaggedLink(url: string): boolean {
  if (!url) return false;
  // An Amazon URL must specifically carry our associate tag, not just be amazon.
  if (/amazon\./.test(url)) return /[?&]tag=cubicalgolfer-20\b/.test(url);
  return AFFILIATE_URL_SIGNALS.some((re) => re.test(url));
}

interface Problem {
  slug: string;
  msg: string;
}
const problems: Problem[] = [];

for (const c of COMPARISONS as any[]) {
  let images = 0;
  let taggedLinks = 0;

  for (const [role, key] of [
    ['productA', c.productA],
    ['productB', c.productB],
  ] as const) {
    const aff: any = AFFILIATE[key];

    // (1) Key must resolve to a real registry entry — else the card drops.
    if (!aff) {
      problems.push({
        slug: c.slug,
        msg: `${role} "${key}" is not in the AFFILIATE registry — card would drop / be unmonetized.`,
      });
      continue;
    }

    // (4) Display name must exist — else a lowercase key leaks as the name.
    if (!PRODUCT_DISPLAY[key]) {
      problems.push({
        slug: c.slug,
        msg: `${role} "${key}" has no PRODUCT_DISPLAY name — lowercase name would leak.`,
      });
    } else {
      const rendered = productName(key);
      if (rendered === key.replace(/-/g, ' ') || rendered === rendered.toLowerCase()) {
        problems.push({
          slug: c.slug,
          msg: `${role} "${key}" renders as a lowercase name leak ("${rendered}").`,
        });
      }
    }

    // (2) Card image must exist on disk.
    const imgSrc: string = aff.imgSrc || getProductImage(key);
    const diskPath = path.join(PUBLIC_DIR, imgSrc.replace(/^\//, ''));
    if (fs.existsSync(diskPath)) {
      images++;
    } else {
      problems.push({
        slug: c.slug,
        msg: `${role} "${key}" image missing on disk: ${imgSrc} (expected ${diskPath}).`,
      });
    }

    // (3) Buy link must be a monetized affiliate URL.
    if (isTaggedLink(aff.url)) {
      taggedLinks++;
    } else {
      problems.push({
        slug: c.slug,
        msg: `${role} "${key}" buy link is not a tagged affiliate URL: ${aff.url}`,
      });
    }
  }

  // Every page must ship exactly two images + two tagged links.
  if (images < 2) {
    problems.push({ slug: c.slug, msg: `only ${images}/2 product images present.` });
  }
  if (taggedLinks < 2) {
    problems.push({ slug: c.slug, msg: `only ${taggedLinks}/2 tagged affiliate links present.` });
  }

  // Winner must be one of the two products, with a resolvable display name.
  if (c.winner !== c.productA && c.winner !== c.productB) {
    problems.push({
      slug: c.slug,
      msg: `winner "${c.winner}" is neither productA (${c.productA}) nor productB (${c.productB}).`,
    });
  } else if (!PRODUCT_DISPLAY[c.winner]) {
    problems.push({ slug: c.slug, msg: `winner "${c.winner}" has no PRODUCT_DISPLAY name.` });
  }
}

if (problems.length > 0) {
  console.log(`\n❌ validate-product-cards: ${problems.length} problem(s) across compare pages:\n`);
  for (const p of problems) {
    console.log(`  /compare/${p.slug}/  —  ${p.msg}`);
  }
  console.log(
    `\nEvery /compare/ page must ship 2 images + 2 tagged affiliate links, a resolvable ` +
    `winner, and zero lowercase name leaks. Fix in comparisons.ts / affiliate-links.ts / ` +
    `product-names.ts, or add the missing image under public/images/products/.\n`,
  );
  process.exit(1);
} else {
  console.log(
    `✓ validate-product-cards: all ${COMPARISONS.length} compare pages ship 2 images + ` +
    `2 tagged links, valid winners, and no lowercase name leaks.`,
  );
}
