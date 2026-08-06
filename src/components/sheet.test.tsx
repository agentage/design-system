import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Sheet } from './sheet';

const Harness = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Filters" description="Narrow the list">
        <button type="button">Apply</button>
      </Sheet>
    </>
  );
};

describe('Sheet', () => {
  it('exposes a modal dialog labelled by its title and description', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} title="Filters" description="Narrow the list">
        content
      </Sheet>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')?.textContent).toBe(
      'Filters'
    );
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby') ?? '')?.textContent
    ).toBe('Narrow the list');
  });

  it('moves focus inside on open and restores it on close', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('renders into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Sheet open onOpenChange={vi.fn()} title="Filters">
          content
        </Sheet>
      </div>
    );
    expect(container.querySelector('[data-slot="sheet"]')).toBeNull();
    expect(screen.getByRole('dialog').closest('body')).toBe(document.body);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('keeps Tab inside the dialog', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} title="Filters">
        <button type="button">Apply</button>
      </Sheet>
    );
    const focusables = screen.getAllByRole('button');
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(focusables[0]);
  });
});

// Frozen pre-CVA output of the side ternary.
const SHEET_BASE =
  'fixed inset-y-0 z-[var(--z-overlay,50)] flex w-80 flex-col border-border bg-background shadow-lg outline-none';

const panelClass = (): string | undefined =>
  document.body.querySelector('[data-slot="sheet-content"]')?.className;

describe('Sheet class parity', () => {
  it.each([
    ['left', 'left-0 border-r'],
    ['right', 'right-0 border-l'],
  ] as const)('renders side=%s byte-identically', (side, expected) => {
    render(
      <Sheet open onOpenChange={vi.fn()} side={side}>
        body
      </Sheet>
    );
    expect(panelClass()).toBe(`${SHEET_BASE} ${expected}`);
  });

  it('defaults to right, merges className last and spreads props', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} className="mt-4" id="s">
        body
      </Sheet>
    );
    expect(panelClass()).toBe(`${SHEET_BASE} right-0 border-l mt-4`);
    expect(document.body.querySelector('#s')).not.toBeNull();
  });
});
