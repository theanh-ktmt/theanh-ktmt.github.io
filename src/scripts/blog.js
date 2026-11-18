const archive = document.querySelector("[data-archive]");
if (archive) {
  const search = document.querySelector("#blog-search");
  const sort = document.querySelector("#blog-sort");
  const results = document.querySelector("#blog-results");
  const template = document.querySelector("#all-posts");
  const posts = [...template.content.querySelectorAll("[data-post]")];
  const size = Number(archive.dataset.size);
  let tag = "";
  function render(reset = false) {
    const params = new URLSearchParams(location.search);
    if (!reset) {
      search.value = params.get("q") || "";
      sort.value = ["newest", "oldest", "title"].includes(params.get("sort"))
        ? params.get("sort")
        : "newest";
      tag = params.get("tag") || "";
    }
    const q = search.value.trim().toLocaleLowerCase();
    const filtered = posts.filter(
      (p) =>
        (!tag || JSON.parse(p.dataset.tags).includes(tag)) &&
        [p.dataset.title, p.dataset.description, p.dataset.tags]
          .join(" ")
          .toLocaleLowerCase()
          .includes(q),
    );
    filtered.sort((a, b) =>
      sort.value === "title"
        ? a.dataset.title.localeCompare(b.dataset.title)
        : (Date.parse(a.dataset.date) - Date.parse(b.dataset.date)) *
          (sort.value === "oldest" ? 1 : -1),
    );
    const total = Math.max(1, Math.ceil(filtered.length / size));
    let page = reset
      ? 1
      : Math.min(
          total,
          Math.max(
            1,
            Number(params.get("page")) ||
              (q || tag || sort.value !== "newest"
                ? 1
                : Number(archive.dataset.page)),
          ),
        );
    results.replaceChildren(
      ...filtered
        .slice((page - 1) * size, page * size)
        .map((p) => p.cloneNode(true)),
    );
    document.querySelector("#blog-empty").hidden = filtered.length !== 0;
    document.querySelector("#results-status").textContent =
      filtered.length + " posts · page " + page + " of " + total;
    document
      .querySelectorAll("[data-tag]")
      .forEach((a) =>
        a.setAttribute("aria-current", String(a.dataset.tag === tag)),
      );
    const current = new URLSearchParams();
    if (q) current.set("q", search.value.trim());
    if (tag) current.set("tag", tag);
    if (sort.value !== "newest") current.set("sort", sort.value);
    const filtering = !!current.size;
    const urlFor = (n) => {
      if (!filtering)
        return n === 1 ? "/blogs.html" : "/blogs/page/" + n + ".html";
      const p = new URLSearchParams(current);
      if (n > 1) p.set("page", String(n));
      return "/blogs.html?" + p;
    };
    const pager = document.querySelector("#blog-pagination");
    pager.replaceChildren();
    function link(n, label, rel) {
      const a = document.createElement("a");
      a.href = urlFor(n);
      a.textContent = label;
      if (n === page && !rel) a.setAttribute("aria-current", "page");
      if (rel) a.rel = rel;
      pager.append(a);
    }
    if (page > 1) link(page - 1, "← Previous", "prev");
    if (total > 1) for (let n = 1; n <= total; n++) link(n, String(n));
    if (page < total) link(page + 1, "Next →", "next");
    if (reset) history.replaceState(null, "", urlFor(1));
  }
  search.addEventListener("input", () => render(true));
  sort.addEventListener("change", () => render(true));
  document.querySelector("#blog-filters").addEventListener("submit", (e) => {
    e.preventDefault();
    render(true);
  });
  document.querySelectorAll("[data-tag]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      tag = a.dataset.tag;
      render(true);
    }),
  );
  window.addEventListener("popstate", () => render());
  render();
}
