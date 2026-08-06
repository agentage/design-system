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

describe('CopyButton fallbacks', () => {
  it('falls back to execCommand when the async clipboard rejects', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true });

    render(<CopyButton text="npm i" />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
    });
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('shows an error state when both paths fail', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn(() => false),
      configurable: true,
    });

    render(<CopyButton text="npm i" />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeTruthy();
    });
    expect(button.dataset.error).toBe('true');
  });

  it('does not leave the fallback textarea in the document', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn(() => true),
      configurable: true,
    });

    render(<CopyButton text="npm i" />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
    });
    expect(document.querySelectorAll('textarea').length).toBe(0);
  });
});
