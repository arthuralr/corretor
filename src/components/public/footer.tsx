
'use client'
import { Building, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useSiteConfig } from '@/hooks/use-site-config';

export function Footer() {
  const { siteConfig, loading } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
  const currentYear = new Date().getFullYear();
  const address = "Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001";
  
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const menuLinks = [
    { name: 'Início', href: '/inicio' },
    { name: 'Imóveis', href: '/imoveis' },
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  if (loading) {
    return null;
  }
  
  return (
    <footer className="bg-public-footer text-public-footer-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna da Logo e Informações */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/inicio" className="flex items-center gap-2">
                 {siteConfig.logo ? (
                    <img src={siteConfig.logo} alt={`${siteName} Logo`} className="h-10 w-auto filter-for-dark-bg" />
                 ) : (
                    <Building className="h-8 w-8 text-public-primary" />
                 )}
                 <span className="text-xl font-bold text-white">{siteName}</span>
            </Link>
            <p className="text-sm">
                Conectando você ao seu próximo lar com confiança e expertise no mercado imobiliário.
            </p>
          </div>
          
          {/* Coluna do Menu */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-public-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Coluna de Contato */}
          <div>
             <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
             <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-1 text-public-primary"/>
                    <a href="tel:+5511999998888">+55 (11) 99999-8888</a>
                </li>
                <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 text-public-primary"/>
                    <a href="mailto:contato@realconnect.com">contato@realconnect.com</a>
                </li>
                <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-public-primary"/>
                    <span>{address}</span>
                </li>
             </ul>
          </div>

          {/* Coluna de Redes Sociais */}
           <div>
            <h3 className="text-lg font-semibold text-white mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="text-public-footer-foreground hover:text-public-primary transition-colors">
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; {currentYear} {siteName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
