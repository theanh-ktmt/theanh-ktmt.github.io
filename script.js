// ── Hamburger Menu ─────────────────────────────────────────
function toggleMenu() {
  document.querySelector(".menu-links").classList.toggle("open");
  document.querySelector(".hamburger-icon").classList.toggle("open");
}

// ── Projects Carousel ───────────────────────────────────────
let _ci = 0, _ct = 0, _cTimer = null;

function initCarousel() {
  _ct = document.querySelectorAll(".carousel-slide").length;
  if (!_ct) return;
  // build dots
  const dotsEl = document.getElementById("carousel-dots");
  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: _ct }, (_, i) =>
      `<span class="dot${i === 0 ? " active" : ""}" onclick="goToProject(${i})"></span>`
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

function _startAuto() { _stopAuto(); _cTimer = setInterval(() => shiftProject(1), 4500); }
function _stopAuto()  { clearInterval(_cTimer); }

function shiftProject(dir) {
  goToProject((_ci + dir + _ct) % _ct);
}

function goToProject(idx) {
  _ci = idx;
  const t = document.getElementById("carousel-track");
  if (t) t.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) =>
    d.classList.toggle("active", i === idx)
  );
}

// ── Honors Pagination ───────────────────────────────────────
let _hp = 0;
const _HPP = 4;

function initHonorsPagination() { _renderHonors(); }

function _renderHonors() {
  const list = document.getElementById("honors-list");
  if (!list) return;
  const items = [...list.querySelectorAll("li")];
  items.forEach((el, i) => {
    el.style.display = (i >= _hp * _HPP && i < (_hp + 1) * _HPP) ? "" : "none";
  });
  _renderPager("honors-pagination", Math.ceil(items.length / _HPP), _hp, "setHonorsPage");
}

function setHonorsPage(p) { _hp = p; _renderHonors(); }

function sortHonors(order) {
  const list = document.getElementById("honors-list");
  if (!list) return;
  [...list.querySelectorAll("li")]
    .sort((a, b) => order === "asc"
      ? (parseInt(a.dataset.year) || 0) - (parseInt(b.dataset.year) || 0)
      : (parseInt(b.dataset.year) || 0) - (parseInt(a.dataset.year) || 0)
    )
    .forEach(el => list.appendChild(el));
  document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.sort-btn[data-order="${order}"]`);
  if (btn) btn.classList.add("active");
  _hp = 0;
  _renderHonors();
}

// ── Activities Pagination ───────────────────────────────────
let _ap = 0;
const _APP = 4;

function initActivitiesPagination() { _renderActivities(); }

function _renderActivities() {
  const list = document.getElementById("activities-list");
  if (!list) return;
  const items = [...list.querySelectorAll("li")];
  items.forEach((el, i) => {
    el.style.display = (i >= _ap * _APP && i < (_ap + 1) * _APP) ? "" : "none";
  });
  _renderPager("activities-pagination", Math.ceil(items.length / _APP), _ap, "setActivitiesPage");
}

function setActivitiesPage(p) { _ap = p; _renderActivities(); }

// ── Generic Pager ───────────────────────────────────────────
function _renderPager(id, total, cur, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  if (total <= 1) { el.innerHTML = ""; return; }
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

// ── Scroll-Snap Navigation ────────────────────────────────────
(function () {
  var SECTIONS = ['profile', 'about', 'projects', 'publications', 'honors', 'activities', 'contact'];
  var locked = false;

  function isDesktop() { return window.innerWidth > 1200; }

  function currentIdx() {
    var best = 0, bestDist = Infinity;
    SECTIONS.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var dist = Math.abs(el.getBoundingClientRect().top);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  function snapTo(idx) {
    idx = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    var el = document.getElementById(SECTIONS[idx]);
    if (!el) return;
    locked = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { locked = false; }, 900);
  }

  window.addEventListener('wheel', function (e) {
    if (!isDesktop() || locked) return;
    e.preventDefault();
    snapTo(currentIdx() + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  var _touchY = 0;
  window.addEventListener('touchstart', function (e) {
    _touchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (!isDesktop() || locked) return;
    var diff = _touchY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 40) return;
    snapTo(currentIdx() + (diff > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if (!isDesktop() || locked) return;
    var idx = currentIdx();
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); snapTo(idx + 1); }
    else if (e.key === 'ArrowUp'  || e.key === 'PageUp')  { e.preventDefault(); snapTo(idx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); snapTo(0); }
    else if (e.key === 'End')  { e.preventDefault(); snapTo(SECTIONS.length - 1); }
  });
}());