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
