/* ============================================================
   ARCHIVUS — THE ORACLE (v14): what the whole record points to.

   This file holds the Oracle's words. Its numbers are NOT typed here: every {{token}} is filled in by
   src/oracle-app.js from the series (src/data/oracle-series.js) and from the Archive's own data
   (V-Dem history in realms.js, forced regime endings in coups-record.js, the Conflicts, the events).
   Change the data and the sentences change with it. tools/validate-oracle.js fails if a token has no value.

   grades   how far a deduction can be trusted, by what it rests on (not by how confident it sounds)
   reading  the synthesis: the short answer to "where is this headed?"
   lines    eleven readings, in the order the Reading takes them. kind "trend" = a quantity that has moved one way; "cycle" = something that returns.
            { id, kind, n name, q the question, c accent colour, loom (how the line is drawn on the Reading's loom:
              line | multi | marks | spans | cols), stats [[figure, label]…] the tiles, verdict, now [label, token],
              spark series key for the table, charts [chart…], shows [what the record shows…],
              deduce [[grade, horizon, text]…], against [the case against…], watch [signposts…],
              links [[label, href]…], src [series keys or "archive:…"] }
   chart    { t, sub, type line|cols|gantt|gaps, f number format, y lin|log, y0, y1, breaks [years] (a broken time
              axis: equal-width panels between the breaks, so 12,000 years and the last 75 can share one frame),
              x0, x1, fa (format for the axis labels, if coarser than f), series [{ k, n, c, dash, area }], stack, marks [[year, label]], trend { k, from, to, until } }
   threads  lists of Archive record ids the cycle readings are computed from
   horizon  the Archive's dated expectations, sorted by the kind of knowledge each rests on
   ============================================================ */
