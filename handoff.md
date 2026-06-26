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
- **Still Zack's to do for full viewability:** Daily 60 is a native Expo app and can't be a web demo. It still says "Mobile build available on request." Best next step is a 30–60s screen recording or an APK/Play closed-test link — that's the one piece I couldn't automate. *(Resolved in the third pass — see below.)*

## Third pass (Claude) — deploy fix + live Daily 60 demo

Triggered by Zack asking "why is the update not pushed to Netlify." Root cause + three deliverables.

- **Deploy mechanism (root cause).** The site is **not** wired to GitHub continuous deployment — it publishes via the **Netlify CLI**. `git push` puts code on GitHub but never updates the live site; the previous pass's commit only went live because someone ran a manual deploy. Pushed `b15aa94`, then deployed with `npx netlify deploy --prod --dir .` (authed as zackwildebusiness@gmail.com, linked via `.netlify/state.json`). **This is now the required deploy step — see Important notes.**
- **Live Daily 60 demo (closes the old viewability gap).** Exported the Expo app (`D:\Apps\Daily Sixty\mobile`) to web and serve it self-contained at `demos/daily60/`, mirroring the FinTrack demo. The browser build runs with **no backend and no secret**: native MMKV is swapped for `localStorage` (`store/storage.web.ts`), and the secret-protected AI backend is replaced by canned, goal-aware content (`lib/api.web.ts`) — Metro auto-resolves the `.web.ts` files, native iOS/Android builds are untouched. Added a Netlify SPA redirect (`/demos/daily60/* -> /demos/daily60/index.html`, 200) and a **Live demo** link on the Daily 60 card. Verified end-to-end in a headless browser (0 console errors): onboarding → category → goal → plan generation → dashboard all work, persistence holds. Portfolio commit `1f7ffad`.
- **Category screen compacted.** Zack disliked having to scroll on the create/category screen. Replaced the viewport-scaling `aspectRatio` cards with fixed-height (118px) cards, tightened the header, and centered the content in a 480px max-width column. Verified no scroll at 1366×768 and 390×844. Portfolio commit `93c2002`.
- **Daily 60 source changes are in the separate `D:\Apps\Daily Sixty` repo**, committed **locally only** (`e03d581` web support, `1d833fe` category) — **not pushed** to that repo's remote, since it has unrelated pre-existing uncommitted work I left alone.

## Important notes for Codex

- **Deploys are via the Netlify CLI, NOT git.** `git push` does not update the live site. After committing/pushing, you MUST run `npx netlify deploy --prod --dir .` from the repo root to publish. The CLI is authed as zackwildebusiness@gmail.com and linked via `.netlify/state.json` (gitignored).
- **CLI deploys publish the working directory, not a git snapshot.** So uncommitted working-tree changes go live. Keep the working tree clean before deploying, or you'll ship things that aren't in git (this already happened — see the FinTrack item in the checklist).
- **The domain is `zackwilde-dev.netlify.app`. Do NOT reintroduce `zackwilde.dev` as a URL anywhere.**
- **Do not change the LinkedIn or GitHub URLs.** `linkedin.com/in/zachary-wilde-5b82222b8` and `github.com/zackwildebusiness-glitch` are Zack's real, confirmed profiles. Leave as-is.
- **Keep resume and portfolio in parity.** If you touch a claim in `index.html`, mirror it in `Zack_Wilde_Resume.md` + `resume/resume.html`, then regenerate the PDF: `powershell -ExecutionPolicy Bypass -File resume/build.ps1`.
- `main` is at `93c2002`, pushed and deployed. Current portfolio commit chain this session: `b15aa94` (passes 1–2) → `1f7ffad` (Daily 60 demo) → `93c2002` (category compact).

## Checklist — what's left

Ordered by priority.

- [ ] **CONSIDER — Daily 60 demo uses canned AI responses.** The web demo's plan/action/reflection text is mocked (`lib/api.web.ts`), lightly goal-aware but not real model output — the right call, since the real backend needs a secret that can't ship publicly. Fine for a portfolio demo (FinTrack runs on seeded data too). Only revisit if Zack wants genuinely live AI in the demo, which would require a public, rate-limited proxy (added cost/abuse risk — not recommended).

### Codex follow-up

- [x] **FinTrack demo reconciled in portfolio working tree** — the no-login demo rebuild is now the intended `demos/fintrack/` output (`index-CI_6Jr2t.js` referenced from `index.html`; old `index-BokvPve0.js` removed).
- [x] **OG image regenerated** — `assets/og-image.png` is 1200×630 and uses `zackwilde-dev.netlify.app`, "Full-Stack Developer", the ZW mark, requested colors, and tech chips.
- [x] **Resume PDF raster spot-check** — rendered `Zack_Wilde_Resume.pdf` page 1 with PyMuPDF at 2× scale; it is one page, fonts render, rust labels render, and the FinTrack/Daily 60 bullets fit.
- [x] **FinTrack source basename checked** — `D:\Apps\Finance Dashboard\src\main.jsx` contains `basename={import.meta.env.BASE_URL}`. That repo remains intentionally uncommitted because it has a much larger dirty source tree.
- [ ] **Optional external repo push still open** — `D:\Apps\Daily Sixty` is ahead of `origin/master` by 3 commits and also has unrelated dirty files. Push only after deciding those local app-repo commits should be published.

### Done (do not redo)

- [x] **Push & deploy** — `b15aa94` pushed; site published via Netlify CLI (`npx netlify deploy --prod`). FinTrack demo confirmed live.
- [x] **Daily 60 viewability** — now a **live web demo** at `/demos/daily60/` (Live demo link on the card). This closes the old "REQUIRED — Daily 60 viewability" item; a screen recording / APK is no longer needed.
- [x] **Category screen scroll** — compacted to fit one screen (`93c2002`), verified across desktop + phone viewports.
- [x] **Commit** — passes 1–2 landed as `b15aa94`.
- [x] **Wilde Digital parity** — resume and site both show all **5** Selected Work projects with screenshots and live links.
- [x] **Live FinTrack demo / case studies / outcome proof** — see "Second pass" section above.

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
- `sitemap.xml`, `robots.txt`, `netlify.toml` — deploy/SEO config (SPA redirects for both demos live here).
- `demos/fintrack/` — built FinTrack SPA (source: `D:\Apps\Finance Dashboard`).
- `demos/daily60/` — built Daily 60 Expo web export (source: `D:\Apps\Daily Sixty\mobile`). Rebuild steps are in the checklist.
