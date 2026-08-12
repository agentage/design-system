# CLAUDE.md — @agentage/design-system

Single source of truth for the Agentage design system (OKLCH tokens + React components). Standalone repo since 2026-07; was previously duplicated as a `packages/design-system` copy inside both `agentage/web` and `agentage/landing`, which silently diverged on the same version. Consumers migrate to the published npm package.

## Layout

- `src/components` — React components, barrel-exported from `src/index.ts`. Interactive ones carry `'use client'` as line 1.
- `src/styles` — OKLCH CSS: `primitives.css` (raw scales) → `tokens.css` (semantic) → `base.css` (resets), composed by `theme.css`.
- `src/lib` — `cn` + helpers.
- `dev/` — the docs site (`npm run dev`, :5174), deployed to ds.agentage.io. Not published, not linted, but type-checked (`tsconfig.dev.json`). Structure: `app.tsx` shell (header + sidebar + routed outlet) · `lib/router.tsx` hand-rolled History-API router (no react-router; nginx and `vite preview` both fall back to `index.html`) · `registry.tsx` the catalog every page, the sidebar and ⌘K read from · `demos/<slug>.tsx` one demo per component · `pages/` component/category/home/install/theming · `components/` docs-only widgets · `generated/props.ts` (do not hand-edit).
- Routes: `/`, `/install`, `/theming`, `/components`, `/components/:category`, `/components/:category/:component`. Adding a component = add a `demos/` file + one `registry.tsx` entry; the sidebar, the index page, ⌘K and the e2e a11y sweep all pick it up automatically.

## Build / verify

- `npm run build` — `tsc --noEmit` + Vite lib build. Output is **one file per source module** (`rollupOptions.output.preserveModules`), each with its own `.d.ts` beside it (vite-plugin-dts, no `rollupTypes`). Runtime `dependencies` are external so their own client boundaries survive.
- `npm run build:showcase` — `props:generate` + Vite static build of the `dev/` docs site → `dist-showcase/` (deployed to ds.agentage.io).
- `npm run props:generate` — regenerates `dev/generated/props.ts` (prop tables + export→subpath map) from the component sources via the TypeScript checker. Run it after changing any public props type; `build:showcase` runs it anyway, so a stale file can never deploy. (react-docgen-typescript was tried and mis-resolved 15 of 68 components in files that export several components next to cva variants.)
- `npm run verify` — type-check (src + dev + e2e) + lint + format:check + exports:check + test:coverage + build (CI runs this on PR + push). Coverage floor is 70% lines/functions/branches/statements over `src/`.
- `npm run test:e2e` — Playwright against the built showcase (`build:showcase` → `vite preview` :4173 → chromium): axe WCAG A/AA sweep of every component page in both themes (one test per category, client-side navigation so the whole surface stays gated in ~1.6 min) + routing/search/props assertions + 11 screenshot baselines. Runs as its own CI job inside `mcr.microsoft.com/playwright:v1.62.1-noble`. **Regenerate baselines in that same image**, never on the host — font metrics must match: `docker run --rm --ipc=host -v "$PWD":/work -w /work -u "$(id -u):$(id -g)" -e HOME=/tmp mcr.microsoft.com/playwright:v1.62.1-noble npx playwright test --update-snapshots`.
- Exports: `.` (barrel), `./<component>` per module, `./theme.css`, `./primitives.css`, `./styles/*.css`, `./package.json`. `files` ships `dist` + `src/styles`.
- The exports map is generated — `npm run exports:generate` after adding/renaming a component; `exports:check` fails `verify` when it drifts.

## RSC contract

- Any component using client-only React (state, effects, refs, context, portals, DOM/browser APIs) MUST start with `'use client';`. `useId` / `useMemo` / `useCallback` / `forwardRef` / `memo` exist in React's server build, so they alone do not require the directive.
- Attaching a DOM event handler (`onClick`, `onChange`, `onKeyDown`, …) also requires it, even in a hook-free component — a server component cannot pass a function prop to the DOM.
- Rolldown (Vite 8) preserves module-level directives under `preserveModules` — no extra plugin needed. Keep `'use client'` as **line 1**.
- Invariant: no server-safe module may transitively import a client module. `dist/components/card.js` → `dist/lib/utils.js` and nothing else.

## Publish

- npm, public, `--provenance`. Release-gated via `.github/workflows/publish.yml`: bump `package.json` version in a `chore(release): vX` commit (or `workflow_dispatch`). Needs `NPM_TOKEN` secret.

## Deploy (showcase → ds.agentage.io)

- LIVE at https://ds.agentage.io since 2026-08-06. The `dev/` showcase deploys as its own Swarm stack (`agentage-ds`) behind Traefik on the main prod box. Dockerfile builds the static SPA → nginx-unprivileged; `docker-compose.yml` carries the Traefik labels; `.github/workflows/deploy.yml` builds → smokes → deploys on push to master.
- Production-only (the platform-wide dev env was removed 2026-07-30). Gated on `vars.DEPLOY_ENABLED == 'true'` + the `production` environment (`vars.SITE_FQDN`, `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USER`).
- Container healthcheck must probe `127.0.0.1`, not `localhost` — nginx binds IPv4 only; busybox wget picks `::1`.
- Post-deploy verification lives in `scripts/verify-deploy.sh` (estate standard, same shape as auth/dashboard): it asserts `https://${SITE_FQDN}/health` reports **this** commit before checking that the page renders. A content grep alone is fail-open — on a failed rollout Swarm keeps the old task serving and the grep still matches.

## Conventions

- Node 22+, TS strict, ESM, React 19 peer. Prettier (single quotes, 100 cols). No `any`.
- Tests: vitest + jsdom + Testing Library (`vitest.setup.ts`); add a test file when fixing/adding interactive behavior.
- Never edit on master — feature branch + PR.
- Keep component files small; barrel-export new components from `src/index.ts`.
