#!/usr/bin/env node
// scripts/insert-tool-links.ts
// ─────────────────────────────────────────────────────────────────────────────
// Inserts contextual in-body links (and matching related[] entries) to the
// under-linked high-value tools, into ONLY the articles whose own subject makes
// the tool useful. Placement is chosen per-article by keyword so each link lands
// in a relevant section; anchor text is varied per insertion. Max 2 tool links
// per article is enforced. Edits are spliced into the raw source string by
// exact, delimiter-aware matching of the target section body, so the 1.97 MB
// file keeps its formatting and only the touched spots change.
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import { ARTICLES } from '../src/data/articles';

const SRC = 'src/data/articles.ts';
let src = fs.readFileSync(SRC, 'utf8');
const A = ARTICLES as any[];

const TOOLS: Record<string, { href: string; label: string }> = {
  RC: { href: '/launch-monitor-room-checker/', label: 'Launch Monitor Room Checker' },
  CC: { href: '/golf-simulator-cost-calculator/', label: 'Golf Simulator Cost Calculator' },
  PC: { href: '/golf-simulator-projector-distance-calculator/', label: 'Projector Distance Calculator' },
  BP: { href: '/golf-equipment-budget-planner/', label: 'Golf Equipment Budget Planner' },
  BF: { href: '/golf-ball-finder/', label: 'Golf Ball Finder' },
  SS: { href: '/golf-swing-speed-chart/', label: 'Golf Swing Speed Chart' },
};

