# CubicalGolfer — Page Spec System
**Version 1.0 · April 2026**

This is the canonical reference for every page type on CubicalGolfer.com.
No page should go live without satisfying the spec for its type.

---

## Page Type Inventory

| ID | Type | Route Pattern | Count |
|----|------|--------------|-------|
| `BUYING-GUIDE` | Commercial roundup | `/best-golf-[x]/` | 28 pages |
| `COMPARISON` | Head-to-head | `/[a]-vs-[b]/` | 8 pages |
| `TUTORIAL` | How-to instructional | `/how-to-[x]/` | 9 pages |
| `LISTICLE` | Curated list | `/[n]-golf-[x]/` | 3 pages |
| `LIFESTYLE` | Editorial lifestyle | `/golf-[topic]/` | 5 pages |
| `CATEGORY-HUB` | Category index | `/gear-reviews/` etc | 5 pages |
| `LOCAL-COURSES` | City guide | `/courses/[city]/` | 8 pages |
| `COMPARE-INDEX` | Comparison hub | `/compare/` | 1 page |
| `HOMEPAGE` | Root | `/` | 1 page |
| `ABOUT` | Trust/editorial | `/about/` | 1 page |
| `HOW-WE-TEST` | Methodology | `/how-we-test/` | 1 page |

---

## BUYING-GUIDE Spec

**Intent:** Commercial. Convert via affiliate links. Serve golfers mid-funnel choosing between products.

### Required Sections (in strict order)
1. Hero: breadcrumb → tag badge → H1 → author box
2. Bottom Line Box (`.bottom-line-box`) — 2–3 sentence verdict, winner + budget pick
3. Quick Verdict Cards (`.product-card-grid`) — top 3 picks, above fold
4. Intro Box (`.intro-box`) — 3–5 sentence framing paragraph
5. Table of Contents (`.toc`) — min 4 items
6. Comparison Table (`.cmp-table`) — min 3 rows, Buy button column
7. Testing Notes (`.testing-note`) — methodology callout
8. Individual Product Sections (`.art-section`) × ≥3:
   - H2 with product name
   - Badge pill (BEST OVERALL etc.)
   - Product image or labeled placeholder
   - Body paragraph
   - Pros list (3–5 items)
   - Cons list (2–3 items)
   - Price note
   - Affiliate CTA button
9. Who Should Buy / Skip (`.who-box`) — 3–5 items each column
10. FAQ Block (`.art-faq`) — min 3 questions, full sentences
11. Related Guides (`.rel-cluster`) — min 4 links
12. Affiliate Disclosure (`.disclosure-box`)
13. Update Stamp (`.update-stamp`)
14. Bottom CTA (`.art-cta`)
15. Same-Category Article Grid (`.related-section`) — 3 cards

### Required Data Fields
| Field | Type | Notes |
|-------|------|-------|
| `bottomLine` | string | 2–3 sentences, names winner + budget pick |
| `toc` | string[] | min 4 items |
| `comparisonTable` | object | min 3 rows, each with affiliateKey |
| `sections[].pros` | string[] | 3–5 items per product pick |
| `sections[].cons` | string[] | 2–3 items per product pick |
| `whoFor` | string[] | 3–5 qualifying criteria |
| `whoSkip` | string[] | 3–5 disqualifying criteria |
| `faq` | FAQItem[] | min 3 items |
| `related` | RelatedLink[] | min 4 links |
| `testingNotes` | string? | optional override of default testing callout |

### Schema Required
- `Article` (always)
- `FAQPage` (always)
- `BreadcrumbList` (always)
- `Product` (per pick when affiliateKey present)

### CTA Rules
- Sticky bar at top: first winner product from comparisonTable
- AffiliateCTA per section with affiliateKey
- Disclosure inline before update stamp
- Bottom CTA linking to homepage or category hub

---

## COMPARISON Spec (article-type: comparison, or /compare/[slug]/)

### Required Sections (in strict order)
1. Hero: breadcrumb → tag badge → H1 → author box
2. Who This Is For (`.bottom-line-box`) — 2–3 sentences
3. Buy Both Row (`.compare-buy-row`) — affiliate buttons for both products
4. Quick Winner Box (`.verdict-box`) — winner name + reason + buy button
5. Testing Notes callout
6. Full Comparison body (`.compare-body`) — detailed analysis
7. Bottom Buy Row — repeated for scroll-through users
8. FAQ Block — min 3 questions
9. Affiliate Disclosure
10. Update Stamp
11. Related Links — min 4: other comparisons + roundup pages

### Required Data Fields
- `intro` (who this is for)
- `verdict` (full comparison body)
- `winner`, `winnerReason`
- `productA`, `productB` (mapped to affiliate keys)
- `faq` (min 3)
- `dateModified`

---

## TUTORIAL Spec

### Required Sections (in strict order)
1. Hero
2. Direct Answer intro (`.intro-box`) — no preamble
3. TOC — min 3 items
4. Step-by-step or framework sections (≥3)
5. Common Mistakes section
6. Recommended Gear section (1–3 products)
7. FAQ (min 2)
8. Related links (min 3, prefer commercial pages)
9. Update stamp

---

## LIFESTYLE Spec

### Required Sections
1. Hero
2. Hook intro (story or stat)
3. Main content sections (≥3)
4. Practical takeaway
5. Related links (min 3)

---

## CATEGORY-HUB Spec

### Required Sections
1. Hero with category H1 + description
2. Featured article callout (`.hub-featured`) — strongest article
3. All articles grid (`.art-list-grid`)

---

## LOCAL-COURSES Spec

### Required Sections
1. Hero with city name H1, best season, airport
2. Unique city intro paragraph
3. Course cards (≥4) with: name, type, price, holes, notes
4. Gear recommendation block (`.local-gear-block`)
5. Links to other city pages
6. FAQ (min 2 city-specific questions)
7. Update stamp

---

## Metadata Standard (all page types)

| Field | Rule |
|-------|------|
| `<title>` | ≤60 chars. Lead with keyword. Include year on commercial pages. |
| `<meta description>` | 150–160 chars. Specific claim. Action phrase at end. |
| `<canonical>` | Always set. Always matches deployed URL. |
| `datePublished` | ISO YYYY-MM-DD. Never changes after publish. |
| `dateModified` | ISO YYYY-MM-DD. Update on any content change. |
| `robots` | `index,follow` on all live pages. |

---

## Section Order — Non-Negotiable

All article pages follow this exact outer structure:
```
<header class="art-hero">
  breadcrumb → tag → H1 → author-box
</header>

<article class="art-content">
  bottom-line-box (commercial only)
  product-card-grid (commercial only)
  intro-box
  toc
  cmp-table (commercial only)
  testing-note (commercial only)
  art-section × N
  who-box (commercial only)
  art-faq
  rel-cluster
  disclosure-box (commercial only)
  update-stamp
  art-cta
</article>

<section class="related-section">
  3-card same-category grid
</section>
```

No exceptions. Pages that deviate are non-compliant with this spec.
