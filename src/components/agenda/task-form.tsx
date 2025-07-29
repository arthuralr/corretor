
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, User, ListTodo } from 'lucide-react';
import { useEffect } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Client, Negocio, TaskCategory, TaskPriority } from '@/lib/definitions';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  dueDate: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  description: z.string().optional(),
  clientId: z.string().optional(),
  negocioId: z.string().optional(),
  priority: z.enum(['Baixa', 'Média', 'Alta']).default('Baixa'),
  category: z.enum(['Visita', 'Reunião', 'Ligação', 'Prazo']).default('Prazo'),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSave: (values: TaskFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormValues>;
  clients: Client[];
  negocios: Negocio[];
}

export function TaskForm({ onSave, onCancel, initialData, clients, negocios }: TaskFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      clientId: initialData?.clientId || undefined,
      negocioId: initialData?.negocioId || undefined,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      priority: initialData?.priority || 'Baixa',
      category: initialData?.category || 'Prazo',
    },
  });

  const selectedClientId = form.watch('clientId');
  
  useEffect(() => {
    // Reset form when initialData changes (e.g., when opening the modal for editing)
    form.reset({
      title: initialData?.title || '',
      description: initialData?.description || '',
      clientId: initialData?.clientId || undefined,
      negocioId: initialData?.negocioId || undefined,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      priority: initialData?.priority || 'Baixa',
      category: initialData?.category || 'Prazo',
    });
  }, [initialData, form]);

  useEffect(() => {
    if (selectedClientId) {
      // Find the first proposal for the selected client
      const clientNegocio = negocios.find(n => n.clienteId === selectedClientId && n.etapa === 'Proposta');
      form.setValue('negocioId', clientNegocio?.id);
    } else {
      // If no client is selected, clear the negocioId unless it was part of initial data
       if (!initialData?.negocioId) {
          form.setValue('negocioId', undefined);
      }
    }
  }, [selectedClientId, negocios, form, initialData]);


  function onSubmit(values: TaskFormValues) {
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Follow-up com cliente..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
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
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><ListTodo className="h-4 w-4" /> Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Prazo">Prazo</SelectItem>
                      <SelectItem value="Ligação">Ligação</SelectItem>
                      <SelectItem value="Reunião">Reunião</SelectItem>
                      <SelectItem value="Visita">Visita</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> Associar ao Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Nenhum</SelectItem>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione uma descrição ou notas sobre a tarefa..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Prioridade</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Baixa" id="p-baixa"/>
                    </FormControl>
                    <FormLabel htmlFor="p-baixa" className="font-normal">Baixa</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Média" id="p-media"/>
                    </FormControl>
                    <FormLabel htmlFor="p-media" className="font-normal">Média</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Alta" id="p-alta"/>
                    </FormControl>
                    <FormLabel htmlFor="p-alta" className="font-normal">Alta</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">Salvar Tarefa</Button>
        </div>
      </form>
    </Form>
  );
}
