'use client';
import { CopyButton } from '../../src';

export const Demo = () => (
  <>
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton text="npm install @agentage/design-system" />
      <CopyButton text="npx agentage memory init" variant="default" />
      <CopyButton text="memory.agentage.io" variant="secondary" />
      <CopyButton text="export TOKEN=..." iconOnly variant="ghost" />
    </div>
    <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs">
      <span className="flex-1 truncate text-foreground">$ npm install @agentage/design-system</span>
      <CopyButton text="npm install @agentage/design-system" iconOnly variant="ghost" />
    </div>
  </>
);
