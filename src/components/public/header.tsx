
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useState } from 'react';
import { useSiteConfig } from "@/hooks/use-site-config";

const menuItems = [
    { label: "Início", href: "/inicio" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "/contato" },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { siteConfig } = useSiteConfig();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-public-background/80 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <Link href="/inicio" className="text-2xl font-bold text-public-heading">
                       {siteConfig.logo ? (
                         <img src={siteConfig.logo} alt="Logo" className="h-10 w-auto" />
                       ) : (
                        'Bataglin Imóveis'
                       )}
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <Link key={item.label} href={item.href} className="text-public-foreground hover:text-public-primary transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="outline" asChild>
                           <a href={`https://wa.me/${siteConfig.whatsappPhone}`} target="_blank" rel="noopener noreferrer">
                             <Phone className="mr-2 h-4 w-4"/> {siteConfig.whatsappPhone || '(XX) XXXX-XXXX'}
                           </a>
                        </Button>
                        <Button className="bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
                            ANUNCIE SEU IMÓVEL AQUI
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon">
                            {isMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="md:hidden bg-public-background shadow-md">
                    <nav className="flex flex-col items-center gap-4 py-4">
                         {menuItems.map((item) => (
                            <Link key={item.label} href={item.href} className="text-public-foreground hover:text-public-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-4 w-full px-4 pt-4">
                             <Button variant="outline" className="w-full" asChild>
                               <a href={`https://wa.me/${siteConfig.whatsappPhone}`} target="_blank" rel="noopener noreferrer">
                                 <Phone className="mr-2 h-4 w-4"/> {siteConfig.whatsappPhone || '(XX) XXXX-XXXX'}
                               </a>
                            </Button>
                            <Button className="bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground w-full">
                                ANUNCIE SEU IMÓVEL AQUI
                            </Button>
                        </div>
                    </nav>
                 </div>
            )}
        </header>
    );
}
