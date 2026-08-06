import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from './heading';

describe('headingVariants', () => {
  it('renders the exact class string for every level', () => {
    const expected = {
      h1: 'text-3xl font-bold tracking-[-0.02em] text-foreground',
      h2: 'text-xl font-semibold tracking-[-0.02em] text-foreground',
      h3: 'text-lg font-semibold text-foreground',
      h4: 'text-sm font-semibold text-foreground',
    } as const;

    for (const [level, className] of Object.entries(expected)) {
      const { container, unmount } = render(
        <Heading as={level as keyof typeof expected}>T</Heading>
      );
      expect(container.querySelector(level)?.className).toBe(className);
      unmount();
    }
  });

  it('defaults to h2 and merges className last', () => {
    const { container } = render(<Heading className="mb-2">T</Heading>);
    expect(container.querySelector('h2')?.className).toBe(
      'text-xl font-semibold tracking-[-0.02em] text-foreground mb-2'
    );
  });

  it('renders the description under the heading', () => {
    render(<Heading description="Sub">T</Heading>);
    expect(screen.getByText('Sub').className).toBe('mt-1 text-sm text-muted-foreground');
  });
});
