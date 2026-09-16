import type { TimeRange } from "@/lib/coingecko";

export const SUPPORTED_CURRENCIES = ["usd", "eur", "gbp", "btc"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_CONFIG: Record<
  Currency,
  { label: string; symbol: string; name: string }
> = {
  usd: { label: "USD", symbol: "$", name: "US Dollar" },
  eur: { label: "EUR", symbol: "€", name: "Euro" },
  gbp: { label: "GBP", symbol: "£", name: "British Pound" },
  btc: { label: "BTC", symbol: "₿", name: "Bitcoin" },
};

const integer = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, currency: Currency = "usd"): string {
  if (currency === "btc") {
    const decimals = value >= 1 ? 4 : value >= 0.0001 ? 6 : 8;
    return `₿${value.toLocaleString("en-US", {
      minimumFractionDigits: Math.min(decimals, 4),
      maximumFractionDigits: decimals,
    })}`;
  }

  const maximumFractionDigits = value >= 1 ? 2 : value >= 0.01 ? 4 : 6;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency: Currency = "usd",
): string {
  if (currency === "btc") {
    if (value >= 1000) {
      return `₿${new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value)}`;
    }
    return `₿${value >= 1 ? value.toFixed(2) : value.toFixed(4)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    notation: "compact",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

// Backwards-compatible aliases
export function formatCompactUsd(value: number, currency: Currency = "usd"): string {
  return formatCompactCurrency(value, currency);
}

export function formatUsd(value: number, currency: Currency = "usd"): string {
  return formatCurrency(value, currency);
}

export function formatInteger(value: number): string {
  return integer.format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
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

export function formatChartTooltip(
  timestamp: number,
  price?: number,
  currency: Currency = "usd",
): string {
  const formattedDate = new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (price !== undefined) {
    return `${formattedDate} · ${formatCurrency(price, currency)}`;
  }

  return formattedDate;
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
