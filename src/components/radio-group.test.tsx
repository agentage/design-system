import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './radio-group';

const setup = (props: { value?: string; name?: string; onValueChange?: () => void } = {}) =>
  render(
    <RadioGroup aria-label="Plan" {...props}>
      <RadioGroupItem value="free">Free</RadioGroupItem>
      <RadioGroupItem value="pro" disabled>
        Pro
      </RadioGroupItem>
      <RadioGroupItem value="team">Team</RadioGroupItem>
    </RadioGroup>
  );

const radios = (): HTMLElement[] => screen.getAllByRole('radio');

describe('RadioGroup', () => {
  it('announces each item once, from the button only', () => {
    const { container } = setup({ name: 'plan' });
    expect(radios()).toHaveLength(3);
    const native = container.querySelectorAll('input[type="radio"]');
    expect(native).toHaveLength(3);
    native.forEach((input) => {
      expect(input.getAttribute('aria-hidden')).toBe('true');
      expect(input.getAttribute('tabindex')).toBe('-1');
    });
  });

  it('names the radio from its label text', () => {
    setup();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeNull();
  });

  it('groups the hidden inputs under a generated name when none is given', () => {
    const { container } = setup();
    const names = Array.from(container.querySelectorAll('input')).map((i) => i.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).not.toBe('');
  });

  it('carries the value for form submission', () => {
    const { container } = setup({ name: 'plan', value: 'team' });
    const checked = container.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    expect(checked?.value).toBe('team');
    expect(checked?.name).toBe('plan');
  });

  it('gives the first enabled item the tab stop when nothing is selected', () => {
    setup();
    expect(radios().map((r) => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('moves the tab stop to the selected item', () => {
    setup({ value: 'team' });
    expect(radios().map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
  });

  it('moves focus and selection with the arrow keys, skipping disabled items', () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    const [free, , team] = radios();
    free.focus();

    fireEvent.keyDown(free, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(team);
    expect(onValueChange).toHaveBeenLastCalledWith('team');
  });

  it('wraps around on both axes', () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    const [free, , team] = radios();
    team.focus();

    fireEvent.keyDown(team, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(free);
    fireEvent.keyDown(free, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(team);
    expect(onValueChange).toHaveBeenLastCalledWith('team');
  });

  it('jumps to the ends with Home and End', () => {
    setup();
    const [free, , team] = radios();
    free.focus();

    fireEvent.keyDown(free, { key: 'End' });
    expect(document.activeElement).toBe(team);
    fireEvent.keyDown(team, { key: 'Home' });
    expect(document.activeElement).toBe(free);
  });

  it('selects from a click on the label text', () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.click(screen.getByText('Team'));
    expect(onValueChange).toHaveBeenCalledWith('team');
  });

  it('reports a single change when the control itself is clicked', () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.click(radios()[0]);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('leaves disabled items inert', () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    fireEvent.click(screen.getByText('Pro'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('RadioGroup class strings', () => {
  const tree = (): void => {
    render(
      <RadioGroup value="a" className="mt-4">
        <RadioGroupItem value="a">A</RadioGroupItem>
        <RadioGroupItem value="b" disabled className="pl-2">
          B
        </RadioGroupItem>
      </RadioGroup>
    );
  };

  it('keeps the root class string byte-identical', () => {
    tree();
    expect(screen.getByRole('radiogroup').className).toBe('grid gap-2 mt-4');
  });

  it('keeps the selected indicator class string byte-identical', () => {
    tree();
    expect(screen.getAllByRole('radio')[0].className).toBe(
      'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 border-primary bg-primary'
    );
  });

  it('keeps the disabled item label class string byte-identical', () => {
    tree();
    expect((screen.getAllByRole('radio')[1].parentElement as HTMLElement).className).toBe(
      'flex items-center gap-2 text-sm opacity-50 cursor-not-allowed pl-2'
    );
  });

  it('marks the group invalid and swaps the item border on error', () => {
    render(
      <RadioGroup value="a" error aria-label="Plan">
        <RadioGroupItem value="a" error>
          A
        </RadioGroupItem>
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('radio').className).toContain('border-destructive');
  });

  it('spreads unknown props onto the group and the item button', () => {
    render(
      <RadioGroup value="a" data-testid="group" aria-label="Plan">
        <RadioGroupItem value="a" data-testid="item">
          A
        </RadioGroupItem>
      </RadioGroup>
    );
    expect(screen.getByTestId('group')).toBe(screen.getByRole('radiogroup'));
    expect(screen.getByTestId('item')).toBe(screen.getByRole('radio'));
  });
});
