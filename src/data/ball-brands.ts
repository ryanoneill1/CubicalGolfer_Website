// Single source of truth for the per-brand compression commentary.
//
// Extracted from golf-ball-compression-chart/index.astro when Sprint 100 added
// dedicated per-brand chart pages. Keeping a second copy inside the new pages
// would have repeated the exact failure balls.ts was created to fix: the PDF
// generator held its own hardcoded ball data and quietly served prices that
// were two sprints out of date on the site's highest-CTR asset.
//
// The all-brands chart and every /{brand}-golf-ball-compression-chart/ page
// import from here, so brand copy can only ever be written once.
//
// ── Sprint 165: the numbers are now DERIVED, not typed ─────────────────────
// This file used to be plain strings with the figures written by hand, and it
// had drifted badly. A machine check against balls.ts found 21 of the 23
// verifiable claims wrong, on six brands:
//
//   Titleist    "spanning 45 to 97 compression"              -> 65 to 97
//   Titleist    "four urethane balls from $36 to $58"        -> $35 to $58
//   Callaway    "Supersoft ... at $25 a dozen"               -> $27
//   TaylorMade  "TP5 and TP5x cost exactly the same $50"     -> $58 and $45
//   TaylorMade  "Tour Response ... $12 cheaper than the TP5" -> $20 cheaper
//   Srixon      "Z-Star and Z-Star XV are both $40"          -> $40 and $54
//   Srixon      "Bridgestone's cheapest urethane is $45"     -> $40
//   Bridgestone "Tour B RX -- 68 compression, $45"           -> $40
//   Bridgestone "Tour B XS and Tour B X are both $48"        -> both $55
//   Bridgestone "a lineup that otherwise starts at $45"      -> starts at $30
//   Vice        "Vice Pro at 80 compression and $33"         -> 90, $39
//   Vice        "Vice Drive at $17, cheapest of any kind"    -> $20; Chaos $12
//   Vice        "Its two ionomer balls ..."                   -> Vice has one
//
// Every one of those paragraphs renders directly above a table stating the
// correct figure, on pages whose whole proposition is that the numbers are
// checked — including /golf-ball-compression-chart/, which takes 37% of the
// site's clicks. This was the most trust-damaging defect on the site.
//
// The fix is structural: every price, compression, count, span, gap and
// difference below is computed from balls.ts at build time. The editorial
// sentences stay hand-written, because "it is a good ball to lose in the water"
// is a judgement and not a number. Change a price in balls.ts and all six
// brand write-ups follow it. validate-brand-copy.ts fails the build if a bare
// figure is typed back in.
//
// Superlatives are derived too, and several were quietly wrong for the same
// reason: Titleist has the most balls here but NOT the widest compression
// range (TaylorMade does); Callaway's 30-point gap is tied with Wilson's, not
// the outright widest; Bridgestone is one of three brands whose second-softest
// ball is urethane, not the only one. The helpers below compute the honest
// version rather than asserting the flattering one.
import { balls as BALLS } from './balls';

interface Ball {
  name: string; brand: string; compression: number; cover: string;
  price: number; minMph: number; maxMph: number; discontinued?: boolean;
}

const ALL = BALLS as unknown as Ball[];

const isUre = (b: Ball) => /urethane/i.test(b.cover);
const isIon = (b: Ball) => !isUre(b);
const inStock = (b: Ball) => !b.discontinued;

const of = (brand: string) =>
  ALL.filter(b => b.brand === brand).sort((a, b) => a.compression - b.compression);

const short = (b: Ball) => b.name.replace(new RegExp('^' + b.brand + '\\s+'), '');
const money = (n: number) => `$${n}`;
const cheapest = (bs: Ball[]) => bs.slice().sort((a, b) => a.price - b.price)[0];
const lo = (bs: Ball[]) => Math.min(...bs.map(b => b.price));
const hi = (bs: Ball[]) => Math.max(...bs.map(b => b.price));
const span = (bs: Ball[]) => `${bs[0].compression} to ${bs[bs.length - 1].compression}`;
const priceRange = (bs: Ball[]) =>
  lo(bs) === hi(bs) ? money(lo(bs)) : `${money(lo(bs))} to ${money(hi(bs))}`;

