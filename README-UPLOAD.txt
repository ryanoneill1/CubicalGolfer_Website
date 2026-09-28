Sprint C4a — wedge page: lookup table + printable PDF

EXTRACT AT THE REPOSITORY ROOT, not inside src/.
The archive contains src/, scripts/ and public/ at its top level.

NEW FILES:
  src/data/wedge-lofts.ts                     PW loft per iron set + the 4-degree ladder
  public/downloads/golf-wedge-setup-chart.pdf generated from the page table

CHANGED:
  src/data/articles.ts        new "Wedge Setup by Iron Set" section + download block
  scripts/generate-chart-pdfs.ts   wedge PDF spec
  scripts/validate-pdf-attribution.ts  registers the new PDF
  public/api/search-index.json, public/llms-full.txt, lastmod-manifest.json  regenerated
