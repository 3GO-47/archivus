/* ============================================================
   ARCHIVUS — the frame (v10; eleven instruments since v11)
   ------------------------------------------------------------
   Eleven pages that should feel like one instrument. This script
   is the first thing in every <body> and gives every page

     · ONE HEADER, identical everywhere: brand, the eleven
       instruments, and a search-everything button. It is in
       place before the page paints, so nothing shifts. The
       per-page mastheads stay in the markup as a no-script
       fallback and are hidden (styles.css, "v10").
     · A GLIDING MARKER under the current instrument: it starts
       where it stood on the page you came from and slides over.
     · SOFT PAGE CHANGES. Browsers with cross-document view
       transitions cross-fade natively (see @view-transition in
       styles.css) and prerender the page you hover; everywhere
       else — including file:// — the stage fades out and in.
     · MEMORY. Each instrument's last deep link is remembered
       for the session, so coming back to one returns you to
       where you were.
     · SEARCH EVERYTHING (Ctrl/⌘ K): records, doctrines, battles,
       leaders, bloodline, gods and transmissions in one palette;
       each result opens the item itself on its own instrument.
       The index (src/data/omni.js, built by tools/build-index.js)
       is fetched the first time the palette opens.
     · A title card the first time you enter an instrument, and
       gliding markers for in-page tab strips.

   To add an instrument: add one row to ITEMS.
   ============================================================ */
