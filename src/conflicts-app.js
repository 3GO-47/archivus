/* ============================================================
   ARCHIVUS — THE CONFLICTS (v13)
   Every conflict under way, read five ways from one file
   (src/data/conflicts.js):
     · the Map          — countries shaded by severity, a pin per
                          conflict, a diamond per armed group
     · the Ladder       — all of them on one scale, tension → major war
     · the Toll         — what each side has lost, and who says so
     · the Belligerents — the armed groups, and which governments list
                          them as terrorist organisations
     · Method & sources — how the scale is set; every source
   Deep link:  conflicts.html#v=map&i=sudan   conflicts.html#v=toll
   The page states what its sources state. A claim stays a claim:
   nothing here adds one side's count to another's.
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc;
  const D = window.ARCHIVUS_CONFLICTS, LV = D.levels, SRC = D.src;
  const L = D.list.slice(), BY = {}; L.forEach(c => { BY[c.id] = c; });
  /* a sortable number from a figure written for people: "42,286" → 42286; a range gives its lower end */
  const num = s => { const m = s == null ? null : String(s).replace(/,/g, "").match(/\d+/); return m ? +m[0] : null; };
  const weight = c => num(c.d26) != null && /^[\d,]/.test(String(c.d26)) ? num(c.d26) : num(c.d25) != null && /^[\d,]/.test(String(c.d25)) ? num(c.d25) * 0.6 : 0;
  L.sort((a, b) => b.lv - a.lv || weight(b) - weight(a) || a.n.localeCompare(b.n));     /* the reading order everywhere: worst first */
  const lv = c => LV[c.lv - 1];
  const TR = { up: ["▲", "worsening"], flat: ["▬", "unchanging"], down: ["▼", "easing"] };
  const tr = c => c.tr ? '<em class="tr-' + c.tr + '" title="' + TR[c.tr][1] + " — " + esc(c.trBy) + '">' + TR[c.tr][0] + "</em>" : "";
  const PK = { state: "State", armed: "Armed group", gang: "Criminal organisation", bloc: "Coalition" };
  const KD = { own: "Own account", claim: "Opponent's claim", est: "Outside estimate", count: "Count" };
  const src = k => { const s = SRC[k]; return s ? '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" title="' + esc(s[0]) + '">' + esc(K.host(s[1])) + "</a>" : ""; };
  const asOf = new Date(D.meta.asOf + "T00:00:00Z"), asOfT = asOf.getUTCDate() + " " + K.MON[asOf.getUTCMonth()] + " " + asOf.getUTCFullYear();

  /* every party, flat: the Belligerents table and the map's diamonds are both drawn from this */
  const P = [];
  L.forEach(c => c.sides.forEach(s => s.parties.forEach(p => { P.push({ c, s, p, ix: P.length, des: p.us && p.uk ? "both" : p.us ? "us" : p.uk ? "uk" : "none" }); })));
  const ARMED = P.filter(x => x.p.k === "armed" || x.p.k === "gang" || x.p.us || x.p.uk);
  const desText = x => x.des === "both" ? "On the US and UK terrorist lists" : x.des === "us" ? "On the US terrorist list" : x.des === "uk" ? "On the UK terrorist list" : "On neither list";
  const inCountry = {}; L.forEach(c => (c.where || []).forEach(w => { (inCountry[w] = inCountry[w] || []).push(c); }));

  const st = { v: "map", i: null, c: null, lvf: [1, 1, 1, 1, 1], act: 1, only: 0, des: "all" };
  const built = {};
  let tabs = null, map = null, marks = [];
  const shown = c => st.lvf[c.lv - 1];

  /* ---------------- state ---------------- */
  function sync(skipHash) {
    if (!skipHash) K.hash.write({ v: st.v, i: st.i, c: st.i ? null : st.c });
    tabs.paint(); renderSide(); render(st.v);
  }
  function go(v) { if (tabs.ids.indexOf(v) < 0) return; st.v = v; sync(); }
  function pick(id, fly) {
    st.i = id && BY[id] ? id : null; st.c = null; sync();
    if (st.i && fly && st.v === "map" && map) flyTo(BY[st.i]);
    const el = st.i && document.querySelector("#v-" + st.v + ' [data-i="' + st.i + '"]'); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function render(v) { if (v === "map") drawMap(); else if (v === "ladder") drawLadder(); else if (v === "toll") drawToll(); else if (v === "actors") drawActors(); else drawMethod(); }

  /* ---------------- the map ---------------- */
  /* country fill: the level's colour, sunk toward the map's ground so pins and diamonds read on top of it */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const sink = (h, t) => { const a = hex(h), b = [21, 26, 39]; return "rgb(" + a.map((v, i) => Math.round(v * t + b[i] * (1 - t))).join(",") + ")"; };
  const X = lon => lon + 180, Y = lat => 90 - lat;        /* the map's shapes are plate carrée: one unit per degree */
  const el = K.svgEl;
  function flyTo(c) { const w = (c.where || []).filter(n => map.paths[n]); if (w.length === 1 && c.lv < 5) map.focus(w[0]); }
  /* overlay marks are drawn at screen size: each sits in a group that is re-scaled whenever the view moves */
  function place() { if (!map) return; const s = map.scale(); for (let i = 0; i < marks.length; i++) marks[i][0].setAttribute("transform", "translate(" + marks[i][1] + " " + marks[i][2] + ") scale(" + s.toFixed(4) + " " + (s / map.SY).toFixed(4) + ")"); }
  function mark(g, lat, lon) { marks.push([g, X(lon).toFixed(2), Y(lat).toFixed(2)]); map.over.appendChild(g); return g; }
  const DIAMOND = "M0 -5.4L5.4 0L0 5.4L-5.4 0Z";
  function diamond(g, des) {
    if (des === "both") g.appendChild(el("circle", { r: 8.2, class: "r" }));
    g.appendChild(el("path", { d: DIAMOND, class: des === "us" || des === "both" ? "d" : des === "uk" ? "u" : "h" }));
    if (des === "uk") g.appendChild(el("circle", { r: 1.7, class: "d" }));
  }
  const legIcon = des => { const g = el("svg", { width: 20, height: 20, viewBox: "-10 -10 20 20", class: "cf-mk" }); diamond(g, des); return g.outerHTML; };
  function drawMap() {
    if (!built.map) {
      built.map = 1;
      const ident = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { ident[c.n] = c.n; });
      const tip = K.tip($("mp-tip"), $("mp-wrap"));
      map = K.worldMap($("mp"), { map: ident, tip, onView: place,
        onPick: (name, t) => {
          const m = t && t.closest && t.closest("[data-cf]"); if (m) return pick(m.dataset.cf === st.i ? null : m.dataset.cf);
          const cs = name ? (inCountry[name] || []).filter(shown) : [];
          if (cs.length === 1) return pick(cs[0].id === st.i ? null : cs[0].id);
          st.i = null; st.c = cs.length ? name : null; sync();
        },
        tipFor: (iso, name) => {
          if (name.charAt(0) === "@") { const k = name.charAt(1), v = name.slice(2);
            if (k === "c") { const c = BY[v]; return "<b>" + esc(c.n) + "</b><small>" + c.lv + " · " + lv(c).name + (c.tr ? " · " + TR[c.tr][1] : "") + "</small>" + (c.d26 ? "<small>2026: " + esc(c.d26) + " dead</small>" : ""); }
            const x = P[+v]; return "<b>" + esc(x.p.n) + "</b><small>" + PK[x.p.k] + " · " + desText(x).toLowerCase() + "</small><small>" + esc(x.c.n) + "</small>"; }
          const cs = (inCountry[name] || []).filter(shown); return "<b>" + esc(name) + "</b>" + cs.map(c => "<small>" + c.lv + " · " + esc(c.n) + "</small>").join("");
        } });
      $("mp-lv").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const i = +b.dataset.l; st.lvf[i] = st.lvf[i] ? 0 : 1; if (!st.lvf.some(Boolean)) st.lvf = [1, 1, 1, 1, 1]; if (st.i && !shown(BY[st.i])) st.i = null; sync(); });
      $("mp-lay").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.k === "act") st.act = st.act ? 0 : 1; else st.only = st.only ? 0 : 1; sync(); });
      $("mp-scale").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) pick(b.dataset.i === st.i ? null : b.dataset.i, true); });
      $("mp-zi").onclick = () => map.zoomBy(1 / 1.6); $("mp-zo").onclick = () => map.zoomBy(1.6); $("mp-zr").onclick = () => map.reset();
      $("mp-leg2").innerHTML = $("mp-leg").innerHTML = '<b>Severity</b>' + LV.map(l => '<span><i style="background:' + l.c + '"></i>' + l.n + " " + l.name + "</span>").join("")
        + '<span class="lg-h">Armed groups</span><span>' + legIcon("us") + "on the US terrorist list</span><span>" + legIcon("both") + "US and UK lists</span><span>" + legIcon("uk") + "UK list only</span><span>" + legIcon("none") + "on neither</span>"
        + "<small>A designation is a government's act, not a finding of fact. Click a pin, a diamond or a country.</small>";
    }
    const cnt = LV.map(l => L.filter(c => c.lv === l.n).length);
    $("mp-lv").innerHTML = LV.map((l, i) => '<button class="chipbtn lvc' + (st.lvf[i] ? " on" : "") + '" data-l="' + i + '" title="' + esc(l.def) + '"><i class="lvd" style="background:' + l.c + '"></i>' + l.n + " " + l.name + "<small>" + cnt[i] + "</small></button>").join("");
    $("mp-lay").innerHTML = '<button class="chipbtn' + (st.act ? " on" : "") + '" data-k="act" title="Show a diamond for each armed group">Armed groups</button><button class="chipbtn' + (st.only ? " on" : "") + '" data-k="only" title="Show only groups on a terrorist list">Designated only</button>';
    const vis = L.filter(shown);
    map.paint(name => { const cs = (inCountry[name] || []).filter(shown); if (!cs.length) return null; const top = cs.reduce((a, c) => c.lv > a.lv ? c : a); return sink(lv(top).c, st.i && !cs.some(c => c.id === st.i) ? 0.18 : 0.3 + 0.12 * top.lv); });   /* the worse, the stronger the fill */
    /* pins and diamonds */
    marks = []; map.over.textContent = "";
    vis.slice().reverse().forEach(c => {                    /* worst last, so they sit on top */
      const l = lv(c), g = el("g", { class: "cf-pin" + (st.i === c.id ? " sel" : st.i ? " dim" : ""), "data-cf": c.id }), tag = "@c" + c.id;
      g.appendChild(el("circle", { r: 4.5 + c.lv * 2, class: "o", fill: l.c, stroke: l.c, "data-n": tag })); g.appendChild(el("circle", { r: 2.7, class: "i", fill: l.c, "data-n": tag }));
      if (st.i === c.id || (c.lv === 5 && !st.i)) g.appendChild(el("text", { x: 8 + c.lv * 2, y: 3.6 }, c.n.split(":")[0]));
      mark(g, c.at[0], c.at[1]);
    });
    if (st.act) ARMED.forEach(x => { if (!x.p.at || !shown(x.c) || (st.only && x.des === "none")) return;
      const g = el("g", { class: "cf-mk" + (st.i && st.i !== x.c.id ? " dim" : ""), "data-cf": x.c.id }); diamond(g, x.des);
      Array.prototype.forEach.call(g.childNodes, n => n.setAttribute("data-n", "@p" + x.ix)); mark(g, x.p.at[0], x.p.at[1]); });
    place();
    /* the scale under the map */
    $("mp-scale").innerHTML = LV.map((l, i) => { const cs = L.filter(c => c.lv === l.n);
      return '<div class="sc-col" style="--c:' + l.c + ";flex-grow:" + Math.max(1.4, Math.sqrt(cs.length) * 1.25).toFixed(2) + (st.lvf[i] ? "" : ";opacity:.45") + '"><div class="sc-h" title="' + esc(l.def) + '"><b>' + l.n + "</b>" + l.name + "<i>" + cs.length + '</i></div><div class="sc-b">'
        + cs.map(c => '<button class="sc-c' + (st.i === c.id ? " sel" : "") + '" data-i="' + c.id + '" title="' + esc(c.n) + '">' + esc(c.n.split(":")[0]) + tr(c) + "</button>").join("") + "</div></div>"; }).join("");
    const groups = ARMED.filter(x => x.p.at && shown(x.c)), listed = groups.filter(x => x.des !== "none").length;
    $("mp-n").textContent = vis.length + " of " + L.length + " conflicts shown · " + groups.length + " armed groups placed, " + listed + " of them on a terrorist list · as of " + asOfT;
  }

  /* ---------------- the ladder ---------------- */
  function drawLadder() {
    $("ld-cols").innerHTML = LV.map(l => { const cs = L.filter(c => c.lv === l.n);
      return '<div class="ld-col" style="--c:' + l.c + '"><div class="ld-h"><b>' + l.n + "</b><span>" + l.name + "</span><p>" + esc(l.def) + '</p></div><div class="ld-b">'
        + cs.map(c => '<button class="ld-card' + (st.i === c.id ? " sel" : "") + '" data-i="' + c.id + '" style="--c:' + l.c + '"><b>' + esc(c.n) + " " + tr(c) + "</b><small>" + esc(c.rg) + " · since " + c.since + "</small>"
          + (c.d26 || c.d25 ? "<small>" + (c.d26 ? "2026: " + esc(c.d26) : "") + (c.d26 && c.d25 ? " · " : "") + (c.d25 ? "2025: " + esc(c.d25) : "") + "</small>" : "<small>" + (c.lv <= 2 ? "no deaths reported" : "no comparable yearly count — open the card") + "</small>") + "</button>").join("") + "</div></div>"; }).join("");
    if (!built.ld) { built.ld = 1; $("ld-cols").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) pick(b.dataset.i === st.i ? null : b.dataset.i); }); }
  }

  /* ---------------- the toll ---------------- */
  /* one line per side: the first figure in the order a reader should trust it — a count by name, then the side's own account,
     then an outside estimate, and only then what its enemy claims */
  const ORDER = { count: 0, own: 1, est: 2, claim: 3 };
  const headline = s => { const r = (s.loss || []).filter(x => x[2] !== "—").sort((a, b) => ORDER[a[3]] - ORDER[b[3]])[0]; return r ? "<b>" + esc(r[1]) + "</b><small>" + esc(r[0]) + " · " + esc(r[2]) + " · " + KD[r[3]].toLowerCase() + "</small>" : "<small>no figure published in the sources read</small>"; };
  function drawToll() {
    const max = Math.max.apply(null, L.map(weight));
    let h = '<table class="cf-tbl"><thead><tr><th>Conflict</th><th>Level</th><th>Dead, 2025</th><th>Dead, 2026 to late Aug</th><th>One side</th><th>The other</th></tr></thead><tbody>';
    L.forEach(c => { const l = lv(c), w = weight(c), two = c.sides.filter(s => (s.loss || []).length).concat(c.sides.filter(s => !(s.loss || []).length)).slice(0, 2);
      h += '<tr class="row' + (st.i === c.id ? " sel" : "") + '" data-i="' + c.id + '"><td class="nm">' + esc(c.n) + "<small>" + esc(c.rg) + " · since " + c.since + '</small></td><td class="lv"><i class="lvd" style="background:' + l.c + '"></i>' + l.n + " " + l.name + " " + tr(c) + '</td><td class="num">' + esc(c.d25 || "—") + '</td><td class="num">'
        + (w ? '<span class="bar" style="--c:' + l.c + ";width:" + Math.max(2, Math.round(Math.sqrt(w / max) * 70)) + 'px"></span>' : "") + esc(c.d26 || "—") + "</td>" + two.map(s => '<td class="sd"><small>' + esc(s.n) + "</small>" + headline(s) + "</td>").join("") + "</tr>"; });
    $("tl-wrap").innerHTML = h + "</tbody></table>";
    $("tl-n").innerHTML = "The two death columns come from one running table, so rows can be compared; its 2026 figures stop in late August. The side columns show one figure each, labelled by who gave it. Open a row for every figure and its source.";
    if (!built.tl) { built.tl = 1; $("tl-wrap").addEventListener("click", e => { const r = e.target.closest("tr[data-i]"); if (r) pick(r.dataset.i === st.i ? null : r.dataset.i); }); }
  }

  /* ---------------- the belligerents ---------------- */
  const DF = [["all", "All armed groups"], ["us", "On the US list"], ["uk", "On the UK list"], ["none", "On neither"]];
  const desPass = x => st.des === "all" || (st.des === "us" ? !!x.p.us : st.des === "uk" ? !!x.p.uk : x.des === "none");
  function drawActors() {
    $("ac-f").innerHTML = DF.map(f => '<button class="chipbtn' + (st.des === f[0] ? " on" : "") + '" data-d="' + f[0] + '">' + f[1] + "<small>" + ARMED.filter(x => f[0] === "all" || (f[0] === "us" ? x.p.us : f[0] === "uk" ? x.p.uk : x.des === "none")).length + "</small></button>").join("");
    let h = '<table class="cf-tbl"><thead><tr><th></th><th>Group</th><th>Kind</th><th>United States list</th><th>United Kingdom list</th><th>Side</th></tr></thead><tbody>';
    L.forEach(c => { const xs = ARMED.filter(x => x.c === c && desPass(x)); if (!xs.length) return; const l = lv(c);
      h += '<tr class="grp row" data-i="' + c.id + '"><td colspan="6"><i class="lvd" style="background:' + l.c + '"></i>' + esc(c.n) + " — " + l.n + " " + l.name + "</td></tr>";
      xs.forEach(x => { h += '<tr class="row' + (st.i === c.id ? " sel" : "") + '" data-i="' + c.id + '"><td>' + legIcon(x.des) + '</td><td class="nm">' + esc(x.p.n) + (x.p.note ? "<small>" + esc(x.p.note) + "</small>" : "") + "</td><td>" + PK[x.p.k] + '</td><td class="des ' + (x.p.us ? "y" : "n") + '">' + (x.p.us ? "listed " + esc(x.p.us) : "not listed") + '</td><td class="des ' + (x.p.uk ? "y" : "n") + '">' + (x.p.uk ? "proscribed " + esc(x.p.uk) : "not proscribed") + "</td><td>" + esc(x.s.n) + "</td></tr>"; }); });
    $("ac-wrap").innerHTML = h + "</tbody></table>";
    $("ac-n").innerHTML = "Two lists are shown because they are published in full and differ: " + src("fto") + " and " + src("uk") + ". States' own armies are not listed here unless a government has designated one.";
    if (!built.ac) { built.ac = 1;
      $("ac-f").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st.des = b.dataset.d; sync(); } });
      $("ac-wrap").addEventListener("click", e => { const r = e.target.closest("tr[data-i]"); if (r) pick(r.dataset.i === st.i ? null : r.dataset.i); }); }
  }

  /* ---------------- method and sources ---------------- */
  function drawMethod() {
    if (built.mt) return; built.mt = 1;
    const keys = Object.keys(SRC);
    $("mt-pane").innerHTML = '<div class="grid2 even"><div class="col scroll">'
      + "<h4>The scale</h4><dl class=\"def\">" + LV.map(l => '<dt><i class="lvd" style="background:' + l.c + '"></i>' + l.n + " " + l.name + "</dt><dd>" + esc(l.def) + "</dd>").join("") + "</dl>"
      + "<p>The level is the Archive's reading, set by rule: the pace of deaths in 2026 where a count exists, otherwise the kind of force in use. The death thresholds are those of the Uppsala conflict programme and of Wikipedia's running table (100, 1,000 and 10,000 a year); the five names follow the Heidelberg barometer. A conflict under a ceasefire keeps the level its deaths still earn.</p>"
      + "<h4>The arrow</h4><p>▲ worsening, ▬ unchanging, ▼ easing. It is taken from the Council on Foreign Relations' conflict tracker wherever that tracker covers the conflict, and each card says so. Where no outside assessment was found the arrow is left off.</p>"
      + "<h4>The dead</h4><ul><li>The yearly figures on every card come from one table, so that conflicts can be compared. Its 2026 column stops in late August 2026; the table's rows are sometimes wider than the conflict named here, and the card says where.</li>"
      + "<li>Each side's losses are given as stated, with who stated them: the side's own account, its opponent's claim, an outside estimate, or a count by name. Opponents' claims are usually several times the admitted figure; both are shown, and they are never added together.</li>"
      + "<li>Many belligerents publish nothing. Where the sources read give no figure, the page says so, and does not estimate one.</li></ul>"
      + "<h4>The designations</h4><p>Listing a group as a terrorist organisation is an act of a government under its own law. Lists differ: the Houthis and the Revolutionary Guards are on Washington's list and not London's; the Wagner Group is on London's and not Washington's; since 2025 Washington has listed drug cartels and street gangs, which no other list shown here does. The map marks who is on which list and takes no view on whether they should be.</p>"
      + "<h4>What is left out</h4><p>Conflicts under about 100 deaths a year with no standoff between states (southern Thailand, Casamance, Paraguay and others) are in " + src("wl") + " and not on the map. The dataset was compiled on " + asOfT + ". It will go stale: each card carries the date of the newest report read for it.</p>"
      + '</div><div class="col scroll"><h4>Sources<small>' + keys.length + '</small></h4><div class="srcs">' + keys.map(k => '<a href="' + esc(SRC[k][1]) + '" target="_blank" rel="noopener">' + esc(SRC[k][0]) + "<small>" + esc(SRC[k][2]) + "</small></a>").join("") + "</div></div></div>";
  }

  /* ---------------- the side panel ---------------- */
  function card(c) {
    const l = lv(c), pos = L.indexOf(c), prev = L[pos - 1], next = L[pos + 1];
    let h = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button><div class="sd-k">' + esc(c.rg) + " · " + esc(c.ty) + '</div><div class="sd-t">' + esc(c.n) + '</div>'
      + '<div class="sd-d"><i class="lvd" style="background:' + l.c + '"></i>Level ' + l.n + " · " + l.name + (c.tr ? " · " + TR[c.tr][1] + " (" + esc(c.trBy) + ")" : "") + " · since " + c.since + "</div>"
      + '<div class="lv-meter" style="--c:' + l.c + '">' + LV.map(x => "<i" + (x.n <= c.lv ? ' class="on"' : "") + "></i>").join("") + '</div><div class="lv-ax"><span>tension</span><span>major war</span></div>'
      + '<div class="sd-k">Now</div><p class="sd-p">' + esc(c.now) + "</p>"
      + '<div class="sd-k">How it came about</div><p class="sd-p">' + esc(c.sum) + "</p>";
    if (c.d25 || c.d26 || c.cum) h += '<div class="sd-k">The dead</div><div class="dth"><div><span>2025</span><b>' + esc(c.d25 || "—") + "</b></div><div><span>2026, to late Aug</span><b>" + esc(c.d26 || "—") + "</b></div><div><span>In all</span><b>" + esc(c.cum || "—") + "</b></div></div>"
      + (c.src.indexOf("wl") >= 0 ? '<p class="hint">Yearly figures: ' + src("wl") + ", one table for every conflict.</p>" : "");
    (c.toll || []).forEach(t => { h += '<div class="loss"><b>' + esc(t[1]) + "</b><small>" + esc(t[0]) + " · " + esc(t[2]) + " · " + src(t[3]) + "</small></div>"; });
    h += '<div class="sd-k">The sides, and what each has lost</div>';
    c.sides.forEach(s => {
      h += '<div class="cf-side"><b>' + esc(s.n) + "</b>" + s.parties.map(p => '<div class="pty"><span>' + esc(p.n) + '</span><span class="k">' + PK[p.k] + "</span>"
        + (p.us ? '<span class="dz" title="' + esc(D.des.us.list) + '">US list · ' + esc(p.us) + "</span>" : "") + (p.uk ? '<span class="dz" title="' + esc(D.des.uk.list) + '">UK list · ' + esc(p.uk) + "</span>" : "")
        + (!p.us && !p.uk && (p.k === "armed" || p.k === "gang") ? '<span class="dz no">on neither list</span>' : "") + (p.note ? "<p>" + esc(p.note) + "</p>" : "") + "</div>").join("")
        + ((s.loss || []).length ? s.loss.map(r => '<div class="loss"><span class="kd ' + r[3] + '">' + KD[r[3]] + "</span><b>" + esc(r[1]) + "</b><small>" + esc(r[0]) + (r[2] !== "—" ? " · " + esc(r[2]) : "") + " · " + src(r[4]) + "</small></div>").join("")
          : '<div class="loss"><small>No figure for this side in the sources read.</small></div>') + "</div>";
    });
    h += '<div class="sd-k">Sources</div><div class="srcs">' + c.src.map(k => '<a href="' + esc(SRC[k][1]) + '" target="_blank" rel="noopener">' + esc(SRC[k][0]) + "<small>" + esc(SRC[k][2]) + "</small></a>").join("") + "</div>"
      + '<div class="sd-links">' + (st.v !== "map" ? '<button class="lnk" data-go="map">On the map ⟶</button>' : "") + (prev ? '<button class="lnk" data-i="' + prev.id + '">◂ ' + esc(prev.n.split(":")[0]) + "</button>" : "") + (next ? '<button class="lnk" data-i="' + next.id + '">' + esc(next.n.split(":")[0]) + " ▸</button>" : "") + "</div>";
    return h;
  }
  function countryCard(name) {
    const cs = (inCountry[name] || []).filter(shown);
    return '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button><div class="sd-k">' + cs.length + ' conflicts here</div><div class="sd-t">' + esc(name) + "</div>"
      + cs.map(c => '<button class="rel" data-i="' + c.id + '" style="border-left-color:' + lv(c).c + '">' + esc(c.n) + "<i>" + c.lv + " · " + lv(c).name + (c.d26 ? " · 2026: " + esc(c.d26) : "") + "</i></button>").join("");
  }
  function intro() {
    const T = { map: ["THE MAP", "Every armed conflict and armed standoff under way as of " + asOfT + ". Countries are shaded by the severity of the worst conflict on their soil; each pin is a conflict and each diamond an armed group, filled where a government has listed it as a terrorist organisation."],
                ladder: ["THE LADDER", "The same " + L.length + " conflicts on one scale, from disputes pursued by threat to full kinetic warfare. Within a level the deadliest this year comes first."],
                toll: ["THE TOLL", "What each side has lost, as far as anyone has said. Most armies publish little about their own dead and a great deal about their enemy's."],
                actors: ["THE BELLIGERENTS", "The " + ARMED.length + " armed groups and listed bodies in these conflicts, and where each stands on two governments' terrorist lists."],
                method: ["METHOD", "How the levels are set, what the figures can and cannot bear, and every source used."] }[st.v];
    const worst = L.filter(c => c.lv === 5).concat(L.filter(c => c.lv === 4 && c.tr === "up"));
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + "</p>"
      + '<div class="q" style="border-color:#ff7a66"><b style="color:#ff7a66">Claims are not counts</b><span>Every figure is labelled by who gave it. An army\'s account of its enemy\'s dead is shown as a claim, beside the enemy\'s own account where there is one.</span></div>'
      + '<div class="q" style="border-color:#e8c455"><b style="color:#e8c455">Designation is a government\'s act</b><span>The lists of the United States and the United Kingdom are shown side by side because they disagree.</span></div>'
      + '<div class="q" style="border-color:#5b93b8"><b style="color:#5b93b8">A snapshot</b><span>Compiled ' + asOfT + ". Each card gives the newest report read for it.</span></div>"
      + '<div class="sd-k">Major wars, and wars getting worse</div>' + worst.map(c => '<button class="rel" data-i="' + c.id + '" style="border-left-color:' + lv(c).c + '">' + esc(c.n) + "<i>" + c.lv + " · " + lv(c).name + (c.d26 ? " · 2026: " + esc(c.d26) : "") + "</i></button>").join("");
  }
  function renderSide() {
    const side = $("dc-side"), c = st.i && BY[st.i];
    const html = c ? card(c) : st.c && (inCountry[st.c] || []).length ? countryCard(st.c) : null;
    if (!html && innerWidth <= 860) { side.hidden = true; return; }
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (html ? "" : " intro") + '">' + (html || intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read();
    if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v;
    st.i = q.i && BY[q.i] ? q.i : null; st.c = !st.i && q.c && inCountry[q.c] ? q.c : null;
    built.boot = 1; sync(true);
    if (st.i && st.v === "map") setTimeout(() => flyTo(BY[st.i]), 60);
  }
  function boot() {
    tabs = K.tabs(() => st.v, go);
    $("dc-side").addEventListener("click", e => {
      if (e.target.closest(".sd-x")) { st.i = null; st.c = null; return sync(); }
      const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; sync(); return setTimeout(() => st.i && flyTo(BY[st.i]), 80); }
      const b = e.target.closest("[data-i]"); if (b) pick(b.dataset.i, true);
    });
    document.addEventListener("keydown", e => {
      if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape" && (st.i || st.c)) { st.i = null; st.c = null; return sync(); }
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d && st.i) { const n = L[L.indexOf(BY[st.i]) + d]; if (n) pick(n.id, true); }       /* ← → walk the conflicts, worst first */
    });
    const hay = L.map(c => [c, (c.n + " " + c.rg + " " + (c.where || []).join(" ") + " " + c.sides.map(s => s.parties.map(p => p.n).join(" ")).join(" ")).toLowerCase()]);
    K.finder($("dc-q"), q => hay.filter(h => h[1].indexOf(q) >= 0).map(h => { const hit = P.filter(x => x.c === h[0] && x.p.n.toLowerCase().indexOf(q) >= 0)[0]; return { label: h[0].n, sub: hit ? hit.p.n : h[0].lv + " · " + lv(h[0]).name + " · " + h[0].rg, i: h[0].id }; }),
      h => { if (st.v === "method") st.v = "map"; st.lvf = [1, 1, 1, 1, 1]; pick(h.i, true); });
    let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); render(st.v); }, 140); });
    window.addEventListener("hashchange", applyHash);
    applyHash();
  }
  boot();
})();
