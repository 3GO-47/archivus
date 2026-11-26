/* ============================================================
   ARCHIVUS — THE SITUATION: the world as it stands (v18)
   Read by src/situation-app.js. Compiled 25 November 2026.

   Everything here is dated and carries its source. Nothing is estimated
   by the Archive: where a result or a figure was not read, the row says so.
   The wars themselves are NOT repeated here — they are read from
   src/data/conflicts.js, and a dispatch about one links to its card there
   (`cf`). A source key is looked up here first, then in the Conflicts' list.

   src      key → [label, url, date of the page]
   blocs    id, name, colour, kind, members / partners (names as the map spells them),
            `off` = members with no shape on the map, note, sources
   sanc     us: [country, programme as OFAC names it, date OFAC last updated it]; eu: [countries]
   nukes    [country, deployed, stored, military stockpile, total inventory, lat, lon] — SIPRI, January 2026
   straits  id, name, at [lat, lon], status, one line, figures [label, value], sources, cf
   wire     id, d (date), k (kind), t (headline), x (what happened), at [lat, lon], w (countries),
            s (sources), cf (conflict), approx (the source gives the month, not the day)
   ballots  [date, country, what was elected, outcome, code, sources]
            code: new = power changed hands · held = the governing side kept it · hung = no majority, or count not final
                  won = a winner is reported; whether power changed is not stated in the source · nr = result not read
   ahead    [date, country, what]         force  [date, country, what happened, sources]
   ============================================================ */
