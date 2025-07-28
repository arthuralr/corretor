

"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Negocio, EtapaFunil, Client, Imovel } from "@/lib/definitions";
import { FunilColumn } from './funil-column';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { addActivityLog } from '@/lib/activity-log';
import { NegocioModal } from '../negocios/negocio-modal';
import { getInitialClients, getInitialImoveis } from '@/lib/initial-data';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'funilBoardData';
const CLIENTS_STORAGE_KEY = 'clientsData';
const IMOVEIS_STORAGE_KEY = 'imoveisData';

interface FunilBoardProps {
  initialData: {
      etapa: EtapaFunil;
      negocios: Negocio[];
  }[];
}


export function FunilBoard({ initialData }: FunilBoardProps) {
    const [isClient, setIsClient] = useState(false);
    const [boardData, setBoardData] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
    const [defaultEtapa, setDefaultEtapa] = useState<EtapaFunil | undefined>(undefined);
    
    const [clients, setClients] = useState<Client[]>([]);
    const [imoveis, setImoveis] = useState<Imovel[]>([]);


    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                setBoardData(JSON.parse(savedData));
            }

            const savedClients = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
            setClients(savedClients ? JSON.parse(savedClients) : getInitialClients());

            const savedImoveis = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
            setImoveis(savedImoveis ? JSON.parse(savedImoveis) : getInitialImoveis());

        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, []);

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

    const updateBoardData = (newData: typeof boardData) => {
        setBoardData(newData);
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
            window.dispatchEvent(new CustomEvent('dataUpdated'));
        } catch (error) {
            console.error("Failed to save data to local storage", error);
        }
    };
    
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

    const handleSaveNegocio = (savedNegocio: Negocio) => {
        let newBoardData = [...boardData];
        const isEditing = !!editingNegocio;

        if (isEditing) {
            // Find and update the deal across all columns
            newBoardData = newBoardData.map(column => ({
                ...column,
                negocios: column.negocios.map(n => n.id === savedNegocio.id ? savedNegocio : n)
            }));
        } else {
            // Add new deal to the correct column
            const columnIndex = newBoardData.findIndex(col => col.etapa === savedNegocio.etapa);
            if (columnIndex !== -1) {
                newBoardData[columnIndex].negocios.push(savedNegocio);
            }
        }
        
        // If the etapa was changed during edit, we might need to move it
        if (isEditing && editingNegocio.etapa !== savedNegocio.etapa) {
             const sourceColumnIndex = newBoardData.findIndex(col => col.etapa === editingNegocio.etapa);
             const destColumnIndex = newBoardData.findIndex(col => col.etapa === savedNegocio.etapa);

             if (sourceColumnIndex !== -1) {
                // Remove from old column
                newBoardData[sourceColumnIndex].negocios = newBoardData[sourceColumnIndex].negocios.filter(n => n.id !== savedNegocio.id);
             }
             if (destColumnIndex !== -1) {
                 // Add to new column (if not already there)
                 if (!newBoardData[destColumnIndex].negocios.some(n => n.id === savedNegocio.id)) {
                    newBoardData[destColumnIndex].negocios.push(savedNegocio);
                 }
             }
        }
        
        updateBoardData(newBoardData);
        setIsModalOpen(false);
        setEditingNegocio(null);
    };

    const handleDeleteNegocio = (negocioId: string, etapa: EtapaFunil) => {
        try {
            const newBoardData = [...boardData];
            const columnIndex = newBoardData.findIndex(col => col.etapa === etapa);
            
            if (columnIndex === -1) {
                throw new Error("Column not found for business deletion.");
            }

            const negocioTitle = newBoardData[columnIndex].negocios.find(n => n.id === negocioId)?.imovelTitulo || 'Negócio';
            
            newBoardData[columnIndex].negocios = newBoardData[columnIndex].negocios.filter(n => n.id !== negocioId);
            updateBoardData(newBoardData);
            
            toast({
                title: "Negócio Excluído!",
                description: `O negócio "${negocioTitle}" foi removido do funil.`,
            });

        } catch (error) {
             toast({
                title: "Erro",
                description: "Não foi possível excluir o negócio.",
                variant: "destructive",
            });
            console.error(error);
        }
    };


  const handlePriorityChange = (negocioId: string) => {
    const newBoardData = boardData.map(column => ({
        ...column,
        negocios: column.negocios.map(negocio => 
            negocio.id === negocioId ? { ...negocio, prioridade: !negocio.prioridade } : negocio
        )
    }));
    updateBoardData(newBoardData);
  }

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Find the original column and deal from the unfiltered boardData
    const sourceColumnIndex = boardData.findIndex(col => col.etapa === source.droppableId);
    const destColumnIndex = boardData.findIndex(col => col.etapa === destination.droppableId);

    if (sourceColumnIndex === -1 || destColumnIndex === -1) {
        console.error("Source or destination column not found");
        return;
    }
    
    // Get the actual deal being moved from the filtered data
    const movedNegocioFiltered = filteredBoardData[sourceColumnIndex].negocios[source.index];

    // Find the source column in the original data and remove the deal
    const newBoardData = [...boardData];
    const sourceColumnOriginal = newBoardData[sourceColumnIndex];
    const sourceNegociosOriginal = Array.from(sourceColumnOriginal.negocios);
    const movedNegocioIndexOriginal = sourceNegociosOriginal.findIndex(n => n.id === movedNegocioFiltered.id);
    
    if (movedNegocioIndexOriginal === -1) return;

    const [movedNegocio] = sourceNegociosOriginal.splice(movedNegocioIndexOriginal, 1);
    
    const updatedMovedNegocio = { ...movedNegocio, etapa: newBoardData[destColumnIndex].etapa };
    
    sourceColumnOriginal.negocios = sourceNegociosOriginal;
    
    // Find the destination column and add the deal
    const destColumnOriginal = newBoardData[destColumnIndex];
    const destNegociosOriginal = Array.from(destColumnOriginal.negocios);

    if (source.droppableId === destination.droppableId) {
        destNegociosOriginal.splice(destination.index, 0, movedNegocio);
    } else {
        destNegociosOriginal.splice(destination.index, 0, updatedMovedNegocio);
        addActivityLog({
            type: 'negocio',
            description: `Negócio "${updatedMovedNegocio.imovelTitulo}" movido para ${destColumnOriginal.etapa}.`,
            link: `/negocios/${updatedMovedNegocio.id}`
        });
    }
    destColumnOriginal.negocios = destNegociosOriginal;

    updateBoardData(newBoardData);
  };
  
  if (!isClient) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-flow-col md:grid-cols-[repeat(7,minmax(300px,1fr))] gap-4 auto-cols-max">
            {initialData.map(col => (
                 <div key={col.etapa} className="flex flex-col rounded-lg bg-muted/50 p-4">
                    <div className="h-6 bg-muted-foreground/20 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-24 bg-card rounded"></div>
                        <div className="h-24 bg-card rounded"></div>
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
                      onDeleteNegocio={handleDeleteNegocio}
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
