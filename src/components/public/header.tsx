
'use client'

import { useState } from 'react';
import { Building, Menu, Phone, X, BotMessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: "/inicio", label: "Início" },
  { href: "/comprar", label: "Comprar" },
  { href: "/alugar", label: "Alugar" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-public-card shadow-sm text-public-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/inicio" className="flex items-center gap-2">
            <Building className="h-8 w-8 text-public-primary" />
            <span className="text-xl font-bold text-public-heading">Bataglin Imóveis</span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-public-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button variant="outline" className="border-public-primary text-public-primary hover:bg-public-primary hover:text-public-primary-foreground">
              <BotMessageSquare className="mr-2" /> (11) 99999-8888
            </Button>
            <Button className="bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
              Anuncie seu Imóvel
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-public-card">
                  <div className="flex flex-col h-full">
                     <div className="flex items-center justify-between p-4 border-b border-public-border">
                         <Link href="/inicio" className="flex items-center gap-2">
                            <Building className="h-6 w-6 text-public-primary" />
                            <span className="font-bold text-public-heading">Bataglin Imóveis</span>
                        </Link>
                    </div>
                     <nav className="flex flex-col p-4 space-y-2">
                        {navLinks.map(link => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className="text-lg font-medium hover:text-public-primary transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                    <div className="mt-auto p-4 space-y-4 border-t border-public-border">
                        <Button variant="outline" className="w-full border-public-primary text-public-primary hover:bg-public-primary hover:text-public-primary-foreground">
                            <BotMessageSquare className="mr-2" /> (11) 99999-8888
                        </Button>
                        <Button className="w-full bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
                            Anuncie seu Imóvel
                        </Button>
                    </div>
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

