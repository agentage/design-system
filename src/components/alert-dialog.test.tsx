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
