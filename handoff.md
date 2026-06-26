# Handoff for Codex

## Current State

Static portfolio site for Zack Wilde in `D:\Apps\zackwilde.dev`. No framework, package manager, or build step — keep it that way unless Zack asks otherwise.

## Implemented in this pass (Claude)

Three things: a resume visual redesign, a site-wide domain correction, and a title change.

- **Title change — "Web Developer" → "Full-Stack Developer".** Applied everywhere: `index.html` (`<title>`, meta description, `og:title`, `twitter:title`, `og:image:alt`, JSON-LD `jobTitle` — which also dropped the stray "and Product Builder", and the hero eyebrow), `resume/resume.html` (role + summary opening), and `Zack_Wilde_Resume.md` (role + summary). Rationale: the portfolio shows backend (Express/Supabase/RLS), mobile (Expo/React Native/Capacitor), and AI-integration work, not just websites — "Full-Stack Developer" is accurate and ATS-searchable without overclaiming seniority.

- **Resume redesign (`resume/resume.html` → `Zack_Wilde_Resume.pdf`).** The old layout crammed all content into the top ~60% and left the bottom 40% blank. Rebalanced to fill the page evenly: larger body type, stronger header (bigger name, teal uppercase role line), and rust project-type labels ("Mobile App · AI Backend", "Finance Dashboard", etc.) matching the live site. Regenerated the PDF via `resume/build.ps1` and confirmed it is **one page** (page count parsed from the PDF). Mirrored the new type labels into `Zack_Wilde_Resume.md` as italic sublines so the markdown source stays in sync.
- **Domain correction — the site is `zackwilde-dev.netlify.app`, NOT `zackwilde.dev`.** Zack confirmed he does **not** own `zackwilde.dev`. The site had it hardcoded in several public-facing spots; all are now switched to the Netlify URL:
  - `index.html`: `og:url`, `og:image`, `twitter:image`, `<link rel="canonical">`, and JSON-LD `url`.
  - `sitemap.xml`: both `<loc>` entries.
  - `robots.txt`: the `Sitemap:` line.
  - `README.md`: removed the stale "connect the custom domain `zackwilde.dev`" deploy note.
  - The resume contact line already correctly used `zackwilde-dev.netlify.app` — left as-is.
  - Remaining `zackwilde.dev` strings are only the local folder name (`D:\Apps\zackwilde.dev`) and the `README.md` H1 title — neither is a URL, both harmless.

## Second pass (Claude) — resume/portfolio strengthening

Goal was three things Zack asked for after a critique: (1) make the best projects viewable, (2) add real outcomes/proof, (3) give every project a case study.

- **Live FinTrack demo (item 1).** FinTrack (`D:\Apps\Finance Dashboard`) has a `loginAsDemo()` path and falls back to mock auth + localStorage + six months of seeded mock data when no Supabase env is present. Built it with `npx vite build --base=/demos/fintrack/` (no Supabase env) and copied `dist/*` into `demos/fintrack/`. Added `basename={import.meta.env.BASE_URL}` to that project's `src/main.jsx` so its `BrowserRouter` works under the subpath (harmless at root). Added a Netlify SPA redirect (`/demos/fintrack/* -> /demos/fintrack/index.html`, 200) in `netlify.toml`. Verified end-to-end with a headless browser: `/demos/fintrack/` redirects to the login screen, "Try Demo" lands on the full dashboard with charts. `index.html` FinTrack link is now **Live demo** -> `demos/fintrack/` (was "Demo available on request").
- **Outcomes/proof (item 2).** All claims verified against the actual repos before writing — no invented metrics. FinTrack: **7 Postgres tables, 9 RLS policies** (counted in `supabase/migrations/...sql`); resume + site bullets and the FinTrack "Proof" fact now say so. Daily 60: Claude API key server-side, multi-strategy JSON extraction, GitHub Actions CI (typecheck + Vitest on both services, confirmed in `Daily Sixty/.github/workflows/ci.yml`), Android closed-testing with Play Store metadata. Mirrored into `Zack_Wilde_Resume.md`, `resume/resume.html`, regenerated `Zack_Wilde_Resume.pdf` (still **one page**, page-count verified).
- **Case studies (item 3).** Added Problem/Constraints/Architecture/Tradeoff/Testing/Outcome `<details class="case-study">` blocks to FinTrack, Kakebo, Wilde Digital, and Luxury Solutions in `index.html`, matching the existing Daily 60 one (reuses existing `.case-study` styles). FinTrack has no test suite — its "Testing" row describes in-browser QA, not Vitest. Wilde Digital genuinely has Node test scripts (`tests/*.test.mjs`) so its row cites them.
- **Still Zack's to do for full viewability:** Daily 60 is a native Expo app and can't be a web demo. It still says "Mobile build available on request." Best next step is a 30–60s screen recording or an APK/Play closed-test link — that's the one piece I couldn't automate.

