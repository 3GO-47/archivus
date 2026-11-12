/* ============================================================
   ARCHIVUS — THE WAR ROOM · dataset II: the Second World War
   ------------------------------------------------------------
   Same schema as wars-ww1.js (read its header first).

   · status codes: A Allied power at war · a Allied empire/colony ·
     S Soviet Union under the Nazi–Soviet Pact (1939–41) ·
     X Axis power at war · xn Axis-aligned, not yet at war ·
     x Axis colony / annexed land · oX Axis-occupied or puppet ·
     K divided — the front runs through it · oA under Allied
     occupation · N neutral
   · the map wraps at 30°W so Europe, Asia, the Pacific and the
     Americas read left to right in one piece (wrap: -30)
   · death tolls: The National WWII Museum's country table
     (see cost.src); ranges are kept as ranges
   · fronts and the Japanese perimeter are SCHEMATIC — traced at
     key dates from standard campaign maps, interpolated between
   ============================================================ */
(function () {
  "use strict";
  const W = "https://en.wikipedia.org/wiki/";

  /* ---- Eastern Front 1941–44: the limit of Axis control in the USSR.
          Points in the sea are deliberate: the zone is clipped to land. ---- */
  const PX = [[59.85,29.0],[59.8,26.0],[59.6,23.0],[58.6,21.3],[57.2,20.6],[55.9,20.6]];
  const EBL = [[55.92,21.07],[55.35,21.9],[55.07,22.6],[54.4,22.8],[54.4,23.3],[54.0,23.5],[53.9,22.8],[53.45,21.95],[53.1,21.6],[52.7,22.0],[52.4,22.7],[52.08,23.65],[51.5,23.6],[50.85,24.05],[50.48,24.25],[50.3,23.6],[50.0,22.9],[49.4,22.4],[49.05,22.75],[48.5,23.8],[48.0,24.6],[47.8,25.1],[47.95,26.05],[48.2,26.7],[47.8,27.2],[47.2,27.8],[46.6,28.15],[45.9,28.15],[45.47,28.2],[45.35,29.6]];
  const E0 = PX.concat(EBL);                                             /* the frontier of 22 June 1941 */
  const LEN = [[59.85,29.0],[59.78,30.1],[59.72,30.7]];                  /* the siege lines south of Leningrad */
  const NW42 = LEN.concat([[59.93,31.05],[59.55,31.9],[59.1,31.8],[58.55,31.3],[58.0,31.5],[57.6,32.6],[57.15,31.6],[56.6,30.9],[55.9,31.0],[55.4,31.9],[55.7,32.7],[56.1,33.1],[56.45,34.4],[56.2,34.95],[55.6,35.3],[54.8,35.0],[54.2,34.2],[53.8,34.9],[53.6,35.7],[53.3,36.7],[52.8,37.0]]);
  const BS = [[44.3,34.4],[44.8,32.9],[46.0,31.4],[45.6,30.3],[45.35,29.6]];   /* Black Sea, offshore: Crimea → Danube */

  /* ---- the Japanese perimeter, in five segments so the ring morphs cleanly ---- */
  const JN = [[53.3,121.5],[53.5,123.3],[52.5,126.0],[50.25,127.5],[48.9,130.5],[48.4,134.8],[46.5,133.9],[45.0,132.0],[44.0,131.2],[42.3,130.7],[43.5,134.5],[46.5,139.5],[50.0,142.1],[50.0,143.8],[49.0,146.0],[51.0,156.8]];
  const MAN = [[46.7,119.9],[47.9,117.8],[49.6,117.0],[51.3,120.0],[53.3,121.5]];
  const JC0 = [[25.6,120.8],[29.0,123.5],[33.0,123.5],[36.5,123.2],[38.7,121.1],[40.0,119.8],[40.5,117.3],[41.3,115.5],[42.5,116.3],[44.8,118.5]].concat(MAN);
  const CHN = [[30.2,120.1],[30.4,118.9],[30.6,117.5],[29.9,116.6],[29.5,115.9],[29.7,114.9],[29.6,113.9],[29.4,113.1],[30.0,112.6],[30.7,111.4],[31.3,112.2],[31.9,113.0],[32.2,113.9],[32.9,114.0],[33.5,114.9],[34.5,114.2],[34.95,113.6],[35.1,112.6],[35.0,111.0],[34.75,110.3],[35.6,110.6],[37.0,110.9],[38.7,111.5],[39.6,111.5],[40.3,110.0],[40.85,109.7],[41.4,110.8],[42.3,112.8],[43.6,113.5],[45.0,116.0]].concat(MAN);
  const JC1 = [[25.6,120.8],[28.5,122.3],[30.3,121.3]].concat(CHN);
  const JC3 = [[21.55,107.95],[21.2,108.6],[17.8,108.3],[17.8,111.0],[20.5,111.6],[21.3,113.5],[22.0,115.5],[22.9,117.2],[24.0,118.6],[25.6,119.9],[27.0,120.8],[28.5,122.0],[30.3,121.3]].concat(CHN);
  const JE0 = [[51.0,156.8],[46.0,153.5],[40.0,148.0],[32.0,146.0],[24.5,155.0],[14.0,172.5],[5.5,173.0]];
  const JS0 = [[5.5,173.0],[1.0,166.0],[0.5,155.0],[2.0,140.0],[3.0,131.0]];
  const JW0 = [[3.0,131.0],[10.0,129.0],[20.5,122.5],[21.8,120.6],[23.5,119.5],[25.6,120.8]];
  const JE3 = [[51.0,156.8],[53.5,172.0],[51.5,178.5],[40.0,170.0],[20.5,168.0],[11.0,173.5],[2.5,174.5],[-2.0,174.0]];
  const DEI = [[-3.5,141.0],[-3.3,138.5],[-3.8,135.5],[-4.6,133.0],[-5.5,134.3],[-7.8,131.3],[-10.6,124.5],[-10.9,120.0],[-9.0,114.0],[-8.0,108.0],[-7.0,105.0],[-5.0,102.5],[-1.0,99.5],[2.5,96.5],[5.8,95.0]];
  const JS3 = [[-2.0,174.0],[-1.5,166.5],[-7.0,163.0],[-10.4,161.3],[-10.3,158.8],[-9.0,156.0],[-8.3,152.0],[-9.0,148.6],[-8.6,147.3],[-7.6,146.8],[-6.5,145.5],[-4.8,143.5]].concat(DEI);
  const JS3b = [[-2.0,174.0],[-1.5,166.5],[-5.5,161.0],[-8.6,158.2],[-8.9,156.5],[-8.0,154.5],[-7.0,150.5],[-7.4,147.4],[-6.9,146.7],[-6.2,146.0],[-5.6,145.0],[-4.8,143.5]].concat(DEI);
  const BUR = [[5.8,95.0],[9.0,92.0],[13.5,92.3]];
  const TON = [[22.0,99.5],[21.6,101.2],[22.5,102.5],[22.8,104.0],[23.1,105.3],[22.5,106.6],[21.55,107.95]];
  const JW3 = BUR.concat([[16.5,93.8],[19.5,93.0],[21.3,92.5],[22.8,93.5],[24.3,94.5],[25.8,95.5],[26.8,96.8],[26.6,97.8],[25.3,98.6],[24.3,98.9],[23.5,98.9]], TON);
  const JE4 = [[51.0,156.8],[46.0,154.5],[38.0,160.0],[20.5,168.0],[12.0,173.5],[5.0,173.5],[4.0,170.5]];
  const JS4 = [[4.0,170.5],[-1.5,166.5],[-4.5,160.0],[-5.0,156.0],[-6.9,155.9],[-6.6,152.0],[-5.6,150.0],[-5.2,147.6],[-5.9,146.9],[-6.0,146.0],[-5.6,145.0],[-5.0,143.5]].concat(DEI);
  const JE5 = [[51.0,156.8],[46.0,154.5],[36.0,148.0],[28.5,144.0],[23.5,143.0],[20.0,136.0],[15.5,125.5]];
  const SW = [[-6.0,134.5],[-8.5,131.5],[-10.5,124.0],[-10.8,119.5],[-9.0,114.0],[-8.0,108.0],[-7.0,105.0],[-5.0,102.5],[-1.0,99.5],[2.5,96.5],[5.8,95.0]];
  const JS5 = [[15.5,125.5],[12.6,124.2],[10.5,123.7],[8.5,126.8],[5.0,127.0],[3.0,128.8],[0.5,129.5],[-1.5,131.0],[-3.8,133.5]].concat(SW);
  const JW5 = BUR.concat([[16.5,93.8],[19.5,93.2],[20.5,93.3],[21.8,94.0],[22.8,94.6],[23.6,95.3],[24.5,96.2],[24.0,97.2],[23.9,98.0],[23.5,98.9]], TON);
  const JE6 = [[51.0,156.8],[46.0,154.5],[36.0,146.0],[31.0,141.5],[27.0,130.5],[24.0,125.5],[22.0,122.0]];
  const JS6 = [[22.0,122.0],[20.5,119.5],[15.0,116.0],[8.5,116.5],[7.3,117.5],[5.5,119.5],[3.3,118.2],[1.8,125.5],[0.8,128.6],[-1.5,131.0],[-3.8,133.5]].concat(SW);
  const JW6 = BUR.concat([[15.5,94.0],[17.2,94.6],[19.0,94.6],[20.3,95.0],[20.8,96.0],[21.5,97.0],[22.5,97.8]], TON);
  const JE7 = [[51.0,156.8],[46.0,154.5],[38.0,144.0],[33.0,141.0],[30.0,132.5],[29.0,126.0],[25.8,123.0],[22.0,121.5]];
  const JS7 = [[22.0,121.5]].concat(JS6.slice(1));
  const JW7 = [[5.8,95.0],[8.5,97.3],[12.5,97.6],[15.5,97.2],[17.3,96.95],[18.5,97.0],[19.7,97.3],[20.5,98.5],[21.3,99.6]].concat(TON.slice(1));
  const ring = (...segs) => segs;

  const BRITE = ["India","Pakistan","Bangladesh","Sri Lanka","Sudan","S. Sudan","Kenya","Uganda","Tanzania","Zambia","Zimbabwe","Malawi","Botswana","Lesotho","eSwatini","Nigeria","Ghana","Sierra Leone","Gambia","Namibia","Jamaica","Bahamas","Trinidad and Tobago","Belize","Guyana","Falkland Is.","Fiji","Cyprus","N. Cyprus","Egypt","Israel","Palestine","Jordan","Kuwait","Qatar","United Arab Emirates","Oman","Nepal","Vanuatu"];
  const AOF = ["Senegal","Mali","Mauritania","Niger","Burkina Faso","Guinea","Côte d'Ivoire","Benin","Togo"];
  const SOV = ["Russia","Belarus","Ukraine","Kazakhstan","Uzbekistan","Turkmenistan","Kyrgyzstan","Tajikistan","Georgia","Armenia","Azerbaijan"];
  const DEC41 = ["Cuba","Dominican Rep.","Haiti","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Guatemala"];

  window.ARCHIVUS_WARS = window.ARCHIVUS_WARS || {};
  window.ARCHIVUS_WARS.ww2 = {
    id: "ww2", name: "World War II", aka: "The Second World War", numeral: "II",
    start: "1937-06-15", end: "1945-10-01", warStart: "1939-09-01", warEnd: "1945-09-02",
    blurb: "Two wars — Japan's in Asia from 1937, Germany's in Europe from 1939 — merge into one in 1941. Before it ends in Tokyo Bay it kills some 60 million people or more, two-thirds of them civilians, and leaves two superpowers standing over the ruins.",
    wrap: -30,
    sides: {
      A: { name: "The Allies", short: "Allies", color: "#4f8fd6" },
      B: { name: "The Axis", short: "Axis", color: "#d2452f" }
    },
    status: {
      A:  ["Allied power — at war", "A", "s-A"],
      a:  ["Allied empire, dominion or colony", "A", "s-a"],
      oA: ["Under Allied occupation", "A", "s-oA"],
      S:  ["Soviet Union under the Nazi–Soviet Pact (1939–41)", null, "s-S"],
      X:  ["Axis power — at war", "B", "s-B"],
      xn: ["Axis-aligned, not yet at war", "B", "s-bn"],
      x:  ["Axis colony or annexed land", "B", "s-b"],
      oX: ["Axis-occupied or puppet state", "B", "s-oB"],
      V:  ["Vichy French empire", "B", "s-V"],
      K:  ["Divided — the front runs through it", null, "s-K"],
      N:  ["Neutral", null, "s-N"]
    },
    legend: ["A", "a", "oA", "S", "X", "xn", "x", "oX", "V", "K", "N"],
    mapNote: "Drawn on today's borders. Fronts, occupation zones and the Japanese perimeter are schematic — traced at key dates and interpolated. Bypassed Japanese garrisons (Rabaul, Truk, Wewak) are not shown after they were cut off.",

    alias: {
      "Russia": "Soviet Union (Russia)", "Ukraine": "Soviet Union (Ukraine)", "Belarus": "Soviet Union (Belorussia)", "Kazakhstan": "Soviet Union (Kazakhstan)",
      "Czechia": "Bohemia & Moravia (Czech lands)", "Myanmar": "Burma", "Indonesia": "Dutch East Indies", "Sri Lanka": "Ceylon", "Taiwan": "Formosa (Japanese)",
      "Dem. Rep. Congo": "Belgian Congo", "North Korea": "Korea (Japanese)", "South Korea": "Korea (Japanese)", "Malaysia": "Malaya & British Borneo", "Papua New Guinea": "New Guinea & Papua",
      "Ethiopia": "Ethiopia (Italian East Africa 1936–41)", "Israel": "Palestine (British Mandate)", "Palestine": "Palestine (British Mandate)", "Jordan": "Transjordan",
      "Serbia": "Yugoslavia (Serbia)", "Croatia": "Yugoslavia → 'Independent State of Croatia'", "Bosnia and Herz.": "Yugoslavia (Bosnia)", "Slovenia": "Yugoslavia (Slovenia)",
      "Macedonia": "Yugoslavia (Macedonia)", "Montenegro": "Yugoslavia (Montenegro)", "Kosovo": "Yugoslavia (Kosovo)", "Vietnam": "French Indochina (Vietnam)",
      "Laos": "French Indochina (Laos)", "Cambodia": "French Indochina (Cambodia)", "Thailand": "Thailand (Siam)", "Iran": "Iran (Persia)", "Libya": "Italian Libya",
      "Eritrea": "Italian Eritrea", "Somalia": "Italian Somaliland", "Somaliland": "British Somaliland", "Namibia": "South West Africa", "Tanzania": "Tanganyika",
      "Moldova": "Bessarabia (Romania → USSR 1940)", "Timor-Leste": "Portuguese Timor", "Philippines": "Philippines (U.S. Commonwealth)", "United States of America": "United States"
    },

    countries: [
      [[["1937-01-01","xn","Rome–Berlin Axis (1936); rearming, not yet at war"],["1939-09-01","X","Invades Poland"],["1945-05-08","oA","Unconditional surrender; four-power occupation"]], "Germany"],
      [[["1938-03-12","x","Anschluss — annexed into the Reich"],["1939-09-01","X","Part of Greater Germany"],["1945-04-13","oA","Vienna falls to the Red Army"]], "Austria"],
      [[["1937-01-01","xn","Rome–Berlin Axis; Pact of Steel May 1939"],["1940-06-10","X","Declares war on France and Britain"],["1943-09-08","K","Armistice with the Allies — Germany occupies the north, the king's government joins the Allies"],["1945-05-02","A","German forces in Italy surrender"]], "Italy"],
      [[["1937-07-07","X","Open war with China after the Marco Polo Bridge incident; Tripartite Pact Sept 1940"],["1945-09-02","oA","Surrender signed aboard USS Missouri"]], "Japan"],
      [[["1937-01-01","x","Japanese colony"],["1945-09-02","oA","Occupied by the USSR (north) and the United States (south)"]], "North Korea", "South Korea"],
      [[["1937-01-01","x","Japanese colony since 1895"],["1945-09-02","A","Handed to China"]], "Taiwan"],
      [[["1937-07-07","A","Fighting Japan from July 1937 — the coast and north are occupied (see the perimeter)"]], "China"],
      [[["1939-03-15","oX","German troops enter Prague — the Protectorate of Bohemia and Moravia"],["1945-05-09","A","Prague liberated"]], "Czechia"],
      [[["1939-03-14","xn","A German client state under Tiso"],["1939-09-01","X","Joins the invasion of Poland"],["1945-04-04","A","Bratislava liberated by the Red Army"]], "Slovakia"],
      [[["1939-09-01","A","Invaded by Germany (1 Sep) and the USSR (17 Sep)"],["1939-10-06","oX","Fourth partition: Germany takes the west, the USSR the east until 1941"],["1944-07-22","K","The Red Army crosses the Bug"],["1945-02-01","A","Liberated — under a Soviet-backed government"]], "Poland"],
      [[["1940-04-09","oX","Occupied in six hours"],["1945-05-05","A","Liberated"]], "Denmark"],
      [[["1940-04-09","A","Invaded by Germany"],["1940-06-10","oX","Capitulates; king and government fight on from London"],["1945-05-08","A","German garrison surrenders"]], "Norway"],
      [[["1940-05-10","A","Invaded"],["1940-05-15","oX","Capitulates after the bombing of Rotterdam"],["1944-09-14","K","The south is liberated; the north starves through the 'Hunger Winter'"],["1945-05-05","A","Liberated"]], "Netherlands"],
      [[["1940-05-10","A","Invaded"],["1940-05-28","oX","King Leopold III surrenders the army"],["1944-09-04","A","Liberated"]], "Belgium"],
      [[["1940-05-10","oX","Occupied, later annexed to the Reich"],["1944-09-10","A","Liberated"]], "Luxembourg"],
      [[["1939-09-03","A","Declares war on Germany"],["1940-06-22","oX","Armistice — the north occupied, the south under Vichy; all of France occupied from Nov 1942"],["1944-08-25","A","Paris liberated; de Gaulle's provisional government takes over"]], "France"],
      [[["1939-09-03","A","Declares war on Germany"]], "United Kingdom", "Australia", "New Zealand"],
      [[["1939-09-06","A","Declares war on Germany"]], "South Africa"],
      [[["1939-09-10","A","Declares war on Germany"]], "Canada"],
      [[["1939-09-03","a","British Empire at war — 2.5 million Indians volunteer, the largest volunteer army in history"]]].concat(BRITE),
      [[["1939-09-03","a","British colony"],["1940-08-19","oX","Overrun by Italy from Ethiopia"],["1941-03-16","a","Retaken"]], "Somaliland"],
      [[["1939-08-23","S","Molotov–Ribbentrop Pact: the USSR is Germany's partner in dividing Eastern Europe"],["1941-06-22","A","Invaded by Germany — Operation Barbarossa (see the front for the occupied zone)"]]].concat(SOV),
      [[["1940-06-15","S","Occupied and annexed by the USSR under the Pact"],["1941-06-22","A","Soviet republics at war; German-occupied 1941–44 (see the front), then Soviet again"]], "Estonia", "Latvia", "Lithuania"],
      [[["1940-06-28","S","Bessarabia ceded to the USSR under Soviet ultimatum"],["1941-06-22","A","Soviet republic; retaken by Romania 1941–44 (see the front)"]], "Moldova"],
      [[["1941-06-25","X","'Co-belligerent' with Germany against the USSR — the Continuation War. (Finland had fought the USSR alone in the Winter War, Nov 1939 – Mar 1940.)"],["1944-09-19","A","Armistice with Moscow; Finland turns on the German troops in Lapland"]], "Finland"],
      [[["1940-11-20","xn","Signs the Tripartite Pact"],["1941-04-11","X","Joins the invasion of Yugoslavia, then of the USSR"],["1945-04-04","oA","Last German forces driven out by the Red Army"]], "Hungary"],
      [[["1940-11-23","xn","Signs the Tripartite Pact under Antonescu"],["1941-06-22","X","Invades the USSR alongside Germany"],["1944-08-23","A","King Michael's coup — Romania changes sides"]], "Romania"],
      [[["1941-03-01","X","Signs the Tripartite Pact; occupies parts of Greece and Yugoslavia but never fights the USSR"],["1944-09-09","A","Coup as the Red Army arrives — Bulgaria changes sides"]], "Bulgaria"],
      [[["1941-04-17","oX","Yugoslavia dismembered after an eleven-day campaign"],["1944-10-20","A","Belgrade liberated by Tito's Partisans and the Red Army"]], "Serbia", "Kosovo", "Macedonia", "Montenegro"],
      [[["1941-04-10","oX","The Ustaše puppet 'Independent State of Croatia'"],["1945-05-08","A","Liberated by the Partisans"]], "Croatia", "Bosnia and Herz.", "Slovenia"],
      [[["1939-04-07","oX","Invaded and annexed by Italy"],["1944-11-29","A","Liberated by Albanian partisans"]], "Albania"],
      [[["1940-10-28","A","Rejects Mussolini's ultimatum — 'Ohi' — and throws the Italians back"],["1941-04-30","oX","Overrun by Germany; occupied by Germany, Italy and Bulgaria"],["1944-10-14","A","Athens liberated"]], "Greece"],
      [[["1940-05-10","oA","Occupied by Britain, then garrisoned by the United States, to forestall Germany"]], "Iceland"],
      [[["1941-04-09","oA","Under U.S. protection after Denmark's occupation"]], "Greenland"],
      [[["1945-02-23","A","Declares war on Germany to qualify for the United Nations"]], "Turkey"],
      [[["1937-01-01","xn","Italian colony"],["1940-06-10","X","Base for the invasion of Egypt"],["1943-02-04","oA","The Eighth Army clears Libya"]], "Libya"],
      [[["1939-09-03","a","French protectorate"],["1940-06-22","V","Loyal to Vichy"],["1942-11-09","oX","German and Italian troops fly in after Operation Torch"],["1943-05-13","oA","Axis forces in Africa surrender — 250,000 prisoners"]], "Tunisia"],
      [[["1939-09-03","a","French North Africa"],["1940-06-22","V","Loyal to Vichy"],["1942-11-11","a","Operation Torch — joins the Allies"]], "Algeria", "Morocco"],
      [[["1939-09-03","a","French West Africa"],["1940-06-22","V","Loyal to Vichy; repels de Gaulle at Dakar"],["1942-11-23","a","Rallies to the Allies after Torch"]]].concat(AOF),
      [[["1939-09-03","a","French Equatorial Africa"],["1940-06-22","V","Briefly under Vichy"],["1940-08-28","a","Rallies to de Gaulle — Free France's first territory"]], "Chad", "Congo", "Central African Rep.", "Cameroon"],
      [[["1939-09-03","a","French Equatorial Africa"],["1940-06-22","V","Under Vichy"],["1940-11-12","a","Taken by the Free French"]], "Gabon"],
      [[["1939-09-03","a","French colony"],["1940-06-22","V","Loyal to Vichy"],["1942-11-06","oA","Taken by Britain to deny it to Japan"]], "Madagascar"],
      [[["1939-09-03","a","French mandate"],["1940-06-22","V","Loyal to Vichy"],["1941-07-14","oA","Taken by British and Free French forces"]], "Syria", "Lebanon"],
      [[["1939-09-03","a","French Somaliland"],["1940-06-22","V","Loyal to Vichy"],["1942-12-28","a","Rallies to the Free French"]], "Djibouti"],
      [[["1939-09-03","a","French Pacific — rallies to de Gaulle in Sept 1940"]], "New Caledonia", "Fr. S. Antarctic Lands"],
      [[["1937-01-01","oX","Conquered by Italy in 1936"],["1941-05-05","A","Haile Selassie re-enters Addis Ababa — the first country freed from the Axis"]], "Ethiopia"],
      [[["1937-01-01","x","Italian colony"],["1941-04-08","oA","Taken by British Commonwealth forces"]], "Eritrea"],
      [[["1937-01-01","x","Italian colony"],["1941-02-25","oA","Mogadishu falls to British African troops"]], "Somalia"],
      [[["1941-05-31","oA","British troops overthrow the pro-Axis Rashid Ali government"],["1943-01-17","A","Declares war on the Axis"]], "Iraq"],
      [[["1941-08-25","oA","Anglo-Soviet invasion secures the oilfields and the supply route to Russia"],["1943-09-09","A","Declares war on Germany"]], "Iran"],
      [[["1940-05-10","a","Belgian Congo — its uranium will go into the Manhattan Project"]], "Dem. Rep. Congo", "Rwanda", "Burundi"],
      [[["1944-01-27","A","Declares war on Germany and Japan"]], "Liberia"],
      [[["1945-08-10","A","Mongolian troops join the Soviet invasion of Manchuria"]], "Mongolia"],
      [[["1939-09-03","a","French Indochina"],["1940-06-22","V","Under Vichy"],["1940-09-22","oX","Japanese troops move in; fully garrisoned July 1941"],["1945-09-02","K","Japan surrenders; Ho Chi Minh declares Vietnamese independence the same day"]], "Vietnam", "Laos", "Cambodia"],
      [[["1941-12-21","X","Invaded on 8 Dec, signs an alliance with Japan and declares war on Britain and the U.S."],["1945-08-16","N","Renounces the declaration of war"]], "Thailand"],
      [[["1939-09-03","a","British Burma"],["1942-05-20","oX","Japan completes the conquest of Burma"],["1945-05-03","a","Rangoon retaken"]], "Myanmar"],
      [[["1939-09-03","a","British Malaya and Borneo"],["1942-02-15","oX","Singapore surrenders — 80,000 prisoners, Britain's worst capitulation"],["1945-09-12","a","Japanese forces in South-East Asia surrender at Singapore"]], "Malaysia", "Brunei"],
      [[["1940-05-10","a","Dutch East Indies under the government-in-exile"],["1942-03-09","oX","Java surrenders; Japan gains the oil it went to war for"],["1945-08-17","K","Sukarno declares independence two days after Japan's surrender"]], "Indonesia"],
      [[["1941-12-08","a","U.S. Commonwealth — attacked hours after Pearl Harbor"],["1942-05-06","oX","Corregidor surrenders"],["1944-10-20","K","MacArthur returns at Leyte"],["1945-07-05","A","Liberation declared"]], "Philippines"],
      [[["1939-09-03","a","Australian territory"],["1942-01-23","K","Japan takes Rabaul and the north coast; the Kokoda Track becomes a front line"],["1945-09-06","a","Japanese forces surrender"]], "Papua New Guinea"],
      [[["1939-09-03","a","British protectorate"],["1942-05-03","oX","Japan lands at Tulagi"],["1943-11-01","a","The Allies clear the central Solomons"]], "Solomon Is."],
      [[["1942-02-20","oX","Japan occupies neutral Portuguese Timor"],["1945-09-11","N","Japanese surrender"]], "Timor-Leste"],
      [[["1941-12-08","A","Attacked at Pearl Harbor on 7 Dec; Germany and Italy declare war on 11 Dec"]], "United States of America", "Puerto Rico"],
      [[["1941-12-09","A","Declare war within days of Pearl Harbor"]]].concat(DEC41),
      [[["1942-05-22","A","Declares war after U-boats sink Mexican tankers"]], "Mexico"],
      [[["1942-08-22","A","Declares war — a Brazilian division fights in Italy"]], "Brazil"],
      [[["1943-04-07","A","Declares war"]], "Bolivia"],
      [[["1943-11-26","A","Declares war on Germany"]], "Colombia"],
      [[["1945-02-02","A","Declares war"]], "Ecuador"],
      [[["1945-02-07","A","Declares war"]], "Paraguay"],
      [[["1945-02-12","A","Declares war"]], "Peru"],
      [[["1945-02-15","A","Declares war"]], "Uruguay", "Venezuela"],
      [[["1945-03-27","A","Declares war — the last to do so"]], "Argentina"],
      [[["1945-04-11","A","Declares war on Japan"]], "Chile"],
      [[["1945-03-01","A","Declares war"]], "Saudi Arabia"],
      [[["1940-05-10","a","Dutch colony under the government-in-exile"]], "Suriname"]
    ],

    powers: [
      { id: "uk", n: "United Kingdom & Empire", side: "A", major: 1, seg: [["1939-09-03",null,"A","Guarantee to Poland"]], mil: 383600, tot: 450700,
        note: "The only power to fight Germany from the first day to the last. Alone with its empire from June 1940 to June 1941." },
      { id: "su", n: "Soviet Union", side: "A", major: 1, seg: [["1939-08-23","1941-06-22","S","Nazi–Soviet Pact: invades Poland, Finland, the Baltic states"],["1941-06-22",null,"A","Invaded"]], mil: [8800000, 10700000], tot: 24000000,
        note: "Hitler's partner for 22 months, then his destroyer. The Red Army inflicts roughly three-quarters of all German military losses, at a cost of some 24 million Soviet lives." },
      { id: "us", n: "United States", side: "A", major: 1, seg: [["1939-09-05","1941-12-08","N","officially — but 'the arsenal of democracy' from Lend-Lease, March 1941"],["1941-12-08",null,"A","Pearl Harbor"]], mil: 416800, tot: 418500,
        note: "Out-produces all the Axis powers combined, fights two oceanic wars at once, and ends the war as the only nuclear power." },
      { id: "cn", n: "China", side: "A", major: 1, seg: [["1937-07-07",null,"A","Marco Polo Bridge"]], mil: [3000000, 4000000], tot: 20000000,
        note: "Fights Japan longer than anyone — four years alone — and ties down more than a million Japanese troops to the end." },
      { id: "fr", n: "France", side: "A", major: 1, seg: [["1939-09-03","1940-06-22","A","Guarantee to Poland"],["1940-06-22","1944-08-25","oB","Armistice: occupation and Vichy. De Gaulle's Free French fight on"],["1944-08-25",null,"A","Liberated"]], mil: 217600, tot: 567600,
        note: "Beaten in six weeks in 1940. Splits into Pétain's collaborating Vichy state and de Gaulle's Free France, which ends the war with an army of a million and a seat among the victors." },
      { id: "pl", n: "Poland", side: "A", seg: [["1939-09-01","1939-10-06","A","Invaded"],["1939-10-06",null,"oB","Occupied — government-in-exile and Home Army fight on"]], mil: 240000, tot: 5600000,
        note: "The first to fight. Never surrenders: Poles break Enigma, fly in the Battle of Britain, take Monte Cassino and rise in Warsaw. Loses about a sixth of its people — half of them Polish Jews." },
      { id: "cw", n: "Canada · Australia · New Zealand · South Africa · India", side: "A", seg: [["1939-09-03",null,"A","With Britain from the first week"]], mil: 196000, tot: null,
        note: "The dominions and India supply a third of the Empire's fighting strength — from the Atlantic convoys to El Alamein, Kokoda and Burma. (Military deaths: Canada 45,400 · Australia 39,800 · New Zealand 11,900 · South Africa 11,900 · India 87,000.)" },
      { id: "yu", n: "Yugoslavia", side: "A", seg: [["1941-03-25","1941-03-27","bn","Regent signs the Tripartite Pact — overthrown in two days"],["1941-04-06","1941-04-17","A","Invaded"],["1941-04-17",null,"oB","Dismembered — Tito's Partisans fight on"]], mil: 446000, tot: 1000000,
        note: "Occupied Europe's most effective resistance — and a three-cornered civil war between Partisans, royalist Chetniks and the Croatian Ustaše." },
      { id: "gr", n: "Greece", side: "A", seg: [["1940-10-28","1941-04-30","A","'Ohi'"],["1941-04-30","1944-10-14","oB","Occupied"],["1944-10-14",null,"A","Liberated"]], mil: [20000, 35000], tot: [300000, 800000],
        note: "Humiliates Mussolini in 1940, forcing Hitler to intervene. Famine under occupation kills hundreds of thousands." },
      { id: "lowc", n: "Norway · Netherlands · Belgium", side: "A", seg: [["1940-04-09","1940-06-10","A","Invaded April–May 1940"],["1940-06-10",null,"oB","Occupied; governments-in-exile in London"]], mil: 32100, tot: 396600,
        note: "Overrun in the spring of 1940. Their merchant fleets, colonies and exiled forces fight on." },
      { id: "de", n: "Germany", side: "B", major: 1, seg: [["1937-01-01","1939-09-01","bn","Rearmament, Anschluss, Munich"],["1939-09-01","1945-05-08","B","Invades Poland"],["1945-05-08",null,"D","Unconditional surrender"]], mil: 5533000, tot: [6600000, 8800000],
        note: "Conquers Europe from the Atlantic to the Volga in three years and murders six million Jews. Fights to total destruction." },
      { id: "jp", n: "Japan", side: "B", major: 1, seg: [["1937-07-07","1945-09-02","B","War in China; Tripartite Pact Sept 1940; Pearl Harbor Dec 1941"],["1945-09-02",null,"D","Surrender"]], mil: 2120000, tot: [2600000, 3100000],
        note: "Seeks an Asian empire to end its dependence on Western oil and steel. Overruns a seventh of the globe in six months." },
      { id: "it", n: "Italy", side: "B", major: 1, seg: [["1937-01-01","1940-06-10","bn","'Non-belligerent' despite the Pact of Steel"],["1940-06-10","1943-09-08","B","Enters as France falls"],["1943-09-08","1943-10-13","K","Armistice — Germany seizes the north and props up Mussolini's rump republic"],["1943-10-13",null,"A","The king's government declares war on Germany: 'co-belligerent'"]], mil: 301400, tot: 457000,
        note: "The Axis's founding partner and its weakest. Fights the last twenty months on both sides at once." },
      { id: "hu", n: "Hungary", side: "B", seg: [["1940-11-20","1941-04-11","bn","Tripartite Pact"],["1941-04-11","1945-04-04","B","Yugoslavia, then the USSR"],["1945-04-04",null,"D","Overrun"]], mil: 300000, tot: 580000,
        note: "Joins to recover the lands lost in 1920. Occupied by its own ally in March 1944 when Horthy tries to get out; 565,000 Hungarian Jews are murdered." },
      { id: "ro", n: "Romania", side: "B", seg: [["1940-11-23","1941-06-22","bn","Tripartite Pact"],["1941-06-22","1944-08-23","B","Invades the USSR"],["1944-08-23",null,"A","Changes sides"]], mil: 300000, tot: 833000,
        note: "Germany's main source of oil and the third-largest Axis army in Europe; its armies break at Stalingrad. Ends the war fighting for the Allies." },
      { id: "bg", n: "Bulgaria", side: "B", seg: [["1941-03-01","1944-09-09","B","Tripartite Pact"],["1944-09-09",null,"A","Changes sides"]], mil: 22000, tot: 25000,
        note: "Takes Macedonia and Thrace but refuses to fight the USSR or to deport the Jews of Bulgaria proper." },
      { id: "fi", n: "Finland", side: "B", seg: [["1939-11-30","1940-03-13","K","Winter War — attacked by the USSR, fights alone"],["1941-06-25","1944-09-19","B","Co-belligerent, never signs the Pact"],["1944-09-19",null,"A","Armistice; fights the Germans in Lapland"]], mil: 95000, tot: 97000,
        note: "A democracy fighting beside Hitler to recover what Stalin took in 1940. Never joins the siege of Leningrad proper; never occupied by anyone." },
      { id: "sk", n: "Slovakia · Croatia", side: "B", seg: [["1939-09-01","1945-05-08","B","Client states created by Germany (1939, 1941)"]], mil: null, tot: null,
        note: "Puppet states carved out of Czechoslovakia and Yugoslavia. Croatia's Ustaše regime runs its own death camps." },
      { id: "th", n: "Thailand", side: "B", seg: [["1941-12-21","1945-08-16","B","Alliance with Japan after a one-day invasion"],["1945-08-16",null,"N","Declaration of war renounced"]], mil: null, tot: null,
        note: "Asia's only independent Axis ally; its ambassador in Washington refuses to deliver the declaration of war." }
    ],

    phases: [
      { n: "The road to war", s: "1937-07-07", e: "1939-09-01", d: "Japan plunges into China and takes Shanghai and Nanjing with terrible slaughter. In Europe, Hitler absorbs Austria, is handed the Sudetenland at Munich, and swallows the rest of the Czech lands six months later. Britain and France guarantee Poland. On 23 August 1939 the unthinkable: Hitler and Stalin sign a pact, with a secret protocol dividing Eastern Europe between them." },
      { n: "Blitzkrieg — the Axis ascendant", s: "1939-09-01", e: "1941-06-22", d: "Poland falls in five weeks to Germany and the USSR. After the 'Phoney War', Hitler takes Denmark, Norway, the Low Countries and — in six astonishing weeks — France. Britain fights on alone; the RAF wins the Battle of Britain. Italy's failures drag Germany into the Balkans and North Africa. By the spring of 1941 Hitler is master of the continent." },
      { n: "The war becomes global", s: "1941-06-22", e: "1942-06-04", d: "Three million men invade the Soviet Union in history's largest military operation and are stopped at the gates of Moscow. On 7 December Japan attacks Pearl Harbor; four days later Hitler declares war on the United States. Japan overruns Malaya, Singapore, the Philippines, the Dutch East Indies and Burma in six months. The Holocaust moves from shooting pits to gas chambers." },
      { n: "The turn of the tide", s: "1942-06-04", e: "1943-02-02", d: "'Before Alamein we never had a victory; after Alamein we never had a defeat.' At Midway, Japan loses four carriers in a day. At El Alamein, Rommel is broken. At Stalingrad, an entire German army is encircled and destroyed. In eight months, in three theatres, the Axis advance ends for good." },
      { n: "The Allies take the initiative", s: "1943-02-02", e: "1944-06-06", d: "Kursk ends Germany's ability to attack in the east. The Allies clear Africa, invade Sicily and Italy — Mussolini falls — and win the Battle of the Atlantic. Bombers burn Hamburg. In the Pacific the island-hopping begins at Tarawa. At Tehran, the Big Three meet for the first time and agree on a second front in France." },
      { n: "Closing the ring", s: "1944-06-06", e: "1945-01-12", d: "D-Day puts the Western Allies ashore in Normandy; two weeks later Operation Bagration tears the heart out of the German army in the east. Paris is freed, Warsaw rises and is destroyed, Romania and Bulgaria change sides. The U.S. Navy smashes Japan's fleet at Leyte Gulf. Hitler's last gamble in the Ardennes fails." },
      { n: "Endgame", s: "1945-01-12", e: "1945-09-02", d: "The Red Army storms from the Vistula to the Oder in three weeks and liberates Auschwitz. The Big Three divide the post-war world at Yalta. Hitler kills himself in the ruins of Berlin; Germany surrenders on 8 May. Japan fights on through Iwo Jima, Okinawa and the firebombing of its cities until two atomic bombs and a Soviet declaration of war end it." }
    ],

    items: [
      { id: "marcopolo", n: "Marco Polo Bridge incident", s: "1937-07-07", at: [39.85,116.21], k: "battle", ref: "sinojapanese", d: "A night skirmish outside Beijing becomes a full-scale Japanese invasion of China. For many historians, the Second World War begins here.", u: W + "Marco_Polo_Bridge_incident" },
      { id: "shanghai1937", n: "Battle of Shanghai", s: "1937-08-13", e: "1937-11-26", at: [31.23,121.47], k: "battle", w: "B", d: "Chiang Kai-shek commits his best German-trained divisions to three months of street fighting — 'Stalingrad on the Yangtze' — and loses most of them.", f: "c. 250,000 Chinese casualties", u: W + "Battle_of_Shanghai" },
      { id: "nanjing", n: "The Nanjing Massacre", s: "1937-12-13", e: "1938-01-31", at: [32.06,118.8], k: "atrocity", d: "After the Chinese capital falls, Japanese troops murder prisoners and civilians and rape on a vast scale for six weeks. The post-war Tokyo tribunal estimated over 200,000 killed; China's official figure is 300,000.", f: "Estimates: 200,000–300,000 killed", u: W + "Nanjing_Massacre", ar: [7, "war", "East Asia", "Japan", ["sinojapanese", "ww2"]] },
      { id: "anschluss", n: "The Anschluss", s: "1938-03-12", at: [48.21,16.37], k: "diplo", d: "German troops cross into Austria unopposed; Hitler announces its annexation from a balcony in Vienna, the city where he once slept in a homeless shelter.", u: W + "Anschluss", ar: [6, "empire", "Europe", "Nazi Germany", ["hitler33", "munich"]] },
      { id: "munich", n: "The Munich Agreement", s: "1938-09-30", at: [48.14,11.58], k: "diplo", d: "Britain and France hand Hitler the Sudetenland without consulting the Czechs. Chamberlain returns with 'peace for our time'. It lasts eleven months.", u: W + "Munich_Agreement", ar: [7, "law", "Europe", null, ["hitler33", "anschluss", "nazisovietpact", "ww2"]] },
      { id: "khalkhingol", n: "Khalkhin Gol", s: "1939-05-11", e: "1939-09-16", at: [47.73,118.6], k: "battle", w: "A", d: "Zhukov crushes a Japanese army on the Mongolian border. Japan decides to strike south against the Western empires rather than north — a choice that saves Moscow in 1941.", u: W + "Battles_of_Khalkhin_Gol" },
      { id: "nazisovietpact", n: "The Nazi–Soviet Pact", s: "1939-08-23", at: [55.75,37.62], k: "diplo", d: "Ribbentrop and Molotov sign a non-aggression treaty in the Kremlin while Stalin toasts Hitler's health. A secret protocol splits Poland, the Baltic states and Bessarabia between them. Hitler has his free hand.", u: W + "Molotov%E2%80%93Ribbentrop_Pact", ar: [8, "law", "Europe", null, ["munich", "poland1939", "barbarossa", "ww2"]] },
      { id: "poland1939", n: "Invasion of Poland", s: "1939-09-01", e: "1939-10-06", at: [52.23,21.01], k: "battle", w: "B", d: "Germany attacks at dawn; Britain and France declare war on 3 September but do not move. On the 17th the Red Army invades from the east. Warsaw falls on the 28th.", f: "c. 66,000 Polish soldiers killed · 5 weeks", u: W + "Invasion_of_Poland", ar: [8, "war", "Europe", "Poland", ["ww2", "nazisovietpact", "falloffrance"]] },
      { id: "winterwar", n: "The Winter War", s: "1939-11-30", e: "1940-03-13", at: [61.0,29.6], k: "battle", w: "—", d: "Stalin attacks Finland expecting a parade. Ski troops and 'Molotov cocktails' inflict staggering losses before weight of numbers tells. Hitler concludes the Red Army is rotten.", f: "Soviet dead: over 125,000 · Finnish: c. 25,000", u: W + "Winter_War", ar: [5, "war", "Europe", "Finland", ["nazisovietpact", "barbarossa"]] },
      { id: "norway1940", n: "Invasion of Norway", s: "1940-04-09", e: "1940-06-10", at: [68.43,17.43], k: "battle", w: "B", d: "Germany seizes Denmark in a morning and Norway's ports in a day to secure Swedish iron ore. The Allied fiasco at Narvik brings down Chamberlain.", u: W + "Norwegian_campaign" },
      { id: "falloffrance", n: "The Fall of France", s: "1940-05-10", e: "1940-06-25", at: [49.7,4.94], k: "battle", w: "B", d: "Panzer divisions cross the 'impassable' Ardennes, break through at Sedan and reach the Channel in ten days, cutting the Allied armies in two. Paris falls on 14 June. France signs the armistice in the railway carriage of 1918.", f: "6 weeks · 1.8 million French prisoners", u: W + "Battle_of_France", ar: [8, "war", "Europe", "France", ["ww2", "poland1939", "dunkirk", "armistice1918"]] },
      { id: "dunkirk", n: "The Dunkirk evacuation", s: "1940-05-26", e: "1940-06-04", at: [51.04,2.38], k: "naval", w: "A", d: "Some 800 vessels — destroyers, ferries, fishing boats — lift a trapped army off the beaches. Britain loses its equipment and keeps its soldiers. Churchill: 'We shall never surrender.'", f: "338,226 troops rescued", u: W + "Dunkirk_evacuation", ar: [7, "war", "Europe", "Britain", ["falloffrance", "battleofbritain"]] },
      { id: "battleofbritain", n: "The Battle of Britain", s: "1940-07-10", e: "1940-10-31", at: [51.25,0.6], k: "air", w: "A", d: "The first campaign fought entirely in the air. Radar, the Spitfire and Hurricane, and nearly 3,000 aircrew — a fifth of them from outside Britain — deny the Luftwaffe control of the skies. Hitler postpones the invasion and turns east.", f: "Luftwaffe loses c. 1,900 aircraft · RAF c. 1,000 fighters", u: W + "Battle_of_Britain", ar: [8, "war", "Europe", "Britain", ["dunkirk", "turing", "barbarossa"]] },
      { id: "tripartite", n: "The Tripartite Pact", s: "1940-09-27", at: [52.52,13.4], k: "diplo", d: "Germany, Italy and Japan pledge to aid each other if attacked by a power not yet in the war — a warning aimed at the United States. This is the Axis.", u: W + "Tripartite_Pact", ar: [6, "law", "Europe", null, ["ww2", "pearlharbor", "sinojapanese"]] },
      { id: "compass", n: "Operation Compass", s: "1940-12-09", e: "1941-02-09", at: [31.2,20.3], k: "battle", w: "A", d: "A five-day raid by 36,000 British and Commonwealth troops turns into the destruction of an Italian army four times their size. Hitler sends Rommel to Africa.", f: "c. 130,000 Italians captured", u: W + "Operation_Compass" },
      { id: "lendlease", n: "Lend-Lease", s: "1941-03-11", at: [38.9,-77.04], k: "diplo", d: "Neutral America becomes 'the arsenal of democracy': $50 billion of arms, trucks and food for Britain, then the USSR and China, with payment deferred. Roosevelt compares it to lending a neighbour a garden hose when his house is on fire.", u: W + "Lend-Lease", ar: [6, "trade", "North America", "United States", ["battleofbritain", "pearlharbor", "marshall"]] },
      { id: "balkans1941", n: "Invasion of Yugoslavia and Greece", s: "1941-04-06", e: "1941-06-01", at: [44.8,20.47], k: "battle", w: "B", d: "After a coup in Belgrade tears up Yugoslavia's adhesion to the Axis, Hitler destroys the country in eleven days, overruns Greece, and takes Crete from the air.", u: W + "Balkans_campaign_(World_War_II)" },
      { id: "barbarossa", n: "Operation Barbarossa", s: "1941-06-22", e: "1941-12-05", at: [52.1,23.7], k: "battle", w: "—", d: "The largest invasion in history: over three million Axis soldiers on a 2,900 km front. Stalin ignores some eighty warnings. In six months the Red Army loses more than four million men — and does not collapse. Behind the front, Einsatzgruppen begin shooting Jews by the hundreds of thousands.", f: "3 million+ Axis troops · a war of annihilation", u: W + "Operation_Barbarossa", ar: [9, "war", "Europe", "Soviet Union", ["ww2", "nazisovietpact", "leningrad", "moscow1941", "stalingrad", "holocaust"]] },
      { id: "leningrad", n: "Siege of Leningrad", s: "1941-09-08", e: "1944-01-27", at: [59.94,30.31], k: "siege", w: "A", d: "For 872 days the city is cut off except across the ice of Lake Ladoga. Hitler orders it starved out of existence. It holds.", f: "c. 800,000–1,000,000 civilians dead, mostly of hunger", u: W + "Siege_of_Leningrad", ar: [7, "war", "Europe", "Soviet Union", ["barbarossa", "stalingrad"]] },
      { id: "babiyar", n: "Babi Yar", s: "1941-09-29", e: "1941-09-30", at: [50.47,30.45], k: "atrocity", ref: "holocaust", d: "In two days, an SS Einsatzgruppe and police battalions shoot 33,771 Jews of Kiev in a ravine on the edge of the city — one massacre among thousands in the 'Holocaust by bullets'.", f: "33,771 murdered in two days", u: W + "Babi_Yar" },
      { id: "moscow1941", n: "Battle of Moscow", s: "1941-10-02", e: "1942-01-07", at: [55.75,37.62], k: "battle", w: "A", d: "German patrols see the Kremlin's towers through field-glasses. Then the mud, the cold, and Zhukov's Siberian divisions — released because a spy in Tokyo reports Japan will strike south. Blitzkrieg has failed.", f: "c. 1 million Soviet casualties", u: W + "Battle_of_Moscow", ar: [7, "war", "Europe", "Soviet Union", ["barbarossa", "stalingrad"]] },
      { id: "pearlharbor", n: "Attack on Pearl Harbor", s: "1941-12-07", at: [21.37,-157.95], k: "air", w: "B", d: "353 aircraft from six carriers strike the U.S. Pacific Fleet at anchor on a Sunday morning. Eight battleships are hit — but the American carriers are at sea, and the fuel tanks and dockyards survive. 'A date which will live in infamy.'", f: "2,403 Americans killed", u: W + "Attack_on_Pearl_Harbor", ar: [9, "war", "Oceania", "United States", ["ww2", "tripartite", "midway", "bomb"]] },
      { id: "wannsee", n: "The Wannsee Conference", s: "1942-01-20", at: [52.43,13.16], k: "atrocity", d: "Fifteen officials meet over lunch in a Berlin villa to coordinate the 'Final Solution of the Jewish Question' — the murder of all eleven million Jews of Europe. Eight of the fifteen hold doctorates.", u: "https://encyclopedia.ushmm.org/content/en/article/wannsee-conference-and-the-final-solution", ar: [7, "law", "Europe", "Nazi Germany", ["holocaust", "nuremberg"]] },
      { id: "singapore1942", n: "Fall of Singapore", s: "1942-02-08", e: "1942-02-15", at: [1.35,103.82], k: "battle", w: "B", d: "Yamashita's army, outnumbered more than two to one, comes down the Malay peninsula on bicycles and takes the 'Gibraltar of the East' from the landward side. European prestige in Asia never recovers.", f: "c. 80,000 British, Indian and Australian prisoners", u: W + "Fall_of_Singapore", ar: [6, "war", "Southeast Asia", "British Empire", ["pearlharbor", "indonesia", "indiaind"]] },
      { id: "bataan", n: "Bataan and Corregidor", s: "1942-01-07", e: "1942-05-06", at: [14.5,120.55], k: "siege", w: "B", d: "American and Filipino troops hold out for four months without relief. Thousands of the 76,000 who surrender on Bataan die on the forced march to captivity.", u: W + "Battle_of_Bataan" },
      { id: "coralsea", n: "Battle of the Coral Sea", s: "1942-05-04", e: "1942-05-08", at: [-15.0,155.5], k: "naval", w: "—", d: "The first sea battle in which the opposing ships never sight each other. Japan's advance on Port Moresby is turned back.", u: W + "Battle_of_the_Coral_Sea" },
      { id: "midway1942", n: "Battle of Midway", s: "1942-06-04", e: "1942-06-07", at: [28.2,-177.37], k: "naval", w: "A", ref: "midway", d: "Codebreakers tell Nimitz where and when. In five minutes, dive-bombers set three Japanese carriers ablaze; a fourth follows. Japan never regains the initiative.", f: "4 Japanese carriers sunk for 1 American", u: W + "Battle_of_Midway" },
      { id: "guadalcanal", n: "Guadalcanal campaign", s: "1942-08-07", e: "1943-02-09", at: [-9.45,160.0], k: "battle", w: "A", d: "The first American offensive: six months of jungle fighting and seven naval battles for one airstrip. So many ships go down that the strait is named Ironbottom Sound.", f: "c. 24,000 Japanese dead · 7,100 American", u: W + "Guadalcanal_campaign", ar: [6, "war", "Oceania", "United States", ["midway", "pearlharbor", "leytegulf"]] },
      { id: "stalingrad1942", n: "Battle of Stalingrad", s: "1942-08-23", e: "1943-02-02", at: [48.71,44.51], k: "battle", w: "A", ref: "stalingrad", d: "House by house, floor by floor. In November the Red Army's pincers close behind the city; Hitler forbids a breakout. Of some 300,000 men encircled, 91,000 surrender and about 6,000 ever see Germany again.", f: "c. 2 million casualties, both sides", u: W + "Battle_of_Stalingrad" },
      { id: "elalamein", n: "Second Battle of El Alamein", s: "1942-10-23", e: "1942-11-11", at: [30.83,28.95], k: "battle", w: "A", d: "Montgomery's Eighth Army grinds through Rommel's minefields sixty miles from Alexandria. The Axis never threatens Egypt or the oil of the Middle East again. Church bells ring in Britain for the first time since 1940.", f: "c. 30,000–50,000 Axis casualties and prisoners", u: W + "Second_Battle_of_El_Alamein", ar: [7, "war", "Africa", "British Empire", ["torch", "stalingrad", "ww2"]] },
      { id: "torch", n: "Operation Torch", s: "1942-11-08", e: "1942-11-16", at: [36.75,3.06], k: "battle", w: "A", d: "American and British forces land in Vichy-held Morocco and Algeria — the first great Allied amphibious operation, commanded by an unknown general named Eisenhower. Hitler occupies the rest of France.", u: W + "Operation_Torch", ar: [5, "war", "Africa", "United States", ["elalamein", "sicily1943"]] },
      { id: "casablanca", n: "Casablanca Conference", s: "1943-01-14", e: "1943-01-24", at: [33.57,-7.59], k: "diplo", d: "Roosevelt and Churchill agree on Sicily next and announce the demand for 'unconditional surrender'.", u: W + "Casablanca_Conference" },
      { id: "warsawghetto", n: "Warsaw Ghetto Uprising", s: "1943-04-19", e: "1943-05-16", at: [52.245,20.99], k: "atrocity", ref: "holocaust", d: "A few hundred young Jewish fighters with pistols and home-made grenades hold off the SS for four weeks rather than board the trains to Treblinka.", u: "https://encyclopedia.ushmm.org/content/en/article/warsaw-ghetto-uprising" },
      { id: "atlantic", n: "Battle of the Atlantic", s: "1939-09-03", e: "1945-05-08", at: [52.0,-24.0], k: "naval", w: "A", d: "The war's longest campaign and the one on which all the others depend. U-boat 'wolfpacks' hunt the convoys that feed and arm Britain; escorts, radar, long-range aircraft and broken Enigma ciphers defeat them in 'Black May' 1943. Three out of four U-boat men die.", f: "c. 3,500 merchant ships and 783 U-boats lost", u: W + "Battle_of_the_Atlantic", ar: [7, "war", "Europe", null, ["turing", "lendlease", "dday"]] },
      { id: "kursk", n: "Battle of Kursk", s: "1943-07-05", e: "1943-08-23", at: [51.2,36.6], k: "battle", w: "A", d: "Germany's last offensive in the east runs into eight belts of minefields and guns prepared with foreknowledge of the plan. At Prokhorovka the largest tank battle in history is fought. From here the Red Army only advances.", f: "c. 6,000 tanks · 2 million men", u: W + "Battle_of_Kursk", ar: [7, "war", "Europe", "Soviet Union", ["stalingrad", "bagration"]] },
      { id: "sicily1943", n: "Sicily — Mussolini falls", s: "1943-07-10", e: "1943-08-17", at: [37.5,14.2], k: "battle", w: "A", d: "The Allies land in Sicily; two weeks later the Fascist Grand Council and the king depose and arrest Mussolini. Italy surrenders on 8 September, and Germany occupies it overnight.", u: W + "Allied_invasion_of_Sicily", ar: [6, "war", "Europe", "Italy", ["marchonrome", "torch", "cassino"]] },
      { id: "tehran", n: "Tehran Conference", s: "1943-11-28", e: "1943-12-01", at: [35.69,51.39], k: "diplo", d: "The Big Three meet for the first time. Stalin gets his second front — a landing in France in May 1944 — and a first sketch of post-war Poland.", u: W + "Tehran_Conference", ar: [6, "law", "West Asia / Middle East", null, ["dday", "yalta", "un"]] },
      { id: "tarawa", n: "Battle of Tarawa", s: "1943-11-20", e: "1943-11-23", at: [1.43,172.98], k: "battle", w: "A", d: "76 hours on a coral islet half the size of Central Park. Of 4,800 defenders, 17 Japanese soldiers surrender. America learns what the road to Tokyo will cost.", f: "c. 1,000 Marines and 4,700 defenders killed", u: W + "Battle_of_Tarawa" },
      { id: "cassino", n: "Battle of Monte Cassino", s: "1944-01-17", e: "1944-05-18", at: [41.49,13.81], k: "battle", w: "A", d: "Four assaults on the Gustav Line by troops of a dozen nations; the sixth-century abbey is bombed to rubble. Polish soldiers raise their flag on the ruins. Rome falls on 4 June — two days before D-Day takes the headlines.", f: "c. 55,000 Allied casualties", u: W + "Battle_of_Monte_Cassino", ar: [5, "war", "Europe", null, ["sicily1943", "dday"]] },
      { id: "imphal", n: "Imphal and Kohima", s: "1944-03-08", e: "1944-07-03", at: [24.82,93.95], k: "battle", w: "A", d: "Japan's invasion of India is stopped at a district commissioner's tennis court. Slim's 'Forgotten Army' — mostly Indian — inflicts the greatest land defeat in Japanese history to that date.", f: "c. 53,000 Japanese casualties", u: W + "Battle_of_Imphal", ar: [5, "war", "South Asia", "British India", ["singapore1942", "indiaind"]] },
      { id: "overlord", n: "D-Day — the Normandy landings", s: "1944-06-06", e: "1944-08-30", at: [49.37,-0.88], k: "battle", w: "A", ref: "dday", d: "156,000 men land on five beaches from 7,000 vessels, the largest seaborne invasion ever mounted. By the end of August two million Allied soldiers are in France and the German army in the west is wrecked.", f: "c. 10,000 Allied casualties on the first day", u: W + "Normandy_landings" },
      { id: "philippinesea", n: "Saipan and the Philippine Sea", s: "1944-06-15", e: "1944-07-09", at: [15.19,145.75], k: "naval", w: "A", d: "The 'Great Marianas Turkey Shoot' destroys Japan's carrier air arm; Saipan's fall puts Tokyo within range of the B-29. Tojo's government resigns.", u: W + "Battle_of_Saipan" },
      { id: "bagration", n: "Operation Bagration", s: "1944-06-22", e: "1944-08-19", at: [53.9,27.57], k: "battle", w: "A", d: "Three years to the day after Barbarossa, the Red Army strikes in Belorussia with 2.3 million men. Army Group Centre is annihilated — a worse defeat than Stalingrad — and the front leaps 600 km to the gates of Warsaw.", f: "c. 400,000 German losses in two months", u: W + "Operation_Bagration", ar: [7, "war", "Europe", "Soviet Union", ["barbarossa", "kursk", "dday", "warsawuprising"]] },
      { id: "july20", n: "The 20 July plot", s: "1944-07-20", at: [54.08,21.49], k: "revolt", d: "Colonel von Stauffenberg's briefcase bomb explodes under Hitler's map table at the Wolf's Lair. A heavy oak table leg saves him. Some 5,000 are executed in the purge that follows.", u: W + "20_July_plot" },
      { id: "warsawuprising", n: "The Warsaw Uprising", s: "1944-08-01", e: "1944-10-02", at: [52.23,21.01], k: "revolt", w: "B", d: "The Polish Home Army rises as the Red Army reaches the Vistula — and the Red Army halts. For 63 days the city fights alone. Hitler orders Warsaw razed block by block.", f: "c. 150,000–200,000 civilians killed", u: W + "Warsaw_Uprising", ar: [6, "war", "Europe", "Poland", ["poland1939", "bagration", "yalta"]] },
      { id: "paris1944", n: "Liberation of Paris", s: "1944-08-25", at: [48.86,2.35], k: "end", w: "A", d: "The Resistance rises; Leclerc's French armoured division is sent in first. The German commander ignores Hitler's order to leave the city 'a field of ruins'. De Gaulle walks down the Champs-Élysées.", u: W + "Liberation_of_Paris", ar: [6, "war", "Europe", "France", ["falloffrance", "dday"]] },
      { id: "marketgarden", n: "Operation Market Garden", s: "1944-09-17", e: "1944-09-25", at: [51.98,5.91], k: "battle", w: "B", d: "The largest airborne operation in history tries to seize a carpet of bridges into Germany. The last one, at Arnhem, is 'a bridge too far'.", u: W + "Operation_Market_Garden" },
      { id: "leytegulf", n: "Battle of Leyte Gulf", s: "1944-10-23", e: "1944-10-26", at: [10.8,125.6], k: "naval", w: "A", d: "The largest naval battle in history, as MacArthur wades ashore in the Philippines. Japan loses four carriers and three battleships and sends out the first organized kamikaze attacks.", f: "c. 280 ships engaged · 26 Japanese warships sunk", u: W + "Battle_of_Leyte_Gulf", ar: [6, "war", "Southeast Asia", "United States", ["midway", "guadalcanal", "okinawa"]] },
      { id: "bulge", n: "Battle of the Bulge", s: "1944-12-16", e: "1945-01-25", at: [50.0,5.72], k: "battle", w: "A", d: "Hitler's last reserves strike through the Ardennes in fog and snow, aiming for Antwerp. At surrounded Bastogne the American reply to a surrender demand is 'Nuts!' It is the U.S. Army's largest and bloodiest battle.", f: "c. 19,000 Americans killed", u: W + "Battle_of_the_Bulge", ar: [6, "war", "Europe", "United States", ["dday", "falloffrance", "berlin1945"]] },
      { id: "auschwitzlib", n: "Liberation of Auschwitz", s: "1945-01-27", at: [50.03,19.2], k: "atrocity", d: "Soviet soldiers find 7,000 living skeletons, and warehouses of shoes, spectacles and human hair. About 1.1 million people were murdered here, nearly a million of them Jews. The date is now Holocaust Remembrance Day.", f: "c. 1.1 million murdered at Auschwitz", u: W + "Auschwitz_concentration_camp", ar: [7, "war", "Europe", null, ["holocaust", "wannsee", "nuremberg", "udhr"]] },
      { id: "yalta", n: "Yalta Conference", s: "1945-02-04", e: "1945-02-11", at: [44.47,34.14], k: "diplo", d: "Roosevelt, Churchill and Stalin divide Germany into occupation zones, agree to found the United Nations, and settle — on paper — the fate of Poland. The Red Army is already there.", u: W + "Yalta_Conference", ar: [7, "law", "Europe", null, ["tehran", "potsdam", "un", "coldwar"]] },
      { id: "dresden", n: "Bombing of Dresden", s: "1945-02-13", e: "1945-02-15", at: [51.05,13.74], k: "air", w: "A", d: "A firestorm destroys the baroque city, crowded with refugees. It becomes the symbol of the Allied bombing campaign that killed some 350,000–500,000 German civilians.", f: "c. 25,000 killed", u: W + "Bombing_of_Dresden" },
      { id: "iwojima", n: "Battle of Iwo Jima", s: "1945-02-19", e: "1945-03-26", at: [24.78,141.32], k: "battle", w: "A", d: "Eight square miles of volcanic ash honeycombed with eleven miles of tunnels. Nearly all of the 21,000 defenders die. The photograph of the flag on Mount Suribachi becomes the most reproduced image of the war.", f: "c. 6,800 Americans and 20,000 Japanese killed", u: W + "Battle_of_Iwo_Jima", ar: [6, "war", "East Asia", "United States", ["leytegulf", "okinawa"]] },
      { id: "tokyofire", n: "Firebombing of Tokyo", s: "1945-03-09", e: "1945-03-10", at: [35.7,139.8], k: "air", w: "A", d: "334 B-29s drop napalm on a city of wood and paper. Sixteen square miles burn. It is the deadliest air raid in history — more immediately lethal than either atomic bomb.", f: "c. 100,000 killed in one night", u: W + "Bombing_of_Tokyo_(10_March_1945)", ar: [6, "war", "East Asia", "Japan", ["bomb", "iwojima"]] },
      { id: "okinawa", n: "Battle of Okinawa", s: "1945-04-01", e: "1945-06-22", at: [26.5,127.9], k: "battle", w: "A", d: "The 'typhoon of steel': 1,900 kamikaze sorties, and a third of the island's civilians dead. Its cost weighs heavily on the decision to use the atomic bomb.", f: "c. 12,500 Americans, 110,000 Japanese soldiers and up to 100,000+ civilians killed", u: W + "Battle_of_Okinawa", ar: [6, "war", "East Asia", "Japan", ["iwojima", "bomb", "vjday"]] },
      { id: "berlin1945", n: "Battle of Berlin", s: "1945-04-16", e: "1945-05-02", at: [52.52,13.4], k: "battle", w: "A", d: "Two and a half million Soviet soldiers storm the capital of the Reich. On 25 April Americans and Russians shake hands on the Elbe; on the 30th Hitler shoots himself in his bunker; on 2 May the red flag flies from the Reichstag.", f: "c. 80,000 Soviet soldiers killed", u: W + "Battle_of_Berlin", ar: [8, "war", "Europe", "Soviet Union", ["bagration", "hitler33", "veday"]] },
      { id: "veday", n: "V-E Day — Germany surrenders", s: "1945-05-08", at: [49.26,4.03], k: "end", w: "A", d: "Jodl signs the unconditional surrender at Eisenhower's headquarters in Reims on 7 May; Stalin insists on a second ceremony in Berlin the next night. The war in Europe is over after 2,076 days.", u: W + "Victory_in_Europe_Day", ar: [9, "war", "Europe", null, ["ww2", "berlin1945", "nuremberg", "potsdam", "un"]] },
      { id: "potsdam", n: "Potsdam Conference", s: "1945-07-17", e: "1945-08-02", at: [52.4,13.06], k: "diplo", d: "Truman, Stalin and Churchill — replaced mid-conference by Attlee — settle the occupation of Germany. Truman mentions 'a new weapon of unusual destructive force'. Stalin, thanks to his spies, already knows.", u: W + "Potsdam_Conference", ar: [6, "law", "Europe", null, ["yalta", "bomb", "coldwar"]] },
      { id: "hiroshima", n: "Hiroshima", s: "1945-08-06", at: [34.39,132.45], k: "air", w: "A", ref: "bomb", d: "At 8:15 a.m. a single B-29 from Tinian drops a uranium bomb. Some 70,000–80,000 people die at once; the toll reaches perhaps 140,000 by the end of the year.", f: "c. 140,000 dead by December 1945", u: W + "Atomic_bombings_of_Hiroshima_and_Nagasaki" },
      { id: "manchuria1945", n: "Soviet invasion of Manchuria", s: "1945-08-09", e: "1945-08-20", at: [43.9,125.3], k: "battle", w: "A", d: "Exactly three months after V-E Day, as promised at Yalta, 1.5 million Soviet troops fall on Japan's Kwantung Army from three sides. For Japan's leaders it ends the hope of a negotiated peace through Moscow.", u: W + "Soviet_invasion_of_Manchuria", ar: [6, "war", "East Asia", "Soviet Union", ["yalta", "vjday", "chinarev", "korea"]] },
      { id: "nagasaki", n: "Nagasaki", s: "1945-08-09", at: [32.77,129.87], k: "air", w: "A", ref: "bomb", d: "A plutonium bomb, diverted by cloud from its first target, destroys the northern half of the city. On the 15th the emperor's voice is heard on the radio for the first time: Japan must 'endure the unendurable'.", f: "c. 70,000 dead by December 1945", u: W + "Atomic_bombings_of_Hiroshima_and_Nagasaki" },
      { id: "vjday", n: "Japan surrenders", s: "1945-09-02", at: [35.35,139.76], k: "end", w: "A", d: "On the deck of the battleship Missouri in Tokyo Bay, MacArthur accepts the surrender: 'These proceedings are closed.' Six years and a day after the invasion of Poland — eight years after the Marco Polo Bridge — it is over.", u: W + "Surrender_of_Japan", ar: [9, "war", "East Asia", "Japan", ["ww2", "bomb", "manchuria1945", "okinawa", "un", "coldwar"]] }
    ],

    fronts: [
      { id: "east", n: "The Eastern Front — Axis-held Soviet territory", side: "B", fill: true, clip: true, base: E0,
        keys: [
          { d: "1941-06-21", p: E0, fr: [0, 0] },
          { d: "1941-07-10", p: [[59.85,29.0],[59.8,26.0],[59.6,23.0],[58.6,21.3],[57.9,22.3],[58.0,23.8],[58.35,24.45],[58.4,25.6],[58.4,26.7],[58.3,27.4],[58.0,27.9],[57.82,28.35],[57.3,29.0],[56.3,29.0],[55.5,30.0],[54.9,30.4],[54.5,30.4],[53.9,30.3],[53.2,30.0],[52.3,29.0],[51.3,28.3],[50.6,28.3],[50.2,29.3],[49.7,28.8],[49.2,28.3],[48.6,27.8],[48.0,28.0],[47.3,28.6],[46.4,28.9],[45.8,28.9],[45.35,29.6]], fr: [6, 29] },
          { d: "1941-09-30", p: LEN.concat([[59.93,31.05],[59.6,31.6],[59.4,32.0],[58.9,31.6],[58.55,31.3],[58.0,31.6],[57.4,32.6],[57.0,33.0],[56.3,32.6],[55.6,32.7],[55.0,32.9],[54.5,33.0],[53.9,33.6],[53.2,33.5],[52.5,33.6],[51.7,34.1],[50.9,34.6],[50.2,34.8],[49.5,35.2],[48.6,35.3],[47.9,35.4],[47.0,35.0],[46.5,34.6],[46.15,33.7],[46.1,32.5],[46.4,31.5],[45.9,30.5],[45.35,29.6]]), fr: [1, 26] },
          { d: "1941-12-05", p: LEN.concat([[59.93,31.05],[59.75,32.0],[59.65,33.5],[59.3,32.9],[58.9,31.9],[58.55,31.3],[58.0,31.6],[57.4,32.6],[57.0,33.0],[56.85,34.5],[56.86,35.9],[56.6,36.7],[56.35,37.5],[56.0,37.4],[55.75,36.85],[55.38,36.73],[55.0,37.0],[54.5,37.1],[54.55,38.0],[54.3,38.9],[53.8,39.4],[53.2,38.6],[52.62,38.6],[52.0,37.8],[51.5,37.2],[50.8,36.9],[50.2,37.0],[49.6,37.2],[49.0,37.6],[48.5,38.4],[47.8,38.75],[47.25,38.85],[46.9,37.6],[45.5,36.8],[44.9,36.6]], BS), fr: [1, 34] },
          { d: "1942-05-05", p: NW42.concat([[51.8,37.2],[51.2,37.2],[50.5,36.9],[50.0,36.8],[49.4,36.5],[48.85,36.25],[48.65,36.9],[48.9,37.7],[48.5,38.4],[47.8,38.75],[47.25,38.85],[46.9,37.6],[45.5,36.8],[44.9,36.6]], BS), fr: [1, 35] },
          { d: "1942-11-18", p: NW42.concat([[52.2,38.2],[51.67,39.15],[51.0,39.5],[50.2,40.0],[49.8,41.0],[49.55,42.3],[49.2,43.2],[49.0,44.0],[48.85,44.6],[48.7,44.52],[48.4,44.6],[47.6,44.6],[46.3,45.6],[45.0,45.5],[43.9,45.3],[43.4,44.5],[43.2,43.9],[43.3,42.5],[43.6,41.0],[44.0,39.8],[44.6,38.0],[44.72,37.8],[44.6,37.5]], BS), fr: [1, 46] },
          { d: "1943-03-25", p: LEN.concat([[59.85,31.0],[59.55,31.9],[59.1,31.8],[58.55,31.3],[58.0,31.5],[57.4,31.4],[56.6,30.4],[55.9,31.0],[55.4,31.9],[55.25,32.6],[55.1,33.2],[54.5,34.1],[54.0,34.3],[53.8,34.9],[53.6,35.7],[53.3,36.7],[52.8,36.9],[52.35,36.2],[52.3,35.4],[52.1,34.7],[51.6,34.6],[51.0,34.9],[50.75,35.5],[50.65,36.6],[50.3,36.9],[49.7,36.9],[49.2,37.3],[48.9,38.0],[48.6,39.0],[48.2,39.0],[47.8,38.8],[47.3,38.75],[47.0,38.2],[46.6,37.8],[45.9,37.9],[45.35,37.7],[45.0,38.0],[44.72,37.8],[44.6,37.5]], BS), fr: [1, 41] },
          { d: "1943-07-04", p: LEN.concat([[59.85,31.0],[59.55,31.9],[59.1,31.8],[58.55,31.3],[58.0,31.5],[57.4,31.4],[56.6,30.4],[55.9,31.0],[55.4,31.9],[55.25,32.6],[55.1,33.2],[54.5,34.1],[54.0,34.3],[53.8,34.9],[53.6,35.7],[53.3,36.7],[52.8,36.9],[52.35,36.2],[52.3,35.4],[52.1,34.7],[51.6,34.6],[51.0,34.9],[50.75,35.5],[50.65,36.6],[50.3,36.9],[49.7,36.9],[49.2,37.3],[48.9,38.0],[48.6,39.0],[48.2,39.0],[47.8,38.8],[47.3,38.75],[47.0,38.2],[46.6,37.8],[45.9,37.9],[45.35,37.7],[45.0,38.0],[44.72,37.8],[44.6,37.5]], BS), fr: [1, 41] },
          { d: "1943-12-24", p: LEN.concat([[59.85,31.0],[59.55,31.9],[59.1,31.8],[58.55,31.3],[58.0,31.5],[57.4,31.4],[56.6,30.3],[56.0,29.6],[55.2,30.65],[54.6,30.9],[54.0,31.0],[53.4,30.7],[52.9,30.2],[52.4,30.3],[52.0,29.6],[51.5,29.2],[51.0,29.0],[50.5,29.3],[50.0,30.0],[49.8,31.4],[49.3,32.0],[48.8,32.4],[48.3,33.3],[47.9,33.9],[47.5,34.6],[46.9,33.6],[46.6,32.6],[46.5,32.0],[46.0,33.0],[46.1,33.7],[45.9,34.7],[45.45,35.6],[45.4,36.4],[45.0,36.6],[44.3,34.4],[44.8,32.9],[45.6,31.6],[46.2,31.2],[45.6,30.3],[45.35,29.6]]), fr: [1, 36] },
          { d: "1944-06-21", p: [[59.85,29.0],[59.8,28.2],[59.4,28.15],[58.9,27.6],[58.3,27.5],[57.8,28.55],[57.35,28.5],[56.9,28.9],[56.3,29.3],[55.7,29.6],[55.3,30.55],[54.9,30.9],[54.5,30.8],[53.9,30.9],[53.3,30.4],[52.9,30.1],[52.6,29.3],[52.2,28.5],[52.0,27.2],[51.9,25.9],[51.5,25.2],[51.2,24.95],[50.6,24.9],[50.15,25.3],[49.7,25.3],[49.2,25.0],[48.6,24.8],[48.0,25.0],[47.6,25.6],[47.4,26.5],[47.3,27.3],[47.35,28.5],[47.25,29.15],[46.85,29.5],[46.4,30.0],[46.1,30.45],[45.7,30.2],[45.35,29.6]], fr: [2, 35] },
          { d: "1944-08-29", p: [[59.85,29.0],[59.8,28.2],[59.5,27.95],[59.37,27.9],[58.9,27.3],[58.5,27.2],[58.38,26.4],[57.95,26.2],[57.4,26.3],[56.75,25.5],[56.55,24.3],[56.6,23.3],[56.2,22.9],[55.6,22.7],[55.1,22.7],[54.6,22.85]].concat(EBL.slice(3)), fr: [3, 15] },
          { d: "1944-10-31", p: [[59.85,29.0],[59.8,26.0],[59.6,23.0],[58.6,21.3],[57.9,22.3],[57.6,23.3],[57.05,23.5],[56.9,23.2],[56.65,22.6],[56.45,21.7],[56.25,21.1],[56.1,20.9],[55.9,20.6]].concat(EBL), fr: [6, 10] },
          { d: "1945-05-08", p: [[59.85,29.0],[59.8,26.0],[59.6,23.0],[58.6,21.3],[57.9,22.3],[57.6,23.3],[57.05,23.5],[56.9,23.2],[56.65,22.6],[56.45,21.7],[56.25,21.1],[56.1,20.9],[55.9,20.6]].concat(EBL), fr: [6, 10] }
        ], end: "1945-05-12" },
      { id: "sov", n: "The Red Army's advance, 1944–45", side: "L", from: "1944-08-29",
        keys: [
          { d: "1944-08-29", p: [[54.6,22.85],[54.1,23.0],[53.6,22.9],[53.2,22.2],[52.8,21.6],[52.5,21.2],[52.2,21.15],[51.8,21.35],[51.4,21.75],[50.9,21.6],[50.55,21.2],[50.0,21.4],[49.7,21.6],[49.35,22.0],[48.9,22.9],[48.4,24.0],[47.95,24.9],[47.5,25.5],[46.4,26.0],[45.6,25.5],[45.4,24.0],[44.7,22.4]] },
          { d: "1945-01-11", p: [[55.3,21.3],[55.0,22.2],[54.6,22.6],[54.2,22.6],[53.7,22.6],[53.2,22.0],[52.9,21.3],[52.6,21.1],[52.25,21.05],[51.8,21.3],[51.35,21.6],[50.6,21.1],[50.1,21.2],[49.7,21.5],[49.3,21.3],[48.75,21.3],[48.4,20.5],[48.15,19.6],[47.95,18.7],[47.6,18.5],[47.3,18.3],[46.95,18.05],[46.6,17.4],[46.3,17.3],[45.95,17.5],[45.55,18.7],[45.1,19.3]] },
          { d: "1945-02-15", p: [[54.3,19.3],[53.9,18.8],[53.6,18.0],[53.5,17.0],[53.25,16.0],[53.2,15.4],[53.0,14.9],[52.75,14.5],[52.6,14.65],[52.3,14.6],[52.0,14.8],[51.6,15.3],[51.25,15.55],[51.1,15.9],[50.95,16.5],[50.75,17.0],[50.6,17.5],[50.4,17.9],[50.15,18.3],[49.95,18.7],[49.7,19.0],[49.45,19.6],[49.1,19.6],[48.75,19.2],[48.4,18.9],[48.0,18.65],[47.75,18.4],[47.4,18.4],[47.2,18.4],[46.9,18.05],[46.6,17.4],[46.3,17.3],[45.95,17.5],[45.55,18.7],[45.1,19.3]] },
          { d: "1945-04-16", p: [[53.9,14.3],[53.5,14.65],[53.05,14.35],[52.65,14.4],[52.35,14.55],[52.05,14.7],[51.75,14.72],[51.5,14.75],[51.3,15.0],[51.1,15.3],[51.0,15.5],[50.9,16.1],[50.85,16.5],[50.55,16.9],[50.4,17.35],[50.1,17.6],[49.95,18.05],[49.85,18.5],[49.55,18.75],[49.1,18.6],[48.9,18.0],[48.85,17.2],[48.7,16.7],[48.4,16.3],[48.2,15.65],[47.8,15.6],[47.6,15.75],[47.25,15.95],[46.95,15.95],[46.65,16.1],[46.4,16.4],[46.3,16.6]] },
          { d: "1945-05-08", p: [[53.9,11.5],[53.4,11.65],[52.9,11.8],[52.5,12.0],[52.1,11.75],[51.87,12.3],[51.56,13.05],[51.0,12.95],[50.83,12.95],[50.23,12.9],[49.75,13.42],[48.97,14.5],[48.3,14.35],[47.55,14.8],[47.1,15.0],[46.65,14.9]] }
        ], end: "1945-05-20" },
      { id: "west", n: "The Western Front, 1944–45", side: "L", from: "1944-06-06",
        keys: [
          { d: "1944-06-06", p: [[49.3,-0.25],[49.33,-0.6],[49.37,-0.9],[49.4,-1.15]] },
          { d: "1944-07-24", p: [[49.28,-0.1],[49.13,-0.3],[49.05,-0.65],[49.1,-1.1],[49.22,-1.55]] },
          { d: "1944-08-25", p: [[49.45,0.3],[49.25,1.15],[49.0,1.6],[48.86,2.4],[48.4,2.75],[48.2,3.3],[47.9,2.9],[47.7,2.0],[47.3,0.7],[47.25,-1.5]] },
          { d: "1944-09-15", p: [[51.35,3.3],[51.25,4.4],[51.2,5.3],[50.95,5.75],[50.7,6.1],[50.2,6.15],[49.75,6.3],[49.4,6.1],[49.05,5.95],[48.7,6.25],[48.2,6.5],[47.75,6.6],[47.4,6.8]] },
          { d: "1944-12-15", p: [[51.7,3.7],[51.7,4.4],[51.75,5.3],[51.85,5.9],[51.5,6.05],[51.05,6.05],[50.8,6.4],[50.6,6.25],[50.3,6.3],[49.95,6.2],[49.5,6.4],[49.3,6.75],[49.05,7.4],[49.0,8.1],[48.6,7.8],[48.2,7.4],[47.8,7.3],[47.6,7.55]] },
          { d: "1944-12-26", p: [[51.7,3.7],[51.7,4.4],[51.75,5.3],[51.85,5.9],[51.5,6.05],[51.05,6.05],[50.8,6.4],[50.6,6.25],[50.45,6.2],[50.4,5.9],[50.35,5.55],[50.25,5.0],[50.05,5.2],[49.95,5.55],[49.9,5.95],[49.82,6.3],[49.5,6.4],[49.3,6.75],[49.05,7.4],[49.0,8.1],[48.6,7.8],[48.2,7.4],[47.8,7.3],[47.6,7.55]] },
          { d: "1945-01-28", p: [[51.7,3.7],[51.7,4.4],[51.75,5.3],[51.85,5.9],[51.5,6.05],[51.05,6.05],[50.8,6.4],[50.6,6.25],[50.3,6.3],[49.95,6.2],[49.5,6.4],[49.3,6.75],[49.05,7.4],[49.0,8.1],[48.6,7.8],[48.2,7.4],[47.8,7.3],[47.6,7.55]] },
          { d: "1945-03-07", p: [[51.7,3.7],[51.75,4.4],[51.8,5.3],[51.85,5.95],[51.75,6.3],[51.45,6.65],[51.2,6.75],[50.94,6.95],[50.6,7.25],[50.3,7.3],[50.0,6.9],[49.6,6.7],[49.3,6.8],[49.1,7.3],[49.0,8.1],[48.6,7.8],[47.6,7.55]] },
          { d: "1945-04-18", p: [[53.3,7.3],[53.0,8.6],[53.2,10.4],[52.6,11.9],[52.1,11.65],[51.8,12.2],[51.35,12.4],[50.85,12.75],[50.3,12.2],[49.45,11.1],[48.9,10.3],[48.4,9.95],[48.0,8.5],[47.6,7.9]] },
          { d: "1945-05-08", p: [[53.9,11.45],[53.4,11.6],[52.9,11.75],[52.5,11.95],[52.1,11.7],[51.87,12.25],[51.56,13.0],[51.0,12.9],[50.83,12.9],[50.23,12.87],[49.75,13.38],[48.97,14.47],[48.3,14.3],[47.6,14.3],[47.0,13.3],[46.6,13.85],[46.0,13.6]] }
        ], end: "1945-05-20" },
      { id: "italy", n: "The Italian Front", side: "L", from: "1943-09-03",
        keys: [
          { d: "1943-09-09", p: [[39.0,16.1],[38.9,16.6]] },
          { d: "1943-10-08", p: [[41.02,13.93],[41.2,14.4],[41.5,14.7],[42.0,15.0]] },
          { d: "1944-01-15", p: [[41.25,13.75],[41.49,13.83],[41.75,14.1],[42.1,14.3],[42.35,14.4]] },
          { d: "1944-05-11", p: [[41.25,13.75],[41.49,13.83],[41.75,14.1],[42.1,14.3],[42.35,14.4]] },
          { d: "1944-06-05", p: [[41.75,12.25],[41.9,12.5],[42.0,13.2],[42.35,13.9],[42.46,14.2]] },
          { d: "1944-08-25", p: [[43.7,10.3],[43.77,11.25],[43.6,12.1],[43.8,13.0]] },
          { d: "1945-01-01", p: [[44.0,10.2],[44.2,10.7],[44.25,11.3],[44.4,12.0],[44.5,12.25]] },
          { d: "1945-04-09", p: [[44.0,10.2],[44.2,10.7],[44.25,11.3],[44.4,12.0],[44.5,12.25]] },
          { d: "1945-05-02", p: [[45.07,7.68],[45.47,9.19],[45.9,11.0],[46.07,11.12],[46.1,12.9],[45.65,13.78]] }
        ], end: "1945-05-10" },
      { id: "desert", n: "The Desert War — the front swings 2,000 km five times", side: "L", from: "1940-09-13",
        keys: [
          { d: "1940-09-16", p: [[31.7,25.9],[29.6,25.9]] }, { d: "1940-12-08", p: [[31.7,25.9],[29.6,25.9]] },
          { d: "1941-02-07", p: [[30.4,19.2],[28.4,19.2]] }, { d: "1941-03-24", p: [[30.4,19.2],[28.4,19.2]] },
          { d: "1941-04-14", p: [[31.7,25.2],[29.6,25.2]] }, { d: "1941-11-17", p: [[31.7,25.2],[29.6,25.2]] },
          { d: "1942-01-06", p: [[30.4,19.2],[28.4,19.2]] }, { d: "1942-02-04", p: [[32.3,23.4],[30.6,23.4]] },
          { d: "1942-05-25", p: [[32.3,23.4],[30.6,23.4]] }, { d: "1942-07-01", p: [[30.95,28.95],[30.1,28.7]] },
          { d: "1942-11-03", p: [[30.95,28.95],[30.1,28.7]] }, { d: "1942-11-23", p: [[30.4,19.2],[28.4,19.2]] },
          { d: "1943-01-23", p: [[33.0,13.2],[31.0,13.2]] }, { d: "1943-02-20", p: [[33.9,10.4],[32.6,9.9]] },
          { d: "1943-04-15", p: [[36.15,10.45],[37.2,9.2]] }, { d: "1943-05-13", p: [[36.9,10.9],[37.05,10.95]] }
        ], end: "1943-05-14" }
    ],

    /* the Japanese perimeter: a closed ring, each key = [north, east, south, west, china] */
    rings: [
      { id: "japan", n: "Limit of Japanese control", side: "B", occupy: ["China"],
        keys: [
          { d: "1937-07-07", seg: ring(JN, JE0, JS0, JW0, JC0) },
          { d: "1938-10-31", seg: ring(JN, JE0, JS0, JW0, JC1) },
          { d: "1941-12-06", seg: ring(JN, JE0, JS0, JW0, JC1) },
          { d: "1942-05-20", seg: ring(JN, JE3, JS3, JW3, JC3) },
          { d: "1942-08-06", seg: ring(JN, JE3, JS3, JW3, JC3) },
          { d: "1943-02-09", seg: ring(JN, JE3, JS3b, JW3, JC3) },
          { d: "1943-12-31", seg: ring(JN, JE4, JS4, JW3, JC3) },
          { d: "1944-12-31", seg: ring(JN, JE5, JS5, JW5, JC3) },
          { d: "1945-03-31", seg: ring(JN, JE6, JS6, JW6, JC3) },
          { d: "1945-08-14", seg: ring(JN, JE7, JS7, JW7, JC3) }
        ], end: "1945-09-02" }
    ],

    areas: [
      { n: "Vichy France — the unoccupied zone", l: "Vichy France", s: "1940-06-25", e: "1942-11-11", side: "V", clip: true,
        p: [[43.16,-1.24],[44.0,-0.6],[44.55,-0.25],[45.65,0.5],[46.58,0.6],[47.13,1.0],[47.22,2.07],[46.9,2.6],[46.57,3.33],[46.45,4.1],[46.78,4.85],[47.09,5.49],[46.4,6.0],[46.1,5.85],[45.8,6.9],[44.3,7.0],[43.75,7.5],[43.0,6.2],[43.2,4.5],[42.4,3.2],[42.6,1.5],[42.9,-0.5]] },
      { n: "Canton & Hong Kong", l: "Canton", s: "1938-10-21", e: "1945-08-30", side: "B", clip: true, p: [[23.5,112.9],[23.6,113.9],[23.1,114.5],[22.5,114.6],[22.1,114.1],[21.9,113.2],[22.6,112.8]] },
      { n: "Hainan", s: "1939-02-10", e: "1942-05-20", side: "B", clip: true, p: [[20.2,108.6],[20.2,111.1],[18.1,110.6],[18.1,108.6]] },
      { n: "Operation Ichi-Go: Henan", l: "Ichi-Go", s: "1944-04-17", e: "1945-08-30", side: "B", clip: true, fade: 40, p: [[34.95,113.6],[34.7,112.4],[34.3,111.3],[33.6,112.2],[33.0,113.6],[32.2,113.9],[32.9,114.0],[33.5,114.9],[34.5,114.2]] },
      { n: "Operation Ichi-Go: the corridor to Indochina", l: "Ichi-Go corridor", s: "1944-05-27", e: "1945-08-30", side: "B", clip: true, fade: 190, p: [[29.4,113.1],[28.6,112.3],[27.3,111.3],[25.8,109.8],[24.6,108.6],[23.2,107.3],[22.1,106.9],[21.9,107.6],[22.6,108.9],[24.0,110.0],[25.2,111.3],[26.8,113.3],[28.0,113.7],[29.0,113.8]] }
    ],

    moves: [
      { n: "Japan drives up the Yangtze", s: "1937-08-13", e: "1938-10-25", side: "B", p: [[31.23,121.47],[32.06,118.8],[30.6,114.3]] },
      { n: "Japan takes North China", s: "1937-07-07", e: "1937-11-09", side: "B", p: [[40.5,120.5],[39.9,116.4],[37.87,112.55]] },
      { n: "Germany invades Poland", s: "1939-09-01", e: "1939-09-28", side: "B", p: [[51.1,17.03],[51.4,19.7],[52.23,21.01]] },
      { n: "From East Prussia", s: "1939-09-01", e: "1939-09-17", side: "B", p: [[53.78,20.48],[53.1,21.0],[52.1,23.7]] },
      { n: "The Red Army enters eastern Poland", s: "1939-09-17", e: "1939-09-28", side: "S", p: [[53.9,27.57],[53.68,23.83],[52.1,23.7]] },
      { n: "USSR attacks Finland", s: "1939-11-30", e: "1940-03-13", side: "S", p: [[59.94,30.31],[60.4,29.6],[60.71,28.75]] },
      { n: "Weserübung: Norway", s: "1940-04-09", e: "1940-06-10", side: "B", p: [[54.32,10.13],[57.8,10.6],[59.91,10.75],[63.43,10.4],[68.43,17.43]] },
      { n: "Sickle Cut through the Ardennes", s: "1940-05-10", e: "1940-05-20", side: "B", p: [[50.2,6.6],[49.7,4.94],[49.85,3.29],[50.1,1.83]] },
      { n: "Case Red: the fall of Paris", s: "1940-06-05", e: "1940-06-22", side: "B", p: [[49.9,2.3],[48.86,2.35],[47.39,0.69],[44.84,-0.58]] },
      { n: "The Luftwaffe over Britain", s: "1940-07-10", e: "1940-10-31", side: "B", p: [[50.95,1.86],[51.2,0.9],[51.5,-0.12]] },
      { n: "Italy invades Greece", s: "1940-10-28", e: "1940-11-13", side: "B", p: [[40.47,19.49],[39.9,20.4],[39.67,20.85]] },
      { n: "Operation Compass", s: "1940-12-09", e: "1941-02-07", side: "A", p: [[31.35,27.24],[31.6,25.9],[32.08,23.96],[32.12,20.07],[30.26,19.2]] },
      { n: "Rommel's first offensive", s: "1941-03-24", e: "1941-04-14", side: "B", p: [[30.26,19.2],[32.12,20.07],[32.08,23.96],[31.57,25.15]] },
      { n: "Germany overruns the Balkans", s: "1941-04-06", e: "1941-04-30", side: "B", p: [[43.2,23.5],[41.0,22.5],[40.64,22.94],[37.98,23.73]] },
      { n: "Airborne assault on Crete", s: "1941-05-20", e: "1941-06-01", side: "B", p: [[37.98,23.73],[35.5,24.0]] },
      { n: "Army Group North", s: "1941-06-22", e: "1941-09-08", side: "B", p: [[54.7,20.5],[56.95,24.1],[57.82,28.33],[59.75,30.1]] },
      { n: "Army Group Centre", s: "1941-06-22", e: "1941-12-05", side: "B", p: [[52.1,23.7],[53.9,27.57],[54.78,32.05],[55.55,36.4]] },
      { n: "Army Group South", s: "1941-06-22", e: "1941-11-21", side: "B", p: [[50.75,23.9],[50.25,28.66],[50.45,30.52],[49.99,36.23],[47.24,39.7]] },
      { n: "Kido Butai: the strike on Pearl Harbor", s: "1941-11-26", e: "1941-12-07", side: "B", p: [[45.0,147.6],[42.0,-178.0],[33.0,-158.0],[23.5,-157.9]] },
      { n: "Malaya and Singapore", s: "1941-12-08", e: "1942-02-15", side: "B", p: [[11.5,109.2],[6.2,102.25],[3.14,101.69],[1.35,103.82]] },
      { n: "Invasion of the Philippines", s: "1941-12-08", e: "1942-05-06", side: "B", p: [[22.6,120.3],[16.0,120.3],[14.6,120.98]] },
      { n: "The Dutch East Indies", s: "1942-01-11", e: "1942-03-09", side: "B", p: [[7.07,125.6],[3.3,117.63],[-1.27,116.83],[-6.2,106.85]] },
      { n: "Conquest of Burma", s: "1942-01-20", e: "1942-05-20", side: "B", p: [[16.5,98.6],[16.8,96.15],[21.97,96.08],[25.38,97.4]] },
      { n: "Toward Port Moresby & the Solomons", s: "1942-01-23", e: "1942-08-06", side: "B", p: [[7.4,151.8],[-4.2,152.2],[-9.1,160.15]] },
      { n: "The Midway operation", s: "1942-05-27", e: "1942-06-04", side: "B", p: [[34.3,133.0],[33.0,160.0],[29.5,-178.5]] },
      { n: "Case Blue: to the Volga", s: "1942-06-28", e: "1942-08-23", side: "B", p: [[51.73,36.19],[51.67,39.2],[49.8,41.0],[48.71,44.51]] },
      { n: "Case Blue: to the Caucasus", s: "1942-07-25", e: "1942-11-02", side: "B", p: [[47.24,39.7],[44.6,40.1],[43.74,44.65]] },
      { n: "Rommel to El Alamein", s: "1942-05-26", e: "1942-07-01", side: "B", p: [[32.15,23.35],[32.08,23.96],[31.35,27.24],[30.83,28.95]] },
      { n: "The road to Tokyo begins", s: "1942-08-07", e: "1943-11-01", side: "A", p: [[-17.7,168.3],[-9.45,160.0],[-8.2,157.2],[-6.2,155.2]] },
      { n: "The pursuit from Alamein", s: "1942-11-04", e: "1943-05-13", side: "A", p: [[30.83,28.95],[32.08,23.96],[30.26,19.2],[32.9,13.2],[33.6,10.3],[36.8,10.18]] },
      { n: "Operation Torch", s: "1942-10-24", e: "1942-11-08", side: "A", p: [[36.0,-27.0],[35.0,-12.0],[33.57,-7.59]] },
      { n: "Torch: from Britain", s: "1942-10-26", e: "1942-11-08", side: "A", p: [[50.4,-6.0],[40.0,-11.5],[35.95,-5.6],[36.75,3.06]] },
      { n: "Operation Uranus — north pincer", s: "1942-11-19", e: "1942-11-23", side: "A", p: [[49.58,42.73],[48.7,43.5]] },
      { n: "Operation Uranus — south pincer", s: "1942-11-20", e: "1942-11-23", side: "A", p: [[47.9,45.0],[48.7,43.5]] },
      { n: "MacArthur up the New Guinea coast", s: "1943-01-22", e: "1944-09-15", side: "A", p: [[-8.65,148.4],[-6.73,147.0],[-2.53,140.72],[2.05,128.3]] },
      { n: "Sicily and Salerno", s: "1943-07-10", e: "1943-09-09", side: "A", p: [[36.8,10.18],[37.07,14.25],[38.19,15.55],[40.63,14.6]] },
      { n: "The Soviet drive to the Dnieper", s: "1943-08-03", e: "1943-11-06", side: "A", p: [[51.2,36.6],[49.99,36.23],[49.59,34.55],[50.45,30.52]] },
      { n: "Nimitz across the Central Pacific", s: "1943-11-20", e: "1944-08-10", side: "A", p: [[21.3,-157.9],[1.43,172.98],[8.72,167.73],[15.19,145.75]] },
      { n: "Japan's march on India", s: "1944-03-08", e: "1944-04-06", side: "B", p: [[23.6,95.0],[24.6,94.3],[24.82,93.95]] },
      { n: "Operation Ichi-Go", s: "1944-04-17", e: "1944-12-10", side: "B", p: [[34.75,113.65],[30.6,114.3],[28.2,112.97],[25.27,110.29],[22.82,108.32]] },
      { n: "Operation Overlord", s: "1944-06-05", e: "1944-06-06", side: "A", p: [[50.8,-1.1],[50.2,-0.9],[49.37,-0.7]] },
      { n: "Operation Bagration", s: "1944-06-22", e: "1944-08-19", side: "A", p: [[54.5,30.9],[53.9,27.57],[53.13,23.15],[52.3,21.3]] },
      { n: "Breakout: Cobra to the Seine", s: "1944-07-25", e: "1944-08-25", side: "A", p: [[49.12,-1.09],[48.68,-1.36],[48.0,0.2],[48.86,2.35]] },
      { n: "Operation Dragoon", s: "1944-08-15", e: "1944-09-12", side: "A", p: [[42.0,8.8],[43.3,6.6],[45.76,4.84],[47.32,5.04]] },
      { n: "Romania and Bulgaria change sides", s: "1944-08-20", e: "1944-10-20", side: "A", p: [[47.0,28.86],[44.43,26.1],[42.7,23.32],[44.8,20.47]] },
      { n: "Return to the Philippines", s: "1944-10-20", e: "1945-03-03", side: "A", p: [[2.05,128.3],[11.0,125.0],[16.0,120.3],[14.6,120.98]] },
      { n: "The Ardennes offensive", s: "1944-12-16", e: "1944-12-26", side: "B", p: [[50.3,6.4],[50.15,5.8],[50.24,5.05]] },
      { n: "Burma retaken", s: "1944-12-03", e: "1945-05-03", side: "A", p: [[24.82,93.95],[23.2,94.3],[21.97,96.08],[16.8,96.15]] },
      { n: "Vistula to the Oder", s: "1945-01-12", e: "1945-02-02", side: "A", p: [[51.5,21.4],[51.76,19.46],[52.41,16.93],[52.58,14.65]] },
      { n: "Iwo Jima and Okinawa", s: "1945-02-16", e: "1945-04-01", side: "A", p: [[15.19,145.75],[24.78,141.32],[26.3,127.8]] },
      { n: "Crossing the Rhine", s: "1945-03-07", e: "1945-04-25", side: "A", p: [[50.58,7.23],[51.3,9.5],[51.55,12.95]] },
      { n: "The storming of Berlin", s: "1945-04-16", e: "1945-05-02", side: "A", p: [[52.58,14.65],[52.52,14.1],[52.52,13.4]] },
      { n: "Enola Gay", s: "1945-08-05", e: "1945-08-06", side: "A", p: [[15.0,145.63],[24.78,141.32],[34.39,132.45]] },
      { n: "August Storm: Manchuria", s: "1945-08-09", e: "1945-08-20", side: "A", p: [[47.0,115.5],[45.0,122.0],[43.9,125.3]] },
      { n: "From the Soviet Far East", s: "1945-08-09", e: "1945-08-20", side: "A", p: [[44.6,132.8],[44.6,129.6],[45.75,126.65]] }
    ],

    theaters: [
      { id: "world", n: "The World", box: [-28, -42, 325, 74], phi: 30 },
      { id: "europe", n: "Europe", box: [-11, 34, 48, 70], phi: 52 },
      { id: "east", n: "Eastern Front", box: [13, 42.5, 50, 61.5], phi: 52 },
      { id: "west", n: "Western Europe", box: [-6, 42, 17, 56.5], phi: 49 },
      { id: "med", n: "Mediterranean & North Africa", box: [-10, 26.5, 40, 47], phi: 36 },
      { id: "pacific", n: "Asia & the Pacific", box: [86, -16, 212, 56], phi: 18 },
      { id: "china", n: "China & Burma", box: [88, 8, 134, 46], phi: 28 }
    ],

    stats: [
      { v: "c. 60 million+", l: "dead — some estimates reach 70–85 million", s: "National WWII Museum · Wikipedia survey" },
      { v: "15 million", l: "battle deaths", s: "National WWII Museum" },
      { v: "45 million", l: "civilian deaths", s: "National WWII Museum" },
      { v: "6 million", l: "Jews murdered in the Holocaust", s: "USHMM" },
      { v: "24 million", l: "Soviet dead — the most of any nation", s: "National WWII Museum" },
      { v: "@days", l: "days, 1 Sep 1939 – 2 Sep 1945", s: "" }
    ],
    cost: {
      title: "Deaths by country — military and civilian",
      note: "The dark segment is military deaths; the full bar is all deaths. Where the source gives a range, the bar shows the midpoint and the label shows the range. Every figure here is an estimate and they vary widely between sources — the Museum notes that China's civilian losses alone may have been far higher than shown. Austria, Korea and the Baltic states are listed as the source lists them.",
      src: [{ n: "The National WWII Museum — Research Starters: Worldwide Deaths in World War II", u: "https://www.nationalww2museum.org/students-teachers/student-resources/research-starters/research-starters-worldwide-deaths-world-war" },
            { n: "Encyclopaedia Britannica — World War II: Costs of the war", u: "https://www.britannica.com/event/World-War-II/Costs-of-the-war" },
            { n: "USHMM — Documenting Numbers of Victims of the Holocaust and Nazi Persecution", u: "https://encyclopedia.ushmm.org/content/en/article/documenting-numbers-of-victims-of-the-holocaust-and-nazi-persecution" }],
      mode: "tot",
      rows: [
        { n: "Soviet Union", side: "A", mil: [8800000, 10700000], tot: 24000000 }, { n: "China", side: "A", mil: [3000000, 4000000], tot: 20000000 },
        { n: "Germany", side: "B", mil: 5533000, tot: [6600000, 8800000] }, { n: "Poland", side: "A", mil: 240000, tot: 5600000 },
        { n: "Dutch East Indies", side: "O", mil: null, tot: [3000000, 4000000] }, { n: "Japan", side: "B", mil: 2120000, tot: [2600000, 3100000] },
        { n: "India", side: "A", mil: 87000, tot: [1500000, 2500000] }, { n: "French Indochina", side: "O", mil: null, tot: [1000000, 1500000] },
        { n: "Yugoslavia", side: "A", mil: 446000, tot: 1000000 }, { n: "Romania", side: "B", mil: 300000, tot: 833000 },
        { n: "Philippines", side: "A", mil: 57000, tot: [500000, 1000000] }, { n: "Hungary", side: "B", mil: 300000, tot: 580000 },
        { n: "France", side: "A", mil: 217600, tot: 567600 }, { n: "Greece", side: "A", mil: [20000, 35000], tot: [300000, 800000] },
        { n: "Italy", side: "B", mil: 301400, tot: 457000 }, { n: "United Kingdom", side: "A", mil: 383600, tot: 450700 },
        { n: "Korea", side: "O", mil: null, tot: [378000, 473000] }, { n: "United States", side: "A", mil: 416800, tot: 418500 },
        { n: "Austria", side: "B", mil: 261000, tot: 384700 }, { n: "Lithuania", side: "O", mil: null, tot: 353000 },
        { n: "Czechoslovakia", side: "A", mil: 25000, tot: 345000 }, { n: "Netherlands", side: "A", mil: 17000, tot: 301000 },
        { n: "Latvia", side: "O", mil: null, tot: 227000 }, { n: "Finland", side: "B", mil: 95000, tot: 97000 },
        { n: "Belgium", side: "A", mil: 12100, tot: 86100 }, { n: "Canada", side: "A", mil: 45400, tot: 45400 },
        { n: "Australia", side: "A", mil: 39800, tot: 40500 }
      ]
    },

    causes: [
      { t: "The unfinished business of 1919", d: "Germany loses territory, its army and its pride at Versailles and is told the war was its fault. Italy feels cheated of its spoils; Japan is refused a clause on racial equality.", ref: "versailles" },
      { t: "The Great Depression", d: "World trade collapses by two-thirds. Six million Germans are out of work when Hitler takes power; Japan's silk exports collapse and the army offers conquest as the cure.", ref: "depression" },
      { t: "Dictators with programmes", d: "Mussolini wants a new Roman Empire; Japan's militarists want the resources of China and South-East Asia; Hitler wants 'living space' in the east and a continent without Jews. He writes it all down in advance.", ref: "hitler33" },
      { t: "The failure of collective security", d: "The League of Nations watches Japan take Manchuria (1931) and Italy take Ethiopia (1935–36) and does nothing that matters. The United States is not even a member.", ref: "abyssinia" },
      { t: "Appeasement", d: "Britain and France, haunted by the Somme and Verdun, let Hitler rearm, reoccupy the Rhineland, annex Austria and dismember Czechoslovakia. Spain's civil war becomes a rehearsal.", ref: "spanishcivil" },
      { t: "The pact", d: "With Stalin's neutrality bought, Hitler can attack Poland without a two-front war.", ref: "sinojapanese" }
    ],
    aftermath: [
      { t: "The United Nations", d: "Founded in San Francisco in June 1945 by 50 nations, with the five main victors holding permanent seats and vetoes.", ref: "un" },
      { t: "The Cold War", d: "The wartime alliance dissolves along the line where the armies met. Germany and Europe stay divided for 45 years.", ref: "coldwar" },
      { t: "The nuclear age", d: "Two bombs end the war and begin an arms race that puts the survival of civilization in question.", ref: "bomb" },
      { t: "Crimes against humanity", d: "At Nuremberg and Tokyo, leaders are tried for aggressive war and genocide for the first time. The Genocide Convention and the Universal Declaration follow in 1948.", ref: "nuremberg" },
      { t: "The end of empire", d: "The colonial powers return to Asia bankrupt and discredited. India is independent within two years, Indonesia within four, most of Africa within twenty.", ref: "indiaind" },
      { t: "Israel", d: "The destruction of European Jewry transforms the case for a Jewish state.", ref: "israel" },
      { t: "A new economic order", d: "Bretton Woods, the Marshall Plan and the dollar rebuild the capitalist world around the United States.", ref: "brettonwoods" },
      { t: "Revolution in China", d: "Eight years of Japanese invasion fatally weaken Chiang's Nationalists. Mao takes Beijing in 1949.", ref: "chinarev" }
    ],
    tech: [
      { t: "Blitzkrieg", d: "Tanks, radios and dive-bombers used together restore movement to war — until everyone learns to do it." },
      { t: "The aircraft carrier", d: "Replaces the battleship in a single morning at Pearl Harbor. Whole fleets fight without seeing each other." },
      { t: "Radar", d: "Wins the Battle of Britain and, mounted in aircraft, the Battle of the Atlantic." },
      { t: "Codebreaking", d: "Ultra and Magic read the enemy's mail. Bletchley Park's machines are ancestors of the computer.", ref: "turing" },
      { t: "Strategic bombing", d: "From Guernica to Hamburg, Dresden and Tokyo: cities themselves become targets.", ref: "guernica" },
      { t: "The V-2 rocket", d: "The first ballistic missile — and, in other hands, the first step to the Moon.", ref: "moon" },
      { t: "Penicillin", d: "Mass-produced in time for D-Day; it and blood plasma save hundreds of thousands of wounded.", ref: "penicillin" },
      { t: "The atomic bomb", d: "Two billion dollars, 125,000 workers, three years.", ref: "manhattan" }
    ],

    groups: [
      { c: "United Kingdom", side: "A" }, { c: "Soviet Union", side: "A" }, { c: "United States", side: "A" }, { c: "China", side: "A" }, { c: "France", side: "A" },
      { c: "Poland", side: "A" }, { c: "Yugoslavia", side: "A" }, { c: "Greece", side: "A" }, { c: "Crowns in exile", side: "A" }, { c: "Commonwealth & India", side: "A" }, { c: "Ethiopia", side: "A" },
      { c: "Germany", side: "B" }, { c: "Italy", side: "B" }, { c: "Japan", side: "B" }, { c: "Hungary", side: "B" }, { c: "Romania", side: "B" }, { c: "Bulgaria", side: "B" }, { c: "Finland", side: "B" }, { c: "Puppets & collaborators", side: "B" },
      { c: "Neutrals & the occupied", side: "N" }
    ],
    leaders: [
      { id: "george6", n: "George VI", c: "United Kingdom", r: "crown", t: "King-Emperor", s: "1936-12-11", house: "Windsor", d: "The reluctant king of the abdication stays in bombed London and becomes a symbol of endurance.", ww1: "A naval sub-lieutenant in a gun turret of HMS Collingwood at Jutland." },
      { id: "chamberlain", n: "Neville Chamberlain", c: "United Kingdom", r: "gov", t: "Prime Minister", s: "1937-05-28", e: "1940-05-10", d: "The man of Munich. Declares war in September 1939 and resigns on the day Hitler attacks in the west.", ww1: "Lord Mayor of Birmingham, then a frustrated Director of National Service." },
      { id: "churchill", n: "Winston Churchill", c: "United Kingdom", r: "gov", t: "Prime Minister", s: "1940-05-10", e: "1945-07-26", d: "'I felt as if I were walking with destiny.' Refuses to negotiate in May 1940 and mobilizes the English language. Voted out two months after victory.", ww1: "First Lord of the Admiralty in 1914; disgraced over Gallipoli; commanded a battalion in the trenches; Minister of Munitions." },
      { id: "montgomery", n: "Bernard Montgomery", c: "United Kingdom", r: "cmd", t: "Eighth Army · 21st Army Group", s: "1942-08-13", d: "Victor of El Alamein; commands the land forces on D-Day. Meticulous, vain, and never beaten.", ww1: "Shot through the lung at First Ypres, 1914; left for dead." },
      { id: "stalin", n: "Joseph Stalin", c: "Soviet Union", r: "gov", t: "General Secretary · Premier · Supreme Commander", s: "1922-04-03", d: "Shoots his own generals in 1937, signs with Hitler in 1939, is taken by surprise in 1941 — and ends the war as master of half of Europe.", ww1: "In Siberian exile until the February Revolution; rejected for the Tsar's army because of a damaged arm." },
      { id: "molotov", n: "Vyacheslav Molotov", c: "Soviet Union", r: "fig", t: "Foreign Minister", s: "1939-05-03", d: "Signs the pact with Ribbentrop; two years later it is his voice that tells the Soviet people they have been invaded." },
      { id: "zhukov", n: "Georgy Zhukov", c: "Soviet Union", r: "cmd", t: "Marshal · Deputy Supreme Commander", s: "1941-01-14", d: "Khalkhin Gol, Leningrad, Moscow, Stalingrad, Kursk, Berlin. Accepts the German surrender.", ww1: "A conscript cavalry NCO in the Tsar's army; twice awarded the Cross of St George." },
      { id: "fdr", n: "Franklin D. Roosevelt", c: "United States", r: "crown", t: "President", s: "1933-03-04", e: "1945-04-12", d: "Edges a reluctant nation toward war, then directs a global coalition from a wheelchair. Dies eighteen days before Hitler.", ww1: "Assistant Secretary of the Navy for the whole war." },
      { id: "truman", n: "Harry S. Truman", c: "United States", r: "crown", t: "President", s: "1945-04-12", d: "Vice-president for 82 days, never told about the bomb. Within four months he orders its use.", ww1: "Captain of Battery D, 129th Field Artillery, in the Meuse–Argonne." },
      { id: "eisenhower", n: "Dwight D. Eisenhower", c: "United States", r: "cmd", t: "Supreme Allied Commander, Europe", s: "1942-06-24", d: "A staff colonel in 1941, commander of Torch, Sicily and Overlord. His genius is making allies work together.", ww1: "Trained tank crews in Pennsylvania; the armistice came a week before he was due to sail." },
      { id: "macarthur", n: "Douglas MacArthur", c: "United States", r: "cmd", t: "Supreme Commander, Southwest Pacific", s: "1941-07-26", d: "'I shall return.' Driven from the Philippines in 1942, he does — and then rules occupied Japan.", ww1: "Chief of staff and brigade commander of the 42nd 'Rainbow' Division; seven Silver Stars." },
      { id: "nimitz", n: "Chester Nimitz", c: "United States", r: "cmd", t: "Commander-in-Chief, Pacific Fleet", s: "1941-12-31", d: "Takes over the wreck of Pearl Harbor and wins at Midway six months later.", ww1: "Chief of staff to the commander of the Atlantic submarine force." },
      { id: "chiang", n: "Chiang Kai-shek", c: "China", r: "gov", t: "Generalissimo", s: "1928-10-10", d: "Trades space for time, retreats a thousand miles up the Yangtze to Chongqing, and outlasts Japan. His wife's family are his finance and foreign ministers." },
      { id: "mao", n: "Mao Zedong", c: "China", r: "fig", t: "Chairman, Chinese Communist Party", s: "1935-01-17", d: "Fights a guerrilla war behind Japanese lines from Yan'an and ends the world war far stronger than he began it." },
      { id: "degaulle", n: "Charles de Gaulle", c: "France", r: "gov", t: "Leader of Free France", s: "1940-06-18", d: "An obscure brigadier who flies to London and announces on the BBC that 'France has lost a battle, but France has not lost the war.' Sentenced to death by Vichy.", ww1: "Wounded three times; captured at Verdun in 1916 and a prisoner for 32 months, attempting escape five times." },
      { id: "reynaud", n: "Paul Reynaud", c: "France", r: "gov", t: "Prime Minister", s: "1940-03-21", e: "1940-06-16", d: "Wants to fight on from North Africa; outvoted in cabinet, he resigns — and Pétain asks for an armistice." },
      { id: "sikorski", n: "Władysław Sikorski", c: "Poland", r: "gov", t: "Prime Minister in exile · C-in-C", s: "1939-09-30", e: "1943-07-04", d: "Rebuilds a Polish army in France, Britain and the USSR. Killed in an air crash at Gibraltar weeks after demanding an inquiry into Katyn.", ww1: "Organized the Polish Legions that fought under Austria for an independent Poland." },
      { id: "peter2", n: "Peter II", c: "Yugoslavia", r: "crown", t: "King of Yugoslavia", s: "1934-10-09", house: "Karađorđević", d: "Declared of age at 17 by the coup that overthrew his regent; in exile within three weeks. Never returns." },
      { id: "paul_yu", n: "Prince Paul", c: "Yugoslavia", r: "fig", t: "Prince Regent", s: "1934-10-09", e: "1941-03-27", house: "Karađorđević", d: "An Oxford-educated Anglophile who signs the Tripartite Pact under duress and is overthrown two days later." },
      { id: "tito", n: "Josip Broz Tito", c: "Yugoslavia", r: "cmd", t: "Leader of the Partisans", s: "1941-07-04", d: "Builds a guerrilla army of 800,000 and liberates his own country — the only Communist leader who owes Stalin nothing.", ww1: "A sergeant-major in the Austro-Hungarian army; wounded and captured by the Russians in 1915." },
      { id: "george2_gr", n: "George II", c: "Greece", r: "crown", t: "King of the Hellenes", s: "1935-11-25", house: "Glücksburg", d: "In exile in Cairo and London from 1941. A nephew of the last Kaiser." },
      { id: "metaxas", n: "Ioannis Metaxas", c: "Greece", r: "gov", t: "Prime Minister (dictator)", s: "1936-04-13", e: "1941-01-29", d: "A dictator with fascist trappings who answers Mussolini's 3 a.m. ultimatum with one word. Dies before the Germans come.", ww1: "The king's pro-German chief of staff; exiled when Greece joined the Allies." },
      { id: "haakon7b", n: "Haakon VII", c: "Crowns in exile", r: "crown", t: "King of Norway", s: "1905-11-18", house: "Glücksburg", d: "Tells his cabinet he will abdicate rather than appoint Quisling. His monogram, H7, is chalked on walls across occupied Norway." },
      { id: "wilhelmina2", n: "Wilhelmina", c: "Crowns in exile", r: "crown", t: "Queen of the Netherlands", s: "1890-11-23", house: "Orange-Nassau", d: "Broadcasts on Radio Oranje from London. Churchill calls her 'the only real man among the governments-in-exile'." },
      { id: "mackenzieking", n: "W. L. Mackenzie King", c: "Commonwealth & India", r: "gov", t: "Prime Minister of Canada", s: "1935-10-23", d: "Brings a united Canada into the war a week after Britain — by its own parliament's vote." },
      { id: "curtin", n: "John Curtin", c: "Commonwealth & India", r: "gov", t: "Prime Minister of Australia", s: "1941-10-07", e: "1945-07-05", d: "After Singapore, declares that 'Australia looks to America' and defies Churchill to bring his divisions home.", ww1: "Jailed briefly in 1916 for campaigning against conscription." },
      { id: "smuts", n: "Jan Smuts", c: "Commonwealth & India", r: "gov", t: "Prime Minister of South Africa", s: "1939-09-05", d: "The only man to sign the peace treaties ending both world wars.", ww1: "Conquered German South West Africa, commanded in East Africa, then sat in Lloyd George's War Cabinet." },
      { id: "gandhi", n: "Mohandas Gandhi", c: "Commonwealth & India", r: "fig", t: "Leader of the Indian National Congress", s: "1920-01-01", d: "Launches 'Quit India' in August 1942 and is jailed for two years, as 2.5 million Indians volunteer to fight.", ww1: "Recruited Indian soldiers for the British war effort in 1918." },
      { id: "haile", n: "Haile Selassie", c: "Ethiopia", r: "crown", t: "Emperor of Ethiopia", s: "1930-11-02", house: "Solomonic", d: "Warned the League in 1936: 'It is us today. It will be you tomorrow.' Restored to his throne by British and Ethiopian forces in 1941." },
      { id: "hitler", n: "Adolf Hitler", c: "Germany", r: "gov", t: "Führer and Reich Chancellor", s: "1933-01-30", e: "1945-04-30", d: "Dictator, supreme warlord from 1941, and author of the Holocaust. Shoots himself beneath Berlin as Soviet shells fall on the Chancellery.", ww1: "A lance-corporal and regimental runner in a Bavarian regiment on the Western Front; Iron Cross First Class; temporarily blinded by gas in October 1918." },
      { id: "goering", n: "Hermann Göring", c: "Germany", r: "cmd", t: "Reichsmarschall, head of the Luftwaffe", s: "1935-03-01", e: "1945-04-23", d: "Hitler's designated successor until he tries to succeed him. Cheats the Nuremberg hangman with cyanide.", ww1: "A 22-victory fighter ace; last commander of Richthofen's 'Flying Circus'." },
      { id: "himmler", n: "Heinrich Himmler", c: "Germany", r: "fig", t: "Reichsführer-SS", s: "1929-01-06", e: "1945-04-29", d: "Master of the SS, the Gestapo and the camps; the chief organizer of the genocide." },
      { id: "rommel", n: "Erwin Rommel", c: "Germany", r: "cmd", t: "Afrika Korps · Army Group B", s: "1941-02-12", e: "1944-10-14", d: "The 'Desert Fox'. Implicated in the July plot and offered a choice: poison and a state funeral, or a trial and his family's ruin.", ww1: "Won the Pour le Mérite as a lieutenant at Caporetto, capturing 9,000 Italians." },
      { id: "doenitz", n: "Karl Dönitz", c: "Germany", r: "cmd", t: "U-boat chief · Hitler's successor", s: "1939-09-01", d: "Directs the wolfpacks, then is named Reich President in Hitler's will and presides over the surrender for 23 days.", ww1: "A U-boat commander, sunk and captured in the Mediterranean in October 1918." },
      { id: "vittorio3b", n: "Victor Emmanuel III", c: "Italy", r: "crown", t: "King of Italy · 'Emperor of Ethiopia' · 'King of the Albanians'", s: "1900-07-29", house: "Savoy", d: "Appointed Mussolini in 1922 and dismisses him in 1943, then flees Rome and leaves his army without orders.", ww1: "The 'soldier king' who lived at the front for three years." },
      { id: "mussolini", n: "Benito Mussolini", c: "Italy", r: "gov", t: "Duce · Prime Minister", s: "1922-10-31", e: "1945-04-28", d: "Invented fascism and taught Hitler. Enters the war for 'a few thousand dead' to sit at the peace table; ends as Germany's puppet, shot by partisans and hung by his heels in Milan.", ww1: "A socialist editor turned interventionist; a Bersaglieri corporal wounded in a mortar accident in 1917." },
      { id: "ciano", n: "Galeazzo Ciano", c: "Italy", r: "fig", t: "Foreign Minister", s: "1936-06-09", e: "1943-02-06", d: "Signs the Pact of Steel, then votes to depose the Duce. His diary is the best inside account of the Axis." },
      { id: "badoglio", n: "Pietro Badoglio", c: "Italy", r: "gov", t: "Prime Minister", s: "1943-07-25", e: "1944-06-08", d: "Conqueror of Ethiopia; succeeds Mussolini, signs the armistice, and takes Italy over to the Allies.", ww1: "A corps commander blamed by many for the breakthrough at Caporetto — then deputy chief of staff." },
      { id: "hirohito", n: "Hirohito", c: "Japan", r: "crown", t: "Emperor of Japan (Shōwa)", s: "1926-12-25", house: "Yamato", d: "Sanctions the war and, in August 1945, breaks his government's deadlock to end it. Keeps his throne." },
      { id: "konoe", n: "Fumimaro Konoe", c: "Japan", r: "gov", t: "Prime Minister (1937–39, 1940–41)", s: "1937-06-04", e: "1941-10-18", d: "A prince who presides over the invasion of China and the Tripartite Pact, then resigns rather than go to war with America." },
      { id: "tojo", n: "Hideki Tojo", c: "Japan", r: "gov", t: "Prime Minister · War Minister", s: "1941-10-18", e: "1944-07-22", d: "'The Razor'. Takes Japan to war with the West and falls with Saipan. Hanged in 1948." },
      { id: "yamamoto", n: "Isoroku Yamamoto", c: "Japan", r: "cmd", t: "Commander, Combined Fleet", s: "1939-08-30", e: "1943-04-18", d: "Opposes war with America, which he knows from Harvard and Washington — then plans Pearl Harbor. Shot down over Bougainville after U.S. codebreakers read his itinerary." },
      { id: "horthy", n: "Miklós Horthy", c: "Hungary", r: "crown", t: "Regent of the Kingdom of Hungary", s: "1920-03-01", e: "1944-10-16", d: "An admiral without a navy, regent of a kingdom without a king. Halts the deportation of Budapest's Jews in July 1944; deposed by the SS when he tries to surrender.", ww1: "Commander of the Austro-Hungarian fleet; aide-de-camp to Emperor Franz Joseph." },
      { id: "michael1", n: "Michael I", c: "Romania", r: "crown", t: "King of Romania", s: "1940-09-06", house: "Hohenzollern-Sigmaringen", d: "At 22 he has the dictator Antonescu arrested in the palace and switches Romania to the Allies — shortening the war, by some estimates, by months." },
      { id: "carol2", n: "Carol II", c: "Romania", r: "crown", t: "King of Romania", s: "1930-06-08", e: "1940-09-06", house: "Hohenzollern-Sigmaringen", d: "The playboy king loses a third of his country to Stalin, Hungary and Bulgaria in one summer and abdicates." },
      { id: "antonescu", n: "Ion Antonescu", c: "Romania", r: "gov", t: "Conducător", s: "1940-09-05", e: "1944-08-23", d: "Military dictator; takes Romania into Russia and is responsible for the deaths of up to 380,000 Jews. Shot in 1946." },
      { id: "boris3", n: "Boris III", c: "Bulgaria", r: "crown", t: "Tsar of Bulgaria", s: "1918-10-03", e: "1943-08-28", house: "Saxe-Coburg and Gotha-Koháry", d: "'My generals are pro-German, my diplomats pro-British, my queen pro-Italian, my people pro-Russian. I alone am pro-Bulgarian.' Dies days after a stormy meeting with Hitler." },
      { id: "mannerheim", n: "C. G. E. Mannerheim", c: "Finland", r: "cmd", t: "Marshal of Finland · President from Aug 1944", s: "1939-11-30", d: "Commands in three wars — against Stalin twice, then against Hitler — and brings Finland out independent.", ww1: "A lieutenant-general in the Tsar's army, commanding Russian cavalry against Austria and Romania." },
      { id: "petain2", n: "Philippe Pétain", c: "Puppets & collaborators", r: "crown", t: "Chief of the French State (Vichy)", s: "1940-07-11", e: "1944-08-20", d: "At 84, 'makes France the gift of his person', signs the armistice and shakes Hitler's hand at Montoire. Condemned to death in 1945; de Gaulle commutes it.", ww1: "The saviour of Verdun and healer of the army in 1917." },
      { id: "laval", n: "Pierre Laval", c: "Puppets & collaborators", r: "gov", t: "Head of government, Vichy", s: "1942-04-18", e: "1944-08-20", d: "'I wish for a German victory.' Hands over foreign Jews — and their children — for deportation. Shot in 1945." },
      { id: "quisling", n: "Vidkun Quisling", c: "Puppets & collaborators", r: "gov", t: "'Minister-President' of occupied Norway", s: "1942-02-01", e: "1945-05-09", d: "Proclaims himself head of government by radio on the day of the invasion. His name becomes the word for traitor in a dozen languages." },
      { id: "puyi", n: "Puyi", c: "Puppets & collaborators", r: "crown", t: "Emperor of Manchukuo", s: "1934-03-01", e: "1945-08-17", house: "Aisin-Gioro", d: "The last emperor of China, enthroned as a child in 1908, re-enthroned by the Japanese army in its puppet state." },
      { id: "wang", n: "Wang Jingwei", c: "Puppets & collaborators", r: "gov", t: "Head of the Nanjing regime", s: "1940-03-30", e: "1944-11-10", d: "Sun Yat-sen's heir apparent and Chiang's great rival, who goes over to Japan to lead a collaborationist 'Republic of China'." },
      { id: "pavelic", n: "Ante Pavelić", c: "Puppets & collaborators", r: "gov", t: "Poglavnik of Croatia", s: "1941-04-10", e: "1945-05-08", d: "Head of the Ustaše terror state, whose camps murder Serbs, Jews and Roma with a savagery that shocks even German officers." },
      { id: "bose", n: "Subhas Chandra Bose", c: "Puppets & collaborators", r: "fig", t: "Head of 'Free India' and the Indian National Army", s: "1943-10-21", e: "1945-08-18", d: "A former president of the Indian National Congress who seeks India's freedom through Berlin and Tokyo and marches with the Japanese on Imphal." },
      { id: "franco", n: "Francisco Franco", c: "Neutrals & the occupied", r: "gov", t: "Caudillo of Spain", s: "1936-10-01", d: "Wins his civil war with German and Italian arms, then keeps Spain out of theirs. After meeting him, Hitler says he would rather have teeth pulled." },
      { id: "christian10b", n: "Christian X", c: "Neutrals & the occupied", r: "crown", t: "King of Denmark", s: "1912-05-14", house: "Glücksburg", d: "Stays in occupied Copenhagen and rides through it daily, alone and unguarded. Elder brother of Norway's exiled king." },
      { id: "leopold3", n: "Leopold III", c: "Neutrals & the occupied", r: "crown", t: "King of the Belgians", s: "1934-02-23", house: "Saxe-Coburg and Gotha", d: "Surrenders with his army rather than follow his ministers into exile — the opposite of his father's choice in 1914. It costs him his throne." },
      { id: "gustaf5b", n: "Gustaf V", c: "Neutrals & the occupied", r: "crown", t: "King of Sweden", s: "1907-12-08", house: "Bernadotte", d: "Neutral in both world wars. Sells Germany iron ore; shelters Denmark's Jews and Norway's refugees." },
      { id: "wilhelm2b", n: "Wilhelm II", c: "Neutrals & the occupied", r: "fig", t: "Former German Emperor, in exile at Doorn", s: "1918-11-10", e: "1941-06-04", house: "Hohenzollern", d: "Lives to see German troops occupy his Dutch refuge. Refuses Churchill's offer of asylum in Britain; cables Hitler his congratulations on the fall of Paris.", ww1: "The Kaiser." }
    ],
    ties: [
      { a: "churchill", b: "fdr", k: "ally", d: "The war's central partnership: eleven wartime meetings and an estimated 1,700 letters and telegrams, from the destroyers-for-bases deal to the Atlantic Charter to Overlord. Churchill: 'No lover ever studied every whim of his mistress as I did those of President Roosevelt.'" },
      { a: "churchill", b: "stalin", k: "ally", d: "A lifelong anti-Bolshevik allies himself with Stalin the day Hitler invades: 'If Hitler invaded Hell I would at least make a favourable reference to the Devil.' In October 1944 they divide the Balkans on a half-sheet of paper." },
      { a: "fdr", b: "stalin", k: "ally", d: "Roosevelt believes he can charm 'Uncle Joe' into a lasting peace. They meet twice, at Tehran and Yalta — both times on Stalin's terms." },
      { a: "stalin", b: "hitler", k: "rival", d: "Partners from August 1939 to June 1941 — they divide Poland and trade grain for machine tools — then mortal enemies in the bloodiest war ever fought. They never meet." },
      { a: "molotov", b: "stalin", k: "ally", d: "Stalin's most loyal lieutenant; signs the pact that bears his name on Stalin's orders." },
      { a: "hitler", b: "mussolini", k: "ally", d: "The Rome–Berlin Axis (1936) and the Pact of Steel (1939). Hitler never abandons his first model: in September 1943 he has SS paratroopers snatch the fallen Duce from a mountain-top prison." },
      { a: "hitler", b: "tojo", k: "ally", d: "Allies who never meet, never coordinate strategy, and share almost no intelligence. Hitler declares war on the United States four days after Pearl Harbor without being asked." },
      { a: "hitler", b: "franco", k: "patron", d: "Hitler's Condor Legion helps win Franco's war. At Hendaye in October 1940 Franco names his price for joining the Axis so high that Spain stays out." },
      { a: "hitler", b: "petain2", k: "patron", d: "The handshake at Montoire, 24 October 1940: 'I enter today on the path of collaboration.'" },
      { a: "hitler", b: "horthy", k: "patron", d: "Bullies the Regent into the war, occupies his country in March 1944, and in October kidnaps his son to force his abdication." },
      { a: "hitler", b: "antonescu", k: "ally", d: "The foreign leader Hitler trusts most — one of the very few told in advance about Barbarossa." },
      { a: "hitler", b: "boris3", k: "rival", d: "Boris refuses to send Bulgarian troops to Russia or to hand over Bulgaria's 48,000 Jews. He dies suddenly two weeks after their last, furious meeting in August 1943." },
      { a: "hitler", b: "mannerheim", k: "ally", d: "Hitler flies to Finland for the Marshal's 75th birthday in June 1942; a sound engineer secretly records eleven minutes of his normal speaking voice — the only such recording known." },
      { a: "hitler", b: "rommel", k: "patron", d: "Hitler's favourite general, built up by Goebbels into a legend — and forced to take poison in October 1944." },
      { a: "hitler", b: "goering", k: "rival", d: "Named successor in 1941; stripped of all offices and arrested in the last week for offering to take over." },
      { a: "hitler", b: "doenitz", k: "succ", d: "Hitler's political testament names the admiral, not a party man, as head of state." },
      { a: "hitler", b: "himmler", k: "ally", d: "'Der treue Heinrich' — until he secretly offers to surrender to the Western Allies in April 1945." },
      { a: "hitler", b: "chamberlain", k: "rival", d: "Three flights to Germany in September 1938, and a signed piece of paper. 'Our enemies are little worms,' Hitler tells his generals; 'I saw them at Munich.'" },
      { a: "hitler", b: "wilhelm2b", k: "rival", d: "The old Kaiser hopes the Nazis will restore the monarchy; Hitler despises him and forbids a state funeral in Germany." },
      { a: "chamberlain", b: "churchill", k: "succ", d: "Churchill opposes appeasement for years, then serves loyally in Chamberlain's war cabinet and succeeds him on 10 May 1940." },
      { a: "george6", b: "churchill", k: "ally", d: "The king wanted Halifax in May 1940. He and Churchill end up lunching alone every Tuesday for the rest of the war." },
      { a: "george6", b: "haakon7b", k: "family", d: "Nephew and uncle: Haakon's queen, Maud, was the sister of George V. The Norwegian king lives in exile in London and at Windsor." },
      { a: "haakon7b", b: "christian10b", k: "family", d: "Brothers. One refuses to surrender and fights on from exile; the other stays with his people under occupation." },
      { a: "george6", b: "peter2", k: "family", d: "Godfather and godson, and cousins through Queen Victoria. The teenage king spends his exile in England." },
      { a: "george6", b: "paul_yu", k: "marriage", d: "Paul's wife, Olga of Greece, is the sister of Marina, Duchess of Kent — George VI's sister-in-law. The British never forgive their friend 'Palsy' for signing with Hitler." },
      { a: "paul_yu", b: "peter2", k: "family", d: "Regent for his young cousin after King Alexander's assassination in 1934." },
      { a: "peter2", b: "michael1", k: "family", d: "First cousins — Peter's mother Maria was the sister of Carol II of Romania. Both are great-great-grandsons of Queen Victoria." },
      { a: "carol2", b: "michael1", k: "succ", d: "Father and son. Michael is king twice: as a child (1927–30) until his father returns to take the throne from him, and again when Carol is forced out in 1940." },
      { a: "michael1", b: "george2_gr", k: "family", d: "Nephew and uncle: Michael's mother, Queen Helen, is the Greek king's sister." },
      { a: "michael1", b: "antonescu", k: "rival", d: "On 23 August 1944 the 22-year-old king summons the dictator to the palace, has him locked in the vault that held the royal stamp collection, and broadcasts Romania's change of sides." },
      { a: "george2_gr", b: "wilhelm2b", k: "family", d: "Nephew of the Kaiser — his mother was Wilhelm's sister Sophia." },
      { a: "george2_gr", b: "george6", k: "family", d: "Second cousins, both great-grandsons of Christian IX of Denmark and of Queen Victoria." },
      { a: "vittorio3b", b: "boris3", k: "marriage", d: "Father-in-law and son-in-law: Boris married Princess Giovanna of Savoy in 1930." },
      { a: "vittorio3b", b: "leopold3", k: "marriage", d: "Leopold's sister Marie-José is married to Crown Prince Umberto of Italy — a Belgian princess in the Fascist court, and no friend of the regime." },
      { a: "vittorio3b", b: "mussolini", k: "rival", d: "For twenty-one years the king signs whatever the Duce puts before him. On 25 July 1943 he receives him at the Villa Savoia, dismisses him, and has him driven away in an ambulance under arrest." },
      { a: "vittorio3b", b: "haile", k: "rival", d: "Victor Emmanuel takes the title 'Emperor of Ethiopia' in 1936. Haile Selassie takes it back in 1941." },
      { a: "mussolini", b: "ciano", k: "marriage", d: "Father-in-law and son-in-law: Ciano married Edda Mussolini in 1930. He votes against the Duce in July 1943, and the Duce lets him be shot for it in January 1944." },
      { a: "mussolini", b: "badoglio", k: "succ", d: "The marshal who conquered Ethiopia for Mussolini replaces him and changes sides." },
      { a: "mussolini", b: "haile", k: "rival", d: "The invasion of Ethiopia in 1935, with bombers and mustard gas, is the Duce's 'place in the sun'." },
      { a: "mussolini", b: "metaxas", k: "rival", d: "The ultimatum of 28 October 1940. Mussolini promised Hitler he would 'break Greece's back'; the Greeks chase his army back into Albania." },
      { a: "hirohito", b: "tojo", k: "patron", d: "The emperor appoints the general prime minister in October 1941 and approves the decision for war on 1 December. After the war, Tojo takes the blame to shield him." },
      { a: "hirohito", b: "puyi", k: "patron", d: "Emperor and puppet emperor. Puyi's state visit to Tokyo in 1935 is choreographed as a meeting of equals; he is nothing of the kind." },
      { a: "hirohito", b: "macarthur", k: "patron", d: "In September 1945 the emperor calls on the general. MacArthur decides to keep him on the throne and rule Japan through him." },
      { a: "konoe", b: "tojo", k: "succ", d: "Konoe resigns when his war minister refuses any withdrawal from China as the price of peace with America. The war minister takes his place." },
      { a: "tojo", b: "yamamoto", k: "rival", d: "The admiral warned he could 'run wild for six months' and promised nothing after that. Midway came six months to the week after Pearl Harbor." },
      { a: "tojo", b: "bose", k: "patron", d: "Tojo gives Bose the Indian prisoners of Singapore to build his army, and the Andaman Islands for his government." },
      { a: "hitler", b: "bose", k: "patron", d: "Bose reaches Berlin in 1941 and is sent on to Japan by U-boat in 1943." },
      { a: "gandhi", b: "bose", k: "rival", d: "Bose resigned the Congress presidency in 1939 after Gandhi opposed his re-election; one chose non-violence, the other the Axis. Bose still called him 'Father of the Nation'." },
      { a: "gandhi", b: "churchill", k: "rival", d: "Churchill would not 'preside over the liquidation of the British Empire'. Gandhi asked him only to 'Quit India'." },
      { a: "chiang", b: "mao", k: "rival", d: "Civil-war enemies in an uneasy 'united front' against Japan from 1937. Chiang: 'The Japanese are a disease of the skin; the Communists are a disease of the heart.'" },
      { a: "chiang", b: "wang", k: "rival", d: "Rivals for Sun Yat-sen's mantle since 1925. Wang defects to Japan in 1938 believing resistance hopeless." },
      { a: "chiang", b: "fdr", k: "ally", d: "Roosevelt insists China be treated as one of the 'Four Policemen'. They meet once, at Cairo in November 1943." },
      { a: "degaulle", b: "petain2", k: "rival", d: "Pétain was de Gaulle's patron in the 1920s — de Gaulle ghost-wrote for him and named his son Philippe. In 1940 the Marshal's court sentences him to death; in 1945 de Gaulle commutes the Marshal's own death sentence." },
      { a: "degaulle", b: "churchill", k: "ally", d: "Churchill recognizes him as 'leader of all free Frenchmen' ten days after his broadcast, and spends four years exasperated by him: 'the heaviest cross I have to bear is the Cross of Lorraine.'" },
      { a: "degaulle", b: "fdr", k: "rival", d: "Roosevelt distrusts him as a would-be dictator and deals with Vichy and its admirals instead, until Paris settles the matter." },
      { a: "reynaud", b: "petain2", k: "succ", d: "Reynaud brings the Marshal into his cabinet to stiffen it. Pétain leads the armistice party and replaces him." },
      { a: "petain2", b: "laval", k: "ally", d: "The Marshal dismisses Laval in December 1940 and is forced by the Germans to take him back in 1942." },
      { a: "petain2", b: "franco", k: "ally", d: "Pétain was France's ambassador to Franco's Spain when he was called home in May 1940." },
      { a: "sikorski", b: "stalin", k: "rival", d: "Allies of necessity from 1941. When the mass graves of 22,000 murdered Polish officers are found at Katyn in April 1943 and Sikorski asks the Red Cross to investigate, Stalin breaks off relations." },
      { a: "sikorski", b: "churchill", k: "ally", d: "Churchill's most valued exile ally. 'Soldiers must die, but by their death they nourish the nation which gave them birth.'" },
      { a: "tito", b: "peter2", k: "rival", d: "The Communist partisan and the exiled king. Churchill backs Tito from 1943 because he kills more Germans; the monarchy is abolished in November 1945." },
      { a: "tito", b: "churchill", k: "ally", d: "Churchill sends his own son Randolph to Tito's headquarters. Asked if he worries about a Communist Yugoslavia: 'Do you intend to live there?'" },
      { a: "tito", b: "stalin", k: "rival", d: "Comrades in 1945, enemies by 1948 — Tito is the one Communist Stalin cannot bring to heel." },
      { a: "eisenhower", b: "montgomery", k: "rival", d: "Supreme Commander and his most difficult subordinate, at odds over broad front or single thrust all the way from Normandy to the Elbe." },
      { a: "eisenhower", b: "churchill", k: "ally", d: "They lunch together weekly in London and argue for hours — but Churchill never overrules him." },
      { a: "eisenhower", b: "zhukov", k: "ally", d: "The two supreme commanders meet in Berlin in June 1945 and become friends; Eisenhower visits Moscow that August and stands on Lenin's tomb." },
      { a: "macarthur", b: "nimitz", k: "rival", d: "Army and Navy cannot agree on a single commander for the Pacific, so there are two — and two roads to Tokyo." },
      { a: "macarthur", b: "eisenhower", k: "rival", d: "Eisenhower served seven years as MacArthur's aide in Washington and Manila: 'I studied dramatics under him.'" },
      { a: "fdr", b: "truman", k: "succ", d: "Roosevelt meets his last vice-president alone only twice. Truman is fully briefed on the atomic bomb nearly two weeks after taking the oath." },
      { a: "truman", b: "stalin", k: "rival", d: "They meet once, at Potsdam. 'I can deal with Stalin,' Truman writes. 'He is honest — but smart as hell.' Within two years they are adversaries." },
      { a: "stalin", b: "zhukov", k: "rival", d: "Stalin needs his best general and fears him. In 1946 he is exiled to a provincial command." },
      { a: "stalin", b: "mannerheim", k: "rival", d: "Stalin attacks Finland in 1939; in 1944 he lets it keep its independence — and its Marshal." },
      { a: "mannerheim", b: "wilhelm2b", k: "rival", d: "Mannerheim spent thirty years as an officer of the Tsar. In 1918 he resigned his Finnish command rather than accept the Kaiser's troops and a German prince as king of Finland." },
      { a: "horthy", b: "michael1", k: "rival", d: "Hungary and Romania are 'allies' who hate each other more than the enemy: in 1940 Hitler awards Horthy half of Transylvania at Romania's expense." },
      { a: "smuts", b: "churchill", k: "ally", d: "Enemies in the Boer War — Smuts interrogated the captured young Churchill in 1899 — and Churchill's most trusted adviser in two world wars." },
      { a: "curtin", b: "churchill", k: "rival", d: "In February 1942 Churchill diverts Australia's returning divisions toward Burma without asking. Curtin orders them home." },
      { a: "curtin", b: "macarthur", k: "ally", d: "Curtin places Australia's forces under an American general — a break with a century and a half of looking to London." },
      { a: "wilhelmina2", b: "wilhelm2b", k: "patron", d: "She gave him asylum in 1918. On 13 May 1940 she sails into exile; he stays behind at Doorn, now inside Hitler's empire." },
      { a: "leopold3", b: "wilhelmina2", k: "rival", d: "Neighbours invaded on the same morning, who make opposite choices: the queen leaves to fight on, the king stays as a prisoner." },
      { a: "gustaf5b", b: "christian10b", k: "ally", d: "In October 1943 neutral Sweden announces it will take every Jew in Denmark. Danes ferry more than 7,000 across the Øresund in fishing boats." },
      { a: "quisling", b: "haakon7b", k: "rival", d: "Hitler demands the king appoint Quisling prime minister. Haakon's 'No' on 10 April 1940 makes him the centre of Norwegian resistance." },
      { a: "pavelic", b: "mussolini", k: "patron", d: "Mussolini sheltered and financed the Ustaše in the 1930s — including the men who murdered Yugoslavia's king in 1934 — and installs Pavelić in Zagreb in 1941." },
      { a: "pavelic", b: "vittorio3b", k: "patron", d: "Pavelić offers the crown of Croatia to a prince of Savoy, the Duke of Spoleto — 'King Tomislav II', who never sets foot in his kingdom." },
      { a: "wang", b: "konoe", k: "patron", d: "Konoe's 1938 declaration of a 'New Order in East Asia' is the bait that draws Wang out of Chongqing." },
      { a: "himmler", b: "goering", k: "rival", d: "Rivals for the succession and for control of the police state. Both betray Hitler in the last week." }
    ],

    sources: [
      { n: "The National WWII Museum — Worldwide Deaths in World War II", u: "https://www.nationalww2museum.org/students-teachers/student-resources/research-starters/research-starters-worldwide-deaths-world-war" },
      { n: "The National WWII Museum — The Axis Powers of World War II", u: "https://www.nationalww2museum.org/war/articles/axis-powers-world-war-ii" },
      { n: "USHMM Holocaust Encyclopedia — Axis Alliance in World War II", u: "https://encyclopedia.ushmm.org/content/en/article/axis-alliance-in-world-war-ii" },
      { n: "USHMM Holocaust Encyclopedia — Axis Powers in World War II", u: "https://encyclopedia.ushmm.org/content/en/article/axis-powers-in-world-war-ii" },
      { n: "USHMM — Documenting Numbers of Victims of the Holocaust and Nazi Persecution", u: "https://encyclopedia.ushmm.org/content/en/article/documenting-numbers-of-victims-of-the-holocaust-and-nazi-persecution" },
      { n: "Encyclopaedia Britannica — World War II: Costs of the war", u: "https://www.britannica.com/event/World-War-II/Costs-of-the-war" },
      { n: "Wikipedia — World War II (orientation; individual battle articles linked on each record)", u: W + "World_War_II" },
      { n: "Wikipedia — World War II casualties (comparison of estimates)", u: W + "World_War_II_casualties" }
    ]
  };
})();
