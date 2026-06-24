# theanh-ktmt.github.io

Personal portfolio website of **The Anh Tran** — ML System Engineer specializing in LLM inference optimization, GPU performance engineering, and distributed AI systems.

🌐 **Live:** [https://theanh-ktmt.github.io](https://theanh-ktmt.github.io)

---

## Sections

- **Intro** — Profile, role, and quick links
- **About & Skills** — Experience, education, and animated skill marquee
- **Projects** — Moreh vLLM, MB Chatbot, Ajikame
- **Publications** — Research papers
- **Honors** — Awards and recognitions (sortable, paginated)
- **Activities** — Clubs, research, and teaching roles
- **Contact** — Email and LinkedIn
- **Blog** — Technical posts with search, sort, and pagination

## Blog

Posts are **MDX** files under `src/content/blog/`. Prose is Markdown; the
custom bits (callouts, figures) are components, and code blocks are
highlighted at build time by Shiki.

| File | Title |
|------|-------|
| `src/content/blog/speculative-decoding.mdx` | Speculative Decoding: Faster LLM Inference with Zero Quality Loss |
| `src/content/blog/vllm-intro.mdx` | vLLM: A Deep Dive into High-Throughput LLM Serving |

**To add a new post:**
1. Create `src/content/blog/<slug>.mdx` with frontmatter (`title`, `description`, `date`, `tags`, `readTime`, `hero`, …) — the schema is in `src/content.config.ts`.
2. Put the post's images in `public/assets/blogs/<slug>/` (referenced as `/assets/blogs/<slug>/…`).
3. Write the body in Markdown; use `<Callout type="blue|green">` and `<Figure src caption narrow />` for the rich bits, and fenced code blocks for code.
4. Add the post URL to `public/sitemap.xml`.

The listing card and the `/blogs/<slug>.html` page are generated automatically from the collection — nothing else to wire up.

## Tech Stack

- **[Astro](https://astro.build)** static site generator (no client framework) — components render to plain HTML, ships almost no JS
- **MDX blog** via content collections (`src/content/blog`), Shiki code highlighting (`one-dark-pro`)
- **Existing CSS kept verbatim** in `src/styles/` (global design system + theme tokens + dark overrides)
- **Shared layout** — `Nav` / `Footer` / `Callout` / `Figure` components + `BaseLayout` / `BlogPost` layouts (edit once)
- **Dark / light theme** — CSS variables + `[data-theme]`; system-aware persisted toggle, dark by default, with a pre-paint inline snippet to avoid flash
- **Effects** — IntersectionObserver scroll-reveal, scrollspy active-nav, reading-progress bar, back-to-top (all respect `prefers-reduced-motion`)
- **Comments** — [giscus](https://giscus.app) (GitHub Discussions), themed and synced with the toggle (config in `src/scripts/site.js`)
- **SEO** — per-page meta/OG/Twitter, JSON-LD `Person`, `public/sitemap.xml`, `public/robots.txt`, custom `404`
- URLs preserved via `build.format: "file"` (e.g. `/blogs.html`, `/blogs/<slug>.html`)

## Project Structure

```
├── astro.config.mjs        # site, build.format:"file", mdx, shiki
├── src/
│   ├── pages/
│   │   ├── index.astro      # Home (all sections)
│   │   ├── blogs.astro      # Blog listing (search/sort/pagination)
│   │   ├── blogs/[...slug].astro  # Post pages from the collection
│   │   └── 404.astro
│   ├── layouts/             # BaseLayout, BlogPost
│   ├── components/          # Nav, Footer, Callout, Figure
│   ├── content/blog/        # *.mdx posts  (+ content.config.ts schema)
│   ├── scripts/site.js      # theme, menu, scrollspy, reveal, giscus
│   └── styles/              # style.css, mediaqueries.css, blogs.css
├── public/                  # served as-is at site root
│   ├── assets/blogs/<slug>/ # one image folder per post
│   ├── js/                  # home.js, blog-list.js (classic global scripts)
│   ├── sitemap.xml · robots.txt · .nojekyll
└── .github/workflows/deploy.yml   # build → upload dist → Pages
```

## Comments (giscus)

Configured in the `GISCUS` block at the top of `src/scripts/site.js`
(repo / repo-id / category / category-id). To re-point it, regenerate the
IDs at <https://giscus.app> and ensure the [giscus app](https://github.com/apps/giscus)
is installed on the repo.

## Local Development

```bash
git clone https://github.com/theanh-ktmt/theanh-ktmt.github.io.git
cd theanh-ktmt.github.io
npm install

npm run dev       # local dev server with HMR
npm run build     # production build to ./dist
npm run preview   # preview the built site
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the
Astro site (`npm ci && npm run build`) and publishes `dist/` to GitHub Pages.

---

© 2026 The Anh Tran
