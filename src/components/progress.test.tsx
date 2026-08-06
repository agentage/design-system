import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './progress';

describe('Progress', () => {
  it('uses the label prop as the accessible name', () => {
    render(<Progress value={40} label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' }).getAttribute('aria-valuenow')).toBe(
      '40'
    );
  });

  it('prefers an explicit aria-label over the label prop', () => {
    render(<Progress value={40} label="Upload" aria-label="Sync progress" />);
    expect(screen.getByRole('progressbar', { name: 'Sync progress' })).toBeTruthy();
  });

  it('supports aria-labelledby pass-through', () => {
    render(
      <>
        <span id="pl">Restore</span>
        <Progress value={10} aria-labelledby="pl" />
      </>
    );
    expect(screen.getByRole('progressbar', { name: 'Restore' })).toBeTruthy();
  });

  it('omits aria-valuenow and animates the bar when indeterminate', () => {
    render(<Progress indeterminate label="Working" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe(null);
    expect(bar.getAttribute('data-indeterminate')).toBe('true');

    const fill = bar.firstElementChild as HTMLElement;
    expect(fill.className).toContain('animate-pulse');
    expect(fill.className).toContain('w-full');
    expect(fill.style.width).toBe('');
  });
});

describe('progressVariants', () => {
  it('renders the exact indicator class string for every status', () => {
    const base = 'h-full rounded-full transition-all duration-300';
    const tokens = {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
    } as const;

    for (const [variant, token] of Object.entries(tokens)) {
      const { unmount } = render(
        <Progress value={30} variant={variant as keyof typeof tokens} label="p" />
      );
      const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
      expect(fill.className).toBe(`${base} ${token}`);
      unmount();
    }
  });

  it('appends the indeterminate classes after the status token', () => {
    render(<Progress indeterminate variant="success" label="p" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.className).toBe(
      'h-full rounded-full transition-all duration-300 bg-success w-full animate-pulse'
    );
  });
});
