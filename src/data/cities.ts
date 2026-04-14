// src/data/cities.ts
import type { GolfCity } from './types';

export const CITIES: GolfCity[] = [
  {
    slug: 'chicago-il', city: 'Chicago', state: 'IL', stateFullName: 'Illinois',
    population: 2696555, nearbyAirport: "O'Hare International (ORD)",
    bestSeason: 'May through October', dateModified: '2026-03-28',
    intro: "Chicago has more public golf courses per capita than almost any major US city. The flat terrain means even walking rounds are manageable, and the lake breeze makes mid-summer rounds genuinely pleasant.",
    courses: [
      { name: 'Cog Hill Golf & Country Club (Dubsdread)', type: 'public', price: '$85-$130', holes: 18, rating: '75.6/145', notes: 'Former host of the Western Open and BMW Championship. Hardest track in the Chicago metro — book 14 days out.' },
      { name: 'Harborside International — Port Course', type: 'public', price: '$50-$75', holes: 18, rating: '73.2/134', notes: 'Links-style layout along Lake Calumet basin. Strong winds off the water make club selection tricky.' },
      { name: 'Medinah Country Club', type: 'semi-private', price: '$120-$175', holes: 18, rating: '76.2/148', notes: 'Three-time Ryder Cup and US Open host. Some weekday public play available.' },
      { name: 'Cantigny Golf', type: 'public', price: '$55-$90', holes: 27, rating: '72.8/131', notes: 'Three 9-hole courses on the Cantigny estate in Wheaton. Family-friendly with solid practice facilities.' },
    ],
  },
  {
    slug: 'atlanta-ga', city: 'Atlanta', state: 'GA', stateFullName: 'Georgia',
    population: 498715, nearbyAirport: 'Hartsfield-Jackson Atlanta International (ATL)',
    bestSeason: 'March through May, September through November', dateModified: '2026-03-28',
    intro: "Atlanta offers year-round golf with mild winters and genuinely excellent public courses. The hilly terrain is a contrast to what most visitors expect from the South. Summer humidity is real — tee times before 8am or after 4pm are strongly recommended June through August.",
    courses: [
      { name: 'East Lake Golf Club', type: 'semi-private', price: '$150-$220', holes: 18, rating: '75.4/141', notes: 'Home of the Tour Championship since 1998. Donald Ross-era bones heavily renovated. Limited public access.' },
      { name: 'White Columns Golf Club', type: 'public', price: '$65-$95', holes: 18, rating: '73.5/133', notes: 'North Atlanta suburb layout with generous fairways and challenging greens. One of the best public tracks in the metro.' },
      { name: 'TPC Sugarloaf', type: 'public', price: '$90-$135', holes: 18, rating: '74.9/140', notes: 'Former PGA Tour host (BellSouth Classic). Wide fairways but punishing rough. Great for groups.' },
      { name: 'Stone Mountain Golf Course', type: 'resort', price: '$55-$80', holes: 36, rating: '72.4/128', notes: 'Two 18-hole courses inside Stone Mountain Park. Stonemont is the harder layout. Good for all skill levels.' },
    ],
  },
  {
    slug: 'dallas-tx', city: 'Dallas', state: 'TX', stateFullName: 'Texas',
    population: 1304379, nearbyAirport: 'Dallas/Fort Worth International (DFW)',
    bestSeason: 'October through April', dateModified: '2026-03-28',
    intro: "Dallas is a golfer's city — 300+ days of sunshine and a mix of classic tree-lined layouts and open bentgrass courses. Summer is brutally hot — plan 7am tee times June through August. The best value rounds are on weekday afternoons in shoulder season.",
    courses: [
      { name: 'Dallas National Golf Club', type: 'semi-private', price: '$125-$185', holes: 18, rating: '75.1/138', notes: 'One of the top-rated courses in Texas. Designed by Bill Coore and Ben Crenshaw. Challenging greens.' },
      { name: 'Cowboys Golf Club', type: 'public', price: '$95-$150', holes: 18, rating: '74.3/136', notes: 'NFL-themed resort course in Grapevine. Pricey but immaculately maintained.' },
      { name: 'Stonebriar Country Club', type: 'semi-private', price: '$80-$120', holes: 18, rating: '73.8/133', notes: 'Frisco layout with bentgrass greens and a links-style back nine. Weekday guest play available.' },
      { name: 'Stevens Park Golf Course', type: 'public', price: '$35-$55', holes: 18, notes: 'Dallas city-owned course in Oak Cliff. Short but hilly and interesting. Best value in the city.' },
    ],
  },
  {
    slug: 'houston-tx', city: 'Houston', state: 'TX', stateFullName: 'Texas',
    population: 2304580, nearbyAirport: 'George Bush Intercontinental (IAH)',
    bestSeason: 'November through April', dateModified: '2026-03-28',
    intro: "Houston has more golf courses than any other US city outside of Phoenix. The flat terrain keeps courses very walkable. Summer heat and humidity are serious — any round after 9am from June through September will be a sweat. The upside: shoulder season rates are some of the best in the country.",
    courses: [
      { name: 'Memorial Park Golf Course', type: 'public', price: '$55-$85', holes: 18, rating: '74.1/136', notes: 'Complete renovation by Tom Doak opened 2020. Host of the 2022 Houston Open. Outstanding public course.' },
      { name: 'Augusta Pines Golf Club', type: 'public', price: '$65-$100', holes: 18, rating: '73.6/130', notes: 'Spring-area layout with wide fairways and elevated greens. Great for groups. Rounds rarely exceed 4.5 hours.' },
      { name: 'Wildcat Golf Club', type: 'public', price: '$45-$75', holes: 36, rating: '72.8/127', notes: 'Two solid 18-hole layouts in southwest Houston. Lakes course is the harder of the two.' },
      { name: 'Tour 18 Golf Course', type: 'public', price: '$65-$95', holes: 18, notes: 'Recreations of 18 famous holes including Augusta and Pebble Beach. Fun for any golfer who watches the majors.' },
    ],
  },
  {
    slug: 'miami-fl', city: 'Miami', state: 'FL', stateFullName: 'Florida',
    population: 442241, nearbyAirport: 'Miami International (MIA)',
    bestSeason: 'November through April', dateModified: '2026-03-28',
    intro: "Miami is a winter golf destination for good reason. The dry season offers low humidity, warm temperatures, and fast greens. Summer brings afternoon thunderstorms that shut down courses by 2pm almost daily. Most resort courses are premium priced, but there are solid municipal options for value rounds.",
    courses: [
      { name: 'Doral Golf Resort — Blue Monster', type: 'resort', price: '$175-$280', holes: 18, rating: '76.2/145', notes: 'Legendary PGA Tour host redesigned by Gil Hanse in 2015. The water on 18 will cost you one ball minimum.' },
      { name: 'Biltmore Golf Course', type: 'public', price: '$45-$80', holes: 18, rating: '71.4/124', notes: 'Historic 1925 course in Coral Gables. Short but tree-lined and tight. Best value in the Miami metro.' },
      { name: 'Crandon Golf at Key Biscayne', type: 'public', price: '$60-$95', holes: 18, rating: '74.1/131', notes: 'Oceanside layout with views of Biscayne Bay. Windy and demanding. Book early — fills quickly in season.' },
      { name: 'Palmetto Golf Course', type: 'public', price: '$35-$60', holes: 18, notes: 'Miami-Dade County municipal course. Great value for local residents. Basic but playable conditions.' },
    ],
  },
  {
    slug: 'new-york-ny', city: 'New York', state: 'NY', stateFullName: 'New York',
    population: 8336817, nearbyAirport: 'John F. Kennedy International (JFK)',
    bestSeason: 'April through October', dateModified: '2026-03-28',
    intro: "Golf in New York is expensive, crowded, and worth it if you plan correctly. The NYC public courses are outstanding value for residents. Non-residents should book as far ahead as possible. A Saturday tee time at Bethpage Black in peak season requires standing in line the night before.",
    courses: [
      { name: 'Bethpage State Park — Black Course', type: 'public', price: '$95-$135', holes: 18, rating: '76.6/148', notes: 'Two-time US Open host. One of the hardest public courses in the US. Not appropriate for high handicappers. Book months ahead.' },
      { name: 'Bethpage State Park — Red Course', type: 'public', price: '$55-$80', holes: 18, rating: '72.4/130', notes: 'More accessible than Black but still a serious track. Great way to experience Bethpage without the punishment.' },
      { name: 'Trump Golf Links at Ferry Point', type: 'public', price: '$80-$165', holes: 18, rating: '75.3/138', notes: 'Jack Nicklaus-designed links course in the Bronx with Manhattan skyline views.' },
      { name: 'Pelham Bay & Split Rock Golf Courses', type: 'public', price: '$30-$50', holes: 36, notes: 'Two 18-hole NYC parks courses in the Bronx. Excellent value for NYC residents. Conditions variable.' },
    ],
  },
  {
    slug: 'phoenix-az', city: 'Phoenix', state: 'AZ', stateFullName: 'Arizona',
    population: 1608139, nearbyAirport: 'Phoenix Sky Harbor International (PHX)',
    bestSeason: 'October through April', dateModified: '2026-03-28',
    intro: "Phoenix is the best winter golf destination in the US. October through April offers perfect conditions — temperatures in the 60s and 70s, no humidity, and some of the best resort courses anywhere. Summer is 110F+ and genuinely dangerous for afternoon golf. Book Scottsdale resort tee times 30+ days ahead for January through March.",
    courses: [
      { name: 'TPC Scottsdale — Stadium Course', type: 'resort', price: '$200-$400', holes: 18, rating: '75.0/134', notes: 'Home of the Waste Management Phoenix Open. The infamous par-3 16th stadium hole is worth the price of admission once.' },
      { name: 'Troon North — Pinnacle Course', type: 'resort', price: '$120-$225', holes: 18, rating: '75.1/147', notes: 'Desert target golf at its best. Requires accurate iron play — miss fairways and you are in rocks and cactus.' },
      { name: 'We-Ko-Pa Golf Club — Cholla Course', type: 'resort', price: '$100-$175', holes: 18, rating: '73.8/142', notes: 'Scottsdale layout with authentic desert feel. One of the best-value courses in the valley.' },
      { name: 'Papago Golf Course', type: 'public', price: '$35-$65', holes: 18, rating: '72.3/129', notes: 'Phoenix city-owned municipal course. Best value in the metro. Bentgrass greens and solid conditions.' },
    ],
  },
  {
    slug: 'los-angeles-ca', city: 'Los Angeles', state: 'CA', stateFullName: 'California',
    population: 3898747, nearbyAirport: 'Los Angeles International (LAX)',
    bestSeason: 'Year-round (June Gloom aside)', dateModified: '2026-03-28',
    intro: "LA golf suffers from two problems: price and traffic. The public courses are heavily subscribed and book within minutes of the online window opening. Private clubs dominate the best land. If you have the budget, Riviera and Torrey Pines are worth every dollar. Otherwise, focus on weekday mornings.",
    courses: [
      { name: 'Riviera Country Club', type: 'semi-private', price: '$250-$400', holes: 18, rating: '75.9/143', notes: 'Home of the Genesis Invitational. Known as the Riviera of the West. Guest play extremely limited.' },
      { name: 'Torrey Pines — South Course', type: 'public', price: '$75-$200', holes: 18, rating: '75.6/144', notes: 'Two-time US Open host on the San Diego bluffs. One of the best public courses in the US. Book months ahead.' },
      { name: 'Rancho Park Golf Course', type: 'public', price: '$28-$45', holes: 18, rating: '70.6/117', notes: 'LA County-owned course near Century City. Former LA Open host. Book online the moment the 7-day window opens.' },
      { name: 'Los Verdes Golf Course', type: 'public', price: '$30-$50', holes: 18, rating: '71.4/121', notes: 'Palos Verdes Peninsula public course with Pacific Ocean views. Exceptional value for the scenery.' },
    ],
  },
];
