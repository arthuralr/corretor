
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ColumnDef } from "@tanstack/react-table";
import type { Entrada } from "@/lib/definitions";
import { DataTable } from "@/components/data-table";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

const ENTRADAS_STORAGE_KEY = 'entradasData';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
};

const ActionsCell = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const { toast } = useToast();
    const entrada = row.original as Entrada;

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem(ENTRADAS_STORAGE_KEY);
            if (!savedData) return;
            let entradas: Entrada[] = JSON.parse(savedData);
            entradas = entradas.filter(d => d.id !== entrada.id);
            window.localStorage.setItem(ENTRADAS_STORAGE_KEY, JSON.stringify(entradas));
            
            toast({
                title: "Entrada Excluída!",
                description: `O registro "${entrada.origem}" foi removido.`,
                variant: 'destructive'
            });
            onUpdate();
        } catch (error) {
            console.error("Falha ao excluir entrada:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir a entrada.",
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

export function EntradasTable() {
    const [data, setData] = useState<Entrada[]>([]);

    const loadEntradas = useCallback(() => {
        try {
            const savedData = window.localStorage.getItem(ENTRADAS_STORAGE_KEY);
            if (savedData) {
                setData(JSON.parse(savedData));
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Falha ao carregar entradas.", error);
            setData([]);
        }
    }, []);

    useEffect(() => {
        loadEntradas();
        window.addEventListener('dataUpdated', loadEntradas);
        return () => window.removeEventListener('dataUpdated', loadEntradas);
    }, [loadEntradas]);
    
    const columns: ColumnDef<Entrada>[] = useMemo(() => [
        {
            accessorKey: 'dataRecebimento',
            header: 'Data',
            cell: ({ row }) => format(parseISO(row.getValue('dataRecebimento')), "dd/MM/yyyy", { locale: ptBR }),
        },
        {
            accessorKey: 'origem',
            header: 'Origem',
        },
        {
            accessorKey: 'valor',
            header: () => <div className="text-right">Valor</div>,
            cell: ({ row }) => <div className="text-right font-medium text-green-600">{formatCurrency(row.getValue('valor'))}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => <ActionsCell row={row} onUpdate={loadEntradas} />,
        }
    ], [loadEntradas]);


    return (
         <DataTable columns={columns} data={data} filterColumnId="origem" filterPlaceholder="Filtrar por origem..." />
    )
}
