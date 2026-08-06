'use client';
import { HeatmapCard } from '../../src';

// Deterministic-ish pseudo-random for the activity heatmap so frames don't dance.
const heatmapData = (() => {
  const rows = 7;
  const cols = 12;
  const grid: number[][] = [];
  let seed = 1234;
  const rng = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    const base = r < 5 ? 8 : 3;
    for (let c = 0; c < cols; c++) {
      row.push(Math.floor(rng() * base * (1 + c * 0.05)) + 1);
    }
    grid.push(row);
  }
  return grid;
})();

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Grid where cell intensity encodes value. Use for activity-by-time, cohort retention,
      error-by-route.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <HeatmapCard
        title="Activity (last 12 weeks)"
        rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        data={heatmapData}
        description="Notes written per day · darker = more"
      />
      <HeatmapCard
        title="Cohort retention"
        rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
        colLabels={['M1', 'M2', 'M3', 'M4', 'M5', 'M6']}
        data={[
          [100, 72, 58, 51, 47, 44],
          [100, 75, 60, 53, 49, 0],
          [100, 78, 62, 55, 0, 0],
          [100, 81, 65, 0, 0, 0],
          [100, 84, 0, 0, 0, 0],
        ]}
        max={100}
        color="var(--color-info)"
        description="% of cohort retained over months"
      />
    </div>
  </>
);
