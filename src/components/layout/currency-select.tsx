"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  CURRENCY_CONFIG,
  SUPPORTED_CURRENCIES,
  type Currency,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";

export function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const currentConfig = CURRENCY_CONFIG[currency];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
        className="h-8 gap-1.5 px-2.5 font-mono text-xs shadow-xs"
      >
        <span className="font-semibold text-foreground">
          {currentConfig.symbol}
        </span>
        <span className="font-medium uppercase">{currentConfig.label}</span>
        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Supported currencies"
          className="absolute right-0 z-50 mt-1.5 w-44 origin-top-right rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <div className="px-2 py-1 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Display Currency
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_CURRENCIES.map((c) => {
              const item = CURRENCY_CONFIG[c];
              const isSelected = currency === c;

              return (
                <button
                  key={c}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrency(c);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                    isSelected
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "text-foreground hover:bg-muted/80",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground w-4 text-center">
                      {item.symbol}
                    </span>
                    <span className="font-medium uppercase">{item.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.name}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="size-3.5 text-foreground shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
