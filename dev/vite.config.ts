import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')) as {
  version: string;
};

// Serves the component showcase (npm run dev) and builds it as a static SPA
// (npm run build:showcase) for deployment to ds.agentage.io.
export default defineConfig({
  plugins: [react()],
  define: {
    __DS_VERSION__: JSON.stringify(version),
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  root: __dirname,
  base: '/',
  build: {
    outDir: resolve(__dirname, '../dist-showcase'),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    open: true,
  },
  // Playwright serves the built SPA from here; never auto-open a browser.
  preview: {
    port: 4173,
    strictPort: true,
    open: false,
  },
});
