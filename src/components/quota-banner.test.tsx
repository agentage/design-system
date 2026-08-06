import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuotaBanner } from './quota-banner';

const banner = (): HTMLElement | null => document.querySelector('[data-slot="quota-banner"]');

describe('QuotaBanner', () => {
  it('renders nothing below the warning threshold', () => {
    const { container } = render(<QuotaBanner label="storage" value={10} max={100} />);
    expect(container.firstChild).toBeNull();
  });

  it('warns politely once the warning threshold is crossed', () => {
    render(<QuotaBanner label="storage" value={82} max={100} />);
    const node = banner();
    expect(node?.getAttribute('role')).toBe('status');
    expect(node?.getAttribute('aria-live')).toBe('polite');
    expect(node?.dataset.level).toBe('warning');
    expect(node?.className).toContain('border-warning/30');
    expect(screen.getByText('You are approaching your storage limit (82% used).')).not.toBeNull();
  });

  it('escalates to destructive near and at the limit', () => {
    const { rerender } = render(<QuotaBanner label="storage" value={97} max={100} />);
    expect(banner()?.dataset.level).toBe('critical');
    expect(banner()?.className).toContain('border-destructive/30');
    expect(screen.getByText('You are almost out of storage (97% used).')).not.toBeNull();

    rerender(<QuotaBanner label="storage" value={120} max={100} />);
    expect(screen.getByText('You have reached your storage limit (120% used).')).not.toBeNull();
  });

  it('accepts custom thresholds, message and an action slot', () => {
    render(
      <QuotaBanner
        label="memories"
        value={60}
        max={100}
        thresholds={{ warning: 0.5, critical: 0.9 }}
        message="Only 40 memories left on the free plan."
        action={<button type="button">Upgrade</button>}
      />
    );
    expect(screen.getByText('Only 40 memories left on the free plan.')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Upgrade' })).not.toBeNull();
  });
});
