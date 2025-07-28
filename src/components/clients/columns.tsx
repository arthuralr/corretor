
"use client";

import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Client, Negocio, Task } from "@/lib/definitions";
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

const ActionsCell = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const client = row.original as Client;
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const dependencies = useMemo(() => {
        if (typeof window === 'undefined') return { associatedDeals: 0, associatedTasks: 0 };
        
        const savedDeals = window.localStorage.getItem('funilBoardData');
        const allDeals: Negocio[] = savedDeals ? JSON.parse(savedDeals).flatMap((c: any) => c.negocios) : [];
        const associatedDeals = allDeals.filter(d => d.clienteId === client.id).length;

        const savedTasks = window.localStorage.getItem('tasksData');
        const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
        const associatedTasks = allTasks.filter(t => t.clientId === client.id).length;

        return { associatedDeals, associatedTasks };
    }, [client.id]);

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem('clientsData');
            if (!savedData) return;
            let clients: Client[] = JSON.parse(savedData);
            clients = clients.filter(c => c.id !== client.id);
            window.localStorage.setItem('clientsData', JSON.stringify(clients));
            
            addActivityLog({ type: 'cliente', description: `Cliente "${client.name}" foi excluído.` });
            window.dispatchEvent(new CustomEvent('dataUpdated'));

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
                        {(dependencies.associatedDeals > 0 || dependencies.associatedTasks > 0) && (
                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                                <p className="font-bold">Atenção!</p>
                                <ul className="list-disc pl-5">
                                    {dependencies.associatedDeals > 0 && <li>Este cliente tem {dependencies.associatedDeals} negócio(s) associado(s).</li>}
                                    {dependencies.associatedTasks > 0 && <li>Este cliente tem {dependencies.associatedTasks} tarefa(s) associada(s).</li>}
                                </ul>
                                <p className="mt-1">A exclusão não removerá os negócios ou tarefas, mas eles perderão a referência a este cliente.</p>
                            </div>
                        )}
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


export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Completo
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
    accessorKey: "email",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        );
      },
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    id: "actions",
    cell: ActionsCell
  },
];
