/* =========================================================================
   main.js — shared UI behavior
   - mobile nav toggle
   - reveal-on-scroll
   - project filtering (driven by themes constellation custom event)
   - publications type filter
   All progressive enhancement: the site is fully usable with JS disabled.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Mobile nav toggle --------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });
    // Close menu when a link is chosen (small screens)
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  /* ---- Reveal on scroll ---------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Project filtering by research theme --------------------------- */
  var gallery = document.getElementById("project-gallery");
  var status = document.getElementById("filter-status");
  var activeTheme = null;

  function applyProjectFilter(theme) {
    if (!gallery) return;
    activeTheme = theme;
    var projects = gallery.querySelectorAll(".project");
    var shown = 0;
    projects.forEach(function (p) {
      var themes = (p.getAttribute("data-themes") || "").split(/\s+/);
      var match = !theme || themes.indexOf(theme) !== -1;
      p.classList.toggle("is-dimmed", !!theme && !match);
      if (match) shown++;
    });
    if (status) {
      if (theme) {
        status.innerHTML =
          "Showing <strong>" + shown + "</strong> projects tagged " +
          '<strong>' + theme.replace(/-/g, " ") + "</strong>.";
        var clear = document.createElement("button");
        clear.type = "button";
        clear.textContent = "Clear filter";
        clear.addEventListener("click", function () {
          applyProjectFilter(null);
          document
            .querySelectorAll('.cz-node[aria-pressed="true"]')
            .forEach(function (n) { n.setAttribute("aria-pressed", "false"); });
          document
            .querySelectorAll(".cz-link.is-active")
            .forEach(function (l) { l.classList.remove("is-active"); });
        });
        status.appendChild(clear);
      } else {
        status.textContent = "Click a theme above to highlight related projects.";
      }
    }
  }

  // Listen for theme selection dispatched by graphics.js
  document.addEventListener("theme:select", function (e) {
    applyProjectFilter(e.detail && e.detail.theme);
  });
  if (status && gallery) {
    status.textContent = "Click a theme above to highlight related projects.";
  }

  /* ---- Publications type filter -------------------------------------- */
  var filterbar = document.getElementById("pub-filterbar");
  var pubList = document.getElementById("pub-list");
  var pubCount = document.getElementById("pub-count");
  if (filterbar && pubList) {
    filterbar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");

      filterbar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      var items = pubList.querySelectorAll(".pub");
      var shown = 0;
      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-type") === filter;
        item.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (pubCount) {
        pubCount.textContent =
          shown + (shown === 1 ? " entry" : " entries") +
          (filter === "all" ? "" : " in this category");
      }
    });
  }
})();
