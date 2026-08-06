import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders a div by default and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<StatCard ref={ref} title="Memories" value={12} />);
    const card = container.querySelector('[data-slot="stat-card"]') as HTMLElement;
    expect(card.tagName).toBe('DIV');
    expect(ref.current).toBe(card);
  });

  it('renders a Progress footer when progress is set', () => {
    render(<StatCard title="Storage" value="4.2 GB" progress={42} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('42');
    expect(bar.getAttribute('aria-label')).toBe('Storage');
  });

  it('overrides the progress accessible name', () => {
    render(<StatCard title="Storage" value="4.2 GB" progress={42} progressLabel="Quota used" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-label')).toBe('Quota used');
  });

  it('omits the progress footer by default', () => {
    render(<StatCard title="Storage" value="4.2 GB" />);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('renders button semantics when pressable', async () => {
    const onClick = vi.fn();
    render(<StatCard title="Runs" value={3} pressable onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toContain('active:shadow-sm');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates a pressable card from the keyboard', async () => {
    const onClick = vi.fn();
    render(<StatCard title="Runs" value={3} pressable onClick={onClick} />);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is not a button by default', () => {
    render(<StatCard title="Runs" value={3} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
