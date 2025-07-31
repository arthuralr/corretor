
'use client'

import { useSiteConfig } from "@/hooks/use-site-config";
import { Building, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const SocialLink = ({ href, icon: Icon }: { href: string, icon: React.ElementType }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-public-footer-foreground hover:text-public-primary transition-colors">
        <Icon className="h-6 w-6" />
    </a>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
)

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
)


export function Footer() {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
  
  return (
    <footer className="bg-public-footer text-public-footer-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Coluna 1: Logo e Descrição */}
                <div className="md:col-span-1 space-y-4">
                    <Link href="/inicio" className="flex items-center gap-2">
                         {siteConfig.logo ? (
                            <img src={siteConfig.logo} alt="Logo" className="h-8 w-auto dark:filter-for-dark-bg" />
                            ) : (
                            <Building className="h-8 w-8 text-public-primary" />
                        )}
                        <span className="text-xl font-bold text-white">{siteName}</span>
                    </Link>
                    <p className="text-sm">Sua parceira de confiança para encontrar o imóvel dos seus sonhos.</p>
                </div>

                {/* Coluna 2: Informações de Contato */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Contato</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                            <span>Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001</span>
                        </li>
                        <li className="flex items-center gap-2">
                             <Mail className="h-5 w-5 shrink-0" />
                            <span>contato@realconnect.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                             <Phone className="h-5 w-5 shrink-0" />
                            <span>+55 (11) 99999-8888</span>
                        </li>
                    </ul>
                </div>

                 {/* Coluna 3: Menu */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Menu</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/inicio" className="hover:text-public-primary transition-colors">Início</Link></li>
                        <li><Link href="/imoveis" className="hover:text-public-primary transition-colors">Imóveis</Link></li>
                        <li><Link href="/sobre" className="hover:text-public-primary transition-colors">Sobre Nós</Link></li>
                        <li><Link href="/contato" className="hover:text-public-primary transition-colors">Contato</Link></li>
                    </ul>
                </div>

                 {/* Coluna 4: Social */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Siga-nos</h3>
                    <div className="flex items-center gap-4">
                       <SocialLink href="https://instagram.com" icon={InstagramIcon} />
                       <SocialLink href="https://facebook.com" icon={FacebookIcon} />
                    </div>
                </div>

            </div>

             <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} {siteName}. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
  );
}
