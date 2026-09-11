import { useId } from "react";

export type SparklineProps = {
  data?: number[];
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({
  data,
  width = 120,
  height = 36,
  className,
}: SparklineProps) {
  const gradientId = useId().replace(/:/g, "");

  if (!data || data.length < 2) {
    return <div className="h-9 w-[120px]" />;
  }

  // CoinGecko 7d sparkline has ~168 hourly points.
  // Sample every Nth point to ensure lightweight, crisp vector paths.
  const step = Math.max(1, Math.floor(data.length / 45));
  const sampled = data.filter(
    (_, index) => index % step === 0 || index === data.length - 1,
  );

  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  const padding = 3;
  const usableHeight = height - padding * 2;
  const usableWidth = width;

  const points = sampled.map((val, idx) => {
    const x = (idx / (sampled.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${usableWidth},${height} L 0,${height} Z`;

  const isPositive = sampled[sampled.length - 1] >= sampled[0];
  const strokeColor = isPositive ? "var(--positive)" : "var(--negative)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.28} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
