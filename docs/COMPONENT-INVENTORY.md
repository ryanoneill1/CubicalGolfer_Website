# CubicalGolfer — Component Inventory
**Version 1.0 · April 2026**

---

## Astro Components (src/components/)

| Component | File | Used On | Status |
|-----------|------|---------|--------|
| AffiliateCTA | AffiliateCTA.astro | All commercial pages | ✅ Live |
| ProductCard | ProductCard.astro | Buying guide quick-verdict row | ✅ Live |
| StickyBar | StickyBar.astro | Buying guides (top pick) | ✅ Live |
| BottomLineBox | — | All buying guides | ❌ Missing — render from field |
| ProsConsList | — | All product picks | ❌ Missing — render from field |
| WhoShouldBuy | — | All buying guides | ❌ Missing — render from field |
| DisclosureBox | — | All commercial pages | ❌ Missing — inline in template |
| TestingNotes | — | All commercial pages | ❌ Missing — inline in template |

---

## CSS Component Classes (src/styles/global.css)

### Always Present
| Class | Description |
|-------|-------------|
| `.art-hero` | Article page hero (green bg, breadcrumb, H1, author box) |
| `.compare-hero` | Comparison page hero (same structure as art-hero) |
| `.art-content` | Article body wrapper (max-width 780px centered) |
| `.art-section` | Individual product pick section |
| `.art-faq` | FAQ accordion container |
| `.faq-item` | Individual FAQ accordion item (details/summary) |
| `.faq-answer` | FAQ answer body |
| `.rel-cluster` | Related links container |
| `.rel-links` | Related links list inside cluster |
| `.art-cta` | Bottom CTA box |
| `.cmp-table` | Comparison table |
| `.cmp-winner` | Winning row highlight in comparison table |
| `.cmp-buy-btn` | Buy button in comparison table cell |
| `.badge-pill` | Product badge (BEST OVERALL, BEST BUDGET etc.) |
| `.badge-best` | Inline "BEST PICK" badge in table |
| `.author-box` | Author/editorial block |
| `.author-name` | Author name inside author box |
| `.author-meta` | Author meta (words, date, how-we-test link) |
| `.verified-badge` | "✅ Independently Tested" pill |
| `.author-avatar-img` | Circular logo image |
| `.product-img-wrap` | Product image container (buying guides) |
| `.product-section-img` | Product image inside wrap |
| `.product-img-fallback` | Emoji + file path label when no image |
| `.toc` | Table of contents container |
| `.toc-heading` | "In this guide" label |
| `.intro-box` | Gold-bordered intro callout |
| `.price-note` | Price label with 💰 prefix |
| `.product-rating` | Star rating row |
| `.stars` | Star glyphs (★/☆) |
| `.breadcrumb` | Breadcrumb nav in hero |
| `.bc-sep` | Breadcrumb separator (›) |
| `.art-tag-lg` | Article type tag badge in hero |

### Buying Guide Specific
| Class | Description |
|-------|-------------|
| `.cmp-wrap` | Horizontal scroll wrapper for comparison table |
| `.cmp-th-buy` | Buy column header |
| `.cmp-td-buy` | Buy column cell |
| `.cmp-no-link` | "—" placeholder when no affiliate link |

### Comparison Page Specific
| Class | Description |
|-------|-------------|
| `.compare-hero` | Comparison page hero |
| `.compare-body` | Comparison page content wrapper |
| `.compare-buy-row` | Two-up buy buttons at top of page |
| `.compare-buy-card` | Individual product buy card |
| `.compare-buy-label` | Product name in buy card |
| `.compare-buy-price` | Price in buy card |
| `.btn-buy-affiliate` | Affiliate button (comparison pages) |
| `.btn-buy-cta` | CTA text inside button |
| `.btn-buy-badge` | Retailer label inside button |
| `.verdict-box` | Winner callout box |

### Missing — Need to Add
| Class | Description | Priority |
|-------|-------------|----------|
| `.bottom-line-box` | Opening verdict callout | HIGH |
| `.pros-list` | Green-prefixed pros bullets | HIGH |
| `.cons-list` | Red-prefixed cons bullets | HIGH |
| `.who-box` | Who should buy / skip two-column | HIGH |
| `.who-buy` | Left (buy) column of who-box | HIGH |
| `.who-skip` | Right (skip) column of who-box | HIGH |
| `.disclosure-box` | Affiliate disclosure inline callout | HIGH |
| `.testing-note` | Testing methodology callout | MEDIUM |
| `.spec-table` | Product specification table | MEDIUM |
| `.update-stamp` | "Last updated: YYYY-MM-DD" stamp | MEDIUM |

---

## Thumb Color Classes (article cards)

| Class | Color | Category |
|-------|-------|----------|
| `.green` | #2A5038 | gear-reviews |
| `.brown` | #6B4423 | golf-accessories |
| `.navy` | #2A3A5A | golf-tech |
| `.purple` | #3A2A5A | improve-game |
| `.teal` | #1A4A44 | golf-lifestyle |
| `.olive` | #4A5A28 | gear-reviews (alt) |

---

## Template Files (src/pages/)

| Template | Route | Powers |
|----------|-------|--------|
| `[...slug].astro` | `/[article-slug]/` | All 50 articles |
| `compare/[slug].astro` | `/compare/[slug]/` | 4 comparison pages |
| `courses/[city].astro` | `/courses/[city]/` | 8 city pages |
| `index.astro` | `/` | Homepage |
| `about.astro` | `/about/` | About page |
| `how-we-test.astro` | `/how-we-test/` | Testing methodology |
| `gear-reviews/index.astro` | `/gear-reviews/` | Category hub |
| `golf-tech/index.astro` | `/golf-tech/` | Category hub |
| `golf-accessories/index.astro` | `/golf-accessories/` | Category hub |
| `golf-lifestyle/index.astro` | `/golf-lifestyle/` | Category hub |
| `improve-your-golf-game/index.astro` | `/improve-your-golf-game/` | Category hub |
| `compare/index.astro` | `/compare/` | Compare hub |
| `courses/index.astro` | `/courses/` | Courses hub |
| `sitemap.xml.ts` | `/sitemap.xml` | Dynamic sitemap |
