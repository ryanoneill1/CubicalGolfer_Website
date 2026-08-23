#!/usr/bin/env node
/**
 * check-live-listings.ts — re-verify every product link and price against the retailer.
 *
 * NOT part of `npm run validate`. It needs network access and takes minutes, so it
 * runs on demand:  npm run check-listings
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Everything the build checks is internal consistency: does the price in the
 * table match the price in the registry, does the alt text name the right
 * product. Nothing checks whether the registry itself is still TRUE. In one week
 * of manual spot-checks that gap produced:
 *
 *   · SEVEN dead Amazon ASINs on /golf-ball-compression-chart/ — the page
 *     carrying 28% of the site's impressions. Not out of stock: hard 404s.
 *   · Callaway Strata listed at ~$249. The cheapest set Amazon sells is
 *     $454.99 — 45% under the real price, on the BEGINNER guide.
 *   · Odyssey DFX at ~$129 when it is $155.99–$169.99, silently breaking the
 *     "under $150" promise on a 7,053-impression page.
 *   · FlightScope Mevo and Ernest Sports ES-B1: no price on any listing.
 *
 * All four were found by hand. None could have been found by the build.
 *
 * ── The one rule that matters most ─────────────────────────────────────────
 * A checker that cries wolf gets switched off, and one that reports a rate-
 * limited fetch as "DEAD" is worse than no checker at all — it would send you
 * deleting live products. So the vocabulary separates what we know from what we
 * could not find out:
 *
 *   OK        fetched, priced, agrees with the registry
 *   DRIFT     fetched, priced, differs by more than DRIFT_PCT
 *   NO_PRICE  page exists but carries no purchasable price
 *   DEAD      page positively identifies itself as gone
 *   BLOCKED   Amazon served a robot check — WE LEARNED NOTHING
 *   ERROR     network/timeout — WE LEARNED NOTHING
 *
 * BLOCKED and ERROR are never counted as problems, never fail the run, and are
 * listed separately as "could not check".
 */
import { AFFILIATE } from '../src/data/affiliate-links';
import fs from 'fs';

type Status = 'OK' | 'DRIFT' | 'NO_PRICE' | 'DEAD' | 'BLOCKED' | 'ERROR';
interface Result {
  key: string; url: string; status: Status;
  registryPrice: string; livePrice: string; drift: string; note: string;
}

const DRIFT_PCT  = Number(process.env.DRIFT_PCT ?? 10);
const DELAY_MS   = Number(process.env.DELAY_MS ?? 1500);
const ONLY       = process.env.ONLY ?? '';
// package.json sets "type": "module", so __dirname does not exist. Every other
// script here writes relative to the repo root, which is where npm runs them.
const CACHE_FILE = 'scripts/data/listing-check-cache.json';
const OUT_MD     = 'scripts/output/live-listing-report.md';
const OUT_CSV    = 'scripts/output/live-listing-report.csv';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Both Amazon URL shapes. The short one is amazon.com/dp/ASIN; the long one puts
 *  a product slug in between. A grep written for only the short form undercounted
 *  this site's product links by ~40% for weeks. Match both. */
const asinOf = (u: string): string | null =>
  (u.match(/amazon\.com\/(?:[A-Za-z0-9%._-]+\/)?dp\/([A-Z0-9]{10})/) ?? [])[1] ?? null;

