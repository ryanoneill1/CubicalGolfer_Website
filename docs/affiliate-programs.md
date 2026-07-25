# Affiliate Programs — Operator Guide

CubicalGolfer routes every product link to an affiliate **program**. The goal of
multi-retailer support is to send high-ticket items (simulators, launch monitors,
enclosures — $2,000–$5,000) to programs that pay far more than Amazon's 3%.

**How it fits together**

- `src/data/affiliate-links.ts` — one entry per product. Each entry has a
  `program` field plus `commissionPct` / `cookieDays` mirroring that program.
- `src/data/affiliate-programs.ts` — the `PROGRAMS` registry: the rates, cookie
  windows, base URLs, **tracking IDs**, and signup links. This is the single
  place you edit after an application is approved.
- `scripts/check-affiliate-links.ts` — build-time guard (runs in `npm run
  validate`). It **fails the build** if any product uses a non-Amazon program
  whose `trackingParam` is still empty, so a link can never ship untracked and
  unpaid.
- `src/components/ProductCard.astro` / `AffiliateCTA.astro` — buttons show the
  real retailer name ("Check Price at Carl's Place").

## The programs

| Program (`program` key) | Rate | Cookie | Network | Status |
|---|---|---|---|---|
| Amazon (`amazon`) | 3% | 24 h | Amazon Associates | ✅ Live (tag `cubicalgolfer-20`) |
| Golf Galaxy (`golfgalaxy`) | 8% | 14 d | CJ Affiliate | ✅ Live (21 products) |
| PlayBetter (`playbetter`) | ~5%* | ~30 d* | PlayBetter / Impact | ✅ Live (5 products) |
| Bushnell (`bushnell`) | ~5%* | ~30 d* | Impact | ✅ Live (4 products) |
| **Carl's Place** (`carlsplace`) | up to **15%** | 30 d | AvantLink (merchant 29797) | ⏳ Apply |
| **Shop Indoor Golf** (`shopindoorgolf`) | **7.5%** | 30 d | CJ Affiliate | ⏳ Apply |
| **2nd Swing** (`2ndswing`) | **15%** new / 5% | ~30 d | Awin | ⏳ Apply |
| Vice Golf (`vice`) | TBD | TBD | TBD | ⏳ Apply |

\* PlayBetter and Bushnell rates/windows are placeholders flagged `// TODO verify`
in `affiliate-programs.ts` — confirm with each program and update.

## Signup links

- **Carl's Place** (impact screens, enclosures, DIY sim kits) — up to 15%, 30-day, AvantLink merchant **29797**: https://classic.avantlink.com/apply.php?merchant_id=29797
- **Shop Indoor Golf** (launch monitors, complete sim packages) — 7.5%, 30-day, $2,300 AOV, CJ: https://www.cj.com/
- **2nd Swing** (used/new clubs) — 15% new releases / 5% otherwise, Awin: https://www.awin.com/
- **Golf Galaxy** — CJ: https://www.cj.com/
- **Vice Golf** — https://www.vicegolf.com/
- **Amazon Associates** — https://affiliate-program.amazon.com/

## After an application is approved — the ONE edit

Open **`src/data/affiliate-programs.ts`** and, in the `PROGRAMS` object, find the
program you were approved for. Paste your real affiliate ID into
**`trackingParam`** (and confirm `commissionPct` / `cookieDays`):

```ts
carlsplace: {
  name: "Carl's Place",
  commissionPct: 15,
  cookieDays: 30,
  baseUrl: 'https://www.carlofet.com',
  trackingParam: '',   // ← paste your AvantLink affiliate ID here
  signupUrl: 'https://classic.avantlink.com/apply.php?merchant_id=29797',
  network: 'AvantLink (merchant 29797)',
},
```

What each program expects in `trackingParam`:

| Program | `trackingParam` value | Where to find it |
|---|---|---|
| `carlsplace` | AvantLink affiliate/publisher ID | AvantLink dashboard → account settings |
| `shopindoorgolf` | CJ publisher ID (PID) | CJ account (same PID as Golf Galaxy: `101736949`) |
| `2ndswing` | Awin `awinaffid` | Awin dashboard → account |
| `vice` | affiliate ID per its network | the network you signed up through |

That single paste unlocks the program: the build-time guard stops complaining,
and `buildUrl(program, productPath)` starts producing tracked links.

## Assigning a product to a higher-paying program

In `src/data/affiliate-links.ts`, on the product's entry, set:

```ts
program: 'carlsplace',
commissionPct: 15,
cookieDays: 30,
retailer: "Carl's Place",   // display name shown on the button
url: '...',                 // the tracked URL (Prompt 1 handles URL values)
```

If you set `program` to a program whose `trackingParam` is still empty,
`npm run validate` (and therefore the build) will **fail** with a clear message
telling you exactly which ID to paste — by design, so an unpaid link can't ship.

## Quick reference — files & fields

| I want to… | File | Field |
|---|---|---|
| Add/confirm a program's rate or tracking ID | `src/data/affiliate-programs.ts` | `PROGRAMS.<key>` |
| Point a product at a program | `src/data/affiliate-links.ts` | entry `program` / `commissionPct` / `cookieDays` |
| Change a button's retailer name | `src/data/affiliate-links.ts` | entry `retailer` |
| See why the build failed on links | `scripts/check-affiliate-links.ts` | (runs in `npm run validate`) |
