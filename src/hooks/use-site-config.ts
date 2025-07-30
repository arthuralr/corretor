
'use client';

import { useState, useEffect } from 'react';

export const SITE_CONFIG_STORAGE_KEY = 'siteConfig';

export interface HeroImage {
  src: string;
  alt: string;
  hint: string;
}

export interface SiteConfig {
  siteName?: string;
  logo?: string;
  favicon?: string;
  socialShareImage?: string;
  primaryColor?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredTitle?: string;
  googleMapsApiKey?: string;
  whatsappPhone?: string;
  headerScripts?: string;
  heroImages?: HeroImage[];
}

const defaultConfig: SiteConfig = {
    siteName: 'RealConnect CRM',
    primaryColor: '#22426A', // Default navy blue
    metaTitle: 'Bataglin Imóveis',
    metaDescription: 'Encontre os melhores imóveis da região.',
    featuredTitle: 'Imóveis em Destaque',
    whatsappPhone: '5511999998888',
    heroImages: [
        { src: 'https://placehold.co/1920x1080.png', alt: 'Modern Living Room', hint: 'modern living room' },
        { src: 'https://placehold.co/1920x1080.png', alt: 'Luxury Kitchen', hint: 'luxury kitchen' },
        { src: 'https://placehold.co/1920x1080.png', alt: 'House Exterior', hint: 'house exterior' },
    ],
};

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
      if (savedConfig) {
        // Merge saved config with defaults to ensure all keys are present
        const parsedConfig = JSON.parse(savedConfig);
        setSiteConfig({ ...defaultConfig, ...parsedConfig });
      } else {
        setSiteConfig(defaultConfig);
      }
    } catch (error) {
      console.error("Failed to load site config from local storage", error);
      setSiteConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  return { siteConfig, loading };
}
