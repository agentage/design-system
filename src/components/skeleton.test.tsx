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
