# Page audit — Batch 2, and the fix (Sprint 195)

Method as Batch 1: read the rendered page, score against the rubric, and **verify
every candidate before reporting it.** Discarded candidates are listed at the
bottom, because the ruled-out work is part of the result.

---

## The finding

**Four pages answer a question nobody asked.**

`/when-to-replace-golf-grips/` was the one in this batch. Its Quick Answer is
rendered from `bottomLine`, and it read, in full:

> Our top pick: the **Golf Pride MCC Plus4** (~$13/grip).

The page is titled *"When to Replace Your Golf Grips (It Is Costing You 3-4
Strokes)"*. Someone who searched "when to replace golf grips" is shown a product
recommendation instead of a timeframe.

The answer is already written, further down the same page — the h2s include
*"The 4 Signs Your Grips Are Done"* and *"The Replacement Timeline"*. Nothing
needed researching. It simply was not surfaced where the reader looks first.

This is rubric D15/D16 (intent match, answer position) and it is also Google's
own review guidance: the first screen should answer what the title promised.

---

## Scanning for the pattern, which is where the value was

One page is a one-off. I scanned all 192 articles for the shape — a headline
that asks a question, with a `bottomLine` that opens by naming a product.

Six candidates. **Three were real, three were not:**

| Page | Verdict |
|---|---|
| `/when-to-replace-golf-grips/` | **Defect** — bare pick, no answer at all |
| `/how-to-fit-yourself-for-driver/` | **Defect** — "No Pro Shop Needed" in the title, answered with "buy this driver" |
| `/how-to-choose-putter-length/` | **Defect** — the question is a *length*; the answer named a putter model |
| `/how-to-break-90/` | Keep — "most rounds that break 90 are won inside 100 yards" IS the answer |
| `/how-to-get-your-kid-into-golf/` | Keep — "sized to a child 42 to 45 inches tall rather than to an age" is specific and useful |
| `/how-to-fix-your-slice/` | Keep — names the over-the-top move as the cause |

---

## A fourth page the scan missed, and why

While applying the fix, the edit for `/how-to-fit-yourself-for-driver/` failed
with "anchor count 2". Two articles had **byte-identical** bottomLines.

The other was `/driver-vs-3-wood-off-tee/`, titled *"Driver vs 3-Wood Off the
Tee — Which Should You Hit?"*, answered with *"Our top pick: the Callaway Ai
Smoke Max Driver (~$499)"* — which answers neither club nor the comparison.

My regex looked for `should i`. The title says **should you**. That is the same
unreliability that made me throw away the whole regex rubric in Batch 1, and it
is why candidates get read rather than trusted.

Verbatim duplicate copy across two pages is independently a problem — Google's
helpful-content guidance names mass-produced content as a quality signal.
Site-wide duplicated bottomLines: **1 before, 0 after.**

---

## The fix — Sprint 195

Every replacement answers the question first and names the pick last, and every
figure is taken from that page's own existing, already-verified copy. Nothing
was researched or invented.

**`/when-to-replace-golf-grips/`** — from "The 4 Signs" and "The Replacement Timeline"
> Shiny, smooth patches where your thumbs and palms sit are the first sign — fresh
> grips are matte across the whole surface. If you practise three or more times a
> week, plan on every six to eight months, because range mats wear grips far faster
> than grass does. Our top pick when you do: the Golf Pride MCC Plus4 (~$13/grip).

**`/how-to-choose-putter-length/`** — from "The Height-Based Starting Point"
> Start from your height: 34 inches is standard and fits 5 feet 8 to 5 feet 11,
> dropping to 33 inches around 5 feet 4 and rising to 35 at 6 feet 3. Then check
> where your eyes sit over the ball, because arm length and posture move the answer
> more than height alone does.

**`/how-to-fit-yourself-for-driver/`** — from "Step 2: Choose Your Loft" and "Step 3"
> Loft is the spec most golfers get wrong, and your swing speed sets it: under 85
> mph play 12 degrees or more, 85 to 95 mph play 10.5, and 95 to 105 mph play 9.5
> to 10.5. Match shaft flex to that same number, leave length standard, and you
> have done most of what a paid fitting would do.

**`/driver-vs-3-wood-off-tee/`** — from "The Distance vs Accuracy Trade-Off" and "When to Hit 3-Wood"
> Driver on wide holes and any par-4 over 400 yards; 3-wood when there is OB or
> water within 25 yards of the fairway edge. The average weekend driver misses the
> line by 35 yards against 22 for a 3-wood, which is why the 3-wood is the right
> call on only three or four holes a round rather than most of them.

Every existing price is carried through unchanged, so no price claim moved and
none of the price validators has anything new to check.

---

## The other nine pages in Batch 2 — no findings

Checked and genuinely fine. Each Quick Answer answers its own page's question:

- **`/best-launch-monitors-under-500/`** — names the R10 with metrics, software and
  subscription terms. It also has *"Priced Out of This Page: Swing Caddie SC4 Pro
  (now $599)"* and *"What About the Rapsodo MLM2PRO (~$599)?"* — explaining what
  was excluded and why is exactly what the added-value test asks for.
- **`/best-left-handed-golf-clubs-2026/`** — "Ping offer every model in left-hand with
  no upcharge and no wait" is a real, specific finding. Has a "Who Should Buy This —
  And Who Should Skip It" section, which is rubric A5.
- **`/golf-handicap-explained/`** — flagged "thin for type" at 1,067 words with zero
  affiliate links, but it answers cleanly (best 8 of last 20, adjusted for course
  difficulty). Do not pad it.
- **`/how-many-clubs-in-a-golf-bag/`** — flagged thin at 1,026 words. Answers in the
  first line (14) then adds a judgement most pages do not: "drop the club you hit
  worst and add the club that fills your biggest distance gap."
- **`/arccos-vs-garmin-shot-tracking/`**, **`/garmin-s62-vs-apple-watch-golf/`** — both
  split the verdict by use case rather than declaring one winner. Strong.
- **`/best-golf-grip-trainers/`**, **`/when-to-replace-golf-grips/`** (structure),
  **`/golf-desk-accessories-office/`**, **`/`** — nothing to report.

---

## What this says about the remaining 27 batches

Batch 1 gave 3 findings from 10 pages. Batch 2 gave 1 — but scanning site-wide
for that one page's *shape* found 3 more, two of which were outside the batch
entirely.

So the batches are worth running not for the pages in them, but as a way of
spotting a pattern that can then be checked across all 192 articles at once. The
reading finds the shape; the scan finds the scale. I would keep going on that
basis rather than grinding through batches 3–29 page by page.

---

## Upload

EXTRACT AT THE REPOSITORY ROOT. 2 files. No deletions.

    src/data/articles.ts
    src/data/lastmod-manifest.json

Verified: articles.ts parses (192 articles); all four bottomLines rewritten;
duplicated bottomLines 1 before / 0 after; inline styles 7 before / 7 after;
manifest 4 records updated, 300 entries before and after.
