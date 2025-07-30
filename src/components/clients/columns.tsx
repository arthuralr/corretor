

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
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ActionsCell
  },
];
