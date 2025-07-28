
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { NegocioForm } from './negocio-form';
import type { Negocio, Client, Imovel, EtapaFunil } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { addActivityLog } from '@/lib/activity-log';

interface NegocioModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (negocio: Negocio) => void;
    negocio: Negocio | null;
    defaultEtapa?: EtapaFunil;
    clients: Client[];
    imoveis: Imovel[];
}

export function NegocioModal({
    isOpen,
    onOpenChange,
    onSave,
    negocio,
    defaultEtapa,
    clients,
    imoveis,
}: NegocioModalProps) {
  const { toast } = useToast();
  const isEditing = !!negocio;

  const handleSave = (savedNegocio: Negocio) => {
    onSave(savedNegocio);
    const activityDescription = isEditing
        ? `Negócio "${savedNegocio.imovelTitulo}" atualizado.`
        : `Novo negócio para "${savedNegocio.imovelTitulo}" criado na etapa ${savedNegocio.etapa}.`;
    
    addActivityLog({
        type: 'negocio',
        description: activityDescription,
        link: `/negocios/${savedNegocio.id}`
    });

    toast({
        title: isEditing ? "Negócio Atualizado!" : "Negócio Criado!",
        description: "As informações foram salvas com sucesso.",
    });
  };

  const initialData = negocio ? negocio : { etapa: defaultEtapa };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Negócio' : 'Adicionar Novo Negócio'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite os detalhes deste negócio.' : 'Preencha os detalhes do novo negócio.'}
          </DialogDescription>
        </DialogHeader>
        <NegocioForm 
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            initialData={initialData}
            clients={clients}
            imoveis={imoveis}
        />
      </DialogContent>
    </Dialog>
  );
}
