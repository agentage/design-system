import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DangerZone, DangerZoneAction } from './danger-zone';

describe('DangerZone', () => {
  it('renders a labelled region with the default title', () => {
    render(
      <DangerZone description="Irreversible actions.">
        <DangerZoneAction label="Delete memory" action={<button type="button">Delete</button>} />
      </DangerZone>
    );
    const region = screen.getByRole('region', { name: 'Danger zone' });
    expect(region.dataset.slot).toBe('danger-zone');
    expect(screen.getByText('Danger zone')).not.toBeNull();
    expect(screen.getByText('Irreversible actions.')).not.toBeNull();
  });

  it('takes a custom title and aria-label and keeps the destructive border', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DangerZone ref={ref} title="Destructive" aria-label="Destructive actions" className="mt-4">
        <DangerZoneAction label="Revoke" action={<button type="button">Revoke</button>} />
      </DangerZone>
    );
    expect(screen.getByRole('region', { name: 'Destructive actions' })).toBe(ref.current);
    expect(ref.current?.className).toContain('border-destructive/40');
    expect(ref.current?.className).toContain('mt-4');
  });

  it('renders each action row with its description and trailing slot', () => {
    render(
      <DangerZone>
        <DangerZoneAction
          label="Delete memory"
          description="Removes every note in this memory."
          action={<button type="button">Delete memory</button>}
        />
        <DangerZoneAction
          label="Revoke all tokens"
          action={<button type="button">Revoke</button>}
        />
      </DangerZone>
    );
    expect(document.querySelectorAll('[data-slot="danger-zone-action"]')).toHaveLength(2);
    expect(screen.getByText('Removes every note in this memory.')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Delete memory' })).not.toBeNull();
  });
});
