
'use client';
import type { ReactNode } from "react";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import "../public.css";
import { useSiteConfig } from "@/hooks/use-site-config";
import Head from "next/head";
import { WhatsappButton } from "@/components/public/whatsapp-button";


export default function PublicLayout({ children }: { children: ReactNode }) {
  const { siteConfig, loading } = useSiteConfig();

  // Basic skeleton loader styles to prevent flash of unstyled content
  const skeletonStyles = `
    body { background-color: #f3f4f6; }
    header, footer { opacity: 0; }
  `;
  const primaryColorStyle = siteConfig.primaryColor ? `
    :root {
      --public-primary: ${siteConfig.primaryColor};
    }
  ` : '';

  return (
    <>
      <Head>
        <title>{loading ? 'Carregando...' : siteConfig.metaTitle}</title>
        {!loading && <meta name="description" content={siteConfig.metaDescription} />}
        {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
        {siteConfig.socialShareImage && <meta property="og:image" content={siteConfig.socialShareImage} />}
        
        {/* Inject styles directly to avoid FOUC */}
        <style type="text/css" dangerouslySetInnerHTML={{ __html: primaryColorStyle }} />
        {loading && <style type="text/css" dangerouslySetInnerHTML={{ __html: skeletonStyles }} />}
        
        {siteConfig.headerScripts && !loading && <script dangerouslySetInnerHTML={{ __html: siteConfig.headerScripts }} />}
      </Head>
      <div className="flex flex-col min-h-screen bg-public-background text-public-foreground font-public-body">
        {!loading && <Header />}
        <main className="flex-1">
          {loading ? <div>Carregando...</div> : children}
        </main>
        {!loading && <Footer />}
        {!loading && <WhatsappButton />}
      </div>
    </>
  );
}
