/* ============================================================
   ARCHIVUS — WORLD WAR III: a projection (v19)
   What has been published about a war between great powers, arranged:
     · the Board    — the two camps on the map, what binds each country, and the five places it could start
     · the Road     — six rungs from the standing peace to the aftermath
     · the Balance  — money, warheads and men, camp against camp
     · the Cost     — wars fought and wars modelled on one scale; the price of a war for Taiwan
     · the Odds     — what the forecasters, the experts and the public say, for and against
     · Method & sources
   Data: src/data/ww3.js. The wars are read from src/data/conflicts.js, NATO's members, the arsenals and
   the straits from src/data/situation.js. Every line shows its grade and its source.
   Deep links:  ww3.html#v=board&k=taiwan   #c=Japan   #v=road   #v=odds
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc, el = K.svgEl;
  const D = window.ARCHIVUS_WW3, S = window.ARCHIVUS_SITUATION, CF = window.ARCHIVUS_CONFLICTS, LV = CF.levels;
  const SRC = Object.assign({}, CF.src, S.src, D.src), GR = D.grades, SD = D.sides;
  const CBY = {}; CF.list.forEach(c => { CBY[c.id] = c; });
  const KBY = {}; D.sparks.forEach(k => { KBY[k.id] = k; });
  const SHORT = { "United States of America": "United States", "Dem. Rep. Congo": "DR Congo", "Macedonia": "North Macedonia" }, nm = n => SHORT[n] || n;
  const ext = u => /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "";
  const srcA = k => { const s = SRC[k]; return s ? '<a href="' + esc(s[1]) + '"' + ext(s[1]) + ' title="' + esc(s[0]) + '">' + esc(/^https?:/.test(s[1]) ? K.host(s[1]) : s[0].split(" — ")[0]) + "</a>" : ""; };
  const srcIn = ks => (ks || []).map(srcA).filter(Boolean).join(" · ");
  const srcList = ks => '<div class="srcs">' + (ks || []).filter(k => SRC[k]).map(k => '<a href="' + esc(SRC[k][1]) + '"' + ext(SRC[k][1]) + ">" + esc(SRC[k][0]) + "<small>" + esc(SRC[k][2] || "") + "</small></a>").join("") + "</div>";
  const gtag = g => '<span class="gr" style="--c:' + GR[g][1] + '">' + GR[g][0] + "</span>";
  const line = r => '<div class="ln" style="--c:' + GR[r[0]][1] + '">' + gtag(r[0]) + "<p>" + esc(r[1]) + (r[2] && r[2].length ? ' <span class="sr">' + srcIn(r[2]) + "</span>" : "") + "</p></div>";

  /* what binds each country: NATO's members from the Situation, the rest from this file */
  const TIE = {};
  S.blocs.filter(b => b.id === "nato")[0].members.forEach(n => { TIE[n] = { n, side: "A", k: "treaty", what: D.natoTie[0], s: D.natoTie[1] }; });
  D.ties.forEach(t => { TIE[t[0]] = { n: t[0], side: t[1], k: t[2], what: t[3], s: t[4] }; });
  TIE["United States of America"].what = "The centre of the system: bound to 31 NATO allies and to Japan, South Korea, the Philippines, Australia and New Zealand";
  const NUKE = {}; S.nukes.list.forEach(r => { NUKE[r[0]] = r; });
  const WARS = {}; CF.list.forEach(c => (c.where || []).forEach(n => (WARS[n] = WARS[n] || []).push(c)));
  const SPEND = {}; ["A", "Aq", "B"].forEach(g => D.balance.spend[g].forEach(r => { SPEND[r[0]] = r; })); SPEND["United States of America"] = ["United States", 954];
  const known = n => TIE[n] || NUKE[n] || D.sparks.some(k => k.pulls.indexOf(n) >= 0);

  const st = { v: "board", k: null, c: null, nukes: 0, straits: 1 }, built = {};
  let tabs = null, map = null, marks = [];
  function sync(skip) { if (!skip) K.hash.write({ v: st.v, k: st.k, c: st.c }); tabs.paint(); renderSide(); render(); }
  function go(v) { if (tabs.ids.indexOf(v) >= 0) { st.v = v; sync(); } }
  function render() { ({ board: drawBoard, road: drawRoad, balance: drawBalance, cost: drawCost, odds: drawOdds, method: drawMethod })[st.v](); }

  /* ---------------- the board ---------------- */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const sink = (h, t) => { const a = hex(h), b = [21, 26, 39]; return "rgb(" + a.map((v, i) => Math.round(v * t + b[i] * (1 - t))).join(",") + ")"; };
  const X = lon => lon + 180, Y = lat => 90 - lat;
  function place() { if (!map) return; const s = map.scale(); for (let i = 0; i < marks.length; i++) marks[i][0].setAttribute("transform", "translate(" + marks[i][1] + " " + marks[i][2] + ") scale(" + s.toFixed(4) + " " + (s / map.SY).toFixed(4) + ")"); }
  function mark(g, lat, lon) { marks.push([g, X(lon).toFixed(2), Y(lat).toFixed(2)]); map.over.appendChild(g); return g; }
  function fill(n) {
    const t = TIE[n], k = st.k && KBY[st.k], in_ = k && k.pulls.indexOf(n) >= 0;
    if (k && !in_) return t ? sink(SD[t.side].c, 0.16) : null;                      /* a spark is chosen: everything it does not touch steps back */
    if (!t) return in_ ? sink("#e8c455", 0.62) : null;                              /* pulled in, bound to neither camp */
    return sink(SD[t.side].c, t.k === "treaty" || t.k === "core" ? (in_ ? 0.95 : 0.74) : (in_ ? 0.62 : 0.34));
  }
  function tipFor(iso, name) {
    if (name.charAt(0) === "@") { const v = name.slice(2);
      if (name.charAt(1) === "k") return "<b>" + esc(KBY[v].n) + "</b><small>" + (KBY[v].pct ? KBY[v].pct + "% of experts name it as the trigger" : "a flashpoint") + "</small>";
      if (name.charAt(1) === "s") { const s = S.straits.filter(x => x.id === v)[0]; return "<b>" + esc(s.n) + "</b><small>" + S.status[s.status][0] + "</small>"; }
      const r = S.nukes.list[+v]; return "<b>" + esc(nm(r[0])) + "</b><small>" + r[4].toLocaleString("en") + " warheads</small>"; }
    const t = TIE[name]; let h = "<b>" + esc(nm(name)) + "</b>";
    if (t) h += "<small>" + esc(SD[t.side].short) + " · " + esc(D.strength[t.k].toLowerCase()) + "</small>";
    if (NUKE[name]) h += "<small>" + NUKE[name][4].toLocaleString("en") + " nuclear warheads</small>";
    return h;
  }
  function drawBoard() {
    if (!built.board) { built.board = 1;
      const ident = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { ident[c.n] = c.n; });
      map = K.worldMap($("wb"), { map: ident, tip: K.tip($("wb-tip"), $("wb-wrap")), onView: place, tipFor,
        onPick: (name, t) => { const m = t && t.closest && t.closest(".w3-k[data-k]"); if (m) { st.k = st.k === m.dataset.k ? null : m.dataset.k; st.c = null; sync(); return fly(); }
          if (name && known(name)) { st.c = st.c === name ? null : name; return sync(); } if (st.c || st.k) { st.c = st.k = null; sync(); map.reset(); } } });
      $("wb-k").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; st.k = b.dataset.k || null; st.c = null; sync(); if (st.k) fly(); else map.reset(); });
      $("wb-lay").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st[b.dataset.l] = st[b.dataset.l] ? 0 : 1; sync(); } });
      $("wb-zi").onclick = () => map.zoomBy(1 / 1.6); $("wb-zo").onclick = () => map.zoomBy(1.6); $("wb-zr").onclick = () => map.reset();
      $("wb-road").addEventListener("click", e => { const b = e.target.closest("[data-r]"); if (b) { st.v = "road"; sync(); const c = $("rd-cols").children[+b.dataset.r]; if (c) c.scrollIntoView({ block: "nearest", inline: "center" }); } });
    }
    $("wb-k").innerHTML = '<button class="chipbtn' + (!st.k ? " on" : "") + '" data-k="">The whole board</button>' + D.sparks.map(k => '<button class="chipbtn' + (st.k === k.id ? " on" : "") + '" data-k="' + k.id + '" title="' + esc(k.line) + '">' + esc(k.n.replace(/^The /, "")) + (k.pct ? "<small>" + k.pct + "%</small>" : "") + "</button>").join("");
    $("wb-lay").innerHTML = '<button class="chipbtn' + (st.nukes ? " on" : "") + '" data-l="nukes" title="The nine nuclear arsenals">Arsenals</button><button class="chipbtn' + (st.straits ? " on" : "") + '" data-l="straits" title="The straits and chokepoints, from the Situation">Straits</button>';
    const sw = (c, t) => '<span><i style="background:' + c + '"></i>' + t + "</span>";
    $("wb-leg2").innerHTML = $("wb-leg").innerHTML = "<b>The two camps</b>" + sw(sink(SD.A.c, 0.74), "bound to the United States by treaty") + sw(sink(SD.A.c, 0.34), "armed and backed, no treaty") + sw(sink(SD.B.c, 0.74), "China, Russia, Iran, North Korea") + sw(sink(SD.B.c, 0.34), "bound to one of them")
      + '<span><svg viewBox="-9 -9 18 18"><circle r="6" fill="none" stroke="#ff2e55" stroke-width="2"/><circle r="2" fill="#ff2e55"/></svg>where it could start</span><small>Obligations, not sympathies. None of the four is bound to fight for the others, the two treaties of North Korea aside. ' + srcIn(["dp", "cnas"]) + "</small>";
    /* the same caveat beside the map's note, where it stays in view now that the legend is a strip */
    map.paint(fill); map.select(st.c && map.paths[st.c] ? st.c : null);
    marks = []; map.over.textContent = "";
    if (st.nukes) S.nukes.list.forEach((r, i) => { const g = el("g", { class: "w3-nk" }), R = 3 + Math.sqrt(r[4]) * 0.4;
      g.appendChild(el("circle", { r: R.toFixed(1), "data-n": "@n" + i })); g.appendChild(el("text", { x: 0, y: (R + 11).toFixed(1), "text-anchor": "middle" }, r[4].toLocaleString("en"))); mark(g, r[5], r[6]); });
    if (st.straits) S.straits.forEach(s => { const g = el("g", { class: "w3-sx" }), c = S.status[s.status][1]; g.appendChild(el("path", { d: "M0 -5.6L5.6 0L0 5.6L-5.6 0Z", stroke: c, "data-n": "@s" + s.id })); mark(g, s.at[0], s.at[1]); });
    D.sparks.forEach(k => { const c = CBY[k.cf], col = c ? LV[c.lv - 1].c : "#ff2e55", R = 8 + (k.pct || 6) / 3.4, g = el("g", { class: "w3-k" + (st.k === k.id ? " sel" : st.k ? " dim" : ""), "data-k": k.id }), tag = "@k" + k.id;
      g.appendChild(el("circle", { r: R.toFixed(1), class: "p", stroke: "#ff2e55" })); g.appendChild(el("circle", { r: R.toFixed(1), class: "o", stroke: "#ff2e55", fill: "#ff2e55", "data-n": tag })); g.appendChild(el("circle", { r: 3, class: "i", fill: col, "data-n": tag }));
      g.appendChild(el("text", k.at[1] > 100 ? { x: -(R + 5), y: 3.6, "text-anchor": "end" } : { x: R + 5, y: 3.6 }, k.n.replace(/^The /, "") + (k.pct ? " · " + k.pct + "%" : "")));
      mark(g, k.at[0], k.at[1]); });
    place();
    $("wb-road").innerHTML = D.road.map((r, i) => '<button class="rs ' + r[1] + '" data-r="' + i + '"><i>' + (i ? i : "0") + "</i><b>" + esc(r[0]) + "</b><small>" + (r[1] === "now" ? "where we stand" : "projected") + "</small></button>").join('<span class="ra">›</span>');
    $("wb-n").innerHTML = esc(D.meta.note) + " The camps are drawn from obligations, not sympathies: none of the four is bound to fight for the others, the two treaties of North Korea aside. " + srcIn(["dp", "cnas"]);
  }
  /* a spark is read on the whole world, because what matters is who else it lights: the map does not zoom in on it */
  function fly() { if (map) map.reset(); }

  /* ---------------- the road ---------------- */
  function drawRoad() {
    if (built.road) return; built.road = 1;
    $("rd-cols").innerHTML = D.road.map((r, i) => '<section class="rung ' + r[1] + '"><header><i>' + i + "</i><div><small>" + (r[1] === "now" ? "Where we stand · " + D.meta.asOf.slice(0, 4) : "Projected") + "</small><h4>" + esc(r[0]) + "</h4></div></header>" + r[2].map(line).join("") + "</section>").join("");
    $("rd-n").innerHTML = "Six rungs. Only the first is the present; the rest is what has been published about how such a war would go. " + Object.keys(GR).map(g => gtag(g)).join(" ");
  }

  /* ---------------- the balance ---------------- */
  function sideBar(blk) {
    const sum = a => a.reduce((s, r) => s + r[1], 0), A = sum(blk.A), B = sum(blk.B), Aq = sum(blk.Aq || []), mx = Math.max(A + Aq, B), fmt = v => v >= 100 ? Math.round(v).toLocaleString("en") : String(+v.toFixed(1));
    const seg = (r, cls) => '<i class="' + cls + '" style="flex:' + r[1] + '" title="' + esc(nm(r[0]) + ": " + fmt(r[1]) + (r[2] ? " (" + r[2] + ")" : "")) + '"><span>' + esc(nm(r[0]).replace("NATO, 32 members", "NATO")) + "</span></i>";
    const row = (side, rows, extra, tot) => '<div class="bb"><div class="bb-h" style="color:' + SD[side].c + '">' + esc(SD[side].short) + "<b>" + fmt(tot) + "</b></div><div class=\"bb-t\"><div class=\"bb-b " + side + '" style="width:' + ((tot + (side === "A" ? Aq : 0)) / mx * 100).toFixed(1) + '%">' + rows.map(r => seg(r, "s")).join("") + (extra || []).map(r => seg(r, "q")).join("") + "</div></div>"
      + '<div class="bb-l">' + rows.map(r => "<span><b>" + esc(nm(r[0])) + "</b> " + fmt(r[1]) + (r[2] ? " <small>" + esc(r[2]) + "</small>" : "") + "</span>").join("") + (extra && extra.length ? '<span class="q">no treaty: ' + extra.map(r => esc(r[0]) + " " + fmt(r[1])).join(", ") + "</span>" : "") + "</div></div>";
    return '<section class="bal"><h4>' + esc(blk.t) + "<small>" + esc(blk.unit) + '</small><em>' + (A / B >= 1.15 ? "the treaty system has " + (A / B).toFixed(1) + " times as much" : B / A >= 1.15 ? "the alignment has " + (B / A).toFixed(1) + " times as much" : "near parity: " + fmt(A) + " to " + fmt(B)) + "</em></h4>" + row("A", blk.A, blk.Aq, A) + row("B", blk.B, null, B) + '<p class="hint">' + esc(blk.note) + " " + srcIn(blk.s) + "</p></section>";
  }
  function drawBalance() {
    if (built.bal) return; built.bal = 1;
    const m = D.balance.men, mx = Math.max.apply(null, m.rows.map(r => r[1]));
    $("bl-pane").innerHTML = sideBar(D.balance.spend) + sideBar(D.balance.nukes)
      + '<section class="bal"><h4>' + esc(m.t) + "<small>" + esc(m.unit) + "</small></h4>" + m.rows.map(r => '<div class="mr"><span>' + esc(r[0]) + '</span><div class="bb-t"><i style="width:' + (r[1] / mx * 100).toFixed(1) + "%;background:" + (r[2] ? SD[r[2]].c : "#8d96af") + '"></i></div><b>' + r[1].toFixed(2).replace(/0$/, "") + "</b><small>" + esc(r[3]) + "</small></div>").join("") + '<p class="hint">' + esc(m.note) + " " + srcIn(m.s) + "</p></section>";
    const rows = [["The 32 members of NATO", "A", "treaty", D.natoTie[0], D.natoTie[1]]].concat(D.ties);
    $("bl-pane").innerHTML += '<section class="bal ties"><h4>What binds each country<small>the obligations the map is drawn from</small></h4><table><thead><tr><th>Country</th><th>Camp</th><th>How bound</th><th>By what</th><th>Source</th></tr></thead><tbody>'
      + rows.map(t => '<tr' + (TIE[t[0]] ? ' data-c="' + esc(t[0]) + '"' : "") + '><td class="nm">' + esc(nm(t[0])) + '</td><td style="color:' + SD[t[1]].c + '">' + esc(SD[t[1]].short) + "</td><td>" + esc(D.strength[t[2]]) + "</td><td>" + esc(t[3]) + '</td><td class="sr">' + srcIn(t[4]) + "</td></tr>").join("") + "</tbody></table></section>";
    $("bl-pane").addEventListener("click", e => { if (e.target.closest("a")) return; const r = e.target.closest("tr[data-c]"); if (r) { st.c = r.dataset.c; sync(); } });
    $("bl-n").innerHTML = "The camps as they are armed today. Solid segments are bound by treaty or are one of the four; faded ones are backed without a treaty.";
  }

  /* ---------------- the cost ---------------- */
  function drawCost() {
    if (built.cost) return; built.cost = 1;
    const C = D.cost, lg = v => Math.log10(v), L0 = 0, L1 = lg(10000), w = v => ((lg(v) - L0) / (L1 - L0) * 100).toFixed(1), mxg = 40;
    $("ct-pane").innerHTML = '<div class="grid2 even"><section class="bal"><h4>The dead: wars fought and wars modelled<small>millions of people · logarithmic</small></h4><div class="lgx">' + [1, 10, 100, 1000, 10000].map(v => '<span style="left:' + w(v) + '%">' + (v >= 1000 ? v / 1000 + " bn" : v + " m") + "</span>").join("") + "</div>"
      + C.dead.map(r => '<div class="cd ' + r[3] + '"><div class="cd-h"><b>' + esc(r[0]) + "</b><span>" + (r[1] === r[2] ? (r[1] >= 1000 ? "more than " + r[1] / 1000 + " billion" : "more than " + r[1] + " million") : r[1] + " – " + r[2] + " million") + '</span></div><div class="bb-t"><i class="hi" style="width:' + w(r[2]) + '%"></i><i class="lo" style="width:' + w(r[1]) + '%"></i></div><small>' + esc(r[4]) + " · " + srcIn(r[5]) + "</small></div>").join("")
      + '<p class="hint">' + esc(C.deadNote) + '</p><div class="sd-links"><a class="lnk" href="totalwar.html#v=toll">Every war by its dead, in Total War ⟶</a><a class="lnk" href="wars.html#w=ww2&v=cost">The cost of the Second World War, in the War Room ⟶</a></div></section>'
      + '<section class="bal"><h4>The price of a war for Taiwan<small>output lost in the first year</small></h4>' + C.gdp.map(r => '<div class="mr g"><span>' + esc(r[0]) + '</span><div class="bb-t"><i style="width:' + (-r[1] / mxg * 100).toFixed(1) + '%"></i></div><b>' + String(r[1]).replace("-", "−") + "%</b><small>" + esc(r[2] || "") + "</small></div>").join("") + '<p class="hint">' + esc(C.gdpNote) + " " + srcIn(C.gdpSrc) + "</p></section></div>";
    $("ct-n").innerHTML = "Two of these four were counted after the fact. The other two are models, and nothing has tested them.";
  }

  /* ---------------- the odds ---------------- */
  function drawOdds() {
    if (built.odds) return; built.odds = 1;
    const O = D.odds, li = r => "<li>" + esc(r[0]) + ' <span class="sr">' + srcIn(r[1]) + "</span></li>";
    $("od-pane").innerHTML = '<div class="gauges">' + O.gauges.map(g => '<div class="gg"><b>' + esc(g[0]) + "</b><p>" + esc(g[1]) + "</p>" + (g[4] != null ? '<div class="bb-t"><i style="width:' + g[4] + '%"></i></div>' : "") + "<small>" + esc(g[2]) + " · " + srcA(g[3]) + "</small></div>").join("") + "</div>"
      + '<div class="grid2 even fa"><section class="yes"><h4>What points toward it</h4><ul>' + O.yes.map(li).join("") + '</ul></section><section class="no"><h4>What points away</h4><ul>' + O.no.map(li).join("") + "</ul></section></div>"
      + '<section class="read"><h4>The Archive\'s reading<small>three statements, each with its grade and what it rests on</small></h4>' + O.reading.map(line).join("") + "</section>";
    $("od-n").innerHTML = "Surveys count opinions and forecasts average guesses. None of this is a measurement, and the page takes no side: both columns are given at the same length.";
  }

  /* ---------------- method ---------------- */
  function drawMethod() {
    if (built.mt) return; built.mt = 1;
    $("mt-pane").innerHTML = '<div class="grid2 even"><div class="col scroll"><h4>What this is, and is not</h4><p>A projection: an arrangement of what others have published about a war between great powers. It is not a prediction by the Archive, and it does not say such a war will happen. Where a line is somebody\'s judgement it names them; where nobody knows it says <i>open</i>.</p>'
      + "<h4>The grades</h4>" + Object.keys(GR).map(g => '<p class="gl">' + gtag(g) + " " + ({ is: "A fact about the present, with its date and source.", bound: "A treaty in force says so. Whether a state would honour it is a separate question, and is marked open where it matters.", assessed: "A named wargame, intelligence service, survey or model holds it. Wargames and models are simplified on purpose and have never been tested against the event.", open: "Nobody knows. These are the lines the outcome would turn on." })[g] + "</p>").join("")
      + "<h4>The two camps</h4><p>The map draws obligations, not sympathies. A country is painted for the treaty system only if a mutual-defence treaty with the United States is in force, or (paler) if the source describes it as armed and backed without one. The alignment is the four states the cited study treats as a group; it says plainly that they are not an alliance. Everyone else is left dark, which is most of the world: India, Brazil, Indonesia, most of Africa and of the Gulf.</p>"
      + "<h4>The sparks</h4><p>Five places, chosen because the survey of experts names their regions or because nuclear powers face each other there. The percentages are shares of those experts who expect a world war at all, not probabilities of war.</p>"
      + "<h4>What is left out</h4><p>Space, cyber and undersea cables: none of the sources read here quantifies them. Any war that starts somewhere not on the list. And the reply to every model: the people in it would be trying to stop.</p>"
      + '</div><div class="col scroll"><h4>Sources<small>' + Object.keys(D.src).length + " here; the wars' own are in the Conflicts and the Situation</small></h4>" + srcList(Object.keys(D.src)) + "</div></div>";
  }

  /* ---------------- the side panel ---------------- */
  const X_BTN = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button>';
  function sparkCard(k) {
    const c = CBY[k.cf], l = c && LV[c.lv - 1];
    return X_BTN + '<div class="sd-k" style="color:#ff2e55">Where it could start</div><div class="sd-t">' + esc(k.n) + '</div><p class="sd-p lead">' + esc(k.line) + '</p><p class="hint">' + esc(k.share) + " " + srcA("acgf") + "</p>"
      + (c ? '<a class="rel now" href="conflicts.html#v=map&i=' + c.id + '" style="border-left-color:' + l.c + '">Today: ' + esc(c.n.split(":")[0]) + "<i>level " + c.lv + " · " + l.name + " · open it in the Conflicts ⟶</i></a>" : "")
      + '<div class="sd-k">How it would widen</div>' + k.chain.map(line).join("")
      + '<div class="sd-k">Drawn in</div><div class="chips">' + k.pulls.map(n => '<button class="chipbtn" data-c="' + esc(n) + '"' + (TIE[n] ? ' style="border-color:' + SD[TIE[n].side].c + '"' : "") + ">" + esc(nm(n)) + "</button>").join("") + "</div>"
      + '<div class="sd-k">What has been worked out</div>' + k.figs.map(f => '<div class="loss"><b>' + esc(f[1]) + "</b><small>" + esc(f[0]) + " · " + srcA(f[2]) + "</small></div>").join("")
      + '<div class="sd-links"><button class="lnk" data-go="road">The road from here ⟶</button><button class="lnk" data-go="cost">The cost ⟶</button></div>';
  }
  function countryCard(n) {
    const t = TIE[n], nk = NUKE[n], sp = SPEND[n] || SPEND[nm(n)], ks = D.sparks.filter(k => k.pulls.indexOf(n) >= 0);
    let h = X_BTN + '<div class="sd-k"' + (t ? ' style="color:' + SD[t.side].c + '"' : "") + ">" + (t ? esc(SD[t.side].n) : "In neither camp") + '</div><div class="sd-t">' + esc(nm(n)) + "</div>";
    if (t) h += '<div class="loss"><b>' + esc(D.strength[t.k]) + "</b> " + esc(t.what) + ".<small>" + srcIn(t.s) + "</small></div>"; else h += '<p class="hint">No mutual-defence treaty with the United States, and not one of the four. Where a spark would draw it in, the chain says how.</p>';
    if (nk || sp) h += '<div class="dth">' + (sp ? "<div><span>Military spending, 2025</span><b>$" + sp[1] + " bn</b></div>" : "") + (nk ? "<div><span>Nuclear warheads</span><b>" + nk[4].toLocaleString("en") + "</b></div>" : "") + '</div><p class="hint">' + (sp ? srcA("milex") : "") + (sp && nk ? " · " : "") + (nk ? srcA("sipri") : "") + "</p>";
    if (ks.length) h += '<div class="sd-k">Drawn in by</div>' + ks.map(k => '<button class="rel" data-k="' + k.id + '" style="border-left-color:#ff2e55">' + esc(k.n) + "<i>" + esc(k.line) + "</i></button>").join("");
    if (WARS[n]) h += '<div class="sd-k">At war, or near it, today</div>' + WARS[n].map(c => '<a class="rel" href="conflicts.html#v=map&i=' + c.id + '" style="border-left-color:' + LV[c.lv - 1].c + '">' + esc(c.n) + "<i>" + c.lv + " · " + LV[c.lv - 1].name + "</i></a>").join("");
    return h + '<div class="sd-links"><a class="lnk" href="situation.html#v=board&c=' + encodeURIComponent(n) + '">Its whole situation ⟶</a>' + (st.v !== "board" ? '<button class="lnk" data-go="board">On the board ⟶</button>' : "") + "</div>";
  }
  function intro() {
    const T = { board: ["THE BOARD", "The two camps as treaties draw them, and the five places a war between them could start. Pick a place to see who it would draw in, and why; click a country for what binds it."],
                road: ["THE ROAD", "Six rungs from the standing peace to the aftermath. Only the first is the present."], balance: ["THE BALANCE", "Money, warheads and men, camp against camp."],
                cost: ["THE COST", "Wars that were fought and wars that have only been modelled, on one scale."], odds: ["THE ODDS", "What forecasters, experts and the public say, and the case each way."], method: ["METHOD", "What a projection is, what the grades mean, and every source."] }[st.v];
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + '</p><div class="q" style="border-color:#e8c455"><b style="color:#e8c455">A projection, not a prediction</b><span>Built from published wargames, treaties, assessments and forecasts, read on ' + D.meta.asOf.slice(8) + " November " + D.meta.asOf.slice(0, 4) + ". Every line shows its grade and its source.</span></div>"
      + '<div class="sd-k">The grades</div>' + Object.keys(GR).map(g => '<div class="gk">' + gtag(g) + "</div>").join("")
      + '<div class="sd-k">Where it could start</div>' + D.sparks.map(k => '<button class="rel" data-k="' + k.id + '" style="border-left-color:#ff2e55">' + esc(k.n) + "<i>" + (k.pct ? k.pct + "% of experts who expect a world war" : "nuclear powers face each other") + "</i></button>").join("")
      + '<div class="sd-links"><a class="lnk" href="totalwar.html">Every war before it, in Total War ⟶</a></div>';
  }
  function renderSide() {
    const side = $("dc-side"), html = st.c && known(st.c) ? countryCard(st.c) : st.k && KBY[st.k] ? sparkCard(KBY[st.k]) : null;
    if (!html && innerWidth <= 860) { side.hidden = true; return; }
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (html ? "" : " intro") + '">' + (html || intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read(); if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v; st.k = KBY[q.k] ? q.k : null; st.c = q.c && known(q.c) ? q.c : null; built.boot = 1; sync(true); if (st.v === "board" && st.k) setTimeout(fly, 80);
  }
  tabs = K.tabs(() => st.v, go);
  $("dc-side").addEventListener("click", e => {
    if (e.target.closest("a")) return; if (e.target.closest(".sd-x")) { if (st.c) st.c = null; else st.k = null; return sync(); }
    const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; return sync(); }
    const k = e.target.closest("button[data-k]"); if (k) {   /* <html> carries a data-k of its own (theme.js), so name the element */ st.k = k.dataset.k; st.c = null; st.v = "board"; sync(); return setTimeout(fly, 60); }
    const c = e.target.closest("[data-c]"); if (c) { st.c = c.dataset.c; sync(); }
  });
  document.addEventListener("keydown", e => { if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Escape" && (st.c || st.k)) { if (st.c) st.c = null; else st.k = null; sync(); } });
  const hay = D.sparks.map(k => [k.n.toLowerCase(), { label: k.n, sub: "Where it could start", t: "k", id: k.id }]).concat(Object.keys(TIE).concat(Object.keys(NUKE)).filter((n, i, a) => a.indexOf(n) === i).map(n => [(n + " " + nm(n)).toLowerCase(), { label: nm(n), sub: TIE[n] ? SD[TIE[n].side].short : "In neither camp", t: "c", id: n }]));
  K.finder($("dc-q"), q => hay.filter(h => h[0].indexOf(q) >= 0).map(h => h[1]), h => { st.v = "board"; if (h.t === "k") { st.k = h.id; st.c = null; } else st.c = h.id; sync(); if (h.t === "k") fly(); });
  let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); if (st.v === "board") drawBoard(); }, 140); });
  window.addEventListener("hashchange", applyHash);
  applyHash();
})();
