
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Image as ImageIcon, Palette, Save, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { type SiteConfig, useSiteConfig as useSiteConfigHook } from '@/hooks/use-site-config';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const heroImageSchema = z.object({
  src: z.string().url({ message: "Por favor, insira uma URL válida." }).min(1, "A URL é obrigatória."),
  alt: z.string().min(1, "O texto alternativo é obrigatório."),
  hint: z.string().min(1, "A dica para IA é obrigatória."),
});

const formSchema = z.object({
  siteName: z.string().optional(),
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
  heroImages: z.array(heroImageSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ImageUploadPlaceholder = ({ label, currentImage, onImageUpload, isUploading }: { label: string; currentImage?: string; onImageUpload: (file: File) => void; isUploading: boolean }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onImageUpload(file);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 flex items-center gap-4">
        <div className="w-32 h-16 rounded-md border flex items-center justify-center bg-muted/50">
          {currentImage ? <img src={currentImage} alt={label} className="h-full w-full object-contain" /> : <ImageIcon className="text-muted-foreground" />}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
        <Button type="button" variant="outline" onClick={handleUploadClick} disabled={isUploading}>
          {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <UploadCloud className="mr-2" />}
          Alterar
        </Button>
      </div>
    </div>
  );
};


export default function SiteSettingsPage() {
  const { toast } = useToast();
  const { siteConfig: initialConfig, loading } = useSiteConfigHook();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: initialConfig,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "heroImages",
  });

  useEffect(() => {
    if (initialConfig) {
        form.reset(initialConfig);
    }
  }, [initialConfig, form]);

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  const handleGenericImageUpload = async (file: File, fieldName: keyof FormValues) => {
    setIsUploading(true);
    try {
        const url = await uploadImage(file, 'site-assets');
        form.setValue(fieldName, url, { shouldDirty: true, shouldValidate: true });
        toast({ title: "Imagem enviada com sucesso!" });
    } catch (error) {
        toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem.", variant: 'destructive' });
    } finally {
        setIsUploading(false);
    }
  }

  const handleSlideImageUpload = async (index: number, file: File) => {
    setIsUploading(true);
    try {
        const url = await uploadImage(file, 'hero-slides');
        form.setValue(`heroImages.${index}.src`, url, { shouldDirty: true, shouldValidate: true });
        toast({ title: 'Imagem Alterada!', description: 'A imagem do slide foi atualizada.' });
    } catch(error) {
        toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem do slide.", variant: 'destructive' });
    } finally {
        setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const configRef = doc(db, "siteSettings", "main");
      await setDoc(configRef, data);

      toast({
        title: 'Configurações Salvas!',
        description: 'As configurações do site público foram atualizadas com sucesso.',
      });
      window.dispatchEvent(new CustomEvent('configUpdated'));
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
        setIsSaving(false);
    }
  };


  if (loading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Configurações do Site</h2>
          <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Alterações
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Branding e Identidade Visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site/CRM</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ImageUploadPlaceholder
                label="Logo da Empresa"
                currentImage={form.watch('logo')}
                onImageUpload={(file) => handleGenericImageUpload(file, 'logo')}
                isUploading={isUploading}
              />
               <ImageUploadPlaceholder
                label="Favicon (.ico, .png)"
                currentImage={form.watch('favicon')}
                onImageUpload={(file) => handleGenericImageUpload(file, 'favicon')}
                isUploading={isUploading}
              />
               <ImageUploadPlaceholder
                label="Imagem de Compartilhamento Social"
                currentImage={form.watch('socialShareImage')}
                onImageUpload={(file) => handleGenericImageUpload(file, 'socialShareImage')}
                isUploading={isUploading}
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
                        <Input type="color" {...field} value={field.value || ''} className="w-12 h-10 p-1" />
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
            <CardTitle className="font-headline text-lg">Imagens do Slide Principal</CardTitle>
            <CardDescription>Gerencie as imagens que aparecem no topo da sua página inicial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
                    {form.watch(`heroImages.${index}.src`) ? (
                      <img src={form.watch(`heroImages.${index}.src`)} alt={form.watch(`heroImages.${index}.alt`)} className="w-full h-full object-cover"/>
                    ) : <ImageIcon className="w-full h-full text-muted-foreground p-4"/> }
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                   <div className="md:col-span-2">
                        <FormLabel>URL da Imagem</FormLabel>
                        <div className="flex items-center gap-2 mt-2">
                             <FormControl>
                                <Input 
                                    {...form.register(`heroImages.${index}.src`)} 
                                    placeholder="https://..."
                                />
                            </FormControl>
                             <label className="relative">
                                <Button type="button" variant="outline" asChild disabled={isUploading}>
                                  <span>
                                      {isUploading ? <Loader2 className="mr-2 animate-spin"/> : <UploadCloud className="mr-2" />} 
                                      Alterar
                                  </span>
                                </Button>
                                <input
                                  type="file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept="image/*"
                                  onChange={(e) => e.target.files?.[0] && handleSlideImageUpload(index, e.target.files[0])}
                                  disabled={isUploading}
                                />
                              </label>
                        </div>
                        <FormDescription className="mt-1">Tamanho ideal: 1920x1080px</FormDescription>
                        <FormMessage>{form.formState.errors.heroImages?.[index]?.src?.message}</FormMessage>
                    </div>
                  <FormField
                    control={form.control}
                    name={`heroImages.${index}.alt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto Alternativo (Alt)</FormLabel>
                        <FormControl><Input {...field} placeholder="Descrição da imagem"/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`heroImages.${index}.hint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dica para IA (1-2 palavras)</FormLabel>
                        <FormControl><Input {...field} placeholder="Ex: modern kitchen"/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <Button
              type="button"
              variant="outline"
              onClick={() => append({ src: 'https://placehold.co/1920x1080.png', alt: 'Nova Imagem', hint: 'descreva a imagem' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Imagem ao Slide
            </Button>
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
                    <Input {...field} value={field.value || ''} />
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
                    <Textarea {...field} value={field.value || ''} />
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
                    <Input {...field} value={field.value || ''} />
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
                    <Input {...field} type="password" value={field.value || ''} />
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
                    <Input {...field} placeholder="Ex: 5511999998888" value={field.value || ''} />
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
                    <Textarea {...field} placeholder="Cole aqui scripts como Google Analytics, Pixel do Facebook, etc." className="font-mono" rows={5} value={field.value || ''}/>
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
