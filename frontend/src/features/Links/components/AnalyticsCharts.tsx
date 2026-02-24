import type { FC } from "react";

// ─── MiniChart — SVG bar chart, zero dependencies ────────────────────────────
interface BarChartProps {
  data: { date: string; clicks: number }[];
  height?: number;
}

export const BarChart: FC<BarChartProps> = ({ data, height = 80 }) => {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.clicks), 1);
  const BAR_W = 28;
  const GAP = 8;
  const width = data.length * (BAR_W + GAP) - GAP;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = Math.max((d.clicks / max) * height, 2);
        const x = i * (BAR_W + GAP);
        const y = height - barH;
        return (
          <g key={d.date}>
            <rect
              x={x}
              y={y}
              width={BAR_W}
              height={barH}
              rx={4}
              fill="url(#grad)"
              opacity={0.85}
            />
            <title>{`${d.date}: ${d.clicks} clicks`}</title>
          </g>
        );
      })}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

interface SparkLineProps {
  data: { date: string; moving_avg: number }[];
  height?: number;
}

export const SparkLine: FC<SparkLineProps> = ({ data, height = 60 }) => {
  if (data.length < 2) return null;

  const max = Math.max(...data.map((d) => d.moving_avg), 1);
  const W = 300;
  const step = W / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = i * step;
      const y = height - (d.moving_avg / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparkGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
