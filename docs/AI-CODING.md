# AI Coding Reference

Rules and conventions live in [`AGENTS.md`](../AGENTS.md). This file: search patterns, recipes, and commands.

## Before changing code

- **Locate code** with `git grep -n` (ignores `node_modules/`, `dist/`):
  - Tool by id: `git grep -n "json-formatter"`
  - Exported symbol / callers: `git grep -n "getToolSeoProfile"`
  - CSS selector (check every layer): `git grep -n "info-section-number" -- 'src/*.css'`
  - Route/page: `git grep -n "'/about'"`
- **Inspect:** the matching lines/ranges only, the file's imports, and its test (`tests/`, `src/__tests__/`).
- **Do not inspect:** `node_modules/`, `dist/`, `package-lock.json`, generated `public/sitemap.xml`, images. Long data files (`toolRegistry.ts`, `seo.ts`, `toolSeo.ts`, `siteNavigation.ts`) and `App.tsx` have very long lines: grep, then read a narrow range (`sed -n 'A,Bp' file | cut -c1-300`).

## While changing code

- Check dependencies first (see Change impact in `AGENTS.md`).
- Smallest change; reuse existing patterns (registry entry + `run()` case + `tools.ts` function).
- Backward compatibility: keep existing tool ids/URLs (`/tools/<id>`) stable; they feed SEO, sitemap, favorites (`tk:fav`) and recents (`tk:recent`).
- Match the surrounding file's formatting; no formatter exists.

## After changing code

- `npm test` and `npm run typecheck` always; `npm run build` for CSS, routing, SEO, scripts, or config changes (CSS: grep the built `dist/assets/*.css` to confirm the winning rule).
- Review `git diff`; ignore `public/sitemap.xml` date-only churn from builds.
- Report what changed, what ran, and what was not verified (e.g. visual check).

## Common commands

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Test (all) | `npm test` |
| Test (one file) | `npx vitest run tests/tools.test.ts` |
| Type check | `npm run typecheck` |
| Preview production build | `npm run preview` |
| Lint | none configured |
| Deploy | none scripted; `wrangler.jsonc` serves `./dist` as a SPA |

## Recipes

**Add a tool**
1. `src/toolRegistry.ts`: add `{ id: 'kebab-id', name, description, category, keywords }` (file tools: `file: true` and description containing "local" or "browser").
2. Logic: add a pure function to `src/tools.ts` (or `pdfTools.ts` / `imageTools.ts`).
3. `src/App.tsx`: add `case 'kebab-id':` in `run()`; add a `toolIconMap` entry if wanted; add inputs in `ToolControls`/control lists if it needs options.
4. SEO: a fallback is generated automatically. If adding a custom `seoBySlug` entry in `src/seo.ts`, title and description must stay unique across all tools. Optional copy: `overrides` in `src/toolSeo.ts`; optional flow: `src/workflows.ts`.
5. Add tests; run `npm test`, `npm run typecheck`, `npm run build` (sitemap regenerates).

**Add/change an info page:** edit `sitePages` in `src/siteNavigation.ts` (and `primaryNavigation` if in the header); update `staticPaths` in `scripts/generate-sitemap.mjs`; category pages also need `categoryRouteByPage` in `src/SitePage.tsx`.

**Change styling:** find all rules for the selector across `src/*.css`; later layers (`light-theme.css`, `site-system.css`, `tk-next.css`, `info-page-fixes.css`) usually win via `!important`/`body` prefix.

**Change analytics/ads/env:** `src/siteIntegrations.ts` (validators), `src/analytics.tsx`, `src/AdSense.tsx`, `.env.example`, and `public/_headers` CSP for any new host.
