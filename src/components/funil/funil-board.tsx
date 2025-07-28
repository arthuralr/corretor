
"use client";

import { useState, useEffect } from 'react';
import type { Negocio, EtapaFunil, Client, Imovel } from "@/lib/definitions";
import { FunilColumn } from './funil-column';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { addActivityLog } from '@/lib/activity-log';
import { NegocioModal } from '../negocios/negocio-modal';
import { getInitialClients, getInitialImoveis } from '@/lib/initial-data';

const LOCAL_STORAGE_KEY = 'funilBoardData';
const CLIENTS_STORAGE_KEY = 'clientsData';
const IMOVEIS_STORAGE_KEY = 'imoveisData';

export function FunilBoard({ initialData }: FunilBoardProps) {
    const [isClient, setIsClient] = useState(false);
    const [boardData, setBoardData] = useState(initialData);

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

    const sourceColumnIndex = boardData.findIndex(col => col.etapa === source.droppableId);
    const destColumnIndex = boardData.findIndex(col => col.etapa === destination.droppableId);

    if (sourceColumnIndex === -1 || destColumnIndex === -1) {
        console.error("Source or destination column not found");
        return;
    }

    const sourceColumn = boardData[sourceColumnIndex];
    const destColumn = boardData[destColumnIndex];
    
    const sourceNegocios = Array.from(sourceColumn.negocios);
    const [movedNegocio] = sourceNegocios.splice(source.index, 1);
    
    const updatedMovedNegocio = { ...movedNegocio, etapa: destColumn.etapa };
    
    const newBoardData = [...boardData];

    if (source.droppableId === destination.droppableId) {
      const newNegocios = sourceNegocios;
      newNegocios.splice(destination.index, 0, movedNegocio); 
      
      const newColumn = {
        ...sourceColumn,
        negocios: newNegocios
      };

      newBoardData[sourceColumnIndex] = newColumn;
      updateBoardData(newBoardData);
    } else {
      const destNegocios = Array.from(destColumn.negocios);
      destNegocios.splice(destination.index, 0, updatedMovedNegocio);
      
      const newSourceColumn = {
        ...sourceColumn,
        negocios: sourceNegocios
      };
      const newDestColumn = {
        ...destColumn,
        negocios: destNegocios
      };
      
      newBoardData[sourceColumnIndex] = newSourceColumn;
      newBoardData[destColumnIndex] = newDestColumn;
      updateBoardData(newBoardData);

       addActivityLog({
        type: 'negocio',
        description: `Negócio "${updatedMovedNegocio.imovelTitulo}" movido para ${destColumn.etapa}.`,
        link: `/negocios/${updatedMovedNegocio.id}`
      });
    }
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
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-flow-col md:grid-cols-[repeat(7,minmax(300px,1fr))] gap-4 auto-cols-max overflow-x-auto pb-4">
            {boardData.map((coluna) => (
                <FunilColumn 
                    key={coluna.etapa} 
                    etapa={coluna.etapa} 
                    negocios={coluna.negocios} 
                    onPriorityChange={handlePriorityChange}
                    onAddNegocio={handleOpenAddModal}
                    onEditNegocio={handleOpenEditModal}
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
