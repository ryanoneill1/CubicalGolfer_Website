/**
 * fix-price-drift.mjs — one-off reconciliation. `--write` to apply.
 *
 * Aug 7 2026. Every price below was read off the live affiliate destination in a
 * browser on 7 Aug 2026, not inferred. Two edit classes, both anchored to the
 * product itself — never to a neighbouring price in the same sentence, which is
 * how an earlier proximity sweep mispriced five unrelated products.
 *
 *   A. STRUCTURAL — inside an object literal that declares `affiliateKey: 'X'`,
 *      align that object's own price/heading token to X's registry price. The
 *      object states which product it describes, so there is nothing to infer.
 *      This enforces the site's existing invariant: the number printed next to a
 *      product equals the number its button renders.
 *
 *   B. PROSE — `<Name> at $N`, `<Name> (~$N)` and similar, restricted to the
 *      VERIFIED list and to names that are unique in the registry. Ceilings
 *      ("under $200"), subscriptions ("$99/yr") and totals never match, because
 *      those connectives are not on the whitelist.
 *
 * All edits are collected as byte ranges, checked for overlap, then applied in a
 * single pass. Nothing can be rewritten twice.
 */
import fs from 'node:fs';

const WRITE = process.argv.includes('--write');
const AL = fs.readFileSync('src/data/affiliate-links.ts', 'utf8');
const src0 = fs.readFileSync('src/data/articles.ts', 'utf8');

/** Prices read from the live destination on 7 Aug 2026. Prose may use these. */
const VERIFIED = {
  'precision-pro-nx9-hd':          [199,  'Amazon B0B9DLL9X9 $199.99 in stock'],
  'rapsodo-mlm2pro':               [599,  'Amazon $599.99 / PlayBetter $599.99'],
  'bushnell-ion-elite':            [219,  'BushnellGolf $219.99 / PlayBetter $219.99'],
  'bushnell-launch-pro':           [2999, 'BushnellGolf $2,999.99 / PlayBetter $2,999.99'],
  'bushnell-tour-v7-shift':        [399,  'PlayBetter $399.99'],
  'shot-scope-v5':                 [249,  'Amazon $249.99 / PlayBetter $249.99'],
  'blue-tees-series-3-max':        [199,  'PlayBetter $199.00'],
  'square-golf-launch-monitor':    [699,  'PlayBetter $699.99'],
  'callaway-rogue-st-max':         [299,  'Amazon $299.99'],
  'callaway-paradym-ai-smoke-max': [399,  'Amazon $399.99'],
  'callaway-big-bertha':           [349,  'Amazon $349.95 (B21)'],
  'garmin-approach-s12':           [199,  'Golf Galaxy /p/ $199.99'],
  'garmin-approach-s62':           [499,  'Golf Galaxy /p/ $499.99'],
  'flightscope-mevo-gen2':         [1299, 'PlayBetter $1,299.00'],
  'skytrak-plus':                  [1495, 'PlayBetter $1,495.00'],
  // 9 Aug 2026
  'taylormade-qi35-max':           [449,  'Golf Galaxy /p/ $449.99 (was $599.99)'],
  'taylormade-sim2-max':           [349,  'Amazon B08QSKHMQG $349.00 in stock'],
  'swing-caddie-sc4-pro':          [499,  'Amazon B0DK24YKBD $499.98 in stock'],
  'ernest-sports-es-b1':           [293,  'Golf Galaxy structured data $292.97'],
};

/* ---------- registry ---------- */
const REG = new Map();
for (const m of AL.matchAll(/^  '([a-z0-9-]+)': \{/gm)) {
  let d = 0, end = m.index;
  for (let p = AL.indexOf('{', m.index); p < AL.length; p++) {
    if (AL[p] === '{') d++; else if (AL[p] === '}') { d--; if (!d) { end = p; break; } }
  }
  const blk = AL.slice(m.index, end + 1);
  const pm = blk.match(/price: '([^']*)'/); if (!pm) continue;
  if (/\/(dz|dozen|mo|month|yr|year)/i.test(pm[1])) continue;
  const n = pm[1].match(/\$\s*([\d,]+)/); if (!n) continue;
  const am = blk.match(/imgAlt: '([^']*)'/);
  REG.set(m[1], { num: parseFloat(n[1].replace(/,/g, '')), alt: am ? am[1] : '' });
}

