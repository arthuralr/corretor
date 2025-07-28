"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Building2,
  Users,
  WandSparkles,
  LayoutDashboard,
  Settings,
  LogOut,
  Building,
  Home,
  DollarSign,
  Telescope,
  CalendarCheck,
  MessageSquareText,
  BarChartHorizontal,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Minha Agenda", icon: CalendarCheck },
  { href: "/funil", label: "Funil de Vendas", icon: DollarSign },
  { href: "/radar", label: "Radar de Oportunidades", icon: Telescope },
  { href: "/relatorios", label: "Relatórios", icon: BarChartHorizontal },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/imoveis", label: "Imóveis", icon: Home },
  {
    href: "/ai-generator",
    label: "AI Listing Generator",
    icon: WandSparkles,
  },
  { href: "/social-media-generator", label: "Gerador de Posts", icon: Instagram },
  { href: "/settings/message-templates", label: "Modelos de Mensagens", icon: MessageSquareText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <SidebarTrigger />
          </Button>
          <Building className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">
            RealConnect
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@realtor" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-sidebar-foreground">
              Jane Doe
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              janedoe@realtor.com
            </span>
          </div>
          <Link href="/login" className="ml-auto group-data-[collapsible=icon]:hidden">
            <Button variant="ghost" size="icon" aria-label="Log out">
              <LogOut className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
