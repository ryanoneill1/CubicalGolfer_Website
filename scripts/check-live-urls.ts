#!/usr/bin/env node
/**
 * check-live-urls.ts — fetch every URL this site puts in its own sitemap and
 * report what the live edge actually returns.
 *
 * NOT part of `npm run validate`. It needs network access and hits ~270 URLs,
 * so it runs on demand:  npm run check-urls
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Google Search Console reported 48 URLs under "Page with redirect", with a
 * validation that started 20 June 2026 and FAILED on 1 July. Working through
 * that list by hand:
 *
 *   · 40 of the 48 were fine. They are the redirect SOURCES in public/_redirects
 *     — old .html URLs and consolidated slugs. "Page with redirect" is the
 *     correct, healthy status for a URL that redirects on purpose. Not a bug.
 *   · 3 were the apex/http host variants (cubicalgolfer.com, http://…), which
 *     redirect to https://www. Also correct.
 *   · 1 was a non-www variant of a page that serves 200 on www.
 *   · 4 WERE REAL, and no build check could ever have seen them:
 *
 *        /best-blade-putters-2026/                      → /best-golf-putters-2026/
 *        /best-putters-yips/                            → /best-golf-putters-2026/
 *        /compare/taylormade-qi35-vs-callaway-ai-smoke/ → /compare/callaway-paradym-vs-taylormade-qi35/
 *        /golf-desk-accessories-office/                 → /office-to-golf-course-playbook/
 *
 * Each of those four is built by Astro, listed in the sitemap, and emits a
 * self-referencing canonical — and then redirects at the edge. The site is
 * telling Google "index this URL" and "this URL is not the one you want" at the
 * same time. That contradiction is exactly what makes a GSC validation fail:
 * Google keeps recrawling because the sitemap keeps re-asserting the URL.
 *
 * None of those four redirects appears in public/_redirects. `git log -S` finds
 * them in NO commit of any redirects file, ever. They are configured outside
 * the repository — Cloudflare Redirect Rules or Bulk Redirects in the dashboard.
 * That is why every build-time validator we have was silent: the redirect does
 * not exist in anything the build can read.
 *
 * The only way to catch this class is to ask the live site. That is this script.
 *
 * ── The rule that matters most ─────────────────────────────────────────────
 * Same as check-live-listings: a checker that cannot tell "broken" from "I could
 * not reach it" is worse than no checker, because it sends you deleting live
 * pages. So the vocabulary separates what we know from what we failed to learn:
 *
 *   OK        200, and the page's canonical points at itself
 *   REDIRECT  the sitemap lists it but the edge sends you elsewhere  ← the bug
 *   CANONICAL 200, but the canonical names a DIFFERENT url (softer version
 *             of the same contradiction — Google is told to index something
 *             the page itself disclaims)
 *   GONE      404 / 410 — in the sitemap, not on the server
 *   ERROR     we learned nothing. Never counted, never fails the run.
 *
 * Exits non-zero only for REDIRECT, CANONICAL and GONE — things positively
 * established as wrong. A flaky connection cannot turn this into a false alarm.
 *
 * Usage:
 *   npm run check-urls
 *   ONLY=putters npm run check-urls        # spot-check a subset
 *   DELAY_MS=300 npm run check-urls        # be gentler
 *   BASE=https://staging.example.com npm run check-urls
 */

import fs from 'fs';
import path from 'path';

const BASE     = process.env.BASE || 'https://www.cubicalgolfer.com';
const DELAY_MS = Number(process.env.DELAY_MS || 150);
const ONLY     = process.env.ONLY || '';
const OUT_MD   = 'scripts/output/live-url-report.md';
const OUT_CSV  = 'scripts/output/live-url-report.csv';
const UA       = 'Mozilla/5.0 (compatible; CubicalGolferLinkCheck/1.0)';

type Status = 'OK' | 'REDIRECT' | 'CANONICAL' | 'GONE' | 'ERROR';
interface Row { url: string; status: Status; code: number | string; detail: string }

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Read every <loc> out of every sitemap in dist/. */
function sitemapUrls(): string[] {
  const dir = 'dist';
  if (!fs.existsSync(dir)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(2);
  }
  const files = fs.readdirSync(dir).filter(f => /^sitemap.*\.xml$/.test(f));
  const urls = new Set<string>();
  for (const f of files) {
    const xml = fs.readFileSync(path.join(dir, f), 'utf-8');
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const u = m[1].trim();
      if (u.endsWith('.xml')) continue;          // sitemap index entries
      urls.add(u);
    }
  }
  return [...urls].sort();
}

