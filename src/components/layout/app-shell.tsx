import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppFooter } from "@/components/layout/app-footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col justify-between">
          <div className="flex-1">{children}</div>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
