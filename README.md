# personal site

A small, static personal website. No build step, no dependencies.

## files

- `index.html` — all content lives here
- `style.css` — colours, type, layout
- `engine.js` — the shuttlecock physics, the cats and the hit feel, as a reusable court of any number of cats and shuttlecocks
- `site.js` — wires up the two courts and their tiny controls: the rally in the header, the keep-ups in the about section
- `favicon.svg` — a tiny shuttlecock

## filling it in

Search `index.html` for anything in square brackets, like `[Your Name]` or `[Role] · [Company]`, and replace it with your own words. Delete any section you don't want.

Drop a `resume.pdf` next to `index.html` and the résumé button will work.

## running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## publishing

This repository is a GitHub Pages user site. Once the files are on `main`, the site is live at `https://anandyandawang.github.io`.
