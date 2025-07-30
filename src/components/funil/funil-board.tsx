
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Negocio, EtapaFunil, Client, Imovel, Entrada } from "@/lib/definitions";
import { FunilColumn } from './funil-column';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { addActivityLog } from '@/lib/activity-log';
import { NegocioModal } from '../negocios/negocio-modal';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, writeBatch, query, orderBy } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

const ENTRADAS_STORAGE_KEY = 'entradasData';

const etapas: EtapaFunil[] = [
  'Contato', 
  'Atendimento', 
  'Visita', 
  'Proposta', 
  'Reserva', 
  'Fechado - Ganho', 
  'Fechado - Perdido'
];

export function FunilBoard() {
    const [loading, setLoading] = useState(true);
    const [boardData, setBoardData] = useState<{etapa: EtapaFunil; negocios: Negocio[]}[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
    const [defaultEtapa, setDefaultEtapa] = useState<EtapaFunil | undefined>(undefined);
    
    const [clients, setClients] = useState<Client[]>([]);
    const [imoveis, setImoveis] = useState<Imovel[]>([]);
    
    const loadBoardData = useCallback(async () => {
        setLoading(true);
        try {
            const negociosSnapshot = await getDocs(query(collection(db, "negocios"), orderBy("dataCriacao", "desc")));
            const allNegocios = negociosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Negocio));
            
            const groupedByEtapa = etapas.map(etapa => ({
                etapa,
                negocios: allNegocios.filter(n => n.etapa === etapa)
            }));
            
            setBoardData(groupedByEtapa);

        } catch (error) {
            console.error("Failed to load data from Firestore", error);
            toast({ title: "Erro ao Carregar Funil", description: "Não foi possível carregar os dados do funil.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    const loadModalDependencies = useCallback(async () => {
        try {
            const clientsSnapshot = await getDocs(collection(db, "clients"));
            setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

            const imoveisSnapshot = await getDocs(collection(db, "imoveis"));
            setImoveis(imoveisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel)));
        } catch(e) {
            console.error("Failed to load clients/imoveis for modal", e)
        }
    }, []);


    useEffect(() => {
        loadBoardData();
        loadModalDependencies();
        
        window.addEventListener('dataUpdated', loadBoardData);
        return () => window.removeEventListener('dataUpdated', loadBoardData);
    }, [loadBoardData, loadModalDependencies]);

    const filteredBoardData = useMemo(() => {
        if (!searchQuery) {
            return boardData;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return boardData.map(column => ({
            ...column,
            negocios: column.negocios.filter(negocio => 
                negocio.clienteNome.toLowerCase().includes(lowercasedQuery) || 
                negocio.imovelTitulo.toLowerCase().includes(lowercasedQuery)
            )
        }));
    }, [boardData, searchQuery]);

    const handleOpenAddModal = (etapa: EtapaFunil) => {
        setEditingNegocio(null);
        setDefaultEtapa(etapa);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (negocio: Negocio) => {
        setEditingNegocio(negocio);
        setDefaultEtapa(undefined);
        setIsModalOpen(true);
    };

    const handleSaveNegocio = async (savedNegocio: Negocio) => {
        const batch = writeBatch(db);
        const isEditing = !!editingNegocio;
        const etapaAnterior = editingNegocio?.etapa;

        const negocioRef = doc(db, "negocios", savedNegocio.id);
        batch.set(negocioRef, savedNegocio, { merge: true });
        
        try {
             await batch.commit();

            if (savedNegocio.etapa === 'Fechado - Ganho' && etapaAnterior !== 'Fechado - Ganho') {
                createEntradaFromNegocio(savedNegocio);
            }
            
            setIsModalOpen(false);
            setEditingNegocio(null);
            loadBoardData(); // Reload data to reflect changes
            window.dispatchEvent(new CustomEvent('dataUpdated')); // Notify other components
        } catch (error) {
            console.error("Error saving negocio:", error);
            toast({ title: "Erro ao Salvar", description: "Não foi possível salvar o negócio.", variant: "destructive" });
        }
    };

    const handleDeleteNegocio = async (negocioId: string) => {
        try {
            const batch = writeBatch(db);
            const negocioRef = doc(db, "negocios", negocioId);
            batch.delete(negocioRef);
            await batch.commit();
            
            const negocioTitle = boardData.flatMap(c => c.negocios).find(n => n.id === negocioId)?.imovelTitulo || 'Negócio';
            toast({ title: "Negócio Excluído!", description: `O negócio "${negocioTitle}" foi removido do funil.` });
            loadBoardData();
        } catch (error) {
             toast({ title: "Erro", description: "Não foi possível excluir o negócio.", variant: "destructive" });
             console.error(error);
        }
    };

    const handlePriorityChange = async (negocioId: string) => {
        try {
            const batch = writeBatch(db);
            const negocioRef = doc(db, "negocios", negocioId);
            const negocio = boardData.flatMap(c => c.negocios).find(n => n.id === negocioId);
            if (negocio) {
                batch.update(negocioRef, { prioridade: !negocio.prioridade });
                await batch.commit();
                loadBoardData();
            }
        } catch(error) {
            console.error("Error updating priority", error)
        }
    }

    const createEntradaFromNegocio = (negocio: Negocio) => {
     try {
        const savedEntradas = window.localStorage.getItem(ENTRADAS_STORAGE_KEY);
        const entradas: Entrada[] = savedEntradas ? JSON.parse(savedEntradas) : [];

        if (entradas.some(e => e.id === `ENTRADA-${negocio.id}`)) {
            return;
        }
        
        const comissao = (negocio.valorProposta * (negocio.taxaComissao || 0)) / 100;

        if (comissao <= 0) return;

        const newEntrada: Entrada = {
            id: `ENTRADA-${negocio.id}`,
            origem: `Comissão Venda - ${negocio.imovelTitulo}`,
            valor: comissao,
            dataRecebimento: new Date().toISOString(),
        };

        entradas.push(newEntrada);
        window.localStorage.setItem(ENTRADAS_STORAGE_KEY, JSON.stringify(entradas));
        
        toast({
          title: "Entrada Registrada!",
          description: `Uma nova entrada de comissão de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(comissao)} foi registrada.`,
        });

     } catch(e) {
        console.error("Falha ao criar entrada a partir do negócio", e);
     }
    }

    const onDragEnd: OnDragEndResponder = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const movedNegocio = boardData.find(c => c.etapa === source.droppableId)?.negocios.find(n => n.id === draggableId);
        
        if (!movedNegocio) return;

        const etapaAnterior = source.droppableId as EtapaFunil;
        const novaEtapa = destination.droppableId as EtapaFunil;
        const updatedMovedNegocio = { ...movedNegocio, etapa: novaEtapa };

        // Optimistic UI update
        const newBoardData = [...boardData];
        const sourceCol = newBoardData.find(c => c.etapa === etapaAnterior);
        const destCol = newBoardData.find(c => c.etapa === novaEtapa);

        if (sourceCol && destCol) {
            sourceCol.negocios = sourceCol.negocios.filter(n => n.id !== draggableId);
            destCol.negocios.splice(destination.index, 0, updatedMovedNegocio);
            setBoardData(newBoardData);
        }

        try {
            const batch = writeBatch(db);
            const negocioRef = doc(db, "negocios", draggableId);
            batch.update(negocioRef, { etapa: novaEtapa });
            await batch.commit();

            addActivityLog({
                type: 'negocio',
                description: `Negócio "${updatedMovedNegocio.imovelTitulo}" movido para ${novaEtapa}.`,
                link: `/negocios/${updatedMovedNegocio.id}`
            });

            if (novaEtapa === 'Fechado - Ganho' && etapaAnterior !== 'Fechado - Ganho') {
                createEntradaFromNegocio(updatedMovedNegocio);
            }
            // No need to reload here as UI is updated optimistically
        } catch (error) {
            console.error("Failed to update deal on drag-end:", error);
            toast({ title: "Erro ao Mover", description: "Não foi possível mover o negócio.", variant: "destructive" });
            // Revert optimistic update on error
            loadBoardData();
        }
    };
  
    if (loading) {
        return (
             <div className="grid grid-flow-col auto-cols-[300px] md:auto-cols-[minmax(300px,1fr)] gap-4">
                {etapas.map(etapa => (
                     <div key={etapa} className="flex flex-col rounded-lg bg-muted/50 p-4">
                        <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <Input 
                placeholder="Buscar por cliente ou imóvel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
                />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-flow-col auto-cols-[300px] md:auto-cols-[minmax(300px,1fr)] gap-4">
                    {filteredBoardData.map((coluna) => (
                        <FunilColumn 
                            key={coluna.etapa} 
                            etapa={coluna.etapa} 
                            negocios={coluna.negocios} 
                            onPriorityChange={handlePriorityChange}
                            onAddNegocio={handleOpenAddModal}
                            onEditNegocio={handleOpenEditModal}
                            onDeleteNegocio={(negocioId) => handleDeleteNegocio(negocioId)}
                        />
                    ))}
                </div>
            </DragDropContext>
            <NegocioModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSave={handleSaveNegocio}
                negocio={editingNegocio}
                defaultEtapa={defaultEtapa}
                clients={clients}
                imoveis={imoveis}
            />
        </>
    );
}
