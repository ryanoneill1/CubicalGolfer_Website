# CubicalGolfer — Design System Rules
**Version 1.0 · April 2026**

---

## Color Tokens

All colors are defined as CSS custom properties in `:root`. Never use raw hex values in
component CSS — always reference a token. Adding new colors requires adding a token first.

```css
--green:      #1E3A28   /* Primary dark green — nav, hero backgrounds, CTAs */
--green-mid:  #264D33   /* Secondary green — CTA banners */
--green-card: #2A5038   /* Card headers, product section accents */
--gold:       #C8A84B   /* Primary accent — buttons, badges, highlights */
--gold-dark:  #A8882A   /* Gold hover state */
--cream:      #F4F1EA   /* Page background */
--cream-dark: #EAE6DD   /* Section alternates, TOC, info boxes */
--text:       #1A2B1F   /* Headings, high-emphasis text */
--body:       #2D3F32   /* Body copy */
--muted:      #556B5C   /* Secondary text, metadata, labels */
--white:      #ffffff   /* Cards, modals, nav */
--border:     #D8D3C8   /* All dividers and card borders */
```

**Do not use:** pure black (#000), pure white on cream (#fff on var(--cream) is fine),
inline opacity hacks — use the correct muted token instead.

---

## Typography Scale

Font stack: `'DM Sans', sans-serif` (body) + `'Playfair Display', serif` (H1 only)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (hero) | clamp(26px, 3.5vw, 46px) | 700 | 1.15 |
| H2 (section) | clamp(20px, 2.5vw, 26px) | 700 | 1.3 |
| H3 (subsection) | 19px | 700 | 1.4 |
| Body | 16.5px | 400 | 1.8 |
| Meta / labels | 13px | 500 | 1.5 |
| Eyebrow text | 11px | 700 | — |

**Rule:** Eyebrow text (small uppercase labels) must be `font-size: 11px; font-weight: 700;
letter-spacing: .12em; text-transform: uppercase`. Never use font-size under 11px on body copy.

---

## Spacing System

Use these values only. Do not invent intermediate values.

| Token | Value | Use |
|-------|-------|-----|
| `--space-xs` | 8px | Icon gaps, tight padding |
| `--space-sm` | 16px | Internal card padding |
| `--space-md` | 24px | Section gaps |
| `--space-lg` | 40px | Between major sections |
| `--space-xl` | 56px | Hero padding, section padding |
| `--space-2xl` | 72px | Page-level section padding |

**Responsive padding rule:** Use `clamp(1.5rem, 5vw, 4rem)` for horizontal page padding.
Never use fixed px horizontal padding on page-level containers.

---

## Border Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `--r1` | 6px | Buttons, badges, small elements |
| `--r2` | 12px | Cards, table corners |
| `--r3` | 16px | Large cards, modals |

---

## Shadow Scale

| Token | Value | Use |
|-------|-------|-----|
| `--s1` | `0 2px 8px rgba(0,0,0,.06)` | Default card shadow |
| `--s2` | `0 8px 24px rgba(0,0,0,.10)` | Hover state, elevated cards |

---

## Component Rules

### Hero (`.art-hero` / `.compare-hero`)
- Background: `var(--green)` always
- H1: white, Playfair Display serif
- Breadcrumb: `rgba(255,255,255,.55)`, hover white
- Author box: `rgba(255,255,255,.12)` background
- Tag badge: colored per page type (see tag classes below)

### Tag Badges
```
.tag-buy   background: #B8922A  (BUYING GUIDE)
.tag-cmp   background: #3A4A2E  (COMPARISON)
.tag-tut   background: #4B3A6A  (TUTORIAL)
.tag-list  background: #7A5A2E  (LISTICLE)
.tag-life  background: #2E5A4A  (LIFESTYLE)
.tag-rev   background: #2A4A6A  (REVIEW/GUIDE)
```

### Bottom Line Box (`.bottom-line-box`)
- Border-left: 4px solid `var(--gold)`
- Background: `var(--cream-dark)`
- H3: 14px uppercase label "OUR VERDICT"
- Body: 16px, `var(--body)`

### Product Section (`.art-section`)
- No outer card — sections are separated by `border-top: 2px solid var(--cream-dark)`
- Badge pill: `var(--gold)` background, dark text
- Product image: 280×200px max, right-floated on desktop, stacked on mobile

### Comparison Table (`.cmp-table`)
- Header row: `var(--green)` background, white text
- Winner row: `background: #f0f7f2`
- Winner cell: `color: var(--green)`, bold
- Buy button: `.cmp-buy-btn` — gold, 12px, border-radius: 20px
- Responsive: horizontal scroll on mobile, never truncate

### FAQ Block (`.art-faq`)
- Each item: `<details>` / `<summary>` accordion
- Summary: white background, 15px bold, chevron via `::after`
- Answer: `var(--cream-dark)` background, 15px, 1.75 line-height
- No border-radius less than `var(--r2)` on outer container

### CTA Box (`.art-cta`)
- Background: `var(--green)`
- H3: white, 22px
- Button: `.btn-gold`
- Margin: 52px top, 0 bottom

### Related Links Cluster (`.rel-cluster`)
- Background: `var(--cream-dark)`
- H3: 12px uppercase label
- Links: white card background, green text, arrow prefix
- Never use bare `<a>` tags without the `.rel-links a` wrapper

### Pros / Cons Lists (`.pros-list` / `.cons-list`)
- Pros: `✓` prefix in `var(--green)`, green left border
- Cons: `✗` prefix in `#c0392b`, red/muted left border
- Both: 14px body text, 1.6 line height, no nested lists

### Disclosure Box (`.disclosure-box`)
- Background: `rgba(200,168,75,.08)` (gold tint)
- Border: 1px solid `rgba(200,168,75,.3)`
- Icon: ⚖️ prefix
- Text: 13px muted, italic

### Who Should Buy/Skip (`.who-box`)
- Two-column grid on desktop, stacked on mobile
- Buy column: green left border
- Skip column: muted/grey left border
- 3–5 items each

---

## Layout Rules

### Article content max-width
All article body content: `max-width: 780px; margin: 0 auto`
Comparison tables: allow `max-width: 960px` with horizontal scroll

### Grid breakpoints
- Desktop: `≥900px`
- Tablet: `600px–900px`
- Mobile: `<600px`

### Card grids
- Article grid: `repeat(3, 1fr)` desktop → `repeat(2, 1fr)` tablet → `1fr` mobile
- Related grid: same as article grid
- Category grid: same as article grid

---

## Visual Consistency Rules

1. **Never use gradients** on content areas. Gradients are only acceptable on decorative
   hero overlays, and only subtle ones (max 2 stops, max 20% opacity on the lighter stop).

2. **Never mix font stacks** — Playfair Display for H1 only, DM Sans for everything else.

3. **No box-shadow on text** — `text-shadow` is never used in this design system.

4. **Icon emojis** — used as page emoji thumbnails and bullet point prefixes only.
   Never use emoji inside paragraph body copy.

5. **Minimum contrast ratio** — all body text must meet WCAG AA: 4.5:1 minimum.

6. **No full-width images** inside article body. Images float or are contained within
   `.product-img-wrap` at max 280px wide.

7. **All interactive elements** must have `:focus-visible` style using `var(--gold)` outline.
