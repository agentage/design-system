import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('forwards a ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.getAttribute('data-slot')).toBe('button');
  });

  it('forwards a ref through Slot when asChild is set', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/docs">Docs</a>
      </Button>
    );
    expect(ref.current?.tagName).toBe('A');
    expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('data-slot')).toBe('button');
  });

  it('keeps a focus-visible ring', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).className).toContain(
      'focus-visible:ring-ring/50'
    );
  });
});
