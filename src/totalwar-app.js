/* ============================================================
   ARCHIVUS — TOTAL WAR (v19)
   Every war the Archive knows, on one string: thirty-three centuries from Kadesh to the wars
   being fought today, and the one that is only projected.
     · the Map        — every war where it was fought, lit in the years it was fought: drag the
                        year or press Play, and thirty-three centuries pass in about a minute (v19.3)
     · the String     — a bar a war, laid on its years and its part of the world, sized by its dead,
                        with one thread run through them all in the order they began
     · the Toll       — the wars ranked by their dead, each with the range the estimates span
     · the Centuries  — the same dead, century by century
     · Method & sources
   Data: src/data/totalwar.js (the sized wars), the Chronicle's own events (the rest),
   src/data/conflicts.js (the wars under way). Nothing is copied: a war that exists elsewhere
   in the Archive is read from there and links back to it.
   Deep links:  totalwar.html#v=map&y=1242     #v=map&i=ww2     #v=string&i=thirtyyears&z=2     #v=toll     #v=centuries
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
  const st = { v: "land", i: null, z: 1, f: null, y: null, q: null, p: null, c: null, la: { arrows: 1, names: 1, wars: 1 } }, built = {};   /* y: the year the Map shows (null = every war at once); q: the year the Conquests show (null = the opening year) */
  let tabs = null;
  const inSpan = (r, y) => r.kind === "battle" ? Math.abs(y - r.a) <= 1 : r.a <= y + .5 && r.e >= y - .5;
  function sync(skip) {
    if (play.on && st.v !== play.view) stop();
    const r = st.i && BY[st.i];
    if (st.v === "map" && r && r.kind !== "proj" && st.y != null && !play.on && !inSpan(r, st.y)) st.y = Math.min(NOW, (r.a + r.e) / 2);   /* a war chosen on the map brings its years with it */
    if (!skip) K.hash.write({ v: st.v, i: st.i, z: st.z > 1 ? st.z : null, f: st.v === "toll" ? st.f : null, y: st.v === "map" && st.y != null ? Math.round(st.y) : null,
      q: st.v === "land" && st.q != null ? Math.round(st.q) : null, p: st.v === "land" ? st.p : null, c: st.v === "land" ? st.c : null });
    tabs.paint(); renderSide(); render(); }
  function go(v) { if (tabs.ids.indexOf(v) >= 0) { st.v = v; sync(); } }
  function pick(id) { st.i = st.i === id ? null : id; sync(); }
  function render() { if (st.v === "land") drawLand(); else if (st.v === "map") drawMap(); else if (st.v === "string") drawString(); else if (st.v === "toll") drawToll(); else if (st.v === "centuries") drawCent(); else drawMethod(); }

  /* ---- the time axis: piecewise, so the crowded centuries get the room ---- */
  const WP = TW.warp;
  const fx = y => { y = Math.max(T0, Math.min(T1, y)); for (let i = 1; i < WP.length; i++) if (y <= WP[i][0]) return WP[i - 1][1] + (y - WP[i - 1][0]) / (WP[i][0] - WP[i - 1][0]) * (WP[i][1] - WP[i - 1][1]); return 1; };

  /* ---------------- the map ----------------
     One year drives it. Every war is a disc where it was fought (several discs for several fronts), sized by its
     dead. In the year shown a war being fought burns; one that has ended is an ember; one not yet begun is absent.
     With no year chosen every war is shown at once. Time runs on the string's own stretched axis, so the crowded
     centuries get the seconds as well as the room. */
  const FN = fx(NOW), fxInv = u => { u = Math.max(0, Math.min(FN, u)); for (let i = 1; i < WP.length; i++) if (u <= WP[i][1]) return WP[i - 1][0] + (u - WP[i - 1][1]) / (WP[i][1] - WP[i - 1][1]) * (WP[i][0] - WP[i - 1][0]); return NOW; };
  const GEO = window.ARCHIVUS_GEO || {}, WHERE = TW.where || {};
  const ptsOf = r => WHERE[r.id] || (r.ev && GEO[r.ev] ? [[GEO[r.ev][0], GEO[r.ev][1]]] : null) || (function () { const c = r.cf && CF.list.filter(x => x.id === r.cf)[0]; return c && c.at ? [[c.at[0], c.at[1]]] : null; })();
  const ON_MAP = R.filter(r => r.kind !== "proj" && ptsOf(r));
  const rad = r => r.gm == null ? (r.kind === "battle" ? 3.4 : 4) : 6 + 30 * Math.sqrt(r.gm / SIZED[0].gm);
  const deadBy = y => SIZED.reduce((a, r) => a + r.gm * Math.max(0, Math.min(1, (y - r.a) / Math.max(1, r.e - r.a))), 0), DEAD_ALL = SIZED.reduce((a, r) => a + r.gm, 0);
  const play = { on: false, raf: 0, last: 0, speed: 1, view: "map" }, YK = () => st.v === "land" ? "q" : "y";
  const SPEEDS = [[.5, "½×"], [1, "1×"], [2, "2×"]], speedChips = cls => SPEEDS.map(x => '<button class="' + cls + (play.speed === x[0] ? " on" : "") + '" data-a="sp" data-s="' + x[0] + '" title="Play at ' + x[1].replace("×", "") + ' times the pace">' + x[1] + "</button>").join("");
  let tmap = null, tmarks = [], thread = null, sideKey = "";
  const MX = lon => lon + 180, MY = lat => 90 - lat;
  function placeMarks() { if (!tmap) return; const s = tmap.scale(), a = s.toFixed(4), b = (s / tmap.SY).toFixed(4); for (let i = 0; i < tmarks.length; i++) { const t = "translate(" + tmarks[i].x + " " + tmarks[i].y + ") scale(" + a + " " + b + ")"; tmarks[i].g.setAttribute("transform", t); if (tmarks[i].gl) tmarks[i].gl.setAttribute("transform", t); } }
  function stop() { play.on = false; cancelAnimationFrame(play.raf); }
  function tick(now) {
    if (!play.on) return; const dt = Math.min(.1, (now - play.last) / 1000), k = YK(); play.last = now;
    const u = fx(st[k]) + dt * FN / 70 * play.speed; st[k] = fxInv(u);   /* 1× = the whole record in seventy seconds */
    if (u >= FN) { st[k] = NOW; stop(); return sync(); }
    frame(); play.raf = requestAnimationFrame(tick);
  }
  function start() { const k = YK(); if (st[k] == null || st[k] >= NOW - .5) st[k] = R[0].a - 6; st.i = null; play.on = true; play.view = st.v; play.last = performance.now(); sync(); play.raf = requestAnimationFrame(tick); }
  function setYear(y, keep) { stop(); st[YK()] = y == null ? null : Math.max(T0, Math.min(NOW, y)); if (!keep) st.i = null; sync(); }
  function frame() { if (st.v === "land") frameLand(); else frameMap(); }
  function drawMap() {
    if (!built.map) { built.map = 1;
      const ident = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { ident[c.n] = c.n; });
      tmap = K.worldMap($("tm"), { map: ident, tip: K.tip($("tm-tip"), $("tm-wrap")), onView: placeMarks,
        tipFor: (iso, name) => { if (name.charAt(0) !== "@") return null; const r = BY[name.slice(1).split("|")[0]], pl = name.split("|")[1]; return "<b>" + esc(r.n) + "</b><small>" + (pl ? esc(pl) + " · " : "") + span(r) + (r.lo != null ? " · " + tollT(r) + " dead" : "") + "</small>"; },
        onPick: (name, t) => { const m = t && t.closest && t.closest(".tm-w"); if (m) { stop(); pick(m.dataset.i); } else if (st.i) { st.i = null; sync(); } } });
      thread = K.svgEl("g", { class: "tm-th" }); tmap.over.appendChild(thread);
      /* small wars drawn last, so they stay on top of the large and can be picked */
      ON_MAP.slice().sort((a, b) => rad(b) - rad(a)).forEach(r => ptsOf(r).forEach((pt, k) => {
        const g = K.svgEl("g", { class: "tm-w" + (r.kind === "battle" ? " bt" : ""), "data-i": r.id, "data-n": "@" + r.id + (pt[2] ? "|" + pt[2] : ""), style: "--c:" + tone(r) });
        g.appendChild(K.svgEl(r.kind === "battle" ? "path" : "circle", r.kind === "battle" ? { class: "d", d: "M0 -5L5 0L0 5L-5 0Z" } : { class: "d", r: 4 }));
        const m = { g, r, k, x: MX(pt[1]).toFixed(2), y: MY(pt[0]).toFixed(2), R: rad(r) * (k ? .62 : 1), lab: null, key: "" };
        if (!k) { m.gl = K.svgEl("g", { class: "tm-l" }); m.lab = K.svgEl("text", { class: "lb", y: 3.5 }, r.n); m.gl.appendChild(m.lab); }
        tmarks.push(m); tmap.over.appendChild(g);
      }));
      tmarks.forEach(m => { if (m.gl) tmap.over.appendChild(m.gl); });   /* names go above every disc */
      $("tm-zi").onclick = () => tmap.zoomBy(1 / 1.6); $("tm-zo").onclick = () => tmap.zoomBy(1.6); $("tm-zr").onclick = () => tmap.reset();
      $("tm-ctl").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const a = b.dataset.a;
        if (a === "play") { if (play.on) { stop(); sync(); } else start(); } else if (a === "all") setYear(null, true); else if (a === "sp") { play.speed = +b.dataset.s; drawCtl(); } });
      const sc = $("tm-scrub"), at = e => { const b = sc.getBoundingClientRect(); return fxInv(Math.max(0, Math.min(1, (e.clientX - b.left - 14) / (b.width - 28))) * FN); };
      let drag = false;
      sc.addEventListener("pointerdown", e => { const t = e.target.closest("[data-y]"); if (t) return setYear(+t.dataset.y); drag = true; try { sc.setPointerCapture(e.pointerId); } catch (_) {} stop(); st.y = at(e); st.i = null; frame(); });
      sc.addEventListener("pointermove", e => { if (drag) { st.y = at(e); frame(); } });
      const end = () => { if (drag) { drag = false; sync(); } }; sc.addEventListener("pointerup", end); sc.addEventListener("pointercancel", end);
      sc.addEventListener("keydown", e => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; e.preventDefault(); e.stopPropagation(); setYear(fxInv(fx(st.y == null ? NOW : st.y) + d * FN / 120)); });
      const lg = '<b>The dead</b><span><i style="background:#ff2e55"></i>10 million and over</span><span><i style="background:#e0502f"></i>1 million and over</span><span><i style="background:#ee8f3a"></i>under a million</span><span><i style="background:#8d96af"></i>not sized</span><span class="lg-h">In the year shown</span><span><svg viewBox="-8 -8 16 16"><circle r="6" fill="rgba(224,80,47,.5)" stroke="#e0502f" stroke-width="1.6"/></svg>being fought</span><span><svg viewBox="-8 -8 16 16"><circle r="2.4" fill="#e0502f" opacity=".7"/></svg>over</span><span><svg viewBox="-8 -8 16 16"><path d="M-7 3L7 -3" stroke="#e8c455" stroke-width="1.6"/></svg>the thread, in the order wars began</span>'
        + "<small>A war fought on several fronts has several discs. Discs are sized by the dead (the middle of the range), and the running count spreads each war's dead evenly over its years. Places are set by hand to about a degree: they are positions for a map, not findings. " + srcA("list") + "</small>";
      $("tm-leg").innerHTML = $("tm-leg2").innerHTML = lg;
      /* the track under the map: how many wars were under way, on the stretched axis */
      const N = 260, cnt = []; let mx = 1; for (let i = 0; i <= N; i++) { const y = fxInv(i / N * FN); let n = 0; WARS.forEach(r => { if (r.a <= y && r.e >= y) n++; }); cnt.push(n); mx = Math.max(mx, n); }
      $("tm-dens").innerHTML = '<path d="M0 30' + cnt.map((n, i) => "L" + (i / N * 1000).toFixed(1) + " " + (30 - n / mx * 28).toFixed(1)).join("") + 'L1000 30Z"/>';
      $("tm-ticks").innerHTML = [-1200, -500, 1, 500, 1000, 1500, 1800, 1900, 2000].map(y => '<button data-y="' + y + '" style="left:' + (fx(y) / FN * 100).toFixed(2) + '%" title="Go to ' + yr(y) + '">' + (y < 0 ? -y + " BCE" : y === 1 ? "1 CE" : y) + "</button>").join("");
    }
    drawCtl(); frameMap(); placeMarks();
  }
  function drawCtl() {
    $("tm-ctl").innerHTML = '<button class="chipbtn go' + (play.on ? " on" : "") + '" data-a="play" title="Space">' + (play.on ? "❚❚ Pause" : st.y != null && st.y < NOW - .5 ? "▶ Play on" : "▶ Play all " + (Math.round(NOW) - R[0].a).toLocaleString("en") + " years") + '</button>' + speedChips("chipbtn") + '<button class="chipbtn' + (st.y == null ? " on" : "") + '" data-a="all" title="Every war in the record at once">All at once</button>';
    $("tm-n").innerHTML = ON_MAP.length + " wars and battles placed where they were fought. Drag the year, press Play, or click a disc.";
  }
  function frameMap() {
    const y = st.y, all = y == null, s = tmap.scale(), act = [];
    const kf = Math.max(.42, Math.min(1, $("tm-wrap").clientWidth / 1000)), kk = "|" + kf.toFixed(2);   /* a small map gets small discs */
    for (let i = 0; i < tmarks.length; i++) { const m = tmarks[i], r = m.r;
      const state = all ? "all" : inSpan(r, y) ? "on" : r.e < y ? "em" : "off", sel = st.i === r.id, key = state + (sel ? "s" : "") + kk;
      if (state === "on" && !m.k) act.push(m);
      if (key === m.key) continue; m.key = key;
      m.g.setAttribute("class", "tm-w " + state + (r.kind === "battle" ? " bt" : "") + (sel ? " sel" : "")); m.g.style.display = state === "off" && !sel ? "none" : "";
      const rr = state === "on" ? Math.max(3, m.R * kf) : state === "all" ? Math.max(2.4, m.R * .62 * kf) : r.gm >= 1 ? 2.6 : 1.9, d = m.g.firstChild;
      if (r.kind === "battle") d.setAttribute("transform", "scale(" + (state === "on" ? 1.5 : .6) + ")"); else d.setAttribute("r", rr.toFixed(1));
      if (m.lab) { m.lab.setAttribute("x", (rr + 5).toFixed(1)); m.lab.setAttribute("class", "lb" + (state === "em" || state === "off" ? " dim" : "")); }
    }
    /* names: the largest first, each only where it does not sit on one already placed */
    const boxes = [], want = all ? tmarks.filter(m => !m.k && m.r.gm >= 7) : act;
    tmarks.forEach(m => { if (m.lab) m.lab.style.display = "none"; });
    want.slice().sort((a, b) => (st.i === b.r.id) - (st.i === a.r.id) || (b.r.gm || 0) - (a.r.gm || 0)).forEach(m => {
      if (!all && m.r.gm == null && st.i !== m.r.id && want.length > 9) return;
      const x0 = +m.x, y0 = +m.y * tmap.SY - 7 * s, w = (m.r.n.length * 6.1 + 34) * s, h = 13 * s, b = [x0, y0, x0 + w, y0 + h];
      if (st.i !== m.r.id && boxes.some(o => o[0] < b[2] && o[2] > b[0] && o[1] < b[3] && o[3] > b[1])) return;
      boxes.push(b); m.lab.style.display = "";
    });
    const sel = st.i && BY[st.i]; if (sel) tmarks.forEach(m => { if (m.r === sel && m.lab) m.lab.style.display = ""; });
    /* the thread: the last wars to begin, joined in the order they began, fading as they recede */
    let th = "";
    if (!all) { const beg = WARS.filter(r => r.a <= y && ptsOf(r)).slice(-8); for (let i = 1; i < beg.length; i++) { const a = ptsOf(beg[i - 1])[0], b = ptsOf(beg[i])[0]; th += '<line x1="' + MX(a[1]) + '" y1="' + MY(a[0]) + '" x2="' + MX(b[1]) + '" y2="' + MY(b[0]) + '" style="opacity:' + (.05 + .45 * i / beg.length).toFixed(2) + '"/>'; } }
    thread.innerHTML = th;
    /* the read-out and the track */
    const n = all ? WARS.length : WARS.filter(r => inSpan(r, y)).length, dead = all ? DEAD_ALL : deadBy(y);
    $("tm-now").innerHTML = "<b>" + (all ? "All of it" : yr(Math.round(y)) + (y >= 0 ? " <i>CE</i>" : "")) + "</b><span>" + (all ? WARS.length + " wars, " + yr(R[0].a) + " to now" : n + (n === 1 ? " war" : " wars") + " under way") + "</span><span>" + (all ? "about " + Math.round(DEAD_ALL) + " million dead in the " + SIZED.length + " that are sized" : "about " + (dead >= 10 ? Math.round(dead) : dead.toFixed(1)) + " million dead so far, of " + Math.round(DEAD_ALL)) + "</span>";
    const p = all ? 100 : fx(y) / FN * 100; $("tm-h").style.left = "calc(14px + (100% - 28px) * " + (p / 100).toFixed(4) + ")"; $("tm-done").style.width = "calc((100% - 28px) * " + (p / 100).toFixed(4) + ")";
    $("tm-scrub").setAttribute("aria-valuenow", all ? Math.round(NOW) : Math.round(y)); $("tm-scrub").setAttribute("aria-valuetext", all ? "every war at once" : yr(Math.round(y)));
    /* while it plays, the panel follows the wars under way */
    if (play.on) { const k = act.map(m => m.r.id).join(); if (k !== sideKey) { sideKey = k; renderSide(); } }
  }

  /* ---------------- the conquests ----------------
     The War Room's map, for all of it: today's countries painted by the power that held them in the year
     shown. Solid = held; hatched = held in part, or through a vassal or an occupation. A land that has just
     changed hands flashes, and an arrow runs to it from the power that took it. Data: src/data/conquests.js. */
  const CQ = window.ARCHIVUS_CONQUESTS || { powers: [], holds: {}, raids: [], meta: {} }, ERAS = (window.ARCHIVUS_ERAS || []).filter(e => e.end > T0 && e.start < NOW);
  const PW = {}, HOLD = {}, GRAB = []; CQ.powers.forEach(p => { PW[p[0]] = { id: p[0], n: p[1], c: p[2], at: p[3], lands: [] }; });
  Object.keys(CQ.holds).forEach(pid => CQ.holds[pid].split(";").forEach(h => { const m = /^(~?)([^:]+):(-?\d+):(-?\d+)(?:@(\w+))?$/.exec(h); if (!m || !PW[pid]) return;
    const o = { p: pid, c: m[2], a: +m[3], e: +m[4], part: !!m[1], war: m[5] || null }; (HOLD[o.c] = HOLD[o.c] || []).push(o); PW[pid].lands.push(o); GRAB.push(o); }));
  Object.keys(HOLD).forEach(c => HOLD[c].sort((a, b) => a.a - b.a)); GRAB.sort((a, b) => a.a - b.a || (a.p < b.p ? -1 : 1));
  const ownerAt = (c, y) => { const h = HOLD[c]; let best = null; if (h) for (let i = 0; i < h.length; i++) { const o = h[i]; if (o.a > y) break; if (o.e <= y) continue; if (!best || (best.part && !o.part) || (best.part === o.part && o.a >= best.a)) best = o; } return best; };
  /* grabs gathered by year and power: "1258 · the Mongols take Iraq and Kuwait" */
  const GG = []; GRAB.forEach(o => { const l = GG[GG.length - 1]; if (l && l.y === o.a && l.p === o.p) l.cs.push(o); else GG.push({ y: o.a, p: o.p, cs: [o] }); });
  const GY = Array.from(new Set(GG.map(g => g.y))).sort((a, b) => a - b);
  const Q0 = (CQ.meta.open != null ? CQ.meta.open : 1914), qNow = () => st.q == null ? Q0 : st.q;
  const recent = (y, a) => y >= a && y - a <= 25 && fx(y) - fx(a) < .012 * FN;         /* just taken: still flashing */
  const eraOf = y => ERAS.filter(e => y >= e.start && y < e.end)[0] || ERAS[ERAS.length - 1];
  const list = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const mixc = (h, t) => { const a = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), b = [16, 19, 28]; return "rgb(" + a.map((v, i) => Math.round(v * t + b[i] * (1 - t))).join(",") + ")"; };
  let lmap = null, lands = [], llabs = [], larrows = null, lwars = null, CEN = {};
  function placeLand() { if (!lmap) return; const s = lmap.scale(), a = s.toFixed(4), b = (s / lmap.SY).toFixed(4); llabs.forEach(m => m.g.setAttribute("transform", "translate(" + m.x + " " + m.y + ") scale(" + a + " " + b + ")")); if (built.land) frameLand(); }
  function drawLand() {
    if (!built.land) {
      const ident = {}; (window.ARCHIVUS_COUNTRIES || []).forEach(c => { ident[c.n] = c.n; });
      lmap = K.worldMap($("tq"), { map: ident, tip: K.tip($("tq-tip"), $("tq-wrap")), onView: placeLand,
        tipFor: (iso, name) => { if (name.charAt(0) === "@") return "<b>" + esc(name.slice(1)) + "</b>"; const y = qNow(), o = ownerAt(name, y), all = (HOLD[name] || []).filter(h => h.a <= y && h.e > y && h !== o);
          return "<b>" + esc(name) + "</b><small>" + (o ? (o.part ? "held in part by " : "held by ") + esc(PW[o.p].n) + ", " + yr(o.a) + " – " + (o.e >= NOW - 1 ? "now" : yr(o.e)) + (all.length ? "; also " + esc(list(all.map(h => PW[h.p].n))) : "") : "under no empire in " + yr(Math.round(y))) + "</small>"; },
        onPick: (name, t) => { stop(); const w = t && t.closest && t.closest(".tq-w"), l = t && t.closest && t.closest(".tq-l"); if (w) { st.i = w.dataset.i; return sync(); } if (l) { st.p = st.p === l.dataset.p ? null : l.dataset.p; st.c = st.i = null; return sync(); }
          if (name && HOLD[name]) { st.c = st.c === name ? null : name; st.p = null; st.i = null; } else { st.c = st.p = st.i = null; } sync(); } });
      /* one hatch per power, for land held in part */
      const defs = K.svgEl("defs"); CQ.powers.forEach(p => { const pt = K.svgEl("pattern", { id: "hx-" + p[0], width: 1.5, height: 1.5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
        pt.appendChild(K.svgEl("rect", { width: 1.5, height: 1.5, fill: mixc(p[2], .2) })); pt.appendChild(K.svgEl("rect", { width: .62, height: 1.5, fill: mixc(p[2], .8) })); defs.appendChild(pt); });
      $("tq").insertBefore(defs, $("tq").firstChild);
      Object.keys(lmap.paths).forEach(n => { let big = null, area = 0; lmap.paths[n].forEach(p => { const b = p.getBBox(); if (b.width * b.height > area) { area = b.width * b.height; big = b; } }); CEN[n] = [big.x + big.width / 2, big.y + big.height / 2]; lands.push({ n, ps: lmap.paths[n], key: "" }); });
      larrows = K.svgEl("g", { class: "tq-ar" }); lmap.over.appendChild(larrows); lwars = K.svgEl("g", { class: "tq-wr" }); lmap.over.appendChild(lwars);
      CQ.powers.forEach(p => { const g = K.svgEl("g", { class: "tq-l", "data-p": p[0], "data-n": "@" + p[1] }); g.appendChild(K.svgEl("text", { y: 3.5 }, p[1])); lmap.over.appendChild(g); llabs.push({ g, p: PW[p[0]], x: (p[3][1] + 180).toFixed(2), y: (90 - p[3][0]).toFixed(2), on: false }); });
      $("tq-zi").onclick = () => lmap.zoomBy(1 / 1.6); $("tq-zo").onclick = () => lmap.zoomBy(1.6);
      $("tq-tools").addEventListener("click", e => { const b = e.target.closest("[data-layer]"); if (b) { st.la[b.dataset.layer] = st.la[b.dataset.layer] ? 0 : 1; b.classList.toggle("on", !!st.la[b.dataset.layer]); frameLand(); } else if (e.target.closest("#tq-lg")) $("tq-leg").hidden = !$("tq-leg").hidden; });
      const TH = { world: null, europe: [16, 49, 78], near: [44, 31, 86], asia: [100, 30, 130], africa: [18, 3, 150], americas: [-80, 8, 200] };
      $("tq-th").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (!b) return; $("tq-th").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); const t = TH[b.dataset.t]; if (!t) lmap.reset(); else lmap.view(t[0] + 180, (90 - t[1]) * lmap.SY, t[2]); });
      $("tq-oob").addEventListener("click", e => { const b = e.target.closest("[data-p]"); if (b) { st.p = st.p === b.dataset.p ? null : b.dataset.p; st.c = st.i = null; sync(); } });
      $("tq-bar").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const a = b.dataset.a;
        if (a === "play") { if (play.on) { stop(); sync(); } else start(); } else if (a === "start") setYear(R[0].a - 6); else if (a === "sp") { play.speed = +b.dataset.s; drawBar(); } else if (a === "back" || a === "fwd") stepGrab(a === "fwd" ? 1 : -1); });
      const tl = $("tq-tl"), at = e => { const b = tl.getBoundingClientRect(); return fxInv(Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)) * FN); }; let drag = false;
      tl.addEventListener("pointerdown", e => { drag = true; try { tl.setPointerCapture(e.pointerId); } catch (_) {} stop(); st.q = at(e); st.i = null; frameLand(); });
      tl.addEventListener("pointermove", e => { if (drag) { st.q = at(e); frameLand(); } });
      const end = () => { if (drag) { drag = false; sync(); } }; tl.addEventListener("pointerup", end); tl.addEventListener("pointercancel", end);
      $("tq-bands").innerHTML = ERAS.map((e, k) => { const a = fx(Math.max(T0, e.start)) / FN * 100, b = fx(Math.min(NOW, e.end)) / FN * 100; return '<span class="' + (k % 2 ? "odd" : "") + '" style="left:' + a.toFixed(2) + "%;width:" + (b - a).toFixed(2) + '%" title="' + esc(e.name) + '"><b>' + esc(e.name) + "</b></span>"; }).join("")
        + [-1000, 1, 500, 1000, 1500, 1800, 1900, 2000].map(y => '<i style="left:' + (fx(y) / FN * 100).toFixed(2) + '%">' + (y < 0 ? -y + " BCE" : y === 1 ? "1 CE" : y) + "</i>").join("");
      $("tq-leg").innerHTML = '<b>How to read it</b><span><i style="background:#d05a8a"></i>held by a power</span><span><i class="hx"></i>held in part, or through a vassal or an occupation</span><span><i class="gr"></i>just taken</span><span><svg viewBox="-8 -8 16 16"><path d="M-7 4Q0 -6 7 -2" fill="none" stroke="#f0e7d0" stroke-width="1.6"/></svg>the blow that took it</span>'
        + "<small>Drawn on today's borders, which are the only shapes the map has: a country is painted when a power held it or most of it. Schematic, like the War Room's fronts: the years are the conventional ones, good to a decade before about 1500, and no frontier is claimed. A country ruling only itself is left dark, which is why most of the map is dark today.</small>";
      built.land = 1;
    }
    drawBar(); frameLand(); placeLand();
  }
  function stepGrab(d) { const y = qNow(); let t = null; if (d > 0) { for (let i = 0; i < GY.length; i++) if (GY[i] > y + .5) { t = GY[i]; break; } } else for (let i = GY.length - 1; i >= 0; i--) if (GY[i] < y - .5) { t = GY[i]; break; } if (t != null) setYear(t, true); }
  function drawBar() {
    $("tq-bar-b").innerHTML = '<button class="tool-btn" data-a="start" title="To the beginning">⏮</button><button class="tool-btn accent" data-a="play" title="Play / pause (Space)">' + (play.on ? "❚❚ Pause" : "▶ Play") + "</button>" + speedChips("tool-btn sp")
      + '<button class="tool-btn" data-a="back" title="Back to the last land taken (←)">◀</button><button class="tool-btn" data-a="fwd" title="On to the next land taken (→)">▶</button>';
  }
  function frameLand() {
    if (!built.land) return; const y = qNow(), s = lmap.scale(), count = {}, sel = st.p, selC = st.c;
    for (let i = 0; i < lands.length; i++) { const L = lands[i], o = ownerAt(L.n, y);
      if (o) count[o.p] = (count[o.p] || 0) + 1;
      const fresh = o && recent(y, o.a), dim = sel ? !o || o.p !== sel : false, key = (o ? o.p + (o.part ? "~" : "") : "") + (fresh ? "!" : "") + (dim ? "-" : "") + (selC === L.n ? "s" : "");
      if (key === L.key) continue; L.key = key;
      const fill = o ? (o.part ? "url(#hx-" + o.p + ")" : mixc(PW[o.p].c, .78)) : "";
      L.ps.forEach(p => { p.style.fill = fill; p.setAttribute("class", "at-c" + (o ? " on" : "") + (fresh ? " grab" : "") + (dim ? " dim" : "") + (selC === L.n ? " sel" : "")); });
    }
    /* the powers' names, the largest first, where there is room */
    const boxes = [], act = llabs.filter(m => count[m.p.id]).sort((a, b) => (sel === b.p.id) - (sel === a.p.id) || count[b.p.id] - count[a.p.id]);
    llabs.forEach(m => { m.g.style.display = "none"; });
    if (st.la.names) act.forEach(m => { const kp = innerWidth <= 860 ? .6 : 1, w = (m.p.n.length * 8.7 + 14) * s * kp, h = 15 * s * kp, x0 = +m.x - w / 2, y0 = +m.y * lmap.SY - h / 2, b = [x0, y0, x0 + w, y0 + h];
      if (sel !== m.p.id && boxes.some(o => o[0] < b[2] && o[2] > b[0] && o[1] < b[3] && o[3] > b[1])) return; boxes.push(b); m.g.style.display = ""; m.g.setAttribute("class", "tq-l" + (sel && sel !== m.p.id ? " dim" : "")); m.g.firstChild.style.fill = m.p.c; });
    /* the blows: an arrow from a power to each land it has just taken, and to where it struck and kept nothing */
    let ar = "";
    if (st.la.arrows) {
      const arrow = (p, tx, ty, age, raid, lab) => { const x0 = p.at[1] + 180, y0 = 90 - p.at[0], dx = tx - x0, dy = ty - y0, d = Math.hypot(dx, dy); if (d < 3) return "";
        const mx = (x0 + tx) / 2 - dy * .16, my = (y0 + ty) / 2 + dx * .16, op = (1 - age * .7).toFixed(2), ang = Math.atan2((ty - my) * lmap.SY, tx - mx) * 180 / Math.PI;
        return '<path class="' + (raid ? "rd" : "") + '" d="M' + x0.toFixed(1) + " " + y0.toFixed(1) + "Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + tx.toFixed(1) + " " + ty.toFixed(1) + '" style="stroke:' + p.c + ";opacity:" + op + '"/><g transform="translate(' + tx.toFixed(1) + " " + ty.toFixed(1) + ") scale(" + s.toFixed(4) + " " + (s / lmap.SY).toFixed(4) + ") rotate(" + ang.toFixed(0) + ')" style="opacity:' + op + '"><path class="hd" d="M0 0L-9 -4.5L-9 4.5Z" style="fill:' + p.c + '"/>' + (lab ? '<text class="rl" x="8" y="4" transform="rotate(' + (-ang).toFixed(0) + ')">' + esc(lab) + "</text>" : "") + "</g>"; };
      GRAB.forEach(o => { if (o.a > y) return; if (!recent(y, o.a) || o.e <= y || !CEN[o.c]) return; if (sel && o.p !== sel) return; ar += arrow(PW[o.p], CEN[o.c][0], CEN[o.c][1], Math.min(1, (y - o.a) / 25), false); });
      CQ.raids.forEach(r => { if (y >= r[0] && y - r[0] <= 12 && fx(y) - fx(r[0]) < .012 * FN && PW[r[1]] && (!sel || sel === r[1])) ar += arrow(PW[r[1]], r[3] + 180, 90 - r[2], (y - r[0]) / 12, true, r[4]); });
    }
    larrows.innerHTML = ar;
    /* the wars of the string that are being fought in this year: the largest few, named where they were fought */
    let wr = "";
    if (st.la.wars) WARS.filter(r => inSpan(r, y) && r.gm >= .5 && ptsOf(r)).sort((a, b) => b.gm - a.gm).slice(0, 5).forEach(r => { const pt = ptsOf(r)[0];
      wr += '<g class="tq-w' + (st.i === r.id ? " sel" : "") + '" data-i="' + r.id + '" transform="translate(' + (pt[1] + 180).toFixed(1) + " " + (90 - pt[0]).toFixed(1) + ") scale(" + s.toFixed(4) + " " + (s / lmap.SY).toFixed(4) + ')"><path d="M-4 -4L4 4M-4 4L4 -4"/><text x="8" y="3.5">' + esc(r.n) + "</text></g>"; });
    lwars.innerHTML = wr;
    /* the plate, the order of battle and the track */
    const era = eraOf(y), ids = Object.keys(count).sort((a, b) => count[b] - count[a]), n = ids.reduce((a, k) => a + count[k], 0);
    $("tq-date").innerHTML = yr(Math.round(y)) + (y >= 0 ? " <i>CE</i>" : ""); $("tq-era").textContent = st.q == null && CQ.meta.openNote ? CQ.meta.openNote : era.name;
    $("tq-cnt").textContent = ids.length ? ids.length + (ids.length === 1 ? " power holds " : " powers hold ") + n + " of today's " + lands.length + " countries" : "No empire on the map";
    const ok = ids.join() + "|" + (sel || "");
    if (ok !== frameLand.k) { frameLand.k = ok; $("tq-oob").innerHTML = '<span class="lb">On the map</span>' + (ids.length ? ids.map(k => '<button class="tqp' + (sel === k ? " sel" : "") + '" data-p="' + k + '" style="--c:' + PW[k].c + '">' + esc(PW[k].n) + "<i>" + count[k] + "</i></button>").join("") : '<span class="lb none">no empire holds another people\'s land in this year of the record</span>'); }
    else ids.forEach(k => { const b = $("tq-oob").querySelector('[data-p="' + k + '"] i'); if (b && b.textContent !== String(count[k])) b.textContent = count[k]; });
    $("tq-h").style.left = (fx(y) / FN * 100).toFixed(3) + "%"; $("tq-tl").setAttribute("aria-valuenow", Math.round(y)); $("tq-tl").setAttribute("aria-valuetext", yr(Math.round(y)));
    if (play.on) { const k = era.id + "|" + GG.filter(g => recent(y, g.y)).length + "|" + ids.length; if (k !== sideKey) { sideKey = k; renderSide(); } }
  }
  const grabLine = g => "<b>" + esc(PW[g.p].n) + "</b> " + (g.cs.every(o => o.part) ? "pushes into " : "takes ") + esc(list(g.cs.map(o => o.c)));
  function landSide() {
    const y = qNow(), era = eraOf(y), k = ERAS.indexOf(era), row = (g, cls) => '<button class="rel gq ' + (cls || "") + '" data-q="' + g.y + '" data-p="' + g.p + '" style="border-left-color:' + PW[g.p].c + '"><span>' + grabLine(g) + "</span><i>" + yr(g.y) + (g.cs[0].war && BY[g.cs[0].war] ? " · " + esc(BY[g.cs[0].war].n) : "") + "</i></button>";
    if (st.c && HOLD[st.c]) { const o = ownerAt(st.c, y), hs = HOLD[st.c];
      return X_BTN + '<div class="sd-k">Who has held it</div><div class="sd-t">' + esc(st.c) + '</div><div class="sd-d">' + (o ? (o.part ? "held in part by " : "held by ") + esc(PW[o.p].n) + " in " + yr(Math.round(y)) : "under no empire in " + yr(Math.round(y))) + "</div><p class=\"hint\">" + hs.length + (hs.length === 1 ? " time" : " times") + " in the record this land, on today's borders, has been in an empire's hands. Click a row to go to the year it was taken.</p>"
        + hs.map(h => '<button class="rel gq' + (h === o ? " now" : "") + '" data-q="' + h.a + '" data-p="' + h.p + '" style="border-left-color:' + PW[h.p].c + '"><span><b>' + esc(PW[h.p].n) + "</b>" + (h.part ? " <u>in part</u>" : "") + "</span><i>" + yr(h.a) + " – " + (h.e >= NOW - 1 ? "now" : yr(h.e)) + " · " + (Math.min(h.e, Math.round(NOW)) - h.a) + " years" + (h.war && BY[h.war] ? " · " + esc(BY[h.war].n) : "") + "</i></button>").join(""); }
    if (st.p && PW[st.p]) { const P = PW[st.p], ls = P.lands.slice().sort((a, b) => a.a - b.a), a0 = Math.min.apply(null, ls.map(h => h.a)), e0 = Math.max.apply(null, ls.map(h => h.e)); let best = 0, by = a0;
      for (let t = a0; t <= Math.min(e0, NOW); t += (e0 - a0 > 600 ? 5 : 1)) { let n = 0; Object.keys(HOLD).forEach(c => { const o = ownerAt(c, t); if (o && o.p === P.id) n++; }); if (n > best) { best = n; by = t; } }
      const wars = Array.from(new Set(ls.map(h => h.war).filter(w => w && BY[w])));
      return X_BTN + '<div class="sd-k" style="color:' + P.c + '">A power</div><div class="sd-t">' + esc(P.n) + '</div><div class="sd-d">' + yr(a0) + " – " + (e0 >= NOW - 1 ? "now" : yr(e0)) + '</div><div class="dth"><div><span>Lands held in all</span><b>' + new Set(ls.map(h => h.c)).size + "</b></div><div><span>At its widest</span><b>" + best + "</b></div></div>"
        + '<div class="sd-links"><button class="lnk go" data-q="' + by + '" data-p="' + P.id + '">Its widest, in ' + yr(by) + " ⟶</button></div>"
        + (wars.length ? '<div class="sd-k">The wars that took them</div>' + wars.map(w => '<button class="rel" data-i="' + w + '" style="border-left-color:' + tone(BY[w]) + '">' + esc(BY[w].n) + "<i>" + span(BY[w]) + (BY[w].lo != null ? " · " + tollT(BY[w]) + " dead" : "") + "</i></button>").join("") : "")
        + '<div class="sd-k">Every land, in the order it was taken</div>' + ls.map(h => '<button class="rel gq" data-q="' + h.a + '" data-p="' + P.id + '" data-c="' + esc(h.c) + '" style="border-left-color:' + P.c + '"><span>' + esc(h.c) + (h.part ? " <u>in part</u>" : "") + "</span><i>" + yr(h.a) + " – " + (h.e >= NOW - 1 ? "now" : yr(h.e)) + "</i></button>").join(""); }
    const now = GG.filter(g => recent(y, g.y)), next = GG.filter(g => g.y > y).slice(0, 5), prev = GG.filter(g => g.y <= y && !recent(y, g.y)).slice(-4).reverse(), wars = WARS.filter(r => inSpan(r, y)).sort((a, b) => (b.gm || 0) - (a.gm || 0)).slice(0, 5);
    const lost = []; GRAB.forEach(o => { if (o.e <= y && y - o.e <= 25 && fx(y) - fx(o.e) < .012 * FN && !ownerAt(o.c, y)) lost.push(o); });
    return '<div class="sd-k">Era ' + (k + 1) + " of " + ERAS.length + '</div><div class="sd-t">' + esc(era.name) + '</div><div class="sd-d">' + yr(Math.max(T0, era.start)) + " – " + (era.end >= NOW ? "now" : yr(era.end)) + '</div><p class="sd-p">' + esc(era.blurb) + "</p>"
      + (now.length ? '<div class="sd-k">Being taken now</div>' + now.slice(-8).reverse().map(g => row(g, "now")).join("") : "")
      + (lost.length ? '<div class="sd-k">Just lost</div><p class="hint lost">' + esc(list(Array.from(new Set(lost.map(o => o.c + " (" + PW[o.p].n.replace(/^The /, "") + ")"))).slice(0, 8))) + "</p>" : "")
      + (wars.length ? '<div class="sd-k">The wars being fought</div>' + wars.map(q => '<button class="rel" data-i="' + q.id + '" style="border-left-color:' + tone(q) + '">' + esc(q.n) + "<i>" + span(q) + (q.lo != null ? " · " + tollT(q) : "") + "</i></button>").join("") : "")
      + (next.length ? '<div class="sd-k">Coming</div>' + next.map(g => row(g)).join("") : "") + (prev.length ? '<div class="sd-k">Lately</div>' + prev.map(g => row(g)).join("") : "");
  }

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
      + "<h4>The Conquests</h4><p>A map of who held what: " + CQ.powers.length + " powers and " + GRAB.length + " holdings, painted on today's borders. It is a schematic. An empire that held half of a modern country shows the whole of it, hatched; the dates are the conventional ones, rounded; and only powers that held land beyond their own appear, so it is a map of empire and not of every state. It cites no source of its own: it sets the standard chronology on a map, and a row that is wrong is wrong by a date or a border. A conquest tied to a war in the Toll opens that war.</p>"
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
    return h + '<div class="sd-links">' + (st.v !== "land" && r.kind !== "proj" && r.kind !== "battle" ? '<button class="lnk" data-go="land">The land it changed ⟶</button>' : "") + (st.v !== "map" && ptsOf(r) ? '<button class="lnk" data-go="map">On the map ⟶</button>' : "") + (st.v !== "string" ? '<button class="lnk" data-go="string">On the string ⟶</button>' : "") + (prev ? '<button class="lnk" data-i="' + prev.id + '" title="' + esc(prev.n) + '">◂ before</button>' : "") + (next ? '<button class="lnk" data-i="' + next.id + '" title="' + esc(next.n) + '">after ▸</button>' : "") + "</div>";
  }
  function intro() {
    if (st.v === "map" && st.y != null) { const y = st.y, act = WARS.filter(r => inSpan(r, y)).sort((a, b) => (b.gm || 0) - (a.gm || 0)), bt = R.filter(r => r.kind === "battle" && inSpan(r, y));
      return '<div class="sd-k">In ' + yr(Math.round(y)) + "</div><p>" + (act.length ? act.length + (act.length === 1 ? " war" : " wars") + " of the record under way." : "No war of the record is under way: a gap in the record more than a peace.") + '</p><div class="dth"><div><span>Under way</span><b>' + act.length + "</b></div><div><span>Dead so far</span><b>~" + (deadBy(y) >= 10 ? Math.round(deadBy(y)) : deadBy(y).toFixed(1)) + "m</b></div></div>"
        + (act.length || bt.length ? '<div class="sd-k">Being fought</div>' + bt.concat(act).slice(0, 14).map(q => '<button class="rel" data-i="' + q.id + '" style="border-left-color:' + tone(q) + '">' + esc(q.n) + "<i>" + span(q) + (q.lo != null ? " · " + tollT(q) : "") + "</i></button>").join("") : ""); }
    const T = { map: ["THE MAP", "Every war the Archive knows, where it was fought. A disc is a front or a centre of the fighting, sized by the war's dead. Press Play and thirty-three centuries pass in about a minute: a war burns in its years and leaves an ember. Drag the year along the track under the map, or click a disc."], string: ["THE STRING", "Every war the Archive knows on one line of time, by the part of the world it was fought in. A bar's length is its years, its thickness its dead; the pale halo is the high estimate. The gold thread runs through them in the order they began. Click a war; stretch time with the buttons above."],
                toll: ["THE TOLL", "The wars ranked by their dead. The gap between the bright bar and the pale one is what is not known."],
                centuries: ["THE CENTURIES", "The same dead, century by century, with each century's deadliest war."], method: ["METHOD", "Where the rows come from and how far to trust a death toll."] }[st.v];
    return '<div class="sd-k">' + T[0] + "</div><p>" + T[1] + '</p><div class="dth"><div><span>Wars</span><b>' + WARS.length + "</b></div><div><span>Years covered</span><b>" + (Math.round(NOW) - R[0].a).toLocaleString("en") + "</b></div><div><span>Dead, sized wars</span><b>~" + Math.round(SIZED.reduce((a, r) => a + r.gm, 0)) + "m</b></div><div><span>Being fought now</span><b>" + R.filter(r => r.open && r.kind !== "proj").length + "</b></div></div>"
      + '<div class="sd-k">The deadliest</div>' + SIZED.slice(0, 7).map(q => '<button class="rel" data-i="' + q.id + '" style="border-left-color:' + tone(q) + '">' + esc(q.n) + "<i>" + span(q) + " · " + tollT(q) + "</i></button>").join("");
  }
  function renderSide() {
    const side = $("dc-side"), r = st.i && BY[st.i];
    if (!r && innerWidth <= 860 && !(st.v === "land" && (st.c || st.p))) { side.hidden = true; return; }
    const land = st.v === "land" && !r, keep = land && play.on ? side.scrollTop : 0;
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (r || land ? "" : " intro") + (land ? " tq-side" : "") + '">' + (r ? card(r) : land ? landSide() : intro()) + "</div>"; side.scrollTop = keep;
  }

  /* ---------------- boot ---------------- */
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read(); if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v; st.i = BY[q.i] ? q.i : null; st.z = [1, 2, 4].indexOf(+q.z) >= 0 ? +q.z : 1; st.f = q.f === "two" || q.f === "one" ? q.f : null; stop(); st.y = q.y != null && q.y !== "" && isFinite(+q.y) ? Math.max(T0, Math.min(NOW, +q.y)) : null;
    st.q = q.q != null && q.q !== "" && isFinite(+q.q) ? Math.max(T0, Math.min(NOW, +q.q)) : null; st.p = PW[q.p] ? q.p : null; st.c = q.c && HOLD[q.c] ? q.c : null; built.boot = 1; sync(true);
  }
  tabs = K.tabs(() => st.v, go);
  $("dc-side").addEventListener("click", e => { if (e.target.closest("a")) return; if (e.target.closest(".sd-x")) { if (st.i) st.i = null; else st.c = st.p = null; return sync(); }
    const gq = e.target.closest("[data-q]"); if (gq) { stop(); st.q = +gq.dataset.q; st.i = null; return sync(); }   /* a row in the panel is a year to go to */ const g = e.target.closest("[data-go]"); if (g) { st.v = g.dataset.go; const r = st.i && BY[st.i]; if (st.v === "map" && r) st.y = Math.min(NOW, (r.a + r.e) / 2); if (st.v === "land" && r) { st.q = Math.min(NOW, r.a + Math.min(3, (r.e - r.a) / 2)); st.c = st.p = null; } return sync(); } const b = e.target.closest("[data-i]"); if (b) { stop(); st.i = b.dataset.i; sync(); } });
  document.addEventListener("keydown", e => { if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Escape" && st.i) { st.i = null; return sync(); }
    if (e.key === "Escape" && st.v === "land" && (st.c || st.p)) { st.c = st.p = null; return sync(); }
    if (st.v === "land" && !st.i && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); return stepGrab(e.key === "ArrowRight" ? 1 : -1); }
    if (e.key === " " && (st.v === "map" || st.v === "land") && !e.target.closest("button, a, [role=tab]")) { e.preventDefault(); if (play.on) { stop(); sync(); } else start(); return; }
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d && st.i) { const n = R[BY[st.i].ix + d]; if (n) { st.i = n.id; sync(); } } });               /* ← → walk the string */
  K.finder($("dc-q"), q => R.filter(r => r.n.toLowerCase().indexOf(q) >= 0).slice(0, 12).map(r => ({ label: r.n, sub: span(r) + (r.lo != null ? " · " + tollT(r) : ""), id: r.id })), h => { if (st.v === "method") st.v = "map"; stop(); st.i = h.id; const r = BY[h.id]; if (st.v === "land" && r) st.q = Math.min(NOW, r.a + Math.min(3, (r.e - r.a) / 2)); sync(); });
  let rt = 0; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderSide(); render(); }, 140); });
  window.addEventListener("hashchange", applyHash);
  applyHash();
})();
