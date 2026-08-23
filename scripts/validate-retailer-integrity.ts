// validate-retailer-integrity.ts — added July 2026
// Fails the build if any affiliate entry's label, retailer field, or URL
// disagree, or if attribution params are missing. Prevents the class of bug
// where a CTA says one retailer but links to another, and guarantees every
// link carries its tracking (Amazon tag / PlayBetter ghref / CJ publisher ID).
import { readFileSync } from 'fs';
const t = readFileSync('src/data/affiliate-links.ts', 'utf-8');
const dom = (u: string) =>
  /amazon/.test(u) ? 'Amazon' : /playbetter/.test(u) ? 'PlayBetter' :
  /pxf\.io/.test(u) ? 'Bushnell' : /ezgo\./.test(u) ? 'E-Z-GO' : /clubcar\./.test(u) ? 'Club Car' : /(tkqlhce|anrdoezrs|jdoqocy|dpbolvw|kqzyfj|golfgalaxy)/.test(u) ? 'Golf Galaxy' : null;
const errs: string[] = [];
const entryRe = /^  '([a-z0-9-]+)': \{([\s\S]*?)^  \},/gm;
let m: RegExpExecArray | null, n = 0;
while ((m = entryRe.exec(t))) {
  n++;
  const [_, key, body] = m;
  const url = (body.match(/url: ['`]([^'`]+)['`]/) || [])[1] || '';
  const retailer = (body.match(/retailer: '([^']+)'/) || [])[1] || '';
  const label = (body.match(/label: '((?:[^'\\]|\\.)*)'/) || [])[1] || '';
  const gg = (body.match(/golfGalaxyUrl: ['`]([^'`]+)['`]/) || [])[1] || '';
  const d = dom(url);
  if (d && retailer && retailer !== d) errs.push(`${key}: retailer '${retailer}' but url is ${d}`);
  const labRet = ['Bushnell', 'PlayBetter', 'Golf Galaxy', 'Amazon', 'E-Z-GO', 'Club Car'].find(r => label.includes(r));
  if (d && labRet && labRet !== d) errs.push(`${key}: label names ${labRet} but url is ${d}`);
  if (/amazon\.com/.test(url) && !url.includes('tag=cubicalgolfer-20')) errs.push(`${key}: amazon url missing tag`);
  if (/playbetter/.test(url) && !/ghref=2301(%3A|:)1333883/.test(url)) errs.push(`${key}: playbetter url missing ghref`);
  if (/(tkqlhce|anrdoezrs|jdoqocy|dpbolvw|kqzyfj)/.test(url) && !url.includes('101736949')) errs.push(`${key}: CJ url missing publisher ID`);
  if (gg && /golfgalaxy/.test(gg) && !/(tkqlhce|anrdoezrs|jdoqocy|dpbolvw|kqzyfj)/.test(gg)) errs.push(`${key}: bare golfgalaxy secondary (no CJ wrapper)`);
  if (gg && /playbetter/.test(gg) && !/ghref=2301(%3A|:)1333883/.test(gg)) errs.push(`${key}: playbetter secondary missing ghref`);
}
if (errs.length) {
  console.error(`\n❌ Retailer integrity: ${errs.length} issue(s):`);
  errs.slice(0, 20).forEach(e => console.error('   ' + e));
  process.exit(1);
}
console.log(`✅ Retailer integrity: ${n} entries — labels, retailer fields, URLs, and attribution all consistent.`);
