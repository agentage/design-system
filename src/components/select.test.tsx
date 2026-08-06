import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select, SelectTrigger, SelectValue } from './select';

const trigger = (props: { compact?: boolean; error?: boolean; className?: string }): void => {
  render(
    <Select>
      <SelectTrigger {...props}>
        <SelectValue placeholder="Pick" />
      </SelectTrigger>
    </Select>
  );
};

describe('SelectTrigger class strings', () => {
  it('keeps the default class string byte-identical', () => {
    trigger({ className: 'mt-4' });
    expect(screen.getByRole('combobox').className).toBe(
      'inline-flex w-full items-center justify-between gap-2 rounded-md border border-border text-foreground transition-colors focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 data-[placeholder]:text-muted-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:truncate [&>span:first-child]:text-left h-9 px-3 text-sm bg-muted/30 focus:bg-background mt-4'
    );
  });

  it('keeps the compact class string byte-identical', () => {
    trigger({ compact: true });
    expect(screen.getByRole('combobox').className).toBe(
      'inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-background text-foreground transition-colors focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 data-[placeholder]:text-muted-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:truncate [&>span:first-child]:text-left h-7 px-2 text-xs'
    );
  });

  it('marks the trigger invalid and swaps the resting border on error', () => {
    trigger({ error: true });
    const el = screen.getByRole('combobox');
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.className).toContain('border-destructive');
    expect(el.className).not.toContain('border-border');
  });
});
