/* ============================================================
   ARCHIVUS — THE WAR ROOM · dataset I: the First World War
   ------------------------------------------------------------
   Everything the War Room draws for 1914–1919 lives here:
   who was on which side and when (countries + powers), where
   the fronts stood (keyframed lines the app interpolates
   between), the offensives (moves), the battles and turning
   points (items), the leaders and the ties between them, the
   human cost, and causes / aftermath.

   CONVENTIONS
   · dates are ISO strings "YYYY-MM-DD"; coordinates are [lat, lon]
   · the map uses TODAY'S borders (Natural Earth 110m). The 1914
     empires are approximated by the modern countries they covered;
     `alias` gives the period name shown to the reader
   · status codes: E Allied power · e Allied empire/colony ·
     C Central Power · c German colony · oC occupied by the Central
     Powers · oE captured by the Allies · X left the war ·
     D defeated / under armistice · I newly independent · N neutral
   · fronts are SCHEMATIC: hand-traced at key dates from the
     standard campaign maps and linearly interpolated in between
   · casualty figures: Encyclopaedia Britannica's table (see cost.src)
   · every item carries a source URL (u). `ref` points at a record
     that already exists in the main archive; `ar` asks the bridge
     (events7.js) to add the item to the archive as a new record:
     ar = [importance, theme, region, civ, related[]]
   ============================================================ */
