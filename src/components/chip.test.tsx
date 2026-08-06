import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './chip';

describe('Chip', () => {
  it('stays inert markup when it is not clickable', () => {
    render(<Chip>Draft</Chip>);
    const chip = screen.getByText('Draft').parentElement as HTMLElement;
    expect(chip.getAttribute('role')).toBeNull();
    expect(chip.getAttribute('tabindex')).toBeNull();
  });

  it('exposes a focusable button role when clickable', () => {
    render(<Chip onClick={vi.fn()}>Draft</Chip>);
    const chip = screen.getByRole('button', { name: 'Draft' });
    expect(chip.getAttribute('tabindex')).toBe('0');
    expect(chip.dataset.slot).toBe('chip-body');
    const wrapper = chip.parentElement as HTMLElement;
    expect(wrapper.className).toContain('has-[[data-slot=chip-body]:focus-visible]:ring-2');
  });

  it('activates on Enter', async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Draft</Chip>);
    screen.getByRole('button', { name: 'Draft' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates on Space', async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Draft</Chip>);
    screen.getByRole('button', { name: 'Draft' }).focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates from the keyboard when only interactive is set', async () => {
    const onClick = vi.fn();
    render(
      <Chip interactive onClick={onClick}>
        Draft
      </Chip>
    );
    screen.getByRole('button', { name: 'Draft' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores other keys', async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Draft</Chip>);
    screen.getByRole('button', { name: 'Draft' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('lets a caller cancel activation from its own onKeyDown', async () => {
    const onClick = vi.fn();
    render(
      <Chip onClick={onClick} onKeyDown={(e) => e.preventDefault()}>
        Draft
      </Chip>
    );
    screen.getByRole('button', { name: 'Draft' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('gives the remove button a label and a focus ring', () => {
    render(
      <Chip onRemove={vi.fn()} removeLabel="Remove tag">
        Draft
      </Chip>
    );
    const remove = screen.getByRole('button', { name: 'Remove tag' });
    expect(remove.className).toContain('focus-visible:ring-2');
  });

  it('removes without also activating the chip', async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        Draft
      </Chip>
    );
    const remove = screen.getByRole('button', { name: 'Remove' });
    remove.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Chip ref={ref}>Draft</Chip>);
    expect(ref.current?.getAttribute('data-slot')).toBe('chip');
  });
});

describe('Chip remove-button nesting', () => {
  it('keeps the remove button a sibling of the button-role body', () => {
    render(
      <Chip onClick={vi.fn()} onRemove={vi.fn()}>
        Draft
      </Chip>
    );
    const body = screen.getByRole('button', { name: 'Draft' });
    const remove = screen.getByRole('button', { name: 'Remove' });
    expect(body.contains(remove)).toBe(false);
    expect(remove.parentElement).toBe(body.parentElement);
  });

  it('removes without also firing the chip click', async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        Draft
      </Chip>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
