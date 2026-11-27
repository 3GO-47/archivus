/* ============================================================
   ARCHIVUS — TOTAL WAR (v19)
   Every war the Archive knows, on one string: thirty-three centuries from Kadesh to the wars
   being fought today, and the one that is only projected.
     · the String     — a bar a war, laid on its years and its part of the world, sized by its dead,
                        with one thread run through them all in the order they began
     · the Toll       — the wars ranked by their dead, each with the range the estimates span
     · the Centuries  — the same dead, century by century
     · Method & sources
   Data: src/data/totalwar.js (the sized wars), the Chronicle's own events (the rest),
   src/data/conflicts.js (the wars under way). Nothing is copied: a war that exists elsewhere
   in the Archive is read from there and links back to it.
   Deep links:  totalwar.html#v=string&i=thirtyyears&z=2     #v=toll     #v=centuries
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT, $ = K.$, esc = K.esc;
  const TW = window.ARCHIVUS_TOTALWAR, CF = window.ARCHIVUS_CONFLICTS, LV = CF.levels;
  const EV = {}; (window.ARCHIVUS_EVENTS || []).forEach(e => { EV[e.id] = e; });
  const NOW = +TW.meta.asOf.slice(0, 4) + 0.9, T0 = TW.meta.t0, T1 = TW.meta.t1;
  const LANE_OF = { "Europe": "eu", "West Asia / Middle East": "wa", "Central Asia": "ca", "South Asia": "ca", "East Asia": "ea", "Southeast Asia": "se", "Oceania": "se", "Africa": "af", "North America": "am", "Latin America": "am", "Global": "gl" };
  const CF_LANE = { Europe: "eu", "Middle East": "wa", Africa: "af", Americas: "am" }, CF_ASIA = { myanmar: "se", philippines: "se", papua: "se", thaicam: "se", taiwan: "ea", korea: "ea", scs: "se" };
  const yr = y => y < 0 ? -y + " BCE" : String(y), span = r => r.kind === "battle" || r.a === r.e ? yr(r.a) : yr(r.a) + " – " + (r.open ? "now" : yr(r.e));
  const mil = v => v >= 10 ? Math.round(v) : v >= 1 ? +v.toFixed(1) : +v.toFixed(2), tollT = r => r.lo == null ? "" : (r.lo === r.hi ? "about " + mil(r.lo) : mil(r.lo) + " – " + mil(r.hi)) + " million";
  const ord = n => n + (n % 100 > 10 && n % 100 < 14 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const tone = r => r.kind === "proj" ? "#e8c455" : r.gm == null ? (r.lv ? LV[r.lv - 1].c : "#8d96af") : r.gm >= 10 ? "#ff2e55" : r.gm >= 1 ? "#e0502f" : "#ee8f3a";

  /* ---- one list of rows, from three places ---- */
  const R = [], BY = {}, taken = {};
  TW.toll.forEach(t => { const r = { id: t[0], n: t[1], a: t[2], e: t[3] == null ? NOW : t[3], open: t[3] == null, lane: t[4], lo: t[5], hi: t[6], gm: Math.sqrt(t[5] * t[6]), ev: t[7] || null, cf: t[8] || null, kind: "toll" }; R.push(r); if (r.cf) taken[r.cf] = 1; });
  TW.more.forEach(id => { const e = EV[id]; if (e) R.push({ id, n: e.title, a: e.startYear, e: e.endYear == null ? e.startYear : e.endYear, lane: LANE_OF[e.region] || "gl", ev: id, kind: "more", approx: e.approximate }); });
  TW.battles.forEach(id => { const e = EV[id]; if (e) R.push({ id, n: e.title, a: e.startYear, e: e.startYear, lane: LANE_OF[e.region] || "gl", ev: id, kind: "battle" }); });
  CF.list.filter(c => c.lv >= 4 && !taken[c.id]).forEach(c => R.push({ id: "now-" + c.id, n: c.n.split(":")[0], a: c.since, e: NOW, open: true, lane: CF_ASIA[c.id] || CF_LANE[c.rg] || "ca", cf: c.id, lv: c.lv, kind: "now" }));
  R.forEach(r => { if (r.cf && !r.lv) { const c = CF.list.filter(x => x.id === r.cf)[0]; if (c && r.open) r.lv = c.lv; } });
  R.push({ id: "ww3", n: "World War III", a: NOW, e: T1, open: true, lane: "gl", kind: "proj" });
  R.sort((a, b) => a.a - b.a || a.e - b.e); R.forEach((r, i) => { r.ix = i; BY[r.id] = r; });
  const WARS = R.filter(r => r.kind !== "battle" && r.kind !== "proj"), SIZED = R.filter(r => r.kind === "toll").sort((a, b) => b.gm - a.gm);

  /* the most wars under way in any one year, counted by the year (the strip below the string is drawn by the pixel, so its own maximum moves with the width) */
  const PEAK = { n: 0, y: T0 }; for (let y = T0; y <= Math.floor(NOW); y++) { let n = 0; WARS.forEach(r => { if (r.a <= y && r.e >= y) n++; }); if (n >= PEAK.n) { PEAK.n = n; PEAK.y = y; } }
  const st = { v: "string", i: null, z: 1, f: null }, built = {};
  let tabs = null;
  function sync(skip) { if (!skip) K.hash.write({ v: st.v, i: st.i, z: st.z > 1 ? st.z : null, f: st.v === "toll" ? st.f : null }); tabs.paint(); renderSide(); render(); }
  function go(v) { if (tabs.ids.indexOf(v) >= 0) { st.v = v; sync(); } }
  function pick(id) { st.i = st.i === id ? null : id; sync(); }
  function render() { if (st.v === "string") drawString(); else if (st.v === "toll") drawToll(); else if (st.v === "centuries") drawCent(); else drawMethod(); }

  /* ---- the time axis: piecewise, so the crowded centuries get the room ---- */
  const WP = TW.warp;
  const fx = y => { y = Math.max(T0, Math.min(T1, y)); for (let i = 1; i < WP.length; i++) if (y <= WP[i][0]) return WP[i - 1][1] + (y - WP[i - 1][0]) / (WP[i][0] - WP[i - 1][0]) * (WP[i][1] - WP[i - 1][1]); return 1; };

  /* ---------------- the string ---------------- */
  function drawString() {
    const wrap = $("ts-wrap");
    if (!built.string) { built.string = 1;
      $("ts-zoom").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { st.z = +b.dataset.z; sync(); } });
      wrap.addEventListener("click", e => { const g = e.target.closest("[data-i]"); if (g) { if (g.dataset.i === "ww3" && st.i === "ww3") location.href = "ww3.html"; else pick(g.dataset.i); } else if (st.i && !e.target.closest("a")) { st.i = null; sync(); } });
      /* a wheel turn over the string moves along time, as a string should */
      wrap.addEventListener("wheel", e => { if (st.z > 1 && !e.ctrlKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) { wrap.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false }); }
    $("ts-zoom").innerHTML = [1, 2, 4].map(z => '<button class="chipbtn' + (st.z === z ? " on" : "") + '" data-z="' + z + '" title="' + (z === 1 ? "All of it on one screen" : "Stretch time " + z + " times; scroll sideways") + '">' + (z === 1 ? "All of time" : z + "×") + "</button>").join("");
    const keep = wrap.scrollWidth > wrap.clientWidth ? (wrap.scrollLeft + wrap.clientWidth / 2) / wrap.scrollWidth : null;
    const LAB = 150, W = Math.max(700, wrap.clientWidth * st.z), H = Math.max(360, wrap.clientHeight - 2), PADR = 16, DH = 54, AX = 22, plotW = W - LAB - PADR;
    const X = y => LAB + fx(y) * plotW;
    /* pack each lane: a war takes the first sub-row whose last bar has ended */
    const lanes = TW.lanes.map(l => ({ id: l[0], n: l[1], rows: [], ends: [] }));
    R.forEach(r => { const L = lanes.filter(l => l.id === r.lane)[0], x1 = X(r.a), x2 = Math.max(x1 + (r.kind === "battle" ? 0 : 5), X(r.e)); let k = 0; while (k < L.ends.length && L.ends[k] > x1 - 7) k++; L.ends[k] = x2 + (r.kind === "battle" ? 4 : 0); r._k = k; r._x1 = x1; r._x2 = x2; L.rows.push(r); });
    const subs = lanes.reduce((a, l) => a + Math.max(1, l.ends.length), 0), top = 6, rowH = Math.min(26, (H - top - DH - AX - lanes.length * 5) / subs);
    let y = top, g = "", lab = "", labels = [];
    lanes.forEach((L, li) => { const n = Math.max(1, L.ends.length), h = n * rowH + 5; L.y = y;
      g += '<rect class="ts-lane' + (li % 2 ? " odd" : "") + '" x="0" y="' + y.toFixed(1) + '" width="' + W + '" height="' + h.toFixed(1) + '"/>';
      lab += '<div class="ts-ln" style="top:' + y.toFixed(1) + "px;height:" + h.toFixed(1) + 'px"><b>' + esc(L.n) + "</b><i>" + L.rows.filter(r => r.kind !== "battle").length + "</i></div>";
      L.rows.forEach(r => { r._y = y + 2.5 + r._k * rowH + rowH / 2; }); y += h; });
    const plotB = y;
    /* ticks */
    let lastX = -99;
    [-1200, -800, -500, 1, 500, 1000, 1250, 1500, 1600, 1700, 1800, 1850, 1900, 1925, 1950, 1975, 2000, 2025].filter((t, i) => st.z > 1 || i % 2 === 0 || t >= 1500).forEach(t => { const x = X(t).toFixed(1);
      g += '<line class="ts-tk" x1="' + x + '" x2="' + x + '" y1="' + top + '" y2="' + (H - AX + 3) + '"/>' + (x - lastX >= 46 ? (lastX = x, '<text class="ts-tx" x="' + x + '" y="' + (H - 6) + '">' + (t < 0 ? -t + " BCE" : t === 1 ? "1 CE" : t) + "</text>") : ""); });   /* a year is named only where there is room for it */
    g += '<line class="ts-now" x1="' + X(NOW).toFixed(1) + '" x2="' + X(NOW).toFixed(1) + '" y1="' + top + '" y2="' + (H - AX + 3) + '"/><text class="ts-tx now" x="' + (X(NOW) - 4).toFixed(1) + '" y="' + (top + 10) + '" text-anchor="end">now</text>';
    /* the thread: one line through every war, in the order they began */
    const pts = R.filter(r => r.kind !== "battle").map(r => [(r._x1 + Math.min(r._x2, r._x1 + 40)) / 2, r._y]);
    let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i], m = (q[0] - p[0]) / 2; d += "C" + (p[0] + m).toFixed(1) + " " + p[1].toFixed(1) + " " + (q[0] - m).toFixed(1) + " " + q[1].toFixed(1) + " " + q[0].toFixed(1) + " " + q[1].toFixed(1); }
    g += '<path class="ts-thread" d="' + d + '"/>';
    /* the wars */
    const thick = r => r.gm == null ? Math.min(5, rowH - 6) : Math.max(4, Math.min(rowH - 3, 4 + 15 * Math.sqrt(r.gm / 77)));
    R.forEach(r => { const c = tone(r), sel = st.i === r.id ? " sel" : "", t = thick(r), tip = esc(r.n + " · " + span(r) + (r.lo != null ? " · " + tollT(r) + " dead" : ""));
      if (r.kind === "battle") { g += '<g class="ts-w bt' + sel + '" data-i="' + r.id + '"><title>' + tip + '</title><path d="M' + r._x1.toFixed(1) + " " + (r._y - 4) + "l4 4l-4 4l-4 -4z" + '"/></g>'; return; }
      const w = Math.max(5, r._x2 - r._x1), hiT = r.hi != null && r.hi > r.lo ? Math.max(t + 2, Math.min(rowH - 1, 4 + 15 * Math.sqrt(r.hi / 77))) : 0;
      g += '<g class="ts-w ' + r.kind + sel + (r.open ? " open" : "") + '" data-i="' + r.id + '" style="--c:' + c + '"><title>' + tip + "</title>"
        + (hiT ? '<rect class="hi" x="' + r._x1.toFixed(1) + '" y="' + (r._y - hiT / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hiT.toFixed(1) + '" rx="' + (hiT / 2).toFixed(1) + '"/>' : "")
        + '<rect class="b" x="' + r._x1.toFixed(1) + '" y="' + (r._y - t / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + t.toFixed(1) + '" rx="' + Math.min(t / 2, 4).toFixed(1) + '"/></g>';
      if (r.kind === "proj" || st.i === r.id || (r.gm != null && r.gm >= (st.z === 1 ? 4 : st.z === 2 ? 1.5 : 0)) || (st.z === 4 && r.kind !== "toll")) labels.push(r); });
    /* labels, where there is room to the right of the bar */
    labels.forEach(r => { const next = R.filter(q => q.lane === r.lane && q._k === r._k && q._x1 > r._x2)[0], room = (next ? next._x1 : W) - r._x2 - 8, name = r.kind === "proj" ? "World War III, projected ⟶" : r.n, need = name.length * 5.7;
      if (st.i === r.id || room >= need) g += '<text class="ts-lb' + (st.i === r.id ? " sel" : "") + (r.kind === "proj" ? " proj" : "") + '" x="' + (r._x2 + 5).toFixed(1) + '" y="' + (r._y + 3.5).toFixed(1) + '">' + esc(name) + "</text>";
      else if (r._x2 - r._x1 >= need + 6) g += '<text class="ts-lb in" x="' + (r._x1 + 5).toFixed(1) + '" y="' + (r._y + 3.5).toFixed(1) + '">' + esc(name) + "</text>"; });
    /* how many wars were under way, along the whole axis */
    const step = 3, cols = []; let mx = 1;
    for (let x = LAB; x <= W - PADR; x += step) { const lo = x, hi = x + step; let n = 0; WARS.forEach(r => { if (r._x1 < hi && r._x2 > lo) n++; }); cols.push(n); if (n > mx) mx = n; }
    const dy0 = plotB + 6, dh = H - AX - dy0 - 2; let dp = "M" + LAB + " " + (dy0 + dh);
    cols.forEach((n, i) => { dp += "L" + (LAB + i * step) + " " + (dy0 + dh - n / mx * dh).toFixed(1); });
    g += '<path class="ts-dens" d="' + dp + "L" + (W - PADR) + " " + (dy0 + dh) + 'Z"/>';
    lab += '<div class="ts-ln dens" style="top:' + dy0.toFixed(1) + "px;height:" + dh.toFixed(1) + 'px"><b>Wars under way</b><i>peak ' + PEAK.n + " · " + yr(PEAK.y) + "</i></div>";
    wrap.innerHTML = '<div class="ts-in" style="width:' + W + "px;height:" + H + 'px"><svg class="lux" width="' + W + '" height="' + H + '" role="img" aria-label="Every war on one time axis, by region">' + g + '</svg></div>'; $("ts-labs").innerHTML = lab;
    if (st.i && BY[st.i] && st.z > 1) { const r = BY[st.i]; if (r._x1 < wrap.scrollLeft + LAB + 20 || r._x2 > wrap.scrollLeft + wrap.clientWidth - 20) wrap.scrollLeft = r._x1 - wrap.clientWidth / 2; }
    else if (keep != null) wrap.scrollLeft = keep * wrap.scrollWidth - wrap.clientWidth / 2; else if (st.z > 1) wrap.scrollLeft = wrap.scrollWidth;
    const dead = SIZED.reduce((a, r) => a + r.gm, 0);
    $("ts-n").innerHTML = WARS.length + " wars · " + SIZED.length + " of them sized, about <b>" + Math.round(dead) + " million</b> dead between them at the middle of each range · " + R.filter(r => r.open && r.kind !== "proj").length + " still being fought";
  }

  /* ---------------- the toll ---------------- */
  /* where a second source puts the same war: a gold mark on the bar, a bracket when it gives a range of its own */
  const SEC = TW.second || {}, SOUGHT = TW.sought || {};
  function mark(r, w) { const x = SEC[r.id]; if (!x || x[0] == null) return ""; const a = +w(x[0]), b = +w(x[1]); return '<u class="sec' + (b > a ? " rng" : "") + '" style="left:' + a + "%;width:" + Math.max(0, b - a) + '%" title="' + esc(x[3].split(" — ")[0] + ": " + x[2]) + '"></u>'; }
  const ext = u => /^https/.test(u) ? ' target="_blank" rel="noopener"' : "";
  function secBlock(x) { return '<div class="tw-sec"><b>A second source</b><p>' + esc(x[2].charAt(0).toUpperCase() + x[2].slice(1)) + '.</p><a href="' + x[4] + '"' + ext(x[4]) + ">" + esc(x[3]) + " ⟶</a>" + (x[6] || []).map(m => '<a href="' + m[1] + '"' + ext(m[1]) + ">" + esc(m[0]) + " ⟶</a>").join("") + "</div>"; }
  function drawToll() {
    const mx = SIZED[0].hi, w = v => (Math.sqrt(v / mx) * 100).toFixed(2);
    $("tt-list").innerHTML = SIZED.map((r, i) => '<button class="tt-r' + (st.i === r.id ? " sel" : "") + (r.open ? " open" : "") + (SEC[r.id] ? "" : " one") + (st.f === "two" && !SEC[r.id] || st.f === "one" && SEC[r.id] ? " off" : "") + '" data-i="' + r.id + '" style="--c:' + tone(r) + '"><span class="k">' + (i + 1) + '</span><span class="nm">' + esc(r.n) + "<small>" + span(r) + '</small></span><span class="bw"><i class="hi" style="width:' + w(r.hi) + '%"></i><i class="lo" style="width:' + w(r.lo) + '%"></i>' + mark(r, w) + '</span><span class="v">' + tollT(r).replace(" million", "") + "<small>m</small></span></button>").join("");
    const nTwo = SIZED.filter(r => SEC[r.id]).length;
    $("tt-f").innerHTML = [["", "All " + SIZED.length], ["two", "A second source · " + nTwo], ["one", "The list only · " + (SIZED.length - nTwo)]].map(f => '<button class="chipbtn' + ((st.f || "") === f[0] ? " on" : "") + '" data-f="' + f[0] + '">' + f[1] + "</button>").join("");
    $("tt-n").innerHTML = "The " + SIZED.length + " wars the list puts at about half a million dead or more. The bright bar is the low estimate, the pale one the high: the gap is what is not known. Bars are on a square-root scale. A <u class=\"sec key\"></u> gold mark is where a second source, opened here, puts the same war; a dotted bar has the list's figure alone. " + srcA("list");
    if (!built.toll) { built.toll = 1; $("tt-f").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { st.f = b.dataset.f || null; sync(); } }); $("tt-list").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) pick(b.dataset.i); }); }
  }

  /* ---------------- the centuries ---------------- */
  function drawCent() {
    const C = []; for (let c = -13; c <= 20; c++) { const a = c * 100, b = a + 100; C.push({ a, b, n: 0, dead: 0, top: null }); }
    C.forEach(c => { R.forEach(r => { if (r.kind === "battle" || r.kind === "proj") return; if (r.a >= c.a && r.a < c.b) c.n++;
      if (r.gm != null) { const len = Math.max(1, r.e - r.a), ov = Math.max(0, Math.min(r.e, c.b) - Math.max(r.a, c.a)) + (r.e === r.a && r.a >= c.a && r.a < c.b ? 1 : 0), part = r.gm * ov / len; if (part > 0) { c.dead += part; if (!c.top || part > c.top[1]) c.top = [r, part]; } } }); });
    const mx = Math.max.apply(null, C.map(c => c.dead)), name = c => c.a < 0 ? ord(Math.ceil(-c.a / 100)) + " c. BCE" : ord(c.a / 100 + 1) + " century";
    $("tc-chart").innerHTML = C.map(c => '<div class="tc-c' + (c.top && st.i === c.top[0].id ? " sel" : "") + '"' + (c.top ? ' data-i="' + c.top[0].id + '"' : "") + ' title="' + esc(name(c) + ": about " + mil(c.dead) + " million dead in the sized wars; " + c.n + " wars begun") + '"><span class="v">' + (c.dead >= 0.05 ? mil(c.dead) : "") + '</span><i style="height:' + (Math.sqrt(c.dead / mx) * 100).toFixed(1) + '%"></i><b>' + (c.a < 0 ? Math.ceil(-c.a / 100) : c.a / 100 + 1) + "</b><small>" + c.n + "</small></div>").join("")
      + '<div class="tc-ax"><span>centuries BCE</span><span>centuries CE</span></div>';
    $("tc-table").innerHTML = '<table class="tw-tbl"><thead><tr><th>Century</th><th class="num">Wars begun</th><th class="num">Dead, millions</th><th>Its deadliest war</th></tr></thead><tbody>' + C.slice().reverse().filter(c => c.n || c.dead > 0.01).map(c => '<tr class="row"' + (c.top ? ' data-i="' + c.top[0].id + '"' : "") + "><td>" + name(c) + '</td><td class="num">' + c.n + '</td><td class="num">' + (c.dead >= 0.05 ? mil(c.dead) : "—") + "</td><td>" + (c.top ? esc(c.top[0].n) + " <small>" + span(c.top[0]) + "</small>" : "<small>none of this century's wars is sized</small>") + "</td></tr>").join("") + "</tbody></table>";
    $("tc-n").innerHTML = "Each sized war's dead, at the middle of its range, spread evenly over its years. Bars use a square-root scale. The record thins as it goes back: fewer wars before 1500 means fewer written down, not fewer fought.";
    if (!built.cent) { built.cent = 1; const f = e => { const b = e.target.closest("[data-i]"); if (b) pick(b.dataset.i); }; $("tc-chart").addEventListener("click", f); $("tc-table").addEventListener("click", f); }
  }

  /* ---------------- method ---------------- */
  const srcA = k => '<a href="' + TW.src[k][1] + '"' + (/^https/.test(TW.src[k][1]) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(TW.src[k][0].split(" — ")[0]) + "</a>";
  function drawMethod() {
    if (built.mt) return; built.mt = 1;
    $("tm-pane").innerHTML = '<div class="grid2 even"><div class="col scroll"><h4>What this is</h4><p>One string through every war the Archive holds: ' + WARS.length + " wars and " + TW.battles.length + " single battles, from Kadesh in 1274 BCE to the " + R.filter(r => r.open && r.kind !== "proj").length + " wars being fought as this was compiled, and one more that is only projected.</p>"
      + "<h4>Where the rows come from</h4><p><b>" + SIZED.length + " sized wars</b> are those a reference list of wars by death toll puts at about half a million dead or more; the range shown is that list's own. <b>" + R.filter(r => r.kind === "more").length + " more</b> are wars the Chronicle records that the list does not size; each opens its own record and source. <b>" + R.filter(r => r.kind === "now").length + " wars under way</b> are read from the Conflicts, where every figure is sourced and dated. The last bar, World War III, is not a war: it leads to the projection.</p>"
      + "<h4>How to read a death toll</h4><p>As an order of magnitude. Before 1800 nobody counted: the figures are reconstructions from tax rolls, censuses and chronicles, and most include the famine and disease that war brought. The Three Kingdoms figure is a gap between two censuses. Where the list gives a range the string draws both ends: the bright bar is the low estimate, the pale halo the high. The ranges come from one compilation.</p>"
      + "<h4>Second sources</h4><p>Every one of the " + SIZED.length + " sized wars was taken to a second source. <b>" + Object.keys(SEC).length + "</b> carry what that source says, on the war's card and as a gold mark on the Toll. For the other <b>" + (SIZED.length - Object.keys(SEC).length) + "</b> the pages opened give no figure, or only repeat the list's; their cards say what was opened, and their bars are dotted.</p>"
      + "<p>A second figure is not always the same measure, and the card says which it is. <b>Totals</b> come from Britannica, the World History Encyclopedia, university projects (Tufts, Minnesota, Central Arkansas, MIT), the United Nations and the International Rescue Committee. <b>Soldiers killed in battle only</b> come from Project Mars and from Levy's list of great-power wars: they sit far to the left of the list's bar, and the gap is the civilians, the famine and the disease. <b>A fall in population</b> is all there is for the Spanish conquests and the fall of the Ming. <b>An ancient author's count</b> is all there is for Caesar's Gaul and the Jewish wars. Where a second source confirms the list it may be because both go back to the same estimate: a second source shows that a figure is in the literature, not that it is right.</p><h4>The two world wars</h4><p>The two largest modern rows are also in the War Room, from other sources: it gives the Second World War about 60 million dead or more (the National WWII Museum) against the list's 70 to 85 million, and the First 8.5 million soldiers and about 13 million civilians (Britannica) against 15 to 22 million. The differences are of definition, mainly whether war-related famine and the 1918 influenza are counted.</p>"
      + "<h4>What the string leaves out</h4><p>Wars with fewer than about half a million dead that the Chronicle does not record; there were thousands. The record also thins with distance: the crowding after 1500 is partly more war and partly more writing. The centuries view spreads each war's dead evenly over its years, which no war obeyed. The count of wars under way peaks in the present for the same reason: today is listed far more completely than any earlier century.</p>"
      + '</div><div class="col scroll"><h4>Sources</h4><div class="srcs">' + Object.keys(TW.src).map(k => '<a href="' + TW.src[k][1] + '"' + (/^https/.test(TW.src[k][1]) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(TW.src[k][0]) + "</a>").join("") + "</div><h4>Second sources, opened 27 November 2026</h4><div class=\"srcs\">" + (function () { const seen = {}, o = []; Object.keys(SEC).forEach(k => [[SEC[k][3], SEC[k][4]]].concat(SEC[k][6] || []).forEach(m => { if (/^https/.test(m[1]) && !seen[m[1]]) { seen[m[1]] = 1; o.push('<a href="' + m[1] + '" target="_blank" rel="noopener">' + esc(m[0]) + "</a>"); } })); return o.join(""); })() + "</div>"
      + '<p class="hint">Every war that has a record in the Chronicle or the Conflicts links to it from its card, and that record carries its own source.</p><h4>Elsewhere in the Archive</h4><div class="srcs"><a href="wars.html">The War Room: the two world wars, day by day ⟶</a><a href="conflicts.html">The Conflicts: the wars under way ⟶</a><a href="situation.html">The Situation: the world as it stands ⟶</a><a href="ww3.html">World War III: the projection ⟶</a><a href="oracle.html#v=lines&i=war">The Oracle on war: is the world getting more violent? ⟶</a></div></div></div>';
  }

  /* ---------------- the side panel ---------------- */
  const X_BTN = '<button class="sd-x" title="Close (Esc)" aria-label="Close">×</button>';
  function card(r) {
    const e = r.ev && EV[r.ev], c = r.cf && CF.list.filter(x => x.id === r.cf)[0], rank = SIZED.indexOf(r), prev = R[r.ix - 1], next = R[r.ix + 1];
    if (r.kind === "proj") return X_BTN + '<div class="sd-k" style="color:#e8c455">Projected · not a war</div><div class="sd-t">World War III</div><p class="sd-p">The string does not end at the present. The last war between great powers ended in 1945; what a third would look like, how it could start and what it would cost has been wargamed, surveyed and modelled, and the Archive has gathered that in one place.</p><div class="sd-links"><a class="lnk go" href="ww3.html">Open the projection ⟶</a></div>' + (prev ? '<div class="sd-links"><button class="lnk" data-i="' + prev.id + '">◂ ' + esc(prev.n) + "</button></div>" : "");
    let h = X_BTN + '<div class="sd-k">' + esc(TW.lanes.filter(l => l[0] === r.lane)[0][1]) + (r.kind === "battle" ? " · a single battle" : r.open ? " · still being fought" : "") + '</div><div class="sd-t">' + esc(r.n) + '</div><div class="sd-d">' + span(r) + (r.kind !== "battle" && r.e - r.a >= 1 ? " · " + Math.round(r.e - r.a) + " years" : "") + (r.approx ? " · dates approximate" : "") + "</div>";
    if (r.lo != null) h += '<div class="tw-toll" style="--c:' + tone(r) + '"><b>' + tollT(r) + "</b><span>dead" + (rank >= 0 ? " · " + (rank ? ord(rank + 1) + " " : "") + "deadliest of " + SIZED.length : "") + '</span><div class="bw"><i class="hi" style="width:' + (Math.sqrt(r.hi / SIZED[0].hi) * 100).toFixed(1) + '%"></i><i class="lo" style="width:' + (Math.sqrt(r.lo / SIZED[0].hi) * 100).toFixed(1) + '%"></i>' + mark(r, v => (Math.sqrt(v / SIZED[0].hi) * 100).toFixed(1)) + "</div><small>" + (r.lo === r.hi ? "A single estimate." : "Low and high estimates.") + " " + srcA("list") + "</small></div>"
      + (SEC[r.id] ? secBlock(SEC[r.id]) : r.lo != null ? '<div class="tw-sec none"><b>The list\'s figure only</b><p>' + esc(SOUGHT[r.id] || "No second source has been opened for this war.") + "</p></div>" : "");
    else if (r.kind !== "battle") h += '<p class="hint">' + (r.kind === "now" ? "Not sized on the reference list. The Conflicts gives what is counted, side by side." : "Not sized on the reference list of wars by death toll.") + "</p>";
    if (TW.notes[r.id]) h += '<div class="q" style="border-color:#5b93b8"><span>' + esc(TW.notes[r.id]) + "</span></div>";
    if (e) h += '<p class="sd-p">' + esc(e.desc) + '</p><div class="sd-links"><a class="lnk" href="index.html#e=' + e.id + '&v=chronicle">In the Chronicle ⟶</a>' + (e.source ? '<a class="lnk" href="' + esc(e.source) + '" target="_blank" rel="noopener">Source ↗</a>' : "") + "</div>";
    if (c) h += '<div class="sd-k">Now</div><p class="sd-p">' + esc(c.now) + '</p><div class="sd-links"><a class="lnk go" href="conflicts.html#v=map&i=' + c.id + '">Sides, losses and sources, in the Conflicts ⟶</a></div>';
    if (r.id === "ww1" || r.id === "ww2") h += '<div class="sd-links"><a class="lnk go" href="wars.html#w=' + r.id + '">Day by day, in the War Room ⟶</a></div>';
    /* what else was being fought while this was */
    const mean = R.filter(q => q !== r && q.kind !== "battle" && q.kind !== "proj" && q.a <= r.e && q.e >= r.a).sort((a, b) => (b.gm || 0) - (a.gm || 0)).slice(0, 6);
    if (mean.length && r.kind !== "battle") h += '<div class="sd-k">Fought in the same years</div>' + mean.map(q => '<button class="rel" data-i="' + q.id + '" style="border-left-color:' + tone(q) + '">' + esc(q.n) + "<i>" + span(q) + (q.lo != null ? " · " + tollT(q) : "") + "</i></button>").join("");
    return h + '<div class="sd-links">' + (st.v !== "string" ? '<button class="lnk" data-go="string">On the string ⟶</button>' : "") + (prev ? '<button class="lnk" data-i="' + prev.id + '" title="' + esc(prev.n) + '">◂ before</button>' : "") + (next ? '<button class="lnk" data-i="' + next.id + '" title="' + esc(next.n) + '">after ▸</button>' : "") + "</div>";
  }
  function intro() {
    const T = { string: ["THE STRING", "Every war the Archive knows on one line of time, by the part of the world it was fought in. A bar's length is its years, its thickness its dead; the pale halo is the high estimate. The gold thread runs through them in the order they began. Click a war; stretch time with the buttons above."],
                toll: ["THE TOLL", "The wars ranked by their dead. The gap between the bright bar and the pale one is what is not known."],
                centuries: ["THE CENTURIES", "The same dead, century by century, with each century's deadliest war."], method: ["METHOD", "Where the rows come from and how far to trust a death toll."] }[st.v];
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + '</p><div class="dth"><div><span>Wars</span><b>' + WARS.length + "</b></div><div><span>Years covered</span><b>" + (Math.round(NOW) - R[0].a).toLocaleString("en") + "</b></div><div><span>Dead, sized wars</span><b>~" + Math.round(SIZED.reduce((a, r) => a + r.gm, 0)) + "m</b></div><div><span>Being fought now</span><b>" + R.filter(r => r.open && r.kind !== "proj").length + "</b></div></div>"
      + '<div class="sd-k">The deadliest</div>' + SIZED.slice(0, 7).map(q => '<button class="rel" data-i="' + q.id + '" style="border-left-color:' + tone(q) + '">' + esc(q.n) + "<i>" + span(q) + " · " + tollT(q) + "</i></button>").join("");
  }
  function renderSide() {
    const side = $("dc-side"), r = st.i && BY[st.i];
    if (!r && innerWidth <= 860) { side.hidden = true; return; }
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (r ? "" : " intro") + '">' + (r ? card(r) : intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read(); if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v; st.i = BY[q.i] ? q.i : null; st.z = [1, 2, 4].indexOf(+q.z) >= 0 ? +q.z : 1; st.f = q.f === "two" || q.f === "one" ? q.f : null; built.boot = 1; sync(true);
  }
  tabs = K.tabs(() => st.v, go);
  $("dc-side").addEventListener("click", e => { if (e.target.closest("a")) return; if (e.target.closest(".sd-x")) { st.i = null; return sync(); } const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; return sync(); } const b = e.target.closest("[data-i]"); if (b) { st.i = b.dataset.i; sync(); } });
  document.addEventListener("keydown", e => { if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Escape" && st.i) { st.i = null; return sync(); }
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d && st.i) { const n = R[BY[st.i].ix + d]; if (n) { st.i = n.id; sync(); } } });               /* ← → walk the string */
  K.finder($("dc-q"), q => R.filter(r => r.n.toLowerCase().indexOf(q) >= 0).slice(0, 12).map(r => ({ label: r.n, sub: span(r) + (r.lo != null ? " · " + tollT(r) : ""), id: r.id })), h => { if (st.v === "method") st.v = "string"; st.i = h.id; sync(); });
  let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); render(); }, 140); });
  window.addEventListener("hashchange", applyHash);
  applyHash();
})();
