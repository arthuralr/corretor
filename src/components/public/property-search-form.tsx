
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

export function PropertySearchForm() {
    const [dealType, setDealType] = useState('comprar');

    return (
        <div className="bg-public-card shadow-lg rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex border-b">
                <button 
                    onClick={() => setDealType('comprar')}
                    className={cn(
                        "py-3 px-6 text-lg font-semibold transition-colors",
                        dealType === 'comprar' ? "text-public-primary border-b-2 border-public-primary" : "text-public-muted-foreground hover:text-public-heading"
                    )}
                >
                    Comprar
                </button>
                <button 
                    onClick={() => setDealType('alugar')}
                    className={cn(
                        "py-3 px-6 text-lg font-semibold transition-colors",
                        dealType === 'alugar' ? "text-public-primary border-b-2 border-public-primary" : "text-public-muted-foreground hover:text-public-heading"
                    )}
                >
                    Alugar
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                     <Label className="text-sm font-medium text-public-heading ml-1 mb-1">Localização</Label>
                    <Input 
                        placeholder="Digite um bairro, cidade ou código do imóvel" 
                        className="h-12 text-base border-public-border focus:ring-public-primary" 
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-4">
                     <div>
                        <Label className="text-sm font-medium text-public-heading ml-1 mb-1">Tipo de Imóvel</Label>
                        <Select>
                            <SelectTrigger className="h-12 text-base border-public-border focus:ring-public-primary">
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
                     <div>
                        <Label className="text-sm font-medium text-public-heading ml-1 mb-1">Quartos</Label>
                        <Select>
                            <SelectTrigger className="h-12 text-base border-public-border focus:ring-public-primary">
                                <SelectValue placeholder="Quartos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                      <div>
                        <Label className="text-sm font-medium text-public-heading ml-1 mb-1">Vagas</Label>
                        <Select>
                            <SelectTrigger className="h-12 text-base border-public-border focus:ring-public-primary">
                                <SelectValue placeholder="Vagas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                    <div>
                         <Label className="text-sm font-medium text-public-heading ml-1 mb-1 opacity-0">Faixa de Preço</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 text-base border-public-border text-public-muted-foreground hover:text-public-heading">
                                    Faixa de Preço
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none text-public-heading">Faixa de Preço</h4>
                                        <p className="text-sm text-public-muted-foreground">
                                            Selecione o valor mínimo e máximo.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="Preço Mín." className="border-public-border"/>
                                        <Input placeholder="Preço Máx." className="border-public-border"/>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

            </div>
             <Button className="w-full h-14 text-lg bg-public-primary hover:bg-public-primary/90 text-public-primary-foreground">
                <Search className="mr-2 h-5 w-5"/>
                Buscar Imóveis
            </Button>
        </div>
    )
}
