/* ============================================================
   ARCHIVUS — colourways (v12)
   Three of them, switched from the header and remembered:
     blue   the original observatory: deep navy, parchment ink, brass
     black  true black and neutral greys — the same instrument with the blue taken out
     white  a light page: dark ink, brass darkened until it reads

   HOW IT WORKS. The original palette stays the single source of truth: every stylesheet,
   every data file and every drawing routine still names the colours of the blue colourway.
   The other two are DERIVED from it by one rule, applied to every colour wherever it appears:

       keep each colour's contrast against the page, measured against the new page.

   On black that re-anchors greys and drains the blue from them. On white it mirrors
   lightness: what stood out as light-on-dark stands out equally as dark-on-light, so any
   two colours that were legible against each other still are (their contrast ratio is
   preserved exactly by the mirror). Three adjustments are layered on top:
     · text is never left below 4.5:1 against its panel (WCAG AA), in any colourway —
       including the original, where a few dim labels are lifted;
     · accents are not mirrored all the way (pure mirroring turns gold to brown): above 3:1
       the mirror is compressed, so gold lands near 5:1 — and an accent maps the same way
       whatever it is used for, so a legend swatch always matches the mark it explains;
     · shadows stay shadows.

   This file is that rule (ARCHIVUS_THEME.map), used in three places:
     1. tools/build-themes.js runs it over every stylesheet to generate src/themes.css;
     2. in the browser, for the two derived colourways, it re-tones colours that scripts
        write straight into the page (inline styles, SVG fill/stroke) as they are inserted;
     3. and colours drawn on <canvas>.
   It loads in <head>, before anything paints, so there is no flash of the wrong colourway.
   ============================================================ */