## Important notes for Codex

- **The domain is `zackwilde-dev.netlify.app`. Do NOT reintroduce `zackwilde.dev` as a URL anywhere.**
- **Do not change the LinkedIn or GitHub URLs.** `linkedin.com/in/zachary-wilde-5b82222b8` and `github.com/zackwildebusiness-glitch` are Zack's real, confirmed profiles. Leave as-is.
- **Keep resume and portfolio in parity.** If you touch a claim in `index.html`, mirror it in `Zack_Wilde_Resume.md` + `resume/resume.html`, then regenerate the PDF: `powershell -ExecutionPolicy Bypass -File resume/build.ps1`.
- Nothing is committed yet. Working-tree changes this pass: `index.html`, `sitemap.xml`, `robots.txt`, `README.md`, `Zack_Wilde_Resume.md`, `Zack_Wilde_Resume.pdf`, `resume/resume.html`, plus this `handoff.md`.

## Checklist — what's left

- [ ] **REQUIRED — Regenerate `assets/og-image.png`.** It is now stale in TWO ways: it shows **"zackwilde.dev"** (top-right — wrong domain) and the role **"Web Developer"** (now "Full-Stack Developer"). Re-render with `zackwilde-dev.netlify.app` (or no URL) and the **Full-Stack Developer** title. Keep the on-brand look: paper `#f5f7f4`, ink `#111816`, teal `#0f766e`, ZW mark, tech chips, 1200×630.
- [ ] **VERIFY — Spot-check the actual rendered PDF.** `Zack_Wilde_Resume.pdf` was regenerated and is confirmed one page via page-count parsing, but it was not raster-previewed (no `pdftoppm` on this box). Open the PDF and confirm fonts, the rust type labels, and spacing render cleanly with no overflow onto a second page.
- [ ] **DECISION (Zack) — Wilde Digital.** The resume lists **5** Selected Work projects; the site shows **4**. Wilde Digital is the missing one, and there's no screenshot asset for it. Either add it to `index.html` (needs a screenshot + optional live URL) or intentionally leave the portfolio curated at 4. Currently left as-is.
- [ ] **REQUIRED — Commit.** Review and commit the working-tree changes listed above. Keep the static setup; no build step.

## Style Guardrails

- Keep the static setup unless Zack explicitly wants a framework.
- Border radii at 8px or below.
- No decorative gradient blobs or stock-like hero imagery.
- Cards for repeated items and tools only; avoid nesting cards.
- Palette: paper `#f5f7f4`, ink `#111816`, teal `#0f766e`, blue `#315f82`, rust `#a85d3c`.
- Prefer clear project proof over generic personal-brand language.

## Useful Files

- `index.html` — content, metadata, JSON-LD, OG/Twitter tags, portfolio sections.
- `styles.css` — complete responsive styling.
- `script.js` — sticky header, lightbox, copy-email interaction.
- `assets/` — project screenshots, `og-image.png`, `favicon.svg`.
- `resume/resume.html` + `resume/build.ps1` — committed, reproducible resume source. Run the script to regenerate `Zack_Wilde_Resume.pdf`.
- `Zack_Wilde_Resume.md` / `.pdf` — resume linked from nav and contact card.
- `sitemap.xml`, `robots.txt`, `netlify.toml` — deploy/SEO config.
