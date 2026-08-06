import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner';

// Frozen pre-CVA output: the hand-rolled sizeClasses lookup produced exactly these strings.
const CLASSES = {
  sm: 'animate-spin text-primary size-4',
  md: 'animate-spin text-primary size-6',
  lg: 'animate-spin text-primary size-8',
};

const classOf = (container: HTMLElement): string | null =>
  container.querySelector('svg')?.getAttribute('class') ?? null;

describe('Spinner', () => {
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s byte-identically', (size) => {
    const { container } = render(<Spinner size={size} />);
    expect(classOf(container)).toBe(CLASSES[size]);
  });

  it('defaults to md and merges className last', () => {
    const { container } = render(<Spinner className="mt-4" />);
    expect(classOf(container)).toBe('animate-spin text-primary size-6 mt-4');
  });

  it('exposes a labelled status role and forwards a ref', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Spinner ref={ref} />);
    expect(screen.getByRole('status', { name: 'Loading' })).not.toBeNull();
    expect(ref.current?.getAttribute('data-slot')).toBe('spinner');
  });

  it('spreads extra props onto the svg', () => {
    const { container } = render(<Spinner id="load" data-testid="s" />);
    expect(container.querySelector('svg')?.id).toBe('load');
  });
});
