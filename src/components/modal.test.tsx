import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './modal';

const Harness = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    // The clipping ancestor a non-portalled overlay would be trapped inside.
    <div style={{ overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Create Run">
        <button type="button">Save</button>
      </Modal>
    </div>
  );
};

describe('Modal', () => {
  it('renders into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Modal isOpen onClose={vi.fn()} title="Create Run">
          content
        </Modal>
      </div>
    );
    expect(container.querySelector('[data-slot="modal"]')).toBeNull();
    expect(screen.getByRole('dialog').closest('body')).toBe(document.body);
  });

  it('locks body scroll while open and releases it on close', () => {
    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()} title="Create Run">
        content
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).not.toBe('');

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} title="Create Run">
        content
      </Modal>
    );
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('moves focus inside on open and restores it to the opener on close', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