/* ---------- prose names, collisions removed ---------- */
// Strip the whole generic tail, not just one word: the registry stores
// 'Bushnell Ion Elite GPS Golf Watch' while prose writes 'Bushnell Ion Elite'.
// Model words (Irons, Hybrid, Plus, Gen2) are deliberately NOT generic — they
// are what distinguishes sibling products, and dropping them would merge them.
const GENERIC = /^(golf|gps|watch|smartwatch|rangefinder|laser|launch|monitor|simulator|product|image|photo|portable|personal|sensors?|club)$/i;
const shorten = (a) => {
  const w = a.trim().split(/\s+/);
  while (w.length > 2 && GENERIC.test(w[w.length - 1])) w.pop();
  return w.join(' ');
};
const owners = new Map();
for (const [k, v] of REG) if (v.alt) {
  const s = shorten(v.alt).toLowerCase();
  if (!owners.has(s)) owners.set(s, []);
  owners.get(s).push(k);
}
// Ambiguous = another product's prose name is identical to, or contains, this
// one. 'Cleveland Launcher XL2' is a prefix of 'Cleveland Launcher XL2 Irons',
// so a sentence naming the driver's price and one naming the irons' price are
// indistinguishable by name alone. Those are left for hand review.
const AMBIGUOUS = new Set();
const allNames = [...owners.entries()];
for (const [n, ks] of allNames) {
  if (ks.length > 1) { ks.forEach(k => AMBIGUOUS.add(k)); continue; }
  for (const [n2, ks2] of allNames) {
    if (n === n2) continue;
    if (n2.includes(n) || n.includes(n2)) { ks.forEach(k => AMBIGUOUS.add(k)); ks2.forEach(k => AMBIGUOUS.add(k)); }
  }
}

/* ---------- collect edits ---------- */
const edits = [];             // {start,end,text,why}
const manual = [];
const fmt = (n) => n >= 1000 ? n.toLocaleString('en-US') : String(n);
const push = (start, end, text, why) => edits.push({ start, end, text, why });

