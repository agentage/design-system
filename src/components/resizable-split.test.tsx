import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ResizableSplit,
  resizableSplitCollapsedVar,
  resizableSplitVar,
  useResizableSplit,
  type ResizableSplitProps,
} from './resizable-split';
import { escapeForScript } from '../lib/split-px';
import { ResizableSplitPrepaint, resizableSplitPrepaint } from './resizable-split-prepaint';

const KEY = 'ag.split.demo.nav';
const VAR = resizableSplitVar(KEY);

const renderSplit = (
  onWidthChange?: (px: number) => void,
  extra: Partial<ResizableSplitProps> = {}
) =>
  render(
    <ResizableSplit
      storageKey={KEY}
      init={240}
      min={160}
      max={480}
      onWidthChange={onWidthChange}
      data-testid="split"
      {...extra}
    >
      <p>nav</p>
      <p>main</p>
    </ResizableSplit>
  );

const mockRect = (): void => {
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
};

const handle = (): HTMLElement => screen.getByRole('separator');
const root = (): HTMLElement => document.documentElement;

afterEach(() => {
  window.localStorage.clear();
  root().style.removeProperty(VAR);
  root().style.removeProperty(resizableSplitCollapsedVar(KEY));
  vi.restoreAllMocks();
});

describe('ResizableSplit', () => {
  it('derives a css variable name from the storage key', () => {
    expect(VAR).toBe('--split-ag_2e_split_2e_demo_2e_nav');
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

  it('without the prepaint script the mount applies the stored width to the layout variable', () => {
    window.localStorage.setItem(KEY, '300');
    renderSplit();
    expect(root().style.getPropertyValue(VAR)).toBe('300px');
    expect(handle().getAttribute('aria-valuenow')).toBe('300');
    expect(handle().getAttribute('aria-valuetext')).toBe('300px');
  });

  it('keeps the grab offset while dragging', () => {
    renderSplit();
    mockRect();
    fireEvent.pointerDown(handle(), { clientX: 255 });
    fireEvent.pointerMove(handle(), { clientX: 255 });
    expect(handle().getAttribute('aria-valuenow')).toBe('240');
    fireEvent.pointerMove(handle(), { clientX: 315 });
    expect(handle().getAttribute('aria-valuenow')).toBe('300');
  });

  it('mirrors arrows and drag in RTL', () => {
    render(
      <div dir="rtl">
        <ResizableSplit storageKey={KEY} init={240} min={160} max={480}>
          <p>a</p>
          <p>b</p>
        </ResizableSplit>
      </div>
    );
    fireEvent.keyDown(handle(), { key: 'ArrowLeft' });
    expect(handle().getAttribute('aria-valuenow')).toBe('256');
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(handle().getAttribute('aria-valuenow')).toBe('224');
    mockRect();
    fireEvent.pointerDown(handle(), { clientX: 786 });
    fireEvent.pointerMove(handle(), { clientX: 726 });
    expect(handle().getAttribute('aria-valuenow')).toBe('284');
  });

  it('does not set a variable on a blocked-storage prepaint', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => new Function(resizableSplitPrepaint([KEY]))()).not.toThrow();
    expect(root().style.getPropertyValue(VAR)).toBe('');
  });
});

