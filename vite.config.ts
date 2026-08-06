import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

// Runtime deps stay external so preserved modules keep their own client boundaries.
const external = [
  /^react($|\/)/,
  /^react-dom($|\/)/,
  ...Object.keys(pkg.dependencies).map((dep) => new RegExp(`^${dep}($|/)`)),
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
    cssCodeSplit: false,
    emptyOutDir: true,
  },
});
