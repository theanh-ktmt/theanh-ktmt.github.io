import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { imageSize } from "image-size";
const before = JSON.parse(
  readFileSync("reports/lighthouse/before/scores.json", "utf8"),
);
const after = JSON.parse(
  readFileSync("reports/lighthouse/after/scores.json", "utf8"),
);
const browser = JSON.parse(readFileSync("reports/browser-checks.json", "utf8"));
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const names = {
  "/": "Home",
  "/blogs.html": "Writing archive",
  "/experience.html": "Experience",
  "/contact.html": "Contact",
  "/blogs/vllm-intro.html": "vLLM post",
  "/blogs/speculative-decoding.html": "Speculative decoding post",
  "/blogs/writing-features.html": "Sample post",
};
const key = (route) =>
  route === "/"
    ? "home"
    : route.slice(1).replaceAll("/", "-").replace(".html", "");
const scores = (row) =>
  ["performance", "accessibility", "best-practices", "seo"]
    .map((k) => row[k])
    .join(" / ");
const rows = after
  .map((row) => {
    const old = before.find((r) => r.route === row.route);
    return `<tr><th scope="row">${escape(names[row.route])}</th><td>${old ? `<a href="lighthouse/before/${key(row.route)}.html">${scores(old)}</a>` : "New page"}</td><td><a href="lighthouse/after/${key(row.route)}.html">${scores(row)}</a></td></tr>`;
  })
  .join("");
const groups = [
  ["hero", "Hero viewport"],
  ["home", "Full home page"],
  ["writing", "Writing archive"],
  ["experience", "Experience"],
  ["contact", "Contact"],
  ["sample", "Feature demonstration"],
  ["404", "404 page"],
];
const galleries = groups
  .map(
    ([slug, label]) =>
      `<section><h3>${label}</h3><div class="gallery">${[375, 768, 1280]
        .flatMap((width) =>
          ["dark", "light"].map((theme) => {
            const filename = `screenshots/${slug}-${width}-${theme}.png`;
            const { width: w, height: h } = imageSize(
              readFileSync("reports/" + filename),
            );
            return `<figure><figcaption><a href="${filename}" target="_blank">${width}px · ${theme} ↗</a></figcaption><div class="screenshot-frame"><a href="${filename}" target="_blank"><img src="${filename}" width="${w}" height="${h}" loading="lazy" alt="${escape(label)}, ${width} pixels, ${theme} theme"></a></div></figure>`;
          }),
        )
        .join("")}</div></section>`,
  )
  .join("");
