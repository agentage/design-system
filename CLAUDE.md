# CLAUDE.md — @agentage/design-system

Single source of truth for the Agentage design system (OKLCH tokens + React components). Standalone repo since 2026-07; was previously duplicated as a `packages/design-system` copy inside both `agentage/web` and `agentage/landing`, which silently diverged on the same version. Consumers migrate to the published npm package.

## Layout

- `src/components` — React components, barrel-exported from `src/index.ts`. Interactive ones carry `'use client'` as line 1.
- `src/styles` — OKLCH CSS: `primitives.css` (raw scales) → `tokens.css` (semantic) → `base.css` (resets), composed by `theme.css`.
- `src/lib` — `cn` + helpers.
- `dev/` — Vite showcase playground (`npm run dev`, :5174). Not published, not linted.

## Build / verify

- `npm run build` — `tsc --noEmit` + Vite lib build. Output is **one file per source module** (`rollupOptions.output.preserveModules`), each with its own `.d.ts` beside it (vite-plugin-dts, no `rollupTypes`). Runtime `dependencies` are external so their own client boundaries survive.
- `npm run build:showcase` — Vite static build of the `dev/` playground → `dist-showcase/` (deployed to ds.agentage.io).
- `npm run verify` — type-check + lint + format:check + exports:check + test + build (CI runs this on PR + push).
- Exports: `.` (barrel), `./<component>` per module, `./theme.css`, `./primitives.css`, `./styles/*.css`, `./package.json`. `files` ships `dist` + `src/styles`.
- The exports map is generated — `npm run exports:generate` after adding/renaming a component; `exports:check` fails `verify` when it drifts.

## RSC contract

- Any component using client-only React (state, effects, refs, context, portals, DOM/browser APIs) MUST start with `'use client';`. `useId` / `useMemo` / `useCallback` / `forwardRef` / `memo` exist in React's server build, so they alone do not require the directive.
- Rolldown (Vite 8) preserves module-level directives under `preserveModules` — no extra plugin needed. Keep `'use client'` as **line 1**.
- Invariant: no server-safe module may transitively import a client module. `dist/components/card.js` → `dist/lib/utils.js` and nothing else.

## Publish

- npm, public, `--provenance`. Release-gated via `.github/workflows/publish.yml`: bump `package.json` version in a `chore(release): vX` commit (or `workflow_dispatch`). Needs `NPM_TOKEN` secret.

## Deploy (showcase → ds.agentage.io)

- LIVE at https://ds.agentage.io since 2026-08-06. The `dev/` showcase deploys as its own Swarm stack (`agentage-ds`) behind Traefik on the main prod box. Dockerfile builds the static SPA → nginx-unprivileged; `docker-compose.yml` carries the Traefik labels; `.github/workflows/deploy.yml` builds → smokes → deploys on push to master.
- Production-only (the platform-wide dev env was removed 2026-07-30). Gated on `vars.DEPLOY_ENABLED == 'true'` + the `production` environment (`vars.SITE_FQDN`, `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USER`).
- Container healthcheck must probe `127.0.0.1`, not `localhost` — nginx binds IPv4 only; busybox wget picks `::1`.

## Conventions

- Node 22+, TS strict, ESM, React 19 peer. Prettier (single quotes, 100 cols). No `any`.
- Tests: vitest + jsdom + Testing Library (`vitest.setup.ts`); add a test file when fixing/adding interactive behavior.
- Never edit on master — feature branch + PR.
- Keep component files small; barrel-export new components from `src/index.ts`.
