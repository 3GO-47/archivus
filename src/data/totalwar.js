/* ============================================================
   ARCHIVUS — TOTAL WAR: every war on one string (v19)
   Read by src/totalwar-app.js. Compiled 27 November 2026.

   Three kinds of row are strung together:
     1. `toll`   — the 76 wars that the reference list of wars by death toll puts at about half a million dead or more.
                   [id, name, start, end (null = still being fought), lane, low, high (millions dead), Archive event, conflict]
                   The range is the list's own. Read it as an order of magnitude: before 1800 the figures are
                   reconstructions, and they count the famine and disease a war brought, not only the killed.
     2. `more`   — wars the Archive's Chronicle records that the list does not size (ids of events; the engine reads
                   their dates, text and source from the Chronicle's own data).   `battles` — single days that turned a war.
     2b. `second` — where a second source was opened and gives a figure of its own (v19.1):
                   id: [low, high (millions; null = the source gives no number), what it says, who says it, URL, date read,
                        optional further sources opened for the same line: [[who, URL], …]]. Drawn as a gold mark on the Toll.
                   The text says what the figure measures when that is narrower than the list's (soldiers only, one part of
                   the war, a change in population, an ancient author's count).
                   Every sized war is in `second` or in `sought` (v19.2): `sought` says what was opened and that it gave no figure.
     3. the wars under way now, read live from src/data/conflicts.js (level 4 and 5), and the projected one, from ww3.html.
   Negative years are BCE. Lanes: eu Europe · wa West Asia & North Africa · ca Central & South Asia · ea East Asia ·
   se South-East Asia · af Africa · am the Americas · gl fought across continents.
   ============================================================ */
