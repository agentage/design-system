import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './icon-button';

const Icon = (): React.JSX.Element => <svg aria-hidden="true" />;

describe('IconButton', () => {
  it('falls back to the title for its accessible name', () => {
    render(<IconButton icon={<Icon />} title="Refresh" onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Refresh' })).not.toBeNull();
  });

  it('keeps a focus-visible ring and activates from the keyboard', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<Icon />} aria-label="Refresh" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Refresh' });
    expect(button.className).toContain('focus-visible:ring-2');
    await userEvent.tab();
    expect(document.activeElement).toBe(button);
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon={<Icon />} aria-label="Refresh" onClick={vi.fn()} />);
    expect(ref.current?.getAttribute('data-slot')).toBe('icon-button');
  });
});

// Frozen pre-CVA output of the md (previously only) size.
const ICON_BUTTON_MD =
  'flex items-center justify-center rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

describe('IconButton class parity', () => {
  it('renders the default (md) size byte-identically', () => {
    render(<IconButton icon={<Icon />} aria-label="Refresh" onClick={vi.fn()} />);
    expect(screen.getByRole('button').className).toBe(ICON_BUTTON_MD);
  });

  it('keeps the disabled + className tail in order', () => {
    render(
      <IconButton
        icon={<Icon />}
        aria-label="Refresh"
        disabled
        className="mt-4"
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole('button').className).toBe(
      `${ICON_BUTTON_MD} opacity-50 cursor-not-allowed mt-4`
    );
  });

  it.each([
    ['sm', 'p-1'],
    ['lg', 'p-2'],
  ] as const)('supports the canonical %s size', (size, pad) => {
    render(<IconButton icon={<Icon />} aria-label="Refresh" size={size} onClick={vi.fn()} />);
    expect(screen.getByRole('button').className).toBe(ICON_BUTTON_MD.replace('p-1.5', pad));
  });
});
