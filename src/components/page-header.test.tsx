import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './page-header';

const ACTION_BASE =
  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

describe('pageHeaderActionVariants', () => {
  it('renders the exact class string for the whole status vocabulary', () => {
    const tails = {
      default: 'text-muted-foreground hover:bg-accent hover:text-foreground',
      success: 'text-success hover:bg-success/10',
      warning: 'text-warning hover:bg-warning/10',
      destructive: 'text-destructive hover:bg-destructive/10',
      info: 'text-info hover:bg-info/10',
    } as const;

    render(
      <PageHeader
        title="T"
        actions={Object.keys(tails).map((variant) => ({
          icon: <svg />,
          onClick: vi.fn(),
          title: variant,
          variant: variant as keyof typeof tails,
        }))}
      />
    );

    for (const [variant, tail] of Object.entries(tails)) {
      expect(screen.getByRole('button', { name: variant }).className).toBe(
        `${ACTION_BASE} ${tail}`
      );
    }
  });

  it('falls back to the default variant', () => {
    render(
      <PageHeader title="T" actions={[{ icon: <svg />, onClick: vi.fn(), title: 'Plain' }]} />
    );
    expect(screen.getByRole('button', { name: 'Plain' }).className).toBe(
      `${ACTION_BASE} text-muted-foreground hover:bg-accent hover:text-foreground`
    );
  });
});

describe('PageHeader', () => {
  it('merges className last and spreads props on the header', () => {
    const { container } = render(<PageHeader title="T" className="mb-1" id="ph" data-x="h" />);
    const header = container.querySelector('[data-slot="page-header"]') as HTMLElement;
    expect(header.className).toBe('flex items-center justify-between gap-3 h-[52px] mb-1');
    expect(header.id).toBe('ph');
    expect(header.dataset.x).toBe('h');
  });

  it('renders the title as the page heading', () => {
    render(<PageHeader title="Memories" subtitle="12 files" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Memories' })).toBeTruthy();
  });
});
