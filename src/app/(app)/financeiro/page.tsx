
"use client"

import { Landmark, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DespesasTable } from "@/components/financeiro/despesas-table";
import { DespesaForm } from "@/components/financeiro/despesa-form";
import { EntradasTable } from "@/components/financeiro/entradas-table";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EntradaForm } from "@/components/financeiro/entrada-form";

export default function FinanceiroPage() {
    const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);
    const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center gap-2">
                        <Landmark className="h-8 w-8 text-accent" />
                        <h2 className="text-3xl font-bold tracking-tight font-headline">Financeiro</h2>
                    </div>
                </div>
                 <p className="text-muted-foreground">
                    Gerencie suas entradas e despesas para manter a saúde financeira do seu negócio.
                </p>

                <Tabs defaultValue="entradas" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="entradas">Entradas</TabsTrigger>
                        <TabsTrigger value="despesas">Despesas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="entradas" className="space-y-4">
                       <div className="flex justify-end">
                            <Button onClick={() => setIsEntradaModalOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Entrada Manual
                            </Button>
                        </div>
                       <EntradasTable />
                    </TabsContent>
                    <TabsContent value="despesas" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setIsDespesaModalOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Despesa
                            </Button>
                        </div>
                        <DespesasTable />
                    </TabsContent>
                </Tabs>
            </div>
            
            {/* Despesa Modal */}
            <Dialog open={isDespesaModalOpen} onOpenChange={setIsDespesaModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                        <DialogDescription>
                            Registre uma nova despesa para manter seus controles financeiros atualizados.
                        </DialogDescription>
                    </DialogHeader>
                    <DespesaForm onCancel={() => setIsDespesaModalOpen(false)} onSave={() => setIsDespesaModalOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Entrada Modal */}
            <Dialog open={isEntradaModalOpen} onOpenChange={setIsEntradaModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Entrada Manual</DialogTitle>
                        <DialogDescription>
                            Registre uma nova entrada que não veio de um negócio do funil.
                        </DialogDescription>
                    </DialogHeader>
                    <EntradaForm onCancel={() => setIsEntradaModalOpen(false)} onSave={() => setIsEntradaModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
