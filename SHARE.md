# Sharing Archivus

## ⭐ IT IS LIVE
**https://3go-47.github.io/archivus/**
Repo: https://github.com/3GO-47/archivus (branch main, Pages from root).
Deep links work: /codex.html#e=writing · /astrolabe.html · /mobile/codex.html
To update the site: commit changes to main (or ask Claude to re-upload changed files).

**Live version: v19.1** — deployed 2026-11-27. Two more instruments under War: Total War (every war on one string, by its dead, by century; twelve tolls checked against a second source) and World War III (a projection, every line graded and sourced). The War Room's campaigns have a rail of the phases.

**Before that: v18.1** — deployed 2026-11-25 (v18.0 in four commits, then v18.1 the same day: every 2026 election now has its result, and the sanctions lens shows EU and UN regimes in full). A fourteenth instrument, the Situation (the present on one map, under War); the Conflicts reworked around its map; the three Myth instruments linked to each other.

**Before that: v17.0** — deployed 2026-11-25 in four commits. The Oracle's Reading is now statements beside their evidence, and every deduction says which facts and charts it rests on. The Coups' two studies open on a map of the red and green seizures. Also in this release (v16.3): the Archive's bar regrouped, Climate the last lane, the War Room's layer switches beside its theatres on wide screens.

**Before that: v16.2** — deployed 2026-11-25. Everything v16.0 took out of plain sight is back, reorganised: the Wheel is in the Archive's switch again; every tab is in its strip again, with related views grouped beside their parent; the War Room's blurb is back; the guide panels fold to a labelled strip instead of disappearing. Header menus wait a moment before opening on hover. No data file changed.

**Earlier: v16.0** — deployed 2026-11-25 (UTC). The trim: five doors in the header (Oracle, Record, Power, War, Myth) instead of thirteen links; tabs folded so 40 views are reached from 30 places; the right-hand guide panels shut until asked for. Nothing was deleted and every old link still works. No data file changed.

**Earlier: v15.0** — deployed 2026-11-24 in three commits (styles and header, pocket builds, docs). The illumination: every instrument drawn to the Oracle's standard by one shared layer. No data file and no engine changed.

**Earlier: v14.1** — deployed 2026-11-24 in four commits (data, engines and styles, pocket builds, pages). New since v12: the Oracle, a thirteenth instrument (`oracle.html`) — what the whole record points to; the Conflicts, a twelfth (`conflicts.html`); the United States view extended back to 1607; and every Realms view extended to the first year of the record (1789).

**Earlier: v12.0** — deployed 2026-11-13 in three commits (engines and styles, pocket builds, pages): three colourways (Blue, Black, White) with a switch in the header, and a contrast pass over every page. No data file changed. The live repository matches this folder byte for byte except `tools/`, `research/` and `exports/`, which are not published.

**Earlier: v11.0** — deployed 2026-11-13, together with v10 (the single header and search-everything), in four commits: data, engines and styles, pocket builds, pages. The live repository matches this folder byte for byte except `tools/`, `research/` and `exports/`, which are not published. New on the site: the Realms (`/realms.html`), the Coups (`/coups.html`), the Archive's density-stretched time axis and docked "In view" panel, and section chips on long views.

**Earlier: v9.0** — deployed 2026-11-11 (War Room, instrument rail and the Doctrines went up together, in four commits: data, engines and styles, pocket builds, pages).

How it was deployed: uploaded through github.com (`/upload/main/<folder>`), folders first and the root pages last, so no page ever pointed at a script that was not there yet. After any edit, run `node tools/build-mobile.js --zip` first so `mobile/` and `exports/archivus-site.zip` match the sources, then upload the changed files the same way. GitHub Pages caches files for ten minutes — hard-refresh (Ctrl+F5) to see a change at once.

Deep links: `/realms.html#v=usa&s=read` · `/realms.html#v=map&m=row&y=1975` · `/coups.html#v=roll&i=prague` · `/coups.html#v=green&s=before` · `/doctrines.html#v=compass&i=maoism` · `/doctrines.html#v=red&c=menshevism,leninism,trotskyism,maoism` · `/doctrines.html#v=atlas&m=red&y=1980` · `/wars.html#w=ww2` · `/wars.html#w=ww1&v=leaders` · `/wars.html#w=ww2&i=stalingrad1942`.


## Fastest: send one file
Every file in `mobile/` is completely self-contained — data, styles and code inlined.
Text, AirDrop, or email any one of them (e.g. `mobile/codex.html` or `mobile/wars.html`, about half a megabyte each) and the
recipient opens it in any browser or file app. No folder, no server, no setup.

## A real link (free, ~1 minute, no code)
`exports/archivus-site.zip` is a deploy-ready copy of the whole site. Drag it onto
any of these and you get a public URL:

1. **Netlify Drop** — https://app.netlify.com/drop → drag the zip → instant
   `something.netlify.app` link (free account).
2. **tiiny.host** — https://tiiny.host → upload the zip → instant link
   (free tier; also accepts a single mobile/*.html with no account).
3. **GitHub Pages** — new repo → upload the zip's contents → Settings → Pages →
   deploy from main. Gives `username.github.io/archivus`.

The site is 100% static (no backend, no build step), so any static host works.
Deep links survive hosting: `…/codex.html#e=writing`, `…/index.html#e=apollo11&v=atlas`.

## From this desk
Connect the GitHub connector in Claude and I can push the repo and switch on
Pages for you next session.
