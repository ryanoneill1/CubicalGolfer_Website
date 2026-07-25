# Iron articles — keyword-cannibalization consolidation

Four articles in `src/data/articles.ts` targeted the same "best forgiving irons"
intent, splitting link equity and competing in the SERP:

| Slug | ~Words | Product sections | Affiliate keys | FAQs | Inbound internal links | datePublished |
|---|---:|---:|---|---:|---:|---|
| **/best-golf-irons-2026/** | **2,551** | **8** | callaway-paradym-ai-smoke-max-irons, titleist-t300, ping-g430-irons, wilson-d9-irons, titleist-t100, cobra-aerojet-max-irons, cleveland-launcher-xl2-irons, taylormade-qi-irons | **7** | **26** (9 body + 17 related) | 2025-03-22 |
| /best-game-improvement-irons-2026/ | 558 | 6 | ping-g430-irons, callaway-big-bertha, taylormade-qi-irons, cleveland-launcher-xl2-irons, cobra-aerojet-max-irons, wilson-d9-irons, callaway-big-bertha-b21-irons | 4 | 8 (2 body + 6 related) | 2026-05-17 |
| /most-forgiving-irons/ | 882 | 6 | ping-g430-irons, **cleveland-launcher-xl-halo-irons**, callaway-paradym-ai-smoke-max-irons, **taylormade-stealth-hd-irons**, **srixon-zx5-mk-ii** | 4 | 5 (2 body + 3 related) | 2026-06-05 |
| /best-golf-irons-high-handicapper/ | 431 | 3 | callaway-paradym-ai-smoke-max-irons, wilson-d9-irons, ping-g430-irons | 3 | 8 (3 body + 5 related) | 2025-08-09 |

## Recommendation — survive on `/best-golf-irons-2026/`

The data points the same way as the default:

- **Most link equity by far** — 26 inbound internal links vs 5–8 for the others.
- **Most content** — 2,551 words vs 431–882; already the most complete guide.
- **Widest coverage** — 8 products and 7 FAQs, a superset of the others' picks.
- **Oldest URL** — published 2025-03-22, so it has the longest ranking history
  and the strongest claim to the canonical "best golf irons" query.
- **Broadest intent** — "best golf irons 2026" is the head term the other three
  are narrow slices of (game-improvement, most-forgiving, high-handicapper), all
  of which the survivor can address in one page.

## What was merged in (unique content only — no duplicated paragraphs)

**Three product picks carried from the retired pages** — chosen because their
affiliate keys existed *only* on a retired page (constraint: never lose a key):

- **Cleveland Launcher XL Halo** (`cleveland-launcher-xl-halo-irons`) — super-game-
  improvement pick for brand-new beginners.
- **TaylorMade Stealth HD Irons** (`taylormade-stealth-hd-irons`) — draw-biased,
  best-value pick for golfers fighting a slice.
- **Srixon ZX5 Mk II** (`srixon-zx5-mk-ii`) — players-distance pick for the
  lower-mid handicapper outgrowing super-forgiving heads.

(The other retired keys — `callaway-big-bertha`, `callaway-big-bertha-b21-irons`,
`ping-g430-irons`, etc. — already live on the survivor or other surviving pages,
so nothing was lost.)

**Four unique buying-advice sections** the survivor lacked:

- *What Makes an Iron Forgiving?* (perimeter weighting / sole width / offset + CG)
- *Do Forgiving Irons Cost You Distance?* (the myth-buster from most-forgiving)
- *When to Get Fitted* (from game-improvement)
- *How Many Irons Should a High Handicapper Carry?* (set-composition advice)

**Five unique FAQs** (survivor went 7 → 12): are game-improvement irons worth it;
how much to spend; when to upgrade from GI irons; steel vs graphite shafts; and
what loft a high handicapper should use. Near-duplicate FAQs (e.g. three variants
of "what is the most forgiving iron", "cavity back vs blade") were **not** carried
— the survivor already covers them.

The merged page reads as one coherent guide: 11 ranked picks → forgiveness/how-to-
choose advice → shaft-flex → related reading → 12 FAQs. `datePublished` preserved
(2025-03-22); `dateModified` set to 2026-07-25.

> Note: the survivor's `title` ("…8 Picks, 5 Tested") was left untouched — it is
> now conservative (the page carries 11 picks) but still accurate and passes the
> promise-delivery check. If you re-optimise this title separately, it can be
> bumped to reflect the fuller lineup.

## Retired + redirected

Removed from `articles.ts` and 301-redirected in `_redirects`:

```
/best-game-improvement-irons-2026/  /best-golf-irons-2026/  301
/most-forgiving-irons/              /best-golf-irons-2026/  301
/best-golf-irons-high-handicapper/  /best-golf-irons-2026/  301
```

## Internal links updated

Every internal reference to a retired slug was repointed at the survivor:
related-array entries were repointed and relabeled "Best Golf Irons 2026";
in-body contextual links were repointed (and the survivor's own links to the
now-merged pages were converted to plain text rather than self-linking).
**Verified: zero remaining references to any retired slug in `articles.ts`.**
`sitemap-articles.xml.ts` derives from `ARTICLES`, so it no longer emits the
retired URLs (confirmed in the build output — 262 pages, down from 265).

## Task 6 — other high title-token-overlap pairs (reported, not fixed)

Two pairs cleared the overlap screen; the operator should decide on further
consolidation:

- **`/best-rain-gear-midwest-golfers/` ↔ `/best-golf-rain-gear-2026/`** — *genuine
  overlap candidate.* Core tokens ("rain", "gear") are fully shared; both target
  golf rain gear. Worth reviewing for the same treatment as the irons cluster.
- **`/best-golf-rangefinders-2026/` ↔ `/best-golf-irons-2026/`** — *false positive.*
  High raw-token overlap comes only from the shared title template ("Best Golf …
  2026 — N Picks, M Tested"); the intents (rangefinders vs irons) are unrelated.
  No action needed.
