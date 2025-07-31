

'use client'

import { useSiteConfig } from "@/hooks/use-site-config";
import Link from "next/link";
import { Building, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";

export function Footer() {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";

  const socialLinks = [
    // { name: "Facebook", href: "#" },
    // { name: "Instagram", href: "#" },
    // { name: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-public-footer text-public-footer-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Logo e Sobre */}
          <div className="md:col-span-1">
             {siteConfig.logo ? (
              <img src={siteConfig.logo} alt={siteName} className="h-10 filter-for-dark-bg mb-4" />
            ) : (
               <div className="flex items-center gap-2 mb-4">
                <Building className="w-8 h-8 text-public-primary" />
                <span className="text-xl font-bold text-public-heading">{siteName}</span>
              </div>
            )}
            <p className="text-sm">
              Conectando você ao seu próximo lar com confiança e expertise no mercado imobiliário.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-lg font-semibold text-public-heading">Navegue</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/inicio" className="hover:text-public-primary transition-colors">Início</Link></li>
              <li><Link href="/imoveis" className="hover:text-public-primary transition-colors">Imóveis</Link></li>
              <li><Link href="/sobre" className="hover:text-public-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-public-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          {/* Coluna 3: Contato */}
          <div>
             <h3 className="text-lg font-semibold text-public-heading">Contato</h3>
             <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-1 text-public-primary" />
                    <a href={`tel:${siteConfig.whatsappPhone}`} className="hover:text-public-primary transition-colors">+55 (11) 99999-8888</a>
                </li>
                 <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 text-public-primary" />
                    <a href="mailto:contato@realconnect.com" className="hover:text-public-primary transition-colors">contato@realconnect.com</a>
                </li>
                 <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-public-primary" />
                    <span>Av. Gen. Flores da Cunha, 4290 - Cachoeirinha, RS</span>
                </li>
             </ul>
          </div>
          
          {/* Coluna 4: Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold text-public-heading">Siga-nos</h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks.length > 0 ? (
                socialLinks.map(link => (
                    <a key={link.name} href={link.href} className="text-public-footer-foreground hover:text-public-primary">
                      {/* Add social icons here */}
                      <span className="sr-only">{link.name}</span>
                    </a>
                ))
              ) : (
                <p className="text-sm">Redes sociais em breve.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-public-border/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {siteName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}