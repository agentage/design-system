import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer';

const inner = (container: HTMLElement): HTMLElement =>
  (container.querySelector('[data-slot="footer"]') as HTMLElement).firstElementChild as HTMLElement;

describe('Footer', () => {
  it('renders the exact inner class string for both container modes', () => {
    expect(inner(render(<Footer>x</Footer>).container).className).toBe(
      'mx-auto max-w-6xl px-6 py-10'
    );
    expect(inner(render(<Footer contained={false}>x</Footer>).container).className).toBe(
      'px-6 py-10'
    );
  });

  it('merges className last on the footer landmark', () => {
    const { container } = render(<Footer className="mt-8">x</Footer>);
    expect((container.querySelector('[data-slot="footer"]') as HTMLElement).className).toBe(
      'border-t border-border bg-sidebar text-sidebar-foreground mt-8'
    );
  });
});
