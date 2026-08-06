'use client';
import { GaugeCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Semicircle gauge with optional green/yellow/red threshold zones. Use when crossing a limit
      matters (capacity, error rate, latency).
    </p>
    <div className="grid grid-cols-3 gap-4">
      <GaugeCard
        title="CPU"
        value={34}
        thresholds={{ warning: 60, critical: 85 }}
        format={(n) => `${n}%`}
        description="4 cores · linux/amd64"
      />
      <GaugeCard
        title="Memory"
        value={72}
        thresholds={{ warning: 70, critical: 90 }}
        format={(n) => `${n}%`}
        description="11.5 / 16 GB used"
      />
      <GaugeCard
        title="p99 latency"
        value={420}
        max={1000}
        thresholds={{ warning: 300, critical: 700 }}
        format={(n) => `${n} ms`}
        description="API gateway · last 5 min"
      />
    </div>
  </>
);
