'use client';
import { ScrollArea } from '../../src';

export const Demo = () => (
  <>
    <ScrollArea className="h-40 border border-border rounded-lg p-3">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-2 border-b border-border last:border-0"
        >
          <span className="text-sm">Event #{i + 1}</span>
          <span className="text-xs text-muted-foreground">{i}s ago</span>
        </div>
      ))}
    </ScrollArea>
  </>
);
