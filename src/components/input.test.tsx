import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input, Textarea } from './input';

describe('Input class strings', () => {
  it('keeps the resting class string byte-identical', () => {
    render(<Input placeholder="Name" />);
    expect(screen.getByPlaceholderText('Name').className).toBe(
      'h-9 w-full rounded-md border bg-muted/30 px-3 text-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background border-border'
    );
  });

  it('keeps the error + disabled + className string byte-identical', () => {
    render(<Input placeholder="Name" error disabled className="mt-4" />);
    expect(screen.getByPlaceholderText('Name').className).toBe(
      'h-9 w-full rounded-md border bg-muted/30 px-3 text-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background border-destructive opacity-50 cursor-not-allowed mt-4'
    );
  });

  it('marks the control invalid on error', () => {
    render(<Input placeholder="Name" error />);
    expect(screen.getByPlaceholderText('Name').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Textarea class strings', () => {
  it('keeps the resting class string byte-identical', () => {
    render(<Textarea placeholder="Bio" />);
    expect(screen.getByPlaceholderText('Bio').className).toBe(
      'w-full rounded-md border bg-muted/30 px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none resize-none focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background border-border'
    );
  });

  it('keeps the error + disabled + className string byte-identical', () => {
    render(<Textarea placeholder="Bio" error disabled className="mt-4" />);
    expect(screen.getByPlaceholderText('Bio').className).toBe(
      'w-full rounded-md border bg-muted/30 px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none resize-none focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background border-destructive opacity-50 cursor-not-allowed mt-4'
    );
  });
});
