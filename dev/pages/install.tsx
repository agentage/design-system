import { Alert, Badge, Heading, InlineCode, Prose } from '../../src';
import { Code } from '../components/code';

const INSTALL = `npm install @agentage/design-system`;

const THEME_IMPORT = `// app/layout.tsx (or your root entry)
import '@agentage/design-system/theme.css';`;

const TAILWIND_SOURCE = `/* globals.css - Tailwind v4, CSS-first config */
@import 'tailwindcss';
@import '@agentage/design-system/theme.css';

/* Tailwind must scan the SHIPPED JS, not the source, or every
   design-system class is tree-shaken out of your build. The path is the
   hoisted root of your install - not ./node_modules of a workspace package. */
@source "../../node_modules/@agentage/design-system/dist/**/*.js";`;

const RSC = `// Server component - fine, Card is server-safe.
import { Card, CardHeader, CardTitle } from '@agentage/design-system/card';

// Interactive components already carry 'use client' as line 1,
// so importing them from a server component works unchanged.
import { Modal } from '@agentage/design-system/modal';`;

export const InstallPage = () => (
  <div className="space-y-8">
    <div className="flex items-start justify-between gap-4">
      <Heading
        as="h1"
        description="Install the package, load the theme, point Tailwind at the shipped bundle."
      >
        Getting started
      </Heading>
      <Badge variant="secondary" className="mt-1 shrink-0 font-mono">
        v{__DS_VERSION__}
      </Badge>
    </div>

    <section className="space-y-3" data-section="Install">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">Install</h2>
      <Code language="bash" code={INSTALL} />
      <p className="text-sm text-muted-foreground">
        Peers: React 19+, React DOM 19+. Tailwind CSS 4+ is an optional peer - the components carry
        Tailwind utility classes, so you need it unless you ship your own compiled CSS.
      </p>
    </section>

    <section className="space-y-3" data-section="Theme">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Load the theme
      </h2>
      <Code language="typescript" code={THEME_IMPORT} />
      <p className="text-sm text-muted-foreground">
        <InlineCode>theme.css</InlineCode> composes the OKLCH primitives, the semantic tokens and
        the base resets. Import it once, at the root.
      </p>
    </section>

    <section className="space-y-3" data-section="Tailwind">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Tailwind @source
      </h2>
      <Code language="css" code={TAILWIND_SOURCE} />
      <Alert variant="warning">
        The glob must resolve to where npm actually hoisted the package. In a workspace that is the
        repo-root <InlineCode>node_modules</InlineCode>, not the package-local one - the most common
        cause of &ldquo;the components render unstyled&rdquo;.
      </Alert>
    </section>

    <section className="space-y-3" data-section="RSC">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Server components
      </h2>
      <Code language="typescript" code={RSC} />
      <Prose className="max-w-none text-sm">
        <ul>
          <li>
            Every interactive component ships <InlineCode>&apos;use client&apos;</InlineCode> as
            line 1, preserved through the build. You never add the directive yourself.
          </li>
          <li>
            No server-safe module transitively imports a client module, so importing{' '}
            <InlineCode>Card</InlineCode> never drags a client boundary into your server tree.
          </li>
          <li>
            The build emits one file per source module, each with its own{' '}
            <InlineCode>.d.ts</InlineCode>. Import from a subpath to keep that granularity; the
            barrel works too but pulls the whole graph.
          </li>
        </ul>
      </Prose>
    </section>
  </div>
);
