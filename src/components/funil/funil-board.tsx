
"use client";

import { useState, useEffect } from 'react';
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { FunilColumn } from './funil-column';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';

interface FunilBoardProps {
  initialData: {
    etapa: EtapaFunil;
    negocios: Negocio[];
  }[];
}

const LOCAL_STORAGE_KEY = 'funilBoardData';

export function FunilBoard({ initialData }: FunilBoardProps) {
    const [isClient, setIsClient] = useState(false);
    const [boardData, setBoardData] = useState(initialData);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                setBoardData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, []);

    const updateBoardData = (newData: typeof boardData) => {
        setBoardData(newData);
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
            // Dispatch a custom event to notify other components (like Dashboard) of the change
            window.dispatchEvent(new CustomEvent('funilBoardUpdated'));
        } catch (error) {
            console.error("Failed to save data to local storage", error);
        }
    };

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
    
    // Update the etapa of the moved negocio to the destination column's etapa
    const updatedMovedNegocio = { ...movedNegocio, etapa: destColumn.etapa };
    
    const newBoardData = [...boardData];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const newNegocios = sourceNegocios;
      newNegocios.splice(destination.index, 0, movedNegocio); // No need to update etapa here
      
      const newColumn = {
        ...sourceColumn,
        negocios: newNegocios
      };

      newBoardData[sourceColumnIndex] = newColumn;
      updateBoardData(newBoardData);
    } else {
      // Moving to a different column
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
    }
  };
  
  if (!isClient) {
    // You can return a loading spinner or a skeleton loader here
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
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-flow-col md:grid-cols-[repeat(7,minmax(300px,1fr))] gap-4 auto-cols-max overflow-x-auto pb-4">
            {boardData.map((coluna) => (
                <FunilColumn key={coluna.etapa} etapa={coluna.etapa} negocios={coluna.negocios} />
            ))}
        </div>
    </DragDropContext>
  );
}

    