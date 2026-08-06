'use client';
import { DonutCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      For composition (storage breakdown, traffic source mix). Pair donut with a legend; center
      label is optional.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <DonutCard
        title="Storage by type"
        segments={[
          { label: 'Notes', value: 1240, color: 'var(--color-primary)' },
          { label: 'Images', value: 820, color: 'var(--color-info)' },
          { label: 'Attachments', value: 380, color: 'var(--color-warning)' },
          { label: 'Other', value: 110, color: 'var(--color-muted-foreground)' },
        ]}
        centerLabel="2.55GB"
        centerSubLabel="of 5 GB"
      />
      <DonutCard
        title="Traffic source"
        segments={[
          { label: 'Direct', value: 42, color: 'var(--color-primary)' },
          { label: 'Search', value: 28, color: 'var(--color-info)' },
          { label: 'Referral', value: 18, color: 'var(--color-success)' },
          { label: 'Social', value: 12, color: 'var(--color-warning)' },
        ]}
        centerLabel="14.2K"
        centerSubLabel="visits / 7d"
      />
    </div>
  </>
);
