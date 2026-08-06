import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu, DropdownMenuItem } from './dropdown-menu';

const setup = (onPick = vi.fn()) => {
  render(
    <DropdownMenu trigger={<span>Actions</span>}>
      <DropdownMenuItem onClick={onPick}>View</DropdownMenuItem>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenu>
  );
  return { trigger: screen.getByRole('button', { name: 'Actions' }), onPick };
};

describe('DropdownMenu', () => {
  it('renders the trigger as a button announcing a menu', () => {
    const { trigger } = setup();
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('merges the semantics into an interactive trigger instead of nesting buttons', () => {
    const { container } = render(
      <DropdownMenu trigger={<button type="button">Actions</button>}>
        <DropdownMenuItem>View</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(container.querySelectorAll('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).not.toBeNull();
  });

  it('opens on ArrowDown and focuses the first item', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'View' }));
  });

  it('opens on Enter', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('menu')).not.toBeNull();
  });

  it('moves focus with arrows, Home and End', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Edit' }));
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'View' }));
  });

  it('closes on Escape and returns focus to the trigger', () => {
    const { trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('runs the item handler and closes', () => {
    const { trigger, onPick } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('menuitem', { name: 'View' }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
