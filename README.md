# @agentage/design-system

![Agentage Design System - OKLCH tokens + 60+ React components, ready to install](https://github.com/agentage/design-system/raw/master/docs/banner.svg)

OKLCH design tokens and 60+ accessible React 19 components in one package. Install it, import
the theme, and you have a coherent dark/light UI kit - buttons through data tables, stat cards,
command palettes and docs layouts.

Browse every component live at **[ds.agentage.io](https://ds.agentage.io)**.

## What is this?

The design system behind the Agentage dashboard, admin console and public sites, published as a
plain npm package so anything can use it.

It is deliberately unopinionated about your framework. It ships **standard ESM with one file per
component**, so tree-shaking works, and every interactive component already carries `'use client'`,
so it drops into a Next.js App Router server tree without wrappers or `dynamic()` tricks. Colors
are defined in [OKLCH](https://oklch.com), so the light and dark themes are perceptually matched
rather than hand-tuned, and contrast holds up under WCAG AA.

## Get started

### 1. Install

```bash
npm install @agentage/design-system
```

Peers: `react` and `react-dom` >= 19. `tailwindcss` >= 4 is an optional peer - the components
carry Tailwind utility classes, so you need it unless you ship your own compiled CSS.

### 2. Load the theme

```tsx
// app/layout.tsx (or your root entry)
import '@agentage/design-system/theme.css';
```

### 3. Point Tailwind at the shipped bundle

```css
/* globals.css - Tailwind v4, CSS-first config */
@import 'tailwindcss';
@import '@agentage/design-system/theme.css';

@source "../../node_modules/@agentage/design-system/dist/**/*.js";
```

> Tailwind must scan the **shipped JS**, not the source, or every design-system class is
> tree-shaken out of your build. The glob has to resolve to wherever npm actually hoisted the
> package - in a workspace that is the repo-root `node_modules`, not the package-local one. This
> is the single most common cause of "the components render unstyled".

### 4. Use it

```tsx
import { Button, Card, CardHeader, CardTitle, StatCard } from '@agentage/design-system';

export const Panel = () => (
  <Card>
    <CardHeader>
      <CardTitle>Memories</CardTitle>
    </CardHeader>
    <StatCard title="Stored" value="12,480" progress={64} />
    <Button>Open</Button>
  </Card>
);
```

Full walkthrough: [ds.agentage.io/install](https://ds.agentage.io/install).

## What's in it

62 documented component pages across eight areas, each with props generated from the source:

| Area                                                                | What's there                                                                                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Foundations](https://ds.agentage.io/components/foundations) (6)    | Button, Badge, Card, Avatar, loading states, Separator                                                                       |
| [Data Display](https://ds.agentage.io/components/data-display) (10) | Table, DataTable, EntityList, StatCard, Pagination, EmptyState, StatusDot, CodeBlock, Progress, UsageMeter                   |
| [Cards](https://ds.agentage.io/components/cards) (7)                | Gauge, donut, score, funnel, heatmap, multi-stat and ranked-list cards                                                       |
| [Forms](https://ds.agentage.io/components/forms) (8)                | Input, Label, Checkbox, RadioGroup, Slider, Combobox, DatePicker, ToggleGroup                                                |
| [Feedback](https://ds.agentage.io/components/feedback) (13)         | Alert, Toast, Tooltip, Modal, AlertDialog, Sheet, DropdownMenu, ContextMenu, Popover, HoverCard, Command palette, DangerZone |
| [Layout](https://ds.agentage.io/components/layout) (5)              | PageHeader, Section, Sidebar, Resizable panels, ScrollArea                                                                   |
| [Navigation](https://ds.agentage.io/components/navigation) (7)      | Breadcrumb, Tabs, Heading, Prose, Kbd, Collapsible, Accordion                                                                |
| [Site & Docs](https://ds.agentage.io/components/site-docs) (6)      | Markdown, CopyButton, Chip, Footer, TopBar, DocSidebar                                                                       |

Those 62 pages cover 152 exported components once composable parts (`CardHeader`, `TableRow`,
`CommandItem` and friends) are counted, plus focus-trap, scroll-lock and anchor-positioning hooks. Every one
has a per-component subpath in the [exports map](./package.json).

## Server components

Every interactive component ships `'use client'` as line 1 of its emitted module, and the build
preserves one output file per source module. So the barrel is safe to import from a React Server
Component - only the components you actually use that need the client runtime cross the boundary.

```tsx
import { Card } from '@agentage/design-system/card'; // server-safe
import { Modal } from '@agentage/design-system/modal'; // 'use client', already declared
```

No server-safe module transitively imports a client module, so importing `Card` never drags a
client boundary into your server tree. Per-component subpaths exist for consumers who want to keep
that graph explicit; the barrel works too.

## Theming

Three tiers, composed by `theme.css`:

| Layer            | Import                                   | What it holds                                       |
| ---------------- | ---------------------------------------- | --------------------------------------------------- |
| `primitives.css` | `@agentage/design-system/primitives.css` | Raw OKLCH scales - 11 stops each, theme-independent |
| `tokens.css`     | via `theme.css`                          | Semantic tokens, typography, shadows                |
| `base.css`       | via `theme.css`                          | Element resets                                      |

Dark is the default. Switch with one attribute on `<html>`:

```tsx
document.documentElement.setAttribute('data-theme', 'light'); // dark | light | system
```

`system` follows `prefers-color-scheme`. Override any semantic token in your own CSS to rebrand
without forking - see [ds.agentage.io/theming](https://ds.agentage.io/theming).

## Requirements

| Requirement | Version | Note                                                |
| ----------- | ------- | --------------------------------------------------- |
| React       | >= 19   | Peer, required                                      |
| React DOM   | >= 19   | Peer, required                                      |
| Tailwind    | >= 4    | Optional peer - needed unless you ship your own CSS |
| Node        | >= 22   | Build/dev only; the package itself is browser code  |

Ships ESM only, with a `.d.ts` beside every module.

## Develop

```bash
npm install
npm run dev       # component showcase (Vite) on :5174
npm run verify    # type-check + lint + format + exports:check + test + build
npm run test:e2e  # Playwright: axe WCAG A/AA scan + screenshot baselines
```

- `src/components` - the components, barrel-exported from `src/index.ts`. Add `'use client'` as
  line 1 to anything using state, effects, refs, context, portals, DOM APIs or event handlers.
- `src/styles` - the OKLCH token and base-style CSS.
- `src/lib` - `cn` and helpers.
- `dev/` - the showcase deployed to ds.agentage.io.

Run `npm run exports:generate` after adding or renaming a component; `exports:check` fails
`verify` when the exports map drifts.

Regenerate Playwright screenshot baselines inside the CI image, never on the host - font metrics
must match:

```bash
docker run --rm --ipc=host -v "$PWD":/work -w /work -u "$(id -u):$(id -g)" -e HOME=/tmp \
  mcr.microsoft.com/playwright:v1.62.1-noble npx playwright test --update-snapshots
```

## Release

Publishing is release-gated (`.github/workflows/publish.yml`): bump `version` in `package.json`
with a `chore(release): vX.Y.Z` commit (or run the workflow via **workflow_dispatch**). On merge
to `master` the workflow runs `verify`, then `npm publish --access public --provenance`, and tags
the release.

## Contributing

Issues and PRs welcome at
[github.com/agentage/design-system](https://github.com/agentage/design-system). Branch off
`master`, keep `npm run verify` green, and add a test when you change interactive behavior.

## License

MIT - see [LICENSE](./LICENSE).
