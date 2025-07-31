
'use client'

import { useSiteConfig } from "@/hooks/use-site-config";
import { Building, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const SocialIcon = ({ name, children }: { name: string, children: React.ReactNode }) => (
    <Link href="#" className="text-public-footer-foreground/80 hover:text-public-primary transition-colors">
        <span className="sr-only">{name}</span>
        {children}
    </Link>
)

export function Footer() {
    const { siteConfig, loading } = useSiteConfig();
    const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
    const address = "Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001";

    const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
    )

    const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>
    )

    const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    )

    if (loading) {
        return <footer className="bg-public-footer h-24" />
    }

  return (
    <footer className="bg-public-footer text-public-footer-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Coluna 1: Logo e Descrição */}
                <div className="md:col-span-1 space-y-4">
                     {siteConfig.logo ? (
                        <img src={siteConfig.logo} alt="Logo" className="h-10 w-auto dark:filter dark:brightness-0 dark:invert" />
                    ) : (
                        <Building className="h-10 w-10 text-public-primary" />
                    )}
                    <p className="text-sm text-public-footer-foreground/80">
                       Sua parceira de confiança no mercado imobiliário para encontrar o lar dos seus sonhos.
                    </p>
                </div>

                {/* Coluna 2: Contato */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-public-footer-foreground/90">Contato</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>{address}</span>
                        </div>
                         <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>+55 (51) 98289-2257</span>
                        </div>
                         <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>contato@realconnect.com</span>
                        </div>
                    </div>
                </div>
                
                {/* Coluna 3: Menu */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-public-footer-foreground/90">Menu</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/inicio" className="hover:text-public-primary transition-colors">Início</Link></li>
                        <li><Link href="/imoveis" className="hover:text-public-primary transition-colors">Imóveis</Link></li>
                        <li><Link href="/sobre" className="hover:text-public-primary transition-colors">Sobre Nós</Link></li>
                        <li><Link href="/contato" className="hover:text-public-primary transition-colors">Contato</Link></li>
                    </ul>
                </div>

                {/* Coluna 4: Social */}
                <div className="space-y-4">
                     <h3 className="font-semibold text-lg text-public-footer-foreground/90">Redes Sociais</h3>
                     <div className="flex items-center gap-4">
                        <SocialIcon name="Facebook"><FacebookIcon className="w-5 h-5" /></SocialIcon>
                        <SocialIcon name="Instagram"><InstagramIcon className="w-5 h-5" /></SocialIcon>
                        <SocialIcon name="X/Twitter"><XIcon className="w-5 h-5" /></SocialIcon>
                     </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-public-footer-foreground/20 text-center text-sm text-public-footer-foreground/60">
                <p>&copy; {new Date().getFullYear()} {siteName}. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
  );
}
