
'use client'
import { Building } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";
import Image from "next/image";

export default function SobreNosPage() {
  const { siteConfig } = useSiteConfig();
  const siteName = siteConfig.siteName?.replace(" CRM", "") || "RealConnect";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
            <Building className="w-12 h-12 text-public-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-public-heading">Sobre a {siteName}</h1>
            <p className="mt-4 text-lg text-public-muted-foreground">Sua parceira de confiança no mercado imobiliário.</p>
        </div>

        {siteConfig.aboutPageImage && (
          <div className="mb-12 aspect-video relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={siteConfig.aboutPageImage}
              alt={`Sobre a ${siteName}`}
              fill
              className="object-cover"
              data-ai-hint="office team"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-public-foreground mx-auto">
            <p>
                Bem-vindo à {siteName}! Somos mais do que uma imobiliária, somos facilitadores de sonhos. Nossa missão é conectar pessoas aos seus lares ideais, oferecendo um serviço personalizado, transparente e eficiente.
            </p>
            <p>
                Com anos de experiência no mercado, nossa equipe de corretores especializados está pronta para entender suas necessidades e superar suas expectativas. Seja para comprar, vender ou alugar, estamos aqui para guiar você em cada passo da jornada, garantindo a melhor experiência e os melhores negócios.
            </p>
            <p>
                Acreditamos que cada imóvel tem uma história e cada cliente um novo capítulo para escrever. Deixe-nos ajudar a encontrar o cenário perfeito para o seu.
            </p>
        </div>
      </div>
    </div>
  );
}
