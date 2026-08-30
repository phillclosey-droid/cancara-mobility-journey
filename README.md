# Lloyds Cancara — Multiple Cars journey

A mobile prototype journey built with Claude Design on the Cancara design system:
onboarding multiple cars with tab navigation.

It is a fully client-side static site — the pages (`*.dc.html`) render in the
browser via `support.js` (the Claude Design runtime, which loads React from a
CDN at runtime). No build step and no server code are required.

## View it

Open the site root and it forwards to the start page (`index.dc.html`).

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ on the same machine (or your phone using the
Mac's LAN IP, e.g. http://192.168.x.x:8000/).

## Hosting notes

- `.nojekyll` is present so GitHub Pages serves the `_ds/` design-system folder
  as-is (Jekyll would otherwise ignore folders that start with `_`).
- `index.html` at the root forwards to `index.dc.html`.
