
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

export const DocumentsTab: React.FC = () => {
  return (
    <div className="text-center py-10">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Sem documentos</h3>
      <p className="text-muted-foreground mt-2">
        Não há documentos disponíveis para este equipamento.
      </p>
      <Button className="mt-4">
        Adicionar Documento
      </Button>
    </div>
  );
};
