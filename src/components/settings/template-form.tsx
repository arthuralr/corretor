"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { MessageTemplate } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  content: z.string().min(1, "O conteúdo é obrigatório."),
});

type TemplateFormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
  onSave: (values: TemplateFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<MessageTemplate>;
}

export function TemplateForm({ onSave, onCancel, initialData }: TemplateFormProps) {
  const { toast } = useToast();
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: TemplateFormValues) {
    onSave(values);
    toast({
      title: "Modelo Salvo!",
      description: "Seu modelo de mensagem foi salvo com sucesso.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Follow-up Pós-Visita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo da Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva sua mensagem aqui. Use variáveis como [Nome do Cliente] para personalizar."
                  className="resize-y min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Modelo</Button>
        </div>
      </form>
    </Form>
  );
}
