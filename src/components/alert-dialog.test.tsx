import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from './alert-dialog';

const Harness = ({ onConfirm = vi.fn() }: { onConfirm?: () => void }): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Delete
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete machine?"
        description="This cannot be undone."
        onConfirm={onConfirm}
      />
    </div>
  );
};

describe('AlertDialog', () => {
  it('renders into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />
      </div>
    );
    expect(container.querySelector('[data-slot="alert-dialog"]')).toBeNull();
    expect(screen.getByRole('alertdialog').closest('body')).toBe(document.body);
  });

  it('locks body scroll while open', () => {
    const { unmount } = render(
      <AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('focuses the safe action and traps Tab inside', () => {
    render(<AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />);
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(document.activeElement).toBe(cancel);

    confirm.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel);
  });

  it('closes on Escape and restores focus to the opener', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Delete' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('alertdialog')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

// Frozen pre-CVA output of the destructive branch.
const CONFIRM_BASE =
  'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

const confirmClass = (): string | undefined =>
  document.body.querySelectorAll('[role="alertdialog"] button')[1]?.className;

describe('AlertDialog class parity', () => {
  it('renders the default confirm button byte-identically', () => {
    render(<AlertDialog open onOpenChange={vi.fn()} title="T" onConfirm={vi.fn()} />);
    expect(confirmClass()).toBe(
      `${CONFIRM_BASE} bg-primary text-primary-foreground hover:bg-primary/90`
    );
  });

  it('renders the destructive confirm button byte-identically', () => {
    render(
      <AlertDialog
        open
        onOpenChange={vi.fn()}
        title="T"
        onConfirm={vi.fn()}
        variant="destructive"
      />
    );
    expect(confirmClass()).toBe(
      `${CONFIRM_BASE} bg-destructive-solid text-on-solid hover:bg-destructive-solid/90`
    );
  });

  it('merges className last on the panel and spreads props', () => {
    render(
      <AlertDialog
        open
        onOpenChange={vi.fn()}
        title="T"
        onConfirm={vi.fn()}
        className="mt-4"
        id="ad"
      />
    );
    const panel = document.body.querySelector('[data-slot="alert-dialog-content"]');
    expect(panel?.className).toBe(
      'relative z-10 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg mt-4'
    );
    expect(panel?.id).toBe('ad');
  });
});
