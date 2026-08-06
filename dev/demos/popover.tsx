'use client';
import { useState } from 'react';
import { Button, Popover } from '../../src';

export const Demo = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <Popover
        trigger={
          <Button variant="outline" onClick={() => setPopoverOpen(!popoverOpen)}>
            Toggle Popover
          </Button>
        }
        content={
          <div className="space-y-2">
            <p className="text-sm font-medium">Machine Info</p>
            <p className="text-xs text-muted-foreground">linux/amd64 · 5 agents · Online</p>
          </div>
        }
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
      />
    </>
  );
};
