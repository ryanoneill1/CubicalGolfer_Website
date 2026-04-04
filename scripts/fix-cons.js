#!/usr/bin/env node
/**
 * scripts/fix-cons.js
 * 
 * Post-build fixer that runs after astro build.
 * Fixes two issues caused by build_pages.py generator bugs:
 * 
 * 1. CONS BUG: Collapses single-character <li> items back into full strings
 *    (caused by iterating over a string instead of an array)
 * 
 * 2. IMAGE MISMATCH BUG: Replaces wrong product images with correct ones
 *    (caused by reusing the same img_seed across multiple different products)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST = './dist';
let consFixed = 0;
let imgFixed = 0;

// ── IMAGE CORRECTIONS ──────────────────────────────────────────────────────
// Format: { productName (substring match): correctImageStem }
// Use 'placeholder-none' for products without their own image in the library
const IMAGE_CORRECTIONS = {
  // Simulator / screen products showing wrong images
  "Carl's Place":       'placeholder-none',
  "Net Return":         'placeholder-none',
  "Fiberbuilt":         'placeholder-none',
  "BenQ":               'placeholder-none',
  "Epson":              'placeholder-none',

  // Launch monitors showing wrong images  
  "FlightScope Mevo":   'placeholder-none',
  "Ernest Sports":      'placeholder-none',
  "Voice Caddie":       'placeholder-none',

  // Grip trainers showing alignment sticks
  "SKLZ Gold Flex":     'placeholder-none',
  "Orange Whip":        'placeholder-none',
  "Tour Striker PlaneMate": 'placeholder-none',
  "Callaway Swing Trainer": 'placeholder-none',
  "Golf Pride Grip":    'placeholder-none',

  // Rangefinders showing wrong rangefinder
  "TecTecTec":          'placeholder-none',
  "Nikon Coolshot":     'placeholder-none',
  "Callaway 300 Pro":   'placeholder-none',

  // Golf nets/indoor setup
  "Rukket":             'placeholder-none',

  // Apps showing GPS watch images
  "The Grint":          'placeholder-none',
  "18Birdies":          'placeholder-none',
  "Golf Pad":           'placeholder-none',

  // Golf balls with wrong ball image
  "Titleist Velocity":  'titleist-pro-v1x',

  // Budget drivers with wrong image
  "Cleveland Launcher": 'placeholder-none',
  "Zepp Golf":          'placeholder-none',
  "Garmin Approach R10": 'placeholder-none',
  "Callaway 300 Pro":   'placeholder-none',
};

// ── CONS FIXER ──────────────────────────────────────────────────────────────
function fixSingleCharLis(html) {
  return html.replace(
    /(<li[^>]*>[^<]{1}<\/li>\s*){3,}/g,
    (match) => {
      const chars = [...match.matchAll(/<li[^>]*>([^<]{1})<\/li>/g)].map(m => m[1]);
      return `<li>${chars.join('').trim()}</li>`;
    }
  );
}

// ── IMAGE FIXER ─────────────────────────────────────────────────────────────
function fixProductImages(html) {
  // Find each product card and fix its image if the name matches a correction
  return html.replace(
    /<div class="product-card">(.*?)<\/div>\s*\n\s*\n/gs,
    (cardBlock) => {
      const nameMatch = cardBlock.match(/<h3 class="product-card__name">([^<]+)<\/h3>/);
      const imgMatch = cardBlock.match(/<img src="(\/images\/products\/([^"]+)\.webp)"/);
      
      if (!nameMatch || !imgMatch) return cardBlock;
      
      const productName = nameMatch[1].trim();
      const currentImg = imgMatch[1];
      const currentStem = imgMatch[2];
      
      // Check if this product needs a corrected image
      for (const [nameSubstr, correctStem] of Object.entries(IMAGE_CORRECTIONS)) {
        if (productName.includes(nameSubstr) && currentStem !== correctStem) {
          const correctImg = `/images/products/${correctStem}.webp`;
          console.log(`[fix-images] ${productName}: ${currentStem} → ${correctStem}`);
          imgFixed++;
          return cardBlock.replace(currentImg, correctImg);
        }
      }
      return cardBlock;
    }
  );
}

// ── WALK ALL HTML FILES ──────────────────────────────────────────────────────
function walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkHtml(full);
    } else if (entry.endsWith('.html')) {
      const original = readFileSync(full, 'utf8');
      let fixed = fixSingleCharLis(original);
      fixed = fixProductImages(fixed);
      fixed = normalizePlaceholderImages(fixed);
      if (fixed !== original) {
        writeFileSync(full, fixed, 'utf8');
      }
    }
  }
}

// ── NORMALIZE ALL PRODUCT IMAGES TO PLACEHOLDER ──────────────────────────
// Since no real product photos exist yet, replace all SVG-converted WebP
// images with placeholder-none so the fallback UI shows correctly
function normalizePlaceholderImages(html) {
  return html.replace(
    /(<img[^>]+class="product-card__img"[^>]+)src="\/images\/products\/(?!placeholder-none)[^"]+\.webp"/g,
    '$1src="/images/products/placeholder-none.webp"'
  );
}

walkHtml(DIST);
console.log(`[fix-cons] Cons fixed: ${consFixed} files`);
console.log(`[fix-images] Images fixed: ${imgFixed} products`);
console.log('[fix-build] Post-build fixes complete');
