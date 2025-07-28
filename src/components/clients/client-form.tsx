"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addActivityLog } from "@/lib/activity-log";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Endereço de email inválido"),
  phone: z.string().min(1, "Número de telefone é obrigatório"),
  searchProfile: z.string().optional(),
});

export function ClientForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      searchProfile: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save to a database. Here we use localStorage.
    const newClient = { id: `CLIENT-${Date.now()}`, ...values };
    try {
        const savedClients = window.localStorage.getItem('clientsData');
        const clients = savedClients ? JSON.parse(savedClients) : [];
        clients.push(newClient);
        window.localStorage.setItem('clientsData', JSON.stringify(clients));
        
        addActivityLog({
            type: 'cliente',
            description: `Novo cliente "${values.name}" adicionado.`,
            link: `/clients/${newClient.id}`
        });

        toast({
          title: "Cliente Salvo!",
          description: "O novo cliente foi adicionado aos seus registros.",
        });
        
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        router.push("/clients");
    } catch(error) {
        console.error("Failed to save client to localStorage", error);
        toast({
            title: "Erro ao Salvar",
            description: "Não foi possível salvar o cliente.",
            variant: "destructive"
        });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
             <CardTitle className="font-headline">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Endereço de Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
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
                  <FormLabel>Número de Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil de Busca</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Apartamento de 3 quartos, com sacada e perto do centro..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">Salvar Cliente</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
