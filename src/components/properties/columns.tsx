"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Property } from "@/lib/definitions";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

const formatPrice = (price: number, status: Property['status']) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
  
  return status === 'Para Alugar' ? `${formattedPrice}/mês` : formattedPrice;
}

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Endereço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
        status === "À Venda" || status === "Para Alugar"
          ? "secondary"
          : status === "Vendido" || status === "Alugado"
          ? "default"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "bedrooms",
    header: "Quartos",
    cell: ({ row }) => `${row.getValue("bedrooms")} quartos`,
  },
  {
    accessorKey: "bathrooms",
    header: "Banheiros",
    cell: ({ row }) => `${row.getValue("bathrooms")} banheiros`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(property.id)}
            >
              Copiar ID do Imóvel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar Imóvel</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Excluir Imóvel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
