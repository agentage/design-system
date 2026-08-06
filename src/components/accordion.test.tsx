import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const setup = () =>
  render(
    <Accordion type="multiple" defaultValue={['a']}>
      <AccordionItem value="a">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>Body A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b" disabled>
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>Body B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Three</AccordionTrigger>
        <AccordionContent>Body C</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

const trigger = (name: string): HTMLElement => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('wires the trigger to the content region', () => {
    setup();
    const one = trigger('One');
    const region = screen.getByRole('region', { name: 'One' });
    expect(one.getAttribute('aria-controls')).toBe(region.id);
    expect(region.getAttribute('aria-labelledby')).toBe(one.id);
    expect(one.id).not.toBe('');
  });

  it('gives each item its own ids', () => {
    setup();
    fireEvent.click(trigger('Three'));
    const ids = screen.getAllByRole('region').map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('disables the trigger of a disabled item', () => {
    setup();
    expect((trigger('Two') as HTMLButtonElement).disabled).toBe(true);
  });

  it('moves focus with ArrowDown, skipping disabled items and wrapping', () => {
    setup();
    trigger('One').focus();
    fireEvent.keyDown(trigger('One'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(trigger('Three'));

    fireEvent.keyDown(trigger('Three'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(trigger('One'));
  });

  it('moves focus with ArrowUp, wrapping backwards', () => {
    setup();
    trigger('One').focus();
    fireEvent.keyDown(trigger('One'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(trigger('Three'));
  });

  it('jumps to the first and last trigger with Home and End', () => {
    setup();
    trigger('One').focus();
    fireEvent.keyDown(trigger('One'), { key: 'End' });
    expect(document.activeElement).toBe(trigger('Three'));

    fireEvent.keyDown(trigger('Three'), { key: 'Home' });
    expect(document.activeElement).toBe(trigger('One'));
  });

  it('still toggles on click', () => {
    setup();
    expect(trigger('Three').getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger('Three'));
    expect(trigger('Three').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Body C')).toBeTruthy();
  });
});

describe('Accordion pass-through', () => {
  it('spreads props on the root and item', () => {
    const { container } = render(
      <Accordion defaultValue={['a']} className="rounded" id="acc" data-x="r">
        <AccordionItem value="a" className="px-2" data-x="i">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Body A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const root = container.querySelector('[data-slot="accordion"]') as HTMLElement;
    expect(root.className).toBe('divide-y divide-border rounded');
    expect(root.id).toBe('acc');
    expect(root.dataset.x).toBe('r');
    expect((container.querySelector('[data-slot="accordion-item"]') as HTMLElement).dataset.x).toBe(
      'i'
    );
  });
});
