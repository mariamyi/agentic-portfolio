/* =========================================================================
   graphics.js — interactive SVG graphics (no libraries)
   1. Animated Matisse cut-out hero background with pointer parallax
   2. Research-themes constellation (clickable, keyboard-accessible)
   Honors prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* --------------------------------------------------------------------- */
  /* 1. Animated cut-out hero background                                   */
  /* --------------------------------------------------------------------- */
  function buildHero(svg) {
    var palette = ["#e94f37", "#1357a6", "#f4b41a", "#2a9d5c", "#e06c9f"];
    // Organic Matisse-ish blobs/leaves defined as path data (viewBox 0..100)
    var shapes = [
      "M50 8 C70 8 86 26 84 48 C82 70 64 88 44 86 C22 84 10 64 16 42 C22 22 32 8 50 8 Z",
      "M20 50 C20 26 40 12 58 20 C74 27 78 48 70 64 C62 80 40 86 28 74 C18 64 20 60 20 50 Z",
      "M50 10 C58 30 80 34 80 50 C80 66 58 70 50 90 C42 70 20 66 20 50 C20 34 42 30 50 10 Z"
    ];
    var layers = [];
    var count = 9;

    for (var i = 0; i < count; i++) {
      var g = document.createElementNS(SVGNS, "g");
      var path = document.createElementNS(SVGNS, "path");
      path.setAttribute("d", shapes[i % shapes.length]);
      path.setAttribute("fill", palette[i % palette.length]);
      var scale = 0.25 + Math.random() * 0.7;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var rot = Math.random() * 360;
      g.setAttribute(
        "transform",
        "translate(" + x + " " + y + ") rotate(" + rot + ") scale(" + scale + ") translate(-50 -50)"
      );
      g.setAttribute("opacity", String(0.22 + Math.random() * 0.4));
      g.appendChild(path);
      svg.appendChild(g);
      layers.push({
        g: g, x: x, y: y, rot: rot, scale: scale,
        depth: 0.4 + Math.random() * 1.6,                 // parallax factor
        driftX: (Math.random() - 0.5) * 0.012,
        driftY: (Math.random() - 0.5) * 0.012,
        spin: (Math.random() - 0.5) * 0.06
      });
    }

    var pointer = { x: 0, y: 0 };
    var hero = svg.closest(".hero") || svg.parentElement;
    if (!reduceMotion && hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        pointer.x = (e.clientX - r.left) / r.width - 0.5;
        pointer.y = (e.clientY - r.top) / r.height - 0.5;
      });
      hero.addEventListener("pointerleave", function () {
        pointer.x = 0; pointer.y = 0;
      });
    }

    var t = 0;
    function frame() {
      t += 1;
      layers.forEach(function (L) {
        L.x = (L.x + L.driftX + 100) % 100;
        L.y = (L.y + L.driftY + 100) % 100;
        L.rot += L.spin;
        var px = pointer.x * L.depth * 8;
        var py = pointer.y * L.depth * 8;
        L.g.setAttribute(
          "transform",
          "translate(" + (L.x + px) + " " + (L.y + py) + ") rotate(" +
            L.rot + ") scale(" + L.scale + ") translate(-50 -50)"
        );
      });
      raf = requestAnimationFrame(frame);
    }

    var raf;
    if (reduceMotion) {
      // Static composition — draw once, no animation.
      return;
    }
    raf = requestAnimationFrame(frame);

    // Pause when offscreen / tab hidden to save battery.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(frame); }
    });
  }

  /* --------------------------------------------------------------------- */
  /* 2. Research-themes constellation                                      */
  /* --------------------------------------------------------------------- */
  function buildConstellation(svg) {
    var W = 760, H = 460;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Research themes — select a theme to highlight related projects");

    var themes = [
      { id: "critical-dh",    label: "Critical DH",            color: "#e94f37", x: 380, y: 90 },
      { id: "preservation",   label: "Digital Preservation",   color: "#1357a6", x: 140, y: 180 },
      { id: "community-memory", label: "Community Memory",     color: "#2a9d5c", x: 250, y: 360 },
      { id: "material-culture", label: "Material Culture",     color: "#e06c9f", x: 520, y: 360 },
      { id: "multimodal",     label: "Multimodal DH",          color: "#f4b41a", x: 620, y: 180 },
      { id: "publishing",     label: "Library Publishing",     color: "#0e4585", x: 380, y: 230 }
    ];
    // edges (by index) — "publishing" (5) is the hub
    var edges = [
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 4],
      [0, 1], [0, 4], [1, 2], [3, 4], [2, 3]
    ];

    var linkEls = [];
    edges.forEach(function (e) {
      var a = themes[e[0]], b = themes[e[1]];
      var line = document.createElementNS(SVGNS, "line");
      line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
      line.setAttribute("class", "cz-link");
      line.dataset.a = e[0]; line.dataset.b = e[1];
      svg.appendChild(line);
      linkEls.push(line);
    });

    function highlightLinks(index) {
      linkEls.forEach(function (l) {
        var on = index != null &&
          (Number(l.dataset.a) === index || Number(l.dataset.b) === index);
        l.classList.toggle("is-active", on);
      });
    }

    function selectTheme(node, index, theme) {
      var alreadyOn = node.getAttribute("aria-pressed") === "true";
      // reset all
      svg.querySelectorAll('.cz-node[aria-pressed="true"]').forEach(function (n) {
        n.setAttribute("aria-pressed", "false");
      });
      if (alreadyOn) {
        highlightLinks(null);
        document.dispatchEvent(new CustomEvent("theme:select", { detail: { theme: null } }));
        return;
      }
      node.setAttribute("aria-pressed", "true");
      highlightLinks(index);
      document.dispatchEvent(
        new CustomEvent("theme:select", { detail: { theme: theme.id } })
      );
    }

    themes.forEach(function (theme, index) {
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "cz-node");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-pressed", "false");
      g.setAttribute("aria-label", "Highlight projects in " + theme.label);

      var hit = document.createElementNS(SVGNS, "circle");
      hit.setAttribute("class", "cz-node-hit");
      hit.setAttribute("cx", theme.x); hit.setAttribute("cy", theme.y);
      hit.setAttribute("r", 46);
      hit.setAttribute("fill", "transparent");

      var dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("class", "cz-node-dot");
      dot.setAttribute("cx", theme.x); dot.setAttribute("cy", theme.y);
      dot.setAttribute("r", 20);
      dot.setAttribute("fill", theme.color);

      var label = document.createElementNS(SVGNS, "text");
      label.setAttribute("class", "cz-node-label");
      label.setAttribute("x", theme.x);
      label.setAttribute("y", theme.y + 38);
      label.setAttribute("text-anchor", "middle");
      label.textContent = theme.label;

      g.appendChild(hit);
      g.appendChild(dot);
      g.appendChild(label);
      svg.appendChild(g);

      g.addEventListener("click", function () { selectTheme(g, index, theme); });
      g.addEventListener("mouseenter", function () {
        if (g.getAttribute("aria-pressed") !== "true") highlightLinks(index);
      });
      g.addEventListener("mouseleave", function () {
        var pressed = svg.querySelector('.cz-node[aria-pressed="true"]');
        highlightLinks(pressed ? Number(pressed.dataset.index) : null);
      });
      g.dataset.index = index;
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectTheme(g, index, theme);
        }
      });
    });
  }

  /* ---- Boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var hero = document.getElementById("hero-bg");
    if (hero) buildHero(hero);
    var cz = document.getElementById("constellation");
    if (cz) buildConstellation(cz);
  });
})();
