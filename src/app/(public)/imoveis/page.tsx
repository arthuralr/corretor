
'use client'

import { useState, useEffect } from 'react';
import type { Imovel } from '@/lib/definitions';
import { PublicPropertyCard } from '@/components/public/public-property-card';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PropertySearchForm } from '@/components/public/property-search-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function ImoveisPage() {
  const [properties, setProperties] = useState<Imovel[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "imoveis"), where("status", "==", "Ativo"));
        const querySnapshot = await getDocs(q);
        const propertiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel));
        setProperties(propertiesData);
        setFilteredProperties(propertiesData); // Initialize with all properties
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    const location = searchParams.get('location');

    let results = properties;

    if (type) {
      results = results.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    if (location) {
      results = results.filter(p => 
        p.city?.toLowerCase().includes(location.toLowerCase()) ||
        p.neighborhood?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    setFilteredProperties(results);
  }, [searchParams, properties]);


  return (
    <div className="bg-public-background">
      {/* Search Form Section */}
      <section className="py-12 bg-public-muted border-b border-public-border">
          <div className="container mx-auto px-4">
              <PropertySearchForm />
          </div>
      </section>
      
      {/* Properties List Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-public-heading mb-4">
            Nossos Imóveis
          </h1>
           <p className="text-lg text-public-muted-foreground text-center mb-12">
            Encontre o imóvel ideal para você.
          </p>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
             </div>
          ) : (
             <>
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map(property => (
                        <PublicPropertyCard key={property.id} property={property} />
                    ))}
                </div>
              ) : (
                <div className="text-center text-public-muted-foreground py-20 flex flex-col items-center gap-4">
                    <Search className="w-12 h-12" />
                    <p className="font-semibold text-lg">Nenhum imóvel encontrado.</p>
                    <p>Tente ajustar seus filtros de busca ou confira novamente mais tarde.</p>
                </div>
              )}
             </>
          )}
        </div>
      </section>
    </div>
  );
}
