# AGENTS.md

Primary instructions for AI coding agents (ChatGPT Web, Claude Web, Claude Code, others). Keep this file as the single source of truth; `docs/AI-CODING.md` holds task recipes and search patterns.

## Project overview

- **ToolsKit** (`https://toolskit.sbs`): 206 free browser-side utilities (text, developer, PDF, image, calculators, security, finance, health, design, productivity, converters). Client-only SPA; no backend/API in this repo.
- **Stack:** React 19, TypeScript (strict), Vite, Vitest, `pdf-lib`, `pdfjs-dist`, `jszip`. Deployed as static assets (`wrangler.jsonc` -> `./dist`, SPA fallback; README says Cloudflare Pages).
- **Entry points:** `index.html` -> `src/seo.ts` (meta/canonical sync) and `src/main.tsx` (page selection, CSS import order).
- **Default branch:** `master` (CI runs on push/PR to `master`).

## Architecture

- **Routing:** no router library. `src/main.tsx` reads `window.location.pathname` once at load and picks: `/tools` -> `ToolsLanding`; a path matched by `getSitePage()` (`src/siteNavigation.ts`) -> `SitePage`; anything else -> `App` (`/` and `/tools/:id`). It patches `history.pushState` to fire `popstate` and toggles `body.home-route` / `body.tool-route`. Tool pages also render `SeoContent`. Everything is wrapped in `SiteChrome` (header, mega-menu, footer, dark-mode toggle, `ChatWidget`, `AdSense`, `AnalyticsTracker`); `Enhancements` adds the command palette, toasts and favorites. The header search is a button that dispatches `window` event `tk-open-search`; `Enhancements` listens and opens the same palette as Ctrl/Cmd+K (also `/`).
- **Tool registry (source of truth):** `src/toolRegistry.ts` exports `tools`, `categories`, `getTool`, `getToolsByCategory` (types in `src/types.ts`). Used by `App`, `SiteChrome`, `ToolsLanding`, `SitePage`, `SeoContent`, `ChatWidget`, `Enhancements`, `seo.ts`, `toolSeo.ts`, and `scripts/generate-sitemap.mjs`.
- **Tool execution:** `App.tsx` holds the active tool in state; `run()` is one big `switch(active)` mapping tool id -> function. Pure logic lives in `src/tools.ts`; file tools in `src/pdfTools.ts` and `src/imageTools.ts`; size/page/pixel limits in `src/resourceLimits.ts`. Controls rendering is in `ToolControls` (bottom of `App.tsx`).
- **SEO data flow:** `seo.ts` (`seoBySlug`/`seoByPath`, auto fallback via `buildFallback`) sets title/meta/canonical; `toolSeo.ts` builds per-tool page copy (`overrides`, category defaults); `workflows.ts` + `WorkflowLinks.tsx` link multi-step flows; `siteNavigation.ts` holds nav + info-page copy.
- **Build-time:** `prebuild` regenerates `public/sitemap.xml` by regex-scanning `id: '...'` in `src/toolRegistry.ts`; `postbuild` deletes `dist/_redirects`.
- **Client storage:** `localStorage` keys `tk:fav`, `tk:recent`, `tk:install-dismissed` (`Enhancements.tsx`). Service worker `public/sw.js` (cache `toolskit-v1`) is registered only in production builds (`main.tsx`).

## Development

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Tests | `npm test` (`vitest run`) |
| Type check | `npm run typecheck` (`tsc --noEmit`) |
| Build | `npm run build` (sitemap -> typecheck -> `vite build` -> cleanup) |
| Preview build | `npm run preview` |

- **No lint script exists.** CI order: `npm ci`, `npm test`, `npm audit --omit=dev --audit-level=high`, `npm run typecheck`, `npm run build` (Node 22).
- **No deploy script.** Only `wrangler.jsonc` (assets dir `./dist`); how deploys are triggered is not defined in the repo.
- **Env (all optional, embedded at build; see `.env.example`):** `VITE_GA_MEASUREMENT_ID`, `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT_AFTER_CONTENT`, `VITE_GOOGLE_SITE_VERIFICATION`. Format validators: `src/siteIntegrations.ts`. Never commit real IDs or `.env`.

