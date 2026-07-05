# CLAUDE.md — @agentage/design-system

Single source of truth for the Agentage design system (OKLCH tokens + React components). Standalone repo since 2026-07; was previously duplicated as a `packages/design-system` copy inside both `agentage/web` and `agentage/landing`, which silently diverged on the same version. Consumers migrate to the published npm package.

## Layout

- `src/components` — React components, barrel-exported from `src/index.ts`.
- `src/styles` — OKLCH CSS: `primitives.css` (raw scales) → `tokens.css` (semantic) → `base.css` (resets), composed by `theme.css`.
- `src/lib` — `cn` + helpers.
- `dev/` — Vite showcase playground (`npm run dev`, :5174). Not published, not linted.

## Build / verify

- `npm run build` — `tsc --noEmit` + Vite lib build (ES + rolled-up `.d.ts` via vite-plugin-dts).
- `npm run build:showcase` — Vite static build of the `dev/` playground → `dist-showcase/` (deployed to ds.agentage.io).
- `npm run verify` — type-check + lint + format:check + test + build (CI runs this on PR + push).
- Exports: `.` (JS), `./theme.css`, `./primitives.css`. `files` ships `dist` + `src/styles`.

## Publish

- npm, public, `--provenance`. Release-gated via `.github/workflows/publish.yml`: bump `package.json` version in a `chore(release): vX` commit (or `workflow_dispatch`). Needs `NPM_TOKEN` secret.

## Deploy (showcase → ds.agentage.io)

- The `dev/` showcase deploys as its own Swarm stack (`agentage-ds`) behind Traefik, dev + prod, mirroring `agentage/landing`. Dockerfile builds the static SPA → nginx-unprivileged; `docker-compose.yml` carries the Traefik labels; `.github/workflows/deploy.yml` builds → smokes → deploys on push to master.
- Gated on `vars.DEPLOY_ENABLED == 'true'` + the `development`/`production` environments. Each env sets `vars.SITE_FQDN` (`dev.ds.agentage.io` / `ds.agentage.io`); needs `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USER` secrets + DNS for the hosts.

## Conventions

- Node 22+, TS strict, ESM, React 19 peer. Prettier (single quotes, 100 cols). No `any`.
- Never edit on master — feature branch + PR.
- Keep component files small; barrel-export new components from `src/index.ts`.
