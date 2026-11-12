/* ============================================================
   ARCHIVUS — the instrument rail (v8)
   ------------------------------------------------------------
   One navigation strip, identical on every page, so every
   instrument is one click from every other. Before v8 each page
   carried its own hand-picked subset of links (the Trial could
   reach only two instruments; at 1440px the Archive's header
   clipped Wheel and Astrolabe out of sight).

   The rail is injected after the page's header. The older
   per-page link buttons stay in the markup as a no-script
   fallback and are hidden once the rail is in place.
   To add an instrument: add one row to ITEMS.
   ============================================================ */
(function () {
  "use strict";
  const I = d => '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  const ITEMS = [
    { id: "archive", href: "index.html", label: "The Archive", tip: "Chronicle · Atlas · Wheel — all recorded history on one instrument",
      icon: I('<circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/>') },
    { id: "astrolabe", href: "astrolabe.html", label: "Astrolabe", tip: "The transit instrument — history in Keplerian rotation",
      icon: I('<circle cx="8" cy="8" r="6.2"/><circle cx="8" cy="8" r="3.2"/><path d="M8 1.8v12.4M1.8 8h12.4"/>') },
    { id: "codex", href: "codex.html", label: "Codex", tip: "Read the whole archive as a book",
      icon: I('<path d="M8 3.6C6.4 2.6 4 2.4 2 3v9.6c2-.6 4.4-.4 6 .6 1.6-1 4-1.2 6-.6V3c-2-.6-4.4-.4-6 .6zM8 3.6v9.6"/>') },
    { id: "wars", href: "wars.html", label: "War Room", tip: "The two World Wars, day by day: fronts, powers, leaders, cost", isNew: true,
      icon: I('<path d="M2.5 2.5l8.2 8.2M13.5 2.5l-8.2 8.2M9.2 12.2l3-3M6.8 12.2l-3-3M11.6 11.6l1.9 1.9M4.4 11.6l-1.9 1.9"/>') },
    { id: "doctrines", href: "doctrines.html", label: "Doctrines", tip: "Every ideology on one compass — and Marxism dissected, from its ancestors to its heirs", isNew: true,
      icon: I('<rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1"/><path d="M8 2.2v11.6M2.2 8h11.6"/><circle cx="5" cy="5.2" r="1" fill="currentColor"/><circle cx="10.6" cy="10.4" r="1" fill="currentColor"/>') },
    { id: "lineage", href: "lineage.html", label: "Bloodline", tip: "The family tree — pantheon of Sumer to the lines of the Messiah",
      icon: I('<path d="M8 2v4M8 6H4v3M8 6h4v3M4 9v2M12 9v2"/><circle cx="8" cy="2.4" r="1" fill="currentColor"/><circle cx="4" cy="12.4" r="1.3"/><circle cx="12" cy="12.4" r="1.3"/>') },
    { id: "pantheons", href: "pantheons.html", label: "Pantheons", tip: "Seven divine family trees and the roads between religions",
      icon: I('<path d="M2 5.6L8 2l6 3.6M3 6.5h10M4.3 6.8v5.4M8 6.8v5.4M11.7 6.8v5.4M2.5 13h11"/>') },
    { id: "transmissions", href: "transmissions.html", label: "Transmissions", tip: "Claims of taught knowledge, against the documented record",
      icon: I('<path d="M8 1.8l1.5 4.7 4.7 1.5-4.7 1.5L8 14.2 6.5 9.5 1.8 8l4.7-1.5z"/>') },
    { id: "trial", href: "trial.html", label: "Trial", tip: "Ten questions drawn fresh from the archive",
      icon: I('<path d="M8 2.2v11.3M5 13.5h6M3 4.2h10M3 4.2L1.5 8.4h3zM13 4.2l-1.5 4.2h3z"/>') }
  ];
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const here = (ITEMS.find(it => it.href === file) || ITEMS[0]).id;
  const FILES = ITEMS.map(it => it.href);

  function build() {
    const header = document.getElementById("bar") || document.getElementById("masthead");
    if (!header || document.getElementById("rail")) return;
    const rail = document.createElement("nav");
    rail.id = "rail";
    rail.setAttribute("aria-label", "Archivus instruments");
    rail.innerHTML = ITEMS.map(it =>
      '<a href="' + it.href + '" title="' + it.tip + '"' + (it.id === here ? ' class="here" aria-current="page"' : "") + ">" +
      it.icon + "<span>" + it.label + "</span>" + (it.isNew && it.id !== here ? '<b class="new">new</b>' : "") + "</a>").join("");
    header.parentNode.insertBefore(rail, header.nextSibling);

    /* the old ad-hoc link buttons are now redundant — hide, don't delete (no-script fallback).
       The Archive keeps its Astrolabe button inside the view switch. */
    document.querySelectorAll("#bar > a[href], #masthead a[href], #as-bar a[href], #cx-bar a[href]").forEach(a => {
      const f = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (FILES.indexOf(f) >= 0) a.classList.add("legacy-nav");
    });
    document.body.classList.add("has-rail");

    /* overlays that sit under the chrome (the filter drawer) read its height from here */
    const setH = () => document.documentElement.style.setProperty("--chrome-h", (header.offsetHeight + rail.offsetHeight) + "px");
    setH();
    window.addEventListener("resize", setH);
    if (window.ResizeObserver) new ResizeObserver(setH).observe(header);
    const cur = rail.querySelector(".here");
    if (cur && cur.scrollIntoView && rail.scrollWidth > rail.clientWidth) cur.scrollIntoView({ block: "nearest", inline: "center" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
