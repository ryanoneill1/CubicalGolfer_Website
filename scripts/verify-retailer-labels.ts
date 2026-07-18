// verify-retailer-labels.ts — POST-BUILD guard (July 2026)
// Scans every rendered page: any anchor whose visible text says "at <Retailer>"
// must link to that retailer's domains. Fails the build on any mismatch, so a
// crossed label/URL pair can never ship again, regardless of which component
// or data field produced it.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOMAINS: Record<string, string[]> = {
  amazon: ['amazon.com', 'amzn.to'],
  bushnell: ['pxf.io', 'bushnellgolf.com'],
  playbetter: ['playbetter.com'],
  'golf galaxy': ['golfgalaxy.com', 'tkqlhce.com', 'anrdoezrs.net', 'jdoqocy.com', 'dpbolvw.net', 'kqzyfj.com'],
};

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
      if (text.includes(`at ${retailer}`)) {
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
console.log(`✅ Retailer labels verified: ${checked} labeled links all point to the retailer they name.`);
