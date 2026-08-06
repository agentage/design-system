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

describe('avatarVariants', () => {
  it('renders the exact class string for every size', () => {
    const base =
      'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground font-medium';
    const sizes = {
      xs: 'size-6 text-2xs',
      sm: 'size-8 text-xs',
      md: 'size-10 text-sm',
      lg: 'size-12 text-base',
      xl: 'size-16 text-lg',
      '2xl': 'size-20 text-xl',
    } as const;

    for (const [size, tail] of Object.entries(sizes)) {
      const { container, unmount } = render(<Avatar size={size as keyof typeof sizes} name="A" />);
      expect(container.querySelector('[data-slot="avatar"]')?.className).toBe(`${base} ${tail}`);
      unmount();
    }
  });

  it('merges className last and keeps the md default', () => {
    const { container } = render(<Avatar name="A" className="ring-2" />);
    expect(container.querySelector('[data-slot="avatar"]')?.className).toBe(
      'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground font-medium size-10 text-sm ring-2'
    );
  });
});
