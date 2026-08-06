import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from './copy-button';

const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

describe('CopyButton', () => {
  it('announces the copied state through a polite live region', async () => {
    render(<CopyButton text="npm i" />);
    const live = screen.getByText('Copy');
    expect(live.getAttribute('aria-live')).toBe('polite');

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByText('Copied').getAttribute('aria-live')).toBe('polite')
    );
    expect(writeText).toHaveBeenCalledWith('npm i');
  });

  it('flips the accessible name when icon-only', async () => {
    render(<CopyButton text="npm i" iconOnly />);
    const button = screen.getByRole('button', { name: 'Copy' });
    await userEvent.click(button);
    await waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copied'));
  });

  it('copies from the keyboard', async () => {
    render(<CopyButton text="npm i" />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('npm i'));
  });

  it('forwards a ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<CopyButton ref={ref} text="npm i" />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});
