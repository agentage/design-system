import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ResizableSplit,
  ResizableSplitPrepaint,
  resizableSplitPrepaint,
  resizableSplitVar,
} from './resizable-split';

const KEY = 'ag.split.demo.nav';
const VAR = resizableSplitVar(KEY);

const renderSplit = (onWidthChange?: (px: number) => void) =>
  render(
    <ResizableSplit
      storageKey={KEY}
      init={240}
      min={160}
      max={480}
      onWidthChange={onWidthChange}
      data-testid="split"
    >
      <p>nav</p>
      <p>main</p>
    </ResizableSplit>
  );

const handle = (): HTMLElement => screen.getByRole('separator');
const root = (): HTMLElement => document.documentElement;

afterEach(() => {
  window.localStorage.clear();
  root().style.removeProperty(VAR);
  vi.restoreAllMocks();
});

describe('ResizableSplit', () => {
  it('derives a css variable name from the storage key', () => {
    expect(VAR).toBe('--split-ag-split-demo-nav');
  });

  it('exposes the separator values', () => {
    renderSplit();
    expect(handle().getAttribute('aria-valuenow')).toBe('240');
    expect(handle().getAttribute('aria-valuemin')).toBe('160');
    expect(handle().getAttribute('aria-valuemax')).toBe('480');
  });

  it('first render already uses the stored width: the pre-paint variable, no later rewrite', () => {
    window.localStorage.setItem(KEY, '300');
    new Function(resizableSplitPrepaint([KEY]))();
    expect(root().style.getPropertyValue(VAR)).toBe('300px');

    renderSplit();

    const el = screen.getByTestId('split');
    const first = el.style.gridTemplateColumns;
    expect(first).toContain(`var(${VAR}, 240px)`);
    // The variable the grid reads holds the stored width from before mount, and mount never changes it.
    expect(root().style.getPropertyValue(VAR)).toBe('300px');
    expect(el.style.gridTemplateColumns).toBe(first);
    expect(handle().getAttribute('aria-valuenow')).toBe('300');
  });

  it('ignores a stored value that is not a sane width', () => {
    window.localStorage.setItem(KEY, '99999');
    new Function(resizableSplitPrepaint([KEY]))();
    expect(root().style.getPropertyValue(VAR)).toBe('');
    renderSplit();
    expect(handle().getAttribute('aria-valuenow')).toBe('240');
  });

  it('resizes with arrow keys, Shift, Home and End within the bounds', () => {
    const onWidthChange = vi.fn();
    renderSplit(onWidthChange);
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(handle().getAttribute('aria-valuenow')).toBe('256');
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true });
    expect(handle().getAttribute('aria-valuenow')).toBe('192');
    fireEvent.keyDown(handle(), { key: 'Home' });
    expect(handle().getAttribute('aria-valuenow')).toBe('160');
    fireEvent.keyDown(handle(), { key: 'ArrowLeft' });
    expect(handle().getAttribute('aria-valuenow')).toBe('160');
    fireEvent.keyDown(handle(), { key: 'End' });
    expect(handle().getAttribute('aria-valuenow')).toBe('480');
    expect(onWidthChange).toHaveBeenLastCalledWith(480);
    expect(window.localStorage.getItem(KEY)).toBe('480');
    expect(root().style.getPropertyValue(VAR)).toBe('480px');
  });

  it('ignores other keys', () => {
    renderSplit();
    fireEvent.keyDown(handle(), { key: 'a' });
    expect(handle().getAttribute('aria-valuenow')).toBe('240');
  });

  it('resizes by dragging, clamped to max', () => {
    renderSplit();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      width: 1000,
      height: 400,
      top: 0,
      right: 1010,
      bottom: 400,
      x: 10,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(handle(), { clientX: 250 });
    fireEvent.pointerMove(handle(), { clientX: 310 });
    expect(handle().getAttribute('aria-valuenow')).toBe('300');
    fireEvent.pointerMove(handle(), { clientX: 900 });
    expect(handle().getAttribute('aria-valuenow')).toBe('480');
    fireEvent.pointerUp(handle());
    fireEvent.pointerMove(handle(), { clientX: 200 });
    expect(handle().getAttribute('aria-valuenow')).toBe('480');
  });

  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderSplit();
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(handle().getAttribute('aria-valuenow')).toBe('256');
  });

  it('renders the pre-paint script element', () => {
    const { container } = render(<ResizableSplitPrepaint storageKeys={[KEY]} />);
    expect(container.querySelector('script')?.innerHTML).toContain(VAR);
  });
});
