import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

const GROUP_WIDTH = 1000;

const renderGroup = (props: { storageKey?: string; onSizesChange?: (s: number[]) => void } = {}) =>
  render(
    <ResizablePanelGroup aria-label="Browser" {...props}>
      <ResizablePanel defaultSize={30} minSize={20} maxSize={60}>
        tree
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={20}>document</ResizablePanel>
    </ResizablePanelGroup>
  );

const handle = (): HTMLElement => screen.getByRole('separator');
const basis = (text: string): string =>
  (screen.getByText(text) as HTMLElement).style.flexBasis || '';

// jsdom measures everything as 0; the drag math needs a real extent.
const mockWidth = (): void => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: GROUP_WIDTH,
    height: 400,
    top: 0,
    left: 0,
    right: GROUP_WIDTH,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('ResizablePanelGroup', () => {
  it('sizes panels from defaultSize and splits the remainder', () => {
    renderGroup();
    expect(basis('tree')).toBe('30%');
    expect(basis('document')).toBe('70%');
  });

  it('exposes the WAI splitter contract on the handle', () => {
    renderGroup();
    expect(handle().getAttribute('aria-orientation')).toBe('vertical');
    expect(handle().getAttribute('aria-valuenow')).toBe('30');
    expect(handle().getAttribute('aria-valuemin')).toBe('20');
    expect(handle().getAttribute('aria-valuemax')).toBe('60');
    expect(handle().getAttribute('aria-label')).toBe('Resize panels');
    expect(handle().getAttribute('aria-controls')).toBe(screen.getByText('tree').id);
    expect(handle().tabIndex).toBe(0);
  });

  it('resizes by 2% per arrow key and 10% with shift', () => {
    renderGroup();
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(basis('tree')).toBe('32%');
    expect(basis('document')).toBe('68%');
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true });
    expect(basis('tree')).toBe('22%');
    expect(handle().getAttribute('aria-valuenow')).toBe('22');
  });

  it('collapses to the bound with Home and End and clamps at min/max', () => {
    renderGroup();
    fireEvent.keyDown(handle(), { key: 'Home' });
    expect(basis('tree')).toBe('20%');
    fireEvent.keyDown(handle(), { key: 'ArrowLeft' });
    expect(basis('tree')).toBe('20%');
    fireEvent.keyDown(handle(), { key: 'End' });
    expect(basis('tree')).toBe('60%');
    expect(basis('document')).toBe('40%');
  });

  it('ignores keys it does not own', () => {
    renderGroup();
    fireEvent.keyDown(handle(), { key: 'Enter' });
    expect(basis('tree')).toBe('30%');
  });

  it('resizes on pointer drag relative to the group width', () => {
    mockWidth();
    renderGroup();
    fireEvent.pointerDown(handle(), { pointerId: 1, clientX: 300, clientY: 0 });
    fireEvent.pointerMove(handle(), { pointerId: 1, clientX: 400, clientY: 0 });
    expect(basis('tree')).toBe('40%');
    expect(handle().dataset.dragging).toBe('true');
    fireEvent.pointerUp(handle(), { pointerId: 1, clientX: 400, clientY: 0 });
    expect(handle().dataset.dragging).toBeUndefined();
    fireEvent.pointerMove(handle(), { pointerId: 1, clientX: 900, clientY: 0 });
    expect(basis('tree')).toBe('40%');
  });

  it('reports every change through onSizesChange', () => {
    const onSizesChange = vi.fn();
    renderGroup({ onSizesChange });
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(onSizesChange).toHaveBeenCalledWith([32, 68]);
  });

  it('persists sizes under storageKey and restores them on mount', () => {
    const { unmount } = renderGroup({ storageKey: 'ds-test-panels' });
    fireEvent.keyDown(handle(), { key: 'ArrowRight' });
    expect(window.localStorage.getItem('ds-test-panels')).toBe('[32,68]');
    unmount();
    renderGroup({ storageKey: 'ds-test-panels' });
    expect(basis('tree')).toBe('32%');
  });

  it('ignores stored values that no longer match the panel count', () => {
    window.localStorage.setItem('ds-test-panels', '[10,20,70]');
    renderGroup({ storageKey: 'ds-test-panels' });
    expect(basis('tree')).toBe('30%');
  });

  it('supports a vertical direction and three panels', () => {
    render(
      <ResizablePanelGroup direction="vertical" aria-label="Stack">
        <ResizablePanel defaultSize={20}>top</ResizablePanel>
        <ResizableHandle withGrip />
        <ResizablePanel defaultSize={30}>middle</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    const handles = screen.getAllByRole('separator');
    expect(handles).toHaveLength(2);
    expect(handles[0].getAttribute('aria-orientation')).toBe('horizontal');
    fireEvent.keyDown(handles[0], { key: 'ArrowDown' });
    expect(basis('top')).toBe('22%');
    expect(basis('middle')).toBe('28%');
    expect(basis('bottom')).toBe('50%');
  });
});