(function () {
  "use strict";
  const root = document.documentElement;
  const I = d => '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  const ITEMS = [
    { id: "archive", href: "index.html", label: "<i>The </i>Archive", tip: "Chronicle · Atlas · Wheel — all recorded history on one instrument",
      icon: I('<circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/>') },
    { id: "astrolabe", href: "astrolabe.html", label: "Astrolabe", tip: "The transit instrument — history in Keplerian rotation",
      icon: I('<circle cx="8" cy="8" r="6.2"/><circle cx="8" cy="8" r="3.2"/><path d="M8 1.8v12.4M1.8 8h12.4"/>') },
    { id: "codex", href: "codex.html", label: "Codex", tip: "Read the whole archive as a book",
      icon: I('<path d="M8 3.6C6.4 2.6 4 2.4 2 3v9.6c2-.6 4.4-.4 6 .6 1.6-1 4-1.2 6-.6V3c-2-.6-4.4-.4-6 .6zM8 3.6v9.6"/>') },
    { id: "wars", href: "wars.html", label: "War Room", tip: "The two World Wars, day by day: fronts, powers, leaders, cost",
      icon: I('<path d="M2.5 2.5l8.2 8.2M13.5 2.5l-8.2 8.2M9.2 12.2l3-3M6.8 12.2l-3-3M11.6 11.6l1.9 1.9M4.4 11.6l-1.9 1.9"/>') },
    { id: "doctrines", href: "doctrines.html", label: "Doctrines", tip: "Every ideology on one compass — and Marxism dissected, from its ancestors to its heirs",
      icon: I('<rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1"/><path d="M8 2.2v11.6M2.2 8h11.6"/><circle cx="5" cy="5.2" r="1" fill="currentColor"/><circle cx="10.6" cy="10.4" r="1" fill="currentColor"/>') },
    { id: "realms", href: "realms.html", label: "Realms", tip: "Every country weighed — how free, how governed, in whose name — and the United States in detail",
      icon: I('<circle cx="8" cy="8" r="6.2"/><path d="M1.8 8h12.4M8 1.8c2.4 2 2.4 10.4 0 12.4M8 1.8c-2.4 2-2.4 10.4 0 12.4"/>') },
    { id: "coups", href: "coups.html", label: "Coups", tip: "Every seizure of power on record — by creed, by declared aim, and what came before",
      icon: I('<path d="M2.6 11.4L2 5.2l3.4 2.6L8 3.4l2.6 4.4L14 5.2l-.6 6.2zM3.2 13.6h9.6"/>') },
    { id: "lineage", href: "lineage.html", label: "Bloodline", tip: "The family tree — pantheon of Sumer to the lines of the Messiah",
      icon: I('<path d="M8 2v4M8 6H4v3M8 6h4v3M4 9v2M12 9v2"/><circle cx="8" cy="2.4" r="1" fill="currentColor"/><circle cx="4" cy="12.4" r="1.3"/><circle cx="12" cy="12.4" r="1.3"/>') },
    { id: "pantheons", href: "pantheons.html", label: "Pantheons", tip: "Seven divine family trees and the roads between religions",
      icon: I('<path d="M2 5.6L8 2l6 3.6M3 6.5h10M4.3 6.8v5.4M8 6.8v5.4M11.7 6.8v5.4M2.5 13h11"/>') },
    { id: "transmissions", href: "transmissions.html", label: "Transmissions", tip: "Claims of taught knowledge, against the documented record",
      icon: I('<path d="M8 1.8l1.5 4.7 4.7 1.5-4.7 1.5L8 14.2 6.5 9.5 1.8 8l4.7-1.5z"/>') },
    { id: "trial", href: "trial.html", label: "Trial", tip: "Ten questions drawn fresh from the archive",
      icon: I('<path d="M8 2.2v11.3M5 13.5h6M3 4.2h10M3 4.2L1.5 8.4h3zM13 4.2l-1.5 4.2h3z"/>') }
  ];
  const FILES = ITEMS.map(it => it.href);
  const fileOf = p => (p.split("/").pop() || "index.html").toLowerCase();
  const file = fileOf(location.pathname);
  const here = (ITEMS.find(it => it.href === file) || ITEMS[0]).id;
  const POCKET = /\/mobile\/[^/]*$/.test(location.pathname);          /* the single-file builds live in /mobile/ */
  const MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");
  const reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const nativeVT = location.protocol !== "file:" && "CSSViewTransitionRule" in window;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mem = {
    get(k) { try { return sessionStorage.getItem("archivus:" + k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem("archivus:" + k, v); } catch (_) {} }
  };

  root.classList.add("hdr-on");
  if (nativeVT && !reduced) {
    /* the browser cross-fades: each page opts in from a small script in its <head>, because the rule
       must be known before the page first renders — too early for this file */
  } else if (!reduced) {
    /* no native cross-page transition here (file://, older browsers): fade the stage in by hand; the header never fades */
    root.classList.add("vtf", "arriving");
    setTimeout(() => root.classList.remove("arriving"), 520);
  }

  /* ───────────── the header ───────────── */
  const hrefFor = it => it.href + (it.id !== here ? (mem.get("hash:" + it.id) || "") : "");
  function buildHeader() {
    if ($("hdr") || !document.body) return;
    const h = document.createElement("header");
    h.id = "hdr";
    h.innerHTML =
      '<a class="hdr-brand" href="index.html" title="Archivus — begin again at the Archive"><span class="sigil mini" aria-hidden="true"></span><b>ARCHIVUS</b></a>' +
      '<nav id="rail" aria-label="Archivus instruments">' +
      ITEMS.map(it => '<a href="' + hrefFor(it) + '" data-id="' + it.id + '" title="' + it.tip + '"' + (it.id === here ? ' class="here" aria-current="page"' : "") + ">" + it.icon + "<span>" + it.label + "</span></a>").join("") +
      '<i id="rail-pill" aria-hidden="true"></i></nav>' +
      '<button id="omni-btn" type="button" title="Search every instrument at once (' + (MAC ? "⌘" : "Ctrl ") + 'K)" aria-label="Search every instrument">' +
      I('<circle cx="7" cy="7" r="4.4"/><path d="M10.3 10.3l3.4 3.4"/>') + "<span>Search everything</span><kbd>" + (MAC ? "⌘K" : "Ctrl K") + "</kbd></button>";
    document.body.insertBefore(h, document.body.firstChild);
    $("omni-btn").addEventListener("click", () => openOmni());
    const cur = h.querySelector("#rail .here"), rail = $("rail");
    if (cur && rail.scrollWidth > rail.clientWidth) rail.scrollLeft = cur.offsetLeft - (rail.clientWidth - cur.offsetWidth) / 2;
    placePill(!document.prerendering);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placePill(false));
  }
  /* the marker under the current instrument: starts where it stood on the previous page, then glides */
  function placePill(travel) {
    const rail = $("rail"), pill = $("rail-pill"), cur = rail && rail.querySelector(".here");
    if (!cur || !pill) return;
    const to = [cur.offsetLeft, cur.offsetWidth];
    const set = p => { pill.style.transform = "translateX(" + p[0] + "px)"; pill.style.width = p[1] + "px"; };
    let from = null;
    if (travel && !reduced) { try { from = JSON.parse(mem.get("pill") || "null"); } catch (_) {} }
    if (from && from[0] !== to[0]) {
      pill.style.transition = "none"; set(from); pill.style.opacity = 1;
      pill.getBoundingClientRect();                       /* commit the start position before the glide */
      pill.style.transition = "";
      requestAnimationFrame(() => set(to));
    } else { set(to); pill.style.opacity = 1; }
    if (!document.prerendering) mem.set("pill", JSON.stringify(to));
  }

  /* ───────────── memory: each instrument reopens where you left it ───────────── */
  const saveState = () => { if (!document.prerendering) mem.set("hash:" + here, location.hash.length > 1 ? location.hash : ""); };
  window.addEventListener("hashchange", saveState);
  window.addEventListener("pagehide", saveState);
  window.addEventListener("pageshow", e => {
    root.classList.remove("leaving");                      /* back/forward cache restores the page as it was left */
    if (e.persisted) document.querySelectorAll("#rail a[data-id]").forEach(a => { const it = ITEMS.find(x => x.id === a.dataset.id); if (it) a.setAttribute("href", hrefFor(it)); });
  });

  /* ───────────── leaving: instrument-to-instrument hops ───────────── */
  function go(href) {
    saveState();
    if (!root.classList.contains("vtf")) { location.href = href; return; }
    root.classList.add("leaving");
    setTimeout(() => { location.href = href; }, 130);
  }
  window.ARCHIVUS_GO = go;
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    let u; try { u = new URL(a.getAttribute("href"), location.href); } catch (_) { return; }
    if (u.protocol !== location.protocol || u.host !== location.host) return;
    if (FILES.indexOf(fileOf(u.pathname)) < 0 || u.pathname === location.pathname) return;
    saveState();
    if (!root.classList.contains("vtf")) return;           /* the browser's own view transition takes it from here */
    e.preventDefault();
    go(u.href);
  });

  /* ───────────── prerender the page under the pointer (Chromium; ignored elsewhere) ───────────── */
  function speculate() {
    if (location.protocol === "file:" || !(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules"))) return;
    const s = document.createElement("script");
    s.type = "speculationrules";
    s.textContent = JSON.stringify({ prerender: [{ where: { selector_matches: "#rail a, .hdr-brand" }, eagerness: "moderate" }] });
    document.head.appendChild(s);
  }

  /* ───────────── a title card, the first time you enter an instrument ───────────── */
  function titleCard() {
    const mh = $("masthead"), tag = mh && mh.querySelector(".tagline"), h1 = mh && mh.querySelector("h1");
    if (!tag || reduced || mem.get("seen:" + here)) return;
    mem.set("seen:" + here, "1");
    const d = document.createElement("div");
    d.id = "arrive-card";
    d.innerHTML = "<b>" + esc((h1 ? h1.textContent : "").split("·").pop().trim()) + "</b><span>" + esc(tag.textContent.trim()) + "</span>";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 4600);
  }

  /* ───────────── gliding markers for in-page tab strips ───────────── */
  function glide(box, sel) {
    if (!box || box.querySelector(":scope > .tab-pill")) return;
    const pill = document.createElement("i");
    pill.className = "tab-pill"; pill.setAttribute("aria-hidden", "true");
    box.appendChild(pill); box.classList.add("glides");
    let first = true;
    const place = () => {
      const cur = box.querySelector(sel);
      if (!cur) { pill.style.opacity = 0; return; }
      if (first) pill.style.transition = "none";
      pill.style.width = cur.offsetWidth + "px"; pill.style.transform = "translateX(" + cur.offsetLeft + "px)"; pill.style.opacity = 1;
      if (first) { pill.getBoundingClientRect(); pill.style.transition = ""; first = false; }
    };
    new MutationObserver(place).observe(box, { attributes: true, subtree: true, attributeFilter: ["class"] });
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    place();
  }
  window.ARCHIVUS_GLIDE = glide;

  /* ───────────── search everything ───────────── */
  const KINDS = { go: ["Instrument", "#e8c455"], ev: ["Record", "#c9a227"], "do": ["Doctrine", "#e5484d"], th: ["Forerunner", "#d8c690"], ba: ["Battle", "#ff7a66"],
    le: ["Leader", "#5b9be0"], bl: ["Bloodline", "#b48ef0"], gd: ["God", "#5bc8dd"], tx: ["Transmission", "#62c073"], cn: ["Country", "#49c9b8"], cu: ["Seizure", "#e08a3c"] };
  const WHERE = { ev: "The Archive", "do": "Doctrines", th: "Doctrines", ba: "War Room", le: "War Room", bl: "Bloodline", gd: "Pantheons", tx: "Transmissions", cn: "Realms", cu: "Coups" };
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const rec = r => ({ l: r[0], k: r[1], h: r[2], s: r[3] || "", w: r[4] || 0, nl: norm(r[0]), ns: norm(r[3] || "") });
  const GO = ITEMS.map(it => rec([it.label.replace(/<[^>]+>/g, ""), "go", it.href, it.tip, 9]));
  const om = { el: null, idx: null, state: "idle", hits: [], sel: 0, back: null };
  function loadIndex() {
    if (om.state !== "idle") return;
    om.state = "loading";
    const s = document.createElement("script");
    s.src = (POCKET ? "../" : "") + "src/data/omni.js";
    s.onload = () => { om.idx = (window.ARCHIVUS_OMNI || []).map(rec); om.state = "ready"; paintOmni(); };
    s.onerror = () => { om.idx = []; om.state = "missing"; paintOmni(); };
    document.head.appendChild(s);
  }
  function find(q) {
    const toks = norm(q).split(/\s+/).filter(Boolean), nq = toks.join(" "), out = [];
    if (!toks.length) return out;
    const pool = GO.concat(om.idx || []);
    for (let p = 0; p < pool.length; p++) {
      const r = pool[p]; let sc = 0, ok = true;
      for (let t = 0; t < toks.length; t++) {
        const i = r.nl.indexOf(toks[t]);
        if (i === 0) sc += 0; else if (i > 0 && /[\s\-·(,/'’:]/.test(r.nl[i - 1])) sc += 1; else if (i > 0) sc += 2.5;
        else if (r.ns.indexOf(toks[t]) >= 0) sc += 4; else { ok = false; break; }
      }
      if (!ok) continue;
      if (r.nl === nq) sc -= 3; else if (r.nl.indexOf(nq) === 0) sc -= 1.5;
      out.push([sc - r.w * 0.07 + r.nl.length * 0.004, r]);
    }
    out.sort((a, b) => a[0] - b[0]);
    return out.slice(0, 40).map(x => x[1]);
  }
  const recent = () => { try { return (JSON.parse(localStorage.getItem("archivus:recent") || "[]") || []).map(rec); } catch (_) { return []; } };
  function remember(r) {
    if (r.k === "go") return;
    try {
      const a = (JSON.parse(localStorage.getItem("archivus:recent") || "[]") || []).filter(x => x[2] !== r.h);
      a.unshift([r.l, r.k, r.h, r.s]);
      localStorage.setItem("archivus:recent", JSON.stringify(a.slice(0, 7)));
    } catch (_) {}
  }
  function paintOmni() {
    if (!om.el || om.el.hidden) return;
    const q = $("omni-q").value.trim(), list = $("omni-list");
    let h = "";
    const row = (r, i) => '<button type="button" class="om-row' + (i === om.sel ? " on" : "") + '" data-i="' + i + '"><i style="--k:' + KINDS[r.k][1] + '">' + KINDS[r.k][0] + "</i><b>" + esc(r.l) + "</b><span>" + esc(r.s) + "</span><em>" + (WHERE[r.k] || "open") + " ⟶</em></button>";
    if (!q) {
      const rc = recent();
      om.hits = rc.concat(GO);
      if (rc.length) h += '<div class="om-h">Recently opened</div>' + rc.map((r, i) => row(r, i)).join("");
      h += '<div class="om-h">The instruments</div>' + GO.map((r, i) => row(r, i + rc.length)).join("");
    } else {
      om.hits = find(q);
      h = om.hits.length ? om.hits.map(row).join("") : '<div class="om-none">' + (om.state === "loading" ? "Opening the index…" : "Nothing by that name in any instrument.") + "</div>";
    }
    if (om.state === "missing") h += '<div class="om-none">The full index is not available in this copy — instruments only.</div>';
    list.innerHTML = h;
    const on = list.querySelector(".om-row.on"); if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" });
    $("omni-count").textContent = om.state === "ready" ? om.idx.length.toLocaleString() + " entries across eleven instruments" : om.state === "loading" ? "opening the index…" : "";
  }
  function openOmni(seed) {
    if (!om.el) {
      const d = document.createElement("div");
      d.id = "omni"; d.hidden = true;
      d.innerHTML = '<div id="omni-box" role="dialog" aria-modal="true" aria-label="Search every instrument"><div id="omni-top">' + I('<circle cx="7" cy="7" r="4.4"/><path d="M10.3 10.3l3.4 3.4"/>') +
        '<input id="omni-q" type="text" autocomplete="off" spellcheck="false" placeholder="Search every instrument — a record, a doctrine, a battle, a god…" aria-label="Search every instrument"><kbd>Esc</kbd></div>' +
        '<div id="omni-list" role="listbox"></div><div id="omni-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span id="omni-count"></span></div></div>';
      document.body.appendChild(d);
      om.el = d;
      d.addEventListener("mousedown", e => { if (e.target === d) closeOmni(); });
      $("omni-q").addEventListener("input", () => { om.sel = 0; paintOmni(); });
      $("omni-list").addEventListener("click", e => { const b = e.target.closest(".om-row"); if (b) pick(om.hits[+b.dataset.i]); });
      $("omni-list").addEventListener("mousemove", e => { const b = e.target.closest(".om-row"); if (b && +b.dataset.i !== om.sel) { om.sel = +b.dataset.i; $("omni-list").querySelectorAll(".om-row").forEach(x => x.classList.toggle("on", x === b)); } });
    }
    om.back = document.activeElement;
    om.el.hidden = false; root.classList.add("omni-open");
    const q = $("omni-q"); q.value = seed || ""; om.sel = 0;
    loadIndex(); paintOmni();
    q.focus();
  }
  function closeOmni() {
    if (!om.el || om.el.hidden) return;
    om.el.hidden = true; root.classList.remove("omni-open");
    if (om.back && om.back.focus) { try { om.back.focus(); } catch (_) {} }
  }
  function pick(r) {
    if (!r) return;
    remember(r); closeOmni();
    const parts = r.h.split("#");
    if (fileOf(parts[0]) === file) { if (parts[1]) location.hash = parts[1]; return; }      /* already on that instrument */
    go(r.h);
  }
  window.ARCHIVUS_SEARCH = openOmni;
  /* capture phase: the palette owns the keyboard while it is open, and Ctrl/⌘ K works on every page */
  document.addEventListener("keydown", e => {
    const open = om.el && !om.el.hidden;
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "k" || e.key === "K")) { e.preventDefault(); e.stopPropagation(); if (open) closeOmni(); else openOmni(); return; }
    if (!open) return;
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); closeOmni(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (om.hits.length) { om.sel = (om.sel + (e.key === "ArrowDown" ? 1 : om.hits.length - 1)) % om.hits.length; paintOmni(); } }
    else if (e.key === "Enter") { e.preventDefault(); pick(om.hits[om.sel]); }
    else if (e.key === "Tab") { e.preventDefault(); }
  }, true);

  /* ───────────── once the page is parsed ───────────── */
  /* ───────────── long views, one section at a time (v11) ─────────────
     The War Room and the Doctrines have reading views that ran to many screens. Any scrolling view
     (.wr-scroll) whose content is cut by section headings (.wr-h, or the Manifesto's .mf-sec) now
     gets a row of section chips pinned to its top and shows one section at a time — the headings
     double as a table of contents. "All" restores the single long page. Nothing is removed from the
     page: the other sections are only hidden, and a link that scrolls to something inside one
     opens that section first. Views re-rendered by their instrument are re-cut automatically. */
  const PG = new WeakMap();
  const pgAll = () => { try { return localStorage.getItem("archivus-pager") === "all"; } catch (_) { return false; } };
  const pgIsBreak = el => el.matches && el.matches(".wr-h, .mf-sec");
  const pgLabel = el => { const hd = el.matches(".mf-sec") && el.querySelector("header"), t = (hd ? Array.from(hd.children).map(c => c.textContent).join(" · ") : el.textContent).replace(/\s+/g, " ").trim().split(" — ")[0]; return t.length > 34 ? t.slice(0, 32).replace(/\s+\S*$/, "") + "…" : t; };
  function pgCut(sec) {
    const box = sec.querySelector(":scope > .dc-doc") || sec, st = PG.get(sec) || { page: 0 };
    const kids = Array.from(box.children).filter(k => !k.classList.contains("pg-bar")), heads = kids.filter(pgIsBreak);
    let bar = sec.querySelector(":scope > .pg-bar");
    if (heads.length < 2) { if (bar) bar.remove(); kids.forEach(k => k.classList.remove("pg-off")); st.obs && st.obs.takeRecords(); return; }
    let g = 0, seen = false; kids.forEach(k => { if (pgIsBreak(k)) { if (seen) g++; seen = true; } k._pg = g; });
    if (st.page !== "all" && !(st.page <= g)) st.page = 0;
    kids.forEach(k => k.classList.toggle("pg-off", st.page !== "all" && k._pg !== st.page));
    if (!bar) { bar = document.createElement("div"); bar.className = "pg-bar"; bar.setAttribute("role", "tablist"); sec.insertBefore(bar, sec.firstChild); }
    bar.innerHTML = heads.map((h, i) => '<button type="button" class="chipbtn' + (i === st.page ? " on" : "") + '" data-pg="' + i + '">' + pgLabel(h).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])) + "</button>").join("") +
      '<button type="button" class="chipbtn pg-all' + (st.page === "all" ? " on" : "") + '" data-pg="all" title="Every section on one long page">All</button>';
    PG.set(sec, st);
    st.obs && st.obs.takeRecords();                          /* our own edits are not a re-render */
  }
  function paginate() {
    document.querySelectorAll(".wr-scroll").forEach(sec => {
      if (PG.has(sec)) return;
      const st = { page: pgAll() ? "all" : 0 }; PG.set(sec, st);
      sec.addEventListener("click", e => {
        const b = e.target.closest(".pg-bar [data-pg]"); if (!b) return;
        st.page = b.dataset.pg === "all" ? "all" : +b.dataset.pg;
        try { if (st.page === "all") localStorage.setItem("archivus-pager", "all"); else localStorage.removeItem("archivus-pager"); } catch (_) {}   /* "All" is remembered as a preference */
        pgCut(sec); sec.scrollTop = 0;
      });
      st.obs = new MutationObserver(ms => { if (ms.some(m => m.target === sec || (m.target.classList && m.target.classList.contains("dc-doc") && m.target.parentNode === sec))) pgCut(sec); });
      st.obs.observe(sec, { childList: true, subtree: true });
      pgCut(sec);
    });
    /* a jump to something inside a hidden section opens that section first */
    const siv = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function () {
      const sec = this.closest && this.closest(".wr-scroll"), st = sec && PG.get(sec);
      if (st) { pgCut(sec); const off = this.closest(".pg-off"); if (off) { st.page = off._pg; pgCut(sec); } }   /* cut first: the view may have just been re-rendered */
      return siv.apply(this, arguments);
    };
  }

  function ready() {
    buildHeader();
    /* the older per-page link buttons are redundant now — hidden, not deleted (no-script fallback) */
    document.querySelectorAll("#bar > a[href], #masthead a[href], #as-bar a[href], #cx-bar a[href]").forEach(a => {
      if (FILES.indexOf(fileOf((a.getAttribute("href") || "").split("#")[0])) >= 0) a.classList.add("legacy-nav");
    });
    document.body.classList.add("has-rail");
    /* overlays that hang below the chrome (the Archive's filter drawer) read its height from here */
    const hdr = $("hdr"), bar = $("bar");
    const setH = () => root.style.setProperty("--chrome-h", ((hdr ? hdr.offsetHeight : 0) + (bar ? bar.offsetHeight : 0)) + "px");
    setH(); window.addEventListener("resize", setH);
    if (window.ResizeObserver && bar) new ResizeObserver(setH).observe(bar);
    glide($("wr-tabs"), "button.on");
    paginate();
    speculate();
    if (document.prerendering) document.addEventListener("prerenderingchange", () => { placePill(true); titleCard(); }, { once: true });
    else titleCard();
  }
  buildHeader();                                             /* runs at the top of <body>: the header exists before first paint */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();
