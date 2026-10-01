# CLAUDE.md

@AGENTS.md

The file above is the primary project guide (architecture, commands, conventions, workflow). This file only adds Claude Code specifics. Task recipes and search patterns: `docs/AI-CODING.md`.

## Commands to run (no lint or deploy script exists)

- Always after code changes: `npm test` and `npm run typecheck`.
- Also `npm run build` for CSS, routing, SEO, `scripts/` or config changes. It regenerates `public/sitemap.xml` (date-only churn; leave it out of your diff unless intended).
- Single test file: `npx vitest run tests/tools.test.ts`.

## Constraints to keep in mind

- CSS is layered with heavy `!important`: before editing styles, search every `src/*.css` for the selector and confirm the winning rule in `dist/assets/*.css` after a build. `src/dark-theme.css` is unused.
- Tool ids are shared across `src/toolRegistry.ts`, the `run()` switch in `src/App.tsx`, `src/seo.ts`, `src/toolSeo.ts`, `src/workflows.ts` and the sitemap script. Tests require unique ids and unique SEO titles/descriptions.
- File tools must stay browser-only (no uploads) and respect `src/resourceLimits.ts`. New external hosts need a `public/_headers` CSP update.
- Default branch is `master`. Do not commit or push unless asked.

## Efficient searching

- Use `git grep -n "<symbol-or-tool-id>"` (skips `node_modules/` and `dist/`) instead of reading files.
- `src/App.tsx`, `src/toolRegistry.ts`, `src/seo.ts`, `src/toolSeo.ts` and `src/siteNavigation.ts` have very long lines: read narrow ranges, e.g. `sed -n 'A,Bp' <file> | cut -c1-300`.
- Skip `package-lock.json`, `public/sitemap.xml` and `docs/superpowers/` (historical plans).

## Claude Code configuration

No `.claude/` settings, custom commands or MCP servers are configured in this repo. Do not assume any exist.
