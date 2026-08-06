import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopBar, TopBarNavItem } from './top-bar';

const bar = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="top-bar"]') as HTMLElement;

describe('topBarVariants', () => {
  it('renders the exact class string with and without sticky', () => {
    expect(bar(render(<TopBar>x</TopBar>).container).className).toBe(
      'border-b border-border bg-background/95 backdrop-blur'
    );
    expect(bar(render(<TopBar sticky>x</TopBar>).container).className).toBe(
      'border-b border-border bg-background/95 backdrop-blur sticky top-0 z-[var(--z-sticky,40)]'
    );
  });

  it('keeps the width class ahead of the inner layout classes', () => {
    expect(
      (bar(render(<TopBar>x</TopBar>).container).firstElementChild as HTMLElement).className
    ).toBe('mx-auto max-w-6xl flex h-14 items-center gap-6 px-6');
    expect(
      (bar(render(<TopBar contained={false}>x</TopBar>).container).firstElementChild as HTMLElement)
        .className
    ).toBe('w-full flex h-14 items-center gap-6 px-6');
  });
});

describe('topBarNavItemVariants', () => {
  it('renders the exact class string for both states', () => {
    const base =
      'rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
    const { unmount } = render(
      <TopBarNavItem href="#" active>
        A
      </TopBarNavItem>
    );
    expect(screen.getByRole('link').className).toBe(`${base} bg-accent text-foreground`);
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
    unmount();

    render(<TopBarNavItem href="#">B</TopBarNavItem>);
    expect(screen.getByRole('link').className).toBe(
      `${base} text-foreground/70 hover:bg-accent/50 hover:text-foreground`
    );
  });
});
