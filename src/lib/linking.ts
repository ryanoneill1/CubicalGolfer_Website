// src/lib/linking.ts — v2.0 April 2026
// ─────────────────────────────────────────────────────────────────────────────
// Internal linking engine. Fixes in v2.0:
//   - 7 orphaned pages now receive category anchor links
//   - Topical cluster links: rangefinder cluster, GPS cluster, beginner cluster
//   - Keyword-matched contextual anchors per article ID
//   - Limit raised to 5 (was 4) for richer related sections
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, RelatedLink } from '../data/types';
import { ARTICLES } from '../data/articles';

// ── Category anchors: always injected into every article in that category ─────
const CATEGORY_ANCHORS: Record<string, Array<{ slug: string; label: string }>> = {
  'gear-reviews': [
    { slug: '/best-golf-rangefinders-2026/',      label: 'Best Golf Rangefinders 2026' },
    { slug: '/best-golf-gps-watches/',             label: 'Best Golf GPS Watches 2026' },
    { slug: '/best-golf-irons-2026/',              label: 'Best Golf Irons 2026' },
    { slug: '/compare/callaway-paradym-vs-taylormade-qi35/', label: 'Qi35 vs Paradym — 2026 Driver Comparison' },
    { slug: '/compare/',                           label: 'Compare Golf Products Head-to-Head' },
    { slug: '/best-golf-gear-under-100/',          label: 'Best Golf Gear Under $100' },
    { slug: '/best-putters-shaky-hands-older-golfers/', label: 'Putters for Shaky Hands' },
    { slug: '/how-to-buy-wedges-4-degree-rule/',   label: 'How to Buy Wedges' },
    { slug: '/when-to-replace-wedges-grooves/',    label: 'When to Replace Wedges' },
    { slug: '/when-to-replace-golf-grips/',        label: 'When to Replace Grips' },
  ],
  'golf-tech': [
    { slug: '/best-golf-gps-watches/',             label: 'Best Golf GPS Watches 2026' },
    { slug: '/best-golf-launch-monitors-2026/',    label: 'Best Golf Launch Monitors 2026' },
    { slug: '/best-golf-apps/',  label: 'Best Golf Apps' },
    { slug: '/compare/skytrak-vs-garmin-r10/',     label: 'SkyTrak+ vs Garmin R10' },
    { slug: '/apartment-golf-simulator-setup/',    label: 'Apartment Simulator Setup Guide' },
    { slug: '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/', label: 'MLM2PRO vs R50 vs Square Golf' },
    { slug: '/best-budget-launch-monitor-apartment/', label: 'Best Budget Launch Monitor Under $700' },
    { slug: '/best-golf-hitting-net-apartment-garage/', label: 'Best Golf Hitting Nets' },
  ],
  'golf-accessories': [
    { slug: '/25-golf-accessories-every-golfer-should-own/', label: '25 Golf Accessories Every Golfer Needs' },
    { slug: '/best-golf-accessories-under-50/',              label: 'Best Golf Accessories Under $50' },
    { slug: '/best-golf-gifts-for-him/',                     label: 'Best Golf Gifts for Him' },
    { slug: '/best-golf-gear-under-100/',                    label: 'Best Golf Gear Under $100' },
  ],
  'improve-game': [
    { slug: '/how-to-break-90/',                     label: 'How to Break 90 This Season' },
    { slug: '/how-to-fix-your-slice/',               label: 'How to Fix Your Slice' },
    { slug: '/average-golf-handicap/',               label: 'Average Golf Handicap 2026' },
    { slug: '/golf-practice-drills-at-home/',        label: '7 Practice Drills at Home (15 Min)' },
    { slug: '/golf-practice-routine-before-work/',   label: '15-Min Morning Practice Routine' },
    { slug: '/how-i-dropped-5-strokes-arccos-mlm2pro/', label: 'How I Dropped 5 Strokes With Data' },
    { slug: '/desk-exercises-fix-golf-slice/',       label: 'Desk Exercises That Fix Your Slice' },
    { slug: '/approach-wedge-vs-gap-wedge-do-you-need-it/', label: 'Approach Wedge vs Gap Wedge' },
    { slug: '/how-to-buy-wedges-4-degree-rule/',   label: 'How to Buy Wedges' },
    { slug: '/when-to-replace-wedges-grooves/',    label: 'When to Replace Wedges' },
    { slug: '/when-to-replace-golf-grips/',        label: 'When to Replace Grips' },
  ],
  'golf-lifestyle': [
    { slug: '/golf-for-beginners/',              label: 'Golf for Beginners — Complete Guide' },
    { slug: '/best-golf-gifts-for-him/',         label: 'Best Golf Gifts for Him' },
    { slug: '/golf-course-etiquette/',           label: 'Golf Course Etiquette Guide' },
    { slug: '/golf-desk-accessories-office/',    label: 'Best Golf Desk Accessories' },
    { slug: '/best-rain-gear-midwest-golfers/',  label: 'Best Rain Gear for Midwest Golfers' },
    { slug: '/courses/chicago-il/',              label: 'Best Golf Courses in Chicago' },
    { slug: '/gear-quiz/',                       label: 'Golf Gear Quiz — Find Your Fit' },
    { slug: '/office-to-golf-course-playbook/',  label: 'Cubicle-to-Course Playbook' },
    { slug: '/gifts-for-golfer-who-never-keeps-anything/', label: 'Gift Detective Guide' },
  ],
};

