
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
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Minha Agenda", icon: CalendarCheck },
  { href: "/funil", label: "Funil de Vendas", icon: DollarSign },
  { href: "/radar", label: "Radar de Oportunidades", icon: Telescope },
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
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            RealConnect
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
          <ThemeToggle />
          <div className="flex-1" />
           <Link href="/login" className="ml-auto group-data-[collapsible=icon]:hidden">
            <Button asChild variant="ghost" size="icon" aria-label="Sair">
                <LogOut className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
