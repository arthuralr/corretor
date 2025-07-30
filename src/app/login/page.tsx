
'use client';
import { LoginForm } from "@/components/auth/login-form";
import { Building } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";

export default function LoginPage() {
  const { siteConfig } = useSiteConfig();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center">
            {siteConfig.logo ? <img src={siteConfig.logo} alt="Logo" className="h-12 w-auto" /> : <Building className="w-12 h-12 text-primary" />}
            <h1 className="text-3xl font-bold mt-4 font-headline">{siteConfig.siteName || 'RealConnect CRM'}</h1>
            <p className="text-muted-foreground">Bem-vindo(a) de volta, faça login em sua conta.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
