# The Anh Tran — Personal site

An Astro personal site and Markdown/MDX blog about agent loops, Cosmos world models, LLM inference, and GPU performance. Deployed to GitHub Pages by the existing GitHub Actions workflow.

## Development

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Node 22 is used in GitHub Actions. On Windows systems whose npm script shell is configured for WSL, use `npm.cmd run build --script-shell=cmd.exe`. `ASTRO_TELEMETRY_DISABLED=1` can be set in restricted environments.

## Design and behavior

- IBM Plex Sans for text; JetBrains Mono for code and numeric metadata. Only Latin and Vietnamese WOFF2 subsets are served from `public/fonts/`, with their licenses alongside them.
- Slate neutrals and one blue accent, with system-aware light/dark themes and a persisted override applied before paint.
- Structural borders and open editorial layouts. The hero uses the existing portrait, optimized to responsive WebP images, with a compact avatar above the introduction on smaller screens.
- Static HTML pages and small vanilla JavaScript modules; no client framework.
- The home page contains the current NVIDIA role, affiliations, a short introduction, animated skills, and selected projects. Publications are on Experience, and contact has a dedicated page at `/contact.html`, linked from navigation and footer. Experience, education, honors, activities, and tools are on `/experience.html`; Writing remains at `/blogs.html`. The experience page is synchronized with the owner-supplied CV dated 18 November 2026, including complete role dates and titles.

## Publishing

Posts live in `src/content/blog/` as `.md` or `.mdx`, validated by `src/content.config.ts`. The two original AI-generated articles were removed at the owner's request. A post requires `title`, `description`, `date`, `tags`, `readTime`, and a local `hero` path. Supply meaningful `heroAlt` text. Optional `sample: true` labels a demonstration post.

Use Markdown headings for an automatically generated table of contents. Code fences are highlighted at build time by Shiki in matching accessible light and dark palettes; a vanilla JavaScript enhancement adds copy buttons. Markdown tables become keyboard-scrollable regions. Standard GFM footnotes (`[^note]`) include backlinks.

Math supports `$...$` inline and `$$...$$` display blocks, using `remark-math` and `rehype-katex`. KaTeX HTML and MathML are generated at build time. The CSS and fonts are served locally, with core math fonts preloaded; long equations scroll within a focusable container. The KaTeX dependency matches the renderer’s supported version range.

The sample at `/blogs/writing-features.html` demonstrates math, code, tables, callouts, figures, footnotes, and Vietnamese text.

```mdx
import Callout from "../../components/Callout.astro";
import Figure from "../../components/Figure.astro";

<Callout type="blue">

A contextual note, with Markdown inside.

</Callout>

<Figure
  src="/assets/blogs/my-post/example.png"
  alt="Describe what the figure communicates."
  caption="Figure caption."
/>
```

Figures use semantic `figure` / `figcaption` markup and detect local image dimensions at build time. Captions support trusted, author-written HTML. Local Markdown images also receive dimensions automatically.

## Routes and discovery

The tab title on home is `The Anh Tran - Personal Page`; the header and favicon use the `ta.` monogram.

`build.format: "file"` preserves `/blogs.html` and `/blogs/<slug>.html`. Additional archive pages are generated as `/blogs/page/2.html`, etc., once there are more than six posts. The initial page is static HTML, with real pagination links. Search, sorting, and exact tag filters enhance it in the browser and preserve their state in the URL.

`src/components/SEO.astro` provides page metadata, canonical URLs, Open Graph, and Twitter cards. Build-time Satori + resvg endpoints generate 1200×630 PNG images under `/og/`. The home page emits Person and WebSite JSON-LD; posts emit BlogPosting and BreadcrumbList.

`@astrojs/sitemap` is the only sitemap source; its serializer preserves the actual `.html` routes. `public/robots.txt` points to `/sitemap-index.xml`. `/rss.xml` is generated from the collection and advertised in every page’s head.

## Comments

Giscus keeps the original repository/category IDs and `pathname` mapping in `src/scripts/site.js`, preserving existing discussion associations. Readers open the discussion disclosure to load the external client. Theme changes are forwarded to the Giscus iframe.

## Verification

```sh
npm run format:check
npm run build
npm run check:browser
npm run audit:mobile
```

Browser checks use installed Google Chrome. Set `CHROME_PATH` if needed. They capture 375/768/1280 screenshots in both themes and check WCAG AA rules, document structure, images, overflow, search/sort/tags, math, footnotes, copying, reduced motion, theme persistence, and static rendering without JavaScript. The Giscus loader check intercepts its script request; external sign-in and comment submission are not automated.

Lighthouse uses the default mobile simulation on the local production build. Reports and screenshots live in `reports/`; open `reports/index.html` for the review gallery. The original baseline at commit `24fae1a` was built before source changes and saved under ignored `.audit/baseline-dist/` for this session. `node scripts/audit.mjs before` measures that saved snapshot while it is available.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which installs locked dependencies, builds Astro, and publishes `dist/` through GitHub Pages. Make changes on a feature branch, then merge approved changes into `main` to deploy. Generated audit reports and screenshots in `reports/` remain local and are excluded from Git.

## Obsidian compatibility

Standard Markdown files (`.md`) exported from Obsidian can be placed in `src/content/blog/` with the required frontmatter above. Markdown headings, fenced code, tables, footnotes, and `$...$` / `$$...$$` math are supported. MDX remains available for Astro components.

This is not a full Obsidian vault integration: there is no automatic vault synchronization, wikilink (`[[note]]`) resolution, Obsidian embeds (`![[image]]`), or conversion of Obsidian-specific callouts. Use regular Markdown links and images (public assets at `/assets/...`), and the Astro Callout component in MDX. Dates, descriptions, tags, readTime, hero, and heroAlt still need the site's frontmatter format.

The supplied transparent NVIDIA logos are self-hosted. The hero uses the symbol-only logo next to the company name; the horizontal wordmark image is preserved for future use. The Asilla product image was supplied by the owner. Project illustrations are optimized at build time to WebP and displayed in consistent 16:9 frames without borders.

## Landing page and motion

The landing page contains an introduction, employer/university affiliations, a full-width skills marquee, and selected projects. Publications are on `/experience.html#publications`. Contact has its own `/contact.html` page with email, LinkedIn, and GitHub. The navigation, footer, and confidential-project contact link lead there; old home `#contact` links forward to that page. The original horizontal NVIDIA logo is retained at `public/assets/companies/nvidia.png`; the hero uses the owner-supplied symbol at `nvidia-symbol.png` and HUST logo at `hust.jpg`.

The skills animation has a pause/resume button and pauses on hover or keyboard focus. Reduced-motion users get a static wrapping skills list, disabled hover movement, and immediate anchor navigation. Other users get native smooth scrolling, subtle hover underlines, and a small image zoom on project links.

## Updating the web CV

The current resume is the only PDF under `public/`, at `public/assets/resume.pdf`. Replace it in place when updating the CV; keep previous versions out of public assets. The current copy is the owner-supplied 18 November 2026 PDF, unchanged.

`src/data/cv.ts` holds the last-updated date, versioned resume URL, complete work/education history, technical skills, publications, honors, activities, languages, and reference. The Experience page renders this data with a responsive section index, and the skills marquee imports the same source. Update its date and versioned URL when replacing the PDF so browser caches pick up the new download.

The AutoResearch thumbnail is the owner-supplied illustration at `public/assets/autoresearch.png`; Astro generates responsive WebP images. AutoResearch and MB Chatbot are marked Confidential and lead to the Contact page instead of an external product link. Figures and technical details follow the supplied CV; no additional project results are inferred.
