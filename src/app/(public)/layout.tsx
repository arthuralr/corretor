import type { ReactNode } from "react";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import "../public.css";


export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-public-background text-public-foreground font-public-body">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
