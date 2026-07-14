/* ============================================================
   ARCHIVUS — core engine (v0.6 "Gazetteer")

   Three views of one archive:
   · CHRONICLE — log-scaled lane timeline with uncertainty bands
   · ATLAS     — zoomable world map; the time window is the filter
   · CODEX WHEEL — the window bent into a ring

   Time runs on a logarithmic scale anchored beyond the present,
   so every century gets screen space and zoom always reveals
   structure. All motion (flights, coasting, zoom) happens in
   log-space. The full relation web is always drawn; selection
   ignites one thread of it.
   ============================================================ */
(function () {
  "use strict";

  const ERAS = window.ARCHIVUS_ERAS;
  const THEMES = window.ARCHIVUS_THEMES;
  const REGIONS = window.ARCHIVUS_REGIONS;
  const EVENTS = window.ARCHIVUS_EVENTS;
  const GEO = window.ARCHIVUS_GEO || {};
  const UNC = window.ARCHIVUS_UNCERTAINTY || {};
  const WORLD = window.ARCHIVUS_WORLD || "";
  const COUNTRIES = window.ARCHIVUS_COUNTRIES || null;
  const GEO_CTRY = window.ARCHIVUS_GEO_COUNTRY || {};

  const THEME_BY_ID = Object.fromEntries(THEMES.map(t => [t.id, t]));
  const ERA_BY_ID = Object.fromEntries(ERAS.map(e => [e.id, e]));
  const EVENT_BY_ID = Object.fromEntries(EVENTS.map(e => [e.id, e]));

  /* the Transmissions codex, reverse-indexed by event */
  const TX = window.ARCHIVUS_TRANSMISSIONS || [];
  const TX_BY_EVENT = {};
  TX.forEach(t => (t.eventRefs || []).forEach(id =>
    (TX_BY_EVENT[id] = TX_BY_EVENT[id] || []).push(t)));

  /* all related pairs, deduplicated — the standing web */
  const WEB = (() => {
    const seen = new Set(), pairs = [];
    EVENTS.forEach(ev => (ev.related || []).forEach(rid => {
      if (!EVENT_BY_ID[rid]) return;
      const key = ev.id < rid ? ev.id + "|" + rid : rid + "|" + ev.id;
      if (seen.has(key)) return;
      seen.add(key);
      pairs.push([ev.id, rid]);
    }));
    return pairs;
  })();

  /* ---------- constants ---------- */
  const MIN_YEAR = -450000, MAX_YEAR = 2140;   /* the Horizon era extends past the present */
  const ANCHOR = 2150;                     /* log anchor beyond the present — tuned so
                                              antiquity/medieval/modern each get fair screen share */
  const MIN_SPAN = 12;
  const OV0 = -10000, OV1 = 2040;
  const ERA_STRIP_H = 24;
  const AXIS_H = 24;
  const OV_H = 30;
  const PLOT_TOP = ERA_STRIP_H + 12;
  const REGION_LANE_COLOR = "#8f9ab5";

  /* ---------- log time scale ---------- */
  const uOf = t => Math.log(ANCHOR - t);           /* larger u = deeper past */
  const tOf = u => ANCHOR - Math.exp(u);

  /* ---------- state ---------- */
  const state = {
    t0: -12000, t1: 2140,                    /* the Horizon is part of the default view */
    themes: new Set(),
    region: "",
    era: "",
    query: "",
    lens: "theme",
    minImp: 0,
    futureOnly: false,
    view: "chronicle",
    selected: null,
    panelMode: "empty"
  };
  /* atlas geographic view */
  const mapView = { k: 1, mcx: 180, mcy: 90 };

  /* ---------- DOM ---------- */
  const svg = document.getElementById("chart");
  const wrap = document.getElementById("chart-wrap");
  const tooltip = document.getElementById("tooltip");
  const NS = "http://www.w3.org/2000/svg";

  const layers = {};
  ["stars", "map", "eras", "lanes", "axis", "wheel", "web", "links", "events", "cursor", "overview"].forEach(name => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("id", "layer-" + name);
    svg.appendChild(g);
    layers[name] = g;
  });

  (function defs() {
    const d = document.createElementNS(NS, "defs");
    d.innerHTML =
      '<filter id="glow" x="-80%" y="-80%" width="260%" height="260%">' +
      '<feGaussianBlur stdDeviation="2.4" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="glow-big" x="-120%" y="-120%" width="340%" height="340%">' +
      '<feGaussianBlur stdDeviation="5" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<radialGradient id="nebula-a" cx="30%" cy="20%" r="70%">' +
      '<stop offset="0%" stop-color="#1b2340" stop-opacity="0.5"/><stop offset="100%" stop-color="#1b2340" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="nebula-b" cx="78%" cy="80%" r="60%">' +
      '<stop offset="0%" stop-color="#2a1f33" stop-opacity="0.45"/><stop offset="100%" stop-color="#2a1f33" stop-opacity="0"/></radialGradient>';
    svg.insertBefore(d, svg.firstChild);
  })();

  /* ---------- geometry ---------- */
  let W = 800, H = 500;
  function measure() {
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  }
  const plotBottom = () => H - AXIS_H - OV_H - 12;
  const plotH = () => plotBottom() - PLOT_TOP;
  const x = t => {
    const u0 = uOf(state.t0), u1 = uOf(state.t1);
    return (u0 - uOf(Math.min(t, MAX_YEAR))) / (u0 - u1) * W;
  };
  const invX = px => {
    const u0 = uOf(state.t0), u1 = uOf(state.t1);
    return tOf(u0 - px / W * (u0 - u1));
  };
  const ovX = t => (Math.max(OV0, Math.min(OV1, t)) - OV0) / (OV1 - OV0) * (W - 32) + 16;
  const ovInv = px => OV0 + (px - 16) / (W - 32) * (OV1 - OV0);

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }
  function hashOf(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  /* ============ motion engine (all in u-space) ============ */
  let rafPending = false;
  function scheduleRender() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; renderTime(); });
  }
  function clampDomain(a, b) {
    if (b - a < MIN_SPAN) { const m = (a + b) / 2; a = m - MIN_SPAN / 2; b = m + MIN_SPAN / 2; }
    a = Math.max(MIN_YEAR, Math.min(a, MAX_YEAR - MIN_SPAN));
    b = Math.max(a + MIN_SPAN, Math.min(b, MAX_YEAR));
    return [a, b];
  }
  function setDomain(a, b) {
    [state.t0, state.t1] = clampDomain(a, b);
    scheduleRender();
  }

  let flight = null;
  function flyTo(a, b, dur = 800) {
    [a, b] = clampDomain(a, b);
    flight = { u0f: uOf(state.t0), u1f: uOf(state.t1), u0t: uOf(a), u1t: uOf(b), start: performance.now(), dur };
    momentum = null;
    requestAnimationFrame(stepFlight);
  }
  function stepFlight(now) {
    if (!flight) return;
    const p = Math.min(1, (now - flight.start) / flight.dur);
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    state.t0 = tOf(flight.u0f + (flight.u0t - flight.u0f) * e);
    state.t1 = tOf(flight.u1f + (flight.u1t - flight.u1f) * e);
    scheduleRender();
    if (p < 1) requestAnimationFrame(stepFlight);
    else flight = null;
  }

  let momentum = null;
  function coast(vUPerMs) {
    if (Math.abs(vUPerMs) < 1e-5) return;
    momentum = { v: vUPerMs, last: performance.now() };
    requestAnimationFrame(stepCoast);
  }
  function stepCoast(now) {
    if (!momentum) return;
    const dt = Math.min(50, now - momentum.last);
    momentum.last = now;
    momentum.v *= Math.pow(0.93, dt / 16.7);
    if (Math.abs(momentum.v) < 4e-6) { momentum = null; return; }
    const d = momentum.v * dt;
    const a = tOf(uOf(state.t0) + d), b = tOf(uOf(state.t1) + d);
    if (a <= MIN_YEAR || b >= MAX_YEAR) { momentum = null; }
    setDomain(a, b);
    requestAnimationFrame(stepCoast);
  }
  function haltMotion() { flight = null; momentum = null; }

  function zoomAbout(factor, tFocus) {
    haltMotion();
    const uf = uOf(Math.max(MIN_YEAR, Math.min(tFocus, MAX_YEAR - 1)));
    const u0 = uf + (uOf(state.t0) - uf) * factor;
    const u1 = uf + (uOf(state.t1) - uf) * factor;
    setDomain(tOf(u0), tOf(u1));
  }
  function zoomToEra(era) {
    const pad = (era.end - era.start) * 0.08;
    flyTo(era.start - pad, Math.min(era.end + pad, MAX_YEAR));
  }
  /* era-nav: after clicking an era band, ←/→ step through the periods */
  function stepEra(d) {
    const cur = state.eraIdx == null ? 0 : state.eraIdx;
    const n = Math.min(ERAS.length - 1, Math.max(0, cur + d));
    state.eraIdx = n;
    zoomToEra(ERAS[n]);
    showEraRecord(ERAS[n]);
  }
  function timeAtPointer(e) {
    const rect = svg.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    if (state.view === "chronicle") return invX(px);
    if (state.view === "wheel") {
      const cx = W / 2, cy = PLOT_TOP + plotH() / 2;
      let deg = Math.atan2(py - cy, px - cx) * 180 / Math.PI;
      let rel = (deg + 80 + 360) % 360;
      if (rel <= 340) {
        const u0 = uOf(state.t0), u1 = uOf(state.t1);
        return tOf(u0 - rel / 340 * (u0 - u1));
      }
    }
    return invX(W / 2);
  }

  /* ---------- lanes / lens ---------- */
  /* the great civilizations, ranked by their weight in the archive */
  const CIV_OTHER = "Other currents";
  const CIVS = (() => {
    const counts = {};
    EVENTS.forEach(e => { if (e.civ) counts[e.civ] = (counts[e.civ] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([c]) => c).concat([CIV_OTHER]);
  })();
  function lanes() {
    if (state.lens === "region") return REGIONS.map(r => ({ id: r, name: r, color: REGION_LANE_COLOR }));
    if (state.lens === "civ") return CIVS.map(c => ({ id: c, name: c, color: REGION_LANE_COLOR }));
    return THEMES;
  }
  const laneKeyOf = ev => state.lens === "region" ? ev.region
    : state.lens === "civ" ? (ev.civ && CIVS.indexOf(ev.civ) >= 0 ? ev.civ : CIV_OTHER)
    : ev.theme;

  /* ---------- formatting ---------- */
  function fmtYear(y, approx) {
    const abs = Math.abs(y);
    const num = abs >= 10000 ? abs.toLocaleString("en-US") : String(abs);
    return (approx ? "c. " : "") + num + (y < 0 ? " BCE" : " CE");
  }
  function fmtRange(ev) {
    if (ev.endYear == null || ev.endYear === ev.startYear) return fmtYear(ev.startYear, ev.approximate);
    return fmtYear(ev.startYear, ev.approximate) + " — " + fmtYear(ev.endYear, ev.approximate);
  }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---------- filtering ---------- */
  function matches(ev) {
    if (state.themes.size && !state.themes.has(ev.theme)) return false;
    if (state.region && ev.region !== state.region) return false;
    if (state.era && ev.era !== state.era) return false;
    if (state.minImp && (ev.importance || 0) < state.minImp) return false;
    if (state.futureOnly && !ev.future) return false;
    if (state.query) {
      const hay = (ev.title + " " + ev.desc + " " + (ev.civ || "") + " " + ev.region).toLowerCase();
      if (!hay.includes(state.query)) return false;
    }
    return true;
  }
  const inView = ev => (ev.endYear == null ? ev.startYear : ev.endYear) >= state.t0 && ev.startYear <= state.t1;

  /* ---------- starfield ---------- */
  function renderStars() {
    clear(layers.stars);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#nebula-a)" }, layers.stars);
    el("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#nebula-b)" }, layers.stars);
    const n = Math.floor(W * H / 10000);
    for (let i = 0; i < n; i++) {
      const s = el("circle", {
        class: "star",
        cx: (Math.random() * W).toFixed(1),
        cy: (Math.random() * (plotBottom() - PLOT_TOP) + PLOT_TOP).toFixed(1),
        r: (Math.random() * 0.9 + 0.3).toFixed(2),
        opacity: (Math.random() * 0.25 + 0.04).toFixed(2)
      }, layers.stars);
      if (i % 4 === 0) {
        s.classList.add("twinkle");
        s.style.animationDuration = (2.5 + Math.random() * 5).toFixed(1) + "s";
        s.style.animationDelay = (-Math.random() * 5).toFixed(1) + "s";
      }
    }
  }

  /* ---------- era strip ---------- */
  function renderEras() {
    clear(layers.eras);
    const drawBoundaries = state.view === "chronicle";
    ERAS.forEach((era, i) => {
      const xs = Math.max(0, x(era.start)), xe = Math.min(W, x(Math.min(era.end, MAX_YEAR)));
      if (xe <= 0 || xs >= W || xe - xs < 1) return;
      const g = el("g", { class: "era-band" }, layers.eras);
      el("rect", {
        x: xs, y: 0, width: xe - xs, height: ERA_STRIP_H,
        fill: era.id === "horizon" ? "rgba(220,232,255,0.07)"          /* the anticipated glows spectral */
          : i % 2 ? "rgba(201,162,39,0.06)" : "rgba(124,154,201,0.05)",
        stroke: era.id === "horizon" ? "#3d4a66" : "#2a3040", "stroke-width": 0.5,
        "stroke-dasharray": era.id === "horizon" ? "3 3" : "none"
      }, g);
      if (drawBoundaries) {
        el("line", { class: "era-boundary", x1: xs, y1: ERA_STRIP_H, x2: xs, y2: plotBottom() }, g);
      }
      if (xe - xs > 60) {
        el("text", {
          class: "era-band-label",
          x: (xs + xe) / 2, y: ERA_STRIP_H / 2 + 3.5,
          "text-anchor": "middle",
          "font-size": Math.min(10, (xe - xs) / era.name.length * 1.4)
        }, g).textContent = era.name;
      }
      el("title", {}, g).textContent = era.name + " — click to open this era's record";
      g.addEventListener("click", ev => { ev.stopPropagation(); state.eraIdx = i; zoomToEra(era); showEraRecord(era); });
    });
  }

  /* ---------- adaptive ticks for the log axis ---------- */
  const STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
  function logTicks() {
    const out = [];
    let px = W - 4, guard = 0;
    while (px > 40 && guard++ < 60) {
      const tHere = invX(px);
      const tLeft = invX(Math.max(0, px - 90));
      const local = Math.max(1, tHere - tLeft);
      const step = STEPS.find(s => s >= local * 0.8) || 200000;
      let year = Math.floor(tHere / step) * step;
      if (year <= state.t0) break;
      let xp = x(year);
      if (!out.length || out[out.length - 1].x - xp >= 60) out.push({ year, x: xp });
      px = xp - 70;
    }
    return out;
  }

  /* ---------- CHRONICLE: lanes + axis + cursor ---------- */
  let cursorLine = null, cursorText = null;
  function renderLanesAxis() {
    clear(layers.lanes);
    clear(layers.axis);
    const L = lanes();
    const lh = plotH() / L.length;
    L.forEach((t, i) => {
      const y = PLOT_TOP + i * lh;
      el("line", { class: "lane-line", x1: 0, y1: y + lh, x2: W, y2: y + lh }, layers.lanes);
      const lbl = el("text", { class: "lane-label", x: 8, y: y + 12 }, layers.lanes);
      lbl.textContent = t.name;
      lbl.setAttribute("fill", t.color);
      lbl.setAttribute("opacity", "0.6");
    });
    const yA = plotBottom();
    el("line", { class: "axis-line", x1: 0, y1: yA, x2: W, y2: yA }, layers.axis);
    logTicks().forEach(tk => {
      el("line", { class: "axis-line", x1: tk.x, y1: yA, x2: tk.x, y2: yA + 5 }, layers.axis);
      el("text", { class: "axis-tick-label", x: tk.x, y: yA + 16, "text-anchor": "middle" }, layers.axis)
        .textContent = tk.year === 0 ? "YEAR 1" : fmtYear(tk.year);
    });
    if (state.t0 < 0 && state.t1 > 0) {
      const px = x(0);
      el("line", { class: "meridian", x1: px, y1: ERA_STRIP_H, x2: px, y2: yA }, layers.axis);
      el("text", { class: "meridian-label", x: px + 4, y: ERA_STRIP_H + 12 }, layers.axis)
        .textContent = "BCE ← → CE";
    }
  }
  function updateTimeCursor(e) {
    if (state.view !== "chronicle") { clear(layers.cursor); cursorLine = null; return; }
    if (!cursorLine || !layers.cursor.contains(cursorLine)) {
      clear(layers.cursor);
      cursorLine = el("line", { class: "time-cursor", y1: ERA_STRIP_H, y2: plotBottom() }, layers.cursor);
      cursorText = el("text", { class: "time-cursor-label", y: plotBottom() - 6 }, layers.cursor);
    }
    const rect = svg.getBoundingClientRect();
    const px = e.clientX - rect.left;
    if (px < 0 || px > W || (e.clientY - rect.top) > plotBottom()) {
      cursorLine.setAttribute("opacity", 0); cursorText.setAttribute("opacity", 0);
      return;
    }
    cursorLine.setAttribute("x1", px); cursorLine.setAttribute("x2", px);
    cursorLine.setAttribute("opacity", 1);
    const t = Math.round(invX(px));
    cursorText.textContent = fmtYear(t === 0 ? 1 : t);
    const anchorLeft = px < W - 90;
    cursorText.setAttribute("x", anchorLeft ? px + 6 : px - 6);
    cursorText.setAttribute("text-anchor", anchorLeft ? "start" : "end");
    cursorText.setAttribute("opacity", 1);
  }

  /* ---------- shared node helpers ---------- */
  function drawNode(g, ev, cx, cy, r, isMatch, isSel) {
    const color = THEME_BY_ID[ev.theme].color;
    if (isMatch && ev.importance >= 9) {
      const beg = ((hashOf(ev.id) % 28) / 10).toFixed(1);
      const halo = el("circle", { cx, cy, r: r + 2, fill: "none", stroke: color, "stroke-width": 1, opacity: 0 }, g);
      halo.innerHTML =
        `<animate attributeName="r" values="${r + 2};${r + 15}" dur="3.4s" begin="${beg}s" repeatCount="indefinite"/>` +
        `<animate attributeName="opacity" values="0.45;0" dur="3.4s" begin="${beg}s" repeatCount="indefinite"/>`;
    }
    if (isSel) {
      el("circle", { cx, cy, r: r + 7, fill: "none", stroke: "#e8c455", "stroke-width": 1, opacity: 0.9, filter: "url(#glow-big)" }, g);
      const orbits = el("g", {}, g);
      orbits.innerHTML =
        `<g><circle cx="${cx + r + 10}" cy="${cy}" r="1.7" fill="#e8c455" filter="url(#glow)"/>` +
        `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="4s" repeatCount="indefinite"/></g>` +
        `<g><circle cx="${cx - r - 15}" cy="${cy}" r="1.2" fill="#7c9ac9" opacity="0.9"/>` +
        `<animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="6.5s" repeatCount="indefinite"/></g>`;
    }
    const node = el("circle", {
      class: "node-core",
      cx, cy, r,
      fill: ev.approximate ? "none" : color,
      "fill-opacity": ev.approximate ? 0 : 0.92,
      stroke: color,
      "stroke-width": ev.approximate ? 1.6 : 0.8,
      "stroke-dasharray": ev.approximate ? "3 2.5" : "none",
      filter: isMatch ? "url(#glow)" : "none"
    }, g);
    if (ev.approximate) el("circle", { cx, cy, r: Math.max(1.4, r * 0.4), fill: color, opacity: 0.9 }, g);
    /* the anticipated wear a spectral white ring in every view */
    if (ev.future) el("circle", {
      class: "future-ring", cx, cy, r: r + 3.2, fill: "none",
      stroke: "#dce8ff", "stroke-width": 1, "stroke-dasharray": "1 2.6", opacity: 0.95
    }, g);
    return node;
  }
  function wireNode(g, ev, cx, cy, node, r) {
    g.classList.add("hit");
    g.dataset.id = ev.id;
    g.addEventListener("mouseenter", () => { showTooltip(ev, cx, cy); node.setAttribute("r", (r * 1.4).toFixed(2)); });
    g.addEventListener("mouseleave", () => { hideTooltip(); node.setAttribute("r", r); });
  }

  /* the standing web + the ignited thread */
  function drawWeb(nodePos) {
    clear(layers.web);
    clear(layers.links);
    WEB.forEach(([a, b]) => {
      const pa = nodePos[a], pb = nodePos[b];
      if (!pa || !pb) return;
      el("line", { class: "web-line", x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y }, layers.web);
    });
    if (!state.selected || !nodePos[state.selected]) return;
    const src = nodePos[state.selected];
    (EVENT_BY_ID[state.selected].related || []).forEach(rid => {
      const dst = nodePos[rid];
      if (!dst) return;
      el("line", { class: "constellation", x1: src.x, y1: src.y, x2: dst.x, y2: dst.y }, layers.links);
      el("circle", { cx: dst.x, cy: dst.y, r: dst.r + 4, fill: "none", stroke: "#c9a227", "stroke-width": 0.7, opacity: 0.6 }, layers.links);
    });
  }
  function setCount(n) {
    document.getElementById("event-count").textContent = n + " of " + EVENTS.length + " records in view";
  }
  let enterTimer = null;
  function playEnter() {
    layers.events.classList.add("enter");
    let i = 0;
    for (const g of layers.events.children) g.style.animationDelay = ((i++ % 24) * 14) + "ms";
    clearTimeout(enterTimer);
    enterTimer = setTimeout(() => layers.events.classList.remove("enter"), 1000);
  }

  /* ---------- CHRONICLE events ---------- */
  function renderEvents() {
    clear(layers.events);
    hideTooltip();

    const L = lanes();
    const lh = plotH() / L.length;
    const laneIdx = Object.fromEntries(L.map((t, i) => [t.id, i]));
    const SUBROWS = L.length > 10 ? 2 : 3;
    const occupied = {}, labelEdge = {};

    const visible = EVENTS.filter(inView).sort((a, b) => a.startYear - b.startYear || b.importance - a.importance);
    let matchCount = 0;
    const nodePos = {};

    visible.forEach(ev => {
      const li = laneIdx[laneKeyOf(ev)];
      if (li == null) return;
      const isMatch = matches(ev);
      if (isMatch) matchCount++;

      const xs = x(ev.startYear);
      const xe = ev.endYear != null ? x(ev.endYear) : xs;
      const r = 2.4 + ev.importance * 0.55;
      const color = THEME_BY_ID[ev.theme].color;

      let sub = 0;
      for (let s = 0; s < SUBROWS; s++) {
        const key = li + ":" + s;
        if ((occupied[key] || -1e9) < xs - r * 2 - 2) { sub = s; break; }
        if (s === SUBROWS - 1) sub = (ev.importance % SUBROWS);
      }
      const key = li + ":" + sub;
      occupied[key] = Math.max(occupied[key] || -1e9, xe + r);

      const y = PLOT_TOP + li * lh + lh * (SUBROWS === 2 ? (0.35 + sub * 0.32) : (0.28 + sub * 0.24));
      nodePos[ev.id] = { x: xs, y, r };

      const g = el("g", { class: "evt", opacity: isMatch ? 1 : 0.07 }, layers.events);

      const unc = UNC[ev.id];
      if (unc) {
        const ux0 = x(unc[0]), ux1 = x(unc[1]);
        if (ux1 - ux0 > 1.5) {
          el("rect", {
            class: "unc-band", x: ux0, y: y - 5, width: ux1 - ux0, height: 10, rx: 5,
            fill: color, opacity: 0.13
          }, g);
          el("line", { x1: ux0, y1: y - 5, x2: ux0, y2: y + 5, stroke: color, "stroke-width": 0.8, opacity: 0.5, "stroke-dasharray": "2 2" }, g);
          el("line", { x1: ux1, y1: y - 5, x2: ux1, y2: y + 5, stroke: color, "stroke-width": 0.8, opacity: 0.5, "stroke-dasharray": "2 2" }, g);
        }
      }

      if (ev.endYear != null && xe - xs > 2) {
        el("line", {
          x1: xs, y1: y, x2: Math.min(xe, W + 40), y2: y,
          stroke: color, "stroke-width": Math.max(2.5, r * 0.85),
          "stroke-linecap": "round", opacity: 0.4,
          "stroke-dasharray": ev.approximate ? "6 5" : "none"
        }, g);
      }

      const isSel = state.selected === ev.id;
      const node = drawNode(g, ev, xs, y, r, isMatch, isSel);

      const est = ev.title.length * 6.4 + r + 10;
      const lastLabelEnd = labelEdge[key] || -1e9;
      const showLabel = isSel || (isMatch && xs - r > lastLabelEnd);
      if (showLabel) {
        el("text", {
          class: "evt-label" + (ev.importance >= 9 ? " major" : ""),
          x: xs + r + 5, y: y + 4
        }, g).textContent = ev.title;
        labelEdge[key] = xs + est;
      }
      wireNode(g, ev, xs, y, node, r);
    });

    drawWeb(nodePos);
    setCount(matchCount);
    updateReadout();
    scheduleHashUpdate();
  }

  /* ---------- ATLAS ---------- */
  function atlasFrame() {
    const GUTTER_H = 30;
    const mapTop = PLOT_TOP + 4;
    const mapH = plotH() - GUTTER_H - 10;
    const s = Math.min(W / 360, mapH / 180);
    const fw = 360 * s, fh = 180 * s;
    const fx = (W - fw) / 2;
    const fy = mapTop + (mapH - fh) / 2;
    return { s, fx, fy, fw, fh, fcx: fx + fw / 2, fcy: fy + fh / 2, GUTTER_H };
  }
  function projFn(F) {
    const S2 = F.s * mapView.k;
    return (lat, lon) => [
      F.fcx + ((lon + 180) - mapView.mcx) * S2,
      F.fcy + ((90 - lat) - mapView.mcy) * S2
    ];
  }
  function clampMapView() {
    mapView.k = Math.max(1, Math.min(16, mapView.k));
    const half = 180 / mapView.k;
    mapView.mcx = Math.max(half, Math.min(360 - half, mapView.mcx));
    const halfY = 90 / mapView.k;
    mapView.mcy = Math.max(halfY, Math.min(180 - halfY, mapView.mcy));
  }

  function renderAtlas() {
    clear(layers.map);
    clear(layers.events);
    hideTooltip();
    clampMapView();

    const F = atlasFrame();
    const project = projFn(F);
    const S2 = F.s * mapView.k;

    const clip = el("clipPath", { id: "map-clip" }, layers.map);
    el("rect", { x: F.fx, y: F.fy, width: F.fw, height: F.fh }, clip);
    el("rect", { class: "map-frame", x: F.fx, y: F.fy, width: F.fw, height: F.fh }, layers.map);

    const gMap = el("g", { "clip-path": "url(#map-clip)" }, layers.map);
    for (let lon = -150; lon <= 150; lon += 30) {
      const [gx] = project(0, lon);
      el("line", { class: "graticule", x1: gx, y1: F.fy, x2: gx, y2: F.fy + F.fh }, gMap);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const [, gy2] = project(lat, 0);
      el("line", { class: "graticule" + (lat === 0 ? " equator" : ""), x1: F.fx, y1: gy2, x2: F.fx + F.fw, y2: gy2 }, gMap);
    }
    const [lx, ly] = project(90, -180);
    const countryTf = `translate(${lx},${ly}) scale(${S2})`;
    const countryGlow = new Map();           /* countryIdx → {o, c} — land ignites with its events */
    if (COUNTRIES) {
      /* every nation of the atlas as its own engraved polygon */
      const gC = el("g", { transform: countryTf }, gMap);
      COUNTRIES.forEach(c => {
        const p = el("path", { class: "map-country", d: c.d, "vector-effect": "non-scaling-stroke" }, gC);
        el("title", {}, p).textContent = c.n;
      });
    } else {
      el("path", {
        class: "map-land", d: WORLD,
        transform: countryTf,
        "vector-effect": "non-scaling-stroke"
      }, gMap);
      if (window.ARCHIVUS_BORDERS) {
        el("path", {
          class: "map-border", d: window.ARCHIVUS_BORDERS,
          transform: countryTf,
          "vector-effect": "non-scaling-stroke"
        }, gMap);
      }
    }

    el("text", { class: "map-caption", x: F.fx + 8, y: F.fy + 16 }, layers.map)
      .textContent = "THE WORLD · " + fmtYear(Math.round(state.t0)) + " — " + fmtYear(Math.round(state.t1)) +
        (mapView.k > 1.01 ? " · " + mapView.k.toFixed(1) + "× (double-click to reset)" : "");
    if (playMode) {
      el("text", { class: "map-year-big", x: F.fx + F.fw - 12, y: F.fy + 34, "text-anchor": "end" }, layers.map)
        .textContent = fmtYear(Math.round(state.t1));
    }

    const gy = plotBottom() - F.GUTTER_H / 2;
    el("line", { class: "lane-line", x1: 0, y1: plotBottom() - F.GUTTER_H, x2: W, y2: plotBottom() - F.GUTTER_H }, layers.map);
    el("text", { class: "lane-label", x: 8, y: plotBottom() - F.GUTTER_H + 13, fill: "#8f9ab5", opacity: 0.6 }, layers.map)
      .textContent = "Global currents (unplaced)";

    const gPlaced = el("g", { "clip-path": "url(#map-clip)" }, layers.events);
    const visible = EVENTS.filter(inView);
    let matchCount = 0;
    const nodePos = {};
    const labelEdges = [];

    /* the unplaced shelf: global events get clean, evenly-spaced slots in
       time order — never piled onto the log scale's crushed modern end */
    const unplaced = visible.filter(e => !GEO[e.id] && matches(e)).sort((a, b) => a.startYear - b.startYear);
    const gSlot = {};
    unplaced.forEach((e, i) => gSlot[e.id] = i);
    const gRowLen = Math.max(1, Math.ceil(unplaced.length / 2));

    visible.sort((a, b) => b.importance - a.importance).forEach(ev => {
      const isMatch = matches(ev);
      if (isMatch) matchCount++;
      const r = 2.4 + ev.importance * 0.55;
      let cx, cy, parent;
      const geo = GEO[ev.id];
      if (geo) {
        [cx, cy] = project(geo[0], geo[1]);
        if (cx < F.fx - 20 || cx > F.fx + F.fw + 20 || cy < F.fy - 20 || cy > F.fy + F.fh + 20) return;
        const h = hashOf(ev.id);
        const spread = Math.min(3, mapView.k) * 1.6;
        cx += ((h % 7) - 3) * spread;
        cy += (((h >> 3) % 7) - 3) * spread;
        parent = gPlaced;
      } else {
        const si = gSlot[ev.id];
        if (si == null) return;                          /* filtered out */
        const col = si % gRowLen, row = Math.floor(si / gRowLen);
        cx = 140 + (W - 180) * (gRowLen > 1 ? col / (gRowLen - 1) : 0.5);
        cy = gy - 7 + row * 15;
        parent = layers.events;
      }
      nodePos[ev.id] = { x: cx, y: cy, r };

      const g = el("g", { class: "evt", opacity: isMatch ? 1 : 0.06 }, parent);

      /* time-play ignition: events just entered by the sweeping window flash */
      if (playMode && geo) {
        const fw = Math.max(60, (state.t1 - state.t0) * 0.05);
        const d = state.t1 - ev.startYear;
        if (d >= 0 && d < fw) {
          const f = 1 - d / fw;
          el("circle", { class: "ignite", cx, cy, r: r + 3 + (1 - f) * 30, fill: "none",
            stroke: THEME_BY_ID[ev.theme].color, "stroke-width": 1.6 * f, opacity: (0.85 * f).toFixed(2) }, g);
          el("circle", { class: "ignite", cx, cy, r: r * (1 + f * 0.9), fill: THEME_BY_ID[ev.theme].color,
            opacity: (0.35 * f).toFixed(2), filter: "url(#glow-big)" }, g);
          /* the land itself catches the fire */
          const ci = GEO_CTRY[ev.id];
          if (ci != null) {
            const prev = countryGlow.get(ci), o = 0.30 * f;
            if (!prev || o > prev.o) countryGlow.set(ci, { o, c: THEME_BY_ID[ev.theme].color });
          }
        } else if (d >= fw && d < fw * 3.5) {
          /* dying ember: a soft after-glow so ignitions linger legibly */
          const f2 = 1 - (d - fw) / (fw * 2.5);
          el("circle", { class: "ignite", cx, cy, r: r + 2.5, fill: THEME_BY_ID[ev.theme].color,
            opacity: (0.18 * f2).toFixed(2), filter: "url(#glow)" }, g);
          const ci2 = GEO_CTRY[ev.id];
          if (ci2 != null) {
            const prev2 = countryGlow.get(ci2), o2 = 0.10 * f2;
            if (!prev2 || o2 > prev2.o) countryGlow.set(ci2, { o: o2, c: THEME_BY_ID[ev.theme].color });
          }
        }
      }

      const node = drawNode(g, ev, cx, cy, r, isMatch, state.selected === ev.id);

      const wantLabel = (state.selected === ev.id) || (geo && isMatch && !playMode && (ev.importance >= (mapView.k < 2 ? 9 : 8) || mapView.k >= 4)) || (playMode && geo && isMatch && ev.importance >= 9 && (state.t1 - ev.startYear) < (state.t1 - state.t0) * 0.15 && (state.t1 - ev.startYear) >= 0);
      if (wantLabel) {
        const est = ev.title.length * 6.4;
        const clash = labelEdges.some(b => Math.abs(b.y - cy) < 12 && cx + 6 < b.x1 && cx + 6 + est > b.x0);
        if (!clash || state.selected === ev.id) {
          el("text", { class: "evt-label" + (ev.importance >= 9 ? " major" : ""), x: cx + r + 4, y: cy + 4 }, g)
            .textContent = ev.title;
          labelEdges.push({ y: cy, x0: cx + 6, x1: cx + 6 + est });
        }
      }
      wireNode(g, ev, cx, cy, node, r);
    });

    /* a selected record lights its whole country softly, even at rest */
    if (COUNTRIES && !playMode && state.selected && GEO_CTRY[state.selected] != null && EVENT_BY_ID[state.selected]) {
      countryGlow.set(GEO_CTRY[state.selected], { o: 0.15, c: THEME_BY_ID[EVENT_BY_ID[state.selected].theme].color });
    }
    if (COUNTRIES && countryGlow.size) {
      const gGlow = el("g", { transform: countryTf, "pointer-events": "none" }, gMap);
      countryGlow.forEach((v, ci) => el("path", { d: COUNTRIES[ci].d, fill: v.c, opacity: v.o.toFixed(2) }, gGlow));
    }

    drawWeb(playMode ? {} : nodePos);   /* clear the web during playback — let the ignitions read */
    setCount(matchCount);
    updateReadout();
    scheduleHashUpdate();
  }

  /* ---------- CODEX WHEEL ---------- */
  function renderWheel() {
    clear(layers.wheel);
    clear(layers.events);
    hideTooltip();

    const cx = W / 2, cy = PLOT_TOP + plotH() / 2;
    const Rout = Math.min(W, plotH()) / 2 - 8;
    const Rmax = Rout - 36;
    const Rin = Math.max(60, Rout * 0.30);
    const ringGap = (Rmax - Rin) / (THEMES.length - 1);
    const A0 = -80, SWEEP = 340;
    const u0 = uOf(state.t0), u1 = uOf(state.t1);
    const aOf = t => (A0 + (u0 - uOf(Math.min(t, MAX_YEAR))) / (u0 - u1) * SWEEP) * Math.PI / 180;
    const polar = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const arcPath = (r, a1, a2) => {
      const [x1, y1] = polar(r, a1), [x2, y2] = polar(r, a2);
      const large = (a2 - a1) > Math.PI ? 1 : 0;
      return `M${x1} ${y1}A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    };

    ERAS.forEach((era, i) => {
      const s = Math.max(era.start, state.t0), e = Math.min(Math.min(era.end, MAX_YEAR), state.t1);
      if (e <= s) return;
      const a1 = aOf(s), a2 = aOf(e);
      const p = el("path", {
        class: "wheel-era", d: arcPath(Rout - 9, a1 + 0.004, Math.max(a1 + 0.006, a2 - 0.004)),
        fill: "none",
        stroke: i % 2 ? "rgba(201,162,39,0.20)" : "rgba(124,154,201,0.18)",
        "stroke-width": 15
      }, layers.wheel);
      el("title", {}, p).textContent = era.name + " — click to open this era's record";
      p.style.cursor = "pointer";
      p.addEventListener("click", ev => { ev.stopPropagation(); zoomToEra(era); showEraRecord(era); });
      if ((a2 - a1) > 0.55) {
        const mid = (a1 + a2) / 2;
        const [tx, ty] = polar(Rout - 9, mid);
        el("text", {
          class: "wheel-era-label", x: tx, y: ty + 3, "text-anchor": "middle",
          transform: `rotate(${mid * 180 / Math.PI + (Math.cos(mid) < 0 ? -90 : 90)} ${tx} ${ty})`
        }, layers.wheel).textContent = era.name;
      }
    });

    THEMES.forEach((t, i) => {
      const r = Rmax - i * ringGap;
      el("circle", { class: "wheel-ring", cx, cy, r }, layers.wheel);
      const [kx, ky] = polar(r, -90 * Math.PI / 180);
      el("circle", { cx: kx, cy: ky, r: 2, fill: t.color, opacity: 0.7 }, layers.wheel);
    });

    let arcPos = 0.02;
    while (arcPos < 0.98) {
      const uu = u0 - arcPos * (u0 - u1);
      const tHere = tOf(uu);
      const tNext = tOf(u0 - Math.min(0.98, arcPos + 0.12) * (u0 - u1));
      const local = Math.max(1, tNext - tHere);
      const step = STEPS.find(s => s >= local * 0.8) || 200000;
      const year = Math.ceil(tHere / step) * step;
      if (year < state.t1) {
        const a = aOf(year);
        const [x1, y1] = polar(Rout - 20, a), [x2, y2] = polar(Rout - 16, a);
        el("line", { x1, y1, x2, y2, class: "axis-line" }, layers.wheel);
        const [tx, ty] = polar(Rout + 6, a);
        el("text", {
          class: "axis-tick-label", x: tx, y: ty + 3,
          "text-anchor": Math.abs(Math.cos(a)) < 0.3 ? "middle" : (Math.cos(a) > 0 ? "start" : "end")
        }, layers.wheel).textContent = year === 0 ? "YR 1" : fmtYear(year);
      }
      arcPos += 0.115;
    }
    if (state.t0 < 0 && state.t1 > 0) {
      const a = aOf(0);
      const [x1, y1] = polar(Rin - 12, a), [x2, y2] = polar(Rout - 2, a);
      el("line", { class: "meridian", x1, y1, x2, y2 }, layers.wheel);
    }

    el("circle", { cx, cy, r: Rin - 24, class: "wheel-center-disc" }, layers.wheel);
    el("text", { class: "wheel-center-title", x: cx, y: cy - 6, "text-anchor": "middle" }, layers.wheel)
      .textContent = "ARCHIVUS";
    if (spinMode) {
      const hA = (A0 + spinProg * SWEEP) * Math.PI / 180;
      const hYear = tOf(u0 - spinProg * (u0 - u1));
      el("text", { class: "wheel-year-big", x: cx, y: cy + 22, "text-anchor": "middle" }, layers.wheel)
        .textContent = fmtYear(Math.round(hYear));
      const [hx1, hy1] = polar(Rin - 20, hA), [hx2, hy2] = polar(Rout - 2, hA);
      el("line", { class: "wheel-hand", x1: hx1, y1: hy1, x2: hx2, y2: hy2 }, layers.wheel);
      const [tx2, ty2] = polar(Rout - 2, hA);
      el("circle", { class: "wheel-hand-tip", cx: tx2, cy: ty2, r: 3.5 }, layers.wheel);
    } else {
      el("text", { class: "wheel-center-sub", x: cx, y: cy + 12, "text-anchor": "middle" }, layers.wheel)
        .textContent = fmtYear(Math.round(state.t0)) + " — " + fmtYear(Math.round(state.t1));
    }

    const visibleAll = EVENTS.filter(inView);
    const matchCount = visibleAll.filter(matches).length;
    const CAP = 130;
    const chosen = visibleAll
      .slice()
      .sort((a, b) => (matches(b) - matches(a)) || b.importance - a.importance)
      .slice(0, CAP);

    const nodePos = {};
    const ringOccupied = THEMES.map(() => []);
    const handA = spinMode ? (A0 + spinProg * SWEEP) * Math.PI / 180 : null;
    const TRAIL = 16 * Math.PI / 180;

    chosen.sort((a, b) => b.importance - a.importance).forEach(ev => {
      const isMatch = matches(ev);
      const ringI = THEMES.findIndex(t => t.id === ev.theme);
      const rr = Rmax - ringI * ringGap;
      const r = 2.2 + ev.importance * 0.5;
      const a1 = aOf(Math.max(ev.startYear, state.t0));
      const arc = rr * a1;
      const grain = ringOccupied[ringI].some(p => Math.abs(p - arc) < r + 6);
      if (!grain) ringOccupied[ringI].push(arc);

      const [px, py] = polar(rr, a1);
      nodePos[ev.id] = { x: px, y: py, r: grain ? 1.4 : r };

      /* spin: unlit ahead of the hand, ignite as it passes, lit behind */
      let op = isMatch ? 1 : 0.06;
      let flash = 0;
      if (spinMode && handA != null) {
        const delta = handA - a1;
        if (delta < 0) op = Math.min(op, 0.1);
        else if (delta < TRAIL) flash = 1 - delta / TRAIL;
      }
      const g = el("g", { class: "evt", opacity: op }, layers.events);
      const color = THEME_BY_ID[ev.theme].color;
      if (flash > 0) {
        el("circle", { class: "ignite", cx: px, cy: py, r: r + 3 + (1 - flash) * 24, fill: "none",
          stroke: color, "stroke-width": 1.6 * flash, opacity: (0.9 * flash).toFixed(2) }, g);
        el("circle", { class: "ignite", cx: px, cy: py, r: r * (1 + flash), fill: color,
          opacity: (0.4 * flash).toFixed(2), filter: "url(#glow-big)" }, g);
        if (ev.importance >= 8 && flash > 0.55) {
          const outw = Math.cos(a1) >= 0;
          el("text", { class: "evt-label major", x: px + (outw ? r + 6 : -r - 6), y: py + 4,
            "text-anchor": outw ? "start" : "end" }, g).textContent = ev.title;
        }
      }

      if (!grain && ev.endYear != null && ev.endYear > ev.startYear && (ev.importance >= 7 || chosen.length < 70)) {
        const a2 = aOf(Math.min(ev.endYear, state.t1));
        if (a2 - a1 > 0.012) {
          el("path", {
            d: arcPath(rr, a1, a2), fill: "none",
            stroke: color, "stroke-width": Math.max(2, r * 0.7),
            "stroke-linecap": "round", opacity: 0.32,
            "stroke-dasharray": ev.approximate ? "5 5" : "none"
          }, g);
        }
      }

      let node;
      if (grain) {
        node = el("circle", { class: "node-core", cx: px, cy: py, r: 1.4, fill: color, "fill-opacity": 0.8 }, g);
      } else {
        node = drawNode(g, ev, px, py, r, isMatch, state.selected === ev.id);
      }

      if (!grain && (state.selected === ev.id || (isMatch && ev.importance >= 9))) {
        const outward = Math.cos(a1) >= 0;
        el("text", {
          class: "evt-label major", x: px + (outward ? r + 4 : -r - 4), y: py + 4,
          "text-anchor": outward ? "start" : "end"
        }, g).textContent = ev.title;
      }
      wireNode(g, ev, px, py, node, grain ? 1.4 : r);
    });

    drawWeb(nodePos);
    setCount(matchCount);
    updateReadout();
    scheduleHashUpdate();
  }

  /* ---------- overview strip ---------- */
  function renderOverview() {
    clear(layers.overview);
    const y0 = H - OV_H - 5;
    el("rect", { class: "ov-bg", x: 16, y: y0, width: W - 32, height: OV_H, rx: 3 }, layers.overview);
    ERAS.forEach(era => {
      if (era.end < OV0) return;
      el("line", { x1: ovX(era.start), y1: y0, x2: ovX(era.start), y2: y0 + OV_H, stroke: "#1a1f2c" }, layers.overview);
    });
    EVENTS.forEach(ev => {
      if (ev.importance < 8 || ev.startYear < OV0) return;
      el("circle", {
        class: "ov-dot", cx: ovX(ev.startYear), cy: y0 + OV_H / 2,
        r: 1.6, fill: THEME_BY_ID[ev.theme].color, opacity: 0.75
      }, layers.overview);
    });
    el("line", { x1: ovX(0), y1: y0, x2: ovX(0), y2: y0 + OV_H, stroke: "#6e5c1f", "stroke-dasharray": "2 3" }, layers.overview);

    const hit = el("rect", { class: "ov-hit", x: 16, y: y0, width: W - 32, height: OV_H }, layers.overview);
    hit.addEventListener("click", e => {
      const rect = svg.getBoundingClientRect();
      const t = ovInv(e.clientX - rect.left);
      const halfU = (uOf(state.t0) - uOf(state.t1)) / 2;
      const uc = uOf(Math.max(MIN_YEAR, Math.min(t, MAX_YEAR - 1)));
      flyTo(tOf(uc + halfU), tOf(uc - halfU), 650);
    });
    el("title", {}, hit).textContent = "All of recorded history — click to travel, drag the gold window to scrub";

    const bx0 = ovX(state.t0), bx1 = ovX(state.t1);
    const brush = el("rect", {
      class: "ov-brush", x: bx0, y: y0,
      width: Math.max(3, bx1 - bx0), height: OV_H, rx: 2
    }, layers.overview);
    let drag = null;
    brush.addEventListener("pointerdown", e => {
      e.stopPropagation();
      haltMotion();
      drag = { px: e.clientX, t0: state.t0, t1: state.t1 };
      brush.setPointerCapture(e.pointerId);
    });
    brush.addEventListener("pointermove", e => {
      if (!drag) return;
      const dt = (e.clientX - drag.px) / (W - 32) * (OV1 - OV0);
      setDomain(drag.t0 + dt, drag.t1 + dt);
    });
    brush.addEventListener("pointerup", () => { drag = null; });
  }

  /* ---------- tooltip ---------- */
  function showTooltip(ev, px, py) {
    tooltip.innerHTML =
      '<div class="tt-title">' + escapeHtml(ev.title) + "</div>" +
      '<div class="tt-date">' + fmtRange(ev) + " · " + escapeHtml(THEME_BY_ID[ev.theme].name) + " · " + escapeHtml(ev.region) + "</div>";
    tooltip.hidden = false;
    const tw = tooltip.offsetWidth;
    tooltip.style.left = Math.min(W - tw - 10, Math.max(6, px + 14)) + "px";
    tooltip.style.top = Math.max(6, py - 48) + "px";
  }
  function hideTooltip() { tooltip.hidden = true; }

  /* ---------- readout ---------- */
  function updateReadout() {
    const mid = tOf((uOf(state.t0) + uOf(state.t1)) / 2);
    const era = ERAS.find(e => mid >= e.start && mid < e.end);
    document.getElementById("readout-era").textContent = era ? era.name : "Deep Time";
    document.getElementById("readout-span").textContent =
      fmtYear(Math.round(state.t0)) + "  —  " + fmtYear(Math.round(state.t1));
  }

  /* ---------- panel (slide-in overlay) ---------- */
  const panel = document.getElementById("panel");
  const panelContent = document.getElementById("panel-content");
  const panelOracle = document.getElementById("panel-oracle");

  function setPanelMode(mode) {
    state.panelMode = mode;
    panel.classList.toggle("open", mode !== "empty");
    panelContent.hidden = mode !== "event";
    panelOracle.hidden = mode !== "oracle" && mode !== "era";
  }
  function closePanel() {
    state.selected = null;
    setPanelMode("empty");
    renderCurrentEvents();
  }
  function evtLink(ev) {
    const d = document.createElement("span");
    d.className = "o-evt";
    d.innerHTML = '<span class="oe-date">' + fmtRange(ev) + "</span>" + escapeHtml(ev.title);
    d.addEventListener("click", () => revealEvent(ev.id));
    return d;
  }
  function revealEvent(id) {
    const ev = EVENT_BY_ID[id];
    if (!ev) return;
    /* always frame the event, don't just mark it — a reveal should feel like arrival */
    const evSpan = ev.endYear != null ? ev.endYear - ev.startYear : 0;
    const half = Math.max(260, evSpan * 2.4) / 2 + 40;
    const mid = ev.endYear != null ? (ev.startYear + ev.endYear) / 2 : ev.startYear;
    flyTo(mid - half, mid + half, 850);
    setTimeout(() => { if (!state.selected || state.selected !== id) select(id); else renderCurrentEvents(); }, 880);
    state.selected = id;
    renderEventPanel();
  }

  function select(id) {
    state.selected = id;
    renderCurrentEvents();
    renderEventPanel();
  }
  function renderEventPanel() {
    const ev = state.selected ? EVENT_BY_ID[state.selected] : null;
    if (!ev) { setPanelMode("empty"); return; }
    setPanelMode("event");

    const theme = THEME_BY_ID[ev.theme];
    const era = ERA_BY_ID[ev.era];
    document.getElementById("panel-kicker").textContent = "Record · " + (era ? era.name : ev.era);
    document.getElementById("panel-title").textContent = ev.title;

    let dateTxt = fmtRange(ev);
    const unc = UNC[ev.id];
    if (unc) dateTxt += "   ·   dating range " + fmtYear(unc[0]) + " – " + fmtYear(unc[1]);
    document.getElementById("panel-date").textContent = dateTxt;

    const meta = document.getElementById("panel-meta");
    meta.innerHTML = "";
    [
      { txt: theme.name, cls: "theme-tag", color: theme.color },
      { txt: ev.region },
      ev.civ ? { txt: ev.civ } : null,
      ev.approximate ? { txt: "date approximate" } : null,
      unc ? { txt: "dating contested" } : null
    ].filter(Boolean).forEach(t => {
      const s = document.createElement("span");
      s.className = "meta-tag" + (t.cls ? " " + t.cls : "");
      if (t.color) s.style.setProperty("--c", t.color);
      s.textContent = t.txt;
      meta.appendChild(s);
    });

    document.getElementById("panel-desc").textContent = ev.desc;
    document.getElementById("panel-importance").innerHTML =
      '<span class="label">Weight in the archive · ' + ev.importance + '/10</span>' +
      '<span class="imp-track"><span class="imp-fill" style="width:' + (ev.importance * 10) + '%"></span></span>';
    document.getElementById("panel-source").href = ev.source;

    const relWrap = document.getElementById("panel-related-wrap");
    const rel = document.getElementById("panel-related");
    rel.innerHTML = "";
    const related = (ev.related || []).map(i => EVENT_BY_ID[i]).filter(Boolean);
    relWrap.style.display = related.length ? "" : "none";
    related.forEach(re => {
      const d = document.createElement("div");
      d.className = "related-link";
      d.innerHTML = '<span class="rl-date">' + fmtRange(re) + "</span>" + escapeHtml(re.title);
      d.addEventListener("click", () => revealEvent(re.id));
      rel.appendChild(d);
    });

    /* the codex speaks: esoteric claims that touch this event */
    const txw = document.getElementById("panel-tx");
    if (txw) {
      const txs = TX_BY_EVENT[ev.id] || [];
      txw.innerHTML = txs.length
        ? '<div class="kicker">In the Transmissions codex</div>' + txs.map(t =>
            '<a class="tx-jump" href="transmissions.html#' + t.id + '">⟡ ' +
            escapeHtml(t.transmitter) + ' <span style="opacity:.6">·</span> ' + escapeHtml(t.claimSource) + "</a>").join("")
        : "";
    }
  }

  /* ---------- panel: era record ---------- */
  function showEraRecord(era) {
    state.selected = null;
    renderCurrentEvents();
    setPanelMode("era");
    panelOracle.innerHTML = "";
    const kick = document.createElement("div");
    kick.className = "kicker"; kick.textContent = "Era Record";
    const title = document.createElement("div");
    title.className = "o-title"; title.textContent = era.name;
    const span = document.createElement("div");
    span.className = "o-span";
    span.textContent = fmtYear(era.start) + " — " + fmtYear(era.end);
    const prose = document.createElement("p");
    prose.className = "o-prose"; prose.textContent = era.blurb;
    panelOracle.append(kick, title, span, prose);

    const inEra = EVENTS.filter(e => e.era === era.id).sort((a, b) => b.importance - a.importance);
    const hr = document.createElement("hr"); hr.className = "o-divider";
    const k2 = document.createElement("div");
    k2.className = "kicker"; k2.textContent = inEra.length + " records held · heaviest first";
    panelOracle.append(hr, k2);
    inEra.slice(0, 10).forEach(e => panelOracle.appendChild(evtLink(e)));
  }

  /* ---------- panel: the Oracle ---------- */
  function consultOracle() {
    state.selected = null;
    renderCurrentEvents();
    setPanelMode("oracle");
    panelOracle.innerHTML = "";

    const t0 = state.t0, t1 = state.t1;
    const win = EVENTS.filter(inView).filter(matches);
    const kick = document.createElement("div");
    kick.className = "kicker"; kick.textContent = "The Oracle Speaks";
    const title = document.createElement("div");
    title.className = "o-title"; title.textContent = "On this window of time";
    const span = document.createElement("div");
    span.className = "o-span";
    span.textContent = fmtYear(Math.round(t0)) + " — " + fmtYear(Math.round(t1)) +
      (state.themes.size || state.region || state.era || state.query ? " · as filtered" : "");
    panelOracle.append(kick, title, span);

    if (!win.length) {
      const p = document.createElement("p");
      p.className = "o-prose";
      p.textContent = "The archive holds no records for this window under the current filters. Widen the view, or lift a filter, and ask again.";
      panelOracle.appendChild(p);
      return;
    }

    const spanned = ERAS
      .map(e => ({ e, ov: Math.min(t1, e.end) - Math.max(t0, e.start) }))
      .filter(o => o.ov > 0)
      .sort((a, b) => b.ov - a.ov);

    const counts = {};
    win.forEach(e => { counts[e.theme] = (counts[e.theme] || 0) + 1; });
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const domThemes = ranked.slice(0, 2).map(r => THEME_BY_ID[r[0]].name.toLowerCase());

    const regions = new Set(win.map(e => e.region));
    const civs = [...new Set(win.map(e => e.civ).filter(Boolean))];
    const heavy = win.slice().sort((a, b) => b.importance - a.importance);
    const begins = win.filter(e => e.startYear >= t0 && e.startYear <= t1).sort((a, b) => b.importance - a.importance);
    const ends = win.filter(e => e.endYear != null && e.endYear >= t0 && e.endYear <= t1).sort((a, b) => b.importance - a.importance);
    const through = win.filter(e => e.startYear < t0 && e.endYear != null && e.endYear > t1);

    const p = document.createElement("p");
    p.className = "o-prose";
    let prose = "The archive holds <em>" + win.length + " records</em> in this window";
    if (spanned.length === 1) prose += ", all within the " + spanned[0].e.name + ".";
    else prose += ", spanning " + spanned.slice(0, 3).map(o => o.e.name).join(", ") +
      (spanned.length > 3 ? " and beyond." : ".");
    if (domThemes.length) prose += " Its chronicle is dominated by <em>" + domThemes.join("</em> and <em>") + "</em>.";
    prose += " " + (regions.size >= 7 ? "The whole inhabited world speaks here."
      : regions.size >= 4 ? "Voices reach the archive from " + regions.size + " regions."
      : "Its records are concentrated in " + [...regions].slice(0, 3).join(", ") + ".");
    if (civs.length >= 3) prose += " Among the powers active: <em>" + civs.slice(0, 5).join("</em>, <em>") + "</em>.";
    if (through.length) prose += " And running beneath everything, older and longer than this window itself: " +
      through.slice(0, 3).map(e => "<em>" + escapeHtml(e.title) + "</em>").join(", ") + ".";
    p.innerHTML = prose;
    panelOracle.appendChild(p);

    const hr1 = document.createElement("hr"); hr1.className = "o-divider";
    const kb = document.createElement("div");
    kb.className = "kicker"; kb.textContent = "Balance of themes";
    panelOracle.append(hr1, kb);
    const maxN = ranked.length ? ranked[0][1] : 1;
    const sec = document.createElement("div"); sec.className = "o-section";
    ranked.forEach(([tid, n]) => {
      const t = THEME_BY_ID[tid];
      const row = document.createElement("div"); row.className = "o-bar-row";
      row.innerHTML =
        '<span class="o-bar-name">' + escapeHtml(t.name) + '</span>' +
        '<span class="o-bar-track"><span class="o-bar-fill" style="--c:' + t.color + ';width:' + Math.round(n / maxN * 100) + '%"></span></span>' +
        '<span class="o-bar-n">' + n + "</span>";
      sec.appendChild(row);
    });
    panelOracle.appendChild(sec);

    const hr2 = document.createElement("hr"); hr2.className = "o-divider";
    const kh = document.createElement("div");
    kh.className = "kicker"; kh.textContent = "Heaviest records of this window";
    panelOracle.append(hr2, kh);
    heavy.slice(0, 6).forEach(e => panelOracle.appendChild(evtLink(e)));

    if (begins.length) {
      const hr3 = document.createElement("hr"); hr3.className = "o-divider";
      const k3 = document.createElement("div");
      k3.className = "kicker"; k3.textContent = "Here begins";
      panelOracle.append(hr3, k3);
      begins.slice(0, 4).forEach(e => panelOracle.appendChild(evtLink(e)));
    }
    if (ends.length) {
      const k4 = document.createElement("div");
      k4.className = "kicker"; k4.style.marginTop = "14px"; k4.textContent = "And here ends";
      panelOracle.append(k4);
      ends.slice(0, 4).forEach(e => panelOracle.appendChild(evtLink(e)));
    }

    /* what the codex claims about this window */
    const txHits = TX.filter(t => t.record && typeof t.record.year === "number" &&
      t.record.year >= t0 && t.record.year <= t1);
    if (txHits.length) {
      const hr4 = document.createElement("hr"); hr4.className = "o-divider";
      const k5 = document.createElement("div");
      k5.className = "kicker"; k5.textContent = "Claims upon this window — the Transmissions";
      panelOracle.append(hr4, k5);
      txHits.slice(0, 3).forEach(t => {
        const a = document.createElement("a");
        a.className = "o-evt";
        a.href = "transmissions.html#" + t.id;
        a.innerHTML = '<span class="oe-date">' + escapeHtml(t.claimSource) + "</span>⟡ " +
          escapeHtml(t.transmitter) + " — " + escapeHtml(t.taught.length > 88 ? t.taught.slice(0, 87) + "…" : t.taught);
        panelOracle.appendChild(a);
      });
    }
  }

  /* ---------- deep links ---------- */
  let hashTimer = null, applyingHash = false;
  function scheduleHashUpdate() {
    if (applyingHash) return;
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      const parts = ["t0=" + Math.round(state.t0), "t1=" + Math.round(state.t1), "v=" + state.view];
      if (state.selected) parts.push("e=" + state.selected);
      try { history.replaceState(null, "", "#" + parts.join("&")); } catch (e) { /* sandboxed contexts */ }
    }, 250);
  }
  function applyHash() {
    if (!location.hash) return;
    const p = Object.fromEntries(location.hash.slice(1).split("&").map(kv => kv.split("=")));
    applyingHash = true;
    if (p.v && ["chronicle", "atlas", "wheel"].includes(p.v)) setView(p.v, true);
    if (p.t0 && p.t1 && !isNaN(+p.t0) && !isNaN(+p.t1) && +p.t1 > +p.t0) {
      [state.t0, state.t1] = clampDomain(+p.t0, +p.t1);
      renderTime();
      if (p.e && EVENT_BY_ID[p.e]) { state.selected = p.e; renderCurrentEvents(); renderEventPanel(); }
    } else if (p.e && EVENT_BY_ID[p.e]) {
      /* arriving from another instrument with only an event id: fly to it */
      applyingHash = false;
      revealEvent(p.e);
      return;
    }
    applyingHash = false;
  }

  /* ---------- PNG export ---------- */
  function exportPNG() {
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", NS);
    clone.setAttribute("width", W);
    clone.setAttribute("height", H);
    let css = "";
    for (const sheet of document.styleSheets) {
      try { for (const r of sheet.cssRules) css += r.cssText + "\n"; } catch (e) { /* cross-origin sheet */ }
    }
    const style = document.createElementNS(NS, "style");
    style.textContent = css;
    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("width", "100%"); bg.setAttribute("height", "100%"); bg.setAttribute("fill", "#0a0c12");
    clone.insertBefore(style, clone.firstChild);
    clone.insertBefore(bg, style);

    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = W * 2; c.height = H * 2;
      const ctx = c.getContext("2d");
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(b => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = "archivus_" + state.view + "_" + Math.round(state.t0) + "_" + Math.round(state.t1) + ".png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      });
    };
    img.src = url;
  }

  /* ============================================================
     ATLAS TIME-PLAY — press play, watch civilization ignite.
     The window's left edge locks at 5000 BCE; the right edge
     sweeps (log-scaled, so dense eras get their time) to the
     present. Newly-entered events flash rings as they arrive.
     ============================================================ */
  let playMode = false, playAnim = null, playProg = 0, playSpeed = 1, playLastT1 = null;
  let spinMode = false, spinAnim = null, spinProg = 0;
  const PLAY_START = -5000, PLAY_HEAD0 = -4700, PLAY_DUR = 90000, SPIN_DUR = 32000;
  function playBtn() { return document.getElementById("play-btn"); }
  const feedEl = () => document.getElementById("play-feed");
  const eraEl = () => document.getElementById("play-era");
  function playChrome(on) {
    const s = document.getElementById("play-speed");
    if (s) s.hidden = !on;
    if (feedEl()) { feedEl().hidden = !on; if (!on) feedEl().innerHTML = ""; }
    if (eraEl()) { eraEl().hidden = !on; if (!on) eraEl().textContent = ""; }
  }
  function feedPush(ev) {
    const f = feedEl();
    if (!f) return;
    const d = document.createElement("div");
    d.className = "feed-item";
    d.style.setProperty("--c", THEME_BY_ID[ev.theme].color);
    d.innerHTML = '<span class="fy">' + fmtYear(ev.startYear, ev.approximate) + "</span>" + escapeHtml(ev.title);
    f.prepend(d);
    while (f.childElementCount > 7) f.removeChild(f.lastChild);
  }
  function eraBanner(t) {
    const era = ERAS.find(x => t >= x.start && t < x.end);
    const el2 = eraEl();
    if (!el2 || !era || el2.dataset.era === era.id) return;
    el2.dataset.era = era.id;
    el2.textContent = era.name;
    el2.classList.remove("flash");
    void el2.offsetWidth;                      /* restart the animation */
    el2.classList.add("flash");
  }
  function startPlay() {
    haltMotion();
    state.selected = null; setPanelMode("empty");
    if (playProg >= 1) playProg = 0;
    playMode = true;
    playLastT1 = tOf(uOf(PLAY_HEAD0) + (uOf(2045) - uOf(PLAY_HEAD0)) * playProg);
    playAnim = { baseP: playProg, start: performance.now() };
    playBtn().textContent = "⏸ Pause";
    playChrome(true);
    requestAnimationFrame(stepPlay);
  }
  function pausePlay() {
    playAnim = null; spinAnim = null;
    playBtn().textContent = playProg >= 1 || spinProg >= 1 ? "▶ Replay" : "▶ Resume";
  }
  function stopPlay() {
    playAnim = null; playMode = false; playProg = 0;
    spinAnim = null; spinMode = false; spinProg = 0;
    playChrome(false);
    if (playBtn()) playBtn().textContent = state.view === "wheel" ? "⟳ Spin the Wheel" : "▶ Play the Atlas";
    scheduleRender();
  }
  function togglePlay() {
    if (playAnim || spinAnim) return pausePlay();
    if (state.view === "wheel") startSpin(); else startPlay();
  }
  function stepPlay(now) {
    if (!playAnim) return;
    playProg = Math.min(1, playAnim.baseP + (now - playAnim.start) / (PLAY_DUR / playSpeed));
    const u0 = uOf(PLAY_HEAD0), u1 = uOf(2045);
    state.t0 = PLAY_START;
    state.t1 = tOf(u0 + (u1 - u0) * playProg);
    /* narrate: feed newly-ignited events, announce era changes */
    if (playLastT1 != null && state.t1 > playLastT1) {
      EVENTS.filter(e => e.startYear > playLastT1 && e.startYear <= state.t1 && e.importance >= 6)
        .sort((a, b) => a.startYear - b.startYear)
        .forEach(feedPush);
    }
    playLastT1 = state.t1;
    eraBanner(state.t1);
    scheduleRender();
    if (playProg >= 1) { pausePlay(); return; }
    requestAnimationFrame(stepPlay);
  }
  /* ---- the Wheel's hand: a golden sweep around the current window ---- */
  function startSpin() {
    haltMotion();
    state.selected = null; setPanelMode("empty");
    if (spinProg >= 1) spinProg = 0;
    spinMode = true;
    spinAnim = { baseP: spinProg, start: performance.now() };
    playBtn().textContent = "⏸ Pause";
    const s = document.getElementById("play-speed");
    if (s) s.hidden = false;
    requestAnimationFrame(stepSpin);
  }
  function stepSpin(now) {
    if (!spinAnim) return;
    spinProg = Math.min(1, spinAnim.baseP + (now - spinAnim.start) / (SPIN_DUR / playSpeed));
    scheduleRender();
    if (spinProg >= 1) { pausePlay(); return; }
    requestAnimationFrame(stepSpin);
  }

  /* ============================================================
     NARRATIVE TOURS — the oracle walks a thread, one flight
     at a time. Data: src/data/tours.js. Works in every view.
     ============================================================ */
  const TOURS = window.ARCHIVUS_TOURS || [];
  let tour = null;   /* { t, i } */
  const tourCard = () => document.getElementById("tour-card");
  const toursMenu = () => document.getElementById("tours-menu");
  function toggleToursMenu(force) {
    const m = toursMenu();
    const show = force != null ? force : m.hidden;
    m.hidden = !show;
    if (show && !m.childElementCount) {
      TOURS.forEach(t => {
        const d = document.createElement("div");
        d.className = "tour-item";
        d.innerHTML = '<div class="tt">' + escapeHtml(t.title) + '</div><div class="tb">' + escapeHtml(t.blurb) + "</div>";
        d.addEventListener("click", () => { m.hidden = true; startTour(t.id); });
        m.appendChild(d);
      });
    }
  }
  function startTour(id) {
    stopPlay();
    const t = TOURS.find(x => x.id === id);
    if (!t) return;
    tour = { t, i: 0 };
    tourCard().hidden = false;
    showTourStep();
  }
  function endTour() {
    tour = null;
    tourCard().hidden = true;
  }
  function showTourStep() {
    if (!tour) return;
    const s = tour.t.steps[tour.i];
    const ev = EVENT_BY_ID[s.e];
    document.getElementById("tour-kicker").textContent = tour.t.title;
    document.getElementById("tour-step").textContent = (tour.i + 1) + " / " + tour.t.steps.length + " · " + (ev ? ev.title : s.e);
    document.getElementById("tour-note").textContent = s.n;
    document.getElementById("tour-prev").disabled = tour.i === 0;
    document.getElementById("tour-next").textContent = tour.i === tour.t.steps.length - 1 ? "Finish ✦" : "Next ▶";
    if (ev) {
      const evSpan = (ev.endYear != null ? ev.endYear - ev.startYear : 0);
      const half = Math.max(220, evSpan * 2.2) / 2 + 40;
      const mid = ev.endYear != null ? (ev.startYear + ev.endYear) / 2 : ev.startYear;
      flyTo(mid - half, mid + half, 950);
      setTimeout(() => { if (tour && tour.t.steps[tour.i] === s) select(s.e); }, 980);
    }
  }
  function tourStep(dir) {
    if (!tour) return;
    if (dir > 0 && tour.i >= tour.t.steps.length - 1) return endTour();
    tour.i = Math.max(0, Math.min(tour.t.steps.length - 1, tour.i + dir));
    showTourStep();
  }

  /* ---------- orchestration ---------- */
  function renderCurrentEvents() {
    if (state.view === "atlas") renderAtlas();
    else if (state.view === "wheel") renderWheel();
    else renderEvents();
  }
  function renderTime() {
    renderEras();
    if (state.view === "chronicle") {
      clear(layers.map); clear(layers.wheel);
      renderLanesAxis();
      renderEvents();
    } else if (state.view === "atlas") {
      clear(layers.lanes); clear(layers.axis); clear(layers.wheel); clear(layers.cursor);
      renderAtlas();
    } else {
      clear(layers.lanes); clear(layers.axis); clear(layers.map); clear(layers.cursor);
      renderWheel();
    }
    renderOverview();
  }
  function renderAll() { measure(); renderStars(); renderTime(); }

  function setView(v, silent) {
    state.view = v;
    document.querySelectorAll(".view-btn").forEach(b =>
      b.classList.toggle("active", b.dataset.view === v));
    const pb = playBtn();
    if (pb) {
      pb.hidden = v === "chronicle";
      if (!playAnim && !spinAnim) pb.textContent = v === "wheel" ? "⟳ Spin the Wheel" : "▶ Play the Atlas";
    }
    if ((playMode && v !== "atlas") || (spinMode && v !== "wheel")) stopPlay();
    if (!silent) { renderTime(); playEnter(); }
  }

  /* ---------- pointer model ---------- */
  function buildPointer() {
    let p = null;
    const pts = new Map();                   /* live pointers, for touch pinch */
    let pinch = null;
    svg.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      haltMotion();
      if (playAnim || spinAnim) pausePlay();
      toggleToursMenu(false);
      const help = document.getElementById("help-overlay");
      if (help) help.hidden = true;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) {                  /* two fingers: pinch zoom */
        p = null;
        state.eraIdx = null;
        const [q1, q2] = [...pts.values()];
        pinch = { d0: Math.hypot(q1[0] - q2[0], q1[1] - q2[1]) || 1,
          mx: (q1[0] + q2[0]) / 2, my: (q1[1] + q2[1]) / 2,
          u0d: uOf(state.t0), u1d: uOf(state.t1), k0: mapView.k,
          mcx0: mapView.mcx, mcy0: mapView.mcy };
        return;
      }
      p = { id: e.pointerId, x0: e.clientX, y0: e.clientY, u0d: uOf(state.t0), u1d: uOf(state.t1), mcx0: mapView.mcx, mcy0: mapView.mcy, moved: false, vu: 0, lastX: e.clientX, lastT: performance.now() };
    });
    svg.addEventListener("pointermove", e => {
      updateTimeCursor(e);
      if (pts.has(e.pointerId)) pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pinch && pts.size === 2) {
        const [q1, q2] = [...pts.values()];
        const f = (Math.hypot(q1[0] - q2[0], q1[1] - q2[1]) || 1) / pinch.d0;
        if (state.view === "atlas") {
          const F = atlasFrame();
          const rect = svg.getBoundingClientRect();
          const mx = pinch.mx - rect.left, my = pinch.my - rect.top;
          const S2old = F.s * pinch.k0;
          const bx = pinch.mcx0 + (mx - F.fcx) / S2old;
          const by = pinch.mcy0 + (my - F.fcy) / S2old;
          mapView.k = Math.max(1, Math.min(24, pinch.k0 * f));
          const S2 = F.s * mapView.k;
          mapView.mcx = bx - (mx - F.fcx) / S2;
          mapView.mcy = by - (my - F.fcy) / S2;
        } else {
          const rect = svg.getBoundingClientRect();
          const frac = Math.max(0, Math.min(1, (pinch.mx - rect.left) / rect.width));
          const uf = pinch.u0d + frac * (pinch.u1d - pinch.u0d);
          const u0 = uf + (pinch.u0d - uf) / f;
          const u1 = uf + (pinch.u1d - uf) / f;
          setDomain(tOf(u0), tOf(u1));
        }
        scheduleRender();
        return;
      }
      if (!p || e.pointerId !== p.id) return;
      const dx = e.clientX - p.x0, dy = e.clientY - p.y0;
      if (!p.moved && Math.hypot(dx, dy) > 4) {
        p.moved = true;
        state.eraIdx = null;                 /* manual pan exits era-nav */
        svg.setPointerCapture(p.id);
        svg.classList.add("panning");
        hideTooltip();
      }
      if (!p.moved) return;
      const now = performance.now();
      const dtMs = Math.max(1, now - p.lastT);
      if (state.view === "atlas") {
        const F = atlasFrame();
        const S2 = F.s * mapView.k;
        mapView.mcx = p.mcx0 - dx / S2;
        mapView.mcy = p.mcy0 - dy / S2;
        scheduleRender();
      } else {
        const du = -dx / W * (p.u1d - p.u0d);
        p.vu = (-(e.clientX - p.lastX) / W * (p.u1d - p.u0d)) / dtMs;
        setDomain(tOf(p.u0d + du), tOf(p.u1d + du));
      }
      p.lastX = e.clientX; p.lastT = now;
    });
    svg.addEventListener("pointerup", e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (!p || e.pointerId !== p.id) return;
      const wasDrag = p.moved;
      const vu = p.vu;
      p = null;
      svg.classList.remove("panning");
      if (wasDrag) {
        if (state.view !== "atlas") coast(vu);
        return;
      }
      const hit = e.target.closest ? e.target.closest(".hit") : null;
      if (hit && hit.dataset.id) { select(hit.dataset.id); return; }
      if (e.target === svg) closePanel();
    });
    svg.addEventListener("pointercancel", e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; p = null; svg.classList.remove("panning"); });
    svg.addEventListener("mouseleave", () => { clear(layers.cursor); cursorLine = null; });

    svg.addEventListener("wheel", e => {
      e.preventDefault();
      haltMotion();
      state.eraIdx = null;                   /* manual zoom exits era-nav */
      if (state.view === "atlas") {
        const F = atlasFrame();
        const rect = svg.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const S2old = F.s * mapView.k;
        const bx = mapView.mcx + (mx - F.fcx) / S2old;
        const by = mapView.mcy + (my - F.fcy) / S2old;
        mapView.k = Math.max(1, Math.min(16, mapView.k * Math.pow(1.0018, -e.deltaY)));
        const S2new = F.s * mapView.k;
        mapView.mcx = bx - (mx - F.fcx) / S2new;
        mapView.mcy = by - (my - F.fcy) / S2new;
        scheduleRender();
      } else {
        zoomAbout(Math.pow(1.0011, e.deltaY), timeAtPointer(e));
      }
    }, { passive: false });

    svg.addEventListener("dblclick", e => {
      if (state.view === "atlas" && !(e.target.closest && e.target.closest(".hit"))) {
        mapView.k = 1; mapView.mcx = 180; mapView.mcy = 90;
        scheduleRender();
      }
    });
  }

  /* ---------- controls ---------- */
  function buildControls() {
    const chips = document.getElementById("theme-chips");
    THEMES.forEach(t => {
      const c = document.createElement("button");
      c.className = "chip";
      c.style.setProperty("--c", t.color);
      c.innerHTML = '<span class="dot"></span>' + t.name;
      c.addEventListener("click", () => {
        if (state.themes.has(t.id)) state.themes.delete(t.id);
        else state.themes.add(t.id);
        updateChips();
        renderCurrentEvents();
      });
      c.dataset.theme = t.id;
      chips.appendChild(c);
    });

    document.querySelectorAll(".view-btn").forEach(b =>
      b.addEventListener("click", () => setView(b.dataset.view)));
    document.getElementById("panel-close").addEventListener("click", closePanel);

    const eraSel = document.getElementById("era-filter");
    ERAS.forEach(e => {
      const o = document.createElement("option");
      o.value = e.id; o.textContent = e.name;
      eraSel.appendChild(o);
    });
    eraSel.addEventListener("change", () => {
      state.era = eraSel.value;
      if (state.era) zoomToEra(ERA_BY_ID[state.era]);
      else renderCurrentEvents();
    });

    const regSel = document.getElementById("region-filter");
    REGIONS.forEach(r => {
      const o = document.createElement("option");
      o.value = r; o.textContent = r;
      regSel.appendChild(o);
    });
    regSel.addEventListener("change", () => { state.region = regSel.value; renderCurrentEvents(); });

    const impSel = document.getElementById("imp-filter");
    if (impSel) impSel.addEventListener("change", () => { state.minImp = +impSel.value || 0; renderCurrentEvents(); });
    const futChk = document.getElementById("future-only");
    if (futChk) futChk.addEventListener("change", () => { state.futureOnly = futChk.checked; renderCurrentEvents(); });

    const lensSel = document.getElementById("lens");
    lensSel.addEventListener("change", () => {
      state.lens = lensSel.value;
      if (state.view === "chronicle") { renderLanesAxis(); renderEvents(); }
    });

    const search = document.getElementById("search");
    let debounce;
    search.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = search.value.trim().toLowerCase();
        renderCurrentEvents();
      }, 140);
    });
    /* Enter: fly to the strongest match */
    search.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const q = search.value.trim().toLowerCase();
      if (!q) return;
      const hits = EVENTS.filter(ev =>
        (ev.title + " " + ev.desc + " " + (ev.civ || "") + " " + ev.region).toLowerCase().includes(q))
        .sort((a, b) => {
          const at = a.title.toLowerCase().includes(q) ? 1 : 0;
          const bt = b.title.toLowerCase().includes(q) ? 1 : 0;
          return (bt - at) || b.importance - a.importance;
        });
      if (hits.length) { search.blur(); revealEvent(hits[0].id); }
    });

    document.getElementById("zoom-in").addEventListener("click", () => zoomAbout(1 / 1.5, invX(W / 2)));
    document.getElementById("zoom-out").addEventListener("click", () => zoomAbout(1.5, invX(W / 2)));
    document.getElementById("fit-recorded").addEventListener("click", () => flyTo(-4200, MAX_YEAR - 4, 900));
    document.getElementById("fit-all").addEventListener("click", () => flyTo(MIN_YEAR, MAX_YEAR, 900));
    document.getElementById("oracle-btn").addEventListener("click", consultOracle);
    document.getElementById("export-btn").addEventListener("click", exportPNG);
    document.getElementById("reset").addEventListener("click", resetAll);
    const pb = playBtn();
    if (pb) { pb.addEventListener("click", togglePlay); pb.hidden = state.view === "chronicle"; }
    const spd = document.getElementById("play-speed");
    if (spd) spd.addEventListener("click", () => {
      const cycle = [1, 2, 4, 0.5];
      playSpeed = cycle[(cycle.indexOf(playSpeed) + 1) % cycle.length];
      spd.textContent = (playSpeed === 0.5 ? "½" : playSpeed) + "×";
      if (playAnim) { playAnim = { baseP: playProg, start: performance.now() }; }
      if (spinAnim) { spinAnim = { baseP: spinProg, start: performance.now() }; }
    });
    const tb = document.getElementById("tours-btn");
    if (tb) tb.addEventListener("click", () => toggleToursMenu());
    ["tour-prev", "tour-next", "tour-end"].forEach(id => {
      const b = document.getElementById(id);
      if (!b) return;
      b.addEventListener("click", () => id === "tour-end" ? endTour() : tourStep(id === "tour-next" ? 1 : -1));
    });

    function resetAll() {
      haltMotion();
      stopPlay(); endTour();
      state.themes.clear(); state.region = ""; state.era = ""; state.query = ""; state.selected = null;
      state.lens = "theme";
      search.value = ""; eraSel.value = ""; regSel.value = ""; lensSel.value = "theme";
      mapView.k = 1; mapView.mcx = 180; mapView.mcy = 90;
      updateChips();
      flyTo(-12000, 2045, 800);
      setPanelMode("empty");
    }

    function updateChips() {
      document.querySelectorAll(".chip").forEach(c => {
        const on = state.themes.has(c.dataset.theme);
        c.classList.toggle("active", on);
        c.classList.toggle("dimmed", state.themes.size > 0 && !on);
      });
    }

    window.addEventListener("keydown", e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        if (e.key === "Escape") e.target.blur();
        return;
      }
      const du = (uOf(state.t0) - uOf(state.t1)) * 0.12;
      switch (e.key) {
        case "/": e.preventDefault(); search.focus(); break;
        case "+": case "=": zoomAbout(1 / 1.4, invX(W / 2)); break;
        case "-": case "_": zoomAbout(1.4, invX(W / 2)); break;
        case "ArrowLeft":
          if (state.eraIdx != null) { stepEra(-1); break; }
          haltMotion(); setDomain(tOf(uOf(state.t0) + du), tOf(uOf(state.t1) + du)); break;
        case "ArrowRight":
          if (state.eraIdx != null) { stepEra(1); break; }
          haltMotion(); setDomain(tOf(uOf(state.t0) - du), tOf(uOf(state.t1) - du)); break;
        case "o": case "O": consultOracle(); break;
        case "t": case "T": toggleToursMenu(); break;
        case "?": { const h = document.getElementById("help-overlay"); if (h) h.hidden = !h.hidden; break; }
        case " ": if (state.view === "atlas") { e.preventDefault(); togglePlay(); } break;
        case "ArrowDown": if (tour) { e.preventDefault(); tourStep(1); } break;
        case "ArrowUp": if (tour) { e.preventDefault(); tourStep(-1); } break;
        case "1": setView("chronicle"); break;
        case "2": setView("atlas"); break;
        case "3": setView("wheel"); break;
        case "4": location.href = "astrolabe.html"; break;
        case "5": location.href = "codex.html"; break;
        case "Escape": state.eraIdx = null; if (tour) { endTour(); break; } if (playMode || spinMode) { stopPlay(); break; } closePanel(); break;
      }
    });
  }

  /* ---------- boot ---------- */
  buildControls();
  buildPointer();
  renderAll();
  applyHash();
  playEnter();
  window.addEventListener("hashchange", applyHash);
  new ResizeObserver(() => renderAll()).observe(wrap);
})();
