
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Entrada, Despesa } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const ENTRADAS_STORAGE_KEY = 'entradasData';
const DESPESAS_STORAGE_KEY = 'despesasData';

type Transaction = {
    type: 'entrada' | 'despesa';
    id: string;
    date: string;
    description: string;
    value: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
};

export function ExtratoTimeline() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(() => {
        setLoading(true);
        try {
            const savedEntradas = window.localStorage.getItem(ENTRADAS_STORAGE_KEY);
            const entradas: Entrada[] = savedEntradas ? JSON.parse(savedEntradas) : [];

            const savedDespesas = window.localStorage.getItem(DESPESAS_STORAGE_KEY);
            const despesas: Despesa[] = savedDespesas ? JSON.parse(savedDespesas) : [];

            const combined: Transaction[] = [];

            entradas.forEach(e => combined.push({
                type: 'entrada',
                id: e.id,
                date: e.dataRecebimento,
                description: e.origem,
                value: e.valor
            }));

            despesas.forEach(d => combined.push({
                type: 'despesa',
                id: d.id,
                date: d.date,
                description: d.description,
                value: d.value
            }));

            combined.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
            
            setTransactions(combined);

            const totalEntradas = entradas.reduce((sum, e) => sum + e.valor, 0);
            const totalDespesas = despesas.reduce((sum, d) => sum + d.value, 0);
            setBalance(totalEntradas - totalDespesas);

        } catch (error) {
            console.error("Falha ao carregar dados financeiros", error);
            setTransactions([]);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        window.addEventListener('dataUpdated', loadData);
        return () => window.removeEventListener('dataUpdated', loadData);
    }, [loadData]);
    
    if (loading) {
        return <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-32 w-full" />
            </CardContent>
        </Card>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Extrato de Movimentações</CardTitle>
                <div className="flex items-baseline gap-2 pt-2">
                    <CardDescription>Balanço Total:</CardDescription>
                    <p className={cn(
                        "text-2xl font-bold",
                        balance >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {transactions.length > 0 ? (
                        transactions.map(item => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className="flex-shrink-0 pt-1">
                                    {item.type === 'entrada' ? (
                                        <ArrowUpCircle className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <ArrowDownCircle className="h-6 w-6 text-red-500" />
                                    )}
                                </div>
                                <div className="flex-grow flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(parseISO(item.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <p className={cn(
                                        "font-semibold text-lg",
                                        item.type === 'entrada' ? "text-green-600" : "text-red-600"
                                    )}>
                                        {item.type === 'despesa' && '-'}
                                        {formatCurrency(item.value)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            Nenhuma movimentação registrada.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
