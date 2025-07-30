
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { saveLead } from "@/lib/lead-capture";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "O nome é obrigatório."),
  phone: z.string().min(10, "O telefone é obrigatório."),
  email: z.string().email("Por favor, insira um email válido."),
  interest: z.string().min(1, "Por favor, selecione um interesse."),
});

type FormValues = z.infer<typeof formSchema>;

interface WhatsappFormProps {
    onSubmit: (values: FormValues) => void;
}

export function WhatsappForm({ onSubmit }: WhatsappFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      interest: "",
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    try {
        saveLead({
            ...values,
            source: 'Site - Botão WhatsApp',
        });
        onSubmit(values);
    } catch(e) {
        toast({
            title: "Erro",
            description: "Não foi possível salvar o lead. Tente novamente.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
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
              <FormLabel>Telefone / WhatsApp</FormLabel>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interesse</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu interesse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Falar com um corretor">Falar com um corretor</SelectItem>
                  <SelectItem value="Comprar um imóvel">Comprar um imóvel</SelectItem>
                  <SelectItem value="Alugar um imóvel">Alugar um imóvel</SelectItem>
                  <SelectItem value="Vender um imóvel">Vender um imóvel</SelectItem>
                  <SelectItem value="Investir em imóveis">Investir em imóveis</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? 'Aguarde...' : 'Iniciar Conversa no WhatsApp'}
        </Button>
      </form>
    </Form>
  );
}
