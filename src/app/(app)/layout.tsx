import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileHeader } from "@/components/shared/mobile-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <MobileHeader />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
