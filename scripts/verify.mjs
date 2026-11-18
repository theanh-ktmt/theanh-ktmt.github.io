import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { serverFor } from "./static-server.mjs";
const server = serverFor(path.resolve("dist"));
await new Promise((resolve) => server.listen(4326, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4326";
const output = "reports/screenshots";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: "chrome" }),
  headless: true,
});
const routes = [
  ["home", "/"],
  ["writing", "/blogs.html"],
  ["experience", "/experience.html"],
  ["contact", "/contact.html"],
  ["sample", "/blogs/writing-features.html"],
  ["404", "/404.html"],
];
const findings = [];
const errors = [];
const failures = [];
try {
  for (const width of [375, 768, 1280])
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        reducedMotion: "no-preference",
        permissions: ["clipboard-read", "clipboard-write"],
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      for (const [name, route] of routes) {
        const missing = [];
        const onResponse = (r) => {
          if (r.status() >= 400) missing.push(r.url());
        };
        page.on("response", onResponse);
        await page.goto(base + route, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          for (const image of document.images) {
            if (image.loading === "lazy") image.loading = "eager";
          }
          await Promise.all(
            [...document.images].map((image) => image.decode().catch(() => {})),
          );
        });
        const checks = await page.evaluate(() => ({
          theme: document.documentElement.dataset.theme,
          h1: document.querySelectorAll("h1").length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          missingDimensions: [...document.images]
            .filter(
              (i) =>
                !i.width ||
                !i.height ||
                !i.hasAttribute("width") ||
                !i.hasAttribute("height"),
            )
            .map((i) => i.src),
          brokenImages: [...document.images]
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
          canonical: document.querySelector("link[rel=canonical]")?.href,
          description: document.querySelector("meta[name=description]")
            ?.content,
        }));
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const record = {
          name,
          width,
          theme,
          ...checks,
          missing,
          violations: axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        };
        findings.push(record);
        if (
          checks.theme !== theme ||
          checks.h1 !== 1 ||
          checks.overflow ||
          checks.missingDimensions.length ||
          checks.brokenImages.length ||
          missing.length ||
          axe.violations.length
        )
          failures.push(record);
        await page.screenshot({
          path: `${output}/${name}-${width}-${theme}.png`,
          fullPage: true,
          animations: "disabled",
        });
        if (name === "home")
          await page.screenshot({
            path: `${output}/hero-${width}-${theme}.png`,
            animations: "disabled",
          });
        page.off("response", onResponse);
      }
      await context.close();
    }
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  await page.goto(base + "/blogs.html");
  await page.locator("#blog-search").fill("math");
  assert.equal(await page.locator("#blog-results [data-post]").count(), 1);
  await page.locator("#blog-search").fill("no-such-post-928");
  assert.equal(await page.locator("#blog-empty").isVisible(), true);
  await page.locator("#blog-search").fill("");
  await page.locator('[data-tag="Site"]').click();
  assert.equal(await page.locator("#blog-results [data-post]").count(), 1);
  assert.ok(page.url().includes("tag=Site"));
  await page.locator('[data-tag=""]').click();
  await page.locator("#blog-sort").selectOption("oldest");
  assert.match(
    await page
      .locator("#blog-results [data-post]")
      .first()
      .getAttribute("data-title"),
    /Writing Features/,
  );
  await page.goto(base + "/blogs/writing-features.html");
  assert.equal(await page.locator(".katex-display").count(), 2);
  assert.ok((await page.locator(".katex-mathml math").count()) >= 6);
  assert.ok((await page.locator("[data-footnote-ref]").count()) === 2);
  assert.ok((await page.locator(".table-scroll").count()) === 1);
  await page.locator(".code-copy").first().click();
  assert.match(
    await page.evaluate(() => navigator.clipboard.readText()),
    /def arithmetic_intensity/,
  );
  assert.equal(
    await page.locator("#post-toc-mobile").getAttribute("open"),
    null,
  );
  await page.locator("#post-toc-mobile summary").click();
  assert.ok(
    (await page.locator("#post-toc-mobile").getAttribute("open")) !== null,
  );
  const theme = await page.locator("html").getAttribute("data-theme");
  await page.locator("#theme-toggle").click();
  await page.reload();
  assert.notEqual(await page.locator("html").getAttribute("data-theme"), theme);
  let giscus;
  await page.route("https://giscus.app/client.js", (route) => {
    giscus = route.request().url();
    return route.fulfill({ body: "" });
  });
  await page.locator("#comments-disclosure summary").click();
  await page.waitForTimeout(300);
  assert.ok(giscus);
  assert.equal(
    await page.locator("script[data-repo]").getAttribute("data-mapping"),
    "pathname",
  );
  await page.goto(base + "/");
  await page.mouse.move(0, 0);
  const skillsTrack = page.locator(".skills-track");
  assert.equal(
    await skillsTrack.evaluate((e) => getComputedStyle(e).animationName),
    "skills-travel",
  );
  const initialTransform = await skillsTrack.evaluate(
    (e) => getComputedStyle(e).transform,
  );
  await page.waitForTimeout(180);
  assert.notEqual(
    await skillsTrack.evaluate((e) => getComputedStyle(e).transform),
    initialTransform,
  );
  const pause = page.locator(".skills-toggle");
  await pause.click();
  assert.equal(await pause.getAttribute("aria-pressed"), "true");
  assert.equal(
    await skillsTrack.evaluate((e) => getComputedStyle(e).animationPlayState),
    "paused",
  );
  await pause.click();
  await pause.evaluate((e) => e.blur());
  await page.mouse.move(0, 0);
  assert.equal(
    await skillsTrack.evaluate((e) => getComputedStyle(e).animationPlayState),
    "running",
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "smooth",
  );
  await page.locator('.site-header a[href="/#projects"]').click();
  await page.waitForFunction(
    () =>
      Math.abs(
        document.querySelector("#projects").getBoundingClientRect().top - 32,
      ) < 3,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "/");
  assert.equal(
    await page
      .locator(".hero-portrait img")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(await page.title(), "The Anh Tran - Personal Page");
  assert.equal(
    await skillsTrack.evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(await page.locator(".skills-toggle").isVisible(), false);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.equal(
    await page.locator("main #publications, main #contact").count(),
    0,
  );
  assert.equal(
    await page.locator(".skills-group:not([aria-hidden]) li").count(),
    25,
  );
  assert.equal(await page.locator(".brand-mark").innerText(), "ta.");
  assert.equal(await page.locator("main .hero-intro").count(), 1);
  assert.equal(await page.locator(".hero-lead").count(), 0);
  assert.match(
    await page.locator(".hero-role").textContent(),
    /Senior Deep Learning Algorithms Engineer/,
  );
  assert.equal(
    await page
      .locator("#writing, #experience, #about, #honors, #activities")
      .count(),
    0,
  );
  for (const image of await page.locator(".project-image-link img").all()) {
    const geometry = await image.evaluate((e) => {
      const rect = e.getBoundingClientRect();
      return {
        ratio: rect.width / rect.height,
        border: getComputedStyle(e.parentElement).borderTopWidth,
      };
    });
    assert.ok(Math.abs(geometry.ratio - 16 / 9) < 0.01);
    assert.equal(geometry.border, "0px");
  }
  assert.equal(
    (await page.request.get(base + "/blogs/vllm-intro.html")).status(),
    404,
  );
  assert.equal(
    (
      await page.request.get(base + "/blogs/speculative-decoding.html")
    ).status(),
    404,
  );
  assert.equal(await page.locator(".project-row").count(), 4);
  const autoResearch = page.locator(".project-row").first();
  assert.match(await autoResearch.locator("h3").innerText(), /AutoResearch/);
  assert.match(await autoResearch.innerText(), /Confidential project/);
  assert.match(
    await autoResearch.locator("img").getAttribute("src"),
    /autoresearch/,
  );
  for (const skill of [
    "vLLM-Omni",
    "TRT-LLM",
    "MCP",
    "Kubernetes",
    "torch.compile",
  ]) {
    assert.ok(
      (
        await page.locator(".skills-group:not([aria-hidden])").innerText()
      ).includes(skill),
    );
  }
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Skip to content",
  );
  await page.goto(base + "/experience.html");
  assert.equal(
    await page.locator(".cv-updated time").getAttribute("datetime"),
    "2026-11-18",
  );
  assert.equal(
    await page.locator(".cv-updated time").innerText(),
    "18/11/2026",
  );
  assert.equal(await page.locator("#experience > .cv-entry").count(), 6);
  assert.equal(await page.locator(".cv-project").count(), 11);
  for (const project of await page.locator(".cv-project").all()) {
    if ((await project.locator("h4 a").count()) === 0) {
      assert.equal(
        await project.locator(".cv-confidential").innerText(),
        "Confidential",
      );
    }
  }

  assert.equal(await page.locator("#about > .cv-entry").count(), 2);
  assert.equal(await page.locator("#skills .cv-skills > div").count(), 5);
  assert.equal(await page.locator("#honors .cv-records > li").count(), 7);
  assert.equal(await page.locator("#activities .cv-records > li").count(), 4);
  assert.equal(await page.locator("#languages .cv-skills > div").count(), 2);
  assert.match(await page.locator("#experience").innerText(), /Aug 2026/);
  assert.match(await page.locator("#experience").innerText(), /Jul 2024/);
  assert.match(await page.locator("#experience").innerText(), /80%/);
  assert.match(await page.locator("#experience").innerText(), /PIXTA Vietnam/);
  assert.match(await page.locator("#references").innerText(), /Do Ba Lam/);
  const resumeHref = await page.locator(".cv-actions a").getAttribute("href");
  assert.equal(resumeHref, "/assets/resume.pdf?v=20261118");
  const pdfResponse = await page.request.get(base + resumeHref);
  assert.equal(pdfResponse.status(), 200);
  assert.ok(
    (await pdfResponse.body()).equals(
      await readFile("public/assets/resume.pdf"),
    ),
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + "/blogs.html");
  assert.equal(
    await staticPage.locator("#blog-results [data-post]").count(),
    1,
  );
  await staticPage.goto(base + "/blogs/writing-features.html");
  assert.equal(await staticPage.locator(".katex-display").count(), 2);
  assert.equal(await staticPage.locator("[data-footnote-ref]").count(), 2);
  await nojs.close();
  await context.close();
  await writeFile(
    "reports/browser-checks.json",
    JSON.stringify(
      { findings, errors, failures, functionalChecks: "passed" },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      screenshots: routes.length * 6 + 6,
      pages: routes.length,
      viewports: 3,
      themes: 2,
      axeViolations: findings.reduce((n, f) => n + f.violations.length, 0),
      layoutFailures: failures.length,
      pageErrors: errors,
      functionalChecks: "passed",
    }),
  );
  if (failures.length || errors.length) process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
