
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Despesa, DespesaCategoria } from '@/lib/definitions';

const formSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória'),
  value: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  category: z.enum(['Marketing', 'Aluguel', 'Salários', 'Comissões', 'Outros']),
});

type DespesaFormValues = z.infer<typeof formSchema>;

interface DespesaFormProps {
  onSave: () => void;
  onCancel: () => void;
  initialData?: Partial<DespesaFormValues>;
}

const DESPESAS_STORAGE_KEY = 'despesasData';
const categorias: DespesaCategoria[] = ['Marketing', 'Aluguel', 'Salários', 'Comissões', 'Outros'];

export function DespesaForm({ onSave, onCancel, initialData }: DespesaFormProps) {
  const { toast } = useToast();
  
  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      description: '',
      value: 0,
      date: new Date(),
      category: 'Outros',
    },
  });

  function onSubmit(values: DespesaFormValues) {
    try {
        const savedDespesas = window.localStorage.getItem(DESPESAS_STORAGE_KEY);
        const despesas: Despesa[] = savedDespesas ? JSON.parse(savedDespesas) : [];

        const newDespesa: Despesa = {
            id: `DESPESA-${Date.now()}`,
            description: values.description,
            value: values.value,
            date: values.date.toISOString(),
            category: values.category,
        };

        despesas.push(newDespesa);
        window.localStorage.setItem(DESPESAS_STORAGE_KEY, JSON.stringify(despesas));

        toast({
            title: "Despesa Salva!",
            description: "Sua nova despesa foi registrada com sucesso.",
        });
        
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        onSave();
    } catch(e) {
        toast({
            title: "Erro",
            description: "Não foi possível salvar a despesa.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Campanha de Facebook Ads" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="150.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categorias.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
         <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Despesa</FormLabel>
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
       
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">Salvar Despesa</Button>
        </div>
      </form>
    </Form>
  );
}