// --- A. structural ---
function objectAround(s, idx) {
  let d = 0, start = -1;
  for (let p = idx; p >= 0; p--) {
    if (s[p] === '}') d++;
    else if (s[p] === '{') { if (!d) { start = p; break; } d--; }
  }
  if (start < 0) return null;
  d = 0;
  for (let p = start; p < s.length; p++) { if (s[p] === '{') d++; else if (s[p] === '}') { d--; if (!d) return [start, p + 1]; } }
  return null;
}
for (const m of src0.matchAll(/affiliateKey: '([a-z0-9-]+)'/g)) (() => {
  // Only products whose price was read off the live destination today. A blanket
  // pass is unsafe: aligning a row's price to its affiliateKey silently assumes
  // the key is right, and at least one row is mis-keyed (a $15 grip trainer
  // pointing at a $40 swing trainer). Aligning there would hide the bug instead
  // of leaving it visible.
  if (!VERIFIED[m[1]]) return;
  const reg = REG.get(m[1]); if (!reg) return;
  const r = objectAround(src0, m.index); if (!r) return;
  const [os, oe] = r; const blk = src0.slice(os, oe); const W = fmt(reg.num);
  // depth[i] = brace depth of blk[i] relative to this object. Only depth 1 is
  // this object's OWN property; anything deeper belongs to a nested item that
  // declares its own affiliateKey and must not inherit the parent's price.
  const depth = new Array(blk.length); {
    let d = 0;
    for (let i = 0; i < blk.length; i++) {
      if (blk[i] === '{') d++;
      depth[i] = d;
      if (blk[i] === '}') d--;
    }
  }
  // The object must name this product. Guards against a row whose affiliateKey
  // is wrong: without this we would make a mislabelled row look internally
  // consistent, hiding the real defect. Brand alone is not enough — 'Callaway'
  // matches four drivers — so a model code (NX9, S62, Gen2, MLM2PRO) must match
  // too when the product has one, and otherwise a second non-brand word must.
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const toks = (reg.alt || m[1].replace(/-/g, ' ')).split(/\s+/)
    .filter(w => w && !/^(golf|the|and|with|for|a|of)$/i.test(w));
  const label0 = norm((blk.match(/(?:name|h2|title|heading): (?:'|")([^'"]{0,90})/) || [, ''])[1]);
  const brand = toks[0] || '';
  const models = toks.filter(t => /\d/.test(t));
  const others = toks.slice(1).filter(t => !/\d/.test(t) && t.length > 2);
  const named = !!label0 && label0.includes(norm(brand))
    && (models.length ? models.every(t => label0.includes(norm(t)))
                      : (others.length ? others.some(t => label0.includes(norm(t))) : true));
  if (!named) { manual.push(`SKIP struct ${m[1]}: row "${(blk.match(/(?:name|h2|title|heading): (?:'|")([^'"]{0,50})/) || [, '?'])[1]}" does not name it`); return; }
  const scan = (re, label) => {
    for (const mm of blk.matchAll(re)) {
      if (depth[mm.index] !== 1) continue;          // nested object — not ours
      const numTxt = mm[2];
      const cur = parseFloat(numTxt.replace(/,/g, ''));
      if (cur === reg.num) continue;
      // A figure this far from the registry is probably not this product's price at
      // all — a row named "SIM Max (prev gen)" at $129 pointing at the SIM2 Max key,
      // or a loft table reusing the price column. Rewriting those would make a
      // mislabelled row look correct. Surface instead.
      if (cur > reg.num * 2.5 || cur < reg.num / 2.5) {
        manual.push(`MANUAL ${m[1]}: ${label} $${numTxt} vs registry $${W} — too far apart, left alone`);
        continue;
      }
      const at = os + mm.index + mm[1].length;
      push(at, at + numTxt.length, W, `STRUCT ${label} ${m[1]}: $${numTxt} -> $${W}`);
    }
  };
  scan(/(\bprice: '~?\$)([\d,]+)/g, 'price');
  scan(/((?:name|h2|title|heading|label): (?:'|")[^'"]*?\(~?\$)([\d,]+)(?=\))/g, 'heading');
  scan(/((?:body|desc): (?:'|")At ~?\$)([\d,]+)(?=,)/g, 'body-open');
})();

// --- B. prose, verified + unambiguous only ---
const NOUN = String.raw`(?:\s+(?:Golf\s+)?(?:[Rr]angefinder|[Dd]river|GPS\s+[Ww]atch|[Ww]atch|[Ll]aunch\s+[Mm]onitor|[Mm]onitor|[Ss]et|[Ii]rons))?`;
// A closing inline tag may sit between the name and the price: prose is stored
// as HTML, so "<strong>Rapsodo MLM2PRO</strong> at $699" is the common shape.
const CONNECT = String.raw`(?:<\/(?:strong|b|em)>)?(?:\s*\(~?|\s+at\s+~?|\s+for\s+~?|\s+costs\s+~?|\s+sells\s+for\s+~?|\s*,\s*~?|\s*—\s*~?)`;
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Prose that is wrong about the PRODUCT, not the price. Rewriting the number
// here would leave a false sentence carrying a true price, which reads as
// deliberate. Flagged for copy edit instead.
const EXCLUDE_PROSE = {
  'square-golf-launch-monitor':
    'copy calls it a $249 smartphone-camera app; it is a $699.99 physical launch monitor. Needs a rewrite, not a reprice.',
};

for (const [key, [want, source]] of Object.entries(VERIFIED)) {
  if (EXCLUDE_PROSE[key]) { manual.push(`EXCLUDED ${key}: ${EXCLUDE_PROSE[key]}`); continue; }
  const reg = REG.get(key);
  if (!reg) { manual.push(`!! ${key} not in registry`); continue; }
  if (reg.num !== want) { manual.push(`!! ${key} registry $${reg.num} != verified $${want} — fix registry first`); continue; }
  if (AMBIGUOUS.has(key)) { manual.push(`SKIP ${key}: name collides with another product — prose left for hand review`); continue; }
  const names = [...new Set([shorten(reg.alt), reg.alt])].filter(n => n && n.length >= 8).sort((a, b) => b.length - a.length);
  const W = fmt(want);
  // 'gi': the registry spells it 'iON Elite' while prose writes 'Ion Elite'.
  for (const name of names) {
    for (const mm of src0.matchAll(new RegExp(`(${esc(name)}${NOUN}${CONNECT}\\\\?)\\$([\\d,]+)`, 'gi'))) {
      const found = parseFloat(mm[2].replace(/,/g, ''));
      if (found === want || found < 20) continue;
      // "$150 less", "$50 off", "$99/yr", "20% cheaper" are differences, rates or
      // discounts — not this product's price. Never rewrite them.
      const after = src0.slice(mm.index + mm[0].length, mm.index + mm[0].length + 14);
      if (/^\s*(less|more|off|cheaper|below|under|above|extra)\b|^\s*\/\s*(yr|mo|year|month)|^%/i.test(after)) {
        manual.push(`MANUAL ${key}: "${mm[0].slice(0, 42)}${after.slice(0, 8)}" is a difference/rate, not a price`);
        continue;
      }
      if (found > want * 3 || found < want / 3) {
        manual.push(`MANUAL ${key}: "${mm[0].slice(0, 55)}" vs verified $${W} — gap too large, untouched`);
        continue;
      }
      const at = mm.index + mm[1].length + 1;
      push(at, at + mm[2].length, W, `PROSE  ${key}: "${mm[0].slice(0, 52)}" -> $${W}   [${source}]`);
    }
  }
}

/* ---------- apply once, no overlaps ---------- */
edits.sort((a, b) => a.start - b.start);
const kept = [];
let last = -1;
for (const e of edits) {
  if (e.start < last) { manual.push(`OVERLAP dropped: ${e.why}`); continue; }
  kept.push(e); last = e.end;
}
let out = '', cur = 0;
for (const e of kept) { out += src0.slice(cur, e.start) + e.text; cur = e.end; }
out += src0.slice(cur);

const st = kept.filter(e => e.why.startsWith('STRUCT')).length;
const pr = kept.filter(e => e.why.startsWith('PROSE')).length;
for (const e of kept) if (process.env.ALL || e.why.startsWith('PROSE')) console.log('  ' + e.why);
console.log('\n--- not auto-fixed ---');
for (const m of manual) console.log('  ' + m);
console.log(`\nstructural ${st} · prose ${pr} · total ${kept.length} · manual ${manual.length}`);
if (WRITE) { fs.writeFileSync('src/data/articles.ts', out); console.log('WRITTEN'); }
else console.log('(dry run)');
