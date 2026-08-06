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
