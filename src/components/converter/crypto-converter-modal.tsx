"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  ArrowUpDown,
  Calculator,
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import {
  fetchConverterDataAction,
  type ConverterItem,
} from "@/actions/converter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1, 5, 10, 100];

export function CryptoConverterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ConverterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fromId, setFromId] = useState<string>("bitcoin");
  const [toId, setToId] = useState<string>("usd");

  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount] = useState<string>("");
  const [lastEditedField, setLastEditedField] = useState<"from" | "to">("from");

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [isSelectingFrom, setIsSelectingFrom] = useState(false);
  const [isSelectingTo, setIsSelectingTo] = useState(false);

  // Load items when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (items.length > 0) return; // already cached

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    fetchConverterDataAction().then((res) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (res.success) {
        setItems(res.data.coins);
      } else {
        setErrorMessage(res.error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, items.length]);

  // Keyboard shortcut: Press 'c' to open when not in input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fromCoin = useMemo(() => {
    return items.find((c) => c.id === fromId) ?? items.find((c) => c.id === "bitcoin") ?? null;
  }, [items, fromId]);

  const toCoin = useMemo(() => {
    return items.find((c) => c.id === toId) ?? items.find((c) => c.id === "usd") ?? null;
  }, [items, toId]);

  // Real-time bidirectional exchange calculation
  useEffect(() => {
    if (!fromCoin || !toCoin) return;

    const fromRateUsd = fromCoin.priceUsd;
    const toRateUsd = toCoin.priceUsd;

    if (toRateUsd === 0) return;

    if (lastEditedField === "from") {
      const parsed = parseFloat(fromAmount);
      if (isNaN(parsed) || parsed < 0) {
        setToAmount("");
        return;
      }
      const converted = (parsed * fromRateUsd) / toRateUsd;
      const formatted =
        converted >= 1
          ? converted.toLocaleString("en-US", { maximumFractionDigits: 4, useGrouping: false })
          : converted.toLocaleString("en-US", { maximumFractionDigits: 8, useGrouping: false });
      setToAmount(formatted);
    } else {
      const parsed = parseFloat(toAmount);
      if (isNaN(parsed) || parsed < 0) {
        setFromAmount("");
        return;
      }
      const converted = (parsed * toRateUsd) / fromRateUsd;
      const formatted =
        converted >= 1
          ? converted.toLocaleString("en-US", { maximumFractionDigits: 4, useGrouping: false })
          : converted.toLocaleString("en-US", { maximumFractionDigits: 8, useGrouping: false });
      setFromAmount(formatted);
    }
  }, [fromCoin, toCoin, fromAmount, toAmount, lastEditedField]);

  // Swap pair
  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
    // Keep fromAmount steady and recompute toAmount
    setLastEditedField("from");
  };

  // Unit rate text (e.g. 1 BTC = 64,500 USD)
  const unitRateText = useMemo(() => {
    if (!fromCoin || !toCoin) return null;
    const rate = fromCoin.priceUsd / (toCoin.priceUsd || 1);
    const formatted =
      rate >= 1
        ? rate.toLocaleString("en-US", { maximumFractionDigits: 4 })
        : rate.toLocaleString("en-US", { maximumFractionDigits: 8 });
    return `1 ${fromCoin.symbol} = ${formatted} ${toCoin.symbol}`;
  }, [fromCoin, toCoin]);

  const filteredFromItems = useMemo(() => {
    const q = searchFrom.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q)
    );
  }, [items, searchFrom]);

  const filteredToItems = useMemo(() => {
    const q = searchTo.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q)
    );
  }, [items, searchTo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs shadow-xs"
          aria-label="Crypto Converter"
        >
          <Calculator className="size-3.5 text-primary" />
          <span className="hidden md:inline font-medium">Converter</span>
          <kbd className="hidden sm:inline-flex ml-1 pointer-events-none h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
            C
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="size-4" />
            </div>
            <div>
              <DialogTitle>Crypto Converter</DialogTitle>
              <DialogDescription>
                Convert prices between Top 100 cryptocurrencies and fiat in real time
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading market exchange rates...</p>
          </div>
        ) : errorMessage && items.length === 0 ? (
          <div className="p-4 text-center space-y-3">
            <p className="text-xs text-destructive">{errorMessage}</p>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setIsLoading(true);
                fetchConverterDataAction().then((res) => {
                  setIsLoading(false);
                  if (res.success) setItems(res.data.coins);
                });
              }}
            >
              <RefreshCw className="size-3 mr-1" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* FROM CARD */}
            <div className="rounded-xl border bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>You Pay (From)</span>
                {fromCoin && (
                  <span className="font-mono text-[11px]">
                    ≈ ${(parseFloat(fromAmount || "0") * fromCoin.priceUsd).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => {
                    setFromAmount(e.target.value);
                    setLastEditedField("from");
                  }}
                  className="font-mono text-lg font-semibold h-11 bg-background"
                />

                {/* From Token Selector Trigger */}
                <div className="relative shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSelectingFrom((p) => !p);
                      setIsSelectingTo(false);
                    }}
                    className="h-11 min-w-[120px] gap-2 px-3 justify-between bg-background"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {fromCoin?.image ? (
                        <Image
                          src={fromCoin.image}
                          alt={fromCoin.name}
                          width={20}
                          height={20}
                          className="size-5 rounded-full"
                        />
                      ) : (
                        <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                          $
                        </div>
                      )}
                      <span className="font-bold text-xs">{fromCoin?.symbol ?? "BTC"}</span>
                    </div>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>

                  {/* From Dropdown Popover */}
                  {isSelectingFrom && (
                    <div className="absolute top-12 right-0 z-50 w-64 rounded-xl border bg-popover p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                        <Input
                          placeholder="Search token..."
                          value={searchFrom}
                          onChange={(e) => setSearchFrom(e.target.value)}
                          className="h-8 pl-8 text-xs"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                        {filteredFromItems.slice(0, 30).map((coin) => (
                          <button
                            key={coin.id}
                            type="button"
                            onClick={() => {
                              setFromId(coin.id);
                              setIsSelectingFrom(false);
                              setSearchFrom("");
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted/70 transition-colors text-left",
                              coin.id === fromId && "bg-muted font-semibold"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {coin.image ? (
                                <Image
                                  src={coin.image}
                                  alt={coin.name}
                                  width={18}
                                  height={18}
                                  className="size-4.5 rounded-full"
                                />
                              ) : (
                                <div className="size-4.5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">
                                  $
                                </div>
                              )}
                              <span className="truncate">{coin.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                {coin.symbol}
                              </span>
                            </div>
                            {coin.id === fromId && <Check className="size-3 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground mr-1">Quick:</span>
                {QUICK_AMOUNTS.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setFromAmount(String(amt));
                      setLastEditedField("from");
                    }}
                    className="h-6 px-2 text-[11px] font-mono"
                  >
                    {amt}
                  </Button>
                ))}
              </div>
            </div>

            {/* SWAP BUTTON DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={handleSwap}
                className="relative z-10 size-8 rounded-full border bg-background shadow-xs hover:bg-muted transition-transform active:scale-95"
                aria-label="Swap currencies"
              >
                <ArrowUpDown className="size-3.5 text-primary" />
              </Button>
            </div>

            {/* TO CARD */}
            <div className="rounded-xl border bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>You Receive (To)</span>
                {toCoin && (
                  <span className="font-mono text-[11px]">
                    ≈ ${(parseFloat(toAmount || "0") * toCoin.priceUsd).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={(e) => {
                    setToAmount(e.target.value);
                    setLastEditedField("to");
                  }}
                  className="font-mono text-lg font-semibold h-11 bg-background"
                />

                {/* To Token Selector Trigger */}
                <div className="relative shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSelectingTo((p) => !p);
                      setIsSelectingFrom(false);
                    }}
                    className="h-11 min-w-[120px] gap-2 px-3 justify-between bg-background"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {toCoin?.image ? (
                        <Image
                          src={toCoin.image}
                          alt={toCoin.name}
                          width={20}
                          height={20}
                          className="size-5 rounded-full"
                        />
                      ) : (
                        <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                          $
                        </div>
                      )}
                      <span className="font-bold text-xs">{toCoin?.symbol ?? "USD"}</span>
                    </div>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>

                  {/* To Dropdown Popover */}
                  {isSelectingTo && (
                    <div className="absolute top-12 right-0 z-50 w-64 rounded-xl border bg-popover p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                        <Input
                          placeholder="Search token..."
                          value={searchTo}
                          onChange={(e) => setSearchTo(e.target.value)}
                          className="h-8 pl-8 text-xs"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                        {filteredToItems.slice(0, 30).map((coin) => (
                          <button
                            key={coin.id}
                            type="button"
                            onClick={() => {
                              setToId(coin.id);
                              setIsSelectingTo(false);
                              setSearchTo("");
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted/70 transition-colors text-left",
                              coin.id === toId && "bg-muted font-semibold"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {coin.image ? (
                                <Image
                                  src={coin.image}
                                  alt={coin.name}
                                  width={18}
                                  height={18}
                                  className="size-4.5 rounded-full"
                                />
                              ) : (
                                <div className="size-4.5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">
                                  $
                                </div>
                              )}
                              <span className="truncate">{coin.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                {coin.symbol}
                              </span>
                            </div>
                            {coin.id === toId && <Check className="size-3 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LIVE RATE INFO BAR */}
            {unitRateText && (
              <div className="flex items-center justify-between rounded-lg bg-card border px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Exchange Rate</span>
                </div>
                <span className="font-mono font-medium text-foreground">{unitRateText}</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