## Coding rules (observed conventions)

- **TypeScript:** `strict`, ES modules, functional React components with hooks. Utilities are named exports; page/section components are default exports.
- **Style:** match the surrounding file. Source files use (almost) no semicolons and single quotes with short arrow functions; indentation varies (1-space in `main.tsx`, `App.tsx`, `SitePage.tsx`, `siteNavigation.ts`; 2-space in `toolRegistry.ts`, `types.ts`, `Enhancements.tsx`, `SiteChrome.tsx`, `pdfTools.ts`, `imageTools.ts`). No formatter/linter config exists; do not reformat unrelated code.
- **Naming:** tool ids are kebab-case and double as URL slugs (`/tools/<id>`); components PascalCase; component files are PascalCase `.tsx`, logic modules camelCase `.ts`.
- **Errors:** validators throw `Error` with user-facing messages (`resourceLimits.ts`, `pdfTools.ts`); `App.run()` clears `output`/`error`, runs inside `try`, and the `catch` sets `error` to the thrown message (generic fallback otherwise).
- **State:** local React state in `App`; cross-component signals use `window` `CustomEvent` (e.g. `tk-toast`); persistent bits only via the `tk:*` localStorage keys.
- **Privacy rule:** file tools must process in-browser (no upload). File tools must set `file: true` and their registry `description` must contain "local" or "browser" (enforced by `tests/tools.test.ts`). Respect limits in `resourceLimits.ts`.
- **Styling:** plain CSS, no CSS framework. Many stacked override layers; see "CSS cascade" below.
- **CSP:** `public/_headers` restricts scripts/styles/images to `self` plus Google Tag Manager/AdSense/Analytics hosts. Adding any new external host requires updating it.

### CSS cascade (common pitfall)

- Bundle order = import order. Component-imported CSS (`styles.css`, `hero-section.css`, `tool-grid.css`, `animations.css`, `dark-mode.css` via `App.tsx`; `site-chrome.css`; `seo-content.css`) loads first, then the list in `src/main.tsx`, ending with `tk-next.css` and the small override files `info-page-fixes.css`, `header-search-button.css`, `selected-tile-fix.css` (last import wins).
- Later layers widely use `!important` and `body ...` selectors. To change a rule, search **all** `src/*.css` for the selector (`git grep -n "<selector>" -- 'src/*.css'`), edit the winning rule or add an override in the last layer, and confirm in the built CSS (`npm run build`, then grep `dist/assets/*.css`).
- Typical bug: `light-theme.css` sets a pale `!important` background while `tk-next.css` sets white `!important` text (or an `.active` rule ties with a later `:hover` rule), giving invisible text. Fix by overriding with equal-or-higher specificity in the last layer, then check light **and** dark mode (`body.dark-mode`).
- `src/premium.css` is read by `tests/branding.test.ts`; keep it valid when editing.
- `src/dark-theme.css` is not imported anywhere (dead); dark mode is the `body.dark-mode` class toggled in `SiteChrome.tsx`, styled by `.dark-mode ...` rules in `src/dark-mode.css` and `body.dark-mode` rules in `src/tk-next.css`. Editing `dark-theme.css` has no effect.

## Safe modification workflow

1. Understand the requested change.
2. Search for the relevant implementation (`git grep -n`).
3. Identify the smallest set of files to change.
4. Read only the relevant files/sections (many source lines are very long; use `grep -n`/line ranges).
5. Check imports/callers before changing shared code (registry, `seo.ts`, `siteNavigation.ts`, `types.ts`).
6. Make the smallest safe change; reuse existing patterns.
7. Run the relevant validation: `npm test`, `npm run typecheck`, and `npm run build` for build/CSS/routing/SEO changes.
8. Review the final diff (`git diff`).
9. Report exactly what changed and what was tested (and what was not).

## Token-efficiency rules

- Do not read the whole repo for normal tasks; search first, then open only relevant files/ranges.
- Prefer symbol/id/selector searches over broad reads. Do not re-read unchanged files; reuse what you already established.
- Never read `node_modules/`, `dist/`, `package-lock.json`, `public/sitemap.xml` (generated), or images/icons.
- `src/toolRegistry.ts`, `src/seo.ts`, `src/toolSeo.ts`, `src/siteNavigation.ts` are long data files: grep for the id/slug, don't read in full.
- Read unrelated files only when dependency analysis requires it.