const money = (s: string): number | null => {
  const m = String(s).match(/([\d,]+(?:\.\d{1,2})?)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

async function check(key: string, url: string, registryPrice: string): Promise<Result> {
  const base: Result = { key, url, status: 'ERROR', registryPrice, livePrice: '', drift: '', note: '' };
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = await res.text();

    // Blocked is checked FIRST. A robot-check page contains none of the markers
    // below, and misreading it as DEAD is the failure mode that would destroy
    // trust in this tool on its first bad run.
    if (/api-services-support@amazon\.com|Enter the characters you see below|To discuss automated access/i.test(html))
      return { ...base, status: 'BLOCKED', note: 'Amazon served a robot check — nothing learned, re-run later' };

    if (/Page Not Found|we couldn(?:&#x27;|’|\')t find that page|Looking for something\?/i.test(html))
      return { ...base, status: 'DEAD', note: 'Amazon reports this page does not exist' };

    // Scope the price to the BUY BOX. Amazon pages carry MANY prices: related-item
    // carousels, "customers also bought", sponsored tiles. Testing this against a
    // real Pro V1 page, a bare /a-offscreen/ match returned $57.97 — which turned
    // out to be a CAROUSEL tile (data-position="1"), not the product's own price.
    // So a loose match produces both false OKs and wrong prices. A bare /a-offscreen/ match picks up
    // "customers also bought" tiles, and on a live test it priced the
    // FlightScope Mevo — a product with no purchasable price — at $89.99 from a
    // related item. That is a false OK: it silently passes a product nobody can
    // buy, which is the exact defect this tool exists to catch.
    const core = html.match(/id="(?:corePrice_feature_div|corePriceDisplay_desktop_feature_div|price_inside_buybox|apex_desktop)"[\s\S]{0,4000}?class="a-offscreen">\s*\$([\d,]+\.\d{2})\s*</);
    const m = core;
    if (!m) return { ...base, status: 'NO_PRICE',
      note: 'no price in the buy box (variant-select pages land here too — eyeball before acting)' };

    const live = parseFloat(m[1].replace(/,/g, ''));
    const reg  = money(registryPrice);
    if (reg === null) return { ...base, status: 'OK', livePrice: '$' + m[1], note: 'registry has no comparable number' };

    const pct = Math.abs(live - reg) / reg * 100;
    return {
      ...base,
      status: pct > DRIFT_PCT ? 'DRIFT' : 'OK',
      livePrice: '$' + m[1],
      drift: (live >= reg ? '+' : '-') + pct.toFixed(0) + '%',
      note: pct > DRIFT_PCT ? 'registry says ' + registryPrice + ', listing says $' + m[1] : '',
    };
  } catch (e: any) {
    return { ...base, status: 'ERROR', note: 'fetch failed: ' + String(e?.message ?? e).slice(0, 80) };
  }
}

(async () => {
  const L = AFFILIATE as any;
  const targets = Object.keys(L)
    .filter(k => asinOf(String(L[k].url ?? '')))
    .filter(k => !ONLY || k.includes(ONLY))
    .map(k => ({ key: k, url: String(L[k].url), price: String(L[k].price ?? '') }));

  console.log('Checking ' + targets.length + ' product listings at ' + DELAY_MS + 'ms intervals');
  console.log('(search URLs and Golf Galaxy links are skipped — no single price to compare)\n');

  const results: Result[] = [];
  for (const [i, t] of targets.entries()) {
    const r = await check(t.key, t.url, t.price);
    results.push(r);
    process.stdout.write(({ OK: '.', DRIFT: '$', NO_PRICE: '?', DEAD: 'X', BLOCKED: '~', ERROR: '~' } as any)[r.status]);
    if ((i + 1) % 60 === 0) process.stdout.write('  ' + (i + 1) + '/' + targets.length + '\n');
    await sleep(DELAY_MS);
  }
  console.log('\n');

  const by = (s: Status) => results.filter(r => r.status === s);
  const unknown  = [...by('BLOCKED'), ...by('ERROR')];
  const problems = [...by('DEAD'), ...by('NO_PRICE'), ...by('DRIFT')];

  fs.mkdirSync('scripts/output', { recursive: true });
  fs.mkdirSync('scripts/data', { recursive: true });

  const lines: string[] = [
    '# Live listing check — ' + new Date().toISOString().slice(0, 10), '',
    targets.length + ' product listings checked. Drift threshold ' + DRIFT_PCT + '%.', '',
    '| Status | Count | Meaning |', '|---|---|---|',
    '| **DEAD** | ' + by('DEAD').length + ' | Amazon says the page is gone — the buy button goes nowhere |',
    '| **NO_PRICE** | ' + by('NO_PRICE').length + ' | Listing exists but nothing is purchasable |',
    '| **DRIFT** | ' + by('DRIFT').length + ' | Live price differs from the registry by >' + DRIFT_PCT + '% |',
    '| OK | ' + by('OK').length + ' | Priced and within tolerance |',
    '| *could not check* | ' + unknown.length + ' | Blocked or errored — **not** a problem, just unknown |', '',
  ];

  if (problems.length) {
    lines.push('## Needs attention', '', '| Product | Status | Registry | Live | Drift | Note |', '|---|---|---|---|---|---|');
    const rank: Record<string, number> = { DEAD: 0, NO_PRICE: 1, DRIFT: 2 };
    problems.sort((a, b) => rank[a.status] - rank[b.status] || a.key.localeCompare(b.key));
    for (const r of problems)
      lines.push('| `' + r.key + '` | **' + r.status + '** | ' + r.registryPrice + ' | ' + (r.livePrice || '—') + ' | ' + (r.drift || '—') + ' | ' + r.note + ' |');
    lines.push('');
  } else {
    lines.push('## Nothing needs attention', '', 'Every listing that could be checked is live, priced and within tolerance.', '');
  }

  if (unknown.length) {
    lines.push('## Could not check', '',
      'These told us nothing either way — Amazon blocked the request or it errored.',
      'Re-run to retry; raise `DELAY_MS` if many appear here.', '',
      ...unknown.map(r => '- `' + r.key + '` — ' + r.note), '');
  }

  fs.writeFileSync(OUT_MD, lines.join('\n'));
  fs.writeFileSync(OUT_CSV,
    'key,status,registry_price,live_price,drift,url,note\n' +
    results.map(r => [r.key, r.status, r.registryPrice, r.livePrice, r.drift, r.url, r.note]
      .map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n'));
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));

  console.log('DEAD ' + by('DEAD').length + ' · NO_PRICE ' + by('NO_PRICE').length + ' · DRIFT ' + by('DRIFT').length + ' · OK ' + by('OK').length + ' · could not check ' + unknown.length);
  console.log('\nReport:  ' + OUT_MD);
  console.log('CSV:     ' + OUT_CSV);

  // Exit non-zero only for things positively established as broken, so a flaky
  // network can never turn a scheduled run into a false alarm.
  process.exit(by('DEAD').length + by('NO_PRICE').length > 0 ? 1 : 0);
})();
