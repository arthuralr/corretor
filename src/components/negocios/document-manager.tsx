
"use client";

import { useState, useRef } from 'react';
import type { Documento } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, FileImage, FileType, Trash2, Download } from 'lucide-react';

interface DocumentManagerProps {
  initialDocuments: Documento[];
  onDocumentsChange: (documents: Documento[]) => void;
}

const getFileIcon = (type: Documento['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-6 w-6 text-red-500" />;
    case 'image':
      return <FileImage className="h-6 w-6 text-blue-500" />;
    case 'word':
      return <FileType className="h-6 w-6 text-blue-700" />;
    default:
      return <FileType className="h-6 w-6 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (fileName: string): Documento['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    return 'other';
}

export function DocumentManager({ initialDocuments, onDocumentsChange }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Documento[]>(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // This is a mock upload process.
    // In a real app, you would upload to a server/cloud storage.
    setTimeout(() => {
      const newDocuments: Documento[] = Array.from(files).map(file => ({
        id: `DOC-${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file), // Creates a temporary local URL
        type: getFileType(file.name),
        size: file.size,
      }));

      const updatedDocuments = [...documents, ...newDocuments];
      setDocuments(updatedDocuments);
      onDocumentsChange(updatedDocuments);
      setIsUploading(false);

      toast({
        title: "Upload Concluído!",
        description: `${files.length} arquivo(s) foram adicionados.`,
      });
      
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (docId: string) => {
    const docToDelete = documents.find(d => d.id === docId);
    const updatedDocuments = documents.filter(d => d.id !== docId);
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
    toast({
        title: "Documento Excluído",
        description: `O arquivo "${docToDelete?.name}" foi removido.`,
        variant: "destructive"
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,application/pdf,.doc,.docx"
        />
        <Button onClick={handleUploadClick} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Enviando...' : 'Fazer Upload de Arquivos'}
        </Button>
         <p className="text-xs text-muted-foreground mt-2">
          Você pode enviar múltiplos arquivos (PDF, Imagens, Word).
        </p>
      </div>

      <div className="border rounded-lg">
        {documents.length > 0 ? (
          <ul className="divide-y">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                     <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                     </Button>
                   </a>
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Nenhum documento adicionado a este negócio ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
