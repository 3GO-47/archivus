/* ============================================================
   ARCHIVUS — WORLD WAR III: a projection (v19; the line-ups, v20)
   What has been published about a war between great powers, arranged:
     · the Board    — the two camps on the map, what binds each country, and the five places it could start;
                      choose one and the map is repainted as that war's line-up: who fights, who backs, who hedges
     · the Line-ups — 44 countries against the five wars, and what the table shows when it is counted
     · the Road     — six rungs from the standing peace to the aftermath
     · the Balance  — money, warheads and men, camp against camp
     · the Cost     — wars fought and wars modelled on one scale; the price of a war for Taiwan
     · the Odds     — what the forecasters, the experts and the public say, for and against
     · Method & sources
   Data: src/data/ww3.js, and src/data/ww3-lineups.js for the presumed line-ups (the Archive's reading, marked as such). The wars are read from src/data/conflicts.js, NATO's members, the arsenals and
   the straits from src/data/situation.js. Every line shows its grade and its source.
   Deep links:  ww3.html#v=board&k=taiwan   #c=Japan   #v=lines&k=korea   #v=road   #v=odds
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc, el = K.svgEl;
  const D = window.ARCHIVUS_WW3, S = window.ARCHIVUS_SITUATION, CF = window.ARCHIVUS_CONFLICTS, LV = CF.levels;
  const LU = window.ARCHIVUS_WW3_LINEUPS, LS = LU.scen;
  const SRC = Object.assign({}, CF.src, S.src, D.src, LU.src), GR = D.grades, SD = D.sides;
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
  const known = n => TIE[n] || NUKE[n] || LU.order.indexOf(n) >= 0 || D.sparks.some(k => k.pulls.indexOf(n) >= 0);

  /* ---------------- the line-ups: presumed, and counted ----------------
     A role is two characters: what it does (G a principal, one of the states the war is between; F fights beside one, B backs, H hedges, O stays out) and for which side (1 or 2).
     The colours are the two sides of THAT war, not the two camps of the Board: in the fifth war side one is India. */
  const C1 = "#5b9be0", C2 = "#e0502f", CH = "#e8c455", CO = "#8d96af", WD = { G: "At war", F: "Fights", B: "Backs", H: "Hedges", O: "·" };
  const sideOf = r => +r.charAt(1) || 0, rcol = r => r === "H" ? CH : r === "O" ? CO : sideOf(r) === 1 ? C1 : C2, cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const rline = (k, r) => { const L = LS[k], a = r.charAt(0), me = L.short[sideOf(r) - 1], them = L.short[2 - sideOf(r)];
    return a === "H" ? "Hedges between the two" : a === "O" ? "Stays out" : a === "G" ? "A principal: the war is its own" : a === "F" ? "Fights " + them : "Backs " + me + ", does not fight"; };
  const fm = c => '<em class="fm fm-' + c + '" title="' + esc(LU.firm[c][1]) + '">' + LU.firm[c][0] + "</em>";
  const TL = {}; D.sparks.forEach(k => { const L = LS[k.id], t = { by: {}, firm: { b: 0, i: 0, p: 0, o: 0 }, in_: 0, w: [0, 0] };
    LU.order.forEach(n => { const w = L.who[n], r = w[0], a = r.charAt(0); (t.by[r] = t.by[r] || []).push(n); if (a !== "O" && a !== "H") { t.in_++; t.firm[w[2]]++; } if ((a === "F" || a === "G") && NUKE[n]) t.w[sideOf(r) - 1] += NUKE[n][4]; });
    const c = r => (t.by[r] || []).length; t.f = [c("G1") + c("F1"), c("G2") + c("F2")]; t.b = [c("B1"), c("B2")]; t.h = c("H"); t.o = c("O"); TL[k.id] = t; });
  const tallyRow = k => { const t = TL[k]; return '<div class="lu-t"><div style="--c:' + C1 + '"><b>' + t.f[0] + "</b> fight<br><b>" + t.b[0] + '</b> back</div><i>against</i><div style="--c:' + C2 + '"><b>' + t.f[1] + "</b> fight" + (t.f[1] === 1 ? "s" : "") + "<br><b>" + t.b[1] + '</b> back</div><div style="--c:' + CH + '"><b>' + t.h + "</b> hedge<br><b>" + t.o + "</b> stay out</div></div>"; };

  const st = { v: "board", k: null, c: null, nukes: 0, straits: 1 }, built = {};
  let tabs = null, map = null, marks = [];
  function sync(skip) { if (!skip) K.hash.write({ v: st.v, k: st.k, c: st.c }); tabs.paint(); renderSide(); render(); }
  function go(v) { if (tabs.ids.indexOf(v) >= 0) { st.v = v; sync(); } }
  function render() { ({ board: drawBoard, lines: drawLines, road: drawRoad, balance: drawBalance, cost: drawCost, odds: drawOdds, method: drawMethod })[st.v](); }

  /* ---------------- the board ---------------- */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const sink = (h, t) => { const a = hex(h), b = [21, 26, 39]; return "rgb(" + a.map((v, i) => Math.round(v * t + b[i] * (1 - t))).join(",") + ")"; };
  const X = lon => lon + 180, Y = lat => 90 - lat;
  function place() { if (!map) return; const s = map.scale(); for (let i = 0; i < marks.length; i++) marks[i][0].setAttribute("transform", "translate(" + marks[i][1] + " " + marks[i][2] + ") scale(" + s.toFixed(4) + " " + (s / map.SY).toFixed(4) + ")"); }
  function mark(g, lat, lon) { marks.push([g, X(lon).toFixed(2), Y(lat).toFixed(2)]); map.over.appendChild(g); return g; }
  function fill(n) {
    const t = TIE[n], k = st.k && KBY[st.k], in_ = k && k.pulls.indexOf(n) >= 0;
    if (k && LS[k.id]) { const w = LS[k.id].who[n]; if (!w) return null;             /* a war is chosen: the map is its line-up, not the two camps */
      const a = w[0].charAt(0); return a === "O" ? sink(CO, 0.13) : a === "H" ? sink(CH, 0.5) : sink(rcol(w[0]), a === "G" ? 1 : a === "F" ? 0.8 : 0.36); }
    if (k && !in_) return t ? sink(SD[t.side].c, 0.16) : null;
    if (!t) return in_ ? sink("#e8c455", 0.62) : null;                              /* pulled in, bound to neither camp */
    return sink(SD[t.side].c, t.k === "treaty" || t.k === "core" ? (in_ ? 0.95 : 0.74) : (in_ ? 0.62 : 0.34));
  }
  function tipFor(iso, name) {
    if (name.charAt(0) === "@") { const v = name.slice(2);
      if (name.charAt(1) === "k") return "<b>" + esc(KBY[v].n) + "</b><small>" + (KBY[v].pct ? KBY[v].pct + "% of experts name it as the trigger" : "a flashpoint") + "</small>";
      if (name.charAt(1) === "s") { const s = S.straits.filter(x => x.id === v)[0]; return "<b>" + esc(s.n) + "</b><small>" + S.status[s.status][0] + "</small>"; }
      const r = S.nukes.list[+v]; return "<b>" + esc(nm(r[0])) + "</b><small>" + r[4].toLocaleString("en") + " warheads</small>"; }
    const t = TIE[name]; let h = "<b>" + esc(nm(name)) + "</b>";
    const w = st.k && LS[st.k] && LS[st.k].who[name]; if (w) return h + "<small>" + esc(rline(st.k, w[0])) + " · " + LU.firm[w[2]][0].toLowerCase() + "</small><small>" + esc(w[1]) + "</small>";
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
    const flash = '<span><svg viewBox="-9 -9 18 18"><circle r="6" fill="none" stroke="#ff2e55" stroke-width="2"/><circle r="2" fill="#ff2e55"/></svg>where it could start</span>', Lk = st.k && LS[st.k];
    if (Lk) $("wb-leg2").innerHTML = $("wb-leg").innerHTML = "<b>" + esc(Lk.tag) + ": the line-up</b>" + sw(sink(C1, 0.9), "fights " + esc(Lk.short[1])) + sw(sink(C1, 0.36), "backs " + esc(Lk.short[0])) + sw(sink(C2, 0.9), "fights " + esc(Lk.short[0])) + sw(sink(C2, 0.36), "backs " + esc(Lk.short[1])) + sw(sink(CH, 0.5), "hedges") + sw(sink(CO, 0.22), "stays out")
      + "<small>Presumed: the Archive's reading of treaties, bases and the record, not a forecast. It rests on " + srcIn(Lk.basis) + ". Hover a country for its reason.</small>";
    else $("wb-leg2").innerHTML = $("wb-leg").innerHTML = "<b>The two camps</b>" + sw(sink(SD.A.c, 0.74), "bound to the United States by treaty") + sw(sink(SD.A.c, 0.34), "armed and backed, no treaty") + sw(sink(SD.B.c, 0.74), "China, Russia, Iran, North Korea") + sw(sink(SD.B.c, 0.34), "bound to one of them")
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
    if (Lk) $("wb-n").innerHTML = "<b>" + esc(cap(Lk.short[0])) + " against " + esc(Lk.short[1]) + ".</b> The map is this war's presumed line-up: who fights, who backs without fighting, who hedges, who stays out. Hover a country for the reason; the panel has all 44. " + '<span class="gr" style="--c:#e8c455">presumed</span>';
    else $("wb-n").innerHTML = esc(D.meta.note) + " The camps are drawn from obligations, not sympathies: none of the four is bound to fight for the others, the two treaties of North Korea aside. " + srcIn(["dp", "cnas"]);
  }
  /* a spark is read on the whole world, because what matters is who else it lights: the map does not zoom in on it */
  function fly() { if (map) map.reset(); }

  /* ---------------- the line-ups ----------------
     Five wars across, 44 countries down. Above the table, what it shows when it is counted: nothing here is typed in,
     every number and name in the four cards is computed from the table, so a changed row changes the finding. */
  function drawLines() {
    const ks = D.sparks, pane = $("lu-pane"), num = v => v.toLocaleString("en"), tag = k => LS[k.id].tag, the = n => (/^United/.test(nm(n)) ? "the " : "") + nm(n), words = ["none", "one", "two", "three", "four", "five"], list = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
    if (!built.lines) { built.lines = 1;
      pane.addEventListener("click", e => { if (e.target.closest("a")) return; const b = e.target.closest("button"); if (!b) return; const k = b.dataset.k, c = b.dataset.c;
        if (k && c) { st.k = k; st.c = c; } else if (k) { st.k = st.k === k ? null : k; st.c = null; } else if (c) st.c = st.c === c ? null : c; sync(); }); }
    const seg = (v, c, o) => v ? '<i style="flex:' + v + ";background:" + c + ";opacity:" + o + '"></i>' : "";
    const card = k => { const L = LS[k.id], t = TL[k.id], cf = CBY[k.cf];
      return '<button class="lu-s' + (st.k === k.id ? " on" : "") + '" data-k="' + k.id + '"><small>' + (cf && cf.lv >= 4 ? "being fought now" : k.pct ? k.pct + "% of experts name it" : "nuclear powers face each other") + "</small><h4>" + esc(L.tag) + '</h4><p class="vs"><b style="color:' + C1 + '">' + esc(cap(L.short[0])) + '</b><i>against</i><b style="color:' + C2 + '">' + esc(cap(L.short[1])) + "</b></p>"
        + '<div class="lu-bar">' + seg(t.f[0], C1, 1) + seg(t.b[0], C1, 0.42) + seg(t.h, CH, 0.75) + seg(t.o, CO, 0.2) + seg(t.b[1], C2, 0.42) + seg(t.f[1], C2, 1) + "</div>"
        + '<dl><div><dt>Fight</dt><dd><b style="color:' + C1 + '">' + t.f[0] + '</b> · <b style="color:' + C2 + '">' + t.f[1] + '</b></dd></div><div><dt>Back</dt><dd><b style="color:' + C1 + '">' + t.b[0] + '</b> · <b style="color:' + C2 + '">' + t.b[1] + "</b></dd></div><div><dt>Hedge</dt><dd><b style=\"color:" + CH + '">' + t.h + "</b></dd></div><div><dt>Warheads in the fight</dt><dd>" + num(t.w[0]) + " · " + num(t.w[1]) + "</dd></div><div><dt>Bound by treaty</dt><dd>" + t.firm.b + " of " + t.in_ + "</dd></div></dl></button>"; };
    /* 1 · how much is written down */
    const best = ks.slice().sort((a, b) => TL[b.id].firm.b / TL[b.id].in_ - TL[a.id].firm.b / TL[a.id].in_)[0], none = ks.filter(k => !TL[k.id].firm.b).map(tag), FC = { b: "#e8c455", i: "#49c9b8", p: "#8d96af", o: "#b48ef0" };
    const cA = '<section class="bal lu-i"><h4>How much of it is written down<em>' + esc(tag(best)) + ": " + TL[best.id].firm.b + " of the " + TL[best.id].in_ + " taking part are bound by a treaty text. " + (none.length ? esc(list(none)) + " bind" + (none.length === 1 ? "s" : "") + " no one at all." : "") + "</em></h4>"
      + ks.map(k => { const t = TL[k.id]; return '<div class="mr fq"><span>' + esc(tag(k)) + '</span><div class="lu-bar">' + ["b", "i", "p", "o"].map(c => seg(t.firm[c], FC[c], 1)).join("") + "</div><b>" + t.firm.b + "/" + t.in_ + "</b></div>"; }).join("")
      + '<p class="hint">' + ["b", "i", "p", "o"].map(c => '<i class="dot" style="background:' + FC[c] + '"></i>' + LU.firm[c][0].toLowerCase() + ": " + LU.firm[c][1]).join(" &nbsp; ") + ". Of those who fight or back; hedgers and bystanders are not counted.</p></section>";
    /* 2 · the open questions */
    const open = []; ks.forEach(k => LU.order.forEach(n => { const w = LS[k.id].who[n]; if (w[2] === "o") open.push([n, k, w]); }));
    const oc = {}; open.forEach(o => { oc[o[0]] = (oc[o[0]] || 0) + 1; }); const top = Object.keys(oc).sort((a, b) => oc[b] - oc[a])[0];
    const cB = '<section class="bal lu-i lu-open"><h4>The decisions nobody can call<em>' + open.length + " rows in the table are open" + (oc[top] > 1 ? ", and " + esc(the(top)) + " is " + words[oc[top]] + " of them" : "") + ". Each says on what it turns.</em></h4>"
      + '<div class="lu-qs">' + open.map(o => '<button class="lu-q" data-k="' + o[1].id + '" data-c="' + esc(o[0]) + '"><b>' + esc(nm(o[0])) + "</b><small>" + esc(tag(o[1])) + "</small><span>" + esc(o[2][1]) + "</span></button>").join("") + "</div></section>";
    /* 3 · the four, for one another */
    const four = Object.keys(TIE).filter(n => TIE[n].k === "core"), theirs = ks.filter(k => four.indexOf((TL[k.id].by.G2 || [])[0]) >= 0); let called = 0; const fought = [];
    theirs.forEach(k => four.forEach(n => { const r = LS[k.id].who[n][0]; if (r === "B2" || r === "F2") called++; if (r === "F2") fought.push(nm(n) + ", for " + nm(TL[k.id].by.G2[0])); }));
    const cell = (k, c) => { const w = LS[k.id].who[c], r = w[0], a = r.charAt(0); return '<button class="lc r' + a + " s" + sideOf(r) + (st.k === k.id ? " cl" : "") + (st.k === k.id && st.c === c ? " on" : "") + '" data-k="' + k.id + '" data-c="' + esc(c) + '" title="' + esc(nm(c) + ", " + tag(k) + ": " + rline(k.id, r) + " (" + LU.firm[w[2]][0].toLowerCase() + "). " + w[1]) + '"><span class="w">' + WD[a] + '</span><span class="l">' + (a === "O" ? "·" : a === "G" ? "W" : a) + "</span>" + ({ b: "<sup>§</sup>", i: "<sup>•</sup>", o: "<sup>?</sup>", p: "" })[w[2]] + "</button>"; };
    const head = '<div class="lm-h"><span></span>' + ks.map(k => '<button data-k="' + k.id + '"' + (st.k === k.id ? ' class="on"' : "") + ' title="' + esc(cap(LS[k.id].short[0]) + " against " + LS[k.id].short[1]) + '"><span class="w">' + esc(tag(k)) + '</span><span class="l">' + esc(tag(k).replace("India–Pakistan", "Ind–Pak")) + "</span></button>").join("") + "</div>";
    const rows = a => a.map(c => '<div class="lm-r' + (st.c === c ? " on" : "") + '"><button class="nm" data-c="' + esc(c) + '" title="' + esc(nm(c)) + '">' + esc(nm(c).replace("United Arab Emirates", "UAE")) + "</button>" + ks.map(k => cell(k, c)).join("") + "</div>").join("");
    const cC = '<section class="bal lu-i"><h4>The four, for one another<em>In the ' + theirs.length + " wars that one of them fights, the others are called on " + called + " times and fight " + (fought.length === 1 ? "once" : fought.length + " times") + (fought.length ? ": " + esc(list(fought)) : "") + '.</em></h4><div class="lm mini">' + head + rows(four) + '</div><p class="hint">The study the Board cites calls them an alignment and not an alliance; counted row by row, that is what the table shows. ' + srcIn(["cnas", "kt"]) + "</p></section>";
    /* 4 · who is in how many */
    const cnt = {}; LU.order.forEach(n => { const c = cnt[n] = { F: 0, B: 0, H: 0, O: 0 }; ks.forEach(k => { const a = LS[k.id].who[n][0].charAt(0); c[a === "G" ? "F" : a]++; }); });
    const rank = (key, min) => LU.order.filter(n => cnt[n][key] >= min).sort((a, b) => cnt[b][key] - cnt[a][key]), F = rank("F", 1), Fn = cnt[F[0]].F, F2n = F.filter(n => cnt[n].F < Fn).length ? cnt[F.filter(n => cnt[n].F < Fn)[0]].F : 0;
    const chips = (a, key, c) => a.map(n => '<button class="chipbtn" data-c="' + esc(n) + '" style="border-color:' + c + '">' + esc(nm(n)) + "<small>" + cnt[n][key] + "</small></button>").join("");
    const cD = '<section class="bal lu-i"><h4>Who is in how many<em>' + esc(cap(the(F[0]))) + " fights in " + words[Fn] + " of the five. Nobody else fights in more than " + words[F2n] + '.</em></h4><div class="lu-k">Backs in the most, without fighting</div><div class="chips">' + chips(rank("B", 3), "B", "#8d96af") + '</div><div class="lu-k">Hedges in the most</div><div class="chips">' + chips(rank("H", 2), "H", CH) + '</div><div class="lu-k">Out of all five</div><div class="chips">' + chips(rank("O", 5), "O", "#3a4258") + "</div></section>";
    const half = Math.ceil(LU.order.length / 2);
    pane.innerHTML = '<div class="lu-top">' + ks.map(card).join("") + '</div><div class="lu-ins">' + cA + cC + cD + "</div>"
      + '<section class="bal lu-m"><h4>Every country, every war<small>' + LU.order.length + " countries · click a cell for the reason</small></h4><div class=\"lm-2\"><div class=\"lm\">" + head + rows(LU.order.slice(0, half)) + '</div><div class="lm">' + head + rows(LU.order.slice(half)) + "</div></div>"
      + '<p class="hint"><span class="lc rG s1 k">At war</span> one of the states the war is between &nbsp; <span class="lc rF s1 k">Fights</span> beside one of them &nbsp; <span class="lc rB s1 k">Backs</span> arms, bases, money; no soldiers &nbsp; <span class="lc rH s0 k">Hedges</span> tied to both &nbsp; · stays out &nbsp;&nbsp; <b>§</b> bound by a treaty text &nbsp; <b>•</b> has already done it &nbsp; <b>?</b> open &nbsp; unmarked: presumed. Blue is the first side of that war and red the second; in the fifth, blue is India.</p></section>' + cB;
    $("lu-n").innerHTML = "Who stands where under each of the five wars. " + '<span class="gr" style="--c:#e8c455">presumed</span>' + " The Archive's reading of treaties, bases, arms suppliers and what each did the last time: a judgment, not a forecast, and every row says what it rests on.";
  }

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
      + "<h4>The line-ups</h4><p>The one part of this page that is the Archive's own. For each of the five wars, " + LU.order.length + " countries are placed: at war, fighting beside a side, backing one without fighting, hedging, or staying out. Each row gives its reason and how firm it is: <i>bound</i> by a treaty text, <i>already so</i> in this quarrel, <i>presumed</i> from the record, or <i>open</i>. It is argued from treaties, bases, arms suppliers and what each state did the last time, and it is marked <i>presumed</i> wherever it appears. It is not a forecast, and no forecaster is cited for it. Each war lists the sources its reading rests on; a single row carries a reason and not a link. The findings above the table are counted from the table when the page loads.</p>"
      + "<h4>The sparks</h4><p>Five places, chosen because the survey of experts names their regions or because nuclear powers face each other there. The percentages are shares of those experts who expect a world war at all, not probabilities of war.</p>"
      + "<h4>What is left out</h4><p>Space, cyber and undersea cables: none of the sources read here quantifies them. Any war that starts somewhere not on the list. And the reply to every model: the people in it would be trying to stop.</p>"
      + '</div><div class="col scroll"><h4>Sources<small>' + (Object.keys(D.src).length + Object.keys(LU.src).length) + " here; the wars' own are in the Conflicts and the Situation</small></h4>" + srcList(Object.keys(D.src).concat(Object.keys(LU.src))) + "</div></div>";
  }

  /* ---------------- the side panel ---------------- */
  const X_BTN = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button>';
  function sparkCard(k) {
    const c = CBY[k.cf], l = c && LV[c.lv - 1];
    return X_BTN + '<div class="sd-k" style="color:#ff2e55">Where it could start</div><div class="sd-t">' + esc(k.n) + '</div><p class="sd-p lead">' + esc(k.line) + "</p>"
      + lineup(k)
      + (c ? '<a class="rel now" href="conflicts.html#v=map&i=' + c.id + '" style="border-left-color:' + l.c + '">Today: ' + esc(c.n.split(":")[0]) + "<i>level " + c.lv + " · " + l.name + " · open it in the Conflicts ⟶</i></a>" : "") + '<p class="hint">' + esc(k.share) + " " + srcA("acgf") + "</p>"
      + '<div class="sd-k">How it would widen</div>' + k.chain.map(line).join("")
      + '<div class="sd-k">What has been worked out</div>' + k.figs.map(f => '<div class="loss"><b>' + esc(f[1]) + "</b><small>" + esc(f[0]) + " · " + srcA(f[2]) + "</small></div>").join("")
      + '<div class="sd-links"><button class="lnk" data-go="road">The road from here ⟶</button><button class="lnk" data-go="cost">The cost ⟶</button></div>';
  }
  function lineup(k) {
    const L = LS[k.id], hi = L.hinge.indexOf(". ");
    const row = n => { const w = L.who[n]; return '<button class="lu-r" data-c="' + esc(n) + '" style="--c:' + rcol(w[0]) + '"><b>' + esc(nm(n)) + "</b>" + fm(w[2]) + "<span>" + esc(w[1]) + "</span></button>"; };
    const grp = (t, roles, open) => { const ns = LU.order.filter(n => roles.indexOf(L.who[n][0]) >= 0); return ns.length ? '<details class="lu-g"' + (open ? " open" : "") + ' style="--c:' + rcol(roles[0]) + '"><summary>' + esc(t) + "<i>" + ns.length + "</i></summary>" + ns.map(row).join("") + "</details>" : ""; };
    return '<div class="sd-k">The line-up <span class="gr" style="--c:#e8c455">presumed</span></div>' + tallyRow(k.id) + '<p class="lu-read">' + esc(L.read) + "</p>"
      + '<div class="lu-hg"><b>The hinge: ' + esc(L.hinge.slice(0, hi)) + "</b>" + esc(L.hinge.slice(hi + 2)) + "</div>"
      + grp("Fights " + L.short[1], ["G1", "F1"], 1) + grp("Backs " + L.short[0] + ", does not fight", ["B1"], 1) + grp("Fights " + L.short[0], ["G2", "F2"], 1) + grp("Backs " + L.short[1] + ", does not fight", ["B2"], 1) + grp("Hedges", ["H"], 1) + grp("Stays out", ["O"], 0)
      + '<p class="hint">Presumed: the Archive\'s reading, not a forecast. It rests on ' + srcIn(L.basis) + '.</p><div class="sd-links"><button class="lnk" data-go="lines">All five line-ups side by side ⟶</button></div>';
  }
  function countryCard(n) {
    const t = TIE[n], nk = NUKE[n], sp = SPEND[n] || SPEND[nm(n)], ks = D.sparks.filter(k => k.pulls.indexOf(n) >= 0);
    let h = X_BTN + '<div class="sd-k"' + (t ? ' style="color:' + SD[t.side].c + '"' : "") + ">" + (t ? esc(SD[t.side].n) : "In neither camp") + '</div><div class="sd-t">' + esc(nm(n)) + "</div>";
    if (t) h += '<div class="loss"><b>' + esc(D.strength[t.k]) + "</b> " + esc(t.what) + ".<small>" + srcIn(t.s) + "</small></div>"; else h += '<p class="hint">No mutual-defence treaty with the United States, and not one of the four. Where a spark would draw it in, the chain says how.</p>';
    if (nk || sp) h += '<div class="dth">' + (sp ? "<div><span>Military spending, 2025</span><b>$" + sp[1] + " bn</b></div>" : "") + (nk ? "<div><span>Nuclear warheads</span><b>" + nk[4].toLocaleString("en") + "</b></div>" : "") + '</div><p class="hint">' + (sp ? srcA("milex") : "") + (sp && nk ? " · " : "") + (nk ? srcA("sipri") : "") + "</p>";
    if (LU.order.indexOf(n) >= 0) h += '<div class="sd-k">Where it would stand <span class="gr" style="--c:#e8c455">presumed</span></div>' + D.sparks.map(k => { const w = LS[k.id].who[n]; return '<button class="lu-r wide' + (st.k === k.id ? " on" : "") + '" data-k="' + k.id + '" style="--c:' + rcol(w[0]) + '"><small>' + esc(LS[k.id].tag) + "</small><b>" + esc(rline(k.id, w[0])) + "</b>" + fm(w[2]) + "<span>" + esc(w[1]) + "</span></button>"; }).join("");
    else if (ks.length) h += '<div class="sd-k">Drawn in by</div>' + ks.map(k => '<button class="rel" data-k="' + k.id + '" style="border-left-color:#ff2e55">' + esc(k.n) + "<i>" + esc(k.line) + "</i></button>").join("");
    if (WARS[n]) h += '<div class="sd-k">At war, or near it, today</div>' + WARS[n].map(c => '<a class="rel" href="conflicts.html#v=map&i=' + c.id + '" style="border-left-color:' + LV[c.lv - 1].c + '">' + esc(c.n) + "<i>" + c.lv + " · " + LV[c.lv - 1].name + "</i></a>").join("");
    return h + '<div class="sd-links"><a class="lnk" href="situation.html#v=board&c=' + encodeURIComponent(n) + '">Its whole situation ⟶</a>' + (st.v !== "lines" && LU.order.indexOf(n) >= 0 ? '<button class="lnk" data-go="lines">In the table of line-ups ⟶</button>' : "") + (st.v !== "board" ? '<button class="lnk" data-go="board">On the board ⟶</button>' : "") + "</div>";
  }
  function intro() {
    const T = { board: ["THE BOARD", "The two camps as treaties draw them, and the five places a war between them could start. Choose a war and the map becomes its line-up: who fights, who backs, who hedges, who stays out, and why."],
                lines: ["THE LINE-UPS", "Five wars across, 44 countries down: where each would stand, and how firm that is. The cards above the table are counted from it."],
                road: ["THE ROAD", "Six rungs from the standing peace to the aftermath. Only the first is the present."], balance: ["THE BALANCE", "Money, warheads and men, camp against camp."],
                cost: ["THE COST", "Wars that were fought and wars that have only been modelled, on one scale."], odds: ["THE ODDS", "What forecasters, experts and the public say, and the case each way."], method: ["METHOD", "What a projection is, what the grades mean, and every source."] }[st.v];
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + '</p><div class="q" style="border-color:#e8c455"><b style="color:#e8c455">A projection, not a prediction</b><span>Built from published wargames, treaties, assessments and forecasts, read on ' + D.meta.asOf.slice(8) + " November " + D.meta.asOf.slice(0, 4) + ". Every line shows its grade and its source.</span></div>"
      + '<div class="sd-k">The grades</div>' + Object.keys(GR).map(g => '<div class="gk">' + gtag(g) + "</div>").join("")
      + '<div class="sd-k">Choose a war</div>' + D.sparks.map(k => { const L = LS[k.id], t = TL[k.id]; return '<button class="rel" data-k="' + k.id + '" style="border-left-color:#ff2e55">' + esc(cap(L.short[0])) + " against " + esc(L.short[1]) + "<i>" + esc(k.n) + " · " + t.f[0] + " fight and " + t.b[0] + " back, against " + t.f[1] + " and " + t.b[1] + " · " + t.h + " hedge</i></button>"; }).join("")
      + (st.v === "lines" ? '<div class="sd-k">How firm</div>' + Object.keys(LU.firm).map(c => '<div class="gk">' + fm(c) + " <small>" + esc(LU.firm[c][1]) + "</small></div>").join("") : "")
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
    const q = K.hash.read(), bare = (!location.hash || location.hash === "#") && innerWidth > 860;   /* on a phone the card would cover the map, so it opens on the whole board */ if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v; st.k = KBY[q.k] ? q.k : bare ? D.sparks[0].id : null; st.c = q.c && known(q.c) ? q.c : null; built.boot = 1; sync(true); if (st.v === "board" && st.k) setTimeout(fly, 80);
  }
  tabs = K.tabs(() => st.v, go);
  $("dc-side").addEventListener("click", e => {
    if (e.target.closest("a")) return; if (e.target.closest(".sd-x")) { if (st.c) st.c = null; else st.k = null; return sync(); }
    const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; return sync(); }
    const k = e.target.closest("button[data-k]"); if (k) {   /* <html> carries a data-k of its own (theme.js), so name the element */ st.k = k.dataset.k; st.c = null; if (st.v !== "lines") st.v = "board"; sync(); return setTimeout(fly, 60); }
    const c = e.target.closest("[data-c]"); if (c) { st.c = c.dataset.c; sync(); }
  });
  document.addEventListener("keydown", e => { if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Escape" && (st.c || st.k)) { if (st.c) st.c = null; else st.k = null; sync(); } });
  const hay = D.sparks.map(k => [k.n.toLowerCase(), { label: k.n, sub: "Where it could start", t: "k", id: k.id }]).concat(Object.keys(TIE).concat(Object.keys(NUKE), LU.order).filter((n, i, a) => a.indexOf(n) === i).map(n => [(n + " " + nm(n)).toLowerCase(), { label: nm(n), sub: TIE[n] ? SD[TIE[n].side].short : "In neither camp", t: "c", id: n }]));
  K.finder($("dc-q"), q => hay.filter(h => h[0].indexOf(q) >= 0).map(h => h[1]), h => { st.v = "board"; if (h.t === "k") { st.k = h.id; st.c = null; } else st.c = h.id; sync(); if (h.t === "k") fly(); });
  let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); if (st.v === "board") drawBoard(); }, 140); });
  window.addEventListener("hashchange", applyHash);
  applyHash();
})();
