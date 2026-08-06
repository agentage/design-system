import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('exposes a keyboard-reachable named region', async () => {
    render(<ScrollArea aria-label="Log output">line</ScrollArea>);
    const region = screen.getByRole('region', { name: 'Log output' });
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.className).toContain('focus-visible:ring-ring/50');

    await userEvent.tab();
    expect(document.activeElement).toBe(region);
  });

  it('opts out of the tab stop when focusable is false', () => {
    render(
      <ScrollArea aria-label="Static" focusable={false}>
        line
      </ScrollArea>
    );
    expect(screen.getByRole('region', { name: 'Static' }).getAttribute('tabindex')).toBe(null);
  });

  it('lets the caller override tabIndex', () => {
    render(
      <ScrollArea aria-label="Custom" tabIndex={-1}>
        line
      </ScrollArea>
    );
    expect(screen.getByRole('region', { name: 'Custom' }).getAttribute('tabindex')).toBe('-1');
  });
});

describe('scrollAreaVariants', () => {
  it('renders the exact class string for every orientation', () => {
    const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
    const expected = {
      vertical: `relative overflow-y-auto overflow-x-hidden ${focus}`,
      horizontal: `relative overflow-x-auto overflow-y-hidden ${focus}`,
      both: `relative overflow-auto ${focus}`,
    } as const;

    for (const [orientation, className] of Object.entries(expected)) {
      const { unmount } = render(
        <ScrollArea aria-label="r" orientation={orientation as keyof typeof expected}>
          x
        </ScrollArea>
      );
      expect(screen.getByRole('region').className).toBe(className);
      unmount();
    }
  });
});
