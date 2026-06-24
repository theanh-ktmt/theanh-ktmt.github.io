// ── Shared site behaviors (theme, menu, scrollspy, reveal, etc.) ──
// Imported once from BaseLayout; runs on every page. Nav/footer are
// rendered server-side by Astro components, so no include-loader needed.
(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ── Giscus comments config ────────────────────────────────
  var GISCUS = {
    repo: "theanh-ktmt/theanh-ktmt.github.io",
    repoId: "R_kgDOQ4anxA",
    category: "Announcements",
    categoryId: "DIC_kwDOQ4anxM4C_zuD",
  };

  // ── Theme (dark / light) ──────────────────────────────────
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
    document
      .querySelectorAll("#theme-toggle, #theme-toggle-mobile")
      .forEach(function (b) {
        b.setAttribute("aria-pressed", String(t === "dark"));
      });
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: t } }),
    );
  }
  function initTheme() {
    document
      .querySelectorAll("#theme-toggle, #theme-toggle-mobile")
      .forEach(function (b) {
        b.setAttribute("aria-pressed", String(currentTheme() === "dark"));
        b.addEventListener("click", function () {
          applyTheme(currentTheme() === "dark" ? "light" : "dark");
        });
      });
  }

  // ── Mobile (hamburger) menu ────────────────────────────────
  function initHamburger() {
    var icon = document.querySelector(".hamburger-icon");
    var menu = document.querySelector(".menu-links");
    if (!icon || !menu) return;
    function setOpen(open) {
      menu.classList.toggle("open", open);
      icon.classList.toggle("open", open);
      icon.setAttribute("aria-expanded", String(open));
      icon.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    icon.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  // ── Scrollspy (home page section nav) ──────────────────────
  function initScrollspy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('#desktop-nav .nav-links a[href*="/#"]'),
    );
    var map = {};
    links.forEach(function (a) {
      var hash = a.getAttribute("href").split("#")[1];
      if (hash && document.getElementById(hash)) map[hash] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length || !("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("nav-active");
            });
            if (map[en.target.id]) map[en.target.id].classList.add("nav-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach(function (id) {
      obs.observe(document.getElementById(id));
    });
  }

  // ── Scroll reveal ──────────────────────────────────────────
  function initReveal() {
    if (prefersReduced || !("IntersectionObserver" in window)) return;
    var SEL = [
      "#about .details-container",
      ".skills-marquee-section",
      "#projects .color-container",
      ".publication-item",
      "#honors .honors-list > li",
      "#activities .honors-list > li",
      ".contact-info-upper-container",
      ".blog-card",
      ".blog-post-content > h2",
      ".blog-post-content > .blog-figure",
      ".blog-post-content > .blog-table-wrap",
      ".blog-post-content > pre",
    ].join(",");
    var els = Array.prototype.slice.call(document.querySelectorAll(SEL));
    if (!els.length) return;
    var seen = new Map();
    els.forEach(function (el) {
      el.classList.add("reveal");
      var p = el.parentNode;
      var n = seen.get(p) || 0;
      if (n) el.style.transitionDelay = Math.min(n * 70, 350) + "ms";
      seen.set(p, n + 1);
    });
    var obs = new IntersectionObserver(
      function (entries, o) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("reveal-in");
            o.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  // ── Reading progress bar (blog posts) ──────────────────────
  function initReadingProgress() {
    var article = document.querySelector(".blog-post-content");
    if (!article) return;
    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      bar.style.transform = "scaleX(" + (total > 0 ? scrolled / total : 0) + ")";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }

  // ── Back to top ────────────────────────────────────────────
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "&#8593;";
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
    function toggle() {
      btn.classList.toggle("show", window.scrollY > 600);
    }
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  // ── Copy post link ─────────────────────────────────────────
  function showToast() {
    var toast = document.getElementById("copy-toast");
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }
  function fallbackCopy(text) {
    var el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      showToast();
    } catch (e) {}
    document.body.removeChild(el);
  }
  function initCopy() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(showToast, function () {
            fallbackCopy(url);
          });
        } else {
          fallbackCopy(url);
        }
      });
    });
  }

  // ── Comments (giscus) ──────────────────────────────────────
  function giscusTheme() {
    return currentTheme() === "dark" ? "dark_dimmed" : "light";
  }
  function initComments() {
    var mount = document.getElementById("giscus-container");
    if (!mount) return;
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    var attrs = {
      "data-repo": GISCUS.repo,
      "data-repo-id": GISCUS.repoId,
      "data-category": GISCUS.category,
      "data-category-id": GISCUS.categoryId,
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": giscusTheme(),
      "data-lang": "en",
      "data-loading": "lazy",
    };
    Object.keys(attrs).forEach(function (k) {
      s.setAttribute(k, attrs[k]);
    });
    s.crossOrigin = "anonymous";
    s.async = true;
    mount.appendChild(s);
  }
  document.addEventListener("themechange", function () {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme() } } },
      "https://giscus.app",
    );
  });

  // ── Boot ───────────────────────────────────────────────────
  function boot() {
    initTheme();
    initHamburger();
    initScrollspy();
    initReveal();
    initReadingProgress();
    initBackToTop();
    initCopy();
    initComments();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
