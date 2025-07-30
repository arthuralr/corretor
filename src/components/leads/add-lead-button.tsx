
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LeadForm } from "./lead-form";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveLead } from "@/lib/lead-capture";

interface AddLeadButtonProps {
    onLeadAdded: () => void;
}

export function AddLeadButton({ onLeadAdded }: AddLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = (values: any) => {
    try {
        saveLead({
            ...values,
            birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
        });

        toast({
            title: "Lead Adicionado!",
            description: "O novo lead foi adicionado com sucesso.",
        });
        
        onLeadAdded();
        setIsOpen(false);
    } catch (error) {
        console.error("Failed to save lead", error);
        toast({
            title: "Erro",
            description: "Não foi possível salvar o lead.",
            variant: "destructive"
        })
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Lead
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo lead para adicioná-lo à sua lista.
            </DialogDescription>
          </DialogHeader>
          <LeadForm 
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
