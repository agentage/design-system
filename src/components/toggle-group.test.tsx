import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton, ToggleGroup, type ToggleOption } from './toggle-group';

const options: ToggleOption<'day' | 'week' | 'month'>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const setup = (
  props: { value?: 'day' | 'week' | 'month'; columns?: 1 | 2 | 3 | 4 | 5 | 6 } = {}
) => {
  const onChange = vi.fn();
  const { container } = render(
    <ToggleGroup
      aria-label="Range"
      options={options}
      value={props.value ?? 'day'}
      columns={props.columns}
      onChange={onChange}
    />
  );
  return { onChange, group: container.firstElementChild as HTMLElement };
};

const buttons = (): HTMLElement[] => screen.getAllByRole('radio');

describe('ToggleGroup', () => {
  it('keeps a single tab stop on the selected option', () => {
    setup({ value: 'week' });
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('falls back to the first option when the value matches nothing', () => {
    render(<ToggleGroup options={options} value={'none' as 'day'} onChange={vi.fn()} />);
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('moves focus and selection with the arrow keys, wrapping at both ends', () => {
    const { onChange } = setup({ value: 'day' });
    const [day, week, month] = buttons();
    day.focus();

    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('week');
    expect(document.activeElement).toBe(week);

    fireEvent.keyDown(week, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith('month');

    fireEvent.keyDown(month, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('day');
    fireEvent.keyDown(day, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('month');
  });

  it('jumps to the ends with Home and End', () => {
    const { onChange } = setup({ value: 'week' });
    const [, week] = buttons();
    week.focus();

    fireEvent.keyDown(week, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('month');
    fireEvent.keyDown(week, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('day');
  });

  it('ignores keys that do not navigate', () => {
    const { onChange, group } = setup();
    fireEvent.keyDown(group, { key: 'a' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('derives the column count from the options instead of always using three', () => {
    const { group } = setup();
    expect(group.className).toContain('grid-cols-3');
    expect(group.getAttribute('style')).toBeNull();
  });

  it('honours an explicit columns prop', () => {
    const { group } = setup({ columns: 6 });
    expect(group.className).toContain('grid-cols-6');
  });

  it('falls back to an inline template past the static class map', () => {
    const many = Array.from({ length: 7 }, (_, i) => ({
      value: `v${String(i)}`,
      label: `L${String(i)}`,
    }));
    const { container } = render(<ToggleGroup options={many} value="v0" onChange={vi.fn()} />);
    const group = container.firstElementChild as HTMLElement;
    expect(group.className).not.toContain('grid-cols-');
    expect(group.style.gridTemplateColumns).toBe('repeat(7, minmax(0, 1fr))');
  });
});

describe('ToggleGroup class strings', () => {
  const two = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  it('keeps the root class string byte-identical', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} className="mt-4" />);
    expect(screen.getByRole('radiogroup').className).toBe('grid gap-2 grid-cols-2 mt-4');
  });

  it('falls back to an inline grid template past six columns', () => {
    const many = 'abcdefg'.split('').map((v) => ({ value: v, label: v.toUpperCase() }));
    render(<ToggleGroup value="a" onChange={() => {}} options={many} />);
    const root = screen.getByRole('radiogroup');
    expect(root.className).toBe('grid gap-2');
    expect(root.style.gridTemplateColumns).toBe('repeat(7, minmax(0, 1fr))');
  });

  it('keeps the selected and unselected button strings byte-identical', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons[0].className).toBe(
      'flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-primary text-primary-foreground'
    );
    expect(buttons[1].className).toBe(
      'flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground border border-border'
    );
  });

  it('keeps the standalone vertical button string byte-identical', () => {
    render(
      <ToggleButton selected={false} onClick={() => {}} vertical className="mt-4">
        X
      </ToggleButton>
    );
    expect(screen.getByRole('radio').className).toBe(
      'flex items-center justify-center rounded-md px-3 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground border border-border flex-col gap-1 py-1.5 mt-4'
    );
  });

  it('marks the group invalid and outlines the buttons on error', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} error aria-label="View" />);
    expect(screen.getByRole('radiogroup').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getAllByRole('radio')[0].className).toContain('border-destructive');
  });

  it('spreads unknown props onto the group', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} data-testid="tg" />);
    expect(screen.getByTestId('tg')).toBe(screen.getByRole('radiogroup'));
  });
});
