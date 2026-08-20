#!/usr/bin/env node
// scripts/validate-llms.ts
//
// llms.txt and llms-full.txt are what AI crawlers read. They ship verbatim from
// public/, so nothing in the normal build touched them — and they drifted badly:
// 16 dead URLs between them, including a rangefinder discontinued in 2023 still
// advertised at $329.
//
// llms-full.txt is now generated. llms.txt stays hand-curated, because its short
// descriptions are worth keeping. Both are checked here against the pages that
// actually built, so a retired page can never keep being advertised.

import fs from 'fs';
import path from 'path';

const SITE = 'https://www.cubicalgolfer.com';

/** Every route that actually built. */
function livePages(dir: string, base = ''): Set<string> {
  const out = new Set<string>();
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      for (const p of livePages(full, `${base}/${e.name}`)) out.add(p);
    } else if (e.name === 'index.html') {
      out.add(base === '' ? '/' : `${base}/`);
    } else if (e.name.endsWith('.html')) {
      out.add(`${base}/${e.name.replace(/\.html$/, '')}/`);
    } else {
      // Non-page assets (sitemap.xml, llms.txt, downloads) are legitimate targets.
      out.add(`${base}/${e.name}`);
    }
  }
  return out;
}

const live = livePages('dist');
if (live.size < 50) {
  console.error('\n❌ validate-llms: dist looks empty — run the build first.\n');
  process.exit(1);
}

let failed = false;

for (const file of ['public/llms.txt', 'public/llms-full.txt']) {
  if (!fs.existsSync(file)) {
    console.error(`\n❌ ${file} is missing.\n`);
    failed = true;
    continue;
  }
  const src = fs.readFileSync(file, 'utf8');
  const found = [...src.matchAll(new RegExp(SITE.replace(/[.]/g, '\\.') + '(/[^)\\s\\]]*)', 'g'))]
    .map(m => m[1]);

  const dead: string[] = [];
  for (const raw of new Set(found)) {
    // A path with an extension is an asset; otherwise it is a page route.
    const candidate = /\.[a-z0-9]{2,4}$/i.test(raw) ? raw : (raw.endsWith('/') ? raw : `${raw}/`);
    if (!live.has(candidate)) dead.push(raw);
  }

  if (dead.length) {
    console.error(`\n❌ ${file} points at ${dead.length} page(s) that do not exist:`);
    for (const d of dead) console.error(`   ${SITE}${d}`);
    console.error('\nThese are what AI crawlers read. Remove them or restore the pages.\n');
    failed = true;
  } else {
    console.log(`✅ ${file}: all ${new Set(found).size} URLs resolve to a built page.`);
  }
}

// Coverage: the generated file should track the site, not lag it.
const fullUrls = new Set(
  [...fs.readFileSync('public/llms-full.txt', 'utf8')
    .matchAll(new RegExp(SITE.replace(/[.]/g, '\\.') + '(/[^)\\s\\]]*)', 'g'))].map(m => m[1])
);
const livePageRoutes = [...live].filter(p => !/\.[a-z0-9]{2,4}$/i.test(p));
const coverage = Math.round((fullUrls.size / livePageRoutes.length) * 100);
if (coverage < 85) {
  console.error(`\n❌ llms-full.txt covers only ${coverage}% of live pages (${fullUrls.size}/${livePageRoutes.length}). Regenerate it.\n`);
  failed = true;
} else {
  console.log(`✅ llms-full.txt covers ${coverage}% of live pages (${fullUrls.size}/${livePageRoutes.length}).`);
}

process.exit(failed ? 1 : 0);