(function () {
  "use strict";
  const W = "https://en.wikipedia.org/wiki/";

  /* ---- front geometry (limit of Central Powers' control) ---- */
  /* Western Front: Swiss border → North Sea, then the neutral Dutch frontier back to Aachen */
  const WT = [[51.3,3.0],[51.4,3.35],[51.28,3.8],[51.33,4.3],[51.45,4.8],[51.3,5.2],[51.2,5.8],[50.9,5.7],[50.75,6.02]];
  const WB = [[47.5,7.17],[47.82,6.9],[48.05,7.0],[48.3,7.1],[48.5,7.15],[48.65,6.95],[48.75,6.6],[48.9,6.2],[49.05,5.95],[49.2,5.9],[49.45,5.95],[49.47,6.37],[49.8,6.5],[50.13,6.14],[50.4,5.97],[50.75,6.02]];
  const WS = [[47.5,7.17],[47.8,7.15],[48.04,7.14],[48.17,7.08],[48.35,7.05],[48.58,6.93],[48.75,6.6],[48.9,6.23]];           /* Vosges–Lorraine: barely moved in four years */
  const WV = [[48.9,5.9],[48.89,5.54],[49.07,5.6],[49.2,5.6],[49.28,5.4],[49.25,5.2],[49.2,4.95],[49.2,4.6]];                 /* St-Mihiel salient – Verdun – Argonne – Champagne */
  const WF = [[50.29,2.83],[50.45,2.8],[50.53,2.8],[50.63,2.87],[50.76,2.9],[50.85,2.98],[50.9,2.88],[51.03,2.86],[51.16,2.72]]; /* Arras – Ypres – the Yser */
  const W1914 = WS.concat(WV, [[49.3,4.1],[49.4,3.9],[49.44,3.7],[49.42,3.3],[49.5,3.05],[49.65,2.85],[49.83,2.75],[49.95,2.75],[50.03,2.72],[50.18,2.68]], WF);
  const W1917 = WS.concat(WV, [[49.3,4.1],[49.4,3.9],[49.44,3.7],[49.44,3.45],[49.6,3.35],[49.85,3.2],[50.0,3.12],[50.12,3.05],[50.2,2.95]], WF);
  const W1918 = WS.concat(WV, [[49.25,4.2],[49.33,4.05],[49.2,3.9],[49.08,3.75],[49.04,3.55],[49.04,3.4],[49.15,3.2],[49.3,3.12],[49.42,3.05],[49.5,2.9],[49.6,2.6],[49.75,2.5],[49.87,2.5],[50.0,2.6],[50.15,2.65],
    [50.29,2.83],[50.45,2.8],[50.53,2.75],[50.6,2.6],[50.72,2.6],[50.8,2.8],[50.85,2.9],[50.9,2.88],[51.03,2.86],[51.16,2.72]]);

  /* Eastern Front: Baltic → Bukovina */
  const EG = [[50.68,21.75],[50.4,23.3],[50.48,24.28],[50.08,25.15],[49.53,26.15],[48.55,26.45],[48.22,26.27]];                /* the Galician frontier of 1914 */
  const EB = [[55.9,20.6],[55.92,21.07],[55.3,21.7],[55.08,22.57],[54.64,22.75],[54.0,22.8],[53.65,22.5],[53.35,21.0],[53.15,19.6],[52.9,18.8],[52.29,17.87],[51.76,18.05],[51.1,18.6],[50.4,19.1],[50.2,19.9]].concat(EG);
  const EN15 = [[55.9,20.6],[56.6,20.6],[57.5,21.3],[57.8,22.6],[57.2,23.3],[57.0,23.45],[56.8,24.0],[56.6,24.6],[56.4,25.5],[56.0,26.3],[55.6,26.6],[55.1,26.8],[54.5,26.3],[53.9,26.1],[53.2,26.1],[52.6,26.0],[52.1,26.1],[51.6,25.9]];
  const EN17 = [[55.9,20.6],[56.6,20.6],[57.5,21.3],[57.8,22.6],[57.5,23.6],[57.35,24.4],[57.15,24.9],[56.75,25.2],[56.4,25.5],[56.0,26.3],[55.6,26.6],[55.1,26.8],[54.5,26.3],[53.9,26.1],[53.2,26.1],[52.6,26.0],[52.1,26.1],[51.6,25.9]];
  const E17 = EN17.concat([[51.3,25.2],[50.9,24.9],[50.4,25.0],[49.9,25.6],[49.55,26.1],[49.0,26.2],[48.55,26.4],[48.2,26.2]]);
  const E18 = [[55.9,20.6],[57.5,20.9],[58.6,21.4],[59.3,22.3],[59.75,24.5],[59.75,27.0],[59.45,28.1],[58.8,27.8],[57.82,28.4],[56.9,28.6],[56.0,28.8],[55.5,28.9],[54.5,30.4],[53.9,30.4],[52.9,31.0],[52.4,31.6],[52.0,33.3],[51.3,34.4],[50.6,36.6],[50.2,38.1],[49.2,39.6],[48.3,40.3],[47.25,39.75],
    [47.0,39.0],[46.5,37.5],[45.5,36.7],[44.9,36.3],[44.3,34.3],[44.8,32.8],[45.9,31.5],[46.3,30.8],[46.1,30.4],[46.8,29.6],[47.9,29.0],[48.45,27.8],[48.5,26.6],[48.22,26.27]];

  const BRIT = ["India","Pakistan","Bangladesh","Myanmar","Sri Lanka","Malaysia","Brunei","Sudan","S. Sudan","Kenya","Uganda","Nigeria","Ghana","Sierra Leone","Gambia","Somaliland","Zambia","Zimbabwe","Malawi","Botswana","Lesotho","eSwatini","Guyana","Belize","Jamaica","Trinidad and Tobago","Bahamas","Fiji","Solomon Is.","Falkland Is.","Egypt","Nepal"];
  const FREN = ["Algeria","Tunisia","Morocco","Senegal","Mali","Mauritania","Niger","Burkina Faso","Guinea","Côte d'Ivoire","Benin","Chad","Central African Rep.","Congo","Gabon","Madagascar","Djibouti","Vietnam","Laos","Cambodia","New Caledonia","Fr. S. Antarctic Lands","Vanuatu"];
  const RUSS = ["Estonia","Latvia","Lithuania","Belarus","Ukraine","Moldova","Georgia","Armenia","Azerbaijan","Kazakhstan","Uzbekistan","Turkmenistan","Kyrgyzstan","Tajikistan"];

  window.ARCHIVUS_WARS = window.ARCHIVUS_WARS || {};
  window.ARCHIVUS_WARS.ww1 = {
    id: "ww1", name: "World War I", aka: "The Great War", numeral: "I",
    start: "1914-06-15", end: "1919-07-15", warStart: "1914-07-28", warEnd: "1918-11-11",
    blurb: "A Balkan assassination trips a continent of alliances. Four years of industrial slaughter kill some 8.5 million soldiers, topple four empires and redraw the map from the Rhine to the Euphrates.",
    wrap: -180,
    sides: {
      A: { name: "The Allied (Entente) Powers", short: "Allies", color: "#4f8fd6" },
      B: { name: "The Central Powers", short: "Central Powers", color: "#d2452f" }
    },
    /* status code → [legend label, side (A/B/null), css class] */
    status: {
      E:  ["Allied (Entente) power — at war", "A", "s-A"],
      e:  ["Allied empire, dominion or colony", "A", "s-a"],
      C:  ["Central Power — at war", "B", "s-B"],
      c:  ["German colony", "B", "s-b"],
      oC: ["Occupied by the Central Powers", "B", "s-oB"],
      oE: ["Captured by the Allies", "A", "s-oA"],
      X:  ["Left the war (revolution / separate peace)", null, "s-X"],
      D:  ["Defeated — under armistice", "B", "s-D"],
      I:  ["Newly independent state", null, "s-I"],
      N:  ["Neutral", null, "s-N"]
    },
    legend: ["E", "e", "oE", "C", "c", "oC", "D", "X", "I", "N"],
    mapNote: "Drawn on today's borders — the empires of 1914 are approximated by the modern countries they covered. Front lines are schematic, traced at key dates and interpolated between them.",

    alias: {
      "Turkey": "Ottoman Empire", "Austria": "Austria-Hungary (Austria)", "Hungary": "Austria-Hungary (Hungary)", "Czechia": "Austria-Hungary (Bohemia & Moravia)",
      "Slovakia": "Austria-Hungary (Upper Hungary)", "Slovenia": "Austria-Hungary (Carniola)", "Croatia": "Austria-Hungary (Croatia)", "Bosnia and Herz.": "Austria-Hungary (Bosnia)",
      "Russia": "Russian Empire", "Poland": "Poland (partitioned — Russian, German & Austrian)", "Ukraine": "Russian Empire (Ukraine)", "Belarus": "Russian Empire (Belarus)",
      "Lithuania": "Russian Empire (Lithuania)", "Latvia": "Russian Empire (Latvia)", "Estonia": "Russian Empire (Estonia)", "Finland": "Grand Duchy of Finland (Russian Empire)",
      "Iraq": "Ottoman Mesopotamia", "Syria": "Ottoman Syria", "Lebanon": "Ottoman Lebanon", "Israel": "Ottoman Palestine", "Palestine": "Ottoman Palestine", "Jordan": "Ottoman Transjordan",
      "Yemen": "Ottoman Yemen", "Saudi Arabia": "Arabia (Hejaz & Nejd)", "Tanzania": "German East Africa", "Namibia": "German South West Africa", "Cameroon": "Kamerun (German)",
      "Togo": "Togoland (German)", "Papua New Guinea": "German New Guinea & Papua", "Rwanda": "German East Africa (Ruanda)", "Burundi": "German East Africa (Urundi)",
      "Iran": "Persia", "Thailand": "Siam", "India": "British India", "Myanmar": "Burma (British India)", "Pakistan": "British India", "Bangladesh": "British India",
      "Serbia": "Kingdom of Serbia", "Macedonia": "Serbia (Macedonia)", "Kosovo": "Serbia (Kosovo)", "North Korea": "Korea (Japanese)", "South Korea": "Korea (Japanese)",
      "Taiwan": "Formosa (Japanese)", "Dem. Rep. Congo": "Belgian Congo", "Ireland": "United Kingdom (Ireland)", "United Kingdom": "United Kingdom", "Libya": "Italian Libya"
    },

    /* [timeline, ...modern countries].  timeline = [[date, status, note?], …] */
    countries: [
      [[["1914-08-01","C","Germany declares war on Russia (1 Aug) and France (3 Aug)"],["1918-11-11","D","Armistice of Compiègne"]], "Germany"],
      [[["1914-07-28","C","Austria-Hungary declares war on Serbia"],["1918-11-03","D","Armistice of Villa Giusti; the Habsburg empire dissolves"]], "Austria"],
      [[["1914-07-28","C","Austria-Hungary declares war on Serbia"],["1918-10-31","I","Hungary breaks from Austria (Aster Revolution)"],["1918-11-03","D","Armistice of Villa Giusti"]], "Hungary"],
      [[["1914-07-28","C","Austria-Hungary declares war on Serbia"],["1918-10-28","I","Czechoslovakia proclaimed in Prague"]], "Czechia", "Slovakia"],
      [[["1914-07-28","C","Austria-Hungary declares war on Serbia"],["1918-10-29","I","State of Slovenes, Croats and Serbs — Yugoslavia follows on 1 Dec"]], "Slovenia", "Croatia", "Bosnia and Herz."],
      [[["1914-10-29","C","Ottoman fleet shells Russian ports; the empire is in the war"],["1918-10-30","D","Armistice of Mudros"]], "Turkey", "Yemen"],
      [[["1914-10-29","C","Ottoman Empire enters the war"],["1917-03-11","oE","British Indian army takes Baghdad"]], "Iraq"],
      [[["1914-10-29","C","Ottoman Empire enters the war"],["1917-12-09","oE","Jerusalem surrenders to Allenby"]], "Israel", "Palestine"],
      [[["1914-10-29","C","Ottoman Empire enters the war"],["1918-09-25","oE","Amman falls after Megiddo"]], "Jordan"],
      [[["1914-10-29","C","Ottoman Empire enters the war"],["1918-10-01","oE","Damascus falls; Beirut a week later"]], "Syria", "Lebanon"],
      [[["1915-10-14","C","Bulgaria joins the Central Powers and invades Serbia"],["1918-09-29","D","Armistice of Salonica — first Central Power to quit"]], "Bulgaria"],
      [[["1914-07-28","E","Attacked by Austria-Hungary"],["1915-11-25","oC","Overrun by German, Austro-Hungarian and Bulgarian armies; the army retreats across Albania"],["1918-11-01","E","Belgrade liberated"]], "Serbia", "Kosovo", "Macedonia"],
      [[["1914-08-06","E","Declares war on Austria-Hungary"],["1916-01-25","oC","Capitulates to Austria-Hungary"],["1918-11-01","E","Liberated"]], "Montenegro"],
      [[["1916-01-28","oC","North and centre occupied by Austria-Hungary; Italians and French hold the south"],["1918-10-15","oE","Cleared by the Allies"]], "Albania"],
      [[["1914-08-04","E","Invaded by Germany; most of the country is occupied for four years (see the front)"]], "Belgium"],
      [[["1914-08-02","oC","Occupied by Germany on the first day of the western campaign"],["1918-11-11","N","Liberated at the armistice"]], "Luxembourg"],
      [[["1914-08-03","E","Germany declares war on France"]], "France"],
      [[["1914-08-04","E","Britain declares war after Germany invades Belgium"]], "United Kingdom", "Ireland", "Canada", "Australia", "New Zealand", "South Africa"],
      [[["1914-08-04","e","British Empire at war — over a million Indian soldiers serve overseas"]]].concat(BRIT),
      [[["1914-11-05","e","British protectorates; Britain at war with the Ottomans"]], "Kuwait", "Qatar", "United Arab Emirates", "Oman", "Cyprus", "N. Cyprus"],
      [[["1914-08-03","e","French Empire at war — c. 500,000 colonial troops serve in Europe"]]].concat(FREN),
      [[["1914-08-04","e","Belgian Congo — its Force Publique fights in East Africa"]], "Dem. Rep. Congo"],
      [[["1914-08-01","E","Germany declares war on Russia"],["1917-12-15","X","Bolshevik armistice; Treaty of Brest-Litovsk signed 3 March 1918"]], "Russia"],
      [[["1914-08-01","E","Russian Empire at war"],["1918-03-03","X","Ceded or abandoned at Brest-Litovsk; civil war follows"]]].concat(RUSS),
      [[["1914-08-01","E","Russian Empire at war"],["1917-12-06","I","Finland declares independence; civil war in 1918"]], "Finland"],
      [[["1914-08-01","E","Russian Poland is the Eastern Front's first battlefield (western and southern Poland belonged to Germany and Austria)"],["1915-08-05","oC","Warsaw falls in the Great Retreat"],["1918-11-11","I","Poland reborn after 123 years of partition"]], "Poland"],
      [[["1915-05-23","E","Italy leaves the Triple Alliance and declares war on Austria-Hungary"]], "Italy"],
      [[["1915-05-23","e","Italian colonies"]], "Libya", "Eritrea", "Somalia"],
      [[["1916-08-27","E","Romania declares war on Austria-Hungary"],["1916-12-06","oC","Bucharest falls; king and army hold out in Moldavia"],["1918-05-07","X","Treaty of Bucharest"],["1918-11-10","E","Re-enters the war one day before the armistice"]], "Romania"],
      [[["1917-07-02","E","Greece enters the war (late June – 2 July 1917) after King Constantine is forced out; Allied troops had held Salonika since 1915"]], "Greece"],
      [[["1916-03-09","E","Germany declares war on Portugal"]], "Portugal"],
      [[["1916-03-09","e","Portuguese colonies"]], "Angola", "Mozambique", "Guinea-Bissau", "Timor-Leste"],
      [[["1914-08-23","E","Japan declares war on Germany and takes Tsingtao and the Pacific islands"]], "Japan"],
      [[["1914-08-23","e","Japanese empire"]], "North Korea", "South Korea", "Taiwan"],
      [[["1917-04-06","E","The United States declares war on Germany"]], "United States of America"],
      [[["1917-04-06","e","U.S. territories"]], "Puerto Rico", "Philippines"],
      [[["1917-04-07","E","Declares war on Germany alongside the United States"]], "Cuba", "Panama"],
      [[["1917-10-26","E","Brazil declares war — the only South American belligerent"]], "Brazil"],
      [[["1917-07-22","E","Siam declares war on the Central Powers"]], "Thailand"],
      [[["1917-08-14","E","China declares war; 140,000 Chinese labourers serve on the Western Front"]], "China"],
      [[["1917-08-04","E","Liberia declares war on Germany"]], "Liberia"],
      [[["1918-04-23","E","Declares war on Germany"]], "Guatemala"],
      [[["1918-05-08","E","Declares war on Germany"]], "Nicaragua"],
      [[["1918-05-23","E","Declares war on Germany"]], "Costa Rica"],
      [[["1918-07-12","E","Declares war on Germany"]], "Haiti"],
      [[["1918-07-19","E","Declares war on Germany"]], "Honduras"],
      [[["1916-06-10","E","The Arab Revolt: Sharif Hussein of Mecca rises against Ottoman rule"]], "Saudi Arabia"],
      [[["1914-08-01","c","German South West Africa"],["1915-07-09","oE","Surrenders to South African forces"]], "Namibia"],
      [[["1914-08-01","c","German Togoland"],["1914-08-26","oE","First German colony to fall"]], "Togo"],
      [[["1914-08-01","c","German Kamerun"],["1916-02-18","oE","Last German garrison surrenders"]], "Cameroon"],
      [[["1914-08-01","c","German East Africa"],["1916-09-04","oE","Dar es Salaam falls — Lettow-Vorbeck's column fights on, undefeated, until 25 Nov 1918"]], "Tanzania"],
      [[["1914-08-01","c","German East Africa"],["1916-06-06","oE","Occupied by Belgian colonial troops"]], "Rwanda", "Burundi"],
      [[["1914-08-01","c","German New Guinea (the south was Australian Papua)"],["1914-09-17","oE","Surrenders to an Australian expedition"]], "Papua New Guinea"]
    ],

    /* ------------ the powers (the alliance board) ------------ */
    /* mob = forces mobilized, dead = military killed & died (Britannica); seg = [from, to|null, side, note] */
    powers: [
      { id: "ru", n: "Russian Empire", side: "A", major: 1, seg: [["1914-08-01","1917-12-15","A","Entente founder"],["1917-12-15",null,"X","Bolshevik armistice → Brest-Litovsk"]], mob: 12000000, dead: 1700000,
        note: "The 'steamroller' saves France in 1914 by attacking early, bleeds through the Great Retreat, and collapses into revolution — the only great power to leave the war by its own implosion." },
      { id: "fr", n: "France", side: "A", major: 1, seg: [["1914-08-03",null,"A","Attacked by Germany"]], mob: 8410000, dead: 1357800,
        note: "Fights the war on its own soil. One Frenchman in six of military age is dead by 1918." },
      { id: "uk", n: "British Empire", side: "A", major: 1, seg: [["1914-08-04",null,"A","Belgian neutrality violated"]], mob: 8904467, dead: 908371,
        note: "Enters over Belgium; fields a small professional army in 1914 and a mass army of millions by 1916, drawn from Britain, the dominions and India. Its navy's blockade slowly starves the Central Powers." },
      { id: "it", n: "Italy", side: "A", major: 1, seg: [["1914-08-01","1915-05-23","N","Declares neutrality despite the Triple Alliance"],["1915-05-23",null,"A","Treaty of London"]], mob: 5615000, dead: 650000,
        note: "Germany's and Austria's peacetime ally changes sides for the promise of Trentino, Trieste and Dalmatia — then fights twelve battles on the Isonzo." },
      { id: "us", n: "United States", side: "A", major: 1, seg: [["1914-08-04","1917-04-06","N","'Too proud to fight'"],["1917-04-06",null,"A","Associated Power"]], mob: 4355000, dead: 116516,
        note: "Enters after unrestricted submarine warfare and the Zimmermann Telegram. Two million 'doughboys' reach France by 1918 and tip the balance of manpower." },
      { id: "jp", n: "Japan", side: "A", seg: [["1914-08-23",null,"A","Anglo-Japanese Alliance"]], mob: 800000, dead: 300,
        note: "Seizes Germany's Chinese base at Tsingtao and its Pacific islands, and escorts convoys in the Mediterranean." },
      { id: "ro", n: "Romania", side: "A", seg: [["1916-08-27","1918-05-07","A","Invades Transylvania"],["1918-05-07","1918-11-10","X","Treaty of Bucharest"],["1918-11-10",null,"A","Re-enters"]], mob: 750000, dead: 335706,
        note: "Enters at the height of the Brusilov offensive and is overrun within four months." },
      { id: "rs", n: "Serbia", side: "A", seg: [["1914-07-28",null,"A","Attacked by Austria-Hungary"]], mob: 707343, dead: 45000,
        note: "Throws back three Austrian invasions in 1914, then loses its whole territory in 1915. Britannica's table lists 45,000 killed; other estimates of Serbia's military and civilian loss are several times higher — proportionally the worst of any belligerent." },
      { id: "be", n: "Belgium", side: "A", seg: [["1914-08-04",null,"A","Invaded"]], mob: 267000, dead: 13716,
        note: "Refuses the German ultimatum. King Albert's army holds a sliver of Flanders behind the flooded Yser for the whole war." },
      { id: "gr", n: "Greece", side: "A", seg: [["1914-08-04","1917-07-02","N","The 'National Schism': king vs prime minister"],["1917-07-02",null,"A","Venizelos's Greece joins"]], mob: 230000, dead: 5000,
        note: "Split between a pro-German king and a pro-Entente prime minister until the Allies force the king out." },
      { id: "pt", n: "Portugal", side: "A", seg: [["1916-03-09",null,"A","Seizes German ships; Germany declares war"]], mob: 100000, dead: 7222,
        note: "Fights in Flanders and in Africa." },
      { id: "me", n: "Montenegro", side: "A", seg: [["1914-08-06","1916-01-25","A","Stands with Serbia"],["1916-01-25",null,"oB","Occupied"]], mob: 50000, dead: 3000,
        note: "The smallest ally; overrun in January 1916 and never restored as a kingdom." },
      { id: "de", n: "German Empire", side: "B", major: 1, seg: [["1914-08-01","1918-11-11","B","Backs Austria; attacks France through Belgium"],["1918-11-11",null,"D","Armistice"]], mob: 11000000, dead: 1773700,
        note: "The engine of the Central Powers: fights on two fronts for three years, knocks Russia out, and comes within 60 km of Paris twice." },
      { id: "ah", n: "Austria-Hungary", side: "B", major: 1, seg: [["1914-07-28","1918-11-03","B","Declares war on Serbia"],["1918-11-03",null,"D","Armistice; empire dissolved"]], mob: 7800000, dead: 1200000,
        note: "Starts the war to crush Serbia and survives only with German help. Eleven nationalities in one army; none of them inherit the state." },
      { id: "ot", n: "Ottoman Empire", side: "B", major: 1, seg: [["1914-08-02","1914-10-29","N","Secret alliance with Germany"],["1914-10-29","1918-10-30","B","Black Sea raid"],["1918-10-30",null,"D","Armistice of Mudros"]], mob: 2850000, dead: 325000,
        note: "Fights on five fronts from Gallipoli to the Caucasus to Mesopotamia; its wartime government carries out the Armenian Genocide." },
      { id: "bg", n: "Bulgaria", side: "B", seg: [["1914-08-04","1915-10-14","N","Courted by both sides"],["1915-10-14","1918-09-29","B","Promised Macedonia"],["1918-09-29",null,"D","Armistice of Salonica"]], mob: 1200000, dead: 87500,
        note: "Joins to reverse its defeat in the Second Balkan War. First of the four to enter last; first to leave." }
    ],

    phases: [
      { n: "The July Crisis", s: "1914-06-28", e: "1914-08-04", d: "Gavrilo Princip shoots the Habsburg heir in Sarajevo. Vienna, armed with Berlin's 'blank cheque', sends Serbia an ultimatum designed to be refused. Russia mobilizes for Serbia, Germany for Austria, France for Russia. Germany's only war plan runs through neutral Belgium — and that brings in Britain. In thirty-seven days a murder becomes a world war." },
      { n: "The war of movement", s: "1914-08-04", e: "1914-11-22", d: "Germany's right wing sweeps through Belgium toward Paris and is stopped on the Marne. Both armies race north trying to outflank each other until they hit the sea at Ypres. In the east, Hindenburg destroys a Russian army at Tannenberg while the Russians maul Austria in Galicia. By November a continuous trench line runs 700 km from Switzerland to the Channel." },
      { n: "Deadlock and a widening war", s: "1914-11-22", e: "1915-12-31", d: "The Ottomans, Italy and Bulgaria join; the war spreads to Gallipoli, the Caucasus, Mesopotamia and Africa. Poison gas appears at Ypres, a U-boat sinks the Lusitania, and the Ottoman government destroys its Armenian population. Every Allied offensive in the west fails, while in the east a German-Austrian breakthrough at Gorlice drives Russia out of Poland and Serbia is overrun." },
      { n: "The year of attrition", s: "1916-01-01", e: "1916-12-31", d: "Verdun, the Somme, the Brusilov offensive: three battles, more than two million casualties, and no decision. Falkenhayn tries to bleed France white; Haig's army loses 57,000 men on a single morning; Brusilov nearly breaks Austria. At Jutland the fleets finally meet and the blockade holds. Romania enters and is crushed. Hindenburg and Ludendorff take control of Germany." },
      { n: "Revolution, mutiny and America", s: "1917-01-01", e: "1918-03-03", d: "Germany gambles on unrestricted submarine warfare and brings the United States into the war. The Tsar falls in March; half the French army mutinies after the Nivelle offensive; the British drown at Passchendaele; Italy breaks at Caporetto. In November the Bolsheviks seize power and sue for peace. At Brest-Litovsk, Russia signs away a third of its population." },
      { n: "Germany's last gamble", s: "1918-03-03", e: "1918-07-18", d: "With Russia out, Ludendorff has a few months of numerical superiority before the Americans arrive in force. Five offensives from March to July tear open the trench lines for the first time since 1914 and reach the Marne again — but they win ground, not the war, and cost Germany nearly a million irreplaceable men." },
      { n: "The Hundred Days and collapse", s: "1918-07-18", e: "1918-11-11", d: "Foch's counterstroke on the Marne, then Amiens — 'the black day of the German Army'. Tanks, aircraft, artillery and infantry finally work together and the Allies advance without pause. Bulgaria quits in September, the Ottomans in October, Austria-Hungary disintegrates, the German fleet mutinies and the Kaiser flees. The guns stop at 11 a.m. on 11 November." },
      { n: "Armistice to Versailles", s: "1918-11-11", e: "1919-06-28", d: "The blockade continues while the victors meet in Paris. New states rise from the wreckage of four empires; the influenza pandemic kills more than the war did. On 28 June 1919 — five years to the day after Sarajevo — Germany signs the Treaty of Versailles in the Hall of Mirrors." }
    ],

    /* k: battle | naval | siege | diplo | atrocity | revolt | end.  w = winner side (A/B/—) */
    items: [
      { id: "sarajevo", n: "Assassination at Sarajevo", s: "1914-06-28", at: [43.86,18.43], k: "diplo", ref: "franzferdinand", d: "Gavrilo Princip, a Bosnian Serb of the Black Hand's network, shoots Archduke Franz Ferdinand and his wife Sophie. Vienna resolves to crush Serbia.", u: W + "Assassination_of_Archduke_Franz_Ferdinand" },
      { id: "liege", n: "Battle of Liège", s: "1914-08-05", e: "1914-08-16", at: [50.64,5.57], k: "siege", w: "B", d: "The first battle of the war. Belgium's ring of forts delays the German right wing for days until 42 cm siege howitzers smash them one by one.", f: "Belgium's resistance turns British opinion", u: W + "Battle_of_Li%C3%A8ge" },
      { id: "tannenberg", n: "Battle of Tannenberg", s: "1914-08-26", e: "1914-08-30", at: [53.5,20.1], k: "battle", w: "B", d: "Hindenburg and Ludendorff encircle and destroy Samsonov's Russian Second Army in East Prussia. Samsonov shoots himself; the victors become national idols.", f: "c. 92,000 Russians captured", u: W + "Battle_of_Tannenberg", ar: [6, "war", "Europe", "German Empire", ["ww1", "marne1914"]] },
      { id: "lemberg", n: "Battle of Galicia (Lemberg)", s: "1914-08-23", e: "1914-09-11", at: [49.84,24.03], k: "battle", w: "A", d: "Russia routs the Austro-Hungarian armies and takes Lemberg. The Habsburg army loses much of its professional core in three weeks and never fully recovers.", f: "c. 400,000 Austro-Hungarian casualties", u: W + "Battle_of_Galicia" },
      { id: "marne1914", n: "First Battle of the Marne", s: "1914-09-05", e: "1914-09-12", at: [48.95,3.3], k: "battle", w: "A", d: "With the Germans 40 km from Paris, Joffre turns his retreating armies and strikes the gap between two German armies. The Schlieffen Plan fails; Germany will have to fight a long two-front war.", f: "c. 2 million men engaged · c. 500,000 casualties", u: W + "First_Battle_of_the_Marne", ar: [8, "war", "Europe", "France", ["ww1", "franzferdinand", "verdun"]] },
      { id: "ypres1", n: "First Battle of Ypres", s: "1914-10-19", e: "1914-11-22", at: [50.85,2.88], k: "battle", w: "A", d: "The last attempt to turn a flank. The old British regular army is all but destroyed holding the town; the trench line is now continuous to the sea.", f: "End of the war of movement in the west", u: W + "First_Battle_of_Ypres" },
      { id: "tsingtao", n: "Siege of Tsingtao", s: "1914-10-31", e: "1914-11-07", at: [36.07,120.38], k: "siege", w: "A", d: "Japanese and British troops take Germany's naval base in China — the war's only major battle in East Asia, and the seed of the Shandong dispute.", u: W + "Siege_of_Tsingtao" },
      { id: "falklands1914", n: "Battle of the Falkland Islands", s: "1914-12-08", at: [-52.5,-56.5], k: "naval", w: "A", d: "British battlecruisers hunt down von Spee's cruiser squadron, which had destroyed a British force off Coronel a month earlier.", f: "4 German cruisers sunk", u: W + "Battle_of_the_Falkland_Islands" },
      { id: "sarikamish", n: "Battle of Sarikamish", s: "1914-12-22", e: "1915-01-17", at: [40.33,42.57], k: "battle", w: "A", d: "Enver Pasha's winter offensive into the Russian Caucasus freezes to death in the mountains. He blames the Armenians.", f: "Most of an Ottoman army of c. 100,000 lost", u: W + "Battle_of_Sarikamish" },
      { id: "ypres2", n: "Second Ypres — poison gas", s: "1915-04-22", e: "1915-05-25", at: [50.9,2.93], k: "battle", w: "—", d: "Germany releases 170 tonnes of chlorine against French colonial and Canadian troops: the first large-scale use of lethal gas. Within months both sides are using it.", f: "First mass chemical attack", u: W + "Second_Battle_of_Ypres", ar: [6, "war", "Europe", null, ["ww1", "somme"]] },
      { id: "armenian1915", n: "The Armenian Genocide begins", s: "1915-04-24", at: [41.01,28.98], k: "atrocity", ref: "armenian", d: "Armenian leaders are rounded up in Constantinople; deportations and massacres across Anatolia follow. Around a million Armenians are killed.", u: W + "Armenian_genocide" },
      { id: "gallipoli", n: "Gallipoli campaign", s: "1915-02-19", e: "1916-01-09", at: [40.2,26.35], k: "battle", w: "B", d: "An Allied attempt to force the Dardanelles and knock out the Ottomans ends in eight months of slaughter on the beaches. It makes the reputation of Mustafa Kemal and haunts Australia and New Zealand.", f: "c. 500,000 casualties, both sides", u: W + "Gallipoli_campaign", ar: [6, "war", "West Asia / Middle East", "Ottoman Empire", ["ww1", "ataturk"]] },
      { id: "lusitania", n: "Sinking of the Lusitania", s: "1915-05-07", at: [51.42,-8.55], k: "naval", d: "U-20 torpedoes the Cunard liner off Ireland. 1,198 die, 128 of them American. Germany backs off unrestricted submarine warfare — for two years.", f: "1,198 dead", u: W + "Sinking_of_the_RMS_Lusitania", ar: [6, "war", "Europe", null, ["ww1", "usentry1917", "titanic"]] },
      { id: "gorlice", n: "Gorlice–Tarnów offensive", s: "1915-05-02", e: "1915-06-22", at: [49.66,21.16], k: "battle", w: "B", d: "Mackensen's breakthrough in Galicia unhinges the whole Russian front. In the 'Great Retreat' that follows, Russia loses Poland, Lithuania and some two million men.", f: "Front moves up to 500 km east", u: W + "Gorlice%E2%80%93Tarn%C3%B3w_offensive" },
      { id: "isonzo", n: "The Isonzo battles", s: "1915-06-23", e: "1917-09-12", at: [45.98,13.62], k: "battle", w: "—", d: "Cadorna attacks the same river line eleven times in two years, gaining a few kilometres of limestone for half of Italy's total war dead.", f: "11 offensives · c. 1 million casualties", u: W + "Battles_of_the_Isonzo" },
      { id: "kut", n: "Siege of Kut", s: "1915-12-07", e: "1916-04-29", at: [32.5,45.82], k: "siege", w: "B", d: "After overreaching toward Baghdad, Townshend's Anglo-Indian division is besieged for 147 days and starved into surrender.", f: "c. 13,000 surrender", u: W + "Siege_of_Kut" },
      { id: "verdun", n: "Battle of Verdun", s: "1916-02-21", e: "1916-12-18", at: [49.2,5.42], k: "battle", w: "A", d: "Falkenhayn attacks a fortress France cannot abandon, intending to bleed its army to death. For 300 days the two armies grind each other down over a few square kilometres. 'They shall not pass.'", f: "c. 700,000 casualties · c. 300,000 dead", u: W + "Battle_of_Verdun", ar: [8, "war", "Europe", "France", ["ww1", "somme", "marne1914"]] },
      { id: "jutland", n: "Battle of Jutland", s: "1916-05-31", e: "1916-06-01", at: [56.7,5.9], k: "naval", w: "—", d: "The only full clash of the dreadnought fleets: 250 ships in the North Sea. Britain loses more ships and men, but the German fleet returns to port and never challenges the blockade again.", f: "Britain: 14 ships, 6,094 dead · Germany: 11 ships, 2,551 dead", u: W + "Battle_of_Jutland", ar: [6, "war", "Europe", null, ["ww1", "lusitania"]] },
      { id: "brusilov", n: "Brusilov offensive", s: "1916-06-04", e: "1916-09-20", at: [50.75,25.33], k: "battle", w: "A", d: "Russia's greatest feat of arms: a broad-front attack without a long bombardment shatters the Austro-Hungarian line. It forces Germany to strip Verdun — and costs Russia so much that it feeds the revolution.", f: "Over 1 million casualties per side (est.)", u: W + "Brusilov_offensive", ar: [6, "war", "Europe", "Russian Empire", ["ww1", "russianrev"]] },
      { id: "arabrevolt", n: "The Arab Revolt", s: "1916-06-10", e: "1918-10-01", at: [21.42,39.83], k: "revolt", w: "A", d: "Sharif Hussein of Mecca rises against the Ottomans on a British promise of an Arab kingdom. His son Faisal, advised by T. E. Lawrence, takes Aqaba and rides into Damascus — as Britain and France quietly divide the same lands between themselves.", u: W + "Arab_Revolt", ar: [6, "war", "West Asia / Middle East", null, ["ww1", "balfour"]] },
      { id: "somme", n: "Battle of the Somme", s: "1916-07-01", e: "1916-11-18", at: [50.02,2.7], k: "battle", w: "—", d: "The British army's bloodiest day — 57,470 casualties, 19,240 of them dead, before nightfall on 1 July — opens a 141-day offensive that advances ten kilometres. Tanks go into action for the first time on 15 September.", f: "Over 1 million casualties", u: W + "Battle_of_the_Somme", ar: [8, "war", "Europe", null, ["ww1", "verdun"]] },
      { id: "bucharest1916", n: "Fall of Bucharest", s: "1916-12-06", at: [44.43,26.1], k: "battle", w: "B", d: "Falkenhayn and Mackensen converge on Romania from the mountains and the Danube. Its oil and grain keep the Central Powers fighting.", u: W + "Romania_in_World_War_I" },
      { id: "baghdad1917", n: "Fall of Baghdad", s: "1917-03-11", at: [33.31,44.36], k: "battle", w: "A", d: "Maude's rebuilt army avenges Kut and takes the city the Ottomans had held for four centuries.", u: W + "Fall_of_Baghdad_(1917)" },
      { id: "febrev", n: "February Revolution — the Tsar abdicates", s: "1917-03-08", e: "1917-03-15", at: [59.94,30.31], k: "revolt", ref: "russianrev", d: "Bread riots in Petrograd become a mutiny. Nicholas II abdicates; a Provisional Government tries to keep Russia in the war.", u: W + "February_Revolution" },
      { id: "usentry1917", n: "The United States enters the war", s: "1917-04-06", at: [38.9,-77.04], k: "diplo", d: "Germany resumes sinking neutral ships on sight (1 Feb) and is caught offering Mexico the American Southwest in the Zimmermann Telegram. Wilson asks Congress for war 'to make the world safe for democracy'.", f: "2 million U.S. troops in France by Nov 1918", u: W + "American_entry_into_World_War_I", ar: [8, "war", "North America", "United States", ["ww1", "lusitania", "armistice1918"]] },
      { id: "arras", n: "Arras and Vimy Ridge", s: "1917-04-09", e: "1917-05-16", at: [50.38,2.77], k: "battle", w: "A", d: "The Canadian Corps storms Vimy Ridge in a model set-piece attack; the wider offensive bogs down.", u: W + "Battle_of_Arras_(1917)" },
      { id: "nivelle", n: "Nivelle offensive and the mutinies", s: "1917-04-16", e: "1917-05-09", at: [49.44,3.62], k: "battle", w: "B", d: "Nivelle promises a breakthrough on the Chemin des Dames in 48 hours and delivers 187,000 casualties. Units in half the French divisions refuse to attack; Pétain restores the army with leave, food and no more offensives.", u: W + "Nivelle_offensive" },
      { id: "passchendaele", n: "Passchendaele (Third Ypres)", s: "1917-07-31", e: "1917-11-10", at: [50.9,3.02], k: "battle", w: "—", d: "Haig's Flanders offensive drowns in the wettest autumn in decades. Men and mules vanish in shell-holes of liquid mud for eight kilometres of ground.", f: "c. 500,000 casualties, both sides", u: W + "Battle_of_Passchendaele", ar: [6, "war", "Europe", null, ["ww1", "somme"]] },
      { id: "caporetto", n: "Battle of Caporetto", s: "1917-10-24", e: "1917-11-19", at: [46.25,13.58], k: "battle", w: "B", d: "German stormtroops and gas break the Italian front in a day; the army streams back 100 km to the Piave. A young Erwin Rommel wins the Pour le Mérite here.", f: "c. 265,000 Italians captured", u: W + "Battle_of_Caporetto", ar: [5, "war", "Europe", "Italy", ["ww1", "marchonrome"]] },
      { id: "octrev", n: "October Revolution", s: "1917-11-07", at: [59.95,30.33], k: "revolt", ref: "russianrev", d: "Lenin — sent home through Germany in a sealed train — overthrows the Provisional Government. His first decree is on peace.", u: W + "October_Revolution" },
      { id: "cambrai", n: "Battle of Cambrai", s: "1917-11-20", e: "1917-12-07", at: [50.17,3.23], k: "battle", w: "—", d: "476 British tanks attack without a preliminary bombardment and break the Hindenburg Line in hours — the shape of battles to come. A German counter-attack retakes the ground.", f: "First mass tank attack", u: W + "Battle_of_Cambrai_(1917)" },
      { id: "jerusalem1917", n: "Jerusalem falls to Allenby", s: "1917-12-09", at: [31.78,35.22], k: "battle", w: "A", d: "After breaking the Gaza–Beersheba line, the Egyptian Expeditionary Force ends four centuries of Ottoman rule in the city. Allenby enters on foot. The Balfour Declaration is five weeks old.", u: W + "Battle_of_Jerusalem", ar: [5, "war", "West Asia / Middle East", "British Empire", ["ww1", "balfour", "arabrevolt"]] },
      { id: "brestlitovsk", n: "Treaty of Brest-Litovsk", s: "1918-03-03", at: [52.1,23.7], k: "diplo", d: "Bolshevik Russia buys peace by surrendering Poland, the Baltic lands, Finland and Ukraine — a third of its population and most of its coal. Germany can now move fifty divisions west.", f: "Annulled by the armistice eight months later", u: W + "Treaty_of_Brest-Litovsk", ar: [7, "law", "Europe", null, ["ww1", "russianrev", "springoffensive"]] },
      { id: "springoffensive", n: "The German Spring Offensive", s: "1918-03-21", e: "1918-07-18", at: [49.85,3.29], k: "battle", w: "A", d: "The Kaiserschlacht. Stormtroops and a hurricane bombardment tear a 60 km hole in the British line and advance further in a week than anyone had since 1914. Five offensives reach the Marne — and exhaust the German army.", f: "c. 1.5 million casualties, both sides", u: W + "German_spring_offensive", ar: [6, "war", "Europe", "German Empire", ["ww1", "brestlitovsk", "hundreddays"]] },
      { id: "marne1918", n: "Second Battle of the Marne", s: "1918-07-15", e: "1918-08-06", at: [49.08,3.65], k: "battle", w: "A", d: "Ludendorff's last attack is stopped and Foch counter-attacks with French, American, British and Italian divisions. The initiative passes to the Allies for good.", u: W + "Second_Battle_of_the_Marne" },
      { id: "hundreddays", n: "Amiens and the Hundred Days", s: "1918-08-08", e: "1918-11-11", at: [49.89,2.45], k: "battle", w: "A", d: "On 8 August, tanks and Australian and Canadian infantry advance 11 km before breakfast. Ludendorff calls it 'the black day of the German Army'. Ninety-five days of continuous Allied offensives follow and the Hindenburg Line breaks.", f: "German army loses c. 1 million men in the campaign", u: W + "Hundred_Days_Offensive", ar: [7, "war", "Europe", null, ["ww1", "springoffensive", "armistice1918"]] },
      { id: "megiddo", n: "Battle of Megiddo", s: "1918-09-19", e: "1918-09-25", at: [32.58,35.18], k: "battle", w: "A", d: "Allenby's cavalry and aircraft destroy three Ottoman armies in a week. Damascus falls on 1 October, Aleppo on the 25th.", u: W + "Battle_of_Megiddo_(1918)" },
      { id: "vardar", n: "Vardar offensive — Bulgaria quits", s: "1918-09-15", e: "1918-09-29", at: [41.03,21.93], k: "battle", w: "A", d: "Serbian and French troops break the Macedonian front at Dobro Pole. Bulgaria signs an armistice within two weeks — the first crack in the Central Powers.", u: W + "Vardar_offensive" },
      { id: "meuseargonne", n: "Meuse–Argonne offensive", s: "1918-09-26", e: "1918-11-11", at: [49.3,5.03], k: "battle", w: "A", d: "The largest battle in American history to that date: 1.2 million U.S. soldiers fight through the Argonne forest toward Sedan. Captain Harry Truman commands an artillery battery.", f: "26,277 Americans killed", u: W + "Meuse%E2%80%93Argonne_offensive" },
      { id: "vittorioveneto", n: "Battle of Vittorio Veneto", s: "1918-10-24", e: "1918-11-03", at: [45.98,12.3], k: "battle", w: "A", d: "A year to the day after Caporetto, Italy crosses the Piave. The Austro-Hungarian army disintegrates along with its empire.", u: W + "Battle_of_Vittorio_Veneto" },
      { id: "kiel", n: "Kiel mutiny — the Kaiser falls", s: "1918-11-03", e: "1918-11-09", at: [54.32,10.13], k: "revolt", d: "Ordered out for a last suicidal battle, the High Seas Fleet mutinies. Revolution spreads to Berlin; a republic is proclaimed and Wilhelm II flees to the Netherlands.", u: W + "Kiel_mutiny" },
      { id: "armistice1918", n: "The Armistice", s: "1918-11-11", at: [49.43,2.9], k: "end", w: "A", d: "In a railway carriage in the forest of Compiègne, Germany signs. The guns stop at the eleventh hour of the eleventh day of the eleventh month. Hitler will make France surrender in the same carriage in 1940.", f: "Fighting ends at 11:00", u: W + "Armistice_of_11_November_1918", ar: [9, "war", "Europe", null, ["ww1", "hundreddays", "versailles", "flu", "falloffrance"]] },
      { id: "versailles1919", n: "Treaty of Versailles signed", s: "1919-06-28", at: [48.8,2.12], k: "diplo", ref: "versailles", d: "Five years to the day after Sarajevo. Germany loses territory, colonies and its army, and accepts 'war guilt' and reparations. Foch: 'This is not peace. It is an armistice for twenty years.'", u: W + "Treaty_of_Versailles" }
    ],

    fronts: [
      { id: "west", n: "The Western Front", side: "B", fill: true, clip: true, base: WB,
        keys: [
          { d: "1914-08-03", p: WB, fr: [0, 0] },
          { d: "1914-08-24", p: [[47.6,7.2],[47.9,7.1],[48.3,7.05],[48.6,6.9],[48.7,6.5],[48.9,6.2],[49.2,5.8],[49.5,5.5],[49.75,5.0],[50.0,4.6],[50.2,4.3],[50.45,3.95],[50.6,3.4],[50.75,3.9],[50.95,4.0],[51.05,4.35],[51.05,4.8],[51.2,5.3],[51.25,5.6],[50.9,5.7],[50.75,6.02]], fr: [0, 16] },
          { d: "1914-09-05", p: [[47.6,7.2],[47.9,7.12],[48.3,7.05],[48.5,6.9],[48.6,6.55],[48.85,6.3],[48.95,5.75],[49.25,5.65],[49.3,5.2],[49.05,5.05],[48.85,5.0],[48.72,4.6],[48.7,4.0],[48.72,3.72],[48.72,3.35],[48.75,3.1],[48.9,2.95],[49.1,2.85],[49.2,2.6],[49.45,2.55],[49.7,2.5],[49.9,2.4],[50.2,2.6],[50.45,3.0],[50.7,3.5],[50.85,3.9],[51.0,4.2],[51.05,4.8],[51.2,5.3],[51.25,5.6],[50.9,5.7],[50.75,6.02]], fr: [0, 27] },
          { d: "1914-11-22", p: W1914.concat(WT), fr: [0, 34] },
          { d: "1917-02-20", p: W1914.concat(WT), fr: [0, 34] },
          { d: "1917-04-05", p: W1917.concat(WT), fr: [0, 33] },
          { d: "1918-03-20", p: W1917.concat(WT), fr: [0, 33] },
          { d: "1918-07-15", p: W1918.concat(WT), fr: [0, 40] },
          { d: "1918-11-11", p: WS.concat([[49.0,6.0],[49.05,5.75],[49.25,5.65],[49.4,5.4],[49.55,5.2],[49.68,4.95],[49.76,4.7],[49.9,4.5],[50.05,4.3],[50.25,4.05],[50.45,3.97],[50.6,3.85],[50.75,3.85],[50.95,3.75],[51.2,3.8],[51.28,3.8],[51.33,4.3],[51.45,4.8],[51.3,5.2],[51.2,5.8],[50.9,5.7],[50.75,6.02]]), fr: [0, 22] }
        ], end: "1918-12-01" },
      { id: "east", n: "The Eastern Front", side: "B", fill: true, clip: true, base: EB,
        keys: [
          { d: "1914-08-01", p: EB, fr: [0, 0] },
          { d: "1914-12-15", p: [[55.9,20.6],[55.92,21.07],[55.3,21.7],[55.08,22.57],[54.64,22.75],[54.0,22.8],[53.65,22.5],[53.35,21.0],[53.1,20.3],[52.6,19.9],[52.2,20.15],[51.85,20.2],[51.5,20.0],[50.9,20.4],[50.3,20.8]].concat(EG), fr: [1, 14] },
          { d: "1915-04-30", p: [[55.9,20.6],[55.92,21.07],[55.3,21.7],[55.08,22.57],[54.64,22.75],[54.0,22.8],[53.65,22.5],[53.35,21.0],[53.1,20.3],[52.6,19.9],[52.2,20.15],[51.85,20.2],[51.5,20.0],[50.9,20.4],[50.3,20.8]].concat(EG), fr: [1, 14] },
          { d: "1915-06-25", p: [[55.9,20.6],[56.5,20.7],[56.55,21.0],[56.3,22.3],[55.6,23.2],[55.1,23.3],[54.6,22.9],[54.0,22.9],[53.6,22.5],[53.3,21.2],[53.0,20.6],[52.6,20.0],[52.2,20.2],[51.85,20.25],[51.4,20.6],[50.9,21.5],[50.6,22.3],[50.4,23.3],[50.2,24.6],[49.7,24.8],[49.2,24.85],[48.7,25.6],[48.3,26.2]], fr: [2, 22] },
          { d: "1915-09-30", p: EN15.concat([[51.0,25.7],[50.4,25.6],[49.9,25.5],[49.55,25.4],[49.0,25.4],[48.6,25.8],[48.3,26.2]]), fr: [5, 24] },
          { d: "1916-06-03", p: EN15.concat([[51.0,25.7],[50.4,25.6],[49.9,25.5],[49.55,25.4],[49.0,25.4],[48.6,25.8],[48.3,26.2]]), fr: [5, 24] },
          { d: "1916-09-20", p: EN15.concat([[51.3,25.2],[50.9,24.9],[50.4,24.9],[49.9,24.9],[49.45,25.05],[49.1,24.75],[48.8,24.5],[48.4,24.5],[47.9,24.9],[47.5,25.3]]), fr: [5, 27] },
          { d: "1917-06-30", p: EN15.concat([[51.3,25.2],[50.9,24.9],[50.4,24.9],[49.9,24.9],[49.45,25.05],[49.1,24.75],[48.8,24.5],[48.4,24.5],[47.9,24.9],[47.5,25.3]]), fr: [5, 27] },
          { d: "1917-09-05", p: E17, fr: [5, 25] },
          { d: "1918-02-17", p: E17, fr: [5, 25] },
          { d: "1918-03-03", p: [[55.9,20.6],[57.5,20.9],[58.6,21.4],[59.3,22.3],[59.75,24.5],[59.75,27.0],[59.45,28.1],[58.8,27.8],[57.82,28.4],[56.9,28.6],[56.0,28.8],[55.5,28.9],[54.5,30.4],[53.9,30.4],[52.9,31.0],[52.4,31.1],[51.5,31.3],[50.45,30.6],[49.6,29.5],[49.0,28.3],[48.4,27.8],[48.22,26.27]], fr: [6, 20] },
          { d: "1918-05-10", p: E18, fr: [6, 22] },
          { d: "1918-11-11", p: E18, fr: [6, 22] }
        ], end: "1918-12-15" },
      { id: "italy", n: "The Italian Front", side: "L",
        keys: [
          { d: "1915-06-23", p: [[46.52,10.45],[46.3,10.6],[45.87,10.7],[45.75,11.0],[45.85,11.3],[46.0,11.6],[46.3,11.85],[46.55,12.15],[46.63,12.6],[46.55,13.2],[46.45,13.55],[46.3,13.6],[46.2,13.65],[46.0,13.63],[45.93,13.6],[45.8,13.55],[45.75,13.6]] },
          { d: "1917-10-23", p: [[46.52,10.45],[46.3,10.6],[45.87,10.7],[45.75,11.0],[45.85,11.3],[46.0,11.6],[46.3,11.85],[46.55,12.15],[46.63,12.6],[46.55,13.2],[46.45,13.55],[46.3,13.6],[46.2,13.68],[46.05,13.72],[45.93,13.68],[45.82,13.63],[45.77,13.62]] },
          { d: "1917-11-12", p: [[46.52,10.45],[46.3,10.6],[45.87,10.7],[45.75,11.0],[45.85,11.3],[45.9,11.55],[45.88,11.8],[45.87,12.0],[45.82,12.2],[45.7,12.4],[45.63,12.57],[45.53,12.72]] },
          { d: "1918-10-23", p: [[46.52,10.45],[46.3,10.6],[45.87,10.7],[45.75,11.0],[45.85,11.3],[45.9,11.55],[45.88,11.8],[45.87,12.0],[45.82,12.2],[45.7,12.4],[45.63,12.57],[45.53,12.72]] },
          { d: "1918-11-04", p: [[46.85,10.5],[46.4,10.9],[46.07,11.12],[46.2,11.9],[46.4,12.4],[46.4,13.0],[46.07,13.25],[45.9,13.5],[45.65,13.78]] }
        ], end: "1918-11-20" },
      { id: "salonika", n: "The Macedonian (Salonika) Front", side: "L",
        keys: [
          { d: "1915-12-12", p: [[40.9,20.75],[40.95,21.3],[41.1,21.9],[41.15,22.4],[41.2,22.75],[41.15,23.2],[41.05,23.55],[40.8,23.85]] },
          { d: "1916-11-19", p: [[41.0,20.75],[41.05,21.35],[41.1,21.9],[41.15,22.4],[41.2,22.75],[41.15,23.2],[41.05,23.55],[40.8,23.85]] },
          { d: "1918-09-14", p: [[41.0,20.75],[41.05,21.35],[41.1,21.9],[41.15,22.4],[41.2,22.75],[41.15,23.2],[41.05,23.55],[40.8,23.85]] },
          { d: "1918-09-29", p: [[41.6,20.6],[42.0,21.4],[41.9,22.2],[41.45,22.7],[41.25,23.3],[41.05,23.55],[40.8,23.85]] }
        ], end: "1918-10-10" }
    ],

    /* static zones that fade in and out */
    areas: [
      /* side "T": home territory of the Central Powers in 1914 that lies inside a different modern country.
         Without these, today's borders would paint Alsace, Posen, Galicia or Transylvania in the wrong colour. */
      { n: "Alsace-Lorraine (German since 1871)", l: "Alsace-Lorraine", s: "1914-06-15", e: "1918-11-21", side: "T", clip: true, fade: 1,
        p: WB.slice(0, 12).concat([[49.2,6.75],[49.1,7.4],[49.0,8.2],[48.5,7.9],[48.0,7.65],[47.6,7.6]]) },
      { n: "East Prussia, Prussian Poland and Austrian Galicia", l: "", s: "1914-06-15", e: "1918-11-11", side: "T", clip: true, fade: 1,
        p: EB.slice(1).concat([[47.95,24.9],[48.0,23.0],[48.4,22.1],[49.0,21.5],[49.5,19.0],[50.3,17.0],[51.5,14.7],[53.5,14.3],[54.5,13.5],[54.9,18.0],[54.5,19.8],[55.3,20.9]]) },
      { n: "Transylvania, the Banat and Vojvodina (Kingdom of Hungary)", l: "Transylvania", s: "1914-06-15", e: "1918-11-11", side: "T", clip: true, fade: 1,
        p: [[48.1,23.5],[47.7,25.2],[47.2,25.6],[46.6,26.2],[45.9,26.4],[45.5,26.0],[45.45,25.2],[45.5,24.0],[45.3,23.0],[44.7,22.4],[44.8,21.3],[44.85,20.4],[45.0,19.1],[45.9,18.8],[46.5,19.5],[47.8,22.0]] },
      { n: "Trentino, South Tyrol and Trieste (Austria)", l: "", s: "1914-06-15", e: "1918-11-04", side: "T", clip: true, fade: 1,
        p: [[46.52,10.45],[46.3,10.6],[45.87,10.7],[45.75,11.0],[45.85,11.3],[46.0,11.6],[46.3,11.85],[46.55,12.15],[46.63,12.6],[46.55,13.2],[46.45,13.55],[46.3,13.6],[46.2,13.65],[46.0,13.63],[45.93,13.6],[45.8,13.55],[45.75,13.6],[45.5,13.5],[45.4,13.9],[46.4,14.6],[47.1,12.2],[47.0,10.4]] },
      { n: "Russian-occupied Galicia", l: "Russian-held Galicia", s: "1914-09-12", e: "1915-06-22", side: "A", clip: true,
        p: [[50.3,20.8],[50.0,20.9],[49.65,21.1],[49.4,21.6],[49.1,22.6],[48.75,23.6],[48.3,24.6],[47.95,25.2],[48.22,26.27],[48.55,26.45],[49.53,26.15],[50.08,25.15],[50.48,24.28],[50.4,23.3],[50.68,21.75]] },
      { n: "Russian invasion of East Prussia", l: "Russian advance", s: "1914-08-20", e: "1914-09-13", side: "A", clip: true,
        p: [[55.0,22.6],[54.75,21.3],[54.2,21.2],[53.9,21.8],[53.7,22.5],[54.0,22.8]] }
    ],

    moves: [
      { n: "The Schlieffen sweep", s: "1914-08-04", e: "1914-09-05", side: "B", p: [[50.77,6.1],[50.64,5.57],[50.85,4.35],[50.45,3.95],[49.85,3.29],[49.15,2.95]] },
      { n: "Russian 1st Army", s: "1914-08-17", e: "1914-08-26", side: "A", p: [[54.64,22.9],[54.63,21.8]] },
      { n: "Russian 2nd Army", s: "1914-08-20", e: "1914-08-28", side: "A", p: [[53.0,20.9],[53.5,20.3]] },
      { n: "Russia into Galicia", s: "1914-08-23", e: "1914-09-21", side: "A", p: [[50.4,25.75],[49.84,24.03],[49.78,22.77]] },
      { n: "Japan takes Tsingtao", s: "1914-09-02", e: "1914-11-07", side: "A", p: [[33.6,129.8],[35.0,124.5],[36.07,120.38]] },
      { n: "Gallipoli landings", s: "1915-04-20", e: "1915-04-25", side: "A", p: [[39.88,25.25],[40.05,26.2]] },
      { n: "Gorlice–Tarnów breakthrough", s: "1915-05-02", e: "1915-06-22", side: "B", p: [[49.66,21.16],[49.78,22.77],[49.84,24.03]] },
      { n: "The Great Retreat", s: "1915-07-13", e: "1915-09-18", side: "B", p: [[52.2,20.3],[52.23,21.01],[52.1,23.7],[53.0,25.6]] },
      { n: "Conquest of Serbia", s: "1915-10-06", e: "1915-11-25", side: "B", p: [[44.95,20.45],[44.01,20.92],[42.67,21.17]] },
      { n: "Bulgaria strikes west", s: "1915-10-14", e: "1915-11-05", side: "B", p: [[43.0,22.8],[43.32,21.9],[42.0,21.43]] },
      { n: "The Serbian army's retreat", s: "1915-11-25", e: "1916-01-15", side: "A", p: [[42.67,21.17],[42.07,19.5],[41.32,19.45]] },
      { n: "Mesopotamia: Basra to Kut", s: "1914-11-06", e: "1915-09-28", side: "A", p: [[30.5,47.8],[31.84,47.15],[32.5,45.82]] },
      { n: "Russian Caucasus offensive", s: "1916-01-10", e: "1916-04-18", side: "A", p: [[40.6,43.1],[39.9,41.27],[41.0,39.72]] },
      { n: "Brusilov: Lutsk", s: "1916-06-04", e: "1916-08-10", side: "A", p: [[50.6,26.2],[50.75,25.33],[51.1,25.0]] },
      { n: "Brusilov: Bukovina", s: "1916-06-04", e: "1916-08-10", side: "A", p: [[48.9,26.0],[48.29,25.94],[48.9,24.7]] },
      { n: "The Arab Revolt", s: "1916-06-10", e: "1918-10-01", side: "A", p: [[21.42,39.83],[24.47,39.61],[26.23,36.47],[29.53,35.0],[33.51,36.29]] },
      { n: "Romania invades Transylvania", s: "1916-08-27", e: "1916-09-18", side: "A", p: [[45.3,25.55],[45.65,25.6],[45.8,24.15]] },
      { n: "Falkenhayn's counter-stroke", s: "1916-09-26", e: "1916-12-06", side: "B", p: [[45.8,24.15],[45.05,23.27],[44.32,23.8],[44.43,26.1]] },
      { n: "Mackensen crosses the Danube", s: "1916-11-23", e: "1916-12-06", side: "B", p: [[43.62,25.35],[44.43,26.1]] },
      { n: "Maude takes Baghdad", s: "1916-12-13", e: "1917-03-11", side: "A", p: [[32.5,45.82],[33.09,44.58],[33.31,44.36]] },
      { n: "Lettow-Vorbeck's long march", s: "1916-03-05", e: "1918-11-25", side: "B", p: [[-3.35,37.34],[-6.8,37.7],[-10.7,35.65],[-14.5,37.0],[-11.5,35.0],[-8.83,31.37]] },
      { n: "Two million Americans cross", s: "1917-06-14", e: "1918-09-30", side: "A", p: [[40.7,-74.0],[45.0,-40.0],[47.28,-2.2]] },
      { n: "Caporetto", s: "1917-10-24", e: "1917-11-10", side: "B", p: [[46.25,13.58],[46.07,13.25],[45.85,12.4]] },
      { n: "Allenby: Gaza to Jerusalem", s: "1917-10-31", e: "1917-12-09", side: "A", p: [[31.25,34.79],[31.5,34.47],[32.05,34.76],[31.78,35.22]] },
      { n: "Operation Faustschlag", s: "1918-02-18", e: "1918-05-08", side: "B", p: [[51.2,24.7],[50.45,30.52],[50.0,36.23],[47.24,39.7]] },
      { n: "Operation Michael", s: "1918-03-21", e: "1918-04-05", side: "B", p: [[49.85,3.29],[49.8,2.9],[49.87,2.55]] },
      { n: "Blücher–Yorck: to the Marne", s: "1918-05-27", e: "1918-06-06", side: "B", p: [[49.44,3.7],[49.38,3.32],[49.06,3.42]] },
      { n: "The Hundred Days", s: "1918-08-08", e: "1918-11-11", side: "A", p: [[49.89,2.3],[49.93,2.93],[50.17,3.23],[50.45,3.95]] },
      { n: "Meuse–Argonne", s: "1918-09-26", e: "1918-11-11", side: "A", p: [[49.15,5.05],[49.4,5.0],[49.68,4.95]] },
      { n: "Megiddo to Aleppo", s: "1918-09-19", e: "1918-10-26", side: "A", p: [[32.1,34.85],[32.58,35.18],[33.51,36.29],[36.2,37.15]] },
      { n: "Breakout from Salonika", s: "1918-09-15", e: "1918-11-01", side: "A", p: [[41.03,21.93],[41.72,21.77],[42.0,21.43],[43.32,21.9],[44.8,20.47]] },
      { n: "Vittorio Veneto", s: "1918-10-24", e: "1918-11-04", side: "A", p: [[45.8,12.25],[45.98,12.3],[46.07,13.24]] }
    ],

    theaters: [
      { id: "world", n: "The World", box: [-125, -42, 160, 72], phi: 30 },
      { id: "europe", n: "Europe", box: [-10, 35.5, 44, 61.5], phi: 50 },
      { id: "west", n: "Western Front", box: [-0.5, 46.9, 9.2, 52.2], phi: 49.5 },
      { id: "east", n: "Eastern Front", box: [13.5, 43.5, 42, 60.5], phi: 52 },
      { id: "south", n: "Italy & the Balkans", box: [8, 38.5, 30, 48], phi: 43 },
      { id: "mideast", n: "Middle East", box: [23, 18, 52, 43.5], phi: 32 },
      { id: "africa", n: "Africa", box: [-20, -36, 52, 38], phi: 5 }
    ],

    stats: [
      { v: "65 million", l: "men mobilized", s: "Britannica" },
      { v: "8.5 million", l: "soldiers killed", s: "Britannica" },
      { v: "21 million", l: "wounded", s: "Britannica" },
      { v: "c. 13 million", l: "civilian deaths (uncertain)", s: "Britannica estimate" },
      { v: "4", l: "empires destroyed", s: "German · Austro-Hungarian · Russian · Ottoman" },
      { v: "@days", l: "days, 28 Jul 1914 – 11 Nov 1918", s: "" }
    ],
    cost: {
      title: "Mobilized and killed, by power",
      note: "Military deaths (killed in action, died of wounds, disease or in captivity) against forces mobilized. No agency counted civilian deaths: Britannica puts them near 13 million from starvation, exposure, disease, massacre and military action — a figure it calls uncertain. Serbia's and the Ottoman Empire's true losses are widely thought to be far higher than this table shows.",
      src: [{ n: "Encyclopaedia Britannica — World War I: Killed, wounded, and missing", u: "https://www.britannica.com/event/World-War-I/Killed-wounded-and-missing" },
            { n: "1914-1918-online: International Encyclopedia of the First World War — War Losses", u: "https://encyclopedia.1914-1918-online.net/article/war-losses/" }],
      mode: "mob",
      rows: [
        { n: "Russia", side: "A", mob: 12000000, mil: 1700000 }, { n: "Germany", side: "B", mob: 11000000, mil: 1773700 },
        { n: "British Empire", side: "A", mob: 8904467, mil: 908371 }, { n: "France", side: "A", mob: 8410000, mil: 1357800 },
        { n: "Austria-Hungary", side: "B", mob: 7800000, mil: 1200000 }, { n: "Italy", side: "A", mob: 5615000, mil: 650000 },
        { n: "United States", side: "A", mob: 4355000, mil: 116516 }, { n: "Ottoman Empire", side: "B", mob: 2850000, mil: 325000 },
        { n: "Bulgaria", side: "B", mob: 1200000, mil: 87500 }, { n: "Japan", side: "A", mob: 800000, mil: 300 },
        { n: "Romania", side: "A", mob: 750000, mil: 335706 }, { n: "Serbia", side: "A", mob: 707343, mil: 45000 },
        { n: "Belgium", side: "A", mob: 267000, mil: 13716 }, { n: "Greece", side: "A", mob: 230000, mil: 5000 },
        { n: "Portugal", side: "A", mob: 100000, mil: 7222 }, { n: "Montenegro", side: "A", mob: 50000, mil: 3000 }
      ],
      totals: [{ n: "Allied & Associated Powers", side: "A", mob: 42188810, mil: 5142631 }, { n: "Central Powers", side: "B", mob: 22850000, mil: 3386200 }]
    },

    causes: [
      { t: "Two armed camps", d: "By 1907 Europe is divided into the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (France, Russia, Britain). A quarrel between any two members can now pull in all six." },
      { t: "The arms race", d: "Germany builds a battle fleet to rival Britain's; Britain answers with the Dreadnought. Conscript armies double in a generation and every general staff has a railway timetable for war." },
      { t: "Empire and rivalry", d: "The scramble for Africa and markets sharpens every European dispute. Germany, late to unification, wants its 'place in the sun'.", ref: "scramble" },
      { t: "The Balkan powder keg", d: "As Ottoman power recedes, Serbia doubles in size in the Balkan Wars of 1912–13 and dreams of uniting the South Slavs — millions of whom live under the Habsburgs. Vienna sees a mortal threat; Russia sees a protégé." },
      { t: "Mobilization as a doomsday machine", d: "Germany's only plan for a two-front war requires knocking out France in six weeks by marching through Belgium before Russia is ready. Once Russia mobilizes, Berlin believes it must attack at once — in the west." },
      { t: "The spark", d: "On 28 June 1914 a nineteen-year-old shoots the Archduke Franz Ferdinand in Sarajevo.", ref: "franzferdinand" }
    ],
    aftermath: [
      { t: "Four empires fall", d: "The Hohenzollern, Habsburg, Romanov and Ottoman dynasties are gone within five years. A dozen new states appear between the Baltic and the Aegean.", ref: "ataturk" },
      { t: "Revolution in Russia", d: "The war breaks the Tsarist state and delivers the world's largest country to the Bolsheviks.", ref: "russianrev" },
      { t: "The Versailles settlement", d: "Germany loses 13% of its territory, all its colonies, and is billed for the war. The resentment is a gift to every German nationalist.", ref: "versailles" },
      { t: "The League of Nations", d: "Wilson's parliament of nations is created to prevent another war — and the United States Senate declines to join it.", ref: "league" },
      { t: "The modern Middle East", d: "Britain and France carve the Ottoman Arab lands into mandates — Iraq, Syria, Lebanon, Palestine, Transjordan — on lines agreed in secret in 1916, while promising Palestine to two peoples.", ref: "balfour" },
      { t: "Pandemic", d: "The 1918 influenza travels with the troopships and kills more people than the war.", ref: "flu" },
      { t: "The economic wreckage", d: "War debts, reparations and the German hyperinflation of 1923 poison the peace.", ref: "hyperinflation" },
      { t: "The road to the next war", d: "A wounded Austrian corporal named Hitler, a wounded Italian corporal named Mussolini, and a 'mutilated victory' and a 'stab in the back' myth to feed on.", ref: "hitler33" }
    ],
    tech: [
      { t: "Artillery", d: "The great killer: perhaps 60% of all battlefield casualties. A million shells fall on Verdun in the first ten hours." },
      { t: "The machine gun and barbed wire", d: "Defence defeats attack for three years; the answer is the trench." },
      { t: "Poison gas", d: "Chlorine (1915), phosgene, then mustard gas (1917). Fritz Haber, who fed the world with synthetic nitrogen, directs the first attack." },
      { t: "The tank", d: "First used on the Somme in September 1916; decisive by Amiens in 1918." },
      { t: "Air power", d: "From unarmed scouts to fighters, strategic bombers and the first independent air force (RAF, 1 April 1918).", ref: "flight" },
      { t: "The submarine", d: "U-boats sink some 5,000 Allied and neutral merchant ships and nearly starve Britain in 1917 — until the convoy system." },
      { t: "Total war", d: "Conscription, rationing, propaganda, women in the munitions factories, whole economies directed by the state." }
    ],

    /* ------------ the leaders ------------ */
    /* role: crown (monarch / head of state) · gov (head of government) · cmd (commander) · fig (other figure) */
    groups: [
      { c: "United Kingdom", side: "A" }, { c: "France", side: "A" }, { c: "Russia", side: "A" }, { c: "Italy", side: "A" }, { c: "United States", side: "A" },
      { c: "Serbia", side: "A" }, { c: "Montenegro", side: "A" }, { c: "Belgium", side: "A" }, { c: "Romania", side: "A" }, { c: "Greece", side: "A" }, { c: "Japan", side: "A" }, { c: "Arab Revolt", side: "A" },
      { c: "Germany", side: "B" }, { c: "Austria-Hungary", side: "B" }, { c: "Ottoman Empire", side: "B" }, { c: "Bulgaria", side: "B" },
      { c: "Neutral crowns", side: "N" }
    ],
    leaders: [
      { id: "george5", n: "George V", c: "United Kingdom", r: "crown", t: "King-Emperor", s: "1910-05-06", house: "Saxe-Coburg and Gotha — renamed Windsor, 1917", d: "First cousin to both the Kaiser and the Tsar. In 1917 he drops the family's German name — and withdraws an offer of asylum to Nicholas II." },
      { id: "asquith", n: "H. H. Asquith", c: "United Kingdom", r: "gov", t: "Prime Minister", s: "1908-04-05", e: "1916-12-05", d: "Takes Britain into the war over Belgium; forced out after the Somme. His eldest son is killed there." },
      { id: "lloydgeorge", n: "David Lloyd George", c: "United Kingdom", r: "gov", t: "Prime Minister", s: "1916-12-06", d: "The 'man who won the war': runs munitions, then the country, through a small War Cabinet. One of the Big Four at Paris." },
      { id: "kitchener", n: "Lord Kitchener", c: "United Kingdom", r: "cmd", t: "Secretary of State for War", s: "1914-08-05", e: "1916-06-05", d: "Almost alone in foreseeing a long war, he raises a volunteer army of millions. Drowned when HMS Hampshire strikes a mine." },
      { id: "haig", n: "Douglas Haig", c: "United Kingdom", r: "cmd", t: "Commander-in-Chief, BEF", s: "1915-12-19", d: "Commands the largest army Britain has ever fielded through the Somme, Passchendaele and the victorious Hundred Days." },
      { id: "poincare", n: "Raymond Poincaré", c: "France", r: "crown", t: "President of the Republic", s: "1913-02-18", d: "A Lorrainer who never forgave 1871; the voice of the 'sacred union'." },
      { id: "clemenceau", n: "Georges Clemenceau", c: "France", r: "gov", t: "Prime Minister", s: "1917-11-16", d: "'The Tiger'. Takes office at 76 in France's darkest hour with one policy: 'I wage war.' Dictates the peace at Versailles." },
      { id: "joffre", n: "Joseph Joffre", c: "France", r: "cmd", t: "Commander-in-Chief", s: "1911-07-28", e: "1916-12-13", d: "Imperturbable victor of the Marne; removed after Verdun and the Somme." },
      { id: "petain", n: "Philippe Pétain", c: "France", r: "cmd", t: "Defender of Verdun · C-in-C from May 1917", s: "1916-02-25", d: "Saves Verdun, then heals the mutinous army. The most revered man in France — which is why 1940 is possible." },
      { id: "foch", n: "Ferdinand Foch", c: "France", r: "cmd", t: "Supreme Allied Commander", s: "1918-03-26", d: "Given command of all Allied armies in the crisis of March 1918; signs the armistice in his railway carriage." },
      { id: "nicholas2", n: "Nicholas II", c: "Russia", r: "crown", t: "Emperor of All the Russias", s: "1894-11-01", e: "1917-03-15", house: "Romanov (Holstein-Gottorp)", d: "Takes personal command of the army in 1915, leaving the capital to his wife and Rasputin. Abdicates in March 1917; shot with his family at Yekaterinburg, 17 July 1918." },
      { id: "alexandra", n: "Empress Alexandra", c: "Russia", r: "fig", t: "Tsarina · born Alix of Hesse", s: "1894-11-26", e: "1917-03-15", house: "Hesse-Darmstadt", d: "A German-born granddaughter of Queen Victoria, raised partly at Windsor. Russians call her 'the German woman'." },
      { id: "nikolasha", n: "Grand Duke Nicholas", c: "Russia", r: "cmd", t: "Commander-in-Chief", s: "1914-08-02", e: "1915-09-05", house: "Romanov", d: "The Tsar's towering cousin; dismissed after the Great Retreat, then viceroy in the Caucasus." },
      { id: "brusilovl", n: "Aleksei Brusilov", c: "Russia", r: "cmd", t: "Commander, Southwestern Front", s: "1916-03-30", e: "1917-07-31", d: "Author of the war's most successful Allied offensive before 1918. Later serves the Red Army." },
      { id: "kerensky", n: "Alexander Kerensky", c: "Russia", r: "gov", t: "Head of the Provisional Government", s: "1917-07-21", e: "1917-11-07", d: "Keeps Russia in the war and loses it to Lenin." },
      { id: "lenin", n: "Vladimir Lenin", c: "Russia", r: "gov", t: "Chairman of the Soviet government", s: "1917-11-07", d: "Returns from Swiss exile in a German 'sealed train', takes power in November and takes Russia out of the war." },
      { id: "vittorio3", n: "Victor Emmanuel III", c: "Italy", r: "crown", t: "King of Italy", s: "1900-07-29", house: "Savoy", d: "Backs intervention against his parliament's majority in 1915. Will reign through both world wars — on opposite sides." },
      { id: "orlando", n: "Vittorio Orlando", c: "Italy", r: "gov", t: "Prime Minister", s: "1917-10-30", d: "Takes office in the week of Caporetto; the weakest of the Big Four at Paris." },
      { id: "cadorna", n: "Luigi Cadorna", c: "Italy", r: "cmd", t: "Chief of Staff", s: "1914-07-27", e: "1917-11-08", d: "Eleven battles of the Isonzo; sacked after the twelfth. Replaced by Armando Diaz." },
      { id: "wilson", n: "Woodrow Wilson", c: "United States", r: "crown", t: "President", s: "1913-03-04", d: "Re-elected in 1916 because 'he kept us out of war'; enters it five months later. His Fourteen Points become the basis of the armistice." },
      { id: "pershing", n: "John J. Pershing", c: "United States", r: "cmd", t: "Commander, American Expeditionary Forces", s: "1917-05-26", d: "Insists the Americans fight as an independent army, not as replacements for the French and British." },
      { id: "peter1", n: "Peter I", c: "Serbia", r: "crown", t: "King of Serbia", s: "1903-06-15", house: "Karađorđević", d: "At 71 he picks up a rifle in the trenches in 1914 and crosses the Albanian mountains with his retreating army in an ox-cart." },
      { id: "pasic", n: "Nikola Pašić", c: "Serbia", r: "gov", t: "Prime Minister", s: "1912-09-12", d: "Accepts nearly all of Vienna's ultimatum — not enough to prevent war." },
      { id: "nikola1", n: "Nicholas I", c: "Montenegro", r: "crown", t: "King of Montenegro", s: "1860-08-13", e: "1918-11-26", house: "Petrović-Njegoš", d: "'The father-in-law of Europe': his daughters marry into the royal houses of Italy, Serbia and Russia. Dies in exile, his kingdom absorbed into Yugoslavia." },
      { id: "albert1", n: "Albert I", c: "Belgium", r: "crown", t: "King of the Belgians", s: "1909-12-23", house: "Saxe-Coburg and Gotha", d: "The 'Soldier King' refuses the Kaiser's ultimatum and personally commands his army on the Yser for four years. His queen is a Bavarian duchess." },
      { id: "ferdinand_ro", n: "Ferdinand I", c: "Romania", r: "crown", t: "King of Romania", s: "1914-10-10", house: "Hohenzollern-Sigmaringen", d: "A German prince, of the Kaiser's own dynasty, who goes to war against Germany. His family strikes his name from the house register." },
      { id: "marie_ro", n: "Queen Marie", c: "Romania", r: "fig", t: "Queen consort · born Marie of Edinburgh", s: "1914-10-10", d: "Granddaughter of both Queen Victoria and Tsar Alexander II; the driving force behind Romania's entry on the Allied side." },
      { id: "constantine1", n: "Constantine I", c: "Greece", r: "crown", t: "King of the Hellenes", s: "1913-03-18", e: "1917-06-11", house: "Glücksburg", d: "Married to the Kaiser's sister and determined to stay neutral. Forced out by the Allies in June 1917 in favour of his son Alexander." },
      { id: "venizelos", n: "Eleftherios Venizelos", c: "Greece", r: "gov", t: "Prime Minister", s: "1917-06-27", d: "Sets up a rival pro-Allied government in Salonika in 1916 and brings Greece into the war." },
      { id: "taisho", n: "Emperor Taishō", c: "Japan", r: "crown", t: "Emperor of Japan", s: "1912-07-30", house: "Yamato", d: "A frail sovereign; the genrō and the cabinet take Japan into the war for Germany's Asian possessions." },
      { id: "hussein", n: "Sharif Hussein bin Ali", c: "Arab Revolt", r: "crown", t: "Sharif of Mecca · King of the Hejaz", s: "1916-06-10", house: "Hashemite", d: "Promised an Arab kingdom by Britain in the McMahon correspondence; gets the Hejaz, and loses even that to Ibn Saud." },
      { id: "faisal", n: "Emir Faisal", c: "Arab Revolt", r: "cmd", t: "Commander, Northern Arab Army", s: "1916-06-10", house: "Hashemite", d: "Hussein's son leads the revolt north to Damascus with T. E. Lawrence at his side. Later king of Iraq." },
      { id: "wilhelm2", n: "Wilhelm II", c: "Germany", r: "crown", t: "German Emperor, King of Prussia", s: "1888-06-15", e: "1918-11-09", house: "Hohenzollern", d: "Queen Victoria's eldest grandchild. Bombastic in peace, sidelined in war by his own generals; abdicates and lives out his life at Doorn in the Netherlands." },
      { id: "bethmann", n: "Theobald von Bethmann Hollweg", c: "Germany", r: "gov", t: "Chancellor", s: "1909-07-14", e: "1917-07-13", d: "Issues the 'blank cheque' to Vienna and calls Belgian neutrality 'a scrap of paper'. Pushed out by the generals." },
      { id: "moltke", n: "Helmuth von Moltke (the Younger)", c: "Germany", r: "cmd", t: "Chief of the General Staff", s: "1906-01-01", e: "1914-09-14", d: "Executes — and weakens — the Schlieffen Plan. Breaks down after the Marne." },
      { id: "falkenhayn", n: "Erich von Falkenhayn", c: "Germany", r: "cmd", t: "Chief of the General Staff", s: "1914-09-14", e: "1916-08-29", d: "Architect of Verdun. Dismissed when Romania enters — then conquers Romania." },
      { id: "hindenburg", n: "Paul von Hindenburg", c: "Germany", r: "cmd", t: "Chief of the General Staff", s: "1916-08-29", d: "Hero of Tannenberg, figurehead of the 'silent dictatorship'. As President in 1933 he will appoint Hitler chancellor." },
      { id: "ludendorff", n: "Erich Ludendorff", c: "Germany", r: "cmd", t: "First Quartermaster-General", s: "1916-08-29", e: "1918-10-26", d: "The real ruler of Germany from 1916. Gambles everything on the 1918 offensives, then invents the 'stab in the back'. Marches beside Hitler in the 1923 putsch." },
      { id: "franzjoseph", n: "Franz Joseph I", c: "Austria-Hungary", r: "crown", t: "Emperor of Austria, King of Hungary", s: "1848-12-02", e: "1916-11-21", house: "Habsburg-Lorraine", d: "On the throne for 68 years. Signs the declaration of war at 83 and dies in the middle of it." },
      { id: "franzferd", n: "Archduke Franz Ferdinand", c: "Austria-Hungary", r: "fig", t: "Heir to the throne", s: "1896-05-19", e: "1914-06-28", house: "Habsburg-Lorraine", d: "The emperor's nephew and heir, disliked at court and killed at Sarajevo. Ironically, a voice for restraint toward Serbia." },
      { id: "karl1", n: "Karl I", c: "Austria-Hungary", r: "crown", t: "Emperor of Austria, King of Hungary", s: "1916-11-21", e: "1918-11-11", house: "Habsburg-Lorraine", d: "The last Habsburg emperor. Secretly seeks peace through his wife's brothers in 1917; the leak ties him tighter to Berlin." },
      { id: "conrad", n: "Franz Conrad von Hötzendorf", c: "Austria-Hungary", r: "cmd", t: "Chief of the General Staff", s: "1912-12-12", e: "1917-03-01", d: "Urged preventive war on Serbia more than twenty times before 1914. Gets it, and wrecks the army in its first six months." },
      { id: "mehmed5", n: "Mehmed V", c: "Ottoman Empire", r: "crown", t: "Sultan and Caliph", s: "1909-04-27", e: "1918-07-03", house: "Osman", d: "A figurehead who proclaims a jihad that few Muslims heed. Succeeded by his brother Mehmed VI, the last sultan." },
      { id: "enver", n: "Enver Pasha", c: "Ottoman Empire", r: "cmd", t: "Minister of War", s: "1914-01-04", e: "1918-10-14", d: "Leader of the Young Turk triumvirate; signs the secret alliance with Germany. Married into the Ottoman dynasty." },
      { id: "talaat", n: "Talaat Pasha", c: "Ottoman Empire", r: "gov", t: "Interior Minister · Grand Vizier from 1917", s: "1913-06-12", e: "1918-10-08", d: "Principal architect of the Armenian Genocide. Assassinated in Berlin in 1921 by a survivor." },
      { id: "kemal", n: "Mustafa Kemal", c: "Ottoman Empire", r: "cmd", t: "Divisional commander at Gallipoli", s: "1915-02-25", d: "'I do not order you to attack, I order you to die.' The future Atatürk." },
      { id: "ferdinand_bg", n: "Ferdinand I", c: "Bulgaria", r: "crown", t: "Tsar of Bulgaria", s: "1887-07-07", e: "1918-10-03", house: "Saxe-Coburg and Gotha-Koháry", d: "'Foxy Ferdinand', a Vienna-born Coburg prince. Picks the losing side to win Macedonia and abdicates for his son Boris III." },
      { id: "haakon7", n: "Haakon VII", c: "Neutral crowns", r: "crown", t: "King of Norway", s: "1905-11-18", house: "Glücksburg", d: "A Danish prince married to George V's sister. Neutral in this war; a symbol of resistance in the next." },
      { id: "christian10", n: "Christian X", c: "Neutral crowns", r: "crown", t: "King of Denmark", s: "1912-05-14", house: "Glücksburg", d: "First cousin to George V, Nicholas II and Constantine I — and Haakon VII's elder brother." },
      { id: "alfonso13", n: "Alfonso XIII", c: "Neutral crowns", r: "crown", t: "King of Spain", s: "1886-05-17", house: "Bourbon", d: "Married to a granddaughter of Queen Victoria. Runs a wartime office tracing prisoners and the missing of both sides." },
      { id: "gustaf5", n: "Gustaf V", c: "Neutral crowns", r: "crown", t: "King of Sweden", s: "1907-12-08", house: "Bernadotte", d: "Pro-German in sympathy, with a German queen who was the Kaiser's first cousin; keeps Sweden neutral." },
      { id: "wilhelmina", n: "Wilhelmina", c: "Neutral crowns", r: "crown", t: "Queen of the Netherlands", s: "1890-11-23", house: "Orange-Nassau", d: "Keeps the Netherlands out of the war, then refuses to hand the fugitive Kaiser to the Allies." }
    ],
    /* k: family · marriage · ally (partnership / association) · succ (succession) · rival (rivalry / enmity) · patron (patron–client) */
    ties: [
      { a: "george5", b: "wilhelm2", k: "family", d: "First cousins — both grandsons of Queen Victoria. George's father Edward VII and Wilhelm's mother Victoria were brother and sister." },
      { a: "george5", b: "nicholas2", k: "family", d: "First cousins, and near-doubles — their mothers Alexandra and Dagmar were sisters, daughters of Christian IX of Denmark. In 1917 George's government withdrew an offer of asylum to 'Nicky'." },
      { a: "wilhelm2", b: "nicholas2", k: "family", d: "Second cousins once removed and third cousins (both descend from Frederick William III of Prussia and Paul I of Russia). They exchanged the 'Willy–Nicky' telegrams in English on the eve of war, each begging the other to stop mobilizing." },
      { a: "nicholas2", b: "alexandra", k: "marriage", d: "Married 1894. Her dependence on Rasputin for their haemophiliac son helped destroy the monarchy's credit." },
      { a: "alexandra", b: "wilhelm2", k: "family", d: "First cousins — both grandchildren of Queen Victoria." },
      { a: "alexandra", b: "george5", k: "family", d: "First cousins — both grandchildren of Queen Victoria." },
      { a: "nicholas2", b: "nikolasha", k: "family", d: "First cousins once removed: the Grand Duke was a grandson of Nicholas I. The Tsar dismissed him and took the command himself." },
      { a: "nikolasha", b: "nikola1", k: "marriage", d: "The Grand Duke's wife, Anastasia, was a daughter of Nicholas of Montenegro." },
      { a: "vittorio3", b: "nikola1", k: "marriage", d: "Victor Emmanuel's queen, Elena, was Nicholas of Montenegro's daughter — father-in-law and son-in-law, on the same side." },
      { a: "peter1", b: "nikola1", k: "marriage", d: "Peter's late wife Zorka was Nicholas's eldest daughter; the regent Alexander of Serbia was Nicholas's grandson." },
      { a: "marie_ro", b: "ferdinand_ro", k: "marriage", d: "Married 1893. She pulled her German husband toward the Entente." },
      { a: "marie_ro", b: "george5", k: "family", d: "First cousins — her father Alfred was Queen Victoria's second son." },
      { a: "marie_ro", b: "nicholas2", k: "family", d: "First cousins — her mother was the sister of Tsar Alexander III." },
      { a: "marie_ro", b: "wilhelm2", k: "family", d: "First cousins through Queen Victoria — on opposite sides." },
      { a: "ferdinand_ro", b: "wilhelm2", k: "family", d: "Kinsmen of the House of Hohenzollern: Ferdinand came from its Catholic Sigmaringen branch. The Kaiser took Romania's declaration of war as a personal betrayal." },
      { a: "constantine1", b: "wilhelm2", k: "marriage", d: "Brothers-in-law: Constantine's queen, Sophia of Prussia, was the Kaiser's sister. The Allies never trusted him." },
      { a: "constantine1", b: "george5", k: "family", d: "First cousins — their parents were siblings, children of Christian IX of Denmark." },
      { a: "constantine1", b: "nicholas2", k: "family", d: "First cousins through Christian IX of Denmark — and second cousins through Constantine's Romanov mother, Olga." },
      { a: "constantine1", b: "venizelos", k: "rival", d: "The 'National Schism': king against prime minister, neutrality against intervention. It split Greece into two governments in 1916." },
      { a: "albert1", b: "george5", k: "family", d: "Kinsmen of the House of Saxe-Coburg and Gotha: Albert's grandfather Leopold I was Queen Victoria's uncle." },
      { a: "albert1", b: "wilhelm2", k: "rival", d: "The Kaiser demanded passage through Belgium; Albert answered that Belgium was 'a nation, not a road'." },
      { a: "ferdinand_bg", b: "albert1", k: "family", d: "Both princes of Saxe-Coburg and Gotha — one fighting for Germany, one against." },
      { a: "ferdinand_bg", b: "george5", k: "family", d: "Coburg kinsmen: Ferdinand's father was a first cousin of both Queen Victoria and Prince Albert." },
      { a: "haakon7", b: "george5", k: "marriage", d: "Brothers-in-law and first cousins: Haakon's queen, Maud, was George's sister." },
      { a: "haakon7", b: "christian10", k: "family", d: "Brothers — sons of Frederick VIII of Denmark." },
      { a: "christian10", b: "george5", k: "family", d: "First cousins through Christian IX of Denmark." },
      { a: "christian10", b: "nicholas2", k: "family", d: "First cousins through Christian IX of Denmark." },
      { a: "alfonso13", b: "george5", k: "marriage", d: "Alfonso's queen, Victoria Eugenie of Battenberg, was George's first cousin — another grandchild of Queen Victoria." },
      { a: "gustaf5", b: "wilhelm2", k: "marriage", d: "Gustaf's queen, Victoria of Baden, was the Kaiser's first cousin." },
      { a: "wilhelmina", b: "wilhelm2", k: "patron", d: "Gave the fallen Kaiser asylum in November 1918 and refused Allied demands to extradite him for trial." },
      { a: "franzjoseph", b: "franzferd", k: "family", d: "Uncle and nephew. The emperor disliked his heir and his morganatic marriage — and went to war over his murder." },
      { a: "franzjoseph", b: "karl1", k: "succ", d: "Great-uncle and grand-nephew. Karl inherited the throne, and a lost war, in November 1916." },
      { a: "franzferd", b: "karl1", k: "family", d: "Uncle and nephew; Sarajevo made Karl the heir." },
      { a: "karl1", b: "albert1", k: "ally", d: "The Sixtus Affair: in 1917 Karl sent secret peace feelers to France through his brothers-in-law, Princes Sixtus and Xavier of Bourbon-Parma — both officers in Albert's Belgian army." },
      { a: "franzjoseph", b: "wilhelm2", k: "ally", d: "The Dual Alliance of 1879. Wilhelm's 'blank cheque' of 5 July 1914 promised Germany's support whatever Vienna did to Serbia." },
      { a: "wilhelm2", b: "hindenburg", k: "rival", d: "The 'Supreme War Lord' was eclipsed by his own field marshal; in November 1918 Hindenburg told him the army would no longer follow him." },
      { a: "hindenburg", b: "ludendorff", k: "ally", d: "The 'duo': Hindenburg supplied the nerves and the name, Ludendorff the plans — from Tannenberg to the 'silent dictatorship' of 1916–18." },
      { a: "moltke", b: "falkenhayn", k: "succ", d: "Falkenhayn replaced the broken Moltke after the Marne." },
      { a: "falkenhayn", b: "hindenburg", k: "succ", d: "Rivals for two years over east-first or west-first. Hindenburg replaced him in August 1916." },
      { a: "bethmann", b: "ludendorff", k: "rival", d: "The chancellor opposed unrestricted submarine warfare; the generals forced it through, then forced him out." },
      { a: "ludendorff", b: "lenin", k: "patron", d: "The German High Command sent Lenin from Zurich to Petrograd in a sealed train in April 1917 — 'like a plague bacillus', said Churchill — to knock Russia out of the war. It worked." },
      { a: "kerensky", b: "lenin", k: "rival", d: "Lenin overthrew Kerensky's government on 7 November 1917. Their fathers had been colleagues in Simbirsk: Kerensky's father was Lenin's headmaster." },
      { a: "nicholas2", b: "kerensky", k: "succ", d: "The Provisional Government took power on the Tsar's abdication and held the family under arrest." },
      { a: "enver", b: "talaat", k: "ally", d: "With Djemal Pasha, the 'Three Pashas' who ruled the empire from the 1913 coup." },
      { a: "enver", b: "mehmed5", k: "marriage", d: "Enver married Princess Naciye, the sultan's niece, in 1914 — making the revolutionary a damat, an imperial son-in-law." },
      { a: "enver", b: "wilhelm2", k: "ally", d: "Signed the secret Ottoman–German alliance on 2 August 1914, with most of his own cabinet kept in the dark." },
      { a: "enver", b: "kemal", k: "rival", d: "Kemal despised Enver's adventurism and was kept from high command; he would found the republic Enver never saw." },
      { a: "hussein", b: "faisal", k: "family", d: "Father and son." },
      { a: "hussein", b: "mehmed5", k: "rival", d: "The Sharif of Mecca, guardian of the holy cities, rebelled against his caliph in June 1916." },
      { a: "asquith", b: "lloydgeorge", k: "rival", d: "Lloyd George supplanted his own party leader in December 1916 and split the Liberal Party for good." },
      { a: "lloydgeorge", b: "haig", k: "rival", d: "The prime minister thought his commander a butcher but dared not sack him; he withheld reinforcements instead." },
      { a: "kitchener", b: "asquith", k: "ally", d: "Asquith made the empire's most famous soldier his war minister in August 1914." },
      { a: "poincare", b: "clemenceau", k: "rival", d: "Lifelong enemies. Poincaré appointed him in November 1917 because nobody else could save France." },
      { a: "joffre", b: "petain", k: "succ", d: "After Joffre (and the brief disaster of Nivelle), Pétain took command of the French armies in May 1917." },
      { a: "foch", b: "haig", k: "ally", d: "At Doullens on 26 March 1918 Haig himself asked that Foch be given command over all the Allied armies." },
      { a: "foch", b: "pershing", k: "ally", d: "Pershing placed the AEF at Foch's disposal — but only as an American army." },
      { a: "foch", b: "petain", k: "ally", d: "Generalissimo and commander of the French armies in the victory of 1918. In 1940 Pétain would sign the armistice Foch's carriage was dragged out to host." },
      { a: "wilson", b: "lloydgeorge", k: "ally", d: "With Clemenceau and Orlando, the 'Big Four' who made the peace at Paris in 1919." },
      { a: "wilson", b: "clemenceau", k: "rival", d: "Idealist against realist. Clemenceau: 'God gave us Ten Commandments and we broke them. Wilson gives us Fourteen Points — we shall see.'" },
      { a: "clemenceau", b: "lloydgeorge", k: "ally", d: "Partners in victory, rivals over how hard to punish Germany." },
      { a: "orlando", b: "wilson", k: "rival", d: "Orlando walked out of the peace conference when Wilson refused Italy the port of Fiume." },
      { a: "cadorna", b: "vittorio3", k: "ally", d: "The king shielded Cadorna from the politicians until Caporetto made it impossible." },
      { a: "peter1", b: "pasic", k: "ally", d: "King and prime minister through the Balkan Wars, the invasion and the exile on Corfu." },
      { a: "pasic", b: "franzjoseph", k: "rival", d: "The ultimatum of 23 July 1914 was written so that Pašić could not accept it." }
    ],

    sources: [
      { n: "Encyclopaedia Britannica — World War I", u: "https://www.britannica.com/event/World-War-I" },
      { n: "Encyclopaedia Britannica — Killed, wounded, and missing (casualty table)", u: "https://www.britannica.com/event/World-War-I/Killed-wounded-and-missing" },
      { n: "1914-1918-online: International Encyclopedia of the First World War", u: "https://encyclopedia.1914-1918-online.net/article/war-losses/" },
      { n: "Wikipedia — World War I (orientation; individual battle articles linked on each record)", u: W + "World_War_I" },
      { n: "Wikipedia — World War I casualties (comparison of estimates)", u: W + "World_War_I_casualties" }
    ]
  };
})();
