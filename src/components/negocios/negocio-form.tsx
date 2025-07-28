

"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, Home, DollarSign, Tag, Percent } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Client, Imovel, EtapaFunil, Negocio } from '@/lib/definitions';
import { useEffect } from 'react';

const formSchema = z.object({
  clienteId: z.string().min(1, 'É obrigatório selecionar um cliente.'),
  imovelId: z.string().min(1, 'É obrigatório selecionar um imóvel.'),
  valorProposta: z.coerce.number().min(1, 'O valor da proposta é obrigatório.'),
  taxaComissao: z.coerce.number().min(0).optional(),
  etapa: z.enum(['Contato', 'Atendimento', 'Visita', 'Proposta', 'Reserva', 'Fechado - Ganho', 'Fechado - Perdido']),
});

type NegocioFormValues = z.infer<typeof formSchema>;

interface NegocioFormProps {
  onSave: (values: Negocio) => void;
  onCancel: () => void;
  initialData?: Partial<Negocio>;
  clients: Client[];
  imoveis: Imovel[];
}

const etapas: EtapaFunil[] = [
  'Contato', 
  'Atendimento', 
  'Visita', 
  'Proposta', 
  'Reserva', 
  'Fechado - Ganho', 
  'Fechado - Perdido'
];

export function NegocioForm({ onSave, onCancel, initialData, clients, imoveis }: NegocioFormProps) {
  const form = useForm<NegocioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteId: initialData?.clienteId || '',
      imovelId: initialData?.imovelId || '',
      valorProposta: initialData?.valorProposta || 0,
      taxaComissao: initialData?.taxaComissao || 0,
      etapa: initialData?.etapa || 'Contato',
    },
  });

  const selectedImovelId = form.watch('imovelId');

  useEffect(() => {
    if (selectedImovelId) {
        const selectedImovel = imoveis.find(i => i.id === selectedImovelId);
        if (selectedImovel) {
            form.setValue('valorProposta', selectedImovel.price);
        }
    }
  }, [selectedImovelId, imoveis, form]);

  useEffect(() => {
    // Reset form when initialData or modal opens
    form.reset({
      clienteId: initialData?.clienteId || '',
      imovelId: initialData?.imovelId || '',
      valorProposta: initialData?.valorProposta || 0,
      taxaComissao: initialData?.taxaComissao || 0,
      etapa: initialData?.etapa || 'Contato',
    });
  }, [initialData, form]);

  function onSubmit(values: NegocioFormValues) {
    const selectedClient = clients.find(c => c.id === values.clienteId);
    const selectedImovel = imoveis.find(i => i.id === values.imovelId);

    if (!selectedClient || !selectedImovel) {
        // Handle error, though validation should prevent this
        console.error("Client or Imovel not found");
        return;
    }

    const negocioData: Negocio = {
        id: initialData?.id || `NEG-${Date.now()}`,
        clienteId: selectedClient.id,
        clienteNome: selectedClient.name,
        imovelId: selectedImovel.id,
        imovelTitulo: selectedImovel.title,
        dataCriacao: initialData?.dataCriacao || new Date().toISOString(),
        prioridade: initialData?.prioridade || false,
        ...values,
    };
    
    onSave(negocioData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name="imovelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Home className="h-4 w-4" /> Imóvel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {imoveis.filter(i => i.status === 'Disponível' || i.id === initialData?.imovelId).map(imovel => (
                        <SelectItem key={imovel.id} value={imovel.id}>{imovel.title} ({imovel.refCode})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="valorProposta"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Valor da Proposta</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="750000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="taxaComissao"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Percent className="h-4 w-4" /> Comissão (%)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="6" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
           </div>
          <FormField
            control={form.control}
            name="etapa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Tag className="h-4 w-4" /> Etapa do Funil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma etapa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {etapas.map(etapa => (
                      <SelectItem key={etapa} value={etapa}>{etapa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">Salvar Negócio</Button>
        </div>
      </form>
    </Form>
  );
}
