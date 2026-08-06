'use client';
import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  HoverCard,
  Modal,
  Popover,
  Tooltip,
} from '../../src';

export const Demo = () => {
  const [nestedPopoverOpen, setNestedPopoverOpen] = useState(false);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        The card below is <code className="font-mono text-xs">overflow-hidden</code>, short, and
        transformed - everything a non-portalled overlay gets clipped by. Each overlay renders into{' '}
        <code className="font-mono text-xs">document.body</code>, so it stays whole.
      </p>
      <div className="h-28 max-w-md translate-x-0 overflow-hidden rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip content="Not clipped by the card">
            <Button variant="outline" size="sm">
              Tooltip
            </Button>
          </Tooltip>
          <DropdownMenu
            align="start"
            trigger={
              <Button variant="outline" size="sm">
                Menu
              </Button>
            }
          >
            <DropdownMenuLabel>Escapes the card</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Re-run</DropdownMenuItem>
          </DropdownMenu>
          <Popover
            trigger={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNestedPopoverOpen(!nestedPopoverOpen)}
              >
                Popover
              </Button>
            }
            content={
              <p className="text-xs text-muted-foreground">
                Anchored to the trigger, rendered on the body.
              </p>
            }
            isOpen={nestedPopoverOpen}
            onClose={() => setNestedPopoverOpen(false)}
          />
          <HoverCard trigger={<Button variant="link">@dev-machine</Button>}>
            <p className="text-xs text-muted-foreground">linux/amd64 · 5 agents · Online</p>
          </HoverCard>
          <Button size="sm" onClick={() => setNestedModalOpen(true)}>
            Modal
          </Button>
        </div>
      </div>
      <Modal
        isOpen={nestedModalOpen}
        onClose={() => setNestedModalOpen(false)}
        title="Opened from inside the clipped card"
        description="Centred on the viewport, not on the card."
      >
        <p className="text-sm text-muted-foreground">
          Escape closes this and focus returns to the button that opened it.
        </p>
      </Modal>
    </>
  );
};