window.ARCHIVUS_SITUATION = {
  meta: { asOf: "2026-11-25", from: "2026-08-27",
    note: "Compiled 25 November 2026. A snapshot: each line carries the date of the report it rests on." },

  kinds: {
    war:      ["War", "#e0502f", "Fighting, strikes and what armies did"],
    talks:    ["Diplomacy", "#e8c455", "Summits, negotiations and agreements"],
    ballot:   ["Ballots", "#49c9b8", "National elections and what they decided"],
    sanction: ["Sanctions", "#b48ef0", "Listings and designations by governments"],
    sea:      ["Straits", "#5b9be0", "Shipping lanes and chokepoints"],
    power:    ["Power", "#ff9a8c", "Governments made, unmade or re-aligned outside a ballot"]
  },

  src: {
    rfa:      ["Radio Free Asia — Trump, Xi, Putin wrap up historic summit with nuclear arms control on agenda", "https://rfa.org/english/china/2026/11/19/trump-xi-putin-apec-summit/", "2026-11-19"],
    scmp:     ["South China Morning Post — main takeaways from the APEC summit: nuclear arms, energy supplies, no Kim", "https://www.scmp.com/news/china/diplomacy/article/3375124/nuclear-arms-energy-supplies-no-kim-main-takeaways-historic-apec-summit", "2026-11-19"],
    wbtv:     ["WBTV — US and Venezuela sign a deal to reestablish military ties, Hegseth says on visit to interim leaders", "https://www.wbtv.com/2026/11/18/us-venezuela-sign-deal-reestablish-military-ties-hegseth-says-visit-interim-leaders/", "2026-11-18"],
    ajukr17:  ["Al Jazeera — Ukraine holds peace talks with US, Europe as conflict escalates", "https://www.aljazeera.com/news/2026/11/17/ukraine-holds-peace-talks-with-us-europe-as-conflict-escalates", "2026-11-17"],
    ajukr12:  ["Al Jazeera — US envoys meet Putin in Moscow to discuss Russia-Ukraine war", "https://www.aljazeera.com/news/2026/11/12/us-envoys-arrive-in-moscow-for-russia-ukraine-talks-with-putin", "2026-11-12"],
    eeas:     ["EU External Action Service — The EU extends sanctions to nearly all major Russian banks", "https://www.eeas.europa.eu/eeas/eu-extends-sanctions-nearly-all-major-russian-banks_en", "2026-11-16"],
    ajiran12: ["Al Jazeera — 'No war, no peace': Can Iran break the deadlock with the US?", "https://www.aljazeera.com/news/2026/11/12/no-war-no-peace-can-iran-break-the-deadlock-with-the-us", "2026-11-12"],
    lloydsH:  ["Lloyd's List Intelligence — Strait of Hormuz Brief, 19 November 2026", "https://www.lloydslistintelligence.com/resources/blog/strait-of-hormuz-brief-19-november-2026", "2026-11-19"],
    lloydsR:  ["Lloyd's List Intelligence — Red Sea Brief, 12 November 2026", "https://www.lloydslistintelligence.com/resources/blog/red-sea-brief---12-november-2026", "2026-11-12"],
    opb:      ["NPR, carried by OPB — No clear winner in New Zealand election, as leaders prepare for weeks of talks", "https://www.opb.org/article/2026/11/08/no-clear-winner-in-new-zealand-election-as-leaders-prepare-for-weeks-of-talks/", "2026-11-08"],
    ap:       ["The Associated Press — election results (the count as relayed on 25 Nov 2026, 6:20pm Pacific)", "https://apnews.com/", "2026-11-25"],
    ajisr:    ["Al Jazeera — Israel election result shows no overall majority as vote count complete", "https://www.aljazeera.com/news/2026/10/29/israel-election-result-shows-no-overall-majority-as-vote-count-complete", "2026-10-29"],
    ajbra:    ["Al Jazeera — Brazil election results 2026: key takeaways from Lula's historic win", "https://www.aljazeera.com/amp/news/2026/10/26/brazil-election-2026-key-takeaways-from-lulas-historic-win", "2026-10-26"],
    axios:    ["Axios — Trump allies fall in two elections as Netanyahu faces next test", "https://axios.com/2026/10/26/trump-allies-brazil-serbia-elections-netanyahu-israel", "2026-10-26"],
    ajswe:    ["Al Jazeera — Sweden prime minister to resign as left-wing bloc seals narrow election win", "https://www.aljazeera.com/news/2026/9/17/sweden-prime-minister-to-resign-as-left-wing-bloc-seals-narrow-election-win", "2026-09-17"],
    pmindia:  ["Prime Minister of India — BRICS New Delhi Declaration (text)", "https://www.pmindia.gov.in/en/news_updates/brics-new-delhi-declaration-building-for-resilience-innovation-cooperation-and-sustainability/", "2026-09-13"],
    ajsco:    ["Al Jazeera — Kyrgyzstan hosts pivotal SCO summit amid global geopolitical shifts", "https://www.aljazeera.com/news/2026/9/3/kyrgyzstan-hosts-pivotal-sco-summit-amid-global-geopolitical-shifts", "2026-09-03"],
    cfrsg:    ["Council on Foreign Relations — Who will be the next UN secretary-general?", "https://www.cfr.org/articles/who-will-be-the-next-un-secretary-general", "2026-11-04"],
    sipri:    ["SIPRI Yearbook 2026, chapter 8 — World nuclear forces (the table for January 2026)", "https://www.sipri.org/sites/default/files/YB26%2008%20World%20Nuclear%20Forces.pdf", "2026-06"],
    sipripr:  ["SIPRI — Increasing focus on nuclear weapons amid heightened escalation risks: new Yearbook out now", "https://www.sipri.org/media/press-release/2026/increasing-focus-nuclear-weapons-amid-heightened-escalation-risks-new-sipri-yearbook-out-now", "2026-06"],
    ofac:     ["US Treasury, Office of Foreign Assets Control — Sanctions programs and country information", "https://ofac.treasury.gov/sanctions-programs-and-country-information", "2026-11-23"],
    eusan:    ["EU External Action Service — EU restrictive measures, 2026 brief (PDF)", "https://www.eeas.europa.eu/sites/default/files/2026/documents/2026_9_10_restrictive_measures_2.pdf", "2026"],
    nato:     ["NATO — Member countries", "https://www.nato.int/cps/en/natohq/topics_52044.htm", "2026"],
    eu:       ["European Union — EU countries", "https://european-union.europa.eu/principles-countries-history/country-profiles_en", "2026"],
    brics:    ["BRICS Brasil — About the BRICS: members and partner countries", "https://brics.br/en/about-the-brics", "2025"],
    csto:     ["The Times of Central Asia — CSTO members adopt new security agreements as Armenia boycotts Bishkek summit", "https://timesca.com/csto-members-adopt-new-security-agreements-as-armenia-boycotts-bishkek-summit/", "2025-11"],
    aes:      ["Al Jazeera — A marriage of three: Will Mali, Niger, Burkina Faso bloc reshape the Sahel?", "https://www.aljazeera.com/features/2025/12/31/a-marriage-of-three-will-mali-niger-burkina-faso-bloc-reshape-the-sahel", "2025-12-31"],
    aes2:     ["allAfrica — The Alliance of Sahel States launches unified military force and strengthens regional security", "https://allafrica.com/stories/202512300003.html", "2025-12-30"],
    ifes:     ["IFES Election Guide — elections held", "https://www.electionguide.org/elections/type/helddays", "2026-11"],
    ifesup:   ["IFES Election Guide — upcoming elections", "https://www.electionguide.org/elections/type/upcoming/", "2026-11"],
    opovo:    ["O Povo — Quem venceu as eleições em 2026? Results around the world (in Portuguese)", "https://www.opovo.com.br/noticias/politica/eleicoes/2026/08/06/amp/quem-venceu-as-eleicoes-em-2026-veja-resultados-pelo-mundo.html", "2026-08-06"],
    cbs:      ["CBS News — Hungarian Prime Minister Viktor Orbán concedes defeat in key election, ending 16 years in power", "https://www.cbsnews.com/amp/news/hungary-general-election-viktor-orban-peter-magyar-results/", "2026-04"],
    bdgb:     ["bdnews24 — Guinea-Bissau's soldiers seize power, and the other recent coups in West and Central Africa", "https://bdnews24.com/world/africa/2b6e8fea49e1", "2025-11"]
  },

  /* ---------------- the blocs ---------------- */
  blocs: [
    { id: "nato", n: "NATO", full: "North Atlantic Treaty Organization", c: "#5b9be0", kind: "Military alliance", s: ["nato"],
      note: "Thirty-two members bound by a mutual-defence clause. Sweden, the newest, joined in 2024.",
      members: ["Albania", "Belgium", "Bulgaria", "Canada", "Croatia", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Montenegro", "Netherlands", "Macedonia", "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Turkey", "United Kingdom", "United States of America"] },
    { id: "csto", n: "CSTO", full: "Collective Security Treaty Organization", c: "#e0502f", kind: "Military alliance", s: ["csto"],
      note: "Russia's alliance of six. Armenia has boycotted its summits two years running, objecting that the alliance would not act in its conflict with Azerbaijan; Russia holds the chair for 2026.",
      members: ["Russia", "Belarus", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Armenia"] },
    { id: "sco", n: "SCO", full: "Shanghai Cooperation Organisation", c: "#e08a3c", kind: "Security and political forum", s: ["ajsco"],
      note: "Ten governments were at the table in Bishkek on 1 September 2026. A forum, not a defence pact: India and Pakistan both sit in it.",
      members: ["China", "Russia", "India", "Pakistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Uzbekistan", "Iran", "Belarus"] },
    { id: "brics", n: "BRICS", full: "BRICS", c: "#e8c455", kind: "Economic and political grouping", s: ["brics", "pmindia"],
      note: "Eleven members and nine partner countries, as the Brazilian presidency lists them. The declaration of the New Delhi summit (12–13 September 2026) announces no new member.",
      members: ["Brazil", "China", "Egypt", "Ethiopia", "India", "Indonesia", "Iran", "Russia", "Saudi Arabia", "South Africa", "United Arab Emirates"],
      partners: ["Belarus", "Bolivia", "Cuba", "Kazakhstan", "Malaysia", "Nigeria", "Thailand", "Uganda", "Uzbekistan"] },
    { id: "aes", n: "AES", full: "Alliance of Sahel States", c: "#62c073", kind: "Military alliance and confederation", s: ["aes", "aes2"],
      note: "The three junta-led states of the central Sahel, which left the West African bloc ECOWAS and in December 2025 launched a unified military force.",
      members: ["Mali", "Burkina Faso", "Niger"] },
    { id: "eu", n: "EU", full: "European Union", c: "#7f8fe8", kind: "Political and economic union", s: ["eu"],
      note: "Twenty-seven member states. Acts as one on trade and on sanctions.", off: ["Malta"],
      members: ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"] }
  ],

  /* ---------------- sanctions ---------------- */
  sanc: {
    note: "A programme named for a country is not always an embargo of it: several target named persons, companies or sectors there. The date is when the US Treasury last changed the programme's page.",
    us: [
      ["Afghanistan", "Afghanistan-Related Sanctions", "2022-02-25"], ["Belarus", "Belarus Sanctions", "2026-10-21"], ["Myanmar", "Burma-Related Sanctions", "2026-10-09"],
      ["Central African Rep.", "Central African Republic Sanctions", "2023-12-08"], ["Cuba", "Cuba Sanctions", "2026-11-20"], ["Dem. Rep. Congo", "Democratic Republic of the Congo-Related Sanctions", "2026-10-28"],
      ["Iran", "Iran Sanctions", "2026-11-23"], ["Iraq", "Iraq-Related Sanctions", "2026-10-05"], ["Lebanon", "Lebanon-Related Sanctions", "2026-02-27"], ["Libya", "Libya Sanctions", "2026-09-30"],
      ["Mali", "Mali-Related Sanctions", "2026-05-28"], ["Nicaragua", "Nicaragua-related Sanctions", "2026-04-16"], ["North Korea", "North Korea Sanctions", "2026-10-28"],
      ["Russia", "Russian Harmful Foreign Activities Sanctions", "2026-11-19"], ["Somalia", "Somalia Sanctions", "2023-05-24"], ["S. Sudan", "South Sudan-Related Sanctions", "2023-12-08"],
      ["Sudan", "Sudan and Darfur Sanctions", "2026-06-26"], ["Syria", "Promoting Accountability for Assad and Regional Stabilization Sanctions", "2026-09-24"],
      ["Venezuela", "Venezuela-Related Sanctions", "2026-11-04"], ["Yemen", "Yemen-related Sanctions", "2021-11-18"]
    ],
    usOff: [["Western Balkans", "Balkans-Related Sanctions", "2025-11-20"], ["Hong Kong", "Hong Kong-Related Sanctions", "2026-07-17"], ["Ukraine (occupied areas) and Russia", "Ukraine-/Russia-related Sanctions", "2026-10-09"]],
    eu: ["Russia", "Iran", "Syria", "North Korea", "Venezuela", "Guatemala"],
    euNote: "The six the EU's own 2026 brief names. The Union's full list of regimes is longer; this page shows only those read."
  },

  /* ---------------- nuclear arsenals: SIPRI, January 2026 ---------------- */
  nukes: {
    s: ["sipri", "sipripr"],
    note: "Estimates for January 2026. Deployed = on missiles or at bases with operational forces. SIPRI counts 12,187 warheads in all, 9,745 of them in military stockpiles and about 4,012 deployed. New START expired in February 2026, and the review conference of the Non-Proliferation Treaty ended on 22 May 2026 without an agreed text, the third in a row to do so.",
    world: [4012, 5733, 9745, 12187],
    list: [
      ["Russia", 1796, 2604, 4400, 5420, 58, 62], ["United States of America", 1770, 1930, 3700, 5042, 39, -98], ["China", 34, 586, 620, 620, 35, 104],
      ["France", 280, 10, 290, 370, 46.6, 2.4], ["United Kingdom", 120, 105, 225, 225, 53.5, -1.8], ["India", 12, 178, 190, 190, 22, 79],
      ["Pakistan", 0, 170, 170, 170, 29.5, 69.3], ["Israel", 0, 90, 90, 90, 31.3, 34.9], ["North Korea", 0, 60, 60, 60, 40, 127]
    ]
  },

  /* ---------------- straits and chokepoints ---------------- */
  status: { contested: ["Contested", "#ff5f4a"], strained: ["Strained", "#e8c455"], recovering: ["Recovering", "#49c9b8"], pressed: ["Under pressure", "#5b9be0"] },
  straits: [
    { id: "hormuz", n: "Strait of Hormuz", at: [26.57, 56.25], status: "contested", cf: "iran", s: ["lloydsH", "ajiran12"],
      line: "The United States blockades Iran's ports; Iran claims the say over who passes, and ships on routes it has not authorised are attacked.",
      figs: [["Transits, October 2026", "550 — the most in any month since the war began in February"], ["Transits, September 2026", "504"], ["Attack events since the war began", "163, to 11 Nov (UK Maritime Trade Operations)"],
             ["Turned back by the US blockade", "147 commercial vessels; five disabled (US Central Command)"], ["One weekend", "five commodity vessels crossed on 7 Nov, none on 8 Nov (Kpler)"]] },
    { id: "bab", n: "Bab el-Mandeb", at: [12.6, 43.35], status: "strained", cf: "yemen", s: ["lloydsR"],
      line: "Traffic is returning but is still well under what it was before the Houthi campaign; the threat is rated substantial.",
      figs: [["Transits, October 2026", "1,363 — up 43% on a year earlier"], ["Against the level before the crisis", "46% lower"], ["Last recorded attack", "24 August 2026 (UK Maritime Trade Operations)"], ["6 November", "a large explosion of unknown cause seen in the strait"]] },
    { id: "suez", n: "Suez Canal", at: [30.45, 32.35], status: "recovering", cf: "yemen", s: ["lloydsR"],
      line: "A fifth month running at a post-crisis high. Crude tankers are back above the old average, a third of the large ones under sanctions; container lines are returning.",
      figs: [["Transits, October 2026", "1,338 — up 63% on a year earlier"], ["Against the average before the crisis", "34% lower (2,009 a month in Jan–Nov 2023)"], ["Containerships, October", "426, about half with tracking switched off"], ["Returned", "Evergreen, after nearly three years away"]] },
    { id: "taiwan", n: "Taiwan Strait", at: [24.3, 119.4], status: "pressed", cf: "taiwan", s: ["aei"],
      line: "Open to shipping, under continuous Chinese military pressure.",
      figs: [["2 November 2026", "49 Chinese air sorties counted by Taiwan"], ["3 November 2026", "more than 100 Chinese navy and coast-guard vessels reported in the western Pacific"]] },
    { id: "kerch", n: "Kerch Strait and the Crimea Bridge", at: [45.3, 36.5], status: "contested", cf: "ukraine", s: ["ajukr17"],
      line: "The bridge that ties Crimea to Russia is a standing target of Ukrainian strikes.",
      figs: [["16–17 November 2026", "the Crimea Bridge was struck again overnight"]] },
    { id: "scarborough", n: "Scarborough Shoal", at: [15.15, 117.75], status: "pressed", cf: "scs", s: ["cfrScs"],
      line: "China and the Philippines contest the shoal with coast guards, drills and patrols.",
      figs: [["27 September 2026", "a Chinese drill at the shoal"], ["30 October 2026", "China announced 'readiness patrols' there"]] }
  ],

  /* ---------------- the wire: ninety days of dated events, newest first ---------------- */
  wire: [
    { id: "trilateral", d: "2026-11-19", k: "talks", t: "Trump, Xi and Putin meet as three for the first time", at: [22.55, 114.1], w: ["China", "United States of America", "Russia"], s: ["rfa", "scmp"],
      x: "On the sidelines of the APEC summit in Shenzhen (18–19 Nov) the three presidents met for more than an hour. They reaffirmed that a nuclear war cannot be won and must never be fought, and agreed to hold dialogues on preventing proliferation and reducing nuclear risk. No arms-control agreement was announced; a joint statement pledged a larger supply of refined petroleum products." },
    { id: "trump-xi", d: "2026-11-19", k: "talks", t: "Trump and Xi: a third meeting this year", at: [23.6, 113.2], w: ["China", "United States of America", "Taiwan"], s: ["rfa"],
      x: "By the Chinese state agency's account Xi pressed Washington on Taiwan and Trump said the United States does not support Taiwan independence; the White House had not published its own account. The trade truce agreed last year runs out on 10 January 2027, and no new agreement on trade or military channels was reported." },
    { id: "hormuz-brief", d: "2026-11-19", k: "sea", t: "Hormuz: traffic at a wartime high, attacks go on", at: [26.57, 56.25], w: ["Iran", "Oman", "United Arab Emirates"], s: ["lloydsH"], cf: "iran",
      x: "550 ships passed in October, the most in any month since the war began in February. British naval monitors have logged 163 attack events, seven of them between 5 and 11 November; US Central Command says 147 commercial vessels have been turned back under the blockade and five disabled." },
    { id: "caracas", d: "2026-11-18", k: "power", t: "Washington and Caracas restore military ties", at: [10.5, -66.9], w: ["Venezuela", "United States of America"], s: ["wbtv"], cf: "caribbean",
      x: "Defense Secretary Hegseth said in Caracas that the two countries had signed a deal on joint training and intelligence sharing. US forces captured Nicolás Maduro in January; his ally Delcy Rodríguez remains acting president although the term a court allowed her ran out in July. No date is set for a presidential election. The opposition leader María Corina Machado has returned from exile." },
    { id: "kyiv-talks", d: "2026-11-17", k: "war", t: "Ukraine's talks widen; the largest drone raid on Russia", at: [50.45, 30.5], w: ["Ukraine", "Russia"], s: ["ajukr17"], cf: "ukraine",
      x: "Ukraine held talks online with the US envoys Witkoff and Kushner, joined by France, Germany, Britain, Italy and Poland. Ukraine struck a bridge and oil refineries in Russia in what Moscow called the largest overnight drone attack since 2022; the Crimea Bridge was hit again, and bridges in Kyiv were struck. The Kremlin has not agreed to widen the talks beyond the three delegations." },
    { id: "eu-113", d: "2026-11-16", k: "sanction", t: "The EU lists 113 more people and firms over Russia's war", at: [50.85, 4.35], w: ["Russia", "Belgium"], s: ["eeas"], cf: "ukraine",
      x: "Nearly 50 more Russian banks and financial institutions were listed, on top of more than 100 already under EU sanctions, with oil producers and refiners, the St Petersburg oil terminal, and buyers of Russian crude in the UAE, China, the Seychelles and Oman." },
    { id: "khuwai", d: "2026-11-13", k: "war", t: "Sudan's army takes al-Khuwai", at: [13.08, 29.23], w: ["Sudan"], s: ["ajsudan"], cf: "sudan",
      x: "The army took al-Khuwai in West Kordofan and has broken the siege of El Obeid. Analysts say the Rapid Support Forces, who hold all five Darfur states, have gone over to the defensive there." },
    { id: "badme", d: "2026-11-13", k: "war", t: "Ethiopia and Eritrea trade artillery fire", at: [14.72, 37.8], w: ["Ethiopia", "Eritrea"], s: ["ctpEth"], cf: "ethiopia",
      x: "The two armies exchanged artillery fire around Badme on 11–13 November while federal and Tigrayan forces fought around Rama, Gomahalo and Semema. Each government accuses the other; the G7 has called for restraint." },
    { id: "lebanon-fire", d: "2026-11-13", k: "war", t: "Israeli fire on southern Lebanon", at: [33.2, 35.35], w: ["Lebanon", "Israel"], s: ["cfrLeb"], cf: "lebanon",
      x: "Lebanese state media reported Israeli artillery and tank fire on Majdal Zoun, Bayt al-Sayyad and Mayfadoun. Israel holds roughly a fifth of Lebanese territory." },
    { id: "guatemala-fto", d: "2026-11-13", k: "sanction", t: "Washington designates Guatemalan groups as terrorist organisations", at: [14.6, -90.5], w: ["Guatemala", "United States of America"], s: ["ftogt"], cf: "triangle",
      x: "The State Department announced foreign-terrorist designations of Guatemalan groups." },
    { id: "moscow-envoys", d: "2026-11-12", k: "talks", t: "US envoys see Putin in Moscow", at: [55.75, 37.6], w: ["Russia", "Ukraine", "United States of America"], s: ["ajukr12", "ajukr17"], cf: "ukraine",
      x: "The meeting followed the first three-way session of American, Ukrainian and Russian officials in nine months, in Abu Dhabi, which produced an agreement to exchange prisoners and no breakthrough. There is no ceasefire." },
    { id: "iran-deadlock", d: "2026-11-12", k: "talks", t: "Iran: no war, no peace", at: [32.6, 53.4], w: ["Iran", "United States of America", "Qatar"], s: ["ajiran12"], cf: "iran",
      x: "Full-scale fighting is on hold without a peace deal. The United States keeps its naval blockade of Iran's ports and has tightened sanctions; Iran has set seven conditions before talks restart through Qatar, among them an end to the blockade, relief from sanctions and a formal end to the war. Secretary of State Rubio called the demands unacceptable." },
    { id: "redsea-brief", d: "2026-11-12", k: "sea", t: "The Red Sea: ships return, slowly", at: [12.6, 43.35], w: ["Yemen", "Egypt", "Djibouti"], s: ["lloydsR"], cf: "yemen",
      x: "Suez Canal transits reached 1,338 in October, a fifth straight post-crisis high and still 34% below the level before the Houthi campaign; Bab el-Mandeb saw 1,363, 46% below. No attack is recorded since 24 August. A large explosion of unknown cause was seen in the strait on 6 November." },
    { id: "yemen-fronts", d: "2026-11-12", k: "war", t: "Fighting spreads across Yemen", at: [15.5, 45.3], w: ["Yemen", "Saudi Arabia"], s: ["ajyemen"], cf: "yemen",
      x: "Fighting intensified across al-Jawf, Marib, al-Bayda, Taiz, Lahij and al-Dhale, and Houthi shelling hit Aden. Saudi Arabia says it intercepted cruise missiles aimed at Riyadh and drones aimed at Mecca province; the Houthis deny targeting Mecca." },
    { id: "haiti-toll", d: "2026-11-12", k: "war", t: "Haiti: more than a thousand killed in three months", at: [18.55, -72.3], w: ["Haiti"], s: ["unhti"], cf: "haiti",
      x: "The UN counted at least 1,167 people killed between July and September, more than half of them in security-force operations, and 44 cases of summary execution or attempts at it involving the police." },
    { id: "kabila-front", d: "2026-11-11", k: "war", t: "Congo's rebel front advances under Kabila", at: [-2.6, 28.8], w: ["Dem. Rep. Congo"], s: ["cfrDrc"], cf: "drc",
      x: "The rebel front, now merged under the former president Joseph Kabila, advanced in South Kivu and was added to the UN sanctions list. Attacks by the ADF in Mambasa, Ituri, killed at least 22 the same day." },
    { id: "mandera", d: "2026-11-10", k: "war", t: "An ambush in Kenya as the African Union's Somalia mission falters", at: [3.93, 41.86], w: ["Kenya", "Somalia"], s: ["cfrSom"], cf: "somalia",
      x: "A suspected al-Shabaab ambush killed eight in Mandera county. Washington has said it will end logistical support for the African Union mission after December 2026, and the mission's end date has been brought forward." },
    { id: "myanmar-hq", d: "2026-11-10", k: "war", t: "Myanmar's army claims a rebel headquarters", at: [16.2, 97.7], w: ["Myanmar"], s: ["cfrMya"], cf: "myanmar",
      x: "The army said it had taken a rebel headquarters and several bases in the south. Resistance forces and ethnic armies control about 42% of the country against the army's 21%." },
    { id: "qeshm", d: "2026-11-09", k: "war", t: "US strikes hit Qeshm island", at: [26.85, 55.9], w: ["Iran", "United States of America"], s: ["ajiran", "cfrIran"], cf: "iran",
      x: "The strikes came on the night of 8–9 November; Washington called earlier strikes defensive. Iranian state television says 11 tankers were attacked in ten days in Hormuz." },
    { id: "khor-mor", d: "2026-11-08", k: "war", t: "A drone strike stops the Khor Mor gas field", at: [35.1, 44.85], w: ["Iraq"], s: ["cfrIrq"], cf: "iraq",
      x: "The field in Iraqi Kurdistan stopped work after the strike; four days earlier drones hit Iranian Kurdish opposition groups in Erbil and Sulaymaniyah." },
    { id: "jalisco-raid", d: "2026-11-08", k: "war", t: "Mexico arrests an alleged Jalisco cell leader", at: [20.67, -103.35], w: ["Mexico"], s: ["cfrMex"], cf: "mexico",
      x: "A raid arrested the alleged cell leader and nineteen others. Mexican forces, with US intelligence, killed the cartel's leader in February 2026." },
    { id: "nz-vote", d: "2026-11-08", k: "ballot", t: "New Zealand: no clear winner", at: [-41.3, 174.8], w: ["New Zealand"], s: ["opb"],
      x: "The preliminary count of the 7 November election: National 42 seats, Labour 36, the Greens 16, ACT 13, New Zealand First 12, the Opportunity Party 7 and Te Pāti Māori 5, of 131. The three parties of the outgoing government have 67 between them, one more than a majority, with about 400,000 special votes still to count; the final tally is due on 27 November." },
    { id: "gaza-count", d: "2026-11-07", k: "war", t: "Gaza: 1,610 killed since the ceasefire", at: [31.4, 34.38], w: ["Palestine", "Israel"], s: ["wafa", "ajgaza"], cf: "gaza",
      x: "Gaza's Health Ministry counts 1,610 people killed since the ceasefire of October 2025 began. Six were killed in a strike on the Nasser medical complex in November; raids continued in the West Bank at Marda, Nablus and Jenin." },
    { id: "bamako", d: "2026-11-05", k: "war", t: "Bamako under a fuel blockade", at: [12.65, -8.0], w: ["Mali"], s: ["cfrSah"], cf: "sahel",
      x: "JNIM has turned to economic warfare: a fuel and transport blockade of western Mali that cut the roads to Bamako and left the capital short of fuel. Both jihadist groups are pushing south into Benin and north-western Nigeria." },
    { id: "un-sg", d: "2026-11-04", k: "talks", t: "Eight candidates to lead the United Nations", at: [40.75, -73.97], w: ["United States of America"], s: ["cfrsg"],
      x: "Eight people are running to succeed António Guterres, among them Rafael Grossi of the atomic agency, Rebeca Grynspan, María Fernanda Espinosa and Lana Nusseibeh. As of 4 November no recommendation by the Security Council was reported. The new Secretary-General takes office on 1 January 2027." },
    { id: "kim-apec", d: "2026-11-04", k: "talks", t: "Pyongyang turns down a meeting at APEC", at: [39.03, 125.75], w: ["North Korea", "United States of America"], s: ["aei", "cfrKor"], cf: "korea",
      x: "Kim Yo Jong rejected an American invitation to meet at the APEC summit. North Korea held a live-fire drill on 14 September and commissioned a second destroyer." },
    { id: "us-midterms", d: "2026-11-03", k: "ballot", t: "The United States votes for a new Congress", at: [38.9, -77.03], w: ["United States of America"], s: ["ap"],
      x: "The Associated Press's count as it stood on 25 November (6:20pm Pacific): in the House, Democrats 259 seats won and Republicans 173, with 3 seats given to neither party in that count; in the Senate, Democrats 56 in total (22 won, 34 holdovers; the total includes 2 others who caucus with them) and Republicans 44 (13 won, 31 holdovers). The counts may have changed since." },
    { id: "taiwan-fleet", d: "2026-11-03", k: "war", t: "More than a hundred Chinese vessels in the western Pacific", at: [24.3, 119.4], w: ["Taiwan", "China"], s: ["aei"], cf: "taiwan",
      x: "Taiwan counted 49 Chinese air sorties on 2 November and reported more than 100 navy and coast-guard vessels the next day; analysts believe an unannounced exercise larger than 'Justice Mission 2025' is under way." },
    { id: "torkham", d: "2026-11-01", k: "war", t: "Afghan and Pakistani armies clash on the border", at: [34.12, 71.1], w: ["Afghanistan", "Pakistan"], s: ["lwj"], cf: "afpak",
      x: "The two armies clashed at Angoor Adda and near the Torkham crossing between 29 October and 1 November. No ceasefire is in force." },
    { id: "scarborough-patrols", d: "2026-10-30", k: "sea", t: "China announces 'readiness patrols' at Scarborough Shoal", at: [15.15, 117.75], w: ["Philippines", "China"], s: ["cfrScs"], cf: "scs",
      x: "The announcement followed a drill at the shoal on 27 September. China and the Philippines clashed three times in one week in July." },
    { id: "israel-vote", d: "2026-10-29", k: "ballot", t: "Israel: no bloc reaches a majority", at: [31.78, 35.2], w: ["Israel"], s: ["ajisr"],
      x: "The provisional result of the 27 October election, with more than 99% counted: Netanyahu's bloc 53 of 120 seats, the opposition bloc led by Gadi Eisenkot 48, the Arab-led lists 19. Sixty-one are needed to govern." },
    { id: "brazil-vote", d: "2026-10-25", k: "ballot", t: "Brazil re-elects Lula", at: [-15.8, -47.9], w: ["Brazil"], s: ["ajbra", "axios"],
      x: "Lula won the runoff with just over 51% to Flávio Bolsonaro's 48%. Bolsonaro refused to recognise the result and said he would seek to have the vote annulled." },
    { id: "serbia-vote", d: "2026-10-25", k: "ballot", t: "Serbia: Vučić's party loses", at: [44.8, 20.47], w: ["Serbia"], s: ["axios"],
      x: "A student-led opposition movement defeated the party of Aleksandar Vučić, who had sought to become prime minister. He conceded." },
    { id: "pkk-camps", d: "2026-10-15", approx: 1, k: "power", t: "PKK fighters leave four camps in northern Iraq", at: [36.9, 43.9], w: ["Iraq", "Turkey"], s: ["cfrTur"], cf: "pkk",
      x: "The withdrawal followed a Turkish law of August 2026 setting the terms of disbandment and reintegration. Kurdish parties say Ankara has not delivered the reforms it promised." },
    { id: "congo-ebola", d: "2026-09-29", k: "war", t: "The UN hears that Congo's peace deals have not stopped the fighting", at: [1.4, 29.6], w: ["Dem. Rep. Congo"], s: ["undrc"], cf: "drc",
      x: "The Security Council was told the fighting in the east goes on. The same provinces are in the grip of the country's largest Ebola outbreak: 3,901 deaths by 26 September." },
    { id: "sweden-vote", d: "2026-09-17", k: "ballot", t: "Sweden changes government", at: [59.33, 18.07], w: ["Sweden"], s: ["ajswe"],
      x: "The four left-leaning opposition parties won 176 of 349 seats to the governing bloc's 173 in the election of 13 September. Prime Minister Kristersson said he would resign; Magdalena Andersson of the Social Democrats is the likely successor. The Sweden Democrats fell to 17.5%, their first loss of support since entering parliament." },
    { id: "arabian-sea", d: "2026-09-15", k: "war", t: "Indian and Pakistani warships collide", at: [22.6, 66.4], w: ["India", "Pakistan"], s: ["cfrInd"], cf: "kashmir",
      x: "An Indian destroyer and a Pakistani patrol vessel collided in the Arabian Sea. The ceasefire of May 2025 has held." },
    { id: "brics-delhi", d: "2026-09-12", k: "talks", t: "BRICS meets in New Delhi", at: [28.61, 77.21], w: ["India", "Brazil", "Russia", "China", "South Africa"], s: ["pmindia"],
      x: "The eighteenth summit (12–13 September) condemned unilateral and secondary sanctions, backed settling trade in local currencies and called for reform of the UN Security Council. Its declaration voiced deep concern at tensions in West Asia and condemned attacks on nuclear facilities under international safeguards." },
    { id: "brega", d: "2026-09-03", k: "war", t: "A drone hits Tripoli's fuel depot", at: [32.88, 13.19], w: ["Libya"], s: ["cfrLby"], cf: "libya",
      x: "A drone struck the Brega fuel depot in Tripoli; later in the month an armed group shut a valve on the El Sharara pipeline, cutting production." },
    { id: "sco-bishkek", d: "2026-09-01", k: "talks", t: "The Shanghai group meets in Bishkek", at: [42.87, 74.6], w: ["Kyrgyzstan", "China", "Russia", "India", "Iran"], s: ["ajsco"],
      x: "Ten heads of state and government attended, among them Putin, Xi and Modi. Iran's president said Tehran would reciprocate if the United States returned to its commitments under the June memorandum signed in Islamabad, which has since broken down." }
  ],

  /* ---------------- ballots of 2026 ---------------- */
  ballots: [
    ["2026-01-15", "Uganda", "President and parliament", "Yoweri Museveni won a seventh term.", "held", ["ifes", "opovo"]],
    ["2026-02-01", "Costa Rica", "President and assembly", "Laura Fernández won; she succeeds Rodrigo Chaves.", "won", ["ifes", "opovo"]],
    ["2026-02-08", "Portugal", "President, second round", "António José Seguro was elected.", "won", ["ifes", "opovo"]],
    ["2026-02-08", "Japan", "House of Representatives", "", "nr", ["ifes"]],
    ["2026-02-08", "Thailand", "House of Representatives", "Bhumjaithai, the party of Prime Minister Anutin, came first.", "won", ["ifes", "opovo"]],
    ["2026-02-12", "Bangladesh", "Parliament", "The Bangladesh Nationalist Party won.", "won", ["ifes", "opovo"]],
    ["2026-03-05", "Nepal", "House of Representatives", "The Rastriya Swatantra Party won; Balendra Shah was named prime minister.", "new", ["ifes", "opovo"]],
    ["2026-03-15", "Congo", "President", "Denis Sassou Nguesso was re-elected.", "held", ["ifes", "opovo"]],
    ["2026-03-15", "Vietnam", "National Assembly", "The assembly was returned under the Communist Party; To Lam was elected president in April.", "held", ["ifes", "opovo"]],
    ["2026-03-22", "Slovenia", "National Assembly", "Janez Janša was elected prime minister.", "won", ["ifes", "opovo"]],
    ["2026-03-24", "Denmark", "Parliament", "Mette Frederiksen formed a new coalition and kept office.", "held", ["ifes", "opovo"]],
    ["2026-04-10", "Djibouti", "President", "Ismail Omar Guelleh was re-elected.", "held", ["ifes", "opovo"]],
    ["2026-04-12", "Hungary", "National Assembly", "Péter Magyar's Tisza defeated Viktor Orbán, who conceded after 16 years in power.", "new", ["cbs", "opovo", "axios"]],
    ["2026-04-12", "Benin", "President", "Romuald Wadagni succeeded Patrice Talon.", "won", ["ifes", "opovo"]],
    ["2026-04-19", "Bulgaria", "National Assembly", "", "nr", ["ifes"]],
    ["2026-05-17", "Cabo Verde", "National Assembly", "The PAICV returned to power after ten years.", "new", ["ifes", "opovo"]],
    ["2026-05-24", "Cyprus", "House of Representatives", "The centre-right DISY came first.", "won", ["ifes", "opovo"]],
    ["2026-06-01", "Ethiopia", "House of People's Representatives", "Abiy Ahmed's Prosperity Party won.", "held", ["ifes", "opovo"]],
    ["2026-06-07", "Armenia", "National Assembly", "Nikol Pashinyan's Civil Contract won.", "held", ["ifes", "opovo"]],
    ["2026-06-07", "Kosovo", "Assembly", "Albin Kurti's Vetëvendosje won.", "won", ["ifes", "opovo"]],
    ["2026-06-07", "Peru", "President, runoff", "Keiko Fujimori won.", "won", ["ifes", "opovo"]],
    ["2026-06-21", "Colombia", "President, runoff", "Abelardo de la Espriella, of the right, won.", "won", ["ifes", "opovo", "axios"]],
    ["2026-07-02", "Algeria", "National People's Assembly", "The FLN took the most votes.", "held", ["ifes", "opovo"]],
    ["2026-08-13", "Zambia", "President and assembly", "", "nr", ["ifes"]],
    ["2026-09-13", "Sweden", "Parliament", "The left-leaning opposition won 176 seats to 173; Prime Minister Kristersson resigned.", "new", ["ajswe"]],
    ["2026-09-18", "Russia", "State Duma", "", "nr", ["ifes"]],
    ["2026-09-23", "Morocco", "Chamber of Representatives", "", "nr", ["ifes"]],
    ["2026-10-03", "Latvia", "Parliament", "", "nr", ["ifes"]],
    ["2026-10-04", "Bosnia and Herz.", "Presidency and House of Representatives", "", "nr", ["ifes"]],
    ["2026-10-25", "Brazil", "President, runoff", "Lula was re-elected with just over 51%; Flávio Bolsonaro did not recognise the result.", "held", ["ajbra"]],
    ["2026-10-25", "Serbia", "National Assembly", "A student-led opposition movement defeated Aleksandar Vučić's party; he conceded.", "new", ["axios"]],
    ["2026-10-27", "Israel", "Knesset", "Netanyahu's bloc 53, the opposition 48, Arab-led lists 19; no bloc has the 61 needed.", "hung", ["ajisr"]],
    ["2026-11-01", "Bulgaria", "President, second round", "", "nr", ["ifes"]],
    ["2026-11-03", "United States of America", "House and a third of the Senate", "AP's count on 25 Nov: House — Democrats 259 won, Republicans 173, 3 given to neither; Senate — Democrats 56 in total, Republicans 44.", "won", ["ap"]],
    ["2026-11-07", "New Zealand", "House of Representatives", "No clear winner on the preliminary count; the final tally is due on 27 November.", "hung", ["opb"]]
  ],
  ahead: [
    ["2026-12-05", "Gambia", "President"], ["2026-12-24", "Fiji", "Parliament"], ["2026-12-27", "Serbia", "President"], ["2027-01-16", "Nigeria", "President and National Assembly"],
    ["2027-01-27", "Kyrgyzstan", "President"], ["2027-02-11", "S. Sudan", "President and legislature"], ["2027-03-07", "Estonia", "Parliament"], ["2027-03-19", "Mongolia", "President"],
    ["2027-04-15", "Somalia", "House of the People"], ["2027-04-18", "Finland", "Parliament"], ["2027-04-18", "France", "President"], ["2027-07-18", "Haiti", "President and legislature"]
  ],
  force: [
    ["2026-01", "Venezuela", "US forces captured President Nicolás Maduro. Delcy Rodríguez, his ally, has been acting president since; the ruling party remains in power and no election date is set.", ["wbtv"]],
    ["2026-02-28", "Iran", "The opening strikes of the war killed Supreme Leader Ali Khamenei; the Assembly of Experts named his son Mojtaba to succeed him. Parliament's speaker, Mohammad Bagher Ghalibaf, is the chief negotiator.", ["cfrIran", "ajiran12"]],
    ["2025-11-26", "Guinea-Bissau", "Soldiers seized power a day before the results of a presidential election were due, and installed Major-General Horta Inta-a for a transition he said would last one year.", ["bdgb"]]
  ]
};
