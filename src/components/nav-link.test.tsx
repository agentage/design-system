import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavLink } from './nav-link';

describe('NavLink', () => {
  it('marks the active link as the current page', () => {
    render(
      <NavLink href="/memories" active>
        Memories
      </NavLink>
    );
    expect(screen.getByRole('link', { name: 'Memories' }).getAttribute('aria-current')).toBe(
      'page'
    );
  });

  it('leaves inactive links without aria-current', () => {
    render(<NavLink href="/settings">Settings</NavLink>);
    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('aria-current')).toBe(null);
  });

  it('does not clobber a caller-supplied aria-current', () => {
    render(
      <NavLink href="/step" active aria-current="step">
        Step
      </NavLink>
    );
    expect(screen.getByRole('link', { name: 'Step' }).getAttribute('aria-current')).toBe('step');
  });
});

describe('navLinkVariants', () => {
  it('renders the exact class string for both states', () => {
    const active = render(<NavLink href="/a" active />).container;
    expect((active.querySelector('[data-slot="nav-link"]') as HTMLElement).className).toBe(
      'flex items-center gap-3 rounded-md border-l-[3px] px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-[140ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-l-primary bg-primary-soft text-foreground'
    );

    const idle = render(<NavLink href="/b" />).container;
    expect((idle.querySelector('[data-slot="nav-link"]') as HTMLElement).className).toBe(
      'flex items-center gap-3 rounded-md border-l-[3px] border-l-transparent px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-[140ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:bg-accent/40 hover:text-foreground'
    );
  });
});
