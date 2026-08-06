import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoverCard } from './hover-card';

const renderCard = (): HTMLElement => {
  render(
    <div style={{ overflow: 'hidden' }}>
      <HoverCard trigger={<button type="button">@dev-machine</button>} openDelay={100}>
        <p>linux/amd64</p>
      </HoverCard>
    </div>
  );
  return screen.getByRole('button', { name: '@dev-machine' });
};

const tick = (ms: number): void => {
  act(() => vi.advanceTimersByTime(ms));
};

describe('HoverCard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('opens on hover and portals a labelled surface to document.body', () => {
    const trigger = renderCard();
    fireEvent.pointerOver(trigger, { pointerType: 'mouse' });
    tick(100);

    const card = screen.getByRole('dialog');
    expect(card.getAttribute('aria-label')).toBe('More information');
    expect(card.parentElement).toBe(document.body);
    expect(trigger.getAttribute('aria-describedby')).toBe(card.id);
  });

  it('opens on keyboard focus', () => {
    const trigger = renderCard();
    act(() => trigger.focus());
    tick(0);
    expect(screen.getByRole('dialog')).not.toBeNull();
  });

  it('closes on Escape', () => {
    const trigger = renderCard();
    act(() => trigger.focus());
    tick(0);
    expect(screen.getByRole('dialog')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    tick(0);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('ignores touch pointers', () => {
    const trigger = renderCard();
    fireEvent.pointerOver(trigger, { pointerType: 'touch' });
    tick(500);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
