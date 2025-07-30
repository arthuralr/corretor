
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Lead } from "@/lib/definitions";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";


const LEADS_STORAGE_KEY = 'leadsData';

const StatusSelector = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const lead = row.original as Lead;
    const [status, setStatus] = React.useState(lead.status);

    const handleStatusChange = (newStatus: Lead['status']) => {
        setStatus(newStatus);
        try {
            const savedData = window.localStorage.getItem(LEADS_STORAGE_KEY);
            if (!savedData) return;
            let leads: Lead[] = JSON.parse(savedData);
            leads = leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
            onUpdate();
        } catch (error) {
            console.error("Falha ao atualizar status do lead:", error);
        }
    }

    return (
        <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Em Contato">Em Contato</SelectItem>
                <SelectItem value="Convertido">Convertido</SelectItem>
                <SelectItem value="Perdido">Perdido</SelectItem>
            </SelectContent>
        </Select>
    );
};

const ActionsCell = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const { toast } = useToast();
    const lead = row.original as Lead;

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem(LEADS_STORAGE_KEY);
            if (!savedData) return;
            let leads: Lead[] = JSON.parse(savedData);
            leads = leads.filter(l => l.id !== lead.id);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
            
            toast({
                title: "Lead Excluído!",
                description: `O lead de "${lead.name}" foi removido.`,
                variant: 'destructive',
            });
            onUpdate();
        } catch (error) {
            console.error("Falha ao excluir lead:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o lead.",
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lead.email)}>
                    Copiar Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    onSelect={handleDelete}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Lead
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns = (onUpdate: () => void): ColumnDef<Lead>[] => [
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => format(parseISO(row.getValue('createdAt')), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Telefone",
    },
    {
        accessorKey: "source",
        header: "Origem",
        cell: ({ row }) => <Badge variant="outline">{row.getValue('source')}</Badge>,
    },
     {
        accessorKey: "interest",
        header: "Interesse",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusSelector row={row} onUpdate={onUpdate} />,
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} onUpdate={onUpdate} />,
    },
];
