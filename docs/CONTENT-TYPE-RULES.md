# CubicalGolfer — Content Type Rules
**Version 1.0 · April 2026**

---

## Rule 1 — bottomLine is required on all BUYING-GUIDE pages
2–3 sentences. Names the winner, gives the reason, names a budget alternative.
Renders in `.bottom-line-box` immediately below the hero.

## Rule 2 — Every product pick needs pros AND cons
- `pros`: 3–5 bullets. Specific strengths.
- `cons`: 2–3 bullets. Real trade-offs. Not "price is high" without context.

## Rule 3 — Comparison tables require a Buy button column
Last column always. Winner row gets green button. Rows without affiliateKey get `—`.

## Rule 4 — FAQ minimum counts
- BUYING-GUIDE: 3 minimum
- COMPARISON: 3 minimum  
- TUTORIAL: 2 minimum

## Rule 5 — Author block is identical on every article page
Logo + name + experience signal + words + dateModified + /how-we-test/ link + verified badge.

## Rule 6 — Disclosure is required on every commercial page
Inline in article body. Not just in the footer.

## Rule 7 — Related links use rel-cluster only
`.rel-cluster` / `.rel-links` pattern. Min 4, max 8 links.

## Rule 8 — Testing notes on every commercial page
States what was tested, criteria, links to /how-we-test/. Template provides default.

## Rule 9 — dateModified must be a real date
Format: YYYY-MM-DD. Update on any content change. "Updated 2026" is not acceptable.

## Rule 10 — Schema on every page type
BUYING-GUIDE: Article + FAQPage + BreadcrumbList
COMPARISON: Article + FAQPage + BreadcrumbList
TUTORIAL: Article + HowTo + FAQPage + BreadcrumbList
LIFESTYLE/LISTICLE: Article + BreadcrumbList
CATEGORY-HUB: BreadcrumbList
LOCAL-COURSES: BreadcrumbList + LocalBusiness per course
HOMEPAGE: WebSite + Organization + FAQPage
ABOUT: AboutPage + Organization

## Rule 11 — Images must be real or labeled
Real: `.webp`, 280×200px min.
Placeholder: visible fallback showing exact file path needed.
Invisible blank space: not acceptable.

## Rule 12 — Who Should Buy/Skip required on buying guides
Two lists, 3–5 bullets each. After product picks, before FAQ.

## Rule 13 — Internal linking minimums
BUYING-GUIDE: ≥4 out, ≥3 in
COMPARISON: ≥4 out, ≥2 in
TUTORIAL: ≥3 out, ≥2 in
LIFESTYLE: ≥3 out, ≥1 in

---

## Sitewide Normalization Audit Results (April 2026)

### Pages with gaps identified

**25 BUYING-GUIDE pages need pros/cons + whoFor/whoSkip added.**
These are data-layer issues: the fields don't exist in articles.ts yet.
The template ([...slug].astro) is ready to render them as soon as data is added.

**12 BUYING-GUIDE pages need comparisonTable added.**
These are content gaps — the page lacks the quick-comparison structure.

**Priority order for content rewrite:**
1. High-traffic commercial pages: rangefinders, GPS watches, drivers, irons, golf balls
2. Mid-tier: gloves, putters, bags, swing analyzers
3. Lower-traffic: niche accessories, lifestyle-adjacent buying guides

### Merging vs. Fixing
- `/is-a-rangefinder-worth-it/` — currently structured as buying-guide but is actually informational. Reclassify as TUTORIAL. Does not need comparisonTable.
- `/what-golf-ball-for-high-handicapper/` — buying-guide with 1 FAQ item. Needs full spec compliance. Rewrite to add comparisonTable + 3 FAQs + pros/cons.
- `/best-golf-balls-slow-swing-speed/` and `/best-golf-balls-weekend-golfers/` — similar intent. Review for overlap. If 70%+ content is the same, merge into `/best-golf-balls-2026/` with sub-sections.

### Consistent structures confirmed
- All COMPARISON pages: same structure, same author block, same related links pattern.
- All TUTORIAL pages: consistent ordering, all have TOC and FAQ.
- All CATEGORY-HUB pages: identical layout, article grids match.
- All LOCAL-COURSES pages: consistent course card structure.
