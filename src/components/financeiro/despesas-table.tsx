
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ColumnDef } from "@tanstack/react-table";
import type { Despesa } from "@/lib/definitions";
import { DataTable } from "@/components/data-table";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DESPESAS_STORAGE_KEY = 'despesasData';

const getInitialDespesas = (): Despesa[] => {
    return [
        { id: "DESPESA-1", description: "Anúncio Revista Imobiliária", value: 350.00, date: new Date().toISOString(), category: "Marketing" },
        { id: "DESPESA-2", description: "Aluguel do Escritório", value: 1200.00, date: new Date().toISOString(), category: "Aluguel" },
    ]
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
};

const ActionsCell = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const { toast } = useToast();
    const despesa = row.original as Despesa;

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem(DESPESAS_STORAGE_KEY);
            if (!savedData) return;
            let despesas: Despesa[] = JSON.parse(savedData);
            despesas = despesas.filter(d => d.id !== despesa.id);
            window.localStorage.setItem(DESPESAS_STORAGE_KEY, JSON.stringify(despesas));
            
            toast({
                title: "Despesa Excluída!",
                description: `O registro "${despesa.description}" foi removido.`,
                variant: 'destructive'
            });
            onUpdate();
        } catch (error) {
            console.error("Falha ao excluir despesa:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir a despesa.",
                variant: "destructive",
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    onSelect={handleDelete}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export function DespesasTable() {
    const [data, setData] = useState<Despesa[]>([]);

    const loadDespesas = useCallback(() => {
        try {
            const savedData = window.localStorage.getItem(DESPESAS_STORAGE_KEY);
            if (savedData) {
                setData(JSON.parse(savedData));
            } else {
                const initialData = getInitialDespesas();
                setData(initialData);
                window.localStorage.setItem(DESPESAS_STORAGE_KEY, JSON.stringify(initialData));
            }
        } catch (error) {
            console.error("Falha ao carregar despesas.", error);
            setData(getInitialDespesas());
        }
    }, []);

    useEffect(() => {
        loadDespesas();
        window.addEventListener('dataUpdated', loadDespesas);
        return () => window.removeEventListener('dataUpdated', loadDespesas);
    }, [loadDespesas]);
    
    const columns: ColumnDef<Despesa>[] = useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Data',
            cell: ({ row }) => format(parseISO(row.getValue('date')), "dd/MM/yyyy", { locale: ptBR }),
        },
        {
            accessorKey: 'description',
            header: 'Descrição',
        },
        {
            accessorKey: 'category',
            header: 'Categoria',
            cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
        },
        {
            accessorKey: 'value',
            header: () => <div className="text-right">Valor</div>,
            cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.getValue('value'))}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => <ActionsCell row={row} onUpdate={loadDespesas} />,
        }
    ], [loadDespesas]);


    return (
         <DataTable columns={columns} data={data} filterColumnId="description" filterPlaceholder="Filtrar por descrição..." />
    )
}
