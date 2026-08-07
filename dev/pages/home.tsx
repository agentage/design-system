import { Badge, Button, Heading, Kbd, StatCard } from '../../src';
import { Code } from '../components/code';
import { Link } from '../lib/router';
import { ALL_COMPONENTS, CATEGORIES } from '../registry';
import { COMPONENT_PROPS } from '../generated/props';

const documented = ALL_COMPONENTS.flatMap(({ component }) => component.exports).filter(
  (name) => name in COMPONENT_PROPS
).length;

export const HomePage = () => (
  <div className="space-y-8">
    <div className="flex items-start justify-between gap-4">
      <Heading
        as="h1"
        description="OKLCH design tokens and React components, shared by the agentage dashboard, admin console and public sites."
      >
        Agentage Design System
      </Heading>
      <Badge variant="secondary" className="mt-1 shrink-0 font-mono">
        v{__DS_VERSION__}
      </Badge>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard title="Components" value={ALL_COMPONENTS.length} description="Documented pages" />
      <StatCard title="Categories" value={CATEGORIES.length} description="Browse by area" />
      <StatCard
        title="Prop tables"
        value={documented}
        description="Generated from the sources at build time"
      />
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <Link to="/install">
        <Button>Get started</Button>
      </Link>
      <Link to="/theming">
        <Button variant="outline">Theming</Button>
      </Link>
      <span className="text-sm text-muted-foreground">
        or press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to jump to any component
      </span>
    </div>

    <Code language="bash" code="npm install @agentage/design-system" />

    <section className="space-y-4" data-section="Categories">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Categories
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/components/${category.slug}`}
            className="rounded-lg border border-border bg-sidebar p-5 transition-colors hover:border-muted-foreground"
          >
            <p className="font-semibold text-foreground">{category.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {category.components.length} components
            </p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);