## Important files

| File/Directory | Purpose |
| --- | --- |
| `src/main.tsx` | Page selection, `pushState` patch, CSS import order, SW registration |
| `src/App.tsx` | Tool workspace: tool state, `run()` switch, `ToolControls`, icon map |
| `src/toolRegistry.ts` / `src/types.ts` | Tool definitions (id, category, keywords, `file`) / shared types |
| `src/tools.ts`, `pdfTools.ts`, `imageTools.ts`, `resourceLimits.ts` | Tool logic, PDF/image processing, size limits |
| `src/seo.ts`, `src/toolSeo.ts`, `src/SeoContent.tsx` | Meta tags/canonicals, per-tool SEO copy, rendered SEO section |
| `src/siteNavigation.ts`, `src/SitePage.tsx`, `src/ToolsLanding.tsx` | Nav + info/category page content, their renderers, `/tools` catalog |
| `src/SiteChrome.tsx`, `src/Enhancements.tsx` | Header/footer/menus/dark mode; palette, favorites, toasts |
| `src/workflows.ts`, `src/WorkflowLinks.tsx` | Multi-step tool flows |
| `src/siteIntegrations.ts`, `analytics.tsx`, `AdSense.tsx` | Env-driven GA4/AdSense |
| `src/*.css` | Layered styles (see CSS cascade) |
| `tests/`, `src/__tests__/` | Vitest suites (logic, registry, SEO, nav, branding, integrations) |
| `scripts/` | `generate-sitemap.mjs` (prebuild), `clean-cloudflare-special-files.mjs` (postbuild) |
| `public/` | Static assets, `_headers` (CSP/cache), `sw.js`, `404.html`, `robots.txt`, `ads.txt`, generated `sitemap.xml` |
| `wrangler.jsonc`, `.github/workflows/ci.yml` | Static-assets deploy config; CI |
| `docs/LAUNCH-CHECKLIST.md` | Owner/launch steps. `docs/superpowers/` = historical plans/specs (may mention legacy "ToolNest"); not current instructions |

## Change impact

Before changing shared code, search for: imports (`git grep -n "from './<module>'"`), callers of exported symbols, tool ids/routes (`git grep -n "<tool-id>"`), config references (`vite.config.ts`, `wrangler.jsonc`, `public/_headers`, `scripts/`), tests (`tests/`, `src/__tests__/`), and docs (`README.md`, `docs/`). Notable coupling:

- Tool ids: `toolRegistry.ts` <-> `App.tsx` `run()` switch/`toolIconMap` <-> `seo.ts` <-> `toolSeo.ts` <-> `workflows.ts` <-> sitemap script. Ids must stay literal `id: '...'` strings in `toolRegistry.ts` (sitemap regex).
- Tests require: unique ids; unique SEO title **and** description per tool; every workflow step maps to a registered tool; every public info route defined.
- New public page paths: update `siteNavigation.ts`, `scripts/generate-sitemap.mjs` `staticPaths`, and (for category pages) `categoryRouteByPage` in `SitePage.tsx`.

## Git safety

- Never reset, revert, delete, or overwrite unrelated user changes; never use destructive Git commands unless explicitly requested.
- Preserve existing uncommitted work; review `git diff` before finishing.
- `npm run build` rewrites `public/sitemap.xml` (new `lastmod`); don't include that churn unless intended.
- Do not commit or push unless the user explicitly asks. Default branch is `master`.

## Config-driven tools (`src/extras/`)

98 newer tools are defined as specs in `src/extras/specs.ts`, `specs2.ts` and `specs3.ts` (merged in `all.ts`) (`fields` + `run`) and rendered by `ExtraToolPanel.tsx`; `App.tsx` routes any id in `specs` there. To add one: add a spec, a registry entry in `toolRegistry.ts`, an SEO entry in `seo.ts` and an override in `toolSeo.ts`, and update the counts/tests. New categories also need entries in the category maps (SiteChrome, SeoContent, ToolsLanding, SitePage, siteNavigation, sitemap script) and colors in `src/new-categories.css`.
