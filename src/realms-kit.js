/* ============================================================
   ARCHIVUS — shared kit for the Realms and the Coups (v11).
   Small helpers both instruments use: escaping, colour ramps,
   the year slider, hash state, tooltips, a pan-and-zoom world
   map drawn from assets/world2.js, and a few SVG chart parts.
   ============================================================ */
(function () {
  "use strict";
  const K = window.ARCHIVUS_KIT = {};
  const NS = "http://www.w3.org/2000/svg";
  K.$ = id => document.getElementById(id);
  K.esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  K.REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  K.MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  K.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  K.fmt = (v, d) => v == null ? "—" : (+v).toFixed(d == null ? 2 : d);
  K.signed = (v, d) => v == null ? "—" : (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toFixed(d == null ? 2 : d);
  K.pop = p => p == null ? "—" : p >= 1e9 ? (p / 1e9).toFixed(2) + " bn" : p >= 1e6 ? (p / 1e6).toFixed(p >= 1e7 ? 0 : 1) + " m" : Math.round(p / 1e3) + " k";
  K.link = (u, t) => '<a href="' + K.esc(u) + '" target="_blank" rel="noopener">' + K.esc(t) + "</a>";
  /* a host name to show beside a source link */
  K.host = u => { try { return new URL(u).hostname.replace(/^www\.|^en\./, ""); } catch (_) { return "source"; } };

  /* colour ramp through hex stops; t in 0…1 */
  K.ramp = stops => {
    const rgb = stops.map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
    return t => {
      t = K.clamp(t, 0, 1) * (rgb.length - 1);
      const i = Math.min(rgb.length - 2, Math.floor(t)), f = t - i, a = rgb[i], b = rgb[i + 1];
      return "rgb(" + [0, 1, 2].map(k => Math.round(a[k] + (b[k] - a[k]) * f)).join(",") + ")";
    };
  };

  /* hash state: #k=v&k=v — replaceState so the back button leaves the instrument */
  K.hash = {
    read() { const q = {}; location.hash.replace(/^#/, "").split("&").forEach(kv => { const i = kv.indexOf("="); if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); }); return q; },
    write(o) {
      const h = "#" + Object.keys(o).filter(k => o[k] != null && o[k] !== "").map(k => k + "=" + encodeURIComponent(o[k])).join("&");
      K.hash.self = h;
      try { history.replaceState(null, "", h); } catch (_) { location.hash = h; }
    }
  };

  /* year slider with a play button (same control as the Doctrines) */
  K.yearCtl = (host, o) => {
    host.innerHTML = '<button class="chipbtn yc-play" title="Play through time">▶</button><input type="range" aria-label="Year"><span class="yc-v"></span>';
    const r = host.querySelector("input"), v = host.querySelector(".yc-v"), b = host.querySelector(".yc-play");
    let timer = null;
    const show = () => { r.min = o.min; r.max = o.max; r.value = o.get(); v.textContent = o.label ? o.label(o.get()) : o.get(); };
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
    return { show, stop, off(d) { stop(); r.disabled = b.disabled = !!d; host.classList.toggle("off", !!d); } };
  };

  /* tooltip that follows the pointer inside a positioned wrapper */
  K.tip = (el, wrap) => ({
    show(html, e) {
      el.innerHTML = html; el.hidden = false;
      const b = wrap.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
      let x = e.clientX - b.left + 14, y = e.clientY - b.top + 14;
      if (x + w > b.width - 6) x = e.clientX - b.left - w - 12;
      if (y + h > b.height - 6) y = e.clientY - b.top - h - 12;
      el.style.left = Math.max(4, x) + "px"; el.style.top = Math.max(4, y) + "px";
    },
    hide() { el.hidden = true; }
  });

  /* tabs: #wr-tabs buttons[data-v] ↔ sections #v-<id>; number keys switch */
  K.tabs = (get, set) => {
    const box = K.$("wr-tabs"), btns = Array.from(box.querySelectorAll("button"));
    const paint = () => {
      btns.forEach(b => { const on = b.dataset.v === get(); b.classList.toggle("on", on); b.setAttribute("aria-selected", on); K.$("v-" + b.dataset.v).hidden = !on; });
      if (window.ARCHIVUS_GLIDE) window.ARCHIVUS_GLIDE(box, "button.on");
    };
    box.addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b) set(b.dataset.v); });
    document.addEventListener("keydown", e => {
      if (e.target.closest("input, textarea, select") || e.ctrlKey || e.metaKey || e.altKey) return;
      const i = "123456789".indexOf(e.key); if (i >= 0 && btns[i]) set(btns[i].dataset.v);
    });
    return { paint, ids: btns.map(b => b.dataset.v) };
  };

  /* quick-find box: #dc-q → a dropdown of matches (uses #dc-hits styles) */
  K.finder = (input, search, pick) => {
    let box = null, hits = [], sel = 0;
    const close = () => { if (box) { box.remove(); box = null; } };
    const paint = () => {
      if (!hits.length) return close();
      if (!box) { box = document.createElement("div"); box.id = "dc-hits"; document.body.appendChild(box); box.addEventListener("mousedown", e => { const b = e.target.closest("button"); if (b) { e.preventDefault(); choose(+b.dataset.i); } }); }
      const r = input.getBoundingClientRect();
      box.style.left = Math.max(6, Math.min(r.left, innerWidth - 300)) + "px"; box.style.top = r.bottom + 4 + "px"; box.style.width = Math.max(260, r.width) + "px";
      box.innerHTML = hits.map((h, i) => '<button type="button" data-i="' + i + '"' + (i === sel ? ' class="on"' : "") + ">" + K.esc(h.label) + "<small>" + K.esc(h.sub || "") + "</small></button>").join("");
    };
    const choose = i => { const h = hits[i]; if (!h) return; input.value = ""; close(); input.blur(); pick(h); };
    input.addEventListener("input", () => { const q = input.value.trim().toLowerCase(); hits = q ? search(q).slice(0, 12) : []; sel = 0; paint(); });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { sel = Math.min(hits.length - 1, sel + 1); paint(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); paint(); e.preventDefault(); }
      else if (e.key === "Enter") choose(sel);
      else if (e.key === "Escape") { input.value = ""; close(); input.blur(); }
    });
    input.addEventListener("blur", () => setTimeout(close, 120));
    document.addEventListener("keydown", e => { if (e.key === "/" && !e.target.closest("input, textarea")) { e.preventDefault(); input.focus(); } });
  };

  /* ------------------------------------------------------------
     the world map: one <path> per country, coloured by a callback.
     Pan by dragging, zoom with the wheel, pinch or the buttons.
     o: { map: name→iso, tipEl, wrap, onPick(iso), tipFor(iso, name) }
     ------------------------------------------------------------ */
  K.worldMap = (svg, o) => {
    /* The shapes are plate carrée (1° = 1 unit both ways), which squashes the mid-latitudes where most
       countries are. Stretching north–south by 1.22 gives the equirectangular projection true at about
       35°, and fills a typical panel better. SY applies to everything drawn in the two groups. */
    const SY = 1.22, HOME = { x: 8, y: 6 * SY, w: 348, h: 142 * SY };   /* crop Antarctica and the empty Pacific edge */
    let view = Object.assign({}, HOME), anim = 0;
    const g = document.createElementNS(NS, "g"); svg.appendChild(g);
    const over = document.createElementNS(NS, "g"); svg.appendChild(over);
    g.setAttribute("transform", "scale(1," + SY + ")"); over.setAttribute("transform", "scale(1," + SY + ")");
    const paths = {};
    (window.ARCHIVUS_COUNTRIES || []).forEach(c => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", c.d); p.setAttribute("class", "at-c");
      const iso = o.map[c.n]; if (iso) { p.dataset.iso = iso; (paths[iso] = paths[iso] || []).push(p); }
      p.dataset.n = c.n; g.appendChild(p);
    });
    const apply = () => svg.setAttribute("viewBox", [view.x, view.y, view.w, view.h].map(v => v.toFixed(3)).join(" "));
    const clampView = v => {
      const ar = HOME.w / HOME.h; v.w = K.clamp(v.w, 14, HOME.w); v.h = v.w / ar;
      v.x = K.clamp(v.x, HOME.x - 4, HOME.x + HOME.w + 4 - v.w); v.y = K.clamp(v.y, HOME.y - 4, HOME.y + HOME.h + 4 - v.h); return v;
    };
    const tween = to => {
      cancelAnimationFrame(anim); to = clampView(to);
      if (K.REDUCED) { view = to; return apply(); }
      const from = Object.assign({}, view), t0 = performance.now();
      const step = now => {
        const t = Math.min(1, (now - t0) / 320), e = 1 - Math.pow(1 - t, 3);
        ["x", "y", "w", "h"].forEach(k => { view[k] = from[k] + (to[k] - from[k]) * e; }); apply();
        if (t < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    };
    const toMap = e => { const b = svg.getBoundingClientRect(), s = Math.max(view.w / b.width, view.h / b.height); return [view.x + view.w / 2 + (e.clientX - b.left - b.width / 2) * s, view.y + view.h / 2 + (e.clientY - b.top - b.height / 2) * s, s]; };
    const zoom = (f, e, smooth) => {
      const p = e ? toMap(e) : [view.x + view.w / 2, view.y + view.h / 2];
      const w = K.clamp(view.w * f, 14, HOME.w), k = w / view.w;
      const to = { x: p[0] - (p[0] - view.x) * k, y: p[1] - (p[1] - view.y) * k, w, h: view.h * k };
      if (smooth) tween(to); else { cancelAnimationFrame(anim); view = clampView(to); apply(); }
    };
    svg.addEventListener("wheel", e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.18 : 1 / 1.18, e); }, { passive: false });
    /* drag to pan; a press that barely moves is a click */
    const ptr = new Map(); let moved = 0, pinch = 0;
    svg.addEventListener("pointerdown", e => { ptr.set(e.pointerId, e); moved = 0; pinch = 0; try { svg.setPointerCapture(e.pointerId); } catch (_) {} });
    svg.addEventListener("pointermove", e => {
      const prev = ptr.get(e.pointerId);
      if (!prev) { hover(e); return; }
      if (ptr.size === 2) {
        ptr.set(e.pointerId, e); const a = Array.from(ptr.values()), d = Math.hypot(a[0].clientX - a[1].clientX, a[0].clientY - a[1].clientY);
        if (pinch) zoom(pinch / d, { clientX: (a[0].clientX + a[1].clientX) / 2, clientY: (a[0].clientY + a[1].clientY) / 2 });
        pinch = d; moved = 9; return;
      }
      const s = toMap(e)[2]; moved += Math.abs(e.clientX - prev.clientX) + Math.abs(e.clientY - prev.clientY);
      if (moved > 4) { svg.classList.add("drag"); cancelAnimationFrame(anim); view.x -= (e.clientX - prev.clientX) * s; view.y -= (e.clientY - prev.clientY) * s; clampView(view); apply(); if (o.tip) o.tip.hide(); }
      ptr.set(e.pointerId, e);
    });
    const up = e => {
      if (!ptr.has(e.pointerId)) return;
      ptr.delete(e.pointerId); svg.classList.remove("drag");
      if (moved <= 4 && e.type === "pointerup") { const t = document.elementFromPoint(e.clientX, e.clientY); const iso = t && t.dataset && t.dataset.iso; if (o.onPick) o.onPick(iso || null); }
    };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("pointerleave", () => { if (o.tip) o.tip.hide(); });
    function hover(e) {
      if (!o.tip) return;
      const t = e.target, html = t && t.dataset && t.dataset.n ? o.tipFor(t.dataset.iso || null, t.dataset.n) : null;
      if (html) o.tip.show(html, e); else o.tip.hide();
    }
    apply();
    return {
      paths, over, SY,
      /* fn(iso) → colour, or null for "no data" */
      paint(fn) { Object.keys(paths).forEach(iso => { const c = fn(iso); paths[iso].forEach(p => { p.style.fill = c || ""; p.classList.toggle("on", !!c); }); }); },
      select(iso) { g.querySelectorAll(".sel").forEach(p => p.classList.remove("sel")); (paths[iso] || []).forEach(p => { p.classList.add("sel"); g.appendChild(p); }); },
      focus(iso) {
        const ps = paths[iso]; if (!ps) return;
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        ps.forEach(p => { const b = p.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
        if (x1 - x0 > 200) return;                         /* spans the antimeridian — leave the view alone */
        y0 *= SY; y1 *= SY;
        const w = K.clamp(Math.max((x1 - x0) * 3.2, (y1 - y0) * 3.2 * HOME.w / HOME.h, 60), 14, HOME.w), h = w * HOME.h / HOME.w;
        if (view.w <= w * 1.25 && x0 > view.x && x1 < view.x + view.w && y0 > view.y && y1 < view.y + view.h) return;
        tween({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h });
      },
      zoomBy(f) { zoom(f, null, true); },
      reset() { tween(Object.assign({}, HOME)); },
      scale() { const b = svg.getBoundingClientRect(); return Math.max(view.w / (b.width || 1), view.h / (b.height || 1)); }
    };
  };

  /* SVG helpers for small charts */
  K.svgEl = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  K.path = pts => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
})();
