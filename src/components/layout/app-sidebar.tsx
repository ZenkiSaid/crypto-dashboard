import { HexagonIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <HexagonIcon className="size-4" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="font-heading truncate text-sm font-medium">
            Crypto Analytics
          </p>
          <p className="truncate text-xs text-muted-foreground">Live markets</p>
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Navigate
        </p>
        <SidebarNav />
      </div>
    </aside>
  );
}
