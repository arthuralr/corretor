"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TaskForm } from './task-form';
import { PlusCircle } from 'lucide-react';

export function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleTaskSave = (values: any) => {
    console.log("Task saved:", values);
    setIsOpen(false);
    // Here you would typically revalidate the data to show the new task
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova tarefa.
            </DialogDescription>
          </DialogHeader>
          <TaskForm onSave={handleTaskSave} onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
