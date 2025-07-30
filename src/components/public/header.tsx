
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";

  const navLinks = [
    { href: "/inicio", label: "Início" },
    { href: "/imovel", label: "Imóveis" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <header className="bg-public-card/80 backdrop-blur-sm sticky top-0 z-40 border-b border-public-border">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/inicio" className="flex items-center gap-2">
           {siteConfig.logo ? (
              <img src={siteConfig.logo} alt="Logo" className="h-10 w-auto" />
            ) : (
              <span className="text-xl font-bold text-public-heading">{siteName}</span>
           )}
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                    "text-sm font-medium text-public-foreground hover:text-public-primary transition-colors",
                    pathname === link.href && "text-public-primary"
                )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
            <Button asChild>
                <Link href="/login">Área do Corretor</Link>
            </Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-public-card border-t border-public-border">
          <nav className="flex flex-col items-center gap-4 p-4">
            {navLinks.map(link => (
                 <Link 
                    key={link.href} 
                    href={link.href} 
                    className={cn(
                        "text-lg font-medium text-public-foreground hover:text-public-primary transition-colors",
                         pathname === link.href && "text-public-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                >
              {link.label}
            </Link>
            ))}
             <Button asChild className="mt-4 w-full">
                <Link href="/login">Área do Corretor</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
