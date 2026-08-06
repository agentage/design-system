# @agentage/design-system

The Agentage design system — OKLCH design tokens + a React component library shared across the Agentage web dashboard, landing site, and showcase.

Previously vendored as a package copy inside both the `web` and `landing` monorepos; this repo is the single source of truth (the copies had silently diverged on the same version number).

## Install

```bash
npm install @agentage/design-system
```

Peer dependencies: `react` / `react-dom` >= 19, and `tailwindcss` >= 4 (optional — only needed if you consume the token layer).

## Usage

Components (tree-shakeable ES module):

```tsx
import { Button, Card, Alert } from '@agentage/design-system';
```

### React Server Components

Every interactive component ships `'use client'` as the first line of its emitted module, and the build
preserves one output file per source module — so the barrel above is safe to import from a React Server
Component: only the components you actually use that need the client runtime cross the boundary.

Per-component subpaths are also exported, for consumers that want to keep the RSC graph explicit:

```tsx
import { Card } from '@agentage/design-system/card'; // server component
import { Tabs } from '@agentage/design-system/tabs'; // 'use client'
```

Design tokens (OKLCH color scales + semantic tokens) as CSS — import once at your app root:

```css
@import '@agentage/design-system/theme.css';
```

`theme.css` pulls in `primitives.css` (raw OKLCH scales), `tokens.css` (semantic tokens, typography, shadows), and `base.css` (element resets). `primitives.css` is also exported standalone.

## Develop

```bash
npm install
npm run dev      # component showcase (Vite) on :5174
npm run verify   # type-check + lint + format + test + build
```

- `src/components` — the components (barrel-exported from `src/index.ts`; add `'use client'` as line 1 to any component that uses client-only React — state, effects, refs, context, DOM APIs)
- `src/styles` — the OKLCH token + base-style CSS
- `src/lib` — `cn` and helpers
- `dev/` — the Vite showcase playground

## Release

Publishing to npm is release-gated (`.github/workflows/publish.yml`):

1. Bump `version` in `package.json` with a commit like `chore(release): v0.3.1` (or run the workflow via **workflow_dispatch**).
2. On merge to `master` the workflow runs `verify`, then `npm publish --access public --provenance`, and tags the release.

Requires an `NPM_TOKEN` repo secret with publish rights to the `@agentage` scope.
