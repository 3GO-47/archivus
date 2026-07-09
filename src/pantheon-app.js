/* ============================================================
   ARCHIVUS — THE PANTHEONS renderer
   Seven divine family trees side by side; every god carries
   hand-drawn domain sigils; three kinds of arc run between the
   religions (shared origin · documented syncretism · parallel
   archetype). Click a domain to see one office lit across all
   seven skies.
   ============================================================ */
(function () {
  "use strict";
  const P = window.ARCHIVUS_PANTHEONS;
  const GODS = P.gods, PAN = P.pantheons, DOM = P.domains, XL = P.xlinks;
  const byId = {};
  GODS.forEach(g => byId[g.id] = g);

  /* ---- hand-drawn domain sigils (24×24 stroke paths) ---- */
  const ICONS = {
    sky:     "M3 17a9 9 0 0 1 18 0 M12 4v2 M6 7l1.5 1.5 M18 7l-1.5 1.5",
    storm:   "M13 2 6 13h5l-2 9 8-13h-5l1-7z",
    sun:     "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 2v2.5 M12 19.5V22 M2 12h2.5 M19.5 12H22 M4.5 4.5l1.8 1.8 M17.7 17.7l1.8 1.8 M19.5 4.5l-1.8 1.8 M6.3 17.7l-1.8 1.8",
    moon:    "M20 13A8.5 8.5 0 1 1 11 4a7 7 0 0 0 9 9z",
    sea:     "M2 10c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5 0 M2 16c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5 0",
    earth:   "M2 19 9 7l4.5 7 3-4.5L22 19z",
    death:   "M12 3a7.5 7.5 0 0 0-7.5 7.5V15l3 2.2V21h9v-3.8l3-2.2v-4.5A7.5 7.5 0 0 0 12 3z M9.2 11.5h.01 M14.8 11.5h.01",
    war:     "M4 20 13 11 M13 11l5-7 2 2-7 5 M6 15l3 3 M17 20l-6-6",
    love:    "M12 20.5S4 15.5 2.5 10.5A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 9.5 3.5C20 15.5 12 20.5 12 20.5z",
    wisdom:  "M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    craft:   "M5 4l7 7 M8 6.5 16.5 15l-2.5 2.5L5.5 9z M14 16l6 6",
    harvest: "M12 22V7 M12 9C8.5 9 6.5 7 6.5 3.5 10 3.5 12 5.5 12 9z M12 9c3.5 0 5.5-2 5.5-5.5C14 3.5 12 5.5 12 9z M12 15c-3.5 0-5.5-2-5.5-5.5 3.5 0 5.5 2 5.5 5.5z M12 15c3.5 0 5.5-2 5.5-5.5-3.5 0-5.5 2-5.5 5.5z",
    fire:    "M12 2c1 4.5 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0C6.5 9 9 8 9 4.5c1.7 1 3 2.5 3 2.5S12 4 12 2z",
    justice: "M12 3v18 M4.5 7h15 M7 7l-3.2 6a3.7 3.7 0 0 0 6.4 0z M17 7l-3.2 6a3.7 3.7 0 0 0 6.4 0z M8 21h8",
    trickster:"M4 6c0 10.5 4 15 8 15s8-4.5 8-15c-3 2-5 2-8 0-3 2-5 2-8 0z M9 11h.01 M15 11h.01 M9 15c1.5 1.5 4.5 1.5 6 0",
    king:    "M3 18h18 M4 18 3 8l5.5 4L12 4l3.5 8L21 8l-1 10",
    messenger:"M3 16c6.5 1 14.5-1 18.5-9-6.5 0-9 1.5-12 5 M7 21c5.5 0 10-2.5 12-8",
    home:    "M4 21V10l8-6.5L20 10v11h-5.5v-6h-5v6z",
    hunt:    "M5 3c8.5 2.5 13 8.5 14 17 M5 3c-1 8.5 3.5 14.5 14 17 M5 3l14 17 M16 17l3 3v-4z",
    serpent: "M4 16.5c0-4 4.5-4.5 8.5-4.5s7.5-.5 7.5-4-3.5-4-6-4h-3 M4 16.5c0 3.5 3.5 4 7.5 4h3 M15 20.5h.01"
  };

  /* ---- layout: clusters in two banked rows so the fitted view fills the sky ---- */
  const NW = 122, NH = 36, TIER = 108, SLOT = NW + 16, CLUSTER_GAP = 170, BANK_GAP = 190;
  const order = Object.keys(PAN);
  const pos = {};                 /* id → {x, y} */
  const clusterX = {}, clusterW = {}, clusterY = {}, clusterH = {}, tiersOf = {};
  /* measure every cluster first */
  order.forEach(pa => {
    const tiers = {};
    GODS.filter(g => g.pa === pa).forEach(g => (tiers[g.gen] = tiers[g.gen] || []).push(g));
    tiersOf[pa] = tiers;
    clusterW[pa] = Math.max(...Object.values(tiers).map(t => t.length)) * SLOT;
    clusterH[pa] = 90 + Math.max(...Object.keys(tiers).map(Number)) * TIER + 60;
  });
  /* split the ordered clusters into two banks of roughly equal width */
  const totalW = order.reduce((s, pa) => s + clusterW[pa] + CLUSTER_GAP, 0);
  const banks = [[], []];
  let acc = 0;
  order.forEach(pa => { banks[acc >= totalW / 2 ? 1 : 0].push(pa); acc += clusterW[pa] + CLUSTER_GAP; });
  const bankH = banks.map(b => Math.max(...b.map(pa => clusterH[pa])));
  const bankW = banks.map(b => b.reduce((s, pa) => s + clusterW[pa] + CLUSTER_GAP, -CLUSTER_GAP));
  const fullW = Math.max(...bankW);
  banks.forEach((bank, bi) => {
    let cx0 = (fullW - bankW[bi]) / 2;           /* center the narrower bank */
    const y0 = bi === 0 ? 0 : bankH[0] + BANK_GAP;
    bank.forEach(pa => {
      clusterX[pa] = cx0; clusterY[pa] = y0;
      Object.entries(tiersOf[pa]).forEach(([gen, list]) => {
        const rowW = list.length * SLOT;
        list.forEach((g, i) => {
          pos[g.id] = { x: cx0 + (clusterW[pa] - rowW) / 2 + i * SLOT + SLOT / 2, y: y0 + 90 + (+gen) * TIER };
        });
      });
      cx0 += clusterW[pa] + CLUSTER_GAP;
    });
  });
  const minX = -60, maxX = fullW + 60, minY = 0, maxY = bankH[0] + BANK_GAP + bankH[1] + 60;

  /* ---- svg scaffolding ---- */
  const svg = document.getElementById("pn-svg");
  const NS = "http://www.w3.org/2000/svg";
  const world = document.createElementNS(NS, "g");
  svg.appendChild(world);
  const el = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); (p || world).appendChild(n); return n; };

  /* cluster plates + titles */
  order.forEach(pa => {
    el("rect", { class: "pn-plate", x: clusterX[pa] - 26, y: clusterY[pa] + 20, width: clusterW[pa] + 52, height: clusterH[pa] - 10, rx: 10 });
    const t = el("text", { class: "pn-plate-title", x: clusterX[pa] + clusterW[pa] / 2, y: clusterY[pa] + 52, "text-anchor": "middle" });
    t.textContent = PAN[pa].name.toUpperCase();
    t.style.fill = PAN[pa].color;
    /* worship horizon — earliest cult evidence, beneath the title */
    const hz = (P.horizons || {})[pa];
    if (hz) {
      const s = el("text", { class: "pn-plate-horizon", x: clusterX[pa] + clusterW[pa] / 2, y: clusterY[pa] + 68, "text-anchor": "middle" });
      const short = hz.replace("⛩ Worship horizon: ", "");
      s.textContent = "⛩ " + (short.length > 88 ? short.slice(0, 87) + "…" : short);
    }
  });

  /* ---- cross-religion arcs (beneath the trees) ---- */
  const KIND = { o: ["pn-x-o", "Shared origin — Proto-Indo-European"], s: ["pn-x-s", "Documented syncretism"], p: ["pn-x-p", "Parallel archetype"] };
  const arcEls = [];
  XL.forEach((x, i) => {
    const A = pos[x.a], B = pos[x.b];
    if (!A || !B) return;
    const lift = 90 + Math.abs(B.x - A.x) * 0.09 + (i % 5) * 22;
    const my = Math.min(A.y, B.y) - lift;
    const a = el("path", {
      class: "pn-x " + KIND[x.k][0],
      d: `M${A.x} ${A.y - NH / 2} Q ${(A.x + B.x) / 2} ${my}, ${B.x} ${B.y - NH / 2}`,
      "data-a": x.a, "data-b": x.b, "data-i": i
    });
    a.addEventListener("click", e => { e.stopPropagation(); selectLink(i); });
    a.addEventListener("mouseenter", () => { a.classList.add("hov"); nodeEls[x.a].classList.add("hov"); nodeEls[x.b].classList.add("hov"); });
    a.addEventListener("mouseleave", () => { a.classList.remove("hov"); nodeEls[x.a].classList.remove("hov"); nodeEls[x.b].classList.remove("hov"); });
    arcEls.push(a);
  });

  /* ---- family edges ---- */
  GODS.forEach(g => (g.p || []).forEach(pid => {
    const A = pos[pid], B = pos[g.id];
    if (!A || !B) return;
    el("path", {
      class: "pn-edge",
      d: `M${A.x} ${A.y + NH / 2} C ${A.x} ${(A.y + B.y) / 2}, ${B.x} ${(A.y + B.y) / 2}, ${B.x} ${B.y - NH / 2}`
    }).style.stroke = PAN[g.pa].color;
  }));
  GODS.forEach(g => {
    if (!g.u || !pos[g.u]) return;
    const A = pos[g.id], B = pos[g.u];
    el("path", { class: "pn-union", d: `M${A.x} ${A.y} Q ${(A.x + B.x) / 2} ${A.y - 26}, ${B.x} ${B.y}` });
  });

  /* ---- god cards ---- */
  const nodeEls = {};
  GODS.forEach(g => {
    const { x, y } = pos[g.id];
    const c = PAN[g.pa].color;
    const grp = el("g", { class: "pn-node" });
    grp.style.setProperty("--pc", c);
    el("rect", { class: "pn-card", x: x - NW / 2, y: y - NH / 2, width: NW, height: NH, rx: 6 }, grp);
    const nm = el("text", { class: "pn-name", x: x - NW / 2 + 9, y: y - 2 }, grp);
    nm.textContent = g.n.length > 15 ? g.n.slice(0, 14) + "…" : g.n;
    if (g.sub) {
      const sb = el("text", { class: "pn-sub", x: x - NW / 2 + 9, y: y + 11 }, grp);
      sb.textContent = g.sub.length > 21 ? g.sub.slice(0, 20) + "…" : g.sub;
    }
    /* domain sigils, top-right of the card */
    (g.d || []).slice(0, 3).forEach((dm, i) => {
      const ic = el("g", { class: "pn-ic", transform: `translate(${x + NW / 2 - 14 - i * 13}, ${y - NH / 2 + 3}) scale(0.42)` }, grp);
      (ICONS[dm] || "").split(" M").forEach((seg, j) => {
        el("path", { d: (j ? "M" : "") + seg, fill: "none" }, ic);
      });
      el("title", {}, ic).textContent = DOM[dm];
    });
    grp.addEventListener("click", e => { e.stopPropagation(); selectGod(g.id); });
    nodeEls[g.id] = grp;
  });

  /* ---- pan / zoom ---- */
  let k = 1, tx = 0, ty = 0;
  function apply() {
    world.setAttribute("transform", `translate(${tx},${ty}) scale(${k})`);
    svg.classList.toggle("far", k < 0.34);
  }
  const rectOf = () => svg.getBoundingClientRect();
  function fit() {
    const r = rectOf();
    k = Math.min(1.1, Math.min(r.width / (maxX - minX), r.height / (maxY - minY)));
    tx = -minX * k + (r.width - (maxX - minX) * k) / 2;
    ty = -minY * k + (r.height - (maxY - minY) * k) / 2;
    apply();
  }
  function centerOn(x, y, kk) {
    const r = rectOf();
    if (kk) k = kk;
    tx = r.width / 2 - x * k;
    ty = r.height / 2 - y * k;
    apply();
  }
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const r = rectOf();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const k2 = Math.max(0.1, Math.min(3, k * Math.pow(1.0016, -e.deltaY)));
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
      const k2 = Math.max(0.1, Math.min(3, pinch.k0 * ((Math.hypot(q1[0] - q2[0], q1[1] - q2[1]) || 1) / pinch.d0)));
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

  /* ---- selection panel ---- */
  const panel = document.getElementById("pn-panel");
  function closePanel() { panel.classList.remove("open"); document.querySelectorAll(".pn-node.sel").forEach(n => n.classList.remove("sel")); arcEls.forEach(a => a.classList.remove("sel")); }
  document.getElementById("pn-close").addEventListener("click", closePanel);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const link = id => '<a data-go="' + id + '">' + esc(byId[id].n) + "</a>";
  function wirePanelLinks() {
    panel.querySelectorAll("a[data-go]").forEach(a =>
      a.addEventListener("click", () => { const g = a.dataset.go; centerOn(pos[g].x, pos[g].y, Math.max(k, 0.9)); selectGod(g); }));
  }
  function selectGod(id) {
    closePanel();
    const g = byId[id];
    nodeEls[id].classList.add("sel");
    const c = PAN[g.pa].color;
    document.getElementById("pn-p-house").innerHTML =
      '<span class="pn-chip" style="--pc:' + c + '">' + PAN[g.pa].name + "</span>";
    document.getElementById("pn-p-name").textContent = g.n;
    document.getElementById("pn-p-sub").textContent = g.sub || "";
    document.getElementById("pn-p-dom").innerHTML = (g.d || []).map(dm =>
      '<span class="pn-dom"><svg viewBox="0 0 24 24">' +
      (ICONS[dm] || "").split(" M").map((s, j) => '<path fill="none" d="' + (j ? "M" : "") + s + '"/>').join("") +
      "</svg>" + esc(DOM[dm]) + "</span>").join("");
    const parents = (g.p || []).filter(p => byId[p]);
    const kids = GODS.filter(o => (o.p || []).includes(id)).map(o => o.id);
    const consorts = [g.u, ...GODS.filter(o => o.u === id).map(o => o.id)].filter(Boolean);
    let rels = "";
    if (parents.length) rels += "<b>Born of</b>" + parents.map(p => '<div class="pn-rel">' + link(p) + "</div>").join("");
    if (consorts.length) rels += "<b>Consort</b>" + consorts.map(p => '<div class="pn-rel">' + link(p) + "</div>").join("");
    if (kids.length) rels += "<b>Issue</b>" + kids.map(p => '<div class="pn-rel">' + link(p) + "</div>").join("");
    document.getElementById("pn-p-rels").innerHTML = rels;
    document.getElementById("pn-p-note").textContent = g.t || "";
    const conns = XL.map((x, i) => ({ x, i })).filter(o => o.x.a === id || o.x.b === id);
    document.getElementById("pn-p-x").innerHTML = conns.length
      ? '<div class="kicker">Across the religions</div>' + conns.map(o => {
          const other = o.x.a === id ? o.x.b : o.x.a;
          return '<div class="pn-xcard ' + KIND[o.x.k][0] + '"><span class="xk">' + KIND[o.x.k][1] + "</span>" +
            link(other) + " — " + esc(o.x.t) + "</div>";
        }).join("")
      : "";
    panel.classList.add("open");
    wirePanelLinks();
    conns.forEach(o => arcEls[o.i] && arcEls[o.i].classList.add("sel"));
  }
  function selectLink(i) {
    closePanel();
    const x = XL[i];
    arcEls[i].classList.add("sel");
    nodeEls[x.a].classList.add("sel"); nodeEls[x.b].classList.add("sel");
    document.getElementById("pn-p-house").innerHTML =
      '<span class="pn-chip ' + KIND[x.k][0] + '-chip">' + KIND[x.k][1] + "</span>";
    document.getElementById("pn-p-name").textContent = byId[x.a].n + "  ⟷  " + byId[x.b].n;
    document.getElementById("pn-p-sub").textContent = PAN[byId[x.a].pa].name + " · " + PAN[byId[x.b].pa].name;
    document.getElementById("pn-p-dom").innerHTML = "";
    document.getElementById("pn-p-rels").innerHTML = "";
    document.getElementById("pn-p-note").textContent = x.t;
    document.getElementById("pn-p-x").innerHTML =
      '<div class="pn-rel">' + link(x.a) + "</div>" + '<div class="pn-rel">' + link(x.b) + "</div>";
    panel.classList.add("open");
    wirePanelLinks();
  }

  /* ---- domain highlighting: one office, lit across all skies ---- */
  const activeDoms = new Set();
  function applyDomFilter() {
    const on = activeDoms.size > 0;
    GODS.forEach(g => {
      const hit = !on || (g.d || []).some(d => activeDoms.has(d));
      nodeEls[g.id].classList.toggle("dim", on && !hit);
      nodeEls[g.id].classList.toggle("lit", on && hit);
    });
    arcEls.forEach(a => a.classList.toggle("dim", on));
  }
  const domBox = document.getElementById("pn-domains");
  Object.entries(DOM).forEach(([id, name]) => {
    const b = document.createElement("button");
    b.className = "chip pn-domchip";
    b.innerHTML = '<svg viewBox="0 0 24 24">' +
      (ICONS[id] || "").split(" M").map((s, j) => '<path fill="none" d="' + (j ? "M" : "") + s + '"/>').join("") +
      "</svg>" + name;
    b.addEventListener("click", () => {
      if (activeDoms.has(id)) activeDoms.delete(id); else activeDoms.add(id);
      b.classList.toggle("active", activeDoms.has(id));
      applyDomFilter();
    });
    domBox.appendChild(b);
  });

  /* pantheon jump chips */
  const jb = document.getElementById("pn-jumps");
  order.forEach(pa => {
    const b = document.createElement("button");
    b.className = "chip";
    b.style.setProperty("--c", PAN[pa].color);
    b.innerHTML = '<span class="dot"></span>' + PAN[pa].name;
    b.addEventListener("click", () => centerOn(clusterX[pa] + clusterW[pa] / 2, clusterY[pa] + clusterH[pa] / 2, 0.62));
    jb.appendChild(b);
  });
  const fitBtn = document.createElement("button");
  fitBtn.className = "tool-btn";
  fitBtn.textContent = "Fit all";
  fitBtn.addEventListener("click", fit);
  jb.appendChild(fitBtn);

  /* ---- search ---- */
  const search = document.getElementById("pn-search");
  search.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const q = search.value.trim().toLowerCase();
    if (!q) return;
    const hit = GODS.find(g => (g.n + " " + (g.sub || "")).toLowerCase().includes(q));
    if (hit) { centerOn(pos[hit.id].x, pos[hit.id].y, Math.max(k, 0.95)); selectGod(hit.id); }
  });

  fit();
  window.addEventListener("resize", fit);
})();
