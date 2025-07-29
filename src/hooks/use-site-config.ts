
'use client';

import { useState, useEffect } from 'react';

export const SITE_CONFIG_STORAGE_KEY = 'siteConfig';

export interface SiteConfig {
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
}

const defaultConfig: SiteConfig = {
    primaryColor: '#22426A', // Default navy blue
    metaTitle: 'Bataglin Imóveis',
    metaDescription: 'Encontre os melhores imóveis da região.',
    featuredTitle: 'Imóveis em Destaque',
    whatsappPhone: '5511999998888',
};

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
      if (savedConfig) {
        setSiteConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("Failed to load site config from local storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { siteConfig, loading };
}
