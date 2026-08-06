import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './combobox';

const options: ComboboxOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

const setup = (props: { value?: string } = {}) => {
  const onValueChange = vi.fn();
  render(<Combobox options={options} onValueChange={onValueChange} {...props} />);
  const trigger = screen.getByRole('button', { name: /select|red|green|blue/i });
  fireEvent.click(trigger);
  return { onValueChange, trigger, input: screen.getByRole('combobox') };
};

const optionEls = (): HTMLElement[] => screen.getAllByRole('option');

describe('Combobox', () => {
  it('marks the search input as the combobox', () => {
    const { input } = setup();
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });

  it('starts with no active option', () => {
    const { input } = setup();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('points aria-activedescendant at the option the arrows land on', () => {
    const { input } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[1].id);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('wraps at both ends and honours Home and End', () => {
    const { input } = setup();
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    fireEvent.keyDown(input, { key: 'End' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('selects the active option with Enter and closes', () => {
    const { input, onValueChange } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('green');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('ignores Enter while no option is active', () => {
    const { input, onValueChange } = setup();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).not.toBeNull();
  });

  it('closes on Escape', () => {
    setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('resets the active option when the filter changes', () => {
    const { input } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'e' } });
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('announces the empty state politely', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'zzz' } });
    const empty = screen.getByText('No results found.');
    expect(empty.getAttribute('aria-live')).toBe('polite');
  });

  it('still selects on click', () => {
    const { onValueChange } = setup();
    fireEvent.click(screen.getByRole('option', { name: /Blue/ }));
    expect(onValueChange).toHaveBeenCalledWith('blue');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Combobox class strings', () => {
  const opts = [{ value: 'a', label: 'A' }];

  it('keeps the placeholder trigger class string byte-identical', () => {
    render(<Combobox options={opts} />);
    expect(screen.getByRole('button').className).toBe(
      'flex h-9 w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 text-sm transition-colors focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-muted-foreground'
    );
  });

  it('keeps the selected + disabled trigger class string byte-identical', () => {
    render(<Combobox options={opts} value="a" disabled className="mt-4" />);
    expect(screen.getByRole('button').className).toBe(
      'flex h-9 w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 text-sm transition-colors focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 opacity-50 cursor-not-allowed'
    );
  });

  it('keeps the root class string byte-identical', () => {
    const { container } = render(<Combobox options={opts} className="mt-4" />);
    expect((container.querySelector('[data-slot="combobox"]') as HTMLElement).className).toBe(
      'relative mt-4'
    );
  });

  it('marks the trigger invalid and swaps the resting border on error', () => {
    render(<Combobox options={opts} error />);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.className).toContain('border-destructive');
    expect(trigger.className).not.toContain('border-border');
  });

  it('spreads unknown props onto the root', () => {
    render(<Combobox options={opts} data-testid="cbx" />);
    expect(screen.getByTestId('cbx').getAttribute('data-slot')).toBe('combobox');
  });
});
