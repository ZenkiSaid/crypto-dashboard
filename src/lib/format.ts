import type { TimeRange } from "@/lib/coingecko";

const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 2,
});

export function formatCompactUsd(value: number): string {
  return compactUsd.format(value);
}

export function formatUsd(value: number): string {
  const maximumFractionDigits = value >= 1 ? 2 : value >= 0.01 ? 4 : 6;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatInteger(value: number): string {
  return integer.format(value);
}

export function formatPercent(value: number): string {
  return `${percent.format(value)}%`;
}

export function formatSharePercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function formatChartTick(timestamp: number, range: TimeRange): string {
  const date = new Date(timestamp);

  if (range === "24h") {
    return date.toLocaleTimeString("en-US", { hour: "numeric" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatChartTooltip(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function changeToneClass(value: number): string {
  if (value > 0) {
    return "text-positive";
  }

  if (value < 0) {
    return "text-negative";
  }

  return "text-muted-foreground";
}
