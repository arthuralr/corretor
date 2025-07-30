
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { saveLead } from "@/lib/lead-capture";
import { useToast } from "@/hooks/use-toast";

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
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  phone: z.string().min(10, "Por favor, insira um telefone válido."),
  message: z.string().optional(),
});

interface PropertyContactFormProps {
    propertyTitle: string;
}

export function PropertyContactForm({ propertyTitle }: PropertyContactFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `Olá, tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      saveLead({
        ...values,
        interest: `Imóvel: ${propertyTitle}`,
        source: 'Site - Página do Imóvel',
      });
      toast({
        title: "Mensagem Enviada!",
        description: "Obrigado! Um de nossos corretores entrará em contato em breve.",
      });
      form.reset({
        name: "",
        email: "",
        phone: "",
        message: `Olá, tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-public-foreground">Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-public-foreground">Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-public-foreground">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-public-foreground">Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
            {form.formState.isSubmitting ? 'Enviando...' : 'Quero mais informações'}
        </Button>
      </form>
    </Form>
  );
}
