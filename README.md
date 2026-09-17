# ⚡ Crypto Analytics SaaS

Institutional-grade cryptocurrency analytics platform built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, **Shadcn UI**, and **Recharts**, powered in real time by the **CoinGecko API**.

![Crypto Dashboard Preview](https://raw.githubusercontent.com/ZenkiSaid/crypto-dashboard/main/public/preview.png)

---

## 🌟 Overview

Crypto Analytics is a production-ready Web3 analytical dashboard delivering high-fidelity market intelligence. Designed with a Bento Grid layout, it combines server-side performance (SSR/ISR) with instantaneous client interactivity, zero layout shifts (CLS = 0), and full resilience against rate-limiting.

### ✨ Key Features

- **📊 Dynamic Bento Grid Dashboard**:
  - Global crypto market metrics (Total Market Cap, 24h Spot Volume, BTC Dominance, Active Cryptocurrencies) hydrated on the server.
  - Interactive Bitcoin price area chart with smooth transitions, custom tooltips, and time-range selection (`24h`, `7d`, `30d`, `90d`, `1y`).
  - Top spot volume leaders bar chart & market dominance breakdown.
  - Top market movers list with instantaneous drawer inspection.

- **📈 Full Markets Explorer (`/markets`)**:
  - High-performance data table tracking top cryptocurrencies.
  - Interactive inline 7-day SVG Sparklines dynamically tinted by trajectory performance.
  - Real-time client-side search by name/symbol, multi-column sorting (Rank, Price, 24h %, 7d %, Volume, Market Cap), and pagination.
  - React Suspense skeletons and error boundaries for flawless resilience.

- **⭐ Reactive Watchlist System (`/watchlist`)**:
  - Ubiquitous star button (⭐) on all tables, cards, and drawers.
  - Synchronized state across tabs using `useSyncExternalStore` and `localStorage`.
  - Consolidated portfolio analytics: Tracked assets count, top 24h gainer, watchlist 24h average performance, and total combined market cap.
  - Helpful empty state with quick navigation to market exploration.

- **🔍 Interactive Coin Detail Drawer (`CoinDetailSheet`)**:
  - Click any coin anywhere to open an in-depth slide-over sheet.
  - Interactive multi-range price chart powered by cached Server Actions.
  - 24-hour Low/High visual price range meter.
  - Key analytical statistics: ATH/ATL with percentage distance and dates, Fully Diluted Valuation (FDV), and Circulating vs. Max Supply progress bar.

- **🌍 Global Multi-Currency Support (USD, EUR, GBP, BTC)**:
  - Header dropdown to effortlessly switch base currency across the entire application.
  - Hybrid persistence: stored in `localStorage` and synced to HTTP cookies (`crypto_currency`).
  - SSR hydration with Next.js Server Components (`cookies()`) for zero-flash renders.
  - Customized monetary formatters adapting precision and symbols (`$`, `€`, `£`, `₿`).

- **🔄 Real-Time Crypto Converter**:
  - Instant calculator modal accessible via the header or quick keyboard shortcut (`C`).
  - Bidirectional exchange rate calculation between Top 100 cryptocurrencies and fiat currencies.
  - One-click pair swap button and quick amount selectors (`1`, `5`, `10`, `100`).

- **🎨 Modern Design & Theming**:
  - Tailored Shadcn UI Nova aesthetic with Tailwind CSS v4 design tokens.
  - System-aware Dark/Light mode with `next-themes` (zero hydration mismatch).
  - Responsive layout with collapsible sidebar and mobile navigation drawer.

- **🛡️ Resilience & Production Ready**:
  - Exponential backoff and graceful fallback cache when CoinGecko API rate limits are hit.
  - Comprehensive OpenGraph and Twitter SEO metadata.
  - Custom branded 404 page (`not-found.tsx`).

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Next.js](https://nextjs.org/)** (v16 App Router) | React Framework with Server Components & Server Actions |
| **[React](https://react.dev/)** (v19) | Core UI Library |
| **[TypeScript](https://www.typescriptlang.org/)** | 100% Strict Type Safety |
| **[Tailwind CSS](https://tailwindcss.com/)** (v4) | Utility-first Modern CSS Engine |
| **[Shadcn UI](https://ui.shadcn.com/)** | Accessible UI Primitives (Radix UI) |
| **[Recharts](https://recharts.org/)** | Responsive SVG Charts with Area & Bar visualizations |
| **[Lucide React](https://lucide.dev/)** | Crisp, lightweight icons |
| **[CoinGecko API](https://www.coingecko.com/en/api)** | Real-time and historical cryptocurrency data provider |

---

## 📂 Project Structure

```bash
crypto-dashboard/
├── src/
│   ├── actions/                 # Next.js Server Actions
│   │   ├── converter.ts         # Exchange rates & converter data
│   │   ├── market-chart.ts      # Historical chart data fetcher
│   │   └── watchlist.ts         # Batch coin markets fetcher
│   ├── app/                     # Next.js App Router
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # Currency & Sheet Provider shell
│   │   │   ├── page.tsx         # Overview Bento Grid Dashboard
│   │   │   ├── markets/page.tsx # Top 50 Markets Explorer
│   │   │   └── watchlist/page.tsx # Custom Watchlist view
│   │   ├── globals.css          # Tailwind CSS v4 & theme variables
│   │   ├── layout.tsx           # Root layout with ThemeProvider & SEO metadata
│   │   └── not-found.tsx        # Custom 404 error page
│   ├── components/
│   │   ├── coins/               # CoinDetailSheet & drawer components
│   │   ├── converter/           # CryptoConverterModal
│   │   ├── dashboard/           # Bento Grid, KPI cards & Recharts
│   │   ├── layout/              # AppHeader, AppSidebar, AppFooter, AppShell
│   │   ├── markets/             # MarketsTable & Sparkline SVG
│   │   ├── ui/                  # Shadcn UI primitives (Button, Dialog, Card, etc.)
│   │   └── watchlist/           # FavoriteButton, WatchlistView & Skeletons
│   ├── context/                 # React Contexts (Currency, CoinDetail)
│   ├── hooks/                   # Custom hooks (useWatchlist)
│   └── lib/
│       ├── coingecko/           # Typed CoinGecko API client & contracts
│       ├── format.ts            # Currency, compact and percentage formatters
│       └── utils.ts             # Class merging helper
├── public/                      # Static assets & favicon
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `20.x` or higher
- `pnpm` `9.x` or `10.x` (recommended package manager)

```bash
# Verify pnpm installation
pnpm --version
```

### 1. Clone the repository

```bash
git clone https://github.com/ZenkiSaid/crypto-dashboard.git
cd crypto-dashboard
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables (Optional)

Create a `.env.local` file in the root folder if you have a CoinGecko Demo or Pro API key:

```env
# Optional: CoinGecko Demo/Pro API Key for higher rate limits
COINGECKO_API_KEY=your_coingecko_api_key_here
```

> **Note**: If left blank, the application will connect to the free public CoinGecko API with built-in caching and rate-limit mitigation.

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
pnpm build
```

### 6. Start the production server

```bash
pnpm start
```

---

## 👨‍💻 Author

**Said Altamirano (Zenki)**
- GitHub: [@ZenkiSaid](https://github.com/ZenkiSaid)

---

## 📄 License & Attribution

- Market data generously provided by the **[CoinGecko API](https://www.coingecko.com/en/api)**.
- **Disclaimer**: Market data and analytics provided across this dashboard are for informational and educational purposes only and do not constitute financial, legal, or investment advice.
