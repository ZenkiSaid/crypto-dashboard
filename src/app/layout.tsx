import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crypto Analytics — Real-time Market Intelligence",
    template: "%s | Crypto Analytics",
  },
  description:
    "Institutional-grade cryptocurrency analytics dashboard with live market data, interactive charts, 7-day sparklines, persistent watchlists, and quick crypto converter powered by CoinGecko API.",
  keywords: [
    "crypto dashboard",
    "cryptocurrency analytics",
    "bitcoin price chart",
    "market cap",
    "crypto converter",
    "coingecko api",
    "next.js 15",
    "tailwind css",
    "recharts",
  ],
  authors: [{ name: "Said Altamirano (Zenki)", url: "https://github.com/ZenkiSaid" }],
  creator: "Said Altamirano (Zenki)",
  metadataBase: new URL("https://crypto-dashboard-zenki.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crypto-dashboard-zenki.vercel.app",
    siteName: "Crypto Analytics",
    title: "Crypto Analytics — Real-time Market Intelligence",
    description:
      "Modern SaaS cryptocurrency analytics dashboard with real-time markets, interactive Recharts, persistent watchlists, and instant currency conversion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Analytics — Real-time Market Intelligence",
    description:
      "Modern SaaS cryptocurrency analytics dashboard with real-time markets, interactive Recharts, persistent watchlists, and instant currency conversion.",
    creator: "@ZenkiSaid",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
