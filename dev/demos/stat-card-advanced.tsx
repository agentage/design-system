'use client';
import {
  MiniBars,
  Sparkline,
  StatBreakdown,
  StatCard,
  StatComparison,
  StatProgress,
} from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Composable extensions plugged into the StatCard description slot: inline sparkline · mini bar
      chart · segmented breakdown · progress-to-target · vs-previous-period comparison.
    </p>
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        title="Active Users"
        value="8,432"
        trend={{ value: '+5.2%', up: true }}
        description={<Sparkline data={[40, 55, 50, 65, 60, 72, 78, 82, 88, 92]} showLastDot />}
      />
      <StatCard
        title="Runs / day"
        value={142}
        description={<MiniBars data={[12, 18, 9, 24, 16, 22, 19, 28, 31, 25, 33, 38]} />}
      />
      <StatCard
        title="MRR"
        value="$48.2K"
        description={
          <StatComparison
            current={48200}
            previous={42300}
            format={(n) => `$${(n / 1000).toFixed(1)}K`}
          />
        }
      />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        title="Storage used"
        value="3.2 / 5 GB"
        description={
          <StatProgress
            current={3200}
            target={5000}
            format={(n) => `${(n / 1000).toFixed(1)} GB`}
          />
        }
      />
      <StatCard
        title="Machines"
        value={42}
        description={
          <StatBreakdown
            segments={[
              { label: 'Active', value: 28, color: 'bg-success' },
              { label: 'Idle', value: 10, color: 'bg-warning' },
              { label: 'Offline', value: 4, color: 'bg-muted-foreground/60' },
            ]}
          />
        }
      />
      <StatCard
        title="ARR by source"
        value="$1.2M"
        trend={{ value: '+18%', up: true }}
        description={
          <StatBreakdown
            showLegend={false}
            segments={[
              { label: 'New', value: 620, color: 'bg-primary' },
              { label: 'Expansion', value: 380, color: 'bg-info' },
              { label: 'Churn', value: 100, color: 'bg-destructive' },
            ]}
          />
        }
      />
    </div>
  </>
);
