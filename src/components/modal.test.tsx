import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal, ModalFooter } from './modal';

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

// Frozen pre-CVA output of the hand-rolled sizeClasses lookup.
const MODAL_BASE =
  'relative z-10 w-full rounded-lg border border-border bg-background shadow-lg outline-none';

const panelClass = (): string | undefined =>
  document.body.querySelector('[data-slot="modal-content"]')?.className;

describe('Modal class parity', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
  ] as const)('renders size=%s byte-identically', (size, expected) => {
    render(
      <Modal isOpen onClose={vi.fn()} size={size}>
        body
      </Modal>
    );
    expect(panelClass()).toBe(`${MODAL_BASE} ${expected}`);
  });

  it('merges className last and spreads props onto the panel', () => {
    render(
      <Modal isOpen onClose={vi.fn()} className="mt-4" id="m">
        body
      </Modal>
    );
    expect(panelClass()).toBe(`${MODAL_BASE} max-w-md mt-4`);
    expect(document.body.querySelector('#m')).not.toBeNull();
  });

  it('keeps the ModalFooter surface unchanged', () => {
    render(<ModalFooter className="pt-2">f</ModalFooter>);
    expect(document.body.querySelector('[data-slot="modal-footer"]')?.className).toBe(
      'flex items-center justify-end gap-2 border-t border-border -mx-4 -mb-4 mt-4 px-4 py-3 bg-muted/30 rounded-b-lg pt-2'
    );
  });
});
