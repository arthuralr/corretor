
'use client';

import { useState } from 'react';
import { useSiteConfig } from '@/hooks/use-site-config';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WhatsappForm } from './whatsapp-form';

export function WhatsappButton() {
  const { siteConfig } = useSiteConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!siteConfig.whatsappPhone) {
    return null;
  }

  const handleFormSubmit = (data: { name: string; email: string; phone: string; interest: string }) => {
    const message = `Olá! Meu nome é ${data.name}.
Telefone: ${data.phone}
Email: ${data.email}
Meu interesse é: ${data.interest}.
Gostaria de mais informações.`;
    
    const whatsappUrl = `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setIsModalOpen(false);
  };
  
  const WhatsappIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="lucide lucide-message-circle"
    >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 2.55 1.01 4.98 2.68 6.78L2.25 22l3.82-2.52c1.45.86 3.12 1.34 4.97 1.34 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.89 8.65c.42-.42 1-.42 1.42 0l.9.9c.42.42.42 1 0 1.42l-1.8 1.8c-.42.42-1 .42-1.42 0l-2.4-2.4c-.42-.42-.42-1 0-1.42l1.3-1.3zm4.26 4.26c.42-.42 1-.42 1.42 0l.9.9c.42.42.42 1 0 1.42l-1.8 1.8c-.42.42-1 .42-1.42 0l-2.4-2.4c-.42-.42-.42-1 0-1.42l1.3-1.3z"/>
    </svg>
  );

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-auto p-4 rounded-full shadow-lg z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white"
      >
        <WhatsappIcon />
        <span className="hidden md:block text-lg font-semibold">Fale Conosco Agora</span>
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contato Rápido</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo e um de nossos consultores entrará em contato.
            </DialogDescription>
          </DialogHeader>
          <WhatsappForm onSave={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
