import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-public-heading">Entre em Contato</h1>
            <p className="mt-4 text-lg text-public-muted-foreground">Adoraríamos ouvir de você. Preencha o formulário ou use nossos contatos diretos.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-public-card p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-public-heading mb-6">Envie uma Mensagem</h2>
                <ContactForm />
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-public-heading">Informações de Contato</h2>
                <div className="space-y-4 text-public-foreground">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Phone className="w-6 h-6 text-public-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Telefone</h3>
                            <p className="text-public-muted-foreground hover:text-public-primary transition-colors">
                                <a href="tel:+5511999998888">+55 (11) 99999-8888</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Mail className="w-6 h-6 text-public-primary" />
                        </div>
                         <div>
                            <h3 className="font-semibold">Email</h3>
                             <p className="text-public-muted-foreground hover:text-public-primary transition-colors">
                                <a href="mailto:contato@realconnect.com">contato@realconnect.com</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="flex-shrink-0 mt-1">
                            <MapPin className="w-6 h-6 text-public-primary" />
                        </div>
                         <div>
                            <h3 className="font-semibold">Endereço</h3>
                            <p className="text-public-muted-foreground">Av. Gen. Flores da Cunha, 4290 - Vila Bom Principio<br/>Cachoeirinha - RS, 94950-001</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
