// verify-retailer-labels.ts — POST-BUILD guard (July 2026)
// Scans every rendered page: any anchor whose visible text NAMES a retailer
// must link to that retailer's domains. Fails the build on any mismatch, so a
// crossed label/URL pair can never ship again, regardless of which component
// or data field produced it.
//
// Oct 2026 (Sprint 171): this guard matched only the preposition "at", and the
// Quick Pick button said "Check Price ON Amazon" — hardcoded, on every page,
// regardless of destination. 31 pages sent readers to Bushnell, PlayBetter,
// E-Z-GO or CJ under an Amazon label, above the fold, on the
// highest-converting element on the page, and this check never saw one of
// them. One missing preposition. Now matches at/on/from, and the retailer list
// covers every program in PROGRAMS rather than the first four.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOMAINS: Record<string, string[]> = {
  amazon: ['amazon.com', 'amzn.to'],
  bushnell: ['pxf.io', 'bushnellgolf.com'],
  playbetter: ['playbetter.com'],
  'golf galaxy': ['golfgalaxy.com', 'tkqlhce.com', 'anrdoezrs.net', 'jdoqocy.com', 'dpbolvw.net', 'kqzyfj.com'],
  'e-z-go': ['txtsv.com', 'ezgo.com'],
  '2nd swing': ['2ndswing.com'],
  'vice golf': ['vicegolf.com'],
  'shopindoorgolf': ['shopindoorgolf.com'],
};

/** Prepositions a label can use before a retailer name. "on" was the gap. */
const PREPS = ['at', 'on', 'from'];

function* htmlFiles(dir: string): Generator<string> {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (f.endsWith('.html')) yield p;
  }
}

const anchorRe = /<a\s[^>]*?href="(https?:\/\/[^"]+)"[^>]*?>(.*?)<\/a>/gs;
const failures: string[] = [];
let checked = 0;
for (const file of htmlFiles('dist')) {
  const html = readFileSync(file, 'utf-8');
  for (const m of html.matchAll(anchorRe)) {
    const [_, href, inner] = m;
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
    for (const [retailer, domains] of Object.entries(DOMAINS)) {
      if (PREPS.some(pp => text.includes(`${pp} ${retailer}`))) {
        checked++;
        if (!domains.some(d => href.includes(d))) {
          failures.push(`${file.replace('dist/', '')} :: "${text.trim().slice(0, 50)}" -> ${href.slice(0, 90)}`);
        }
      }
    }
  }
}
if (failures.length) {
  console.error(`\n❌ ${failures.length} retailer label/URL mismatches:`);
  for (const f of failures.slice(0, 25)) console.error('   ' + f);
  process.exit(1);
}
console.log(`✅ Retailer labels verified: ${checked} labeled link(s) all point to the retailer they name ` +
  `(matching ${PREPS.join('/')} + ${Object.keys(DOMAINS).length} retailers).`);
