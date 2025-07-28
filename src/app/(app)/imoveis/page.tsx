"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/imoveis/columns";
import { DataTable } from "@/components/data-table";
import type { Imovel } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";

const IMOVEIS_STORAGE_KEY = 'imoveisData';

const getInitialImoveis = (): Imovel[] => {
  return [
    {
      id: "IMOVEL-1",
      refCode: "CA001",
      title: "Casa Espaçosa com Piscina",
      description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina.",
      type: "Casa",
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      status: "Disponível",
      imageUrl: "https://placehold.co/600x400.png",
      createdAt: new Date().toISOString()
    },
    {
      id: "IMOVEL-2",
      refCode: "AP002",
      title: "Apartamento Moderno no Centro",
      description: "Apartamento de 2 quartos totalmente reformado no coração da cidade.",
      type: "Apartamento",
      price: 450000,
      bedrooms: 2,
      bathrooms: 1,
      status: "Vendido",
       imageUrl: "https://placehold.co/600x400.png",
      createdAt: new Date().toISOString()
    },
    {
      id: "IMOVEL-3",
      refCode: "TE003",
      title: "Terreno Plano em Condomínio",
      description: "Excelente terreno para construir a casa dos seus sonhos em condomínio fechado.",
      type: "Terreno",
      price: 200000,
      bedrooms: 0,
      bathrooms: 0,
      status: "Disponível",
      createdAt: new Date().toISOString()
    },
     {
      id: "IMOVEL-4",
      refCode: "AP004",
      title: "Apartamento para Alugar",
      description: "Apartamento com 1 quarto, mobiliado, pronto para morar.",
      type: "Apartamento",
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      status: "Alugado",
      createdAt: new Date().toISOString()
    },
  ];
};

export default function ImoveisPage() {
  const [data, setData] = useState<Imovel[]>([]);

  const loadImoveis = useCallback(() => {
    try {
      const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        const initialData = getInitialImoveis();
        setData(initialData);
        window.localStorage.setItem(IMOVEIS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
        console.error("Falha ao carregar dados de imóveis, usando dados iniciais.", error);
        const initialData = getInitialImoveis();
        setData(initialData);
    }
  }, []);

  useEffect(() => {
    loadImoveis();
    
    const handleDataUpdate = () => {
        loadImoveis();
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [loadImoveis]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Imóveis</h2>
        <Link href="/imoveis/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imóvel
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} filterColumnId="title" filterPlaceholder="Filtrar por título..." />
    </div>
  );
}