// ── Topical cluster links: article-specific high-value cross-links ────────────
// Fixes orphaned pages by giving them specific inbound paths
const ARTICLE_ANCHORS: Record<string, Array<{ slug: string; label: string }>> = {

  // ── Rangefinder cluster: every rangefinder page links to the others ──────────
  'rangefinders': [
    { slug: '/bushnell-tour-v6-shift-review/',  label: 'Bushnell Tour V6 Shift Review (40 Rounds)' },
    { slug: '/best-golf-rangefinder-under-200/', label: 'Best Rangefinders Under $200' },
    { slug: '/do-i-need-slope-on-rangefinder/',  label: 'Do I Need Slope on a Rangefinder?' },
    { slug: '/best-golf-rangefinder-for-seniors/', label: 'Best Rangefinders for Seniors' },
    { slug: '/compare/bushnell-tour-v6-vs-precision-pro-nx9/', label: 'Bushnell Tour V6 vs Precision Pro NX9' },
    { slug: '/compare/blue-tees-vs-bushnell-tour-v6/', label: 'Blue Tees vs Bushnell Tour V6' },
  ],
  'bushnell-v6-review': [
    { slug: '/best-golf-rangefinders-2026/',      label: 'Best Golf Rangefinders 2026 (All 11 Tested)' },
    { slug: '/bushnell-vs-garmin-rangefinder/',    label: 'Bushnell vs Garmin Rangefinder' },
    { slug: '/do-i-need-slope-on-rangefinder/',    label: 'Do I Need Slope on a Rangefinder?' },
    { slug: '/best-golf-rangefinder-under-200/',   label: 'Best Rangefinders Under $200' },
  ],
  'rangefinder-worth-it': [
    { slug: '/best-golf-rangefinders-2026/',      label: 'Best Golf Rangefinders 2026' },
    { slug: '/do-i-need-slope-on-rangefinder/',   label: 'Do I Need Slope? (Answered)' },
    { slug: '/golf-rangefinder-vs-gps-watch/',    label: 'Rangefinder vs GPS Watch' },
  ],
  'rangefinder-beginners': [
    { slug: '/do-i-need-slope-on-rangefinder/',   label: 'Do I Need Slope on My Rangefinder?' },
    { slug: '/how-to-use-golf-rangefinder/',      label: 'How to Use a Golf Rangefinder' },
    { slug: '/best-golf-rangefinder-under-200/',  label: 'Best Rangefinders Under $200' },
  ],
  'rangefinder-under-200': [
    { slug: '/best-golf-rangefinder-under-200/', label: 'Best Rangefinder Under $200' },
    { slug: '/blue-tees-vs-bushnell-rangefinder/', label: 'Blue Tees vs Bushnell' },
    { slug: '/best-golf-rangefinder-for-seniors/', label: 'Best Rangefinder for Seniors' },
  ],
  'bushnell-vs-garmin': [
    { slug: '/blue-tees-vs-bushnell-rangefinder/', label: 'Blue Tees vs Bushnell Comparison' },
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
    { slug: '/is-a-rangefinder-worth-it/',          label: 'Is a Rangefinder Worth It?' },
  ],
  'rangefinder-vs-gps': [
    { slug: '/best-golf-gps-watches/',              label: 'Best Golf GPS Watches 2026' },
    { slug: '/best-golf-gps-watch-under-200/',      label: 'Best GPS Watch Under $200' },
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
  ],
  'how-to-use-rangefinder': [
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
    { slug: '/do-i-need-slope-on-rangefinder/',     label: 'Do I Need Slope Mode?' },
    { slug: '/is-a-rangefinder-worth-it/',          label: 'Is a Rangefinder Worth It?' },
  ],
  'what-is-slope': [
    { slug: '/do-i-need-slope-on-rangefinder/',     label: 'Do You Actually Need Slope?' },
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Rangefinders with Slope 2026' },
    { slug: '/how-to-use-golf-rangefinder/',        label: 'How to Use a Rangefinder' },
  ],
  'blue-tees-vs-bushnell-rangefinder': [
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
    { slug: '/best-golf-rangefinder-under-200/',    label: 'Best Rangefinders Under $200' },
    { slug: '/do-i-need-slope-on-rangefinder/',     label: 'Do I Need Slope Mode?' },
  ],

  // ── GPS Watch cluster ─────────────────────────────────────────────────────────
  'gps-watches': [
    { slug: '/garmin-approach-s62-review/',          label: 'Garmin S62 Review — 30 Rounds Later' },
    { slug: '/best-golf-gps-watch-under-200/',      label: 'Best GPS Watch Under $200' },
    { slug: '/best-gps-golf-watch-high-handicappers/', label: 'Best GPS Watch for High Handicappers' },
    { slug: '/golf-rangefinder-vs-gps-watch/',      label: 'Rangefinder vs GPS Watch' },
    { slug: '/compare/garmin-approach-s62-vs-shot-scope-v5/', label: 'Garmin S62 vs Shot Scope V5' },
    { slug: '/compare/garmin-approach-s62-vs-s42/', label: 'Garmin S62 vs S42 GPS Watch' },
    { slug: '/compare/garmin-s12-vs-bushnell-ion-elite/', label: 'Garmin S12 vs Bushnell Ion Elite' },
  ],
  'garmin-s62-review': [
    { slug: '/best-golf-gps-watches/',              label: 'Best Golf GPS Watches 2026' },
    { slug: '/golf-rangefinder-vs-gps-watch/',      label: 'Rangefinder vs GPS Watch' },
    { slug: '/best-golf-gps-watch-under-200/',      label: 'Best GPS Watch Under $200' },
    { slug: '/best-golf-apps/',                     label: 'Best Golf Apps 2026' },
  ],
  'gps-watch-high-handicapper': [
    { slug: '/best-golf-gps-watch-under-200/',      label: 'Best Golf GPS Watch Under $200' },
    { slug: '/best-golf-gps-watches/',              label: 'Best Golf GPS Watches 2026' },
    { slug: '/golf-rangefinder-vs-gps-watch/',      label: 'Rangefinder vs GPS Watch — Which to Buy' },
  ],
  'best-golf-gps-watch-under-200': [
    { slug: '/best-golf-gps-watches/',              label: 'Best Golf GPS Watches 2026' },
    { slug: '/golf-rangefinder-vs-gps-watch/',      label: 'Rangefinder vs GPS Watch' },
    { slug: '/best-gps-golf-watch-high-handicappers/', label: 'Best GPS Watch for High Handicappers' },
  ],

  // ── Ball cluster ──────────────────────────────────────────────────────────────
  'golf-balls': [
    { slug: '/compare/callaway-paradym-vs-taylormade-qi35/', label: 'Qi35 vs Paradym — Best Driver 2026' },
    { slug: '/golf-ball-compression-chart/',        label: 'Golf Ball Compression Chart 2026' },
    { slug: '/best-golf-drivers-forgiveness/',       label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
  ],
  'golf-ball-compression': [
    { slug: '/compare/callaway-paradym-vs-taylormade-qi35/', label: 'Qi35 Max vs Paradym — 2026 Driver Showdown' },
    { slug: '/best-golf-drivers-forgiveness/',       label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors 2026' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
    { slug: '/what-golf-ball-for-high-handicapper/', label: 'Best Ball for High Handicappers' },
  ],
  'golf-balls-slow-swing': [
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
    { slug: '/golf-ball-compression-chart/',        label: 'Golf Ball Compression Chart 2026' },
    { slug: '/what-golf-ball-for-high-handicapper/', label: 'Best Ball for High Handicappers' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
  ],
  'what-golf-ball-high-handicapper': [
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/golf-ball-compression-chart/',        label: 'Golf Ball Compression Chart' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
  ],
  'golf-balls-90-mph': [
    { slug: '/best-golf-balls-2026/',               label: 'Best Golf Balls 2026 (All Speeds)' },
    { slug: '/golf-ball-compression-chart/',        label: 'Golf Ball Compression Chart' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/titleist-pro-v1-vs-pro-v1x/',        label: 'Pro V1 vs Pro V1x Comparison' },
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026' },
  ],

  // ── Fix previously orphaned pages ─────────────────────────────────────────────
  'golf-apps-handicap': [
    { slug: '/best-golf-apps/',                     label: 'Best Golf Apps 2026' },
    { slug: '/average-golf-handicap/',              label: 'Average Golf Handicap' },
    { slug: '/best-golf-swing-analyzers/',          label: 'Best Golf Swing Analyzers' },
  ],
  'golf-course-etiquette': [
    { slug: '/golf-tips-for-beginners/',            label: 'Golf Tips for Beginners' },
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners Guide' },
    { slug: '/average-golf-handicap/',              label: 'Average Golf Handicap 2026' },
  ],
  'best-golf-gloves-men': [
    { slug: '/best-golf-gloves-hot-weather/',       label: 'Best Golf Gloves for Hot Weather' },
    { slug: '/best-golf-accessories-under-50/',     label: 'Best Golf Accessories Under $50' },
    { slug: '/25-golf-accessories-every-golfer-should-own/', label: '25 Golf Accessories Every Golfer Needs' },
  ],
  'handicap': [
    { slug: '/average-golf-handicap/', label: 'Average Golf Handicap' },
    { slug: '/how-to-lower-golf-handicap/',         label: 'How to Lower Your Golf Handicap' },
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners Guide' },
  ],
  'handicap-weekend-golfer': [
    { slug: '/average-golf-handicap/',              label: 'Average Golf Handicap 2026' },
    { slug: '/how-to-lower-golf-handicap/',         label: 'How to Lower Your Golf Handicap' },
    { slug: '/how-to-break-90/',                    label: 'How to Break 90' },
  ],
  'how-far-average-golfer-hit-7-iron': [
    { slug: '/best-golf-irons-2026/',               label: 'Best Golf Irons 2026' },
    { slug: '/how-to-break-90/',                    label: 'How to Break 90' },
    { slug: '/best-golf-irons-high-handicapper/',   label: 'Best Irons for High Handicappers' },
  ],

  // ── Beginner cluster ──────────────────────────────────────────────────────────
  'golf-for-beginners-hub': [
    { slug: '/best-beginner-golf-set-under-500/', label: 'Best Beginner Golf Set Under $500' },
    { slug: '/how-to-fix-your-slice/',              label: 'How to Fix Your Slice' },
    { slug: '/golf-course-etiquette/',             label: 'Golf Course Etiquette Guide' },
  ],
  'tips-beginners': [
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners — Complete Guide' },
    { slug: '/golf-course-etiquette/',              label: 'Golf Course Etiquette' },
    { slug: '/best-beginner-golf-set-under-500/', label: 'Best Beginner Golf Set Under $500' },
  ],
  'beginner-sets': [
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners — Start Here' },
    { slug: '/golf-tips-for-beginners/',            label: 'Golf Tips for Beginners' },
    { slug: '/golf-course-etiquette/',              label: 'Golf Course Etiquette Guide' },
    { slug: '/best-beginner-golf-set-under-500/',   label: 'Best Beginner Set Under $500' },
    { slug: '/best-golf-gear-under-100/',           label: 'Best Golf Gear Under $100' },
  ],

  // ── Improvement cluster ───────────────────────────────────────────────────────
  'fix-slice': [
    { slug: '/why-does-my-golf-ball-go-right/',     label: 'Why Does My Golf Ball Go Right?' },
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners — Complete Guide' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids 2026' },
  ],
  'break-90': [
    { slug: '/how-to-stop-3-putting/',              label: 'How to Stop 3-Putting' },
    { slug: '/how-to-fix-your-slice/',              label: 'How to Fix Your Slice' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids 2026' },
    { slug: '/golf-practice-drills-at-home/',       label: '7 Practice Drills at Home (15 Min)' },
    { slug: '/golf-practice-routine-before-work/',  label: '15-Min Morning Practice Routine' },
  ],
  'improve-putting': [
    { slug: '/how-to-stop-3-putting/',              label: 'How to Stop 3-Putting' },
    { slug: '/best-golf-putters-2026/',             label: 'Best Golf Putters 2026' },
    { slug: '/best-putter-high-handicapper/',       label: 'Best Putter for High Handicappers' },
    { slug: '/golf-practice-drills-at-home/',       label: '7 Practice Drills at Home (15 Min)' },
  ],
  'how-to-stop-3-putting': [
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/best-golf-putters-2026/',             label: 'Best Golf Putters 2026' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids' },
    { slug: '/golf-practice-drills-at-home/',       label: '7 Practice Drills at Home (15 Min)' },
  ],
  'why-does-my-golf-ball-go-right': [
    { slug: '/how-to-fix-your-slice/',              label: 'Full Slice Fix Guide' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids 2026' },
    { slug: '/best-golf-drivers-forgiveness/',      label: 'Best Forgiving Drivers 2026' },
  ],
  'why-do-i-hit-irons-fat': [
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids 2026' },
    { slug: '/best-golf-irons-2026/',               label: 'Best Golf Irons 2026' },
    { slug: '/how-to-break-90/',                    label: 'How to Break 90' },
  ],
  'how-to-stop-topping': [
    { slug: '/how-to-fix-your-slice/',              label: 'How to Fix Your Slice' },
    { slug: '/why-do-i-hit-irons-fat/',             label: 'Why Do I Hit My Irons Fat?' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids' },
  ],
  'how-to-chip': [
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/how-to-stop-3-putting/',              label: 'How to Stop 3-Putting' },
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids' },
  ],
  'how-to-practice-at-home': [
    { slug: '/best-golf-training-aids/',            label: 'Best Golf Training Aids 2026' },
    { slug: '/best-indoor-golf-net-setup/',         label: 'Best Indoor Golf Net Setup' },
    { slug: '/best-golf-simulator-small-spaces/',   label: 'Best Golf Simulators for Small Spaces' },
  ],

  // ── Seniors cluster ───────────────────────────────────────────────────────────
  'best-golf-rangefinder-seniors': [
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
    { slug: '/best-golf-irons-for-seniors/',        label: 'Best Golf Irons for Seniors' },
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
  ],
  'best-golf-balls-seniors': [
    { slug: '/best-golf-rangefinder-for-seniors/',  label: 'Best Rangefinder for Seniors' },
    { slug: '/best-golf-irons-for-seniors/',        label: 'Best Golf Irons for Seniors' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
  ],
  'best-golf-irons-seniors': [
    { slug: '/best-golf-rangefinder-for-seniors/',  label: 'Best Rangefinder for Seniors' },
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
    { slug: '/best-golf-irons-high-handicapper/',   label: 'Best Irons for High Handicappers' },
  ],

  // ── Bags cluster ───────────────────────────────────────────────────────────
  'golf-bags': [
    { slug: '/best-golf-bags-2026/',                label: 'Best Golf Bags 2026' },
    { slug: '/best-golf-accessories-under-50/',     label: 'Best Accessories Under $50' },
    { slug: '/best-golf-shoes-for-walking/',        label: 'Best Shoes for Walking' },
  ],

  // ── Balls cluster ──────────────────────────────────────────────────────────
  'golf-balls-2026': [
    { slug: '/titleist-pro-v1-vs-pro-v1x/',         label: 'Pro V1 vs Pro V1x Comparison' },
    { slug: '/golf-ball-compression-chart/',         label: 'Golf Ball Compression Chart' },
    { slug: '/best-golf-balls-for-seniors/',         label: 'Best Golf Balls for Seniors' },
  ],

  // ── Drivers cluster ────────────────────────────────────────────────────────
  'drivers-under-200': [
    { slug: '/best-golf-drivers-forgiveness/',       label: 'Best Forgiving Drivers 2026' },
    { slug: '/how-to-fix-your-slice/',               label: 'How to Fix Your Slice' },
    { slug: '/best-beginner-golf-set-under-500/', label: 'Best Beginner Golf Set Under $500' },
  ],

  // ── Shoes cluster ──────────────────────────────────────────────────────────
  'golf-shoes-walking': [
    { slug: '/best-golf-accessories-under-50/',      label: 'Best Accessories Under $50' },
    { slug: '/best-golf-bags-2026/',                 label: 'Best Golf Bags 2026' },
    { slug: '/golf-fitness-office-golfer/',           label: 'Golf Fitness for Office Workers' },
  ],

  // ── Putters cluster ────────────────────────────────────────────────────────
  'golf-putters': [
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/how-to-stop-3-putting/',               label: 'How to Stop 3-Putting' },
    { slug: '/best-putter-high-handicapper/',         label: 'Best Putter for High Handicappers' },
  ],

  // ── Simulator cluster ──────────────────────────────────────────────────────
  'golf-simulator-small-spaces': [
    { slug: '/skytrak-vs-mevo-plus/',                label: 'SkyTrak+ vs Mevo+ Comparison' },
    { slug: '/how-to-build-garage-golf-simulator/',  label: 'Build a Garage Simulator' },
    { slug: '/best-indoor-golf-net-setup/',           label: 'Best Indoor Golf Net Setup' },
  ],
  'skytrak-vs-mevo': [
    { slug: '/best-golf-simulator-small-spaces/',    label: 'Best Simulators for Small Spaces' },
    { slug: '/best-ai-golf-training-tools/',         label: 'Best AI Golf Training Tools' },
    { slug: '/how-to-build-garage-golf-simulator/',  label: 'Build a Garage Simulator' },
  ],

  // ── Comparison cluster ─────────────────────────────────────────────────────
  'pro-v1-vs-pro-v1x': [
    { slug: '/best-golf-balls-2026/',                label: 'Best Golf Balls 2026' },
    { slug: '/golf-ball-compression-chart/',         label: 'Golf Ball Compression Chart' },
    { slug: '/what-golf-ball-for-high-handicapper/', label: 'Best Ball for High Handicappers' },
  ],

  // ── Launch monitor cluster ─────────────────────────────────────────────────
  'launch-monitors': [
    { slug: '/rapsodo-mlm2pro-review/',              label: 'Rapsodo MLM2PRO Review — 6 Months' },
    { slug: '/trackman-vs-foresight-gcquad/',         label: 'Trackman 4 vs Foresight GCQuad' },
    { slug: '/best-golf-simulator-small-spaces/',    label: 'Best Golf Simulators for Small Spaces' },
    { slug: '/skytrak-vs-mevo-plus/',                label: 'SkyTrak+ vs Mevo+ Comparison' },
    { slug: '/best-golf-swing-analyzers/',           label: 'Best Golf Swing Analyzers 2026' },
  ],
  'rapsodo-mlm2pro-review': [
    { slug: '/best-golf-launch-monitors-2026/',      label: 'Best Launch Monitors 2026' },
    { slug: '/skytrak-vs-mevo-plus/',                label: 'SkyTrak+ vs Mevo+' },
    { slug: '/how-to-build-garage-golf-simulator/',  label: 'Build a Golf Simulator' },
  ],
  'paradym-driver-review': [
    { slug: '/best-golf-drivers-forgiveness/',        label: 'Best Forgiving Drivers 2026' },
    { slug: '/compare/callaway-paradym-vs-taylormade-qi35/', label: 'Qi35 vs Paradym Comparison' },
    { slug: '/best-golf-balls-2026/',                label: 'Best Golf Balls 2026 by Swing Speed' },
    { slug: '/golf-ball-compression-chart/',          label: 'Golf Ball Compression Chart 2026' },
    { slug: '/how-to-fix-your-slice/',               label: 'Fix Your Slice' },
    { slug: '/best-golf-irons-2026/',                label: 'Best Irons 2026' },
  ],
  'pro-v1-review': [
    { slug: '/best-golf-balls-2026/',                label: 'Best Golf Balls 2026' },
    { slug: '/titleist-pro-v1-vs-pro-v1x/',          label: 'Pro V1 vs Pro V1x' },
    { slug: '/golf-ball-compression-chart/',          label: 'Compression Chart' },
  ],
  'arccos-caddie-review': [
    { slug: '/best-golf-swing-analyzers/',           label: 'Best Swing Analyzers 2026' },
    { slug: '/best-golf-apps/',                      label: 'Best Golf Apps 2026' },
    { slug: '/garmin-approach-s62-review/',           label: 'Garmin S62 Review' },
  ],
  'precision-pro-nx9-review': [
    { slug: '/best-golf-rangefinders-2026/',          label: 'Best Rangefinders 2026' },
    { slug: '/bushnell-tour-v6-shift-review/',        label: 'Bushnell V6 Review' },
    { slug: '/best-golf-rangefinder-under-200/',      label: 'Best Under $200' },
  ],
  'trackman-vs-foresight': [
    { slug: '/best-golf-launch-monitors-2026/',      label: 'Best Golf Launch Monitors 2026' },
    { slug: '/best-golf-simulator-small-spaces/',    label: 'Best Golf Simulators for Small Spaces' },
    { slug: '/skytrak-vs-mevo-plus/',                label: 'SkyTrak+ vs Mevo+ Comparison' },
  ],
  'gear-under-100': [
    { slug: '/best-golf-accessories-under-50/',      label: 'Best Golf Accessories Under $50' },
    { slug: '/best-golf-gifts-for-him/',             label: 'Best Golf Gifts for Him' },
    { slug: '/best-beginner-golf-set-under-500/',    label: 'Best Beginner Set Under $500' },
    { slug: '/golf-desk-accessories-office/',        label: 'Best Golf Desk Accessories' },
  ],
  'practice-drills-home': [
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/how-to-stop-3-putting/',               label: 'How to Stop 3-Putting' },
    { slug: '/how-to-practice-golf-at-home/',        label: 'How to Practice Golf at Home' },
    { slug: '/best-golf-gear-under-100/',            label: 'Best Golf Gear Under $100' },
    { slug: '/golf-practice-routine-before-work/',   label: '15-Min Morning Practice Routine' },
  ],
  'morning-practice-routine': [
    { slug: '/golf-practice-drills-at-home/',        label: '7 Practice Drills at Home (15 Min)' },
    { slug: '/how-to-practice-golf-at-home/',        label: 'How to Practice Golf at Home' },
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/golf-fitness-office-golfer/',           label: 'Golf Fitness for Office Workers' },
    { slug: '/how-to-break-90/',                     label: 'How to Break 90 This Season' },
  ],
  'beginner-set-under-500': [
    { slug: '/best-beginner-golf-set-under-500/', label: 'Best Beginner Golf Set Under $500' },
    { slug: '/golf-for-beginners/',                  label: 'Golf for Beginners Guide' },
    { slug: '/best-golf-irons-high-handicapper/',    label: 'Best Irons for High Handicappers' },
    { slug: '/best-golf-gear-under-100/',            label: 'Best Golf Gear Under $100' },
  ],
  'golf-desk-accessories': [
    { slug: '/office-hacks/',                        label: 'Office Hacks Hub' },
    { slug: '/best-golf-gifts-for-him/',             label: 'Best Golf Gifts for Him' },
    { slug: '/best-golf-accessories-under-50/',      label: 'Best Accessories Under $50' },
    { slug: '/golf-practice-drills-at-home/',        label: '7 Practice Drills at Home' },
    { slug: '/best-golf-gear-under-100/',            label: 'Best Golf Gear Under $100' },
  ],
  'garmin-s62-vs-apple-watch': [
    { slug: '/garmin-approach-s62-review/', label: 'Garmin S62 Review' },
    { slug: '/best-golf-gps-watches/', label: 'Best GPS Watches 2026' },
    { slug: '/best-golf-apps/', label: 'Best Golf Apps' },
  ],
  'bushnell-v6-vs-nx9': [
    { slug: '/bushnell-tour-v6-shift-review/', label: 'Bushnell V6 Review' },
    { slug: '/precision-pro-nx9-review/', label: 'NX9 HD Review' },
    { slug: '/best-golf-rangefinders-2026/', label: 'Best Rangefinders 2026' },
  ],
  'arccos-vs-garmin-tracking': [
    { slug: '/arccos-caddie-review/', label: 'Arccos Review' },
    { slug: '/garmin-approach-s62-review/', label: 'Garmin S62 Review' },
    { slug: '/best-golf-swing-analyzers/', label: 'Best Swing Analyzers' },
  ],
  'pro-v1-vs-chrome-soft': [
    { slug: '/titleist-pro-v1-review/', label: 'Pro V1 Review' },
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026' },
    { slug: '/golf-ball-compression-chart/', label: 'Compression Chart' },
  ],
  'rapsodo-vs-garmin-r10': [
    { slug: '/rapsodo-mlm2pro-review/', label: 'Rapsodo MLM2PRO Review' },
    { slug: '/best-golf-launch-monitors-2026/', label: 'Best Launch Monitors' },
    { slug: '/how-to-build-garage-golf-simulator/', label: 'Build a Simulator' },
  ],
  'clubs-20-handicap': [
    { slug: '/best-golf-irons-2026/', label: 'Best Irons 2026' },
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers' },
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
  ],
  'ball-15-handicap': [
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026' },
    { slug: '/golf-ball-compression-chart/', label: 'Golf Ball Compression Chart' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 mph' },
  ],
  'driver-high-handicapper': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/callaway-paradym-ai-smoke-max-review/', label: 'Paradym Review' },
    { slug: '/compare/callaway-paradym-vs-taylormade-qi35/', label: 'Qi35 vs Paradym — 2026 Driver Showdown' },
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026 by Swing Speed' },
    { slug: '/how-to-fix-your-slice/', label: 'Fix Your Slice' },
    { slug: '/best-golf-clubs-20-handicap/', label: 'Best Clubs for 20 Handicap' },
  ],
  'budget-launch-monitors': [
    { slug: '/rapsodo-mlm2pro-review/', label: 'Rapsodo MLM2PRO Review' },
    { slug: '/rapsodo-vs-garmin-r10/', label: 'Rapsodo vs Garmin R10' },
    { slug: '/best-golf-launch-monitors-2026/', label: 'Best Launch Monitors 2026' },
  ],
  'swing-analyzer-iphone': [
    { slug: '/arccos-caddie-review/', label: 'Arccos Caddie Review' },
    { slug: '/best-golf-swing-analyzers/', label: 'Best Swing Analyzers 2026' },
    { slug: '/best-golf-apps/', label: 'Best Golf Apps' },
  ],
  'training-aids-home': [
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
    { slug: '/best-golf-swing-analyzers/', label: 'Best Swing Analyzers' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
  ],
  // ── Gift guides + youth golf clusters ─────────────────────────────────────
  'golf-gifts-dad-under-100': [
    { slug: '/best-golf-gifts-under-50/', label: 'Best Golf Gifts Under $50' },
    { slug: '/best-christmas-golf-gifts/', label: 'Christmas Golf Gift Guide' },
    { slug: '/best-golf-gifts-for-mom/', label: 'Golf Gifts for Mom' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026' },
  ],
  'junior-golf-clubs-guide': [
    { slug: '/how-to-get-your-kid-into-golf/', label: 'How to Get Your Kid Into Golf' },
    { slug: '/best-golf-gifts-for-dad/', label: 'Golf Gifts for Dad' },
    { slug: '/golf-for-beginners/', label: 'Golf for Beginners Guide' },
  ],
  'golf-gifts-under-50': [
    { slug: '/best-golf-gifts-for-dad/', label: 'Best Golf Gifts for Dad' },
    { slug: '/best-christmas-golf-gifts/', label: 'Christmas Golf Gift Guide' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
  ],
  'christmas-golf-gifts': [
    { slug: '/best-golf-gifts-for-dad/', label: 'Golf Gifts for Dad' },
    { slug: '/best-golf-gifts-under-50/', label: 'Golf Gifts Under $50' },
    { slug: '/best-golf-gifts-for-mom/', label: 'Golf Gifts for Mom' },
    { slug: '/best-golf-gifts-for-couples/', label: 'Golf Gifts for Couples' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
  ],
  'mothers-day-golf-gifts': [
    { slug: '/best-golf-gifts-for-dad/', label: 'Golf Gifts for Dad' },
    { slug: '/best-golf-gifts-under-50/', label: 'Golf Gifts Under $50' },
    { slug: '/best-golf-shoes-for-walking/', label: 'Best Golf Shoes 2026' },
  ],
  'get-kid-into-golf': [
    { slug: '/best-junior-golf-clubs/', label: 'Best Junior Golf Clubs 2026' },
    { slug: '/golf-for-beginners/', label: 'Golf for Beginners Guide' },
    { slug: '/best-golf-gifts-for-dad/', label: 'Golf Gifts for Dad' },
  ],
  'couples-golf-gifts': [
    { slug: '/best-golf-gifts-for-dad/', label: 'Golf Gifts for Dad' },
    { slug: '/best-golf-gifts-for-mom/', label: 'Golf Gifts for Mom' },
    { slug: '/best-golf-gps-watches/', label: 'Best GPS Watches 2026' },
  ],
  // ── Travel & courses ──────────────────────────────────────────────────
  'courses': [
    { slug: '/courses/chicago-il/',       label: 'Best Golf Courses in Chicago' },
    { slug: '/courses/new-york-ny/',      label: 'Best Golf Courses in NYC' },
    { slug: '/courses/los-angeles-ca/',   label: 'Best Golf Courses in LA' },
    { slug: '/courses/phoenix-az/',       label: 'Best Golf Courses in Phoenix' },
    { slug: '/courses/miami-fl/',         label: 'Best Golf Courses in Miami' },
    { slug: '/courses/dallas-tx/',        label: 'Best Golf Courses in Dallas' },
    { slug: '/courses/atlanta-ga/',       label: 'Best Golf Courses in Atlanta' },
    { slug: '/courses/houston-tx/',       label: 'Best Golf Courses in Houston' },
  ],
  // ── New article clusters ──────────────────────────────────────────────────
  'apartment-golf-simulator': [
    { slug: '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/', label: 'MLM2PRO vs R50 vs Square Golf' },
    { slug: '/best-budget-launch-monitor-apartment/', label: 'Best Budget Launch Monitor Under $700' },
    { slug: '/best-golf-simulator-under-1000/', label: 'Best Simulator Under $1,000' },
    { slug: '/how-i-dropped-5-strokes-arccos-mlm2pro/', label: 'How I Dropped 5 Strokes With Data' },
    { slug: '/desk-exercises-fix-golf-slice/', label: 'Desk Exercises That Fix Your Slice' },
    { slug: '/best-training-aids-fix-slice/', label: 'Training Aids to Fix Your Slice' },
    { slug: '/best-swing-speed-trainer-over-40/', label: 'Swing Speed Trainers Over 40' },
  ],
  'mlm2pro-vs-r50-vs-square': [
    { slug: '/apartment-golf-simulator-setup/', label: 'Apartment Simulator Setup Guide' },
    { slug: '/best-budget-launch-monitor-apartment/', label: 'Best Budget Launch Monitor Under $700' },
    { slug: '/best-golf-swing-analyzers/', label: 'Best Swing Analyzers 2026' },
  ],
  'arccos-mlm2pro-strokes-dropped': [
    { slug: '/apartment-golf-simulator-setup/', label: 'Apartment Simulator Setup Guide' },
    { slug: '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/', label: 'MLM2PRO vs R50 vs Square Golf' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
    { slug: '/desk-exercises-fix-golf-slice/', label: 'Desk Exercises That Fix Your Slice' },
    { slug: '/best-training-aids-fix-slice/', label: 'Training Aids to Fix Your Slice' },
    { slug: '/best-swing-speed-trainer-over-40/', label: 'Swing Speed Trainers Over 40' },
  ],
  'budget-launch-monitor-apartment': [
    { slug: '/apartment-golf-simulator-setup/', label: 'Apartment Simulator Setup Guide' },
    { slug: '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/', label: 'MLM2PRO vs R50 vs Square Golf' },
    { slug: '/best-golf-swing-analyzers/', label: 'Best Swing Analyzers 2026' },
  ],
  'desk-exercises-golf-slice': [
    { slug: '/how-to-fix-your-slice/', label: 'How to Fix Your Slice' },
    { slug: '/how-i-dropped-5-strokes-arccos-mlm2pro/', label: 'How I Dropped 5 Strokes With Data' },
    { slug: '/apartment-golf-simulator-setup/', label: 'Apartment Simulator Setup Guide' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills (15 Min)' },
  ],
  'rain-gear-midwest': [
    { slug: '/best-golf-shoes-for-walking/', label: 'Best Golf Shoes for Walking 2026' },
    { slug: '/best-golf-balls-2026/', label: 'Best Golf Balls 2026' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Golf Gear Under $100' },
    { slug: '/best-golf-gloves-for-men/', label: 'Best Golf Gloves 2026' },
  ],
  // ── 7 new buying guide clusters ───────────────────────────────────────
  'indoor-putting-green': [
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
    { slug: '/golf-desk-accessories-office/', label: 'Golf Desk Accessories' },
  ],
  'left-handed-golf-clubs': [
    { slug: '/best-golf-irons-2026/', label: 'Best Golf Irons 2026' },
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers' },
    { slug: '/best-junior-golf-clubs/', label: 'Best Junior Golf Clubs' },
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026' },
  ],
  'training-aids-slice': [
    { slug: '/how-to-fix-your-slice/', label: 'How to Fix Your Slice' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
    { slug: '/desk-exercises-fix-golf-slice/', label: 'Desk Exercises for Slice' },
  ],
  'golf-hitting-net': [
    { slug: '/apartment-golf-simulator-setup/', label: 'Apartment Simulator Setup' },
    { slug: '/best-budget-launch-monitor-apartment/', label: 'Budget Launch Monitor' },
    { slug: '/rapsodo-mlm2pro-vs-garmin-r50-vs-square-golf/', label: 'MLM2PRO vs R50 vs Square Golf' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
  ],
  'spikeless-golf-shoes': [
    { slug: '/best-rain-gear-midwest-golfers/', label: 'Best Rain Gear Midwest' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
    { slug: '/best-golf-bags-2026/', label: 'Best Golf Bags 2026' },
  ],
  'clubs-slow-swing-speed': [
    { slug: '/best-golf-irons-2026/', label: 'Best Golf Irons 2026' },
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers' },
    { slug: '/best-beginner-golf-set-under-500/', label: 'Best Beginner Golf Set Under $500' },
    { slug: '/best-swing-speed-trainer-over-40/', label: 'Swing Speed Trainers Over 40' },
  ],
  'swing-speed-trainer-over-40': [
    { slug: '/best-golf-clubs-slow-swing-speed/', label: 'Best Clubs for Slow Swing' },
    { slug: '/best-budget-launch-monitor-apartment/', label: 'Budget Launch Monitor' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
    { slug: '/desk-exercises-fix-golf-slice/', label: 'Desk Exercises for Golf' },
  ],
  'office-to-course-playbook': [
    { slug: '/how-to-sneak-in-more-golf-rounds/', label: 'How to Play More Golf With a Job' },
    { slug: '/desk-exercises-fix-golf-slice/', label: 'Desk Exercises That Fix Your Slice' },
    { slug: '/golf-fitness-office-golfer/', label: 'Office Golfer Fitness Routine' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
    { slug: '/golf-practice-drills-at-home/', label: 'Home Practice Drills' },
  ],
  'putters-shaky-hands': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026' },
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/best-golf-clubs-slow-swing-speed/', label: 'Best Clubs for Slow Swing Speed' },
    { slug: '/best-indoor-putting-green-office-home/', label: 'Indoor Putting Greens' },
    { slug: '/when-to-replace-golf-grips/', label: 'When to Replace Golf Grips' },
  ],
  'gift-detective-guide': [
    { slug: '/best-golf-gifts-for-dad/', label: 'Best Golf Gifts for Dad' },
    { slug: '/best-golf-gifts-under-50/', label: 'Best Golf Gifts Under $50' },
    { slug: '/best-christmas-golf-gifts/', label: 'Christmas Golf Gift Guide' },
    { slug: '/best-golf-gifts-for-couples/', label: 'Gifts for Couples' },
    { slug: '/when-to-replace-wedges-grooves/', label: 'When to Replace Wedges' },
  ],
  // ── Wedge topic cluster ───────────────────────────────────────────────
  'approach-wedge-vs-gap-wedge': [
    { slug: '/how-to-buy-wedges-4-degree-rule/', label: 'How to Buy Wedges — 4-Degree Rule' },
    { slug: '/when-to-replace-wedges-grooves/', label: 'When to Replace Your Wedges' },
    { slug: '/best-golf-irons-2026/', label: 'Best Golf Irons 2026' },
  ],
  'how-to-buy-wedges': [
    { slug: '/approach-wedge-vs-gap-wedge-do-you-need-it/', label: 'Approach Wedge vs Gap Wedge' },
    { slug: '/when-to-replace-wedges-grooves/', label: 'When to Replace Your Wedges' },
    { slug: '/best-golf-irons-2026/', label: 'Best Golf Irons 2026' },
  ],
  'when-to-replace-wedges': [
    { slug: '/approach-wedge-vs-gap-wedge-do-you-need-it/', label: 'Approach Wedge vs Gap Wedge' },
    { slug: '/how-to-buy-wedges-4-degree-rule/', label: 'How to Buy Wedges — 4-Degree Rule' },
    { slug: '/when-to-replace-golf-grips/', label: 'When to Replace Golf Grips' },
    { slug: '/best-golf-irons-2026/', label: 'Best Golf Irons 2026' },
  ],
  // ── Drivers cluster ─────────────────────────────────────────────────────
  // ── Putters cluster ────────────────────────────────────────────────────
  'best-mallet-putters': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026 (All Types)' },
    { slug: '/best-blade-putters-2026/', label: 'Best Blade Putters 2026' },
    { slug: '/mallet-vs-blade-putter/', label: 'Mallet vs Blade — Which Is Right?' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'best-blade-putters': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026 (All Types)' },
    { slug: '/best-mallet-putters-2026/', label: 'Best Mallet Putters 2026' },
    { slug: '/mallet-vs-blade-putter/', label: 'Mallet vs Blade — Which Is Right?' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'budget-putters-under-150': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026 (All Types)' },
    { slug: '/best-mallet-putters-2026/', label: 'Best Mallet Putters 2026' },
    { slug: '/best-blade-putters-2026/', label: 'Best Blade Putters 2026' },
  ],
  'putters-yips': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026 (All Types)' },
    { slug: '/best-putters-shaky-hands-older-golfers/', label: 'Best Putters for Shaky Hands' },
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
  ],
  'putter-length-guide': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026' },
    { slug: '/how-to-stop-3-putting/', label: 'How to Stop 3-Putting' },
    { slug: '/mallet-vs-blade-putter/', label: 'Mallet vs Blade Putter' },
  ],
  'mallet-vs-blade': [
    { slug: '/best-golf-putters-2026/', label: 'Best Putters 2026 (All Types)' },
    { slug: '/best-mallet-putters-2026/', label: 'Best Mallet Putters 2026' },
    { slug: '/best-blade-putters-2026/', label: 'Best Blade Putters 2026' },
    { slug: '/how-to-choose-putter-length/', label: 'How to Choose Putter Length' },
  ],
  'driver-under-300': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-driver-slow-swing-speed/', label: 'Best Drivers for Slow Swing Speed' },
    { slug: '/best-golf-driver-seniors/', label: 'Best Drivers for Seniors' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'driver-slow-swing': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-driver-under-300/', label: 'Best Drivers Under $300' },
    { slug: '/best-golf-driver-seniors/', label: 'Best Drivers for Seniors' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'driver-seniors': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-driver-slow-swing-speed/', label: 'Best Drivers for Slow Swing Speed' },
    { slug: '/best-golf-clubs-slow-swing-speed/', label: 'Best Clubs for Slow Swing Speed' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'driver-vs-3-wood': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/how-to-break-90/', label: 'How to Break 90' },
    { slug: '/how-to-fix-your-slice/', label: 'How to Fix Your Slice' },
  ],
  'fit-yourself-driver': [
    { slug: '/best-golf-drivers-forgiveness/', label: 'Best Forgiving Drivers 2026' },
    { slug: '/best-golf-driver-under-300/', label: 'Best Drivers Under $300' },
    { slug: '/best-golf-driver-slow-swing-speed/', label: 'Best Drivers for Slow Swing Speed' },
    { slug: '/best-golf-gear-2026/', label: 'Best Golf Gear 2026' },
  ],
  'when-to-replace-grips': [
    { slug: '/when-to-replace-wedges-grooves/', label: 'When to Replace Your Wedges' },
    { slug: '/best-putters-shaky-hands-older-golfers/', label: 'Putters for Shaky Hands' },
    { slug: '/gifts-for-golfer-who-never-keeps-anything/', label: 'Gift Detective Guide' },
    { slug: '/best-golf-gear-under-100/', label: 'Best Gear Under $100' },
  ],
};

// ── Main export ───────────────────────────────────────────────────────────────
export function getMergedRelated(article: Article, limit = 5): RelatedLink[] {
  const seen = new Set<string>([article.slug]);
  const result: RelatedLink[] = [];

  const push = (links: Array<{ slug: string; label: string }>) => {
    for (const link of links) {
      if (seen.has(link.slug)) continue;
      if (result.length >= limit) break;
      seen.add(link.slug);
      result.push({ slug: link.slug, label: link.label });
    }
  };

  // 1. Explicit related links from the article data (highest priority)
  push(article.related ?? []);

  // 2. Article-specific cluster links (topical authority)
  push(ARTICLE_ANCHORS[article.id] ?? []);

  // 3. Category-specific anchors
  push(CATEGORY_ANCHORS[article.category] ?? []);

  // 4. Same-category articles (fallback padding)
  const sameCat = ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, limit)
    .map(a => ({ slug: a.slug, label: a.titleDisplay }));
  push(sameCat);

  return result.slice(0, limit);
}

// ── Utility exports ───────────────────────────────────────────────────────────
export function getAllSlugs(): Set<string> {
  return new Set(ARTICLES.map(a => a.slug));
}

export function getCategoryArticles(category: string): Article[] {
  return ARTICLES
    .filter(a => a.category === category)
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}

export function getFeaturedArticles(limit = 6): Article[] {
  return ARTICLES
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
    .slice(0, limit);
}

export function getAllArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}
