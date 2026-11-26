/* ============================================================
   ARCHIVUS — THE SITUATION (v18)
   The present on one map: who is fighting, who stands with whom,
   who is under sanctions, who has just voted, who holds the bomb,
   which straits are shut — and, under it, ninety days of dated events.
     · the Board   — the map, read through five lenses, with the wire under it
     · the Wire    — every dispatch, newest first, each with its source
     · the Blocs   — who sits in which alliance: one ledger for every country
     · the Ballots — the year's elections and what they decided
     · Method & sources
   Data: src/data/situation.js; the wars come from src/data/conflicts.js.
   Deep links:  situation.html#v=board&l=blocs&b=brics   #d=trilateral   #c=Iran   #s=hormuz
   The page states what its sources state, and dates everything.
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc, el = K.svgEl;
  const D = window.ARCHIVUS_SITUATION, CF = window.ARCHIVUS_CONFLICTS, LV = CF.levels;
  const SRC = Object.assign({}, CF.src, D.src);                 /* a key is looked up here first, then in the Conflicts' list */
  const KD = D.kinds, KK = Object.keys(KD);
  const W = D.wire.slice().sort((a, b) => a.d < b.d ? 1 : a.d > b.d ? -1 : 0), WBY = {}; W.forEach((w, i) => { WBY[w.id] = w; w.ix = i; });
  const BL = D.blocs, BBY = {}; BL.forEach(b => { BBY[b.id] = b; });
  const SBY = {}; D.straits.forEach(s => { SBY[s.id] = s; });
  const CL = CF.list.slice().sort((a, b) => b.lv - a.lv), CBY = {}; CL.forEach(c => { CBY[c.id] = c; });
  const lv = c => LV[c.lv - 1];
  const SHORT = { "United States of America": "United States", "Dem. Rep. Congo": "DR Congo", "Central African Rep.": "Central African Republic", "S. Sudan": "South Sudan", "Bosnia and Herz.": "Bosnia and Herzegovina", "Macedonia": "North Macedonia", "Congo": "Congo (Brazzaville)" };
  const nm = n => SHORT[n] || n;

  /* dates: "2026-11-19" → 19 Nov 2026; "2026-11" → Nov 2026 */
  const fd = (d, approx) => { const p = String(d).split("-"); return p.length === 1 ? p[0] : (p.length === 3 && !approx ? +p[2] + " " : "") + K.MON[+p[1] - 1] + " " + p[0]; };
  const day = d => Date.parse(d + "T00:00:00Z") / 864e5;
  const T1 = day(D.meta.asOf), T0 = day(D.meta.from), asOfT = fd(D.meta.asOf);
  const srcA = k => { const s = SRC[k]; return s ? '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" title="' + esc(s[0]) + '">' + esc(K.host(s[1])) + "</a>" : ""; };
  const srcIn = ks => (ks || []).map(srcA).filter(Boolean).join(" · ");
  const srcList = ks => '<div class="srcs">' + (ks || []).filter(k => SRC[k]).map(k => '<a href="' + esc(SRC[k][1]) + '" target="_blank" rel="noopener">' + esc(SRC[k][0]) + "<small>" + esc(fd(SRC[k][2])) + "</small></a>").join("") + "</div>";

  /* everything known about a country, gathered once: the map's tooltip, its card and the ledger all read this */
  const F = {}, fact = n => F[n] || (F[n] = { n, blocs: [], us: [], eu: false, nuke: null, ballots: [], ahead: [], force: [], wire: [], wars: [] });
  BL.forEach(b => { b.members.forEach(n => fact(n).blocs.push([b, "member"])); (b.partners || []).forEach(n => fact(n).blocs.push([b, "partner"])); });
  D.sanc.us.forEach(r => fact(r[0]).us.push(r)); D.sanc.eu.forEach(n => { fact(n).eu = true; });
  D.nukes.list.forEach(r => { fact(r[0]).nuke = r; });
  D.ballots.forEach(r => fact(r[1]).ballots.push(r)); D.ahead.forEach(r => fact(r[1]).ahead.push(r)); D.force.forEach(r => fact(r[1]).force.push(r));
  W.forEach(w => (w.w || []).forEach(n => fact(n).wire.push(w)));
  CL.forEach(c => (c.where || []).forEach(n => fact(n).wars.push(c)));
  const SHAPES = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { SHAPES[c.n] = 1; });

  const LENS = [["wars", "Wars", "Where the fighting is, by severity"], ["blocs", "Blocs", "Who stands with whom: the alliances and groupings"], ["sanctions", "Sanctions", "Who is under American and European sanctions"],
                ["ballots", "Ballots", "Who voted in 2026, and whether power changed hands"], ["arsenals", "Arsenals", "The nine nuclear-armed states"]];
  const SANC = { us: "#e08a3c", eu: "#5b9be0", both: "#e5484d" };
  const BAL = { "new": ["Power changed hands", "#e8c455"], held: ["The governing side kept power", "#5b7fa8"], hung: ["No majority, or count not final", "#b48ef0"], won: ["A winner is reported", "#49c9b8"], nr: ["Held; result not read", "#4a5266"] };

  const st = { v: "board", l: "wars", b: null, k: null, d: null, c: null, s: null, g: null, w: null, wire: 1, straits: 1 };
  const built = {};
  let tabs = null, map = null, marks = [];
  const clear = () => { st.d = st.c = st.s = st.g = st.w = null; };
  const picked = () => st.d || st.c || st.s || st.g || st.w;

  function sync(skipHash) {
    if (!skipHash) K.hash.write({ v: st.v, l: st.l === "wars" ? null : st.l, b: st.b, k: st.k, d: st.d, c: st.c, s: st.s, g: st.g, w: st.w });
    tabs.paint(); renderSide(); render(st.v);
  }
  function go(v) { if (tabs.ids.indexOf(v) < 0) return; st.v = v; sync(); }
  function sel(kind, id, toBoard) { const same = st[kind] === id; clear(); if (!same && id) st[kind] = id; if (toBoard) st.v = "board"; sync(); if (st.v === "board" && map && picked()) fly(); }
  function render(v) { if (v === "board") drawBoard(); else if (v === "wire") drawWire(); else if (v === "blocs") drawBlocs(); else if (v === "ballots") drawBallots(); else drawMethod(); }

  /* ---------------- the board ---------------- */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const sink = (h, t) => { const a = hex(h), b = [21, 26, 39]; return "rgb(" + a.map((v, i) => Math.round(v * t + b[i] * (1 - t))).join(",") + ")"; };
  const X = lon => lon + 180, Y = lat => 90 - lat;
  function place() { if (!map) return; const s = map.scale(); for (let i = 0; i < marks.length; i++) marks[i][0].setAttribute("transform", "translate(" + marks[i][1] + " " + marks[i][2] + ") scale(" + s.toFixed(4) + " " + (s / map.SY).toFixed(4) + ")"); }
  function mark(g, lat, lon) { marks.push([g, X(lon).toFixed(2), Y(lat).toFixed(2)]); map.over.appendChild(g); return g; }
  function fly() {
    const n = st.c || (st.w && (CBY[st.w].where || []).length === 1 && CBY[st.w].lv < 5 ? CBY[st.w].where[0] : null);
    if (n && map.paths[n]) map.focus(n);
  }
  /* which bloc paints a country: the one picked, else the first it belongs to in the order the blocs are listed */
  const blocOf = n => { const f = F[n]; if (!f) return null; if (st.b) { const m = f.blocs.filter(x => x[0].id === st.b)[0]; return m || null; } return f.blocs.filter(x => x[1] === "member")[0] || null; };
  const balOf = n => { const f = F[n]; return f && f.ballots.length ? f.ballots[f.ballots.length - 1] : null; };
  function fill(n) {
    const f = F[n]; if (!f) return null;
    if (st.l === "wars") { if (!f.wars.length) return null; const top = f.wars.reduce((a, c) => c.lv > a.lv ? c : a); return sink(lv(top).c, 0.3 + 0.12 * top.lv); }
    if (st.l === "blocs") { const m = blocOf(n); return m ? sink(m[0].c, m[1] === "member" ? 0.78 : 0.3) : null; }
    if (st.l === "sanctions") return f.us.length && f.eu ? sink(SANC.both, 0.8) : f.us.length ? sink(SANC.us, 0.72) : f.eu ? sink(SANC.eu, 0.72) : null;
    if (st.l === "ballots") { const b = balOf(n); return b ? sink(BAL[b[4]][1], b[4] === "nr" ? 0.6 : 0.8) : f.ahead.length ? "#1c2233" : null; }
    return f.nuke ? sink("#e8c455", 0.2 + 0.07 * Math.log10(f.nuke[4])) : null;
  }
  function tipFor(iso, name) {
    if (name.charAt(0) === "@") { const k = name.charAt(1), v = name.slice(2);
      if (k === "d") { const w = WBY[v]; return "<b>" + esc(w.t) + "</b><small>" + fd(w.d, w.approx) + " · " + KD[w.k][0] + "</small>"; }
      if (k === "s") { const s = SBY[v]; return "<b>" + esc(s.n) + "</b><small>" + D.status[s.status][0] + "</small>"; }
      if (k === "c") { const c = CBY[v]; return "<b>" + esc(c.n) + "</b><small>" + c.lv + " · " + lv(c).name + "</small>"; }
      const r = D.nukes.list[+v]; return "<b>" + esc(nm(r[0])) + "</b><small>" + r[4].toLocaleString("en") + " warheads · " + (r[1] ? r[1].toLocaleString("en") + " deployed" : "none deployed") + "</small>"; }
    const f = F[name]; let h = "<b>" + esc(nm(name)) + "</b>"; if (!f) return h;
    if (f.wars.length) h += "<small>" + f.wars.map(c => c.lv + " · " + esc(c.n.split(":")[0])).join("<br>") + "</small>";
    if (f.blocs.length) h += "<small>" + f.blocs.map(x => x[0].n + (x[1] === "partner" ? " partner" : "")).join(" · ") + "</small>";
    if (f.us.length || f.eu) h += "<small>Sanctions: " + [f.us.length ? "US" : "", f.eu ? "EU" : ""].filter(Boolean).join(" and ") + "</small>";
    if (f.nuke) h += "<small>" + f.nuke[4].toLocaleString("en") + " nuclear warheads</small>";
    const b = balOf(name); if (b) h += "<small>Voted " + fd(b[0]) + " — " + BAL[b[4]][0].toLowerCase() + "</small>";
    return h;
  }
  function legend() {
    const sw = (c, t) => '<span><i style="background:' + c + '"></i>' + t + "</span>";
    let h = "";
    if (st.l === "wars") h = "<b>Wars, by severity</b>" + LV.map(l => sw(l.c, l.n + " " + l.name)).join("") + "<small>Read from the Conflicts, compiled " + fd(CF.meta.asOf) + ". Click a ring for the conflict.</small>";
    else if (st.l === "blocs") h = "<b>Blocs</b>" + BL.map(b => sw(b.c, b.n)).join("") + "<small>" + (st.b ? "Members solid" + (BBY[st.b].partners ? ", partner countries faint" : "") + ". " + srcIn(BBY[st.b].s) : "A country in several is painted for the first in this order. Pick one above to see it whole, or open the Blocs for the full ledger.") + "</small>";
    else if (st.l === "sanctions") h = "<b>Under sanctions</b>" + sw(SANC.us, "United States") + sw(SANC.eu, "European Union") + sw(SANC.both, "both") + "<small>" + esc(D.sanc.note) + " " + srcIn(["ofac", "eusan"]) + "</small>";
    else if (st.l === "ballots") h = "<b>Voted in 2026</b>" + Object.keys(BAL).map(k => sw(BAL[k][1], BAL[k][0])).join("") + '<span><i class="dash"></i>votes in the months ahead</span><small>' + srcIn(["ifes", "ifesup"]) + "</small>";
    else h = "<b>Nuclear arsenals</b>" + '<span><i class="ring"></i>ring: every warhead</span><span><i style="background:#e8c455;border-radius:50%"></i>disc: deployed</span><small>SIPRI estimates for January 2026: ' + D.nukes.world[3].toLocaleString("en") + " in all, " + D.nukes.world[0].toLocaleString("en") + " deployed. " + srcIn(D.nukes.s) + "</small>";
    h += '<span class="lg-h">On every lens</span><span><svg viewBox="-8 -8 16 16"><circle r="4" fill="#e8c455"/></svg>a dispatch, coloured by kind</span><span><svg viewBox="-8 -8 16 16"><path d="M0 -6L6 0L0 6L-6 0Z" fill="none" stroke="#ff5f4a" stroke-width="2"/></svg>a strait, by its state</span>';
    return h;
  }
  function drawBoard() {
    if (!built.board) {
      built.board = 1;
      const ident = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { ident[c.n] = c.n; });
      map = K.worldMap($("sb"), { map: ident, tip: K.tip($("sb-tip"), $("sb-wrap")), onView: place, tipFor,
        onPick: (name, t) => {
          const m = t && t.closest && t.closest("[data-pk]"); if (m) return sel(m.dataset.pk, m.dataset.id);
          if (name && F[name]) return sel("c", name);
          if (picked()) { clear(); sync(); }
        } });
      $("sb-lens").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; st.l = b.dataset.l; if (st.l !== "blocs") st.b = null; sync(); });
      $("sb-sub").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; st.b = st.b === b.dataset.b ? null : b.dataset.b; sync(); });
      $("sb-lay").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; st[b.dataset.k] = st[b.dataset.k] ? 0 : 1; sync(); });
      $("sb-zi").onclick = () => map.zoomBy(1 / 1.6); $("sb-zo").onclick = () => map.zoomBy(1.6); $("sb-zr").onclick = () => map.reset();
      $("sb-wire").addEventListener("click", e => { const b = e.target.closest("[data-d]"); if (b) return sel("d", b.dataset.d); const k = e.target.closest("[data-k]"); if (k) { st.k = st.k === k.dataset.k ? null : k.dataset.k; sync(); } });
    }
    $("sb-lens").innerHTML = LENS.map(l => '<button class="chipbtn' + (st.l === l[0] ? " on" : "") + '" data-l="' + l[0] + '" title="' + esc(l[2]) + '">' + l[1] + "</button>").join("");
    $("sb-sub").hidden = st.l !== "blocs";
    $("sb-sub").innerHTML = BL.map(b => '<button class="chipbtn bl' + (st.b === b.id ? " on" : "") + '" data-b="' + b.id + '" title="' + esc(b.full + " — " + b.kind) + '"><i class="lvd" style="background:' + b.c + '"></i>' + b.n + "<small>" + (b.members.length + (b.off || []).length) + "</small></button>").join("");
    $("sb-lay").innerHTML = '<button class="chipbtn' + (st.wire ? " on" : "") + '" data-k="wire" title="Show the dated events of the last ninety days">Dispatches</button><button class="chipbtn' + (st.straits ? " on" : "") + '" data-k="straits" title="Show the straits and chokepoints">Straits</button>';
    $("sb-leg2").innerHTML = $("sb-leg").innerHTML = legend();
    map.paint(fill);
    /* dashed outline for countries with a vote ahead (Ballots lens only), and the picked country */
    Object.keys(map.paths).forEach(n => { const on = st.l === "ballots" && F[n] && F[n].ahead.length > 0; map.paths[n].forEach(p => p.classList.toggle("ahead", on)); });
    map.select(st.c && map.paths[st.c] ? st.c : null);
    /* the marks: conflicts (Wars lens), arsenals (Arsenals lens), straits and dispatches (every lens) */
    marks = []; map.over.textContent = "";
    const any = picked();
    if (st.l === "wars") CL.slice().reverse().forEach(c => {
      const l = lv(c), g = el("g", { class: "st-pin" + (st.w === c.id ? " sel" : any ? " dim" : ""), "data-pk": "w", "data-id": c.id }), tag = "@c" + c.id;
      g.appendChild(el("circle", { r: 3.5 + c.lv * 1.9, class: "o", fill: l.c, stroke: l.c, "data-n": tag })); g.appendChild(el("circle", { r: 2.2, class: "i", fill: l.c, "data-n": tag }));
      if (st.w === c.id || (c.lv === 5 && !any)) g.appendChild(el("text", { x: 7 + c.lv * 2, y: 3.6 }, c.n.split(":")[0]));
      mark(g, c.at[0], c.at[1]); });
    if (st.l === "arsenals") D.nukes.list.forEach((r, i) => {
      const g = el("g", { class: "st-nk" }), R = 3 + Math.sqrt(r[4]) * 0.4, tag = "@n" + i;
      g.appendChild(el("circle", { r: R.toFixed(1), class: "o", "data-n": tag })); if (r[1]) g.appendChild(el("circle", { r: (Math.sqrt(r[1]) * 0.4).toFixed(1), class: "i", "data-n": tag }));
      g.appendChild(el("text", { x: 0, y: (R + 11).toFixed(1), "text-anchor": "middle" }, r[4].toLocaleString("en")));
      mark(g, r[5], r[6]); });
    if (st.straits) D.straits.forEach(s => {
      const g = el("g", { class: "st-sx" + (st.s === s.id ? " sel" : any ? " dim" : ""), "data-pk": "s", "data-id": s.id }), c = D.status[s.status][1];
      g.appendChild(el("path", { d: "M0 -6.4L6.4 0L0 6.4L-6.4 0Z", stroke: c, "data-n": "@s" + s.id })); g.appendChild(el("circle", { r: 1.8, fill: c, "data-n": "@s" + s.id }));
      if (st.s === s.id) g.appendChild(el("text", s.at[1] > 60 ? { x: -11, y: 3.6, "text-anchor": "end" } : { x: 11, y: 3.6 }, s.n));
      mark(g, s.at[0], s.at[1]); });
    if (st.wire) W.slice().reverse().forEach(w => {                     /* oldest first, so the newest sits on top */
      if (st.k && w.k !== st.k) return;
      const age = T1 - day(w.d), c = KD[w.k][1], g = el("g", { class: "st-wd" + (st.d === w.id ? " sel" : any ? " dim" : "") + (age <= 10 ? " new" : ""), "data-pk": "d", "data-id": w.id, style: "--o:" + Math.max(0.42, 1 - age / 130).toFixed(2) });
      if (age <= 10 || st.d === w.id) g.appendChild(el("circle", { r: 7.5, class: "wh", stroke: c, "data-n": "@d" + w.id }));
      g.appendChild(el("circle", { r: 3.6, class: "wc", fill: c, "data-n": "@d" + w.id }));
      if (st.d === w.id) g.appendChild(el("text", w.at[1] > 40 ? { x: -11, y: 3.6, "text-anchor": "end" } : { x: 11, y: 3.6 }, w.t.length > 44 ? w.t.slice(0, 42) + "…" : w.t));
      mark(g, w.at[0], w.at[1]); });
    place();
    drawStrip();
    $("sb-n").textContent = CL.length + " conflicts · " + W.length + " dispatches since " + fd(D.meta.from) + " · as of " + asOfT;
  }
  /* the wire under the map: one row per kind, a mark per dispatch, placed by its date */
  function drawStrip() {
    const span = T1 - T0, rows = KK.map(k => ({ k, n: 0, seen: {} }));
    let h = '<div class="ws-lab">' + KK.map(k => '<button class="' + (st.k === k ? "on" : st.k ? "off" : "") + '" data-k="' + k + '" title="' + esc(KD[k][2]) + '"><i style="background:' + KD[k][1] + '"></i>' + KD[k][0] + "<small>" + W.filter(w => w.k === k).length + "</small></button>").join("") + '</div><div class="ws-plot"><div class="ws-rows">' + KK.map(() => "<i></i>").join("") + "</div>";
    /* month ticks */
    for (let m = 8; m <= 11; m++) { const t = day("2026-" + (m < 10 ? "0" : "") + m + "-01"); if (t >= T0 && t <= T1) h += '<span class="ws-tk" style="left:' + ((t - T0) / span * 100).toFixed(2) + '%">' + K.MON[m - 1] + "</span>"; }
    h += '<span class="ws-tk now" style="left:100%">' + asOfT.replace(" 2026", "") + "</span>";
    W.slice().reverse().forEach(w => { const r = rows[KK.indexOf(w.k)], n = r.seen[w.d] = (r.seen[w.d] || 0) + 1;   /* same day, same kind: step aside */
      h += '<button class="ws-d' + (st.d === w.id ? " sel" : "") + (st.k && st.k !== w.k ? " off" : "") + '" data-d="' + w.id + '" style="left:calc(' + ((day(w.d) - T0) / span * 100).toFixed(2) + "% - " + (n - 1) * 9 + "px);top:" + (KK.indexOf(w.k) * 100 / KK.length + 50 / KK.length).toFixed(2) + "%;--c:" + KD[w.k][1] + '" title="' + esc(fd(w.d, w.approx) + " — " + w.t) + '" aria-label="' + esc(w.t) + '"></button>'; });
    $("sb-wire").innerHTML = h + "</div>";
  }

  /* ---------------- the wire ---------------- */
  function drawWire() {
    const list = W.filter(w => !st.k || w.k === st.k);
    $("wi-k").innerHTML = '<button class="chipbtn' + (!st.k ? " on" : "") + '" data-k="">All<small>' + W.length + "</small></button>" + KK.map(k => '<button class="chipbtn' + (st.k === k ? " on" : "") + '" data-k="' + k + '" title="' + esc(KD[k][2]) + '"><i class="lvd" style="background:' + KD[k][1] + '"></i>' + KD[k][0] + "<small>" + W.filter(w => w.k === k).length + "</small></button>").join("");
    let h = "", month = "";
    list.forEach(w => { const m = w.d.slice(0, 7); if (m !== month) { month = m; h += '<h4 class="wi-m">' + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+m.slice(5) - 1] + " " + m.slice(0, 4) + "<small>" + list.filter(x => x.d.slice(0, 7) === m).length + "</small></h4>"; }
      h += '<article class="wi' + (st.d === w.id ? " sel" : "") + '" data-d="' + w.id + '" style="--c:' + KD[w.k][1] + '"><div class="wi-d"><b>' + (w.approx ? "" : +w.d.slice(8)) + "</b>" + K.MON[+w.d.slice(5, 7) - 1] + '</div><div class="wi-b"><span class="wi-k">' + KD[w.k][0] + "</span><h5>" + esc(w.t) + "</h5><p>" + esc(w.x) + '</p><div class="wi-s">' + srcIn(w.s)
        + '<button class="lnk" data-d="' + w.id + '">On the board ⟶</button>' + (w.cf ? '<a class="lnk" href="conflicts.html#v=map&i=' + w.cf + '">The conflict ⟶</a>' : "") + "</div></div></article>"; });
    $("wi-list").innerHTML = h;
    $("wi-n").textContent = list.length + " of " + W.length + " dispatches · " + fd(D.meta.from) + " to " + asOfT + " · every line has its source beside it";
    if (!built.wire) { built.wire = 1;
      $("wi-k").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st.k = b.dataset.k || null; sync(); } });
      $("wi-list").addEventListener("click", e => { if (e.target.closest("a")) return; const b = e.target.closest("button[data-d]"); if (b) return sel("d", b.dataset.d, true); const a = e.target.closest("article[data-d]"); if (a) sel("d", a.dataset.d); }); }
  }

  /* ---------------- the blocs: one ledger ---------------- */
  function drawBlocs() {
    const rows = Object.keys(F).filter(n => { const f = F[n]; return f.blocs.length || f.us.length || f.eu || f.nuke; }).map(n => F[n]);
    const key = f => { const m = f.blocs.filter(x => x[1] === "member")[0]; return m ? BL.indexOf(m[0]) : f.blocs.length ? 7 : 8; };
    rows.sort((a, b) => key(a) - key(b) || (b.nuke ? b.nuke[4] : 0) - (a.nuke ? a.nuke[4] : 0) || b.blocs.length - a.blocs.length || a.n.localeCompare(b.n));   /* by camp; within one, the armed and the many-sided first */
    $("bl-cards").innerHTML = BL.map(b => '<button class="bl-card' + (st.g === b.id ? " sel" : "") + '" data-g="' + b.id + '" style="--c:' + b.c + '"><b>' + b.n + "</b><i>" + (b.members.length + (b.off || []).length) + (b.partners ? " + " + b.partners.length : "") + "</i><span>" + esc(b.full) + "</span><small>" + esc(b.kind) + "</small></button>").join("");
    let h = '<table class="st-tbl"><thead><tr><th>Country</th>' + BL.map(b => '<th class="c" style="--c:' + b.c + '" title="' + esc(b.full) + '">' + b.n + "</th>").join("") + '<th class="c" title="Under a US Treasury sanctions programme">US sanctions</th><th class="c" title="Named in the EU\'s 2026 brief on restrictive measures">EU sanctions</th><th class="num">Warheads</th><th>Wars on its soil</th></tr></thead><tbody>';
    rows.forEach(f => {
      h += '<tr class="row' + (st.c === f.n ? " sel" : "") + '" data-c="' + esc(f.n) + '"><td class="nm">' + esc(nm(f.n)) + "</td>" + BL.map(b => { const m = f.blocs.filter(x => x[0] === b)[0]; return '<td class="c" style="--c:' + b.c + '">' + (m ? m[1] === "member" ? '<i class="dot"></i>' : '<i class="dot p" title="Partner country"></i>' : "") + "</td>"; }).join("")
        + '<td class="c">' + (f.us.length ? '<i class="dot" style="--c:' + SANC.us + '" title="' + esc(f.us.map(r => r[1]).join("; ")) + '"></i>' : "") + '</td><td class="c">' + (f.eu ? '<i class="dot" style="--c:' + SANC.eu + '"></i>' : "") + '</td><td class="num">' + (f.nuke ? f.nuke[4].toLocaleString("en") : "") + "</td><td>"
        + f.wars.map(c => '<span class="wtag" style="--c:' + lv(c).c + '">' + esc(c.n.split(":")[0]) + "</span>").join("") + "</td></tr>"; });
    $("bl-wrap").innerHTML = h + "</tbody></table>";
    $("bl-n").innerHTML = rows.length + " countries that sit in a bloc, are under sanctions or hold nuclear weapons. ● member · ○ partner country. Sources: " + srcIn(["nato", "csto", "ajsco", "brics", "aes", "eu", "ofac", "eusan", "sipri"]) + ".";
    if (!built.blocs) { built.blocs = 1;
      $("bl-cards").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (b) sel("g", b.dataset.g); });
      $("bl-wrap").addEventListener("click", e => { const r = e.target.closest("tr[data-c]"); if (r) sel("c", r.dataset.c); }); }
  }

  /* ---------------- the ballots ---------------- */
  function drawBallots() {
    const cnt = k => D.ballots.filter(r => r[4] === k).length;
    let h = '<table class="st-tbl"><thead><tr><th>Date</th><th>Country</th><th>Elected</th><th>Outcome</th><th>Reading</th><th>Source</th></tr></thead><tbody>';
    D.ballots.slice().reverse().forEach(r => { h += '<tr class="row' + (st.c === r[1] ? " sel" : "") + '" data-c="' + esc(r[1]) + '"><td class="dt">' + fd(r[0]) + '</td><td class="nm">' + esc(nm(r[1])) + "</td><td>" + esc(r[2]) + '</td><td class="out">' + (r[3] ? esc(r[3]) : '<em>Held. The result was not read for this page.</em>') + '</td><td><span class="bk" style="--c:' + BAL[r[4]][1] + '">' + BAL[r[4]][0] + '</span></td><td class="sr">' + srcIn(r[5]) + "</td></tr>"; });
    $("ba-wrap").innerHTML = h + "</tbody></table>";
    $("ba-side").innerHTML = "<h4>Still to come<small>" + D.ahead.length + '</small></h4><div class="ah">' + D.ahead.map(r => '<button data-c="' + esc(r[1]) + '"><b>' + fd(r[0]) + "</b>" + esc(nm(r[1])) + "<small>" + esc(r[2]) + "</small></button>").join("") + '</div><p class="hint">Dates: ' + srcIn(["ifesup"]) + ". For South Sudan the Conflicts' source gives December 2026; the election guide gives 11 February 2027.</p>"
      + "<h4>Power changed outside a ballot</h4>" + D.force.map(r => '<div class="fc" data-c="' + esc(r[1]) + '"><b>' + esc(nm(r[1])) + "<small>" + fd(r[0]) + "</small></b><p>" + esc(r[2]) + " " + srcIn(r[3]) + "</p></div>").join("");
    $("ba-n").innerHTML = D.ballots.length + " national votes of 2026: " + cnt("new") + " changed the government, " + cnt("held") + " kept it, " + cnt("hung") + " left no majority or are still being counted, " + cnt("won") + " report a winner, and for " + cnt("nr") + " the result was not read. Dates: " + srcIn(["ifes"]) + ".";
    if (!built.ballots) { built.ballots = 1;
      const pick = e => { if (e.target.closest("a")) return; const r = e.target.closest("[data-c]"); if (r) sel("c", r.dataset.c); };
      $("ba-wrap").addEventListener("click", pick); $("ba-side").addEventListener("click", pick); }
  }

  /* ---------------- method and sources ---------------- */
  function drawMethod() {
    if (built.mt) return; built.mt = 1;
    const keys = Object.keys(D.src);
    $("mt-pane").innerHTML = '<div class="grid2 even"><div class="col scroll">'
      + "<h4>What this is</h4><p>The Situation is the present tense of the Archive: the wars, the alliances, the sanctions, the elections, the arsenals and the straits on one map, with the dated events of the last ninety days under it. It was compiled on " + asOfT + " and will go stale; every line carries the date of the report it rests on.</p>"
      + "<h4>The wars</h4><p>They are not repeated here. The Wars lens reads the forty conflicts of <a href=\"conflicts.html\">the Conflicts</a>, compiled " + fd(CF.meta.asOf) + ", and a dispatch about one links to its card there, where every figure has its source.</p>"
      + "<h4>The wire</h4><p>A dispatch is one dated event, stated as its source states it. Where two sides give different accounts, both are given and attributed. The wire is a selection, not a census: it holds what was read, and a quiet row on the strip may mean nothing was read rather than nothing happened.</p>"
      + "<h4>The blocs</h4><p>Membership is taken from each organisation's own page where there is one, otherwise from a dated report of its last summit. Partner countries of BRICS are shown apart from its members.</p>"
      + "<h4>Sanctions</h4><p>" + esc(D.sanc.note) + " The American list is the Treasury's own index of programmes; programmes with no country on the map are " + D.sanc.usOff.map(r => esc(r[0])).join(", ") + ". " + esc(D.sanc.euNote) + "</p>"
      + "<h4>Ballots</h4><p>Dates are the election guide's. An outcome is given only where a report of it was read; otherwise the row says the vote was held and stops. \"Power changed hands\" is used only where the source says the governing side lost.</p>"
      + "<h4>Arsenals</h4><p>" + esc(D.nukes.note) + "</p>"
      + '</div><div class="col scroll"><h4>Sources<small>' + keys.length + " here, and the Conflicts' own</small></h4>" + srcList(keys) + "</div></div>";
  }

  /* ---------------- the side panel ---------------- */
  const X_BTN = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button>';
  const rel = (attr, id, label, sub, c) => '<button class="rel" ' + attr + '="' + esc(id) + '"' + (c ? ' style="border-left-color:' + c + '"' : "") + ">" + esc(label) + (sub ? "<i>" + esc(sub) + "</i>" : "") + "</button>";
  function dispatchCard(w) {
    const newer = W[w.ix - 1], older = W[w.ix + 1];
    return X_BTN + '<div class="sd-k" style="color:' + KD[w.k][1] + '">' + KD[w.k][0] + " · " + fd(w.d, w.approx) + '</div><div class="sd-t">' + esc(w.t) + '</div><p class="sd-p">' + esc(w.x) + "</p>"
      + '<div class="sd-k">Where</div><div class="chips">' + (w.w || []).filter(n => F[n]).map(n => '<button class="chipbtn" data-c="' + esc(n) + '">' + esc(nm(n)) + "</button>").join("") + "</div>"
      + '<div class="sd-k">Source</div>' + srcList(w.s)
      + (w.cf ? '<div class="sd-k">The conflict</div>' + rel("data-w", w.cf, CBY[w.cf].n, CBY[w.cf].lv + " · " + lv(CBY[w.cf]).name, lv(CBY[w.cf]).c) : "")
      + '<div class="sd-links">' + (st.v !== "board" ? '<button class="lnk" data-go="board">On the board ⟶</button>' : "") + (newer ? '<button class="lnk" data-d="' + newer.id + '">◂ newer</button>' : "") + (older ? '<button class="lnk" data-d="' + older.id + '">older ▸</button>' : "") + "</div>";
  }
  function warCard(c) {
    const l = lv(c);
    return X_BTN + '<div class="sd-k">' + esc(c.rg) + " · " + esc(c.ty) + '</div><div class="sd-t">' + esc(c.n) + '</div><div class="sd-d"><i class="lvd" style="background:' + l.c + '"></i>Level ' + l.n + " · " + l.name + " · since " + c.since + "</div>"
      + '<div class="lv-meter" style="--c:' + l.c + '">' + LV.map(x => "<i" + (x.n <= c.lv ? ' class="on"' : "") + "></i>").join("") + "</div>"
      + '<div class="sd-k">Now</div><p class="sd-p">' + esc(c.now) + "</p>"
      + (c.d25 || c.d26 ? '<div class="dth"><div><span>Dead, 2025</span><b>' + esc(c.d25 || "—") + "</b></div><div><span>2026, to late Aug</span><b>" + esc(c.d26 || "—") + "</b></div></div>" : "")
      + '<div class="sd-links"><a class="lnk go" href="conflicts.html#v=map&i=' + c.id + '">Sides, losses and every source, in the Conflicts ⟶</a></div>'
      + '<div class="sd-k">Source</div>' + srcList(c.src.slice(0, 3))
      + (W.filter(w => w.cf === c.id).length ? '<div class="sd-k">On the wire</div>' + W.filter(w => w.cf === c.id).map(w => rel("data-d", w.id, w.t, fd(w.d, w.approx), KD[w.k][1])).join("") : "");
  }
  function countryCard(n) {
    const f = F[n]; let h = X_BTN + '<div class="sd-k">The situation of</div><div class="sd-t">' + esc(nm(n)) + "</div>";
    if (f.wars.length) h += '<div class="sd-k">At war, or near it</div>' + f.wars.map(c => rel("data-w", c.id, c.n, c.lv + " · " + lv(c).name + (c.d26 ? " · 2026: " + c.d26 : ""), lv(c).c)).join("");
    if (f.blocs.length) h += '<div class="sd-k">Stands with</div>' + f.blocs.map(x => rel("data-g", x[0].id, x[0].full, (x[1] === "partner" ? "partner country" : "member") + " · " + x[0].kind.toLowerCase(), x[0].c)).join("");
    if (f.us.length || f.eu) h += '<div class="sd-k">Under sanctions</div>' + f.us.map(r => '<div class="loss"><b>United States</b><small>' + esc(r[1]) + " · last changed " + fd(r[2]) + " · " + srcA("ofac") + "</small></div>").join("") + (f.eu ? '<div class="loss"><b>European Union</b><small>named in the EU\'s 2026 brief on restrictive measures · ' + srcA("eusan") + "</small></div>" : "");
    if (f.nuke) h += '<div class="sd-k">Nuclear arsenal</div><div class="dth"><div><span>Warheads</span><b>' + f.nuke[4].toLocaleString("en") + "</b></div><div><span>Deployed</span><b>" + (f.nuke[1] ? f.nuke[1].toLocaleString("en") : "—") + '</b></div></div><p class="hint">SIPRI estimate, January 2026 · ' + srcIn(D.nukes.s) + "</p>";
    if (f.ballots.length || f.ahead.length || f.force.length) { h += '<div class="sd-k">Who rules, and by what vote</div>';
      f.force.forEach(r => { h += '<div class="loss"><b>' + fd(r[0]) + "</b> " + esc(r[2]) + "<small>" + srcIn(r[3]) + "</small></div>"; });
      f.ballots.forEach(r => { h += '<div class="loss"><span class="bk" style="--c:' + BAL[r[4]][1] + '">' + BAL[r[4]][0] + "</span><b>" + fd(r[0]) + "</b> " + esc(r[2]) + ". " + (r[3] ? esc(r[3]) : "The result was not read for this page.") + "<small>" + srcIn(r[5]) + "</small></div>"; });
      f.ahead.forEach(r => { h += '<div class="loss"><b>' + fd(r[0]) + "</b> votes for " + esc(r[2].toLowerCase()) + "<small>" + srcA("ifesup") + "</small></div>"; }); }
    if (f.wire.length) h += '<div class="sd-k">On the wire</div>' + f.wire.map(w => rel("data-d", w.id, w.t, fd(w.d, w.approx) + " · " + KD[w.k][0], KD[w.k][1])).join("");
    return h + '<div class="sd-links">' + (st.v !== "board" ? '<button class="lnk" data-go="board">On the board ⟶</button>' : "") + '<a class="lnk" href="realms.html#v=map">How it is governed, in the Realms ⟶</a></div>';
  }
  function straitCard(s) {
    const z = D.status[s.status];
    return X_BTN + '<div class="sd-k" style="color:' + z[1] + '">Strait · ' + z[0] + '</div><div class="sd-t">' + esc(s.n) + '</div><p class="sd-p">' + esc(s.line) + "</p>"
      + s.figs.map(r => '<div class="loss"><b>' + esc(r[1]) + "</b><small>" + esc(r[0]) + "</small></div>").join("") + '<div class="sd-k">Source</div>' + srcList(s.s)
      + (s.cf ? '<div class="sd-k">The conflict behind it</div>' + rel("data-w", s.cf, CBY[s.cf].n, CBY[s.cf].lv + " · " + lv(CBY[s.cf]).name, lv(CBY[s.cf]).c) : "");
  }
  function blocCard(b) {
    const chip = n => F[n] && SHAPES[n] ? '<button class="chipbtn" data-c="' + esc(n) + '">' + esc(nm(n)) + "</button>" : '<span class="chipbtn off">' + esc(nm(n)) + "</span>";
    return X_BTN + '<div class="sd-k" style="color:' + b.c + '">' + esc(b.kind) + '</div><div class="sd-t">' + esc(b.full) + '</div><p class="sd-p">' + esc(b.note) + "</p>"
      + '<div class="sd-k">Members · ' + (b.members.length + (b.off || []).length) + '</div><div class="chips">' + b.members.concat(b.off || []).map(chip).join("") + "</div>"
      + (b.partners ? '<div class="sd-k">Partner countries · ' + b.partners.length + '</div><div class="chips">' + b.partners.map(chip).join("") + "</div>" : "")
      + '<div class="sd-k">Source</div>' + srcList(b.s) + '<div class="sd-links"><button class="lnk" data-lens="' + b.id + '">On the board ⟶</button></div>';
  }
  function intro() {
    const T = { board: ["THE BOARD", "The world as it stood on " + asOfT + ". Choose a lens to repaint the map: the wars, the blocs, the sanctions, the year's ballots, the nuclear arsenals. The dots are dated events of the last ninety days; the diamonds are the straits. Click anything."],
                wire: ["THE WIRE", "Every dispatch, newest first. Each is one dated event, stated as its source states it, with the source beside it."],
                blocs: ["THE BLOCS", "One ledger for every country that sits in an alliance, is under sanctions or holds nuclear weapons. Read across a row for where a country stands; read down a column for who stands together."],
                ballots: ["THE BALLOTS", "The national votes of 2026 and what they decided, the votes still ahead, and the governments changed by other means."],
                method: ["METHOD", "What each layer rests on, what it leaves out, and every source."] }[st.v];
    const cnt = k => D.ballots.filter(r => r[4] === k).length;
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + "</p>"
      + '<div class="dth"><div><span>Major wars</span><b>' + CL.filter(c => c.lv === 5).length + "</b></div><div><span>Wars</span><b>" + CL.filter(c => c.lv === 4).length + "</b></div><div><span>Governments voted out, 2026</span><b>" + cnt("new") + "</b></div><div><span>Warheads</span><b>" + D.nukes.world[3].toLocaleString("en") + "</b></div></div>"
      + '<div class="q" style="border-color:#5b93b8"><b style="color:#5b93b8">A snapshot</b><span>Compiled ' + asOfT + ". It does not update itself; each line carries its date.</span></div>"
      + '<div class="sd-k">The latest</div>' + W.slice(0, 8).map(w => rel("data-d", w.id, w.t, fd(w.d, w.approx) + " · " + KD[w.k][0], KD[w.k][1])).join("");
  }
  function renderSide() {
    const side = $("dc-side");
    const html = st.d && WBY[st.d] ? dispatchCard(WBY[st.d]) : st.w && CBY[st.w] ? warCard(CBY[st.w]) : st.c && F[st.c] ? countryCard(st.c) : st.s && SBY[st.s] ? straitCard(SBY[st.s]) : st.g && BBY[st.g] ? blocCard(BBY[st.g]) : null;
    if (!html && innerWidth <= 860) { side.hidden = true; return; }
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (html ? "" : " intro") + '">' + (html || intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read();
    if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v;
    st.l = LENS.some(l => l[0] === q.l) ? q.l : "wars"; st.b = BBY[q.b] ? q.b : null; if (st.b) st.l = "blocs"; st.k = KD[q.k] ? q.k : null;
    clear(); if (WBY[q.d]) st.d = q.d; else if (CBY[q.w]) st.w = q.w; else if (F[q.c]) st.c = q.c; else if (SBY[q.s]) st.s = q.s; else if (BBY[q.g]) st.g = q.g;
    built.boot = 1; sync(true); if (st.v === "board" && picked()) setTimeout(fly, 60);
  }
  function boot() {
    tabs = K.tabs(() => st.v, go);
    $("dc-side").addEventListener("click", e => {
      if (e.target.closest("a")) return;
      if (e.target.closest(".sd-x")) { clear(); return sync(); }
      const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; sync(); return setTimeout(fly, 80); }
      const ln = e.target.closest("[data-lens]"); if (ln) { st.v = "board"; st.l = "blocs"; st.b = ln.dataset.lens; return sync(); }
      for (const k of ["d", "w", "c", "g", "s"]) { const b = e.target.closest("[data-" + k + "]"); if (b) { clear(); st[k] = b.dataset[k]; sync(); if (st.v === "board") fly(); return; } }
    });
    document.addEventListener("keydown", e => {
      if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape" && picked()) { clear(); return sync(); }
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d && st.d) { const n = W[WBY[st.d].ix + d]; if (n) { st.d = n.id; sync(); } }            /* ← → walk the wire: newer, older */
    });
    const hay = [];
    W.forEach(w => hay.push([(w.t + " " + w.x + " " + (w.w || []).join(" ")).toLowerCase(), { label: w.t, sub: fd(w.d, w.approx) + " · " + KD[w.k][0], k: "d", id: w.id }]));
    Object.keys(F).forEach(n => hay.push([(n + " " + nm(n)).toLowerCase(), { label: nm(n), sub: "Country", k: "c", id: n }]));
    BL.forEach(b => hay.push([(b.n + " " + b.full).toLowerCase(), { label: b.full, sub: b.kind, k: "g", id: b.id }]));
    D.straits.forEach(s => hay.push([s.n.toLowerCase(), { label: s.n, sub: "Strait · " + D.status[s.status][0], k: "s", id: s.id }]));
    K.finder($("dc-q"), q => hay.filter(h => h[0].indexOf(q) >= 0).map(h => h[1]).sort((a, b) => (a.k === "c" ? 0 : 1) - (b.k === "c" ? 0 : 1)),
      h => { if (st.v === "method") st.v = "board"; if (h.k === "s") { st.v = "board"; st.straits = 1; } if (h.k === "d" && st.v === "board") { st.wire = 1; st.k = null; } clear(); st[h.k] = h.id; sync(); if (st.v === "board") fly(); });
    let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); render(st.v); }, 140); });
    window.addEventListener("hashchange", applyHash);
    applyHash();
  }
  boot();
})();
