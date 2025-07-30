
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
} from "@/components/ui/sidebar";
import {
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
  Landmark,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useSiteConfig } from "@/hooks/use-site-config";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Minha Agenda", icon: CalendarCheck },
  { href: "/leads", label: "Leads", icon: ClipboardList },
  { href: "/funil", label: "Funil de Vendas", icon: DollarSign },
  { href: "/radar", label: "Radar de Oportunidades", icon: Telescope },
  { href: "/financeiro", label: "Financeiro", icon: Landmark },
  { href: "/relatorios", label: "Relatórios", icon: BarChartHorizontal },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/imoveis", label: "Imóveis", icon: Home },
  {
    href: "/ai-generator",
    label: "Gerador de Anúncios",
    icon: WandSparkles,
  },
  { href: "/social-media-generator", label: "Gerador de Posts", icon: Instagram },
  { href: "/settings/message-templates", label: "Modelos de Mensagens", icon: MessageSquareText },
  { href: "/settings/site", label: "Configurações do Site", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName || "RealConnect";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           {siteConfig.logo ? (
              <img src={siteConfig.logo} alt="Logo" className="h-8 w-auto" />
            ) : (
              <Building className="w-6 h-6 text-primary" />
           )}
          <h1 className="text-lg font-semibold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {siteName}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex-1" />
          <ThemeToggle />
           <Link href="/login" className="group-data-[collapsible=icon]:hidden">
            <Button asChild variant="ghost" size="icon" aria-label="Sair">
                <LogOut className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
