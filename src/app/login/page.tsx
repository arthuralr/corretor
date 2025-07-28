import { LoginForm } from "@/components/auth/login-form";
import { Building } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center">
            <Building className="w-12 h-12 text-primary" />
            <h1 className="text-3xl font-bold mt-4 font-headline">RealConnect CRM</h1>
            <p className="text-muted-foreground">Bem-vindo(a) de volta, faça login em sua conta.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
