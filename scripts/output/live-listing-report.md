# Live listing check — 2026-10-19

**Coverage: 20 of 175 listings actually verified (11%).**

⚠️ **LOW COVERAGE — this run proves very little.** Amazon blocked most requests; treat a clean result as unknown, not safe.

Drift threshold 10%.

| Status | Count | Meaning |
|---|---|---|
| **DEAD** | 0 | Amazon says the page is gone — the buy button goes nowhere |
| **NO_PRICE** | 1 | Listing exists but nothing is purchasable |
| **DRIFT** | 6 | Live price differs from the registry by >10% |
| OK | 13 | Priced and within tolerance |
| *could not check* | 155 | Blocked or errored — **not** a problem, just unknown |

## Needs attention

| Product | Status | Registry | Live | Drift | Note |
|---|---|---|---|---|---|
| `scotty-cameron-phantom-x` | **NO_PRICE** | ~$500 | — | — | no price in the buy box (variant-select pages land here too — eyeball before acting) |
| `adidas-ultimate365-pants` | **DRIFT** | ~$54 | $90.00 | +67% | registry says ~$54, listing says $90.00 |
| `adidas-ultimate365-polo` | **DRIFT** | ~$49 | $70.00 | +43% | registry says ~$49, listing says $70.00 |
| `alignment-sticks` | **DRIFT** | ~$12 | $9.99 | -17% | registry says ~$12, listing says $9.99 |
| `alphard-cybercart-push-plus` | **DRIFT** | $199.00 | $169.90 | -15% | registry says $199.00, listing says $169.90 |
| `kirkland-signature` | **DRIFT** | ~$22/dz | $43.78 | +99% | registry says ~$22/dz, listing says $43.78 |
| `titleist-avx` | **DRIFT** | ~$45/dz | $49.99 | +11% | registry says ~$45/dz, listing says $49.99 |

## Could not check

These told us nothing either way — Amazon blocked the request or it errored.
Re-run to retry; raise `DELAY_MS` if many appear here.

