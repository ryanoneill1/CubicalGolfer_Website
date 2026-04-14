// src/lib/linking.ts
// ─────────────────────────────────────────────────────────────────────────────
// Internal linking engine for CubicalGolfer.
// getMergedRelated merges an article's explicit related[] list with
// auto-generated category-based suggestions, de-duped and capped.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, RelatedLink } from '../data/types';
import { ARTICLES } from '../data/articles';

// ── Auto-link rules: category → always-include slugs ─────────────────────────
const CATEGORY_ANCHORS: Record<string, Array<{ slug: string; label: string }>> = {
  'gear-reviews': [
    { slug: '/best-golf-rangefinders-2026/', label: 'Best Golf Rangefinders 2026' },
    { slug: '/best-golf-gps-watches/',       label: 'Best GPS Golf Watches 2026' },
  ],
  'golf-tech': [
    { slug: '/best-golf-apps-handicap-tracking/', label: 'Best Golf Apps 2026' },
    { slug: '/best-golf-gps-watches/',            label: 'Best GPS Golf Watches 2026' },
  ],
  'golf-accessories': [
    { slug: '/25-golf-accessories-every-golfer-should-own/', label: '25 Golf Accessories Every Golfer Needs' },
    { slug: '/best-golf-accessories-under-50/',              label: 'Best Golf Accessories Under $50' },
  ],
  'improve-game': [
    { slug: '/how-to-break-90/',         label: 'How to Break 90' },
    { slug: '/average-golf-handicap/',   label: 'Average Golf Handicap' },
  ],
  'golf-lifestyle': [
    { slug: '/best-golf-gifts-for-him/', label: 'Best Golf Gifts for Him' },
  ],
};

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Returns up to `limit` related links for an article.
 * Merges: article.related → category anchors → same-category articles
 * Deduplicates on slug and removes self-reference.
 */
export function getMergedRelated(article: Article, limit = 4): RelatedLink[] {
  const seen = new Set<string>([article.slug]);
  const result: RelatedLink[] = [];

  const push = (links: Array<{ slug: string; label: string }>) => {
    for (const link of links) {
      if (seen.has(link.slug)) continue;
      if (result.length >= limit) break;
      seen.add(link.slug);
      result.push({ slug: link.slug, label: link.label });
    }
  };

  // 1. Explicit related links from the article data (highest priority)
  push(article.related ?? []);

  // 2. Category-specific anchors
  push(CATEGORY_ANCHORS[article.category] ?? []);

  // 3. Same-category articles (fallback padding)
  const sameCat = ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, limit)
    .map(a => ({ slug: a.slug, label: a.titleDisplay }));
  push(sameCat);

  return result.slice(0, limit);
}

// ── Utility: get all article slugs as a Set (for 404 detection) ──────────────
export function getAllSlugs(): Set<string> {
  return new Set(ARTICLES.map(a => a.slug));
}

// ── Category article filter ───────────────────────────────────────────────────
/**
 * Returns all articles for a given category, sorted by dateModified descending.
 * Used by category index pages (gear-reviews/index.astro, etc.)
 */
export function getCategoryArticles(category: string): Article[] {
  return ARTICLES
    .filter(a => a.category === category)
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}

// ── Featured articles for homepage ────────────────────────────────────────────
/**
 * Returns the top N articles across all categories, newest first.
 * Used by index.astro and any "featured" widget.
 */
export function getFeaturedArticles(limit = 6): Article[] {
  return ARTICLES
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
    .slice(0, limit);
}

// ── All articles sorted by date ────────────────────────────────────────────────
export function getAllArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}
