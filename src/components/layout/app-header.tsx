"use client";

import { useEffect, useState } from "react";
import { HexagonIcon, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencySelect } from "@/components/layout/currency-select";
import { CryptoConverterModal } from "@/components/converter/crypto-converter-modal";
import { getActiveNavItem } from "@/config/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeItem = getActiveNavItem(pathname);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <MenuIcon />
        </Button>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HexagonIcon className="size-4" />
              </div>
              Crypto Analytics
            </SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation
            </SheetDescription>
          </SheetHeader>
          <div className="p-3">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="font-heading truncate text-sm font-medium md:text-base">
          {activeItem.label}
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          {activeItem.description}
        </p>
      </div>

      <Badge variant="outline" className="hidden sm:inline-flex">
        CoinGecko
      </Badge>
      <CryptoConverterModal />
      <CurrencySelect />
      <ThemeToggle />
    </header>
  );
}
