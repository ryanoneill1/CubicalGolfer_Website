Sprint C4b - accessories page: bag checklist + printable PDF

EXTRACT AT THE REPOSITORY ROOT, not inside src/.
The archive contains src/, scripts/ and public/ at its top level.

NEW:
  src/data/bag-checklist.ts              25 items, 4 tiers, from the page itself
  public/downloads/golf-bag-checklist.pdf  generated from the page table

CHANGED:
  src/data/articles.ts                   "The Complete Bag Checklist" section + download block
  scripts/generate-chart-pdfs.ts         checklist PDF spec
  scripts/validate-pdf-attribution.ts    registers the new PDF
  src/data/lastmod-manifest.json         regenerated

Only the NEW pdf ships. The other 7 in public/downloads/ re-encode
nondeterministically on every build and were deliberately reverted.