// ── delimiter-aware encoding: return the encoded form of `body` that appears
//    exactly once in the current source, plus which quote style it used ────────
const baseEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
const encoders: Record<string, (s: string) => string> = {
  single: (s) => baseEsc(s).replace(/'/g, "\\'"),
  double: (s) => baseEsc(s).replace(/"/g, '\\"'),
  backtick: (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'),
};
const delimStyle: Record<string, string> = { "'": 'single', '"': 'double', '`': 'backtick' };
function locate(body: string): { enc: string; style: string } | null {
  // Find an encoding that appears exactly once, then read the ACTUAL opening
  // delimiter from the source (the char just before the match) — content
  // without quotes encodes identically in every style, so the real delimiter
  // must be read from the file, not guessed from the content.
  const encs = new Set<string>();
  for (const style of Object.keys(encoders)) encs.add(encoders[style](body));
  const hits = [...encs].filter((e) => src.split(e).length - 1 === 1);
  if (hits.length !== 1) return null;
  const enc = hits[0];
  const delim = src[src.indexOf(enc) - 1];
  const style = delimStyle[delim];
  if (!style) return null; // opening delimiter not a recognised string quote
  return { enc, style };
}

// One insertion: place tool link into article `slug`, choosing a section whose
// body matches `kw`; `text` is the sentence (HTML, no outer <p>).
interface Ins { slug: string; tool: keyof typeof TOOLS; kw: RegExp; text: string; body?: boolean; related?: boolean; }

const L = (slug: string, tool: keyof typeof TOOLS, kw: RegExp, text: string, opts: Partial<Ins> = {}): Ins =>
  ({ slug, tool, kw, text, body: opts.body ?? true, related: opts.related ?? true });

const INSERTIONS: Ins[] = [
  // ── launch-monitor-room-checker (9 articles) ──
  L('/how-to-build-garage-golf-simulator/', 'RC', /ceiling|dimension|space|feet|room/i,
    'Before you frame a single stud, measure your garage against each monitor’s overhead and downrange needs with our <a href="/launch-monitor-room-checker/">launch monitor room checker</a>.'),
  L('/best-golf-simulator-small-spaces/', 'RC', /ceiling|space|small|height|room|feet/i,
    'Tight on room? Run your exact measurements through the <a href="/launch-monitor-room-checker/">room-fit checker</a> to see which of these builds actually fits.'),
  L('/best-golf-simulator-under-1000/', 'RC', /space|ceiling|room|feet|dimension/i,
    'Confirm your chosen unit clears your ceiling and swing arc using the <a href="/launch-monitor-room-checker/">space checker</a> before you order.'),
  L('/best-golf-simulator-under-5000/', 'RC', /space|ceiling|room|feet|dimension/i,
    'A five-figure build is worth protecting: check that your room passes every clearance with the <a href="/launch-monitor-room-checker/">room-size checker</a> first.'),
  L('/apartment-golf-simulator-setup/', 'RC', /ceiling|apartment|space|height|room/i,
    'Apartment ceilings are usually the limiting factor, so test yours in the <a href="/launch-monitor-room-checker/">ceiling-clearance checker</a> before buying anything.'),
  L('/portable-golf-simulator-setup/', 'RC', /space|room|set ?up|fold|ceiling/i,
    'See which portable setups fit the room you actually have with the <a href="/launch-monitor-room-checker/">room checker</a>.'),
  L('/golf-simulator-room-dimensions-guide/', 'RC', /dimension|ceiling|feet|space|room/i,
    'Plug your own width, depth, and ceiling height into the <a href="/launch-monitor-room-checker/">room dimension checker</a> to match a monitor to your space in seconds.'),
  L('/best-launch-monitor-low-ceiling/', 'RC', /ceiling|height|low|room|space/i,
    'Not sure how low is too low? Enter your ceiling height in the <a href="/launch-monitor-room-checker/">low-ceiling checker</a> to see your safe options.'),
  L('/best-budget-launch-monitor-apartment/', 'RC', /apartment|ceiling|space|room|height/i,
    'Renting? Check your unit’s swing clearance against your room in the <a href="/launch-monitor-room-checker/">room checker</a> before you commit.'),

  // ── golf-simulator-cost-calculator (11 articles; first 7 overlap with RC) ──
  L('/how-to-build-garage-golf-simulator/', 'CC', /budget|cost|breakdown|\$|price/i,
    'Want a number before you shop? Price your whole build component by component in the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a>.'),
  L('/best-golf-simulator-small-spaces/', 'CC', /budget|cost|\$|price/i,
    'Estimate the all-in cost of any of these compact builds with the <a href="/golf-simulator-cost-calculator/">cost calculator</a>.'),
  L('/best-golf-simulator-under-1000/', 'CC', /budget|cost|\$|price/i,
    'Staying under a grand is easier when you can see every line item — try the <a href="/golf-simulator-cost-calculator/">simulator budget calculator</a>.'),
  L('/best-golf-simulator-under-5000/', 'CC', /budget|cost|\$|price/i,
    'Map your budget across monitor, screen, projector, and mat using the <a href="/golf-simulator-cost-calculator/">build-cost calculator</a>.'),
  L('/apartment-golf-simulator-setup/', 'CC', /budget|cost|\$|price/i,
    'Add up a renter-friendly build in the <a href="/golf-simulator-cost-calculator/">simulator cost estimator</a> before you buy.'),
  L('/portable-golf-simulator-setup/', 'CC', /budget|cost|\$|price/i,
    'Weigh the cost of a portable rig against a fixed one in the <a href="/golf-simulator-cost-calculator/">cost calculator</a>.'),
  L('/golf-simulator-room-dimensions-guide/', 'CC', /budget|cost|\$|price/i,
    'Once your space checks out, price the build in the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a>.'),
  L('/how-much-does-golf-simulator-cost/', 'CC', /cost|\$|budget|price/i,
    'Rather than guess, build your own estimate line by line with the <a href="/golf-simulator-cost-calculator/">interactive cost calculator</a>.'),
  L('/best-golf-launch-monitors-2026/', 'CC', /simulator|build|cost|\$/i,
    'If this monitor is going into a full simulator, total the rest of the build with the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a>.'),
  L('/quiet-golf-simulator-setup/', 'CC', /budget|cost|\$|price|material/i,
    'Sound-dampening adds up — fold it into your budget with the <a href="/golf-simulator-cost-calculator/">simulator cost calculator</a>.'),
  L('/best-golf-simulator-for-beginners/', 'CC', /budget|cost|\$|price/i,
    'New builders should start with a number: sketch yours in the <a href="/golf-simulator-cost-calculator/">cost calculator</a> before choosing parts.'),

  // ── projector-distance-calculator (2 body + 2 related-only) ──
  L('/best-golf-simulator-projectors/', 'PC', /throw|projector|distance|ratio|mount/i,
    'Match a projector’s throw ratio to your room depth with the <a href="/golf-simulator-projector-distance-calculator/">projector distance calculator</a>.'),
  L('/best-impact-screens-golf-simulator/', 'PC', /screen|distance|projector|throw|mount/i,
    'Working out where the projector sits relative to your screen? The <a href="/golf-simulator-projector-distance-calculator/">throw-distance calculator</a> does the geometry for you.'),
  L('/how-to-build-garage-golf-simulator/', 'PC', /projector/i, '', { body: false }),
  L('/golf-simulator-room-dimensions-guide/', 'PC', /projector/i, '', { body: false }),

  // ── golf-equipment-budget-planner (5 articles) ──
  L('/best-beginner-golf-set-under-500/', 'BP', /budget|under|\$|beginner|set/i,
    'Not sure how to split a starter budget across clubs, balls, and extras? The <a href="/golf-equipment-budget-planner/">equipment budget planner</a> lays it out for you.'),
  L('/best-golf-drivers-under-200/', 'BP', /budget|under|\$|price/i,
    'See where a sub-$200 driver fits in your wider kit with the <a href="/golf-equipment-budget-planner/">golf equipment budget planner</a>.'),
  L('/golf-for-beginners/', 'BP', /budget|start|first|set|beginner/i,
    'Building your first bag on a budget? Plan the whole spend with the <a href="/golf-equipment-budget-planner/">budget planner</a>.'),
  L('/best-golf-clubs-20-handicap/', 'BP', /budget|price|\$|set/i,
    'Balance a full set against what you want to spend using the <a href="/golf-equipment-budget-planner/">equipment budget planner</a>.'),
  L('/best-golf-rangefinders-under-200/', 'BP', /budget|under|\$|price/i,
    'Working to a tight number? The <a href="/golf-equipment-budget-planner/">budget planner</a> helps you decide how much of it a rangefinder deserves.'),

  // ── golf-ball-finder (4 articles) ──
  L('/best-golf-balls-2026/', 'BF', /ball|swing|feel|spin/i,
    'Not sure which of these is right for your game? Answer a few questions in the <a href="/golf-ball-finder/">golf ball finder</a> for a personalised pick.'),
  L('/what-golf-ball-for-high-handicapper/', 'BF', /ball|handicap|spin/i,
    'Skip the guesswork and match a ball to your swing with the <a href="/golf-ball-finder/">ball finder tool</a>.'),
  L('/best-golf-balls-slow-swing-speed/', 'BF', /ball|swing speed|slow|compression/i,
    'Match a low-compression ball to your speed in the <a href="/golf-ball-finder/">golf ball finder</a>.'),
  L('/best-golf-ball-15-handicap/', 'BF', /ball|handicap|spin/i,
    'Want a recommendation tuned to your game? Run it through the <a href="/golf-ball-finder/">ball finder</a>.'),

  // ── golf-swing-speed-chart (4 articles) ──
  L('/shaft-flex-guide/', 'SS', /flex|swing speed|shaft|mph/i,
    'Not sure which flex your speed calls for? Cross-check it against the <a href="/golf-swing-speed-chart/">swing speed chart</a>.'),
  L('/driver-loft-guide/', 'SS', /loft|swing speed|mph|launch/i,
    'Loft and speed go together — see the recommended pairing in the <a href="/golf-swing-speed-chart/">swing speed chart</a>.'),
  L('/average-swing-speed-by-age/', 'SS', /swing speed|age|mph|average/i,
    'See how your number compares by age and handicap in the full <a href="/golf-swing-speed-chart/">swing speed chart</a>.'),
  L('/best-golf-driver-slow-swing-speed/', 'SS', /swing speed|slow|mph|loft/i,
    'Know your number first: check it against the <a href="/golf-swing-speed-chart/">swing speed reference chart</a> before picking a driver.'),
];

// ── apply ─────────────────────────────────────────────────────────────────────
const bodyCount = new Map<string, number>(); // slug -> tool links inserted in body
const log: any[] = [];
let bodyInserted = 0, relatedInserted = 0, skipped: string[] = [];

for (const ins of INSERTIONS) {
  const a = A.find((x) => x.slug === ins.slug);
  if (!a) { skipped.push(`no article ${ins.slug}`); continue; }
  const tool = TOOLS[ins.tool];

  // ── body link ──
  if (ins.body) {
    const already = JSON.stringify({ ...a, related: 0, relatedComparisons: 0 }).includes(`href=\\"${tool.href}\\"`) ||
      JSON.stringify(a.sections || []).includes(`href="${tool.href}"`);
    const n = bodyCount.get(ins.slug) || 0;
    if (already) { skipped.push(`${ins.slug} already body-links ${tool.href}`); }
    else if (n >= 2) { skipped.push(`${ins.slug} at 2-tool cap, skip ${tool.href}`); }
    else {
      // choose section: keyword match first, then any; must be locatable
      const kwSecs = (a.sections || []).filter((s: any) => ins.kw.test(String(s.body || '')));
      const ordered = [...kwSecs, ...(a.sections || []).filter((s: any) => !kwSecs.includes(s))];
      let placed = false;
      for (const s of ordered) {
        const loc = locate(String(s.body || ''));
        if (!loc) continue;
        const insertEnc = encoders[loc.style](' <p>' + ins.text + '</p>');
        src = src.replace(loc.enc, loc.enc + insertEnc);
        bodyCount.set(ins.slug, n + 1);
        bodyInserted++;
        log.push({ slug: ins.slug, tool: tool.href, kind: 'body', section: s.h2 });
        placed = true;
        break;
      }
      if (!placed) skipped.push(`${ins.slug} no locatable section for ${tool.href}`);
    }
  }

  // ── related[] entry ──
  if (ins.related) {
    const has = (a.related || []).some((r: any) => (r.slug || '').replace(/\/?$/, '/') === tool.href);
    if (has) { skipped.push(`${ins.slug} already related ${tool.href}`); }
    else {
      // anchor on first locatable section body, then this article's `related: [`
      let anchorEnd = -1;
      for (const s of a.sections || []) {
        const loc = locate(String(s.body || ''));
        if (loc) { anchorEnd = src.indexOf(loc.enc) + loc.enc.length; break; }
      }
      const relPos = anchorEnd >= 0 ? src.indexOf('related: [', anchorEnd) : -1;
      if (relPos < 0) { skipped.push(`${ins.slug} no related: [ for ${tool.href}`); }
      else {
        const at = relPos + 'related: ['.length;
        const entry = `\n      { slug: '${tool.href}', label: '${tool.label}' },`;
        src = src.slice(0, at) + entry + src.slice(at);
        relatedInserted++;
        log.push({ slug: ins.slug, tool: tool.href, kind: 'related' });
      }
    }
  }
}

fs.writeFileSync(SRC, src);
fs.writeFileSync('/tmp/link-insert-log.json', JSON.stringify({ log, skipped }, null, 1));
console.log(`✓ inserted ${bodyInserted} body links + ${relatedInserted} related entries; ${skipped.length} skipped`);
if (skipped.length) console.log('  skipped:\n   ' + skipped.join('\n   '));
