// Fails the build if any built page renders an affiliate link before its
// first affiliate disclosure. FTC clear-and-conspicuous enforcement.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const AFF = /href="[^"]*(?:amazon\.com[^"]*tag=cubicalgolfer-20|anrdoezrs\.net|pxf\.io|playbetter\.com[^"]*ghref)[^"]*"/;
const DISC = /early-disclosure|affiliate (?:link|commission)|may earn|As an Amazon Associate|we earn from qualifying/i;
function* htmlFiles(dir: string): Generator<string> {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (e === 'index.html') yield p;
  }
}
const bad: string[] = [];
for (const f of htmlFiles('dist')) {
  const d = readFileSync(f, 'utf-8');
  const body = d.slice(d.indexOf('<body'));
  const a = body.match(AFF);
  if (!a || a.index === undefined) continue;
  const m = body.match(DISC);
  if (!m || m.index === undefined || m.index > a.index) bad.push(f.replace('dist','').replace('index.html',''));
}
if (bad.length) {
  console.error(`\n❌ ${bad.length} page(s) show an affiliate link before any disclosure:`);
  bad.slice(0, 25).forEach(p => console.error('   ' + p));
  process.exit(1);
}
console.log('✅ Disclosure order: every page with affiliate links discloses first.');
