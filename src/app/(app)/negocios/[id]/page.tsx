

'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Briefcase, User, Home, DollarSign, Calendar, Tag, Info, CheckCircle, FolderArchive, Edit } from "lucide-react";
import type { Negocio, Task, Documento, Client, Imovel } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { DocumentManager } from "@/components/negocios/document-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { NegocioModal } from "@/components/negocios/negocio-modal";
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TASKS_STORAGE_KEY = 'tasksData';

export default function NegocioDetailPage({ params }: { params: { id: string } }) {
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for modal dependencies
  const [clients, setClients] = useState<Client[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const negocioId = params.id;


  const loadData = useCallback(async () => {
    if (!negocioId) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
        // Fetch Negocio from Firestore
        const negocioRef = doc(db, "negocios", negocioId);
        const negocioSnap = await getDoc(negocioRef);
        
        if (negocioSnap.exists()) {
            const fetchedNegocio = { id: negocioSnap.id, ...negocioSnap.data() } as Negocio;
            setNegocio(fetchedNegocio);
            
            // Fetch Tasks for the client associated with the business (from localStorage)
            if (fetchedNegocio.clienteId) {
                 const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
                if (savedTasks) {
                    const allTasks: Task[] = JSON.parse(savedTasks);
                    const clientTasks = allTasks.filter(t => t.clientId === fetchedNegocio.clienteId);
                    setTasks(clientTasks);
                }
            }
        } else {
            setNegocio(null);
        }

    } catch (error) {
        console.error("Failed to load business data", error);
        setNegocio(null);
    } finally {
        setLoading(false);
    }
  }, [negocioId]);

  // Load data for the modal
  const loadModalData = async () => {
     try {
        const clientsSnapshot = await getDocs(collection(db, "clients"));
        setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
        
        const imoveisSnapshot = await getDocs(collection(db, "imoveis"));
        setImoveis(imoveisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel)));
     } catch(e) {
        console.error("Failed to load clients/imoveis for modal", e)
     }
  }

  useEffect(() => {
    loadData();
    window.addEventListener('dataUpdated', loadData);
    return () => {
      window.removeEventListener('dataUpdated', loadData);
    };
  }, [loadData]);
  
  useEffect(() => {
    if (isEditModalOpen) {
      loadModalData();
    }
  }, [isEditModalOpen]);

   const handleSaveNegocio = async (savedNegocio: Negocio) => {
        try {
            const negocioRef = doc(db, "negocios", savedNegocio.id);
            await setDoc(negocioRef, savedNegocio, { merge: true });
            
            window.dispatchEvent(new CustomEvent('dataUpdated'));
            setIsEditModalOpen(false);

        } catch(error) {
            console.error("Failed to save negocio", error);
        }
    };
    
   const handleDocumentsUpdate = async (updatedDocuments: Documento[]) => {
      if (!negocio) return;
      try {
        const negocioRef = doc(db, "negocios", negocio.id);
        await updateDoc(negocioRef, { documentos: updatedDocuments });
        setNegocio(prev => prev ? { ...prev, documentos: updatedDocuments } : null);
      } catch (error) {
        console.error("Failed to update documents", error);
      }
    }


   const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  if (loading) {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                 <Skeleton className="h-10 w-1/2" />
                 <Skeleton className="h-10 w-24" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
                <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
                <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
             </div>
             <Card><CardHeader><Skeleton className="h-32 w-full" /></CardHeader></Card>
        </div>
    )
  }

  if (!negocio) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Negócio não encontrado</h2>
        <p>O negócio que você está procurando não foi encontrado.</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-accent" />
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">{negocio.imovelTitulo}</h2>
                <p className="text-muted-foreground">Oportunidade com {negocio.clienteNome}</p>
            </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}><Edit className="h-4 w-4 mr-2"/> Editar Negócio</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Info className="w-5 h-5"/> Detalhes do Negócio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">{negocio.etapa}</Badge>
            </div>
             <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>{formatPrice(negocio.valorProposta)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Criado em: {format(parseISO(negocio.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            {negocio.recomendadoCliente && (
                 <div className="flex items-center gap-3 pt-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">Recomendado ao cliente</span>
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <Link href={`/clients/${negocio.clienteId}`} className="hover:underline text-primary">
                        {negocio.clienteNome}
                    </Link>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-muted-foreground" />
                    <Link href={`/imoveis/${negocio.imovelId}`} className="hover:underline text-primary">
                        {negocio.imovelTitulo}
                    </Link>
                </div>
            </CardContent>
        </Card>
      </div>
       
       <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <FolderArchive className="w-5 h-5"/> Gestão de Documentos
            </CardTitle>
            <CardDescription>Faça o upload e gerencie os documentos relacionados a este negócio.</CardDescription>
        </CardHeader>
        <CardContent>
            <DocumentManager 
                initialDocuments={negocio.documentos || []}
                onDocumentsChange={handleDocumentsUpdate} 
            />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-lg">Tarefas Associadas</CardTitle>
                <CardDescription>Todas as tarefas relacionadas a este negócio.</CardDescription>
            </div>
            <AddTaskButton preselectedNegocioId={negocio.id} preselectedClientId={negocio.clienteId} />
        </CardHeader>
        <CardContent>
            <TaskList tasks={tasks} onTaskChange={loadData}/>
        </CardContent>
      </Card>
    </div>
    <NegocioModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveNegocio}
        negocio={negocio}
        clients={clients}
        imoveis={imoveis}
    />
    </>
  );
}
