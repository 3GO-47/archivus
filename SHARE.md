# Sharing Archivus

## Fastest: send one file
Every file in `mobile/` is completely self-contained — data, styles and code inlined.
Text, AirDrop, or email any one of them (e.g. `mobile/codex.html`, 334 KB) and the
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
