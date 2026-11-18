// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import enrichContent from "./src/utils/rehype-content.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://theanh-ktmt.github.io",
  // Keep the existing .html URLs (e.g. /blogs.html, /blogs/<slug>.html)
  build: { format: "file" },
  // Hide the dev-only floating toolbar (it never appears in production anyway)
  devToolbar: { enabled: false },
  // Prefetch internal links on hover for instant navigation
  integrations: [
    mdx(),
    sitemap({
      // The integration emits extensionless URLs by default, even for file output.
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname !== "/" && !/\.[^/]+$/.test(url.pathname)) {
          url.pathname = url.pathname.replace(/\/$/, "") + ".html";
        }
        return { ...item, url: url.href };
      },
    }),
  ],
  markdown: {
    // Matches the previous One Dark-style code blocks
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, enrichContent],
    shikiConfig: {
      themes: { light: "github-light-default", dark: "github-dark-default" },
      defaultColor: "dark",
      wrap: false,
    },
  },
});
