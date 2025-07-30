
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
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ClientEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    client: Client;
    onClientUpdate: () => void;
}

export function ClientEditModal({ isOpen, onOpenChange, client, onClientUpdate }: ClientEditModalProps) {
  const { toast } = useToast();

  const handleSave = async (values: Omit<Client, 'id'>) => {
    if (!client.id) {
        toast({ title: "Erro", description: "ID do cliente não encontrado.", variant: "destructive" });
        return;
    }
    try {
        const clientRef = doc(db, "clients", client.id);
        await setDoc(clientRef, values, { merge: true });

        addActivityLog({
            type: 'cliente',
            description: `Dados do cliente "${values.name}" atualizados.`,
            link: `/clients/${client.id}`
        });

        toast({
          title: "Cliente Atualizado!",
          description: "As informações do cliente foram salvas.",
        });

        onClientUpdate();
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
