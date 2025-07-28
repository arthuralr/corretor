import { SidebarTrigger } from "@/components/ui/sidebar";
import { Building } from "lucide-react";
import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger />
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Building className="h-6 w-6 text-primary" />
        <span className="font-headline">RealConnect</span>
      </Link>
    </header>
  );
}
