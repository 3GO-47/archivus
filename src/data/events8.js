/* ============================================================
   ARCHIVUS — events8: THE DOCTRINES, bridged into the archive.
   ------------------------------------------------------------
   The Doctrines dataset (doctrines.js) is the single source of
   truth for the history of political ideas. This bridge lifts
   every node flagged `ar: [importance, theme, region, civ, title]`
   into ARCHIVUS_EVENTS under its archive id (`aid`), so the
   Chronicle, Atlas, Wheel, Astrolabe, Codex and Trial gain the
   Manifesto, Capital, the Internationals and the rest without a
   second copy of the text. Two records that belong to the
   doctrine's record in power (the Soviet famine, the Great
   Terror) are defined here.

   It also publishes
     · ARCHIVUS_DOCTRINE_LINKS  event id → deep link into the Doctrines
     · two narrative tours (appended to ARCHIVUS_TOURS)
   Load order: after events*.js (incl. events7.js), geo.js, tours.js,
   eras.js, assets/world2.js (if the page uses it) and doctrines.js.
   ============================================================ */
(function () {
  "use strict";
  const D = window.ARCHIVUS_DOCTRINES;
  if (!D || !D.nodes) return;
  const EV = window.ARCHIVUS_EVENTS = window.ARCHIVUS_EVENTS || [];
  const GEO = window.ARCHIVUS_GEO = window.ARCHIVUS_GEO || {};
  const GC = window.ARCHIVUS_GEO_COUNTRY = window.ARCHIVUS_GEO_COUNTRY || {};
  const ERAS = window.ARCHIVUS_ERAS || [];
  const COUNTRIES = window.ARCHIVUS_COUNTRIES || null;
  const LINKS = window.ARCHIVUS_DOCTRINE_LINKS = {};
  const have = new Set(EV.map(e => e.id));
  const eraOf = y => { const e = ERAS.find(x => y >= x.start && y < x.end); return e ? e.id : "revolutions"; };

  /* host country of a point (same test as events7.js) — world2.js keys countries by index */
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
      if (inside) return c.i;
    }
    return null;
  }
  function place(id, at) { GEO[id] = at; const h = hostCountry(at[0], at[1]); if (h != null) GC[id] = h; }

  /* threads to records the archive already holds */
  const EXTRA = {
    utopia1516: ["printing", "reformation"], equals1796: ["frrev", "napoleon"], burke1790: ["frrev", "glorious"],
    wollstonecraft1792: ["frrev", "suffrage"], proudhon1840: ["rev1848", "commune"],
    manifesto1848: ["rev1848", "industrial", "commune", "russianrev"], firstintl: ["commune", "rev1848"],
    capital1867: ["industrial", "wealthnations", "depression"], rerumnovarum: ["industrial"],
    bolshevik1903: ["russianrev"], comintern1919: ["russianrev", "chinarev", "versailles"],
    fasci1919: ["marchonrome", "ww1", "hitler33"], onecountry1924: ["russianrev", "sovietfamine", "greatterror"],
    longmarch: ["chinarev", "sinojapanese"], keynes1936: ["depression", "newdeal", "brettonwoods"],
    montpelerin1947: ["pinochet", "coldwar"], titostalin1948: ["coldwar", "nato"],
    secretspeech1956: ["coldwar", "prague68", "sputnik"], sinosoviet1960: ["greatleap", "culturalrev", "vietnam"]
  };
  const aidOf = id => { const n = D.nodes.find(x => x.id === id); return n ? (n.aid || n.ref || null) : null; };

  D.nodes.forEach(n => {
    const link = "doctrines.html#v=lineage&i=" + n.id;
    if (n.ref && !LINKS[n.ref]) LINKS[n.ref] = link;
    if (!n.ar) return;
    LINKS[n.aid] = link;
    if (have.has(n.aid)) return;
    const rel = (n.fr || []).map(f => aidOf(f[0])).concat(D.nodes.filter(k => (k.fr || []).some(f => f[0] === n.id)).map(k => k.aid || k.ref)).concat(EXTRA[n.aid] || []);
    EV.push({
      id: n.aid, title: n.ar[4] || n.n, startYear: n.yr, endYear: null, approximate: !!n.ap,
      era: eraOf(n.yr), region: n.ar[2], civ: n.ar[3] || null, theme: n.ar[1], importance: n.ar[0],
      desc: n.d, source: D.url(n.u), related: rel.filter(Boolean), doctrine: n.id
    });
    have.add(n.aid); place(n.aid, n.at);
  });

  /* the record in power — figures as ranges; see The Red Family for the sources and the dispute */
  [
    { id: "sovietfamine", title: "The Soviet famine", startYear: 1930, endYear: 1933, theme: "disease", region: "Europe", civ: "Soviet Union", importance: 6, at: [49.0, 32.0],
      desc: "Forced collectivisation and grain seizures starve the countryside: an estimated 5.7–8.7 million dead, most of them in Ukraine (the Holodomor) and Kazakhstan.",
      source: "https://en.wikipedia.org/wiki/Soviet_famine_of_1930%E2%80%931933", related: ["onecountry1924", "greatterror", "greatleap", "famine_ireland"], doctrine: "ml" },
    { id: "greatterror", title: "The Great Terror", startYear: 1936, endYear: 1938, theme: "law", region: "Europe", civ: "Soviet Union", importance: 6, at: [55.75, 37.62],
      desc: "Show trials for the Old Bolsheviks, quotas of arrests for everyone else: roughly 680,000 executions are recorded in the NKVD's own files for 1937–38, and the Red Army's officer corps is gutted on the eve of war.",
      source: "https://en.wikipedia.org/wiki/Great_Purge", related: ["onecountry1924", "sovietfamine", "ww2", "secretspeech1956"], doctrine: "ml" }
  ].forEach(r => {
    if (have.has(r.id)) return;
    EV.push({ id: r.id, title: r.title, startYear: r.startYear, endYear: r.endYear, approximate: false, era: eraOf(r.startYear), region: r.region, civ: r.civ,
      theme: r.theme, importance: r.importance, desc: r.desc, source: r.source, related: r.related, doctrine: r.doctrine });
    have.add(r.id); place(r.id, r.at);
    LINKS[r.id] = "doctrines.html#v=red&i=" + r.doctrine;
  });

  /* resolve threads: drop ids that do not exist, and let the older records point back */
  const byId = Object.fromEntries(EV.map(e => [e.id, e]));
  EV.forEach(e => { if (e.doctrine) e.related = e.related.filter((r, i, a) => byId[r] && r !== e.id && a.indexOf(r) === i); });
  const add = (id, kids) => { const e = byId[id]; if (e) kids.forEach(k => { if (byId[k] && e.related.indexOf(k) < 0) e.related.push(k); }); };
  add("rev1848", ["manifesto1848"]); add("commune", ["manifesto1848", "firstintl"]); add("russianrev", ["bolshevik1903", "comintern1919", "onecountry1924"]);
  add("frrev", ["burke1790", "wollstonecraft1792", "equals1796"]); add("industrial", ["manifesto1848", "capital1867"]);
  add("chinarev", ["longmarch"]); add("greatleap", ["sinosoviet1960"]); add("depression", ["keynes1936"]); add("marchonrome", ["fasci1919"]);
  add("suffrage", ["wollstonecraft1792"]); add("coldwar", ["secretspeech1956", "sinosoviet1960"]);

  /* ---- two narrative tours ---- */
  const T = window.ARCHIVUS_TOURS = window.ARCHIVUS_TOURS || [];
  const tour = (id, title, blurb, steps) => { if (!T.some(t => t.id === id)) T.push({ id, title, blurb, steps: steps.filter(s => byId[s.e]) }); };
  tour("red-thread", "The Red Thread — from the Manifesto to the Wall",
    "One pamphlet, a hundred and forty years, a third of humanity. Follow Marx's heirs through every split.", [
      { e: "industrial", n: "It starts in the mills. A new kind of wealth and a new kind of poverty appear in the same streets — and a young German clerk in Manchester takes notes." },
      { e: "manifesto1848", n: "February 1848: twenty-three pages printed in a London back street. 'A spectre is haunting Europe.' Almost nobody reads it." },
      { e: "rev1848", n: "The same week, Europe erupts. The revolutions fail; Marx goes into exile in London for the rest of his life." },
      { e: "firstintl", n: "1864: the workers' International. Marx writes its rules — and, eight years later, splits it rather than lose it to the anarchists." },
      { e: "capital1867", n: "Twenty years in the British Museum's reading room produce the book that claims to find capitalism's law of motion." },
      { e: "commune", n: "For 72 days Paris governs itself. Marx calls it the shape of workers' power; its slaughter teaches the next generation to arm." },
      { e: "bolshevik1903", n: "London, 1903. Russian exiles quarrel over one sentence of the party rules — and become Bolsheviks and Mensheviks." },
      { e: "ww1", n: "August 1914: the socialist parties vote for their own countries' war. The International dies in an afternoon." },
      { e: "russianrev", n: "October 1917. The party built for conspiracy takes an empire. Open the Doctrines to see what each rival made of it." },
      { e: "comintern1919", n: "Moscow founds a new International and gives every socialist party 21 conditions. Communists and Social Democrats part for good." },
      { e: "onecountry1924", n: "Lenin dies. Stalin says socialism can be built in one country; Trotsky says it cannot. The argument ends with an ice-axe in Mexico." },
      { e: "sovietfamine", n: "The peasants are driven into collective farms and their grain is taken. Millions starve." },
      { e: "greatterror", n: "Then the revolution eats its makers: nearly every old Bolshevik is shot as a traitor." },
      { e: "longmarch", n: "On the far side of Asia a defeated army walks 9,000 kilometres, and a peasant-based Marxism finds its leader." },
      { e: "chinarev", n: "1949: the most populous country on earth goes red. About a third of humanity now lives under communist parties." },
      { e: "titostalin1948", n: "The first heresy in power: Yugoslavia defies Moscow and is not struck down." },
      { e: "secretspeech1956", n: "Khrushchev tells the party what Stalin was. Months later his tanks are in Budapest." },
      { e: "greatleap", n: "Mao's shortcut to communism ends in the deadliest famine ever recorded." },
      { e: "sinosoviet1960", n: "The two giants denounce each other. There is no longer one communist movement but two, then many." },
      { e: "cubarev", n: "Ninety miles from Florida, a guerrilla band proves a revolution can be made without waiting for a party." },
      { e: "culturalrev", n: "Mao turns the young against his own party: revolution inside the revolution." },
      { e: "prague68", n: "Czechoslovakia tries socialism with a free press. Half a million soldiers answer." },
      { e: "chinareform", n: "Deng keeps the party and lets in the market. The largest communist state stops being what Marx described." },
      { e: "berlinwall", n: "1989: nobody shoots. The Wall opens." },
      { e: "ussrfall", n: "Christmas 1991: the red flag comes down over the Kremlin. Five party-states remain — and the argument about why." }
    ]);
  tour("left-and-right", "Left and Right — how the ideologies were born",
    "Liberal, conservative, socialist, fascist: every label on the compass was coined in answer to somebody else.", [
      { e: "locke", n: "Government exists by consent, to protect life, liberty and property. Liberalism has its charter." },
      { e: "wealthnations", n: "1776: Adam Smith argues that markets turn self-interest into the wealth of nations." },
      { e: "frrev", n: "1789: deputies who back the king sit on the right of the hall, their opponents on the left. Politics has had its map ever since." },
      { e: "burke1790", n: "An Irish Whig looks at Paris and writes the founding book of conservatism: do not tear down what you cannot rebuild." },
      { e: "wollstonecraft1792", n: "If rights belong to man by reason, then they belong to woman too." },
      { e: "equals1796", n: "Babeuf says legal equality is a fraud without equal property — and plots the first communist insurrection." },
      { e: "proudhon1840", n: "'Property is theft.' The first man to call himself an anarchist." },
      { e: "manifesto1848", n: "Marx and Engels gather the threads — German philosophy, British economics, French socialism — into one programme." },
      { e: "rerumnovarum", n: "The Pope answers both capital and Marx: property, yes — with duties. Christian democracy begins." },
      { e: "fasci1919", n: "A former socialist editor founds a movement against liberalism and Marxism at once. It takes its name from the rods of Roman magistrates." },
      { e: "keynes1936", n: "Capitalism can be managed. Social democrats and liberals share one economics for forty years." },
      { e: "montpelerin1947", n: "A few dozen scholars on a Swiss mountain decide the tide must be turned back toward markets. It takes them a generation." },
      { e: "berlinwall", n: "1989: one of the great quarrels seems settled. Open the Doctrines to see how many remain." }
    ]);
})();
