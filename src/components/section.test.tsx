import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageLayout } from './page-layout';
import { Section } from './section';

describe('Section', () => {
  it('merges className last and spreads props on the root', () => {
    const { container } = render(
      <Section title="T" className="p-6" id="sec" data-x="s">
        body
      </Section>
    );
    const root = container.querySelector('[data-slot="section"]') as HTMLElement;
    expect(root.className).toBe('rounded-lg border border-border bg-sidebar p-6');
    expect(root.id).toBe('sec');
    expect(root.dataset.x).toBe('s');
  });

  it('hides the decorative icon from assistive tech', () => {
    const { container } = render(
      <Section title="T" icon={<svg />}>
        body
      </Section>
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});

describe('PageLayout', () => {
  it('keeps the root class stable and merges rootClassName when given', () => {
    const { container, unmount } = render(<PageLayout title="T">body</PageLayout>);
    expect((container.querySelector('[data-slot="page-layout"]') as HTMLElement).className).toBe(
      'flex h-full flex-col'
    );
    unmount();

    const next = render(
      <PageLayout title="T" rootClassName="bg-card">
        body
      </PageLayout>
    );
    expect(
      (next.container.querySelector('[data-slot="page-layout"]') as HTMLElement).className
    ).toBe('flex h-full flex-col bg-card');
  });

  it('routes className to the nested page header', () => {
    const { container } = render(
      <PageLayout title="T" className="mb-1">
        body
      </PageLayout>
    );
    expect((container.querySelector('[data-slot="page-header"]') as HTMLElement).className).toBe(
      'flex items-center justify-between gap-3 h-[52px] mb-1'
    );
    expect(screen.getByText('body')).toBeTruthy();
  });
});
