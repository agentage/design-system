import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('hides the placeholder from assistive tech', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[data-slot="skeleton"]')?.getAttribute('aria-hidden')).toBe(
      'true'
    );
  });

  it('lets the caller override aria-hidden', () => {
    const { container } = render(<Skeleton aria-hidden={false} />);
    expect(container.querySelector('[data-slot="skeleton"]')?.getAttribute('aria-hidden')).toBe(
      'false'
    );
  });
});

describe('skeletonVariants', () => {
  it('renders the exact class string for every variant', () => {
    const expected = {
      text: 'animate-pulse bg-muted h-4 w-full rounded-md',
      circular: 'animate-pulse bg-muted rounded-full',
      rectangular: 'animate-pulse bg-muted rounded-md',
    } as const;

    for (const [variant, className] of Object.entries(expected)) {
      const { container, unmount } = render(
        <Skeleton variant={variant as keyof typeof expected} />
      );
      expect(container.querySelector('[data-slot="skeleton"]')?.className).toBe(className);
      unmount();
    }
  });

  it('merges className last', () => {
    const { container } = render(<Skeleton variant="text" className="h-8" />);
    expect(container.querySelector('[data-slot="skeleton"]')?.className).toBe(
      'animate-pulse bg-muted w-full rounded-md h-8'
    );
  });
});
