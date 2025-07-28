import { TemplateManager } from "@/components/settings/template-manager";
import { MessageSquareText } from "lucide-react";
import type { MessageTemplate } from "@/lib/definitions";

async function getTemplates(): Promise<MessageTemplate[]> {
  // In a real app, you'd fetch this from a database.
  return [
    {
      id: "TPL-1",
      title: "Follow-up Pós-Visita",
      content: "Olá [Nome do Cliente],\n\nGostaria de agradecer pela visita ao imóvel em [Endereço do Imóvel] hoje. O que você achou?\n\nEstou à disposição para tirar qualquer dúvida.\n\nAtenciosamente,\n[Seu Nome]",
    },
    {
      id: "TPL-2",
      title: "Envio de Proposta",
      content: "Prezado(a) [Nome do Cliente],\n\nConforme conversamos, segue em anexo a proposta para o imóvel [Título do Imóvel].\n\nQualquer dúvida, me avise.\n\nAbraço,\n[Seu Nome]",
    },
    {
      id: "TPL-3",
      title: "Contato Inicial (Lead)",
      content: "Olá [Nome do Cliente], tudo bem?\n\nVi que você se interessou pelo imóvel [Título do Imóvel]. Gostaria de agendar uma visita ou saber mais detalhes?\n\nAguardo seu retorno.\n\nAtenciosamente,\n[Seu Nome]",
    },
  ];
}


export default async function MessageTemplatesPage() {
    const templates = await getTemplates();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-8 w-8 text-accent" />
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Modelos de Mensagens
        </h2>
      </div>
      <p className="text-muted-foreground">
        Crie, edite e gerencie seus modelos de mensagens para agilizar a comunicação com seus clientes.
      </p>
      <TemplateManager initialTemplates={templates} />
    </div>
  );
}
