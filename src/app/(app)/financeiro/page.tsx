
"use client"

import { Landmark, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DespesasTable } from "@/components/financeiro/despesas-table";
import { DespesaForm } from "@/components/financeiro/despesa-form";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function FinanceiroPage() {
    const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsDespesaModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDespesaModalOpen(false);
    };

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

                <Tabs defaultValue="despesas" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="entradas">Entradas</TabsTrigger>
                        <TabsTrigger value="despesas">Despesas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="entradas" className="space-y-4">
                        <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground">
                           <p>A seção de entradas será construída no próximo passo.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="despesas" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={handleOpenModal}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Despesa
                            </Button>
                        </div>
                        <DespesasTable />
                    </TabsContent>
                </Tabs>
            </div>
            <Dialog open={isDespesaModalOpen} onOpenChange={setIsDespesaModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                        <DialogDescription>
                            Registre uma nova despesa para manter seus controles financeiros atualizados.
                        </DialogDescription>
                    </DialogHeader>
                    <DespesaForm onCancel={handleCloseModal} onSave={handleCloseModal} />
                </DialogContent>
            </Dialog>
        </>
    )
}
