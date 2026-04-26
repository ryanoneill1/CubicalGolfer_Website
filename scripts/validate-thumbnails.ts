#!/usr/bin/env node
// scripts/validate-thumbnails.ts
// Fails the build if any article references a thumbnail file that doesn't exist.

import { ARTICLES } from '../src/data/articles.ts';
import fs from 'fs';
import path from 'path';

let errors = 0;

for (const article of ARTICLES) {
  const a = article as any;
  if (!a.thumbnail) continue;

  const filePath = path.join(process.cwd(), 'public', a.thumbnail);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing thumbnail: ${a.thumbnail} (referenced by ${a.slug})`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n❌ ${errors} missing thumbnail(s). Add the file or fix the reference in src/data/articles.ts.`);
  process.exit(1);
} else {
  console.log(`✅ All ${ARTICLES.length} article thumbnails verified.`);
}
