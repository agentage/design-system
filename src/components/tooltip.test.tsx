import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip';

const renderTooltip = (): HTMLElement => {
  render(
    <div style={{ overflow: 'hidden' }}>
      <Tooltip content="Edit this item" delayMs={100}>
        <button type="button">Edit</button>
      </Tooltip>
    </div>
  );
  return screen.getByRole('button', { name: 'Edit' });
};

const tick = (ms: number): void => {
  act(() => vi.advanceTimersByTime(ms));
};

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('opens on hover after the delay and portals the surface to document.body', () => {
    const trigger = renderTooltip();
    fireEvent.pointerOver(trigger, { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();

    tick(100);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.parentElement).toBe(document.body);
    expect(tooltip.style.position).toBe('fixed');
  });

  it('describes the trigger while open', () => {
    const trigger = renderTooltip();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();

    fireEvent.pointerOver(trigger, { pointerType: 'mouse' });
    tick(100);
    expect(trigger.getAttribute('aria-describedby')).toBe(screen.getByRole('tooltip').id);
  });

  it('opens on keyboard focus without waiting for the hover delay', () => {
    const trigger = renderTooltip();
    act(() => trigger.focus());
    tick(0);
    expect(screen.getByRole('tooltip')).not.toBeNull();
  });

  it('ignores touch pointers', () => {
    const trigger = renderTooltip();
    fireEvent.pointerOver(trigger, { pointerType: 'touch' });
    tick(500);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('closes on Escape', () => {
    const trigger = renderTooltip();
    act(() => trigger.focus());
    tick(0);
    expect(screen.getByRole('tooltip')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });
});

describe('Tooltip surface props', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('merges className last and spreads props onto the content', () => {
    render(
      <Tooltip content="Hint" delayMs={100} className="mt-4" id="tip">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    fireEvent.pointerOver(screen.getByRole('button', { name: 'Trigger' }), {
      pointerType: 'mouse',
    });
    tick(100);
    const content = document.body.querySelector('[data-slot="tooltip-content"]');
    expect(content?.className).toBe(
      'z-[var(--z-overlay,50)] max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95 mt-4'
    );
    expect(content?.id).toBe('tip');
  });
});
