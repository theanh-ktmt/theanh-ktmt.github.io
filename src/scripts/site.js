const root = document.documentElement;
const systemTheme = matchMedia("(prefers-color-scheme: light)");
const button = document.querySelector("#theme-toggle");
function updateTheme(theme) {
  root.dataset.theme = theme;
  button?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
  button?.setAttribute(
    "title",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
  const frame = document.querySelector("iframe.giscus-frame");
  frame?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: { theme: theme === "dark" ? "dark_dimmed" : "light" },
      },
    },
    "https://giscus.app",
  );
}
updateTheme(root.dataset.theme);
button?.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  updateTheme(theme);
});
systemTheme.addEventListener("change", (event) => {
  let saved;
  try {
    saved = localStorage.getItem("theme");
  } catch {}
  if (saved !== "light" && saved !== "dark")
    updateTheme(event.matches ? "light" : "dark");
});
window.addEventListener("storage", (event) => {
  if (event.key === "theme")
    updateTheme(
      event.newValue === "light" || event.newValue === "dark"
        ? event.newValue
        : systemTheme.matches
          ? "light"
          : "dark",
    );
});
async function copy(text, trigger) {
  const previous = trigger.textContent;
  try {
    await navigator.clipboard.writeText(text);
    trigger.textContent = "Copied";
    document.querySelector("#copy-status").textContent = "Copied to clipboard.";
  } catch {
    trigger.textContent = "Copy failed";
    document.querySelector("#copy-status").textContent =
      "Copy failed. Select the text and copy it manually.";
  }
  setTimeout(() => {
    trigger.textContent = previous;
  }, 2000);
}
document.querySelectorAll(".code-block").forEach((block, i) => {
  const code = block.querySelector("code");
  if (!code) return;
  const pre = block.querySelector("pre");
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", "Code example " + (i + 1));
  const b = document.createElement("button");
  b.className = "code-copy";
  b.type = "button";
  b.textContent = "Copy";
  b.setAttribute("aria-label", "Copy code example " + (i + 1));
  b.addEventListener("click", () => copy(code.textContent, b));
  block.append(b);
});
document
  .querySelector("[data-copy-link]")
  ?.addEventListener("click", (event) =>
    copy(location.origin + location.pathname, event.currentTarget),
  );
const toc = document.querySelector("#post-toc");
if (toc) {
  const links = [...document.querySelectorAll(".toc a")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.removeAttribute("aria-current"));
          links
            .filter((a) => a.hash === "#" + entry.target.id)
            .forEach((a) => a.setAttribute("aria-current", "location"));
        }
      });
    },
    { rootMargin: "-5% 0px -65% 0px" },
  );
  document
    .querySelectorAll(".prose h2,.prose h3")
    .forEach((h) => observer.observe(h));
}
const disclosure = document.querySelector("#comments-disclosure");
disclosure?.addEventListener("toggle", () => {
  if (!disclosure.open || disclosure.dataset.loaded) return;
  disclosure.dataset.loaded = "true";
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  const attrs = {
    "data-repo": "theanh-ktmt/theanh-ktmt.github.io",
    "data-repo-id": "R_kgDOQ4anxA",
    "data-category": "Announcements",
    "data-category-id": "DIC_kwDOQ4anxM4C_zuD",
    "data-mapping": "pathname",
    "data-strict": "0",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": root.dataset.theme === "dark" ? "dark_dimmed" : "light",
    "data-lang": "en",
    "data-loading": "lazy",
  };
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
  document.querySelector("#giscus-container").append(script);
});
