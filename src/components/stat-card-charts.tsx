import { cn } from '../lib/utils';

/* ============================================================================
 * Inline mini-charts for StatCard (split out of stat-card-extensions.tsx).
 * ========================================================================= */

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  /** Tailwind stroke class for the line. */
  stroke?: string;
  /** Tailwind fill class for the area under the line. */
  fill?: string;
  height?: number;
  /** Highlight the latest reading with a dot at the end of the line. */
  showLastDot?: boolean;
  /** Highlight the min and max points with small markers. */
  showMinMax?: boolean;
  /** Overrides the accessible name derived from the data series. */
  chartLabel?: string;
}

export const Sparkline = ({
  data,
  className,
  stroke = 'stroke-primary',
  fill = 'fill-primary/15',
  height = 32,
  showLastDot = false,
  showMinMax = false,
  chartLabel,
  ...props
}: SparklineProps): React.JSX.Element => {
  if (data.length < 2) return <div className={cn('h-8 w-full', className)} />;
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 2) - 1,
    v,
  }));
  const pts = coords.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  const firstX = coords[0].x;
  const lastP = coords[coords.length - 1];
  const area = `M ${firstX.toFixed(2)},${height} L ${pts.replace(/ /g, ' L ')} L ${lastP.x.toFixed(2)},${height} Z`;
  const maxIdx = data.indexOf(max);
  const minIdx = data.indexOf(min);
  const label =
    chartLabel ??
    `Sparkline: ${data.length} points, low ${min}, high ${max}, latest ${data[data.length - 1]}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full overflow-visible', className)}
      data-slot="sparkline"
      role="img"
      aria-label={label}
      {...props}
    >
      <path d={area} className={fill} />
      <polyline points={pts} fill="none" strokeWidth="1.5" className={stroke} />
      {showMinMax && (
        <>
          <circle
            cx={coords[maxIdx].x}
            cy={coords[maxIdx].y}
            r="1.5"
            className="fill-success"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={coords[minIdx].x}
            cy={coords[minIdx].y}
            r="1.5"
            className="fill-destructive"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
      {showLastDot && (
        <circle
          cx={lastP.x}
          cy={lastP.y}
          r="1.8"
          className={cn(stroke.replace('stroke-', 'fill-'))}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
};

export interface MiniBarsProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  /** Tailwind fill class for the bars. */
  color?: string;
  height?: number;
  /** Overrides the accessible name derived from the data series. */
  chartLabel?: string;
}

export const MiniBars = ({
  data,
  className,
  color = 'fill-primary',
  height = 32,
  chartLabel,
  ...props
}: MiniBarsProps): React.JSX.Element => {
  const max = Math.max(...data) || 1;
  const bw = 100 / data.length;
  const gap = bw * 0.2;
  const label =
    chartLabel ??
    (data.length === 0
      ? 'Bar chart: no data'
      : `Bar chart: ${data.length} bars, low ${Math.min(...data)}, high ${Math.max(...data)}`);
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full', className)}
      data-slot="mini-bars"
      role="img"
      aria-label={label}
      {...props}
    >
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        return (
          <rect
            key={i}
            x={i * bw + gap / 2}
            y={height - h}
            width={bw - gap}
            height={Math.max(h, 1)}
            rx="0.5"
            className={cn(color, 'opacity-85')}
          />
        );
      })}
    </svg>
  );
};