const BRANDS = [...new Set(ALL.map(b => b.brand))];

/** Widest compression hole inside one brand's own ladder. */
function widestGap(bs: Ball[]) {
  let gap = 0, below = bs[0], above = bs[0];
  for (let i = 1; i < bs.length; i++) {
    const d = bs[i].compression - bs[i - 1].compression;
    if (d > gap) { gap = d; below = bs[i - 1]; above = bs[i]; }
  }
  return { gap, below, above };
}

/** Brands sharing the widest intra-brand gap on the chart, excluding `brand`. */
function gapPeers(brand: string, gap: number): string[] {
  return BRANDS.filter(b => b !== brand && of(b).length > 1 && widestGap(of(b)).gap >= gap);
}

/** How many balls on the whole chart are softer than `b`. 0 = softest. */
const softerThan = (b: Ball) => ALL.filter(x => x.compression < b.compression).length;
const firmerThan = (b: Ball) => ALL.filter(x => x.compression > b.compression).length;

/** Cheapest in-stock urethane ball a brand sells, or undefined if it sells none. */
const cheapestUre = (brand: string) => {
  const u = of(brand).filter(isUre).filter(inStock);
  return u.length ? cheapest(u) : undefined;
};

/** Brands whose second-softest ball already carries a urethane cover. */
const secondIsUre = () =>
  BRANDS.filter(br => { const bs = of(br); return bs.length > 1 && isUre(bs[1]); });

const ureUnder = (c: number) => ALL.filter(b => isUre(b) && b.compression < c);
const chartCheapest = cheapest(ALL);
const list = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? '') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;

/** balls.ts uses minMph 0 for "no lower limit"; "0–80 mph" reads like a defect. */
const speed = (b: Ball) => (b.minMph > 0 ? `${b.minMph}–${b.maxMph} mph` : `up to ${b.maxMph} mph`);

