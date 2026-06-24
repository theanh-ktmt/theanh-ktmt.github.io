// Page-specific behaviors for the home page (carousel, honors &
// activities pagination/sort). Shared behaviors — nav, footer, theme,
// mobile menu, scrollspy, reveal — live in /js/site.js.

// ── Projects Carousel ───────────────────────────────────────
let _ci = 0,
  _ct = 0,
  _cTimer = null;

function initCarousel() {
  _ct = document.querySelectorAll(".carousel-slide").length;
  if (!_ct) return;
  // build dots
  const dotsEl = document.getElementById("carousel-dots");
  if (dotsEl) {
    dotsEl.innerHTML = Array.from(
      { length: _ct },
      (_, i) =>
        `<span class="dot${i === 0 ? " active" : ""}" onclick="goToProject(${i})"></span>`,
    ).join("");
  }
  goToProject(0);
  _startAuto();
  const vp = document.querySelector(".carousel-viewport");
  if (vp) {
    vp.addEventListener("mouseenter", _stopAuto);
    vp.addEventListener("mouseleave", _startAuto);
  }
}

function _startAuto() {
  _stopAuto();
  _cTimer = setInterval(() => shiftProject(1), 4500);
}
function _stopAuto() {
  clearInterval(_cTimer);
}

function shiftProject(dir) {
  goToProject((_ci + dir + _ct) % _ct);
}

function goToProject(idx) {
  _ci = idx;
  const t = document.getElementById("carousel-track");
  if (t) t.style.transform = `translateX(-${idx * 100}%)`;
  document
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("active", i === idx));
}

// ── Honors Pagination ───────────────────────────────────────
let _hp = 0;
const _HPP = 4;

function initHonorsPagination() {
  _renderHonors();
}

function _renderHonors() {
  const list = document.getElementById("honors-list");
  if (!list) return;
  const items = [...list.querySelectorAll("li")];
  items.forEach((el, i) => {
    el.style.display = i >= _hp * _HPP && i < (_hp + 1) * _HPP ? "" : "none";
  });
  _renderPager(
    "honors-pagination",
    Math.ceil(items.length / _HPP),
    _hp,
    "setHonorsPage",
  );
}

function setHonorsPage(p) {
  _hp = p;
  _renderHonors();
}

function sortHonors(order) {
  const list = document.getElementById("honors-list");
  if (!list) return;
  [...list.querySelectorAll("li")]
    .sort((a, b) =>
      order === "asc"
        ? (parseInt(a.dataset.year) || 0) - (parseInt(b.dataset.year) || 0)
        : (parseInt(b.dataset.year) || 0) - (parseInt(a.dataset.year) || 0),
    )
    .forEach((el) => list.appendChild(el));
  document
    .querySelectorAll(".sort-btn")
    .forEach((b) => b.classList.remove("active"));
  const btn = document.querySelector(`.sort-btn[data-order="${order}"]`);
  if (btn) btn.classList.add("active");
  _hp = 0;
  _renderHonors();
}

// ── Activities Pagination ───────────────────────────────────
let _ap = 0;
const _APP = 4;

function initActivitiesPagination() {
  _renderActivities();
}

function _renderActivities() {
  const list = document.getElementById("activities-list");
  if (!list) return;
  const items = [...list.querySelectorAll("li")];
  items.forEach((el, i) => {
    el.style.display = i >= _ap * _APP && i < (_ap + 1) * _APP ? "" : "none";
  });
  _renderPager(
    "activities-pagination",
    Math.ceil(items.length / _APP),
    _ap,
    "setActivitiesPage",
  );
}

function setActivitiesPage(p) {
  _ap = p;
  _renderActivities();
}

// ── Generic Pager ───────────────────────────────────────────
function _renderPager(id, total, cur, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  if (total <= 1) {
    el.innerHTML = "";
    return;
  }
  let h = `<button class="page-btn" onclick="${fn}(${cur - 1})" ${cur === 0 ? "disabled" : ""}>&#8592;</button>`;
  for (let i = 0; i < total; i++)
    h += `<button class="page-btn${i === cur ? " active" : ""}" onclick="${fn}(${i})">${i + 1}</button>`;
  h += `<button class="page-btn" onclick="${fn}(${cur + 1})" ${cur === total - 1 ? "disabled" : ""}>&#8594;</button>`;
  el.innerHTML = h;
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initHonorsPagination();
  initActivitiesPagination();
});
