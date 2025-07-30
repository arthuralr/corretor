
'use client';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Building } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useSiteConfig } from "@/hooks/use-site-config";
import { NotificationCenter } from "./notification-center";

export function MobileHeader() {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName || "RealConnect";
  return (
    <header className="md:hidden sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger />
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        {siteConfig.logo ? (
          <img src={siteConfig.logo} alt="Logo" className="h-8 w-auto" />
        ): (
          <>
            <Building className="h-6 w-6 text-primary" />
            <span className="font-headline">{siteName}</span>
          </>
        )}
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <NotificationCenter />
        <ThemeToggle />
      </div>
    </header>
  );
}
