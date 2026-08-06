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
