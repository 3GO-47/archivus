/* ============================================================
   ARCHIVUS — THE COUPS (v11)
   Three layers of the same subject:
     · the Roll      — src/data/coups.js: the seizures worth knowing by
                       name, hand-classed by creed and declared aim
     · the Record    — src/data/coups-record.js (generated): every coup
                       attempt since 1950 (Powell & Thyne) and every regime
                       ended by force since 1789 (V-Dem)
     · two studies   — the Marxist and the Islamist seizures: the roads
                       taken and the conditions present beforehand
   Views: roll · record · red · green · patterns.   Deep link:
     coups.html#v=roll&i=october   coups.html#v=record&c=THA
   Every view fits one screen; long material is split into sections.
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc;
  const D = window.ARCHIVUS_COUPS, REC = window.ARCHIVUS_COUPS_RECORD;
  const L = D.list.map((a, ix) => ({ ix, id: a[0], y: a[1], n: a[2], pl: a[3], iso: a[4], k: a[5], i: a[6], g: a[7], ok: a[8], x: a[9], w: a[10], q: a[11] }));
  const BY = {}; L.forEach(e => { BY[e.id] = e; });
  const NAME = REC.names, LASTPT = REC.meta.ptLast;
  const IK = Object.keys(D.ideo), GK = Object.keys(D.goal);
  const GS = { throne: "Take office", stay: "Stay in office", corp: "Army's interests", order: "Restore order", block: "Block a rival", restore: "Restore old order", consti: "Constitution", nation: "Sovereignty", remake: "Remake society", faith: "Religious state" };
  const IS = { pers: "Personal", mil: "Praetor.", lib: "Liberal", con: "Conserv.", fas: "Fascist", nat: "Nation.", marx: "Marxist", isl: "Islamist", eth: "Ethnic" };
  const OKT = { 1: ["Took power and held it", "ok", "Held"], 2: ["Took power briefly or in part", "br", "Brief"], 0: ["Failed", "no", "Failed"] };
  const ENDT = { 0: "Military coup", 1: "Coup by another group", 2: "Self-coup", 3: "Assassination", 5: "Lost a civil war", 6: "Lost a war between states", 7: "Foreign intervention", 8: "Popular uprising" };
  const ENDC = { 0: "#c9a227", 1: "#e08a3c", 2: "#9a7fd1", 3: "#8d96af", 5: "#d2452f", 6: "#5b6b8c", 7: "#5b93b8", 8: "#49c9b8" };
  const DOC = { marx: "marxism", isl: "islamism", fas: "fascism", lib: "classlib", con: "burke", nat: "nationalism" };
  const HEAT = K.ramp(["#232a3c", "#6b5326", "#b06a2a", "#e0672f", "#ff3d3d"]);
  const yr = y => y < 0 ? -y + " BCE" : String(y);
  const wiki = t => "https://en.wikipedia.org/wiki/" + t;
  const okDot = (e, ok) => '<span class="okd o' + (ok == null ? e.ok : ok) + '" style="color:' + D.ideo[e.i][1] + '" title="' + OKT[ok == null ? e.ok : ok][0] + '"></span>';

  const st = { v: "roll", i: null, c: null, yr: null, fi: null, fg: null, fo: null, m: "att", red: "cases", green: "cases" };
  const built = {};
  let tabs = null, map = null;

  /* ---------------- derived from the record ---------------- */
  const PT = REC.pt, ENDS = REC.ends;
  const ptYear = {};                                         /* year → [attempts, successful] */
  Object.keys(PT).forEach(iso => PT[iso].forEach(r => { const a = ptYear[r[0]] = ptYear[r[0]] || [0, 0]; a[0] += r[1]; a[1] += r[2]; }));
  const ptTot = iso => (PT[iso] || []).reduce((a, r) => [a[0] + r[1], a[1] + r[2]], [0, 0]);
  const COUPT = e => e[5].some(t => t <= 2);                 /* V-Dem ending by coup, coup by others or self-coup */
  const vdByIso = {}; ENDS.forEach(e => { if (COUPT(e)) vdByIso[e[0]] = (vdByIso[e[0]] || 0) + 1; });
  const vdYear = {}; ENDS.forEach(e => { if (COUPT(e)) { const t = e[5].filter(x => x <= 2)[0], a = vdYear[e[1]] = vdYear[e[1]] || [0, 0, 0]; a[t]++; } });

  /* ---------------- state ---------------- */
  function sync(skipHash) {
    if (!skipHash) K.hash.write({ v: st.v, s: st.v === "red" || st.v === "green" ? (st[st.v] !== "cases" ? st[st.v] : null) : null, i: st.i, c: st.v === "record" ? st.c : null, y: st.v === "record" ? st.yr : null });
    tabs.paint(); renderSide(); render(st.v);
  }
  function go(v) { if (tabs.ids.indexOf(v) < 0) return; st.v = v; sync(); }
  function pickEvent(id) { st.i = id && BY[id] ? id : null; sync(); if (st.i && st.v === "roll") { const r = document.querySelector('.cu-li[data-i="' + st.i + '"]'); if (r) r.scrollIntoView({ block: "nearest" }); } }
  function pickCountry(iso) { st.c = iso && NAME[iso] ? iso : null; st.i = null; sync(); }
  function render(v) { if (v === "roll") drawRoll(); else if (v === "record") drawRecord(); else if (v === "red" || v === "green") drawStudy(v); else drawPatterns(); }
  function chartIn(id, draw) { const el = $(id); if (!el) return; const r = el.getBoundingClientRect(); el.innerHTML = draw(Math.max(260, Math.floor(r.width)), Math.max(70, Math.floor(r.height))); }

  /* ---------------- the roll ---------------- */
  const passes = e => (!st.fi || e.i === st.fi) && (!st.fg || e.g === st.fg) && (st.fo == null || e.ok === st.fo);
  /* the strip: one lane per creed. Time is drawn on three scales — antiquity to 1600 in a tenth of the
     width, 1600–1900 in a fifth, and the crowded years since 1900 in the rest */
  function rollStrip(W, H) {
    const small = W < 640, Lm = small ? 8 : 176, Rm = 12, T = 6, B = 22, pw = W - Lm - Rm, ph = H - T - B, lh = ph / IK.length;
    const x = y => Lm + pw * (y < 1600 ? (y + 450) / 2050 * 0.1 : y < 1900 ? 0.1 + (y - 1600) / 300 * 0.2 : 0.3 + (y - 1900) / 127 * 0.7);
    let h = '<rect x="' + x(1900) + '" y="' + T + '" width="' + (W - Rm - x(1900)) + '" height="' + ph + '" fill="rgba(255,255,255,.028)"/><rect x="' + x(1600) + '" y="' + T + '" width="' + (x(1900) - x(1600)) + '" height="' + ph + '" fill="rgba(255,255,255,.014)"/>';
    [-400, 1, 1000, 1700, 1800, 1900, 1920, 1940, 1960, 1980, 2000, 2020].forEach(y => { if (small && y > 1900 && y % 40) return; h += '<line class="gl" x1="' + x(y) + '" x2="' + x(y) + '" y1="' + T + '" y2="' + (T + ph) + '"/><text x="' + x(y) + '" y="' + (H - 6) + '" text-anchor="middle">' + (y < 0 ? -y + " BCE" : y) + "</text>"; });
    [1600, 1900].forEach(y => { h += '<line class="mk" x1="' + x(y) + '" x2="' + x(y) + '" y1="' + T + '" y2="' + (T + ph) + '"/>'; });
    const sub = Math.max(1, Math.floor(lh / 10.5)), n = {};
    L.forEach(e => { n[e.i] = (n[e.i] || 0) + 1; });
    IK.forEach((k, i) => {
      const y0 = T + lh * i;
      h += '<line x1="' + Lm + '" x2="' + (W - Rm) + '" y1="' + (y0 + lh) + '" y2="' + (y0 + lh) + '" stroke="rgba(255,255,255,.05)"/>';
      if (!small) h += '<text class="lane-t' + (st.fi === k ? " on" : "") + '" data-fi="' + k + '" x="' + (Lm - 10) + '" y="' + (y0 + lh / 2 + 4) + '" text-anchor="end">' + D.ideo[k][0] + " · " + n[k] + "</text>";
      /* dots: within a lane, each takes the first sub-row where it does not touch the one before */
      const last = []; for (let s = 0; s < sub; s++) last.push(-99);
      L.filter(e => e.i === k).forEach(e => {
        const px = x(e.y); let s = 0; while (s < sub - 1 && px - last[s] < 9.5) s++;
        if (px - last[s] < 9.5) { s = 0; for (let j = 1; j < sub; j++) if (last[j] < last[s]) s = j; }
        last[s] = px;
        const py = y0 + (s + 0.5) * lh / sub, c = D.ideo[k][1], on = e.id === st.i;
        h += '<circle class="cu-dot' + (e.ok === 0 ? " fail" : "") + (on ? " sel" : "") + (passes(e) ? "" : " dim") + '" data-i="' + e.id + '" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + (on ? 6.5 : 4.4) + '" fill="' + c + '"' + (e.ok === 0 ? ' stroke="' + c + '"' : e.ok === 2 ? ' fill-opacity=".55"' : "") + "><title>" + esc(yr(e.y) + " — " + e.n + ", " + e.pl + " (" + OKT[e.ok][2].toLowerCase() + ")") + "</title></circle>";
      });
    });
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Seizures of power by creed across time">' + h + "</svg>";
  }
  function drawRoll() {
    if (!built.roll) {
      built.roll = 1;
      $("v-roll").addEventListener("click", e => {
        const d = e.target.closest("[data-i]"); if (d) return pickEvent(d.dataset.i === st.i ? null : d.dataset.i);
        const cell = e.target.closest("td[data-fi][data-fg]"); if (cell) { const same = st.fi === cell.dataset.fi && st.fg === cell.dataset.fg; st.fi = same ? null : cell.dataset.fi; st.fg = same ? null : cell.dataset.fg; return drawRoll(); }
        const fi = e.target.closest("[data-fi]"); if (fi) { st.fi = st.fi === fi.dataset.fi ? null : fi.dataset.fi; return drawRoll(); }
        const fg = e.target.closest("[data-fg]"); if (fg) { st.fg = st.fg === fg.dataset.fg ? null : fg.dataset.fg; return drawRoll(); }
        const fo = e.target.closest("[data-fo]"); if (fo) { const v = fo.dataset.fo === "" ? null : +fo.dataset.fo; st.fo = st.fo === v ? null : v; return drawRoll(); }
      });
    }
    $("ro-ideo").innerHTML = IK.map(k => '<button class="chipbtn fam' + (!st.fi || st.fi === k ? " on" : "") + '" data-fi="' + k + '" title="' + esc(D.ideo[k][2]) + '"><span class="fdot" style="background:' + D.ideo[k][1] + '"></span>' + D.ideo[k][0].split(" ")[0].replace("Revolutionary", "Nationalist") + "</button>").join("");
    $("ro-ok").innerHTML = [1, 2, 0].map(o => '<button class="chipbtn' + (st.fo === o ? " on" : "") + '" data-fo="' + o + '" title="' + OKT[o][0] + '"><span class="okd o' + o + '" style="color:#d6d1c2;margin-right:5px"></span>' + OKT[o][2] + "</button>").join("");
    chartIn("ro-strip", rollStrip);
    /* creed × declared aim */
    const cnt = {}; let max = 1; L.forEach(e => { if (st.fo != null && e.ok !== st.fo) return; const k = e.i + "|" + e.g; cnt[k] = (cnt[k] || 0) + 1; max = Math.max(max, cnt[k]); });
    $("ro-heat").innerHTML = '<table class="mx heat"><thead><tr><th></th>' + IK.map(i => '<th data-fi="' + i + '" class="' + (st.fi === i ? "on" : "") + '" title="' + esc(D.ideo[i][0] + " — " + D.ideo[i][2]) + '"><span class="fdot" style="background:' + D.ideo[i][1] + ';margin:0 0 3px"></span><br>' + IS[i] + "</th>").join("") + "</tr></thead><tbody>"
      + GK.map(g => '<tr><td data-fg="' + g + '" class="' + (st.fg === g ? "on" : "") + '" title="' + esc(D.goal[g]) + '">' + GS[g] + "</td>" + IK.map(i => { const v = cnt[i + "|" + g]; return v ? '<td class="c' + (st.fi === i && st.fg === g ? " sel" : "") + '" data-fi="' + i + '" data-fg="' + g + '" style="background:' + D.ideo[i][1] + Math.round(40 + v / max * 115).toString(16) + '">' + v + "</td>" : '<td class="z">·</td>'; }).join("") + "</tr>").join("") + "</tbody></table>";
    $("ro-hn").textContent = "click a cell, a row or a column to filter";
    const rows = L.filter(passes).sort((a, b) => a.y - b.y || a.ix - b.ix);
    $("ro-lh").innerHTML = rows.length + (rows.length === L.length ? " seizures, 411 BCE – 2025" : " of " + L.length + " seizures") + (st.fi || st.fg || st.fo != null ? '<small><button class="chipbtn" data-fi="' + (st.fi || "") + '" id="ro-clear" style="padding:1px 8px">clear filters</button></small>' : "<small>click one to read it</small>");
    const cl = $("ro-clear"); if (cl) cl.onclick = ev => { ev.stopPropagation(); st.fi = st.fg = st.fo = null; drawRoll(); };
    $("ro-list").innerHTML = rows.map(e => '<div class="cu-li' + (e.id === st.i ? " sel" : "") + '" data-i="' + e.id + '"><span class="y">' + yr(e.y) + "</span><span><b>" + esc(e.n) + "</b><small>" + esc(e.pl) + " · " + GS[e.g].toLowerCase() + "</small></span>" + okDot(e) + "</div>").join("");
  }

  /* ---------------- the record ---------------- */
  const MS = { att: ["Coup attempts since 1950", "Powell & Thyne: every attempt by the military or other state elites to unseat the executive by illegal means, 1950–" + LASTPT],
               suc: ["Successful coups since 1950", "Powell & Thyne: attempts that held power for at least seven days"],
               vd: ["Governments ended by coup since 1789", "V-Dem historical regimes: endings by military coup, coup by another group, or self-coup"] };
  const recVal = iso => st.m === "vd" ? (vdByIso[iso] || 0) : ptTot(iso)[st.m === "suc" ? 1 : 0];
  function yearBars(W, H) {
    const vd = st.m === "vd", y0 = vd ? 1789 : 1950, y1 = vd ? 2025 : LASTPT, n = y1 - y0 + 1, Lm = 30, Rm = 6, T = 4, B = 16, pw = W - Lm - Rm, ph = H - T - B, bw = pw / n;
    let max = 1; for (let y = y0; y <= y1; y++) max = Math.max(max, vd ? (vdYear[y] || [0, 0, 0]).reduce((a, b) => a + b, 0) : (ptYear[y] || [0])[0]);
    let h = "";
    [0, Math.round(max / 2), max].forEach(v => { h += '<line class="gl" x1="' + Lm + '" x2="' + (W - Rm) + '" y1="' + (T + ph - v / max * ph) + '" y2="' + (T + ph - v / max * ph) + '"/><text x="' + (Lm - 5) + '" y="' + (T + ph - v / max * ph + 3) + '" text-anchor="end">' + v + "</text>"; });
    for (let y = y0; y <= y1; y++) {
      const bx = Lm + (y - y0) * bw; let seg = "", tip = y + ": ";
      if (vd) { const a = vdYear[y] || [0, 0, 0]; let acc = 0; [0, 1, 2].forEach(t => { if (a[t]) { const hh = a[t] / max * ph; seg += '<rect x="' + (bx + .5).toFixed(1) + '" y="' + (T + ph - acc - hh).toFixed(1) + '" width="' + Math.max(1, bw - 1).toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + ENDC[t] + '"/>'; acc += hh; } }); tip += a[0] + " military, " + a[1] + " by others, " + a[2] + " self-coups"; }
      else { const a = ptYear[y] || [0, 0], hf = a[0] / max * ph, hs = a[1] / max * ph; seg = '<rect x="' + (bx + .5).toFixed(1) + '" y="' + (T + ph - hf).toFixed(1) + '" width="' + Math.max(1, bw - 1).toFixed(1) + '" height="' + hf.toFixed(1) + '" fill="#5a3f2a"/><rect x="' + (bx + .5).toFixed(1) + '" y="' + (T + ph - hs).toFixed(1) + '" width="' + Math.max(1, bw - 1).toFixed(1) + '" height="' + hs.toFixed(1) + '" fill="#e8c455"/>'; tip += a[0] + " attempts, " + a[1] + " successful"; }
      h += '<g class="yb' + (st.yr === y ? " sel" : "") + '" data-yr="' + y + '"><rect class="bg" x="' + bx.toFixed(1) + '" y="' + T + '" width="' + bw.toFixed(1) + '" height="' + ph + '" fill="transparent"/>' + seg + "<title>" + tip + "</title></g>";
      if (y % (vd ? 25 : 10) === 0) h += '<text x="' + (bx + bw / 2) + '" y="' + (H - 3) + '" text-anchor="middle">' + y + "</text>";
    }
    return '<svg class="chart" style="background:none;border:0" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Coups per year">' + h + "</svg>";
  }
  function drawRecord() {
    if (!built.rec) {
      built.rec = 1;
      const tip = K.tip($("rc-tip"), $("rc-wrap"));
      map = K.worldMap($("rc"), { map: REC.map || {}, tip, onPick: iso => pickCountry(iso === st.c ? null : iso),
        tipFor: (iso, name) => { if (!iso || !NAME[iso]) return "<b>" + esc(name) + "</b>"; const t = ptTot(iso); return "<b>" + esc(NAME[iso]) + "</b><small>" + t[0] + " attempts since 1950, " + t[1] + " successful</small><small>" + (vdByIso[iso] || 0) + " governments ended by coup since 1789</small>" + (st.yr && (PT[iso] || []).some(r => r[0] === st.yr) ? "<small>" + st.yr + ": " + PT[iso].filter(r => r[0] === st.yr).map(r => r[1] + " attempt(s), " + r[2] + " successful").join("") + "</small>" : ""); } });
      $("rc-m").innerHTML = Object.keys(MS).map(k => '<button class="chipbtn" data-m="' + k + '" title="' + esc(MS[k][1]) + '">' + MS[k][0] + "</button>").join("");
      $("rc-m").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st.m = b.dataset.m; st.yr = null; sync(); } });
      $("rc-years").addEventListener("click", e => { const g = e.target.closest("[data-yr]"); if (g) { const y = +g.dataset.yr; st.yr = st.yr === y ? null : y; st.c = null; st.i = null; sync(); } });
      $("rc-zi").onclick = () => map.zoomBy(1 / 1.6); $("rc-zo").onclick = () => map.zoomBy(1.6); $("rc-zr").onclick = () => map.reset();
    }
    $("rc-m").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.m === st.m));
    const isos = Object.keys(map.paths); let max = 1; isos.forEach(i => { max = Math.max(max, recVal(i)); });
    if (st.yr) {
      const hit = {}; if (st.m === "vd") ENDS.forEach(e => { if (e[1] === st.yr && COUPT(e)) hit[e[0]] = 2; }); else Object.keys(PT).forEach(i => PT[i].forEach(r => { if (r[0] === st.yr) hit[i] = r[2] ? 2 : 1; }));
      map.paint(iso => hit[iso] === 2 ? "#e8c455" : hit[iso] === 1 ? "#8a4a34" : NAME[iso] ? "#1b2233" : null);
      $("rc-leg").innerHTML = "<b>" + st.yr + '</b><span><i style="background:#e8c455"></i>' + (st.m === "vd" ? "government ended by coup" : "successful coup") + "</span>" + (st.m === "vd" ? "" : '<span><i style="background:#8a4a34"></i>failed attempt</span>') + "<small>Click the year again to return to the totals.</small>";
    } else {
      map.paint(iso => NAME[iso] ? (recVal(iso) ? HEAT(0.12 + 0.88 * Math.sqrt(recVal(iso) / max)) : "#1b2233") : null);
      $("rc-leg").innerHTML = "<b>" + MS[st.m][0] + '</b><div class="rl-grad" style="background:linear-gradient(90deg,' + [0.12, .4, .6, .8, 1].map(HEAT).join(",") + ')"></div><div class="rl-gradk"><span>1</span><span>' + max + "</span></div><small>" + MS[st.m][1] + ". Click a country for its record, or a year below.</small>";
    }
    map.select(st.c);
    const tot = Object.keys(PT).reduce((a, i) => { const t = ptTot(i); return [a[0] + t[0], a[1] + t[1]]; }, [0, 0]);
    $("rc-n").textContent = st.m === "vd" ? ENDS.filter(COUPT).length + " governments ended by coup in " + Object.keys(vdByIso).length + " states since 1789" : tot[0] + " attempts in " + Object.keys(PT).length + " countries since 1950; " + tot[1] + " succeeded (" + Math.round(tot[1] / tot[0] * 100) + "%)";
    chartIn("rc-years", yearBars);
  }

  /* ---------------- the two studies ---------------- */
  const SECS = [["cases", "The cases", "Every attempt, the road taken and the conditions present beforehand"], ["before", "What came before", "The recurring preconditions, counted"], ["against", "The other ledger", "Coups made to stop it, and what never happened"]];
  const caseOf = (S, c) => { const e = BY[c[0]]; return { e, route: c[1], f: c[2], n: c[3] || e.n, ok: c[4] == null ? e.ok : c[4] }; };
  function drawStudy(key) {
    const S = D[key], pane = $(key + "-pane"), PK = Object.keys(S.pre), cases = S.cases.map(c => caseOf(S, c)).sort((a, b) => a.e.y - b.e.y);
    if (!built[key]) {
      built[key] = 1;
      $("v-" + key).addEventListener("click", e => {
        const s = e.target.closest("[data-sec]"); if (s) { st[key] = s.dataset.sec; return sync(); }
        const d = e.target.closest("[data-i]"); if (d) pickEvent(d.dataset.i);
      });
    }
    $(key + "-secs").innerHTML = '<span class="sec-t" style="color:' + S.color + '">' + S.title + "</span>" + SECS.map(d => '<button class="chipbtn' + (d[0] === st[key] ? " on" : "") + '" data-sec="' + d[0] + '" title="' + esc(d[2]) + '">' + d[1] + "</button>").join("") + '<span class="sec-n">' + cases.length + " cases · " + cases.filter(c => c.ok === 1).length + " held power</span>";
    const held = cases.filter(c => c.ok === 1), lost = cases.filter(c => c.ok !== 1), share = (list, f) => list.filter(c => c.f.indexOf(f) >= 0).length;
    let h = "";
    if (st[key] === "cases") {
      const tbl = list => '<table class="mx cases"><thead><tr><th>Year</th><th class="nm">Case</th><th title="The road taken"> </th>' + PK.map(f => '<th class="f" title="' + esc(S.pre[f][0] + " — " + S.pre[f][1]) + '">' + S.pre[f][2] + "</th>").join("") + "<th></th></tr></thead><tbody>"
        + list.map(c => '<tr class="go" data-i="' + c.e.id + '" title="' + esc(c.n + " — " + c.e.pl) + '"><td class="y">' + yr(c.e.y) + '</td><td class="nm"' + (c.e.id === st.i ? ' style="color:var(--gold-bright)"' : "") + ">" + esc(c.n) + '</td><td><span class="rt" title="' + esc(S.routes[c.route]) + '">' + c.route + "</span></td>" + PK.map(f => '<td class="f" style="color:' + (c.f.indexOf(f) >= 0 ? S.color : "#232a3c") + '"><span class="dot"></span></td>').join("") + "<td>" + okDot(c.e, c.ok) + "</td></tr>").join("") + "</tbody></table>";
      const half = Math.ceil(cases.length / 2);
      h = '<p class="lead">' + esc(S.lead) + "</p>"
        + '<div class="grid2 even" style="flex:1"><div class="col scroll">' + tbl(cases.slice(0, half)) + '</div><div class="col scroll">' + tbl(cases.slice(half)) + "</div></div>"
        + '<p class="wr-note" style="max-width:none">Conditions: ' + PK.map(f => "<b style=\"color:" + S.color + "\">" + S.pre[f][2] + "</b> " + S.pre[f][1].charAt(0).toLowerCase() + S.pre[f][1].slice(1)).join(" · ") + '.</p><p class="wr-note" style="max-width:none">Road: ' + Object.keys(S.routes).map(r => '<span class="rt">' + r + "</span> " + S.routes[r].toLowerCase()).join(" · ") + ' &nbsp;·&nbsp; Outcome: <span class="okd o1" style="color:' + S.color + '"></span> held · <span class="okd o2" style="color:' + S.color + '"></span> brief · <span class="okd o0" style="color:' + S.color + '"></span> failed &nbsp;·&nbsp; Click a row to read the case. The conditions are the archive\'s reading of the standard histories.</p>';
    } else if (st[key] === "before") {
      const tr = S.trends, bar = (n, d, c) => '<div class="tr"><i style="width:' + (d ? n / d * 100 : 0).toFixed(0) + "%;background:" + c + '"></i></div>';
      h = '<p class="lead">How often each condition was present — in all ' + cases.length + " cases, in the " + held.length + " that held power, and in the " + lost.length + " that failed or lasted only briefly. Read the differences between the last two with care: the numbers are small.</p>"
        + '<div class="cond">' + PK.map(f => "<div><b title=\"" + esc(S.pre[f][1]) + '">' + S.pre[f][0] + '</b><div class="bar3"><span>all</span>' + bar(share(cases, f), cases.length, "#8d96af") + "<span>" + share(cases, f) + "</span><span>held</span>" + bar(share(held, f), held.length, S.color) + "<span>" + share(held, f) + "</span><span>not</span>" + bar(share(lost, f), lost.length, "#55607a") + "<span>" + share(lost, f) + "</span></div></div>").join("") + "</div>"
        + '<div class="trend" style="flex:1;align-content:start">' + tr.map(t => '<div style="--tc:' + S.color + '"><b><small>' + (S.pre[t[0]] ? share(cases, t[0]) + " of " + cases.length : "") + "</small>" + esc(t[1]) + "</b><p>" + esc(t[2]) + "</p></div>").join("") + "</div>";
    } else {
      h = '<div class="callout" style="border-left-color:' + S.color + '">' + esc(S.never) + "</div>"
        + "<h4>" + esc(S.against.title) + "<small>" + esc(S.against.note) + '</small></h4><div class="ag">' + S.against.ids.map(id => { const e = BY[id]; return '<button data-i="' + id + '"><b><small>' + yr(e.y) + "</small>" + esc(e.n) + "</b>" + esc(e.pl) + " — " + esc(e.x.split(/(?<=[.;])\s/)[0]) + "</button>"; }).join("") + "</div>"
        + '<h4>In the full record<small>V-Dem: regimes whose claim to rule turned ' + (key === "red" ? "socialist or communist" : "religious") + " after a forced ending, 1900–2021</small></h4>" + turned(key === "red" ? "S" : "R", S.color)
        + '<p class="wr-note" style="max-width:none">' + esc(S.reading) + ' <a href="doctrines.html#v=compass&i=' + S.doctrine + '">The doctrine itself, in the Doctrines ⟶</a></p>';
    }
    pane.innerHTML = h; pane.scrollTop = 0;
  }
  /* the systematic cross-check: forced endings after which V-Dem's experts say the government's
     claim to rule took on a character (S socialist, R religious) it did not have before */
  function turned(ch, color) {
    const xs = ENDS.filter(e => e[9] && e[9][0] >= 2 && e[9][1].indexOf(ch) >= 0 && !(e[8] && e[8][0] >= 2 && e[8][1].indexOf(ch) >= 0));
    return '<div class="chips" style="gap:4px">' + xs.map(e => '<span class="tag" style="margin:0;border-color:' + color + '88" title="' + esc(e[6] + " → " + (e[7] || "?") + " · " + ENDT[e[4]]) + '">' + esc(NAME[e[0]] || e[0]) + " " + e[1] + "</span>").join("") + '</div><p class="wr-note" style="max-width:none">' + xs.length + " of " + ENDS.filter(e => e[9]).length + " forced endings with a coding on both sides. Hover for the regime that fell and what replaced it. This list is V-Dem's, not the archive's, and is built differently from the roll: it catches changes of claim after any forced ending, including those imposed by foreign armies.</p>";
  }

  /* ---------------- patterns: nine small charts on one screen ---------------- */
  function vbars(items, o) {                                 /* items: [{l, v, c, t, s?}] — s = solid lower part */
    return (W, H) => {
      const Lm = 6, Rm = 6, T = 14, B = o && o.b || 18, pw = W - Lm - Rm, ph = H - T - B, bw = pw / items.length, max = Math.max.apply(null, items.map(i => i.v)) || 1;
      let h = '<line class="gl" x1="' + Lm + '" x2="' + (W - Rm) + '" y1="' + (T + ph) + '" y2="' + (T + ph) + '"/>';
      items.forEach((it, i) => {
        const hh = it.v / max * ph, x = Lm + i * bw + bw * 0.14, w = bw * 0.72;
        h += '<rect x="' + x.toFixed(1) + '" y="' + (T + ph - hh).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(1, hh).toFixed(1) + '" rx="1.5" fill="' + (it.c || "#c9a227") + '"' + (it.s != null ? ' fill-opacity=".35"' : "") + "><title>" + esc(it.tt || it.l + ": " + (it.t || it.v)) + "</title></rect>";
        if (it.s != null) h += '<rect x="' + x.toFixed(1) + '" y="' + (T + ph - it.s / max * ph).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (it.s / max * ph).toFixed(1) + '" rx="1.5" fill="' + (it.c || "#c9a227") + '"/>';
        h += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (T + ph - hh - 3).toFixed(1) + '" text-anchor="middle" style="fill:#d6d1c2">' + (it.t != null ? it.t : it.v) + '</text><text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle">' + esc(it.l) + "</text>";
      });
      return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '">' + h + "</svg>";
    };
  }
  function drawPatterns() {
    const pane = $("pt-pane"), all = []; Object.keys(PT).forEach(i => PT[i].forEach(r => all.push([i, r[0], r[1], r[2], r[3]])));
    /* by decade */
    const dec = {}; all.forEach(r => { const d = Math.floor(r[1] / 10) * 10, a = dec[d] = dec[d] || [0, 0]; a[0] += r[2]; a[1] += r[3]; });
    const decs = Object.keys(dec).sort(), pre = [0, 0], post = [0, 0]; all.forEach(r => { const a = r[1] < 1990 ? pre : post; a[0] += r[2]; a[1] += r[3]; });
    /* by region */
    const rg = REC.regions.map(() => [0, 0]); all.forEach(r => { const k = REC.rg[r[0]]; if (k != null) { rg[k][0] += r[2]; rg[k][1] += r[3]; } });
    const RS = ["E. Eur.", "Lat. Am.", "MENA", "Africa", "W. Eur.", "Asia"];
    /* the coup trap: years since the previous attempt in the same country */
    const gap = [0, 0, 0, 0, 0, 0], GL = ["first", "≤2 yrs", "3–5", "6–10", "11–20", "20+"];
    Object.keys(PT).forEach(i => { let prev = null; PT[i].forEach(r => { const g = prev == null ? null : r[0] - prev; gap[g == null ? 0 : g <= 2 ? 1 : g <= 5 ? 2 : g <= 10 ? 3 : g <= 20 ? 4 : 5]++; prev = r[0]; }); });
    const again = gap[1] + gap[2] + gap[3], cyrs = gap.reduce((a, b) => a + b, 0);
    /* regime class and income the year before */
    const RW = ["Closed autocracy", "Electoral autocracy", "Electoral democracy", "Liberal democracy"], RC = ["#8a2f2a", "#c77c3a", "#5b93b8", "#49c9b8"];
    const br = REC.stats.byRegime, q = REC.stats.income.quartiles;
    /* V-Dem endings by type, by quarter-century */
    const per = []; for (let y = 1800; y <= 2000; y += 25) per.push(y);
    const tgrp = [[0, 1, 2], [8], [5], [6, 7], [3]], tnm = ["Coup", "Uprising", "Civil war", "Foreign force", "Assassination"], tcl = ["#c9a227", "#49c9b8", "#d2452f", "#5b93b8", "#8d96af"];
    const stack = per.map(p => tgrp.map(g => ENDS.filter(e => e[1] >= p && e[1] < p + 25 + (p === 2000 ? 1 : 0) && g.indexOf(e[4]) >= 0).length));
    /* what followed a military coup: did the liberal democracy index rise by 0.05 within two years? */
    const fol = [[0, 0], [0, 0]]; ENDS.forEach(e => { if (e[4] === 0 && e[10] != null && e[11] != null) { const a = fol[e[1] < 1990 ? 0 : 1]; a[0]++; if (e[11] - e[10] >= 0.05) a[1]++; } });
    /* claims after forced endings, by decade */
    const cl = {}; ENDS.forEach(e => { if (!e[9] || e[9][0] < 2) return; const d = Math.floor(e[1] / 10) * 10, had = k => e[8] && e[8][0] >= 2 && e[8][1].indexOf(k) >= 0; cl[d] = cl[d] || [0, 0]; if (e[9][1].indexOf("S") >= 0 && !had("S")) cl[d][0]++; if (e[9][1].indexOf("R") >= 0 && !had("R")) cl[d][1]++; });
    const cds = Object.keys(cl).sort(), F = D.findings, pct = (a, b) => b ? (a / b * 100).toFixed(1) + "%" : "—";
    const card = (id, t, sub, p) => "<div><h4>" + t + (sub ? "<small>" + sub + "</small>" : "") + '</h4><div class="chart-host" id="' + id + '"></div><p>' + p + "</p></div>";
    pane.innerHTML = '<div class="dash">'
      + card("p1", "Attempts by decade", "solid = succeeded", "<b>" + F[3][0] + ".</b> " + (pre[0] / 40).toFixed(1) + " attempts a year before 1990, " + (post[0] / (LASTPT - 1989)).toFixed(1) + " since. Success: " + pct(pre[1], pre[0]) + " then, " + pct(post[1], post[0]) + " now.")
      + card("p2", "By region", "1950–" + LASTPT, "Two regions account for " + Math.round((rg[3][0] + rg[1][0]) / all.reduce((a, r) => a + r[2], 0) * 100) + "% of all attempts. <b>" + F[4][0] + ":</b> " + esc(F[4][1]))
      + card("p3", "The coup trap", "years since the country's previous attempt", "<b>" + Math.round(again / cyrs * 100) + "%</b> of coup-years came within ten years of an earlier attempt in the same country. " + esc(F[1][1]))
      + card("p4", "Regime the year before", "share of country-years with an attempt", "<b>" + F[2][0] + ".</b> " + esc(F[2][1]))
      + card("p5", "Income the year before", "poorest to richest quarter of country-years, to " + REC.stats.income.to, "<b>" + F[0][0] + ".</b> " + esc(F[0][1]))
      + card("p6", "What follows a military coup", "liberal-democracy index up 0.05+ two years on", "Of " + fol[0][0] + " military coups before 1990, " + fol[0][1] + " were followed by an opening; of " + fol[1][0] + " since, " + fol[1][1] + ". More often than in the Cold War, when a superpower would underwrite a junta — but still a minority.")
      + card("p7", "How governments have ended by force", "V-Dem, by quarter-century", tnm.map((n, i) => '<span style="white-space:nowrap"><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:' + tcl[i] + ';margin-right:4px"></i>' + n + "</span>").join(" &nbsp;") + ". The coup is a twentieth-century instrument; conquest was the nineteenth's.")
      + card("p8", "New claims after a forced ending", "V-Dem, by decade: red socialist · green religious", "The socialist claim peaks with decolonisation and the 1970s and stops in the 1980s; the religious one begins in the 1970s. Neither is the commonest outcome: most forced endings bring a nationalist claim or none.")
      + "<div><h4>How to read this<small>and what it cannot tell you</small></h4><p style=\"font-size:12.5px;line-height:1.55;margin-top:6px\">These are base rates, not causes. Poverty, hybrid rule and past coups travel together, and a count of where coups happened cannot say which of them did the work. The registers also disagree at the edges — what one calls a coup another calls a resignation or an uprising — which is why disputed cases are marked in the roll.</p><p class=\"srcs\" style=\"margin-top:8px\">" + D.sources.map(s => K.link(s[1], s[0])).join("") + "</p></div></div>";
    chartIn("p1", vbars(decs.map(d => ({ l: d + "s", v: dec[d][0], s: dec[d][1], t: dec[d][0], tt: d + "s: " + dec[d][0] + " attempts, " + dec[d][1] + " successful" }))));
    chartIn("p2", vbars(rg.map((r, i) => ({ l: RS[i], v: r[0], s: r[1], t: r[0], tt: REC.regions[i] + ": " + r[0] + " attempts, " + r[1] + " successful" })).sort((a, b) => b.v - a.v)));
    chartIn("p3", vbars(gap.map((g, i) => ({ l: GL[i], v: g, c: i >= 1 && i <= 3 ? "#e0672f" : "#6b5326" }))));
    chartIn("p4", vbars(br.map(r => ({ l: ["Closed aut.", "Elect. aut.", "Elect. dem.", "Liberal dem."][r[0]], v: r[1] ? r[2] / r[1] * 100 : 0, t: (r[1] ? r[2] / r[1] * 100 : 0).toFixed(1) + "%", c: RC[r[0]], tt: RW[r[0]] + ": " + r[2] + " coup-years in " + r[1] + " country-years" }))));
    chartIn("p5", vbars(q.map((r, i) => ({ l: ["poorest", "2nd", "3rd", "richest"][i], v: r[2] ? r[3] / r[2] * 100 : 0, t: (r[2] ? r[3] / r[2] * 100 : 0).toFixed(1) + "%", c: ["#b06a2a", "#c9953a", "#8fb37a", "#49c9b8"][i], tt: r[3] + " coup-years in " + r[2] + " country-years" }))));
    chartIn("p6", vbars([{ l: "before 1990", v: fol[0][0] ? fol[0][1] / fol[0][0] * 100 : 0, t: pct(fol[0][1], fol[0][0]), c: "#8d96af" }, { l: "1990 and after", v: fol[1][0] ? fol[1][1] / fol[1][0] * 100 : 0, t: pct(fol[1][1], fol[1][0]), c: "#49c9b8" }]));
    chartIn("p7", (W, H) => { const Lm = 6, T = 8, B = 18, pw = W - 12, ph = H - T - B, bw = pw / per.length, max = Math.max.apply(null, stack.map(s => s.reduce((a, b) => a + b, 0))); let h = ""; per.forEach((p, i) => { let acc = 0; stack[i].forEach((v, k) => { const hh = v / max * ph; h += '<rect x="' + (Lm + i * bw + bw * .12).toFixed(1) + '" y="' + (T + ph - acc - hh).toFixed(1) + '" width="' + (bw * .76).toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + tcl[k] + '"><title>' + p + "–" + (p + 24) + ": " + v + " by " + tnm[k].toLowerCase() + "</title></rect>"; acc += hh; }); h += '<text x="' + (Lm + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle">' + p + "</text>"; }); return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '">' + h + "</svg>"; });
    chartIn("p8", (W, H) => { const Lm = 6, T = 12, B = 18, pw = W - 12, ph = H - T - B, bw = pw / cds.length, max = Math.max.apply(null, cds.map(d => Math.max(cl[d][0], cl[d][1]))) || 1; let h = '<line class="gl" x1="' + Lm + '" x2="' + (W - 6) + '" y1="' + (T + ph) + '" y2="' + (T + ph) + '"/>'; cds.forEach((d, i) => { [0, 1].forEach(k => { const v = cl[d][k], hh = v / max * ph, x = Lm + i * bw + bw * (k ? .52 : .14); h += '<rect x="' + x.toFixed(1) + '" y="' + (T + ph - hh).toFixed(1) + '" width="' + (bw * .34).toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="1" fill="' + (k ? "#4caf7d" : "#e5484d") + '"><title>' + d + "s: " + v + (k ? " religious" : " socialist") + "</title></rect>" + (v ? '<text x="' + (x + bw * .17).toFixed(1) + '" y="' + (T + ph - hh - 2).toFixed(1) + '" text-anchor="middle" style="fill:#d6d1c2">' + v + "</text>" : ""); }); h += '<text x="' + (Lm + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle">' + (W < 420 ? "'" + d.slice(2) : d) + "</text>"; }); return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '">' + h + "</svg>"; });
  }

  /* ---------------- the side panel ---------------- */
  function eventCard(e) {
    const idx = L.slice().sort((a, b) => a.y - b.y || a.ix - b.ix), pos = idx.indexOf(e), prev = idx[pos - 1], next = idx[pos + 1];
    const vd = ENDS.filter(x => x[0] === e.iso && Math.abs(x[1] - e.y) <= 1)[0];
    let h = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button><div class="sd-k">' + D.kind[e.k] + (e.q ? " · disputed" : "") + '</div><div class="sd-t">' + esc(e.n) + '</div><div class="sd-d">' + yr(e.y) + " · " + esc(e.pl) + "</div>"
      + '<div><span class="tag" style="border-color:' + D.ideo[e.i][1] + ";color:" + D.ideo[e.i][1] + '">' + D.ideo[e.i][0] + '</span><span class="tag G">' + D.goal[e.g] + '</span><span class="tag ' + OKT[e.ok][1] + '">' + OKT[e.ok][0] + "</span></div>"
      + '<p class="sd-p" style="margin-top:8px">' + esc(e.x) + "</p>"
      + (e.q ? '<p class="hint">Whether this was a coup is itself disputed; the entry gives each account.</p>' : "");
    ["red", "green"].forEach(k => { const c = D[k].cases.filter(x => x[0] === e.id)[0]; if (!c) return; const S = D[k];
      h += '<div class="sd-k">Before it · ' + S.title.toLowerCase().replace("the ", "") + '</div><p class="sd-p" style="font-size:12.5px">Road: <b style="color:var(--paper)">' + S.routes[c[1]] + "</b>.</p>" + Object.keys(S.pre).map(f => '<div class="sg-row' + (c[2].indexOf(f) >= 0 ? " on" : "") + '"><i' + (c[2].indexOf(f) >= 0 ? ' style="background:' + S.color + '"' : "") + "></i>" + S.pre[f][1] + "</div>").join("") + '<div class="sd-links"><a href="#v=' + k + '" data-go="' + k + '">The whole study ⟶</a></div>'; });
    if (vd) h += '<div class="sd-k">On V-Dem\'s record</div><p class="sd-p" style="font-size:12.5px">' + esc(vd[6]) + " ended " + vd[3] + " " + K.MON[vd[2] - 1] + " " + vd[1] + " — " + ENDT[vd[4]].toLowerCase() + (vd[7] ? "; followed by " + esc(vd[7]) : "") + "." + (vd[10] != null && vd[11] != null ? " Liberal democracy index " + K.fmt(vd[10]) + " before, " + K.fmt(vd[11]) + " two years on." : "") + "</p>";
    h += '<div class="sd-links">' + K.link(wiki(e.w), "Source: Wikipedia") + (NAME[e.iso] ? '<a href="#v=record&c=' + e.iso + '" data-c="' + e.iso + '">' + esc(NAME[e.iso]) + "'s record ⟶</a>" + '<a href="realms.html#v=map&c=' + e.iso + '">' + esc(NAME[e.iso]) + " today ⟶</a>" : "") + (DOC[e.i] ? '<a href="doctrines.html#v=compass&i=' + DOC[e.i] + '">The doctrine ⟶</a>' : "") + "</div>"
      + '<div class="sd-links">' + (prev ? '<button class="lnk" data-i="' + prev.id + '">◂ ' + yr(prev.y) + " " + esc(prev.n) + "</button>" : "") + (next ? '<button class="lnk" data-i="' + next.id + '">' + yr(next.y) + " " + esc(next.n) + " ▸</button>" : "") + "</div>";
    return h;
  }
  function countryCard(iso) {
    const t = ptTot(iso), pts = PT[iso] || [], ends = ENDS.filter(e => e[0] === iso), mine = L.filter(e => e.iso === iso);
    let h = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button><div class="sd-k">' + esc(REC.regions[REC.rg[iso]] || "Record") + '</div><div class="sd-t">' + esc(NAME[iso]) + '</div><div class="sd-d">' + t[0] + " attempts since 1950 · " + t[1] + " successful · " + ends.length + " forced endings since 1789</div>";
    if (mine.length) h += '<div class="sd-k">In the roll</div>' + mine.map(e => '<button class="rel s" data-i="' + e.id + '" style="border-left-color:' + D.ideo[e.i][1] + '"><span class="y">' + yr(e.y) + "</span>" + esc(e.n) + "<i>" + D.ideo[e.i][0] + " · " + OKT[e.ok][2].toLowerCase() + "</i></button>").join("");
    if (pts.length) h += '<div class="sd-k">Coup attempts since 1950 · Powell &amp; Thyne</div><div>' + pts.map(r => '<span class="tag ' + (r[2] ? "G" : "") + '" title="' + r[1] + " attempt(s), " + r[2] + ' successful">' + r[0] + (r[1] > 1 ? " ×" + r[1] : "") + (r[2] ? " ●" : "") + "</span>").join("") + '</div><p class="hint">● = at least one succeeded that year.</p>';
    if (ends.length) h += '<div class="sd-k">Governments ended by force · V-Dem</div>' + ends.slice().reverse().map(e => '<div class="st-row" style="align-items:flex-start"><span class="fdot" style="background:' + ENDC[e[4]] + ';margin-top:5px"></span><span>' + esc(e[6]) + (e[7] ? " → " + esc(e[7]) : "") + "</span><small>" + e[1] + " · " + ENDT[e[4]].toLowerCase() + "</small></div>").join("");
    if (!pts.length && !ends.length) h += '<p class="sd-p">Neither register records a coup attempt or a forced ending here.</p>';
    return h + '<div class="sd-links"><a href="realms.html#v=map&c=' + iso + '">' + esc(NAME[iso]) + " today, in the Realms ⟶</a></div>";
  }
  function yearCard(y) {
    let h = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button><div class="sd-k">The year</div><div class="sd-t">' + y + "</div>";
    const pts = []; Object.keys(PT).forEach(i => PT[i].forEach(r => { if (r[0] === y) pts.push([i, r[1], r[2]]); }));
    const ends = ENDS.filter(e => e[1] === y), mine = L.filter(e => e.y === y);
    h += '<div class="sd-d">' + (y >= 1950 && y <= LASTPT ? pts.reduce((a, r) => a + r[1], 0) + " coup attempts · " + pts.reduce((a, r) => a + r[2], 0) + " successful · " : "") + ends.length + " forced endings</div>";
    if (mine.length) h += '<div class="sd-k">In the roll</div>' + mine.map(e => '<button class="rel s" data-i="' + e.id + '" style="border-left-color:' + D.ideo[e.i][1] + '">' + esc(e.n) + "<i>" + esc(e.pl) + " · " + D.ideo[e.i][0] + "</i></button>").join("");
    if (pts.length) h += '<div class="sd-k">Coup attempts · Powell &amp; Thyne</div>' + pts.sort((a, b) => b[2] - a[2]).map(r => '<button class="rel ' + (r[2] ? "s" : "") + '" data-c="' + r[0] + '">' + esc(NAME[r[0]] || r[0]) + "<i>" + r[1] + " attempt" + (r[1] > 1 ? "s" : "") + (r[2] ? ", succeeded" : ", failed") + "</i></button>").join("");
    if (ends.length) h += '<div class="sd-k">Governments ended by force · V-Dem</div>' + ends.map(e => '<div class="st-row" style="align-items:flex-start"><span class="fdot" style="background:' + ENDC[e[4]] + ';margin-top:5px"></span><span><b style="color:var(--paper);font-weight:500">' + esc(NAME[e[0]] || e[0]) + ".</b> " + esc(e[6]) + (e[7] ? " → " + esc(e[7]) : "") + "</span><small>" + ENDT[e[4]].toLowerCase() + "</small></div>").join("");
    return h;
  }
  function intro() {
    const top = Object.keys(PT).map(i => [i, ptTot(i)]).sort((a, b) => b[1][0] - a[1][0]).slice(0, 8);
    const T = { roll: ["THE ROLL", "The " + L.length + " seizures worth knowing by name, from the oligarchs of Athens to last year. Each dot is one; its row is the creed of those who took power, and whether it is solid, half or hollow says whether they held it. The table below crosses creed with declared aim."],
                record: ["THE RECORD", "The roll is a selection; this is the count. Two academic registers: every coup attempt since 1950, and every regime that ended by force since 1789. Click a country for its record, or a bar for a year."],
                red: ["THE RED SEIZURES", "Marxism as a way of taking power: " + D.red.cases.length + " attempts across a century and a half, and the conditions that preceded them."],
                green: ["THE GREEN SEIZURES", "Political Islam as a way of taking power: " + D.green.cases.length + " attempts, Sunni and Shia, and the conditions that preceded them."],
                patterns: ["PATTERNS", "What the whole record says about when coups happen — and a caution about what such counts can prove."] }[st.v];
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + "</p>"
      + '<div class="q" style="border-color:#e8c455"><b style="color:#e8c455">Creed</b><span>The banner of those who seized power — not of those they removed. Most seizures mix motives; the class is the declared one.</span></div>'
      + '<div class="q" style="border-color:#5b93b8"><b style="color:#5b93b8">Declared aim</b><span>What they said it was for. Almost every coup announces that it is restoring order; the class looks past that where a more specific aim was stated.</span></div>'
      + '<div class="q" style="border-color:#e5484d"><b style="color:#e5484d">A caution on the two studies</b><span>The roll lists every Marxist and Islamist attempt because the studies need them, so those two creeds are over-represented in it. In the systematic record the commonest coup by far has no doctrine at all: officers, order, and the army\'s own interests.</span></div>'
      + (st.v === "record" ? '<div class="sd-k">Most attempts since 1950</div>' + top.map(r => '<button class="rel" data-c="' + r[0] + '">' + esc(NAME[r[0]]) + "<i>" + r[1][0] + " attempts, " + r[1][1] + " successful</i></button>").join("")
        : '<div class="sd-k">Start with</div>' + ["brumaire", "october", "prague", "ajax", "chile73", "iran79", "bashir", "algeria92", "kabul21"].map(i => '<button class="nchip" data-i="' + i + '"><span class="fdot" style="background:' + D.ideo[BY[i].i][1] + '"></span>' + yr(BY[i].y) + " " + esc(BY[i].n) + "</button>").join(""));
  }
  function renderSide() {
    const side = $("dc-side"), e = st.i && BY[st.i];
    const html = e ? eventCard(e) : st.v === "record" && st.c ? countryCard(st.c) : st.v === "record" && st.yr ? yearCard(st.yr) : null;
    if (!html && innerWidth <= 860) { side.hidden = true; return; }
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (html ? "" : " intro") + '">' + (html || intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read();
    if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v;
    if (q.s && (st.v === "red" || st.v === "green") && SECS.some(x => x[0] === q.s)) st[st.v] = q.s;
    st.i = q.i && BY[q.i] ? q.i : null; st.c = q.c && NAME[q.c] ? q.c : null; st.yr = q.y ? +q.y : null;
    built.boot = 1; sync(true);
    if (st.c && st.v === "record") setTimeout(() => map.focus(st.c), 60);
  }
  function boot() {
    /* the map joins shapes to states through the Realms' name table when it is loaded; otherwise by the record's own names */
    if (!REC.map) { REC.map = {}; const inv = {}; Object.keys(NAME).forEach(i => { inv[NAME[i]] = i; }); const FIX = { "United States of America": "USA", "Dem. Rep. Congo": "COD", "Congo": "COG", "Central African Rep.": "CAF", "S. Sudan": "SSD", "Somaliland": "SML", "Côte d'Ivoire": "CIV", "Eq. Guinea": "GNQ", "eSwatini": "SWZ", "Bosnia and Herz.": "BIH", "Macedonia": "MKD", "Dominican Rep.": "DOM", "Solomon Is.": "SLB", "Palestine": "PSE", "Czechia": "CZE", "Bahamas": "BHS", "Trinidad and Tobago": "TTO" };
      (window.ARCHIVUS_COUNTRIES || []).forEach(c => { const i = FIX[c.n] || inv[c.n]; if (i && NAME[i]) REC.map[c.n] = i; }); }
    tabs = K.tabs(() => st.v, go);
    $("dc-side").addEventListener("click", e => {
      if (e.target.closest(".sd-x")) { if (st.i) st.i = null; else if (st.c) st.c = null; else st.yr = null; return sync(); }
      const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); return go(g.dataset.go); }
      const c = e.target.closest("[data-c]"); if (c) { e.preventDefault(); st.v = "record"; pickCountry(c.dataset.c); return setTimeout(() => map && map.focus(st.c), 80); }
      const b = e.target.closest("[data-i]"); if (b) pickEvent(b.dataset.i);
    });
    document.addEventListener("keydown", e => {
      if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape" && (st.i || st.c || st.yr)) { if (st.i) st.i = null; else if (st.c) st.c = null; else st.yr = null; return sync(); }
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      if (st.i) { const idx = L.filter(x => x.id === st.i || st.v !== "roll" || passes(x)).sort((a, b) => a.y - b.y || a.ix - b.ix), n = idx[idx.indexOf(BY[st.i]) + d]; if (n) pickEvent(n.id); }   /* ← → walk the roll in order */
      else if (st.v === "red" || st.v === "green") { const i = SECS.findIndex(x => x[0] === st[st.v]) + d; if (SECS[i]) { st[st.v] = SECS[i][0]; sync(); } }
    });
    const names = Object.keys(NAME).map(i => ({ label: NAME[i], sub: ptTot(i)[0] + " attempts since 1950", c: i }));
    K.finder($("dc-q"), q => L.filter(e => (e.n + " " + e.pl + " " + e.y).toLowerCase().indexOf(q) >= 0).map(e => ({ label: e.n, sub: yr(e.y) + " · " + e.pl, i: e.id })).concat(names.filter(n => n.label.toLowerCase().indexOf(q) >= 0)),
      h => { if (h.i) { if (st.v === "record" || st.v === "patterns") st.v = "roll"; pickEvent(h.i); } else { st.v = "record"; pickCountry(h.c); setTimeout(() => map && map.focus(st.c), 80); } });
    let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); render(st.v); }, 140); });
    window.addEventListener("hashchange", applyHash);
    applyHash();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
