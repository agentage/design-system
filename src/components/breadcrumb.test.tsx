import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from './breadcrumb';

const setup = () =>
  render(
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

describe('Breadcrumb', () => {
  it('routes the root className through cn()', () => {
    setup();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' }).className).toContain('mb-2');
  });

  it('renders the current page as a plain span, not a fake link', () => {
    setup();
    const page = screen.getByText('Settings');
    expect(page.tagName).toBe('SPAN');
    expect(page.getAttribute('aria-current')).toBe('page');
    expect(page.getAttribute('role')).toBe(null);
    expect(page.getAttribute('aria-disabled')).toBe(null);
    expect(screen.queryAllByRole('link')).toHaveLength(1);
  });

  it('gives breadcrumb links a focus-visible ring', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Home' }).className).toContain(
      'focus-visible:ring-ring/50'
    );
  });
});
