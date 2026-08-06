#!/usr/bin/env node
/**
 * Generates the showcase prop tables + import subpaths from the component
 * sources and writes them to dev/generated/props.ts.
 *
 *   npm run props:generate     # also run first by `npm run build:showcase`
 *
 * Every exported component is resolved through the TypeScript checker: the
 * props type is the first parameter of its call signature, expanded to leaf
 * properties. Anything declared in node_modules (React's HTML/ARIA surface,
 * `ref`, `key`) is dropped so the table only shows the component's own API.
 * react-docgen-typescript was tried first and mis-resolved 15 of 68
 * components (files that export several components alongside cva variants).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'src', 'components');
const barrel = join(root, 'src', 'index.ts');
const outFile = join(root, 'dev', 'generated', 'props.ts');

const files = readdirSync(componentsDir)
  .filter((f) => (f.endsWith('.tsx') || f.endsWith('.ts')) && !f.includes('.test.'))
  .map((f) => join(componentsDir, f))
  .concat(barrel);

const program = ts.createProgram(files, {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2024,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
  esModuleInterop: true,
  lib: ['lib.es2024.d.ts', 'lib.dom.d.ts'],
});
const checker = program.getTypeChecker();

const IGNORED = new Set(['ref', 'key', 'children']);
const isLocal = (symbol) =>
  (symbol.getDeclarations() ?? []).some(
    (d) => !d.getSourceFile().fileName.includes('node_modules')
  );

/** `{ size = 'md', open }` in the component's parameter list -> { size: "'md'" }. */
const defaultsOf = (declaration) => {
  const found = {};
  const visit = (node) => {
    if (ts.isObjectBindingPattern(node)) {
      for (const element of node.elements) {
        if (element.initializer) {
          found[(element.propertyName ?? element.name).getText()] = element.initializer.getText();
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(declaration);
  return found;
};

const shorten = (text) => (text.length > 120 ? `${text.slice(0, 117)}...` : text);

/** Export name -> published subpath, taken from the barrel and the exports map. */
const publishedSubpaths = new Set(
  Object.keys(JSON.parse(readFileSync(join(root, 'package.json'))).exports)
);
const subpaths = {};
{
  const source = program.getSourceFile(barrel);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  for (const exported of moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []) {
    const target =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const declaration = target.getDeclarations()?.[0];
    if (!declaration) continue;
    const file = declaration.getSourceFile().fileName;
    if (file.includes('node_modules')) continue;
    const candidate = `./${basename(file, extname(file))}`;
    subpaths[exported.getName()] = publishedSubpaths.has(candidate) ? candidate : '.';
  }
}

const table = {};
for (const file of files) {
  if (file === barrel) continue;
  const source = program.getSourceFile(file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();
    if (!/^[A-Z]/.test(name)) continue;

    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const declaration = symbol.valueDeclaration ?? symbol.getDeclarations()?.[0];
    if (!declaration) continue;

    const signature = checker
      .getTypeOfSymbolAtLocation(symbol, declaration)
      .getCallSignatures()
      .find((s) => s.parameters.length > 0);
    if (!signature) continue;

    const parameter = signature.parameters[0];
    const propsType = checker.getTypeOfSymbolAtLocation(parameter, declaration);
    const defaults = defaultsOf(declaration);

    const props = propsType
      .getProperties()
      .filter((p) => !IGNORED.has(p.getName()) && isLocal(p))
      .map((p) => {
        const at = p.getDeclarations()?.[0] ?? declaration;
        return {
          name: p.getName(),
          type: shorten(checker.typeToString(checker.getTypeOfSymbolAtLocation(p, at))),
          required: (p.getFlags() & ts.SymbolFlags.Optional) === 0,
          defaultValue: defaults[p.getName()] ?? null,
          description: ts
            .displayPartsToString(p.getDocumentationComment(checker))
            .replace(/\s+/g, ' ')
            .trim(),
        };
      })
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));

    if (props.length > 0) table[name] = props;
  }
}

const names = Object.keys(table).sort();
const body = names.map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(table[n])},`).join('\n');

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `// GENERATED by scripts/generate-props.mjs - do not edit by hand.
// Run \`npm run props:generate\` after changing a component's public props.

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

export const COMPONENT_PROPS: Record<string, PropDoc[]> = {
${body}
};

/** Export name -> the \`@agentage/design-system/<subpath>\` it ships under. */
export const EXPORT_SUBPATH: Record<string, string> = {
${Object.keys(subpaths)
  .sort()
  .map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(subpaths[n])},`)
  .join('\n')}
};
`
);

console.log(
  `props: ${String(names.length)} prop tables, ${String(Object.keys(subpaths).length)} subpaths -> dev/generated/props.ts`
);
