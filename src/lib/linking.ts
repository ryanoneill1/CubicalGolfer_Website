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
    { slug: '/compare/',                           label: 'Compare Golf Products Head-to-Head' },
    { slug: '/best-golf-gear-under-100/',          label: 'Best Golf Gear Under $100' },
  ],
  'golf-tech': [
    { slug: '/best-golf-gps-watches/',             label: 'Best Golf GPS Watches 2026' },
    { slug: '/best-golf-launch-monitors-2026/',    label: 'Best Golf Launch Monitors 2026' },
    { slug: '/best-golf-apps-handicap-tracking/',  label: 'Best Golf Apps for Handicap Tracking' },
    { slug: '/compare/skytrak-vs-garmin-r10/',     label: 'SkyTrak+ vs Garmin R10' },
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
  ],
  'golf-lifestyle': [
    { slug: '/golf-for-beginners/',              label: 'Golf for Beginners — Complete Guide' },
    { slug: '/best-golf-gifts-for-him/',         label: 'Best Golf Gifts for Him' },
    { slug: '/golf-course-etiquette/',           label: 'Golf Course Etiquette Guide' },
    { slug: '/golf-desk-accessories-office/',    label: 'Best Golf Desk Accessories' },
  ],
};

// ── Topical cluster links: article-specific high-value cross-links ────────────
// Fixes orphaned pages by giving them specific inbound paths
const ARTICLE_ANCHORS: Record<string, Array<{ slug: string; label: string }>> = {

  // ── Rangefinder cluster: every rangefinder page links to the others ──────────
  'rangefinders': [
    { slug: '/best-golf-rangefinder-under-200/', label: 'Best Rangefinders Under $200' },
    { slug: '/do-i-need-slope-on-rangefinder/',  label: 'Do I Need Slope on a Rangefinder?' },
    { slug: '/best-golf-rangefinder-for-seniors/', label: 'Best Rangefinders for Seniors' },
    { slug: '/compare/bushnell-tour-v6-vs-precision-pro-nx9/', label: 'Bushnell Tour V6 vs Precision Pro NX9' },
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
    { slug: '/best-golf-rangefinder-under-150/',  label: 'Best Rangefinders Under $150' },
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
  'best-golf-rangefinder-under-150': [
    { slug: '/best-golf-rangefinder-under-200/',    label: 'Best Rangefinders Under $200' },
    { slug: '/blue-tees-vs-bushnell-rangefinder/',  label: 'Blue Tees vs Bushnell' },
    { slug: '/is-a-rangefinder-worth-it/',          label: 'Is a Rangefinder Worth It?' },
  ],
  'blue-tees-vs-bushnell-rangefinder': [
    { slug: '/best-golf-rangefinders-2026/',        label: 'Best Golf Rangefinders 2026' },
    { slug: '/best-golf-rangefinder-under-200/',    label: 'Best Rangefinders Under $200' },
    { slug: '/do-i-need-slope-on-rangefinder/',     label: 'Do I Need Slope Mode?' },
  ],

  // ── GPS Watch cluster ─────────────────────────────────────────────────────────
  'gps-watches': [
    { slug: '/best-golf-gps-watch-under-200/',      label: 'Best GPS Watch Under $200' },
    { slug: '/best-gps-golf-watch-high-handicappers/', label: 'Best GPS Watch for High Handicappers' },
    { slug: '/golf-rangefinder-vs-gps-watch/',      label: 'Rangefinder vs GPS Watch' },
    { slug: '/compare/garmin-approach-s62-vs-shot-scope-v5/', label: 'Garmin S62 vs Shot Scope V5' },
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
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/golf-ball-compression-chart/',        label: 'Golf Ball Compression Chart' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
  ],
  'golf-ball-compression': [
    { slug: '/best-golf-balls-for-seniors/',        label: 'Best Golf Balls for Seniors 2026' },
    { slug: '/best-golf-balls-slow-swing-speed/',   label: 'Best Balls for Slow Swing Speed' },
    { slug: '/what-golf-ball-for-high-handicapper/', label: 'Best Ball for High Handicappers' },
    { slug: '/best-golf-balls-90-mph-swing-speed/', label: 'Best Balls for 90 MPH Swing Speed' },
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
    { slug: '/best-golf-balls-weekend-golfers/',    label: 'Best Balls for Weekend Golfers' },
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
    { slug: '/average-golf-handicap-weekend-golfer/', label: 'Average Handicap for Weekend Golfers' },
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
    { slug: '/best-beginner-golf-club-sets/',       label: 'Best Beginner Golf Club Sets' },
    { slug: '/how-to-fix-your-slice/',              label: 'How to Fix Your Slice' },
    { slug: '/golf-course-etiquette/',             label: 'Golf Course Etiquette Guide' },
  ],
  'tips-beginners': [
    { slug: '/golf-for-beginners/',                 label: 'Golf for Beginners — Complete Guide' },
    { slug: '/golf-course-etiquette/',              label: 'Golf Course Etiquette' },
    { slug: '/best-beginner-golf-club-sets/',       label: 'Best Beginner Golf Club Sets' },
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
    { slug: '/how-to-improve-putting/',             label: 'How to Improve Your Putting' },
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
    { slug: '/how-to-improve-putting/',             label: 'How to Improve Your Putting' },
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
    { slug: '/best-beginner-golf-club-sets/',        label: 'Best Beginner Club Sets' },
  ],

  // ── Shoes cluster ──────────────────────────────────────────────────────────
  'golf-shoes-walking': [
    { slug: '/best-golf-accessories-under-50/',      label: 'Best Accessories Under $50' },
    { slug: '/best-golf-bags-2026/',                 label: 'Best Golf Bags 2026' },
    { slug: '/golf-fitness-office-golfer/',           label: 'Golf Fitness for Office Workers' },
  ],

  // ── Putters cluster ────────────────────────────────────────────────────────
  'golf-putters': [
    { slug: '/how-to-improve-putting/',              label: 'How to Improve Your Putting' },
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
  'arccos-vs-shot-scope': [
    { slug: '/best-golf-swing-analyzers/',           label: 'Best Golf Swing Analyzers 2026' },
    { slug: '/best-golf-gps-watches/',               label: 'Best Golf GPS Watches 2026' },
    { slug: '/best-ai-golf-training-tools/',         label: 'Best AI Golf Training Tools' },
  ],

  // ── Launch monitor cluster ─────────────────────────────────────────────────
  'launch-monitors': [
    { slug: '/trackman-vs-foresight-gcquad/',         label: 'Trackman 4 vs Foresight GCQuad' },
    { slug: '/best-golf-simulator-small-spaces/',    label: 'Best Golf Simulators for Small Spaces' },
    { slug: '/skytrak-vs-mevo-plus/',                label: 'SkyTrak+ vs Mevo+ Comparison' },
    { slug: '/best-golf-swing-analyzers/',           label: 'Best Golf Swing Analyzers 2026' },
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
    { slug: '/how-to-improve-putting/',              label: 'How to Improve Your Putting' },
    { slug: '/how-to-stop-3-putting/',               label: 'How to Stop 3-Putting' },
    { slug: '/how-to-practice-golf-at-home/',        label: 'How to Practice Golf at Home' },
    { slug: '/best-golf-gear-under-100/',            label: 'Best Golf Gear Under $100' },
    { slug: '/golf-practice-routine-before-work/',   label: '15-Min Morning Practice Routine' },
  ],
  'morning-practice-routine': [
    { slug: '/golf-practice-drills-at-home/',        label: '7 Practice Drills at Home (15 Min)' },
    { slug: '/how-to-practice-golf-at-home/',        label: 'How to Practice Golf at Home' },
    { slug: '/how-to-improve-putting/',              label: 'How to Improve Your Putting' },
    { slug: '/golf-fitness-office-golfer/',           label: 'Golf Fitness for Office Workers' },
    { slug: '/how-to-break-90/',                     label: 'How to Break 90 This Season' },
  ],
  'beginner-set-under-500': [
    { slug: '/best-beginner-golf-club-sets/',         label: 'Best Beginner Golf Club Sets' },
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
