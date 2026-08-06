import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('exposes the button through a forwarded ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Accept terms" />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('passes through name, id and aria-label', () => {
    const { container } = render(<Checkbox id="terms" name="terms" aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' }).id).toBe('terms');
    expect(container.querySelector('input[type="checkbox"]')?.getAttribute('name')).toBe('terms');
  });

  it('reports the mixed state and sets indeterminate on the native input', () => {
    const { container } = render(<Checkbox name="all" indeterminate aria-label="Select all" />);
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed');
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')?.indeterminate).toBe(
      true
    );
  });

  it('toggles on click and on Space', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox');
    fireEvent.click(box);
    fireEvent.keyDown(box, { key: ' ' });
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays inert when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Toggle" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('omits the native input when no name is given', () => {
    const { container } = render(<Checkbox aria-label="Toggle" />);
    expect(container.querySelector('input')).toBeNull();
  });
});
