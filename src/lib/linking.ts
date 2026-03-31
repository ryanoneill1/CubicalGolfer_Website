// src/lib/linking.ts
// ─────────────────────────────────────────────────────────────────────────────
// Automatic internal linking engine.
// Builds a graph of related articles based on:
//   1. Same category (strongest signal)
//   2. Shared keywords in title/description
//   3. Manually specified related links
//
// Use this to auto-inject related content clusters without manually
// maintaining every cross-link in the data.
// ─────────────────────────────────────────────────────────────────────────────

import { ARTICLES } from '../data/articles';
import type { Article, RelatedLink } from '../data/types';

// ── Keyword clusters for cross-category linking ──────────────────────────────
const KEYWORD_CLUSTERS: Record<string, string[]> = {
  beginner:    ['beginner', 'starter', 'new player', 'tips for beginners', 'start'],
  slice:       ['slice', 'draw', 'fade', 'swing path', 'clubface'],
  distance:    ['distance', 'yards', 'driver', 'forgiveness', 'launch'],
  putting:     ['putt', 'putting', 'green', '3-putt'],
  break90:     ['break 90', 'handicap', 'bogey', 'course management'],
  tech:        ['gps', 'rangefinder', 'app', 'tracker', 'analyzer', 'ai'],
  accessories: ['gloves', 'towel', 'accessories', 'training aid'],
  fitness:     ['fitness', 'mobility', 'rotation', 'stretch'],
};

function scoreRelation(a: Article, b: Article): number {
  if (a.id === b.id) return 0;
  let score = 0;

  // Same category: strong signal
  if (a.category === b.category) score += 10;

  // Keyword cluster matching
  const aText = `${a.title} ${a.description} ${a.excerpt}`.toLowerCase();
  const bText = `${b.title} ${b.description} ${b.excerpt}`.toLowerCase();
  for (const keywords of Object.values(KEYWORD_CLUSTERS)) {
    const aMatch = keywords.some(k => aText.includes(k));
    const bMatch = keywords.some(k => bText.includes(k));
    if (aMatch && bMatch) score += 5;
  }

  // Manually specified related links (highest intent)
  if (a.related?.some(r => r.slug === b.slug)) score += 20;
  if (b.related?.some(r => r.slug === a.slug)) score += 15;

  return score;
}

/**
 * Get automatically computed related articles for a given article.
 * Returns up to `limit` articles, sorted by relevance score.
 */
export function getAutoRelated(articleId: string, limit = 3): RelatedLink[] {
  const source = ARTICLES.find(a => a.id === articleId);
  if (!source) return [];

  return ARTICLES
    .filter(a => a.id !== articleId)
    .map(a => ({ article: a, score: scoreRelation(source, a) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => ({ slug: article.slug, label: article.titleDisplay }));
}

/**
 * Get the full internal linking graph as an adjacency list.
 * Useful for debugging and sitemap generation.
 */
export function buildLinkingGraph(): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  for (const article of ARTICLES) {
    graph[article.id] = getAutoRelated(article.id, 5).map(r => r.slug);
  }
  return graph;
}

/**
 * Get the merged related links for an article:
 * manually specified + auto-computed, deduplicated, max 4.
 */
export function getMergedRelated(article: Article, limit = 4): RelatedLink[] {
  if (!article?.related) return [];
  const manual  = article.related.map(r => r.slug);
  const auto    = getAutoRelated(article.id, limit + 2)
    .filter(r => !manual.includes(r.slug));

  const all = [...article.related, ...auto];
  const seen = new Set<string>();
  const result: RelatedLink[] = [];
  for (const link of all) {
    if (!seen.has(link.slug)) {
      seen.add(link.slug);
      result.push(link);
    }
    if (result.length >= limit) break;
  }
  return result;
}

/**
 * For a given category page, return articles sorted by dateModified desc.
 */
export function getCategoryArticles(category: string): Article[] {
  return ARTICLES
    .filter(a => a.category === category)
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}

/**
 * Get all articles for the homepage featured section (newest 6).
 */
export function getFeaturedArticles(count = 6): Article[] {
  return [...ARTICLES]
    .filter(a => a != null && a.slug != null)
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
    .slice(0, count);
}
