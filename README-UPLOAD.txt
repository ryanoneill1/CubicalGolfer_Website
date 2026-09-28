Sprint 118b - six comparison pages (launch monitors, rangefinders, watches)

EXTRACT AT THE REPOSITORY ROOT, not inside src/.
Archive contains src/ and public/ at its top level.

CHANGED:
  src/data/comparisons.ts        6 new records (46 -> 52 comparison pages)
  src/data/lastmod-manifest.json regenerated
  public/api/search-index.json   regenerated
  public/llms-full.txt           regenerated

NEW:
  public/images/thumbnails/compare-*.webp   6 auto-generated card images

The other PDFs/images in public/ re-encode nondeterministically each build
and were deliberately reverted - only genuinely new files ship.
