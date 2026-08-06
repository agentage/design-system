'use client';
import { ScoreCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      0..max with colored bands. Designed for NPS, CSAT, health scores. Marker shows the current
      position; band pill labels which zone you're in.
    </p>
    <div className="grid grid-cols-3 gap-4">
      <ScoreCard
        title="NPS"
        score={47}
        max={100}
        bands={[
          { label: 'Detractors', from: 0, to: 30, color: 'var(--color-destructive)' },
          { label: 'Passives', from: 30, to: 50, color: 'var(--color-warning)' },
          { label: 'Promoters', from: 50, to: 100, color: 'var(--color-success)' },
        ]}
        description="Last 30 days · 482 responses"
      />
      <ScoreCard
        title="CSAT"
        score={4.2}
        max={5}
        bands={[
          { label: 'Poor', from: 0, to: 2, color: 'var(--color-destructive)' },
          { label: 'OK', from: 2, to: 4, color: 'var(--color-warning)' },
          { label: 'Great', from: 4, to: 5, color: 'var(--color-success)' },
        ]}
        description="Survey average · 1.2K responses"
      />
      <ScoreCard
        title="Health"
        score={82}
        bands={[
          { label: 'Critical', from: 0, to: 50, color: 'var(--color-destructive)' },
          { label: 'Warning', from: 50, to: 75, color: 'var(--color-warning)' },
          { label: 'Healthy', from: 75, to: 100, color: 'var(--color-success)' },
        ]}
        description="All systems checked 30s ago"
      />
    </div>
  </>
);
