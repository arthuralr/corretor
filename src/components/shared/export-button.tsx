
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  data: any[];
  fileName: string;
}

export function ExportButton({ data, fileName }: ExportButtonProps) {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={data.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Exportar
    </Button>
  );
}
