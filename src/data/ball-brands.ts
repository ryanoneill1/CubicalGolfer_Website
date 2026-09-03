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

export const BRAND_DETAIL: Record<string, { lead: string; pick: string; watch: string }> = {
  Titleist: {
    lead: "Titleist has the widest lineup on this chart \u2014 seven balls spanning 45 to 97 compression, more range than any other manufacturer. It splits cleanly in two: three ionomer-covered balls from $25 to $35, and four urethane-covered balls from $36 to $58. The cover matters more than the compression number, because urethane is what generates greenside spin. An ionomer ball will not check on a pitch no matter how soft it feels off the putter face.",
    pick: "The cheapest way into Titleist urethane is the Tour Speed at 78 compression and $35 a dozen \u2014 $22 less than a Pro V1 and only nine compression points softer. Below 90 mph that gap is worth very little, and $22 a dozen adds up fast. The Pro V1 at 87 and Pro V1x at 97 cost the same, so the only real question between them is whether you swing over 100 mph: the V1x is rated 100\u2013130 mph and will feel firm below that.",
    watch: "One thing the table hides: Tour Soft and Velocity are both 65 compression, and they are not interchangeable. Tour Soft is rated 80\u201395 mph and built for feel. Velocity is rated 85\u2013110 mph and built for distance. Same compression number, opposite intent \u2014 so shopping on compression alone will pick the wrong one about half the time. For head-to-head data see <a href='/compare/titleist-pro-v1-vs-callaway-chrome-soft/'>Pro V1 vs Chrome Soft</a> and <a href='/compare/titleist-pro-v1-vs-kirkland-signature/'>Pro V1 vs Kirkland Signature</a>.",
  },
  Callaway: {
    lead: "Callaway runs the shortest ladder of the major brands here \u2014 four balls from 38 to 90 compression. What stands out is the gap. There is nothing at all between the Supersoft at 38 and the Warbird at 68, a 30-point hole and the largest in any brand's lineup on this chart. If you want something moderately soft rather than very soft, Callaway does not currently make it.",
    pick: "The Supersoft at 38 is the softest ball any major manufacturer makes on this chart \u2014 only the TaylorMade Noodle at 34 goes lower. At $25 a dozen it is the ball we recommend most often below 85 mph. Above that, Chrome Soft at 75 and $45 is where Callaway's urethane begins. Chrome Tour at 90 and $58 is a genuine tour ball and is largely wasted below about 95 mph.",
    watch: "Warbird at 68 compression and $22 is the cheapest ball Callaway makes, but it is ionomer-covered and built for distance rather than control. It is a good ball to lose in the water. It is not the ball to attack a tucked pin with.",
  },
  TaylorMade: {
    lead: "TaylorMade has the most evenly spaced lineup on this chart \u2014 34, 50, 77, 85, 97, with no large gaps and something at almost every level. It also owns one extreme outright: the Noodle at 34 compression is the softest ball on this entire chart, softer than anything Titleist, Callaway, Srixon or Bridgestone currently offers.",
    pick: "Tour Response at 77 compression and $38 is the value pick and where we point most mid-handicappers. It is urethane-covered, so it spins on short shots, and it is $12 cheaper than the TP5 above it. TP5 at 85 and TP5x at 97 cost exactly the same $50, which makes that choice purely about swing speed: TP5 is rated 95\u2013115 mph, TP5x 100\u2013130 mph.",
    watch: "Noodle at $20 is among the cheapest balls on this chart, and at 34 compression it feels soft to almost anyone. But it is rated for swing speeds under 75 mph. Played at 95 mph you are compressing it well past its design range, which costs both distance and control \u2014 soft feel and correct fit are not the same thing.",
  },
  Srixon: {
    lead: "Srixon's four balls run 60 to 102 compression, and the top end is the firmest of any brand here \u2014 the Z-Star XV at 102 is the firmest ball on this entire chart. The more interesting model, though, sits near the bottom of the price list.",
    pick: "Q-Star Tour at 72 compression and $40 is the softest urethane ball Srixon makes, and one of only three urethane balls on this chart under 75 compression. Callaway's cheapest urethane is $45, Bridgestone's is $45, Titleist's is $36. For an 85\u2013100 mph swing that wants greenside spin without tour-ball pricing, it is the strongest value on the page. We link the two-tone Divide version, because the plain white listing went out of stock indefinitely. Above it, Z-Star at 88 and Z-Star XV at 102 are both $40 \u2014 $18 less than a Pro V1.",
    watch: "The step to watch is Soft Feel at 60 to Q-Star Tour at 72. That is where Srixon changes cover material from ionomer to urethane, and at current prices it costs almost nothing. If you are choosing between those two and you play any shots inside 50 yards, take the Q-Star Tour.",
  },
  Bridgestone: {
    lead: "Bridgestone is the only brand on this chart whose second-softest ball is already urethane. The Tour B RX at 68 compression carries a urethane cover, where every other manufacturer's ball at that compression is ionomer. Bridgestone's crossover into spin-generating cover material happens lower down its lineup than anyone else's here.",
    pick: "That makes Tour B RX the pick for a lot of golfers \u2014 68 compression, $45, rated 85\u2013100 mph. It is the only way on this chart to get a genuinely soft-compression ball with a urethane cover from a major manufacturer. Above it, Tour B XS at 90 and Tour B X at 100 are both $48 and both aimed at 95 mph and up, with the XS the softer and spinnier of the pair.",
    watch: "e12 Contact at 50 compression is Bridgestone's only ionomer ball here and its only one under $45. It is rated 70\u201390 mph and its dimple pattern is genuinely different from a standard design. It is the budget entry in a lineup that otherwise starts at $45 \u2014 which is high compared with every other brand on this chart.",
  },
  Vice: {
    lead: "Vice sells direct to consumers rather than through pro shops, and the pricing on this chart reflects that. Its two ionomer balls undercut most of this chart, and its urethane models sit well below the traditional tour-ball prices.",
    pick: "Vice Pro Soft at 65 compression and $35 is the softest urethane ball on this chart \u2014 ten compression points below Callaway's Chrome Soft at $45 and twenty-two below a Pro V1 at $58. At 80\u201395 mph that combination of a soft core and a spin cover is unusual; most balls this soft use ionomer. Vice Pro at 80 and $33 covers 90\u2013110 mph; Pro Plus at 90 and $35 is the 100\u2013120 mph option.",
    watch: "Vice Drive at $17 is the cheapest ball of any kind on this chart. At 55 compression with an ionomer cover it is a distance-and-durability ball, not a scoring ball. The step up to Pro Soft costs $18 and buys a urethane cover, which is what lets a ball check on a pitch. For the full budget field see our <a href='/best-golf-balls-under-30/'>best golf balls under $30</a>.",
  },
};
