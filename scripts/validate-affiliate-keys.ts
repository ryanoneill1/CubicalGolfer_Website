#!/usr/bin/env node
// scripts/validate-affiliate-keys.ts
// Fails the build if any article section has an affiliateKey that doesn't
// match the product brand mentioned in its h2.

import { ARTICLES } from '../src/data/articles.ts';

// Brand keywords (in h2) → expected affiliateKey
// Order matters: most specific match wins, so list more specific entries first.
const BRAND_MAP: [string, string][] = [
  ['callaway paradym ai smoke max irons', 'callaway-paradym-ai-smoke-max-irons'],
  ['cleveland launcher xl2 driver',     'cleveland-launcher-xl2-driver'],
  ['taylormade sim2 max irons',         'taylormade-sim2-max-irons'],
  ['taylormade stealth hd irons',       'taylormade-stealth-hd-irons'],
  ['cleveland launcher xl halo',        'cleveland-launcher-xl-halo-irons'],
  ['srixon zx5 mk ii',                 'srixon-zx5-mk-ii'],
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
  ['bombas performance quarter',    'bombas-performance-quarter-socks'],
  ['bombas',                        'bombas-performance-quarter-socks'],
  ['u.s. kids golf ul7 42',          'us-kids-ul7-42-complete-set'],
  ['us kids golf ul7',              'us-kids-ul7-42-complete-set'],
  ['ul7 42',                        'us-kids-ul7-42-complete-set'],
  ['motocaddy m7 gps',               'motocaddy-m7-gps-remote-caddy'],
  ['motocaddy m7',                   'motocaddy-m7-remote-caddy'],
  ['motocaddy qb2',                  'motocaddy-qb2-push-cart'],
  ['footjoy pro/sl',                 'footjoy-pro-sl-shoes'],
  ['nike victory pro 4',             'nike-victory-pro-4-shoes'],
  ['drive pro clone sl',             'under-armour-drive-pro-clone-sl-shoes'],
  ['drive pro clone',                'under-armour-drive-pro-clone-shoes'],
  ['blade tour si',                  'skechers-blade-tour-si-shoes'],
  ['maxfli xcw',                     'maxfli-xcw-wedge'],
  ['skechers pure si',               'skechers-pure-si-shoes'],
  ['reebok nano',                    'reebok-nano-golf-shoes'],
  ['adipower 26',                    'adidas-adipower-26-shoes'],
  ['tour authentic triple diamond',  'callaway-tour-authentic-td-glove'],
  ['ping tour glove',                'ping-tour-glove'],
  ['stance athletic tab',            'stance-athletic-tab-socks'],
  ['big max blade ip 2',             'big-max-blade-ip-2-cart'],
  ['abacus bounce',                  'abacus-bounce-waterproof-hoodie'],
  ['genesonic pro',                  'mileseey-genesonic-pro-speaker'],
  ['sound stick pro',                'pinned-sound-stick-pro-speaker'],
  ['cybercart push+',                'alphard-cybercart-push-plus'],
  ['feetures elite',                 'feetures-elite-golf-max-cushion-socks'],
  ['divot board mini',               'divot-board-mini'],
  ['pxg players glove',              'pxg-players-glove'],
  ['vessel player v',                'vessel-player-v-6w-stand-bag'],
  ['clubglider meridian',            'sun-mountain-clubglider-meridian'],
  ['club traveler',                  'club-glove-club-traveler'],
  ['pioneer cart bag',               'ping-2026-pioneer-cart-bag'],
  ['m.craft osaka',                  'mizuno-mcraft-osaka-p-putter'],
  ['ultralight pro',                 'cobra-ultralight-pro-stand-bag'],
  ['chiller pro',                    'bag-boy-chiller-pro-cart-bag'],
  ['scottsdale custom',              'ping-scottsdale-custom-putter'],
  ['moonlander',                     'ping-2026-moonlander-stand-bag'],
  ['bb series custom',               'bettinardi-bb-series-custom-putter'],
  ['s2s ai-dual',                    'odyssey-s2s-ai-dual-putter'],
  ['high roller',                    'izzo-high-roller-travel-cover'],
  ['titleist gt3',                   'titleist-gt3-driver'],
  ['titleist gts3',                  'titleist-gts3-driver'],
  ['triple diamond max',             'callaway-quantum-triple-diamond-max'],
  ['triple diamond',                 'callaway-quantum-triple-diamond'],

  ['r7 quad',                        'taylormade-r7-quad-mini-driver'],
  ['quantum mini',                   'callaway-quantum-mini-spinner'],
  ['apex 26 utility',                'callaway-apex-26-utility-iron'],
  ['pro fli-hi',                     'mizuno-pro-fli-hi-utility-iron'],
  ['qi4d max lite',                  'taylormade-qi4d-max-lite-rescue'],
  ['exotics e725',                   'tour-edge-exotics-e725-driver'],
  ['titleist gt1',                   'titleist-gt1-driver'],
  ['jpx-one select',                 'mizuno-jpx-one-select-driver'],
  ['lightning max 10k',              'pxg-lightning-max-10k-driver'],
  ['titleist t150',                  'titleist-t150-black-vapor-irons'],
  ['ping i540',                      'ping-i540-irons'],
  ['ping g740',                      'ping-g740-irons'],
  ['mizuno pro m-15',                'mizuno-pro-m15-irons'],
  ['quantum max os',                 'callaway-quantum-max-os-irons'],
  ['dynapwr forged',                 'wilson-dynapwr-forged-irons'],
  ['pxg 0311xp',                     'pxg-0311xp-gen8-irons'],
  ['exotics cb',                     'tour-edge-exotics-cb-forged-irons'],
  ['scotty cameron phantom 9.2r',   'scotty-cameron-phantom-9-2r'],
  ['shot scope g6',                 'shot-scope-g6'],
  ['foresight gc3',                 'foresight-gc3'],
  ['titleist pro v1x',               'titleist-pro-v1x'],
  ['titleist pro v1',                'titleist-pro-v1'],
  ['callaway chrome tour 2026',      'callaway-chrome-tour-2026'],
  ['callaway chrome tour',           'callaway-chrome-tour-2026'],
  ['callaway supersoft',             'callaway-supersoft'],
  ['srixon soft feel',               'srixon-soft-feel'],
  ['taylormade tp5x',                'taylormade-tp5x'],
  ['taylormade tp5',                 'taylormade-tp5'],
  ['odyssey white hot',              'odyssey-white-hot-og'],
  ['scotty cameron phantom x',       'scotty-cameron-phantom-x'],
  ['scotty cameron phantom',         'scotty-cameron-phantom-x'],
  ['cleveland hb soft 2',            'cleveland-hb-soft-2'],
  ['cleveland hb soft',              'cleveland-hb-soft-2'],
  ['rapsodo mlm2pro',                'rapsodo-mlm2pro'],
  ['arccos caddie sensors',          'arccos-caddie-sensors'],
  ['arccos caddie',                  'arccos-caddie-sensors'],
  ['taylormade qi35',                'taylormade-qi35-max'],
  ['callaway paradym ai smoke max irons', 'callaway-paradym-ai-smoke-max-irons'],
  ['callaway paradym ai smoke max iron', 'callaway-paradym-ai-smoke-max-irons'],
  ['callaway paradym ai smoke max', 'callaway-paradym-ai-smoke-max'],
  ['callaway paradym ai smoke',      'callaway-paradym-ai-smoke-max'],
  ['cobra aerojet max irons',          'cobra-aerojet-max-irons'],
  ['cobra aerojet irons',              'cobra-aerojet-max-irons'],
  ['cobra aerojet',                    'cobra-aerojet-max'],
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
  ['superstroke zenergy tour',      'superstroke-zenergy-tour'],
  ['superstroke traxion',           'superstroke-traxion-grip'],
  ['superstroke zenergy',           'superstroke-zenergy-tour'],
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
  ['taylormade spider gt',           'taylormade-spider-gt'],
  ['taylormade spider 5k',          'taylormade-spider-5k-zt'],
  ['pxg allan',                     'pxg-allan-putter'],
  ['odyssey.*jailbird',             'odyssey-jailbird-zt'],
  ['odyssey tri-hot 5k',            'odyssey-tri-hot-5k'],
  ['odyssey tri-hot',               'odyssey-tri-hot-5k'],
  ['odyssey tri-beam',              'odyssey-tri-beam-arm-lock'],
  ['odyssey stroke lab',            'odyssey-stroke-lab'],
  ['odyssey two ball eleven',       'odyssey-two-ball-eleven'],
  ['odyssey two ball',              'odyssey-two-ball-eleven'],
  ['evnroll er2',                   'evnroll-er2'],
  ['ping sigma 2',                  'ping-sigma-2'],
  ['cleveland huntington beach',    'cleveland-huntington-beach'],
  ['lazrus zero',                   'lazrus-zero-torque'],
  ['spornia spg-8',                 'spornia-spg-8-xl'],
  ['vokey sm11',                    'titleist-vokey-sm11'],
  ['quantum max irons',             'callaway-quantum-max-irons'],
  ['evnroll zero z1cs',             'evnroll-z1cs'],
  ['wingman hd',                    'bushnell-wingman-hd'],
  ['approach z30',                  'garmin-approach-z30'],
  ['qi4d',                          'taylormade-qi4d-driver'],
  ['g440 max driver',               'ping-g440-max-driver-2026'],
  ['quantum max driver',            'callaway-quantum-max-driver'],
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
  'who should', 'what you sacrifice', 'what you get',
  'heavy mallet', 'fundamental difference', 'forgiveness gap',
  'match your stroke', 'skill level guide', 'when to switch',
  'the verdict',
];

let errors = 0;
let checked = 0;

for (const article of ARTICLES) {
  for (const section of (article as any).sections ?? []) {
    if (!section.affiliateKey || section.affiliateKey === '') continue;
    const h2 = (section.h2 ?? '').toLowerCase();
    if (SKIP_SUBSTRINGS.some(p => h2.includes(p))) continue;

    checked++;
    // A family can have several SKUs ('spornia spg' now matches 4 products), so a short
    // phrase can no longer identify one key. Match the LONGEST phrase present in the h2 and
    // judge against that alone — checking every match would fail the specific SKUs.
    const matches = BRAND_MAP.filter(([brand]) => h2.includes(brand))
      .sort((a, b) => b[0].length - a[0].length);
    for (const [brand, expectedKey] of matches.slice(0, 1)) {
      {
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
