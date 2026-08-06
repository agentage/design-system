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

describe('statusDotVariants', () => {
  it('covers the canonical status vocabulary alongside the presence names', () => {
    const tokens = {
      default: 'bg-muted-foreground',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
      online: 'bg-success',
      offline: 'bg-muted-foreground',
      working: 'bg-success animate-pulse',
      error: 'bg-destructive',
      pending: 'bg-muted-foreground animate-pulse',
    } as const;

    for (const [variant, token] of Object.entries(tokens)) {
      const { container, unmount } = render(<StatusDot variant={variant as keyof typeof tokens} />);
      const dot = root(container).firstElementChild as HTMLElement;
      expect(dot.className).toBe(`inline-block shrink-0 rounded-full ${token} size-2`);
      unmount();
    }
  });

  it('renders the exact class string for every size', () => {
    const sizes = { sm: 'size-1.5', md: 'size-2', lg: 'size-2.5' } as const;
    for (const [size, token] of Object.entries(sizes)) {
      const { container, unmount } = render(
        <StatusDot variant="info" size={size as keyof typeof sizes} />
      );
      expect((root(container).firstElementChild as HTMLElement).className).toBe(
        `inline-block shrink-0 rounded-full bg-info ${token}`
      );
      unmount();
    }
  });
});
