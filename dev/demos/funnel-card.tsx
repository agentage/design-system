'use client';
import { FunnelCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Vertical funnel with per-stage drop-off %. Bar width is proportional to the top of the funnel.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <FunnelCard
        title="Signup → paid"
        stages={[
          { label: 'Landing visit', value: 18420 },
          { label: 'Signup started', value: 4210 },
          { label: 'Email verified', value: 3680 },
          { label: 'First memory written', value: 2140 },
          { label: 'Paid subscriber', value: 312 },
        ]}
      />
      <FunnelCard
        title="Hiring pipeline"
        stages={[
          { label: 'Applications', value: 264 },
          { label: 'Phone screen', value: 71 },
          { label: 'Onsite', value: 22 },
          { label: 'Offer extended', value: 8 },
          { label: 'Hired', value: 5 },
        ]}
      />
    </div>
  </>
);
