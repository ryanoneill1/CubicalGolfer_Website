Sprint 124 — Titleist TruFeel compression correction (45 -> 70)

EXTRACT AT THE REPOSITORY ROOT.
Paths must land at src/..., scripts/..., public/... — NOT inside an existing
src/. If you end up with src/src/, it was extracted one level too deep.

WHY: our chart carried TruFeel at 45 compression. Titleist publishes no figure;
MyGolfSpy's 2026 ball test gauged it at 70 and Today's Golfer measured 68.
No source supports 45. Tour Soft (65) and Velocity (65) were checked too and
left alone — those are genuinely contested, ours sits in a real cluster.

9 files, all modifications (no deletions, no new files):
  src/data/balls.ts                                   (the single source: 45 -> 70 + provenance note)
  src/data/articles.ts                                (9 downstream mentions resynced)
  src/data/lastmod-manifest.json                      (6 pages bumped)
  src/pages/golf-ball-compression-chart/index.astro   (FAQ, brand summary, tier bands)
  src/pages/titleist-golf-ball-compression-chart/index.astro
  src/pages/golf-ball-finder/index.astro
  scripts/generate-compression-pdf.ts                 (swing-speed band no longer lists TruFeel under 65)
  public/llms-full.txt                                (regenerated)
  public/downloads/golf-ball-compression-chart-2026.pdf  (regenerated)

NOTE: Sprint 122's files (linking.ts, [...slug].astro, validate-crawl-starved-floor.ts)
are already on origin at be23c6b and are NOT included here.
