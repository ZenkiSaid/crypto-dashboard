import {
  TIME_RANGE_TO_DAYS,
  type CoinMarket,
  type GetCoinsMarketsParams,
  type GetMarketChartParams,
  type GlobalMarketResponse,
  type MarketChart,
} from "./types";

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";
const DEFAULT_REVALIDATE_SECONDS = 60;

export class CoinGeckoError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "CoinGeckoError";
  }
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  const apiKey = process.env.COINGECKO_API_KEY;

  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  return headers;
}

function toSearchParams(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams.toString();
}

function mapChartSeries(series: [number, number][]): MarketChart["prices"] {
  return series.map(([timestamp, value]) => ({ timestamp, value }));
}

async function coingeckoFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
): Promise<T> {
  const query = params ? toSearchParams(params) : "";
  const url = `${COINGECKO_API_BASE_URL}${path}${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new CoinGeckoError(
      `CoinGecko request failed with status ${response.status}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}

export async function getGlobalMarket(): Promise<GlobalMarketResponse> {
  return coingeckoFetch<GlobalMarketResponse>("/global");
}

export async function getCoinsMarkets({
  vsCurrency = "usd",
  perPage = 10,
  page = 1,
  sparkline = true,
  ids,
}: GetCoinsMarketsParams = {}): Promise<CoinMarket[]> {
  return coingeckoFetch<CoinMarket[]>("/coins/markets", {
    vs_currency: vsCurrency,
    order: "market_cap_desc",
    per_page: perPage,
    page,
    sparkline,
    price_change_percentage: "24h,7d,30d",
    ids: ids && ids.length > 0 ? ids.join(",") : undefined,
  });
}

export async function getMarketChart({
  coinId,
  vsCurrency = "usd",
  range,
}: GetMarketChartParams): Promise<MarketChart> {
  const payload = await coingeckoFetch<{
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }>(`/coins/${encodeURIComponent(coinId)}/market_chart`, {
    vs_currency: vsCurrency,
    days: TIME_RANGE_TO_DAYS[range],
  });

  return {
    prices: mapChartSeries(payload.prices),
    marketCaps: mapChartSeries(payload.market_caps),
    totalVolumes: mapChartSeries(payload.total_volumes),
  };
}
