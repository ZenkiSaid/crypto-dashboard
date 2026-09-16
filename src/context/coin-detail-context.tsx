"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { CoinMarket } from "@/lib/coingecko";

type CoinDetailContextType = {
  selectedCoin: CoinMarket | null;
  isOpen: boolean;
  openCoinDetail: (coin: CoinMarket) => void;
  closeCoinDetail: () => void;
};

const CoinDetailContext = createContext<CoinDetailContextType | undefined>(
  undefined,
);

export function CoinDetailProvider({ children }: { children: ReactNode }) {
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCoinDetail = useCallback((coin: CoinMarket) => {
    setSelectedCoin(coin);
    setIsOpen(true);
  }, []);

  const closeCoinDetail = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CoinDetailContext.Provider
      value={{
        selectedCoin,
        isOpen,
        openCoinDetail,
        closeCoinDetail,
      }}
    >
      {children}
    </CoinDetailContext.Provider>
  );
}

export function useCoinDetail() {
  const context = useContext(CoinDetailContext);
  if (!context) {
    throw new Error("useCoinDetail must be used within a CoinDetailProvider");
  }
  return context;
}
