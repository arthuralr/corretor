
'use client';
import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileHeader } from "@/components/shared/mobile-header";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Helmet } from "react-helmet";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { siteConfig } = useSiteConfig();
  return (
    <>
      <Helmet>
        {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
      </Helmet>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <MobileHeader />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
