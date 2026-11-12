# Sharing Archivus

## ⭐ IT IS LIVE
**https://3go-47.github.io/archivus/**
Repo: https://github.com/3GO-47/archivus (branch main, Pages from root).
Deep links work: /codex.html#e=writing · /astrolabe.html · /mobile/codex.html
To update the site: commit changes to main (or ask Claude to re-upload changed files).

**Live version: v9.0** — deployed 2026-11-11 (War Room, instrument rail and the Doctrines went up together, in four commits: data, engines and styles, pocket builds, pages). The live repository matches this folder byte for byte except `tools/` and `research/`, which are not published.

How it was deployed: uploaded through github.com (`/upload/main/<folder>`), folders first and the root pages last, so no page ever pointed at a script that was not there yet. After any edit, run `node tools/build-mobile.js --zip` first so `mobile/` and `exports/archivus-site.zip` match the sources, then upload the changed files the same way. GitHub Pages caches files for ten minutes — hard-refresh (Ctrl+F5) to see a change at once.

Deep links: `/doctrines.html#v=compass&i=maoism` · `/doctrines.html#v=red&c=menshevism,leninism,trotskyism,maoism` · `/doctrines.html#v=atlas&m=red&y=1980` · `/wars.html#w=ww2` · `/wars.html#w=ww1&v=leaders` · `/wars.html#w=ww2&i=stalingrad1942`.


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
