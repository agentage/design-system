'use client';
import { MultiStatCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Several tightly related stats in one card with a shared header. Avoids 4-up visual noise.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <MultiStatCard
        title="ARR composition"
        stats={[
          { label: 'New', value: '$620K', trend: { value: '+22%', up: true } },
          { label: 'Expansion', value: '$380K', trend: { value: '+11%', up: true } },
          { label: 'Churn', value: '−$100K', trend: { value: '−4%', up: false } },
        ]}
        description="Last 12 months · monthly average"
      />
      <MultiStatCard
        title="Run outcomes today"
        stats={[
          { label: 'Submitted', value: 142 },
          { label: 'Working', value: 8 },
          { label: 'Completed', value: 127, trend: { value: '+12', up: true } },
          { label: 'Failed', value: 7, trend: { value: '−3', up: true } },
        ]}
      />
    </div>
  </>
);
