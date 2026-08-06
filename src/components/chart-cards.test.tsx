import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutCard } from './donut-card';
import { FunnelCard } from './funnel-card';
import { GaugeCard } from './gauge-card';
import { HeatmapCard } from './heatmap-card';
import { MultiStatCard } from './multi-stat-card';
import { RankedListCard } from './ranked-list-card';
import { ScoreCard } from './score-card';
import { StatCard, type StatCardTrend } from './stat-card';
import { MiniBars, Sparkline } from './stat-card-charts';
import { StatBreakdown, StatComparison, StatProgress } from './stat-card-extensions';

const cls = (el: Element | null | undefined): string => el?.getAttribute('class') ?? '';
const q = (c: HTMLElement, s: string): Element | null => c.querySelector(s);
const qa = (c: HTMLElement, s: string): Element[] => Array.from(c.querySelectorAll(s));

const CARD_ROOT = 'rounded-lg border border-border bg-sidebar p-4';
const TREND_BASE =
  'flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-medium border border-border bg-muted/30';
const DELTA_BASE = 'inline-flex items-center gap-0.5 tabular-nums font-medium';

const trendClass = (trend: StatCardTrend): string => {
  const { container, unmount } = render(<StatCard title="T" value={1} trend={trend} />);
  const out = cls(qa(container, '[data-slot="stat-card"] > div > div')[1]);
  unmount();
  return out;
};

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

describe('rendered class strings stay byte-identical', () => {
  it('keeps the stat card root, icon and trend classes', () => {
    const { container } = render(<StatCard title="T" value={1} icon={<svg />} className="mt-4" />);
    expect(cls(q(container, '[data-slot="stat-card"]'))).toBe(
      'rounded-lg border border-border bg-sidebar p-5 transition-[transform,box-shadow,border-color] duration-[140ms] hover:-translate-y-[3px] hover:border-muted-foreground hover:shadow-md mt-4'
    );
    expect(cls(q(container, '[data-slot="stat-card"] div div div'))).toBe(
      'flex size-8 items-center justify-center rounded-md [&_svg]:size-4 bg-primary-soft text-primary-emphasis'
    );
    expect(trendClass({ value: '+1%', up: true })).toBe(`${TREND_BASE} text-success`);
    expect(trendClass({ value: '-1%', up: false })).toBe(`${TREND_BASE} text-destructive`);
  });

  it('keeps the multi stat dividers and trend classes', () => {
    const { container } = render(
      <MultiStatCard
        title="M"
        stats={[
          { label: 'a', value: 1, trend: { value: '+1', up: true } },
          { label: 'b', value: 2, trend: { value: '-1', up: false } },
        ]}
      />
    );
    const cells = qa(container, '[data-slot="multi-stat-card"] > div > div');
    expect(cls(cells[0])).toBe('');
    expect(cls(cells[1])).toBe('border-l border-border pl-3');
    expect(cls(cells[0].querySelectorAll('div')[2])).toBe('text-2xs tabular-nums text-success');
    expect(cls(cells[1].querySelectorAll('div')[2])).toBe('text-2xs tabular-nums text-destructive');
  });

  it('keeps the composable, comparison and inline chart classes', () => {
    const { container } = render(
      <>
        <StatBreakdown segments={[{ label: 'a', value: 1 }]} className="mt-2" />
        <StatProgress current={1} target={2} className="mt-2" />
        <StatComparison current={10} previous={5} />
        <StatComparison current={5} previous={10} />
        <Sparkline data={[1, 2, 3]} className="h-10" />
        <MiniBars data={[1, 2]} className="h-10" />
      </>
    );
    const deltas = qa(container, '[data-slot="stat-comparison"] > span:nth-child(2)');
    expect(cls(deltas[0])).toBe(`${DELTA_BASE} text-success`);
    expect(cls(deltas[1])).toBe(`${DELTA_BASE} text-destructive`);
    expect(cls(q(container, '[data-slot="stat-breakdown"]'))).toBe('space-y-2 mt-2');
    expect(cls(q(container, '[data-slot="stat-progress"]'))).toBe('space-y-1 mt-2');
    expect(cls(q(container, '[data-slot="sparkline"]'))).toBe('w-full overflow-visible h-10');
    expect(cls(q(container, '[data-slot="mini-bars"]'))).toBe('w-full h-10');
    expect(cls(q(container, 'rect'))).toBe('fill-primary opacity-85');
  });

  it('merges className last on every card root', () => {
    const { container } = render(
      <>
        <DonutCard title="D" segments={[]} className="mt-2" />
        <HeatmapCard title="H" data={[[1]]} className="mt-2" />
        <ScoreCard title="S" score={1} className="mt-2" />
        <FunnelCard title="F" stages={[]} className="mt-2" />
        <GaugeCard title="G" value={1} className="mt-2" />
        <MultiStatCard title="M" stats={[]} className="mt-2" />
        <RankedListCard title="R" items={[]} className="mt-2" />
      </>
    );
    const slots = ['donut', 'heatmap', 'score', 'funnel', 'gauge', 'multi-stat', 'ranked-list'];
    for (const slot of slots) {
      expect(cls(q(container, `[data-slot="${slot}-card"]`))).toBe(`${CARD_ROOT} mt-2`);
    }
  });
});

describe('canonical status tones', () => {
  it('accepts the canonical five next to the up/down direction aliases', () => {
    const cases: Array<[NonNullable<StatCardTrend['tone']>, string]> = [
      ['success', 'text-success'],
      ['destructive', 'text-destructive'],
      ['warning', 'text-warning'],
      ['info', 'text-info'],
      ['default', 'text-muted-foreground'],
      ['up', 'text-success'],
      ['down', 'text-destructive'],
    ];
    for (const [tone, color] of cases) {
      expect(trendClass({ value: 'x', up: true, tone })).toBe(`${TREND_BASE} ${color}`);
    }
  });

  it('tones the stat comparison delta', () => {
    const { container } = render(<StatComparison current={10} previous={5} tone="warning" />);
    expect(cls(q(container, '[data-slot="stat-comparison"] > span:nth-child(2)'))).toBe(
      `${DELTA_BASE} text-warning`
    );
  });
});

describe('prop passthrough', () => {
  it('forwards id, data-* and aria-* while keeping the merged className', () => {
    const { container } = render(
      <>
        <GaugeCard title="G" value={1} id="g1" data-x="1" aria-describedby="d" className="mt-2" />
        <Sparkline data={[1, 2]} id="sp" data-x="2" />
        <StatProgress current={1} target={2} id="pr" />
      </>
    );
    const root = q(container, '[data-slot="gauge-card"]');
    expect(root?.id).toBe('g1');
    expect(root?.getAttribute('data-x')).toBe('1');
    expect(root?.getAttribute('aria-describedby')).toBe('d');
    expect(cls(root)).toBe(`${CARD_ROOT} mt-2`);
    expect(q(container, '[data-slot="sparkline"]')?.id).toBe('sp');
    expect(q(container, '[data-slot="sparkline"]')?.getAttribute('data-x')).toBe('2');
    expect(q(container, '[data-slot="stat-progress"]')?.id).toBe('pr');
  });
});
