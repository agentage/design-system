import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from './context-menu';

const setup = (
  props: { onPick?: () => void; disabled?: boolean; onOpenChange?: () => void } = {}
) => {
  render(
    <ContextMenu
      disabled={props.disabled}
      onOpenChange={props.onOpenChange}
      trigger={<button type="button">notes.md</button>}
    >
      <ContextMenuLabel>notes.md</ContextMenuLabel>
      <ContextMenuItem onClick={props.onPick}>Rename</ContextMenuItem>
      <ContextMenuItem>Copy path</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
    </ContextMenu>
  );
  return { target: screen.getByRole('button', { name: 'notes.md' }) };
};

const anchorStyle = (): CSSStyleDeclaration =>
  (document.querySelector('[data-slot="context-menu-anchor"]') as HTMLElement).style;

describe('ContextMenu', () => {
  it('opens at the pointer coordinates and suppresses the native menu', () => {
    const { target } = setup();
    // fireEvent returns false once the handler cancels the native menu.
    const notPrevented = fireEvent.contextMenu(target, { clientX: 120, clientY: 48 });

    expect(notPrevented).toBe(false);
    expect(screen.getByRole('menu')).not.toBeNull();
    expect(anchorStyle().left).toBe('120px');
    expect(anchorStyle().top).toBe('48px');
  });

  it('focuses the first item on open and reports open state', () => {
    const onOpenChange = vi.fn();
    const { target } = setup({ onOpenChange });
    fireEvent.contextMenu(target);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Rename' }));
  });

  it('opens with Shift+F10 anchored to the focused target', () => {
    const { target } = setup();
    target.focus();
    fireEvent.keyDown(target, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menu')).not.toBeNull();
    expect(document.querySelector('[data-slot="context-menu-anchor"]')).not.toBeNull();
  });

  it('opens with the ContextMenu key', () => {
    const { target } = setup();
    fireEvent.keyDown(target, { key: 'ContextMenu' });
    expect(screen.getByRole('menu')).not.toBeNull();
  });

  it('moves focus with arrows, Home and End', () => {
    const { target } = setup();
    fireEvent.contextMenu(target);
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Copy path' }));
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Rename' }));
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
  });

  it('closes on Escape and restores focus to the target', () => {
    const onOpenChange = vi.fn();
    const { target } = setup({ onOpenChange });
    target.focus();
    fireEvent.keyDown(target, { key: 'F10', shiftKey: true });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    expect(screen.queryByRole('menu')).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.activeElement).toBe(target);
  });

  it('runs the item handler and closes', () => {
    const onPick = vi.fn();
    const { target } = setup({ onPick });
    fireEvent.contextMenu(target);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes when the pointer goes down outside the surface', () => {
    const { target } = setup();
    fireEvent.contextMenu(target);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('stays closed when disabled', () => {
    const { target } = setup({ disabled: true });
    fireEvent.contextMenu(target);
    fireEvent.keyDown(target, { key: 'ContextMenu' });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('mirrors the dropdown compound API surface', () => {
    const { target } = setup();
    fireEvent.contextMenu(target);
    expect(screen.getByRole('separator').getAttribute('data-slot')).toBe('context-menu-separator');
    expect(screen.getAllByText('notes.md')[1].getAttribute('data-slot')).toBe('context-menu-label');
    expect(screen.getByRole('menuitem', { name: 'Delete' }).className).toContain(
      'text-destructive'
    );
    expect(screen.getByRole('menu').getAttribute('data-slot')).toBe('context-menu-content');
  });
});
