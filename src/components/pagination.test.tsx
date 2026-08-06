import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('names the navigation landmark and allows an override', () => {
    const { unmount } = render(<Pagination page={2} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
    unmount();

    render(<Pagination page={2} pageCount={5} onPageChange={vi.fn()} aria-label="Results pages" />);
    expect(screen.getByRole('navigation', { name: 'Results pages' })).toBeTruthy();
  });

  it('marks the active page and labels the step buttons', () => {
    render(<Pagination page={2} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: '3' }).getAttribute('aria-current')).toBe(null);
    for (const name of ['First page', 'Previous page', 'Next page', 'Last page']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('gives every page button a focus-visible ring', () => {
    render(<Pagination page={1} pageCount={3} onPageChange={vi.fn()} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.className).toContain('focus-visible:ring-ring/50');
    }
  });
});
