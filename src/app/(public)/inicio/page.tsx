
'use client'

import { useState, useEffect, useRef } from 'react';
import type { Imovel } from '@/lib/definitions';
import { getInitialImoveis } from '@/lib/initial-data';
import { PropertySearchForm } from '@/components/public/property-search-form';
import { PublicPropertyCard } from '@/components/public/public-property-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from 'embla-carousel-autoplay';
import { useSiteConfig } from '@/hooks/use-site-config';

const IMOVEIS_STORAGE_KEY = 'imoveisData';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Imovel[]>([]);
  const { siteConfig, loading } = useSiteConfig();
  
  useEffect(() => {
    try {
      const savedImoveis = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
      const allImoveis: Imovel[] = savedImoveis ? JSON.parse(savedImoveis) : getInitialImoveis();
      const featured = allImoveis.filter(p => p.status === 'Ativo').slice(0, 6);
      setFeaturedProperties(featured);
    } catch (error) {
      console.error("Failed to load properties:", error);
      const initialFeatured = getInitialImoveis().filter(p => p.status === 'Ativo').slice(0, 6);
      setFeaturedProperties(initialFeatured);
    }
  }, []);
  
  const heroImages = siteConfig.heroImages || [];

  if (loading) {
    return <div>Carregando...</div> // Or a proper skeleton loader
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-white">
        {heroImages.length > 0 && (
          <Carousel 
              opts={{ loop: true }}
              plugins={[
                  Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                  }),
              ]}
              className="absolute inset-0 z-0"
          >
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="w-full h-[70vh] md:h-[85vh] bg-black">
                     <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill 
                      className="object-cover opacity-50"
                      data-ai-hint={image.hint}
                      priority={index === 0}
                      />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        <div className="relative z-10 container mx-auto px-4 md:-mt-32">
          <PropertySearchForm />
        </div>
      </section>
      
      {/* Featured Properties Section */}
      <section className="py-16 md:py-24 bg-public-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-public-heading mb-12">
            {siteConfig.featuredTitle || 'Imóveis em Destaque'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PublicPropertyCard key={property.id} property={property} />
            ))}
          </div>
           {featuredProperties.length === 0 && (
            <p className="text-center text-public-muted-foreground">Nenhum imóvel em destaque no momento.</p>
           )}
        </div>
      </section>
    </div>
  );
}
