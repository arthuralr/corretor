
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ClientForm } from './client-form';
import type { Client } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { addActivityLog } from '@/lib/activity-log';

interface ClientEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    client: Client;
}

export function ClientEditModal({ isOpen, onOpenChange, client }: ClientEditModalProps) {
  const { toast } = useToast();

  const handleSave = (values: Omit<Client, 'id'>) => {
    try {
        const savedData = window.localStorage.getItem('clientsData');
        const clients: Client[] = savedData ? JSON.parse(savedData) : [];
        
        const updatedClients = clients.map(c => 
            c.id === client.id ? { ...c, ...values } : c
        );

        window.localStorage.setItem('clientsData', JSON.stringify(updatedClients));
        addActivityLog({
            type: 'cliente',
            description: `Dados do cliente "${values.name}" atualizados.`,
            link: `/clients/${client.id}`
        });

        toast({
          title: "Cliente Atualizado!",
          description: "As informações do cliente foram salvas.",
        });

        window.dispatchEvent(new CustomEvent('dataUpdated'));
        onOpenChange(false);

    } catch (error) {
        console.error("Failed to update client", error);
        toast({
            title: "Erro",
            description: "Não foi possível atualizar os dados do cliente.",
            variant: "destructive"
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações de {client.name}.
          </DialogDescription>
        </DialogHeader>
        <ClientForm 
          initialData={client}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
