
'use client';
import type { ReactNode } from "react";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import "../public.css";
import { useSiteConfig } from "@/hooks/use-site-config";
import Head from "next/head";


export default function PublicLayout({ children }: { children: ReactNode }) {
  const { siteConfig, loading } = useSiteConfig();

  return (
    <>
      <Head>
        <title>{siteConfig.metaTitle}</title>
        <meta name="description" content={siteConfig.metaDescription} />
        {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
        <style type="text/css">{`
            :root {
                --public-primary: ${siteConfig.primaryColor};
            }
        `}</style>
        {siteConfig.headerScripts && <script dangerouslySetInnerHTML={{ __html: siteConfig.headerScripts }} />}
      </Head>
      <div className="flex flex-col min-h-screen bg-public-background text-public-foreground font-public-body">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
