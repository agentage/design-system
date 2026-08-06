import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker';

const nativeInput = (container: HTMLElement): HTMLInputElement => {
  const input = container.querySelector<HTMLInputElement>('input[type="date"]');
  if (!input) throw new Error('no native date input');
  return input;
};

describe('DatePicker', () => {
  it('announces the trigger as opening a dialog', () => {
    render(<DatePicker />);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('reports expanded once showPicker succeeds', () => {
    const { container } = render(<DatePicker />);
    const input = nativeInput(container);
    input.showPicker = vi.fn();
    fireEvent.click(screen.getByRole('button'));
    expect(input.showPicker).toHaveBeenCalled();
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('collapses again once a date is picked', () => {
    const { container } = render(<DatePicker />);
    const input = nativeInput(container);
    input.showPicker = vi.fn();
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(input, { target: { value: '2026-03-04' } });
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('falls back to focusing the input when showPicker throws', () => {
    const { container } = render(<DatePicker />);
    const input = nativeInput(container);
    input.showPicker = vi.fn(() => {
      throw new Error('NotAllowedError');
    });
    fireEvent.click(screen.getByRole('button'));
    expect(document.activeElement).toBe(input);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('survives a runtime without showPicker at all', () => {
    const { container } = render(<DatePicker />);
    expect(() => {
      fireEvent.click(screen.getByRole('button'));
    }).not.toThrow();
    expect(document.activeElement).toBe(nativeInput(container));
  });

  it('resyncs the native input when a controlled value changes', () => {
    const { container, rerender } = render(<DatePicker value={new Date('2026-01-02T00:00:00Z')} />);
    expect(nativeInput(container).value).toBe('2026-01-02');
    rerender(<DatePicker value={new Date('2026-05-06T00:00:00Z')} />);
    expect(nativeInput(container).value).toBe('2026-05-06');
  });

  it('reports the picked date', () => {
    const onValueChange = vi.fn();
    const { container } = render(<DatePicker onValueChange={onValueChange} />);
    fireEvent.change(nativeInput(container), { target: { value: '2026-07-08' } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('stays inert when disabled', () => {
    const { container } = render(<DatePicker disabled />);
    const input = nativeInput(container);
    input.showPicker = vi.fn();
    fireEvent.click(screen.getByRole('button'));
    expect(input.showPicker).not.toHaveBeenCalled();
  });
});

describe('DatePicker class strings', () => {
  it('keeps the placeholder trigger class string byte-identical', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button').className).toBe(
      'flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-sm cursor-pointer transition-colors hover:border-ring focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-muted-foreground'
    );
  });

  it('keeps the filled + disabled trigger class string byte-identical', () => {
    render(<DatePicker value={new Date('2026-01-02T00:00:00')} disabled className="mt-4" />);
    expect(screen.getByRole('button').className).toBe(
      'flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-sm transition-colors hover:border-ring focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 opacity-50 cursor-not-allowed'
    );
  });

  it('keeps the root class string byte-identical', () => {
    const { container } = render(<DatePicker className="mt-4" />);
    expect((container.querySelector('[data-slot="date-picker"]') as HTMLElement).className).toBe(
      'relative mt-4'
    );
  });

  it('marks the trigger invalid and swaps the resting border on error', () => {
    render(<DatePicker error />);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.className).toContain('border-destructive');
    expect(trigger.className).not.toContain('border-border');
  });

  it('spreads unknown props onto the root', () => {
    render(<DatePicker data-testid="dp" />);
    expect(screen.getByTestId('dp').getAttribute('data-slot')).toBe('date-picker');
  });
});
