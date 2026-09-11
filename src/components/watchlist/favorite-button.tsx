"use client";

import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type FavoriteButtonProps = {
  coinId: string;
  coinName?: string;
  className?: string;
  size?: "icon" | "icon-xs" | "icon-sm";
};

export function FavoriteButton({
  coinId,
  coinName,
  className,
  size = "icon-xs",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useWatchlist();
  const active = isLoaded && isFavorite(coinId);

  return (
    <Button
      type="button"
      size={size}
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(coinId);
      }}
      aria-label={
        active
          ? `Remove ${coinName ?? coinId} from watchlist`
          : `Add ${coinName ?? coinId} to watchlist`
      }
      aria-pressed={active}
      className={cn(
        "cursor-pointer transition-transform active:scale-90",
        className,
      )}
    >
      <Star
        className={cn(
          "size-3.5 transition-colors",
          active
            ? "fill-amber-400 text-amber-400 dark:fill-amber-400 dark:text-amber-400"
            : "text-muted-foreground/50 hover:text-amber-400/80 hover:fill-amber-400/20",
        )}
      />
    </Button>
  );
}
