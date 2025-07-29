
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Image as ImageIcon, Palette, Save } from 'lucide-react';
import { type SiteConfig, SITE_CONFIG_STORAGE_KEY } from '@/hooks/use-site-config';

const formSchema = z.object({
  logo: z.string().url().optional().or(z.literal('')),
  favicon: z.string().url().optional().or(z.literal('')),
  socialShareImage: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredTitle: z.string().optional(),
  googleMapsApiKey: z.string().optional(),
  whatsappPhone: z.string().optional(),
  headerScripts: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ImageUploadPlaceholder = ({ label, currentImage, onImageUpload }: { label: string; currentImage?: string; onImageUpload: (url: string) => void; }) => {
  const handleUpload = () => {
    // In a real app, this would open a file dialog and upload to a server.
    // For this prototype, we'll just prompt for a URL.
    const url = prompt(`Enter the new URL for the ${label}:`, currentImage || 'https://placehold.co/200x100.png');
    if (url) {
      onImageUpload(url);
    }
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 flex items-center gap-4">
        <div className="w-32 h-16 rounded-md border flex items-center justify-center bg-muted/50">
          {currentImage ? <img src={currentImage} alt={label} className="h-full w-full object-contain" /> : <ImageIcon className="text-muted-foreground" />}
        </div>
        <Button type="button" variant="outline" onClick={handleUpload}>
          <UploadCloud className="mr-2" />
          Alterar
        </Button>
      </div>
    </div>
  );
};

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const [initialConfig, setInitialConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (savedConfig) {
      setInitialConfig(JSON.parse(savedConfig));
    } else {
      setInitialConfig({
        primaryColor: '#22426A',
        metaTitle: 'Bataglin Imóveis',
        metaDescription: 'Encontre o imóvel dos seus sonhos.',
        featuredTitle: 'Imóveis em Destaque',
      });
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: initialConfig || {}, // Use values to re-render when initialConfig loads
  });

  useEffect(() => {
    if (initialConfig) {
        form.reset(initialConfig);
    }
  }, [initialConfig, form])

  const onSubmit = (data: FormValues) => {
    try {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: 'Configurações Salvas!',
        description: 'As configurações do site público foram atualizadas com sucesso.',
      });
      // Force a hard reload to make CSS variables and other settings apply immediately
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    }
  };

  if (!initialConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Configurações do Site</h2>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Branding e Identidade Visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ImageUploadPlaceholder
                label="Logo da Empresa"
                currentImage={form.watch('logo')}
                onImageUpload={(url) => form.setValue('logo', url, { shouldDirty: true })}
              />
               <ImageUploadPlaceholder
                label="Favicon (.ico, .png)"
                currentImage={form.watch('favicon')}
                onImageUpload={(url) => form.setValue('favicon', url, { shouldDirty: true })}
              />
               <ImageUploadPlaceholder
                label="Imagem de Compartilhamento Social"
                currentImage={form.watch('socialShareImage')}
                onImageUpload={(url) => form.setValue('socialShareImage', url, { shouldDirty: true })}
              />
            </div>
             <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Principal do Site</FormLabel>
                  <div className="flex items-center gap-2">
                     <FormControl>
                        <Input type="color" {...field} className="w-12 h-10 p-1" />
                     </FormControl>
                     <span className='text-muted-foreground'>{field.value}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">SEO da Página Inicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Site (Meta Title)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Site (Meta Description)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Conteúdo e Integrações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
              control={form.control}
              name="featuredTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Seção de Imóveis em Destaque</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleMapsApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave de API do Google Maps</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="whatsappPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 5511999998888" />
                  </FormControl>
                   <FormDescription>
                    Número com código do país e DDD, sem espaços ou símbolos.
                  </FormDescription>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="headerScripts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scripts do Cabeçalho (Header)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Cole aqui scripts como Google Analytics, Pixel do Facebook, etc." className="font-mono" rows={5}/>
                  </FormControl>
                   <FormDescription>
                    O conteúdo deste campo será inserido antes do fechamento da tag `&lt;head&gt;`.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