describe('storage key and prepaint script', () => {
  it('escapes script breakouts in inline JSON', () => {
    const out = escapeForScript(
      JSON.stringify(['</script><!--' + String.fromCharCode(0x2028, 0x2029)])
    );
    expect(out).not.toMatch(/[<>\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(['</script><!--' + String.fromCharCode(0x2028, 0x2029)]);
  });

  it('gives distinct keys distinct variables', () => {
    const keys = ['a.b', 'a-b', 'a_b', 'a:b', 'A.b', 'a_2e_b'];
    expect(new Set(keys.map(resizableSplitVar)).size).toBe(keys.length);
    expect(new Set(keys.map(resizableSplitCollapsedVar)).size).toBe(keys.length);
    expect(resizableSplitVar('a')).not.toBe(resizableSplitCollapsedVar('a'));
  });

  it('rejects keys outside the safe charset', () => {
    for (const bad of ['</script><script>x', 'a b', '', 'a"b', 'x'.repeat(65)]) {
      expect(() => resizableSplitVar(bad)).toThrow(/storageKey/);
      expect(() => resizableSplitPrepaint([bad])).toThrow(/storageKey/);
    }
  });

  it('escapes script-breaking characters in the emitted script', () => {
    const script = resizableSplitPrepaint(['a.b']);
    expect(script).not.toContain('</');
    expect(script).toContain('["a.b"');
    const { container } = render(<ResizableSplitPrepaint storageKeys={['a.b']} />);
    expect(container.querySelector('script')?.innerHTML).toBe(script);
  });

  it('applies the collapsed flag before paint', () => {
    window.localStorage.setItem(`${KEY}.collapsed`, '1');
    new Function(resizableSplitPrepaint([KEY]))();
    expect(root().style.getPropertyValue(resizableSplitCollapsedVar(KEY))).toBe('0px');
  });
});

describe('ResizableSplit vertical', () => {
  const renderVertical = () => renderSplit(undefined, { orientation: 'vertical' });

  it('sizes the bottom pane in rows and exposes a horizontal separator', () => {
    renderVertical();
    const el = screen.getByTestId('split');
    expect(el.style.gridTemplateRows).toContain(`var(${VAR}, 240px)`);
    expect(el.style.gridTemplateRows.startsWith('minmax(0, 1fr) 1px')).toBe(true);
    expect(el.style.gridTemplateColumns).toBe('');
    expect(handle().getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('ArrowUp grows and ArrowDown shrinks the bottom pane', () => {
    renderVertical();
    fireEvent.keyDown(handle(), { key: 'ArrowUp' });
    expect(handle().getAttribute('aria-valuenow')).toBe('256');
    fireEvent.keyDown(handle(), { key: 'ArrowDown', shiftKey: true });
    expect(handle().getAttribute('aria-valuenow')).toBe('192');
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(handle().getAttribute('aria-valuenow')).toBe('192');
  });

  it('drags by clientY from the bottom edge', () => {
    renderVertical();
    mockRect();
    fireEvent.pointerDown(handle(), { clientY: 160 });
    fireEvent.pointerMove(handle(), { clientY: 100 });
    expect(handle().getAttribute('aria-valuenow')).toBe('300');
  });
});

describe('ResizableSplit collapsible', () => {
  const Toggle = () => {
    const { collapsed, toggle } = useResizableSplit();
    return (
      <button type="button" aria-expanded={!collapsed} onClick={toggle}>
        nav toggle
      </button>
    );
  };
  const renderCollapsible = (onCollapsedChange?: (c: boolean) => void) =>
    render(
      <ResizableSplit
        storageKey={KEY}
        init={240}
        min={160}
        max={480}
        collapsible
        onCollapsedChange={onCollapsedChange}
        data-testid="split"
      >
        <Toggle />
        <p>main</p>
      </ResizableSplit>
    );
  const CVAR = resizableSplitCollapsedVar(KEY);

  it('toggles through the hook, persists, and remembers the last width', () => {
    const onCollapsedChange = vi.fn();
    renderCollapsible(onCollapsedChange);
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    const button = screen.getByRole('button', { name: 'nav toggle', hidden: true });
    fireEvent.click(button);
    expect(root().style.getPropertyValue(CVAR)).toBe('0px');
    expect(window.localStorage.getItem(`${KEY}.collapsed`)).toBe('1');
    expect(screen.getByTestId('split').getAttribute('data-collapsed')).toBe('true');
    expect(screen.getByTestId('split').style.gridTemplateColumns).toContain(`var(${CVAR},`);
    expect(handle().getAttribute('aria-valuetext')).toBe('collapsed');
    fireEvent.click(button);
    expect(root().style.getPropertyValue(CVAR)).toBe('');
    expect(window.localStorage.getItem(`${KEY}.collapsed`)).toBe('0');
    expect(root().style.getPropertyValue(VAR)).toBe('256px');
    expect(handle().getAttribute('aria-valuenow')).toBe('256');
    expect(onCollapsedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('restores the collapsed state on mount without the prepaint script', () => {
    window.localStorage.setItem(`${KEY}.collapsed`, '1');
    renderCollapsible();
    expect(root().style.getPropertyValue(CVAR)).toBe('0px');
    expect(screen.getByTestId('split').getAttribute('data-collapsed')).toBe('true');
  });

  it('Enter on the separator toggles; dragging a collapsed pane reopens it', () => {
    renderCollapsible();
    fireEvent.keyDown(handle(), { key: 'Enter' });
    expect(root().style.getPropertyValue(CVAR)).toBe('0px');
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(root().style.getPropertyValue(CVAR)).toBe('');
  });

  it('ignores Enter when not collapsible and throws outside a split', () => {
    renderSplit();
    fireEvent.keyDown(handle(), { key: 'Enter' });
    expect(root().style.getPropertyValue(CVAR)).toBe('');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Toggle />)).toThrow(/inside ResizableSplit/);
    spy.mockRestore();
  });

  it('exposes the toggle through apiRef', () => {
    const ref = { current: null as null | ReturnType<typeof useResizableSplit> };
    renderSplit(undefined, { collapsible: true, apiRef: ref });
    act(() => ref.current?.collapse());
    expect(root().style.getPropertyValue(CVAR)).toBe('0px');
    act(() => ref.current?.expand());
    expect(root().style.getPropertyValue(CVAR)).toBe('');
  });
});
