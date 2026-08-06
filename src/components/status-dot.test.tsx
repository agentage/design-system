import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusDot } from './status-dot';

const root = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="status-dot"]') as HTMLElement;

describe('StatusDot', () => {
  it('announces the state on the root when there is no label', () => {
    const { container } = render(<StatusDot variant="online" />);
    expect(root(container).getAttribute('aria-label')).toBe('online');
  });

  it('lets the visible label carry the meaning', () => {
    const { container } = render(<StatusDot variant="error" label="Failed" />);
    expect(root(container).getAttribute('aria-label')).toBe(null);
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('keeps a caller-supplied aria-label', () => {
    const { container } = render(<StatusDot variant="working" aria-label="Syncing" />);
    expect(root(container).getAttribute('aria-label')).toBe('Syncing');
  });

  it('treats the dot itself as decorative', () => {
    const { container } = render(<StatusDot variant="warning" />);
    const dot = root(container).firstElementChild as HTMLElement;
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[role="status"]')).toBe(null);
    expect(dot.className).toContain('bg-warning');
  });

  it('routes className to the root span', () => {
    const { container } = render(<StatusDot variant="info" className="mt-4" />);
    expect(root(container).className).toContain('mt-4');
    expect((root(container).firstElementChild as HTMLElement).className).not.toContain('mt-4');
  });
});
