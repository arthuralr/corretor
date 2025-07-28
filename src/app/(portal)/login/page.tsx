import { PortalLoginForm } from "@/components/portal/portal-login-form";
import { Building } from "lucide-react";

export default function PortalLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center">
            <Building className="w-12 h-12 text-primary" />
            <h1 className="text-3xl font-bold mt-4 font-headline">Portal do Cliente</h1>
            <p className="text-muted-foreground">Acesse sua conta para ver seus imóveis.</p>
        </div>
        <PortalLoginForm />
      </div>
    </div>
  );
}
