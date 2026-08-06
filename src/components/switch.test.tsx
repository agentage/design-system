import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  it('exposes the button through a forwarded ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Notifications" />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });

  it('reports its checked state', () => {
    render(<Switch checked aria-label="Notifications" />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });

  it('toggles on click, Space and Enter', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    fireEvent.click(control);
    fireEvent.keyDown(control, { key: ' ' });
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(onCheckedChange).toHaveBeenCalledTimes(3);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('stays inert when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifications" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.keyDown(screen.getByRole('switch'), { key: ' ' });
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
