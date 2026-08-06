#!/usr/bin/env node
// Keeps the per-component subpath exports in sync with src/ (run via npm run exports:generate).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = resolve(root, 'package.json');

const STATIC_EXPORTS = {
  '.': { types: './dist/index.d.ts', import: './dist/index.js' },
  './theme.css': './src/styles/theme.css',
  './primitives.css': './src/styles/primitives.css',
  './styles/*.css': './src/styles/*.css',
  './package.json': './package.json',
};

const isModule = (file) =>
  /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && !/^index\.tsx?$/.test(file);

const subpaths = {};
for (const [dir, prefix] of [
  ['src/components', 'components'],
  ['src/lib', 'lib'],
]) {
  for (const file of readdirSync(resolve(root, dir)).filter(isModule)) {
    const name = file.replace(/\.tsx?$/, '');
    subpaths[`./${name}`] = {
      types: `./dist/${prefix}/${name}.d.ts`,
      import: `./dist/${prefix}/${name}.js`,
    };
  }
}

const exportsMap = { ...STATIC_EXPORTS };
for (const key of Object.keys(subpaths).sort()) exportsMap[key] = subpaths[key];

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const next = `${JSON.stringify({ ...pkg, exports: exportsMap }, null, 2)}\n`;

if (process.argv.includes('--check')) {
  if (next !== readFileSync(pkgPath, 'utf8')) {
    console.error('package.json "exports" is stale — run: npm run exports:generate');
    process.exit(1);
  }
  console.log(`exports map up to date (${Object.keys(exportsMap).length} entries)`);
} else {
  writeFileSync(pkgPath, next);
  console.log(`wrote ${Object.keys(exportsMap).length} export entries`);
}
