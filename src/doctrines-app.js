/* ============================================================
   ARCHIVUS — THE DOCTRINES engine (v9)
   ------------------------------------------------------------
   Six views over one node list (src/data/doctrines*.js):
     compass    the two-axis chart, zoomable, with a year filter
     lineage    time-flowing genealogy in lanes; click a node to
                light its ancestors (gold) and descendants (blue)
     manifesto  the 1848 text, thesis by thesis
     red        the Marxist family: shared core, comparison matrix,
                schisms, record in power
     atlas      birthplaces on the world map; party-states by year
     library    the founding texts in order
   A node selected in any view opens the same card in the side
   panel, and stays selected when the view changes.
   Deep links: doctrines.html#v=lineage&i=maoism&c=leninism,maoism
   ============================================================ */
(function () {
  "use strict";
  const D = window.ARCHIVUS_DOCTRINES;
  if (!D || !D.nodes) return;
  const N = D.nodes, BY = {}, FAM = D.families, LANES = D.lanes;
  N.forEach(n => { BY[n.id] = n; });
  const IDE = N.filter(n => n.f), PLACED = IDE.filter(n => !n.xc), XC = IDE.filter(n => n.xc);
  const KIDS = {};
  N.forEach(n => (n.fr || []).forEach(f => { (KIDS[f[0]] = KIDS[f[0]] || []).push([n.id, f[1], f[2]]); }));
  const CUR = D.red.cur, CURID = new Set(CUR.map(c => c.id));
  const COUNTRIES = window.ARCHIVUS_COUNTRIES || [];
  const TEXTVIEWS = { manifesto: 1, red: 1, library: 1 };
  const VIEWS = ["compass", "lineage", "manifesto", "red", "atlas", "library"];
  const KIND = { s: "descends from", x: "written against", p: "split from" };
  const KIDK = { s: "led to", x: "answered by", p: "split off" };
  const ROOTK = { t: "Thinker · text", o: "Movement · organisation", e: "Event" };

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const f1 = v => Math.round(v * 10) / 10;
  const yr = n => (n.ap ? "c. " : "") + (n.yr < 0 ? -n.yr + " BCE" : n.yr);
  const col = n => n.f ? FAM[n.f][1] : "#d8c690";
  const mobile = () => window.matchMedia("(max-width: 860px)").matches;
  /* chart labels: drop the parenthesis, and the second half of long "A & B" names */
  const short = n => { let s = n.n.replace(/\s*\(.*\)\s*$/, ""); if (s.length > 22 && s.indexOf(" & ") > 0) s = s.split(" & ")[0]; return s; };
  const chip = id => { const n = BY[id]; return n ? '<button class="nchip" data-go="' + id + '"><i class="fdot" style="background:' + col(n) + '"></i>' + esc(short(n)) + "</button>" : ""; };
  const link = (code, label) => '<a href="' + esc(D.url(code)) + '" target="_blank" rel="noopener">' + esc(label || D.srcName(code)) + " ↗</a>";

  const state = { view: "compass", sel: null, year: 2026, fams: new Set(Object.keys(FAM)), lines: false, halos: true,
    cmp: D.red.start.slice(), atMode: "birth", atYear: 2026, libFam: "all" };
  const built = {};

  /* a play / scrub control for a year */
  function yearCtl(host, o) {
    host.innerHTML = '<button class="chipbtn yc-play" title="Play through time">▶</button><input type="range" aria-label="Year"><span class="yc-v"></span>';
    const r = host.querySelector("input"), v = host.querySelector(".yc-v"), b = host.querySelector(".yc-play");
    let timer = null;
    const show = () => { r.min = o.min; r.max = o.max; r.value = o.get(); v.textContent = o.label(o.get()); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; b.textContent = "▶"; b.classList.remove("on"); } };
    r.addEventListener("input", () => { stop(); o.set(+r.value); show(); });
    b.addEventListener("click", () => {
      if (timer) return stop();
      if (o.get() >= o.max) o.set(o.from || o.min);
      b.textContent = "❚❚"; b.classList.add("on");
      timer = setInterval(() => { const y = Math.min(o.max, o.get() + (o.rate || 1)); o.set(y); show(); if (y >= o.max) stop(); }, o.ms || 70);
      show();
    });
    show();
    return { show, stop, opts: o };
  }

  /* greedy label placement: items arrive in priority order; each tries eight spots around its dot */
  function placeLabels(items, W, H, lh, obst) {
    const boxes = items.map(it => [it.x - it.r - 2, it.y - it.r - 2, it.x + it.r + 2, it.y + it.r + 2]).concat(obst || []);
    const out = [], hh = lh || 12;
    const hit = (b, self) => { for (let i = 0; i < boxes.length; i++) { if (i === self) continue; const c = boxes[i]; if (b[0] < c[2] && b[2] > c[0] && b[1] < c[3] && b[3] > c[1]) return true; } return false; };
    items.forEach((it, i) => {
      if (it.nolabel) return;
      const w = it.w, g = it.r + 4;
      const C = [[g, hh / 3, "start"], [-g, hh / 3, "end"], [0, -g - 1, "middle"], [0, g + hh - 2, "middle"], [g - 2, -g + 3, "start"], [g - 2, g + hh - 4, "start"], [-g + 2, -g + 3, "end"], [-g + 2, g + hh - 4, "end"]];
      for (const c of C) {
        const tx = it.x + c[0], ty = it.y + c[1];
        const bx = c[2] === "start" ? tx : c[2] === "end" ? tx - w : tx - w / 2;
        const b = [bx - 1, ty - hh + 2, bx + w + 1, ty + 3];
        if (b[0] < 2 || b[2] > W - 2 || b[1] < 2 || b[3] > H - 2) continue;
        if (hit(b, i)) continue;
        boxes.push(b); out.push({ it, tx, ty, a: c[2] }); return;
      }
    });
    return out;
  }

  /* ═════════════════════ THE COMPASS ═════════════════════ */
  const cp = { k: 1, tx: 0, ty: 0, W: 0, H: 0, u: 1, cx: 0, cy: 0, lastYear: 2026 };
  const X = x => cp.cx + cp.tx + x * cp.u * cp.k, Y = y => cp.cy + cp.ty - y * cp.u * cp.k;
  const vis = n => n.yr <= state.year && state.fams.has(n.f);
  function cpSize() {
    const r = $("cp-wrap").getBoundingClientRect();
    if (!r.width || !r.height) return false;
    cp.W = r.width; cp.H = r.height;
    cp.u = Math.max(8, Math.min(cp.W - 24, cp.H - 46) / 20);
    cp.cx = cp.W / 2; cp.cy = cp.H / 2;
    $("cp").setAttribute("viewBox", "0 0 " + cp.W + " " + cp.H);
    cpClamp(); return true;
  }
  function cpClamp() {
    const half = 10 * cp.u * cp.k, mx = Math.max(0, half - cp.W / 2 + 30), my = Math.max(0, half - cp.H / 2 + 30);
    cp.tx = clamp(cp.tx, -mx, mx); cp.ty = clamp(cp.ty, -my, my);
  }
  function cpZoom(f, px, py) {
    const k2 = clamp(cp.k * f, 1, 8);
    if (px == null) { px = cp.W / 2; py = cp.H / 2; }
    const wx = (px - cp.cx - cp.tx) / (cp.u * cp.k), wy = (py - cp.cy - cp.ty) / (cp.u * cp.k);
    cp.tx = px - cp.cx - wx * cp.u * k2; cp.ty = py - cp.cy - wy * cp.u * k2; cp.k = k2;
    cpClamp(); drawCompass();
  }
  function arrowHead(x1, y1, x2, y2, back, size) {
    const a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - Math.cos(a) * back, by = y2 - Math.sin(a) * back, s = size || 6;
    return "M" + f1(bx) + " " + f1(by) + "L" + f1(bx - Math.cos(a - .42) * s) + " " + f1(by - Math.sin(a - .42) * s) + "L" + f1(bx - Math.cos(a + .42) * s) + " " + f1(by - Math.sin(a + .42) * s) + "Z";
  }
  function drawCompass() {
    if (state.view !== "compass" || !cp.W) return;
    const u = cp.u * cp.k, sel = state.sel ? BY[state.sel] : null, onChart = sel && sel.f && !sel.xc;
    const x0 = X(-10), x1 = X(10), y0 = Y(10), y1 = Y(-10), xm = X(0), ym = Y(0);
    let h = "";
    D.quads.forEach(q => {
      h += '<rect x="' + f1(q.x < 0 ? x0 : xm) + '" y="' + f1(q.y > 0 ? y0 : ym) + '" width="' + f1(10 * u) + '" height="' + f1(10 * u) + '" fill="' + q.c + '" opacity=".1"/>';
    });
    for (let g = -8; g <= 8; g += 2) {
      if (!g) continue;
      h += '<line class="cp-grid" x1="' + f1(X(g)) + '" y1="' + f1(y0) + '" x2="' + f1(X(g)) + '" y2="' + f1(y1) + '"/><line class="cp-grid" x1="' + f1(x0) + '" y1="' + f1(Y(g)) + '" x2="' + f1(x1) + '" y2="' + f1(Y(g)) + '"/>';
    }
    h += '<rect class="cp-frame" x="' + f1(x0) + '" y="' + f1(y0) + '" width="' + f1(20 * u) + '" height="' + f1(20 * u) + '"/>';
    h += '<line class="cp-axis" x1="' + f1(x0) + '" y1="' + f1(ym) + '" x2="' + f1(x1) + '" y2="' + f1(ym) + '"/><line class="cp-axis" x1="' + f1(xm) + '" y1="' + f1(y0) + '" x2="' + f1(xm) + '" y2="' + f1(y1) + '"/>';
    /* quadrant names sit behind the dots as watermarks */
    const qs = clamp(u * 1.05, 13, 44);
    D.quads.forEach(q => {
      const w = q.n.split(" ");
      h += '<text class="cp-q" text-anchor="middle" font-size="' + f1(qs) + '" fill="' + q.c + '"><tspan x="' + f1(X(q.x * 5)) + '" y="' + f1(Y(q.y * 5) - qs * .15) + '">' + w[0] + '</tspan><tspan x="' + f1(X(q.x * 5)) + '" dy="' + f1(qs * 1.15) + '">' + w[1] + "</tspan></text>";
    });
    /* axis names: outside the square where the stage is wide enough, inside it on a phone */
    const obst = [[xm - 62, Math.max(y0 - 7, 11) - 10, xm + 62, Math.max(y0 - 7, 11) + 3], [xm - 54, Math.min(y1 + 15, cp.H - 4) - 10, xm + 54, Math.min(y1 + 15, cp.H - 4) + 3]];
    if (cp.k === 1 && x0 > 150) {
      obst.push([x0 - 190, ym - 14, x0 - 8, ym + 16], [x1 + 8, ym - 14, x1 + 190, ym + 16]);
      h += '<text class="cp-ax" x="' + f1(x0 - 12) + '" y="' + f1(ym - 2) + '" text-anchor="end">◄ Economic left</text><text class="cp-tick" x="' + f1(x0 - 12) + '" y="' + f1(ym + 12) + '" text-anchor="end">common ownership · planning</text>';
      h += '<text class="cp-ax" x="' + f1(x1 + 12) + '" y="' + f1(ym - 2) + '">Economic right ►</text><text class="cp-tick" x="' + f1(x1 + 12) + '" y="' + f1(ym + 12) + '">private property · markets</text>';
    } else {
      obst.push([Math.max(x0, 0), ym - 16, Math.max(x0, 0) + 52, ym - 1], [Math.min(x1, cp.W) - 58, ym - 16, Math.min(x1, cp.W), ym - 1]);
      h += '<text class="cp-ax in" x="' + f1(Math.max(x0, 0) + 6) + '" y="' + f1(ym - 5) + '">◄ Left</text><text class="cp-ax in" x="' + f1(Math.min(x1, cp.W) - 6) + '" y="' + f1(ym - 5) + '" text-anchor="end">Right ►</text>';
    }
    h += '<text class="cp-ax" x="' + f1(xm) + '" y="' + f1(Math.max(y0 - 7, 11)) + '" text-anchor="middle">▲ Authoritarian</text><text class="cp-ax" x="' + f1(xm) + '" y="' + f1(Math.min(y1 + 15, cp.H - 4)) + '" text-anchor="middle">▼ Libertarian</text>';

    const shown = PLACED.filter(vis);
    /* how far each doctrine's adherents range */
    if (state.halos) shown.forEach(n => {
      const s = n.s || [0.75, 0.75], c = col(n);
      h += '<ellipse cx="' + f1(X(n.x)) + '" cy="' + f1(Y(n.y)) + '" rx="' + f1(s[0] * u) + '" ry="' + f1(s[1] * u) + '" fill="' + c + '" fill-opacity=".07" stroke="' + c + '" stroke-opacity=".2" stroke-width=".8"' + (onChart && sel !== n ? ' opacity=".35"' : "") + "/>";
    });
    if (sel && sel.xc && sel.span) {
      const s = sel.span;
      h += '<rect class="cp-span" x="' + f1(X(s[0])) + '" y="' + f1(Y(s[3])) + '" width="' + f1((s[2] - s[0]) * u) + '" height="' + f1((s[3] - s[1]) * u) + '" rx="10"/>';
      h += '<text class="cp-spanl" x="' + f1(X(s[0]) + 10) + '" y="' + f1(Y(s[3]) + 18) + '">' + esc(sel.n) + " — found across this whole region</text>";
    }
    /* lines of descent */
    const rel = new Set(), links = [];
    const onC = n => n && n.f && !n.xc && vis(n);
    if (state.lines) shown.forEach(n => (n.fr || []).forEach(f => { if (onC(BY[f[0]])) links.push([BY[f[0]], n, f[1], 0]); }));
    if (onChart) {
      (sel.fr || []).forEach(f => { const p = BY[f[0]]; if (onC(p)) { links.push([p, sel, f[1], 1]); rel.add(p.id); } });
      (KIDS[sel.id] || []).forEach(k => { const c = BY[k[0]]; if (onC(c)) { links.push([sel, c, k[1], 1]); rel.add(c.id); } });
    }
    links.forEach(L => {
      const ax = X(L[0].x), ay = Y(L[0].y), bx = X(L[1].x), by = Y(L[1].y), dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      const mx = (ax + bx) / 2 - dy / len * len * .12, my = (ay + by) / 2 + dx / len * len * .12;
      const c = L[2] === "x" ? "#ff7a66" : L[2] === "p" ? "#dfe3ee" : (L[3] ? "#e8c455" : col(L[1]));
      h += '<path class="cp-ln ' + L[2] + (L[3] ? " hot" : "") + '" stroke="' + c + '" d="M' + f1(ax) + " " + f1(ay) + "Q" + f1(mx) + " " + f1(my) + " " + f1(bx) + " " + f1(by) + '"/>';
      if (L[3]) h += '<path d="' + arrowHead(mx, my, bx, by, 9, 7) + '" fill="' + c + '"/>';
    });
    /* dots */
    const items = [];
    shown.forEach(n => {
      const x = X(n.x), y = Y(n.y);
      if (x < -20 || x > cp.W + 20 || y < -20 || y > cp.H + 20) return;
      const r = (n.p === 1 ? 6 : n.p === 2 ? 5 : 4.3) * (cp.k > 2 ? 1.15 : 1) * (u < 19 ? .72 : 1), isSel = sel === n, isRel = rel.has(n.id);
      const dim = onChart && !isSel && !isRel, fresh = n.yr > cp.lastYear;
      h += '<g class="cp-n' + (dim ? " dim" : "") + (fresh ? " new" : "") + '" data-id="' + n.id + '" tabindex="0" role="button" aria-label="' + esc(n.n) + '">';
      if (isSel) h += '<circle class="cp-ring" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (r + 5) + '"/>';
      else if (isRel) h += '<circle class="cp-ring rel" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (r + 4) + '"/>';
      h += '<circle class="d" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="' + col(n) + '"/><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (u < 19 ? 9 : 13) + '" fill="transparent"/></g>';
      const t = short(n);
      items.push({ n, x, y, r, text: t, w: t.length * (n.p === 1 ? 6.5 : 6.0) + 4, pri: (isSel ? -2 : isRel ? -1 : 0) * 10 + (n.p || 3), dim });
    });
    items.sort((a, b) => a.pri - b.pri);
    placeLabels(items, cp.W, cp.H, 12, obst).forEach(L => {
      const n = L.it.n;
      h += '<text class="cl' + (n.p === 1 ? " p1" : "") + (sel === n ? " sel" : "") + (L.it.dim ? " dim" : "") + '" x="' + f1(L.tx) + '" y="' + f1(L.ty) + '" text-anchor="' + L.a + '">' + esc(L.it.text) + "</text>";
    });
    $("cp").innerHTML = h;
    cp.lastYear = state.year;
  }
  function buildCompass() {
    $("cp-fams").innerHTML = Object.keys(FAM).map(k => '<button class="chipbtn fam on" data-f="' + k + '" title="Show or hide: ' + esc(FAM[k][0]) + '"><i class="fdot" style="background:' + FAM[k][1] + '"></i>' + esc(FAM[k][0].split(/ &|,/)[0]) + "</button>").join("");
    $("cp-fams").addEventListener("click", e => {
      const b = e.target.closest("[data-f]"); if (!b) return;
      const k = b.dataset.f;
      /* a first click on a full set isolates that family; clicking the lone family restores all */
      if (state.fams.size === Object.keys(FAM).length) state.fams = new Set([k]);
      else if (state.fams.has(k) && state.fams.size === 1) state.fams = new Set(Object.keys(FAM));
      else if (state.fams.has(k)) state.fams.delete(k); else state.fams.add(k);
      $("cp-fams").querySelectorAll("[data-f]").forEach(x => x.classList.toggle("on", state.fams.has(x.dataset.f)));
      drawCompass();
    });
    $("cp-xc").innerHTML = XC.map(n => '<button class="chipbtn xc" data-go="' + n.id + '" title="' + esc(n.n) + ' — no single position">' + esc(short(n)) + "</button>").join("");
    built.cpYear = yearCtl($("cp-year"), { min: 1640, max: 2026, rate: 2, ms: 60, get: () => state.year, set: y => { state.year = y; drawCompass(); cpXc(); },
      label: y => y >= 2026 ? "to today" : "as of " + y });
    $("cp-halos").addEventListener("click", e => { state.halos = !state.halos; e.currentTarget.classList.toggle("on", state.halos); drawCompass(); });
    $("cp-lines").addEventListener("click", e => { state.lines = !state.lines; e.currentTarget.classList.toggle("on", state.lines); drawCompass(); });
    $("cp-zi").addEventListener("click", () => cpZoom(1.5));
    $("cp-zo").addEventListener("click", () => cpZoom(1 / 1.5));
    $("cp-zr").addEventListener("click", () => { cp.k = 1; cp.tx = cp.ty = 0; drawCompass(); });
    const svg = $("cp"), tip = $("cp-tip"), ptr = new Map();
    let drag = null, pinch = 0;
    svg.addEventListener("wheel", e => { e.preventDefault(); const r = svg.getBoundingClientRect(); cpZoom(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    svg.addEventListener("pointerdown", e => {
      ptr.set(e.pointerId, [e.clientX, e.clientY]);
      const g = e.target.closest ? e.target.closest("[data-id]") : null;
      drag = { x: e.clientX, y: e.clientY, tx: cp.tx, ty: cp.ty, id: g ? g.dataset.id : null, moved: false };
      if (ptr.size === 2) { const p = [...ptr.values()]; pinch = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]); }
      try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    });
    svg.addEventListener("pointermove", e => {
      if (ptr.has(e.pointerId)) ptr.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptr.size === 2 && pinch) {
        const p = [...ptr.values()], d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), r = svg.getBoundingClientRect();
        if (Math.abs(d - pinch) > 4) { cpZoom(d / pinch, (p[0][0] + p[1][0]) / 2 - r.left, (p[0][1] + p[1][1]) / 2 - r.top); pinch = d; if (drag) drag.moved = true; }
        return;
      }
      if (drag && ptr.size === 1) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add("drag"); tip.hidden = true; }
        if (drag.moved) { cp.tx = drag.tx + dx; cp.ty = drag.ty + dy; cpClamp(); drawCompass(); }
        return;
      }
      const g = e.target.closest ? e.target.closest("[data-id]") : null;
      if (!g) { tip.hidden = true; return; }
      const n = BY[g.dataset.id], r = $("cp-wrap").getBoundingClientRect();
      tip.innerHTML = "<b>" + esc(n.n) + "</b><small>" + yr(n) + " · " + esc(n.pl) + "</small>";
      tip.hidden = false;
      tip.style.left = clamp(e.clientX - r.left + 14, 4, r.width - tip.offsetWidth - 4) + "px";
      tip.style.top = clamp(e.clientY - r.top + 14, 4, r.height - tip.offsetHeight - 4) + "px";
    });
    const up = e => {
      ptr.delete(e.pointerId); if (ptr.size < 2) pinch = 0;
      svg.classList.remove("drag");
      if (drag && !drag.moved && ptr.size === 0) select(drag.id || null);
      if (ptr.size === 0) drag = null;
    };
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", e => { ptr.delete(e.pointerId); drag = null; pinch = 0; svg.classList.remove("drag"); });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; });
    svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const g = e.target.closest("[data-id]"); if (g) { e.preventDefault(); select(g.dataset.id); } } });
    if (window.ResizeObserver) new ResizeObserver(() => { if (state.view === "compass" && cpSize()) drawCompass(); }).observe($("cp-wrap"));
    window.addEventListener("resize", () => { if (state.view === "compass" && cpSize()) drawCompass(); });
  }
  function cpXc() { $("cp-xc").querySelectorAll("[data-go]").forEach(b => { const n = BY[b.dataset.go]; b.classList.toggle("off", n.yr > state.year); b.classList.toggle("on", state.sel === n.id); }); }

  /* ═════════════════════ THE LINEAGE ═════════════════════ */
  /* time runs left to right on a piecewise scale: the centuries before 1750 are compressed,
     1830–1850 and 1900–1930 (where the doctrines crowd) are stretched */
  const TS = [[-400, 0], [1500, 100], [1750, 330], [1830, 700], [1850, 1010], [1900, 1640], [1930, 2150], [2000, 2900], [2026, 3110]];
  const ln = { z: 1, pos: {}, bands: [], W: 0, H: 0, LM: 26, TOP: 30 };
  function tpx(y) {
    for (let i = 1; i < TS.length; i++) if (y <= TS[i][0]) { const a = TS[i - 1], b = TS[i]; return a[1] + (Math.max(y, a[0]) - a[0]) / (b[0] - a[0]) * (b[1] - a[1]); }
    return TS[TS.length - 1][1];
  }
  const lx = y => ln.LM + tpx(y) * ln.z;
  function buildLineage() {
    const RH = 22;
    let y = ln.TOP; ln.pos = {}; ln.bands = [];
    LANES.forEach((L, li) => {
      const ns = N.filter(n => n.ln === L[0]).sort((a, b) => a.yr - b.yr || a.n.length - b.n.length), rows = [];
      ns.forEach(n => {
        const x = lx(n.yr), w = 16 + short(n).length * 6.1 + 12;
        let r = 0; while (r < rows.length && rows[r] > x - 9) r++;
        rows[r] = x + w; ln.pos[n.id] = { x, r };
      });
      const h = Math.max(1, rows.length) * RH + 26;
      ns.forEach(n => { ln.pos[n.id].y = y + 30 + ln.pos[n.id].r * RH; });
      ln.bands.push({ key: L[0], label: L[1], y, h, alt: li % 2 }); y += h;
    });
    ln.W = lx(2026) + 300; ln.H = y + 12;
    const svg = $("ln");
    svg.setAttribute("width", ln.W); svg.setAttribute("height", ln.H); svg.setAttribute("viewBox", "0 0 " + ln.W + " " + ln.H);
    let h = "";
    ln.bands.forEach(b => { h += '<rect class="ln-band' + (b.alt ? " alt" : "") + (b.key === "mx" ? " mx" : "") + '" x="0" y="' + b.y + '" width="' + ln.W + '" height="' + b.h + '"/>'; });
    [[1789, "1789 · the Revolution"], [1848, "1848 · the Manifesto"], [1871, "1871 · the Commune"], [1914, "1914"], [1917, "1917 · October"], [1945, "1945"], [1989, "1989 · the Wall"]].forEach(g => {
      h += '<line class="ln-guide" x1="' + f1(lx(g[0])) + '" y1="' + ln.TOP + '" x2="' + f1(lx(g[0])) + '" y2="' + ln.H + '"/>';
    });
    h += '<g id="ln-edges">';
    N.forEach(n => (n.fr || []).forEach(f => {
      const a = ln.pos[f[0]], b = ln.pos[n.id]; if (!a || !b) return;
      const dx = Math.max(26, Math.abs(b.x - a.x) * .42);
      h += '<path class="ln-e ' + f[1] + '" data-a="' + f[0] + '" data-b="' + n.id + '" d="M' + f1(a.x) + " " + a.y + "C" + f1(a.x + dx) + " " + a.y + " " + f1(b.x - dx) + " " + b.y + " " + f1(b.x) + " " + b.y + '"/>';
    }));
    h += '</g><g id="ln-nodes">';
    N.forEach(n => {
      const p = ln.pos[n.id]; let g;
      if (n.f) g = '<circle class="g" cx="' + f1(p.x) + '" cy="' + p.y + '" r="' + (n.p === 1 ? 6 : 5) + '" fill="' + col(n) + '"/>';
      else if (n.k === "o") g = '<rect class="g" x="' + f1(p.x - 4) + '" y="' + (p.y - 4) + '" width="8" height="8"/>';
      else if (n.k === "e") g = '<path class="g" d="M' + f1(p.x) + " " + (p.y - 5.5) + "L" + f1(p.x + 5) + " " + (p.y + 4) + "L" + f1(p.x - 5) + " " + (p.y + 4) + 'Z"/>';
      else g = '<path class="g" d="M' + f1(p.x) + " " + (p.y - 5.5) + "L" + f1(p.x + 5) + " " + p.y + "L" + f1(p.x) + " " + (p.y + 5.5) + "L" + f1(p.x - 5) + " " + p.y + 'Z"/>';
      h += '<g class="ln-n ' + (n.f ? "ide" : "root") + '" data-id="' + n.id + '" tabindex="0" role="button"><title>' + esc(n.n) + " — " + yr(n) + ", " + esc(n.pl) + "</title>" +
        '<rect class="ln-bg" x="' + f1(p.x + 7) + '" y="' + (p.y - 8) + '" width="' + f1(short(n).length * 6.1 + 7) + '" height="16" rx="3"/>' + g +
        '<text x="' + f1(p.x + 10) + '" y="' + (p.y + 4) + '">' + esc(short(n)) + "</text></g>";
    });
    h += '</g><g id="ln-lanes">';
    ln.bands.forEach(b => { h += '<text class="ln-lane" x="10" y="' + (b.y + 14) + '">' + esc(b.label) + "</text>"; });
    h += '</g><g id="ln-axis"><rect class="ln-axis-bg" x="0" y="0" width="' + ln.W + '" height="' + (ln.TOP - 4) + '"/>';
    [-375, 1, 1500, 1650, 1750, 1790, 1810, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].forEach(t => {
      h += '<text class="ln-tick" x="' + f1(lx(t)) + '" y="17" text-anchor="middle">' + (t < 0 ? -t + " BCE" : t === 1 ? "1 CE" : t) + "</text>";
    });
    h += "</g>";
    svg.innerHTML = h;
    lnSticky(); lnHighlight();
  }
  /* lane names ride the left edge and the year axis rides the top edge as the sheet scrolls */
  function lnSticky() {
    const sc = $("ln-scroll"), a = $("ln").querySelector("#ln-axis"), l = $("ln").querySelector("#ln-lanes");
    if (a) a.setAttribute("transform", "translate(0," + sc.scrollTop + ")");
    if (l) l.setAttribute("transform", "translate(" + sc.scrollLeft + ",0)");
  }
  function closure(id, up) {
    const seen = new Set(), q = [id];
    while (q.length) {
      const c = q.pop();
      (up ? (BY[c].fr || []).map(f => f[0]) : (KIDS[c] || []).map(k => k[0])).forEach(x => { if (!seen.has(x) && x !== id) { seen.add(x); q.push(x); } });
    }
    return seen;
  }
  function lnHighlight() {
    const svg = $("ln"); if (!svg.firstChild) return;
    const sel = state.sel, A = sel ? closure(sel, true) : null, K = sel ? closure(sel, false) : null;
    svg.querySelectorAll(".ln-n").forEach(g => {
      const id = g.dataset.id;
      g.classList.toggle("sel", id === sel);
      g.classList.toggle("anc", !!sel && A.has(id));
      g.classList.toggle("desc", !!sel && K.has(id) && !A.has(id));
      g.classList.toggle("off", !!sel && id !== sel && !A.has(id) && !K.has(id));
    });
    svg.querySelectorAll(".ln-e").forEach(p => {
      const a = p.dataset.a, b = p.dataset.b;
      const anc = !!sel && (b === sel || A.has(b)) && A.has(a), desc = !!sel && (a === sel || K.has(a)) && K.has(b);
      p.classList.toggle("anc", anc); p.classList.toggle("desc", desc && !anc); p.classList.toggle("off", !!sel && !anc && !desc);
    });
  }
  function lnFocus(id, instant) {
    const p = ln.pos[id], sc = $("ln-scroll"); if (!p) return;
    const o = { left: Math.max(0, p.x - sc.clientWidth * .45), top: Math.max(0, p.y - sc.clientHeight * .45) };
    if (!instant && sc.scrollTo) sc.scrollTo(Object.assign({ behavior: "smooth" }, o)); else { sc.scrollLeft = o.left; sc.scrollTop = o.top; }
  }
  function wireLineage() {
    const sc = $("ln-scroll"), svg = $("ln");
    sc.addEventListener("scroll", lnSticky, { passive: true });
    let d = null;
    sc.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; d = { x: e.clientX, y: e.clientY, l: sc.scrollLeft, t: sc.scrollTop, moved: false }; });
    window.addEventListener("pointermove", e => { if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (!d.moved && Math.hypot(dx, dy) > 5) { d.moved = true; sc.classList.add("drag"); } if (d.moved) { sc.scrollLeft = d.l - dx; sc.scrollTop = d.t - dy; } });
    window.addEventListener("pointerup", () => { if (d && d.moved) { sc.classList.remove("drag"); sc.dataset.justDragged = "1"; setTimeout(() => { delete sc.dataset.justDragged; }, 0); } d = null; });
    svg.addEventListener("click", e => { if (sc.dataset.justDragged) return; const g = e.target.closest(".ln-n"); select(g ? g.dataset.id : null); });
    svg.addEventListener("keydown", e => { if (e.key === "Enter") { const g = e.target.closest(".ln-n"); if (g) select(g.dataset.id); } });
    const rez = f => { const c = (sc.scrollLeft + sc.clientWidth / 2 - ln.LM) / ln.z; ln.z = clamp(ln.z * f, .45, 1.8); buildLineage(); sc.scrollLeft = c * ln.z + ln.LM - sc.clientWidth / 2; lnSticky(); };
    $("ln-zi").addEventListener("click", () => rez(1.25));
    $("ln-zo").addEventListener("click", () => rez(1 / 1.25));
    $("ln-1848").addEventListener("click", () => { select("marxism"); lnFocus("marxism"); });
    $("ln-1917").addEventListener("click", () => { select("october"); lnFocus("october"); });
  }

  /* ═════════════════════ THE ATLAS ═════════════════════ */
  const at = { x: 5, y: 8, w: 350, h: 140, W: 0, H: 0, paths: {}, region: "world" };
  const REGIONS = [["world", "World", [-170, -56, 180, 80]], ["europe", "Europe", [-12, 35, 47, 62]], ["asia", "Asia", [28, -10, 150, 60]], ["americas", "Americas", [-128, -45, -32, 55]], ["africa", "Africa & Middle East", [-20, -36, 62, 42]]];
  const REDLANES = { mx: 1, ref: 1, rev: 1, dis: 1, tri: 1 };
  function atApply() { $("at").setAttribute("viewBox", f1(at.x) + " " + f1(at.y) + " " + at.w.toFixed(2) + " " + at.h.toFixed(2)); atDraw(); }
  function atFit(box) {
    const r = $("at-wrap").getBoundingClientRect(); if (!r.width || !r.height) return;
    at.W = r.width; at.H = r.height;
    const asp = r.width / r.height; let w = box[2] - box[0], h = box[3] - box[1];
    const cx = (box[0] + box[2]) / 2 + 180, cy = 90 - (box[1] + box[3]) / 2;
    if (w / h < asp) w = h * asp; else h = w / asp;
    at.x = cx - w / 2; at.y = cy - h / 2; at.w = w; at.h = h; atApply();
  }
  function atZoom(f, px, py) {
    const w2 = clamp(at.w / f, 6, 360 * Math.max(1, at.W / at.H / 2)), k = w2 / at.w;
    if (px == null) { px = at.W / 2; py = at.H / 2; }
    const ux = at.x + px / at.W * at.w, uy = at.y + py / at.H * at.h;
    at.x = ux - (ux - at.x) * k; at.y = uy - (uy - at.y) * k; at.w = w2; at.h = at.h * k;
    at.x = clamp(at.x, -60, 420 - at.w); at.y = clamp(at.y, -30, 210 - at.h);
    at.region = ""; atRegionChips(); atApply();
  }
  function alignAt(row, y) { for (const s of row.seg) if (y >= s[0] && y < s[1]) return s[2]; return null; }
  function atDraw() {
    if (state.view !== "atlas" || !at.W || !built.atlas) return;
    const svg = $("at"), sc = at.w / at.W, red = state.atMode === "red", Yr = state.atYear, sel = state.sel ? BY[state.sel] : null;
    /* countries */
    const fill = {};
    if (red) D.states.forEach(row => { const a = alignAt(row, Yr); if (a) row.n.forEach(nm => { fill[nm] = [a, row]; }); });
    COUNTRIES.forEach((c, i) => {
      const p = at.paths[i], f = fill[c.n];
      if (f) { p.style.fill = f[1].part ? "url(#at-hatch)" : D.align[f[0]][1]; p.style.fillOpacity = f[1].part ? "1" : ".78"; p.classList.add("on"); p.dataset.tip = (f[1].l || c.n) + " — " + D.align[f[0]][0].toLowerCase(); }
      else if (p.classList.contains("on") || p.style.fill) { p.style.fill = ""; p.style.fillOpacity = ""; p.classList.remove("on"); delete p.dataset.tip; }
    });
    /* markers */
    const shown = N.filter(n => n.yr <= Yr && (!red || REDLANES[n.ln]));
    const P = n => [n.at[1] + 180, 90 - n.at[0]];
    const cells = {};
    shown.forEach(n => { const p = P(n), k = Math.floor((p[0] - at.x) / sc / 30) + "," + Math.floor((p[1] - at.y) / sc / 30); (cells[k] = cells[k] || []).push(n); });
    let h = "", marks = [];
    const rel = new Set();
    if (sel) { (sel.fr || []).forEach(f => rel.add(f[0])); (KIDS[sel.id] || []).forEach(k => rel.add(k[0])); }
    Object.values(cells).forEach(g => {
      const xs = g.map(n => P(n)[0]), ys = g.map(n => P(n)[1]);
      const spanPx = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / sc;
      const hasSel = sel && g.indexOf(sel) >= 0;
      if (g.length > 9 && spanPx > 7 && !hasSel) {
        const cx = xs.reduce((a, b) => a + b, 0) / g.length, cy = ys.reduce((a, b) => a + b, 0) / g.length, r = (9 + Math.min(10, g.length * .35)) * sc;
        h += '<g class="at-m" data-zoom="' + [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(f1).join(",") + '"><circle class="at-bub" cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" r="' + r.toFixed(2) + '"/><text class="at-bubt" x="' + cx.toFixed(2) + '" y="' + (cy + 3.6 * sc).toFixed(2) + '" font-size="' + (10.5 * sc).toFixed(2) + '">' + g.length + "</text></g>";
        return;
      }
      /* doctrines born in the same city fan out around it */
      const spots = {};
      g.forEach(n => { const k = n.at[0].toFixed(1) + "," + n.at[1].toFixed(1); (spots[k] = spots[k] || []).push(n); });
      Object.values(spots).forEach(s => {
        s.sort((a, b) => a.yr - b.yr);
        const c = P(s[0]);
        s.forEach((n, i) => {
          let x = c[0], y = c[1];
          if (s.length > 1) {
            let ring = 0, idx = i, cap = 7; while (idx >= cap) { idx -= cap; ring++; cap += 6; }
            const a = -Math.PI / 2 + idx / Math.min(cap, s.length - (i - idx)) * Math.PI * 2 + ring * .4, rad = (11 + ring * 10) * sc;
            x += Math.cos(a) * rad; y += Math.sin(a) * rad;
            h += '<line class="at-stem" x1="' + c[0].toFixed(2) + '" y1="' + c[1].toFixed(2) + '" x2="' + x.toFixed(2) + '" y2="' + y.toFixed(2) + '"/>';
          }
          marks.push({ n, x, y });
        });
      });
    });
    /* arcs: where the selected doctrine's sources were born, and where its offspring went */
    if (sel) {
      const arc = (a, b, c) => { const pa = P(a), pb = P(b), dx = pb[0] - pa[0], dy = pb[1] - pa[1], len = Math.hypot(dx, dy); if (len < 1.2 * sc * 8) return ""; return '<path class="at-arc" stroke="' + c + '" d="M' + pa[0].toFixed(2) + " " + pa[1].toFixed(2) + "Q" + ((pa[0] + pb[0]) / 2 - dy * .16).toFixed(2) + " " + ((pa[1] + pb[1]) / 2 + dx * .16 - len * .06).toFixed(2) + " " + pb[0].toFixed(2) + " " + pb[1].toFixed(2) + '"/>'; };
      (sel.fr || []).forEach(f => { const p = BY[f[0]]; if (p.yr <= Yr) h += arc(p, sel, f[1] === "x" ? "#ff7a66" : "#e8c455"); });
      (KIDS[sel.id] || []).forEach(k => { const c = BY[k[0]]; if (c.yr <= Yr) h += arc(sel, c, "#7fd4ff"); });
    }
    marks.forEach(m => {
      const n = m.n, r = (n.f ? (n.p === 1 ? 5 : 4.2) : 3.2) * sc, isSel = sel === n;
      h += '<g class="at-m" data-id="' + n.id + '">';
      if (isSel) h += '<circle cx="' + m.x.toFixed(2) + '" cy="' + m.y.toFixed(2) + '" r="' + (r + 4.5 * sc).toFixed(2) + '" fill="none" stroke="#e8c455" stroke-width="1.8"/>';
      h += '<circle cx="' + m.x.toFixed(2) + '" cy="' + m.y.toFixed(2) + '" r="' + r.toFixed(2) + '" fill="' + (n.f ? col(n) : "#12151f") + '" stroke="' + (n.f ? "#0a0c12" : "#d8c690") + '" stroke-width="1.2"' + (sel && !isSel && !rel.has(n.id) ? ' opacity=".4"' : "") + '/><circle cx="' + m.x.toFixed(2) + '" cy="' + m.y.toFixed(2) + '" r="' + (9 * sc).toFixed(2) + '" fill="transparent"/></g>';
    });
    /* labels in screen space, drawn in map units */
    const items = marks.filter(m => sel ? (m.n === sel || rel.has(m.n.id)) : (m.n.f && (m.n.p === 1 || at.w < 90 || (m.n.p === 2 && at.w < 200))))
      .map(m => ({ n: m.n, x: (m.x - at.x) / sc, y: (m.y - at.y) / sc, r: 5, text: short(m.n), w: short(m.n).length * 6 + 4, pri: (m.n === sel ? -9 : 0) + (m.n.p || 3) }));
    marks.forEach(m => { if (!items.some(i => i.n === m.n)) items.push({ n: m.n, x: (m.x - at.x) / sc, y: (m.y - at.y) / sc, r: 5, nolabel: 1, w: 0, pri: 9 }); });
    items.sort((a, b) => a.pri - b.pri);
    placeLabels(items, at.W, at.H, 12).forEach(L => {
      h += '<text class="at-l" x="' + (at.x + L.tx * sc).toFixed(2) + '" y="' + (at.y + L.ty * sc).toFixed(2) + '" text-anchor="' + L.a + '" font-size="' + (10.5 * sc).toFixed(2) + '" stroke-width="' + (3 * sc).toFixed(2) + '"' + (L.it.n === sel ? ' fill="#e8c455" font-weight="600"' : "") + ">" + esc(L.it.text) + "</text>";
    });
    svg.querySelector("#at-marks").innerHTML = h;
    /* legend */
    if (red) {
      const cnt = {}; let total = 0;
      D.states.forEach(row => { const a = alignAt(row, Yr); if (a) { cnt[a] = (cnt[a] || 0) + 1; total++; } });
      $("at-leg").innerHTML = "<b>" + Yr + " · " + total + " " + (total === 1 ? "state" : "states") + "</b>" + Object.keys(D.align).map(k => '<span' + (cnt[k] ? "" : ' style="opacity:.4"') + '><i style="background:' + D.align[k][1] + '"></i>' + D.align[k][0] + "</span>").join("") + '<br><span style="white-space:normal;color:#66708c">Modern borders. Hatched: only part of the country (East Germany, South Yemen).</span>';
    } else {
      $("at-leg").innerHTML = "<b>Birthplaces" + (Yr < 2026 ? " · to " + Yr : "") + "</b>" + Object.keys(FAM).map(k => '<span><i style="background:' + FAM[k][1] + ';border-radius:50%"></i>' + esc(FAM[k][0].split(/ &|,/)[0]) + "</span>").join("") + '<span><i style="background:#12151f;border:1px solid #d8c690;border-radius:50%"></i>thinker · text · event</span>';
    }
    if (!state.sel) renderSide();
  }
  function atRegionChips() { $("at-regions").querySelectorAll("[data-r]").forEach(b => b.classList.toggle("on", b.dataset.r === at.region)); }
  function buildAtlas() {
    const svg = $("at");
    let h = '<defs><pattern id="at-hatch" width="1.4" height="1.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.4" height="1.4" fill="#1a2030"/><rect width=".7" height="1.4" fill="#e5484d" fill-opacity=".8"/></pattern></defs><g id="at-land">';
    COUNTRIES.forEach((c, i) => { h += '<path class="at-c" data-c="' + i + '" d="' + c.d + '"/>'; });
    h += '</g><g id="at-marks"></g>';
    svg.innerHTML = h;
    svg.querySelectorAll(".at-c").forEach(p => { at.paths[+p.dataset.c] = p; });
    $("at-regions").innerHTML = REGIONS.map(r => '<button class="chipbtn" data-r="' + r[0] + '">' + r[1] + "</button>").join("") + '<button class="chipbtn" id="at-zi" title="Zoom in">+</button><button class="chipbtn" id="at-zo" title="Zoom out">−</button>';
    $("at-regions").addEventListener("click", e => {
      const b = e.target.closest("[data-r]");
      if (b) { at.region = b.dataset.r; atRegionChips(); atFit(REGIONS.find(r => r[0] === at.region)[2]); }
      else if (e.target.id === "at-zi") atZoom(1.6); else if (e.target.id === "at-zo") atZoom(1 / 1.6);
    });
    $("at-modes").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (b) atMode(b.dataset.m); });
    built.atYear = yearCtl($("at-year"), { min: 1500, max: 2026, rate: 3, ms: 70, get: () => state.atYear, set: y => { state.atYear = y; atDraw(); },
      label: y => state.atMode === "red" ? String(y) : (y >= 2026 ? "to today" : "as of " + y) });
    const tip = $("at-tip"), ptr = new Map(); let drag = null, pinch = 0;
    svg.addEventListener("wheel", e => { e.preventDefault(); const r = svg.getBoundingClientRect(); atZoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    svg.addEventListener("pointerdown", e => {
      ptr.set(e.pointerId, [e.clientX, e.clientY]);
      const g = e.target.closest ? e.target.closest(".at-m") : null;
      drag = { x: e.clientX, y: e.clientY, vx: at.x, vy: at.y, g, moved: false };
      if (ptr.size === 2) { const p = [...ptr.values()]; pinch = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]); }
      try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    });
    svg.addEventListener("pointermove", e => {
      if (ptr.has(e.pointerId)) ptr.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptr.size === 2 && pinch) {
        const p = [...ptr.values()], d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), r = svg.getBoundingClientRect();
        if (Math.abs(d - pinch) > 4) { atZoom(d / pinch, (p[0][0] + p[1][0]) / 2 - r.left, (p[0][1] + p[1][1]) / 2 - r.top); pinch = d; if (drag) drag.moved = true; }
        return;
      }
      if (drag && ptr.size === 1) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add("drag"); tip.hidden = true; }
        if (drag.moved) { const sc = at.w / at.W; at.x = clamp(drag.vx - dx * sc, -60, 420 - at.w); at.y = clamp(drag.vy - dy * sc, -30, 210 - at.h); at.region = ""; svg.setAttribute("viewBox", f1(at.x) + " " + f1(at.y) + " " + at.w.toFixed(2) + " " + at.h.toFixed(2)); }
        return;
      }
      const g = e.target.closest ? e.target.closest(".at-m[data-id]") : null, c = !g && e.target.dataset ? e.target.dataset.tip : null;
      if (!g && !c) { tip.hidden = true; return; }
      const r = $("at-wrap").getBoundingClientRect();
      if (g) { const n = BY[g.dataset.id]; tip.innerHTML = "<b>" + esc(n.n) + "</b><small>" + yr(n) + " · " + esc(n.pl) + "</small>"; }
      else tip.innerHTML = "<b>" + esc(c.split(" — ")[0]) + "</b><small>" + esc(c.split(" — ")[1] || "") + "</small>";
      tip.hidden = false;
      tip.style.left = clamp(e.clientX - r.left + 14, 4, r.width - tip.offsetWidth - 4) + "px";
      tip.style.top = clamp(e.clientY - r.top + 14, 4, r.height - tip.offsetHeight - 4) + "px";
    });
    svg.addEventListener("pointerup", e => {
      ptr.delete(e.pointerId); if (ptr.size < 2) pinch = 0;
      svg.classList.remove("drag");
      if (drag && ptr.size === 0) {
        if (drag.moved) { atRegionChips(); atDraw(); }
        else if (drag.g && drag.g.dataset.zoom) { const b = drag.g.dataset.zoom.split(",").map(Number), pad = Math.max(2.5, (b[2] - b[0]) * .25, (b[3] - b[1]) * .25); at.region = ""; atRegionChips(); atFit([b[0] - 180 - pad, 90 - b[3] - pad, b[2] - 180 + pad, 90 - b[1] + pad]); }
        else select(drag.g ? drag.g.dataset.id : null);
        drag = null;
      }
    });
    svg.addEventListener("pointercancel", e => { ptr.delete(e.pointerId); drag = null; pinch = 0; svg.classList.remove("drag"); });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; });
    const refit = () => { if (state.view !== "atlas") return; const r = $("at-wrap").getBoundingClientRect(); if (!r.width) return; const cx = at.x + at.w / 2, cy = at.y + at.h / 2; at.W = r.width; at.H = r.height; at.h = at.w * r.height / r.width; at.x = cx - at.w / 2; at.y = cy - at.h / 2; atApply(); };
    if (window.ResizeObserver) new ResizeObserver(refit).observe($("at-wrap")); else window.addEventListener("resize", refit);
    built.atlas = true;
  }
  function atMode(m) {
    state.atMode = m;
    $("at-modes").querySelectorAll("[data-m]").forEach(b => b.classList.toggle("on", b.dataset.m === m));
    const c = built.atYear; c.stop();
    if (m === "red") { c.opts.min = 1917; c.opts.rate = 1; c.opts.ms = 110; if (state.atYear >= 2026 || state.atYear < 1917) state.atYear = 1980; }
    else { c.opts.min = 1500; c.opts.rate = 3; c.opts.ms = 70; state.atYear = 2026; }
    c.show(); atDraw(); renderSide(); pushHash();
  }
  function atFocus(n) {
    const x = n.at[1] + 180, y = 90 - n.at[0];
    if (x < at.x + at.w * .08 || x > at.x + at.w * .92 || y < at.y + at.h * .08 || y > at.y + at.h * .92) { at.x = clamp(x - at.w / 2, -60, 420 - at.w); at.y = clamp(y - at.h / 2, -30, 210 - at.h); at.region = ""; atRegionChips(); atApply(); }
  }

  /* ═════════════════════ THE MANIFESTO ═════════════════════ */
  function renderManifesto() {
    const M = D.manifesto;
    let h = '<div class="dc-doc"><h2>The Manifesto of the Communist Party</h2><p class="lead">Twenty-three pages, written in six weeks by a twenty-nine-year-old in Brussels from a draft by his twenty-seven-year-old friend. Below, each of its claims is set between where the idea came from and what its heirs did with it. The theses are paraphrased; the chips open each source in the side panel.</p>';
    h += '<dl class="facts">' + M.facts.map(f => "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>").join("") + "</dl>";
    h += '<p class="callout">' + esc(M.absent) + "</p>";
    M.sections.forEach(s => {
      h += '<section class="mf-sec"><header><span class="mf-num">' + (s.n === "Preamble" ? "✦" : s.n) + "</span><h3>" + esc(s.t) + '</h3></header><p class="mf-gist">' + esc(s.g) + "</p>";
      s.th.forEach(t => {
        h += '<div class="mf-th"><div class="from"><div class="mf-k">Where it came from</div><p>' + esc(t.from) + '</p><div class="mf-chips">' + (t.fr || []).map(chip).join("") + '</div></div><div class="th"><div class="mf-k">The thesis</div><p>' + esc(t.t) + '</p></div><div class="after"><div class="mf-k">What its heirs did with it</div><p>' + esc(t.after) + "</p></div></div>";
      });
      h += "</section>";
    });
    h += '<h3 class="wr-h">The ten-point programme — and what became of it</h3><p class="wr-sub">' + esc(M.programme.note) + '</p><table class="tbl"><thead><tr><th></th><th>The measure (1848)</th><th>Its fate</th></tr></thead><tbody>' +
      M.programme.items.map((p, i) => '<tr><td class="n">' + (i + 1) + '</td><td class="m">' + esc(p[0]) + "</td><td>" + esc(p[1]) + "</td></tr>").join("") + "</tbody></table>";
    h += '<h3 class="wr-h">Editions and prefaces</h3><table class="tbl"><tbody>' + M.editions.map(e => '<tr><td class="yr">' + e[0] + '</td><td class="m" style="width:18%">' + esc(e[1]) + "</td><td>" + esc(e[2]) + "</td></tr>").join("") + "</tbody></table>";
    h += '<p class="wr-note" style="margin-top:22px">Read it whole: ' + link(M.u, "Manifesto of the Communist Party — Marxists Internet Archive") + " " + link("https://iisg.nl/collections/manifest", "the surviving manuscript page — IISH Amsterdam") + " " + link("m:archive/lenin/works/1913/mar/x01.htm", "Lenin on its three sources (1913)") + "</p></div>";
    $("v-manifesto").innerHTML = h;
  }

  /* ═════════════════════ THE RED FAMILY ═════════════════════ */
  function cmpTable() {
    const cs = CUR.filter(c => state.cmp.indexOf(c.id) >= 0);
    let h = '<table class="cmp"><thead><tr><th class="q">The question</th>' + cs.map(c => { const n = BY[c.id]; return '<th><button data-go="' + c.id + '">' + esc(c.s) + "</button><small>" + yr(n) + " · " + esc(n.pl.split(/[→(—]/)[0].trim()) + "</small><em>" + esc((n.tx || "").split(";")[0]) + "</em></th>"; }).join("") + "</tr></thead><tbody>";
    D.red.dims.forEach(d => { h += '<tr><th class="q">' + esc(d[1]) + "</th>" + cs.map(c => "<td>" + esc(c.c[d[0]]) + "</td>").join("") + "</tr>"; });
    return h + "</tbody></table>";
  }
  function renderCmp() {
    $("cmp-pick").innerHTML = CUR.map(c => '<button class="chipbtn' + (state.cmp.indexOf(c.id) >= 0 ? " on" : "") + '" data-cmp="' + c.id + '">' + esc(c.s) + "</button>").join("") +
      '<button class="chipbtn" data-cmp="*" title="Show every current side by side">All fourteen</button><button class="chipbtn" data-cmp="!" title="Back to the four named in the brief">Reset</button>';
    $("cmp-wrap").innerHTML = cmpTable();
  }
  function renderRed() {
    const R = D.red;
    let h = '<div class="dc-doc"><h2>The Red Family</h2><p class="lead">Every current below called itself Marxist and called at least one of the others a betrayal. What they hold in common fits on eight cards; what divides them comes down to ten questions.</p>';
    h += '<h3 class="wr-h">What they share</h3><div class="core">' + R.core.map(c => "<div><b>" + esc(c[0]) + "</b><p>" + esc(c[1]) + "</p><small>" + esc(c[2]) + "</small></div>").join("") + "</div>";
    h += '<h3 class="wr-h" id="cmp-h">Where they part</h3><p class="wr-sub">Choose the currents to set side by side. Each column gives that current\'s own answer; the column heading opens its card.</p><div class="cmp-pick" id="cmp-pick"></div><div class="cmp-wrap" id="cmp-wrap"></div>';
    h += '<h3 class="wr-h">The schisms</h3><div class="sch">' + D.schisms.map(s => '<button data-go="' + s[3] + '"><span class="y">' + s[0] + '</span><span class="t"><b>' + esc(s[1]) + "</b>" + esc(s[2]) + "</span></button>").join("") + "</div>";
    h += '<h3 class="wr-h">In power: the record</h3><p class="wr-sub">' + esc(D.record.note) + "</p>";
    D.record.rows.forEach(r => {
      h += '<div class="rec"><header><b>' + esc(r.n) + "</b><small>" + esc(r.y) + "</small>" + chip(r.id) + '</header><div class="cols"><div class="pro"><div class="mf-k">Defenders point to</div>' + esc(r.pro) + '</div><div class="con"><div class="mf-k">Critics point to</div>' + esc(r.con) + "</div></div><footer>Sources: " + r.u.map(u => link(u, decodeURIComponent(u.slice(2)).replace(/_/g, " "))).join("") + "</footer></div>";
    });
    h += '<p class="callout">' + esc(D.record.total) + "</p>";
    h += '<p class="wr-note" style="margin-top:14px">' + D.record.totalU.map(u => link(u, decodeURIComponent(u.slice(2)).replace(/_/g, " "))).join(" ") + "</p>";
    h += '<h3 class="wr-h">Sources for this instrument</h3><p class="wr-note" style="line-height:2">' + D.sources.map(s => link(s[1], s[0])).join(" ") + "</p></div>";
    $("v-red").innerHTML = h;
    renderCmp();
  }
  function toggleCmp(id) {
    if (id === "*") state.cmp = CUR.map(c => c.id);
    else if (id === "!") state.cmp = D.red.start.slice();
    else { const i = state.cmp.indexOf(id); if (i >= 0) { if (state.cmp.length > 1) state.cmp.splice(i, 1); } else state.cmp.push(id); }
    renderCmp(); pushHash();
  }

  /* ═════════════════════ THE LIBRARY ═════════════════════ */
  function libRows() {
    const rows = [];
    N.forEach(n => {
      const src = n.tx || (n.k === "t" ? n.n : "");
      if (!src) return;
      src.split(/;\s*/).forEach(t => { const m = t.match(/(\d{4})(?:[–-]\d{2,4})?\)\s*$/); rows.push({ y: m ? +m[1] : n.yr, t: t.trim(), n }); });
    });
    return rows.sort((a, b) => a.y - b.y);
  }
  function renderLibrary() {
    const rows = libRows().filter(r => state.libFam === "all" || (state.libFam === "root" ? !r.n.f : r.n.f === state.libFam));
    let h = '<div class="dc-doc"><h2>The Library</h2><p class="lead">The founding texts of every doctrine in the instrument, in the order they were written. A row opens the doctrine it founded; where a free edition of the text is linked from the card, it is the Marxists Internet Archive\'s.</p><div class="lib-bar">' +
      [["all", "All"], ["root", "Forerunners"]].concat(Object.keys(FAM).map(k => [k, FAM[k][0].split(/ &|,/)[0]])).map(f => '<button class="chipbtn' + (state.libFam === f[0] ? " on" : "") + '" data-lib="' + f[0] + '">' + esc(f[1]) + "</button>").join("") + "</div>";
    h += '<table class="tbl lib"><thead><tr><th>Year</th><th>Text</th><th>Founded or fed</th><th class="pl">Where</th></tr></thead><tbody>' +
      rows.map(r => '<tr class="go" data-go="' + r.n.id + '"><td class="yr">' + (r.y < 0 ? "c. " + -r.y + " BCE" : r.y) + '</td><td class="m">' + esc(r.t) + '</td><td><i class="fdot" style="background:' + col(r.n) + '"></i>' + esc(short(r.n)) + '</td><td class="pl">' + esc(r.n.pl) + "</td></tr>").join("") + "</tbody></table>";
    h += '<p class="wr-note" style="margin-top:16px">' + rows.length + " texts.</p></div>";
    $("v-library").innerHTML = h;
  }

  /* ═════════════════════ THE SIDE PANEL ═════════════════════ */
  function quadOf(n) { return D.quads.find(q => (q.x < 0) === (n.x < 0) && (q.y > 0) === (n.y >= 0)); }
  function nodeCard(n) {
    const fam = n.f ? FAM[n.f] : null;
    let h = '<button class="sd-x" data-close title="Close (Esc)">×</button>';
    h += '<div class="sd-k">' + (fam ? '<i class="fdot" style="background:' + fam[1] + '"></i>' + esc(fam[0]) : ROOTK[n.k]) + "</div>";
    h += '<div class="sd-t">' + esc(n.n) + '</div><div class="sd-d">' + yr(n) + " · " + esc(n.pl) + "</div><div>";
    if (n.f && !n.xc) {
      const q = quadOf(n), ax = Math.abs(n.x) < 1, ay = Math.abs(n.y) < 1;
      if (!ax && !ay) h += '<span class="tag" style="border-color:' + q.c + ";color:" + q.c + '">' + q.n + "</span>";
      else h += '<span class="tag G">' + (ax && ay ? "the centre" : ay ? (n.x < 0 ? "Left" : "Right") + " · astride the authority axis" : (n.y > 0 ? "Authoritarian" : "Libertarian") + " · economic centre") + "</span>";
      h += '<span class="tag">' + (ax ? "economic centre" : "economic " + (n.x < 0 ? "left " : "right ") + Math.abs(n.x)) + '</span><span class="tag">' + (ay ? "authority ≈ 0" : (n.y > 0 ? "authoritarian " : "libertarian ") + Math.abs(n.y)) + "</span>";
    }
    if (n.xc) h += '<span class="tag" style="border-color:#35b8ad;color:#7fe0d6">no single position</span>';
    if (CURID.has(n.id)) h += '<span class="tag G">Marxist family</span>';
    h += '</div><p class="sd-p" style="margin-top:8px">' + esc(n.d) + "</p>";
    if (n.c) h += '<div class="sd-k">' + (n.xc ? "Why it floats · its critics" : "Critics · the record") + '</div><p class="sd-p">' + esc(n.c) + "</p>";
    if (n.w) h += '<div class="sd-k">Who</div><p class="who">' + esc(n.w) + "</p>";
    if (n.tx) h += '<div class="sd-k">Founding text</div><p class="txt">' + esc(n.tx) + "</p>";
    const ps = n.fr || [], ks = (KIDS[n.id] || []).slice().sort((a, b) => BY[a[0]].yr - BY[b[0]].yr);
    if (ps.length) h += '<div class="sd-k">Where it came from</div>' + ps.map(f => { const p = BY[f[0]]; return '<button class="rel ' + f[1] + '" data-go="' + p.id + '"><span class="y">' + yr(p) + '</span><span class="k">' + KIND[f[1]] + "</span>" + esc(p.n) + (f[2] ? "<i>" + esc(f[2]) + "</i>" : "") + "</button>"; }).join("");
    if (ks.length) h += '<div class="sd-k">What it begat</div>' + ks.map(k => { const c = BY[k[0]]; return '<button class="rel ' + k[1] + '" data-go="' + c.id + '"><span class="y">' + yr(c) + '</span><span class="k">' + KIDK[k[1]] + "</span>" + esc(c.n) + (k[2] ? "<i>" + esc(k[2]) + "</i>" : "") + "</button>"; }).join("");
    h += '<div class="sd-links">';
    if (n.f && !n.xc && state.view !== "compass") h += '<button class="lnk" data-jump="compass">On the Compass</button>';
    if (state.view !== "lineage") h += '<button class="lnk" data-jump="lineage">Trace its lineage</button>';
    if (state.view !== "atlas") h += '<button class="lnk" data-jump="atlas">Where it began</button>';
    if (CURID.has(n.id)) h += '<button class="lnk" data-jump="red">Compare with its rivals</button>';
    if (n.id === "marxism" && state.view !== "manifesto") h += '<button class="lnk" data-jump="manifesto">Read the Manifesto dissected</button>';
    if (n.tu) h += link(n.tu, "Read the text");
    h += link(n.u, "Source: " + D.srcName(n.u));
    const arc = n.ref || n.aid || null;
    if (arc) h += '<a href="index.html#e=' + arc + '&v=chronicle">In the Chronicle ⟶</a>';
    if (n.id === "nazism" || n.id === "fascism") h += '<a href="wars.html#w=ww2">The War Room ⟶</a>';
    return h + "</div>";
  }
  function introCard() {
    const v = state.view;
    if (v === "compass") return '<div class="intro"><div class="sd-k">How to read it</div><div class="sd-t">The political compass</div><p style="margin-top:8px">Two questions, two axes. <b>Left to right:</b> who should own and direct the economy — the community or state, or private owners in markets? <b>Bottom to top:</b> how much authority should be exercised over people\'s lives?</p>' +
      D.quads.map(q => '<div class="q" style="border-color:' + q.c + '"><b style="color:' + q.c + '">' + q.n + "</b><span>" + esc(q.d) + "</span></div>").join("") +
      "<p>" + PLACED.length + " doctrines are placed; " + XC.length + ' more have left, right, libertarian and authoritarian wings and are listed under the chart. The halo round a dot shows how far its adherents range. Drag the year back to watch the chart fill: most of it is younger than 1848.</p><p>Click a dot for what the doctrine holds in its own terms, what its critics say, where it came from and what it begat.</p><div class="sd-k">Start with</div><div>' + ["marxism", "leninism", "maoism", "socdem", "anarchocom", "classlib", "libertarian", "burke", "fascism"].map(chip).join("") +
      '</div><p class="wr-note" style="margin-top:14px">The chart is a convention — David Nolan\'s 1969 diagram, popularised by politicalcompass.org in 2001 — and scholars fault it for squeezing many disagreements into two. Every placement here is an editorial approximation of where such charts customarily put a current. ' + link("w:The_Political_Compass", "On the model and its critics") + "</p></div>";
    if (v === "lineage") return '<div class="intro"><div class="sd-k">How to read it</div><div class="sd-t">The lineage</div><p style="margin-top:8px">Time runs left to right; each band is a tradition. A gold line means <i>descends from</i>, a broken red line <i>written against</i>, a dotted white line <i>split from</i>.</p><p>Click any node: its whole ancestry lights up in gold and everything descended from it in blue. The red band is Marx and Engels\'s own trunk — above it, the three sources Lenin named (German philosophy, British political economy, French socialism); below it, the reform road and the revolutionary road that parted in 1914.</p><div class="sd-k">Trace</div><div>' + ["marxism", "menshevism", "leninism", "trotskyism", "maoism", "socdem", "fascism", "neolib", "anarchocom"].map(chip).join("") + "</div></div>";
    if (v === "atlas" && state.atMode === "red") {
      const y = state.atYear, by = {};
      D.states.forEach(r => { const a = alignAt(r, y); if (a) (by[a] = by[a] || []).push(r); });
      let h = '<div class="intro"><div class="sd-k">The Red Century</div><div class="sd-t">' + y + '</div><p style="margin-top:8px">States governed by a communist party in this year, by whose lead they followed. Press play to run from 1917.</p>';
      Object.keys(D.align).forEach(a => { if (by[a]) h += '<div class="sd-k"><i class="fdot" style="background:' + D.align[a][1] + '"></i>' + D.align[a][0] + "</div>" + by[a].map(r => '<div class="st-row">' + esc(r.l || r.n.join(", ")) + "<small>" + r.seg[0][0] + "–" + (r.seg[r.seg.length - 1][1] > 2050 ? "" : r.seg[r.seg.length - 1][1]) + "</small></div>").join(""); });
      if (!Object.keys(by).length) h += "<p>None yet.</p>";
      return h + '<p class="wr-note" style="margin-top:14px">Dates mark when one-party rule was established and ended; they simplify. The map uses today\'s borders.</p></div>';
    }
    if (v === "atlas") return '<div class="intro"><div class="sd-k">How to read it</div><div class="sd-t">Where doctrines are born</div><p style="margin-top:8px">Each dot is the place a doctrine, thinker or founding text first appeared. A numbered ring is a crowd — click it to zoom in. Paris, London and Berlin produced most of the nineteenth century\'s ideas; exile produced the rest (Brussels, Geneva, Zürich).</p><p>Click a dot to draw its lines of descent across the map: gold from its sources, blue to its offspring. <b>The Red Century</b> switches to the party-states, year by year.</p><div class="sd-k">Try</div><div>' + ["marxism", "leninism", "maoism", "guevarism", "neolib", "gandhism"].map(chip).join("") + "</div></div>";
    return "";
  }
  function renderSide() {
    const side = $("dc-side"), n = state.sel ? BY[state.sel] : null;
    side.hidden = !n && (TEXTVIEWS[state.view] || mobile());
    if (side.hidden) return;
    side.innerHTML = n ? nodeCard(n) : introCard();
    if (n) side.scrollTop = 0;
  }

  /* ═════════════════════ SELECTION · VIEWS · HASH ═════════════════════ */
  function refresh() {
    if (state.view === "compass") { drawCompass(); cpXc(); }
    else if (state.view === "lineage") lnHighlight();
    else if (state.view === "atlas") atDraw();
  }
  function select(id, o) {
    state.sel = id && BY[id] ? id : null;
    const n = state.sel ? BY[state.sel] : null;
    /* a doctrine that postdates the compass's year filter pulls the filter forward */
    if (n && n.f && n.yr > state.year) { state.year = 2026; if (built.cpYear) built.cpYear.show(); }
    if (n && state.view === "atlas" && n.yr > state.atYear) { state.atYear = state.atMode === "red" ? clamp(n.yr, 1917, 2026) : 2026; built.atYear.show(); }
    if (n && n.f && !state.fams.has(n.f)) { state.fams.add(n.f); $("cp-fams").querySelectorAll("[data-f]").forEach(x => x.classList.toggle("on", state.fams.has(x.dataset.f))); }
    renderSide(); refresh();
    if (n && o && o.focus) { if (state.view === "lineage") lnFocus(n.id); else if (state.view === "atlas") atFocus(n); }
    pushHash();
  }
  function setView(v, o) {
    if (VIEWS.indexOf(v) < 0) v = "compass";
    state.view = v;
    VIEWS.forEach(x => { $("v-" + x).hidden = x !== v; });
    $("wr-tabs").querySelectorAll("button").forEach(b => { const on = b.dataset.v === v; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    document.body.dataset.view = v;
    renderSide();
    if (v === "compass") { cpSize(); drawCompass(); cpXc(); }
    else if (v === "lineage") { if (!built.lineage) { built.lineage = true; if (mobile()) ln.z = .8; buildLineage(); wireLineage(); lnFocus(state.sel || "marxism", true); } else lnHighlight(); if (state.sel) lnFocus(state.sel, !(o && o.smooth)); lnSticky(); }
    else if (v === "manifesto") { if (!built.manifesto) { built.manifesto = true; renderManifesto(); } }
    else if (v === "red") { if (!built.red) { built.red = true; renderRed(); } else renderCmp(); }
    else if (v === "atlas") { if (!built.atlas) { buildAtlas(); atFit(REGIONS[0][2]); atRegionChips(); if (state.atMode === "red") atMode("red"); } else { const r = $("at-wrap").getBoundingClientRect(); at.W = r.width; at.H = r.height; at.h = at.w * r.height / r.width; atApply(); } if (state.sel) atFocus(BY[state.sel]); }
    else if (v === "library") { if (!built.library) { built.library = true; renderLibrary(); } }
    if (!(o && o.quiet)) pushHash();
  }
  let selfHash = "";
  function pushHash() {
    const p = ["v=" + state.view];
    if (state.sel) p.push("i=" + state.sel);
    if (state.view === "red" && state.cmp.join() !== D.red.start.join()) p.push("c=" + state.cmp.join(","));
    if (state.view === "atlas" && state.atMode === "red") p.push("m=red", "y=" + state.atYear);
    selfHash = "#" + p.join("&");
    try { history.replaceState(null, "", selfHash); } catch (_) { location.hash = selfHash; }
  }
  function applyHash() {
    if (location.hash === selfHash && built.boot) return;
    const q = {}; location.hash.replace(/^#/, "").split("&").forEach(kv => { const i = kv.indexOf("="); if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); });
    if (q.c) { const c = q.c.split(",").filter(id => CURID.has(id)); if (c.length) state.cmp = c; }
    if (q.m === "red") { state.atMode = "red"; if (+q.y >= 1917 && +q.y <= 2026) state.atYear = +q.y; }
    state.sel = q.i && BY[q.i] ? q.i : null;
    setView(q.v || "compass", { quiet: true });
    built.boot = true; pushHash();
  }

  /* ═════════════════════ SEARCH ═════════════════════ */
  function wireSearch() {
    const inp = $("dc-q"), box = document.createElement("div");
    box.id = "dc-hits"; box.hidden = true; document.body.appendChild(box);
    let hits = [], cur = 0;
    const close = () => { box.hidden = true; };
    const go = n => { close(); inp.value = ""; inp.blur(); if (TEXTVIEWS[state.view] || (state.view === "compass" && (!n.f || n.xc))) setView(n.f && !n.xc ? "compass" : "lineage", { quiet: true }); select(n.id, { focus: true }); };
    const paint = () => { box.innerHTML = hits.map((n, i) => '<button data-i="' + i + '"' + (i === cur ? ' class="on"' : "") + '><i class="fdot" style="background:' + col(n) + '"></i>' + esc(n.n) + "<small>" + yr(n) + "</small></button>").join(""); };
    inp.addEventListener("input", () => {
      const s = inp.value.trim().toLowerCase();
      if (s.length < 2) return close();
      const score = n => { const a = n.n.toLowerCase(); return a.indexOf(s) === 0 ? 0 : a.indexOf(s) > 0 ? 1 : ((n.w || "") + " " + (n.tx || "")).toLowerCase().indexOf(s) >= 0 ? 2 : (n.d + " " + n.pl).toLowerCase().indexOf(s) >= 0 ? 3 : 9; };
      hits = N.map(n => [score(n), n]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0] || a[1].yr - b[1].yr).slice(0, 12).map(x => x[1]);
      cur = 0;
      if (!hits.length) { box.innerHTML = '<button disabled>Nothing by that name</button>'; } else paint();
      const r = inp.getBoundingClientRect();
      box.style.left = Math.max(6, Math.min(r.left, window.innerWidth - 300)) + "px"; box.style.top = r.bottom + 4 + "px"; box.style.width = Math.max(260, r.width) + "px";
      box.hidden = false;
    });
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); cur = Math.min(hits.length - 1, cur + 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); cur = Math.max(0, cur - 1); paint(); }
      else if (e.key === "Enter" && hits[cur]) go(hits[cur]);
      else if (e.key === "Escape") { close(); inp.blur(); }
    });
    box.addEventListener("mousedown", e => { const b = e.target.closest("[data-i]"); if (b) { e.preventDefault(); go(hits[+b.dataset.i]); } });
    inp.addEventListener("blur", () => setTimeout(close, 150));
  }

  /* ═════════════════════ WIRING ═════════════════════ */
  function wire() {
    $("wr-tabs").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b) setView(b.dataset.v); });
    document.addEventListener("click", e => {
      const t = e.target.closest("[data-go],[data-jump],[data-close],[data-cmp],[data-lib]");
      if (!t || t.closest("svg")) return;
      if (t.dataset.go) { select(t.dataset.go, { focus: true }); }
      else if (t.dataset.jump) {
        const v = t.dataset.jump, n = BY[state.sel];
        if (v === "red" && n && CURID.has(n.id) && state.cmp.indexOf(n.id) < 0) state.cmp.push(n.id);
        setView(v, { smooth: false });
        if (v === "red") { const hd = $("cmp-h"); if (hd && hd.scrollIntoView) hd.scrollIntoView({ block: "start" }); }
      }
      else if (t.dataset.close != null) select(null);
      else if (t.dataset.cmp) toggleCmp(t.dataset.cmp);
      else if (t.dataset.lib) { state.libFam = t.dataset.lib; renderLibrary(); }
    });
    document.addEventListener("keydown", e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key >= "1" && e.key <= "6") setView(VIEWS[+e.key - 1]);
      else if (e.key === "Escape") select(null);
      else if (e.key === "/") { e.preventDefault(); $("dc-q").focus(); }
      else if (state.view === "compass" && (e.key === "+" || e.key === "=")) cpZoom(1.5);
      else if (state.view === "compass" && (e.key === "-" || e.key === "_")) cpZoom(1 / 1.5);
      else if (state.view === "compass" && e.key === "0") { cp.k = 1; cp.tx = cp.ty = 0; drawCompass(); }
    });
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("resize", () => { if (!state.sel) renderSide(); });
  }

  function boot() { buildCompass(); wireSearch(); wire(); applyHash(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
