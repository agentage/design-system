import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './popover';

const Harness = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <Popover
        trigger={
          <button type="button" onClick={() => setOpen(true)}>
            Details
          </button>
        }
        content={<button type="button">Edit</button>}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

describe('Popover', () => {
  it('renders the surface into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Popover
          trigger={<button type="button">Details</button>}
          content="Machine info"
          isOpen
          onClose={vi.fn()}
        />
      </div>
    );
    const surface = screen.getByRole('dialog');
    expect(container.querySelector('[data-slot="popover-content"]')).toBeNull();
    expect(surface.closest('body')).toBe(document.body);
    expect(surface.style.position).toBe('fixed');
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Popover
        trigger={<button type="button">Details</button>}
        content="Machine info"
        isOpen
        onClose={onClose}
      />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('returns focus to the trigger when it closes', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Details' });
    trigger.focus();
    fireEvent.click(trigger);

    screen.getByRole('button', { name: 'Edit' }).focus();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when a click lands outside trigger and surface', () => {
    const onClose = vi.fn();
    render(
      <>
        <Popover
          trigger={<button type="button">Details</button>}
          content="Machine info"
          isOpen
          onClose={onClose}
        />
        <button type="button">Elsewhere</button>
      </>
    );
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
