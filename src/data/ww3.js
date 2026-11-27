/* ============================================================
   ARCHIVUS — WORLD WAR III: a projection (v19)
   Read by src/ww3-app.js. Compiled 27 November 2026.

   This is not a prediction. It gathers what has been published about a war between great powers — wargames,
   treaty texts, intelligence assessments, surveys and forecasts — and arranges it: who is bound to whom, where
   it could start, how it would widen, what it would cost, and how likely those who study it think it is.
   Every line carries its source and a grade:
     is        already true, and dated
     bound     a treaty obliges it
     assessed  a named wargame, service or survey holds it
     open      nobody knows; the Archive says so
   The wars and standoffs themselves are read from src/data/conflicts.js, the arsenals and straits from
   src/data/situation.js. A source key is looked up here first, then there.

   ties     [country as the map spells it, side, strength, what binds it, sources]
            strength: treaty (a mutual-defence treaty) · quasi (armed and backed, no treaty) · core (the alignment) · tied (bound to one of the core)
   sparks   id, name, at [lat, lon], focus (country to fly to), cf (conflict), share, line, chain [[grade, text, sources]],
            pulls [countries the chain names], figs [[label, value, source]]
   road     the rungs from the present to the aftermath: [title, kind, [[grade, text, sources]]]
   ============================================================ */
