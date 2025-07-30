
'use client';

import { useSiteConfig } from '@/hooks/use-site-config';
import Link from 'next/link';

export function Footer() {
  const { siteConfig } = useSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-public-muted border-t border-public-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-semibold text-public-heading mb-2">{siteConfig.metaTitle || 'RealConnect'}</h3>
            <p className="text-sm text-public-muted-foreground">{siteConfig.metaDescription || 'Encontrando o imóvel dos seus sonhos.'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-public-heading mb-2">Navegação</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/inicio" className="text-public-muted-foreground hover:text-public-primary">Início</Link></li>
              <li><Link href="/sobre" className="text-public-muted-foreground hover:text-public-primary">Sobre Nós</Link></li>
              <li><Link href="/imoveis" className="text-public-muted-foreground hover:text-public-primary">Buscar Imóveis</Link></li>
              <li><Link href="/contato" className="text-public-muted-foreground hover:text-public-primary">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-public-heading mb-2">Contato</h3>
            {siteConfig.whatsappPhone && (
                 <p className="text-sm text-public-muted-foreground">WhatsApp: {siteConfig.whatsappPhone}</p>
            )}
          </div>
        </div>
        <div className="border-t border-public-border mt-8 pt-4 text-center text-xs text-public-muted-foreground">
          <p>&copy; {currentYear} {siteConfig.metaTitle || 'RealConnect'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
