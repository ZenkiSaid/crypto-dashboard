export const TIME_RANGES = ["24h", "7d", "30d"] as const;

export type TimeRange = (typeof TIME_RANGES)[number];

export const TIME_RANGE_TO_DAYS: Record<TimeRange, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string | null;
  sparkline_in_7d?: {
    price: number[];
  };
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  price_change_percentage_30d_in_currency?: number | null;
};

export type GlobalMarketData = {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
};

export type GlobalMarketResponse = {
  data: GlobalMarketData;
};

export type MarketChartPoint = {
  timestamp: number;
  value: number;
};

export type MarketChart = {
  prices: MarketChartPoint[];
  marketCaps: MarketChartPoint[];
  totalVolumes: MarketChartPoint[];
};

export type GetCoinsMarketsParams = {
  vsCurrency?: string;
  perPage?: number;
  page?: number;
  sparkline?: boolean;
};

export type GetMarketChartParams = {
  coinId: string;
  vsCurrency?: string;
  range: TimeRange;
};