window.ARCHIVUS_ORACLE = {
  asOf: "2026-11-24",

  grades: [
    { id: "locked", n: "In the pipeline", c: "#49c9b8", def: "Already set in motion by something that cannot be undone on this timescale: people already born, carbon already emitted, an orbit already flown. It can be wrong only if the measurement is wrong or a catastrophe intervenes." },
    { id: "likely", n: "Likely", c: "#e8c455", def: "A long, steady trend or a base rate with many cases behind it. It has bent before and could again; the record gives no sign that it is bending now." },
    { id: "open", n: "Contested", c: "#e08a3c", def: "The record points both ways, or holds too few cases to give odds. Stated so the question is on the table, not because the Archive knows the answer." },
    { id: "spec", n: "Speculative", c: "#b48ef0", def: "A forecast made by its proponents, with no base rate in the record to test it against. Shown because people are acting on it." }
  ],

  reading: [
    ["power", "The world's economic centre is moving back toward Asia.", "China made {{cn1820}}% of world output in 1820, {{cnLow}}% in {{cnLowY}} and {{cnNow}}% now; it passed the United States between {{xA}} and {{xB}}. India is where China was around {{inLikeCnY}}. No power today holds the share America held in {{usPkY}}."],
    ["orders", "No political order in the record is permanent.", "The {{polN}} polities the Archive records from founding to fall lasted a median of {{polMed}} years. Governments have been overthrown by force less often in this century than in almost any decade before it — but the map of states has been redrawn in every century on record."],
    ["war", "Fewer great wars, more wars.", "Deaths in war fell from the 1940s to a low in {{rMinY}} and have risen since. There are more state-based conflicts now ({{ncNow}}) than in any year since the count began in 1989, and the forty-year fall in nuclear warheads has stopped."],
    ["rule", "Political freedom advances in waves, and this is the third ebb.", "The world's average liberal-democracy score peaked in {{dPkY}} and has fallen for {{ebbLen}} years. Both earlier ebbs ended, and each crest was higher than the one before. The first ended in a world war."],
    ["machines", "The tools of thought arrive faster each time, and here the record is least able to help.", "From writing to the alphabet took about two thousand years; from the web to the smartphone, sixteen. This is the one line where the past offers a direction and no scale."],
    ["life", "The ordinary life has been transformed, and the record shows no sign that this has stopped.", "Life expectancy {{l1800}} years in 1800, {{lNow}} now. Children dying before five: {{c1800}} in a hundred, now {{cNow}}. The setbacks on these lines — a famine, a pandemic — were made up within a few years."],
    ["people", "The age of more people is ending.", "Human numbers went from {{p1800}} in 1800 to {{pNow}} today. Births per woman have more than halved since the 1960s; the UN's central projection peaks near {{pPeak}} in the {{pPeakDec}} and then falls. The world of 2100 is older and more urban than any that has existed."],
    ["energy", "The bill was paid in carbon, and it is still running.", "Energy use is {{eX}} times its 1800 level and {{fosNow}}% of it is still fossil. Carbon dioxide stands at {{ppmNow}} parts per million against a ceiling near {{ppmPre}} in the 800,000 years before industry. No fuel in the record has yet been retired; each was added to the last."]
  ],

  lines: [
    { id: "power", kind: "trend", n: "Power", q: "Who makes the world's goods, and who is rising?",
      c: "#e8c455", loom: { type: "multi", ks: [["pwCN", "#e0502f"], ["pwUS", "#5b9be0"], ["pwIN", "#e08a3c"], ["pwUK", "#b9b4a4"]] },
      stats: [["{{cnNow}}%", "China's share of world output, {{pwNowY}}"], ["{{usNow}}%", "United States"], ["{{inNow}}%", "India"], ["{{usPk}}%", "the American peak, {{usPkY}}"]],
      verdict: "The world's economic centre is moving back toward Asia. China made {{cn1820}}% of world output in 1820, {{cnLow}}% in {{cnLowY}} and {{cnNow}}% in {{pwNowY}}; the American share has fallen from {{usPk}}% to {{usNow}}%.",
      now: ["China's share, {{pwNowY}}", "{{cnNow}}%"], spark: "pwCN",
      charts: [
        { t: "Shares of world output, 1820 – 2022", sub: "per cent of world GDP at purchasing-power parity · Maddison Project · the world total begins in 1820 · no figure for China in 1920 or 1940", f: "pct1", fa: "pct", y: "lin", y0: 0, y1: 32, x0: 1820, x1: 2022, endLabels: 1, tall: 1,
          series: [{ k: "pwCN", n: "China", c: "#e0502f" }, { k: "pwUS", n: "United States", c: "#5b9be0" }, { k: "pwIN", n: "India", c: "#e08a3c" }, { k: "pwUK", n: "United Kingdom", c: "#b9b4a4" }, { k: "pwJP", n: "Japan", c: "#b48ef0" }, { k: "pwDE", n: "Germany", c: "#8d96af" }, { k: "pwRU", n: "Russia", c: "#49c9b8" }],
          marks: [[1914, "1914"], [1945, "1945"], [1978, "China opens"]] }
      ],
      shows: [
        "China made {{cn1820}}% of the world's output in 1820. By {{cnLowY}} that was {{cnLow}}%. In {{pwNowY}} it was {{cnNow}}%.",
        "The United States made {{us1820}}% in 1820 and {{usPk}}% in {{usPkY}}, its peak, when the other industrial powers lay in ruins. It made {{usNow}}% in {{pwNowY}}.",
        "Britain's share peaked at {{ukPk}}% in {{ukPkY}} and is {{ukNow}}% now. Japan's peaked at {{jpPk}}% in {{jpPkY}} and is {{jpNow}}%.",
        "China's share passed America's between {{xA}} and {{xB}}.",
        "India made {{in1850}}% in 1850, {{inLow}}% in {{inLowY}} and {{inNow}}% in {{pwNowY}}. China and India together: {{ci1850}}% in 1850, {{ciLow}}% in {{ciLowY}}, {{ciNow}}% now."
      ],
      deduce: [
        ["likely", "to 2050", "Asia's share keeps rising. India's has grown in every decade since {{inLowY}} and stands about where China's stood around {{inLikeCnY}}."],
        ["likely", "to 2050", "No single power regains the share America held in {{usPkY}}. That figure measured a world whose other workshops had been bombed; it was the exception, not the baseline."],
        ["open", "to 2050", "Whether China's rise continues. Its gains have slowed, from {{cnGainA}} points of world output a year between 2010 and 2020 to {{cnGainB}} a year since, and earlier risers stalled: Japan's share peaked in {{jpPkY}}, amid forecasts that it would overtake America."],
        ["open", "to 2050", "Whether the handover is peaceful. The record holds both kinds: Britain yielded first place to America without a war between them; Germany's challenge to Britain took two."]
      ],
      against: [
        "These shares are measured at purchasing-power parity, which flatters large, poorer countries. At market exchange rates China's share is smaller and America's larger.",
        "Output is not power. Navies, alliances, the currency the world saves in, and who designs the most advanced machines are not in this series.",
        "The figures for 1820 are reconstructions, and the series has no reading for China in 1920 or 1940.",
        "A share is relative: America's fell while its own output grew many times over. A falling share is not a decline."
      ],
      watch: ["India's share, reading by reading.", "The dollar's place in the world's reserves and trade.", "Taiwan, where the two largest economies meet (see the Conflicts).", "Whether China's share resumes its rise."],
      links: [["The Archive: the First Opium War", "index.html#e=opium"], ["The Archive: the Meiji Restoration", "index.html#e=meiji"], ["The Archive: India's economic century (expected)", "index.html#e=india-century"], ["The Conflicts: Taiwan", "conflicts.html#v=map&i=taiwan"], ["The Realms", "realms.html"]],
      src: ["pwCN"] },

    { id: "orders", kind: "cycle", n: "Orders", q: "How long do states and empires last?",
      c: "#c9a227", loom: { type: "spans" },
      stats: [["{{polMed}} yrs", "median life of a polity"], ["{{polN}}", "polities followed from founding to fall"], ["{{usAge}} yrs", "the United States under its constitution"], ["{{unAge}} yrs", "the United Nations"]],
      verdict: "No political order in the record is permanent. The {{polN}} the Archive follows from founding to fall lasted a median of {{polMed}} years.",
      now: ["median lifespan", "{{polMed}} yrs"], spark: null,
      charts: [
        { t: "Every polity the Archive records from founding to fall, and six still standing", sub: "one bar each, on a broken time axis · gold = still standing in 2026", type: "gantt", k: "a.polities", breaks: [-1700, 0, 1000, 1500, 1800, 2026] }
      ],
      shows: [
        "The Archive records {{polN}} kingdoms, dynasties, caliphates and empires with both a beginning and an end. Their median life was {{polMed}} years. A quarter were gone within {{polQ1}}; a quarter outlasted {{polQ3}}.",
        "The longest-lived is {{polMaxN}}, at {{polMax}} years.",
        "Still standing: the United States under its constitution, {{usAge}} years; the Turkish Republic, {{trAge}}; the United Nations, {{unAge}}; the Republic of India, {{inAge}}; the People's Republic of China, {{prcAge}}; the European Union, {{euAge}}."
      ],
      deduce: [
        ["likely", "to 2100", "The present arrangement of states is not the last one. In every century on record the map has been redrawn."],
        ["open", "to 2100", "Which orders change, and how. At {{usAge}} years the American constitutional order is {{usVs}} the median of the polities here. That is a base rate and nothing more: a quarter of them lasted longer than {{polQ3}} years, and nothing in a lifespan table says why any one fell."],
        ["open", "to 2100", "Whether modern states end the way old ones did. Since 1945 conquest has seldom redrawn a border; the usual form of collapse may have moved to change within fixed frontiers (see Force)."]
      ],
      against: [
        "The Archive records the famous and the long-lived. Short-lived states are under-counted, so the true median is lower than the one shown.",
        "\"Polity\" here mixes dynasties, empires and confederacies. A dynasty ending is not a civilisation ending: China outlived every dynasty on this chart.",
        "Modern states have things no earlier one had — bureaucracies, national identity, nuclear deterrence — and lifespans drawn from agrarian empires may not apply."
      ],
      watch: ["Secession and union: Scotland, Catalonia, Taiwan, the European Union's own membership.", "The United Nations' centenary in 2045, and whether its Security Council looks as it does now.", "Peaceful constitutional replacement, the commonest way modern orders end."],
      links: [["The Archive: the fall of the Western Roman Empire", "index.html#e=romefall"], ["The Archive: the dissolution of the Soviet Union", "index.html#e=ussrfall"], ["The Archive: the United Nations turns 100 (expected)", "index.html#e=un-centenary"], ["The Bloodline", "lineage.html"]],
      src: ["archive:the Archive's own records of polities"] },

    { id: "war", kind: "trend", n: "War", q: "Is the world getting more violent or less?",
      c: "#e0502f", loom: { type: "line", k: "warDead", log: 1, floor: 100 },
      stats: [["{{ncNow}}", "state-based conflicts, {{ncNowY}}"], ["{{rNow}}", "deaths per 100,000 people, {{ncNowY}}"], ["{{nkNow}}", "nuclear warheads"], ["{{gpwYrs}} yrs", "since the last war between great powers"]],
      verdict: "Fewer great wars, more wars. Deaths fell from the 1940s to a low in {{rMinY}} and have risen since; the count of conflicts is the highest on record.",
      now: ["conflicts under way, {{ncNowY}}", "{{ncNow}}"], spark: "warRate",
      charts: [
        { t: "Deaths in battle, 1800 – 2011", sub: "per year, civil and interstate wars · log scale · Project Mars", f: "int", y: "log", y0: 100, x0: 1800, x1: 2025, series: [{ k: "warDead", n: "Battle deaths a year", c: "#e0502f", area: 1 }], marks: [[1914, "1914"], [1939, "1939"]] },
        { t: "Deaths in state-based conflicts, 1946 – 2025", sub: "per 100,000 people a year · Uppsala Conflict Data Program", f: "num2", fa: "num0", y: "lin", y0: 0, x0: 1946, x1: 2025, series: [{ k: "warRate", n: "Death rate", c: "#e08a3c", area: 1 }] },
        { t: "Nuclear warheads, 1945 – 2026", sub: "all countries' stockpiles · Federation of American Scientists", f: "int", y: "lin", y0: 0, x0: 1945, x1: 2026, series: [{ k: "nukes", n: "Warheads", c: "#b48ef0", area: 1 }] },
        { t: "Armed conflicts involving a state, 1989 – 2025", sub: "number under way each year · the count begins in 1989", f: "int", y: "lin", y0: 0, x0: 1989, x1: 2025, series: [{ k: "nConf", n: "State-based conflicts", c: "#e8c455" }, { k: "nInter", n: "of which between states", c: "#e0502f" }] }
      ],
      shows: [
        "Of the {{mTot}} battle deaths this record counts between 1800 and 2011, {{mShare}}% fell in the twelve years of the two world wars.",
        "Since 1946 the death rate in state-based conflict fell from {{r1950}} per 100,000 people in 1950 to {{rMin}} in {{rMinY}}, the lowest in the series. In 2022 it was {{r2022}}, the highest since {{rSince}}; in 2025, {{rNow}}.",
        "There were {{ncNow}} state-based conflicts in {{ncNowY}}, the most in any year since the count began in 1989 (the fewest: {{ncMin}}, in {{ncMinY}}). {{niNow}} of them were between states, also the most in the series.",
        "Nuclear warheads peaked at {{nkPk}} in {{nkPkY}} and stand at {{nkNow}}, down {{nkCut}}%. The count rose in {{nkRiseY}} for the first time since the peak.",
        "The Archive's own Conflicts instrument tracks {{cfN}} conflicts and standoffs today, {{cfWar}} of them at the level of war or above."
      ],
      deduce: [
        ["likely", "to 2035", "More wars of the kind now being fought: many, regional, long, and drawing in outside powers. The count has risen for fifteen years."],
        ["likely", "to 2035", "The long reduction of nuclear arsenals is over. Whether the stall becomes a build-up is the open part."],
        ["open", "to 2050", "A war between great powers. There has been none for {{gpwYrs}} years. The record cannot price it: {{mShare}}% of two centuries' battle deaths came in twelve years, so one event of that kind outweighs every trend on this page."],
        ["open", "to 2050", "Whether the low of {{rMinY}} was the floor of a lasting decline, or a pause."]
      ],
      against: [
        "Students of war statistics argue that eighty years without a world war is too short a run to show the risk has fallen: wars are so unequal in size that the largest dominates any average.",
        "Battle deaths leave out those who die of the hunger and disease that war brings, who often outnumber them. Figures before 1946 are rough.",
        "More conflicts counted can mean more conflicts, or better counting. The series is short: it starts in 1989.",
        "The opposite case is made from the same data: per head of population, the 2020s so far ({{r2020s}} deaths per 100,000 a year) have been less deadly than any decade from the 1940s to the 1980s (the 1980s: {{r1980s}})."
      ],
      watch: ["Direct fighting between nuclear-armed states.", "Whether the 2025 rise in warheads repeats.", "The Conflicts instrument's top level: how many major wars at once."],
      links: [["The Conflicts", "conflicts.html"], ["The War Room", "wars.html"], ["The Archive: the atomic bomb", "index.html#e=bomb"], ["The Archive: the Cold War", "index.html#e=coldwar"]],
      src: ["warDead", "warRate", "nConf", "nukes", "archive:Conflicts"] },

    { id: "rule", kind: "cycle", n: "Rule", q: "Is the world becoming freer?",
      c: "#5b9be0", loom: { type: "line", k: "a.ldi" },
      stats: [["{{dNow}}", "world average, liberal democracy, {{dNowY}}"], ["{{dPk}}", "the peak, {{dPkY}}"], ["{{fell}} / {{rose}}", "countries falling / rising over five years"], ["{{demNow}}", "democracies today"]],
      verdict: "Freedom advances in waves. This is the third ebb, {{ebbLen}} years old; both earlier ones ended, and each crest was higher than the last.",
      now: ["world average, {{dNowY}}", "{{dNow}}"], spark: "a.ldi",
      charts: [
        { t: "The world's average democracy scores, 1789 – 2025", sub: "V-Dem, 0–1, unweighted average of every state scored · shaded = the three ebbs · the dip at 1900 is the sample growing, not a collapse", f: "num2", fa: "num1", y: "lin", y0: 0, y1: 0.6, x0: 1789, x1: 2025,
          series: [{ k: "a.edi", n: "Electoral democracy", c: "#5b93b8" }, { k: "a.ldi", n: "Liberal democracy", c: "#e8c455" }], bands: "a.ebbs" }
      ],
      shows: [
        "The world's average liberal-democracy score was {{d1789}} in 1789. It peaked at {{dPk}} in {{dPkY}} and was {{dNow}} in {{dNowY}}: {{dDrop}}% off the peak, {{ebbLen}} years on.",
        "The record holds two earlier ebbs. From {{e1}} the average fell {{e1drop}}% over {{e1len}} years; from {{e2}}, {{e2drop}}% over {{e2len}} years.",
        "Each crest has been higher than the one before ({{crests}}), and so has each trough ({{troughs}}).",
        "Over the last five years {{fell}} countries fell by 0.05 or more on the index and {{rose}} rose by as much.",
        "Today V-Dem classes {{rc0}} countries as closed autocracies, {{rc1}} as electoral autocracies, {{rc2}} as electoral democracies and {{rc3}} as liberal democracies."
      ],
      deduce: [
        ["likely", "to 2035", "The ebb continues for now. Neither earlier one turned in under nine years, and {{fell}} countries are still falling against {{rose}} rising."],
        ["likely", "to 2100", "It ends. Both earlier ebbs did, and the long line from 1789 runs upward through all three."],
        ["open", "to 2050", "How it ends. The first ebb ended in a world war that the democracies won; the second with the fall of the dictatorships of southern Europe and Latin America. Two cases are not a pattern."]
      ],
      against: [
        "The scores are the judgments of country experts, and the average counts every state once, whatever its size. Weighted by population the picture is darker. Counted another way it is brighter: V-Dem classes {{demNow}} countries as democracies today, against at most {{demPre90}} in any year before 1990.",
        "\"Waves\" may be a shape read into three bumps. With two completed ebbs the record cannot say how long a third should last.",
        "The states scored grow from {{dN0}} in 1789 to {{dN1}} today, and the sample changes sharply in 1900. Part of every long-run comparison is a change in who is being measured.",
        "Critics of the indices hold that expert alarm moves faster than the things that can be counted: elections held, incumbents losing, courts obeyed."
      ],
      watch: ["Whether incumbents lose elections and leave.", "The number of countries rising on the index, which has to overtake the number falling before the average turns.", "The largest countries: India, the United States, Indonesia, Brazil."],
      links: [["The Realms: the Drift", "realms.html#v=drift&s=world"], ["The Realms: the map since 1789", "realms.html#v=map&m=ldi"], ["The Realms: the United States", "realms.html#v=usa&s=now"]],
      src: ["archive:V-Dem v16 world average, in the Realms"] },

    { id: "force", kind: "cycle", n: "Force", q: "How often do governments fall by force?",
      c: "#e08a3c", loom: { type: "cols" },
      stats: [["{{fr2020s}}", "regimes ended by force per 100 states a year, 2020s"], ["{{fr1940s}}", "the same, 1940s"], ["{{feN}}", "forced endings since 1790"], ["{{fe2020n}}", "since 2020"]],
      verdict: "Far less often than they used to. Three of the four calmest decades since 1790 are the three of this century.",
      now: ["per 100 states a year, 2020s", "{{fr2020s}}"], spark: "a.force",
      charts: [
        { t: "Regimes ended by force, 1790s – 2020s", sub: "per 100 states a year, by decade · coups, lost wars, foreign intervention, uprisings · V-Dem", type: "cols", f: "num1", k: "a.force", c: "#e08a3c" }
      ],
      shows: [
        "The Archive's record holds {{feN}} regimes ended by force since 1790: coups, lost wars, foreign interventions and uprisings.",
        "Set against the number of states and territories V-Dem scores, the rate was {{fr1800s}} per 100 a year in the 1800s, {{fr1940s}} in the 1940s, {{fr1960s}} in the 1960s, {{fr2010s}} in the 2010s, and {{fr2020s}} so far in the 2020s.",
        "The most violent decade in the record is the {{frMaxDec}}. The four calmest are the {{frCalm}}.",
        "The coups of the 2020s are real: {{fe2020n}} regimes have ended by force since 2020. By the long record they are few."
      ],
      deduce: [
        ["likely", "to 2035", "Violent changes of government stay rare by historical standards and stay concentrated. In the Coups instrument's record since 1950, the poorest quarter of country-years saw a coup attempt in {{coupPoor}}% of years and the richest quarter in {{coupRich}}%; no liberal democracy had one."],
        ["open", "to 2050", "Whether war brings them back. The spike of the 1940s was not coups; it was armies crossing borders. A return of interstate war (see War) would show here next."],
        ["open", "to 2050", "Whether fewer falls means more consent, or better-defended rulers. The same decades saw the democratic ebb (see Rule)."]
      ],
      against: [
        "What counts as a regime ending is a coder's judgment, and the early record is thinner than the recent one. From 1900 the count of states includes colonies, which lowers the rate from that decade on.",
        "A regime that is not overthrown has not necessarily been accepted. Modern autocracies have learned to survive.",
        "The 2020s are six years old. One bad year would move the bar."
      ],
      watch: ["Coups outside the Sahel.", "Regimes ended by a foreign army.", "Elections annulled or indefinitely postponed, which this measure does not catch."],
      links: [["The Coups", "coups.html"], ["The Realms: fallen by force", "realms.html#v=drift&s=force"]],
      src: ["archive:V-Dem v16 regime endings, in the Coups"] },

    { id: "machines", kind: "trend", n: "Machines", q: "What do the tools of thought do next?",
      c: "#49c9b8", loom: { type: "marks", k: "a.info", also: { k: "chips", log: 1 } },
      stats: [["{{nNow}}%", "of people online, {{nNowY}}"], ["{{chDbl}} yrs", "to double the transistors on a chip"], ["{{flDbl}} yrs", "to double the fastest computer"], ["{{agiY}}", "expert median for transformative AI"]],
      verdict: "Each new tool of thought has arrived sooner than the last and spread faster. Here the past gives a direction and no scale.",
      now: ["people online, {{nNowY}}", "{{nNow}}%"], spark: "chips", sparkLog: 1,
      charts: [
        { t: "From writing to machine learning: the years between each step", sub: "the Archive's records of how thought is stored and sent · broken time axis", type: "gaps", k: "a.info", c: "#5b93b8", breaks: [-3300, 0, 1400, 1800, 1950, 2026] },
        { t: "Computing power, 1971 – 2025", sub: "log scale · transistors on a chip; speed of the fastest computer (gigaflops)", f: "big", y: "log", x0: 1971, x1: 2025, series: [{ k: "chips", n: "Transistors per chip", c: "#e8c455" }, { k: "flops", n: "Fastest supercomputer", c: "#49c9b8" }] },
        { t: "People using the Internet, 2005 – 2025", sub: "per cent of the world · the series begins in 2005", f: "pct", y: "lin", y0: 0, y1: 100, x0: 2005, x1: 2025, series: [{ k: "net", n: "Share online", c: "#5b93b8", area: 1 }] }
      ],
      shows: [
        "The Archive's steps in how thought is stored and sent, and the years between them: {{infoList}}.",
        "Transistors on a chip multiplied about {{chX}} times between 1971 and 2021: a doubling every {{chDbl}} years, held for half a century.",
        "The fastest computer's speed has doubled about every {{flDbl}} years since 1993.",
        "People using the Internet: {{n2005}}% of the world in 2005, {{nNow}}% in {{nNowY}}."
      ],
      deduce: [
        ["likely", "to 2040", "More of the work of thinking is handed to machines each decade. That has been true since the printing press and the trend in computing power has not broken."],
        ["likely", "to 2035", "The rest of the world comes online. At the pace of the last twenty years the share passes nine in ten around {{net90Y}}."],
        ["open", "to 2050", "Whether machines match people across the board. The Archive records the expert-survey median near {{agiY}}, with wide disagreement on both sides: a distribution, not a date."],
        ["spec", "to 2050", "A \"Singularity\" around {{singY}}, after which prediction fails altogether. It is a claim by its proponents; nothing in the record can test it."]
      ],
      against: [
        "Which inventions count as \"steps\" is the Archive's choice. A different list gives different gaps, though not a different direction.",
        "Exponentials end. Transistor density is approaching physical limits, and the series here stops in 2021.",
        "Spread is not capability. That four people in five are online says nothing about what the machines can do.",
        "Every generation since the telegraph has believed its tools without precedent."
      ],
      watch: ["Whether progress in machine learning continues to track computing power, or detaches from it.", "Electricity demand from computing (see Energy).", "Work: which tasks stop being done by people."],
      links: [["The Archive: the invention of writing", "index.html#e=writing"], ["The Archive: the printing press", "index.html#e=printing"], ["The Archive: the AI revolution", "index.html#e=ai"], ["The Archive: the expert median for transformative AI (expected)", "index.html#e=agi-median"]],
      src: ["chips", "flops", "net", "archive:the Archive's own records of invention"] },

    { id: "life", kind: "trend", n: "Life and wealth", q: "Is the ordinary life getting better?",
      c: "#62c073", loom: { type: "line", k: "gdp", log: 1 },
      stats: [["{{lNow}} yrs", "life expectancy, {{lNowY}}"], ["{{cNow}}%", "of children die before five"], ["{{pvNow}}%", "in extreme poverty, {{pvNowY}}"], ["{{gX}}×", "output per person since 1820"]],
      verdict: "Since 1800 the ordinary human life has more than doubled in length and escaped the poverty that was the rule. The record shows no sign that this has stopped.",
      now: ["life expectancy, {{lNowY}}", "{{lNow}} yrs"], spark: "life",
      charts: [
        { t: "Life expectancy at birth, 1770 – 2023", sub: "years, world average", f: "num1", y: "lin", y0: 20, y1: 80, x0: 1770, x1: 2025, series: [{ k: "life", n: "Life expectancy", c: "#49c9b8" }], marks: [[1960, "famine"], [2020, "COVID"]] },
        { t: "Three shares of humanity, 1800 – 2024", sub: "per cent · children dying before five · people in extreme poverty · adults who can read", f: "pct", y: "lin", y0: 0, y1: 100, x0: 1800, x1: 2025,
          series: [{ k: "lit", n: "Can read", c: "#5b93b8" }, { k: "poor", n: "In extreme poverty", c: "#e08a3c" }, { k: "child", n: "Die before age five", c: "#e0502f" }] },
        { t: "World output, year 1 – 2025", sub: "international dollars at 2021 prices · log scale · broken time axis", f: "usd", y: "log", breaks: [1, 1500, 1820, 1950, 2025], series: [{ k: "gdp", n: "World GDP", c: "#e8c455" }] }
      ],
      shows: [
        "Life expectancy at birth: {{l1800}} years in 1800, {{l1950}} in 1950, {{lNow}} in {{lNowY}}.",
        "Children dying before their fifth birthday: {{c1800}} in every hundred in 1800, {{c1950}} in 1950, {{cNow}} in {{cNowY}}.",
        "People in extreme poverty: {{pv1820}}% in 1820, {{pv1950}}% in 1950, {{pvNow}}% in {{pvNowY}}. The number of the very poor peaked at {{pvPeakN}} around {{pvPeakY}} and was {{pvNowN}} at the last count.",
        "Adults who can read: {{lit1820}}% in 1820, {{litNow}}% in {{litNowY}}.",
        "Output per person rose about {{gX}}-fold between 1820 and {{gNowY}} (Maddison). Before 1800 the line is nearly flat for as far back as it can be reconstructed.",
        "The lines are not smooth. Life expectancy fell from {{l1955}} to {{l1960}} between 1955 and 1960 and was {{l1965}} five years later; it stalled again in 2020. Both setbacks were recovered within a few years."
      ],
      deduce: [
        ["likely", "to 2050", "Further gains, at a slower pace. With child deaths at {{cNow}} in a hundred, most of the cheap gains have been taken; what remains is the diseases of age."],
        ["likely", "to 2050", "Shocks will dent these lines and not break them. That is what the famine of 1958–61 and the pandemic of 2020 did."],
        ["open", "to 2100", "Whether wealth keeps compounding once the number of workers is falling (see People). The record has no case of sustained growth with a shrinking population, because it has no case of a shrinking world."],
        ["open", "to 2050", "Whether the last tenth escapes extreme poverty. The series here ends in {{pvNowY}} and cannot say."]
      ],
      against: [
        "These are world averages. They hide the distribution inside countries and the places going backwards.",
        "Income before 1820 is a scholarly reconstruction. The poverty line used here (the cost of basic needs) is one definition among several, and others give higher counts.",
        "Two hundred years is a short run against the twelve thousand before it. A trend that began once can end once.",
        "Longer and richer is not the same as better: none of these series measures freedom, meaning or the state of the living world."
      ],
      watch: ["Life expectancy in the countries where it has recently fallen.", "Child mortality where states are weakest — compare the Conflicts.", "Growth in countries whose working-age population is already shrinking."],
      links: [["The Archive: germ theory", "index.html#e=germtheory"], ["The Archive: the Great Leap Forward famine", "index.html#e=greatleap"], ["The Archive: the Industrial Revolution", "index.html#e=industrial"], ["The Conflicts", "conflicts.html"]],
      src: ["life", "child", "poor", "lit", "gdp", "gdppc"] },

    { id: "people", kind: "trend", n: "People", q: "How many of us, and for how long?",
      c: "#d8c690", loom: { type: "line", k: "pop", log: 1, proj: "popProj" },
      stats: [["{{pNow}}", "people, {{pNowY}}"], ["{{fNow}}", "births per woman"], ["{{pPeak}}", "projected peak, {{pPeakDec}}"], ["{{aNow}}", "median age"]],
      verdict: "The age of more people is ending. The central projection peaks near {{pPeak}} in the {{pPeakDec}}.",
      now: ["{{pNowY}}", "{{pNow}}"], spark: "pop", sparkLog: 1,
      charts: [
        { t: "World population, 10,000 BCE – 2100", sub: "log scale · the time axis is broken into five panels so the whole record fits · dashed = UN medium projection", f: "people", y: "log", y0: 1e6, y1: 2e10, breaks: [-10000, 0, 1500, 1800, 1950, 2100],
          series: [{ k: "pop", n: "Population", c: "#e8c455" }, { k: "popProj", n: "UN medium projection (2024)", c: "#e8c455", dash: 1 }], marks: [[1347, "Black Death"], [1760, "industry"]] },
        { t: "Births per woman, 1950 – 2100", sub: "2.1 is replacement · dashed = projection", f: "num1", y: "lin", y0: 1.5, y1: 5.5, x0: 1950, x1: 2100,
          series: [{ k: "fert", n: "Births per woman", c: "#5b93b8" }, { k: "fertProj", n: "projection", c: "#5b93b8", dash: 1 }], level: [2.1, "replacement"] },
        { t: "Share of people living in towns and cities, 10,000 BCE – 2025", sub: "per cent · HYDE reconstruction", f: "pct", y: "lin", y0: 0, y1: 60, breaks: [-10000, 0, 1500, 1800, 1950, 2025],
          series: [{ k: "urban", n: "Urban share", c: "#49c9b8", area: 1 }] }
      ],
      shows: [
        "For most of the record the line barely moves: about {{p10k}} people at the dawn of farming, {{p0}} at year 0, {{p1800}} in 1800. Then it turns almost vertical: {{p1950}} in 1950, {{pNow}} in {{pNowY}}.",
        "The growth rate has already more than halved, from {{gr65}}% a year in the late 1960s to {{grNow}}% now.",
        "Births per woman fell from {{f65}} in 1965 to {{fNow}} in {{fNowY}}. About 2.1 keeps a population level.",
        "Half of humanity was younger than {{a1970}} in 1970. The midpoint is {{aNow}} now and is projected at {{a2100}} in 2100.",
        "Town-dwellers were {{u1800}}% of people in 1800 and {{u1900}}% in 1900, passed half around {{uHalf}}, and are {{uNow}}% today."
      ],
      deduce: [
        ["locked", "to 2050", "More than a billion more people by mid-century: the central projection is {{p2050}} in 2050. Their mothers are already alive."],
        ["locked", "to 2050", "An older world. The median age rises from {{aNow}} to a projected {{a2050}} by 2050. Pension systems, armies and labour markets built for a young, growing population will be working against the grain."],
        ["likely", "to 2100", "A peak near {{pPeak}} in the {{pPeakDec}}, then the first sustained fall in human numbers since the Black Death — this time from fewer births, not more deaths."],
        ["open", "beyond", "Where fertility settles. The projection assumes a slow slide to {{f2100}} by 2100. Nothing in these series says whether it stops there."]
      ],
      against: [
        "A projection is arithmetic on assumed birth and death rates. It does not foresee wars, plagues or policy, and the UN's own central figure has moved from one revision to the next; this is the 2024 one.",
        "Everything before 1800 is a reconstruction with wide error. The shape is secure; the early numbers are not.",
        "Forecasts of population have failed in both directions before: the mid-century fear was of numbers without limit."
      ],
      watch: ["Births per woman in sub-Saharan Africa and South Asia, which decide the height of the peak.", "Whether any country that has fallen well below two births per woman climbs back above it.", "Migration politics in the countries that age first."],
      links: [["The Archive: humanity peaks", "index.html#e=population-peak"], ["The Archive: the Black Death", "index.html#e=blackdeath"], ["The Archive: the agricultural revolution", "index.html#e=agriculture"]],
      src: ["pop", "popProj", "fert", "age", "urban"] },

    { id: "plagues", kind: "cycle", n: "Plagues", q: "When is the next pandemic?",
      c: "#b48ef0", loom: { type: "marks", k: "a.plagues" },
      stats: [["{{plN}}", "pandemics in the Archive"], ["{{plRate}}", "between pandemics since 1817"], ["{{plSince}} yrs", "since the last began"]],
      verdict: "The plague returns. The Archive records {{plN}} pandemics; the last four came within about two centuries.",
      now: ["years since the last began", "{{plSince}} yrs"], spark: null,
      charts: [
        { t: "The pandemics in the Archive, and the years between them", sub: "broken time axis · the early gaps are partly gaps in the record", type: "gaps", k: "a.plagues", c: "#e0502f", breaks: [100, 1300, 1800, 2026] }
      ],
      shows: [
        "The Archive records {{plN}} pandemics: {{plList}}.",
        "The gaps between their beginnings are {{plGaps}} years.",
        "Since 1817 there have been {{plModN}} in {{plModSpan}} years: about one every {{plRate}}.",
        "The pandemic of 2020 shows on the life-expectancy chart as a stall, made up within three years (see Life and wealth). The world series has no yearly figures before 1950, so 1918 cannot be seen in it."
      ],
      deduce: [
        ["likely", "to 2075", "Another pandemic within a lifetime. On the base rate since 1817, one begins about every {{plRate}}; the world is more crowded and more connected than in any of those years."],
        ["open", "to 2075", "How deadly. Each century of medicine has blunted the next plague, but that is a trend in outcomes, not a law of nature, and resistance to antibiotics is moving the other way."]
      ],
      against: [
        "Seven events are not a statistical sample, and they are the seven famous enough to be recorded. Ancient epidemics that left no chronicler are missing, which makes the early gaps look longer than they were.",
        "A base rate says how often, not when. \"One every fifty years\" is equally consistent with two in a decade.",
        "The definition is loose: cholera came in seven waves, and HIV is still under way."
      ],
      watch: ["Influenza strains crossing from birds and livestock to people.", "Drug resistance (the Archive expects its toll to be counted by 2050).", "Whether the surveillance built after 2020 is still funded."],
      links: [["The Archive: the Black Death", "index.html#e=blackdeath"], ["The Archive: the 1918 influenza", "index.html#e=flu"], ["The Archive: COVID-19", "index.html#e=covid"], ["The Archive: drug resistance (expected)", "index.html#e=amr-2050"]],
      src: ["archive:the Archive's own records of pandemics"] },

    { id: "energy", kind: "trend", n: "Energy", q: "What powers it, and can that change?",
      c: "#9aa3bd", loom: { type: "line", k: "enTot" },
      stats: [["{{eX}}×", "energy use since 1800"], ["{{fosNow}}%", "fossil share, {{eNowY}}"], ["{{rnNow}}%", "of electricity from renewables"], ["−{{solX}}%", "price of a solar panel since 1975"]],
      verdict: "Every new fuel was added to the old ones; none has yet been retired. Fossil fuels supply {{fosNow}}% of the world's energy, a share that has barely moved in fifty years.",
      now: ["fossil share, {{eNowY}}", "{{fosNow}}%"], spark: "enTot",
      charts: [
        { t: "World primary energy by source, 1800 – 2025", sub: "terawatt-hours a year, stacked", f: "twh", y: "lin", x0: 1800, x1: 2025, stack: 1,
          series: [{ k: "enBio", n: "Traditional biomass (wood, dung)", c: "#8d6e4a" }, { k: "enFos", n: "Coal, oil, gas", c: "#8d96af" }, { k: "enLow", n: "Nuclear and renewables", c: "#49c9b8" }] },
        { t: "Share of electricity from renewables, 1900 – 2025", sub: "per cent · high in 1900 because early grids ran on dams", f: "pct", y: "lin", y0: 0, y1: 50, x0: 1900, x1: 2025, series: [{ k: "renew", n: "Renewables", c: "#49c9b8" }] },
        { t: "Price of a solar panel, 1975 – 2025", sub: "2025 US dollars per watt · log scale", f: "usd2", y: "log", x0: 1975, x1: 2025, series: [{ k: "solar", n: "Solar module price", c: "#e8c455" }] }
      ],
      shows: [
        "The world uses about {{eX}} times the energy it did in 1800: {{e1800}} terawatt-hours then, {{eNow}} in {{eNowY}}. In this series total use has never fallen from one reading to the next.",
        "Fossil fuels were {{fosNow}}% of the total in {{eNowY}}. The share peaked at {{fosPk}}% around {{fosPkY}}. In absolute terms fossil use was at its highest ever in {{fosRecY}}.",
        "Wood and dung are still burned at {{bioX}} times the rate of 1800. Coal did not end wood; oil did not end coal.",
        "Renewables made {{rn1900}}% of electricity in 1900, when grids were small and ran on dams. The share fell to {{rnLow}}% by {{rnLowY}} and is {{rnNow}}% now.",
        "A solar panel cost ${{sol0}} a watt in 1975 and ${{solNow}} in 2025, a fall of {{solX}}%."
      ],
      deduce: [
        ["likely", "to 2050", "Energy use keeps rising to mid-century, with population and income (see People, Life and wealth)."],
        ["likely", "to 2050", "Low-carbon sources keep taking share of electricity. A price that has fallen {{solX}}% does not need a policy to be bought."],
        ["open", "to 2050", "Whether fossil use falls in absolute terms. In two centuries it has fallen across only one five-year step ({{fosFall}}), and that was more than made up by {{fosRecY}}. A transition that subtracts would be the first in the record."]
      ],
      against: [
        "Earlier transitions happened without anyone trying to retire the old fuel. This one has governments, prices and engineering pointed at exactly that; the base rate may not bind.",
        "No earlier energy source fell in price the way solar panels and batteries have. An argument from precedent is weakest where there is no precedent.",
        "A share can stand still while the thing itself changes. Nuclear and renewable supply has grown {{lowX}}-fold since 1965; it has been outrun by demand, not stalled."
      ],
      watch: ["Coal use in China and India.", "Whether global oil demand has a year that is lower than the one before for a reason other than a recession.", "The cost of storing electricity."],
      links: [["The Archive: Watt's steam engine", "index.html#e=steam"], ["The Archive: peak oil demand (expected)", "index.html#e=peak-oil-demand"], ["The Archive: renewables become the largest power source (expected)", "index.html#e=renewables-majority"]],
      src: ["enTot", "renew", "solar"] },

    { id: "climate", kind: "trend", n: "Climate", q: "What has the carbon done, and what is already owed?",
      c: "#7f8aa6", loom: { type: "line", k: "ppm" },
      stats: [["{{ppmNow}} ppm", "carbon dioxide, {{ppmNowY}}"], ["+{{tMax}} °C", "warmest year, {{tMaxY}}"], ["{{co2Now}} Gt", "emitted in {{co2NowY}}"], ["{{tSlope}} °C", "per decade, last thirty years"]],
      verdict: "Carbon dioxide is at {{ppmNow}} parts per million, against a ceiling near {{ppmPre}} in 800,000 years of ice. The warming it implies has not all arrived.",
      now: ["CO₂, {{ppmNowY}}", "{{ppmNow}} ppm"], spark: "temp",
      charts: [
        { t: "Carbon dioxide in the air, 800,000 years ago – 2025", sub: "parts per million · ice cores, then instruments · broken time axis", f: "ppm", y: "lin", y0: 150, y1: 450, breaks: [-803719, -10000, 1750, 1950, 2025], series: [{ k: "ppm", n: "CO₂ concentration", c: "#e08a3c" }] },
        { t: "Carbon dioxide emitted each year, 1750 – 2025", sub: "billion tonnes, fossil fuels and industry", f: "gt", y: "lin", y0: 0, y1: 42, x0: 1750, x1: 2025, series: [{ k: "co2e", n: "Annual emissions", c: "#8d96af", area: 1 }] },
        { t: "Global temperature against 1850–1900, 1850 – 2060", sub: "°C, HadCRUT5 · dashed = the last thirty years' straight line, carried forward (arithmetic, not a climate model)", f: "degc", y: "lin", y0: -0.4, y1: 2.4, x0: 1850, x1: 2060,
          series: [{ k: "temp", n: "Temperature anomaly", c: "#e0502f" }], trend: { k: "temp", from: 1996, to: 2025, until: 2060 }, level: [1.5, "1.5 °C"], level2: [2, "2 °C"] }
      ],
      shows: [
        "Carbon dioxide in the air: {{ppm1750}} parts per million around 1750, {{ppmNow}} in {{ppmNowY}}. In the 800,000 years of ice-core record sampled here it did not rise above about {{ppmPre}}.",
        "Emissions were {{co21950}} billion tonnes in 1950 and {{co2Now}} in {{co2NowY}}, the highest in the series.",
        "The warmest year in the record is {{tMaxY}}, at {{tMax}} °C above the 1850–1900 average. The ten years to 2025 averaged {{t10}} °C.",
        "Over the last thirty years the trend is {{tSlope}} °C a decade."
      ],
      deduce: [
        ["locked", "to 2050", "More warming than has yet been felt. Carbon dioxide stays in the air for centuries, and warming continues until net emissions reach about zero. They are at a record."],
        ["likely", "to 2060", "Carried forward in a straight line, the thirty-year trend passes 1.5 °C around {{t15Y}} and 2 °C around {{t2Y}}. That is arithmetic on the record, not a climate model; models, which depend on what is emitted, give a range either side."],
        ["open", "to 2035", "Whether emissions peak this decade. They have risen across every decade in the series."],
        ["open", "to 2100", "How societies bear it. The Archive's own climate shocks — the volcanic winter of 536, the Little Ice Age — fell on worlds with no warning and no insurance; this one has both, and far more people in the way."]
      ],
      against: [
        "A straight line ignores what could speed warming (feedbacks, cleaner air) and what could slow it (falling emissions). It is the least-assumption reading, not the best estimate.",
        "HadCRUT5 is one of several temperature records. They differ by about a tenth of a degree, and so does any date read off a trend.",
        "The 1.5 °C of the Paris Agreement is a long-run average, not a single year. One year above it is not the line crossed."
      ],
      watch: ["The first year in which global emissions fall without a recession.", "The ten-year average temperature, not the annual record.", "Arctic summer sea ice; the West Antarctic ice sheet."],
      links: [["The Archive: the Paris Agreement", "index.html#e=paris"], ["The Archive: the 1.5 °C line (expected)", "index.html#e=warming-1p5"], ["The Archive: sea level in 2100 (expected)", "index.html#e=sealevel-2100"], ["The Archive: the volcanic winter of 536", "index.html#e=vw536"]],
      src: ["ppm", "co2e", "temp"] }
  ],

  /* the Archive records these are computed from */
  threads: {
    polities: ["newkingdom", "hittites", "shang", "israel_kingdom", "kush", "assyria", "neobabylon", "parthia", "xiongnu", "han", "kushan", "sasanian", "gupta", "tang", "ghana_empire", "abbasid", "fatimids", "cordoba", "song", "hre", "kievanrus", "chola", "pagan", "delhisultanate", "mongol", "mali", "mamluks", "vijayanagara", "ming", "aztectriple", "inca", "benin", "songhai", "safavid", "mughal", "tokugawa", "romanov", "qing", "oyo", "ashanti", "indiaraj"],
    names: { newkingdom: "New Kingdom Egypt", hittites: "Hittite Empire", shang: "Shang dynasty", israel_kingdom: "Israel and Judah", kush: "Kingdom of Kush", assyria: "Neo-Assyrian Empire", neobabylon: "Neo-Babylonian Empire", parthia: "Parthian Empire", xiongnu: "Xiongnu confederacy", han: "Han dynasty", kushan: "Kushan Empire", sasanian: "Sasanian Empire", gupta: "Gupta Empire", tang: "Tang dynasty", ghana_empire: "Ghana Empire", abbasid: "Abbasid Caliphate", fatimids: "Fatimid Caliphate", cordoba: "Caliphate of Córdoba", song: "Song dynasty", hre: "Holy Roman Empire", kievanrus: "Kievan Rus'", chola: "Chola Empire", pagan: "Pagan Kingdom", delhisultanate: "Delhi Sultanate", mongol: "Mongol Empire", mali: "Mali Empire", mamluks: "Mamluk Sultanate", vijayanagara: "Vijayanagara Empire", ming: "Ming dynasty", aztectriple: "Aztec Triple Alliance", inca: "Inca Empire", benin: "Benin Empire", songhai: "Songhai Empire", safavid: "Safavid Persia", mughal: "Mughal Empire", tokugawa: "Tokugawa shogunate", romanov: "Romanov Russia", qing: "Qing dynasty", oyo: "Oyo Empire", ashanti: "Ashanti Empire", indiaraj: "British Raj" },
    standing: [["usconst", "United States (constitution)"], ["ataturk", "Turkish Republic"], ["un", "United Nations"], ["indiaind", "Republic of India"], ["chinarev", "People's Republic of China"], ["eu", "European Union"]],
    plagues: [["antonine", "the Antonine Plague"], ["justinian_plague", "the Plague of Justinian"], ["blackdeath", "the Black Death"], ["cholera", "cholera"], ["flu", "the Great Influenza"], ["aids", "HIV/AIDS"], ["covid", "COVID-19"]],
    info: [["writing", "writing"], ["alphabet", "the alphabet"], ["paper", "paper"], ["printing", "printing"], ["telegraph", "the telegraph"], ["telephone", "the telephone"], ["radio", "radio"], ["television", "television"], ["arpanet", "the computer network"], ["web", "the web"], ["smartphone", "the smartphone"], ["ai", "machine learning"]]
  },

  /* THE HORIZON: every dated expectation in the Archive, by the kind of knowledge it rests on */
  horizon: {
    classes: [
      { id: "clock", n: "Clockwork", c: "#49c9b8", def: "Set by orbital mechanics, the calendar or arithmetic. It happens on the day, whoever is there to see it." },
      { id: "plan", n: "Scheduled", c: "#5b93b8", def: "A date an institution has committed to. The direction is usually right and the date usually slips." },
      { id: "proj", n: "Projected", c: "#e8c455", def: "Where a measured trend or a published model arrives if nothing bends it. The decade is more reliable than the year." },
      { id: "claim", n: "Claimed", c: "#b48ef0", def: "A forecast by people with a stake in it, or a survey of their guesses. Recorded because it shapes what is being built." }
    ],
    of: { "eclipse-2027": "clock", "apophis-flyby": "clock", "halley-return": "clock", "venus-transit": "clock", "y2038": "clock", "voyager-silence": "clock", "un-centenary": "clock", "semiquin-2076": "clock",
      "europa-clipper-arrival": "plan", "dragonfly-titan": "plan", "artemis-landing": "plan", "moonbase": "plan", "iss-deorbit": "plan", "mars-sample": "plan", "crewed-mars": "plan", "lisa-launch": "plan", "ska-full": "plan", "hwo": "plan", "netzero-2050": "plan", "malaria-target": "plan",
      "warming-1p5": "proj", "peak-oil-demand": "proj", "renewables-majority": "proj", "ev-majority": "proj", "arctic-icefree": "proj", "sealevel-2100": "proj", "coral-crisis": "proj", "population-9b": "proj", "population-peak": "proj", "africa-quarter": "proj", "urban-70": "proj", "amr-2050": "proj", "india-century": "proj", "autonomous-normal": "proj",
      "mrna-cancer": "claim", "fusion-power": "claim", "quantum-utility": "claim", "bci-decade": "claim", "agi-median": "claim", "singularity-claim": "claim" }
  },

  method: {
    rules: [
      ["The whole record, every time", "Each line is drawn from the first year its source covers to the last. A trend read off the last twenty years is an anecdote; the same trend read off two hundred is evidence, and off twelve thousand it is context. Where a source starts late, the chart says so."],
      ["Trends and returns are different arguments", "A trend says: this has moved one way for a long time. A return says: this has happened before, this often. The Oracle keeps them apart, because extending a trend and applying a base rate fail in different ways."],
      ["Numbers come from the data, not from the writer", "Every figure in a reading is computed from the series when the page opens. None is typed in. If the data is updated, the sentences change."],
      ["Every deduction carries its grade and its opponent", "A grade says what the deduction rests on, not how strongly it is put. Beside each reading is the best case against it, written as its critics would make it."],
      ["Arithmetic is labelled as arithmetic", "Where the Oracle carries a line forward itself (the temperature trend, the base rate for pandemics), it says so and does not dress it as a model. Projections by others (the UN's population figures) are named as theirs."]
    ],
    limits: [
      "History does not repeat on a schedule. A base rate drawn from seven plagues or forty empires is a way of being less surprised, not a way of knowing.",
      "The largest events are the ones no trend contains. Two world wars account for most of two centuries' battle deaths; a reading made in 1913 from the trends of the nineteenth century would have been confident and wrong.",
      "What can be counted is not all that matters. There is no series here for trust, belief, meaning or the health of the living world, and the Oracle is silent on them because it has no data, not because they are unimportant.",
      "The Archive is not neutral in what it records. Its records lean toward Europe and toward recent centuries (the figures are below), and any return computed from its own events inherits that lean.",
      "These are readings of the record, written by the Archive. They are not predictions by the sources, which did not make them."
    ]
  }
};

