

"use client";

import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Client, Negocio, Task, ClientStatus } from "@/lib/definitions";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { addActivityLog } from "@/lib/activity-log";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";

const StatusSelector = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const client = row.original as Client;
    const [status, setStatus] = React.useState(client.status);
    const { toast } = useToast();

    const handleStatusChange = async (newStatus: ClientStatus) => {
        setStatus(newStatus);
        try {
            const clientRef = doc(db, "clients", client.id);
            await updateDoc(clientRef, { status: newStatus });
            onUpdate();
        } catch (error) {
            toast({
                title: "Erro ao atualizar status",
                variant: "destructive",
            });
            console.error("Falha ao atualizar status do cliente:", error);
            setStatus(client.status); // Revert on error
        }
    }

    return (
        <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Futuro">Futuro</SelectItem>
                <SelectItem value="Comprador">Comprador</SelectItem>
                <SelectItem value="Locatário">Locatário</SelectItem>
            </SelectContent>
        </Select>
    );
};


const ActionsCell = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const client = row.original as Client;
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const dependencies = useMemo(() => {
        // This is now harder to check synchronously on the client-side.
        // We will just show a generic warning. A more robust solution
        // would involve checking for dependencies on the backend before deletion.
        return { hasDependencies: true };
    }, []);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "clients", client.id));
            
            addActivityLog({ type: 'cliente', description: `Cliente "${client.name}" foi excluído.` });
            
            // This is a bit of a hack to trigger a re-render on the parent page.
            // A more robust solution might use a state management library or context.
            window.dispatchEvent(new Event('clientDeleted'));

            toast({
                title: "Cliente Excluído!",
                description: `O cliente "${client.name}" foi removido.`,
            });
            setIsAlertOpen(false);
        } catch (error) {
            console.error("Falha ao excluir cliente:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o cliente.",
                variant: "destructive",
            });
        }
    };

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/clients/${client.id}`} className="flex items-center w-full cursor-pointer">
                           <Edit className="mr-2 h-4 w-4" /> Ver/Editar Cliente
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>
                        Copiar ID do Cliente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onSelect={() => setIsAlertOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Cliente
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente
                        <span className="font-semibold"> {client.name}</span> de seus registros.
                        <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                            A exclusão não removerá negócios ou tarefas associadas, mas eles perderão a referência a este cliente.
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


export const columns = (onUpdate: () => void): ColumnDef<Client>[] => [
   {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data Criação
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return "-";
      // Firestore timestamp object needs to be converted to Date
      const date = createdAt.toDate ? createdAt.toDate() : parseISO(createdAt);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
     cell: ({ row }) => {
      const client = row.original;
      return (
        <Link href={`/clients/${client.id}`} className="hover:underline">
          {client.name}
        </Link>
      );
    },
  },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusSelector row={row} onUpdate={onUpdate} />,
  },
   {
    accessorKey: "source",
    header: "Origem",
     cell: ({ row }) => row.original.source ? <Badge variant="outline">{row.original.source}</Badge> : '-',
  },
  {
    accessorKey: "interest",
    header: "Interesse",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ActionsCell
  },
];