function build(): Record<string, { lead: string; pick: string; watch: string }> {
  const out: Record<string, { lead: string; pick: string; watch: string }> = {};

  // ── Titleist ──────────────────────────────────────────────────────────────
  {
    const bs = of('Titleist');
    const ion = bs.filter(isIon), ure = bs.filter(isUre);
    const mostBalls = BRANDS.every(b => of(b).length <= bs.length);
    const pick = cheapestUre('Titleist')!;            // AVX — Tour Speed is out of stock
    const v1 = bs.find(b => short(b) === 'Pro V1')!;
    const v1x = bs.find(b => short(b) === 'Pro V1x')!;
    const pair = bs.filter(b => bs.filter(x => x.compression === b.compression).length > 1);

    out.Titleist = {
      lead:
        `Titleist runs the longest lineup on this chart — ${bs.length} balls spanning ` +
        `${span(bs)} compression${mostBalls ? ', more models than any other brand here' : ''}. ` +
        `It splits in two by cover, and the split is not by price: ${plural(ion.length, 'ionomer-covered ball')} ` +
        `from ${priceRange(ion)}, and ${plural(ure.length, 'urethane-covered ball')} from ${priceRange(ure)}. ` +
        `The cover matters more than the compression number, because urethane is what generates ` +
        `greenside spin. An ionomer ball will not check on a pitch no matter how soft it feels off the putter face.`,
      pick:
        `The cheapest way into Titleist urethane you can actually buy today is the ${short(pick)} ` +
        `at ${pick.compression} compression and ${money(pick.price)} a dozen — ${money(v1.price - pick.price)} ` +
        `less than a Pro V1 and ${v1.compression - pick.compression} compression points softer. ` +
        `Below 90 mph that gap is worth very little. ` +
        `The Pro V1 at ${v1.compression} and Pro V1x at ${v1x.compression} ` +
        (v1.price === v1x.price
          ? `cost the same ${money(v1.price)}, so the only real question between them is whether you swing over 100 mph: `
          : `are ${money(v1.price)} and ${money(v1x.price)}, so price barely separates them either: `) +
        `the V1x is rated ${v1x.minMph}–${v1x.maxMph} mph and will feel firm below that.`,
      watch:
        (pair.length === 2
          ? `One thing the table hides: ${short(pair[0])} and ${short(pair[1])} are both ` +
            `${pair[0].compression} compression, and they are not interchangeable. ` +
            `${short(pair[0])} is rated ${pair[0].minMph}–${pair[0].maxMph} mph and built for feel. ` +
            `${short(pair[1])} is rated ${pair[1].minMph}–${pair[1].maxMph} mph and built for distance. ` +
            `Same compression number, opposite intent — so shopping on compression alone will pick the ` +
            `wrong one about half the time. `
          : `Compression alone will not pick a Titleist for you — two balls in this lineup share a rating ` +
            `and are built for opposite jobs. `) +
        `For head-to-head data see <a href='/compare/titleist-pro-v1-vs-callaway-chrome-soft/'>Pro V1 vs Chrome Soft</a> ` +
        `and <a href='/compare/titleist-pro-v1-vs-kirkland-signature/'>Pro V1 vs Kirkland Signature</a>.`,
    };
  }

  // ── Callaway ──────────────────────────────────────────────────────────────
  {
    const bs = of('Callaway');
    const { gap, below, above } = widestGap(bs);
    const peers = gapPeers('Callaway', gap);
    const soft = bs[0];
    const softer = ALL.filter(b => b.compression < soft.compression)
                      .sort((a, b) => b.compression - a.compression);
    const cs = bs.find(b => short(b) === 'Chrome Soft')!;
    const ct = bs.find(b => short(b) === 'Chrome Tour')!;
    const cheap = cheapest(bs);

    out.Callaway = {
      lead:
        `Callaway runs one of the shorter ladders here — ${bs.length} balls from ${span(bs)} compression. ` +
        `What stands out is the gap. There is nothing at all between the ${short(below)} at ` +
        `${below.compression} and the ${short(above)} at ${above.compression}, a ${gap}-point hole` +
        (peers.length
          ? ` — the widest inside any brand's lineup on this chart, matched only by ${list(peers)}. `
          : ` — the widest inside any brand's lineup on this chart. `) +
        `If you want something moderately soft rather than very soft, Callaway does not currently make it.`,
      pick:
        `The ${short(soft)} at ${soft.compression} is the ` +
        (softer.length === 0 ? 'softest ball on this chart'
          : softer.length === 1 ? `second-softest ball on this chart — only the ${softer[0].name} at ${softer[0].compression} goes lower`
          : `softest ball Callaway makes, with ${softer.length} balls on this chart softer still`) +
        `. At ${money(soft.price)} a dozen it is the ball we recommend most often below 85 mph. ` +
        `Above that, ${short(cs)} at ${cs.compression} and ${money(cs.price)} is where Callaway's urethane ` +
        `begins. ${short(ct)} at ${ct.compression} and ${money(ct.price)} is a genuine tour ball and is ` +
        `largely wasted below about 95 mph.`,
      watch:
        `${short(cheap)} at ${cheap.compression} compression and ${money(cheap.price)} is the cheapest ball ` +
        `Callaway makes, but it is ${cheap.cover.toLowerCase()}-covered and built for distance rather than ` +
        `control. It is a good ball to lose in the water. It is not the ball to attack a tucked pin with.`,
    };
  }

  // ── TaylorMade ────────────────────────────────────────────────────────────
  {
    const bs = of('TaylorMade');
    const soft = bs[0];
    const tr = bs.find(b => short(b) === 'Tour Response')!;
    const tp5 = bs.find(b => short(b) === 'TP5')!;
    const tp5x = bs.find(b => short(b) === 'TP5x')!;
    const even = widestGap(bs).gap;
    const reach = (br: string) => { const x = of(br); return x[x.length - 1].compression - x[0].compression; };
    const widestReach = BRANDS.every(br => reach(br) <= reach('TaylorMade'));

    out.TaylorMade = {
      lead:
        (widestReach
          ? `TaylorMade covers the widest compression range on this chart — ${span(bs)}, `
          : `TaylorMade's ladder runs ${span(bs)} compression, `) +
        `and it fills it evenly: ${bs.map(b => b.compression).join(', ')}, with no hole wider than ` +
        `${even} points. ` +
        (softerThan(soft) === 0
          ? `It also owns one extreme outright: the ${short(soft)} at ${soft.compression} compression is the ` +
            `softest ball on this entire chart, softer than anything Titleist, Callaway, Srixon or Bridgestone ` +
            `currently offers.`
          : `Its softest, the ${short(soft)} at ${soft.compression}, sits near the bottom of the whole chart.`),
      pick:
        `${short(tr)} at ${tr.compression} compression and ${money(tr.price)} is the value pick and where we ` +
        `point most mid-handicappers. It is urethane-covered, so it spins on short shots, and it is ` +
        `${money(tp5.price - tr.price)} cheaper than the ${short(tp5)} above it. ` +
        (tp5.price === tp5x.price
          ? `${short(tp5)} at ${tp5.compression} and ${short(tp5x)} at ${tp5x.compression} cost exactly the ` +
            `same ${money(tp5.price)}, which makes that choice purely about swing speed: `
          : `The odd one is the pair above: ${short(tp5x)} is the firmer ball at ${tp5x.compression} yet it is ` +
            `${money(tp5.price - tp5x.price)} cheaper than the ${tp5.compression}-compression ${short(tp5)} ` +
            `(${money(tp5x.price)} against ${money(tp5.price)}), so pick on speed rather than price: `) +
        `${short(tp5)} is rated ${tp5.minMph}–${tp5.maxMph} mph, ${short(tp5x)} ${tp5x.minMph}–${tp5x.maxMph} mph.`,
      watch:
        `${short(soft)} at ${money(soft.price)} is among the cheapest balls on this chart, and at ` +
        `${soft.compression} compression it feels soft to almost anyone. But it is rated for swing speeds ` +
        `under ${soft.maxMph} mph. Played at 95 mph you are compressing it well past its design range, which ` +
        `costs both distance and control — soft feel and correct fit are not the same thing.`,
    };
  }

  // ── Srixon ────────────────────────────────────────────────────────────────
  {
    const bs = of('Srixon');
    const firm = bs[bs.length - 1];
    const qst = bs.find(b => short(b) === 'Q-Star Tour')!;
    const zs = bs.find(b => short(b) === 'Z-Star')!;
    const zsx = bs.find(b => short(b) === 'Z-Star XV')!;
    const sf = bs[0];
    const underQ = ureUnder(75);
    const v1 = of('Titleist').find(b => short(b) === 'Pro V1')!;
    const rivals = ['Callaway', 'Bridgestone', 'Titleist']
      .map(br => ({ br, b: cheapestUre(br) }))
      .filter(r => r.b) as { br: string; b: Ball }[];
    const cheaperRivals = rivals.filter(r => r.b.price < qst.price);
    const tiedRivals = rivals.filter(r => r.b.price === qst.price);

    out.Srixon = {
      lead:
        `Srixon's ${bs.length} balls run ${span(bs)} compression, and ` +
        (firmerThan(firm) === 0
          ? `the top end is the firmest of any brand here — the ${short(firm)} at ${firm.compression} is the ` +
            `firmest ball on this entire chart. `
          : `the ${short(firm)} at ${firm.compression} anchors the firm end. `) +
        `The more interesting model, though, sits lower down the price list.`,
      pick:
        `${short(qst)} at ${qst.compression} compression and ${money(qst.price)} is the softest urethane ball ` +
        `Srixon makes, and one of only ${underQ.length} urethane balls on this chart under 75 compression. ` +
        `The cheapest in-stock urethane the other big brands offer: ` +
        `${list(rivals.map(r => `${r.br} ${money(r.b.price)}`))}. ` +
        (cheaperRivals.length === 0 && tiedRivals.length === 0
          ? `Nothing here undercuts it: for an 85–100 mph swing that wants greenside spin without ` +
            `tour-ball pricing it is the strongest value on the page. `
          : cheaperRivals.length === 0
          ? `${list(tiedRivals.map(r => r.br))} ${tiedRivals.length === 1 ? 'matches' : 'match'} it, so call ` +
            `it joint-cheapest rather than unbeaten — but for an 85–100 mph swing that wants greenside ` +
            `spin without tour-ball pricing it is still the value play. `
          : `So it is beaten on price, but for an 85–100 mph swing that wants greenside spin without ` +
            `tour-ball pricing it remains a strong value. `) +
        `We link the two-tone Divide version, because the plain white listing went out of stock indefinitely. ` +
        `Above it, ${short(zs)} at ${zs.compression} is ${money(zs.price)} — ${money(v1.price - zs.price)} ` +
        `less than a Pro V1 — and ${short(zsx)} at ${zsx.compression} is ${money(zsx.price)}.`,
      watch:
        `The step to watch is ${short(sf)} at ${sf.compression} to ${short(qst)} at ${qst.compression}. ` +
        `That is where Srixon changes cover material from ${sf.cover.toLowerCase()} to ${qst.cover.toLowerCase()}, ` +
        `and it costs ${money(qst.price - sf.price)} a dozen. If you are choosing between those two and you ` +
        `play any shots inside 50 yards, the spin cover is worth it.`,
    };
  }

  // ── Bridgestone ───────────────────────────────────────────────────────────
  {
    const bs = of('Bridgestone');
    const rx = bs[1];
    const ure = bs.filter(isUre);
    const ion = bs.filter(isIon);
    const second = secondIsUre();
    const underRx = ureUnder(75);
    const cheap = bs[0];
    const nextUp = bs[1];

    out.Bridgestone = {
      lead:
        `Bridgestone commits to urethane earlier than most — ${ure.length} of its ${bs.length} balls carry a ` +
        `spin cover, and the ${short(rx)} does it at just ${rx.compression} compression. ` +
        (second.length > 1
          ? `It is one of ${second.length} brands here whose second-softest ball is already urethane ` +
            `(${list(second.filter(b => b !== 'Bridgestone'))} are the others), and `
          : `It is the only brand here whose second-softest ball is already urethane, and `) +
        `the ${short(rx)} is one of only ${underRx.length} urethane balls on this chart under 75 compression. ` +
        `That matters because the cover, not the compression number, is what makes a ball check on a pitch.`,
      pick:
        `That makes ${short(rx)} the pick for a lot of golfers — ${rx.compression} compression, ` +
        `${money(rx.price)}, rated ${rx.minMph}–${rx.maxMph} mph. It is one of the few ways on this chart to ` +
        `get a genuinely soft-compression ball with a urethane cover from a major manufacturer. Above it, ` +
        `${ure.slice(1).map(b => `${short(b)} at ${b.compression}`).join(' and ')} ` +
        (ure.slice(1).every(b => b.price === ure[1].price)
          ? `are both ${money(ure[1].price)} and both aimed at 95 mph and up`
          : `are ${list(ure.slice(1).map(b => money(b.price)))} and both aimed at 95 mph and up`) +
        `, with the XS the softer and spinnier of the pair.`,
      watch:
        `${short(cheap)} at ${cheap.compression} compression is Bridgestone's ` +
        (ion.length === 1 ? 'only ionomer ball here and its cheapest at ' : 'cheapest ball here at ') +
        `${money(cheap.price)}, rated ${cheap.minMph}–${cheap.maxMph} mph, and its dimple pattern is genuinely ` +
        `different from a standard design. It is the budget entry in a lineup that otherwise starts at ` +
        `${money(nextUp.price)} and tops out at ${money(hi(bs))} — expensive next to most brands on this chart.`,
    };
  }

  // ── Vice ──────────────────────────────────────────────────────────────────
  {
    const bs = of('Vice');
    const ion = bs.filter(isIon), ure = bs.filter(isUre);
    const soft = ure[0];
    const cs = of('Callaway').find(b => short(b) === 'Chrome Soft')!;
    const v1 = of('Titleist').find(b => short(b) === 'Pro V1')!;
    const pro = bs.find(b => short(b) === 'Pro')!;
    const plus = bs.find(b => short(b) === 'Pro Plus')!;
    const drive = cheapest(bs);
    const softestUre = ALL.filter(isUre).sort((a, b) => a.compression - b.compression)[0];

    out.Vice = {
      lead:
        `Vice sells direct to consumers rather than through pro shops, and the pricing on this chart reflects ` +
        `that. ${plural(ure.length, 'of its balls carries a urethane cover', 'of its balls carry a urethane cover')} ` +
        `and ${plural(ion.length, 'is ionomer')}, yet its urethane models sit from ${priceRange(ure)} — well ` +
        `below the traditional tour-ball prices.`,
      pick:
        `${short(soft)} at ${soft.compression} compression and ${money(soft.price)} is ` +
        (softestUre.name === soft.name
          ? `the softest urethane ball on this chart`
          : `among the softest urethane balls on this chart`) +
        ` — ${cs.compression - soft.compression} compression points below Callaway's ${short(cs)} at ` +
        `${money(cs.price)} and ${v1.compression - soft.compression} below a Pro V1 at ${money(v1.price)}. ` +
        `At ${soft.minMph}–${soft.maxMph} mph that combination of a soft core and a spin cover is unusual; ` +
        `most balls this soft use ionomer. ${short(pro)} at ${pro.compression} and ${money(pro.price)} covers ` +
        `${pro.minMph}–${pro.maxMph} mph; ${short(plus)} at ${plus.compression} and ${money(plus.price)} is the ` +
        `${plus.minMph}–${plus.maxMph} mph option.`,
      watch:
        `${short(drive)} at ${money(drive.price)} is the cheapest ball Vice makes` +
        (drive.price === chartCheapest.price
          ? ` and the cheapest of any kind on this chart`
          : ` — the chart's outright cheapest is the ${chartCheapest.name} at ${money(chartCheapest.price)}`) +
        `. Vice publishes it at ${drive.compression} compression, so despite the name it is a firm ` +
        `distance-and-durability ball, not a soft one and not a scoring ball. The step up to ${short(soft)} ` +
        `costs ${money(soft.price - drive.price)} and buys a urethane cover, which is what lets a ball check ` +
        `on a pitch. For the full budget field see our ` +
        `<a href='/best-golf-balls-under-30/'>best golf balls under $30</a>.`,
    };
  }

  return out;
}

