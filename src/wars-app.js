/* ============================================================
   ARCHIVUS — THE WAR ROOM (v8)
   ------------------------------------------------------------
   One date drives everything. Drag the scrubber (or press Play)
   and, for that day:
     · THE MAP     every country is coloured by its allegiance,
                   the fronts stand where they stood, offensives
                   draw themselves, battles light up
     · THE POWERS  the two coalitions face each other; a ribbon
                   chart shows who joined, switched or fell, when
     · THE LEADERS every country's monarch, government and
                   commanders, with the family, marriage,
                   alliance, succession and rivalry ties between
                   them drawn as threads
   plus THE CAMPAIGNS, THE COST and CAUSES & AFTERMATH.

   Data: src/data/wars-ww1.js, wars-ww2.js (schema in the first).
   Map:  assets/world2.js — modern countries on a 360×180 plane,
         x = lon + 180, y = 90 − lat. The SVG viewBox is stretched
         non-uniformly so each theatre is drawn at its own standard
         parallel (an equirectangular projection that doesn't
         smear Europe sideways); markers are counter-scaled so
         they stay round.
   Time: days since the Unix epoch (floats while playing).
   ============================================================ */
(function () {
  "use strict";
  const WARS = window.ARCHIVUS_WARS || {};
  const COUNTRIES = window.ARCHIVUS_COUNTRIES || [];
  const NS = "http://www.w3.org/2000/svg";
  const $ = id => document.getElementById(id);
  const DAY = 864e5;
  const day = iso => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / DAY;
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MON = MONTHS.map(m => m.slice(0, 3));
  const dObj = d => new Date(Math.round(d) * DAY);
  const fmtDate = d => { const x = dObj(d); return x.getUTCDate() + " " + MONTHS[x.getUTCMonth()] + " " + x.getUTCFullYear(); };
  const fmtShort = d => { const x = dObj(d); return x.getUTCDate() + " " + MON[x.getUTCMonth()] + " " + x.getUTCFullYear(); };
  const fmtMY = d => { const x = dObj(d); return MON[x.getUTCMonth()] + " " + x.getUTCFullYear(); };
  const isoOf = d => dObj(d).toISOString().slice(0, 10);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = n => n.toLocaleString("en-US");
  const big = n => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + " million" : num(n);
  function S(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function H(tag, cls, html, parent) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }

  const KIND = { battle: "Battle", siege: "Siege", naval: "Naval action", air: "Air campaign", diplo: "Diplomacy", atrocity: "Atrocity", revolt: "Revolt", end: "Ending" };
  const TIE = {
    family: ["Blood kin", "#e8c455"], marriage: ["Marriage", "#e58fb0"], ally: ["Partnership", "#5ec6b4"],
    succ: ["Succession", "#a8b0c4"], rival: ["Rivalry / enmity", "#ff6b52"], patron: ["Patron & client", "#b497f0"]
  };
  const ROLE = {
    crown: ["Crown / head of state", '<path d="M2 12.5h12M2.6 11l-1-6 3.6 3L8 3.4 10.8 8l3.6-3-1 6z"/>'],
    gov: ["Head of government", '<path d="M2.5 6L8 2.8 13.5 6M4 6.6v5M8 6.6v5M12 6.6v5M2.8 12.6h10.4"/>'],
    cmd: ["Commander", '<path d="M8 2l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.4l-3.7 2.1.8-4.2L2 6.4l4.2-.5z"/>'],
    fig: ["Other figure", '<circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/>']
  };
  const roleIcon = r => '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + ROLE[r][1] + "</svg>";
  /* power-level state codes → [label, chip class] */
  const PST = {
    A: ["at war", "st-A"], B: ["at war", "st-B"], N: ["neutral", "st-N"], pre: ["not yet in the war", "st-pre"],
    S: ["in pact with Germany", "st-S"], bn: ["aligned — not yet at war", "st-bn"], oB: ["occupied — fights on in exile", "st-oB"],
    D: ["defeated", "st-D"], X: ["out of the war", "st-X"], K: ["divided / fighting alone", "st-K"]
  };
  const hatch = (a, b, w) => "repeating-linear-gradient(135deg," + a + " 0 " + w + "px," + b + " " + w + "px 5px)";
  const LEG_BG = { "s-A": "#3c74b6", "s-a": "#223b5c", "s-oA": hatch("#4f8fd6", "#152233", 2), "s-B": "#b83826", "s-b": "#5f261f", "s-bn": hatch("#a8402f", "#1a2030", 1),
    "s-oB": hatch("#d2452f", "#2b1614", 2), "s-V": hatch("#c9953a", "#2b2415", 2), "s-K": hatch("#c93f2b", "#3c74b6", 2.5), "s-S": "#5d4f8c", "s-X": "#403c56",
    "s-D": hatch("#8a5750", "#211f27", 1), "s-I": "#2f6657", "s-N": "#1a2030" };
  const GROUP_OF = { "British Empire": "United Kingdom", "Russian Empire": "Russia", "German Empire": "Germany", "United Kingdom & Empire": "United Kingdom" };

  const state = {
    W: null, P: null, t: 0, playing: false, speed: 1, view: "map", sel: null, theater: null,
    layers: { fronts: true, moves: true, items: true, labels: true },
    vb: { x: 150, y: 20, w: 80, h: 40 }, phi: 50, kx: 1, ky: 1,
    kinds: new Set(Object.keys(TIE)), officeOnly: true, leader: null
  };

  /* ============================================================
     PREPARATION — turn a dataset into things that can be drawn
     ============================================================ */
  const FRONT_N = 140, RING_N = [26, 44, 70, 44, 76];
  function resample(xy, n) {
    const L = [0];
    for (let i = 1; i < xy.length; i++) L[i] = L[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
    const total = L[L.length - 1], out = [];
    if (!total) { for (let k = 0; k < n; k++) out.push(xy[0].slice()); return { pts: out, L, total }; }
    let j = 0;
    for (let k = 0; k < n; k++) {
      const d = total * k / (n - 1);
      while (j < xy.length - 2 && L[j + 1] < d) j++;
      const seg = L[j + 1] - L[j], a = seg ? (d - L[j]) / seg : 0;
      out.push([xy[j][0] + (xy[j + 1][0] - xy[j][0]) * a, xy[j][1] + (xy[j + 1][1] - xy[j][1]) * a]);
    }
    return { pts: out, L, total };
  }
  /* Catmull-Rom through the waypoints: offensives read as sweeps, not zig-zags */
  function curve(p) {
    if (p.length < 3) return resample(p, 24).pts;
    const out = [];
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      for (let s = 0; s < 14; s++) {
        const u = s / 14, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(k => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * u3)));
      }
    }
    out.push(p[p.length - 1].slice());
    return out;
  }
  function prep(W) {
    if (W._p) return W._p;
    const P = W._p = {};
    P.t0 = day(W.start); P.t1 = day(W.end); P.ws = day(W.warStart); P.we = day(W.warEnd);
    const X = lon => (lon < W.wrap ? lon + 360 : lon) + 180, Y = lat => 90 - lat;
    const xy = p => [X(p[1]), Y(p[0])];
    P.X = X; P.Y = Y;
    P.tl = {};
    W.countries.forEach(row => { const tl = row[0].map(e => ({ t: day(e[0]), c: e[1], n: e[2] || "" })); row.slice(1).forEach(n => { P.tl[n] = tl; }); });
    P.items = W.items.map(it => Object.assign({}, it, { ts: day(it.s), te: day(it.e || it.s), X: X(it.at[1]), Y: Y(it.at[0]) })).sort((a, b) => a.ts - b.ts);
    P.I = Object.fromEntries(P.items.map(i => [i.id, i]));
    P.phases = W.phases.map(p => Object.assign({}, p, { ts: day(p.s), te: day(p.e) }));
    P.moves = W.moves.map(m => {
      const pts = curve(m.p.map(xy)), cum = [0];
      for (let i = 1; i < pts.length; i++) cum[i] = cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      return { n: m.n, side: m.side, ts: day(m.s), te: day(m.e), pts, cum };
    });
    P.fronts = W.fronts.map(f => ({
      id: f.id, n: f.n, side: f.side, fill: !!f.fill, from: f.from ? day(f.from) : null, end: day(f.end),
      base: f.base ? f.base.map(xy) : null,
      keys: f.keys.map(k => {
        const r = resample(k.p.map(xy), FRONT_N);
        let f0 = 0, f1 = 1;
        if (k.fr) { f0 = r.total ? r.L[k.fr[0]] / r.total : 0; f1 = r.total ? r.L[k.fr[1]] / r.total : 0; }
        return { t: day(k.d), pts: r.pts, f0, f1 };
      })
    }));
    P.rings = (W.rings || []).map(r => ({
      n: r.n, end: day(r.end), occupy: r.occupy || [],
      keys: r.keys.map(k => ({ t: day(k.d), pts: [].concat.apply([], k.seg.map((s, i) => resample(s.map(xy), RING_N[i]).pts.slice(0, -1))) }))
    }));
    P.areas = (W.areas || []).map(a => {
      const pts = a.p.map(xy);
      return { n: a.n, l: (a.l != null ? a.l : a.n).toUpperCase(), side: a.side, ts: day(a.s), te: day(a.e), fade: a.fade || 14, d: "M" + pts.map(p => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z",
        cx: pts.reduce((s, p) => s + p[0], 0) / pts.length, cy: pts.reduce((s, p) => s + p[1], 0) / pts.length };
    });
    P.powers = W.powers.map(p => Object.assign({}, p, { segs: p.seg.map(s => ({ a: day(s[0]), b: s[1] ? day(s[1]) : Infinity, c: s[2], n: s[3] || "" })) }));
    P.leaders = W.leaders.map(l => Object.assign({}, l, { ts: day(l.s), te: l.e ? day(l.e) : Infinity }));
    P.L = Object.fromEntries(P.leaders.map(l => [l.id, l]));
    P.tiesOf = {};
    W.ties.forEach(t => { (P.tiesOf[t.a] = P.tiesOf[t.a] || []).push(t); (P.tiesOf[t.b] = P.tiesOf[t.b] || []).push(t); });
    return P;
  }
  const powerState = (p, t) => { for (const s of p.segs) if (t >= s.a && t < s.b) return s; return t < p.segs[0].a ? { c: "pre", n: "", a: -Infinity, b: p.segs[0].a } : p.segs[p.segs.length - 1]; };
  function statusAt(name, t) { const tl = state.P.tl[name]; if (!tl) return null; let cur = null; for (const e of tl) { if (e.t <= t) cur = e; else break; } return cur; }
  const phaseAt = t => { const ph = state.P.phases; for (let i = 0; i < ph.length; i++) if (t >= ph[i].ts && t < ph[i].te) return i; return t < ph[0].ts ? -1 : ph.length; };
  const inOffice = (l, t) => t >= l.ts && t <= l.te;

  /* ============================================================
     THE MAP — static scaffolding (built once)
     ============================================================ */
  const svg = $("map"), wrap = $("map-wrap"), tip = $("map-tip");
  const G = {}, cEls = {}, cCls = {}, cInfo = {};
  /* centroid + extent of each country's largest ring — where its name is engraved */
  function measureCountry(c) {
    let best = null;
    c.d.split("M").filter(Boolean).forEach(seg => {
      const r = seg.replace(/Z/g, "").split("L").map(p => p.trim().split(/[ ,]+/).map(Number));
      let a = 0, cx = 0, cy = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const f = r[j][0] * r[i][1] - r[i][0] * r[j][1];
        a += f; cx += (r[j][0] + r[i][0]) * f; cy += (r[j][1] + r[i][1]) * f;
        x0 = Math.min(x0, r[i][0]); x1 = Math.max(x1, r[i][0]); y0 = Math.min(y0, r[i][1]); y1 = Math.max(y1, r[i][1]);
      }
      if (Math.abs(a) > 1e-6 && (!best || Math.abs(a) > best.area)) best = { area: Math.abs(a) / 2, cx: cx / (3 * a), cy: cy / (3 * a), w: x1 - x0, h: y1 - y0 };
    });
    return best;
  }
  const PATTERNS = [["h-oA", "#152233", "#4f8fd6", 2.2], ["h-oB", "#2b1614", "#d2452f", 2.2], ["h-bn", "#1a2030", "#a8402f", 1.1],
    ["h-V", "#2b2415", "#c9953a", 2.0], ["h-K", "#3c74b6", "#c93f2b", 3.4], ["h-D", "#211f27", "#8a5750", 1.4]];
  const patEls = [];
  function buildMap() {
    svg.setAttribute("preserveAspectRatio", "none");
    const defs = S("defs", null, svg);
    PATTERNS.forEach(p => {
      const pe = S("pattern", { id: p[0], patternUnits: "userSpaceOnUse", width: 1, height: 1 }, defs);
      patEls.push({ pe, bg: S("rect", { fill: p[1] }, pe), ln: S("path", { stroke: p[2], fill: "none", style: "vector-effect:none" }, pe), sw: p[3] });
    });
    const clip = S("clipPath", { id: "land" }, defs);
    G.grat = S("g", null, svg);
    for (let lon = 0; lon <= 720; lon += 15) S("line", { class: "grat", x1: lon, y1: 0, x2: lon, y2: 180 }, G.grat);
    for (let lat = 0; lat <= 180; lat += 15) S("line", { class: "grat", x1: 0, y1: lat, x2: 720, y2: lat }, G.grat);
    G.c = S("g", null, svg);
    /* two copies of the world, 360° apart, so a view may straddle the antimeridian (the Pacific war) */
    [0, 360].forEach(dx => COUNTRIES.forEach(c => {
      const a = { class: "c", d: c.d, "data-n": c.n };
      if (dx) a.transform = "translate(360 0)";
      (cEls[c.n] = cEls[c.n] || []).push(S("path", a, G.c));
      if (!dx) cInfo[c.n] = measureCountry(c);
      const cp = S("path", { d: c.d }, clip);
      if (dx) cp.setAttribute("transform", "translate(360 0)");
    }));
    G.defs = defs;
    G.occ = S("g", { "clip-path": "url(#clip-occ)" }, svg);       /* land inside a perimeter that is occupied, not conquered whole (China) */
    G.ring = S("g", null, svg);
    G.zone = S("g", { "clip-path": "url(#land)" }, svg);
    G.front = S("g", null, svg);
    G.move = S("g", null, svg);
    G.item = S("g", null, svg);
    G.label = S("g", null, svg);
  }

  /* ---------- view: fit, pan, zoom ---------- */
  function sizePx() { return [Math.max(50, wrap.clientWidth), Math.max(50, wrap.clientHeight)]; }
  function fitBox(box, phi) {
    const [Wp, Hp] = sizePx(), c = Math.cos(phi * Math.PI / 180);
    const sy = Math.min(Hp / (box[3] - box[1]), Wp / ((box[2] - box[0]) * c));
    const h = Hp / sy, w = Wp / (sy * c);
    return { x: (box[0] + box[2]) / 2 + 180 - w / 2, y: 90 - (box[1] + box[3]) / 2 - h / 2, w, h };
  }
  function clampView(v) {
    const [Wp, Hp] = sizePx(), c = Math.cos(state.phi * Math.PI / 180);
    v.w = clamp(v.w, 2.2, 372);
    v.h = c * Hp * v.w / Wp;
    v.x = clamp(v.x, -12, 732 - v.w);
    v.y = v.h > 190 ? 90 - v.h / 2 : clamp(v.y, -8, 188 - v.h);
    return v;
  }
  let viewAnim = null;
  function applyView() {
    const v = state.vb, [Wp, Hp] = sizePx();
    svg.setAttribute("viewBox", v.x.toFixed(3) + " " + v.y.toFixed(3) + " " + v.w.toFixed(3) + " " + v.h.toFixed(3));
    state.kx = v.w / Wp; state.ky = v.h / Hp;
    const kx = state.kx, ky = state.ky, w = 7 * kx, h = 7 * ky;
    patEls.forEach(p => {
      p.pe.setAttribute("width", w); p.pe.setAttribute("height", h);
      p.bg.setAttribute("width", w); p.bg.setAttribute("height", h);
      p.ln.setAttribute("d", "M0 " + h + "L" + w + " 0M" + (-w / 2) + " " + (h / 2) + "L" + (w / 2) + " " + (-h / 2) + "M" + (w / 2) + " " + (h * 1.5) + "L" + (w * 1.5) + " " + (h / 2));
      p.ln.setAttribute("stroke-width", p.sw * Math.sqrt(kx * ky));
    });
    const sc = " scale(" + kx + " " + ky + ")";
    svg.querySelectorAll("[data-pin]").forEach(n => n.setAttribute("transform", "translate(" + n.dataset.x + " " + n.dataset.y + ")" + sc));
    draw();
  }
  function flyTo(target, phi, dur) {
    const from = Object.assign({}, state.vb), t0 = performance.now();
    state.phi = phi;
    const to = clampView(Object.assign({}, target));
    if (dur === 0) { state.vb = to; applyView(); return; }
    viewAnim = now => {
      const u = clamp((now - t0) / (dur || 700), 0, 1), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      ["x", "y", "w", "h"].forEach(k => { state.vb[k] = from[k] + (to[k] - from[k]) * e; });
      applyView();
      if (u >= 1) viewAnim = null;
    };
    kick();
  }
  function setTheater(id, dur) {
    const th = state.W.theaters.find(x => x.id === id) || state.W.theaters[0];
    state.theater = th.id;
    document.querySelectorAll("#theaters .chipbtn").forEach(b => b.classList.toggle("on", b.dataset.th === th.id));
    flyTo(fitBox(th.box, th.phi), th.phi, dur);
  }
  function zoomBy(f, px, py) {
    const v = state.vb, [Wp, Hp] = sizePx();
    const fx = px == null ? .5 : px / Wp, fy = py == null ? .5 : py / Hp;
    const cx = v.x + v.w * fx, cy = v.y + v.h * fy, nw = clamp(v.w * f, 2.2, 372), r = nw / v.w;
    state.vb = clampView({ x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r, w: nw, h: v.h * r });
    markFree(); applyView();
  }
  const markFree = () => { state.theater = null; document.querySelectorAll("#theaters .chipbtn").forEach(b => b.classList.remove("on")); };

  /* ============================================================
     THE MAP — per-war dynamic layers
     ============================================================ */
  let dyn = null;
  const SHAPES = {
    battle: '<path class="sh" d="M0-8L2.2-2.8 7.6-3.4 3.6 0.6 6.2 6 0 3.2-6.2 6-3.6 0.6-7.6-3.4-2.2-2.8z"/>',
    siege: '<rect class="sh" x="-5.5" y="-5.5" width="11" height="11" rx="1"/><rect x="-2" y="-2" width="4" height="4" fill="#07090e"/>',
    naval: '<path class="sh" d="M-7.5-2.5h15l-3.4 6.5h-8.2z"/><path d="M0-8v5.5" stroke="#07090e" stroke-width="1.6" fill="none"/>',
    air: '<path class="sh" d="M0-8L2.4-2.4 8 0 2.4 2.4 0 8-2.4 2.4-8 0-2.4-2.4z"/>',
    diplo: '<circle class="sh" r="6"/><circle r="2.3" fill="#07090e"/>',
    atrocity: '<rect class="sh" x="-5" y="-5" width="10" height="10" transform="rotate(45)"/>',
    revolt: '<path class="sh" d="M0 7.5L-6.5-4.5h13z"/>',
    end: '<path class="sh" d="M0-9L2.5-3.1 8.8-2.8 3.9 1.2 5.5 7.4 0 4-5.5 7.4-3.9 1.2-8.8-2.8-2.5-3.1z"/>'
  };
  function pin(g, x, y) { g.dataset.pin = "1"; g.dataset.x = x; g.dataset.y = y; return g; }
  function buildWarLayers() {
    const P = state.P;
    [G.occ, G.ring, G.zone, G.front, G.move, G.item, G.label].forEach(g => { while (g.firstChild) g.removeChild(g.firstChild); });
    const oldClip = document.getElementById("clip-occ"); if (oldClip) oldClip.remove();
    const occClip = S("clipPath", { id: "clip-occ" }, G.defs);
    (state.W.rings || []).forEach(r => (r.occupy || []).forEach(n => (cEls[n] || []).forEach(e => { const c = S("path", { d: e.getAttribute("d") }, occClip); if (e.getAttribute("transform")) c.setAttribute("transform", e.getAttribute("transform")); })));
    dyn = { fronts: [], rings: [], areas: [], moves: [], items: [], ctry: [] };
    const label = (cls, text, x, y) => { const g = pin(S("g", { style: "display:none" }, G.label), x, y); S("text", { class: "lbl " + cls }, g).textContent = text; return g; };
    /* country names, in the period's own terms ("OTTOMAN EMPIRE", not "Turkey"), biggest first */
    Object.keys(cInfo).filter(n => cInfo[n]).sort((a, b) => cInfo[b].area - cInfo[a].area).forEach(n => {
      const text = (state.W.alias[n] || n).split(" (")[0].split(" → ")[0].toUpperCase(), i = cInfo[n], X = P.X(i.cx - 180);
      dyn.ctry.push({ n, text, i, X, Y: i.cy, lab: label("ctry", text, X, i.cy) });
    });
    P.rings.forEach(r => dyn.rings.push({ r, el: S("path", { class: "ring" }, G.ring), occ: S("path", { class: "zone z-B" }, G.occ) }));
    P.areas.forEach(a => dyn.areas.push({ a, el: S("path", { class: "zone z-" + a.side, d: a.d }, G.zone), lab: label("area", a.l, a.cx, a.cy) }));
    P.fronts.forEach(f => {
      const o = { f };
      if (f.fill) { o.fill = S("path", { class: "zone z-" + f.side }, G.zone); o.edge = S("path", { class: "zone-edge" }, G.zone); }
      o.kase = S("path", { class: "front-case" }, G.front);
      o.line = S("path", { class: "front-line" }, G.front);
      dyn.fronts.push(o);
    });
    P.moves.forEach(m => {
      const g = S("g", { class: "mv-" + m.side, style: "display:none" }, G.move);
      const o = { m, g, kase: S("path", { class: "mv-case" }, g), line: S("path", { class: "mv-line" }, g) };
      o.headG = pin(S("g", null, g), 0, 0);
      o.head = S("path", { class: "mv-head", d: "M0 0L-12-5.2-9 0-12 5.2z" }, o.headG);
      o.lab = label("mv", m.n, 0, 0);
      dyn.moves.push(o);
    });
    P.items.forEach(it => {
      const g = pin(S("g", { class: "it k-" + it.k + " w-" + (it.w === "A" || it.w === "B" ? it.w : "0"), "data-i": it.id, style: "display:none" }, G.item), it.X, it.Y);
      g.innerHTML = '<g class="in"><circle class="halo" r="14"/><circle class="pulse" r="9"/>' + SHAPES[it.k] + "</g>";
      dyn.items.push({ it, g, inner: g.firstChild, lab: label("it", it.n, it.X, it.Y), st: "" });
    });
    for (const n in cCls) delete cCls[n];
  }

  const P2 = pts => pts.map(p => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L");
  function frontAt(f, t) {
    const K = f.keys;
    if (t < K[0].t || (f.from != null && t < f.from) || t > f.end) return null;
    let i = K.length - 1;
    for (let j = 0; j < K.length - 1; j++) if (t < K[j + 1].t) { i = j; break; }
    if (i === K.length - 1) return K[i];
    const a = (t - K[i].t) / (K[i + 1].t - K[i].t), A = K[i], B = K[i + 1];
    return { pts: A.pts.map((p, k) => [p[0] + (B.pts[k][0] - p[0]) * a, p[1] + (B.pts[k][1] - p[1]) * a]), f0: A.f0 + (B.f0 - A.f0) * a, f1: A.f1 + (B.f1 - A.f1) * a };
  }
  function ringAt(r, t) {
    const K = r.keys;
    if (t < K[0].t || t > r.end) return null;
    let i = K.length - 1;
    for (let j = 0; j < K.length - 1; j++) if (t < K[j + 1].t) { i = j; break; }
    if (i === K.length - 1) return K[i].pts;
    const a = (t - K[i].t) / (K[i + 1].t - K[i].t), A = K[i].pts, B = K[i + 1].pts;
    return A.map((p, k) => [p[0] + (B[k][0] - p[0]) * a, p[1] + (B[k][1] - p[1]) * a]);
  }

  /* ---------- the frame ---------- */
  let lastSig = "", lastDay = null, lastOob = "";
  function draw() {
    if (!dyn || state.view !== "map") return;
    const P = state.P, W = state.W, t = state.t, kx = state.kx, ky = state.ky, v = state.vb, L = state.layers;
    const [Wp, Hp] = sizePx();

    /* 1 — allegiance */
    for (const n in cEls) {
      const s = statusAt(n, t), cls = "c " + (s ? W.status[s.c][2] : "s-N") + (state.sel && state.sel.type === "country" && state.sel.id === n ? " sel" : "");
      if (cCls[n] !== cls) { cCls[n] = cls; cEls[n].forEach(e => e.setAttribute("class", cls)); }
    }

    /* 2 — occupied zones, the perimeter, the fronts */
    G.zone.style.display = G.ring.style.display = G.occ.style.display = G.front.style.display = L.fronts ? "" : "none";
    if (L.fronts) {
      dyn.rings.forEach(o => {
        const pts = ringAt(o.r, t);
        o.el.style.display = o.occ.style.display = pts ? "" : "none";
        if (pts) { const d = "M" + P2(pts) + "Z", op = clamp((o.r.end - t) / 16, 0, 1); o.el.setAttribute("d", d); o.occ.setAttribute("d", d); o.el.style.opacity = op; o.occ.style.opacity = op * .96; }
      });
      dyn.areas.forEach(o => {
        const a = o.a, op = t < a.ts || t > a.te + 10 ? 0 : Math.min(clamp((t - a.ts) / a.fade, 0, 1), clamp((a.te + 10 - t) / 10, 0, 1));
        o.el.style.display = op > 0 ? "" : "none";
        o.el.style.opacity = op * .96;
        o.op = op;
      });
      dyn.fronts.forEach(o => {
        const f = o.f, cur = frontAt(f, t), fade = cur ? clamp((f.end - t) / 14, 0, 1) : 0;
        [o.fill, o.edge, o.kase, o.line].forEach(e => { if (e) e.style.display = cur ? "" : "none"; });
        if (!cur) return;
        if (o.fill) {
          const d = "M" + P2(cur.pts) + "L" + P2(f.base.slice().reverse()) + "Z";
          o.fill.setAttribute("d", d); o.edge.setAttribute("d", d);
          o.fill.style.opacity = .96 * fade; o.edge.style.opacity = .5 * fade;
        }
        const i0 = Math.floor(cur.f0 * (FRONT_N - 1)), i1 = Math.ceil(cur.f1 * (FRONT_N - 1));
        if (i1 - i0 < 2) { o.kase.style.display = o.line.style.display = "none"; return; }
        const d = "M" + P2(cur.pts.slice(i0, i1 + 1));
        o.kase.setAttribute("d", d); o.line.setAttribute("d", d);
        o.kase.style.opacity = .85 * fade; o.line.style.opacity = fade;
      });
    }

    /* 3 — labels compete for space: heaviest first, no overlaps */
    const placed = [];
    const sx = X => (X - v.x) / kx, sy = Y => (Y - v.y) / ky;
    function place(g, X, Y, text, dx, dy, force, cw) {
      if (!L.labels && !force) { g.style.display = "none"; return false; }
      const x = sx(X) + dx, y = sy(Y) + dy, w = text.length * (cw || 6.1) + 6;
      const box = [x - 2, y - 11, x + w, y + 4];
      if (!force && (x < 4 || box[2] > Wp - 4 || y < 14 || y > Hp - 6 || placed.some(b => b[0] < box[2] && b[2] > box[0] && b[1] < box[3] && b[3] > box[1]))) { g.style.display = "none"; return false; }
      placed.push(box);
      g.style.display = "";
      g.dataset.x = X; g.dataset.y = Y;
      g.setAttribute("transform", "translate(" + X + " " + Y + ") scale(" + kx + " " + ky + ")");
      g.firstChild.setAttribute("x", dx); g.firstChild.setAttribute("y", dy);
      return true;
    }
    /* keep the plates' corners clear */
    document.querySelectorAll("#date-plate, #theaters, #map-tools").forEach(n => { const r = n.getBoundingClientRect(), w0 = wrap.getBoundingClientRect(); placed.push([r.left - w0.left - 6, r.top - w0.top - 6, r.right - w0.left + 6, r.bottom - w0.top + 6]); });

    /* 4 — battles and turning points */
    G.item.style.display = L.items ? "" : "none";
    const live = [];
    dyn.items.forEach(o => {
      const it = o.it, sel = state.sel && state.sel.type === "item" && state.sel.id === it.id;
      const st = t < it.ts - .5 ? "" : t <= Math.max(it.te, it.ts + 24) ? "live" : "past";
      const key = st + (sel ? "+" : "");
      if (o.st !== key) {
        o.st = key;
        o.g.style.display = st ? "" : "none";
        o.g.setAttribute("class", "it k-" + it.k + " w-" + (it.w === "A" || it.w === "B" ? it.w : "0") + " " + st + (sel ? " sel" : ""));
        o.inner.setAttribute("transform", st === "past" && !sel ? "scale(.72)" : "scale(1.2)");
      }
      o.lab.style.display = "none";
      if (st === "live" || sel) live.push(o);
    });
    if (L.items) {
      live.sort((a, b) => ((state.sel && state.sel.id === b.it.id) - (state.sel && state.sel.id === a.it.id)) || (((b.it.ar || [6])[0] + (b.it.k === "end" ? 3 : 0)) - ((a.it.ar || [6])[0] + (a.it.k === "end" ? 3 : 0))));
      live.forEach(o => place(o.lab, o.it.X, o.it.Y, o.it.n, 11, 4, state.sel && state.sel.id === o.it.id));
    }
    dyn.areas.forEach(o => { if (L.fronts && o.op > .5 && o.a.l) place(o.lab, o.a.cx, o.a.cy, o.a.l, -o.a.l.length * 3.3, 3, false, 6.7); else o.lab.style.display = "none"; });
    /* country names: only where the country is big enough on screen to carry its name, each name once */
    const named = new Set();
    dyn.ctry.forEach(o => {
      const tw = o.text.length * 6.7 + 4;
      if (named.has(o.text) || o.X < v.x || o.X > v.x + v.w || o.Y < v.y || o.Y > v.y + v.h || o.i.w / kx < tw * .8 || o.i.h / ky < 15) { o.lab.style.display = "none"; return; }
      if (place(o.lab, o.X, o.Y, o.text, -tw / 2, 3, false, 6.7)) named.add(o.text);
    });

    /* 5 — offensives draw themselves */
    G.move.style.display = L.moves ? "" : "none";
    dyn.moves.forEach(o => {
      const m = o.m, LINGER = 34, on = L.moves && t >= m.ts && t <= m.te + LINGER;
      o.g.style.display = on ? "" : "none";
      if (!on) { o.lab.style.display = "none"; return; }
      const p = clamp((t - m.ts) / Math.max(1, m.te - m.ts), .05, 1), total = m.cum[m.cum.length - 1], d = total * p;
      let i = 1; while (i < m.cum.length - 1 && m.cum[i] < d) i++;
      const a = (d - m.cum[i - 1]) / Math.max(1e-9, m.cum[i] - m.cum[i - 1]);
      const tipX = m.pts[i - 1][0] + (m.pts[i][0] - m.pts[i - 1][0]) * a, tipY = m.pts[i - 1][1] + (m.pts[i][1] - m.pts[i - 1][1]) * a;
      const path = "M" + P2(m.pts.slice(0, i)) + "L" + tipX.toFixed(2) + " " + tipY.toFixed(2);
      o.kase.setAttribute("d", path); o.line.setAttribute("d", path);
      const j = Math.max(0, i - 3), ang = Math.atan2((tipY - m.pts[j][1]) / ky, (tipX - m.pts[j][0]) / kx) * 180 / Math.PI;
      o.headG.dataset.x = tipX; o.headG.dataset.y = tipY;
      o.headG.setAttribute("transform", "translate(" + tipX + " " + tipY + ") scale(" + kx + " " + ky + ")");
      o.head.setAttribute("transform", "rotate(" + ang.toFixed(1) + ")");
      o.g.style.opacity = t > m.te ? clamp(1 - (t - m.te) / LINGER, 0, 1) : 1;
      if (t <= m.te + 8) place(o.lab, tipX, tipY, m.n, 12, -8); else o.lab.style.display = "none";
    });

    /* 6 — chrome that follows the date */
    const d0 = Math.floor(t);
    if (d0 !== lastDay) {
      lastDay = d0;
      $("dp-date").textContent = fmtDate(t).toUpperCase();
      const pi = phaseAt(t);
      $("dp-phase").textContent = pi < 0 ? "Before the storm" : pi >= P.phases.length ? "Aftermath" : P.phases[pi].n;
      $("dp-day").textContent = t < P.ws ? Math.ceil(P.ws - t) + " days before the war" : t > P.we ? Math.floor(t - P.we) + " days after the war's end" : "day " + num(Math.floor(t - P.ws) + 1) + " of " + num(Math.round(P.we - P.ws) + 1);
    }
    updateOob();
    const sig = phaseAt(t) + "|" + live.map(o => o.it.id).join(",") + "|" + (state.sel ? state.sel.type + state.sel.id : "") + "|" + (state.sel && state.sel.type === "country" ? (statusAt(state.sel.id, t) || {}).t : "");
    if (sig !== lastSig) { lastSig = sig; renderSide(); }
  }

  /* ---------- order of battle strip ---------- */
  function buildOob() {
    const W = state.W, P = state.P, box = $("oob");
    box.innerHTML = "";
    ["A", "B"].forEach(side => {
      if (side === "B") H("div", "oob-vs", "vs", box);
      const row = H("div", "oob-row " + side, '<div class="oob-h side' + side + '">' + esc(W.sides[side].short.toUpperCase()) + '<small id="oob-n-' + side + '"></small></div>', box);
      const chips = H("div", "oob-chips", null, row);
      P.powers.filter(p => p.side === side).forEach(p => { const c = H("span", "pc", esc(shortName(p.n)), chips); c.dataset.p = p.id; c.title = p.n; });
    });
    lastOob = "";
  }
  const SHORT = { "United Kingdom & Empire": "Britain", "British Empire": "Britain", "Russian Empire": "Russia", "German Empire": "Germany", "United States": "USA", "Soviet Union": "USSR",
    "Canada · Australia · New Zealand · South Africa · India": "Commonwealth", "Norway · Netherlands · Belgium": "Norway · Low Countries" };
  const shortName = n => SHORT[n] || n;
  function updateOob() {
    const P = state.P, t = state.t;
    const st = P.powers.map(p => powerState(p, t).c), sig = st.join("");
    if (sig === lastOob) return;
    lastOob = sig;
    const count = { A: 0, B: 0 };
    P.powers.forEach((p, i) => {
      const c = st[i], chip = document.querySelector('.pc[data-p="' + p.id + '"]');
      if (c === "A" || c === "B") count[c]++;
      if (!chip) return;
      chip.className = "pc " + PST[c][1] + ((c === "A" || c === "B") && c !== p.side ? " flip" : "");
      chip.title = p.n + " — " + (c === "A" || c === "B" ? (c !== p.side ? "changed sides: now with the " + state.W.sides[c].short : "at war") : PST[c][0]);
    });
    ["A", "B"].forEach(s => { const n = $("oob-n-" + s); if (n) n.textContent = count[s] + " at war"; });
  }

  /* ---------- side panel: the record, then the day's dispatch ---------- */
  function archiveLink(it) { const id = it.ref || (it.ar ? it.id : null); return id ? '<a href="index.html#e=' + id + '&v=chronicle">Open in the Chronicle ⟶</a>' : ""; }
  function itemCard(it) {
    const W = state.W, when = it.te > it.ts ? fmtDate(it.ts) + " – " + fmtDate(it.te) : fmtDate(it.ts);
    const win = it.w === "A" || it.w === "B" ? '<span class="tag ' + it.w + '">' + esc(W.sides[it.w].short) + " victory</span>" : it.w ? '<span class="tag G">Indecisive</span>' : "";
    return '<div class="sd-k">' + KIND[it.k] + '</div><div class="sd-t">' + esc(it.n) + '</div><div class="sd-d">' + when + (it.te > it.ts ? " · " + num(Math.round(it.te - it.ts) + 1) + " days" : "") + "</div>" +
      (win ? "<div>" + win + "</div>" : "") + '<p class="sd-p">' + esc(it.d) + "</p>" + (it.f ? '<div class="sd-f">' + esc(it.f) + "</div>" : "") +
      '<div class="sd-links"><a href="' + it.u + '" target="_blank" rel="noopener">Source ↗</a>' + archiveLink(it) + "</div>";
  }
  function countryCard(name) {
    const W = state.W, P = state.P, tl = P.tl[name], cur = statusAt(name, state.t), alias = W.alias[name];
    let h = '<div class="sd-k">Country</div><div class="sd-t">' + esc(alias || name) + "</div>" + (alias && alias !== name ? '<div class="sd-d">today: ' + esc(name) + "</div>" : "");
    if (!tl) return h + '<p class="sd-p">Neutral throughout the war.</p>';
    h += '<div><span class="tag ' + (W.status[(cur || { c: "N" }).c][1] || "") + '">' + esc(cur ? W.status[cur.c][0] : "Not yet involved") + '</span></div><ul class="tl-list">';
    tl.forEach(e => { h += '<li class="' + (e === cur ? "now" : "") + '"><span class="d">' + fmtDate(e.t) + " · " + esc(W.status[e.c][0]) + "</span>" + esc(e.n) + "</li>"; });
    return h + "</ul>";
  }
  const evRow = (it, cls) => '<button class="ev-row ' + (it.w === "A" || it.w === "B" ? it.w : "") + " " + (cls || "") + '" data-i="' + it.id + '"><span class="d">' + fmtShort(it.ts) + "</span><span>" + esc(it.n) + "</span></button>";
  function renderSide() {
    const P = state.P, t = state.t, side = $("side");
    let h = "";
    if (state.sel) h += '<div class="sd-rec"><button class="sd-x" id="sd-x" title="Close (Esc)">×</button>' + (state.sel.type === "item" ? itemCard(P.I[state.sel.id]) : countryCard(state.sel.id)) + "</div>";
    const pi = phaseAt(t), ph = P.phases[clamp(pi, 0, P.phases.length - 1)];
    h += '<div class="sd-k">' + (pi < 0 ? "Prelude" : pi >= P.phases.length ? "Epilogue" : "Phase " + (pi + 1) + " of " + P.phases.length) + '</div><div class="sd-t">' + esc(ph.n) + '</div><div class="sd-d">' + fmtShort(ph.ts) + " – " + fmtShort(ph.te) + '</div><p class="sd-p">' + esc(ph.d) + "</p>";
    const liveNow = P.items.filter(i => t >= i.ts - .5 && t <= Math.max(i.te, i.ts + 24));
    const past = P.items.filter(i => Math.max(i.te, i.ts + 24) < t).slice(-4).reverse();
    const next = P.items.filter(i => i.ts - .5 > t).slice(0, 3);
    if (liveNow.length) h += '<div class="sd-k">On the table now</div>' + liveNow.map(i => evRow(i, "live")).join("");
    if (next.length) h += '<div class="sd-k">Coming</div>' + next.map(i => evRow(i)).join("");
    if (past.length) h += '<div class="sd-k">Lately</div>' + past.map(i => evRow(i)).join("");
    h += '<p class="wr-note" style="margin-top:18px">' + esc(state.W.mapNote) + "</p>";
    side.innerHTML = h;
    side.scrollTop = state.sel ? 0 : side.scrollTop;
  }
  function select(sel, opts) {
    state.sel = sel; lastSig = "";
    if (sel && sel.type === "item" && opts && opts.jump) {
      const it = state.P.I[sel.id];
      setT(Math.min(it.te, it.ts + 2) + .01, true);
      /* fly to the tightest theatre that holds the place (the world, if none does) */
      const lon = it.X - 180, inBox = x => lon >= x.box[0] + 1 && lon <= x.box[2] - 1 && it.at[0] >= x.box[1] + 1 && it.at[0] <= x.box[3] - 1;
      const area = x => (x.box[2] - x.box[0]) * (x.box[3] - x.box[1]);
      const th = state.W.theaters.filter(x => x.id !== "world" && inBox(x)).sort((a, b) => area(a) - area(b))[0];
      if (!opts.keepView) setTheater((th || state.W.theaters[0]).id, 700);
    }
    draw(); pushHash();
  }

  /* ============================================================
     TIME
     ============================================================ */
  let raf = 0, lastNow = 0, lastMonth = "";
  function kick() { if (!raf) { lastNow = performance.now(); raf = requestAnimationFrame(tick); } }
  function tick(now) {
    raf = 0;
    const dt = Math.min(80, now - lastNow); lastNow = now;
    if (state.playing) {
      state.t += dt / 1000 * 30 * state.speed;                       /* 1× = one month per second */
      if (state.t >= state.P.t1) { state.t = state.P.t1; setPlaying(false); }
      afterTime();
    }
    if (viewAnim) viewAnim(now);
    if (state.playing || viewAnim) kick();
  }
  function afterTime() {
    drawCursor(); draw();
    const m = fmtMY(state.t);
    if (m !== lastMonth || !state.playing) { lastMonth = m; if (state.view === "powers") updatePowers(); if (state.view === "leaders") updateLeaders(); if (state.view === "campaigns") updateCampaigns(); }
  }
  function setT(t, quiet) { state.t = clamp(t, state.P.t0, state.P.t1); afterTime(); if (!quiet) pushHash(); }
  function setPlaying(on) {
    state.playing = on;
    $("sc-play").textContent = on ? "❚❚ Pause" : "▶ Play";
    $("play-cta").hidden = true;
    if (on) { if (state.t >= state.P.t1 - 1) state.t = state.P.ws - 20; kick(); } else pushHash();
  }
  const stepMonth = dir => { const x = dObj(state.t); setT(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + dir, Math.min(x.getUTCDate(), 28)) / DAY); };

  /* ---------- the scrubber ---------- */
  const tl = $("tl");
  let tlW = 800, cur = null;
  const tx = t => 6 + (t - state.P.t0) / (state.P.t1 - state.P.t0) * (tlW - 12);
  function buildTimeline() {
    const P = state.P;
    tlW = Math.max(200, tl.clientWidth);
    tl.setAttribute("viewBox", "0 0 " + tlW + " 50");
    tl.innerHTML = "";
    P.phases.forEach((p, i) => {
      const g = S("g", { class: "tl-ph", "data-ph": i }, tl), x0 = tx(p.ts), x1 = tx(p.te);
      S("rect", { x: x0, y: 2, width: Math.max(1, x1 - x0), height: 17 }, g);
      const fits = n => n.length * 6.3 + 8 < x1 - x0;
      const short = p.n.split(/ — |: | and | & /)[0];
      const txt = fits(p.n) ? p.n : fits(short) ? short : "";
      if (txt) S("text", { x: (x0 + x1) / 2, y: 14, "text-anchor": "middle" }, g).textContent = txt;
      S("title", null, g).textContent = p.n + " — " + fmtShort(p.ts) + " to " + fmtShort(p.te);
    });
    S("line", { class: "tl-tick", x1: 6, y1: 32, x2: tlW - 6, y2: 32 }, tl);
    for (let y = dObj(P.t0).getUTCFullYear(); y <= dObj(P.t1).getUTCFullYear(); y++) {
      const t = Date.UTC(y, 0, 1) / DAY;
      if (t < P.t0 || t > P.t1) continue;
      S("line", { class: "tl-tick", x1: tx(t), y1: 20, x2: tx(t), y2: 36 }, tl);
      S("text", { class: "tl-yr", x: tx(t) + 4, y: 46 }, tl).textContent = y;
    }
    P.items.forEach(it => {
      const c = it.k === "diplo" || it.k === "atrocity" ? "#e6e1d3" : it.w === "A" ? "#8fc0ff" : it.w === "B" ? "#ff8a73" : "#e8c455";
      const r = S("rect", { x: tx(it.ts) - 1, y: 23, width: Math.max(2, tx(it.te) - tx(it.ts)), height: 7, fill: c, opacity: .8, rx: 1 }, tl);
      S("title", null, r).textContent = it.n + " — " + fmtShort(it.ts);
    });
    [P.ws, P.we].forEach(t => S("line", { x1: tx(t), y1: 19, x2: tx(t), y2: 38, stroke: "#c9a227", "stroke-width": 1, "stroke-dasharray": "2 2" }, tl));
    cur = S("g", { class: "tl-cur" }, tl);
    S("line", { x1: 0, y1: 0, x2: 0, y2: 40 }, cur);
    S("path", { d: "M-5 0h10l-5 7z" }, cur);
    drawCursor();
  }
  function drawCursor() {
    if (!cur) return;
    cur.setAttribute("transform", "translate(" + tx(state.t).toFixed(1) + " 0)");
    const pi = phaseAt(state.t);
    tl.querySelectorAll(".tl-ph").forEach((g, i) => g.classList.toggle("on", i === pi));
    tl.setAttribute("aria-valuetext", fmtDate(state.t));
  }
  function scrubTo(e) {
    const r = tl.getBoundingClientRect(), P = state.P;
    setT(P.t0 + clamp((e.clientX - r.left - 6) / (r.width - 12), 0, 1) * (P.t1 - P.t0), true);
  }

  /* ============================================================
     THE POWERS
     ============================================================ */
  function leadersOf(p) {
    const g = GROUP_OF[p.n] || p.n;
    return state.P.leaders.filter(l => l.c === g && l.r !== "fig").slice(0, 6);
  }
  function buildPowers() {
    const W = state.W, P = state.P, box = $("v-powers");
    const maxMob = Math.max.apply(null, P.powers.map(p => p.mob || 0)), maxTot = Math.max.apply(null, P.powers.map(p => mid(p.tot) || mid(p.mil) || 0));
    let h = '<h2 class="wr-h">Who fought whom — and when</h2><p class="wr-sub">The two coalitions as they stood on <b id="pw-date" style="color:var(--gold-bright)"></b>. Move the date and watch the camps assemble, change, and collapse: cards fade until a power is at war, and a gold outline marks one that has changed sides.</p><div class="pw-face">';
    ["A", "B"].forEach(side => {
      h += '<div class="pw-col ' + side + '"><h3>' + esc(W.sides[side].name) + '<small id="pw-n-' + side + '"></small></h3>';
      P.powers.filter(p => p.side === side).forEach(p => {
        const first = p.segs.find(s => s.c === side) || p.segs[0], ld = leadersOf(p);
        let bars = "";
        if (p.mob) bars = '<div class="pw-bars"><span>mobilized</span><div class="bar"><i style="width:' + (p.mob / maxMob * 100).toFixed(1) + '%;opacity:.45"></i></div><span>' + big(p.mob) + '</span><span>killed</span><div class="bar"><i style="width:' + (p.dead / maxMob * 100).toFixed(1) + '%"></i></div><span>' + num(p.dead) + "</span></div>";
        else if (p.tot || p.mil) bars = '<div class="pw-bars">' + (p.tot ? '<span>all deaths</span><div class="bar"><i style="width:' + (mid(p.tot) / maxTot * 100).toFixed(1) + '%;opacity:.45"></i></div><span>' + rng(p.tot) + "</span>" : "") +
          (p.mil ? '<span>military</span><div class="bar"><i style="width:' + (mid(p.mil) / maxTot * 100).toFixed(1) + '%"></i></div><span>' + rng(p.mil) + "</span>" : "") + "</div>";
        h += '<div class="pw-card' + (p.major ? " major" : "") + '" data-p="' + p.id + '"><div class="pw-top"><span class="pw-n">' + esc(p.n) + '</span><span class="pw-st pc"></span></div>' +
          '<div class="pw-when">' + p.segs.map(s => (s.a <= P.t0 ? "Before the war" : fmtShort(s.a)) + " — " + esc(segLabel(s, p))).join("<br>") + "</div>" +
          '<div class="pw-note">' + esc(p.note) + "</div>" +
          (ld.length ? '<div class="pw-lead">' + ld.map(l => '<b data-l="' + l.id + '">' + esc(l.n) + "</b>").join(" · ") + "</div>" : "") + bars + "</div>";
      });
      h += "</div>";
    });
    h += '</div><h2 class="wr-h" style="margin-top:26px">The ribbon of belligerence</h2><p class="wr-sub">Every power across the whole war. Colour is allegiance; a change of colour is a change of fortune. Click anywhere to move the date.</p><svg id="ribbon"></svg>' +
      '<div class="rb-key">' + [["A", W.sides.A.short + " — at war"], ["B", W.sides.B.short + " — at war"], ["bn", "aligned, not yet at war"], ["S", "pact with Germany"], ["oB", "occupied — fights on"], ["K", "divided / alone"], ["X", "out of the war"], ["D", "defeated"], ["N", "neutral"]]
        .filter(k => P.powers.some(p => p.segs.some(s => s.c === k[0]))).map(k => '<span class="pc ' + PST[k[0]][1] + '">' + esc(k[1]) + "</span>").join("") + "</div>" +
      '<p class="wr-note" style="margin-top:14px">Figures: ' + W.cost.src.map(s => '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.n) + "</a>").join(" · ") + "</p>";
    box.innerHTML = h;
    buildRibbon();
    updatePowers();
  }
  const mid = v => Array.isArray(v) ? (v[0] + v[1]) / 2 : v;
  const rng = v => Array.isArray(v) ? big(v[0]).replace(" million", "") + "–" + big(v[1]) : big(v);
  const segLabel = (s, p) => (s.c === "A" || s.c === "B" ? (s.c !== p.side ? "joins the " + state.W.sides[s.c].short : "at war") : PST[s.c][0]) + (s.n ? ": " + s.n : "");
  const RBC = { A: "#3c74b6", B: "#b83826", N: "#232a3a", S: "#5d4f8c", bn: "url(#rb-bn)", oB: "url(#rb-oB)", D: "#3a3038", X: "#403c56", K: "url(#rb-K)", pre: "none" };
  let rbX = null;
  function buildRibbon() {
    const P = state.P, sv = $("ribbon"), W = Math.max(520, sv.clientWidth || 900), ROW = 24, LEFT = Math.min(250, W * .28), rows = P.powers;
    const Hh = 26 + rows.length * ROW + 6;
    sv.setAttribute("viewBox", "0 0 " + W + " " + Hh); sv.style.height = Hh + "px";
    sv.innerHTML = '<defs><pattern id="rb-oB" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#2b1614"/><rect width="3" height="6" fill="#8e3a2e"/></pattern>' +
      '<pattern id="rb-bn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#232a3a"/><rect width="1.4" height="6" fill="#a8402f"/></pattern>' +
      '<pattern id="rb-K" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#3c74b6"/><rect width="4" height="8" fill="#b83826"/></pattern></defs>';
    const x = t => LEFT + (clamp(t, P.t0, P.t1) - P.t0) / (P.t1 - P.t0) * (W - LEFT - 8);
    rbX = { x, LEFT, W };
    for (let y = dObj(P.t0).getUTCFullYear() + 1; y <= dObj(P.t1).getUTCFullYear(); y++) {
      const t = Date.UTC(y, 0, 1) / DAY;
      S("line", { class: "rb-grid", x1: x(t), y1: 16, x2: x(t), y2: Hh }, sv);
      S("text", { class: "rb-yr", x: x(t) + 3, y: 12 }, sv).textContent = y;
    }
    rows.forEach((p, i) => {
      const y = 24 + i * ROW;
      S("text", { class: "rb-name", x: LEFT - 10, y: y + 13, "text-anchor": "end", fill: p.side === "A" ? "#8fc0ff" : "#ff8a73" }, sv).textContent = p.n.length > 34 ? shortName(p.n) : p.n;
      p.segs.forEach(s => {
        const x0 = x(Math.max(s.a, P.t0)), x1 = x(Math.min(s.b, P.t1));
        if (x1 - x0 < .5) return;
        const r = S("rect", { x: x0, y: y, width: x1 - x0, height: ROW - 6, fill: RBC[s.c], stroke: "#0a0c12", "stroke-width": 1, rx: 2 }, sv);
        S("title", null, r).textContent = p.n + " · " + fmtShort(Math.max(s.a, P.t0)) + " → " + (s.b === Infinity ? "end" : fmtShort(s.b)) + " · " + segLabel(s, p);
      });
    });
    S("line", { class: "rb-cur", id: "rb-cur", x1: 0, y1: 14, x2: 0, y2: Hh }, sv);
  }
  function updatePowers() {
    const P = state.P, t = state.t, d = $("pw-date");
    if (!d) return;
    d.textContent = fmtDate(t);
    const count = { A: 0, B: 0 };
    P.powers.forEach(p => {
      const s = powerState(p, t), card = document.querySelector('.pw-card[data-p="' + p.id + '"]');
      if (s.c === "A" || s.c === "B") count[s.c]++;
      if (!card) return;
      card.classList.toggle("dim", !(s.c === "A" || s.c === "B" || s.c === "oB" || s.c === "K"));
      const tag = card.querySelector(".pw-st"), flip = (s.c === "A" || s.c === "B") && s.c !== p.side;
      tag.className = "pw-st pc " + PST[s.c][1] + (flip ? " flip" : "");
      tag.textContent = flip ? "changed sides → " + state.W.sides[s.c].short : PST[s.c][0];
    });
    ["A", "B"].forEach(s => { const n = $("pw-n-" + s); if (n) n.textContent = count[s] + " at war"; });
    const c = $("rb-cur");
    if (c && rbX) { c.setAttribute("x1", rbX.x(t)); c.setAttribute("x2", rbX.x(t)); }
  }

  /* ============================================================
     THE LEADERS — courts, cabinets, commands, and the threads between
     ============================================================ */
  function buildLeaders() {
    const W = state.W, P = state.P;
    $("ld-top").innerHTML = '<span class="lab">Threads</span>' + Object.keys(TIE).map(k => '<button class="chipbtn on tk" data-k="' + k + '"><i style="border-color:' + TIE[k][1] + (k === "marriage" ? ";border-top-style:dotted" : k === "rival" || k === "succ" || k === "patron" ? ";border-top-style:dashed" : "") + '"></i>' + TIE[k][0] + "</button>").join("") +
      '<span class="lab" style="margin-left:10px">Show</span><button class="chipbtn on" id="ld-office" title="Dim everyone not in office on the scrubber date">In office on <b id="ld-date"></b></button>' +
      '<span class="lab" style="margin-left:10px">' + Object.keys(ROLE).map(r => '<span class="tk" style="margin-right:9px;color:#8792ad;letter-spacing:.04em;text-transform:none">' + roleIcon(r) + ROLE[r][0] + "</span>").join("") + "</span>";
    const grid = $("ld-grid");
    grid.innerHTML = "";
    [["A", W.sides.A.name], ["N", "Neutral & in between"], ["B", W.sides.B.name]].forEach(z => {
      const zone = H("div", "ld-zone " + z[0], "<h3>" + esc(z[1]) + "</h3>", grid), cols = H("div", "ld-cols", null, zone);
      W.groups.filter(g => g.side === z[0]).forEach(g => {
        const card = H("div", "ld-card", '<div class="ld-c">' + esc(g.c) + "</div>", cols);
        P.leaders.filter(l => l.c === g.c).forEach(l => {
          const b = H("button", "ld-row r-" + l.r, roleIcon(l.r) + '<span><span class="n">' + esc(l.n) + '</span><span class="t">' + esc(l.t) + "</span></span>", card);
          b.dataset.l = l.id; b.title = ROLE[l.r][0];
        });
      });
    });
    state.leader = state.leader && P.L[state.leader] ? state.leader : null;
    updateLeaders();
    renderLeaderPanel();
    requestAnimationFrame(drawTies);
  }
  function updateLeaders() {
    const P = state.P, d = $("ld-date");
    if (!d) return;
    d.textContent = fmtMY(state.t);
    document.querySelectorAll(".ld-row").forEach(b => b.classList.toggle("off", state.officeOnly && !inOffice(P.L[b.dataset.l], state.t)));
  }
  let tieEls = [];
  function drawTies() {
    const sv = $("ld-ties"), board = $("ld-board"), W = state.W;
    if (state.view !== "leaders" || !sv) return;
    sv.innerHTML = ""; tieEls = [];
    sv.setAttribute("width", 0); sv.setAttribute("height", 0);       /* don't let last frame's canvas inflate the measure */
    const bw = board.scrollWidth, bh = board.scrollHeight, b0 = board.getBoundingClientRect();
    sv.setAttribute("width", bw); sv.setAttribute("height", bh); sv.setAttribute("viewBox", "0 0 " + bw + " " + bh);
    const rect = {};
    document.querySelectorAll(".ld-row").forEach(r => { const q = r.getBoundingClientRect(); rect[r.dataset.l] = { l: q.left - b0.left + board.scrollLeft, r: q.right - b0.left + board.scrollLeft, y: q.top - b0.top + board.scrollTop + q.height / 2 }; });
    W.ties.forEach((t, idx) => {
      if (!state.kinds.has(t.k)) return;
      let A = rect[t.a], B = rect[t.b];
      if (!A || !B) return;
      if (A.l > B.l) { const s = A; A = B; B = s; }
      let d;
      if (B.l - A.r > 12) { const dx = (B.l - A.r) * .5; d = "M" + A.r + " " + A.y + "C" + (A.r + dx) + " " + A.y + " " + (B.l - dx) + " " + B.y + " " + B.l + " " + B.y; }
      else { const x = Math.max(A.r, B.r), bulge = 12 + Math.min(20, Math.abs(B.y - A.y) * .1) + (idx % 4) * 2.5; d = "M" + A.r + " " + A.y + "C" + (x + bulge) + " " + A.y + " " + (x + bulge) + " " + B.y + " " + B.r + " " + B.y; }
      const vis = S("path", { d, class: "vis k-" + t.k }, sv), hit = S("path", { d, class: "hit" }, sv);
      hit.dataset.t = idx;
      S("title", null, hit).textContent = state.P.L[t.a].n + " — " + state.P.L[t.b].n + " · " + TIE[t.k][0];
      tieEls.push({ t, vis });
    });
    focusTies();
  }
  function focusTies(hoverId) {
    const id = hoverId || state.leader, sv = $("ld-ties");
    const near = new Set();
    if (id) { near.add(id); (state.P.tiesOf[id] || []).forEach(t => { if (state.kinds.has(t.k)) { near.add(t.a); near.add(t.b); } }); }
    sv.classList.toggle("focus", !!id);
    tieEls.forEach(o => o.vis.classList.toggle("hot", !!id && (o.t.a === id || o.t.b === id)));
    document.querySelectorAll(".ld-row").forEach(b => { b.classList.toggle("fade", !!id && !near.has(b.dataset.l)); b.classList.toggle("hot", !!id && near.has(b.dataset.l) && b.dataset.l !== id); b.classList.toggle("sel", b.dataset.l === state.leader); });
  }
  function renderLeaderPanel(tie) {
    const P = state.P, W = state.W, box = $("ld-panel"), l = state.leader ? P.L[state.leader] : null;
    if (tie) {
      const a = P.L[tie.a], b = P.L[tie.b];
      box.innerHTML = '<div class="sd-k" style="color:' + TIE[tie.k][1] + '">' + TIE[tie.k][0] + '</div><div class="sd-t">' + esc(a.n) + " &amp; " + esc(b.n) + '</div><div class="sd-d">' + esc(a.c) + " · " + esc(b.c) + '</div><p class="sd-p">' + esc(tie.d) + '</p><div class="sd-links"><button class="lnk" data-l="' + a.id + '">' + esc(a.n) + ' ⟶</button><button class="lnk" data-l="' + b.id + '">' + esc(b.n) + " ⟶</button></div>";
      return;
    }
    if (!l) {
      const n = {}; W.ties.forEach(t => { n[t.k] = (n[t.k] || 0) + 1; });
      box.innerHTML = '<div class="sd-k">The Leaders</div><div class="sd-t">' + P.leaders.length + " figures · " + W.ties.length + ' threads</div><p class="sd-p">' +
        (W.id === "ww1" ? "The Great War was, at the top, a family quarrel. The King of England, the German Kaiser and the Tsar's wife were all grandchildren of Queen Victoria; the King and the Tsar were first cousins who looked like twins. Follow the gold threads."
          : "By 1939 the crowns had mostly given way to dictators, presidents and prime ministers — but the old dynastic web still ran under the surface, from Norway's exiled king to the boy-king of Romania. Each figure also records where he was in the last war.") +
        '</p><p class="sd-p" style="margin-top:10px">Hover a name to light its threads; click for the record. Click any thread for its story.</p><div class="sd-k">Threads on this board</div>' +
        Object.keys(TIE).filter(k => n[k]).map(k => '<div class="lg-row"><span class="tk"><i style="border-color:' + TIE[k][1] + '"></i></span>' + TIE[k][0] + " · " + n[k] + "</div>").join("");
      return;
    }
    const other = Object.values(WARS).find(w => w !== W && w.leaders.some(o => o.n === l.n));
    const ties = (P.tiesOf[l.id] || []).slice().sort((a, b) => Object.keys(TIE).indexOf(a.k) - Object.keys(TIE).indexOf(b.k));
    box.innerHTML = '<button class="sd-x" id="ld-x" title="Close (Esc)">×</button><div class="sd-k">' + esc(l.c) + " · " + ROLE[l.r][0] + '</div><div class="sd-t">' + esc(l.n) + '</div><div class="sd-d">' + esc(l.t) + "<br>" + fmtMY(l.ts) + " – " + (l.te === Infinity ? "beyond the war" : fmtMY(l.te)) + "</div>" +
      (l.house ? '<div><span class="tag G">House of ' + esc(l.house) + "</span></div>" : "") + '<p class="sd-p">' + esc(l.d) + "</p>" +
      (l.ww1 ? '<div class="sd-f"><b style="color:var(--gold-bright)">In the last war · </b>' + esc(l.ww1) + "</div>" : "") +
      (other ? '<div class="sd-links"><button class="lnk" data-war="' + other.id + '" data-ln="' + esc(l.n) + '">Also on the board in ' + esc(other.name) + " ⟶</button></div>" : "") +
      '<div class="sd-k">' + (ties.length ? ties.length + " thread" + (ties.length > 1 ? "s" : "") : "No recorded threads") + "</div>" +
      ties.map(t => { const o = P.L[t.a === l.id ? t.b : t.a]; return '<button class="ld-tie kc-' + t.k + '" data-l="' + o.id + '"><span class="kk">' + TIE[t.k][0] + "</span><b>" + esc(o.n) + "</b> · " + esc(o.c) + "<br>" + esc(t.d) + "</button>"; }).join("");
    box.scrollTop = 0;
  }
  function pickLeader(id, scroll) {
    state.leader = id;
    focusTies(); renderLeaderPanel();
    if (id && scroll) { const r = document.querySelector('.ld-row[data-l="' + id + '"]'); if (r && r.scrollIntoView) r.scrollIntoView({ block: "center", behavior: "smooth" }); }
    pushHash();
  }

  /* ============================================================
     THE CAMPAIGNS · THE COST · CAUSES & AFTERMATH
     ============================================================ */
  function buildCampaigns() {
    const W = state.W, P = state.P, box = $("v-campaigns");
    let h = '<h2 class="wr-h">' + esc(W.name) + ' — phase by phase</h2><p class="wr-sub">' + esc(W.blurb) + " " + P.phases.length + " phases, " + P.items.length + " battles and turning points. Open any row; <i>Show on the map</i> flies the War Room to that day and place.</p>";
    P.phases.forEach((p, i) => {
      const its = P.items.filter(it => (it.ts >= p.ts && it.ts < p.te) || (i === 0 && it.ts < p.ts) || (i === P.phases.length - 1 && it.ts >= p.te));
      h += '<section class="ph" data-ph="' + i + '"><div class="ph-n">' + (i + 1) + " · " + esc(p.n) + '</div><div class="ph-d">' + fmtDate(p.ts) + " – " + fmtDate(p.te) + ' · <button class="lnk" data-t="' + (p.ts + 1) + '" style="padding:1px 7px;font-size:10px">set the date here</button></div><p class="ph-p">' + esc(p.d) + "</p>" +
        its.map(it => '<details class="cp" id="cp-' + it.id + '"><summary><span class="d">' + fmtShort(it.ts) + '</span><svg viewBox="-10 -10 20 20" width="16" height="16" class="it k-' + it.k + " w-" + (it.w === "A" || it.w === "B" ? it.w : "0") + '">' + SHAPES[it.k] + '</svg><span class="n">' + esc(it.n) + '</span><span class="w">' +
          (it.w === "A" || it.w === "B" ? '<span class="tag ' + it.w + '">' + esc(W.sides[it.w].short) + "</span>" : '<span class="tag">' + KIND[it.k] + "</span>") + '</span></summary><div class="cp-b">' +
          (it.te > it.ts ? '<div class="sd-d">' + fmtDate(it.ts) + " – " + fmtDate(it.te) + "</div>" : "") + esc(it.d) + (it.f ? '<div class="sd-f">' + esc(it.f) + "</div>" : "") +
          '<div class="sd-links"><button class="lnk" data-show="' + it.id + '">Show on the map ⟶</button><a href="' + it.u + '" target="_blank" rel="noopener">Source ↗</a>' + archiveLink(it) + "</div></div></details>").join("") + "</section>";
    });
    box.innerHTML = h;
    updateCampaigns();
  }
  function updateCampaigns() { const pi = phaseAt(state.t); document.querySelectorAll("#v-campaigns .ph").forEach((s, i) => s.classList.toggle("now", i === pi)); }

  function buildCost() {
    const W = state.W, P = state.P, C = W.cost, box = $("v-cost");
    const days = num(Math.round(P.we - P.ws) + 1);
    let h = '<h2 class="wr-h">The cost</h2><div class="tiles">' + W.stats.map(s => '<div class="tile"><div class="v">' + esc(s.v === "@days" ? days : s.v) + '</div><div class="l">' + esc(s.l) + "</div>" + (s.s ? '<div class="s">' + esc(s.s) + "</div>" : "") + "</div>").join("") + "</div>" +
      '<h2 class="wr-h">' + esc(C.title) + "</h2>";
    const key = (c, label) => '<span><i style="background:' + c + '"></i>' + label + "</span>";
    if (C.mode === "mob") {
      const rows = C.rows.slice().sort((a, b) => b.mil - a.mil), max = rows[0].mil;
      h += '<div class="cost-key">' + key("var(--A)", esc(W.sides.A.short)) + key("var(--B)", esc(W.sides.B.short)) + "<span>bar = soldiers killed · label = share of those mobilized</span></div><div class=\"cost\">" +
        rows.map(r => '<div class="nm">' + esc(r.n) + '</div><div class="bw"><div class="b ' + r.side + '" style="width:' + (r.mil / max * 62).toFixed(2) + '%"><i style="width:100%"></i></div><span class="v"><b>' + num(r.mil) + "</b> killed · " + (r.mil / r.mob * 100).toFixed(r.mil / r.mob < .01 ? 2 : 0) + "% of " + big(r.mob) + "</span></div>").join("") +
        C.totals.map(r => '<div class="nm" style="color:var(--gold-bright);margin-top:8px">' + esc(r.n) + '</div><div class="bw" style="margin-top:8px"><span class="v"><b>' + num(r.mil) + "</b> killed of " + num(r.mob) + " mobilized (" + (r.mil / r.mob * 100).toFixed(0) + "%)</span></div>").join("") + "</div>";
    } else {
      const rows = C.rows.slice().sort((a, b) => mid(b.tot) - mid(a.tot)), max = mid(rows[0].tot);
      h += '<div class="cost-key">' + key("var(--A)", esc(W.sides.A.short)) + key("var(--B)", esc(W.sides.B.short)) + key("var(--gold)", "occupied / colonial territory") + "<span>solid = military deaths · pale = civilians · bars use a square-root scale so the smaller tolls stay visible</span></div><div class=\"cost\">" +
        rows.map(r => { const tot = mid(r.tot), mil = mid(r.mil) || 0;
          return '<div class="nm">' + esc(r.n) + '</div><div class="bw"><div class="b ' + r.side + '" style="width:' + (Math.sqrt(tot / max) * 62).toFixed(2) + '%"><i style="width:' + (mil / tot * 100).toFixed(1) + '%"></i></div><span class="v"><b>' + rng(r.tot) + "</b>" + (r.mil ? " · military " + rng(r.mil) : "") + "</span></div>"; }).join("") + "</div>";
    }
    h += '<p class="wr-note" style="margin-top:18px">' + esc(C.note) + '</p><p class="wr-note" style="margin-top:8px">Sources: ' + C.src.map(s => '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.n) + "</a>").join(" · ") + "</p>";
    box.innerHTML = h;
  }
  function buildWhy() {
    const W = state.W, box = $("v-why");
    const col = (title, arr) => '<div><h3>' + title + "</h3>" + arr.map(c => '<div class="why-i"><b>' + esc(c.t) + "</b><p>" + esc(c.d) + (c.ref ? ' <a href="index.html#e=' + c.ref + '&v=chronicle">in the Chronicle ⟶</a>' : "") + "</p></div>").join("") + "</div>";
    box.innerHTML = '<h2 class="wr-h">' + esc(W.name) + ' — why it happened, what it changed</h2><p class="wr-sub">' + esc(W.blurb) + '</p><div class="why">' + col("Causes", W.causes) + col("Aftermath", W.aftermath) + col("How it was fought", W.tech) + "</div>" +
      '<div class="wr-src"><div class="sd-k">Sources for this instrument</div>' + W.sources.map(s => '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.n) + "</a>").join("<br>") +
      '<p class="wr-note" style="margin-top:10px">' + esc(W.mapNote) + " Every battle and event record carries its own source link.</p></div>";
  }

  /* ============================================================
     SWITCHING — war, view, hash
     ============================================================ */
  const built = {};
  function setView(v, quiet) {
    state.view = v;
    document.querySelectorAll("#wr-tabs button").forEach(b => { b.classList.toggle("on", b.dataset.v === v); b.setAttribute("aria-selected", b.dataset.v === v); });
    document.querySelectorAll(".wr-view").forEach(s => { s.hidden = s.id !== "v-" + v; });
    $("scrub").hidden = v === "cost" || v === "why";
    const key = state.W.id + ":" + v;
    if (v !== "map" && built[v] !== key) { built[v] = key; ({ powers: buildPowers, leaders: buildLeaders, campaigns: buildCampaigns, cost: buildCost, why: buildWhy })[v](); }
    if (v === "map") { lastSig = ""; lastDay = null; if (state.theater) setTheater(state.theater, 0); else { state.vb = clampView(state.vb); applyView(); } }
    if (v === "powers") { buildRibbon(); updatePowers(); }
    if (v === "leaders") { updateLeaders(); requestAnimationFrame(drawTies); }
    if (v === "campaigns") updateCampaigns();
    if (!$("scrub").hidden) buildTimeline();
    if (!quiet) pushHash();
  }
  function setWar(id, opts) {
    const W = WARS[id] || WARS.ww2 || Object.values(WARS)[0];
    opts = opts || {};
    state.W = W; state.P = prep(W);
    state.sel = null; state.leader = null; state.playing = false;
    for (const k in built) delete built[k];
    document.querySelectorAll("#war-switch button").forEach(b => b.classList.toggle("on", b.dataset.war === W.id));
    $("wr-blurb").textContent = W.blurb;
    $("sc-play").textContent = "▶ Play";
    $("play-cta").hidden = false;
    $("theaters").innerHTML = W.theaters.map(t => '<button class="chipbtn" data-th="' + t.id + '">' + esc(t.n) + "</button>").join("");
    $("legend").innerHTML = W.legend.map(c => '<div class="lg-row"><span class="lg-sw" style="background:' + LEG_BG[W.status[c][2]] + '"></span>' + esc(W.status[c][0]) + "</div>").join("") +
      '<div class="lg-row"><svg class="lg-sw" style="border:0" viewBox="0 0 18 11"><path d="M1 6h16" stroke="#ffe08a" stroke-width="2.4"/></svg>Front line</div>' +
      '<div class="lg-row"><svg class="lg-sw" style="border:0" viewBox="0 0 18 11"><path d="M1 6h11" stroke="#ff8a73" stroke-width="2.2"/><path d="M17 6l-6-3.4 1.6 3.4L11 9.4z" fill="#ff8a73"/></svg>Offensive (red ' + esc(W.sides.B.short) + ", blue " + esc(W.sides.A.short) + ")</div>" +
      (W.rings ? '<div class="lg-row"><svg class="lg-sw" style="border:0" viewBox="0 0 18 11"><rect x="1" y="1" width="16" height="9" fill="rgba(210,69,47,.15)" stroke="#ff8a73" stroke-dasharray="3 2"/></svg>Limit of Japanese control</div>' : "") +
      '<div class="lg-note">' + esc(W.mapNote) + "</div>";
    buildWarLayers(); buildOob();
    state.t = opts.t != null ? clamp(opts.t, state.P.t0, state.P.t1) : state.P.ws - 3;
    lastSig = ""; lastDay = null; lastMonth = "";
    setView(opts.view || state.view, true);
    setTheater(opts.theater || (W.theaters[1] || W.theaters[0]).id, 0);
    buildTimeline();
    if (!opts.quiet) pushHash();
  }
  let hashTimer = 0, selfHash = "";
  function pushHash() {
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      const p = ["w=" + state.W.id, "v=" + state.view, "t=" + isoOf(state.t)];
      if (state.sel && state.sel.type === "item") p.push("i=" + state.sel.id);
      if (state.view === "leaders" && state.leader) p.push("l=" + state.leader);
      selfHash = "#" + p.join("&");
      try { history.replaceState(null, "", selfHash); } catch (e) { /* file:// in some viewers */ }
    }, 250);
  }
  function applyHash() {
    if (location.hash === selfHash && state.W) return;
    const q = {}; location.hash.replace(/^#/, "").split("&").forEach(kv => { const [k, v] = kv.split("="); if (k) q[k] = decodeURIComponent(v || ""); });
    let wid = q.w;
    if (!wid && q.i) wid = Object.keys(WARS).find(k => WARS[k].items.some(i => i.id === q.i));
    const W = WARS[wid] || WARS.ww2 || Object.values(WARS)[0], P = prep(W);
    const it = q.i ? P.I[q.i] : null;
    setWar(W.id, { t: q.t && /^\d{4}-\d\d-\d\d$/.test(q.t) ? day(q.t) : it ? Math.min(it.te, it.ts + 2) : null, view: ["map", "powers", "leaders", "campaigns", "cost", "why"].indexOf(q.v) >= 0 ? q.v : it ? "map" : "map", quiet: true });
    if (location.hash.length > 1) $("play-cta").hidden = true;      /* a deep link is not a first visit */
    if (it) select({ type: "item", id: it.id }, { jump: true });
    if (q.l && P.L[q.l]) { state.leader = q.l; if (state.view === "leaders") { focusTies(); renderLeaderPanel(); } }
  }

  /* ============================================================
     WIRING
     ============================================================ */
  function wire() {
    $("war-switch").innerHTML = Object.values(WARS).map(w => '<button data-war="' + w.id + '"><b>WORLD WAR ' + w.numeral + "</b><span>" + w.warStart.slice(0, 4) + " – " + w.warEnd.slice(0, 4) + "</span></button>").join("");
    $("war-switch").addEventListener("click", e => { const b = e.target.closest("button"); if (b && b.dataset.war !== state.W.id) setWar(b.dataset.war, { view: state.view }); });
    $("wr-tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setView(b.dataset.v); });
    $("theaters").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setTheater(b.dataset.th, 750); });
    $("map-tools").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.layer) { state.layers[b.dataset.layer] = !state.layers[b.dataset.layer]; b.classList.toggle("on", state.layers[b.dataset.layer]); draw(); }
      else if (b.id === "lg-btn") { $("legend").hidden = !$("legend").hidden; b.classList.toggle("on", !$("legend").hidden); }
      else if (b.id === "zm-in") zoomBy(.7); else if (b.id === "zm-out") zoomBy(1 / .7);
    });
    $("play-cta").addEventListener("click", () => { setT(state.P.ws - 25, true); setPlaying(true); });
    $("sc-play").addEventListener("click", () => setPlaying(!state.playing));
    $("sc-start").addEventListener("click", () => { setPlaying(false); setT(state.P.ws - 3); });
    $("sc-back").addEventListener("click", () => stepMonth(-1));
    $("sc-fwd").addEventListener("click", () => stepMonth(1));
    $("sc-speed").addEventListener("click", e => { const sp = [1, 2, 4, .5]; state.speed = sp[(sp.indexOf(state.speed) + 1) % sp.length]; e.currentTarget.textContent = (state.speed === .5 ? "½" : state.speed) + "×"; });
    let scrubbing = false;
    tl.addEventListener("pointerdown", e => { scrubbing = true; tl.setPointerCapture(e.pointerId); setPlaying(false); scrubTo(e); });
    tl.addEventListener("pointermove", e => { if (scrubbing) scrubTo(e); });
    const endScrub = () => { if (scrubbing) { scrubbing = false; pushHash(); } };
    tl.addEventListener("pointerup", endScrub); tl.addEventListener("pointercancel", endScrub);

    /* map pointer: drag pans, wheel and pinch zoom, click inspects */
    const ptr = new Map();
    let moved = 0, pinch0 = 0;
    svg.addEventListener("pointerdown", e => { ptr.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; svg.setPointerCapture(e.pointerId); if (ptr.size === 2) { const p = Array.from(ptr.values()); pinch0 = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]); } });
    svg.addEventListener("pointermove", e => {
      const prev = ptr.get(e.pointerId);
      if (prev) {
        const dx = e.clientX - prev[0], dy = e.clientY - prev[1];
        ptr.set(e.pointerId, [e.clientX, e.clientY]);
        if (ptr.size === 1) {
          moved += Math.abs(dx) + Math.abs(dy);
          if (moved > 4) { svg.classList.add("dragging"); viewAnim = null; state.vb.x -= dx * state.kx; state.vb.y -= dy * state.ky; clampView(state.vb); markFree(); applyView(); tip.hidden = true; }
        } else if (ptr.size === 2) {
          const p = Array.from(ptr.values()), dist = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), r = wrap.getBoundingClientRect();
          if (pinch0 > 0 && dist > 0) zoomBy(pinch0 / dist, (p[0][0] + p[1][0]) / 2 - r.left, (p[0][1] + p[1][1]) / 2 - r.top);
          pinch0 = dist; moved = 99;
        }
        return;
      }
      hover(e);
    });
    const up = e => {
      const was = ptr.has(e.pointerId); ptr.delete(e.pointerId); svg.classList.remove("dragging");
      if (!was || moved > 4) return;
      const el = document.elementFromPoint(e.clientX, e.clientY), it = el && el.closest && el.closest(".it"), c = el && el.classList && el.classList.contains("c") ? el : null;
      if (it && it.dataset.i) select({ type: "item", id: it.dataset.i });
      else if (c) select(state.sel && state.sel.id === c.dataset.n ? null : { type: "country", id: c.dataset.n });
      else select(null);
    };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", e => { ptr.delete(e.pointerId); svg.classList.remove("dragging"); });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; });
    svg.addEventListener("wheel", e => { e.preventDefault(); const r = wrap.getBoundingClientRect(); viewAnim = null; zoomBy(Math.exp(clamp(e.deltaY, -120, 120) * .0016), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    svg.addEventListener("dblclick", () => setTheater(state.W.theaters[0].id, 700));
    function hover(e) {
      const el = e.target, it = el.closest && el.closest(".it"), W = state.W, P = state.P;
      let h = "";
      if (it && it.dataset.i) { const o = P.I[it.dataset.i]; h = "<b>" + esc(o.n) + "</b><i>" + fmtDate(o.ts) + (o.te > o.ts ? " – " + fmtDate(o.te) : "") + " · " + KIND[o.k] + "</i>"; }
      else if (el.classList && el.classList.contains("c")) {
        const n = el.dataset.n, s = statusAt(n, state.t);
        h = "<b>" + esc(W.alias[n] || n) + "</b>" + (s ? "<i>" + esc(W.status[s.c][0]) + " · since " + fmtShort(s.t) + "</i>" + esc(s.n) : "<i>Neutral" + (P.tl[n] ? " — for now" : "") + "</i>");
      }
      if (!h) { tip.hidden = true; return; }
      const r = wrap.getBoundingClientRect();
      tip.innerHTML = h; tip.hidden = false;
      tip.style.left = clamp(e.clientX - r.left + 14, 4, r.width - tip.offsetWidth - 4) + "px";
      tip.style.top = clamp(e.clientY - r.top + 16, 4, r.height - tip.offsetHeight - 4) + "px";
    }

    $("side").addEventListener("click", e => {
      const row = e.target.closest("[data-i]");
      if (row) select({ type: "item", id: row.dataset.i }, { jump: true, keepView: false });
      else if (e.target.id === "sd-x") select(null);
    });
    $("oob").addEventListener("click", e => { const c = e.target.closest(".pc"); if (c) { setView("powers"); const card = document.querySelector('.pw-card[data-p="' + c.dataset.p + '"]'); if (card) card.scrollIntoView({ block: "center", behavior: "smooth" }); } });
    $("v-powers").addEventListener("click", e => {
      const l = e.target.closest("[data-l]");
      if (l) { state.leader = l.dataset.l; setView("leaders"); pickLeader(l.dataset.l, true); return; }
      if (e.target.closest("#ribbon") && rbX) { const r = $("ribbon").getBoundingClientRect(), x = (e.clientX - r.left) / r.width * rbX.W; if (x > rbX.LEFT) setT(state.P.t0 + (x - rbX.LEFT) / (rbX.W - rbX.LEFT - 8) * (state.P.t1 - state.P.t0)); }
    });
    $("ld-top").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.k) { state.kinds.has(b.dataset.k) ? state.kinds.delete(b.dataset.k) : state.kinds.add(b.dataset.k); b.classList.toggle("on", state.kinds.has(b.dataset.k)); b.classList.toggle("off", !state.kinds.has(b.dataset.k)); drawTies(); }
      else if (b.id === "ld-office") { state.officeOnly = !state.officeOnly; b.classList.toggle("on", state.officeOnly); updateLeaders(); }
    });
    const board = $("ld-board");
    board.addEventListener("click", e => {
      const r = e.target.closest(".ld-row"), hit = e.target.closest && e.target.closest("path.hit");
      if (r) pickLeader(state.leader === r.dataset.l ? null : r.dataset.l);
      else if (hit) { state.leader = null; focusTies(); const t = state.W.ties[+hit.dataset.t]; tieEls.forEach(o => o.vis.classList.toggle("hot", o.t === t)); $("ld-ties").classList.add("focus"); renderLeaderPanel(t); }
      else pickLeader(null);
    });
    board.addEventListener("pointerover", e => { const r = e.target.closest(".ld-row"); if (r) focusTies(r.dataset.l); });
    board.addEventListener("pointerout", e => { if (e.target.closest(".ld-row")) focusTies(); });
    $("ld-panel").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "ld-x") pickLeader(null);
      else if (b.dataset.war) { const nm = b.dataset.ln; setWar(b.dataset.war, { view: "leaders" }); const o = state.P.leaders.find(x => x.n === nm); if (o) pickLeader(o.id, true); }
      else if (b.dataset.l) pickLeader(b.dataset.l, true);
    });
    $("v-campaigns").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.show) { setView("map", true); $("play-cta").hidden = true; select({ type: "item", id: b.dataset.show }, { jump: true }); }
      else if (b.dataset.t) setT(+b.dataset.t);
    });

    window.addEventListener("keydown", e => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      const tabs = ["map", "powers", "leaders", "campaigns", "cost", "why"];
      if (e.key === " ") { e.preventDefault(); setPlaying(!state.playing); }
      else if (e.key === "ArrowLeft") stepMonth(-1); else if (e.key === "ArrowRight") stepMonth(1);
      else if (e.key === "Home") { setPlaying(false); setT(state.P.ws - 3); } else if (e.key === "End") { setPlaying(false); setT(state.P.we); }
      else if (e.key === "+" || e.key === "=") zoomBy(.7); else if (e.key === "-") zoomBy(1 / .7);
      else if (e.key >= "1" && e.key <= "6") setView(tabs[+e.key - 1]);
      else if (e.key === "w" || e.key === "W") setWar(state.W.id === "ww1" ? "ww2" : "ww1", { view: state.view });
      else if (e.key === "Escape") { if (state.view === "leaders") pickLeader(null); else select(null); }
    });
    window.addEventListener("hashchange", applyHash);
    let rz = 0;
    const onResize = () => { clearTimeout(rz); rz = setTimeout(() => {
      if (state.view === "map") { if (state.theater) setTheater(state.theater, 0); else { clampView(state.vb); applyView(); } }
      if (!$("scrub").hidden) buildTimeline();
      if (state.view === "powers") { buildRibbon(); updatePowers(); }
      if (state.view === "leaders") drawTies();
    }, 90); };
    if (window.ResizeObserver) new ResizeObserver(onResize).observe(document.body); else window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (state.view === "leaders") drawTies(); });
  }

  /* ---------- boot ---------- */
  if (!Object.keys(WARS).length || !COUNTRIES.length) {
    $("side").innerHTML = '<p class="sd-p">The War Room could not load its data. Open this page from inside the archivus folder so that <code>src/data/</code> and <code>assets/</code> are beside it.</p>';
    return;
  }
  buildMap();
  wire();
  applyHash();
})();
