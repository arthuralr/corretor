
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@/lib/definitions";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Endereço de email inválido"),
  phone: z.string().min(1, "Número de telefone é obrigatório"),
  searchProfile: z.string().optional(),
  birthDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
    initialData?: Client;
    onSave?: (values: FormValues) => void;
    onCancel?: () => void;
}

export function ClientForm({ initialData, onSave, onCancel }: ClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      searchProfile: "",
    },
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            ...initialData,
            birthDate: initialData.birthDate ? new Date(initialData.birthDate) : undefined,
        });
    }
  }, [initialData, form]);

  async function onSubmit(data: FormValues) {
    const values = {
      ...data,
      birthDate: data.birthDate ? data.birthDate.toISOString() : undefined,
    }

    try {
      if (isEditing && initialData?.id) {
        const clientRef = doc(db, "clients", initialData.id);
        await setDoc(clientRef, values, { merge: true });
        addActivityLog({
            type: 'cliente',
            description: `Dados do cliente "${values.name}" atualizados.`,
            link: `/clients/${initialData.id}`
        });
        toast({
          title: "Cliente Atualizado!",
          description: "As informações do cliente foram salvas.",
        });
        router.push("/clients");
      } else {
        const docRef = await addDoc(collection(db, "clients"), values);
        addActivityLog({
            type: 'cliente',
            description: `Novo cliente "${values.name}" adicionado.`,
            link: `/clients/${docRef.id}`
        });
        toast({
          title: "Cliente Salvo!",
          description: "O novo cliente foi adicionado aos seus registros.",
        });
        router.push("/clients");
      }
    } catch(error) {
        console.error("Erro ao salvar cliente no Firestore: ", error);
        toast({
            title: "Erro ao Salvar",
            description: "Não foi possível salvar o cliente.",
            variant: "destructive"
        });
    }
  }

  const handleCancel = onCancel || (() => router.back());

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
             <CardTitle className="font-headline">{isEditing ? "Editar Informações" : "Informações do Cliente"}</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
             <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Data de Aniversário</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                            )}
                        >
                            {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                            <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        locale={ptBR}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
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
            <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button type="submit">Salvar {isEditing ? "Alterações" : "Cliente"}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
