/**
 * validate-json-ld.ts — post-build guard
 *
 * Added 2026-08. A shared schema helper was being called with { url } by
 * standalone pages but read `article.slug`, so 18 JSON-LD fields across 6 pages
 * emitted "https://www.cubicalgolfer.comundefined". Search Console silently
 * dropped those pages' Article markup.
 *
 * Scans every built page for JSON-LD that is unparseable or contains the
 * literal strings "undefined" / "null" / "NaN" in a URL or @id position.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
};

const problems: string[] = [];
let blocks = 0;

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    blocks++;
    const raw = m[1];
    if (/(?:undefined|\bNaN\b)/.test(raw)) {
      const hit = raw.match(/.{0,60}(?:undefined|NaN).{0,40}/)?.[0] ?? '';
      problems.push(`${rel}: JSON-LD contains "undefined"/"NaN" → …${hit.trim()}…`);
      continue;
    }
    try { JSON.parse(raw); }
    catch (err) { problems.push(`${rel}: JSON-LD is not valid JSON (${(err as Error).message})`); }
  }
}

if (problems.length) {
  console.error(`\n❌ ${problems.length} JSON-LD problem(s) found:`);
  for (const p of problems.slice(0, 25)) console.error('   ' + p);
  if (problems.length > 25) console.error(`   …and ${problems.length - 25} more`);
  process.exit(1);
}
console.log(`✅ JSON-LD: ${blocks} schema blocks parse cleanly, none contain undefined/NaN.`);
