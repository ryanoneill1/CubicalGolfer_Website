/**
 * freshness.ts — one honest "last updated" date per page.
 *
 * ── The problem this solves ────────────────────────────────────────────────
 * Two systems both claim to know when a page changed and they disagree:
 *
 *   src/data/articles.ts  dateModified   hand-held, edited by whoever remembers
 *   lastmod-manifest.json lastmod        computed from a content hash by
 *                                        `npm run lastmod`, so it is never wrong
 *
 * On 5 Oct 2026 an audit found 149 of 190 articles showing an on-page date
 * OLDER than their own sitemap entry — several by five months. The compression
 * chart, which is 37% of site traffic, told Google "modified 2026-07-23" in its
 * schema while the sitemap said 2026-09-29.
 *
 * Worse for readers than for Google: those pages print "Updated <date> — prices
 * and availability checked monthly" next to a date from April. The claim reads
 * as false when in fact the page WAS checked; only the stamp was stale.
 *
 * ── The rule ───────────────────────────────────────────────────────────────
 * Take the LATER of the two. Never earlier than the author's own stamp (they
 * may have reviewed without changing bytes), never earlier than the last real
 * content change (the hash cannot lie about that).
 *
 * Deliberately NOT applied sitewide yet — it changes a visible date on 149
 * pages and that deserves its own sprint and its own measurement window.
 */
import lastmodManifest from '../data/lastmod-manifest.json';

type Entry = string | { lastmod?: string } | undefined;

/** The later of the author's stamp and the computed content-change date. */
export function effectiveDateModified(slug: string, authored?: string): string | undefined {
  const raw = (lastmodManifest as Record<string, Entry>)[slug];
  const computed = typeof raw === 'string' ? raw : raw?.lastmod;
  if (!computed) return authored;
  if (!authored) return computed;
  return computed > authored ? computed : authored;
}
