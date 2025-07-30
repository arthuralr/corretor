
'use client'

import Link from "next/link";
import { Building, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";

export function Footer() {
    const { siteConfig } = useSiteConfig();
    const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
    const currentYear = new Date().getFullYear();

    // A simple formatter, a more robust one could be used
    const formatPhone = (phone: string) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
        }
         if (cleaned.length === 10) {
            return `(${cleaned.substring(2, 4)}) ${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
        }
        return phone;
    }

  return (
    <footer className="bg-public-footer text-public-footer-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Logo e Descrição */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
             {siteConfig.logo ? (
                <img src={siteConfig.logo} alt={siteName} className="h-12 bg-white p-2 rounded-md mb-4" />
             ) : (
                <Building className="w-12 h-12 text-public-primary mb-4" />
             )}
            <h3 className="text-lg font-bold text-white">{siteName}</h3>
            <p className="text-sm mt-2">Sua parceira de confiança no mercado imobiliário.</p>
          </div>

          {/* Coluna 2: Contato */}
           <div>
            <h3 className="font-semibold text-white mb-4">Informações</h3>
            <div className="space-y-3 text-sm">
                <p>Avenida Andaraí, -, Morada do Vale III - Gravataí/RS, 94080-200</p>
                {siteConfig.whatsappPhone && (
                     <a href={`https://wa.me/${siteConfig.whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                        <Phone className="w-4 h-4" /> {formatPhone(siteConfig.whatsappPhone)}
                    </a>
                )}
                <a href="mailto:contato@realconnect.com" className="flex items-center gap-2 hover:text-white">
                    <Mail className="w-4 h-4" /> Ver e-mail
                </a>
            </div>
          </div>

          {/* Coluna 3: Menu */}
          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inicio" className="hover:text-white">Início</Link></li>
              <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
              <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
              {/* Add other links as pages are created */}
              {/* <li><a href="#" className="hover:text-white">Financie</a></li>
              <li><a href="#" className="hover:text-white">Negocie seu Imóvel</a></li>
              <li><a href="#" className="hover:text-white">Empreendimentos</a></li> */}
            </ul>
          </div>

          {/* Coluna 4: Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Social</h3>
             <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white">
                    <Instagram className="w-4 h-4"/> Instagram
                </a>
              </li>
              <li>
                 <a href="#" className="flex items-center gap-2 hover:text-white">
                    <Facebook className="w-4 h-4"/> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4 text-center text-xs">
            <p>&copy; {currentYear} - {siteName} - Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
