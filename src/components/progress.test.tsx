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
