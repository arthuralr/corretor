
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ImportButtonProps {
  onImport: (data: any[]) => Promise<void>;
}

export function ImportButton({ onImport }: ImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImportClick = () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        await onImport(jsonData);
        
      } catch (error) {
        console.error("Error importing file:", error);
        toast({
          title: "Erro na Importação",
          description: "Ocorreu um erro ao processar o arquivo. Verifique o formato.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        setIsOpen(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Importar
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Dados</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx) ou CSV para importar. A primeira linha deve conter os cabeçalhos das colunas (ex: name, email, phone).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
             >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {file ? (
                        <p className="font-semibold text-primary">{file.name}</p>
                    ) : (
                        <>
                         <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
                         <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                         </p>
                        </>
                    )}
                </div>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls, .csv"
                />
            </label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleImportClick} disabled={isImporting || !file}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isImporting ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
