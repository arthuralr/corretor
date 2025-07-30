
'use client'
import type { Metadata } from 'next';
import Head from 'next/head';
import { useSiteConfig } from '@/hooks/use-site-config';

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName || "RealConnect";

  return (
    <>
      <Head>
        <title>{`Portal do Cliente - ${siteName}`}</title>
        <meta name="description" content="Acesse suas informações e acompanhe seus negócios." />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
          {children}
      </div>
    </>
  );
}
