import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownRenderer } from './markdown';

describe('MarkdownRenderer', () => {
  it('renders markdown inside a prose wrapper', () => {
    const { container } = render(<MarkdownRenderer># Title</MarkdownRenderer>);
    expect(container.querySelector('[data-slot="markdown-renderer"]')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Title');
  });

  it('forwards per-node components to react-markdown', () => {
    render(
      <MarkdownRenderer
        components={{
          a: ({ children, ...props }) => (
            <a data-testid="custom-link" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {'[docs](https://example.com)'}
      </MarkdownRenderer>
    );
    const link = screen.getByTestId('custom-link');
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.textContent).toBe('docs');
  });
});
