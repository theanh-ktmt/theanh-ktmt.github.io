// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://theanh-ktmt.github.io",
  // Keep the existing .html URLs (e.g. /blogs.html, /blogs/<slug>.html)
  build: { format: "file" },
  // Hide the dev-only floating toolbar (it never appears in production anyway)
  devToolbar: { enabled: false },
  // Prefetch internal links on hover for instant navigation
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [mdx(), sitemap()],
  markdown: {
    // Matches the previous One Dark-style code blocks
    shikiConfig: { theme: "one-dark-pro", wrap: false },
  },
});
