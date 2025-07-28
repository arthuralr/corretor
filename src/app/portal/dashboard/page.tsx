import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage() {
    // Mock client data - in a real app, this would come from the session
    const clientName = "John Doe";

  return (
    <div>
        <header className="bg-card border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 font-headline text-lg font-semibold">
                    <User className="h-6 w-6 text-primary" />
                    <span>Portal do Cliente</span>
                </div>
                <Link href="/portal/login">
                    <Button variant="outline" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </Link>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Bem-vindo(a), {clientName}!</CardTitle>
                    <CardDescription>Esta é a sua área exclusiva para acompanhar informações sobre seus negócios e imóveis de interesse.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p>Em breve, você poderá visualizar aqui os detalhes dos imóveis, o andamento de propostas e muito mais.</p>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