(function (root) {
  "use strict";
  const BG = { blue: [10, 12, 18], black: [0, 0, 0], white: [255, 255, 255] };
  const NAMES = { blue: "Blue — the original", black: "Black", white: "White" };
  const ORDER = ["blue", "black", "white"];
  /* shared stylesheets beyond styles.css, per page: w wars.css · d doctrines.css · r realms.css
     (tools/build-themes.js checks this table against the pages and refuses to build if it is stale) */
  const SHEETS = { wars: "w", doctrines: "w d", realms: "w d r", coups: "w d r" };

  /* ---------- colour arithmetic ---------- */
  const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const gam = v => Math.round(255 * Math.max(0, Math.min(1, v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)));
  const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);       /* WCAG relative luminance */
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  function toLab(c) {                                                                    /* OKLab: even lightness, stable hue */
    const r = lin(c[0]), g = lin(c[1]), b = lin(c[2]);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function fromLab(L, a, b) {                                                            /* → linear rgb, may be out of gamut */
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  }
  const inGamut = p => p.every(v => v >= -0.0005 && v <= 1.0005);
  /* the colour of this hue (chroma scaled by k) whose luminance is `target` */
  function withLum(c, k, target) {
    const lab = toLab(c), a = lab[1] * k, b = lab[2] * k;
    const at = L => { let p = fromLab(L, a, b), s = 1; for (let i = 0; i < 12 && !inGamut(p); i++) { s *= 0.8; p = fromLab(L, a * s, b * s); } return p.map(v => Math.max(0, Math.min(1, v))); };
    let lo = 0, hi = 1, p = null;
    for (let i = 0; i < 26; i++) { const L = (lo + hi) / 2; p = at(L); if (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2] < target) lo = L; else hi = L; }
    return p.map(gam);
  }
  /* slate greys and near-blacks count as neutral: they are the page, not a signal */
  function neutral(c) {
    const lab = toLab(c), C = Math.hypot(lab[1], lab[2]), h = (Math.atan2(lab[2], lab[1]) * 180 / Math.PI + 360) % 360;
    return C < 0.04 || (h > 225 && h < 300 && C < 0.062) || (h > 60 && h < 115 && C < 0.05 && lab[0] > 0.6) || lum(c) < 0.006;
  }

  /* ---------- the rule ----------
     role: ink (text) · mark (fills, strokes, borders) · surface (backgrounds) · var (a palette
     variable, used both ways) · shadow.   c = [r, g, b, a].  Returns [r, g, b, a]. */
  const L0 = lum(BG.blue);
  /* text is held a little above 4.5:1 against the page, so that it still clears 4.5:1 (WCAG AA) on the panels,
     which sit a shade off the page — a wider shade on white, where panels are told apart by tone alone */
  const FLOOR = { blue: 5.1, black: 5.1, white: 5.6 };
  const RANGE = (21 - 1) / (ratio(1, L0) - 1);                  /* black has more room than navy: stretch so white stays white */
  function map(c, role, theme) {
    if (!BG[theme]) return c;
    if (role === "shadow") return theme === "white" && c[0] + c[1] + c[2] < 60 ? [c[0], c[1], c[2], +(c[3] * 0.3).toFixed(3)] : c;   /* dark shadows soften on a light page */
    const INK = FLOOR[theme];
    let rgb = [c[0], c[1], c[2]], a = c[3];
    if (role === "ink" && a > 0.55 && a < 0.999) { rgb = rgb.map((v, i) => v * a + BG.blue[i] * (1 - a)); a = 1; }   /* see-through text is judged as it lands on the page */
    const L = lum(rgb), n = neutral(rgb);
    const was = ratio(L, L0), sunk = L < L0;                    /* contrast against the original page; sunk = darker than it */
    const text = role === "ink" && was >= 2.2 && a > 0.55;      /* real text — not dark ink sitting on an accent, not a faint watermark */
    if (theme === "blue") return text && was < INK ? withLum(rgb, 1, INK * (L0 + 0.05) - 0.05).concat(a) : c;
    if (theme === "black") {
      if (!n) return text && ratio(L, 0) < INK ? withLum(rgb, 1, INK * 0.05 - 0.05).concat(a) : c;
      const full = 1 + (was - 1) * RANGE, want = sunk ? 1 : text ? Math.max(full, INK) : full, warm = toLab(rgb)[2] > 0.012 && L > 0.3;
      return withLum(rgb, warm ? 0.45 : 0, Math.min(1, want * 0.05 - 0.05)).concat(a);
    }
    /* white */
    let want = sunk ? (L0 + 0.05) / (L + 0.05) : was;
    if (n) { if (text) want = Math.max(want, INK); want = Math.min(want, 17.5); }
    else {                                                      /* an accent looks the same whatever it is used for, so legends match marks */
      want = want <= 3 ? want : 3 + (want - 3) * 0.35;
      if (text) want = Math.max(want, INK);
      /* a mark — a country on a map, a bar, a legend chip — that was dim on navy would mirror to a pale wash on white.
         Where its own colour allows, it is held to 3:1 against the page, the standard for graphics (WCAG 1.4.11): the red
         end of a scale reads as red. Not further, or what was quiet on navy would shout. (Faint tints, under 1.3:1, still mirror.) */
      if (role === "mark" && !sunk) { const own = Math.min(ratio(1, L), 3.2), t = Math.max(0, Math.min(1, (was - 1.3) / 0.6)); if (own > want) want += t * (own - want); }
    }
    return withLum(rgb, !n ? 1.08 : toLab(rgb)[2] > 0.008 ? 0.5 : 0.2, 1.05 / want - 0.05).concat(a);   /* greys keep a trace of their temperature */
  }

  /* ---------- reading and writing CSS colours ---------- */
  const RX = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b(?!-)/g;
  function parse(s) {
    if (s[0] === "#") {
      let h = s.slice(1); if (h.length === 3 || h.length === 4) h = h.replace(/./g, "$&$&");
      if (h.length !== 6 && h.length !== 8) return null;
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
    if (s === "white") return [255, 255, 255, 1];
    if (s === "black") return [0, 0, 0, 1];
    const m = s.match(/-?[\d.]+%?/g);
    if (!m || m.length < 3 || /var\(|calc\(/.test(s)) return null;
    const n = m.map((v, i) => v.slice(-1) === "%" ? parseFloat(v) / 100 * (i < 3 ? 255 : 1) : parseFloat(v));
    return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  }
  const hex = v => (v < 16 ? "0" : "") + Math.round(v).toString(16);
  const css = c => c[3] >= 0.999 ? "#" + hex(c[0]) + hex(c[1]) + hex(c[2]) : "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + +c[3].toFixed(3) + ")";
  const cache = {};
  function tone(str, role, theme) {
    const k = theme + role + str; if (cache[k] !== undefined) return cache[k];
    const c = parse(str); return (cache[k] = c ? css(map(c, role, theme)) : str);
  }
  /* every colour inside one CSS value (gradients, shadows, shorthands) */
  const mapValue = (value, role, theme) => value.replace(RX, m => tone(m, role, theme));
  /* which role a CSS property plays; `text` = the element is text (for SVG fill and stroke) */
  function roleOf(prop, text) {
    if (prop === "color" || prop === "-webkit-text-fill-color" || prop === "caret-color" || prop.indexOf("text-decoration") === 0) return "ink";
    if (prop === "fill" || prop === "stroke") return text ? "ink" : "mark";
    if (prop.indexOf("shadow") >= 0 || prop === "filter") return "shadow";
    if (prop.indexOf("background") === 0) return "surface";
    if (prop.indexOf("--") === 0) return "var";
    return "mark";
  }

  const API = { BG, NAMES, ORDER, SHEETS, map, parse, css, tone, mapValue, roleOf, lum, ratio, neutral, RX };
  if (typeof module !== "undefined" && module.exports) { module.exports = API; return; }

  /* ============================================================
     in the browser
     ============================================================ */
  const doc = root.document, html = doc.documentElement, KEY = "archivus-theme";
  let theme = "blue";
  try { const q = /[?&]theme=(blue|black|white)\b/.exec(root.location.search); theme = (q && q[1]) || root.localStorage.getItem(KEY) || "blue"; } catch (_) { /* private mode: the original */ }
  if (!BG[theme]) theme = "blue";
  html.setAttribute("data-theme", theme);
  const page = (root.location.pathname.split("/").pop() || "index.html").replace(/\.html?$/, "") || "index";
  html.setAttribute("data-page", page);
  html.setAttribute("data-k", "s " + (SHEETS[page] || ""));    /* which shared stylesheets this page loads: scopes the generated twins */
  API.current = theme;
  API.set = t => {                                           /* the page is redrawn from scratch: charts bake their colours in */
    if (!BG[t] || t === theme) return;
    try { root.localStorage.setItem(KEY, t); } catch (_) {}
    const u = new URL(root.location.href); u.searchParams.delete("theme");
    if (u.href !== root.location.href) root.location.replace(u.href); else root.location.reload();
  };
  root.ARCHIVUS_THEME = API;
  const metas = () => {
    const cs = doc.querySelector('meta[name="color-scheme"]'), tc = doc.querySelector('meta[name="theme-color"]');
    if (cs) cs.content = theme === "white" ? "light" : "dark";
    if (tc) tc.content = css(BG[theme].concat(1));
  };
  metas(); doc.addEventListener("DOMContentLoaded", metas);
  if (theme === "blue") return;                              /* the original needs nothing re-toned at run time */

  /* ---- 2. colours that scripts write into the page ---- */
  const ATTRS = ["fill", "stroke", "stop-color", "flood-color", "color"], TEXT = { text: 1, tspan: 1, textPath: 1 };
  const done = new WeakMap();                                /* element → what we last wrote, so our own edits are not re-toned */
  const DECL = /(^|;)\s*([-\w]+)\s*:\s*([^;]+)/g;
  function retone(el) {
    if (el.nodeType !== 1 || el.closest("[data-fixed]")) return;   /* data-fixed: an object with its own colours (the Codex's parchment) */
    const isText = !!TEXT[el.localName], mine = done.get(el) || {};
    for (let i = 0; i < ATTRS.length; i++) {
      const k = ATTRS[i], v = el.getAttribute(k);
      if (v && v !== mine[k] && v !== "none" && v.indexOf("url(") < 0 && v !== "currentColor") {
        const w = mapValue(v, k === "color" ? "ink" : roleOf(k === "stop-color" || k === "flood-color" ? "fill" : k, isText), theme);
        mine[k] = w; if (w !== v) el.setAttribute(k, w);
      }
    }
    const s = el.getAttribute("style");
    if (s && s !== mine.style && (s.indexOf("#") >= 0 || s.indexOf("rgb") >= 0)) {
      /* a colour handed to the stylesheet as a variable (style="--c:…") is usually the element's text and border at once */
      const chip = !el.firstChild;                           /* an element with nothing in it is a swatch, a bar or a dot: its background is a mark */
      const w = s.replace(DECL, (m, pre, prop, val) => pre + prop + ":" + mapValue(val, prop.indexOf("--") === 0 ? "ink" : chip && (prop === "background" || prop === "background-color") ? "mark" : roleOf(prop, isText), theme));
      mine.style = w; if (w !== s) el.setAttribute("style", w);
    } else if (s) mine.style = s;
    done.set(el, mine);
  }
  const sweep = node => { if (node.nodeType !== 1) return; retone(node); const all = node.querySelectorAll("[style],[fill],[stroke],[stop-color],[flood-color],[color]"); for (let i = 0; i < all.length; i++) retone(all[i]); };
  new MutationObserver(list => {
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      if (m.type === "attributes") retone(m.target);
      else for (let j = 0; j < m.addedNodes.length; j++) sweep(m.addedNodes[j]);
    }
  }).observe(html, { subtree: true, childList: true, attributes: true, attributeFilter: ATTRS.concat("style") });

  /* ---- 3. colours drawn on canvas ---- */
  const C2D = root.CanvasRenderingContext2D && root.CanvasRenderingContext2D.prototype;
  if (C2D) {
    const raw = new WeakMap();                               /* context → the colours as the script set them */
    ["fillStyle", "strokeStyle", "shadowColor"].forEach(p => {
      const d = Object.getOwnPropertyDescriptor(C2D, p); if (!d || !d.set) return;
      Object.defineProperty(C2D, p, {
        configurable: true, enumerable: d.enumerable,
        get() { const r = raw.get(this); return r && r[p] !== undefined ? r[p] : d.get.call(this); },
        set(v) {
          let r = raw.get(this); if (!r) raw.set(this, r = {});
          r[p] = v; r["set" + p] = d.set;
          d.set.call(this, typeof v === "string" ? mapValue(v, p === "shadowColor" ? "shadow" : "mark", theme) : v);
        }
      });
    });
    ["fillText", "strokeText"].forEach(fn => {                 /* text is held to the text standard */
      const f = C2D[fn], p = fn === "fillText" ? "fillStyle" : "strokeStyle";
      C2D[fn] = function () {
        const r = raw.get(this), v = r && r[p];
        if (typeof v !== "string") return f.apply(this, arguments);
        r["set" + p].call(this, mapValue(v, "ink", theme));
        const out = f.apply(this, arguments);
        r["set" + p].call(this, mapValue(v, "mark", theme));
        return out;
      };
    });
    const G = root.CanvasGradient && root.CanvasGradient.prototype;
    if (G) { const add = G.addColorStop; G.addColorStop = function (o, c) { return add.call(this, o, typeof c === "string" ? mapValue(c, "mark", theme) : c); }; }
  }
})(typeof window !== "undefined" ? window : globalThis);