window.ARCHIVUS_TOTALWAR = {
  meta: { asOf: "2026-11-27", t0: -1300, t1: 2040 },
  lanes: [["gl", "Across continents"], ["eu", "Europe"], ["wa", "West Asia & North Africa"], ["ca", "Central & South Asia"], ["ea", "East Asia"], ["se", "South-East Asia"], ["af", "Africa"], ["am", "The Americas"]],
  /* the time axis is drawn in stretches, each given a share of the width, so that 3,300 years fit and the crowded centuries can be read */
  warp: [[-1300, 0], [-500, 0.07], [500, 0.17], [1500, 0.34], [1800, 0.56], [1900, 0.72], [2040, 1]],
  src: {
    list: ["Wikipedia — List of wars by death toll (read 27 Nov 2026; ranges as given there, each with its own citations)", "https://en.wikipedia.org/wiki/List_of_wars_by_death_toll"],
    mars: ["Project Mars — battle deaths, 1800 – 2011 (the series the Oracle charts)", "oracle.html#v=lines&i=war"],
    ww2: ["The National WWII Museum — worldwide deaths in World War II (the War Room's source)", "wars.html#w=ww2&v=cost"],
    ww1: ["Encyclopaedia Britannica — World War I: killed, wounded and missing (the War Room's source)", "wars.html#w=ww1&v=cost"]
  },
  toll: [
    ["ww2", "World War II", 1939, 1945, "gl", 70, 85, "ww2"], ["taiping", "Taiping Rebellion", 1850, 1864, "ea", 20, 70, "taiping"], ["mongol", "Mongol invasions and conquests", 1206, 1368, "ca", 20, 60, "mongol"],
    ["threekingdoms", "Three Kingdoms", 184, 280, "ea", 34, 34, "threekingdoms"], ["mingqing", "Transition from Ming to Qing", 1618, 1683, "ea", 25, 25], ["ww1", "World War I", 1914, 1918, "gl", 15, 22, "ww1"],
    ["timur", "Conquests of Timur", 1369, 1405, "ca", 7, 17, "timur"], ["anlushan", "An Lushan rebellion", 754, 763, "ea", 13, 13], ["mexico1519", "Spanish conquest of Mexico", 1519, 1530, "am", 10.5, 10.5, "cortes"],
    ["russiancivil", "Russian Civil War", 1917, 1922, "eu", 7, 10], ["chinesecivil", "Chinese Civil War", 1927, 1949, "ea", 4, 9], ["thirtyyears", "Thirty Years' War", 1618, 1648, "eu", 4.5, 8, "thirtyyears"],
    ["crusades", "The Crusades", 1095, 1291, "wa", 1, 9, "crusades"], ["inca", "Spanish conquest of the Inca Empire", 1533, 1572, "am", 7.7, 7.7], ["reconquista", "Reconquista", 718, 1492, "eu", 7, 7, "reconquista"],
    ["napoleon", "French Revolutionary and Napoleonic Wars", 1792, 1815, "eu", 4, 7, "napoleon"], ["menelik", "Conquests of Menelik II", 1878, 1904, "af", 5, 6], ["mahdist", "Mahdist War", 1881, 1899, "af", 4, 6],
    ["congo2", "Second Congo War", 1998, 2003, "af", 3, 5.4], ["newgranada", "Spanish conquest of New Granada", 1525, 1540, "am", 5.25, 5.25], ["deccan", "Deccan wars", 1680, 1707, "ca", 4.6, 5],
    ["northern", "Northern Wars", 1554, 1721, "eu", 3.57, 4.57], ["vietnam", "Vietnam War", 1955, 1975, "se", 1.3, 4.2, "vietnam"], ["biafra", "Nigerian Civil War", 1967, 1970, "af", 3.04, 4.1],
    ["frenchreligion", "French Wars of Religion", 1562, 1598, "eu", 2, 4], ["korea", "Korean War", 1950, 1953, "ea", 2.5, 3.5, "korea"], ["hundredyears", "Hundred Years' War", 1337, 1453, "eu", 2.3, 3.5, "hundredyears"],
    ["sovietafghan", "Soviet–Afghan War", 1979, 1989, "ca", 1, 3], ["delhi", "Delhi conquest of North India", 1300, 1310, "ca", 0.5, 3], ["bangladesh", "Bangladesh Liberation War", 1971, 1971, "ca", 0.3, 3, "bangladesh"],
    ["mexrev", "Mexican Revolution", 1910, 1920, "am", 1, 2.7, "mexrev"], ["fangla", "Fang La Rebellion", 1120, 1122, "ea", 2, 2], ["ethiopiancivil", "Ethiopian Civil War and Eritrean War of Independence", 1961, 1991, "af", 1.75, 2],
    ["caucasian", "Russo-Circassian War and Caucasian War", 1763, 1864, "eu", 1.5, 2], ["sudan2", "Second Sudanese Civil War", 1983, 2005, "af", 1, 2], ["tayson", "Tây Sơn wars", 1771, 1802, "se", 1, 2],
    ["akbar", "Akbar's conquest of North India", 1556, 1605, "ca", 1, 2], ["sepoy", "Indian Rebellion of 1857", 1857, 1858, "ca", 0.8, 2, "sepoy"], ["balkan", "Balkan Wars", 1912, 1913, "eu", 0.75, 1.77],
    ["algerian", "Algerian War", 1954, 1962, "wa", 0.4, 1.6], ["sevenyears", "Seven Years' War", 1756, 1763, "gl", 1, 1.5, "sevenyears"], ["warringstates", "Warring States period and Qin's wars of unification", -475, -221, "ea", 0.65, 1.5],
    ["algeria1830", "French conquest of Algeria", 1830, 1903, "wa", 0.98, 1.48], ["gallic", "Gallic Wars", -58, -50, "eu", 0.7, 1.47], ["jewishroman", "Jewish–Roman wars", 66, 135, "wa", 0.35, 1.4],
    ["spanishsuccession", "War of the Spanish Succession", 1701, 1714, "gl", 0.4, 1.25], ["alexander", "Wars of Alexander the Great", -336, -323, "wa", 1, 1, "alexander"], ["imjin", "Japanese invasions of Korea", 1592, 1598, "ea", 1, 1, "imjin"],
    ["panthay", "Panthay Rebellion", 1856, 1873, "ea", 1, 1], ["greatnorthern", "Great Northern War", 1700, 1721, "eu", 1, 1], ["uscivilwar", "American Civil War", 1861, 1865, "am", 0.6, 1, "uscivilwar"],
    ["mozambique", "Mozambican Civil War", 1977, 1992, "af", 0.5, 1], ["sudan1", "First Sudanese Civil War", 1955, 1972, "af", 0.5, 1], ["somali", "Somali Civil War", 1991, null, "af", 0.35, 1, null, "somalia"],
    ["burmesesiamese", "Burmese–Siamese wars", 1547, 1855, "se", 0.26, 0.9], ["indochina1", "First Indochina War", 1946, 1954, "se", 0.4, 0.84], ["angola", "Angolan Civil War", 1975, 2002, "af", 0.8, 0.8],
    ["burundi", "Burundian Civil War", 1993, 2005, "af", 0.55, 0.8], ["punic2", "Second Punic War", -218, -201, "eu", 0.77, 0.77, "punic"], ["austrian", "War of the Austrian Succession", 1740, 1748, "eu", 0.75, 0.75],
    ["punic3", "Third Punic War", -149, -146, "wa", 0.75, 0.75], ["russoukraine", "Russo-Ukrainian War", 2014, null, "eu", 0.6, 0.75, "ukraine2022", "ukraine"], ["iraniraq", "Iran–Iraq War", 1980, 1988, "wa", 0.45, 0.7, "iraniraq"],
    ["nineyears", "Nine Years' War", 1688, 1697, "eu", 0.68, 0.68], ["crimean", "Crimean War", 1853, 1856, "eu", 0.61, 0.67, "crimean"], ["syrian", "Syrian civil war", 2011, 2024, "wa", 0.58, 0.61, null, "syria"],
    ["mexindep", "Mexican War of Independence", 1810, 1821, "am", 0.6, 0.6], ["bahmani", "Bahmani–Vijayanagar wars", 1362, 1443, "ca", 0.6, 0.6], ["turkish", "Turkish War of Independence", 1919, 1923, "wa", 0.4, 0.6],
    ["tigray", "Tigray War", 2020, 2022, "af", 0.16, 0.6, null, "ethiopia"], ["romangermanic", "Roman–Germanic wars", -113, 774, "eu", 0.54, 0.54], ["punic1", "First Punic War", -264, -241, "eu", 0.4, 0.54],
    ["paraguayan", "Paraguayan War", 1864, 1870, "am", 0.15, 0.5], ["uganda", "Uganda–Tanzania War and Ugandan Bush War", 1978, 1986, "af", 0.1, 0.5], ["papuawar", "Papua conflict", 1962, null, "se", 0.1, 0.5, null, "papua"],
    ["eightyyears", "Eighty Years' War", 1566, 1648, "eu", 0.1, 0.5]
  ],
  /* wars in the Chronicle that the list does not size: the engine reads each from the Chronicle's data by id */
  more: ["kadesh", "troy", "collapse", "assyria", "marathon", "peloponnesian", "boudica", "attila", "conquests", "kamakura", "mongol_japan", "engcivilwar", "opium", "mexamwar", "boxer", "russojapanese",
         "abyssinia", "spanishcivil", "sinojapanese", "sixday", "gulf", "yugoslavia", "afghanistan", "iraqwar"],
  battles: ["adrianople", "tours", "hastings", "manzikert", "ainjalut", "constantinople1453", "vienna1529", "lepanto", "armada", "plassey", "adwa"],
  /* notes the engine shows on a card, where a row needs one */
  second: {
    ww2:          [60, 60, "about 60 million dead or more", "The National WWII Museum, as the War Room gives it", "wars.html#w=ww2&v=cost", "2026-11"],
    ww1:          [21.5, 21.5, "8.5 million soldiers and about 13 million civilians", "Encyclopaedia Britannica, as the War Room gives it", "wars.html#w=ww1&v=cost", "2026-11"],
    taiping:      [20, 20, "an estimated 20 million lives", "Encyclopaedia Britannica — Taiping Rebellion", "https://www.britannica.com/event/Taiping-Rebellion", "2026-11-27"],
    russiancivil: [5.8, 14, "roughly 800,000 military deaths and at least 5 million civilian ones; some historians put the total as high as 14 million", "World History Encyclopedia — Russian Civil War", "https://www.worldhistory.org/Russian_Civil_War/", "2026-11-27"],
    thirtyyears:  [8, 8, "a death toll of approximately 8 million", "World History Encyclopedia — Thirty Years' War", "https://www.worldhistory.org/Thirty_Years'_War/", "2026-11-27"],
    napoleon:     [2.9, 3, "soldiers only, 1800 – 1815: 900,000 to 1,000,000 French and about 2 million in the allied armies; no total with civilians is given", "Fondation Napoléon — The human cost of the Napoleonic wars", "https://www.napoleon.org/en/history-of-the-two-empires/articles/napoleon-the-dark-side-the-human-cost-of-the-napoleonic-wars-3-min-read/", "2026-11-27"],
    congo2:       [5.4, 5.4, "5.4 million excess deaths from August 1998 to April 2007, 2.1 million of them after the war formally ended in 2002", "International Rescue Committee — Mortality in the Democratic Republic of Congo", "https://www.rescue.org/report/mortality-democratic-republic-congo-ongoing-crisis", "2026-11-27"],
    biafra:       [0.5, 3, "an estimated 500,000 to 3,000,000 dead", "Encyclopaedia Britannica — Nigerian Civil War", "https://www.britannica.com/topic/Nigerian-civil-war", "2026-11-27"],
    korea:        [2.5, 2.5, "at least 2.5 million lives", "Encyclopaedia Britannica — Korean War", "https://www.britannica.com/event/Korean-War", "2026-11-27"],
    vietnam:      [3.4, 3.4, "as many as 2 million civilians, some 1.1 million North Vietnamese and Viet Cong fighters, 200,000 to 250,000 South Vietnamese soldiers and more than 58,300 Americans; the mark is their sum", "Encyclopaedia Britannica — How many people died in the Vietnam War?", "https://britannica.com/question/How-many-people-died-in-the-Vietnam-War", "2026-11-27"],
    uscivilwar:   [0.62, 0.62, "soldiers only: generally estimated at 620,000", "US National Park Service — Death and Dying", "https://www.nps.gov/stories/death-and-dying.htm", "2026-11-27"],
    iraniraq:     [0.5, 0.5, "perhaps 500,000 killed on both sides; one to two million casualties in all", "Encyclopaedia Britannica — casualties in the Iran-Iraq War", "https://www.britannica.com/question/What-is-the-estimate-of-total-casualties-in-the-Iran-Iraq-War", "2026-11-27"],
    /* added in v19.2 */
    frenchreligion: [4, 4, "approximately 4 million lives", "World History Encyclopedia — French Wars of Religion", "https://www.worldhistory.org/French_Wars_of_Religion/", "2026-11-27"],
    sevenyears: [1, 1, "over a million deaths, military and civilian; the great powers' battle deaths alone are 992,000 in Levy's list", "World History Encyclopedia — Seven Years' War", "https://www.worldhistory.org/Seven_Years'_War/", "2026-11-27", [["Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf"]]],
    sudan2: [2, 2, "more than two million people killed since the war resumed in 1983; the 2.5 million often quoted goes back to one consultant's estimate of no more than 1.9 million", "Encyclopaedia Britannica — South Sudan: resumption of civil war", "https://www.britannica.com/place/South-Sudan/Resumption-of-civil-war", "2026-11-27", [["Mass Atrocity Endings, Tufts University — Sudan: the second civil war", "https://sites.tufts.edu/atrocityendings/?p=52"]]],
    mexrev: [1.4, 2.1, "a demographic loss of 2.1 million between 1910 and 1921: about two-thirds of it excess deaths (some 1.4 million), the rest lost births and emigration", "Robert McCaa, University of Minnesota Population Center — Missing millions: the human cost of the Mexican Revolution", "https://users.pop.umn.edu/~rmccaa/missmill/abstract.htm", "2026-11-27"],
    ethiopiancivil: [1, 1, "listed among the conflicts with more than a million dead (the Ogaden and Eritrean wars, 1962 – 1992): a floor, not an estimate. Soldiers killed in battle alone are counted at 126,000", "Vaclav Smil, Global Catastrophes and Trends (MIT Press), excerpted in The MIT Press Reader", "https://thereader.mitpress.mit.edu/the-mega-wars-that-shaped-world-history", "2026-11-27", [["Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart"]]],
    bangladesh: [1, 1, "listed among the conflicts with more than a million dead (the India–Pakistan war of 1971): a floor, not an estimate. Soldiers killed in battle alone are counted at 11,100", "Vaclav Smil, Global Catastrophes and Trends (MIT Press), excerpted in The MIT Press Reader", "https://thereader.mitpress.mit.edu/the-mega-wars-that-shaped-world-history", "2026-11-27", [["Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart"]]],
    angola: [1, 1, "listed among the conflicts with more than a million dead (Angola's civil wars, 1974 – 2002): a floor, not an estimate. Soldiers killed in battle alone are counted at 59,650", "Vaclav Smil, Global Catastrophes and Trends (MIT Press), excerpted in The MIT Press Reader", "https://thereader.mitpress.mit.edu/the-mega-wars-that-shaped-world-history", "2026-11-27", [["Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart"]]],
    mozambique: [1, 1, "listed among the conflicts with more than a million dead (1975 – 1993): a floor, not an estimate", "Vaclav Smil, Global Catastrophes and Trends (MIT Press), excerpted in The MIT Press Reader", "https://thereader.mitpress.mit.edu/the-mega-wars-that-shaped-world-history", "2026-11-27"],
    chinesecivil: [1.2, 1.2, "soldiers killed in battle only: 1,200,000, a low estimate", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    crimean: [0.825, 0.825, "825,000 people killed, in a university lecture's summary of the great wars; soldiers killed in battle alone are counted at 142,559", "Stephen Van Evera, MIT OpenCourseWare 17.42, Causes and Prevention of War — the great wars", "https://ocw.mit.edu/courses/17-42-causes-and-prevention-of-war-spring-2018/f9dd7d01c41ef6951def531f48ec577c_MIT17_42S18_lec10_GreatWars.pdf", "2026-11-27", [["Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart"]]],
    paraguayan: [0.0554, 0.0554, "soldiers killed in battle only: 55,400, a low estimate; most of the war's dead were not killed in battle", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    sepoy: [0.0135, 0.0135, "soldiers killed in battle only: 13,534, a low estimate; the list's figure counts the reprisals and famine that followed", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    mahdist: [0.105, 0.105, "soldiers killed in battle only: about 105,000 across the five wars of the Mahdist state that the dataset counts", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    turkish: [0.0389, 0.0389, "soldiers killed in battle only, on one front: 38,900 in the Greco-Turkish War", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    balkan: [0.0778, 0.0778, "soldiers killed in battle only, in the second of the two wars: 77,800. The International Encyclopedia of the First World War's article would not open", "Project Mars (Jason Lyall, Divided Armies, 2020), as published by Our World in Data", "https://ourworldindata.org/grapher/deaths-in-wars-by-war-1800-2011-bar-chart", "2026-11-27"],
    gallic: [1, 1, "an ancient author's count, written a century and a half later: of three million fought, one million killed and another million taken captive", "Plutarch, Life of Caesar 15 (Loeb translation, at LacusCurtius)", "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Caesar*.html", "2026-11-27"],
    jewishroman: [1.68, 1.68, "two ancient authors' counts: 1,100,000 perished in the siege of Jerusalem (Josephus) and 580,000 were slain in the Bar Kokhba war (Cassius Dio)", "Josephus, The Jewish War 6.9.3 (Whiston's translation, at LacusCurtius)", "https://penelope.uchicago.edu/josephus/war-6.html", "2026-11-27", [["Cassius Dio, Roman History 69.12 – 14, at Livius", "https://www.livius.org/sources/content/cassius-dio/cassius-dio-on-bar-kochba/"]]],
    anlushan: [null, null, "no count is possible: slightly more than 50 million people were registered in 742 and no reliable figures survive from after the rebellion. A historian calls the 36 million sometimes quoted too high, because the census records it rests on are incomplete", "James Carter, The China Project — The end of China's golden age", "https://thechinaproject.com/2021/02/03/the-end-of-chinas-golden-age/", "2026-11-27", [["Encyclopaedia Britannica — China: Tang population movements", "https://www.britannica.com/place/China/Population-movements"]]],
    mingqing: [36, 36, "approximately 36 million people, about 16% of the population, lost their lives; another estimate has the population falling from 221 million in 1630 to 185 million in 1680", "Carol Shiue and Wolfgang Keller, Elite Strategies for Big Shocks: the Case of the Fall of the Ming (NBER Working Paper 33121, 2024)", "https://www.nber.org/system/files/working_papers/w33121/w33121.pdf", "2026-11-27"],
    mexico1519: [1, 28.6, "a fall in population between 1519 and 1595, most of it from disease, not a count of war dead: published estimates run from 1 million (Rosenblat) through about 8 million (Cook and Simpson) to between 17 and 29 million (Cook and Borah)", "University of Minnesota Population Center — Demographic Disaster in Mexico, 1519 – 1595 (table of published estimates)", "https://users.pop.umn.edu/%7Ermccaa/mxpoprev/table2.htm", "2026-11-27"],
    inca: [11, 11, "a fall in population, not a count of war dead: roughly 12 million in the Inca empire at the conquest in 1532, and just over one million in Peru's first accurate census, in 1791", "Encyclopaedia Britannica — Peru: demographic trends", "https://www.britannica.com/place/Peru/Demographic-trends", "2026-11-27"],
    sovietafghan: [0.88, 1.5, "overall war mortality of 1 to 1.5 million in one survey (Sliwinski) and 876,825 deaths for 1978 – 1987 in another (Khalidi); about 500,000 civilians killed as a best estimate", "Mass Atrocity Endings, Tufts University — Afghanistan: Soviet invasion and civil war", "https://sites.tufts.edu/atrocityendings/?p=87", "2026-11-27"],
    algerian: [0.3, 0.3, "total deaths from all causes, combatants included, likely around 300,000; about 90,000 can be counted as a minimum", "Mass Atrocity Endings, Tufts University — Algeria: war of independence", "https://sites.tufts.edu/atrocityendings/?p=68", "2026-11-27"],
    indochina1: [0.4, 0.4, "some 400,000 deaths: 75,000 French Union soldiers, 175,000 Viet Minh and 125,000 civilians", "University of Central Arkansas, Dynamic Analysis of Dispute Management project — French Indochina/Vietnam (1941 – 1954)", "https://uca.edu/politicalscience/dadm-project/asiapacific-region/french-indochinavietnam-1941-1954", "2026-11-27"],
    burundi: [0.15, 0.3, "150,000 to 300,000 civilian deaths between 1993 and 2005, the range most often cited", "Mass Atrocity Endings, Tufts University — Burundi", "https://sites.tufts.edu/atrocityendings/?p=46", "2026-11-27"],
    uganda: [0.1, 0.5, "for Obote's second government, 1980 – 1985: 100,000 to 200,000 dead (Amnesty International) and up to 500,000 (the Library of Congress country study)", "Mass Atrocity Endings, Tufts University — Uganda under Obote", "https://sites.tufts.edu/atrocityendings/?p=26", "2026-11-27"],
    sudan1: [0.5, 0.5, "about 500,000 people dead by the late 1960s, some years before the war ended", "US Library of Congress country study — Sudan: the southern problem", "https://countrystudies.us/sudan/24.htm", "2026-11-27"],
    somali: [0.05, 0.1, "for 1988 – 1993 only, the fall of Siad Barre and the first years of the civil war: about 50,000 dead on the lower estimates and roughly 100,000 on the higher", "Mass Atrocity Endings, Tufts University — Somalia: fall of Siad Barre and the civil war", "https://sites.tufts.edu/atrocityendings/?p=50", "2026-11-27"],
    tigray: [0.5, 0.6, "up to 600,000 killed, said the African Union's mediator in January 2023; up to 500,000 in Ghent University's estimate of March 2022, most of them from hunger and lack of care", "The National — Tigray death toll could be as high as 600,000, African Union envoy says", "https://thenationalnews.com/world/africa/2023/01/16/tigray-death-toll-could-be-as-high-as-600000-african-union-envoy-says", "2026-11-27"],
    syrian: [0.307, 0.307, "civilians only: 306,887 killed between 1 March 2011 and 31 March 2021, not counting those who died for want of care, food or clean water", "UN News — the UN human rights office's estimate, June 2022", "https://news.un.org/en/story/2022/06/1121532", "2026-11-27"],
    russoukraine: [0.575, 0.6, "soldiers only, since February 2022: 450,000 Russian and 125,000 to 150,000 Ukrainian troops killed, in a study by the Center for Strategic and International Studies of 1 July 2026", "The Irish Times — Troop casualties in Ukraine war top 2 million, study finds", "https://www.irishtimes.com/world/europe/2026/07/01/troop-casualties-in-ukraine-war-top-2-million-study-finds/", "2026-11-27"],
    papuawar: [0.1, 0.1, "at least 100,000 West Papuans killed since the Indonesian takeover in the 1960s, Amnesty International's figure", "The Conversation — Fight for freedom: new research to map violence in the forgotten conflict in West Papua", "https://theconversation.com/fight-for-freedom-new-research-to-map-violence-in-the-forgotten-conflict-in-west-papua-128058", "2026-11-27"],
    punic3: [0.05, 0.2, "Carthage alone: a population that may have exceeded a quarter of a million, of whom only 50,000 remained at the surrender; other estimates give the city 100,000 to 200,000 people", "Encyclopaedia Britannica — Third Punic War", "https://www.britannica.com/event/Third-Punic-War", "2026-11-27", [["World History Encyclopedia — Genocide in the Ancient World", "https://www.worldhistory.org/article/485/genocide-in-the-ancient-world/"]]],
    algeria1830: [null, null, "no count of the dead is given: the native population fell by nearly one-third between the invasion and the mid-1870s, and estimates of deaths vary considerably", "Encyclopaedia Britannica — Algeria: colonial rule", "https://www.britannica.com/place/Algeria/Colonial-rule", "2026-11-27"],
    nineyears: [0.68, 0.68, "the great powers' battle deaths only: 680,000 (the War of the League of Augsburg). This is the figure the list itself carries", "Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf", "2026-11-27"],
    spanishsuccession: [1.251, 1.251, "the great powers' battle deaths only: 1,251,000. This is the list's high figure", "Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf", "2026-11-27"],
    austrian: [0.359, 0.359, "the great powers' battle deaths only: 359,000", "Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf", "2026-11-27"],
    greatnorthern: [0.064, 0.064, "the great powers' battle deaths only: 64,000 for the war of 1700 – 1721", "Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf", "2026-11-27"],
    northern: [0.086, 0.086, "the great powers' battle deaths only, for two of the wars the list strings together: 22,000 (1654 – 1660) and 64,000 (1700 – 1721)", "Joshua S. Goldstein, Long Cycles, chapter 11, table 11.2: Levy's list of wars", "https://www.joshuagoldstein.com/jgcyc11.pdf", "2026-11-27"],
    caucasian: [0.625, 0.625, "at least 625,000 Circassians died in the 1860s, and about a million were deported to Anatolia", "Walter Richmond, History News Network — Russia's forgotten genocide", "https://hnn.us/article/151025", "2026-11-27"],
    eightyyears: [0.1, 0.5, "an estimated 100,000 to as high as 500,000 lives", "World History Encyclopedia — Eighty Years' War", "https://www.worldhistory.org/Eighty_Years'_War/", "2026-11-27"]
  },
  /* opened on 27 Nov 2026 and found to give no figure: say so rather than leave a silence */
  sought: {
    mongol: "Opened: the World History Encyclopedia on the Mongol Empire, which gives no figure, and on Genghis Khan, which says only 'millions according to medieval chroniclers'. The list's range stands alone, and is a reconstruction from population records.",
    threekingdoms: "Opened: Britannica on the Six Dynasties and the record of Rafe de Crespigny's history of the period; neither gives a population or a death figure. The list's figure is the gap between two censuses.",
    timur: "Opened: the World History Encyclopedia on Timur, which counts single massacres (7,000 captives thrown from the walls of Van) and gives no total.",
    crusades: "Opened: the World History Encyclopedia on the First Crusade, which gives 3,000 killed at Jerusalem in one Muslim source and no total for the Crusades.",
    reconquista: "Searched: the pages found repeat the list's figure; none is a second estimate. The list gives one number for seven and a half centuries.",
    menelik: "Searched: the pages found repeat the list's figure; none is a second estimate.",
    newgranada: "Searched: the pages found repeat the list's figure; none is a second estimate. Like the other conquests, it is a fall in population more than a count of war dead.",
    deccan: "Opened: Britannica on Aurangzeb, which gives no figure for the Deccan wars.",
    hundredyears: "Opened: the World History Encyclopedia on the war's consequences, which gives no figure.",
    delhi: "Opened: the summary of the Cambridge World History of Genocide's chapter on medieval India, which gives no count.",
    akbar: "Opened: the summary of the Cambridge World History of Genocide's chapter on medieval India, which gives no count.",
    bahmani: "Opened: the summary of the Cambridge World History of Genocide's chapter on medieval India, which gives no count.",
    fangla: "Searched: the pages found repeat the list's figure; none is a second estimate.",
    tayson: "Searched: the pages found repeat the list's figure; none is a second estimate.",
    burmesesiamese: "Searched: the pages found repeat the list's figure; none is a second estimate.",
    warringstates: "Opened: the World History Encyclopedia on ancient Chinese warfare, which counts 358 separate conflicts in the period and gives no death figures.",
    alexander: "Opened: Britannica on Alexander (its opening section), which gives no figure.",
    imjin: "The World History Encyclopedia's article on the invasions would not open; no second figure was read.",
    panthay: "Opened: a review of David Atwill's history of the rebellion, which gives 8,000 Hui killed in the Kunming massacre of 1856 and no total.",
    punic2: "Opened: the World History Encyclopedia and Britannica on the Punic Wars. They give 44,000 Romans dead at Cannae alone and no total for the war.",
    punic1: "Opened: the World History Encyclopedia on the First Punic War. It gives single losses (as many as 100,000 men drowned in one storm) and no total.",
    mexindep: "Opened: a reference summary of the war (EBSCO), which gives no figure.",
    romangermanic: "Opened: the World History Encyclopedia on the Cimbri. It gives up to 80,000 Roman casualties at Arausio alone and no total for nine centuries of wars."
  },
  notes: {
    sinojapanese: "The list counts this war's dead inside World War II.",
    reconquista: "Seven and a half centuries of intermittent war; the list gives one figure for the whole.",
    romangermanic: "The list strings nine centuries of wars under one name.",
    mongol: "The widest range on the string: the high figure assumes the population losses recorded in China and Persia were deaths.",
    taiping: "The range is wide because it rests on census gaps before and after, not on counts of the dead.",
    threekingdoms: "A census difference, not a count: registered households fell, and not everyone who vanished from the rolls was dead.",
    ww2: "The War Room gives about 60 million or more, citing the National WWII Museum; the list's range is 70 to 85 million.",
    ww1: "The War Room gives 8.5 million soldiers killed and about 13 million civilians, citing Britannica."
  }
};
