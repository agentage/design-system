import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar, SidebarContent } from './sidebar';

describe('Sidebar', () => {
  it('names the complementary landmark when aria-label is given', () => {
    render(<Sidebar aria-label="Workspace">side</Sidebar>);
    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeTruthy();
  });

  it('renders SidebarContent as a nav landmark', () => {
    const { container } = render(
      <SidebarContent aria-label="Primary">
        <a href="/">Home</a>
      </SidebarContent>
    );
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav.tagName).toBe('NAV');
    expect(container.querySelector('[data-slot="sidebar-content"]')).toBe(nav);
    expect(nav.className).toContain('flex-1');
  });
});
