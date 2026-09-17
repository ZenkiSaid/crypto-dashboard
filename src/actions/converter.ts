"use server";

import { getCoinsMarkets, CoinGeckoError } from "@/lib/coingecko";

export type ConverterItem = {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  priceUsd: number;
  isFiat?: boolean;
};

export type ConverterData = {
  coins: ConverterItem[];
  timestamp: number;
};

export type ConverterActionResult =
  | { success: true; data: ConverterData }
  | { success: false; error: string };

// Fallback rates if exchange rate fetch is delayed
const DEFAULT_FIAT_RATES_VS_USD: Record<string, number> = {
  usd: 1.0,
  eur: 1.08, // 1 EUR = ~1.08 USD
  gbp: 1.29, // 1 GBP = ~1.29 USD
};

export async function fetchConverterDataAction(): Promise<ConverterActionResult> {
  try {
    const markets = await getCoinsMarkets({
      vsCurrency: "usd",
      perPage: 100,
      sparkline: false,
    });

    const fiatCurrencies: ConverterItem[] = [
      {
        id: "usd",
        name: "US Dollar",
        symbol: "USD",
        priceUsd: 1.0,
        isFiat: true,
      },
      {
        id: "eur",
        name: "Euro",
        symbol: "EUR",
        priceUsd: DEFAULT_FIAT_RATES_VS_USD.eur,
        isFiat: true,
      },
      {
        id: "gbp",
        name: "British Pound",
        symbol: "GBP",
        priceUsd: DEFAULT_FIAT_RATES_VS_USD.gbp,
        isFiat: true,
      },
    ];

    const cryptoItems: ConverterItem[] = markets.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,
      priceUsd: coin.current_price,
      isFiat: false,
    }));

    // Put USD, EUR, GBP and top cryptos (BTC, ETH, SOL) first
    const allItems: ConverterItem[] = [...fiatCurrencies, ...cryptoItems];

    return {
      success: true,
      data: {
        coins: allItems,
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    if (error instanceof CoinGeckoError) {
      if (error.status === 429) {
        return {
          success: false,
          error: "Rate limit reached. Please wait a moment before retrying.",
        };
      }
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load converter data",
    };
  }
}
