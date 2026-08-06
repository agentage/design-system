import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast } from './toast';

const Trigger = (): React.JSX.Element => {
  const { toast } = useToast();
  return (
    <>
      <button type="button" onClick={() => toast({ title: 'Run started' })}>
        Notify
      </button>
      <button type="button" onClick={() => toast({ title: 'Run failed', variant: 'destructive' })}>
        Fail
      </button>
    </>
  );
};

const setup = (): { container: HTMLElement } => {
  const { container } = render(
    <div style={{ overflow: 'hidden' }}>
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    </div>
  );
  return { container };
};

const containerRegion = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-slot="toast-container"]') as HTMLElement;

describe('ToastProvider', () => {
  it('portals a polite live region to document.body', () => {
    const { container } = setup();
    expect(container.querySelector('[data-slot="toast-container"]')).toBeNull();

    const region = containerRegion();
    expect(region.parentElement).toBe(document.body);
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
  });

  it('announces destructive toasts assertively', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(
      screen.getByText('Run started').closest('[data-slot="toast"]')?.getAttribute('role')
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Fail' }));
    expect(screen.getByRole('alert').textContent).toContain('Run failed');
  });

  it('labels the dismiss button and removes the toast', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    const dismiss = screen.getByRole('button', { name: 'Dismiss Run started' });
    expect(dismiss.className).toContain('focus-visible:ring-2');

    fireEvent.click(dismiss);
    expect(screen.queryByText('Run started')).toBeNull();
  });
});
