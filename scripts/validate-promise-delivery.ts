#!/usr/bin/env node
// scripts/validate-promise-delivery.ts
// Fails if any article's title promises a product count that doesn't match actual sections.

import { ARTICLES } from '../src/data/articles.ts';

const NUMBER_PATTERN = /\b(\d{1,2})\s+(best|tested|top|picks?|products?|reviewed|ranked)\b/i;

interface Issue {
  slug: string;
  title: string;
  promised: number;
  actualSections: number;
  tableRows: number;
}

const issues: Issue[] = [];

for (const article of ARTICLES) {
  const a = article as any;
  const combined = `${a.title ?? ''} ${a.titleDisplay ?? ''}`;
  const promised = combined.match(NUMBER_PATTERN);
  if (!promised) continue;

  const promisedCount = parseInt(promised[1], 10);

  const tableRows = a.comparisonTable?.rows?.length ?? 0;
  const productSections = (a.sections ?? []).filter((s: any) => s.badge).length;
  const actual = Math.max(tableRows, productSections);

  // Allow ±1 tolerance (e.g. "5 Best" with 4 product sections + 1 intro is fine)
  if (actual > 0 && Math.abs(promisedCount - actual) > 1) {
    issues.push({
      slug: a.slug,
      title: a.titleDisplay ?? a.title,
      promised: promisedCount,
      actualSections: productSections,
      tableRows,
    });
  }
}

if (issues.length > 0) {
  console.error('Promise/delivery gaps found:\n');
  for (const issue of issues) {
    console.error(
      `  ❌ ${issue.slug}\n` +
      `     Title promises: ${issue.promised}\n` +
      `     Product sections: ${issue.actualSections}, Table rows: ${issue.tableRows}\n` +
      `     Title: "${issue.title}"\n`
    );
  }
  console.error(`\n❌ ${issues.length} article(s) have title-promise vs content gaps. Fix titles or add content.`);
  process.exit(1);
} else {
  console.log(`✅ All ${ARTICLES.length} articles pass promise/delivery check.`);
}