window.ARCHIVUS_WW3 = {
  meta: { asOf: "2026-11-27",
    note: "A projection, not a prediction: what published wargames, treaties, assessments and forecasts say, as read on 27 November 2026." },
  grades: { is: ["Already true", "#49c9b8"], bound: ["Bound by treaty", "#5b9be0"], assessed: ["Assessed", "#e8c455"], open: ["Open", "#b48ef0"] },
  src: {
    acgf:    ["Atlantic Council — Welcome to 2036: Global Foresight survey of 447 experts in 72 countries (surveyed Nov–Dec 2025)", "https://www.atlanticcouncil.org/content-series/atlantic-council-strategy-paper-series/welcome-to-2036/", "2026-02"],
    metac:   ["Metaculus — World War Three before 2050? (community forecast, read 27 Nov 2026)", "https://www.metaculus.com/questions/2534/world-war-three-before-2050/", "2026-11-27"],
    yougov:  ["YouGov — Many Europeans and Americans think World War 3 is imminent", "https://yougov.com/en-gb/articles/52113-many-europeans-and-americans-think-world-war-3-is-imminent", "2025-05-06"],
    clock:   ["Bulletin of the Atomic Scientists — It is 85 seconds to midnight (press release)", "https://thebulletin.org/2026/01/press-release-it-is-85-seconds-to-midnight/", "2026-01-27"],
    csis:    ["CSIS — The First Battle of the Next War: Wargaming a Chinese Invasion of Taiwan", "https://www.csis.org/analysis/first-battle-next-war-wargaming-chinese-invasion-taiwan", "2023-01"],
    rfacsis: ["Radio Free Asia — Chinese invasion of Taiwan would fail, but at a high cost for all, CSIS says", "https://www.rfa.org/english/news/southchinasea/csis-taiwan-01102023061038.html", "2023-01-10"],
    bbg:     ["Bloomberg Economics, carried by Insurance Journal — The $10 trillion fight: modeling a US–China war over Taiwan", "https://www.insurancejournal.com/news/international/2026/02/12/857770.htm", "2026-02-12"],
    sgs:     ["Arms Control Association — Plan A: How a Nuclear War Could Progress (Princeton's Program on Science and Global Security)", "https://www.armscontrol.org/act/2020-07/features/plan-how-nuclear-war-could-progress", "2020-07"],
    nfood:   ["Xia, Robock and others — Global food insecurity and famine from reduced crop, marine fishery and livestock production due to climate disruption from nuclear war soot injection, Nature Food 3 (2022); abstract as held by NASA's Technical Reports Server", "https://ntrs.nasa.gov/citations/20220012708", "2022-08"],
    rutgers: ["Rutgers University — Nuclear war would cause global famine and kill billions (on the study in Nature Food)", "https://www.rutgers.edu/news/nuclear-war-would-cause-global-famine-and-kill-billions-rutgers-led-study-finds", "2022-08-15"],
    kt:      ["The Korea Times — N. Korea, Russia agree to offer military assistance 'without delay' if either is attacked", "https://www.koreatimes.co.kr/foreignaffairs/northkorea/20240620/north-korea-russia-agree-to-offer-military-assistance-without-delay-if-either-is-attacked-north-koreas-news-agency", "2024-06-20"],
    dp:      ["Defense Priorities — Who is an ally, and why does it matter?", "https://www.defensepriorities.org/explainers/who-is-an-ally-and-why-does-it-matter", "2022-10-12"],
    cnas:    ["Center for a New American Security — Forecasting the Future of the Axis of Upheaval", "https://www.cnas.org/publications/reports/forecasting-the-future-of-the-axis-of-upheaval", "2026-07-14"],
    tertrais:["Atlantic Council — Entangling alliances? Europe, the United States, Asia, and the risk of a new 1914", "https://www.atlanticcouncil.org/in-depth-research-reports/report/entangling-alliances-europe-the-united-states-asia-and-the-risk-of-a-new-1914/", "2022-06-27"],
    ddis:    ["Euronews — Denmark says Russian invasion of NATO country 'highly unlikely' but cannot be ruled out", "https://euronews.com/2026/09/24/denmark-says-russian-invasion-of-nato-country-highly-unlikely-but-cannot-be-ruled-out", "2026-09-24"],
    breuer:  ["Ukrainska Pravda — Germany says Russia could be ready to attack NATO by 2029 or even earlier", "https://www.pravda.com.ua/eng/news/2026/05/15/8034766/", "2026-05-15"],
    fas:     ["Federation of American Scientists — The Pentagon's slimmed-down 2025 China Military Power Report", "https://fas.org/publication/the-pentagons-slimmed-down-2025-china-military-power-report/", "2025-12"],
    milex:   ["SIPRI — Trends in World Military Expenditure, 2025 (fact sheet)", "https://www.sipri.org/sites/default/files/2026-04/2604_milex_2025.pdf", "2026-04"],
    armies:  ["19FortyFive — These five armies are by far the world's largest (citing the US Congressional Research Service, the IISS and Russian decrees)", "https://www.19fortyfive.com/2026/07/these-five-armies-are-by-far-the-worlds-largest/", "2026-07"],
    oracle:  ["The Oracle — the line on war: is the world getting more violent or less?", "oracle.html#v=lines&i=war", "2026-11"],
    wlist:   ["Wikipedia — List of wars by death toll (the ranges Total War uses)", "https://en.wikipedia.org/wiki/List_of_wars_by_death_toll", "2026-11-27"]
  },

  /* ---------------- the two camps, and what binds each country ---------------- */
  sides: {
    A: { n: "The American treaty system", short: "Treaty system", c: "#5b9be0",
         note: "Bound in writing. Mutual-defence treaties tie the United States to 31 NATO allies and to Japan, South Korea, the Philippines, Australia and New Zealand (and, on paper, to the Americas through the Rio Treaty, which the source calls arguably moribund). Taiwan, Israel, Ukraine and Saudi Arabia are armed and backed without a treaty." },
    B: { n: "The alignment", short: "Alignment", c: "#e0502f",
         note: "Bound by convenience. China, Russia, Iran and North Korea trade arms, intelligence and cover; none is obliged to fight for the others, with two exceptions, both North Korea's: its treaties with Russia (2024) and with China." }
  },
  strength: { treaty: "Bound by a mutual-defence treaty", quasi: "Armed and backed; no treaty", core: "One of the four", tied: "Bound to one of the four" },
  ties: [
    ["Japan", "A", "treaty", "Treaty of Mutual Cooperation and Security with the United States, 1960", ["dp"]],
    ["South Korea", "A", "treaty", "Mutual Defense Treaty with the United States, 1953", ["dp"]],
    ["Philippines", "A", "treaty", "Mutual Defense Treaty with the United States, 1951", ["dp"]],
    ["Australia", "A", "treaty", "ANZUS, 1951", ["dp"]],
    ["New Zealand", "A", "treaty", "ANZUS, 1951", ["dp"]],
    ["Taiwan", "A", "quasi", "The Taiwan Relations Act does not oblige the United States to defend the island; its policy since 1979 is deliberate ambiguity", ["dp"]],
    ["Israel", "A", "quasi", "No treaty; the United States has never formally committed to defend it and would probably do so", ["dp"]],
    ["Ukraine", "A", "quasi", "Not an ally: heavy aid, no commitment to fight", ["dp"]],
    ["Saudi Arabia", "A", "quasi", "No defence treaty", ["dp"]],
    ["China", "B", "core", "No treaty with Russia or Iran; a treaty with a defence commitment with North Korea", ["cnas", "tertrais"]],
    ["Russia", "B", "core", "Treaty with North Korea, 2024: military aid without delay if either is invaded. Leads the CSTO", ["kt", "cnas"]],
    ["Iran", "B", "core", "No ally is bound to fight for it: in the war of 2026 Russia sent intelligence and drones, and did not fight", ["cnas"]],
    ["North Korea", "B", "core", "Bound to Russia (2024) and to China by treaty; sent troops to fight for Russia in Ukraine", ["kt", "tertrais", "cnas"]],
    ["Belarus", "B", "tied", "Member of Russia's Collective Security Treaty Organization", ["csto"]]
  ],
  natoTie: ["North Atlantic Treaty, 1949: an attack on one is treated as an attack on all", ["dp", "nato"]],

  /* ---------------- where it could start ---------------- */
  sparks: [
    { id: "taiwan", n: "The Taiwan Strait and the China seas", at: [24.2, 120.6], focus: "Taiwan", cf: "taiwan", pct: 43,
      share: "Named as the likely trigger by 43% of the experts who expect a world war (Taiwan with the East and South China Seas).",
      line: "The flashpoint most often named. No treaty obliges the United States to fight for Taiwan, and every wargame assumes it would.",
      chain: [
        ["is", "China treats Taiwan as its own and keeps it under continuous military pressure: 49 air sorties on 2 November 2026, more than 100 navy and coast-guard vessels at sea the next day.", ["aei"]],
        ["assessed", "Seven in ten experts surveyed expect China to try to take Taiwan by force within ten years; two years earlier it was five in ten.", ["acgf"]],
        ["open", "Whether the United States fights. The Taiwan Relations Act does not oblige it to; its policy since 1979 has been deliberate ambiguity.", ["dp"]],
        ["assessed", "If it does, Japan is in at once: in the wargame the defenders cannot win unless the United States can fight from its bases in Japan.", ["rfacsis"]],
        ["bound", "The Philippines, Australia, New Zealand and South Korea are treaty allies of the United States. Japan and Australia have signalled they would support it over Taiwan.", ["dp", "tertrais"]],
        ["assessed", "Russia would probably do more for China than it did for Iran, once its war in Ukraine is over. China would try to keep the war from escalating.", ["cnas"]],
        ["open", "Whether North Korea, bound by treaty to both China and Russia, opens a second front in Korea.", ["tertrais", "kt"]]
      ],
      pulls: ["Taiwan", "China", "United States of America", "Japan", "Philippines", "Australia", "New Zealand", "South Korea", "Russia", "North Korea"],
      figs: [
        ["The wargame", "24 runs of a Chinese invasion set in 2026; in most the invasion is defeated and Taiwan's economy is left shattered", "csis"],
        ["United States and its allies, in the study's own summary", "dozens of ships, hundreds of aircraft and tens of thousands of servicemembers", "csis"],
        ["United States, in most runs", "two aircraft carriers, 10 to 20 large surface combatants, about 3,200 troops", "rfacsis"],
        ["Japan", "about a hundred aircraft and dozens of ships", "rfacsis"],
        ["China", "about 10,000 troops killed, 155 combat aircraft, 138 major ships; tens of thousands taken prisoner", "rfacsis"],
        ["The world economy, first year", "$10.6 trillion, 9.6% of world output: more than the pandemic or the crisis of 2007–09", "bbg"],
        ["Who loses most", "Taiwan −40%, South Korea −23%, Japan −14.7%, China −11%, the EU −10.9%, the United States −6.6%", "bbg"],
        ["Why", "losing Taiwan's output would cut the world's supply of leading-edge logic chips by 62%", "bbg"]
      ] },
    { id: "baltic", n: "NATO's eastern edge", at: [57.6, 26.4], focus: "Estonia", cf: "ukraine", pct: 25,
      share: "Named by 25% of the experts who expect a world war (Eastern Europe).",
      line: "The one place where a single shot would bind 32 states at once.",
      chain: [
        ["is", "Russia's war in Ukraine is in its fifth year of full-scale fighting. Talks in Abu Dhabi and Moscow in November 2026 produced a prisoner exchange and no ceasefire.", ["ajukr17"]],
        ["assessed", "Germany's chief of defence: Russia could be capable of attacking NATO by 2029, 'or even earlier'.", ["breuer"]],
        ["assessed", "Denmark's intelligence service, 24 September 2026: an invasion of a NATO country is highly unlikely; the risk of a limited attack on a state bordering Russia is low but growing. Estonia's service sees no intention to attack this year or next.", ["ddis", "breuer"]],
        ["bound", "An armed attack on one NATO member is treated as an attack on all 32.", ["dp", "nato"]],
        ["bound", "Russia and North Korea owe each other military aid 'without delay' if either is invaded; North Korean troops have already fought for Russia in Ukraine. Belarus sits in Russia's treaty organisation.", ["kt", "cnas", "csto"]],
        ["open", "Whether the alliance holds. Nearly 44% of the experts surveyed expect NATO no longer to exist in its present form by 2036.", ["acgf"]],
        ["assessed", "This is where Princeton's simulation of a nuclear war begins: a conventional war in Europe, then warning shots, then exchange.", ["sgs"]]
      ],
      pulls: ["Russia", "Belarus", "North Korea", "Estonia", "Latvia", "Lithuania", "Poland", "Finland", "United States of America", "Germany", "United Kingdom", "France", "Ukraine"],
      figs: [
        ["Bound by Article 5", "32 states, among them three nuclear powers", "nato"],
        ["When Russia could be ready", "by 2029, or earlier (Germany's chief of defence)", "breuer"],
        ["The other view", "invasion of a NATO country 'highly unlikely' (Danish intelligence, Sept 2026)", "ddis"],
        ["If it went nuclear", "more than 90 million dead and injured in the first few hours, before fallout", "sgs"]
      ] },
    { id: "gulf", n: "The Gulf", at: [26.6, 54.6], focus: "Iran", cf: "iran", pct: 13,
      share: "Named by 13% of the experts who expect a world war (the Middle East).",
      line: "The test that has already been run. The war came in 2026, and the alignment did not fight.",
      chain: [
        ["is", "On 28 February 2026 the United States and Israel struck Iran and killed its Supreme Leader. Full-scale fighting is on hold without a peace; the United States blockades Iran's ports.", ["cfrIran", "ajiran12"]],
        ["is", "It did not become a world war. Russia gave Iran political backing, intelligence, drone tactics from Ukraine and upgraded drones, and did not join the fighting.", ["cnas"]],
        ["is", "The Strait of Hormuz is contested: 163 attack events on shipping since the war began, 147 vessels turned back by the blockade.", ["lloydsH"]],
        ["assessed", "A long stand-off could lead Russia to help Iran tie down American forces.", ["cnas"]],
        ["open", "Whether Iran now builds the bomb. Of the experts who expect more nuclear states within ten years, 66% name Iran first and 53% Saudi Arabia.", ["acgf"]]
      ],
      pulls: ["Iran", "United States of America", "Israel", "Russia", "Saudi Arabia"],
      figs: [
        ["Began", "28 February 2026", "cfrIran"],
        ["What Iran's partners did", "intelligence, drone tactics and upgraded drones from Russia; no troops, no entry into the war", "cnas"],
        ["Hormuz", "163 attack events on shipping; 147 commercial vessels turned back, five disabled", "lloydsH"]
      ] },
    { id: "korea", n: "The Korean peninsula", at: [38.3, 127.2], focus: "North Korea", cf: "korea", pct: 0,
      share: "Not listed separately in the survey of triggers.",
      line: "The only flashpoint where both camps are bound by treaty. Here the widening would be automatic on both sides.",
      chain: [
        ["is", "North Korea held a live-fire drill on 14 September 2026 and commissioned a second destroyer; on 4 November Kim Yo Jong turned down an American invitation to meet.", ["cfrKor", "aei"]],
        ["bound", "The United States is bound to defend South Korea by the treaty of 1953.", ["dp"]],
        ["bound", "North Korea is bound to Russia by the treaty of 2024, military aid 'without delay' if either is invaded, and to China by a treaty with a defence commitment.", ["kt", "tertrais"]],
        ["is", "North Korea holds an estimated 60 nuclear warheads.", ["sipri"]],
        ["open", "Whether South Korea seeks its own. Of the experts who expect more nuclear states, 47% name it.", ["acgf"]]
      ],
      pulls: ["North Korea", "South Korea", "United States of America", "China", "Russia", "Japan"],
      figs: [["Treaties that meet here", "United States–South Korea (1953); North Korea–Russia (2024); North Korea–China", "dp"], ["Warheads", "about 60", "sipri"]] },
    { id: "himalaya", n: "India and Pakistan", at: [33.6, 75.2], focus: "Pakistan", cf: "kashmir", pct: 0,
      share: "Not listed separately in the survey of triggers.",
      line: "Two nuclear states with no treaty that would pull a great power in. The danger here travels by smoke, not by alliance.",
      chain: [
        ["is", "The ceasefire of May 2025 has held. On 15 September 2026 an Indian destroyer and a Pakistani patrol vessel collided in the Arabian Sea.", ["cfrInd"]],
        ["is", "India holds an estimated 190 nuclear warheads and Pakistan 170.", ["sipri"]],
        ["is", "Neither is a treaty ally of the United States.", ["dp"]],
        ["assessed", "Even the smallest India–Pakistan nuclear war modelled cuts the world's calorie production by 7% within five years.", ["rutgers"]]
      ],
      pulls: ["India", "Pakistan"],
      figs: [["Warheads", "India 190, Pakistan 170", "sipri"], ["Smallest war modelled", "world calorie production down 7% within five years", "rutgers"]] }
  ],

  /* ---------------- the road: from the present to the aftermath ---------------- */
  road: [
    ["The standing peace", "now", [
      ["is", "By the Oracle's count there has been no war between great powers for 81 years, since 1945.", ["oracle"]],
      ["is", "The Doomsday Clock was set at 85 seconds to midnight on 27 January 2026, the closest it has been; the last treaty limiting American and Russian strategic arsenals has expired.", ["clock"]],
      ["is", "There are an estimated 12,187 nuclear warheads, about 4,012 of them deployed. China's stockpile, in the low 600s, is on course to pass 1,000 by 2030.", ["sipri", "fas"]],
      ["is", "On 19 November 2026 the presidents of the United States, China and Russia met as three for the first time and reaffirmed that a nuclear war cannot be won and must never be fought.", ["rfa"]]]],
    ["The spark", "projected", [
      ["assessed", "More than 40% of 447 experts expect a world war, a multifront conflict among great powers, within ten years.", ["acgf"]],
      ["assessed", "Of those, 43% expect it to start over Taiwan or in the East or South China Seas, 25% in Eastern Europe, 13% in the Middle East.", ["acgf"]],
      ["open", "What the spark is, and whether the place it starts is on anyone's list.", []]]],
    ["The widening", "projected", [
      ["bound", "One camp widens by treaty: mutual-defence treaties bind the United States to 36 other states in Europe and the Pacific.", ["dp", "nato"]],
      ["assessed", "The other does not: China, Russia, Iran and North Korea are 'an adaptive network of opportunistic cooperation, not a formal alliance', each held back by its own priorities.", ["cnas"]],
      ["assessed", "Whether today's web of alliances is a conveyor belt to war, as before 1914, or a brake on it is argued both ways; the fullest study concludes it is, on balance, more stabilising than not.", ["tertrais"]]]],
    ["General war", "projected", [
      ["assessed", "The first three weeks at sea and in the air, in the one war that has been gamed in public: two American carriers and up to twenty large warships; 138 Chinese ships and 155 aircraft.", ["rfacsis"]],
      ["assessed", "The world economy loses 9.6% in the first year of a war for Taiwan, about $10.6 trillion.", ["bbg"]],
      ["is", "The camps as they are armed today: the treaty system spends about three times what the alignment does; the two hold almost the same number of nuclear warheads.", ["milex", "sipri"]]]],
    ["The threshold", "projected", [
      ["assessed", "Princeton's simulation: a conventional war in Europe turns nuclear in three steps, warning shots, strikes on forces, strikes on cities.", ["sgs"]],
      ["assessed", "More than 90 million people dead and injured within the first few hours, before fallout and the collapse of medicine.", ["sgs"]],
      ["assessed", "Of the public in five European countries and the United States, 68 to 76% expect that a third world war would be nuclear.", ["yougov"]],
      ["assessed", "Fifteen per cent of the experts expect Russia to use a nuclear weapon within ten years; 22% expect someone to.", ["acgf"]]]],
    ["After", "projected", [
      ["assessed", "A full nuclear war between the United States and Russia: more than five billion people dead of hunger, as soot from burning cities cuts the world's calorie production by about 90% three to four years on.", ["nfood", "rutgers"]],
      ["assessed", "A war between India and Pakistan alone: more than two billion dead of hunger in the same study; even the smallest case modelled cuts the world's calories by 7% within five years.", ["nfood", "rutgers"]],
      ["open", "What comes after that. Nothing published models it.", []]]]
  ],

  /* ---------------- the balance ---------------- */
  balance: {
    spend: { t: "Military spending, 2025", unit: "US$ billion", s: ["milex"],
      A: [["NATO, 32 members", 1581, "of which the United States 954"], ["Japan", 62.2], ["South Korea", 47.8]],
      Aq: [["Ukraine", 84.1], ["Saudi Arabia", 83.2], ["Israel", 48.3], ["Taiwan", 18.2]],
      B: [["China", 336, "estimate"], ["Russia", 190, "estimate"], ["Iran", 7.4]],
      note: "North Korea is not covered by the fact sheet; Australia, the Philippines and New Zealand are outside its top fifteen and were not read. World total: $2,887 billion." },
    nukes: { t: "Nuclear warheads, January 2026", unit: "warheads", s: ["sipri"],
      A: [["United States", 5042, "1,770 deployed"], ["France", 370, "280 deployed"], ["United Kingdom", 225, "120 deployed"]],
      Aq: [["Israel", 90]],
      B: [["Russia", 5420, "1,796 deployed"], ["China", 620, "34 deployed"], ["North Korea", 60]],
      note: "Outside both camps: India 190, Pakistan 170. Total inventory, including retired warheads awaiting dismantlement." },
    men: { t: "The five largest standing forces", unit: "million on active duty", s: ["armies"],
      rows: [["China", 2.0, "B", "approximately two million"], ["Russia", 1.5, "B", "1,502,640 by decree of March 2026"], ["India", 1.45, "", "1.43 to 1.48 million; in neither camp"], ["United States", 1.32, "A", "roughly 1.32 million"], ["North Korea", 1.29, "B", "1.28 to 1.3 million"]],
      note: "Figures as one compilation gives them, from the US Congressional Research Service, the IISS and Russian decrees. Numbers of men measure the least about a war fought with ships, missiles and drones." }
  },

  /* ---------------- the cost: wars fought and wars modelled, on one scale ---------------- */
  cost: {
    dead: [
      ["World War I", 15, 22, "fought", "1914 – 1918 · dead", ["wlist"]],
      ["World War II", 70, 85, "fought", "1939 – 1945 · dead", ["wlist"]],
      ["A US–Russia nuclear war, first hours", 90, 90, "model", "dead and injured, before fallout · Princeton's Plan A", ["sgs"]],
      ["A US–Russia nuclear war, the famine after", 5000, 5000, "model", "more than five billion dead of hunger · Nature Food, 2022", ["nfood", "rutgers"]]
    ],
    deadNote: "Millions of people, on a logarithmic scale: each step along is ten times the last. The first two were counted afterwards; the last two are models and have never been tested.",
    gdp: [["Taiwan", -40, "assumed in the model"], ["South Korea", -23], ["Japan", -14.7], ["China", -11], ["European Union", -10.9], ["The world", -9.6, "about $10.6 trillion"], ["India", -8], ["United States", -6.6], ["United Kingdom", -6.1]],
    gdpNote: "Output lost in the first year of a war for Taiwan that draws in the United States. A blockade without invasion costs the world 5.3%; 'heightened tensions', which the authors call the most likely course, 0.2%.", gdpSrc: ["bbg"]
  },

  /* ---------------- the odds: what is said for and against ---------------- */
  odds: {
    gauges: [
      ["22%", "that a third world war begins before 2050", "Forecasters on Metaculus, 3,300 of them", "metac", 22],
      ["40%+", "of 447 experts expect a world war within ten years", "Atlantic Council survey, Nov–Dec 2025", "acgf", 40],
      ["41–55%", "of the public in five European countries think one likely within five to ten years; 45% of Americans", "YouGov, May 2025", "yougov", 48],
      ["70%", "of the experts expect China to try to take Taiwan by force within ten years", "Atlantic Council survey", "acgf", 70],
      ["22%", "of the experts expect a nuclear weapon to be used within ten years", "Atlantic Council survey", "acgf", 22],
      ["85 s", "to midnight on the Doomsday Clock, the closest it has stood", "Bulletin of the Atomic Scientists, 27 Jan 2026", "clock", null]
    ],
    yes: [
      ["Expert expectation of a forced attempt on Taiwan has risen from 50% to 65% to 70% in three yearly surveys.", ["acgf"]],
      ["Russia's forces are growing and re-arming; Germany's chief of defence puts readiness to attack NATO at 2029 or earlier.", ["breuer"]],
      ["The last treaty limiting American and Russian strategic arsenals has expired, and the review of the Non-Proliferation Treaty failed for the third time running.", ["clock", "sipripr"]],
      ["Eighty-five per cent of the experts expect at least one more state to acquire nuclear weapons within ten years.", ["acgf"]],
      ["Thirty per cent of the experts name war between major powers as the greatest threat to prosperity; 17% name climate change.", ["acgf"]]
    ],
    no: [
      ["The alignment is not an alliance. When the United States and Israel struck Iran in 2026, none of its partners fought for it.", ["cnas"]],
      ["Denmark's intelligence service calls an invasion of a NATO country highly unlikely; Estonia's sees no intention to attack this year or next.", ["ddis", "breuer"]],
      ["In November 2026 the American, Chinese and Russian presidents met as three and agreed to hold talks on nuclear risk.", ["rfa"]],
      ["The economists who priced a war for Taiwan give war a low probability and call 'heightened tensions' the most likely course.", ["bbg"]],
      ["The fullest study of today's alliances concludes that they are, on balance, more stabilising than destabilising.", ["tertrais"]],
      ["The majority view is still no. If more than 40% of the experts expect a world war within ten years, somewhat under 60% do not; the forecasters put 78% on no world war before 2050.", ["acgf", "metac"]]
    ],
    reading: [
      ["assessed", "If it comes, those who study it expect it from the western Pacific first and eastern Europe second.", ["acgf"]],
      ["bound", "The widening is lopsided. One camp is bound by treaties and would widen a war by obligation; the other is bound by convenience and has so far left its members to fight alone. Korea is the exception: there both camps are bound.", ["dp", "cnas", "kt"]],
      ["open", "None of these numbers is a measurement. A survey counts opinions and a forecast averages guesses, and there has been no war between great powers for 81 years to check them against. The Oracle makes the same point from the record: one event of that kind outweighs every trend.", ["oracle"]]
    ]
  }
};
