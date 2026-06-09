# Mariam Ismail — Academic Portfolio

A responsive, dependency-free static website for **Mariam Ismail**, Digital Projects
Coordinator at Virginia Tech University Libraries, working in **critical digital
humanities, digital scholarship, and digital preservation**.

Built with plain HTML, CSS, and vanilla JavaScript — no build step, no framework — with
a **Matisse-inspired** (papiers découpés) palette, image-led layouts, and a few
interactive graphics.

## Pages

| File | Section |
| --- | --- |
| `index.html` | Home / About — hero, bio, research interests, highlights, awards |
| `research.html` | Research & Projects — interactive themes constellation, project gallery, grants |
| `publications.html` | Publications, toolkits, works in progress, and selected talks (with type filter) |

## Interactive graphics (vanilla JS, in `js/`)

1. **Animated cut-out hero** (`graphics.js`) — drifting Matisse SVG shapes with pointer
   parallax on the home page.
2. **Themes constellation** (`graphics.js`) — clickable, keyboard-accessible SVG node
   graph on the research page; selecting a theme highlights related projects.
3. **Publications filter** (`main.js`) — filter entries by type; updates a live count.

All three are progressive enhancements: with JavaScript disabled, every project and
publication is still fully visible and readable. Animations are disabled automatically
under `prefers-reduced-motion`.

## Run locally

No build needed. Serve the folder over HTTP (so relative paths resolve):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch.**
3. Choose the branch and the **`/ (root)`** folder, then save.

The repo includes a `.nojekyll` file so files are served verbatim, and all asset paths
are **relative**, so the site works whether served from a user/org page or a project
subpath (e.g. `https://<user>.github.io/agentic-portfolio/`).

## Swapping in real content

- **Images:** replace the placeholder SVGs in `assets/images/` with real photos, keeping
  the same filenames (e.g. `portrait.svg → portrait.jpg`, then update the `src` /
  extension in the HTML). Filenames are semantic, so swaps are 1:1.
- **Text:** all content lives directly in the three HTML files — edit in place.
- **Projects:** each project is an `<article class="project">` with a `data-themes`
  attribute (space-separated theme ids: `critical-dh`, `preservation`,
  `community-memory`, `material-culture`, `multimodal`, `publishing`) used by the
  constellation filter.
- **Publications:** each entry is an `<li class="pub" data-type="…">` where `data-type`
  is one of `article`, `toolkit`, `wip`, or `talk` (drives the filter and the colored
  left border).

## Structure

```
index.html · research.html · publications.html
css/styles.css          # palette tokens + all styling
js/main.js              # nav, reveal-on-scroll, filtering
js/graphics.js          # hero animation + themes constellation
assets/images/          # placeholder SVGs (portrait, project thumbnails, favicon, og)
.nojekyll               # GitHub Pages: serve files as-is
```

> Images currently shown are Matisse-styled placeholders, not photographs.
