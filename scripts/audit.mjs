import http from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const phase = process.argv[2] || "after";
const root = path.resolve(phase === "before" ? ".audit/baseline-dist" : "dist");
const output = path.resolve(`reports/lighthouse/${phase}`);
await mkdir(output, { recursive: true });
const profile = path.resolve(`.audit/chrome-${phase}-${Date.now()}`);
await mkdir(profile, { recursive: true });
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".xml": "application/xml",
  ".json": "application/json",
  ".pdf": "application/pdf",
};
export function serverFor(root) {
  return http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let filename = path.resolve(root, "." + pathname);
      if (!filename.startsWith(root + path.sep) && filename !== root)
        throw Error("path");
      if ((await stat(filename)).isDirectory())
        filename = path.join(filename, "index.html");
      const data = await readFile(filename);
      res.writeHead(200, {
        "Content-Type":
          mime[path.extname(filename)] || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}
const server = serverFor(root);
await new Promise((resolve) => server.listen(4325, "127.0.0.1", resolve));
let chrome;
try {
  chrome = await launch({
    chromePath: process.env.CHROME_PATH,
    chromeFlags: ["--headless", "--disable-gpu", "--no-first-run"],
    userDataDir: profile,
  });
  const routes = [
    "/",
    "/blogs.html",
    ...(phase === "before"
      ? ["/blogs/vllm-intro.html", "/blogs/speculative-decoding.html"]
      : ["/experience.html", "/contact.html"]),
    ...(phase === "after" ? ["/blogs/writing-features.html"] : []),
  ];
  const scores = [];
  for (const route of routes) {
    const result = await lighthouse(`http://127.0.0.1:4325${route}`, {
      port: chrome.port,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    const name =
      route === "/"
        ? "home"
        : route.replace(/^\//, "").replaceAll("/", "-").replace(".html", "");
    await writeFile(path.join(output, `${name}.html`), result.report[0]);
    await writeFile(path.join(output, `${name}.json`), result.report[1]);
    const row = {
      route,
      ...Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, c]) => [
          key,
          Math.round(c.score * 100),
        ]),
      ),
    };
    scores.push(row);
    console.log(JSON.stringify(row));
  }
  await writeFile(
    path.join(output, "scores.json"),
    JSON.stringify(scores, null, 2),
  );
} finally {
  if (chrome) await chrome.kill();
  await new Promise((resolve) => server.close(resolve));
}
