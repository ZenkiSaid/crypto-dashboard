"use server";

import { getCoinsMarkets, type CoinMarket } from "@/lib/coingecko";

export type WatchlistActionResult =
  | { success: true; data: CoinMarket[] }
  | { success: false; error: string };

export async function fetchWatchlistCoinsAction(
  ids: string[],
  vsCurrency: string = "usd",
): Promise<WatchlistActionResult> {
  if (!ids || ids.length === 0) {
    return { success: true, data: [] };
  }

  try {
    const coins = await getCoinsMarkets({
      ids,
      vsCurrency,
      perPage: Math.min(ids.length, 100),
      sparkline: true,
    });

    return {
      success: true,
      data: coins,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch watchlist assets.",
    };
  }
}
