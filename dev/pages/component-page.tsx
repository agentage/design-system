import { CodeBlock, Heading, InlineCode } from '../../src';
import { PropsTable } from '../components/props-table';
import { EXPORT_SUBPATH } from '../generated/props';
import { Link } from '../lib/router';
import type { ResolvedComponent } from '../registry';

/** One `import { A, B } from '@agentage/design-system/<subpath>';` line per subpath. */
const importSnippet = (exports: string[]): string => {
  const bySubpath = new Map<string, string[]>();
  for (const name of exports) {
    const subpath = EXPORT_SUBPATH[name] ?? '.';
    bySubpath.set(subpath, [...(bySubpath.get(subpath) ?? []), name]);
  }
  return [...bySubpath.entries()]
    .map(([subpath, names]) => {
      const from = `from '@agentage/design-system${subpath.replace(/^\./, '')}';`;
      const oneLine = `import { ${names.join(', ')} } ${from}`;
      // Long lines make the <pre> horizontally scrollable, which axe flags as
      // an unfocusable scroll region; wrap instead.
      return oneLine.length <= 76
        ? oneLine
        : `import {\n${names.map((n) => `  ${n},`).join('\n')}\n} ${from}`;
    })
    .join('\n');
};

export const ComponentPage = ({ category, component }: ResolvedComponent) => (
  <article className="space-y-8">
    <div className="space-y-2">
      <Link
        to={`/components/${category.slug}`}
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {category.label}
      </Link>
      <Heading as="h1" description={component.description}>
        {component.name}
      </Heading>
    </div>

    <section className="space-y-3" data-section="Import">
      <h2 className="text-sm font-semibold text-foreground">Import</h2>
      <CodeBlock language="typescript" code={importSnippet(component.exports)} />
      <p className="text-xs text-muted-foreground">
        The barrel <InlineCode>@agentage/design-system</InlineCode> re-exports everything; the
        subpaths above keep client boundaries and tree-shaking intact.
      </p>
    </section>

    {component.demos.map((demo, index) => (
      <section
        key={demo.title ?? index}
        className="space-y-4"
        data-section={demo.title ?? component.name}
      >
        <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
          {demo.title ?? 'Example'}
        </h2>
        <div className="space-y-3">
          <demo.Component />
        </div>
      </section>
    ))}

    <section className="space-y-4" data-section="Props">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">Props</h2>
      {component.exports.map((name) => (
        <div key={name} className="space-y-2">
          <h3 className="font-mono text-sm font-medium text-foreground">{name}</h3>
          <PropsTable name={name} />
        </div>
      ))}
    </section>
  </article>
);
