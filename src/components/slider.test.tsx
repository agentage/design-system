import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Slider } from './slider';

const thumb = (): HTMLElement =>
  document.querySelector('[data-slot="slider-thumb"]') as HTMLElement;

describe('Slider class strings', () => {
  it('keeps the resting class strings byte-identical', () => {
    render(<Slider aria-label="Volume" />);
    expect(screen.getByRole('slider').className).toBe(
      'group relative flex h-5 w-full touch-none select-none items-center cursor-pointer outline-none'
    );
    expect(thumb().className).toBe(
      'pointer-events-none absolute size-4 rounded-full border-2 border-primary bg-foreground shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-ring/50 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background group-hover:scale-110'
    );
  });

  it('keeps the disabled + className strings byte-identical', () => {
    render(<Slider aria-label="Volume" disabled className="mt-4" />);
    expect(screen.getByRole('slider').className).toBe(
      'group relative flex h-5 w-full touch-none select-none items-center outline-none opacity-50 cursor-not-allowed mt-4'
    );
    expect(thumb().className).toBe(
      'pointer-events-none absolute size-4 rounded-full border-2 border-primary bg-foreground shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-ring/50 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background'
    );
  });

  it('marks the control invalid and swaps the thumb border on error', () => {
    render(<Slider aria-label="Volume" error />);
    expect(screen.getByRole('slider').getAttribute('aria-invalid')).toBe('true');
    expect(thumb().className).toContain('border-destructive');
    expect(thumb().className).not.toContain('border-primary');
  });

  it('spreads unknown props onto the root and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Slider ref={ref} aria-label="Volume" data-testid="sl" id="vol" />);
    expect(screen.getByTestId('sl')).toBe(screen.getByRole('slider'));
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(screen.getByRole('slider').id).toBe('vol');
  });
});
