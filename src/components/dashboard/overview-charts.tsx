"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatChartTooltip,
  formatCompactUsd,
  formatSharePercent,
  formatUsd,
} from "@/lib/format";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--popover-foreground)",
  fontSize: "12px",
} as const;

export type PriceSeriesPoint = {
  timestamp: number;
  label: string;
  price: number;
};

export type VolumeSeriesPoint = {
  symbol: string;
  volume: number;
};

export type DominanceSlice = {
  name: string;
  value: number;
};

const DOMINANCE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-muted-foreground)",
] as const;

function ChartFrame({
  children,
  height = 256,
}: {
  children: (width: number) => ReactNode;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.floor(nextWidth));
    });

    observer.observe(element);
    setWidth(Math.floor(element.getBoundingClientRect().width));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 ? children(width) : null}
    </div>
  );
}

export function BitcoinPriceChart({
  data,
  height = 256,
}: {
  data: PriceSeriesPoint[];
  height?: number;
}) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <ChartFrame height={height}>
      {(width) => (
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.24} />
              <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            dataKey="price"
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value: number) => formatCompactUsd(value)}
            domain={["auto", "auto"]}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={tooltipStyle}
            labelFormatter={(_, payload) => {
              const point = payload[0]?.payload as PriceSeriesPoint | undefined;
              return point ? formatChartTooltip(point.timestamp) : "";
            }}
            formatter={(value) => [formatUsd(Number(value)), "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--foreground)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            name="Price"
          />
        </AreaChart>
      )}
    </ChartFrame>
  );
}

export function VolumeLeadersChart({ data }: { data: VolumeSeriesPoint[] }) {
  return (
    <ChartFrame>
      {(width) => (
        <BarChart
          width={width}
          height={256}
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value: number) => formatCompactUsd(value)}
          />
          <YAxis
            type="category"
            dataKey="symbol"
            width={48}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={tooltipStyle}
            formatter={(value) => [formatCompactUsd(Number(value)), "Volume"]}
          />
          <Bar dataKey="volume" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
        </BarChart>
      )}
    </ChartFrame>
  );
}

export function MarketDominanceChart({ data }: { data: DominanceSlice[] }) {
  return (
    <div className="flex h-64 items-center gap-4">
      <div className="h-full min-w-0 flex-1">
        <ChartFrame>
          {(width) => (
            <PieChart width={width} height={256}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                stroke="var(--card)"
              >
                {data.map((slice, index) => (
                  <Cell
                    key={slice.name}
                    fill={DOMINANCE_COLORS[index % DOMINANCE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatSharePercent(Number(value)), "Share"]}
              />
            </PieChart>
          )}
        </ChartFrame>
      </div>
      <ul className="flex w-28 shrink-0 flex-col gap-2 text-xs">
        {data.map((slice, index) => (
          <li key={slice.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  background: DOMINANCE_COLORS[index % DOMINANCE_COLORS.length],
                }}
              />
              <span className="truncate uppercase">{slice.name}</span>
            </span>
            <span className="tabular-nums text-muted-foreground">
              {formatSharePercent(slice.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CoinPriceChart = BitcoinPriceChart;