export const BRAND_DETAIL = build();

// ── Derived facts the brand pages need outside the commentary ──────────────
// The five brand pages each hard-coded "all 35 balls ... across ten brands"
// (really 36 across 11) and a per-brand FAQ whose compression range and
// "softest ball" answer were also typed by hand. Titleist's said the TruFeel
// at 70 was its softest when Tour Soft and Velocity sit at 65 — stated two
// screens below a table showing both. Same defect, same fix.

/** Total balls on the all-brands chart. */
export const CHART_BALL_COUNT = ALL.length;

/** Distinct manufacturers on the all-brands chart. */
export const CHART_BRAND_COUNT = BRANDS.length;

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
               'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** "eleven" for small numbers, "14" beyond the list — reads better in prose. */
export const inWords = (n: number) => words[n] ?? String(n);

/** The sentence every brand page uses to point at the full chart. */
export const FULL_CHART_BLURB =
  `The full chart covers all ${CHART_BALL_COUNT} balls we track across ` +
  `${inWords(CHART_BRAND_COUNT)} brands, with a sortable table and a free printable PDF.`;

/** The three FAQ answers on a brand page that depend on ball data. */
export function brandFaqFacts(brand: string) {
  const bs = of(brand);
  const softest = bs.filter(b => b.compression === bs[0].compression);
  const firmest = bs[bs.length - 1];
  const softLabel = softest.length === 1
    ? `the ${softest[0].name}`
    : `${list(softest.map(b => b.name))} are tied as`;

  return {
    count: bs.length,
    range:
      `${brand} golf balls on this chart run from ${bs[0].compression} compression ` +
      `(${softest.map(short).join(' and ')}) up to ${firmest.compression} (${short(firmest)}). ` +
      `Lower compression suits slower swing speeds; a firmer ball needs more clubhead speed ` +
      `before it compresses properly.`,
    softest:
      (softest.length === 1
        ? `${softLabel.replace(/^the /, 'The ')} is the softest ${brand} ball on this chart at ` +
          `${softest[0].compression} compression, about ${money(softest[0].price)} a dozen, rated ` +
          `${speed(softest[0])}.`
        : `${softLabel} the softest ${brand} balls on this chart, both at ${softest[0].compression} ` +
          `compression. ${softest.map(b => `${short(b)} is ${money(b.price)} a dozen and rated ${speed(b)}`).join('; ')}. Same rating, different jobs — ` +
          `check the speed range, not just the number.`),
    howMany:
      `${bs.length}. This page covers the ${brand} balls we track and test. For every brand side by ` +
      `side, see the full compression chart of all ${CHART_BALL_COUNT} balls.`,
  };
}
