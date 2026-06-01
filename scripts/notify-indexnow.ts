// scripts/notify-indexnow.ts
// Pings IndexNow with the latest sitemap URLs after a deploy.
// Notifies Bing, Yandex, Naver, Seznam, Yep — Google does NOT support IndexNow.
import { readFileSync } from 'fs';

const KEY = 'a8f3c9d7e2b14f6e85d3c47a9b6e2f1d';
const HOST = 'www.cubicalgolfer.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// IndexNow endpoint — submitting to api.indexnow.org distributes to all participating engines
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function notifyIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    console.log('No URLs to submit.');
    return;
  }

  // IndexNow allows up to 10,000 URLs per request
  const batch = urls.slice(0, 10000);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  };

  console.log(`Notifying IndexNow of ${batch.length} URLs...`);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // IndexNow returns 200 OK or 202 Accepted on success
  if (res.status === 200 || res.status === 202) {
    console.log(`✅ IndexNow accepted ${batch.length} URLs.`);
  } else {
    const body = await res.text();
    console.error(`❌ IndexNow returned ${res.status}: ${body}`);
  }
}

// Read URLs from the built sitemap-articles.xml + sitemap-comparisons.xml + sitemap-core.xml
async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  const sitemaps = [
    'dist/sitemap-articles.xml',
    'dist/sitemap-comparisons.xml',
    'dist/sitemap-core.xml',
  ];

  for (const sitemap of sitemaps) {
    try {
      const content = readFileSync(sitemap, 'utf-8');
      const matches = content.match(/<loc>([^<]+)<\/loc>/g) || [];
      for (const m of matches) {
        const url = m.replace(/<\/?loc>/g, '');
        if (url.startsWith(`https://${HOST}`)) urls.push(url);
      }
    } catch (e) {
      console.warn(`Could not read ${sitemap}: ${(e as Error).message}`);
    }
  }

  return [...new Set(urls)]; // dedupe
}

(async () => {
  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} unique URLs across sitemaps.`);
  await notifyIndexNow(urls);
})();
