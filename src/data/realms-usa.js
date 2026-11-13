/* ============================================================
   ARCHIVUS — the Realms: the United States in detail (v11).
   Hand-written from the sources listed in `src`; read 13 Nov 2026.
   The numbers on this view (index series, component scores) come
   from the generated file src/data/realms.js, not from here.

   House rule for this file: the archive does not pick a side.
   Each dispute is stated as its own side states it, with the
   other side's answer next to it; "where this is heading" is given
   as rival readings with the evidence for and against each, and
   things to watch — not as a prediction.
     tl:     [date, kind, title, text, source]
     kinds:  exec executive power · court the courts · cong Congress & law ·
             vote elections & voting rules · war war & foreign policy ·
             econ trade & economy · unrest protest & political violence ·
             imm immigration & policing
   ============================================================ */
window.ARCHIVUS_REALMS_USA = {
  asOf: "13 November 2026",
  kinds: { exec: ["Executive power", "#e8c455"], court: ["The courts", "#9a7fd1"], cong: ["Congress & law", "#5b93b8"], vote: ["Elections & voting", "#49c9b8"],
           war: ["War & foreign policy", "#d2452f"], econ: ["Trade & economy", "#c9953a"], unrest: ["Protest & violence", "#ff7a66"], imm: ["Immigration & policing", "#8fd6a0"] },
  src: {
    y26: ["Wikipedia — 2026 in the United States", "https://en.wikipedia.org/wiki/2026_in_the_United_States"],
    y25: ["Wikipedia — 2025 in the United States", "https://en.wikipedia.org/wiki/2025_in_the_United_States"],
    iran: ["Wikipedia — 2026 Iran war", "https://en.wikipedia.org/wiki/2026_Iran_war"],
    aj: ["Al Jazeera, 4 Nov 2026 — midterm takeaways (AP count)", "https://www.aljazeera.com/news/2026/11/4/democrats-win-control-of-house-and-senate-key-us-midterms-takeaways"],
    cbs: ["CBS News, 5–7 Nov 2026 — midterm results and aftermath", "https://www.cbsnews.com/live-updates/midterm-election-results-2026-democrats-house-senate-trump/"],
    fh: ["Freedom House, 19 Mar 2026 — Freedom in the World 2026", "https://freedomhouse.org/article/new-report-global-freedom-declined-20th-consecutive-year-2025"],
    vd: ["Democracy Without Borders, 18 Mar 2026 — on V-Dem's Democracy Report 2026", "https://www.democracywithoutborders.org/41651/v-dem-report-finds-global-democracy-is-back-at-1978-levels/"],
    des: ["Deseret News, 5 Nov 2026 — Republicans debate the loss", "https://www.deseret.com/politics/2026/11/05/republicans-debate-reason-for-midterm-loss-as-they-look-ahead-to-2028-nomination/"],
    lse: ["LSE US Politics blog, 6 Nov 2026 — T. Gift, MAGA after Trump", "https://blogs.lse.ac.uk/usappblog/2026/11/06/republicans-midterms-maga-post-trump/"],
    tnr: ["The New Republic, Nov 2026 — progressives and the House majority", "https://newrepublic.com/post/217550/progressive-democrats-house-majority"],
    abc: ["ABC News (Australia), 7 Nov 2026 — the contest inside the Democratic Party", "https://www.abc.net.au/news/2026-11-07/us-midterm-elections-could-start-battle-for-democrats-soul/107354022"],
    gal: ["AP, 12 Jan 2026 — Gallup: record share of independents", "https://abc7news.com/post/gallup-poll-shows-more-americans-are-identify-political-independents/18391678/"],
    lw: ["Levitsky & Way, Journal of Democracy — Competitive Authoritarianism in America", "https://www.journalofdemocracy.org/articles/competitive-authoritarianism-in-america/"],
    cj: ["City Journal — on Trump v. Slaughter and Humphrey's Executor", "https://www.city-journal.org/article/supreme-court-trump-v-slaughter-humphreys-executor"],
    nr: ["National Review, Jun 2026 — a big day for executive power, except at the Fed", "https://www.nationalreview.com/2026/06/a-big-day-for-executive-power-except-at-the-fed/amp/"],
    plf: ["Pacific Legal Foundation — on Trump v. Slaughter", "https://pacificlegal.org/supreme-court-rules-for-presidential-removal-power-in-trump-v-slaughter/"],
    cal: ["Wikipedia — Louisiana v. Callais", "https://en.wikipedia.org/wiki/Louisiana_v._Callais"]
  },

  /* the long run-up, 2000–2024: the disputes of 2025–26 did not begin in 2025 */
  arc: [
    [2000, "court", "Bush v. Gore", "The Supreme Court ends the Florida recount, 5–4, and with it the election.", "w:Bush_v._Gore"],
    [2001, "exec", "11 September and its laws", "The Authorization for Use of Military Force and the Patriot Act widen presidential war-making and surveillance — powers every later president has used.", "w:Patriot_Act"],
    [2008, "econ", "The financial crisis", "Bank rescues under two presidents. The Tea Party on the right and Occupy on the left both date from the aftermath.", "w:2008_financial_crisis"],
    [2010, "court", "Citizens United v. FEC", "Corporate and union spending on elections is protected speech, 5–4; outside spending multiplies.", "w:Citizens_United_v._FEC"],
    [2013, "vote", "Shelby County v. Holder", "The Court ends federal pre-clearance of voting changes in states with a history of discrimination, 5–4.", "w:Shelby_County_v._Holder"],
    [2016, "vote", "Donald Trump elected", "He loses the popular vote and wins the Electoral College on a platform of trade protection and immigration restriction that breaks with his party's orthodoxy.", "w:2016_United_States_presidential_election"],
    [2020, "unrest", "Pandemic, protest and a disputed count", "The largest street protests in decades follow the killing of George Floyd; Joe Biden wins; the loser refuses to concede.", "w:2020_United_States_presidential_election"],
    [2021, "unrest", "6 January", "A crowd of the president's supporters storms the Capitol as Congress counts the electoral votes.", "w:January_6_United_States_Capitol_attack"],
    [2022, "court", "Dobbs v. Jackson", "The Court overrules Roe v. Wade and returns abortion law to the states.", "w:Dobbs_v._Jackson_Women%27s_Health_Organization"],
    [2024, "court", "Trump v. United States", "Presidents have absolute immunity for core constitutional acts and presumptive immunity for other official acts, 6–3.", "w:Trump_v._United_States_(2024)"],
    [2024, "vote", "Trump returns", "After surviving an assassination attempt in July he wins the Electoral College and the popular vote; Republicans take both houses.", "w:2024_United_States_presidential_election"]
  ],

  tl: [
    ["2025-01-20", "exec", "Second inauguration", "On the first day: clemency for some 1,500 people charged over 6 January, an order to end birthright citizenship, and the creation of the Department of Government Efficiency (DOGE) to cut the federal workforce.", "y25"],
    ["2025-04-02", "econ", "\"Liberation Day\" tariffs", "Tariffs on nearly all imports, imposed under a 1977 emergency-powers law never before used for tariffs.", "y25"],
    ["2025-06-07", "imm", "Troops to Los Angeles", "The president federalises the California National Guard over the governor's objection and sends Marines after protests against immigration raids. Guard deployments to Washington follow in August.", "y25"],
    ["2025-06-14", "unrest", "A legislator assassinated; \"No Kings\"", "Minnesota's former House speaker Melissa Hortman and her husband are shot dead at home. The same day sees the first nationwide \"No Kings\" protests.", "y25"],
    ["2025-06-22", "war", "First strikes on Iran", "US aircraft bomb Iranian nuclear sites without a vote in Congress.", "y25"],
    ["2025-06-27", "court", "Trump v. CASA", "The Supreme Court limits the power of single district judges to block a federal policy nationwide.", "y25"],
    ["2025-07-04", "cong", "One Big Beautiful Bill Act", "The year's central law: extends the 2017 tax cuts, adds work requirements to Medicaid, and funds a large expansion of immigration enforcement. Passed without Democratic votes.", "w:One_Big_Beautiful_Bill_Act"],
    ["2025-08-29", "vote", "The redistricting war opens", "Texas redraws its congressional map mid-decade at the president's urging; California answers with Proposition 50, passed in November. Other states follow on both sides.", "y25"],
    ["2025-09-10", "unrest", "Charlie Kirk assassinated", "The conservative activist is shot dead while speaking at a Utah university.", "y25"],
    ["2025-09-25", "exec", "Prosecutions of the president's critics", "Former FBI director James Comey is indicted, then New York's attorney general Letitia James; a judge dismisses both cases in November over the prosecutor's appointment.", "y25"],
    ["2025-10-01", "cong", "The longest shutdown", "Government funding lapses for 43 days in a dispute over health-insurance subsidies.", "y25"],
    ["2025-11-04", "vote", "Off-year elections", "Democrats win the governorships of Virginia and New Jersey; Zohran Mamdani, a democratic socialist, is elected mayor of New York.", "y25"],
    ["2026-01-03", "war", "Maduro captured", "US forces seize Venezuela's president in Caracas (Operation Absolute Resolve).", "y26"],
    ["2026-01-07", "war", "Withdrawal from 66 international bodies", "Followed on 22 January by departure from the World Health Organization.", "y26"],
    ["2026-01-07", "imm", "Minneapolis", "Federal immigration agents shoot and kill Renée Good; a second killing, of Alex Pretti, follows on 24 January.", "y26"],
    ["2026-01-11", "exec", "The Fed chair investigated", "A criminal investigation of Federal Reserve chair Jerome Powell is opened. Kevin Warsh is confirmed as his successor on 13 May, 54–45.", "y26"],
    ["2026-01-28", "vote", "FBI raid in Fulton County", "Agents search the election centre of Georgia's largest county.", "y26"],
    ["2026-02-14", "cong", "Homeland Security shut down", "Funding for the department lapses for 76 days, to 30 April.", "y26"],
    ["2026-02-20", "court", "The tariffs struck down", "Learning Resources v. Trump, 6–3: the emergency-powers law does not authorise tariffs. The next day the president raises a global tariff to 15% under another statute; a trade court rules against a 10% global tariff on 8 May.", "w:Learning_Resources,_Inc._v._Trump"],
    ["2026-02-28", "war", "War with Iran", "US and Israeli strikes kill Supreme Leader Ali Khamenei. Iran closes the Strait of Hormuz; fuel prices rise worldwide. Congress rejects war-powers resolutions on 4–5 March.", "iran"],
    ["2026-03-25", "vote", "Executive orders on voting", "An order requiring proof of citizenship to register, followed on 31 March by one on voter lists and mail ballots. Reports in February had described a draft order declaring an emergency over the elections.", "y26"],
    ["2026-03-28", "unrest", "Third \"No Kings\" protests", "Demonstrations in all fifty states.", "y26"],
    ["2026-04-02", "exec", "The attorney general dismissed", "Pam Bondi is fired; her deputy Todd Blanche acts in her place and is confirmed in August. Three army generals are removed the same day.", "y26"],
    ["2026-04-07", "war", "Ceasefire with Iran", "A two-week truce, amid calls in Congress for impeachment or the 25th Amendment. A naval blockade of Iran follows on 13 April.", "iran"],
    ["2026-04-25", "unrest", "Shooting at the correspondents' dinner", "A gunman opens fire at the White House Correspondents' Dinner; he is charged with attempting to assassinate the president.", "y26"],
    ["2026-04-28", "exec", "Comey indicted again", "A second indictment of the former FBI director.", "y26"],
    ["2026-04-29", "court", "Louisiana v. Callais", "6–3: the Court narrows the use of race in drawing districts under the Voting Rights Act.", "cal"],
    ["2026-06-03", "cong", "Congress moves on the war", "The House passes an Iran war-powers resolution 215–208; on 23 June the Senate votes 50–48 to require an end to operations or its consent.", "y26"],
    ["2026-06-10", "imm", "$70 billion for immigration enforcement", "A funding law for Immigration and Customs Enforcement and the Border Patrol is signed.", "y26"],
    ["2026-06-17", "war", "The Islamabad Memorandum", "The United States and Iran sign a framework agreement; the ceasefire collapses on 8 July and strikes resume until the 25th.", "iran"],
    ["2026-06-29", "court", "Trump v. Slaughter; Trump v. Cook", "6–3: the president may remove members of the Federal Trade Commission at will, against a 1935 precedent that had protected them. 5–4 the same day: governors of the Federal Reserve keep their protection.", "w:Trump_v._Slaughter"],
    ["2026-06-30", "court", "Birthright citizenship upheld", "Trump v. Barbara, 5–4: the Fourteenth Amendment guarantees citizenship by birth; the 2025 order is struck down. The Court also upholds state bans on transgender athletes, 6–3.", "y26"],
    ["2026-07-01", "econ", "The North American trade pact left to lapse", "The administration says it will not renew the USMCA; in August it sets 50% tariffs on Canadian exports.", "y26"],
    ["2026-07-04", "exec", "DOGE closes", "The Department of Government Efficiency shuts down.", "y26"],
    ["2026-11-03", "vote", "The midterms: Democrats take both houses", "With counting still under way the Associated Press had Democrats winning well over 250 House seats (from about 215) and at least 54 Senate seats (from 47), and a majority of governorships. Voters named fuel prices, the cost of living and the Iran war. The president said the Democrats \"did a good job\".", "aj"],
    ["2026-11-05", "cong", "The morning after", "Democratic leaders name their priorities — ending the Iran war, reversing tariffs and the Medicaid restrictions, and investigations — and announce no impeachment plan. The president orders the Justice Department to look into what he calls impeachment threats.", "cbs"]
  ],

  /* live disputes: each side in its own terms */
  topics: [
    { n: "Who decides on war", st: "The Iran war began without a vote in Congress. Both houses later voted to constrain it (House 215–208, Senate 50–48); the incoming Democratic leadership names ending the war as its first priority.",
      a: "The president's constitutional authority as commander-in-chief covers strikes against an adversary pursuing nuclear weapons; presidents of both parties have used force without a declaration since 1950.",
      b: "The Constitution gives the decision for war to Congress. A months-long war, a naval blockade and the killing of a head of state go well beyond the limited strikes earlier presidents defended.", u: ["iran", "y26", "cbs"] },
    { n: "Tariffs and who sets them", st: "The Supreme Court struck down the emergency-powers tariffs in February 2026; the administration re-imposed tariffs under other statutes, and a trade court has ruled against those too. Democrats say they will legislate to reverse them.",
      a: "Decades of free trade hollowed out American industry and left supply chains in the hands of a rival power; tariffs are leverage and revenue, and Congress delegated the power.",
      b: "Tariffs are taxes paid by American households and belong to Congress; using emergency powers for permanent trade policy empties the word \"emergency\".", u: ["y26"] },
    { n: "The president and the executive branch", st: "Trump v. Slaughter (June 2026) lets a president remove the heads of independent agencies at will; Trump v. Cook the same day protects the Federal Reserve. DOGE cut the federal workforce for eighteen months before closing.",
      a: "The Constitution vests the executive power in one elected president. Agencies that make rules and punish citizens yet answer to no one elected are the anomaly; restoring control restores accountability to voters.",
      b: "Independence was built so that prosecutors, regulators and central bankers would not serve a president's personal or partisan ends. Removing it — together with the dismissal of inspectors general and career staff — concentrates power the founders divided.", u: ["cj", "nr", "plf", "y26"] },
    { n: "The Justice Department and political opponents", st: "A former FBI director has been indicted twice and a state attorney general once; the Fed chair was placed under criminal investigation; the attorney general herself was dismissed in April 2026.",
      a: "The prosecutions of Donald Trump in 2023–24 were the original weaponisation of justice; holding those officials to account is not persecution, and no one is above the law.",
      b: "A president publicly directing the prosecution of named critics breaks the post-Watergate separation between the White House and criminal cases; Freedom House cites reprisals for non-violent speech in its downgrade.", u: ["y25", "y26", "fh"] },
    { n: "Immigration enforcement", st: "Enforcement funding was greatly expanded in 2025 and again in June 2026; National Guard troops were sent to several cities; two people were killed by federal agents in Minneapolis in January 2026; the Supreme Court upheld birthright citizenship, 5–4.",
      a: "The 2024 election was a mandate to end illegal migration and remove those with no right to stay; states and cities that obstruct federal law made federal force necessary.",
      b: "Masked agents, military deployments against the wishes of governors, and deaths in custody and on the street are incompatible with due process; the birthright order tried to rewrite the Constitution by decree.", u: ["y26", "y25"] },
    { n: "The rules of elections", st: "Executive orders on proof of citizenship and mail ballots are in litigation; the SAVE America Act had not been enacted when last reported; both parties redrew congressional maps mid-decade; Louisiana v. Callais narrowed the Voting Rights Act. The 2026 midterms were held on schedule and the result was accepted.",
      a: "Only citizens should vote and voters should prove who they are; most democracies require it. Mid-decade redistricting is hardball both parties play.",
      b: "Non-citizen voting is vanishingly rare and documentary requirements would bar millions of eligible citizens; election rules belong to the states and Congress, not to presidential order.", u: ["y26", "cal", "aj"] },
    { n: "Health care and the safety net", st: "The 2025 budget law added work requirements to Medicaid; enhanced insurance subsidies lapsed at the end of 2025. Democrats name reversing the Medicaid restrictions as a priority for 2027.",
      a: "Work requirements restore the programme to the people it was built for and slow unsustainable spending.",
      b: "The requirements remove coverage mostly through paperwork rather than employment, to finance tax cuts weighted to high earners.", u: ["y25", "cbs"] },
    { n: "Political violence", st: "Since mid-2024: two attempts on Donald Trump's life, the assassinations of Melissa Hortman and Charlie Kirk, and the shooting at the 2026 correspondents' dinner. V-Dem's expert score for political violence in the United States has doubled since 2015.",
      a: "Each side sees the other as the source: the right points to attacks on the president, on Kirk and on immigration officers.",
      b: "The left points to the 6 January pardons, to the killing of Hortman, and to deaths at the hands of federal agents.", u: ["y25", "y26"], ab: ["As the right sees it", "As the left sees it"] }
  ],

  bills: [
    ["One Big Beautiful Bill Act", "Law — signed 4 Jul 2025", "Tax-cut extension, Medicaid work requirements, immigration-enforcement funding. The Democrats' stated target for partial repeal in 2027.", "y25"],
    ["Iran war-powers resolutions", "House passed 215–208 (3 Jun 2026); Senate 50–48 (23 Jun 2026)", "Would require the war to end without congressional authorisation. Earlier versions failed in March.", "y26"],
    ["SAVE America Act", "Not enacted when last reported (June 2026)", "Proof of citizenship to register to vote. In June 2026 the president withheld his signature from a housing bill to press for it.", "y26"],
    ["ROAD to Housing Act", "Law without signature — 11 Jul 2026", "Housing-supply measures; became law without the president's signature.", "y26"],
    ["Immigration enforcement appropriation", "Law — signed 10 Jun 2026", "About $70 billion for Immigration and Customs Enforcement and the Border Patrol.", "y26"],
    ["Homeland Security appropriations", "Lapsed 14 Feb – 30 Apr 2026", "A 76-day shutdown of the department over enforcement conduct.", "y26"],
    ["Tariff repeal; Medicaid restoration", "Announced for the Congress that sits in January 2027", "Priorities named by the incoming Democratic leadership; each would face a presidential veto.", "cbs"]
  ],

  /* five readings of where the country is heading — none is the archive's */
  theses: [
    { id: "backslide", n: "Democratic backsliding", who: "V-Dem, Freedom House; Steven Levitsky and Lucan Way",
      claim: "The United States is sliding from liberal democracy toward \"competitive authoritarianism\": elections continue and the opposition can win, but the state is used to tilt the field and punish critics.",
      pro: ["V-Dem dropped the country from \"liberal\" to \"electoral\" democracy for 2025 and calls the pace unprecedented; its score for legislative constraints on the executive is the lowest in a century.",
            "Freedom House's 81 is its lowest US score in more than twenty years, down three points in a year and twelve over two decades.",
            "Prosecutions of named critics; emergency powers used for tariffs and troop deployments; orders reaching into election rules; a war begun without Congress."],
      con: ["The courts ruled against the administration on its largest claims — tariffs, birthright citizenship, the Federal Reserve — and it complied.",
            "The 2026 midterms were held on time, the opposition won decisively, and the president accepted the result.",
            "Both indices rest on expert judgment; critics argue experts' own politics colour the scores and that measurable indicators such as turnover in office have moved less."],
      watch: ["Whether investigations of the president's opponents continue once Congress changes hands.", "Whether court orders are obeyed when the stakes are highest.", "The administration of the 2028 election."], u: ["vd", "fh", "lw"] },
    { id: "restore", n: "Constitutional restoration", who: "Conservative legal scholars; the administration",
      claim: "What the indices call backsliding is an elected president recovering powers the Constitution gave his office and unelected bodies had absorbed — and enforcing laws his predecessors would not.",
      pro: ["Trump v. Slaughter restored at-will removal over agencies that exercise executive power; the Court has also curbed nationwide injunctions.",
            "Border crossings fell sharply; the policies were the platform of a candidate who won the popular vote in 2024.",
            "The institutions that are supposed to check a president — courts, elections, Congress after 2026 — all visibly still do."],
      con: ["The same Court drew lines against the administration at the Fed, at tariffs and at birthright citizenship: evidence, critics say, of how far the claims reached.",
            "Unitary control of administration does not explain prosecuting critics, deploying troops over governors' objections, or war without authorisation.",
            "Powers recovered for this president pass to every successor, of either party."],
      watch: ["Whether a future Democratic president uses the same removal and emergency powers — and whether today's defenders object.", "How far the Court extends Slaughter."], u: ["cj", "nr", "plf"] },
    { id: "pendulum", n: "The pendulum", who: "Students of public opinion (the \"thermostatic\" model)",
      claim: "American voters reliably move against whoever holds power. There is no direction of travel, only oscillation: 2018, 2020, 2022 in part, 2024 and 2026 each punished the incumbent.",
      pro: ["The 2026 swing — some forty House seats and seven Senate seats — is among the larger midterm corrections of the past half-century.",
            "Voters named prices and the war, not ideology; a record 45% call themselves independents.",
            "Divided government from January 2027 means vetoes, investigations and little legislation."],
      con: ["Each swing leaves things that do not swing back: executive precedents, a re-made judiciary, re-drawn districts.",
            "A pendulum presumes the rules stay fixed; much of the present dispute is about the rules."],
      watch: ["Whether the new majority legislates or only investigates.", "Whether 2028 is fought on the economy or on the constitution."], u: ["aj", "cbs", "gal"] },
    { id: "realign", n: "Two populisms", who: "Analysts of party realignment",
      claim: "The market-liberal consensus both parties shared from the 1980s to the 2010s is finished. What replaces it is a contest between a nationalist-populist right and a social-democratic left, with the old centre of both parties squeezed.",
      pro: ["Republicans defend tariffs, industrial policy and immigration restriction; after the defeat, party voices argued the programme was not carried out fully enough rather than that it should be dropped. The names discussed for 2028 — Vance, Rubio, DeSantis — have all worked within it.",
            "Democrats elected a democratic socialist mayor of New York and a senator from Michigan who ran on universal health care and taxing billionaires; the Progressive Caucus now has about a hundred members.",
            "Neither party proposes returning to the trade or fiscal orthodoxy of 2012."],
      con: ["The Democrats' moderate bloc is larger than the progressive one, and centrist groups credit moderates in competitive seats for the majority.",
            "Republican critics from the old wing — Romney, Curtis — read the defeat as a verdict on the programme itself.",
            "A reaction against a president is not an endorsement of the opposition's left."],
      watch: ["Who leads the Senate Democrats.", "The 2028 primaries — South Carolina votes first for the Democrats.", "Whether a post-Trump Republican runs on tariffs."], u: ["des", "lse", "tnr", "abc"] },
    { id: "calcify", n: "Stalemate and hardball", who: "Students of polarisation",
      claim: "Neither ideology wins. Two evenly matched, mutually hostile coalitions trade narrow control while the unwritten rules that made the system work erode — and political violence becomes less rare.",
      pro: ["V-Dem scores US society at 3.8 on a 0–4 scale of polarisation into hostile camps, from 2.7 in 2015.",
            "Mid-decade redistricting by both parties; two record shutdowns in a year; impeachment and prosecution as ordinary instruments.",
            "Assassinations and attempts against figures of both parties within two years."],
      con: ["Violence remains far below the level of 1968–72; turnout is high and transfers of power in Congress are peaceful.",
            "Polarised electorates have de-polarised before, usually around a new issue or a decisive election."],
      watch: ["Redistricting after Callais.", "Whether either party abandons a norm the other then keeps.", "The frequency of attacks on officials."], u: ["y25", "y26", "cal"] }
  ],

  shared: [
    "The presidency has grown at the expense of Congress under presidents of both parties for a generation; the present dispute is over degree and use, not over the trend.",
    "Both parties have left the free-trade, limited-government centre of the 1990s. The argument is now about what the state should do with its power, not whether it should use it.",
    "The courts and the ballot box still bind: the administration lost major cases and a national election in 2026 and accepted both.",
    "Polarisation is high and rising on every measure, and each side now describes the other as a threat to the constitutional order itself.",
    "The indices fell under presidents of both parties over two decades; the steepest single-year fall on record is 2025."
  ],
  signposts: [
    ["January 2027", "The new Congress sits. Does it pass a war-powers resolution over a veto threat, and is the Iran war wound down?"],
    ["2027", "Oversight: subpoenas, compliance and whether impeachment is attempted — and how the Justice Department responds."],
    ["2027", "The Supreme Court on the replacement tariffs and on the election orders."],
    ["2027–28", "Redistricting under the Callais ruling before the next House election."],
    ["Early 2028", "The primaries: which wing of each party chooses the nominee."],
    ["November 2028", "An open presidential election — its administration, its certification, and whether the loser concedes."]
  ]
};
