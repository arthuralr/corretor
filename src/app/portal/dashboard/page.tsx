import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Building, ArrowRight } from "lucide-react";
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
        <main className="container mx-auto p-4 md:p-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Bem-vindo(a), {clientName}!</h1>
                <p className="text-muted-foreground">Esta é a sua área exclusiva para acompanhar informações sobre seus negócios e imóveis de interesse.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                 <Card className="hover:border-primary/50 transition-colors">
                     <Link href="/portal/dashboard/imoveis-recomendados">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Imóveis Recomendados</CardTitle>
                                <CardDescription>Veja os imóveis que selecionamos para você.</CardDescription>
                            </div>
                            <Building className="h-8 w-8 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <span>Ver recomendações</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Link>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Meus Negócios</CardTitle>
                        <CardDescription>Acompanhe o andamento de suas propostas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">Em breve, você poderá visualizar aqui o andamento das suas propostas.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
