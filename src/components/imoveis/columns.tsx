"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Imovel } from "@/lib/definitions";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const formatPrice = (price: number, status: Imovel['status']) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
  
  return status === 'Alugado' ? `${formattedPrice}/mês` : formattedPrice;
}

const ActionsCell = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const imovel = row.original as Imovel;

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem('imoveisData');
            if (!savedData) return;
            let imoveis: Imovel[] = JSON.parse(savedData);
            imoveis = imoveis.filter(i => i.id !== imovel.id);
            window.localStorage.setItem('imoveisData', JSON.stringify(imoveis));
            
            // Notify other parts of the app
            window.dispatchEvent(new CustomEvent('dataUpdated'));

            toast({
                title: "Imóvel Excluído!",
                description: `O imóvel "${imovel.title}" foi removido.`,
            });
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
        <AlertDialog>
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
                        <Link href={`/imoveis/${imovel.id}/edit`} className="flex items-center w-full">
                           <Edit className="mr-2 h-4 w-4" /> Editar Imóvel
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(imovel.id)}>
                        Copiar ID do Imóvel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir Imóvel
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o imóvel
                        <span className="font-semibold"> {imovel.title}</span> de seus registros.
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


export const columns: ColumnDef<Imovel>[] = [
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
        return <Link href={`/imoveis/${imovel.id}`} className="truncate max-w-xs hover:underline">{title}</Link>;
    }
  },
  {
    accessorKey: "price",
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
      const price = parseFloat(row.getValue("price"));
      const status = row.original.status;
      return <div className="text-right font-medium">{formatPrice(price, status)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Disponível"
          ? "secondary"
          : status === "Vendido" || status === "Alugado"
          ? "default"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
];
