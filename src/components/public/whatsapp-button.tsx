
'use client';

import { useSiteConfig } from "@/hooks/use-site-config";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        className={cn("w-8 h-8", className)}
    >
        <path fill="#fff" d="M4.868,43.323l2.745-10.02c-1.63-2.813-2.493-6.007-2.493-9.253C5.12,12.033,14.153,3,24,3c4.76,0,9.258,1.86,12.686,5.286S42.97,19.24,42.97,24c0,9.947-9.033,18-18.97,18c-3.247,0-6.44-0.863-9.253-2.493L4.868,43.323z"></path>
        <path fill="#fff" stroke="#4caf50" strokeWidth="0.1" d="M24.026,43.101c-3.246,0-6.44-0.863-9.253-2.492L4.893,44.7l2.744-10.019c-1.63-2.813-2.493-6.009-2.493-9.254c0-9.947,9.032-18,18.97-18c4.76,0,9.257,1.86,12.686,5.286c3.429,3.429,5.287,7.926,5.287,12.686c0,9.947-9.032,18-18.97,18C24.027,43.101,24.026,43.101,24.026,43.101z"></path>
        <path fill="#4caf50" d="M24,4C14.059,4,6,12.059,6,22c0,3.244,0.864,6.448,2.492,9.253L6.4,42l10.019-2.744c2.813,1.63,6.009,2.492,9.254,2.492c9.941,0,18-8.059,18-18S33.941,4,24,4z"></path>
        <path fill="#fff" d="M34.348,31.235c-0.274-0.138-1.618-0.799-1.869-0.887c-0.251-0.088-0.434-0.138-0.617,0.138c-0.184,0.276-0.707,0.887-0.868,1.064c-0.161,0.177-0.322,0.197-0.596,0.06c-0.274-0.138-1.157-0.428-2.204-1.36c-0.816-0.727-1.371-1.624-1.532-1.899c-0.161-0.276-0.017-0.427,0.121-0.564c0.123-0.122,0.274-0.316,0.412-0.473c0.138-0.158,0.183-0.276,0.274-0.455c0.091-0.179,0.046-0.335-0.023-0.473c-0.069-0.138-0.617-1.481-0.843-2.02c-0.227-0.539-0.455-0.466-0.617-0.476c-0.147-0.009-0.322-0.009-0.498-0.009c-0.177,0-0.455,0.068-0.693,0.335c-0.238,0.266-0.923,0.906-0.923,2.203c0,1.296,0.945,2.55,1.079,2.727c0.138,0.177,1.844,2.813,4.475,3.94c0.627,0.27,1.119,0.428,1.5,0.547c0.639,0.225,1.223,0.194,1.694,0.116c0.512-0.088,1.618-0.66,1.844-1.29c0.227-0.63,0.227-1.168,0.161-1.29C34.804,31.432,34.621,31.373,34.348,31.235z"></path>
    </svg>
);


export function WhatsappButton() {
    const { siteConfig, loading } = useSiteConfig();

    if (loading || !siteConfig.whatsappPhone) {
        return null;
    }

    const whatsappLink = `https://wa.me/${siteConfig.whatsappPhone.replace(/\D/g, '')}`;

    return (
        <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 bg-green-500 rounded-full shadow-lg text-white group hover:bg-green-600 transition-all duration-300 ease-in-out hover:w-60"
        >
            <WhatsAppIcon className="w-8 h-8"/>
            <span className="ml-2 font-semibold text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-full transition-all duration-300 ease-in-out">
                Fale Conosco Agora
            </span>
        </a>
    )
}
