# Duplicate file inventory & build-consumption audit

## How "what the build consumes" was determined

1. **`astro.config.mjs`** — no custom `srcDir`/`root`, so Astro builds from the
   default `./src`. Pages come only from `src/pages/**`. Nothing at the repo root,
   under `/data/`, `/lib/`, or `/courses/` is part of this project's page graph.
2. **`tsconfig.json` path aliases** — `@/* → src/*`, `@data/* → src/data/*`,
   `@lib/* → src/lib/*`, `@components/* → src/components/*`. **Every alias points
   inside `src/`.** No alias can resolve to a root/`data`/`lib`/`courses` copy.
   (In practice no file even uses these aliases for the three files — all imports
   are relative.)
3. **Every import under `src/`** of `articles`, `affiliate-links`, or `schema`
   uses a relative path that resolves inside `src/` — e.g. `src/lib/schema.ts`
   imports `../data/affiliate-links` (→ `src/data/affiliate-links.ts`), and
   `src/pages/**/index.astro` import `../../data/articles`, `../../data/affiliate-links`,
   `../../lib/schema` (all → `src/…`).
4. **Build-time scripts** (`scripts/*.ts`, run via `npm run validate` and the
   generate steps) import `../src/data/articles`, `../src/data/affiliate-links` —
   the `src/` copies only. `functions/` imports none of them.
5. **Deploy path** — `.github/workflows/deploy.yml` runs `npm run build`
   (root Astro project → `dist/`) then `wrangler deploy`, which publishes
   `./dist` (per `wrangler.toml`). The **`/courses/` sub-project is never built or
   deployed** by this workflow; it has its own `package.json` and is a stale
   v2.0.0 snapshot that cannot even build (its pages import `../lib/schema`, but
   `courses/src/lib/` does not exist).

**Conclusion — the build consumes exactly three files:**

| Canonical file | Size | Consumed by build |
|---|---:|:--:|
| `src/data/articles.ts` | 1.9 MB | ✅ |
| `src/data/affiliate-links.ts` | 220 KB | ✅ |
| `src/lib/schema.ts` | 24 KB | ✅ |

## Duplicates found (all git-tracked) — and the verdict

Every copy below is **dead**: nothing in the deployed build imports it. Sizes are
far smaller than the canonical files, confirming they are stale partial copies.
(All files share a single import-snapshot commit date of 2026-07-25, so commit
date does not differentiate them — size and import-graph do.)

| Duplicate path | Size | Last commit | Imported by the build? | Verdict |
|---|---:|---|---|---|
| `affiliate-links.ts` (root) | 28 KB | 2026-07-25 | No | **DELETE** |
| `articles.ts` (root) | 144 KB | 2026-07-25 | No | **DELETE** |
| `schema.ts` (root) | 12 KB | 2026-07-25 | No | **DELETE** |
| `data/affiliate-links.ts` | 24 KB | 2026-07-25 | No | **DELETE** |
| `data/articles.ts` | 1.7 MB | 2026-07-25 | No | **DELETE** |
| `lib/schema.ts` | 12 KB | 2026-07-25 | No | **DELETE** |
| `courses/src/data/affiliate-links.ts` | 40 KB | 2026-07-25 | Only by `/courses/` (dead, never built/deployed) | **DELETE** |
| `courses/src/data/articles.ts` | 228 KB | 2026-07-25 | Only by `/courses/` (dead, never built/deployed) | **DELETE** |

The root copy of `affiliate-links.ts` also referenced product images with a
`.svg` extension that do not exist (`public/images/products/` holds 324 `.webp`
and zero `.svg`) — further proof it is stale and unshipped.

## Action taken

All eight duplicates were deleted. `npm run build` was re-run and succeeds
(265 pages). A CI guard (`scripts/check-duplicates.ts`, wired into
`.github/workflows/deploy.yml` and the `validate` script) now fails the build if
any of these three filenames reappears outside its canonical path.

> Note (out of scope for this task, flagged for follow-up): the repo root and the
> `/courses/` tree contain many *other* stray duplicates of `src/` files
> (`index.astro`, `[...slug].astro`, `linking.ts`, `seo.ts`, `types.ts`, a whole
> `data/` and `lib/` tree, a committed `dist/`, etc.). They are not consumed by
> the build either. This task only removed the three data/lib filenames in scope;
> the operator may want to prune the rest of the root pollution separately.
