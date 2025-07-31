

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Imovel, Negocio, Task } from "@/lib/definitions";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useMemo } from "react";
import { addActivityLog } from "@/lib/activity-log";
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


const formatPrice = (price: number | undefined) => {
  if (price === undefined) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

const ActionsCell = ({ row, onUpdate }: { row: any, onUpdate: () => void }) => {
    const { toast } = useToast();
    const imovel = row.original as Imovel;
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    // This dependency check can be complex on the client side with Firestore.
    // For now, we'll assume a check needs to be done or show a generic warning.
    // A more robust solution involves backend checks (e.g., in a Cloud Function).
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "imoveis", imovel.id));
            
            addActivityLog({ type: 'imovel', description: `Imóvel "${imovel.title}" foi excluído.`});
            
            toast({
                title: "Imóvel Excluído!",
                description: `O imóvel "${imovel.title}" foi removido.`,
            });
            setIsAlertOpen(false);
            onUpdate(); // Trigger data reload
        } catch (error) {
            console.error("Falha ao excluir imóvel:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o imóvel.",
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
                        <Link href={`/gestao-imoveis/${imovel.id}/edit`} className="flex items-center w-full cursor-pointer">
                           <Edit className="mr-2 h-4 w-4" /> Editar Imóvel
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(imovel.id)}>
                        Copiar ID do Imóvel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onSelect={() => setIsAlertOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Imóvel
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o imóvel
                        <span className="font-semibold"> {imovel.title}</span> de seus registros.
                         <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                            Atenção: Negócios ou tarefas associadas a este imóvel não serão excluídos, mas perderão a referência.
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


export const columns = (onUpdate: () => void): ColumnDef<Imovel>[] => [
  {
    accessorKey: "refCode",
    header: "Cód. Ref.",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
     cell: ({ row }) => {
        const title = row.getValue("title") as string;
        const imovel = row.original;
        return <Link href={`/gestao-imoveis/${imovel.id}`} className="truncate max-w-xs hover:underline">{title}</Link>;
    }
  },
  {
    accessorKey: "sellPrice",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Preço
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    cell: ({ row }) => {
      const imovel = row.original;
      const price = imovel.sellPrice || imovel.rentPrice;
      const status = row.original.status;
      const formattedPrice = formatPrice(price)
      return <div className="text-right font-medium">{imovel.rentPrice ? `${formattedPrice}/mês` : formattedPrice}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Ativo"
          ? "secondary"
          : status === "Vendido" || status === "Alugado"
          ? "default"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} onUpdate={onUpdate} />,
  },
];
