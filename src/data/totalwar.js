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
                   id: [low, high (millions), what it says, who says it, URL, date read]. Drawn as a gold mark on the Toll.
                   A war absent from `second` has only the list's figure; `sought` names where a second was looked for and not found.
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
    iraniraq:     [0.5, 0.5, "perhaps 500,000 killed on both sides; one to two million casualties in all", "Encyclopaedia Britannica — casualties in the Iran-Iraq War", "https://www.britannica.com/question/What-is-the-estimate-of-total-casualties-in-the-Iran-Iraq-War", "2026-11-27"]
  },
  /* opened on 27 Nov 2026 and found to give no figure: say so rather than leave a silence */
  sought: {
    chinesecivil: "Britannica's article on the Chinese Civil War was opened and gives no figure for its dead: the list's range stands alone.",
    mongol: "A search for a second figure turned up only pages that repeat the list's: the range stands alone, and is a reconstruction from population records."
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
