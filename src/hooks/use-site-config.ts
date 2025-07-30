
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const SITE_CONFIG_STORAGE_KEY = 'siteConfig'; // This can now be considered a cache key or identifier
const SITE_CONFIG_DOC_ID = 'main';

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
    const fetchConfig = async () => {
        try {
            const configRef = doc(db, "siteSettings", SITE_CONFIG_DOC_ID);
            const configSnap = await getDoc(configRef);

            if (configSnap.exists()) {
                const fetchedConfig = configSnap.data() as SiteConfig;
                // Merge with default to ensure all keys are present, just in case
                setSiteConfig({ ...defaultConfig, ...fetchedConfig });
            } else {
                // If no config in Firestore, set the default one
                await setDoc(configRef, defaultConfig);
                setSiteConfig(defaultConfig);
            }
        } catch (error) {
            console.error("Failed to load site config from Firestore", error);
            // Fallback to default if Firestore is not available
            setSiteConfig(defaultConfig);
        } finally {
            setLoading(false);
        }
    };
    
    fetchConfig();
    
    // Add a listener for real-time updates if needed in the future
    const handleConfigUpdate = () => {
        fetchConfig();
    }
    window.addEventListener('configUpdated', handleConfigUpdate);

    return () => {
        window.removeEventListener('configUpdated', handleConfigUpdate);
    };

  }, []);

  return { siteConfig, loading };
}
