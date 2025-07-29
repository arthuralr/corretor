
import Link from 'next/link';
import { Building, Facebook, Instagram, Linkedin, BotMessageSquare } from 'lucide-react';

const socialLinks = [
  { href: "#", icon: Facebook },
  { href: "#", icon: Instagram },
  { href: "#", icon: Linkedin },
];

const navLinks = [
  { href: "/inicio", label: "Início" },
  { href: "/comprar", label: "Comprar" },
  { href: "/alugar", label: "Alugar" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="bg-public-heading text-public-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building className="h-8 w-8 text-public-primary" />
              <span className="text-xl font-bold">Bataglin Imóveis</span>
            </Link>
            <p className="text-sm text-public-muted-foreground">
              Encontrando o lugar perfeito para sua próxima história.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-public-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>Rua Fictícia, 123 - Centro</li>
              <li>São Paulo, SP - 01000-000</li>
              <li className="pt-2">contato@bataglinimoveis.com</li>
              <li>(11) 1234-5678</li>
            </ul>
          </div>

          {/* Social and WhatsApp */}
          <div>
            <h3 className="font-semibold mb-4">Siga-nos</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="hover:text-public-primary transition-colors">
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-sm bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                <BotMessageSquare className="h-5 w-5" />
                <span>Atendimento WhatsApp</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-public-border/20 text-center text-xs text-public-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bataglin Imóveis. Todos os direitos reservados. CRECI 12345-J</p>
        </div>
      </div>
    </footer>
  );
}
