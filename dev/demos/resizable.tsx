'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../src';

export const Demo = () => (
  <>
    <p className="text-sm text-muted-foreground">
      Drag the divider, or focus it and use Arrow keys (Shift for 10%), Home and End. Sizes persist
      per browser under <code className="font-mono text-xs">ds-demo-browser</code>.
    </p>
    <ResizablePanelGroup
      storageKey="ds-demo-browser"
      className="h-64 rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={32} minSize={18} maxSize={60} className="bg-sidebar p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Memory tree</p>
        <ul className="space-y-1 text-sm">
          {['roadmap.md', 'architecture.md', 'meetings/2026-08-06.md', 'ideas.md'].map((f) => (
            <li key={f} className="truncate rounded px-2 py-1 hover:bg-accent">
              {f}
            </li>
          ))}
        </ul>
      </ResizablePanel>
      <ResizableHandle withGrip />
      <ResizablePanel minSize={30} className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">roadmap.md</p>
        <p className="text-sm text-muted-foreground">
          One memory. Every AI. The tree on the left and this document share a single split
          container - the divider only spends its delta on the two panels it sits between.
        </p>
      </ResizablePanel>
    </ResizablePanelGroup>
    <ResizablePanelGroup direction="vertical" className="h-64 rounded-lg border border-border">
      <ResizablePanel defaultSize={60} minSize={25} className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Run output</p>
        <p className="text-sm text-muted-foreground">
          Vertical groups take the same API - the handle switches its orientation and cursor.
        </p>
      </ResizablePanel>
      <ResizableHandle withGrip />
      <ResizablePanel minSize={20} className="bg-sidebar p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Logs</p>
        <p className="font-mono text-xs text-muted-foreground">agent finished in 4.2s</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  </>
);
