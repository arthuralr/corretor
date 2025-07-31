
'use client'

import { useSiteConfig } from "@/hooks/use-site-config";
import { Building, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const footerNavs = [
    {
        label: "Menu",
        items: [
            { href: '/inicio', name: 'Início' },
            { href: '/imoveis', name: 'Imóveis' },
            { href: '/sobre', name: 'Sobre Nós' },
            { href: '/contato', name: 'Contato' },
        ]
    },
    {
        label: "Social",
        items: [
            { href: '#', name: 'Facebook' },
            { href: '#', name: 'Instagram' },
            { href: '#', name: 'LinkedIn' },
        ]
    }
];

export function Footer() {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
  const address = "Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001";
  return (
     <footer className="bg-public-footer text-public-footer-foreground text-sm">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 py-16">
           <div className="lg:col-span-2">
                <div className="max-w-md">
                     <div className="flex items-center gap-2 mb-4">
                        {siteConfig.logo ? (
                            <img src={siteConfig.logo} alt={siteName} className="h-10 w-auto filter-for-dark-bg" />
                        ) : (
                            <Building className="w-8 h-8 text-white" />
                        )}
                         <h3 className="text-xl font-semibold text-white">{siteName}</h3>
                     </div>
                    <p>
                        Somos mais do que uma imobiliária, somos facilitadores de sonhos. Nossa missão é conectar pessoas aos seus lares ideais.
                    </p>
                     <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3">
                           <MapPin className="w-5 h-5 text-public-primary flex-shrink-0 mt-1" />
                           <span>{address}</span>
                        </div>
                         <div className="flex items-start gap-3">
                           <Mail className="w-5 h-5 text-public-primary flex-shrink-0 mt-1" />
                           <span>contato@realconnect.com</span>
                        </div>
                         <div className="flex items-start gap-3">
                           <Phone className="w-5 h-5 text-public-primary flex-shrink-0 mt-1" />
                           <span>+55 (11) 99999-8888</span>
                        </div>
                     </div>
                </div>
            </div>
            {footerNavs.map((item, idx) => (
                <div key={idx} className="space-y-4">
                    <h4 className="text-white font-semibold text-base">{item.label}</h4>
                    <ul className="space-y-3">
                        {item.items.map((item, idx) => (
                            <li key={idx}>
                                <Link href={item.href} className="hover:text-public-primary transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        <div className="py-8 border-t border-public-border/20 text-center">
            <p>© {new Date().getFullYear()} {siteName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
