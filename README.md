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

Blog posts live under `blogs/`. Each post is a standalone HTML page.

| File | Title |
|------|-------|
| `blogs/speculative-decoding.html` | Speculative Decoding: Faster LLM Inference with Zero Quality Loss |
| `blogs/vllm-intro.html` | vLLM: A Deep Dive into High-Throughput LLM Serving |

**To add a new post:**
1. Create `blogs/<slug>.html` (copy `vllm-intro.html` as a template)
2. Put the post's images in their own folder: `assets/blogs/<slug>/` (e.g. `hero.svg`, plus any figures)
3. Add a card entry in `blogs.html` with `data-title`, `data-date`, and `data-tags` attributes
4. Add the post URL to `sitemap.xml`

> The nav, footer, theme toggle, and shared scripts come from `/partials/` + `/js/site.js`, so you don't copy them into each post.

## Tech Stack

- Pure HTML / CSS / JavaScript — no frameworks, no bundler
- **Shared layout via JS includes** — `partials/nav.html` + `partials/footer.html` are fetched and injected by `js/site.js`, so the nav/footer are edited in one place
- **Dark / light theme** — CSS variables + `[data-theme]`; a system-aware, persisted toggle lives in the nav. A pre-paint inline snippet in each `<head>` avoids theme flash
- **Effects** — IntersectionObserver scroll-reveal, scrollspy active-nav, reading-progress bar, back-to-top (all respect `prefers-reduced-motion`)
- **Comments** — [giscus](https://giscus.app) (GitHub Discussions), themed to match and synced with the toggle
- **SEO** — per-page meta/OG/Twitter, JSON-LD `Person`, `sitemap.xml`, `robots.txt`, custom `404.html`
- `style.css` — global design system + theme tokens; `mediaqueries.css` — responsive; `blogs.css` — blog styles
- `script.js` — home-page-only behaviors (carousel, honors/activities pagination & sort)
- Deployed via **GitHub Actions** → **GitHub Pages**

## Project Structure

```
├── index.html          # Main portfolio page
├── blogs.html          # Blog listing page (search, sort, pagination)
├── 404.html            # Custom not-found page
├── blogs/
│   ├── speculative-decoding.html
│   └── vllm-intro.html
├── partials/
│   ├── nav.html        # Shared nav (injected on every page)
│   └── footer.html     # Shared footer
├── js/
│   └── site.js         # Includes loader, theme, menu, scrollspy, reveal, giscus
├── script.js           # Home-page behaviors (carousel, pagination)
├── style.css           # Global styles + theme tokens + dark overrides
├── mediaqueries.css    # Responsive styles
├── blogs.css           # Blog styles (+ dark overrides)
├── sitemap.xml · robots.txt · .nojekyll
└── assets/
    ├── blogs/<slug>/   # One image subfolder per post
    ├── profile-pic.png
    └── ...
```

## Comments (giscus) setup

Comments use GitHub Discussions via giscus. They show a "not configured" note until you:

1. Make the repo public (already is) and enable **Discussions** (repo → Settings → General → Features)
2. Install the **giscus app**: <https://github.com/apps/giscus>
3. Visit <https://giscus.app>, enter the repo, and copy the generated `data-repo-id` and `data-category-id`
4. Paste them into the `GISCUS` config at the top of `js/site.js`

## Local Development

```bash
git clone https://github.com/theanh-ktmt/theanh-ktmt.github.io.git
cd theanh-ktmt.github.io

# Serve over http (required — the JS includes use fetch(), which
# does not work from file://).
npx serve .
```

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which deploys the site automatically to GitHub Pages.

---

© 2026 The Anh Tran
