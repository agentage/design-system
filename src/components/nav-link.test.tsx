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
