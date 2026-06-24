// ── Blog listing: search / sort / pagination ────────────────
// Classic (non-module) script so the inline onclick handlers in the
// generated pager resolve to these globals.
var _blogPage = 0;
var _blogSort = "newest";
var BLOG_PPP = 5;

function setBlogSort(sort) {
  _blogSort = sort;
  _blogPage = 0;
  document.querySelectorAll(".blog-sort-wrap .sort-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.sort === sort);
  });
  renderBlog();
}

function setBlogPage(p) {
  _blogPage = p;
  renderBlog();
  document
    .getElementById("blog-list")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderBlog() {
  var q = (document.getElementById("blog-search").value || "")
    .toLowerCase()
    .trim();
  var cards = Array.from(document.querySelectorAll("#blog-grid .blog-card"));

  var filtered = cards.filter(function (card) {
    if (!q) return true;
    var haystack = [
      card.dataset.title || "",
      card.dataset.tags || "",
      (card.querySelector(".blog-card-excerpt") || {}).textContent || "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  filtered.sort(function (a, b) {
    if (_blogSort === "newest")
      return new Date(b.dataset.date) - new Date(a.dataset.date);
    if (_blogSort === "oldest")
      return new Date(a.dataset.date) - new Date(b.dataset.date);
    return (a.dataset.title || "").localeCompare(b.dataset.title || "");
  });

  var total = filtered.length;
  var totalPages = Math.max(1, Math.ceil(total / BLOG_PPP));
  _blogPage = Math.min(_blogPage, totalPages - 1);
  var start = _blogPage * BLOG_PPP;
  var visible = filtered.slice(start, start + BLOG_PPP);

  var grid = document.getElementById("blog-grid");
  filtered.forEach(function (card) {
    grid.appendChild(card);
  });
  cards.forEach(function (card) {
    card.style.display = visible.indexOf(card) !== -1 ? "" : "none";
  });

  document.getElementById("blog-no-results").style.display =
    total === 0 ? "" : "none";
  _renderBlogPager(totalPages);
}

function _renderBlogPager(total) {
  var el = document.getElementById("blog-pagination");
  var cur = _blogPage;
  if (!el) return;
  if (total <= 1) {
    el.innerHTML = "";
    return;
  }
  var h =
    '<button class="page-btn" onclick="setBlogPage(' +
    (cur - 1) +
    ')"' +
    (cur === 0 ? " disabled" : "") +
    ">&#8592;</button>";
  for (var i = 0; i < total; i++) {
    h +=
      '<button class="page-btn' +
      (i === cur ? " active" : "") +
      '" onclick="setBlogPage(' +
      i +
      ')">' +
      (i + 1) +
      "</button>";
  }
  h +=
    '<button class="page-btn" onclick="setBlogPage(' +
    (cur + 1) +
    ')"' +
    (cur === total - 1 ? " disabled" : "") +
    ">&#8594;</button>";
  el.innerHTML = h;
}

document.addEventListener("DOMContentLoaded", function () {
  var search = document.getElementById("blog-search");
  if (search)
    search.addEventListener("input", function () {
      _blogPage = 0;
      renderBlog();
    });
  renderBlog();
});
