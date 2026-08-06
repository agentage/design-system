import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';

const root = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="separator"]') as HTMLElement;

describe('separatorVariants', () => {
  it('renders the exact class string for both orientations', () => {
    expect(root(render(<Separator />).container).className).toBe('shrink-0 bg-border h-px w-full');
    expect(root(render(<Separator orientation="vertical" />).container).className).toBe(
      'shrink-0 bg-border w-px h-full'
    );
  });

  it('merges className last', () => {
    expect(
      root(render(<Separator orientation="vertical" className="mx-2" />).container).className
    ).toBe('shrink-0 bg-border w-px h-full mx-2');
  });

  it('keeps the decorative role contract', () => {
    expect(root(render(<Separator />).container).getAttribute('role')).toBe('none');
    const semantic = root(
      render(<Separator decorative={false} orientation="vertical" />).container
    );
    expect(semantic.getAttribute('role')).toBe('separator');
    expect(semantic.getAttribute('aria-orientation')).toBe('vertical');
  });
});
