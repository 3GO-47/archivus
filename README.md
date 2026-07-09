# A R C H I V U S
*An oracle of all recorded history.*

Archivus is a local, self-contained instrument for exploring the whole arc of human history — four linked instruments over one hand-curated, fully-sourced archive:

| Instrument | File | What it holds |
|---|---|---|
| **The Archive** — Chronicle · Atlas · Codex Wheel | `index.html` | 481 historical events (480 with coordinates), 779 relation threads, 14 eras, 10 themes, 11 regions |
| **The Transmissions** | `transmissions.html` | 37 claims from esoteric & occult literature that knowledge was *taught* — Azazel's metallurgy to Parsons' rocketry — each paired against the documented record |
| **The Bloodline** | `lineage.html` | 558 figures across ~80 generations — the Mesopotamian pantheon through the Table of Nations to Jesus, Muhammad and the living successions of every faith, now with all seven divine pantheons grafted into the mythic stratum (`lineage3.js`): 28 cross-tradition bridges (shared PIE origin / documented syncretism / parallel archetype) tie Ugarit, the Ennead, Olympus, Asgard, the Vedic sky and Mexica heaven back to the Apsu–Tiamat root, each god carrying domains and first-attestation dates |
| **The Pantheons** | `pantheons.html` | 97 gods in seven divine family trees (Mesopotamian, Canaanite, Egyptian, Greek, Norse, Vedic, Aztec), 20 domain sigils, 26 typed cross-religion arcs, and ⛩ worship horizons — earliest cult evidence vs earliest text |
| **The Astrolabe** | `astrolabe.html` | A transit instrument: all 548 events as fixed stars on a log-time plate in true Keplerian differential rotation (ω ∝ r^−3/2) about the golden NOW core — and the 40 anticipated events as ghost-stars *inside* the event horizon. Constellation names and the Great Year's ages engraved into the brass; the Transmissions as comets; the Bloodline as one golden thread; drag to spin with real angular momentum; zoom locks the shear, disperses crowds, resolves names |

The archive runs to 548 records across 11 themes and 15 eras, ending in **The Horizon — Anticipated** (2026–2140). Anticipated events are not a separate theme: they live in their real categories (a fusion plant is Science, a sea-level projection is Climate) and wear a dashed spectral-white ring in every view — `event.future` is a flag, filterable via the Horizon era. Each carries its epistemic grade: orbital mechanics is certain (Apophis 2029, Halley 2061, Venus 2117), schedules slip (Artemis, Mars), projections carry ranges (IPCC, UN), and claims (the Singularity) are recorded as claims, filed beside the prophecies they descend from. Every future record is wired to its historical ancestors — Fusion back to the Manhattan Project, AMR back to Fleming, the urban century back to Uruk.

| **The Codex** | `codex.html` | The whole archive as an open book: all 548 records in chronological order on parchment spreads, era chapter headings, a winding gilt river of time down every margin, and causation threads (⟵ what it grew from / ⟶ what grew from it) that flip the book when clicked. Era/theme/region filters re-bind the book live (threads escape a filter gracefully); search, table of contents, folio navigation, swipe to turn, deep links |

**Sharing:** see `SHARE.md` — any single `mobile/*.html` file can be sent directly; `exports/archivus-site.zip` is a deploy-ready static site (Netlify Drop / tiiny.host / GitHub Pages give an instant public URL).

**On a phone or tablet:** the `mobile/` folder holds a self-contained single-file build of every instrument — all data, styles and code inlined — so each file works alone in any viewer (Documents by Readdle, Files, a mail attachment). Copy the whole `mobile/` folder across and the cross-links between instruments work too. The main folder's pages require the full directory structure and are best served or opened from the folder itself.

**How to learn from it:** open the Codex and simply read — or press **T** in the Archive for the eight narrative tours — including *The Gods' Roads* (how pantheons travel, Lion-Man to the Florentine Codex), *The Forecast* (the four grades of tomorrow, taught by example) and *The Long Engines* (fire, plague, crowd, mind and sky followed straight through NOW and out the other side). Click any era band and step through time with ← →; consult the Oracle (**O**) on any window; every record deep-links across all six instruments. All of it is touch-ready — pinch to zoom on a phone.

The instruments cross-reference each other: event records cite the Transmissions that touch them; Transmissions and Bloodline entries deep-link back into the Chronicle; the Oracle reports the codex's claims on any time window. The Bloodline is also published as the persisted artifact **`archivus-bloodline`**.

## Run it

No build, no server, no dependencies. **Open `index.html` in any modern browser.** All data ships as plain script files so everything works from `file://`; fonts load from Google when online and degrade gracefully offline.

