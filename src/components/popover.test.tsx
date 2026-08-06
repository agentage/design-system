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

describe('Popover surface props', () => {
  it('merges className last and spreads props onto the content', () => {
    render(
      <Popover
        trigger={<span>t</span>}
        content="c"
        isOpen
        onClose={vi.fn()}
        className="mt-4"
        id="pop"
        data-testid="pop"
      />
    );
    const content = document.body.querySelector('[data-slot="popover-content"]');
    expect(content?.className).toBe(
      'z-[var(--z-overlay,50)] min-w-[300px] rounded-lg border border-border bg-popover p-4 shadow-lg mt-4'
    );
    expect(content?.id).toBe('pop');
  });

  it('accepts the canonical start/end align aliases', () => {
    render(<Popover trigger={<span>t</span>} content="c" isOpen onClose={vi.fn()} align="end" />);
    expect(document.body.querySelector('[data-slot="popover-content"]')).not.toBeNull();
  });
});
