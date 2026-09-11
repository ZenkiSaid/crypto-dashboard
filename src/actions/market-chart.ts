"use server";

import {
  getMarketChart,
  TIME_RANGES,
  type MarketChart,
  type TimeRange,
} from "@/lib/coingecko";

export type MarketChartActionResult =
  | { success: true; data: MarketChart }
  | { success: false; error: string };

export async function fetchMarketChartAction(
  coinId: string = "bitcoin",
  range: TimeRange = "7d",
  vsCurrency: string = "usd",
): Promise<MarketChartActionResult> {
  try {
    const validRange = TIME_RANGES.includes(range) ? range : "7d";
    const chart = await getMarketChart({
      coinId,
      range: validRange,
      vsCurrency,
    });

    return {
      success: true,
      data: chart,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch market chart.";
    return {
      success: false,
      error: message,
    };
  }
}