const norm = (u: string) => u.replace(/\/+$/, '/').toLowerCase();

async function check(url: string): Promise<Row> {
  // redirect:'manual' so a 301 is reported rather than silently followed.
  let res: Response;
  try {
    res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA } });
  } catch (e: any) {
    return { url, status: 'ERROR', code: '-', detail: String(e?.message || e).slice(0, 80) };
  }

  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get('location') || '(no Location header)';
    return { url, status: 'REDIRECT', code: res.status, detail: `→ ${loc}` };
  }
  if (res.status === 404 || res.status === 410) {
    return { url, status: 'GONE', code: res.status, detail: 'in the sitemap, not on the server' };
  }
  if (res.status !== 200) {
    // 5xx and friends: could be transient. Learned nothing definite.
    return { url, status: 'ERROR', code: res.status, detail: 'unexpected status' };
  }

  let html = '';
  try { html = await res.text(); } catch { /* body unreadable; the 200 still counts */ }
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1];
  if (canon && norm(canon) !== norm(url)) {
    return { url, status: 'CANONICAL', code: 200, detail: `canonical → ${canon}` };
  }
  return { url, status: 'OK', code: 200, detail: '' };
}

async function main() {
  let urls = sitemapUrls();
  if (ONLY) urls = urls.filter(u => u.includes(ONLY));
  if (BASE !== 'https://www.cubicalgolfer.com') {
    urls = urls.map(u => u.replace(/^https?:\/\/[^/]+/, BASE));
  }

  console.log(`check-live-urls: ${urls.length} sitemap URL(s) against ${BASE}\n`);

  const rows: Row[] = [];
  for (let i = 0; i < urls.length; i++) {
    const r = await check(urls[i]);
    rows.push(r);
    const mark = r.status === 'OK' ? '·' : r.status === 'ERROR' ? '?' : '!';
    process.stdout.write(mark);
    if ((i + 1) % 80 === 0) process.stdout.write(`  ${i + 1}/${urls.length}\n`);
    if (DELAY_MS) await sleep(DELAY_MS);
  }
  process.stdout.write('\n\n');

  const by = (s: Status) => rows.filter(r => r.status === s);
  const problems = [...by('REDIRECT'), ...by('CANONICAL'), ...by('GONE')];

  for (const s of ['REDIRECT', 'CANONICAL', 'GONE'] as Status[]) {
    const list = by(s);
    if (!list.length) continue;
    console.log(`${s}  (${list.length})`);
    for (const r of list) console.log(`   ${r.code}  ${r.url}\n        ${r.detail}`);
    console.log('');
  }
  const errs = by('ERROR');
  if (errs.length) {
    console.log(`could not check  (${errs.length}) — not counted as problems`);
    for (const r of errs.slice(0, 10)) console.log(`   ${r.url}  ${r.detail}`);
    console.log('');
  }

  console.log(`OK ${by('OK').length}   REDIRECT ${by('REDIRECT').length}   ` +
              `CANONICAL ${by('CANONICAL').length}   GONE ${by('GONE').length}   ERROR ${errs.length}`);

  fs.mkdirSync('scripts/output', { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(OUT_MD,
    `# Live URL check — ${stamp}\n\n` +
    `${urls.length} sitemap URLs checked against ${BASE}.\n\n` +
    `| Status | Count |\n|---|---|\n` +
    (['OK','REDIRECT','CANONICAL','GONE','ERROR'] as Status[])
      .map(s => `| ${s} | ${by(s).length} |`).join('\n') +
    (problems.length
      ? `\n\n## Sitemap disagrees with the live site (${problems.length})\n\n` +
        `Every URL below is listed in the sitemap, which tells Google to index it, while the\n` +
        `live site says otherwise. Fix one side or the other — a URL should not be in the\n` +
        `sitemap and redirected at the same time.\n\n` +
        `| URL | Status | Detail |\n|---|---|---|\n` +
        problems.map(r => `| ${r.url} | ${r.status} ${r.code} | ${r.detail} |`).join('\n')
      : `\n\nNo contradictions: every sitemap URL returns 200 and canonicals to itself.\n`) + '\n');
  fs.writeFileSync(OUT_CSV,
    'url,status,code,detail\n' +
    rows.map(r => `"${r.url}",${r.status},${r.code},"${r.detail.replace(/"/g, "'")}"`).join('\n') + '\n');
  console.log(`\nreport: ${OUT_MD}\n        ${OUT_CSV}`);

  // Only fail on things positively established as wrong.
  process.exit(problems.length ? 1 : 0);
}

main();
