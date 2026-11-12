/* ============================================================
   ARCHIVUS — events7: THE WORLD WARS, bridged into the archive.
   ------------------------------------------------------------
   The War Room's datasets (wars-ww1.js / wars-ww2.js) are the
   single source of truth for the two world wars. This bridge
   lifts every item flagged `ar: [importance, theme, region,
   civ, related[]]` into ARCHIVUS_EVENTS, so the Chronicle,
   Atlas, Wheel, Astrolabe, Codex and Trial all gain the new
   records without a second copy of the text.

   It also publishes
     · ARCHIVUS_WAR_LINKS  event id → deep link into the War Room
     · two narrative tours (appended to ARCHIVUS_TOURS)
   Load order: after events*.js, geo.js, tours.js and (if the
   page uses it) assets/world2.js; after both wars-*.js files.
   ============================================================ */
(function () {
  "use strict";
  const WARS = window.ARCHIVUS_WARS || {};
  const EV = window.ARCHIVUS_EVENTS = window.ARCHIVUS_EVENTS || [];
  const GEO = window.ARCHIVUS_GEO = window.ARCHIVUS_GEO || {};
  const have = new Set(EV.map(e => e.id));
  const LINKS = window.ARCHIVUS_WAR_LINKS = { ww1: "wars.html#w=ww1", ww2: "wars.html#w=ww2" };
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const nice = iso => { const [y, m, d] = iso.split("-").map(Number); return d + " " + MONTHS[m - 1] + " " + y; };
  /* "26–30 August 1914", "21 February – 18 December 1916", "23 August 1942 – 2 February 1943" */
  const span = (a, b) => {
    if (!b || a === b) return nice(a);
    const A = a.split("-").map(Number), B = b.split("-").map(Number);
    if (A[0] === B[0] && A[1] === B[1]) return A[2] + "–" + B[2] + " " + MONTHS[B[1] - 1] + " " + B[0];
    if (A[0] === B[0]) return A[2] + " " + MONTHS[A[1] - 1] + " – " + B[2] + " " + MONTHS[B[1] - 1] + " " + B[0];
    return nice(a) + " – " + nice(b);
  };

  /* host country of a point, for the Atlas's "the nation catches fire" effect.
     world2.js stores each country as an SVG path on a 360×180 plane (x = lon+180, y = 90−lat). */
  const COUNTRIES = window.ARCHIVUS_COUNTRIES || null;
  const GC = window.ARCHIVUS_GEO_COUNTRY = window.ARCHIVUS_GEO_COUNTRY || {};
  let rings = null;
  function hostCountry(lat, lon) {
    if (!COUNTRIES) return null;
    if (!rings) rings = COUNTRIES.map((c, i) => ({ i, r: c.d.split("M").filter(Boolean).map(s => s.replace(/Z/g, "").split("L").map(p => p.trim().split(/[ ,]+/).map(Number))) }));
    const x = lon + 180, y = 90 - lat;
    for (const c of rings) for (const r of c.r) {
      let inside = false;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) return c.i;           /* world2.js keys its event→country table by index */
    }
    return null;
  }

  Object.values(WARS).forEach(w => {
    w.items.forEach(it => {
      const link = "wars.html#w=" + w.id + "&i=" + it.id;
      if (it.ref) { if (!LINKS[it.ref] || LINKS[it.ref].indexOf("&i=") < 0) LINKS[it.ref] = link; return; }
      if (!it.ar || have.has(it.id)) return;
      const y0 = +it.s.slice(0, 4), y1 = it.e ? +it.e.slice(0, 4) : y0;
      EV.push({
        id: it.id, title: it.n, startYear: y0, endYear: y1 !== y0 ? y1 : null, approximate: false,
        era: "worldwars", region: it.ar[2], civ: it.ar[3] || null, theme: it.ar[1], importance: it.ar[0],
        desc: it.d, source: it.u, related: (it.ar[4] || []).slice(),
        date: it.s, dateEnd: it.e || null,                       /* exact dates: used for ordering and display */
        dateLabel: span(it.s, it.e),
        war: w.id
      });
      have.add(it.id);
      GEO[it.id] = it.at;
      const host = hostCountry(it.at[0], it.at[1]);
      if (host != null) GC[it.id] = host;
      LINKS[it.id] = link;
    });
  });

  /* the parent records point at their children so the standing web lights up */
  const byId = Object.fromEntries(EV.map(e => [e.id, e]));
  const add = (id, kids) => { const e = byId[id]; if (e) kids.forEach(k => { if (byId[k] && e.related.indexOf(k) < 0) e.related.push(k); }); };
  add("ww1", ["marne1914", "verdun", "somme", "usentry1917", "armistice1918"]);
  add("ww2", ["poland1939", "falloffrance", "barbarossa", "pearlharbor", "veday", "vjday"]);
  /* drop any related id that does not resolve (keeps the archive at zero dangling threads) */
  EV.forEach(e => { if (e.war) e.related = e.related.filter(r => byId[r]); });

  /* exact dates for records the archive already held, so the Codex reads 1914, 1939 and 1945
     in true calendar order and the panels can show the day */
  const KNOWN = {
    franzferdinand: ["1914-06-28"], ww1: ["1914-07-28", "1918-11-11"], panama: ["1914-08-15"], armenian: ["1915-04-24"],
    russianrev: ["1917-03-08", "1917-11-07"], balfour: ["1917-11-02"], versailles: ["1919-06-28"], hitler33: ["1933-01-30"],
    guernica: ["1937-04-26"], sinojapanese: ["1937-07-07"], ww2: ["1939-09-01", "1945-09-02"], midway: ["1942-06-04", "1942-06-07"],
    stalingrad: ["1942-08-23", "1943-02-02"], dday: ["1944-06-06"], brettonwoods: ["1944-07-01", "1944-07-22"],
    bomb: ["1945-08-06", "1945-08-09"], indonesia: ["1945-08-17"], un: ["1945-10-24"], nuremberg: ["1945-11-20"]
  };
  Object.keys(KNOWN).forEach(id => {
    const e = byId[id], d = KNOWN[id];
    if (!e || e.date || +d[0].slice(0, 4) !== e.startYear) return;      /* never contradict the archive's own year */
    e.date = d[0]; e.dateEnd = d[1] || null;
    e.dateLabel = span(d[0], d[1]);
  });

  /* ---- two new narrative tours ---- */
  const T = window.ARCHIVUS_TOURS = window.ARCHIVUS_TOURS || [];
  const tour = (id, title, blurb, steps) => { if (!T.some(t => t.id === id)) T.push({ id, title, blurb, steps: steps.filter(s => byId[s.e]) }); };
  tour("great-war", "The Great War — Sarajevo to Versailles",
    "Thirty-seven days to start it, four years to fight it, five years to the day to sign it away.", [
      { e: "franzferdinand", n: "A wrong turn in Sarajevo puts the Archduke's car in front of Gavrilo Princip. Vienna wants Serbia crushed; Berlin writes a blank cheque." },
      { e: "ww1", n: "Russia mobilizes for Serbia, Germany for Austria, France for Russia. Germany's only plan runs through Belgium — and that brings in Britain." },
      { e: "marne1914", n: "Forty kilometres from Paris the plan fails. Both armies dig in from Switzerland to the sea. Open the War Room to watch the line freeze." },
      { e: "ypres2", n: "April 1915: a green-yellow cloud drifts over the Ypres salient. The chemist's war has begun." },
      { e: "gallipoli", n: "An attempt to go around the deadlock ends on the beaches of the Dardanelles — and makes Mustafa Kemal's name." },
      { e: "armenian", n: "Behind the Ottoman front, a government destroys one of its own peoples. The word 'genocide' will be coined with this in mind." },
      { e: "verdun", n: "Falkenhayn's idea is not to take ground but to kill Frenchmen. Three hundred days; three hundred thousand dead." },
      { e: "somme", n: "1 July 1916: 19,240 British soldiers dead by nightfall. In September, the first tanks crawl forward." },
      { e: "jutland", n: "The dreadnoughts meet once, for a few hours of fog and gunfire. The blockade holds; Germany begins to starve." },
      { e: "russianrev", n: "The weakest link snaps. The Tsar goes in March; in November, Lenin — delivered by German train — takes Russia out of the war." },
      { e: "usentry1917", n: "Germany gambles that U-boats can starve Britain before America matters. It is wrong by about six months." },
      { e: "brestlitovsk", n: "Russia signs away a third of its people. Fifty German divisions head west for one last throw." },
      { e: "springoffensive", n: "Spring 1918: stormtroopers break the trench lines open for the first time since 1914 — and run out of men." },
      { e: "hundreddays", n: "8 August, 'the black day of the German Army'. From here the Allies advance every day until the end." },
      { e: "armistice1918", n: "A railway carriage in the forest of Compiègne. 11 a.m., 11 November. Remember the carriage." },
      { e: "flu", n: "The troopships carry home a virus that will kill more people than the guns did." },
      { e: "versailles", n: "Five years to the day after Sarajevo. Marshal Foch reads the treaty: 'This is not peace. It is an armistice for twenty years.' He is off by sixty-five days." }
    ]);
  tour("second-world-war", "The Second World War — the Marco Polo Bridge to Tokyo Bay",
    "Two wars become one. Follow it from a skirmish outside Beijing to the deck of the Missouri.", [
      { e: "depression", n: "It starts with a stock-market crash. By 1932 six million Germans are out of work and listening to a man with a programme." },
      { e: "hitler33", n: "30 January 1933. Within eighteen months he is Führer; within six years he is at war." },
      { e: "sinojapanese", n: "July 1937: for China — and for many historians — the world war begins here, two years before Poland." },
      { e: "munich", n: "'Peace for our time.' Britain and France give Hitler the Sudetenland. He concludes they will never fight." },
      { e: "nazisovietpact", n: "The two great ideological enemies sign a pact and toast each other in the Kremlin. A secret map divides Poland." },
      { e: "poland1939", n: "1 September 1939. Poland is crushed between two invaders in five weeks." },
      { e: "falloffrance", n: "The army that held for four years in 1914 collapses in six weeks. Hitler has the 1918 railway carriage brought out for the signing." },
      { e: "battleofbritain", n: "One island left. The outcome is decided by a few hundred pilots and a chain of radar masts." },
      { e: "barbarossa", n: "22 June 1941: three million men cross the Soviet border. The war of annihilation that Hitler always wanted." },
      { e: "pearlharbor", n: "Japan strikes Hawaii; Hitler declares war on America. Now it is one war, and the Axis is hopelessly out-produced." },
      { e: "holocaust", n: "In the east the shooting pits give way to gas chambers. Six million Jews — two out of every three in Europe." },
      { e: "midway", n: "June 1942, the first of three turning points in eight months: four Japanese carriers in a day." },
      { e: "elalamein", n: "November 1942, the second: Rommel breaks in the Egyptian desert." },
      { e: "stalingrad", n: "February 1943, the third and greatest: a whole German army dies on the Volga." },
      { e: "dday", n: "6 June 1944. The second front Stalin has demanded for three years." },
      { e: "bagration", n: "Two weeks later, and four times the size: the Red Army destroys Army Group Centre." },
      { e: "yalta", n: "Three men in a Crimean palace draw the map of the next half-century." },
      { e: "berlin1945", n: "The red flag over the Reichstag. Hitler is dead in his bunker." },
      { e: "bomb", n: "6 and 9 August 1945. The war ends as the atomic age begins." },
      { e: "vjday", n: "Tokyo Bay, 2 September 1945. 'These proceedings are closed.'" },
      { e: "un", n: "Out of the wreckage: a second attempt at a parliament of nations — and a new kind of rivalry already forming. Open the War Room to see every front move." }
    ]);
})();
