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
