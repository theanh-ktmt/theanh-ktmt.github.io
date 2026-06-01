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
| `blogs/vllm-intro.html` | vLLM: A Deep Dive into High-Throughput LLM Serving |

**To add a new post:**
1. Create `blogs/<slug>.html` (copy `vllm-intro.html` as a template)
2. Add a card entry in `blogs.html` with `data-title`, `data-date`, and `data-tags` attributes

## Tech Stack

- Pure HTML / CSS / JavaScript — no frameworks, no build step
- `style.css` — global design system (Poppins, monochrome palette, reusable components)
- `mediaqueries.css` — responsive breakpoints for the main portfolio
- `blogs.css` — blog-specific styles (card layout, post typography, search/sort controls)
- `script.js` — carousel, pagination, sorting, scroll-snap navigation
- Deployed via **GitHub Actions** → **GitHub Pages**

## Project Structure

```
├── index.html          # Main portfolio page
├── blogs.html          # Blog listing page (search, sort, pagination)
├── blogs/
│   └── vllm-intro.html # Blog post: vLLM introduction
├── style.css           # Global styles
├── mediaqueries.css    # Responsive styles
├── blogs.css           # Blog styles
├── script.js           # Portfolio JS (carousel, pagination, scroll-snap)
└── assets/
    ├── blogs/
    │   └── vllm-hero.svg   # Hero image for vLLM post
    ├── profile-pic.png
    └── ...
```

## Local Development

```bash
# Clone
git clone https://github.com/theanh-ktmt/theanh-ktmt.github.io.git
cd theanh-ktmt.github.io

# Open in browser (any static file server works)
npx serve .
# or just open index.html directly in a browser
```

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which deploys the site automatically to GitHub Pages.

---

© 2026 The Anh Tran
