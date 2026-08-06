import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutCard } from './donut-card';
import { GaugeCard } from './gauge-card';
import { HeatmapCard } from './heatmap-card';
import { ScoreCard } from './score-card';
import { MiniBars, Sparkline } from './stat-card-charts';

describe('chart accessibility', () => {
  it('names the donut chart from its segments', () => {
    render(
      <DonutCard
        title="Storage"
        segments={[
          { label: 'Active', value: 40 },
          { label: 'Idle', value: 60 },
        ]}
      />
    );
    expect(
      screen.getByRole('img', { name: 'Donut chart, Storage: Active 40%, Idle 60%' })
    ).toBeTruthy();
  });

  it('lets a caller override the donut name', () => {
    render(
      <DonutCard title="Storage" segments={[{ label: 'Active', value: 1 }]} chartLabel="Custom" />
    );
    expect(screen.getByRole('img', { name: 'Custom' })).toBeTruthy();
  });

  it('names the gauge from its value and range', () => {
    render(<GaugeCard title="CPU" value={42} />);
    expect(screen.getByRole('img', { name: 'Gauge, CPU: 42 of 100' })).toBeTruthy();
  });

  it('names the score bar from its score', () => {
    render(<ScoreCard title="NPS" score={72} />);
    expect(screen.getByRole('img', { name: 'Score gauge, NPS: 72 out of 100' })).toBeTruthy();
  });

  it('names the sparkline and the mini bars', () => {
    render(
      <>
        <Sparkline data={[1, 5, 3]} />
        <MiniBars data={[2, 4]} />
      </>
    );
    expect(
      screen.getByRole('img', { name: 'Sparkline: 3 points, low 1, high 5, latest 3' })
    ).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Bar chart: 2 bars, low 2, high 4' })).toBeTruthy();
  });

  it('gives the heatmap a caption and scoped headers', () => {
    const { container } = render(
      <HeatmapCard title="Activity" data={[[1, 2]]} rowLabels={['Mon']} colLabels={['9', '10']} />
    );
    expect(screen.getByRole('table', { name: 'Activity' })).toBeTruthy();
    expect(container.querySelectorAll('th[scope="col"]').length).toBe(2);
    expect(container.querySelector('th[scope="row"]')?.textContent).toBe('Mon');
  });
});
