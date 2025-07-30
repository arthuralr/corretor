
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/use-site-config';
import { Building, Phone } from 'lucide-react';

export function Header() {
  const { siteConfig } = useSiteConfig();

  const navLinks = [
    { href: "/inicio", label: "Início" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/imoveis", label: "Buscar Imóveis" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-public-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/inicio" className="flex items-center gap-2">
            {siteConfig.logo ? (
              <img src={siteConfig.logo} alt={siteConfig.metaTitle || 'Logo'} className="h-10 w-auto" />
            ) : (
              <>
                <Building className="h-7 w-7 text-public-primary" />
                <span className="text-xl font-bold text-public-heading">RealConnect</span>
              </>
            )}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-public-foreground hover:text-public-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          {siteConfig.whatsappPhone && (
            <a 
              href={`https://wa.me/${siteConfig.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                  <Phone className="mr-2 h-4 w-4" />
                  Fale Conosco
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
