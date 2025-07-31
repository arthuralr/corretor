
'use client'
import { Landmark, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp, Building } from "lucide-react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Button } from "../ui/button";

const currentYear = new Date().getFullYear();

export function Footer() {
  const { siteConfig, loading } = useSiteConfig();
  
  if (loading) {
    return null; 
  }

  const siteName = siteConfig.siteName || "RealConnect";
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappPhone || ''}`;

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-public-footer text-public-footer-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Informações e Logo */}
          <div className="space-y-4">
             {siteConfig.logo ? (
                <img src={siteConfig.logo} alt={siteName} className="h-10 w-auto filter-for-dark-bg" />
            ) : (
                <div className="flex items-center gap-2">
                    <Building className="w-8 h-8 text-public-primary" />
                    <span className="text-xl font-bold text-white">{siteName}</span>
                </div>
            )}
            <p className="text-sm">Sua parceira de confiança no mercado imobiliário. Encontre o imóvel dos seus sonhos conosco.</p>
            <address className="text-sm not-italic space-y-2">
                 <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001</span>
                 </div>
                 <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                     <a href={`tel:${siteConfig.whatsappPhone}`} className="hover:text-public-primary transition-colors">(11) 99999-8888</a>
                 </div>
                 <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                    <a href="mailto:contato@realconnect.com" className="hover:text-public-primary transition-colors">contato@realconnect.com</a>
                 </div>
            </address>
          </div>

          {/* Coluna 2: Menu */}
          <div className="md:col-start-3 space-y-4">
            <h3 className="font-bold text-lg text-white">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inicio" className="hover:text-public-primary transition-colors">Início</Link></li>
              <li><Link href="/imoveis" className="hover:text-public-primary transition-colors">Imóveis</Link></li>
              <li><Link href="/sobre" className="hover:text-public-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-public-primary transition-colors">Contato</Link></li>
              <li><Link href="/portal/login" className="hover:text-public-primary transition-colors">Portal do Cliente</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Social */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-public-primary transition-colors"><Facebook /></a>
              <a href="#" aria-label="Instagram" className="hover:text-public-primary transition-colors"><Instagram /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-public-primary transition-colors"><Linkedin /></a>
            </div>
            {siteConfig.whatsappPhone && (
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white mt-4">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Fale no WhatsApp</a>
                </Button>
            )}
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="mt-12 pt-8 border-t border-public-footer-foreground/20 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {currentYear} {siteName}. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link href="/termos" className="hover:text-public-primary transition-colors">Termos de Uso</Link>
                <Link href="/privacidade" className="hover:text-public-primary transition-colors">Política de Privacidade</Link>
                <button onClick={handleScrollTop} aria-label="Voltar ao topo">
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </footer>
  );
}
