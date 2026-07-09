/* ============================================================
   ARCHIVUS — THE BLOODLINE renderer v3 "Final Finish"

   Structure and semantics are the owner's board (lineage2.js):
   descent edges, marriage/union edges, generation gaps, houses.
   Geometry is now a computed tidy layout — strict generation
   tiers, centered parents, wide terminal fans folded into
   2–3 column stacks — compact and aligned.

   Table of Nations: nodes that ARE peoples/cultures render as
   pennanted pills; the branch leading into a people carries an
   arrowhead; progenitors show their culture designation as a
   sub-label (Gomer — Cimmerians, Javan — Ionians…).
   ============================================================ */
(function () {
  "use strict";
  const L = window.ARCHIVUS_LINEAGE2;
  /* the Pantheons graft: six more divine houses joined to the board's root */
  const L3 = window.ARCHIVUS_LINEAGE3;
  if (L3) {
    Object.assign(L.houses, L3.houses);
    L.nodes = L.nodes.concat(L3.nodes);
    L.edges = L.edges.concat(L3.edges);
  }
  const NODES = L.nodes, HOUSES = L.houses, EDGES = L.edges;
  const byId = {};
  NODES.forEach(n => byId[n.i] = n);

  /* ---- edge semantics (with owner overrides) ---- */
  const ovKey = (a, b) => a + "|" + b;
  const ovSet = list => new Set((list || []).flatMap(([a, b]) => [ovKey(a, b), ovKey(b, a)]));
  const forceUnion = ovSet(L.unionExtra), forceDescent = ovSet(L.unionNot);
  const isUnion = e => {
    const k = ovKey(e[0], e[1]);
    if (forceDescent.has(k)) return false;
    if (forceUnion.has(k)) return true;
    return e[2] === 1;
  };
  const isBridge = e => e[2] === 2;                    /* cross-tradition thread */
  const BRIDGES = EDGES.filter(isBridge);
  const DESC = EDGES.filter(e => !isUnion(e) && !isBridge(e));
  const UNIONS = EDGES.filter(e => isUnion(e) && !isBridge(e));
  const unionsOf = {};
  UNIONS.forEach(([a, b]) => {
    (unionsOf[a] = unionsOf[a] || []).push(b);
    (unionsOf[b] = unionsOf[b] || []).push(a);
  });

  /* ---- Table of Nations: peoples & cultures ---- */
  const ETHNOS = new Set(["Medes","Cappadocians","Phrygians","Etruscans","Germania?","Phoenicians",
    "Hittites","Jebushites","Amorites/Amori","Girgasites/Gergoshi","Hivites/Hivi","Arkites/Arkee",
    "Sinites/Seni","Arvadites/Arodi","Zemarites/Zimodi","Hamathites/Chamethi","Moabites","Ammonites",
    "Amalekites","Temanites","Maachathites","Buzites","Aramites","Sabeans","Asshurim","Letushim",
    "Leummim","Elamites","Lydians","Gerarim","Philistim/Pelishtim","Azathim","Ekronim","Githim",
    "Ludim","Anamim","Lehabim","Maphtuhim","Pathrusim/Pathros","Casluhim/Casloch","Caphtorim",
    "Kittim","Dodanim","Babylon","Assyria","Erech","Nineveh","Akkad","Reboth Ir","Calneh","Calah",
    "Shinar","Resen","Kings of Kish","Sodom","Gomorrah","Admah","Zeboyim","7 Sons","Sheba"]);
  const isEthnos = n => {
    const s = n.n.split(" - ")[0];
    const suffixOk = !["israel", "hashim", "mary", "joseph", "seth", "succession"].includes(n.h);
    return ETHNOS.has(s) || ETHNOS.has(n.n) || (/ites$|im$| Tribe$/.test(s) && suffixOk);
  };
  const designation = n => {
    const parts = n.n.split(" - ");
    return parts.length > 1 ? parts.slice(1).join(" · ") : null;
  };

  /* ---- generations from descent edges ---- */
  const parentsD = {}, childrenD = {};
  DESC.forEach(([a, b]) => {
    (parentsD[b] = parentsD[b] || []).push(a);
    (childrenD[a] = childrenD[a] || []).push(b);
  });
  const gen = {};
  function genOf(id, seen) {
    if (gen[id] != null) return gen[id];
    seen = seen || new Set();
    if (seen.has(id)) return 0;
    seen.add(id);
    const ps = parentsD[id] || [];
    const g = ps.length ? 1 + Math.max(...ps.map(p => genOf(p, seen))) : 0;
    gen[id] = g;
    return g;
  }
  NODES.forEach(n => genOf(n.i));
  /* explicit tier overrides (chronology-matched placements for succession lineages) */
  NODES.forEach(n => { if (n.g != null) gen[n.i] = n.g; });
  /* consorts without descent parents sit on their partner's tier */
  NODES.forEach(n => {
    if (!(parentsD[n.i] || []).length && unionsOf[n.i]) {
      gen[n.i] = Math.min(...unionsOf[n.i].map(p => gen[p]));
    }
  });

  /* ---- tidy layout: post-order, stacked terminal fans ---- */
  const NW = 104, NH = 24, TIER = 86, GAPX = 14;
  const X = {}, yOff = {};
  let cursor = 0;
  const isLeaf = id => !(childrenD[id] || []).length;
  const placed = new Set();
  function place(id) {
    if (placed.has(id)) return;
    placed.add(id);
    const kids = (childrenD[id] || []).filter(k => !placed.has(k));
    if (!kids.length) {
      if (X[id] == null) { X[id] = cursor; cursor += NW + GAPX; }
      return;
    }
    const leafKids = kids.filter(isLeaf);
    const branchKids = kids.filter(k => !isLeaf(k));
    if (leafKids.length >= 4) {
      const cols = leafKids.length >= 10 ? 3 : 2;
      const base = cursor;
      leafKids.forEach((k, idx) => {
        X[k] = base + (idx % cols) * (NW + GAPX);
        yOff[k] = Math.floor(idx / cols);
        placed.add(k);
      });
      cursor = base + cols * (NW + GAPX) + GAPX;
    } else {
      leafKids.forEach(place);
    }
    branchKids.forEach(place);
    const xs = kids.map(k => X[k]).filter(x => x != null);
    X[id] = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : (cursor += NW + GAPX) - NW - GAPX;
  }
  /* main trunk first (Tiamat), then remaining substantial roots */
  const roots = NODES.filter(n => !(parentsD[n.i] || []).length).map(n => n.i);
  const subtreeSize = id => 1 + ((childrenD[id] || []).reduce((s, c) => s + subtreeSize(c), 0));
  const sized = roots.map(r => [subtreeSize(r), r]).sort((a, b) => b[0] - a[0]);
  sized.forEach(([sz, r]) => { if (sz > 2) place(r); });
  /* satellites: consorts beside partners, lone fathers beside their child */
  NODES.forEach(n => {
    if (X[n.i] == null && unionsOf[n.i]) {
      const p = unionsOf[n.i].find(q => X[q] != null);
      if (p != null) X[n.i] = X[p] + NW * 0.72 + 10;
    }
  });
  NODES.forEach(n => {
    if (X[n.i] == null) {
      const kid = (childrenD[n.i] || []).find(k => X[k] != null);
      if (kid != null) X[n.i] = X[kid] - NW * 0.72 - 10;
    }
  });
  NODES.forEach(n => { if (X[n.i] == null) { X[n.i] = cursor; cursor += NW + GAPX; } });
  /* alignment pass: resolve same-tier collisions (stacks keep their columns) */
  const tiers = {};
  NODES.forEach(n => { if (!yOff[n.i]) (tiers[gen[n.i]] = tiers[gen[n.i]] || []).push(n.i); });
  Object.values(tiers).forEach(ids => {
    ids.sort((a, b) => X[a] - X[b]);
    for (let k = 1; k < ids.length; k++) {
      if (X[ids[k]] - X[ids[k - 1]] < NW + 8) X[ids[k]] = X[ids[k - 1]] + NW + 8;
    }
  });
  const PX = n => X[n.i];
  const PY = n => 60 + gen[n.i] * TIER + (yOff[n.i] || 0) * (NH + 7);
  const minX = Math.min(...NODES.map(PX)) - 240, maxX = Math.max(...NODES.map(PX)) + 240;
  const minY = -20, maxY = Math.max(...NODES.map(PY)) + 160;

  /* ---- render ---- */
  const svg = document.getElementById("bl-svg");
  const NS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = '<marker id="ethnos-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L8 4 L0 8 z" fill="#8f9ab5"/></marker>';
  svg.appendChild(defs);
  const world = document.createElementNS(NS, "g");
  svg.appendChild(world);
  const el = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); (p || world).appendChild(n); return n; };

  /* ---- chronology: trunk anchors → year per generation tier ----
     Anchors follow the board's own dates (Peleg "2450bce", Tubal-Cain
     "3200bce", Amenemhet "1980bce") and traditional chronology elsewhere. */
  const findN = q => NODES.find(n => n.n.toLowerCase().startsWith(q));
  const NODE_ANCHORS = [
    [findN("adam"), -4000], [findN("noah/"), -2900], [findN("peleg"), -2450],
    [findN("abraham"), -1950], [findN("jacob - 12"), -1750], [findN("david"), -1000],
    [findN("jeoaniah/jehoiachin"), -586], [findN("jesus"), -4],
    [findN("tubal-cain"), -3200], [findN("amenemhet"), -1980], [findN("ora"), -2100],
    [findN("muhammad"), 570], [findN("fatima"), 615], [findN("husayn"), 640],
    [findN("hussein bin ali"), 1880], [findN("abdullah ii"), 1999],
    [findN("james the just"), 40], [findN("exilarchs"), 500],
    [findN("confucius"), -551], [findN("emperor jimmu"), -660], [findN("guru nanak"), 1469],
    [findN("dalai lama"), 1391], [findN("pact of diriyah"), 1744], [findN("abu talib"), 545],
    [findN("the chrysanthemum"), 2019], [findN("the kong lineage"), 2006], [findN("the aga khans"), 2007],
    [findN("the papacy"), 2013], [findN("hillel"), -30]
  ].filter(a => a[0]);
  /* trunk chronology: Adam→Jesus, then extended along the Hashemite line to the present */
  const TRUNK = NODE_ANCHORS.slice(0, 8).map(([n, y]) => [gen[n.i], y]).sort((a, b) => a[0] - b[0]);
  const abd2 = findN("abdullah ii");
  if (abd2 && gen[abd2.i] > TRUNK[TRUNK.length - 1][0]) TRUNK.push([gen[abd2.i], 1999]);
  const adamGen = TRUNK[0][0], jesusGen = gen[findN("jesus").i], endGen = TRUNK[TRUNK.length - 1][0];
  function yearOfGen(g) {
    if (g < adamGen) return null;                                  /* mythic tiers */
    if (g >= endGen) return TRUNK[TRUNK.length - 1][1];
    for (let i = 0; i < TRUNK.length - 1; i++) {
      const [g0, y0] = TRUNK[i], [g1, y1] = TRUNK[i + 1];
      if (g >= g0 && g < g1) return y0 + (g - g0) / (g1 - g0) * (y1 - y0);
    }
    return null;
  }
  const fmtYr = y => y == null ? "" : (Math.abs(Math.round(y / 10) * 10)) + (y < 0 ? " BCE" : " CE");

  /* per-figure interpolated date (bracketed between anchored ancestor/descendant) */
  const anchorYear = {};
  NODE_ANCHORS.forEach(([n, y]) => anchorYear[n.i] = y);
  function up(id) {
    let cur = id, guard = 0;
    while (guard++ < 120) {
      const ps = parentsD[cur] || [];
      if (!ps.length) return null;
      cur = ps[0];
      if (anchorYear[cur] != null) return cur;
    }
    return null;
  }
  function down(id) {
    let frontier = [id], guard = 0;
    while (frontier.length && guard++ < 120) {
      const next = [];
      for (const c of frontier) {
        for (const k of (childrenD[c] || [])) {
          if (anchorYear[k] != null) return k;
          next.push(k);
        }
      }
      frontier = next;
    }
    return null;
  }
  function nodeYear(id) {
    if (anchorYear[id] != null) return anchorYear[id];
    const a = up(id), d = down(id);
    if (a != null && d != null && gen[d] !== gen[a]) {
      return anchorYear[a] + (gen[id] - gen[a]) / (gen[d] - gen[a]) * (anchorYear[d] - anchorYear[a]);
    }
    if (a != null) return anchorYear[a] + (gen[id] - gen[a]) * 40;
    if (d != null) return anchorYear[d] - (gen[d] - gen[id]) * 40;
    return null;
  }

  /* generation ruler + tier bands + chronology */
  const maxGen = Math.max(...Object.values(gen));
  for (let g = 0; g <= maxGen; g++) {
    if (g % 2 === 0) el("rect", { class: "bl-tierband", x: minX + 120, y: 60 + g * TIER - TIER / 2, width: maxX - minX - 120, height: TIER });
    el("line", { class: "bl-tier", x1: minX + 120, y1: 60 + g * TIER, x2: maxX, y2: 60 + g * TIER });
    el("text", { class: "bl-gen", x: minX + 20, y: 60 + g * TIER + 1 }).textContent = "GEN " + g;
    const y = yearOfGen(g);
    el("text", { class: "bl-year", x: minX + 20, y: 60 + g * TIER + 11 }).textContent =
      g < adamGen ? "MYTHIC" : (y == null ? "" : "c. " + fmtYr(y));
  }

  /* ---- world-events gutter: the archive's own records beside the tree ----
     Events from the Chronicle whose dates fall in each tier's span, placed
     at the right margin; click → opens the record in the Chronicle. */
  const EV = window.ARCHIVUS_EVENTS || [];
  const THEME_COLOR = Object.fromEntries((window.ARCHIVUS_THEMES || []).map(t => [t.id, t.color]));
  if (EV.length) {
    const gx = maxX - 60;
    el("text", { class: "bl-gutter-title", x: gx, y: 60 + adamGen * TIER - 26 }).textContent = "⌛ MEANWHILE, IN THE ARCHIVE";
    const shown = new Set();
    for (let g = adamGen; g <= maxGen; g++) {
      const y0 = yearOfGen(g), y1 = g < endGen ? yearOfGen(g + 1) : 2050;
      if (y0 == null || y1 == null || y1 <= y0) continue;
      const hits = EV.filter(e => e.startYear >= y0 && e.startYear < y1 && e.importance >= 7 && !shown.has(e.id))
        .sort((a, b) => b.importance - a.importance).slice(0, 2);
      hits.forEach(e => shown.add(e.id));
      hits.forEach((e, idx) => {
        const yy = 60 + g * TIER + idx * 13 - 6;
        const a = document.createElementNS(NS, "a");
        a.setAttribute("href", "index.html#e=" + e.id + "&v=chronicle");
        world.appendChild(a);
        el("circle", { class: "bl-evt-dot", cx: gx, cy: yy, r: 3.4, fill: THEME_COLOR[e.theme] || "#c9a227" }, a);
        el("text", { class: "bl-evt", x: gx + 9, y: yy + 3 }, a).textContent =
          e.title.length > 34 ? e.title.slice(0, 33) + "…" : e.title;
      });
    }
  }

  /* edges */
  const edgeEls = [];
  EDGES.forEach(e => {
    if (isBridge(e)) return;                       /* drawn separately below */
    const [a, b] = e;
    const A = byId[a], B = byId[b];
    if (!A || !B) return;
    const union = isUnion(e);
    const gap = A.gap || B.gap;
    let d, cls = "bl-edge";
    if (union) {
      const mx2 = (PX(A) + PX(B)) / 2, myy = (PY(A) + PY(B)) / 2 - Math.min(160, Math.hypot(PX(B) - PX(A), PY(B) - PY(A)) * 0.1) - 20;
      d = `M${PX(A)} ${PY(A)} Q ${mx2} ${myy}, ${PX(B)} ${PY(B)}`;
      cls += " bl-union";
    } else {
      d = `M${PX(A)} ${PY(A) + NH / 2} C ${PX(A)} ${(PY(A) + PY(B)) / 2}, ${PX(B)} ${(PY(A) + PY(B)) / 2}, ${PX(B)} ${PY(B) - NH / 2}`;
      if (isEthnos(B)) cls += " bl-ethnos";
    }
    if (gap) cls += " gap";
    const p = el("path", { class: cls, d, "data-a": a, "data-b": b });
    if (cls.includes("bl-ethnos")) p.setAttribute("marker-end", "url(#ethnos-arrow)");
    edgeEls.push(p);
  });

  /* cross-tradition bridges: violet = shared PIE origin, gold = documented
     syncretism, teal = parallel archetype. Click a thread for its story. */
  const BR_NAME = { o: "Shared origin", s: "Documented syncretism", p: "Parallel archetype" };
  BRIDGES.forEach(e => {
    const A = byId[e[0]], B = byId[e[1]];
    if (!A || !B) return;
    const lift = 70 + Math.abs(PX(B) - PX(A)) * 0.055;
    const p = el("path", {
      class: "bl-bridge bl-bridge-" + (e[3] || "p"),
      d: `M${PX(A)} ${PY(A) - NH / 2} Q ${(PX(A) + PX(B)) / 2} ${Math.min(PY(A), PY(B)) - lift}, ${PX(B)} ${PY(B) - NH / 2}`,
      "data-a": e[0], "data-b": e[1]
    });
    const tt = document.createElementNS(NS, "title");
    tt.textContent = (BR_NAME[e[3]] || "Bridge") + " — " + A.n.split(" - ")[0] + " ↔ " + B.n.split(" - ")[0];
    p.appendChild(tt);
    p.addEventListener("click", ev => { ev.stopPropagation(); selectBridge(e); });
    edgeEls.push(p);
  });

  /* nodes */
  const nodeEls = {};
  NODES.forEach(n => {
    const ethnos = isEthnos(n);
    const g = el("g", { class: "bl-node" + (n.h === "label" ? " lbl" : "") + (ethnos ? " ethnos" : "") });
    g.style.setProperty("--hc", HOUSES[n.h].color);
    el("rect", { class: "bl-card", x: PX(n) - NW / 2, y: PY(n) - NH / 2, width: NW, height: NH, rx: ethnos ? 12 : 4 }, g);
    el("circle", { class: "bl-dot", cx: PX(n), cy: PY(n), r: 4, fill: HOUSES[n.h].color }, g);
    const short = n.n.split(" - ")[0].split("/")[0];
    const label = el("text", { class: "bl-label", x: PX(n) - NW / 2 + 14, y: PY(n) + 3.5 }, g);
    label.textContent = (ethnos ? "⚑ " : "") + (short.length > (ethnos ? 13 : 15) ? short.slice(0, ethnos ? 12 : 14) + "…" : short);
    /* culture designation sub-label for progenitors (Gomer — Cimmerians…) */
    const desig = designation(n);
    if (desig && !ethnos) {
      const sub = el("text", { class: "bl-desig", x: PX(n), y: PY(n) + NH / 2 + 9, "text-anchor": "middle" }, g);
      sub.textContent = "→ " + (desig.length > 26 ? desig.slice(0, 25) + "…" : desig);
    }
    g.addEventListener("click", e => { e.stopPropagation(); select(n.i); });
    nodeEls[n.i] = g;
  });

  /* ---- pan / zoom, adaptive detail ---- */
  let k = 1, tx = 0, ty = 0;
  function apply() {
    world.setAttribute("transform", `translate(${tx},${ty}) scale(${k})`);
    svg.classList.toggle("far", k < 0.28);
    svg.classList.toggle("mid", k >= 0.28 && k < 0.55);
    const r = Math.max(4, Math.min(200, 5.5 / k));
    const ew = Math.max(1.2, Math.min(70, 1.5 / k));
    if (Math.abs(r - (apply._r || 0)) > 0.5) {
      document.querySelectorAll(".bl-dot").forEach(d => d.setAttribute("r", r));
      edgeEls.forEach(e2 => e2.setAttribute("stroke-width", ew));
      apply._r = r;
    }
    drawMini();
  }
  const rectOf = () => svg.getBoundingClientRect();
  function centerOn(x, y, kk) {
    const r = rectOf();
    if (kk) k = kk;
    tx = r.width / 2 - x * k;
    ty = r.height / 2 - y * k;
    apply();
  }
  function fit() {
    const r = rectOf();
    k = Math.max(0.03, Math.min(0.9, Math.min(r.width / (maxX - minX), r.height / (maxY - minY))));
    tx = -minX * k + (r.width - (maxX - minX) * k) / 2;
    ty = -minY * k + (r.height - (maxY - minY) * k) / 2;
    apply();
  }
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const r = rectOf();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const k2 = Math.max(0.03, Math.min(3, k * Math.pow(1.0016, -e.deltaY)));
    tx = mx - (mx - tx) * (k2 / k);
    ty = my - (my - ty) * (k2 / k);
    k = k2;
    apply();
  }, { passive: false });
  let pan = null;
  const pts = new Map(); let pinch = null;   /* touch pinch */
  svg.addEventListener("pointerdown", e => {
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) {
      pan = null;
      const [q1, q2] = [...pts.values()], r = rectOf();
      pinch = { d0: Math.hypot(q1[0] - q2[0], q1[1] - q2[1]) || 1, k0: k, tx0: tx, ty0: ty,
        mx: (q1[0] + q2[0]) / 2 - r.left, my: (q1[1] + q2[1]) / 2 - r.top };
      return;
    }
    pan = { x: e.clientX, y: e.clientY, tx, ty, moved: false };
  });
  svg.addEventListener("pointermove", e => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pts.size === 2) {
      const [q1, q2] = [...pts.values()];
      const k2 = Math.max(0.03, Math.min(3, pinch.k0 * ((Math.hypot(q1[0] - q2[0], q1[1] - q2[1]) || 1) / pinch.d0)));
      tx = pinch.mx - (pinch.mx - pinch.tx0) * (k2 / pinch.k0);
      ty = pinch.my - (pinch.my - pinch.ty0) * (k2 / pinch.k0);
      k = k2; apply();
      return;
    }
    if (!pan) return;
    const dx = e.clientX - pan.x, dy = e.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) > 4) { pan.moved = true; svg.setPointerCapture(e.pointerId); svg.classList.add("panning"); }
    if (!pan.moved) return;
    tx = pan.tx + dx; ty = pan.ty + dy; apply();
  });
  svg.addEventListener("pointerup", e => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    const moved = pan && pan.moved;
    pan = null; svg.classList.remove("panning");
    if (!moved && e.target === svg) closePanel();
  });
  svg.addEventListener("pointercancel", e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; pan = null; svg.classList.remove("panning"); });

  /* ---- minimap ---- */
  const mini = document.getElementById("bl-mini");
  const mctx = mini.getContext("2d");
  const MW = mini.width, MH = mini.height;
  const mmx = x => (x - minX) / (maxX - minX) * MW;
  const mmy = y => (y - minY) / (maxY - minY) * MH;
  let miniDots = null;
  function drawMini() {
    if (!miniDots) {
      miniDots = document.createElement("canvas");
      miniDots.width = MW; miniDots.height = MH;
      const c = miniDots.getContext("2d");
      c.fillStyle = "#0a0c12"; c.fillRect(0, 0, MW, MH);
      NODES.forEach(n => {
        c.fillStyle = HOUSES[n.h].color;
        c.globalAlpha = n.h === "label" ? 0.35 : 0.9;
        c.fillRect(mmx(PX(n)) - 1, mmy(PY(n)) - 1, 2, 2);
      });
    }
    mctx.drawImage(miniDots, 0, 0);
    const r = rectOf();
    const vx0 = (-tx) / k, vy0 = (-ty) / k;
    mctx.strokeStyle = "#e8c455";
    mctx.lineWidth = 1;
    mctx.strokeRect(mmx(vx0), mmy(vy0), Math.max(4, mmx(vx0 + r.width / k) - mmx(vx0)), Math.max(4, mmy(vy0 + r.height / k) - mmy(vy0)));
  }
  mini.addEventListener("pointerdown", e => {
    const r = mini.getBoundingClientRect();
    const bx = minX + (e.clientX - r.left) / r.width * (maxX - minX);
    const by = minY + (e.clientY - r.top) / r.height * (maxY - minY);
    centerOn(bx, by, Math.max(k, 0.4));
  });

  /* ---- selection & record panel ---- */
  const panel = document.getElementById("bl-panel");
  let selected = null;
  function closePanel() {
    panel.classList.remove("open");
    if (selected != null && nodeEls[selected]) nodeEls[selected].classList.remove("sel");
    selected = null;
    edgeEls.forEach(x => x.classList.remove("hl"));
  }
  document.getElementById("bl-close").addEventListener("click", closePanel);
  const shortOf = id => byId[id].n.split(" - ")[0];
  const link = id => '<a data-go="' + id + '">' + shortOf(id) + "</a>";
  function select(id) {
    if (selected != null && nodeEls[selected]) nodeEls[selected].classList.remove("sel");
    selected = id;
    nodeEls[id].classList.add("sel");
    edgeEls.forEach(x => x.classList.toggle("hl", +x.dataset.a === id || +x.dataset.b === id));
    const n = byId[id];
    const H = HOUSES[n.h];
    document.getElementById("bl-house").innerHTML =
      '<span class="bl-house-chip" style="--hc:' + H.color + '">' + H.name + "</span>" +
      (isEthnos(n) ? ' <span class="bl-house-chip" style="--hc:#8f9ab5">⚑ People / culture</span>' : "");
    document.getElementById("bl-name").textContent = n.n;
    const ny = nodeYear(id);
    const when = document.getElementById("bl-when");
    if (when) {
      when.textContent = ny == null ? (gen[id] < adamGen ? "Mythic stratum — before the chronology" : "")
        : "≈ c. " + fmtYr(ny) + " · generation " + gen[id] + " · interpolated traditional chronology";
      when.style.display = when.textContent ? "" : "none";
    }
    const parents = (parentsD[id] || []);
    const issue = (childrenD[id] || []);
    const consorts = [...new Set(unionsOf[id] || [])];
    let rels = "";
    if (parents.length) rels += "<b>Descent from</b>" + parents.map(p => '<div class="bl-rel">' + link(p) + "</div>").join("");
    if (consorts.length) rels += "<b>Union / consort</b>" + consorts.map(p => '<div class="bl-rel">' + link(p) + "</div>").join("");
    if (issue.length) rels += "<b>Issue / linked</b>" + issue.map(c => '<div class="bl-rel">' + link(c) + "</div>").join("");
    document.getElementById("bl-rels").innerHTML = rels;
    const note = document.getElementById("bl-note");
    note.textContent = n.t || "";
    note.style.display = n.t ? "" : "none";
    panel.classList.add("open");
    panel.querySelectorAll("a[data-go]").forEach(a =>
      a.addEventListener("click", () => { const g = +a.dataset.go; centerOn(PX(byId[g]), PY(byId[g]), Math.max(k, 0.8)); select(g); }));
  }

  /* a clicked bridge tells its story in the record panel */
  function selectBridge(e) {
    closePanel();
    const A = byId[e[0]], B = byId[e[1]];
    const BR = { o: ["#9b6fc3", "Shared origin — the same god, inherited (PIE)"],
                 s: ["#c9a227", "Documented syncretism"],
                 p: ["#4fae9c", "Parallel archetype — the same office"] };
    const kd = BR[e[3]] || BR.p;
    document.getElementById("bl-house").innerHTML =
      '<span class="bl-house-chip" style="--hc:' + kd[0] + '">' + kd[1] + "</span>";
    document.getElementById("bl-name").textContent = A.n.split(" - ")[0] + " ↔ " + B.n.split(" - ")[0];
    const when = document.getElementById("bl-when");
    if (when) { when.textContent = ""; when.style.display = "none"; }
    document.getElementById("bl-rels").innerHTML =
      "<b>Between</b>" + [e[0], e[1]].map(p2 => '<div class="bl-rel">' + link(p2) + "</div>").join("");
    const note = document.getElementById("bl-note");
    note.textContent = e[4] || "";
    note.style.display = e[4] ? "" : "none";
    panel.classList.add("open");
    edgeEls.forEach(x => x.classList.toggle("hl", +x.dataset.a === e[0] && +x.dataset.b === e[1]));
    panel.querySelectorAll("a[data-go]").forEach(a =>
      a.addEventListener("click", () => { const g2 = +a.dataset.go; centerOn(PX(byId[g2]), PY(byId[g2]), Math.max(k, 0.8)); select(g2); }));
  }

  /* ---- search / houses / jumps ---- */
  const search = document.getElementById("bl-search");
  search.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const q = search.value.trim().toLowerCase();
    if (!q) return;
    const hit = NODES.find(n => n.n.toLowerCase().includes(q));
    if (hit) { centerOn(PX(hit), PY(hit), Math.max(k, 0.85)); select(hit.i); }
  });
  const active = new Set();
  const hbox = document.getElementById("bl-houses");
  Object.entries(HOUSES).forEach(([hid, h]) => {
    const c = document.createElement("button");
    c.className = "chip";
    c.style.setProperty("--c", h.color);
    c.innerHTML = '<span class="dot"></span>' + h.name;
    c.addEventListener("click", () => {
      if (active.has(hid)) active.delete(hid); else active.add(hid);
      c.classList.toggle("active", active.has(hid));
      document.querySelectorAll("#bl-houses .chip").forEach(ch =>
        ch.classList.toggle("dimmed", active.size > 0 && !ch.classList.contains("active")));
      NODES.forEach(n => nodeEls[n.i].classList.toggle("dim", active.size > 0 && !active.has(n.h)));
    });
    hbox.appendChild(c);
  });
  const find = q => NODES.find(n => n.n.toLowerCase().startsWith(q));
  const JUMPS = [
    ["Origin", () => find("tiamat"), 0.6],
    ["Adam & Eve", () => find("adam"), 0.65],
    ["Cain — Kish", () => find("cain/"), 0.6],
    ["Noah's sons", () => find("noah/"), 0.45],
    ["Nations", () => find("javan"), 0.4],
    ["Abraham", () => find("abraham"), 0.6],
    ["Twelve Tribes", () => find("jacob - 12"), 0.6],
    ["David", () => find("david"), 0.7],
    ["Jesus", () => find("jesus"), 0.7],
    ["Muhammad", () => find("muhammad"), 0.7],
    ["The Pantheons", () => find("zeus"), 0.5],
    ["Fit all", null, null]
  ];
  const tb = document.getElementById("bl-jumps");
  JUMPS.forEach(([label, fn, kk]) => {
    const b = document.createElement("button");
    b.className = "tool-btn";
    b.textContent = label;
    b.addEventListener("click", () => {
      if (!fn) return fit();
      const n = fn();
      if (n) { centerOn(PX(n), PY(n), kk); select(n.i); }
    });
    tb.appendChild(b);
  });

  /* ---- boot ---- */
  const adam = find("adam");
  centerOn(PX(adam), PY(adam) + 100, 0.55);
  window.addEventListener("resize", apply);
})();
