'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, MapPin } from 'lucide-react';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';


export function PropertySearchForm() {
  const [dealType, setDealType] = useState('comprar');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would collect all form values and construct a search query
    console.log("Searching...");
    router.push('/imoveis'); // Redirect to a search results page
  }

  return (
    <div className="bg-public-card/90 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-2xl max-w-5xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 border-b-2 border-public-primary/20 pb-4 mb-4">
          <Button 
            type="button"
            variant={dealType === 'comprar' ? 'default' : 'ghost'}
            onClick={() => setDealType('comprar')}
            className={dealType === 'comprar' ? 'bg-public-primary text-public-primary-foreground' : 'text-public-foreground'}
          >
            Comprar
          </Button>
          <Button 
            type="button"
            variant={dealType === 'alugar' ? 'default' : 'ghost'}
             onClick={() => setDealType('alugar')}
             className={dealType === 'alugar' ? 'bg-public-primary text-public-primary-foreground' : 'text-public-foreground'}
          >
            Alugar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                 <Label htmlFor="location-search" className="text-sm font-medium text-public-heading/90">Localização</Label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-public-muted-foreground" />
                    <Input
                        id="location-search"
                        placeholder="Digite o nome do empreendimento ou código do imóvel..."
                        className="w-full pl-10 bg-white/80 border-public-border"
                    />
                </div>
            </div>

             <div className="lg:col-span-1">
                 <Label htmlFor="city" className="text-sm font-medium text-public-heading/90">Cidade</Label>
                 <Select>
                    <SelectTrigger id="city" className="bg-white/80 border-public-border">
                        <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sao-paulo">São Paulo</SelectItem>
                        <SelectItem value="campinas">Campinas</SelectItem>
                        <SelectItem value="santos">Santos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="lg:col-span-1">
                 <Label htmlFor="neighborhood" className="text-sm font-medium text-public-heading/90">Bairro</Label>
                 <Select>
                    <SelectTrigger id="neighborhood" className="bg-white/80 border-public-border">
                        <SelectValue placeholder="Bairro" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pinheiros">Pinheiros</SelectItem>
                        <SelectItem value="moema">Moema</SelectItem>
                        <SelectItem value="jardins">Jardins</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="lg:col-span-1">
                <Label htmlFor="property-type" className="text-sm font-medium text-public-heading/90">Tipo de Imóvel</Label>
                <Select>
                    <SelectTrigger id="property-type" className="bg-white/80 border-public-border">
                        <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="lg:col-span-1">
                <Label htmlFor="bedrooms" className="text-sm font-medium text-public-heading/90">Quartos</Label>
                <Select>
                    <SelectTrigger id="bedrooms" className="bg-white/80 border-public-border">
                        <SelectValue placeholder="Quartos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1+ quarto</SelectItem>
                        <SelectItem value="2">2+ quartos</SelectItem>
                        <SelectItem value="3">3+ quartos</SelectItem>
                        <SelectItem value="4">4+ quartos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="lg:col-span-1">
                <Label htmlFor="parking" className="text-sm font-medium text-public-heading/90">Vagas</Label>
                <Select>
                    <SelectTrigger id="parking" className="bg-white/80 border-public-border">
                        <SelectValue placeholder="Vagas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1+ vaga</SelectItem>
                        <SelectItem value="2">2+ vagas</SelectItem>
                        <SelectItem value="3">3+ vagas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="lg:col-span-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full bg-white/80 border-public-border text-public-foreground">Faixa de Preço</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Faixa de Preço</h4>
                                <p className="text-sm text-muted-foreground">
                                    Defina o valor mínimo e máximo.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="min-price">Mínimo</Label>
                                    <Input id="min-price" placeholder="R$ 0" />
                                </div>
                                <div>
                                    <Label htmlFor="max-price">Máximo</Label>
                                    <Input id="max-price" placeholder="R$ 1.000.000" />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <Button type="submit" className="w-full bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground h-10 mt-auto">
                <Search className="mr-2 h-5 w-5" />
                Buscar Imóveis
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
}
