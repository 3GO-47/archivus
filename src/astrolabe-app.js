/* ============================================================
   ARCHIVUS — THE ASTROLABE
   A transit instrument. Radius is log-time: the rim is the deep
   past, the golden core is NOW. Every event is a fixed star; the
   whole heaven rotates with true Keplerian shear, ω ∝ r^(−3/2) —
   the recent past spins faster than antiquity, and the relation
   threads slowly wind into spirals, the way a galaxy winds its
   arms. Stars culminate as they cross the top meridian; important
   transits flare and are called out, like an observatory log.

   The Great Year is built into the plate: precessional ages are
   concentric bands (radius IS time), each with its zodiac glyph
   and an oracle line — flagged symbolic, not archival.
   The Transmissions ride in as comets on eccentric dashed orbits.
   The Bloodline is the one golden thread allowed to cross every
   ring, Adam's radius to the living core.

   Physics kept honest: rotation follows Kepler; a grab imparts
   angular velocity that decays by friction; "Still the heavens"
   absorbs all angular momentum; hover bends nearby starlight
   toward the cursor with an inverse-square pull.
   ============================================================ */
(function () {
  "use strict";
  const EV = window.ARCHIVUS_EVENTS || [];
  const THEMES = window.ARCHIVUS_THEMES || [];
  const REGIONS = window.ARCHIVUS_REGIONS || [];
  const TX = window.ARCHIVUS_TRANSMISSIONS || [];
  const THEME_COLOR = Object.fromEntries(THEMES.map(t => [t.id, t.color]));
  const NOW = 2026;

  /* ---------- the plate: log-time radius ---------- */
  const R0 = 60, K = 59, SOFT = 40, RMAX = R0 + K * Math.log((NOW + 40000 + SOFT) / SOFT);
  const rPast = y => R0 + K * Math.log((Math.max(0, NOW - y) + SOFT) / SOFT);
  /* the future falls INSIDE the event horizon — unobservable, compressed toward the center */
  const rOf = y => y <= NOW ? rPast(y)
    : Math.max(7, (R0 - 14) * (1 - Math.log((y - NOW + 8) / 8) / Math.log(128 / 8)) + 7);
  const fmtY = y => y < 0 ? Math.abs(y).toLocaleString() + " BCE" : y + " CE";
  /* invert radius → year (for the meridian epoch readout) */
  const yOfR = r => NOW - (Math.exp((r - R0) / K) * SOFT - SOFT);

  /* ---------- svg / canvas scaffolding ---------- */
  const svg = document.getElementById("as-svg");
  const canvas = document.getElementById("as-canvas");
  const ctx = canvas.getContext("2d");
  const NS = "http://www.w3.org/2000/svg";
  const el = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); (p || world).appendChild(n); return n; };
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = '<linearGradient id="as-mgrad" x1="0" y1="1" x2="0" y2="0">' +
    '<stop offset="0" stop-color="#c9a227" stop-opacity="0.9"/><stop offset="1" stop-color="#c9a227" stop-opacity="0"/></linearGradient>';
  svg.appendChild(defs);
  const world = document.createElementNS(NS, "g");
  svg.appendChild(world);

  /* view transform (shared by svg world and canvas painter) */
  let vk = 1, vx = 0, vy = 0;
  function applyView() {
    world.setAttribute("transform", `translate(${vx},${vy}) scale(${vk})`);
    /* magnification reveals names in tiers, and shrinks them back to size */
    svg.classList.toggle("z1", vk >= 1.4);
    svg.classList.toggle("z2", vk >= 2.2);
    svg.classList.toggle("z3", vk >= 3.2);
    svg.style.setProperty("--lbfs", (8.5 / Math.sqrt(vk)) + "px");
  }
  function fit() {
    const r = svg.getBoundingClientRect();
    vk = Math.min(r.width, r.height) / (2 * (RMAX + 58));
    vx = r.width / 2; vy = r.height / 2 + 6;
    applyView();
  }

  /* ---------- engraved rings ---------- */
  const RING_YEARS = [-25000, -10000, -5000, -3000, -2000, -1000, -500, 0, 500, 1000, 1500, 1800, 1900, 1970, 2000];
  const ringsG = el("g", {});
  RING_YEARS.forEach(y => {
    const r = rOf(y);
    el("circle", { class: "as-ring" + (y % 1000 === 0 ? " major" : ""), cx: 0, cy: 0, r }, ringsG);
    el("text", { class: "as-ring-label", x: 4, y: -r - 3 }, ringsG).textContent = fmtY(y);
  });
  /* outer bezel + zodiac */
  el("circle", { class: "as-outer", cx: 0, cy: 0, r: RMAX + 26 }, ringsG);
  el("circle", { class: "as-outer2", cx: 0, cy: 0, r: RMAX + 8 }, ringsG);
  for (let i = 0; i < 72; i++) {
    const a = i / 72 * 2 * Math.PI;
    el("line", { class: "as-tick", x1: Math.cos(a) * (RMAX + 8), y1: Math.sin(a) * (RMAX + 8),
      x2: Math.cos(a) * (RMAX + (i % 6 === 0 ? 26 : 15)), y2: Math.sin(a) * (RMAX + (i % 6 === 0 ? 26 : 15)) }, ringsG);
  }
  /* the bezel: twelve constellation names cut into the brass, tangent to the ring,
     the lower six flipped so nothing on the instrument reads upside down */
  const NAMES = ["ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
    "LIBRA", "SCORPIUS", "SAGITTARIUS", "CAPRICORNUS", "AQUARIUS", "PISCES"];
  NAMES.forEach((nm, i) => {
    const a = -Math.PI / 2 + (i + 0.5) / 12 * 2 * Math.PI;
    const deg = a * 180 / Math.PI;
    const flip = Math.sin(a) > 0;
    const t = el("text", {
      class: "as-bezel-name", "text-anchor": "middle",
      transform: `translate(${Math.cos(a) * (RMAX + 37)},${Math.sin(a) * (RMAX + 37)}) rotate(${deg + (flip ? -90 : 90)})`,
      dy: "0.35em"
    }, ringsG);
    t.textContent = nm;
  });
  /* 24 hairline spokes, as on any worked plate */
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * 2 * Math.PI;
    el("line", { class: "as-spoke", x1: Math.cos(a) * (R0 + 4), y1: Math.sin(a) * (R0 + 4),
      x2: Math.cos(a) * (RMAX + 8), y2: Math.sin(a) * (RMAX + 8) }, ringsG);
  }
  /* the rete's ecliptic — the off-center ring every true astrolabe carries */
  el("circle", { class: "as-ecliptic", cx: 0, cy: -R0 * 0.9, r: RMAX * 0.62 }, ringsG);
  /* engraved star-dust, deterministic */
  let seed = 9;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 150; i++) {
    const rr = R0 + rnd() * (RMAX - R0), aa = rnd() * 2 * Math.PI;
    el("circle", { class: "as-dust", cx: Math.cos(aa) * rr, cy: Math.sin(aa) * rr, r: 0.5 + rnd() * 0.9 }, ringsG);
  }
  /* the horizon's interior rings: where the anticipated waits */
  [2050, 2100].forEach(y => el("circle", { class: "as-ring future", cx: 0, cy: 0, r: rOf(y) }, ringsG));

  /* ---------- the Great Year: precessional ages as bands of the plate ---------- */
  const AGES = [
    ["♓", "Age of Pisces", 1, 2150, "The fishes: an ichthys scratched into catacomb plaster — the age the church rose in, now ending."],
    ["♈", "Age of Aries", -2150, 1, "The ram: Amun's curled horns, the shofar, the Passover lamb — the age of covenant and empire."],
    ["♉", "Age of Taurus", -4320, -2150, "The bull: Çatalhöyük's horned shrines, Apis, the Minotaur — and a golden calf smashed just as the age closed."],
    ["♊", "Age of Gemini", -6450, -4320, "The twins: agriculture spreads hand to hand; twin culture-heroes seed the founding myths."],
    ["♋", "Age of Cancer", -8600, -6450, "The crab, the waters: post-glacial seas rise and coastlines drown — where the flood memories begin?"],
    ["♌", "Age of Leo", -10750, -8600, "The lion: Younger Dryas fire and thaw; Göbekli Tepe raised; the Sphinx stares at its own constellation — so the heretics insist. Symbolic reading, not archive."]
  ];
  const oracleBox = document.getElementById("as-age-oracle");
  AGES.forEach(([g, name, y0, y1, line], idx) => {
    const rIn = rOf(y1), rOut = rOf(y0);
    const ring = el("circle", { class: "as-age", cx: 0, cy: 0, r: rOut }, ringsG);
    /* the age's name engraved along its own band, arcing over the top of the plate */
    const rm = rIn + (rOut - rIn) / 2 + 3;
    const pid = "as-agearc-" + idx;
    el("path", { id: pid, fill: "none",
      d: `M ${-rm * 0.94} ${-rm * 0.342} A ${rm} ${rm} 0 0 1 ${rm * 0.94} ${-rm * 0.342}` }, defs);
    const lab = el("text", { class: "as-age-name" }, ringsG);
    const tp = document.createElementNS(NS, "textPath");
    tp.setAttribute("href", "#" + pid);
    tp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + pid);
    tp.setAttribute("startOffset", (18 + idx * 11) + "%");
    tp.textContent = "· " + name.toUpperCase() + " ·";
    lab.appendChild(tp);
    const show = () => {
      oracleBox.style.display = "block";
      oracleBox.querySelector(".k").textContent = "THE GREAT YEAR · " + name.toUpperCase() + " · " + fmtY(y0) + " – " + fmtY(y1);
      oracleBox.querySelector(".t").textContent = line;
    };
    const hide = () => { oracleBox.style.display = "none"; };
    [ring, lab].forEach(n => { n.addEventListener("mouseenter", show); n.addEventListener("mouseleave", hide);
      n.addEventListener("click", show); });
  });

  /* ---------- meridian (the transit line) ---------- */
  el("line", { class: "as-meridian", x1: 0, y1: -R0 + 14, x2: 0, y2: -(RMAX + 8) }, ringsG);
  el("text", { class: "as-meridian-cap", x: 0, y: -(RMAX + 44), "text-anchor": "middle" }, ringsG).textContent = "MERIDIAN";

  /* ---------- the core: NOW ---------- */
  el("circle", { class: "as-core-ring", cx: 0, cy: 0, r: R0 - 14 }, ringsG);
  el("text", { class: "as-core-label", x: 0, y: -2, "text-anchor": "middle" }, ringsG).textContent = "NOW";
  el("text", { class: "as-core-sub", x: 0, y: 12, "text-anchor": "middle" }, ringsG).textContent = "EVENT HORIZON · " + NOW + " CE";
  el("text", { class: "as-core-sub", x: 0, y: 24, "text-anchor": "middle", opacity: 0.7 }, ringsG).textContent = "THE ANTICIPATED LIES WITHIN";

  /* ---------- stars ---------- */
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const regionAngle = Object.fromEntries(REGIONS.map((r, i) => [r, i / REGIONS.length * 2 * Math.PI]));
  const OM_REF = 2 * Math.PI / 420;              /* one revolution in 7 min at r = 200, speed 1× */
  const omega = r => OM_REF * Math.pow(200 / Math.max(r, 70), 1.5);

  const stars = EV.filter(e => Number.isFinite(e.startYear)).map(e => {
    const r = Math.min(rOf(e.startYear), RMAX);
    const th0 = (regionAngle[e.region] != null ? regionAngle[e.region] : 0)
      + ((hash(e.id) % 1000) / 1000 - 0.5) * (2 * Math.PI / REGIONS.length) * 0.92 - Math.PI / 2;
    return { e, r, th0, om: omega(r), th: th0, x: 0, y: 0, ox: 0, oy: 0, imp: e.importance || 5 };
  });
  const starById = Object.fromEntries(stars.map(s => [s.e.id, s]));
  /* relation threads (each pair once) */
  const threads = [];
  stars.forEach(s => (s.e.related || []).forEach(rid => {
    const o = starById[rid];
    if (o && s.e.id < rid) threads.push([s, o]);
  }));

  const starsG = el("g", {});
  stars.forEach(s => {
    const g = el("g", { class: "as-star" + (s.e.approximate ? " approx" : "") + (s.e.future ? " future" : "") }, starsG);
    const rad = 1.4 + s.imp * 0.42;
    const col = THEME_COLOR[s.e.theme] || "#c9a227";
    el("circle", { class: "halo", cx: 0, cy: 0, r: rad + 4, stroke: col, "stroke-width": 1 }, g);
    el("circle", { class: "core", cx: 0, cy: 0, r: rad, fill: col, opacity: s.e.theme === "myth" ? 0.95 : 0.85 }, g);
    g.classList.add(s.imp >= 10 ? "L10" : s.imp >= 8 ? "L8" : s.imp >= 6 ? "L6" : "L0");
    el("text", { x: rad + 3, y: 3 }, g).textContent = s.e.title.split(" (")[0].slice(0, 26);
    el("title", {}, g).textContent = s.e.title + " — " + fmtY(s.e.startYear) + " · " + (s.e.theme || "");
    s.flare = el("circle", { class: "as-flare", cx: 0, cy: 0, r: 5 }, g);
    g.addEventListener("click", ev => { ev.stopPropagation(); selectStar(s); });
    g.addEventListener("dblclick", ev => { ev.stopPropagation(); themeLens(s.e.theme); });
    s.g = g;
  });
  /* the theme lens: double-click a star to dim every other order of things */
  let lens = null;
  function themeLens(theme) {
    lens = lens === theme ? null : theme;
    stars.forEach(o => o.g.classList.toggle("dim", lens != null && o.e.theme !== lens));
    feedPush(lens ? "◐ lens: <b>" + lens + "</b> — double-click again to clear" : "◐ lens cleared");
  }

  /* ---------- the Bloodline thread ---------- */
  const bloodPts = [];
  for (let y = -4004; y <= NOW; y += 12) {
    const r = rOf(y);
    const a = -Math.PI / 2 + (rOf(-4004) - r) * 0.012;
    bloodPts.push([Math.cos(a) * r, Math.sin(a) * r, y]);
  }
  const bloodG = el("g", { class: "as-blood" });
  const bp0 = bloodPts[0];
  el("circle", { cx: bp0[0], cy: bp0[1], r: 4.6, fill: "none", stroke: "#e8c455", "stroke-width": 1.2 }, bloodG);
  el("text", { x: bp0[0] + 8, y: bp0[1] + 3 }, bloodG).textContent = "THE BLOODLINE ⟶";
  el("title", {}, bloodG).textContent = "Adam's radius to the living core — open the Bloodline";
  bloodG.addEventListener("click", () => location.href = "lineage.html");

  /* ---------- comets: the Transmissions ---------- */
  const CAT_COLOR = { angelic: "#c9a227", divine: "#9b6fc3", daimonic: "#c0392b", alchemical: "#4fae9c", oneiric: "#7c9ac9" };
  const comets = TX.filter(t => Number.isFinite(t.claimYear)).map((t, i) => {
    const rP = Math.min(rOf(t.claimYear), RMAX - 8);            /* perihelion: the claim's epoch */
    const thP = (hash(t.id) % 1000) / 1000 * 2 * Math.PI;
    return { t, rP, thP, ecc: 0.72 + (i % 5) * 0.04, phase: (hash(t.id) % 997) / 997,
      period: 34 + (hash(t.id) % 7) * 9, col: CAT_COLOR[t.category] || "#c9a227", x: 0, y: 0 };
  });
  const cometHitsG = el("g", {});
  comets.forEach(c => {
    c.hit = el("circle", { class: "as-comet-hit", cx: 0, cy: 0, r: 12, fill: "none", "pointer-events": "all" }, cometHitsG);
    el("title", {}, c.hit).textContent = "☄ " + c.t.transmitter + " — " + c.t.taught.slice(0, 60) + "… (claim " + fmtY(c.t.claimYear) + ")";
    c.hit.addEventListener("click", ev => { ev.stopPropagation(); selectComet(c); });
  });
  svg.appendChild(world);
  world.appendChild(bloodG);

  /* ---------- record panel ---------- */
  const panel = document.getElementById("as-panel");
  let selected = null;
  function openPanel(kicker, title, date, desc, links) {
    document.getElementById("as-p-kicker").textContent = kicker;
    document.getElementById("as-p-title").textContent = title;
    document.getElementById("as-p-date").textContent = date;
    document.getElementById("as-p-desc").textContent = desc;
    document.getElementById("as-p-links").innerHTML = links;
    panel.classList.add("open");
  }
  function closePanel() {
    panel.classList.remove("open");
    if (selected) { selected.g.classList.remove("sel"); selected = null; }
    stars.forEach(o => o.g.classList.remove("kin"));
  }
  document.getElementById("as-close").addEventListener("click", closePanel);
  function selectStar(s) {
    if (selected) selected.g.classList.remove("sel");
    selected = s; s.g.classList.add("sel");
    /* light the constellation: this star's direct kin glow faintly */
    stars.forEach(o => o.g.classList.remove("kin"));
    (s.e.related || []).forEach(id => { const o = starById[id]; if (o) o.g.classList.add("kin"); });
    const e = s.e;
    openPanel((e.theme || "") + " · " + (e.era || "") + " · " + (e.region || ""), e.title,
      fmtY(e.startYear) + (e.endYear ? " – " + fmtY(e.endYear) : "") + (e.approximate ? "  (c.)" : ""),
      e.desc || "",
      '<a href="index.html#e=' + e.id + '&v=chronicle">Open in the Chronicle ⟶</a>' +
      (e.source ? '<a href="' + e.source + '" target="_blank" rel="noopener">Consult source ↗</a>' : ""));
  }
  function selectComet(c) {
    if (selected) { selected.g.classList.remove("sel"); selected = null; }
    openPanel("☄ transmission · " + c.t.category, c.t.transmitter,
      "claim recorded " + (c.t.claimDate || fmtY(c.t.claimYear)),
      c.t.taught + (c.t.note ? "  —  " + c.t.note : ""),
      '<a href="transmissions.html#' + c.t.id + '">Open in the Transmissions ⟶</a>');
  }
  svg.addEventListener("click", e => { if (e.target === svg) closePanel(); });

  /* ---------- observatory feed ---------- */
  const feed = document.getElementById("as-feed");
  function feedPush(html) {
    const d = document.createElement("div");
    d.className = "ln"; d.innerHTML = html;
    feed.prepend(d);
    while (feed.children.length > 9) feed.lastChild.remove();
  }

  /* ---------- dynamics ---------- */
  let speed = 1; const SPEEDS = [1, 6, 24, 0];
  let T = 0;                       /* sim time, seconds */
  let spinW = 0, rot = 0;          /* user angular velocity / plate rotation */
  let last = performance.now();
  const mouse = { x: 1e9, y: 1e9 };

  const dpr = () => window.devicePixelRatio || 1;
  function sizeCanvas() {
    const r = svg.getBoundingClientRect();
    canvas.width = r.width * dpr(); canvas.height = r.height * dpr();
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    T += dt * speed;
    spinW *= Math.pow(0.35, dt);                 /* friction: e-folding ~1s */
    rot += spinW * dt;
    document.getElementById("as-om").textContent = (Math.abs(spinW) * 1000).toFixed(1);
    document.getElementById("as-L").textContent = Math.abs(spinW) > 0.001 ? "decaying" : "conserved";

    /* star positions: Kepler shear — damped under magnification so the field
       you are studying holds still — plus user spin and cursor lensing */
    const shear = Math.min(1, Math.pow(1.35 / vk, 2));
    const lensScale = 1 / Math.max(1, vk * 0.85);  /* lensing stays gentle under magnification */
    for (const s of stars) {
      s.th += s.om * speed * shear * dt;
      const A = s.th + rot;
      const bx = Math.cos(A) * s.r + s.ox, by = Math.sin(A) * s.r + s.oy;
      let x = bx, y = by;
      const dx = mouse.x - bx, dy = mouse.y - by, d2 = dx * dx + dy * dy;
      if (d2 < 16000) {                          /* gravitational lensing near the cursor */
        const d = Math.sqrt(d2) || 1, pull = Math.min(16, 26000 / (d2 + 900)) * lensScale;
        x += dx / d * pull; y += dy / d * pull;
      }
      /* meridian transit: crossing the top (−π/2), important stars flare */
      const a0 = ((s.aPrev != null ? s.aPrev : A) + Math.PI / 2) % (2 * Math.PI);
      const a1 = (A + Math.PI / 2) % (2 * Math.PI);
      if (s.imp >= 8 && s.aPrev != null && a0 > 5.9 && a1 < 0.4) {
        s.flare.classList.remove("on"); void s.flare.getBBox; s.flare.classList.add("on");
        feedPush("⚹ <b>" + fmtY(s.e.startYear) + "</b> " + s.e.title.slice(0, 44) + " <span style='opacity:.55'>culminates</span>");
      }
      s.aPrev = A; s.x = x; s.y = y; s.bx = bx; s.by = by;
      s.g.setAttribute("transform", `translate(${x},${y})`);
    }
    /* dispersion under magnification: crowded stars relax apart like a gas.
       Runs on UNLENSED positions with a gentle push and hard clamps, so the
       relaxation converges instead of vibrating at deep zoom. */
    if (vk >= 1.5) {
      const rct2 = svg.getBoundingClientRect();
      const vis = [];
      for (const s of stars) {
        const sx = vx + s.bx * vk, sy = vy + s.by * vk;
        if (sx > -40 && sx < rct2.width + 40 && sy > -40 && sy < rct2.height + 40) vis.push(s);
      }
      if (vis.length <= 300) {
        for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
          const a = vis[i], b = vis[j];
          const ddx = b.bx - a.bx, ddy = b.by - a.by;
          const minD = 2.8 + (a.imp + b.imp) * 0.45 + 16 / vk;
          const dd2 = ddx * ddx + ddy * ddy;
          if (dd2 < minD * minD) {
            const d = Math.sqrt(dd2) || 0.01, push = (minD - d) * 0.09;
            a.ox -= ddx / d * push; a.oy -= ddy / d * push;
            b.ox += ddx / d * push; b.oy += ddy / d * push;
          }
        }
      }
      const cap = 52 / vk;
      for (const s of stars) {
        s.ox *= 0.94; s.oy *= 0.94;
        if (s.ox > cap) s.ox = cap; else if (s.ox < -cap) s.ox = -cap;
        if (s.oy > cap) s.oy = cap; else if (s.oy < -cap) s.oy = -cap;
      }
    } else {
      for (const s of stars) { s.ox *= 0.85; s.oy *= 0.85; }
    }
    /* the epoch under the meridian at mid-plate: read the year at r where the cursor ray crosses? — use the ring under the mouse radius */
    const mr = Math.hypot(mouse.x, mouse.y);
    document.getElementById("as-epoch").textContent =
      mr > R0 && mr < RMAX ? "c. " + fmtY(Math.round(yOfR(mr) / 10) * 10) : "—";

    /* comets */
    for (const c of comets) {
      const p = ((T / c.period) + c.phase) % 1;               /* 0 → aphelion, 0.5 → perihelion */
      const m = Math.cos(2 * Math.PI * p);                     /* 1 at aphelion, −1 at perihelion */
      const rr = c.rP + (RMAX + 60 - c.rP) * (m + 1) / 2;
      const th = c.thP + rot + Math.sin(2 * Math.PI * p) * 0.6;
      c.x = Math.cos(th) * rr; c.y = Math.sin(th) * rr;
      c.hit.setAttribute("transform", `translate(${c.x},${c.y})`);
      c.rr = rr; c.thNow = th;
    }

    paint();
    requestAnimationFrame(frame);
  }

  /* ---------- canvas painter: threads, comet tails, bloodline ---------- */
  function paint() {
    const d = dpr();
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(vx, vy); ctx.scale(vk, vk);
    /* relation threads — wound by the shear */
    ctx.lineWidth = 0.55 / vk;
    for (const [a, b] of threads) {
      const sel2 = selected && (a === selected || b === selected);
      ctx.strokeStyle = sel2 ? "rgba(232,196,85,0.85)" : "rgba(201,162,39,0.07)";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    /* bloodline spiral */
    ctx.strokeStyle = "rgba(232,196,85,0.5)"; ctx.lineWidth = 1.3 / vk;
    ctx.beginPath();
    bloodPts.forEach(([x, y], i) => {
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);   /* the chronology thread is engraved on the bezel */
    });
    ctx.stroke();
    /* comets: eccentric dashed orbit + glowing head + tail pointing away from NOW */
    for (const c of comets) {
      ctx.strokeStyle = c.col; ctx.globalAlpha = 0.8;
      const tail = 26 + 40 * (1 - (c.rr - c.rP) / (RMAX + 60 - c.rP));   /* longer near perihelion */
      const ux = c.x / (Math.hypot(c.x, c.y) || 1), uy = c.y / (Math.hypot(c.x, c.y) || 1);
      const grad = ctx.createLinearGradient(c.x, c.y, c.x + ux * tail, c.y + uy * tail);
      grad.addColorStop(0, c.col); grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = grad; ctx.lineWidth = 1.6 / vk;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + ux * tail, c.y + uy * tail); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.col;
      ctx.beginPath(); ctx.arc(c.x, c.y, 2.2 / Math.sqrt(vk), 0, 7); ctx.fill();
    }
  }

  /* ---------- interaction: spin with momentum, zoom, pan ---------- */
  let drag = null;
  const pts = new Map();                     /* live pointers, for pinch */
  let pinch = null;
  const toWorld = (cx, cy) => {
    const r = svg.getBoundingClientRect();
    return [(cx - r.left - vx) / vk, (cy - r.top - vy) / vk];
  };
  svg.addEventListener("pointerdown", e => {
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) {                    /* two fingers: pinch the heavens */
      drag = null;
      const [p1, p2] = [...pts.values()];
      const r = svg.getBoundingClientRect();
      pinch = { d0: Math.hypot(p1[0] - p2[0], p1[1] - p2[1]) || 1, k0: vk, vx0: vx, vy0: vy,
        mx: (p1[0] + p2[0]) / 2 - r.left, my: (p1[1] + p2[1]) / 2 - r.top };
      return;
    }
    const [x, y] = toWorld(e.clientX, e.clientY);
    drag = { x, y, cx: e.clientX, cy: e.clientY, ang: Math.atan2(y, x), t: performance.now(),
      pan: e.shiftKey, vx0: vx, vy0: vy, moved: false, id: e.pointerId };
  });
  svg.addEventListener("pointermove", e => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pts.size === 2) {
      const [p1, p2] = [...pts.values()];
      const d = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]) || 1;
      const k2 = Math.max(0.35, Math.min(4.6, pinch.k0 * d / pinch.d0));
      vx = pinch.mx - (pinch.mx - pinch.vx0) * (k2 / pinch.k0);
      vy = pinch.my - (pinch.my - pinch.vy0) * (k2 / pinch.k0);
      vk = k2; applyView();
      return;
    }
    const [x, y] = toWorld(e.clientX, e.clientY);
    mouse.x = x; mouse.y = y;
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy) > 4) {
      drag.moved = true; svg.setPointerCapture(drag.id); svg.classList.add("spinning");
    }
    if (!drag.moved) return;
    if (drag.pan) {
      vx = drag.vx0 + (e.clientX - drag.cx); vy = drag.vy0 + (e.clientY - drag.cy);
      applyView(); return;
    }
    const a = Math.atan2(y - 0, x - 0);
    let da = a - drag.ang;
    if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
    rot += da;
    const nowT = performance.now();
    spinW = da / Math.max(0.008, (nowT - drag.t) / 1000);
    spinW = Math.max(-6, Math.min(6, spinW));
    drag.ang = a; drag.t = nowT;
  });
  svg.addEventListener("pointerup", e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; drag = null; svg.classList.remove("spinning"); });
  svg.addEventListener("pointercancel", e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; drag = null; svg.classList.remove("spinning"); });
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const r = svg.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const k2 = Math.max(0.35, Math.min(4.6, vk * Math.pow(1.0016, -e.deltaY)));
    vx = mx - (mx - vx) * (k2 / vk); vy = my - (my - vy) * (k2 / vk);
    vk = k2; applyView();
  }, { passive: false });

  /* ---------- controls ---------- */
  const playBtn = document.getElementById("as-play");
  function cycleSpeed() {
    speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    playBtn.textContent = speed === 0 ? "⏸ still" : "⟳ " + speed + "×";
  }
  playBtn.addEventListener("click", cycleSpeed);
  document.getElementById("as-still").addEventListener("click", () => { spinW = 0; });
  document.getElementById("as-fit").addEventListener("click", fit);
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === " ") { e.preventDefault(); cycleSpeed(); }
    if (e.key === "0") spinW = 0;
    if (e.key === "Escape") { closePanel(); if (lens) themeLens(lens); }
  });

  /* ---------- boot ---------- */
  function onResize() { sizeCanvas(); fit(); }
  window.addEventListener("resize", onResize);
  sizeCanvas(); fit();
  feedPush("<b>THE ASTROLABE</b> — " + stars.length + " stars · " + threads.length + " threads · " + comets.length + " comets");
  feedPush("Kepler shear engaged: ω ∝ r^−3/2 — antiquity turns slowly, the present races");
  feedPush("zoom in: the sky holds still, the crowds disperse, the names resolve");
  spinW = 0.3;                                   /* a hand sets the plate turning */
  requestAnimationFrame(frame);
})();
