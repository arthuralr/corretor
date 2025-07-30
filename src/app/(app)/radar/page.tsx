
'use client'

import { useState, useEffect, useCallback } from "react";
import type { Client, Imovel } from "@/lib/definitions";
import { RadarDeOportunidades } from "@/components/radar/radar-oportunidades";
import { Telescope } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function RadarPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

      const imoveisSnapshot = await getDocs(collection(db, "imoveis"));
      setProperties(imoveisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel)));
      
    } catch (error) {
      console.error("Failed to load data for Radar page", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('dataUpdated', loadData);
    return () => {
      window.removeEventListener('dataUpdated', loadData);
    };
  }, [loadData]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <Telescope className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Radar de Oportunidades</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Selecione um cliente para que a IA encontre os imóveis mais compatíveis com seu perfil de busca.
      </p>
      <RadarDeOportunidades clients={clients} allProperties={properties} isLoading={loading} />
    </div>
  );
}
