import type { LucideIcon } from "lucide-react";
import {
  ChartColumnIcon,
  LayoutDashboardIcon,
  StarIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Overview",
    description: "Market snapshot and key metrics",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/markets",
    label: "Markets",
    description: "Prices, volume, and market cap",
    icon: ChartColumnIcon,
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    description: "Assets you are tracking",
    icon: StarIcon,
  },
];

export function getActiveNavItem(pathname: string): NavItem {
  const match = NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return match ?? NAV_ITEMS[0];
}
