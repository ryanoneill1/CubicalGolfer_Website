#!/usr/bin/env node
// scripts/validate-affiliate-keys.ts
// Fails the build if any article section has an affiliateKey that doesn't
// match the product brand mentioned in its h2.

import { ARTICLES } from '../src/data/articles.ts';

// Brand keywords (in h2) → expected affiliateKey
// Order matters: most specific match wins, so list more specific entries first.
const BRAND_MAP: [string, string][] = [
  ['bushnell tour v6 shift',          'bushnell-tour-v6-shift'],
  ['bushnell v6 shift',               'bushnell-tour-v6-shift'],
  ['bushnell tour v6',                'bushnell-tour-v6-shift'],
  ['bushnell pro xe',                 'bushnell-pro-xe'],
  ['bushnell ion elite',              'bushnell-ion-elite'],
  ['precision pro nx9 hd',            'precision-pro-nx9-hd'],
  ['precision pro nx9',               'precision-pro-nx9-hd'],
  ['blue tees series 3 max',          'blue-tees-series-3-max'],
  ['blue tees series 3',              'blue-tees-series-3-max'],
  ['garmin approach z82',             'garmin-approach-z82'],
  ['garmin approach s62',             'garmin-approach-s62'],
  ['garmin approach s42',             'garmin-approach-s42'],
  ['shot scope v5',                   'shot-scope-v5'],
  ['titleist pro v1x',               'titleist-pro-v1x'],
  ['titleist pro v1',                'titleist-pro-v1'],
  ['callaway chrome tour 2026',      'callaway-chrome-tour-2026'],
  ['callaway chrome tour',           'callaway-chrome-tour-2026'],
  ['callaway supersoft',             'callaway-supersoft'],
  ['srixon soft feel',               'srixon-soft-feel'],
  ['taylormade tp5x',                'taylormade-tp5x'],
  ['taylormade tp5',                 'taylormade-tp5'],
  ['odyssey white hot',              'odyssey-white-hot-og'],
  ['scotty cameron phantom',         'scotty-cameron-phantom'],
  ['cleveland hb soft milled',       'cleveland-hb-soft-milled'],
  ['cleveland hb soft',              'cleveland-hb-soft-milled'],
  ['rapsodo mlm2pro',                'rapsodo-mlm2pro'],
  ['arccos caddie sensors',          'arccos-caddie-sensors'],
  ['arccos caddie',                  'arccos-caddie-sensors'],
  ['taylormade qi35',                'taylormade-qi35-max'],
  ['callaway paradym ai smoke max irons', 'callaway-paradym-ai-smoke-max-irons'],
  ['callaway paradym ai smoke max iron', 'callaway-paradym-ai-smoke-max-irons'],
  ['callaway paradym ai smoke max', 'callaway-paradym-ai-smoke-max'],
  ['callaway paradym ai smoke',      'callaway-paradym-ai-smoke-max'],
  ['cobra aerojet',                  'cobra-aerojet-max'],
  ['wilson profile sgi',            'wilson-profile-sgi'],
  ['wilson profile',                'wilson-profile-sgi'],
  ['callaway strata',               'callaway-strata'],
  ['taylormade rbz',                'taylormade-rbz-lite'],
  ['ping g430 max driver',          'ping-g430-max-driver'],
  ['ping g430 irons',               'ping-g430-irons'],
  ['ping g le3',                    'ping-g-le3-irons'],
  ['wilson d9 irons',               'wilson-d9-irons'],
  ['wilson d9',                     'wilson-d9-irons'],
  ['titleist t300',                 'titleist-t300'],
  ['titleist t100',                 'titleist-t100'],
  ['sun mountain',                  'sun-mountain-25-plus'],
  ['titleist players 4',            'titleist-players-4'],
  ['callaway fairway 14',           'callaway-fairway-14'],
  ['callaway chev dry',             'callaway-chev-dry'],
  ['callaway reva',                 'callaway-reva-driver'],
  ['titleist players flex',         'titleist-players-flex'],
  ['footjoy weathersof',            'footjoy-weathersof-glove'],
  ['footjoy raingrip',              'footjoy-raingrip'],
  ['callaway dawn patrol',          'callaway-dawn-patrol'],
  ['footjoy flex xp',               'footjoy-flex-xp'],
  ['ecco biom',                     'ecco-biom-c4'],
  ['skechers go golf',              'skechers-go-golf-elite-5'],
  ['nike air max 90',               'nike-air-max-90-golf'],
  ['vokey sm10',                    'vokey-sm10-52'],
  ['cleveland rtx 6',               'cleveland-rtx6-52'],
  ['callaway jaws raw',             'callaway-jaws-raw-52'],
  ['mizuno t24',                    'mizuno-t24-52'],
  ['maxfli milled',                 'maxfli-milled-52'],
  ['superspeed golf',               'superspeed-golf-set'],
  ['the stack',                     'the-stack-system'],
  ['rypstick',                      'rypstick-trainer'],
  ['orange whip',                   'orange-whip-trainer'],
  ['lag shot',                      'lag-shot-7-iron'],
  ['eyeline speed trap',            'eyeline-speed-trap'],
  ['golf pride mcc',                'golf-pride-mcc-plus4'],
  ['golf pride tour velvet',        'golf-pride-tour-velvet-cord'],
  ['lamkin crossline',              'lamkin-crossline-cord'],
  ['winn dri-tac',                  'winn-dri-tac'],
  ['superstroke s-tech',            'superstroke-s-tech'],
  ['superstroke traxion',           'superstroke-traxion-grip'],
  ['superstroke zenergy',           'superstroke-zenergy'],
  ['spornia spg',                   'spornia-spg-net'],
  ['rukket haack',                  'rukket-haack-net'],
  ['net return pro',                'net-return-pro'],
  ['sklz accelerator',              'sklz-accelerator-putting-mat'],
  ['putt-a-bout',                   'putt-a-bout-putting-green'],
  ['birdieball',                    'birdieball-putting-green'],
  ['wellputt',                      'wellputt-mat'],
  ['lab golf mezz',                 'lab-golf-mezz1-max'],
  ['lab golf df3i',                 'lab-golf-df3i'],
  ['lab golf df3',                  'lab-golf-df3'],
  ['lab golf oz',                   'lab-golf-oz1'],
  ['taylormade spider 5k',          'taylormade-spider-5k-zt'],
  ['pxg allan',                     'pxg-allan-putter'],
  ['odyssey.*jailbird',             'odyssey-jailbird-zt'],
  ['odyssey tri-beam',              'odyssey-tri-beam-arm-lock'],
  ['lazrus zero',                   'lazrus-zero-torque'],
  ['theraband',                     'theraband-flexbar'],
];

