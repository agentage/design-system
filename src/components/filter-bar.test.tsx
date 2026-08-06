import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  FilterBar,
  FilterButtonGroup,
  FilterClear,
  FilterResults,
  FilterSearch,
  FilterSort,
} from './filter-bar';

describe('FilterSearch', () => {
  it('gives the clear affordance a label and a focus ring', () => {
    render(<FilterSearch value="mcp" onChange={vi.fn()} />);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(clear.className).toContain('focus-visible:ring-2');
  });

  it('clears from the keyboard', async () => {
    const onChange = vi.fn();
    render(<FilterSearch value="mcp" onChange={onChange} />);
    screen.getByRole('button', { name: 'Clear search' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('forwards a ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FilterSearch ref={ref} value="" onChange={vi.fn()} />);
    expect(ref.current?.tagName).toBe('INPUT');
  });
});

describe('FilterButtonGroup', () => {
  const options = [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
  ];

  it('marks the active option pressed and keeps a focus ring', () => {
    render(<FilterButtonGroup options={options} value="live" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Live' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'All' }).className).toContain('focus-visible:ring-2');
  });

  it('selects from the keyboard', async () => {
    const onChange = vi.fn();
    render(<FilterButtonGroup options={options} value="live" onChange={onChange} />);
    screen.getByRole('button', { name: 'All' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('all');
  });
});

describe('FilterSort', () => {
  const options = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
  ];

  it('marks the active sort pressed', () => {
    render(<FilterSort options={options} value="name" order="asc" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Name/ }).getAttribute('aria-pressed')).toBe('true');
  });

  it('toggles direction from the keyboard', async () => {
    const onChange = vi.fn();
    render(<FilterSort options={options} value="name" order="asc" onChange={onChange} />);
    screen.getByRole('button', { name: /Name/ }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('name', 'desc');
  });
});

describe('FilterClear', () => {
  it('carries a focus ring and stays out of the tab order when inactive', async () => {
    const onClear = vi.fn();
    render(<FilterClear active={false} onClear={onClear} />);
    const button = screen.getByRole('button', { name: /Clear filters/ });
    expect(button.className).toContain('focus-visible:ring-2');
    expect((button as HTMLButtonElement).disabled).toBe(true);
    await userEvent.tab();
    expect(document.activeElement).not.toBe(button);
  });

  it('clears from the keyboard when active', async () => {
    const onClear = vi.fn();
    render(<FilterClear active onClear={onClear} />);
    screen.getByRole('button', { name: /Clear filters/ }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FilterClear ref={ref} active onClear={vi.fn()} />);
    expect(ref.current?.getAttribute('data-slot')).toBe('filter-clear');
  });
});

describe('FilterBar and FilterResults', () => {
  it('announces result-count changes politely', () => {
    const { rerender } = render(<FilterResults filtered={2} total={9} />);
    const region = screen.getByText(/Showing 2 of 9/).parentElement as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    rerender(<FilterResults filtered={9} total={9} />);
    expect(region.textContent).toContain('9 items');
  });

  it('forwards refs to the containers', () => {
    const bar = createRef<HTMLDivElement>();
    const results = createRef<HTMLDivElement>();
    render(
      <FilterBar ref={bar}>
        <FilterResults ref={results} filtered={1} total={1} />
      </FilterBar>
    );
    expect(bar.current?.getAttribute('data-slot')).toBe('filter-bar');
    expect(results.current?.getAttribute('data-slot')).toBe('filter-results');
  });
});
