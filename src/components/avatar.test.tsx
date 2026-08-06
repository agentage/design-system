import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('names the initials avatar from the name prop', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    const root = container.querySelector('[data-slot="avatar"]');
    expect(root?.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(screen.getByText('AL').getAttribute('aria-hidden')).toBe(null);
  });

  it('prefers a caller-supplied aria-label', () => {
    const { container } = render(<Avatar name="Ada Lovelace" aria-label="Owner" />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(
      'Owner'
    );
  });

  it('leaves the avatar unlabeled without a name or aria-label', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(null);
  });

  it('lets the image alt carry the name when an image renders', () => {
    const { container } = render(<Avatar name="Ada" src="/a.png" />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(null);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Ada');
  });
});
