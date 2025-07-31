
'use client'
import { useSiteConfig } from "@/hooks/use-site-config";
import { Building, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const { siteConfig } = useSiteConfig();
    const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-public-footer text-public-footer-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Col 1: Logo and Info */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/inicio" className="flex items-center gap-2">
                           {siteConfig.logo ? (
                             <img src={siteConfig.logo} alt={siteName} className="h-8 w-auto filter brightness-0 invert" />
                           ) : (
                            <>
                                <Building className="w-8 h-8 text-public-primary" />
                                <span className="text-xl font-bold text-white">{siteName}</span>
                            </>
                           )}
                        </Link>
                        <p className="text-sm max-w-md">
                            Sua parceira de confiança para encontrar o imóvel dos seus sonhos. Oferecemos um serviço completo e personalizado.
                        </p>
                         <div className="text-sm">
                            <p className="font-semibold text-white mb-1">Endereço:</p>
                            <p>Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio, Cachoeirinha - RS, 94950-001</p>
                        </div>
                    </div>
                    {/* Col 2: Menu */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Menu</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/inicio" className="hover:text-white transition-colors">Início</Link></li>
                            <li><Link href="/imoveis" className="hover:text-white transition-colors">Imóveis</Link></li>
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                        </ul>
                    </div>
                     {/* Col 3: Social */}
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4">Siga-nos</h3>
                         <div className="flex items-center gap-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="w-6 h-6" /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
                         </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
                    <p>&copy; {currentYear} {siteName}. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
