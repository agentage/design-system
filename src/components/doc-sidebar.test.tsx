import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DocSidebar, DocSidebarItem } from './doc-sidebar';

const BASE =
  'block rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
const ACTIVE = 'bg-primary/10 font-medium text-primary';
const IDLE = 'text-foreground/70 hover:bg-accent hover:text-foreground';

describe('docSidebarItemVariants', () => {
  it('renders the exact class string for every active/depth combination', () => {
    const cases = [
      { active: true, depth: 0, expected: `${BASE} ${ACTIVE}` },
      { active: true, depth: 1, expected: `${BASE} border-l border-border ${ACTIVE}` },
      { active: false, depth: 0, expected: `${BASE} ${IDLE}` },
      { active: false, depth: 1, expected: `${BASE} border-l border-border ${IDLE}` },
    ];

    for (const { active, depth, expected } of cases) {
      const { unmount } = render(
        <DocSidebarItem href="#" active={active} depth={depth}>
          i
        </DocSidebarItem>
      );
      expect(screen.getByRole('link').className).toBe(expected);
      unmount();
    }
  });

  it('indents nested items and marks the active one as current', () => {
    render(
      <DocSidebarItem href="#" active depth={2}>
        i
      </DocSidebarItem>
    );
    const link = screen.getByRole('link');
    expect(link.style.paddingLeft).toBe('2rem');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('keeps the sidebar width prop ahead of the base classes', () => {
    const { container } = render(<DocSidebar>x</DocSidebar>);
    expect((container.querySelector('[data-slot="doc-sidebar"]') as HTMLElement).className).toBe(
      'w-60 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground'
    );
  });
});
