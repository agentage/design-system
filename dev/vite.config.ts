import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

// Serves the component showcase (npm run dev) and builds it as a static SPA
// (npm run build:showcase) for deployment to ds.agentage.io.
export default defineConfig({
  plugins: [react()],
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
});
