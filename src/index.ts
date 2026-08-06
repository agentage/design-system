// Public entry point. Component exports are declared exactly once, in
// src/components/index.ts, and re-exported wholesale here so the two barrels
// can never drift again.

export * from './components/index';
export { cn } from './lib/utils';
