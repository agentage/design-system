import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, buttonVariants } from './button';

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

// Frozen pre-CVA output for the default size; `md` must be an exact alias.
const BUTTON_DEFAULT_CLASS =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-3 py-1.5 has-[>svg]:px-2.5';

describe('Button size scale', () => {
  it('renders the default size byte-identically', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button').className).toBe(BUTTON_DEFAULT_CLASS);
  });

  it('renders md as an exact alias of default', () => {
    render(<Button size="md">Save</Button>);
    expect(screen.getByRole('button').className).toBe(BUTTON_DEFAULT_CLASS);
  });

  it('renders icon-md as an exact alias of icon', () => {
    expect(buttonVariants({ size: 'icon-md' })).toBe(buttonVariants({ size: 'icon' }));
  });

  it('merges className last', () => {
    render(<Button className="mt-4">Save</Button>);
    expect(screen.getByRole('button').className).toBe(`${BUTTON_DEFAULT_CLASS} mt-4`);
  });
});
