

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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Entrada } from '@/lib/definitions';
import { MaskedInput } from '../ui/masked-input';

const formSchema = z.object({
  origem: z.string().min(1, 'A origem é obrigatória'),
  valor: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  dataRecebimento: z.date({ required_error: 'A data é obrigatória.' }),
});

type EntradaFormValues = z.infer<typeof formSchema>;

interface EntradaFormProps {
  onSave: () => void;
  onCancel: () => void;
  initialData?: Partial<EntradaFormValues>;
}

const ENTRADAS_STORAGE_KEY = 'entradasData';

export function EntradaForm({ onSave, onCancel, initialData }: EntradaFormProps) {
  const { toast } = useToast();
  
  const form = useForm<EntradaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      origem: '',
      valor: 0,
      dataRecebimento: new Date(),
    },
  });

  function onSubmit(values: EntradaFormValues) {
    try {
        const savedEntradas = window.localStorage.getItem(ENTRADAS_STORAGE_KEY);
        const entradas: Entrada[] = savedEntradas ? JSON.parse(savedEntradas) : [];

        const newEntrada: Entrada = {
            id: `ENTRADA-${Date.now()}`,
            origem: values.origem,
            valor: values.valor,
            dataRecebimento: values.dataRecebimento.toISOString(),
        };

        entradas.push(newEntrada);
        window.localStorage.setItem(ENTRADAS_STORAGE_KEY, JSON.stringify(entradas));

        toast({
            title: "Entrada Salva!",
            description: "Sua nova entrada foi registrada com sucesso.",
        });
        
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        onSave();
    } catch(e) {
        toast({
            title: "Erro",
            description: "Não foi possível salvar a entrada.",
            variant: "destructive"
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="origem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origem da Entrada</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aluguel de imóvel, Consultoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <MaskedInput
                        mask="R$ num"
                        blocks={{
                            num: {
                            mask: Number,
                            thousandsSeparator: '.',
                            radix: ',',
                            scale: 2,
                            padFractionalZeros: true,
                            min: 0,
                            max: 999999999,
                            }
                        }}
                        unmaskedValue={String(field.value)}
                        onAccept={(value: any) => field.onChange(value)}
                        placeholder="R$ 1.000,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="dataRecebimento"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Data de Recebimento</FormLabel>
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
        </div>
       
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">Salvar Entrada</Button>
        </div>
      </form>
    </Form>
  );
}

    

    