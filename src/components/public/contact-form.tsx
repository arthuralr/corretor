"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Custom styles for public form inputs
const publicInputStyles = "bg-public-muted/50 border-public-border focus:bg-white focus:ring-public-primary";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export function ContactForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock form submission
    console.log(values);
    toast({
      title: "Mensagem Enviada!",
      description: "Agradecemos o seu contato. Retornaremos em breve.",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-public-foreground">Seu Nome</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className={cn(publicInputStyles)} />
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
              <FormLabel className="text-public-foreground">Seu Email</FormLabel>
              <FormControl>
                <Input placeholder="seu.email@exemplo.com" {...field} className={cn(publicInputStyles)} />
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
              <FormLabel className="text-public-foreground">Seu Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-8888" {...field} className={cn(publicInputStyles)} />
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
              <FormLabel className="text-public-foreground">Sua Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Olá, gostaria de saber mais sobre..."
                  className={cn("resize-none", publicInputStyles)}
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
            Enviar Mensagem
        </Button>
      </form>
    </Form>
  );
}