// Sections with these substrings in h2 are intentionally about a different
// product than the affiliateKey (e.g. comparison sections, how-to sections).
const SKIP_SUBSTRINGS = [
  'compared to', 'compared with', 'vs.', 'vs ', 'how to',
  'what to', 'step ', 'why ', 'when to', 'the case for',
  'decision framework', 'mistakes', 'what if', 'emergency',
  'diy ', 'bounce angle', 'sole grind', 'set vs specialty',
  'maintenance schedule', 'danger zone', 'cheapest upgrade',
  'note on putter', 'wide feet', 'waterproofing',
];

let errors = 0;
let checked = 0;

for (const article of ARTICLES) {
  for (const section of (article as any).sections ?? []) {
    if (!section.affiliateKey || section.affiliateKey === '') continue;
    const h2 = (section.h2 ?? '').toLowerCase();
    if (SKIP_SUBSTRINGS.some(p => h2.includes(p))) continue;

    checked++;
    for (const [brand, expectedKey] of BRAND_MAP) {
      if (h2.includes(brand)) {
        if (section.affiliateKey !== expectedKey) {
          console.error(
            `MISMATCH in ${(article as any).slug}\n` +
            `  Section h2:    "${section.h2}"\n` +
            `  Mentions:      "${brand}"\n` +
            `  Expected key:  ${expectedKey}\n` +
            `  Found key:     ${section.affiliateKey}\n`
          );
          errors++;
        }
        break; // first brand match wins
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n❌ ${errors} affiliate-key mismatch(es) detected. Fix in src/data/articles.ts before building.`);
  process.exit(1);
} else {
  console.log(`✅ Affiliate key validation passed for ${ARTICLES.length} articles (${checked} sections checked).`);
}
