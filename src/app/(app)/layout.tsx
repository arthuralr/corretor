
'use client';
import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileHeader } from "@/components/shared/mobile-header";
import { useSiteConfig } from "@/hooks/use-site-config";
import Head from "next/head";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { siteConfig } = useSiteConfig();
  return (
    <>
      <Head>
        {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
      </Head>
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
