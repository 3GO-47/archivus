/* ============================================================
   ARCHIVUS — THE CODEX
   The archive as an open book. Every record, in chronological
   order, paginated onto parchment spreads; each era opens a
   chapter with its own heading; a winding gilt river runs down
   the margin of every page, one bend per entry, so the eye can
   follow time even while reading.

   Causation is first-class: every entry lists its threads —
   both what it grew from (⟵) and what grew from it (⟶),
   computed from the relation web in both directions. Clicking
   a thread flips the book to that record and lights it.
   Records touched by the Transmissions carry a ☿ thread into
   the codex of claims. Anticipated records carry the spectral
   HORIZON badge. Deep links: codex.html#e=<id>.
   ============================================================ */
(function () {
  "use strict";
  const EV = (window.ARCHIVUS_EVENTS || []).slice();
  const ERAS = window.ARCHIVUS_ERAS || [];
  const THEMES = window.ARCHIVUS_THEMES || [];
  const TX = window.ARCHIVUS_TRANSMISSIONS || [];
  const THEME_META = Object.fromEntries(THEMES.map(t => [t.id, t]));
  const BY_ID = Object.fromEntries(EV.map(e => [e.id, e]));
  const fmtY = y => y == null ? "" : (y < 0 ? Math.abs(y).toLocaleString() + " BCE" : y + " CE");

  /* reverse relation index: what cites me as an ancestor */
  const REV = {};
  EV.forEach(e => (e.related || []).forEach(r => (REV[r] = REV[r] || []).push(e.id)));
  /* transmissions touching each event */
  const TXBY = {};
  TX.forEach(t => (t.eventRefs || []).forEach(id => (TXBY[id] = TXBY[id] || []).push(t)));

  /* ---- the manuscript: chronological flow with chapter breaks ----
     Same-year ties: the smaller spark precedes the larger blaze — an
     assassination at Sarajevo must come before the war it ignites —
     so ties sort by ASCENDING weight, then alphabetically. */
  /* explicit precedence for same-year pairs the weight heuristic gets wrong:
     lower rank reads first within its year */
  const YEAR_RANK = { sept11: -2, afghanistan: -1, ww2: -2, turing: -1 };
  EV.sort((a, b) => (a.startYear - b.startYear) ||
    ((YEAR_RANK[a.id] || 0) - (YEAR_RANK[b.id] || 0)) ||
    ((a.importance || 0) - (b.importance || 0)) || a.title.localeCompare(b.title));
  const eraOfYear = y => ERAS.find(er => y >= er.start && y < er.end) || ERAS[ERAS.length - 1];
  /* filters: the codex re-binds itself around whatever you ask of it */
  const FILT = { era: "", theme: "", region: "" };
  const visible = e =>
    (!FILT.era || eraOfYear(e.startYear).id === FILT.era) &&
    (!FILT.theme || e.theme === FILT.theme) &&
    (!FILT.region || e.region === FILT.region);
  let flow = [];
  function buildFlow() {
    flow = [];
    let curEra = null;
    EV.forEach(e => {
      if (!visible(e)) return;
      const er = eraOfYear(e.startYear);
      if (er !== curEra) { curEra = er; flow.push({ kind: "era", era: er }); }
      flow.push({ kind: "ev", e });
    });
  }

  /* ---- pagination by estimated height ---- */
  const PAGE_H = () => Math.max(380, document.querySelector(".cx-page-inner").clientHeight || 560);
  const CHARS_PER_LINE = 74;
  function heightOf(item) {
    if (item.kind === "era") return 118 + Math.ceil((item.era.blurb || "").length / 80) * 18;
    const e = item.e;
    let h = 46;                                              /* when + title + meta */
    h += Math.ceil((e.desc || "").length / CHARS_PER_LINE) * 20;
    const nrel = Math.min(5, (e.related || []).length + (REV[e.id] || []).length) + (TXBY[e.id] ? 1 : 0);
    if (nrel) h += 16 + Math.ceil(nrel / 2.6) * 17;
    return h;
  }
  let pages = [];
  function paginate() {
    pages = [];
    const H = PAGE_H();
    let cur = [], used = 0;
    flow.forEach(item => {
      const h = heightOf(item);
      if (used + h > H && cur.length) { pages.push(cur); cur = []; used = 0; }
      cur.push(item); used += h;
    });
    if (cur.length) pages.push(cur);
  }

  /* ---- rendering a spread ---- */
  const book = document.getElementById("cx-book");
  const pageEls = [...book.querySelectorAll(".cx-page")];
  const narrow = () => window.matchMedia ? window.matchMedia("(max-width: 760px)").matches : false;
  let spread = 0;                                            /* index of left page */
  let litId = null;

  function evHTML(e) {
    const t = THEME_META[e.theme] || { color: "#a8862a", name: e.theme };
    const when = fmtY(e.startYear) + (e.endYear ? " — " + fmtY(e.endYear) : "") + (e.approximate ? "  (c.)" : "");
    const stars = "◆".repeat(Math.max(1, Math.round((e.importance || 5) / 2.5)));
    /* threads: ancestors it names (⟵ if earlier), and records that name it (⟶) */
    const fwd = (e.related || []).map(r => BY_ID[r]).filter(Boolean);
    const back = (REV[e.id] || []).map(r => BY_ID[r]).filter(o => !fwd.includes(o));
    const seen = new Set();
    const threads = fwd.concat(back).filter(o => !seen.has(o.id) && seen.add(o.id)).slice(0, 5)
      .map(o => '<a data-go="' + o.id + '">' + (o.startYear < e.startYear ? "⟵ " : "⟶ ") +
        (o.title.length > 30 ? o.title.slice(0, 29) + "…" : o.title) + "</a>").join("");
    const txs = (TXBY[e.id] || []).slice(0, 2)
      .map(t2 => '<a class="tx" href="transmissions.html#' + t2.id + '">☿ ' + t2.transmitter.split(",")[0] + "</a>").join("");
    return '<div class="cx-ev" id="cx-' + e.id + '">' +
      '<div class="cx-links"><a href="index.html#e=' + e.id + '&v=chronicle" title="Open in the Chronicle">chronicle ⟶</a>' +
      (e.source ? '<a href="' + e.source + '" target="_blank" rel="noopener" title="Consult source">source ↗</a>' : "") + "</div>" +
      '<div class="cx-when">' + when + ' <span class="imp">' + stars + "</span></div>" +
      '<div class="cx-title">' + e.title + (e.future ? '<span class="fut">HORIZON</span>' : "") + "</div>" +
      '<div class="cx-blurb">' + (e.desc || "") + "</div>" +
      '<div class="cx-meta"><span class="dot" style="background:' + t.color + '"></span>' + (t.name || "") +
      " · " + (e.region || "") + (e.civ ? " · " + e.civ : "") + "</div>" +
      (threads || txs ? '<div class="cx-threads"><b>THREADS </b>' + threads + txs + "</div>" : "") +
      "</div>";
  }
  function eraHTML(er) {
    return '<div class="cx-era"><div class="rule"></div><div class="nm">' + er.name + "</div>" +
      '<div class="span">' + fmtY(er.start) + " — " + fmtY(er.end) + "</div>" +
      '<div class="blurb">' + (er.blurb || "") + '</div><div class="rule"></div></div>';
  }

  /* the winding river: one bend per entry, drawn through the margin */
  function drawRiver(svg, pageDiv) {
    svg.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";
    const H = pageDiv.clientHeight || 600;
    svg.setAttribute("viewBox", "0 0 56 " + H);
    const inner = pageDiv.querySelector(".cx-page-inner");
    const anchors = [...inner.children].map((el2, i) => ({
      y: 30 + el2.offsetTop + 16,
      x: 28 + (i % 2 ? 9 : -9),
      era: el2.classList.contains("cx-era"),
      color: el2.dataset.color || "#a8862a",
      future: el2.dataset.future === "1"
    }));
    if (!anchors.length) return;
    let d = `M 28 0 C 28 ${anchors[0].y * 0.5}, ${anchors[0].x} ${anchors[0].y * 0.6}, ${anchors[0].x} ${anchors[0].y}`;
    for (let i = 1; i < anchors.length; i++) {
      const a = anchors[i - 1], b = anchors[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    d += ` C ${anchors[anchors.length - 1].x} ${H - 20}, 28 ${H - 14}, 28 ${H}`;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    anchors.forEach(a => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", a.x); c.setAttribute("cy", a.y);
      c.setAttribute("r", a.era ? 5 : 3.4);
      c.setAttribute("fill", a.era ? "none" : a.color);
      c.setAttribute("stroke", a.future ? "#4a6a8a" : "#a8862a");
      c.setAttribute("stroke-width", a.era ? 1.6 : (a.future ? 1.4 : 0.8));
      if (a.future) c.setAttribute("stroke-dasharray", "1.5 2");
      svg.appendChild(c);
    });
    /* a small arrowhead at the foot: time flows downward */
    const ar = document.createElementNS(NS, "path");
    ar.setAttribute("class", "arrow");
    ar.setAttribute("d", `M 24 ${H - 10} L 28 ${H - 2} L 32 ${H - 10} Z`);
    svg.appendChild(ar);
  }

  function renderPage(pgEl, pageIdx, dir) {
    const inner = pgEl.querySelector(".cx-page-inner");
    const folio = pgEl.querySelector(".cx-folio");
    const items = pages[pageIdx] || [];
    inner.innerHTML = items.map(it => it.kind === "era" ? eraHTML(it.era) : evHTML(it.e)).join("");
    /* stamp data for the river */
    let k = 0;
    items.forEach(it => {
      const el2 = inner.children[k++];
      if (it.kind === "ev") {
        el2.dataset.color = (THEME_META[it.e.theme] || {}).color || "#a8862a";
        if (it.e.future) el2.dataset.future = "1";
      }
    });
    folio.textContent = pages[pageIdx] ? "FOLIO " + (pageIdx + 1) + " · " + pages.length : "";
    drawRiver(pgEl.querySelector(".cx-river"), pgEl);
    if (litId) { const hit = inner.querySelector('[id="cx-' + litId + '"]'); if (hit) hit.classList.add("lit"); }
    pgEl.classList.remove("turning-f", "turning-b");
    void pgEl.offsetWidth;
    if (dir) pgEl.classList.add(dir > 0 ? "turning-f" : "turning-b");
    inner.querySelectorAll("a[data-go]").forEach(a =>
      a.addEventListener("click", ev => { ev.preventDefault(); goTo(a.dataset.go); }));
  }

  function eraAt(pageIdx) {
    for (let i = pageIdx; i >= 0; i--) {
      const withEra = (pages[i] || []).slice().reverse().find(it => it.kind === "era" || it.kind === "ev");
      if (withEra) return withEra.kind === "era" ? withEra.era : eraOfYear(withEra.e.startYear);
    }
    return ERAS[0];
  }
  function render(dir) {
    const per = narrow() ? 1 : 2;
    spread = Math.max(0, Math.min(spread, Math.max(0, pages.length - per)));
    renderPage(pageEls[0], spread, dir);
    if (!narrow()) renderPage(pageEls[1], spread + 1, dir);
    const er = eraAt(spread);
    const nEv = flow.reduce((s, it) => s + (it.kind === "ev" ? 1 : 0), 0);
    document.getElementById("cx-era-now").textContent = er ? er.name : "—";
    document.getElementById("cx-folio-now").textContent = "folio " + (spread + 1) + (narrow() ? "" : "–" + Math.min(spread + 2, pages.length)) + " of " + Math.max(1, pages.length) + " · " + nEv + " records";
  }
  function flip(d) { spread += d * (narrow() ? 1 : 2); render(d); }

  function goTo(id) {
    let idx = pages.findIndex(pg => pg.some(it => it.kind === "ev" && it.e.id === id));
    if (idx < 0 && (FILT.era || FILT.theme || FILT.region)) {
      /* the record is filtered out — the codex opens itself back up to reach it */
      FILT.era = FILT.theme = FILT.region = "";
      ["cx-era", "cx-theme", "cx-region"].forEach(i2 => { const s2 = document.getElementById(i2); if (s2) s2.value = ""; });
      buildFlow(); paginate(); buildTOC();
      idx = pages.findIndex(pg => pg.some(it => it.kind === "ev" && it.e.id === id));
    }
    if (idx < 0) return;
    litId = id;
    const per = narrow() ? 1 : 2;
    spread = Math.floor(idx / per) * per;
    render(0);
  }

  /* ---- table of contents ---- */
  const toc = document.getElementById("cx-toc");
  function buildTOC() {
    const rows = [];
    pages.forEach((pg, i) => pg.forEach(it => { if (it.kind === "era") rows.push([it.era, i]); }));
    toc.innerHTML = '<div class="kicker">THE CODEX · TABLE OF CONTENTS · ' + EV.length + " RECORDS</div>" +
      rows.map(([er, i]) => '<a data-pg="' + i + '">' + er.name +
        '<span class="fol">' + fmtY(er.start) + " — " + fmtY(er.end) + " · folio " + (i + 1) + "</span></a>").join("");
    toc.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      const per = narrow() ? 1 : 2;
      spread = Math.floor((+a.dataset.pg) / per) * per;
      toc.hidden = true;
      render(1);
    }));
  }
  document.getElementById("cx-toc-btn").addEventListener("click", () => { toc.hidden = !toc.hidden; });

  /* ---- controls ---- */
  document.getElementById("cx-prev").addEventListener("click", () => flip(-1));
  document.getElementById("cx-next").addEventListener("click", () => flip(1));
  document.getElementById("cx-first").addEventListener("click", () => { spread = 0; render(-1); });
  document.getElementById("cx-last").addEventListener("click", () => { spread = pages.length; render(1); });
  book.querySelector(".cx-corner.prev").addEventListener("click", () => flip(-1));
  book.querySelector(".cx-corner.next").addEventListener("click", () => flip(1));
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft" || e.key === "PageUp") flip(-1);
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); flip(1); }
    if (e.key === "Home") { spread = 0; render(-1); }
    if (e.key === "End") { spread = pages.length; render(1); }
    if (e.key === "Escape") toc.hidden = true;
  });
  const search = document.getElementById("cx-search");
  search.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const q = search.value.trim().toLowerCase();
    if (!q) return;
    const hit = EV.find(x => visible(x) && x.title.toLowerCase().includes(q)) ||
      EV.find(x => visible(x) && (x.desc || "").toLowerCase().includes(q)) ||
      EV.find(x => x.title.toLowerCase().includes(q));
    if (hit) goTo(hit.id);
  });

  /* ---- filters ---- */
  const selEra = document.getElementById("cx-era");
  const selTheme = document.getElementById("cx-theme");
  const selRegion = document.getElementById("cx-region");
  if (selEra) {
    ERAS.forEach(er => { const o = document.createElement("option"); o.value = er.id; o.textContent = er.name; selEra.appendChild(o); });
    THEMES.forEach(t => { const o = document.createElement("option"); o.value = t.id; o.textContent = t.name; selTheme.appendChild(o); });
    (window.ARCHIVUS_REGIONS || []).forEach(r => { const o = document.createElement("option"); o.value = r; o.textContent = r; selRegion.appendChild(o); });
    [selEra, selTheme, selRegion].forEach(s2 => s2.addEventListener("change", () => {
      FILT.era = selEra.value; FILT.theme = selTheme.value; FILT.region = selRegion.value;
      litId = null; spread = 0;
      buildFlow(); paginate(); buildTOC(); render(1);
    }));
  }
  /* touch: swipe across the book to turn pages */
  let swipe = null;
  book.addEventListener("pointerdown", e => { if (e.target.closest("a")) return; swipe = { x: e.clientX, y: e.clientY, t: Date.now() }; });
  book.addEventListener("pointerup", e => {
    if (!swipe) return;
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (Date.now() - swipe.t < 650 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) flip(dx < 0 ? 1 : -1);
    swipe = null;
  });

  /* wheel over the book turns pages */
  let wheelLock = 0;
  book.addEventListener("wheel", e => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLock < 260) return;
    wheelLock = now;
    flip(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  /* ---- boot ---- */
  function boot() {
    buildFlow();
    paginate();
    buildTOC();
    const m = location.hash.match(/e=([\w-]+)/);
    if (m && BY_ID[m[1]]) goTo(m[1]); else render(1);
  }
  window.addEventListener("hashchange", () => {
    const m = location.hash.match(/e=([\w-]+)/);
    if (m && BY_ID[m[1]]) goTo(m[1]);
  });
  let rsz = null;
  window.addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { buildFlow(); paginate(); buildTOC(); render(0); }, 200); });
  boot();
})();