const lhr = JSON.parse(
  readFileSync("reports/lighthouse/after/home.json", "utf8"),
);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site redesign — Review and verification</title><style>@font-face{font-family:Plex;src:url('../public/fonts/ibm-plex-sans-latin-400-normal.woff2')}@font-face{font-family:Mono;src:url('../public/fonts/jetbrains-mono-latin-400-normal.woff2')}*{box-sizing:border-box}body{font:16px/1.7 Plex,system-ui,sans-serif;background:#0b111b;color:#e7edf5;margin:0}main{max-width:1200px;margin:auto;padding:48px 28px}h1,h2,h3{font-weight:500;line-height:1.2;letter-spacing:-.025em}h1{font-size:42px;max-width:25ch}h2{font-size:30px;margin-top:60px}h3{font-size:22px;margin-top:40px}p,li{color:#9cacc1}a{color:#60a5fa;text-underline-offset:4px}a:focus-visible{outline:2px solid #60a5fa;outline-offset:5px}.eyebrow{font:11px Mono,monospace;letter-spacing:.1em}nav{display:flex;gap:24px;flex-wrap:wrap}.table-wrap{overflow:auto;border-top:1px solid #273244}table{border-collapse:collapse;width:100%;text-align:left;font-size:14px}td,th{border-bottom:1px solid #273244;padding:16px 18px}td{font:12px Mono,monospace;white-space:nowrap}th{font-weight:400}.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}figure{margin:0;min-width:0}figcaption{font:12px Mono,monospace;padding:12px 0}.screenshot-frame{max-height:440px;overflow:auto;border:1px solid #273244}img{width:100%;height:auto;display:block}.note{border-left:2px solid #60a5fa;padding-left:18px}code{font:12px Mono,monospace}section{border-top:1px solid #273244;padding-top:8px;margin-top:35px}@media(max-width:780px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){main{padding:28px 20px}h1{font-size:32px}.gallery{grid-template-columns:1fr}}</style></head><body><main><p class="eyebrow">THE ANH TRAN / PERSONAL SITE REDESIGN</p><h1>From portfolio to engineering publication.</h1><p>Branch: <code>redesign/ml-systems-portfolio</code>. Prepared locally; production deployment is unchanged.</p><nav aria-label="Report sections"><a href="#measurements">Lighthouse</a><a href="#verification">Verification</a><a href="#screenshots">Screenshots</a><a href="#todos">TODOs</a></nav><h2 id="measurements">Mobile Lighthouse: before and after.</h2><p>Each score group is <strong>Performance / Accessibility / Best Practices / SEO</strong>. Click a group for the full Lighthouse report.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Lighthouse score comparison"><table><thead><tr><th scope="col">Page</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>${rows}</tbody></table></div><p class="note">Baseline: untouched production build from commit <code>24fae1a</code>. After: redesigned production build. Lighthouse ${lhr.lighthouseVersion}, default mobile simulation with simulated throttling, local static server, installed Chrome, one run per route in each phase. Final report date: ${escape(lhr.fetchTime)}. These are local lab measurements; GitHub Pages delivery, visitor hardware, and network conditions can change scores. Lighthouse scores do not by themselves establish complete accessibility compliance.</p><h2 id="verification">What was verified.</h2><ul><li>Production Astro build and formatting checks pass.</li><li>${browser.findings.length} page/viewport/theme combinations; ${browser.findings.reduce((n, f) => n + f.violations.length, 0)} automated WCAG AA violations, ${browser.failures.length} layout/image failures, and ${browser.errors.length} JavaScript errors.</li><li>42 screenshots: every page type at 375, 768, and 1280 pixels, in dark and light themes, plus six hero viewport captures.</li><li>Search, sorting, exact tag filtering, empty results, theme persistence, keyboard navigation, copy buttons, reduced motion, smooth anchor navigation, skill animation pause/resume, and opening the mobile table of contents.</li><li>Inline/display KaTeX, accessible MathML, locally hosted math fonts, keyboard-scrollable long equations and tables, figure dimensions, footnotes, and static content with JavaScript disabled.</li><li>Real second-page archive links, canonical URLs, and search reset verified with and without JavaScript in an isolated eight-post fixture; fixture content is excluded from the actual site.</li><li>Unique page metadata, canonical URLs, internal links and anchors, generated OG images, JSON-LD, RSS, and sitemap URLs matching actual .html output. The two original AI-generated posts have been removed at the owner’s request, including their routes, RSS entries, and sitemap entries.</li><li>Giscus retains its original repository/category IDs and pathname mapping. Its on-demand loader is checked with an intercepted script request; external GitHub sign-in and comment submission are not automated.</li></ul><p><a href="browser-checks.json">Browser results JSON</a> · <a href="seo-checks.json">SEO checks JSON</a> · <a href="pagination-checks.json">Pagination checks JSON</a></p><h2 id="screenshots">Responsive screenshot gallery.</h2><p>Frames scroll to show full pages. Click a screenshot label to open the original PNG at its captured resolution.</p>${galleries}<h2 id="todos">Content TODOs.</h2><ul><li>TODO: Supply exact role titles and employment dates for Moreh, MB Bank, and Asilla.</li><li>TODO: Add benchmark context and supporting public links for retained project results when available.</li></ul><p>The explicitly requested demonstration post remains clearly labeled as a sample. Experience and Writing are separate pages; home contains the current NVIDIA role, NVIDIA/HUST affiliations, a short intro, animated skills, and selected projects. Publications are on Experience; Contact has a dedicated page linked from the navigation and footer. Existing project claims are preserved from the source site; no new project measurements were invented.</p></main></body></html>`;
writeFileSync("reports/index.html", html);
console.log("Review gallery written to reports/index.html");
