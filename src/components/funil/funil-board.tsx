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

export function FunilBoard({ initialData }: FunilBoardProps) {
    const [isClient, setIsClient] = useState(false);
    const [boardData, setBoardData] = useState(initialData);

    useEffect(() => {
        setIsClient(true);
    }, []);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumnIndex = boardData.findIndex(col => col.etapa === source.droppableId);
    const destColumnIndex = boardData.findIndex(col => col.etapa === destination.droppableId);

    const sourceColumn = boardData[sourceColumnIndex];
    const destColumn = boardData[destColumnIndex];
    
    const sourceNegocios = Array.from(sourceColumn.negocios);
    const [movedNegocio] = sourceNegocios.splice(source.index, 1);
    
    const newBoardData = [...boardData];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const newNegocios = sourceNegocios;
      newNegocios.splice(destination.index, 0, movedNegocio);
      
      const newColumn = {
        ...sourceColumn,
        negocios: newNegocios
      };

      newBoardData[sourceColumnIndex] = newColumn;
      setBoardData(newBoardData);
    } else {
      // Moving to a different column
      const destNegocios = Array.from(destColumn.negocios);
      destNegocios.splice(destination.index, 0, { ...movedNegocio, etapa: destColumn.etapa });
      
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
      setBoardData(newBoardData);

      // Here you would typically make an API call to update the deal's stage in the database.
      console.log(`Moved deal ${draggableId} to ${destColumn.etapa}`);
    }
  };
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-flow-col md:grid-cols-[repeat(7,minmax(300px,1fr))] gap-4 auto-cols-max">
            {boardData.map((coluna) => (
            <FunilColumn key={coluna.etapa} etapa={coluna.etapa} negocios={coluna.negocios} />
            ))}
        </div>
    </DragDropContext>
  );
}
