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

// Frozen pre-CVA output of the isActive / value ternaries.
const OPTION_BASE =
  'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';
const SEARCH_BASE =
  'w-full rounded-lg border border-border bg-background py-2 pl-9 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors';
const CLEAR_BASE =
  'flex items-center gap-1 rounded-md px-2 py-1.5 self-end text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

const parityOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('filter bar class parity', () => {
  it('renders the option buttons byte-identically', () => {
    const { container } = render(
      <FilterButtonGroup options={parityOptions} value="a" onChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toBe(`${OPTION_BASE} bg-background text-foreground shadow-sm`);
    expect(buttons[1].className).toBe(`${OPTION_BASE} text-muted-foreground hover:text-foreground`);
  });

  it('renders the sort buttons with the same option classes', () => {
    const { container } = render(
      <FilterSort options={parityOptions} value="a" order="asc" onChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toBe(`${OPTION_BASE} bg-background text-foreground shadow-sm`);
    expect(buttons[1].className).toBe(`${OPTION_BASE} text-muted-foreground hover:text-foreground`);
  });

  it('swaps the search input padding on the query byte-identically', () => {
    const empty = render(<FilterSearch value="" onChange={vi.fn()} />);
    expect(empty.container.querySelector('input')?.className).toBe(`${SEARCH_BASE} pr-3`);
    empty.unmount();
    const filled = render(<FilterSearch value="q" onChange={vi.fn()} />);
    expect(filled.container.querySelector('input')?.className).toBe(`${SEARCH_BASE} pr-8`);
  });

  it('renders the clear button in both states byte-identically', () => {
    const on = render(<FilterClear active onClear={vi.fn()} className="mt-4" />);
    expect(on.container.querySelector('button')?.className).toBe(
      `${CLEAR_BASE} text-muted-foreground hover:text-foreground cursor-pointer mt-4`
    );
    on.unmount();
    const off = render(<FilterClear active={false} onClear={vi.fn()} />);
    expect(off.container.querySelector('button')?.className).toBe(
      `${CLEAR_BASE} text-transparent pointer-events-none`
    );
  });
});
