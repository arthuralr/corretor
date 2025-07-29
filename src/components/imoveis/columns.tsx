

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


const formatPrice = (price: number | undefined, status: Imovel['status']) => {
  if (price === undefined) return "-";
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
  
  return status === 'Alugado' ? `${formattedPrice}/mês` : formattedPrice;
}

const ActionsCell = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const imovel = row.original as Imovel;
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const dependencies = useMemo(() => {
      if (typeof window === 'undefined') return { associatedDeals: 0, associatedTasks: 0 };
      
      const savedDeals = window.localStorage.getItem('funilBoardData');
      const allDeals: Negocio[] = savedDeals ? JSON.parse(savedDeals).flatMap((c: any) => c.negocios) : [];
      const associatedDeals = allDeals.filter(d => d.imovelId === imovel.id).length;

      const savedTasks = window.localStorage.getItem('tasksData');
      const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
      const associatedTasks = allTasks.filter(t => t.imovelId === imovel.id).length;

      return { associatedDeals, associatedTasks };
    }, [imovel.id]);

    const handleDelete = () => {
        try {
            const savedData = window.localStorage.getItem('imoveisData');
            if (!savedData) return;
            let imoveis: Imovel[] = JSON.parse(savedData);
            imoveis = imoveis.filter(i => i.id !== imovel.id);
            window.localStorage.setItem('imoveisData', JSON.stringify(imoveis));
            
            addActivityLog({ type: 'imovel', description: `Imóvel "${imovel.title}" foi excluído.`});
            window.dispatchEvent(new CustomEvent('dataUpdated'));

            toast({
                title: "Imóvel Excluído!",
                description: `O imóvel "${imovel.title}" foi removido.`,
            });
            setIsAlertOpen(false);
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
                        <Link href={`/imoveis/${imovel.id}/edit`} className="flex items-center w-full cursor-pointer">
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
                         {(dependencies.associatedDeals > 0 || dependencies.associatedTasks > 0) && (
                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                                <p className="font-bold">Atenção!</p>
                                <ul className="list-disc pl-5">
                                    {dependencies.associatedDeals > 0 && <li>Este imóvel está em {dependencies.associatedDeals} negócio(s).</li>}
                                    {dependencies.associatedTasks > 0 && <li>Este imóvel tem {dependencies.associatedTasks} tarefa(s) associada(s).</li>}
                                </ul>
                                <p className="mt-1">A exclusão não removerá os negócios ou tarefas, mas eles perderão a referência a este imóvel.</p>
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
      return <div className="text-right font-medium">{formatPrice(price, status)}</div>;
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
    cell: ActionsCell,
  },
];