## The keys

Press **`?`** in the app for this card.

| Key | Action |
|---|---|
| `1` `2` `3` | Chronicle · Atlas · Wheel |
| `Space` | **Play the Atlas** (a 90s sweep — civilization ignites across the map, with a narrated feed and era banners) / **Spin the Wheel** (a golden hand sweeps your window, lighting events as it passes) |
| `T` | **Narrative tours** — the oracle flies you along a thread, one flight at a time (The Written Word, The Long Plague, The Bomb's Ancestry, The Empire Relay, How Knowledge Travels) |
| `O` | **Consult the Oracle** — a live synthesis of the current window: eras, theme balance, powers active, what begins, what ends, what runs beneath, and the Transmissions' claims upon it |
| `F` | Filters drawer (themes, eras, regions, lanes, legend) |
| `/` + `Enter` | Search; Enter flies to the strongest match |
| `+ −` `← →` | Zoom · pan (time runs **log-scaled**, anchored at the present) |
| `Esc` | Stop / close / deselect |

Mouse: scroll = zoom (about the cursor; in the Wheel, about the pointer's angle; in the Atlas, geographic zoom to 16×) · drag = pan · click = inspect · era band = enter that era · overview brush = scrub · double-click map = reset. Every view and selection is a shareable URL (`#t0=-500&t1=1500&e=printing&v=chronicle`); ⤓ exports the current view as PNG.

## The design

Dark observatory: obsidian, brass, parchment. Physics-driven interaction — eased flights in log-time, inertial coasting, rAF-throttled rendering. Selected events become atoms with counter-orbiting electrons; importance-9+ events emit shockwave halos; relation threads carry flowing energy; approximate dates are dashed, contested datings render as faded uncertainty bands, and the BCE/CE meridian stands as a golden spoke in every view.

## Data & schema

All data lives in `src/data/` as window-global script files (no fetch, so `file://` works):

- `events*.js` — the archive. Each event: `id, title, startYear` (negative = BCE), `endYear|null, approximate, era, region, civ, theme, importance (1–10), desc, source, related[]`. Coordinates in `geo.js` (`id → [lat, lon]`), scholarly dating ranges in `uncertainty.js` (`id → [min, max]`).
- `eras.js` / `themes.js` — 14 era bands; 10 themes + 11 regions (the glow palette).
- `transmissions.js` — the codex: category (angelic/divine/daimonic/alchemical/oneiric), transmitter, what was taught, claim source & date, the documented record (innovation, first attestation, first principles), gap, epistemic note, links.
- `lineage2.js` — the Bloodline: nodes (board designations verbatim, houses, notes), edges (solid = descent, `1`-flagged = marriage/union, `gap` = unnumbered generations), plus owner-editable `unionExtra`/`unionNot` overrides.
- `tours.js` — narrative tours: arrays of event ids + one line of narration each. Add your own.

**To add an event:** append to `events4.js` following the schema, add its coordinate to the same file's pattern (`at: [lat, lon]`), reload. Sourcing standards and the research trail live in `research/`.

## Epistemics

Three registers, never blurred: **the record** (dated, sourced — Wikipedia orientation links, flagged for cross-checking in `research/sources.md`), **the claim** (the board's designations, the codex's transmissions — preserved verbatim, attributed), and **legend** (dashed, labeled — the Grail thread, the mythic strata). Contested dates carry visible uncertainty bands; interpolated chronologies say so. *The archive takes no position on daimons. It takes positions on dates.*

## Provenance

Built from the owner's research: the History.xlsx chronology (242 rows, merged and cross-referenced), the Miro genealogy board (extracted node-for-node via connector, 373 positions + mind-map links), the Book of Enoch's Watchers material, and the Parsons corpus. World map: Natural Earth 110m (public domain), antimeridian-corrected, baked into `assets/world.js`.

## File structure

```
archivus/
├── index.html            the Archive (Chronicle · Atlas · Wheel)
├── transmissions.html    the Transmissions codex
├── lineage.html          the Bloodline
├── assets/world.js       baked land + borders
├── src/
│   ├── core.js           Archive engine (views, physics, oracle, play, tours)
│   ├── lineage-app.js    Bloodline renderer (tidy layout, chronology, minimap)
│   ├── styles.css        the observatory theme
│   └── data/             all datasets (see schema above)
└── research/             sources, notes, provenance, expansion plans
```

## Version history

Development notes for every stage (v0.1 seed → v2.0 perfection pass) are preserved in `research/notes.md` and the sections below this line in earlier revisions of this file — see git/file history. Current state: **v2.0** — all roadmap items built, all instruments cross-linked, all datasets validated.
