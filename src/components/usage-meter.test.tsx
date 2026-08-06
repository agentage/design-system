import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UsageMeter } from './usage-meter';

const meter = (): HTMLElement => screen.getByRole('meter');
const fill = (): HTMLElement => document.querySelector('[data-slot="usage-meter-fill"]')!;

describe('UsageMeter', () => {
  it('names the meter through the label row and exposes the value range', () => {
    render(<UsageMeter label="Storage" value={17} max={100} />);
    expect(meter().getAttribute('aria-valuenow')).toBe('17');
    expect(meter().getAttribute('aria-valuemin')).toBe('0');
    expect(meter().getAttribute('aria-valuemax')).toBe('100');
    expect(screen.getByRole('meter', { name: 'Storage' })).toBe(meter());
    expect(meter().getAttribute('aria-valuetext')).toBe('17 / 100');
    expect(fill().style.width).toBe('17%');
  });

  it('escalates default -> warning -> critical across the thresholds', () => {
    const { rerender } = render(<UsageMeter label="Storage" value={50} max={100} />);
    expect(screen.getByText('50 / 100').parentElement?.parentElement?.dataset.level).toBe(
      'default'
    );
    expect(fill().className).toContain('bg-primary');

    rerender(<UsageMeter label="Storage" value={85} max={100} />);
    expect(fill().className).toContain('bg-warning');

    rerender(<UsageMeter label="Storage" value={96} max={100} />);
    expect(fill().className).toContain('bg-destructive');
  });

  it('honours custom thresholds', () => {
    render(<UsageMeter label="Runs" value={55} max={100} thresholds={{ warning: 0.5 }} />);
    expect(fill().className).toContain('bg-warning');
  });

  it('formats the value through formatValue and caps the fill at 100%', () => {
    render(
      <UsageMeter
        label="Storage"
        value={120}
        max={100}
        formatValue={(v, m) => `${String(v)} MB of ${String(m)} MB`}
      />
    );
    expect(screen.getByText('120 MB of 100 MB')).not.toBeNull();
    expect(meter().getAttribute('aria-valuetext')).toBe('120 MB of 100 MB');
    expect(fill().style.width).toBe('100%');
  });

  it('hides the value column when showValue is false', () => {
    render(<UsageMeter label="Storage" value={17} max={100} showValue={false} />);
    expect(document.querySelector('[data-slot="usage-meter-value"]')).toBeNull();
  });

  it('switches the track height by size and forwards ref plus className', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <UsageMeter ref={ref} label="Storage" value={1} max={10} size="sm" className="mt-4" />
    );
    expect(ref.current?.className).toBe('space-y-1.5 mt-4');
    expect(meter().className).toContain('h-1.5');
    rerender(<UsageMeter label="Storage" value={1} max={10} size="md" />);
    expect(meter().className).toContain('h-2');
  });

  it('treats a zero max as empty rather than dividing by zero', () => {
    render(<UsageMeter label="Storage" value={5} max={0} />);
    expect(fill().style.width).toBe('0%');
  });
});
