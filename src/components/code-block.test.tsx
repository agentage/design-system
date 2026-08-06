import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock, InlineCode } from './code-block';

const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});

describe('CodeBlock', () => {
  it('keeps the copy affordance labelled, focus-visible and reachable by keyboard', async () => {
    render(<CodeBlock code="npm i" />);
    const copy = screen.getByRole('button', { name: 'Copy code' });
    expect(copy.className).toContain('focus-visible:ring-2');
    expect(copy.className).toContain('focus:opacity-100');

    await userEvent.tab();
    expect(document.activeElement).toBe(copy);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(copy.getAttribute('aria-label')).toBe('Copied'));
    expect(writeText).toHaveBeenCalledWith('npm i');
  });

  it('forwards refs from the block and from inline code', () => {
    const block = createRef<HTMLDivElement>();
    const inline = createRef<HTMLElement>();
    render(
      <>
        <CodeBlock ref={block} code="npm i" />
        <InlineCode ref={inline}>npm i</InlineCode>
      </>
    );
    expect(block.current?.getAttribute('data-slot')).toBe('code-block');
    expect(inline.current?.getAttribute('data-slot')).toBe('inline-code');
  });
});

// Frozen pre-CVA output of the copy button's `language && 'top-10'` conditional.
const COPY_BASE =
  'absolute right-2 top-2 rounded-md p-1.5 transition-colors text-muted-foreground hover:bg-accent hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

describe('CodeBlock class parity', () => {
  it('renders the copy button without a language header byte-identically', () => {
    render(<CodeBlock code="x" />);
    expect(screen.getByRole('button').className).toBe(COPY_BASE);
  });

  it('drops top-2 for top-10 when a language header is present', () => {
    render(<CodeBlock code="x" language="ts" />);
    expect(screen.getByRole('button').className).toBe(
      `${COPY_BASE.replace('right-2 top-2', 'right-2')} top-10`
    );
  });

  it('merges className last on the root and spreads props', () => {
    const { container } = render(<CodeBlock code="x" className="mt-4" id="cb" />);
    const root = container.querySelector('[data-slot="code-block"]');
    expect(root?.className).toBe('relative group rounded-lg border border-border bg-card mt-4');
    expect(root?.id).toBe('cb');
  });
});

describe('CodeBlock highlighted slot', () => {
  it('renders pre-tokenized children instead of the raw code', () => {
    const { container } = render(
      <CodeBlock code="const a = 1;">
        <code data-testid="hl">
          <span className="tok">const</span> a = 1;
        </code>
      </CodeBlock>
    );
    expect(screen.getByTestId('hl')).toBeTruthy();
    expect((container.querySelector('pre') as HTMLElement).querySelectorAll('code').length).toBe(1);
  });

  it('still copies the raw code when children are supplied', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(
      <CodeBlock code="const a = 1;">
        <code>tokens</code>
      </CodeBlock>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('const a = 1;');
    });
  });
});
