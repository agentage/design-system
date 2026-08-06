import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { Command, CommandEmpty, CommandGroup, CommandItem } from './command';

const renderPalette = (onOpenChange: Mock = vi.fn()): { onOpenChange: Mock } => {
  render(
    <Command open onOpenChange={onOpenChange}>
      <CommandGroup heading="Navigation">
        <CommandItem>Dashboard</CommandItem>
        <CommandItem>Machines</CommandItem>
        <CommandItem>Runs</CommandItem>
      </CommandGroup>
      <CommandEmpty>No results found.</CommandEmpty>
    </Command>
  );
  return { onOpenChange };
};

const input = (): HTMLElement => screen.getByRole('combobox');

describe('Command', () => {
  it('exposes a labelled dialog and search input', () => {
    renderPalette();
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    expect(input().getAttribute('aria-label')).toBe('Search');
  });

  it('filters items case-insensitively by their text', () => {
    renderPalette();
    fireEvent.change(input(), { target: { value: 'MACH' } });
    expect(screen.getByText('Machines').closest('button')?.hidden).toBe(false);
    expect(screen.getByText('Dashboard').closest('button')?.hidden).toBe(true);
  });

  it('shows the empty state when nothing matches', () => {
    renderPalette();
    expect(screen.queryByText('No results found.')).toBeNull();
    fireEvent.change(input(), { target: { value: 'zzz' } });
    expect(screen.getByText('No results found.')).not.toBeNull();
  });

  it('moves the active descendant with arrow keys', () => {
    renderPalette();
    const first = screen.getByText('Dashboard').closest('button');
    expect(input().getAttribute('aria-activedescendant')).toBe(first?.id);
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().getAttribute('aria-activedescendant')).toBe(
      screen.getByText('Machines').closest('button')?.id
    );
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().getAttribute('aria-activedescendant')).toBe(first?.id);
  });

  it('activates the highlighted item on Enter', () => {
    const onSelect = vi.fn();
    render(
      <Command open onOpenChange={vi.fn()}>
        <CommandItem onClick={onSelect}>Dashboard</CommandItem>
      </Command>
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const { onOpenChange } = renderPalette();
    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