- `flightscope-mevo` — Amazon served a robot check — nothing learned, re-run later
- `precision-pro-nx9-hd` — Amazon served a robot check — nothing learned, re-run later
- `blue-tees-series-3-max` — Amazon served a robot check — nothing learned, re-run later
- `garmin-approach-z82` — Amazon served a robot check — nothing learned, re-run later
- `bushnell-pro-xe` — Amazon served a robot check — nothing learned, re-run later
- `garmin-approach-s42` — Amazon served a robot check — nothing learned, re-run later
- `shot-scope-v5` — Amazon served a robot check — nothing learned, re-run later
- `callaway-paradym-ai-smoke-max` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-qi35-max` — Amazon served a robot check — nothing learned, re-run later
- `spornia-spg-8-xl` — Amazon served a robot check — nothing learned, re-run later
- `pxg-0311xp-gen8-irons` — Amazon served a robot check — nothing learned, re-run later
- `tour-edge-exotics-cb-forged-irons` — Amazon served a robot check — nothing learned, re-run later
- `pxg-lightning-max-10k-driver` — Amazon served a robot check — nothing learned, re-run later
- `odyssey-s2s-ai-dual-putter` — Amazon served a robot check — nothing learned, re-run later
- `izzo-high-roller-travel-cover` — Amazon served a robot check — nothing learned, re-run later
- `big-max-blade-ip-2-cart` — Amazon served a robot check — nothing learned, re-run later
- `abacus-bounce-waterproof-hoodie` — Amazon served a robot check — nothing learned, re-run later
- `mileseey-genesonic-pro-speaker` — Amazon served a robot check — nothing learned, re-run later
- `pinned-sound-stick-pro-speaker` — Amazon served a robot check — nothing learned, re-run later
- `motocaddy-qb2-push-cart` — Amazon served a robot check — nothing learned, re-run later
- `feetures-elite-golf-max-cushion-socks` — Amazon served a robot check — nothing learned, re-run later
- `divot-board-mini` — Amazon served a robot check — nothing learned, re-run later
- `pxg-players-glove` — Amazon served a robot check — nothing learned, re-run later
- `mgi-e-boost-cart` — Amazon served a robot check — nothing learned, re-run later
- `arccos-air-sensors` — Amazon served a robot check — nothing learned, re-run later
- `sun-mountain-speed-cart-x` — Amazon served a robot check — nothing learned, re-run later
- `travismathew-nuage-mega-shoes` — Amazon served a robot check — nothing learned, re-run later
- `cobra-aerojet-max` — Amazon served a robot check — nothing learned, re-run later
- `titleist-pro-v1` — Amazon served a robot check — nothing learned, re-run later
- `callaway-chrome-tour-2026` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-tp5` — Amazon served a robot check — nothing learned, re-run later
- `srixon-soft-feel` — Amazon served a robot check — nothing learned, re-run later
- `vice-pro` — Amazon served a robot check — nothing learned, re-run later
- `callaway-supersoft` — Amazon served a robot check — nothing learned, re-run later
- `wilson-d9-irons` — Amazon served a robot check — nothing learned, re-run later
- `tour-edge-hot-launch-c522-irons` — Amazon served a robot check — nothing learned, re-run later
- `cobra-air-x-irons` — Amazon served a robot check — nothing learned, re-run later
- `cobra-air-x-2-irons` — Amazon served a robot check — nothing learned, re-run later
- `wilson-profile-sgi` — Amazon served a robot check — nothing learned, re-run later
- `callaway-strata` — Amazon served a robot check — nothing learned, re-run later
- `footjoy-weathersof-glove` — Amazon served a robot check — nothing learned, re-run later
- `callaway-dawn-patrol` — Amazon served a robot check — nothing learned, re-run later
- `footjoy-raingrip` — Amazon served a robot check — nothing learned, re-run later
- `arccos-caddie-sensors` — Amazon served a robot check — nothing learned, re-run later
- `rapsodo-mlm2pro` — Amazon served a robot check — nothing learned, re-run later
- `blast-motion-sensor` — Amazon served a robot check — nothing learned, re-run later
- `swing-caddie-sc4-pro` — Amazon served a robot check — nothing learned, re-run later
- `frogger-amphibian-towel` — Amazon served a robot check — nothing learned, re-run later
- `impact-tape` — Amazon served a robot check — nothing learned, re-run later
- `eyeline-putting-cup` — Amazon served a robot check — nothing learned, re-run later
- `gustbuster-umbrella` — Amazon served a robot check — nothing learned, re-run later
- `cleveland-hb-soft-2` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-spider-tour` — Amazon served a robot check — nothing learned, re-run later
- `titleist-players-4` — Amazon served a robot check — nothing learned, re-run later
- `callaway-fairway-14` — Amazon served a robot check — nothing learned, re-run later
- `footjoy-flex-xp` — Amazon served a robot check — nothing learned, re-run later
- `footjoy-tour-alpha` — Amazon served a robot check — nothing learned, re-run later
- `garmin-approach-r10` — Amazon served a robot check — nothing learned, re-run later
- `flightscope-mevo-gen2` — Amazon served a robot check — nothing learned, re-run later
- `foresight-gcquad` — Amazon served a robot check — nothing learned, re-run later
- `srixon-q-star-tour` — Amazon served a robot check — nothing learned, re-run later
- `callaway-chrome-soft` — Amazon served a robot check — nothing learned, re-run later
- `titleist-tour-speed` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-tour-response` — Amazon served a robot check — nothing learned, re-run later
- `bridgestone-e12-straight` — Amazon served a robot check — nothing learned, re-run later
- `bridgestone-e12-contact` — Amazon served a robot check — nothing learned, re-run later
- `spornia-spg-net` — Amazon served a robot check — nothing learned, re-run later
- `benq-short-throw-projector` — Amazon served a robot check — nothing learned, re-run later
- `resistance-bands-golf` — Amazon served a robot check — nothing learned, re-run later
- `putt-a-bout-putting-green` — Amazon served a robot check — nothing learned, re-run later
- `wellputt-mat` — Amazon served a robot check — nothing learned, re-run later
- `superspeed-golf-set` — Amazon served a robot check — nothing learned, re-run later
- `skechers-go-golf-elite-5` — Amazon served a robot check — nothing learned, re-run later
- `skechers-elite-vortex` — Amazon served a robot check — nothing learned, re-run later
- `ecco-biom-c4` — Amazon served a robot check — nothing learned, re-run later
- `pxg-allan-putter` — Amazon served a robot check — nothing learned, re-run later
- `lazrus-zero-torque` — Amazon served a robot check — nothing learned, re-run later
- `winn-dri-tac` — Amazon served a robot check — nothing learned, re-run later
- `superstroke-zenergy-tour` — Amazon served a robot check — nothing learned, re-run later
- `callaway-big-bertha-b21-irons` — Amazon served a robot check — nothing learned, re-run later
- `callaway-big-bertha` — Amazon served a robot check — nothing learned, re-run later
- `cleveland-huntington-beach` — Amazon served a robot check — nothing learned, re-run later
- `cobra-ds-adapt-x-driver` — Amazon served a robot check — nothing learned, re-run later
- `odyssey-tri-hot-5k` — Amazon served a robot check — nothing learned, re-run later
- `odyssey-two-ball-eleven` — Amazon served a robot check — nothing learned, re-run later
- `orange-whip-trainer` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-tp-soto` — Amazon served a robot check — nothing learned, re-run later
- `gosports-hitting-net` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-spider-gt` — Amazon served a robot check — nothing learned, re-run later
- `tour-striker-smart-ball` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-noodle` — Amazon served a robot check — nothing learned, re-run later
- `wilson-duo-soft-plus` — Amazon served a robot check — nothing learned, re-run later
- `vice-drive` — Amazon served a robot check — nothing learned, re-run later
- `vice-pro-soft` — Amazon served a robot check — nothing learned, re-run later
- `titleist-tour-soft` — Amazon served a robot check — nothing learned, re-run later
- `titleist-velocity` — Amazon served a robot check — nothing learned, re-run later
- `callaway-warbird` — Amazon served a robot check — nothing learned, re-run later
- `bridgestone-tour-b-rx` — Amazon served a robot check — nothing learned, re-run later
- `srixon-z-star` — Amazon served a robot check — nothing learned, re-run later
- `bridgestone-tour-b-xs` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-tp5x` — Amazon served a robot check — nothing learned, re-run later
- `bridgestone-tour-b-x` — Amazon served a robot check — nothing learned, re-run later
- `srixon-z-star-xv` — Amazon served a robot check — nothing learned, re-run later
- `amazon-basics-core-soft` — Amazon served a robot check — nothing learned, re-run later
- `wilson-chaos` — Amazon served a robot check — nothing learned, re-run later
- `pinnacle-rush` — Amazon served a robot check — nothing learned, re-run later
- `odyssey-dfx` — Amazon served a robot check — nothing learned, re-run later
- `pinemeadow-pgx` — Amazon served a robot check — nothing learned, re-run later
- `wilson-staff-infinite` — Amazon served a robot check — nothing learned, re-run later
- `flightscope-mevo-plus` — Amazon served a robot check — nothing learned, re-run later
- `garmin-approach-s12` — Amazon served a robot check — nothing learned, re-run later
- `sklz-golf-grip-trainer` — Amazon served a robot check — nothing learned, re-run later
- `voice-caddie-sc200plus` — Amazon served a robot check — nothing learned, re-run later
- `shot-scope-lm1` — Amazon served a robot check — nothing learned, re-run later
- `kvv-electric-golf-cart` — Amazon served a robot check — nothing learned, re-run later
- `alphard-cybercart` — Amazon served a robot check — nothing learned, re-run later
- `kvv-push-cart` — Amazon served a robot check — nothing learned, re-run later
- `clicgear-model-45` — Amazon served a robot check — nothing learned, re-run later
- `golf-pride-z-grip` — Amazon served a robot check — nothing learned, re-run later
- `country-club-elite-mat` — Amazon served a robot check — nothing learned, re-run later
- `homecourse-retractable-screen` — Amazon served a robot check — nothing learned, re-run later
- `optoma-zw350st` — Amazon served a robot check — nothing learned, re-run later
- `optoma-gt2000hdr` — Amazon served a robot check — nothing learned, re-run later
- `bag-boy-volt-electric` — Amazon served a robot check — nothing learned, re-run later
- `mgi-zip-navigator` — Amazon served a robot check — nothing learned, re-run later
- `galvin-green-rain-jacket` — Amazon served a robot check — nothing learned, re-run later
- `oakley-prizm-golf` — Amazon served a robot check — nothing learned, re-run later
- `tifosi-seek-fc` — Amazon served a robot check — nothing learned, re-run later
- `cleveland-launcher-xl-senior` — Amazon served a robot check — nothing learned, re-run later
- `nikon-coolshot-50i` — Amazon served a robot check — nothing learned, re-run later
- `callaway-300-pro` — Amazon served a robot check — nothing learned, re-run later
- `garmin-approach-s70` — Amazon served a robot check — nothing learned, re-run later
- `titleist-gt2-driver` — Amazon served a robot check — nothing learned, re-run later
- `taylormade-sim2-max` — Amazon served a robot check — nothing learned, re-run later
- `cleveland-launcher-xl2-driver` — Amazon served a robot check — nothing learned, re-run later
- `apple-watch-ultra-golf` — Amazon served a robot check — nothing learned, re-run later
- `spornia-spg-7` — Amazon served a robot check — nothing learned, re-run later
- `callaway-paradym-hybrid` — Amazon served a robot check — nothing learned, re-run later
- `nike-dri-fit-victory-polo` — Amazon served a robot check — nothing learned, re-run later
- `titleist-tour-performance-hat` — Amazon served a robot check — nothing learned, re-run later
- `maui-jim-banyans-golf` — Amazon served a robot check — nothing learned, re-run later
- `under-armour-forefront-rain-jacket` — Amazon served a robot check — nothing learned, re-run later
- `club-glove-microfiber-towel` — Amazon served a robot check — nothing learned, re-run later
- `callaway-org-14-cart-bag` — Amazon served a robot check — nothing learned, re-run later
- `ogio-fuse-stand-bag` — Amazon served a robot check — nothing learned, re-run later
- `tour-edge-hot-launch-max-driver` — Amazon served a robot check — nothing learned, re-run later
- `bushnell-pro-x3` — Amazon served a robot check — nothing learned, re-run later
- `bushnell-wingman-mini` — Amazon served a robot check — nothing learned, re-run later
- `bushnell-wingman-2` — Amazon served a robot check — nothing learned, re-run later
- `bushnell-wingman-view` — Amazon served a robot check — nothing learned, re-run later
- `blue-tees-player-pro` — Amazon served a robot check — nothing learned, re-run later
- `golfbuddy-voice-2s-plus` — Amazon served a robot check — nothing learned, re-run later
- `turtlebox-ranger` — Amazon served a robot check — nothing learned, re-run later
- `turtlebox-original-gen3` — Amazon served a robot check — nothing learned, re-run later
- `wilson-dynapower-irons` — Amazon served a robot check — nothing learned, re-run later
