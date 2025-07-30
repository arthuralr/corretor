
'use client';

import { useSiteConfig } from "@/hooks/use-site-config";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="h-8 w-8"
    >
        <path d="M16.75 13.96c.25.13.43.2.5.28.08.08.12.18.12.31 0 .21-.06.4-.18.58a1.29 1.29 0 0 1-.5.42 2.62 2.62 0 0 1-1.12.4H15.3c-.5 0-.94-.08-1.32-.25a5.53 5.53 0 0 1-2.14-1.5c-.56-.53-1-1.1-1.3-1.7-.3-.6-.46-1.2-.46-1.76 0-.28.05-.52.14-.7s.2-.32.32-.42c.12-.1.25-.15.38-.15s.22.02.3.05.15.08.2.13l.1.13c.05.07.08.14.12.2.04.07.05.12.05.15s-.02.13-.05.18a.9.9 0 0 1-.12.15l-.18.2a.35.35 0 0 0-.06.18c0 .1.03.2.08.3l.42.75c.2.35.45.68.75.98.3.3.62.56.98.75l.75.42c.1.05.2.08.3.08.08 0 .14-.02.18-.06l.2-.18a.9.9 0 0 1 .15-.12c.05-.03.1-.05.15-.05s.1.02.15.05l.2.12c.07.04.14.08.2.12a.6.6 0 0 1 .13.2c.02.08.04.17.04.28 0 .12-.04.22-.12.31zM12 2a10 10 0 0 0-9.22 13.3L2 22l6.7-1.76A10 10 0 1 0 12 2z"/>
    </svg>
)

export function WhatsappButton() {
    const { siteConfig, loading } = useSiteConfig();

    if (loading || !siteConfig.whatsappPhone) {
        return null;
    }
    
    const whatsappLink = `https://wa.me/${siteConfig.whatsappPhone.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20mais%20informações.`;

    return (
        <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300",
                "animate-in fade-in zoom-in-95"
            )}
            title="Fale Conosco pelo WhatsApp"
        >
            <WhatsAppIcon />
            <span className="text-sm font-semibold pr-2 hidden sm:inline">Fale Conosco Agora</span>
        </a>
    )
}
