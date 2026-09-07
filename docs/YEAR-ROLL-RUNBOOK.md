# The January year roll — runbook

**Owner:** Ryan · **Due:** late December / early January, every year
**Tools:** `scripts/roll-year.ts` · `scripts/validate-year-exposure.ts`

---

## Why this matters, in numbers

Search Console, 90 days to 2026-09-05:

| | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Site total | 5,840 | 379,000 | 1.5% | 15.7 |
| Queries containing **2026** | **796** | 13,800 | **5.8%** | 12.2 |
| Queries containing **2025** | **1** | 587 | 0.2% | **37.0** |

Dated queries are **13.6% of clicks at nearly four times the site CTR**.

The 2025 row is the control, and it is the whole argument. This site has never had a
"2025" title. Across **159** queries containing 2025 it sits at **average position 37**
and earned **one click in 90 days**. Having the year in your title is worth roughly
**25 positions** on a dated query.

So the risk is not that dated traffic declines gracefully. It transfers to whoever
rolled their titles.

**Concentration:** 590 of the 796 dated clicks (74%) are compression-chart queries —
`golf ball compression chart 2026` alone is 439 clicks at 19% CTR, position 3.6.

---

## When to run it

**Not before December.** As of 2026-09-05 the site had **3 total impressions** on
queries containing 2027. Rolling early trades live demand for demand that does not
exist yet.

Check first:

```
https://search.google.com/search-console/performance/search-analytics
  ?resource_id=sc-domain%3Acubicalgolfer.com&breakdown=query&query=~2027
```

Roll when 2027 impressions start climbing — typically mid-December, as people begin
searching ahead. The build prints a reminder every December.

---

## The steps

```bash
npx tsx scripts/roll-year.ts                 # 1. dry run — read the report
npx tsx scripts/roll-year.ts --apply         # 2. writes the SAFE bucket only
npm run lastmod                              # 3. REQUIRED — ~155 pages change
npm run validate && npm run build            # 4. must both exit 0
git diff --stat                              # 5. expect balanced +N / -N
```

Then read the diff before pushing. Expect roughly **372 strings across 8 files**.

### What step 2 changes

Only navigational fields: `title`, `titleDisplay`, `description`, `label`,
`guideLabel`, `h2`, `h3`, `heading`. The year there is a publication label, so bumping
it is mechanical.

### What it deliberately does NOT change

**Prose** — `body`, `a`, `q`, `bottomLine` (~133 mentions). These make claims:

> *"The S44 is Garmin's current mid-range golf watch and the one most weekend golfers
> should buy in 2026"*

Auto-rolling that asserts the S44 is still current in 2027, which nobody has verified.
Others are worse: *"the viral rangefinder of 2025-2026"* would become "2025-2027", and
*"Callaway released the 2026 Chrome Tour in January 2026"* is history, not a label.

The tool lists all of them under REVIEW. **Working that list is the editorial half of
the job** — for each one, decide whether the claim still holds.

**Model years** — "Callaway Chrome Tour 2026", "Titleist Pro V1 (2025 model)". A brand
name before the year, or words like *model / release / generation*, send it to REVIEW.

**URLs, slugs and article IDs** — never touched. `/best-golf-rangefinders-2026/` keeps
its slug while its title rolls to 2027. This is deliberate: the URL holds the
accumulated authority, and renaming it would need redirects for no gain. Verified: a
full test roll changed **0 ids and 0 hrefs**.

---

## The one thing the tool cannot decide for you

The compression chart PDF is **`/downloads/golf-ball-compression-chart-2026.pdf`**,
hardcoded in **6 places** including the schema.org `contentUrl`.

`golf ball compression chart 2026 pdf` earns **53 clicks at 27.2% CTR**, and
`2026 golf ball compression chart pdf` another 8 at 32%.

After you roll, `validate-year-exposure.ts` will flag the mismatch. Two options:

1. **Keep the filename, let the page title carry the year.** Zero risk, no redirect
   needed. The download button text can still say "Download 2027 Chart".
2. **Rename the file and add a redirect** from the old path. Only do this with the
   redirect in place — external links and Google's index both point at the 2026 path.

**Do not rename without a redirect.**

---

## Verifying the roll worked

A test roll of 2026 → 2027 was run end-to-end on 2026-09-07:

| Check | Result |
|---|---|
| `npm run validate` | 35 pass, exit 0 |
| `npm run build` | exit 0 |
| Pages | 278 — parity |
| URL set | identical — no page appeared or disappeared |
| `id` / `href` changes | **0 / 0** |
| Diff shape | +332 / −332, balanced |

Rendered titles after the test roll:

```
Best Golf Rangefinders 2027 — 8 Picks, 5 Tested
Golf Ball Compression Chart 2027 — 34 Balls + PDF
Average Golf Handicap by Age & Gender (2027)
```

---

## If something looks wrong

The tool is conservative by design: anything it cannot confidently classify goes to
REVIEW and is left alone. If a title you expected to roll did not, it is in the REVIEW
list with a reason — edit it by hand. That is safer than loosening the patterns.

To revert everything: `git checkout -- src/`
