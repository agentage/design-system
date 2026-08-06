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

const thumb = (): HTMLElement => document.querySelector('[data-slot="switch"] span') as HTMLElement;

describe('Switch class strings', () => {
  it('keeps the off class strings byte-identical', () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole('switch').className).toBe(
      'inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-muted'
    );
    expect(thumb().className).toBe(
      'pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform duration-200 translate-x-0'
    );
  });

  it('keeps the on thumb class string byte-identical', () => {
    render(<Switch aria-label="Notifications" checked />);
    expect(thumb().className).toBe(
      'pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform duration-200 translate-x-4'
    );
  });

  it('keeps the disabled + className string byte-identical', () => {
    render(<Switch aria-label="Notifications" disabled className="mt-4" />);
    expect(screen.getByRole('switch').className).toBe(
      'inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-muted cursor-not-allowed opacity-50 mt-4'
    );
  });

  it('marks the control invalid and swaps the resting border on error', () => {
    render(<Switch aria-label="Notifications" error />);
    const control = screen.getByRole('switch');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.className).toContain('border-destructive');
    expect(control.className).not.toContain('border-transparent');
  });

  it('spreads unknown props onto the button', () => {
    render(<Switch aria-label="Notifications" data-testid="sw" id="notify" />);
    expect(screen.getByTestId('sw')).toBe(screen.getByRole('switch'));
    expect(screen.getByRole('switch').id).toBe('notify');
  });
});
