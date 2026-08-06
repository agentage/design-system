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

const TRIGGER_STATE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

describe('tabs variants', () => {
  const renderVariant = (variant: 'default' | 'underline') =>
    render(
      <Tabs defaultValue="one" variant={variant}>
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">P</TabsContent>
      </Tabs>
    );

  it('renders the exact class strings for the default variant', () => {
    renderVariant('default');
    expect(screen.getByRole('tablist').className).toBe(
      'inline-flex items-center gap-1 rounded-lg bg-muted p-1'
    );
    expect(screen.getByRole('tab', { name: 'One' }).className).toBe(
      `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${TRIGGER_STATE} bg-background text-foreground shadow-sm`
    );
    expect(screen.getByRole('tab', { name: 'Two' }).className).toBe(
      `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${TRIGGER_STATE} text-muted-foreground hover:text-foreground`
    );
    expect(screen.getByRole('tabpanel').className).toBe(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    );
  });

  it('renders the exact class strings for the underline variant', () => {
    renderVariant('underline');
    expect(screen.getByRole('tablist').className).toBe(
      'flex items-center gap-4 border-b border-border'
    );
    expect(screen.getByRole('tab', { name: 'One' }).className).toBe(
      `-mb-px inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 px-1 pb-2.5 pt-1 text-sm font-medium transition-all ${TRIGGER_STATE} border-foreground text-foreground`
    );
    expect(screen.getByRole('tab', { name: 'Two' }).className).toBe(
      `-mb-px inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 px-1 pb-2.5 pt-1 text-sm font-medium transition-all ${TRIGGER_STATE} border-transparent text-muted-foreground hover:text-foreground`
    );
  });
});

describe('tabs pass-through', () => {
  it('merges className last and spreads props on every part', () => {
    const { container } = render(
      <Tabs defaultValue="one" className="gap-2" id="root" data-x="r">
        <TabsList className="w-full" id="list" data-x="l">
          <TabsTrigger value="one" className="grow" data-x="t">
            One
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="pt-2" data-x="c">
          P
        </TabsContent>
      </Tabs>
    );

    const root = container.querySelector('[data-slot="tabs"]') as HTMLElement;
    expect(root.className).toBe('flex flex-col gap-2');
    expect(root.id).toBe('root');
    expect(root.dataset.x).toBe('r');

    const list = screen.getByRole('tablist');
    expect(list.className).toBe('inline-flex items-center gap-1 rounded-lg bg-muted p-1 w-full');
    expect(list.id).toBe('list');
    expect(list.dataset.x).toBe('l');

    const tab = screen.getByRole('tab', { name: 'One' });
    expect(tab.className.endsWith('bg-background text-foreground shadow-sm grow')).toBe(true);
    expect(tab.dataset.x).toBe('t');
    expect(tab.getAttribute('value')).toBe(null);

    const panel = screen.getByRole('tabpanel');
    expect(panel.className.endsWith('pt-2')).toBe(true);
    expect(panel.dataset.x).toBe('c');
  });

  it('runs a caller onClick before switching tabs', () => {
    const seen: string[] = [];
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger
            value="two"
            onClick={() => {
              seen.push('click');
            }}
          >
            Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(seen).toEqual(['click']);
    expect(screen.getByRole('tabpanel').textContent).toBe('Panel two');
  });
});
