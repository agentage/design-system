import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const setup = () =>
  render(
    <Tabs defaultValue="one">
      <TabsList aria-label="Sections">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two" disabled>
          Two
        </TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one</TabsContent>
      <TabsContent value="three">Panel three</TabsContent>
    </Tabs>
  );

describe('Tabs', () => {
  it('names the tablist from aria-label', () => {
    setup();
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeTruthy();
  });

  it('wires each tab to its panel', () => {
    setup();
    const tab = screen.getByRole('tab', { name: 'One' });
    const panel = screen.getByRole('tabpanel');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.getAttribute('tabindex')).toBe('0');
  });

  it('moves between tabs with the arrow keys, skipping disabled ones', () => {
    setup();
    const one = screen.getByRole('tab', { name: 'One' });
    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowRight' });

    const three = screen.getByRole('tab', { name: 'Three' });
    expect(document.activeElement).toBe(three);
    expect(three.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Panel three');
  });

  it('jumps to the first and last tab with Home and End', () => {
    setup();
    const one = screen.getByRole('tab', { name: 'One' });
    one.focus();
    fireEvent.keyDown(one, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Three' }));

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'One' }));
  });
});
