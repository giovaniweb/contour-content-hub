
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface ImportTabProps {
  id?: string;
  onCompleteImport?: (importedData: any) => void;
  onUploadComplete?: (videoId: string) => void;
  onCancel?: () => void;
  equipmentId?: string;
}

const ImportTab: React.FC<ImportTabProps> = ({ 
  id, 
  onCompleteImport,
  onUploadComplete,
  onCancel: propOnCancel,
  equipmentId
}) => {
  const { toast } = useToast();
  
  const handleUploadComplete = (videoId: string) => {
    if (onUploadComplete) {
      onUploadComplete(videoId);
    }
    
    if (onCompleteImport) {
      onCompleteImport({
        id: videoId,
        titulo: "Vídeo importado"
      });
    }
    
    toast({
      title: 'Vídeo importado',
      description: 'O vídeo foi importado com sucesso.',
    });
  };
  
  const handleCancel = () => {
    if (propOnCancel) {
      propOnCancel();
    }
    
    toast({
      title: 'Importação cancelada',
      description: 'A importação foi cancelada pelo usuário.',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Importar vídeo</h2>
      <p className="text-muted-foreground">
        Importe vídeos relacionados para este equipamento.
      </p>
      
      <div className="border rounded-lg p-6">
        {/* VideoUploader will be imported as a component later */}
        <div className="text-center p-8">
          <p>Sistema de upload de vídeos</p>
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={() => handleUploadComplete('mock-video-id')}>
              Simular Upload Completo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportTab;