/* ---------------- what each deduction rests on (v17) ----------------
   The owner: "no easy way to get from a statement made in the oracle to its substantiation."
   So every graded deduction names the facts and the charts of its own line that it rests on.
   One row per deduction, in the order of that line's `deduce`:
       [ facts, charts, note, horizon ]
     facts   — which entries of the line's `shows` it rests on (0-based; shown to the reader as "fact 1", "fact 2"…)
     charts  — which of the line's charts shows it (0-based)
     note    — said plainly when a deduction rests on something that is NOT a figure on the page
     horizon — the id of a dated expectation it rests on, if it rests on one
   Written by hand: it is a judgement about which fact carries which sentence, and it must be kept honest.
   A deduction with no fact and no chart MUST carry a note. tools/validate-oracle.js checks all of it. */
window.ARCHIVUS_ORACLE.rests = {
  power: [
    [[4, 0], [0]],
    [[1], [0]],
    [[0, 2, 3], [0]],
    [[], [], "This rests on two cases from history, both named in the sentence. No series on this page measures it."]
  ],
  orders: [
    [[0, 1], [0]],
    [[0, 2], [0]],
    [[], [], "A reading of the years since 1945, not a figure on this page. The count of governments ended by force is on the line Force."]
  ],
  war: [
    [[2, 4], [3]],
    [[3], [2]],
    [[0], [0]],
    [[1], [1]]
  ],
  rule: [
    [[0, 1, 3], [0]],
    [[1, 2], [0]],
    [[1], [0]]
  ],
  force: [
    [[1, 2, 3], [0]],
    [[1, 2], [0]],
    [[1], [0]]
  ],
  machines: [
    [[0, 1, 2], [0, 1]],
    [[3], [2]],
    [[], [], "This rests on a survey of experts recorded on the Horizon, not on a measured series.", "agi-median"],
    [[], [], "A claim made by its proponents and recorded on the Horizon. Nothing on this page supports it or can test it.", "singularity-claim"]
  ],
  life: [
    [[0, 1], [0]],
    [[5], [0]],
    [[4], [2]],
    [[2], [1]]
  ],
  people: [
    [[0], [0]],
    [[3], []],
    [[0, 1, 2], [0, 1]],
    [[2], [1]]
  ],
  plagues: [
    [[0, 1, 2], [0]],
    [[3], []]
  ],
  energy: [
    [[0], [0]],
    [[3, 4], [1, 2]],
    [[1, 2], [0]]
  ],
  climate: [
    [[0, 1], [0, 1]],
    [[2, 3], [2]],
    [[1], [1]],
    [[], [], "This rests on two events in the Archive, both named in the sentence. No series on this page measures it."]
  ]
};

