import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const setup = (props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) =>
  render(
    <Collapsible {...props}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>Body copy</CollapsibleContent>
    </Collapsible>
  );

describe('Collapsible', () => {
  it('toggles content from the trigger', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Body copy').hidden).toBe(true);

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Body copy').hidden).toBe(false);
  });

  it('wires aria-controls to the content id', () => {
    setup({ defaultOpen: true });
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByText('Body copy').id);
    expect(screen.getByText('Body copy').getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('reports open changes', () => {
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders the trigger as its child when asChild is set', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <a href="#more">More</a>
        </CollapsibleTrigger>
        <CollapsibleContent>Body copy</CollapsibleContent>
      </Collapsible>
    );
    const link = screen.getByRole('link', { name: 'More' });
    fireEvent.click(link);
    expect(link.getAttribute('aria-expanded')).toBe('true');
  });
});
