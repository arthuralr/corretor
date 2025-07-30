
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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l-1.879 6.901 6.946-1.833z" />
  </svg>
);


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
        accessorKey: "birthDate",
        header: "Data de Aniversário",
        cell: ({ row }) => {
            const birthDate = row.getValue("birthDate") as string;
            if (!birthDate) return "-";
            return format(parseISO(birthDate), "dd/MM/yyyy", { locale: ptBR });
        }
      },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Telefone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string;
            const cleanedPhone = phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanedPhone}`;

            return (
            <div>
                <span>{phone}</span>
                <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1.5 text-xs text-green-600 hover:underline"
                >
                <WhatsAppIcon className="h-3 w-3" />
                Chamar no WhatsApp
                </a>
            </div>
            );
        },
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
