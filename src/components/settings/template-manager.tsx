"use client";

import { useState } from "react";
import type { MessageTemplate } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TemplateForm } from "./template-form";
import { useToast } from "@/hooks/use-toast";

interface TemplateManagerProps {
  initialTemplates: MessageTemplate[];
}

export function TemplateManager({ initialTemplates }: TemplateManagerProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDelete = (templateId: string) => {
    // In a real app, you'd call an API to delete the template.
    setTemplates(templates.filter((t) => t.id !== templateId));
    toast({
      title: "Modelo Excluído",
      description: "O modelo de mensagem foi excluído.",
      variant: "destructive",
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
        title: "Conteúdo Copiado!",
        description: "O texto do modelo foi copiado para a área de transferência."
    });
  };

  const handleSave = (values: { title: string; content: string }) => {
    // In a real app, you'd call an API to save the template.
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...values } : t
        )
      );
    } else {
      setTemplates([
        ...templates,
        { id: `TPL-${Date.now()}`, ...values },
      ]);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Modelo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="font-headline text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {template.content}
              </p>
            </CardContent>
            <CardContent className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopy(template.content)}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardContent>
          </Card>
        ))}
         {templates.length === 0 && (
            <div className="md:col-span-3 text-center text-muted-foreground py-12">
                <p>Nenhum modelo de mensagem encontrado.</p>
                <p>Clique em "Adicionar Novo Modelo" para começar.</p>
            </div>
         )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Modelo" : "Adicionar Novo Modelo"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Edite os detalhes do seu modelo de mensagem."
                : "Crie um novo modelo para usar em suas comunicações."}
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingTemplate || undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
