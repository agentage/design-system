import {
  Alert,
  CodeBlock,
  Heading,
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { Demo as ColorPrimitivesDemo } from '../demos/color-primitives';
import { Demo as SemanticColorsDemo } from '../demos/semantic-colors';
import { Demo as TypographyDemo } from '../demos/typography';

const TIERS = [
  {
    tier: 'Tier 1 - primitives',
    file: 'primitives.css',
    what: 'Raw OKLCH scales (gold, neutral, red, ...) at stops 50-950. Theme-independent.',
    use: 'Never reference these from product code; they exist so tier 2 has a palette to point at.',
  },
  {
    tier: 'Tier 2 - semantic tokens',
    file: 'tokens.css',
    what: '--color-background, --color-primary, --color-destructive, plus typography, shadows and motion.',
    use: 'What you use. Tailwind picks them up as bg-background, text-primary, border-border.',
  },
  {
    tier: 'Tier 3 - base',
    file: 'base.css',
    what: 'Element resets, scrollbar styling, body defaults.',
    use: 'Applied for you; nothing to reference.',
  },
];

const THEME_CONTRACT = `<!-- Dark is the default; set the attribute on <html>. -->
<html data-theme="dark">   <!-- dark | light | system -->`;

const TOGGLE = `const setTheme = (theme: 'dark' | 'light' | 'system') => {
  document.documentElement.setAttribute('data-theme', theme);
};`;

export const ThemingPage = () => (
  <div className="space-y-8">
    <Heading as="h1" description="Three token tiers, one data-theme attribute, dark by default.">
      Theming
    </Heading>

    <section className="space-y-3" data-section="Token tiers">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Token tiers
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tier</TableHead>
              <TableHead>File</TableHead>
              <TableHead>What it holds</TableHead>
              <TableHead>How you use it</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TIERS.map((row) => (
              <TableRow key={row.tier}>
                <TableCell className="whitespace-nowrap align-top font-medium">
                  {row.tier}
                </TableCell>
                <TableCell className="align-top font-mono text-xs text-muted-foreground">
                  {row.file}
                </TableCell>
                <TableCell className="align-top text-xs text-muted-foreground">
                  {row.what}
                </TableCell>
                <TableCell className="align-top text-xs text-muted-foreground">{row.use}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-muted-foreground">
        <InlineCode>@agentage/design-system/theme.css</InlineCode> imports all three, in that order.
      </p>
    </section>

    <section className="space-y-3" data-section="data-theme">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        The data-theme contract
      </h2>
      <CodeBlock language="html" code={THEME_CONTRACT} />
      <CodeBlock language="typescript" code={TOGGLE} />
      <Alert variant="info">
        <InlineCode>system</InlineCode> is a real third value, not an absence: it maps to a{' '}
        <InlineCode>prefers-color-scheme</InlineCode> media query, so the same attribute drives all
        three states. Use the toggle in the header of this site to flip every demo below.
      </Alert>
    </section>

    <section className="space-y-4" data-section="Semantic Colors">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Semantic colours
      </h2>
      <div className="space-y-3">
        <SemanticColorsDemo />
      </div>
    </section>

    <section className="space-y-4" data-section="Color Primitives (OKLCH)">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Colour primitives (OKLCH)
      </h2>
      <div className="space-y-3">
        <ColorPrimitivesDemo />
      </div>
    </section>

    <section className="space-y-4" data-section="Typography">
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
        Typography
      </h2>
      <div className="space-y-3">
        <TypographyDemo />
      </div>
    </section>
  </div>
);
